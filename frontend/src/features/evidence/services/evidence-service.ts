import { EvidenceRepository } from "../repositories/evidence-repository";
import { EvidenceMaster, CustodyEvent, EvidenceStatus, EvidenceType } from "../types";
import { SearchService } from "@/lib/services/search-service";
import { HashService } from "@/lib/services/hash-service";

export class EvidenceService {
  static async getEvidence(): Promise<EvidenceMaster[]> {
    return EvidenceRepository.getAll();
  }

  static async getEvidenceById(id: number): Promise<EvidenceMaster | null> {
    return EvidenceRepository.getById(id);
  }

  static async getEvidenceByCase(caseId: number): Promise<EvidenceMaster[]> {
    return EvidenceRepository.getByCase(caseId);
  }

  /**
   * Registers new forensic evidence and automatically writes custody log
   */
  static async registerEvidence(
    data: Omit<EvidenceMaster, "id" | "createdAt" | "updatedAt" | "evidenceNo" | "fileHash">,
    officerKgid: string,
    officerName: string
  ): Promise<EvidenceMaster> {
    // 1. Generate checksum checksum via HashService
    const fileHash = HashService.generateFileHash(data.fileName, data.fileSize);

    // 2. Create Repository Entry
    const record = await EvidenceRepository.create({
      ...data,
      fileHash
    });

    // 3. Write Custody log
    await EvidenceRepository.addCustodyEvent({
      evidenceId: record.id,
      officerName,
      officerKgid,
      action: "REGISTERED",
      previousState: "None",
      currentState: record.status,
      remarks: `Forensic asset registered and secured. Hash Checksum: ${fileHash.substring(0, 16)}...`
    });

    return record;
  }

  /**
   * Updates status of evidence and appends custody timeline log
   */
  static async updateStatus(
    id: number,
    newStatus: EvidenceStatus,
    officerKgid: string,
    officerName: string,
    remarks: string
  ): Promise<EvidenceMaster | null> {
    const original = await EvidenceRepository.getById(id);
    if (!original) return null;
    if (original.status === newStatus) return original;

    // 1. Modify repository record
    const updated = await EvidenceRepository.update(id, { status: newStatus });
    if (!updated) return null;

    // 2. Append Custody History
    await EvidenceRepository.addCustodyEvent({
      evidenceId: id,
      officerName,
      officerKgid,
      action: newStatus === "ARCHIVED" ? "ARCHIVED" : "STATUS_CHANGED",
      previousState: original.status,
      currentState: newStatus,
      remarks
    });

    return updated;
  }

  /**
   * Updates tags on forensic evidence and appends custody log
   */
  static async updateTags(
    id: number,
    tags: string[],
    officerKgid: string,
    officerName: string
  ): Promise<EvidenceMaster | null> {
    const original = await EvidenceRepository.getById(id);
    if (!original) return null;

    const updated = await EvidenceRepository.update(id, { tags });
    if (!updated) return null;

    await EvidenceRepository.addCustodyEvent({
      evidenceId: id,
      officerName,
      officerKgid,
      action: "TAGGED",
      previousState: original.tags.join(", "),
      currentState: tags.join(", "),
      remarks: "Updated evidence identification tags."
    });

    return updated;
  }

  /**
   * Retrieve Chain of Custody History
   */
  static async getCustodyHistory(evidenceId: number): Promise<CustodyEvent[]> {
    return EvidenceRepository.getCustodyHistory(evidenceId);
  }

  /**
   * Multi-field search mapping directly into existing SearchService helper
   */
  static async searchEvidence(
    query: string,
    filters?: {
      evidenceType?: EvidenceType;
      status?: EvidenceStatus;
      caseId?: number;
      collectorKgid?: string;
      date?: string;
    }
  ): Promise<EvidenceMaster[]> {
    const collections = await this.getEvidence();

    const searchFilters: Partial<Record<keyof EvidenceMaster, unknown>> = {};
    if (filters) {
      if (filters.evidenceType) searchFilters.evidenceType = filters.evidenceType;
      if (filters.status) searchFilters.status = filters.status;
      if (filters.caseId) searchFilters.caseId = filters.caseId;
      if (filters.collectorKgid) searchFilters.collectorKgid = filters.collectorKgid;
      if (filters.date) searchFilters.collectionDate = filters.date;
    }

    return SearchService.search<EvidenceMaster>(
      collections,
      query,
      ["evidenceNo", "crimeNo", "title", "description", "fileName", "tags", "ocrText", "aiLabels", "analysisSummary"],
      searchFilters
    );
  }
}
