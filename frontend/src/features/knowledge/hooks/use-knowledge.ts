"use client";

import { useState, useCallback } from "react";
import { KnowledgeService } from "../services/knowledge-service";
import { ReportService } from "../services/report-service";
import { MergedTimelineEvent, BriefingData, ReportData } from "../types";
import { RenderNode, RenderLink } from "../adapters/graph-adapter";

export function useKnowledge() {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [graphData, setGraphData] = useState<{ renderNodes: RenderNode[]; renderLinks: RenderLink[] } | null>(null);
  const [timeline, setTimeline] = useState<MergedTimelineEvent[]>([]);
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCaseIntelligence = useCallback(async (caseId: number) => {
    setIsLoading(true);
    setError(null);
    setSelectedCaseId(caseId);

    try {
      const [graph, briefingData, mergedTimeline, reportData] = await Promise.all([
        KnowledgeService.getGraph(caseId),
        KnowledgeService.getBriefing(caseId),
        KnowledgeService.getMergedTimeline(caseId),
        ReportService.generateReport(caseId),
      ]);

      setGraphData(graph);
      setBriefing(briefingData);
      setTimeline(mergedTimeline);
      setReport(reportData);
    } catch {
      setError("Failed to load intelligence details for the case.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportReportPdf = useCallback(async () => {
    if (!report) return false;
    return ReportService.exportPdf(report);
  }, [report]);

  const exportReportJson = useCallback(async () => {
    if (!report) return null;
    return ReportService.exportJson(report);
  }, [report]);

  return {
    selectedCaseId,
    graphData,
    timeline,
    briefing,
    report,
    isLoading,
    error,
    loadCaseIntelligence,
    exportReportPdf,
    exportReportJson,
  };
}
