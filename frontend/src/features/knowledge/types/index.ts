export type NodeType = "CASE" | "PERSON" | "EVIDENCE" | "ENTITY";

export interface RelationshipNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface RelationshipLink {
  id: string;
  source: string; // ID of source node
  target: string; // ID of target node
  relationshipType: string;
  confidence: number;
  sourceIntelId?: string;
  supportingEvidenceNo?: string;
  reviewStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "VERIFIED";
  createdAt: string;
}

export type TimelineEventType = "CASE_EVENT" | "NOTE_EVENT" | "EVIDENCE_EVENT" | "REVIEW_EVENT";

export interface MergedTimelineEvent {
  id: string;
  timestamp: string;
  eventType: TimelineEventType;
  title: string;
  description: string;
  officerName: string;
  sourceRef?: string;
}

export interface BriefingData {
  caseId: number;
  crimeNo: string;
  status: string;
  progress: number;
  keyFindings: string;
  evidenceCount: number;
  pendingReviewCount: number;
  outstandingTasks: string[];
}

export interface ReportData {
  caseId: number;
  crimeNo: string;
  caseNo: string;
  title: string;
  summary: string;
  victims: { name: string; age: number; contact: string; role: string }[];
  suspects: { name: string; age: number; contact: string; status: string }[];
  evidence: { evidenceNo: string; title: string; type: string; status: string; hash: string }[];
  intelligenceSummary: string;
  timelineSummary: { time: string; event: string; officer: string }[];
  outstandingTasks: string[];
}
