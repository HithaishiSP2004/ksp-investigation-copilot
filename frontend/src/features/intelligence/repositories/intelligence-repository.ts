import { client } from "@/lib/api/client";
import { IntelligenceRecord, ReviewEvent, AiReviewStatus } from "../types";

export const IntelligenceRepository = {
  /**
   * Returns the latest version of the intelligence record for an evidence asset.
   */
  async getLatestByEvidenceId(evidenceId: number): Promise<IntelligenceRecord | null> {
    return client.get<IntelligenceRecord | null>(`/api/evidence/${evidenceId}/intelligence`);
  },

  /**
   * Returns all historical versions (unsupported in UI currently but mapped to backend).
   */
  getAllVersionsByEvidenceId(evidenceId: number): IntelligenceRecord[] {
    // Falls back to array containing latest since Catalyst holds latest active
    return [];
  },

  /**
   * Saves an intelligence record (inserts header + entities + relationships).
   */
  async save(record: Omit<IntelligenceRecord, "version">): Promise<IntelligenceRecord> {
    const res = await client.post<{ id: string; version: number }>("/api/intelligence", record);
    return {
      ...record,
      version: res.version,
    } as IntelligenceRecord;
  },

  /**
   * Updates the review status of a specific entity.
   */
  async updateEntityReviewStatus(
    evidenceId: number,
    entityId: string,
    newStatus: AiReviewStatus
  ): Promise<IntelligenceRecord | null> {
    await client.put<any>(`/api/intelligence/${evidenceId}/entities/${entityId}`, {
      reviewStatus: newStatus,
    });
    // Recover the updated full record from datastore
    return this.getLatestByEvidenceId(evidenceId);
  },

  /**
   * Appends an immutable review audit event.
   */
  async appendReviewEvent(event: ReviewEvent): Promise<void> {
    await client.post<any>("/api/intelligence/review-events", event);
  },

  /**
   * Returns all review events for an evidence asset.
   */
  async getReviewEvents(evidenceId: number): Promise<ReviewEvent[]> {
    return client.get<ReviewEvent[]>(`/api/evidence/${evidenceId}/review-events`);
  },
};
