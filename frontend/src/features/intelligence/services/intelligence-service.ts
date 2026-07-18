import { OcrService } from "./ocr-service";
import { EntityExtractionService } from "./entity-extraction-service";
import { IntelligenceRepository } from "../repositories/intelligence-repository";
import { EvidenceRepository } from "@/features/evidence/repositories/evidence-repository";
import {
  IntelligenceRecord,
  AiReviewStatus,
  ReviewEvent,
} from "../types";

const PROVIDER = "KSP_INTELLIGENCE_ENGINE_v1";

/**
 * Intelligence Service — orchestrates the full analysis pipeline.
 * Steps:
 *   1. OCR extraction
 *   2. Entity extraction
 *   3. Relationship inference
 *   4. Build and persist IntelligenceRecord (versioned)
 *   5. Patch EvidenceMaster AI slots
 *
 * Review actions generate immutable ReviewEvent audit records
 * before mutating entity state.
 */
export const IntelligenceService = {
  /**
   * Runs the full intelligence pipeline for a forensic asset.
   * Always produces a new versioned record — never overwrites existing analyses.
   */
  async analyzeEvidence(
    evidenceId: number,
    mimeType: string,
    fileName: string
  ): Promise<IntelligenceRecord> {
    // Step 1: OCR
    const ocrResult = await OcrService.analyze(evidenceId, mimeType, fileName);

    // Step 2: Entity extraction
    const entities = await EntityExtractionService.extractEntities(ocrResult);

    // Step 3: Relationship inference (visualization-agnostic)
    const relationships = EntityExtractionService.buildRelationships(
      entities,
      evidenceId
    );

    // Step 4: Build analysis summary
    const personCount = entities.filter((e) => e.type === "PERSON").length;
    const vehicleCount = entities.filter((e) => e.type === "VEHICLE").length;
    const phoneCount = entities.filter((e) => e.type === "PHONE").length;
    const analysisSummary =
      "Intelligence analysis extracted " +
      entities.length +
      " entities from this forensic asset: " +
      personCount +
      " person(s), " +
      vehicleCount +
      " vehicle(s), " +
      phoneCount +
      " phone number(s), and " +
      relationships.length +
      " inferred relationship(s). All results require officer review before use in investigation.";

    const aiLabels = [
      entities.some((e) => e.type === "VEHICLE") ? "VEHICLE_INVOLVED" : null,
      entities.some((e) => e.type === "PERSON") ? "PERSON_IDENTIFIED" : null,
      entities.some((e) => e.type === "CURRENCY") ? "FINANCIAL_ELEMENT" : null,
      entities.some((e) => e.type === "ADDRESS") ? "LOCATION_LINKED" : null,
    ].filter((l): l is string => l !== null);

    const overallConfidence =
      entities.length > 0
        ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length
        : 0;

    // Step 5: Persist versioned record
    const record = IntelligenceRepository.save({
      id: "intel-" + evidenceId + "-" + Date.now(),
      evidenceId,
      analyzedAt: new Date().toISOString(),
      ocrResult,
      entities,
      relationships,
      analysisSummary,
      aiLabels,
      overallConfidence,
      provider: PROVIDER,
    });

    // Step 6: Patch EvidenceMaster AI slots (non-blocking best-effort)
    const entityMap: Record<string, string[]> = {};
    for (const e of entities) {
      if (!entityMap[e.type]) entityMap[e.type] = [];
      entityMap[e.type].push(e.value);
    }
    await EvidenceRepository.update(evidenceId, {
      ocrText: ocrResult.rawText,
      aiLabels,
      extractedEntities: entityMap,
      analysisSummary: record.analysisSummary,
    }).catch(() => {
      // Graceful degradation — intelligence record is already persisted
    });

    return record;
  },

  /**
   * Records an officer review decision on an extracted entity.
   * Writes an immutable ReviewEvent audit record FIRST,
   * then updates the entity status in the latest intelligence record.
   */
  async reviewEntity(
    evidenceId: number,
    entityId: string,
    newStatus: AiReviewStatus,
    officerKgid: string,
    officerName: string
  ): Promise<IntelligenceRecord | null> {
    const latest = IntelligenceRepository.getLatestByEvidenceId(evidenceId);
    if (!latest) return null;

    const entity = latest.entities.find((e) => e.id === entityId);
    if (!entity) return null;

    const actionMap: Record<AiReviewStatus, ReviewEvent["action"]> = {
      ACCEPTED: "ACCEPTED",
      REJECTED: "REJECTED",
      PENDING: "RESET_TO_PENDING",
    };

    // Write immutable audit record first
    const reviewEvent: ReviewEvent = {
      id: "rev-" + entityId + "-" + Date.now(),
      entityId,
      evidenceId,
      officerKgid,
      officerName,
      action: actionMap[newStatus],
      previousStatus: entity.reviewStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    };
    IntelligenceRepository.appendReviewEvent(reviewEvent);

    // Then mutate entity state in latest record
    return IntelligenceRepository.updateEntityReviewStatus(
      evidenceId,
      entityId,
      newStatus
    );
  },

  getLatestRecord(evidenceId: number): IntelligenceRecord | null {
    return IntelligenceRepository.getLatestByEvidenceId(evidenceId);
  },

  getReviewEvents(evidenceId: number) {
    return IntelligenceRepository.getReviewEvents(evidenceId);
  },
};
