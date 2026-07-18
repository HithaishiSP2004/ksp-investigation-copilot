import { EntityExtractionProvider } from "./entity-extraction-provider";
import { ExtractedEntity, EntityType } from "../types";

type PatternRule = {
  type: EntityType;
  pattern: RegExp;
  method: string;
  confidence: number;
};

/**
 * Regex + pattern-match mock entity extraction provider.
 * Extracts realistic Karnataka Police entities without LLM calls.
 * Replace with CatalystQuickMLProvider for production NLP extraction.
 */
export class MockEntityExtractionProvider implements EntityExtractionProvider {
  private static readonly METHOD = "REGEX_PATTERN";

  private static readonly RULES: PatternRule[] = [
    {
      type: "PHONE",
      pattern: /\b[6-9]\d{9}\b/g,
      method: "REGEX_PATTERN",
      confidence: 0.97,
    },
    {
      type: "VEHICLE",
      pattern: /\bKA-\d{2}-[A-Z]{1,2}-\d{4}\b/g,
      method: "REGEX_PATTERN",
      confidence: 0.99,
    },
    {
      type: "EMAIL",
      pattern: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
      method: "REGEX_PATTERN",
      confidence: 0.98,
    },
    {
      type: "IDENTITY_NUMBER",
      pattern: /\b\d{4}\s\d{4}\s\d{4}\b/g,
      method: "REGEX_PATTERN",
      confidence: 0.96,
    },
    {
      type: "CURRENCY",
      pattern: /Rs\.\s?\d{1,3}(?:,\d{3})*(?:\/-)?\b/g,
      method: "REGEX_PATTERN",
      confidence: 0.93,
    },
    {
      type: "DATE",
      pattern: /\b\d{1,2}-[A-Z][a-z]{2}-\d{4}\b/g,
      method: "REGEX_PATTERN",
      confidence: 0.91,
    },
    {
      type: "TIME",
      pattern: /\b\d{1,2}:\d{2}\s*(?:hrs|AM|PM)?\b/g,
      method: "REGEX_PATTERN",
      confidence: 0.89,
    },
  ];

  // Static name/org extractions for demo richness
  private static readonly NAME_PATTERN =
    /(?:Complainant|Accused|Subject|Officer):\s([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,3})/g;
  private static readonly ORG_PATTERN =
    /Organisation(?:\s*referenced)?:\s([A-Za-z\s]+?)(?:\.|$)/gm;
  private static readonly ADDR_PATTERN =
    /(?:Address|Location|Site):\s([A-Za-z0-9,.\s/-]+?)(?:\n|$)/gm;

  async extractEntities(
    text: string,
    sourceEvidenceId: number
  ): Promise<ExtractedEntity[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const entities: ExtractedEntity[] = [];
    const now = new Date().toISOString();
    let counter = 0;

    const makeId = () =>
      "ent-" + sourceEvidenceId + "-" + Date.now() + "-" + (++counter);


    // Apply regex rules
    for (const rule of MockEntityExtractionProvider.RULES) {
      rule.pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = rule.pattern.exec(text)) !== null) {
        entities.push({
          id: makeId(),
          value: match[0].trim(),
          type: rule.type,
          confidence: rule.confidence,
          sourceEvidenceId,
          extractionMethod: rule.method,
          extractedAt: now,
          reviewStatus: "PENDING",
        });
      }
    }

    // Person extraction
    MockEntityExtractionProvider.NAME_PATTERN.lastIndex = 0;
    let nameMatch: RegExpExecArray | null;
    while (
      (nameMatch = MockEntityExtractionProvider.NAME_PATTERN.exec(text)) !==
      null
    ) {
      entities.push({
        id: makeId(),
        value: nameMatch[1].trim(),
        type: "PERSON",
        confidence: 0.85,
        sourceEvidenceId,
        extractionMethod: MockEntityExtractionProvider.METHOD,
        extractedAt: now,
        reviewStatus: "PENDING",
      });
    }

    // Organisation extraction
    MockEntityExtractionProvider.ORG_PATTERN.lastIndex = 0;
    let orgMatch: RegExpExecArray | null;
    while (
      (orgMatch = MockEntityExtractionProvider.ORG_PATTERN.exec(text)) !== null
    ) {
      entities.push({
        id: makeId(),
        value: orgMatch[1].trim(),
        type: "ORGANIZATION",
        confidence: 0.82,
        sourceEvidenceId,
        extractionMethod: MockEntityExtractionProvider.METHOD,
        extractedAt: now,
        reviewStatus: "PENDING",
      });
    }

    // Address extraction
    MockEntityExtractionProvider.ADDR_PATTERN.lastIndex = 0;
    let addrMatch: RegExpExecArray | null;
    while (
      (addrMatch = MockEntityExtractionProvider.ADDR_PATTERN.exec(text)) !==
      null
    ) {
      entities.push({
        id: makeId(),
        value: addrMatch[1].trim(),
        type: "ADDRESS",
        confidence: 0.78,
        sourceEvidenceId,
        extractionMethod: MockEntityExtractionProvider.METHOD,
        extractedAt: now,
        reviewStatus: "PENDING",
      });
    }

    return entities;
  }
}
