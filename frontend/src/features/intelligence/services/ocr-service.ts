import { MockOcrProvider } from "../providers/mock-ocr-provider";
import { OcrResult } from "../types";

const provider = new MockOcrProvider();

/**
 * OCR Service — single responsibility: orchestrate OCR analysis.
 * Delegates execution to the injected OcrProvider.
 * UI and higher services never interact with the provider directly.
 */
export const OcrService = {
  async analyze(
    evidenceId: number,
    mimeType: string,
    fileName: string
  ): Promise<OcrResult> {
    return provider.extractText(evidenceId, mimeType, fileName);
  },
};
