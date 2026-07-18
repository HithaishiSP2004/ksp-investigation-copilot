import { OcrResult } from "../types";

/**
 * Abstract contract for OCR providers.
 * Replacing this implementation (e.g., MockOcrProvider -> CatalystZiaOcrProvider)
 * is the ONLY change required to migrate to Catalyst Zia OCR.
 */
export interface OcrProvider {
  extractText(
    evidenceId: number,
    mimeType: string,
    fileName: string
  ): Promise<OcrResult>;
}
