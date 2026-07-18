// Entity type classification supported by the extraction engine
export type EntityType =
  | "PERSON"
  | "PHONE"
  | "VEHICLE"
  | "ADDRESS"
  | "EMAIL"
  | "ORGANIZATION"
  | "DATE"
  | "TIME"
  | "CURRENCY"
  | "IDENTITY_NUMBER";

// Officer review decision on an AI-extracted entity
export type AiReviewStatus = "PENDING" | "ACCEPTED" | "REJECTED";

/**
 * A single entity extracted from evidence OCR text.
 * Carries full provenance for explainability and traceability.
 */
export interface ExtractedEntity {
  id: string;               // Stable UUID - never changes across re-analyses
  value: string;            // Raw extracted text value
  type: EntityType;
  confidence: number;       // 0.0 - 1.0
  sourceEvidenceId: number; // Links back to EvidenceMaster
  extractionMethod: string; // e.g. "REGEX_PATTERN" | "ZIA_NLP" | "QUICKML_LLM"
  extractedAt: string;      // ISO timestamp
  reviewStatus: AiReviewStatus;
}

/**
 * OCR analysis result from the OCR provider.
 */
export interface OcrResult {
  evidenceId: number;
  rawText: string;
  confidence: number;
  processedAt: string;
  provider: string; // e.g. "MOCK_OCR" | "CATALYST_ZIA_OCR"
}

/**
 * A directional relationship between two extracted entities.
 * Visualization-agnostic: contains only semantic data.
 * Graph rendering (Sprint 6) derives coordinates from this model.
 */
export interface EntityRelationship {
  id: string;
  fromEntityId: string;     // References ExtractedEntity.id
  toEntityId: string;       // References ExtractedEntity.id
  relationshipType: string; // e.g. "OWNS_VEHICLE" | "HAS_PHONE" | "RESIDES_AT"
  confidence: number;
  sourceEvidenceId: number;
}

/**
 * Immutable audit record of an officer review action.
 * Append-only - never edited or deleted.
 */
export interface ReviewEvent {
  id: string;
  entityId: string;         // References ExtractedEntity.id
  evidenceId: number;
  officerKgid: string;
  officerName: string;
  action: "ACCEPTED" | "REJECTED" | "RESET_TO_PENDING";
  previousStatus: AiReviewStatus;
  newStatus: AiReviewStatus;
  timestamp: string;
}

/**
 * A versioned intelligence enrichment record for a single evidence asset.
 * Re-analyses produce new versions; all versions are retained in the repository.
 * UI displays only the latest version.
 */
export interface IntelligenceRecord {
  id: string;
  evidenceId: number;
  version: number;          // Monotonically increasing - 1, 2, 3...
  analyzedAt: string;
  ocrResult: OcrResult;
  entities: ExtractedEntity[];
  relationships: EntityRelationship[];
  analysisSummary: string;
  aiLabels: string[];       // High-level classification labels
  overallConfidence: number;
  provider: string;         // Top-level provider attribution
}
