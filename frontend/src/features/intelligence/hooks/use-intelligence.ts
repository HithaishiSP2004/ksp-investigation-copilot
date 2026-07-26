"use client";

import { useState, useCallback } from "react";
import { IntelligenceRecord, AiReviewStatus, ReviewEvent } from "../types";
import { IntelligenceService } from "../services/intelligence-service";
import { useAuth } from "@/features/auth/auth-context";

/**
 * useIntelligence hook — exposes intelligence pipeline to UI components.
 * Follows the established evidence hook pattern: async operations, error boundary,
 * loading state, and officer context from auth.
 */
export function useIntelligence() {
  const { user } = useAuth();
  const [intelligenceRecord, setIntelligenceRecord] =
    useState<IntelligenceRecord | null>(null);
  const [reviewEvents, setReviewEvents] = useState<ReviewEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Triggers the full intelligence analysis pipeline for a forensic asset.
   * Non-blocking — isAnalyzing flag guards the UI.
   */
  const analyzeEvidence = useCallback(
    async (evidenceId: number, mimeType: string, fileName: string) => {
      setIsAnalyzing(true);
      setError(null);
      try {
        const record = await IntelligenceService.analyzeEvidence(
          evidenceId,
          mimeType,
          fileName
        );
        setIntelligenceRecord(record);
        const events = await IntelligenceService.getReviewEvents(evidenceId);
        setReviewEvents(events);
      } catch (err: any) {
        console.error("analyzeEvidence error:", err);
        setError("Intelligence analysis failed. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  /**
   * Records an officer review decision on an extracted entity.
   * Audit event is written by the service before state is updated.
   */
  const reviewEntity = useCallback(
    async (entityId: string, newStatus: AiReviewStatus) => {
      if (!user || !intelligenceRecord) return;

      const officerName = user.firstName + " " + user.lastName;
      const updated = await IntelligenceService.reviewEntity(
        intelligenceRecord.evidenceId,
        entityId,
        newStatus,
        user.kgid,
        officerName
      );
      if (updated) {
        setIntelligenceRecord(updated);
        const events = await IntelligenceService.getReviewEvents(intelligenceRecord.evidenceId);
        setReviewEvents(events);
      }
    },
    [user, intelligenceRecord]
  );

  /**
   * Loads the latest cached intelligence record for an evidence asset.
   * Returns null if no analysis has been run yet.
   */
  const refreshRecord = useCallback(async (evidenceId: number) => {
    try {
      const record = await IntelligenceService.getLatestRecord(evidenceId);
      setIntelligenceRecord(record);
      const events = await IntelligenceService.getReviewEvents(evidenceId);
      setReviewEvents(events);
    } catch (err: any) {
      console.error("refreshRecord error:", err);
    }
  }, []);

  return {
    intelligenceRecord,
    reviewEvents,
    isAnalyzing,
    error,
    analyzeEvidence,
    reviewEntity,
    refreshRecord,
  };
}
