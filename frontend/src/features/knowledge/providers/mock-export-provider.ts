import { ExportProvider } from "./export-provider";

export class MockExportProvider implements ExportProvider {
  async exportPdf(htmlContent: string): Promise<boolean> {
    // Client-side window.print() will be used directly in components.
    // The provider interface is ready for serverless Catalyst SmartBrowz conversion.
    if (!htmlContent) return false;
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  }

  async exportJson(data: unknown): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return JSON.stringify(data, null, 2);
  }
}
