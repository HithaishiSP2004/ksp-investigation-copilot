"use client";

import { useState, useEffect, useCallback } from "react";
import { EvidenceMaster, CustodyEvent, EvidenceStatus, EvidenceType } from "../types";
import { EvidenceService } from "../services/evidence-service";
import { useAuth } from "@/features/auth/auth-context";

export function useEvidence() {
  const { user } = useAuth();
  const [evidenceList, setEvidenceList] = useState<EvidenceMaster[]>([]);
  const [activeCustody, setActiveCustody] = useState<CustodyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidenceData = useCallback(async (query: string = "", filters?: {
    evidenceType?: EvidenceType;
    status?: EvidenceStatus;
    caseId?: number;
    collectorKgid?: string;
    date?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await EvidenceService.searchEvidence(query, filters);
      setEvidenceList(results);
    } catch {
      setError("Failed to fetch digital evidence vault.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial evidence list on mount
  useEffect(() => {
    queueMicrotask(() => {
      fetchEvidenceData();
    });
  }, [fetchEvidenceData]);

  // Fetch custody timeline events for selected item
  const fetchCustodyTimeline = useCallback(async (evidenceId: number) => {
    try {
      const logs = await EvidenceService.getCustodyHistory(evidenceId);
      setActiveCustody(logs);
    } catch {
      setError("Failed to load Chain of Custody records.");
    }
  }, []);

  const registerEvidence = async (
    data: Omit<EvidenceMaster, "id" | "createdAt" | "updatedAt" | "evidenceNo" | "fileHash">
  ): Promise<EvidenceMaster | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const officerName = `${user.firstName} ${user.lastName}`;
      const record = await EvidenceService.registerEvidence(data, user.kgid, officerName);
      await fetchEvidenceData();
      return record;
    } catch {
      setError("Failed to register evidence.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (
    id: number,
    newStatus: EvidenceStatus,
    remarks: string
  ): Promise<EvidenceMaster | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const officerName = `${user.firstName} ${user.lastName}`;
      const updated = await EvidenceService.updateStatus(id, newStatus, user.kgid, officerName, remarks);
      await fetchEvidenceData();
      await fetchCustodyTimeline(id); // Reload timeline
      return updated;
    } catch {
      setError("Failed to update custody status.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTags = async (id: number, tags: string[]): Promise<EvidenceMaster | null> => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);
    try {
      const officerName = `${user.firstName} ${user.lastName}`;
      const updated = await EvidenceService.updateTags(id, tags, user.kgid, officerName);
      await fetchEvidenceData();
      return updated;
    } catch {
      setError("Failed to modify tag attributes.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    evidenceList,
    activeCustody,
    isLoading,
    error,
    refresh: fetchEvidenceData,
    fetchCustodyTimeline,
    registerEvidence,
    updateStatus,
    updateTags
  };
}
