import { ExportProvider } from "../providers/export-provider";
import { MockExportProvider } from "../providers/mock-export-provider";

const provider: ExportProvider = new MockExportProvider();

export class ExportService {
  static async exportPdf(htmlContent: string): Promise<boolean> {
    return provider.exportPdf(htmlContent);
  }

  static async exportJson(data: unknown): Promise<string> {
    return provider.exportJson(data);
  }
}
