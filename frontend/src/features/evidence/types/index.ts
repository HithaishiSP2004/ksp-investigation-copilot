export type EvidenceType = "PHYSICAL" | "DIGITAL" | "DOCUMENT" | "IMAGE" | "VIDEO" | "AUDIO" | "DEVICE";
export type EvidenceStatus = "SECURED" | "IN_TRANSIT" | "RELEASED" | "SUBMITTED_TO_COURT" | "ARCHIVED";

export interface EvidenceMaster {
  id: number;
  evidenceNo: string; // Human-readable (e.g., EV-2026-000123)
  caseId: number;     // Relates to CaseMaster
  crimeNo: string;    // FIR number
  title: string;
  description: string;
  evidenceType: EvidenceType;
  status: EvidenceStatus;
  collectionDate: string; // ISO string
  collectionTime: string; // e.g., "14:30"
  latitude: number;
  longitude: number;
  collectorName: string;
  collectorKgid: string;
  fileHash: string; // SHA-256 Checksum
  fileSize: number; // bytes
  mimeType: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];

  // --- Sprint 5 AI Readiness Containers ---
  ocrText?: string;
  aiLabels?: string[];
  extractedEntities?: Record<string, string[]>;
  analysisSummary?: string;
}

export interface CustodyEvent {
  id: number; // Event ID
  evidenceId: number; // Relates to EvidenceMaster id
  timestamp: string;
  officerName: string;
  officerKgid: string;
  action: "REGISTERED" | "TRANSFERRED" | "STATUS_CHANGED" | "TAGGED" | "ARCHIVED" | "AI_CLASSIFICATION";
  previousState: string;
  currentState: string;
  remarks: string;
}
