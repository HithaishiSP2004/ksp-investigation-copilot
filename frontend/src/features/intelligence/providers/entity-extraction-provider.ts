import { ExtractedEntity } from "../types";

/**
 * Abstract contract for entity extraction providers.
 * Replace MockEntityExtractionProvider with CatalystQuickMLProvider
 * for production LLM-based extraction without touching the service layer.
 */
export interface EntityExtractionProvider {
  extractEntities(
    text: string,
    sourceEvidenceId: number
  ): Promise<ExtractedEntity[]>;
}
