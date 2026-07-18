export interface ExportProvider {
  exportPdf(htmlContent: string): Promise<boolean>;
  exportJson(data: unknown): Promise<string>;
}
