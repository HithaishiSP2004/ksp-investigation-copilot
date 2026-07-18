import { OcrProvider } from "./ocr-provider";
import { OcrResult } from "../types";

/**
 * Deterministic mock OCR provider.
 * Returns realistic Karnataka Police document text keyed by MIME type.
 * No network calls - safe for demo and offline environments.
 * Replace with CatalystZiaOcrProvider for production Catalyst deployment.
 */
export class MockOcrProvider implements OcrProvider {
  private static readonly PROVIDER_NAME = "MOCK_OCR_v1.0";

  private static readonly DOCUMENT_TEXT = 
    "FIRST INFORMATION REPORT\n" +
    "Police Station: Sadashivanagar, Bengaluru\n" +
    "FIR No.: 2026/CR/00418 | Date: 15-Jun-2026\n\n" +
    "Complainant: Ramesh Kumar Gowda, S/O Narayana Gowda\n" +
    "Age: 34 | Address: 12/A, 3rd Cross, Malleshwaram, Bengaluru - 560003\n" +
    "Phone: 9845012345\n\n" +
    "Accused: Suresh B | Vehicle: KA-01-MH-7834\n\n" +
    "Incident: At approximately 14:30 hrs on 14-Jun-2026, the complainant reported theft of\n" +
    "a laptop (estimated value Rs. 65,000/-) from his residence. The accused was identified\n" +
    "via CCTV footage. Identity Proof (Aadhaar): 9876 5432 1098\n" +
    "Email: rk.gowda@example.com | Organisation: InfoSys Technologies Ltd.\n\n" +
    "Investigating Officer: SI Prakash Naik (KGID: 784512)\n" +
    "Registered under IPC Section 379.";

  private static readonly IMAGE_TEXT = 
    "SCENE OF CRIME - SURVEILLANCE CAPTURE\n" +
    "Location: 12/A, 3rd Cross, Malleshwaram, Bengaluru\n" +
    "Date: 14-Jun-2026 | Time: 14:28 hrs\n" +
    "Camera ID: CAM-04-MALL-WEST\n" +
    "Subject identified: Male, approx. 30-35 yrs\n" +
    "Vehicle spotted near scene: KA-03-EF-2291\n" +
    "Contact traced: 8762309415";

  private static readonly AUDIO_TEXT = 
    "CALL INTERCEPT TRANSCRIPT\n" +
    "From: 9845012345 | To: 8762309415\n" +
    "Duration: 4 mins 12 secs | Date: 14-Jun-2026 17:45\n" +
    "Summary: Discussion regarding item handover at HSR Layout, Bengaluru.\n" +
    "Address mentioned: 47, 9th Main, HSR Layout, Sector 7\n" +
    "Amount discussed: Rs. 30,000/-\n" +
    "Organisation referenced: BK Associates";

  private static readonly DEFAULT_TEXT = 
    "FORENSIC ASSET LOG\n" +
    "Evidence Type: Physical Specimen\n" +
    "Collected by: HC Venkatesh Raju (KGID: 612347)\n" +
    "Collection Date: 15-Jun-2026 | Time: 10:15\n" +
    "Collection Site: Sadashivanagar Police Station Evidence Room\n" +
    "Condition: Sealed and intact. Chain-of-custody maintained.";

  async extractText(
    evidenceId: number,
    mimeType: string,
    fileName: string
  ): Promise<OcrResult> {
    if (!fileName) {
      // contract compliance check
    }
    // Simulate async processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let rawText: string;
    let confidence: number;

    if (mimeType.includes("pdf") || mimeType.includes("document")) {
      rawText = MockOcrProvider.DOCUMENT_TEXT;
      confidence = 0.94;
    } else if (mimeType.includes("image")) {
      rawText = MockOcrProvider.IMAGE_TEXT;
      confidence = 0.87;
    } else if (mimeType.includes("audio")) {
      rawText = MockOcrProvider.AUDIO_TEXT;
      confidence = 0.79;
    } else {
      rawText = MockOcrProvider.DEFAULT_TEXT;
      confidence = 0.72;
    }

    return {
      evidenceId,
      rawText,
      confidence,
      processedAt: new Date().toISOString(),
      provider: MockOcrProvider.PROVIDER_NAME,
    };
  }
}
