import { ReportRepository } from "../repositories/report-repository";
import { TemplateEngine } from "./template-engine";
import { ExportService } from "./export-service";
import { ReportData } from "../types";

export class ReportService {
  static async generateReport(caseId: number): Promise<ReportData | null> {
    return ReportRepository.getReportData(caseId);
  }

  static compileTemplate(data: ReportData): string {
    return TemplateEngine.compile(data, "default");
  }

  static async exportPdf(data: ReportData): Promise<boolean> {
    const htmlContent = this.compileTemplate(data);
    return ExportService.exportPdf(htmlContent);
  }

  static async exportJson(data: ReportData): Promise<string> {
    return ExportService.exportJson(data);
  }
}
