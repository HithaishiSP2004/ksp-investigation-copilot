import { RelationshipRepository } from "../repositories/relationship-repository";
import { SimpleSvgGraphAdapter } from "../adapters/graph-adapter";
import { MergedTimelineEvent, BriefingData } from "../types";
import { CaseService } from "@/features/cases/services/case-service";
import { EvidenceService } from "@/features/evidence/services/evidence-service";
import { IntelligenceService } from "@/features/intelligence/services/intelligence-service";

export class KnowledgeService {
  private static readonly adapter = new SimpleSvgGraphAdapter();

  /**
   * Fetches raw graph data from repository and transforms it into SVG coordinates via adapter
   */
  static async getGraph(caseId: number, width: number = 800, height: number = 500) {
    const raw = await RelationshipRepository.getGraphData(caseId);
    return this.adapter.transform(raw.nodes, raw.links, width, height);
  }

  /**
   * Assembles a concise, 1-minute officer briefing
   */
  static async getBriefing(caseId: number): Promise<BriefingData | null> {
    const caseDetails = await CaseService.getCaseById(caseId);
    if (!caseDetails) return null;

    const evidenceList = await EvidenceService.getEvidenceByCase(caseId);
    let pendingReviews = 0;

    evidenceList.forEach((ev) => {
      const intel = IntelligenceService.getLatestRecord(ev.id);
      if (intel) {
        pendingReviews += intel.entities.filter((e) => e.reviewStatus === "PENDING").length;
      }
    });

    const notes = await CaseService.getNotesForCase(caseId);
    const outstandingTasks = notes
      .filter(n => n.content.toLowerCase().includes("todo") || n.content.toLowerCase().includes("pending") || n.content.toLowerCase().includes("task"))
      .map(n => n.content);

    const progress = CaseService.calculateProgress(caseDetails.caseStatus);

    return {
      caseId: caseDetails.id,
      crimeNo: caseDetails.crimeNo,
      status: caseDetails.caseStatus,
      progress,
      keyFindings: caseDetails.briefFacts.substring(0, 120) + "...",
      evidenceCount: evidenceList.length,
      pendingReviewCount: pendingReviews,
      outstandingTasks: outstandingTasks.length > 0 ? outstandingTasks : ["No outstanding tasks recorded."],
    };
  }

  /**
   * Merges and sorts all Case Logs, Note Logs, Custody timelines, and AI Review events
   * chronologically. All timeline sorting happens in this service.
   */
  static async getMergedTimeline(caseId: number): Promise<MergedTimelineEvent[]> {
    const events: MergedTimelineEvent[] = [];

    // 1. Fetch Case activity logs
    const caseActivity = CaseService.getCaseActivity(caseId);
    caseActivity.forEach((log) => {
      let actionLabel = "Investigation Activity";
      if (log.action === "CREATED") actionLabel = "FIR Case File Created";
      else if (log.action === "STATUS_CHANGED") actionLabel = "Case Status Updated";
      else if (log.action === "NOTE_ADDED") actionLabel = "Officer Investigation Note Appended";

      events.push({
        id: "case-log-" + log.id,
        timestamp: log.timestamp,
        eventType: "CASE_EVENT",
        title: actionLabel,
        description: `Logged action: ${log.action} for Case ${log.caseNo}.`,
        officerName: log.officerName,
      });
    });

    // 2. Fetch Evidence Custody logs
    const evidenceList = await EvidenceService.getEvidenceByCase(caseId);
    for (const ev of evidenceList) {
      const custodyLogs = await EvidenceService.getCustodyHistory(ev.id);
      custodyLogs.forEach((log) => {
        events.push({
          id: "custody-log-" + log.id,
          timestamp: log.timestamp,
          eventType: "EVIDENCE_EVENT",
          title: `Evidence ${log.action}`,
          description: `Evidence No: ${ev.evidenceNo} (${ev.title}) transitioned state: ${log.previousState} ➔ ${log.currentState}. Remarks: ${log.remarks}`,
          officerName: log.officerName,
          sourceRef: ev.evidenceNo,
        });
      });

      // 3. Fetch Intelligence Review audit logs
      const reviewLogs = IntelligenceService.getReviewEvents(ev.id);
      reviewLogs.forEach((log) => {
        events.push({
          id: "review-log-" + log.id,
          timestamp: log.timestamp,
          eventType: "REVIEW_EVENT",
          title: "AI Suggestion Reviewed",
          description: `Entity suggestion approved status: ${log.previousStatus} ➔ ${log.newStatus} (Action: ${log.action}).`,
          officerName: log.officerName,
          sourceRef: ev.evidenceNo,
        });
      });
    }

    // Sort chronologically (oldest to newest)
    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}
