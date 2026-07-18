import { IntelligenceRecord, ReviewEvent, AiReviewStatus } from "../types";

/**
 * In-memory intelligence repository.
 * Retains ALL versions of every intelligence record.
 * UI consumes only the latest version via getLatestByEvidenceId().
 *
 * Migration path: replace this module with Catalyst Data Store queries.
 * No service or UI changes required.
 */

// Versioned store: evidenceId -> ordered list of records (oldest first)
const recordStore = new Map<number, IntelligenceRecord[]>();

// Immutable review event store: evidenceId -> ordered list of events
const reviewEventStore = new Map<number, ReviewEvent[]>();

export const IntelligenceRepository = {
  /**
   * Returns the latest version of the intelligence record for an evidence asset.
   * Returns null if no analysis has been run yet.
   */
  getLatestByEvidenceId(evidenceId: number): IntelligenceRecord | null {
    const versions = recordStore.get(evidenceId);
    if (!versions || versions.length === 0) return null;
    return versions[versions.length - 1];
  },

  /**
   * Returns all historical versions for an evidence asset (oldest first).
   */
  getAllVersionsByEvidenceId(evidenceId: number): IntelligenceRecord[] {
    return recordStore.get(evidenceId) ?? [];
  },

  /**
   * Saves an intelligence record.
   * Automatically assigns the next version number.
   * Never overwrites existing versions.
   */
  save(record: Omit<IntelligenceRecord, "version">): IntelligenceRecord {
    const existing = recordStore.get(record.evidenceId) ?? [];
    const nextVersion = existing.length + 1;
    const versioned: IntelligenceRecord = { ...record, version: nextVersion };
    recordStore.set(record.evidenceId, [...existing, versioned]);
    return versioned;
  },

  /**
   * Updates the review status of a specific entity within the latest version.
   * Called only AFTER the review audit event has been appended.
   */
  updateEntityReviewStatus(
    evidenceId: number,
    entityId: string,
    newStatus: AiReviewStatus
  ): IntelligenceRecord | null {
    const versions = recordStore.get(evidenceId);
    if (!versions || versions.length === 0) return null;

    const latest = versions[versions.length - 1];
    const updatedRecord: IntelligenceRecord = {
      ...latest,
      entities: latest.entities.map((e) =>
        e.id === entityId ? { ...e, reviewStatus: newStatus } : e
      ),
    };
    versions[versions.length - 1] = updatedRecord;
    return updatedRecord;
  },

  /**
   * Appends a review audit event.
   * Immutable - no existing event can be modified or deleted.
   */
  appendReviewEvent(event: ReviewEvent): void {
    const existing = reviewEventStore.get(event.evidenceId) ?? [];
    reviewEventStore.set(event.evidenceId, [...existing, event]);
  },

  /**
   * Returns all review events for an evidence asset (oldest first).
   */
  getReviewEvents(evidenceId: number): ReviewEvent[] {
    return reviewEventStore.get(evidenceId) ?? [];
  },
};
