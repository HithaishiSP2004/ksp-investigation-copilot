import { ReportData } from "../types";
import { CaseService } from "@/features/cases/services/case-service";
import { EvidenceService } from "@/features/evidence/services/evidence-service";
import { IntelligenceService } from "@/features/intelligence/services/intelligence-service";

export class ReportRepository {
  static async getReportData(caseId: number): Promise<ReportData | null> {
    const caseDetails = await CaseService.getCaseById(caseId);
    if (!caseDetails) return null;

    const evidenceList = await EvidenceService.getEvidenceByCase(caseId);
    const intelligenceSummaryList: string[] = [];
    
    // Gather outstanding tasks
    const notes = await CaseService.getNotesForCase(caseId);
    const outstandingTasks = notes
      .filter(n => n.content.toLowerCase().includes("todo") || n.content.toLowerCase().includes("pending") || n.content.toLowerCase().includes("task"))
      .map(n => n.content);

    // Aggregate summaries
    evidenceList.forEach(ev => {
      const intel = IntelligenceService.getLatestRecord(ev.id);
      if (intel && intel.analysisSummary) {
        intelligenceSummaryList.push(ev.evidenceNo + ": " + intel.analysisSummary);
      }
    });

    const caseActivity = CaseService.getCaseActivity(caseId);
    const timelineSummary = caseActivity.map(log => ({
      time: new Date(log.timestamp).toLocaleString(),
      event: log.action + " - Case log recorded",
      officer: log.officerName
    }));

    return {
      caseId: caseDetails.id,
      crimeNo: caseDetails.crimeNo,
      caseNo: caseDetails.caseNo,
      title: caseDetails.categoryName + " - " + caseDetails.crimeNo,
      summary: caseDetails.briefFacts,
      victims: (caseDetails.victims || []).map(v => ({
        name: v.name,
        age: v.age,
        contact: v.contact || "",
        role: "Victim/Complainant"
      })),
      suspects: (caseDetails.suspects || []).map(s => ({
        name: s.name,
        age: s.age,
        contact: s.contact || "",
        status: s.status
      })),
      evidence: evidenceList.map(ev => ({
        evidenceNo: ev.evidenceNo,
        title: ev.title,
        type: ev.evidenceType,
        status: ev.status,
        hash: ev.fileHash
      })),
      intelligenceSummary: intelligenceSummaryList.length > 0 
        ? intelligenceSummaryList.join("\n") 
        : "No AI Intelligence analysis run for case evidence yet.",
      timelineSummary,
      outstandingTasks: outstandingTasks.length > 0 ? outstandingTasks : ["No pending tasks recorded in notes."]
    };
  }
}
