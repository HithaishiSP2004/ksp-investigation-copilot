import { MockEntityExtractionProvider } from "../providers/mock-entity-extraction-provider";
import {
  ExtractedEntity,
  EntityRelationship,
  EntityType,
  OcrResult,
} from "../types";

const provider = new MockEntityExtractionProvider();

// Relationship inference map: when both types co-occur in same evidence
const RELATIONSHIP_RULES: Array<{
  from: EntityType;
  to: EntityType;
  type: string;
}> = [
  { from: "PERSON", to: "VEHICLE", type: "ASSOCIATED_VEHICLE" },
  { from: "PERSON", to: "PHONE", type: "HAS_CONTACT" },
  { from: "PERSON", to: "ADDRESS", type: "RESIDES_AT" },
  { from: "PERSON", to: "ORGANIZATION", type: "MEMBER_OF" },
  { from: "PERSON", to: "IDENTITY_NUMBER", type: "IDENTIFIED_BY" },
  { from: "VEHICLE", to: "ADDRESS", type: "SPOTTED_AT" },
  { from: "PHONE", to: "ADDRESS", type: "USED_AT" },
];

/**
 * Entity Extraction Service — delegates extraction to provider,
 * then builds visualization-agnostic relationship structures.
 */
export const EntityExtractionService = {
  async extractEntities(
    ocrResult: OcrResult
  ): Promise<ExtractedEntity[]> {
    return provider.extractEntities(ocrResult.rawText, ocrResult.evidenceId);
  },

  /**
   * Infers relationships between co-occurring entity types.
   * Produces visualization-agnostic EntityRelationship structures.
   * Sprint 6 graph layer reads this data without changes to this service.
   */
  buildRelationships(
    entities: ExtractedEntity[],
    sourceEvidenceId: number
  ): EntityRelationship[] {
    const relationships: EntityRelationship[] = [];
    let counter = 0;

    for (const rule of RELATIONSHIP_RULES) {
      const fromEntities = entities.filter((e) => e.type === rule.from);
      const toEntities = entities.filter((e) => e.type === rule.to);

      for (const from of fromEntities) {
        for (const to of toEntities) {
          relationships.push({
            id: "rel-" + sourceEvidenceId + "-" + (++counter),
            fromEntityId: from.id,
            toEntityId: to.id,
            relationshipType: rule.type,
            confidence: Math.min(from.confidence, to.confidence) * 0.9,
            sourceEvidenceId,
          });
        }
      }
    }

    return relationships;
  },
};
