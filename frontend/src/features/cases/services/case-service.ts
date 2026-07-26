import { client } from "@/lib/api/client";
import { CaseRepository } from "../repositories/case-repository";
import { CaseMaster, CaseDetailsUI, CaseStatus, CasePriority, InvestigationNote } from "../types";

export interface DashboardMetrics {
  myActiveCount: number;
  totalActiveCount: number;
  pendingReviewCount: number;
  closedCount: number;
}

export interface ActivityLog {
  id: number;
  caseId: number;
  crimeNo: string;
  caseNo: string;
  officerName: string;
  action: "CREATED" | "UPDATED" | "STATUS_CHANGED" | "ARCHIVED" | "NOTE_ADDED" | "NOTE_EDITED" | "NOTE_DELETED";
  timestamp: string;
}

export class CaseService {
  /**
   * Centralized progress indicator mapper (Status -> Progress)
   */
  static calculateProgress(status: CaseStatus): number {
    const mapping: Record<CaseStatus, number> = {
      UNDER_INVESTIGATION: 30,
      CHARGE_SHEETED: 80,
      CLOSED: 100,
      ARCHIVED: 0
    };
    return mapping[status] || 0;
  }

  /**
   * Helper to write an activity log to the database.
   */
  private static async logActivity(
    caseId: number,
    crimeNo: string,
    caseNo: string,
    officerKgid: string,
    action: ActivityLog["action"]
  ): Promise<void> {
    try {
      const lookups = await CaseRepository.getLookups();
      const employee = lookups.employees.find(e => e.kgid === officerKgid);
      const officerName = employee ? `${employee.firstName} ${employee.lastName}` : "Officer";

      await client.post<ActivityLog>("/api/activity-logs", {
        caseId,
        crimeNo,
        caseNo,
        officerName,
        action
      });
    } catch (err: any) {
      console.warn("Failed to write activity log:", err.message);
    }
  }

  private static async hydrateCaseDetails(raw: any): Promise<CaseDetailsUI> {
    if (!raw) return raw;
    try {
      const lookups = await CaseRepository.getLookups();
      
      const category = lookups.categories.find(c => c.id === (raw.caseCategoryId || raw.categoryId));
      const gravity = lookups.gravities.find(g => g.id === (raw.gravityOffenceId || raw.gravityId));
      const majorHead = lookups.crimeHeads.find(h => h.id === raw.majorHeadId);
      const minorHead = lookups.crimeSubHeads.find(h => h.id === raw.minorHeadId);
      const unit = lookups.units.find(u => u.id === (raw.policeStationId || raw.unitId));
      const employee = lookups.employees.find(e => e.id === (raw.policePersonId || raw.employeeId));

      return {
        ...raw,
        incidentFromDate: raw.incidentFromDate || raw.incidentDateFrom || raw.crimeRegisteredDate || new Date().toISOString(),
        incidentToDate: raw.incidentToDate || raw.incidentDateTo || raw.crimeRegisteredDate || new Date().toISOString(),
        caseStatus: raw.caseStatus || raw.status || "UNDER_INVESTIGATION",
        stationName: raw.stationName || unit?.name || "Cyber Crime PS Bengaluru City",
        districtName: raw.districtName || unit?.district || "Bengaluru",
        officerName: raw.officerName || (employee ? `${employee.firstName} ${employee.lastName}` : "Rajesh Kumar"),
        officerRank: raw.officerRank || employee?.rank || "Inspector",
        categoryName: raw.categoryName || category?.name || "CYBER_CRIME",
        gravityName: raw.gravityName || gravity?.name || "HEINOUS",
        majorHeadName: raw.majorHeadName || majorHead?.name || "Financial Fraud",
        minorHeadName: raw.minorHeadName || minorHead?.name || "Phishing & Banking Fraud",
        victims: raw.victims || [],
        suspects: raw.suspects || []
      };
    } catch {
      return raw as CaseDetailsUI;
    }
  }

  static async getCases(): Promise<CaseDetailsUI[]> {
    const rawCases = await CaseRepository.getAll();
    return Promise.all((rawCases || []).map((r) => this.hydrateCaseDetails(r)));
  }

  static async getCaseById(id: number): Promise<CaseDetailsUI | null> {
    const rawCase = await CaseRepository.getById(id);
    if (!rawCase) return null;
    return this.hydrateCaseDetails(rawCase);
  }

  static async createCase(
    data: Omit<CaseMaster, "id" | "createdAt" | "updatedAt" | "caseNo" | "crimeNo">,
    officerKgid: string
  ): Promise<CaseDetailsUI> {
    const cases = await CaseRepository.getAll();
    const currentYear = new Date(data.crimeRegisteredDate).getFullYear();
    
    // Auto-generate Case Number (YYYY + 5-digit running serial)
    const yearCases = cases.filter(c => new Date(c.crimeRegisteredDate).getFullYear() === currentYear);
    const nextSerial = yearCases.length + 1;
    const caseNo = `${currentYear}${String(nextSerial).padStart(5, "0")}`;
    
    // Auto-generate Crime Number (1 digit Category [1=FIR] + 4 digit District ID [0443] + 4-digit Station ID + 4 digit Year + 5 digit Serial)
    const categoryPrefix = data.caseCategoryId || 1;
    const districtId = "0443";
    const unitId = String(data.policeStationId).padStart(4, "0");
    const crimeNo = `${categoryPrefix}${districtId}${unitId}${currentYear}${String(nextSerial).padStart(5, "0")}`;

    const created = await CaseRepository.create({
      ...data,
      caseNo,
      crimeNo
    });

    // Log Activity
    await this.logActivity(created.id, created.crimeNo, created.caseNo, officerKgid, "CREATED");

    // Re-fetch fully denormalized case details from backend
    const hydrated = await this.getCaseById(created.id);
    if (!hydrated) {
      throw new Error("Failed to load newly created case details.");
    }
    return hydrated;
  }

  static async updateCase(
    id: number,
    data: Partial<Omit<CaseMaster, "id" | "createdAt" | "updatedAt">>,
    officerKgid: string
  ): Promise<CaseDetailsUI | null> {
    const updated = await CaseRepository.update(id, data);
    if (!updated) return null;

    // Log Activity
    const action = data.caseStatus ? "STATUS_CHANGED" : "UPDATED";
    await this.logActivity(updated.id, updated.crimeNo, updated.caseNo, officerKgid, action);

    return this.getCaseById(id);
  }

  static async softDeleteCase(id: number, officerKgid: string): Promise<boolean> {
    const target = await this.getCaseById(id);
    if (!target) return false;

    const success = await CaseRepository.softDelete(id);
    if (success) {
      await this.logActivity(id, target.crimeNo, target.caseNo, officerKgid, "ARCHIVED");
    }
    return success;
  }

  static async searchCases(
    query: string,
    filters?: {
      status?: CaseStatus;
      priority?: CasePriority;
      officerId?: number;
    }
  ): Promise<CaseDetailsUI[]> {
    const cases = await this.getCases();
    
    // Perform filtering client-side for immediate responsive experience
    let filtered = [...cases];
    if (filters) {
      if (filters.status) filtered = filtered.filter(c => c.caseStatus === filters.status);
      if (filters.priority) filtered = filtered.filter(c => c.priority === filters.priority);
      if (filters.officerId) filtered = filtered.filter(c => c.policePersonId === filters.officerId);
    }

    if (!query) return filtered;

    const cleanQuery = query.toLowerCase().trim();
    return filtered.filter(c => 
      (c.crimeNo || "").toLowerCase().includes(cleanQuery) ||
      (c.caseNo || "").toLowerCase().includes(cleanQuery) ||
      (c.briefFacts || "").toLowerCase().includes(cleanQuery) ||
      (c.officerName || "").toLowerCase().includes(cleanQuery) ||
      (c.stationName || "").toLowerCase().includes(cleanQuery)
    );
  }

  static async getDashboardMetrics(officerKgid: string): Promise<DashboardMetrics> {
    const cases = await this.getCases();
    const lookups = await CaseRepository.getLookups();
    const employee = lookups.employees.find(e => e.kgid === officerKgid);

    const activeCases = cases.filter(c => c.caseStatus === "UNDER_INVESTIGATION");
    
    return {
      myActiveCount: activeCases.filter(c => c.policePersonId === employee?.id).length,
      totalActiveCount: activeCases.length,
      pendingReviewCount: cases.filter(c => c.caseStatus === "UNDER_INVESTIGATION" && c.priority === "HIGH").length,
      closedCount: cases.filter(c => c.caseStatus === "CLOSED").length
    };
  }

  static async getMyActiveCases(officerKgid: string): Promise<CaseDetailsUI[]> {
    const cases = await this.getCases();
    const lookups = await CaseRepository.getLookups();
    const employee = lookups.employees.find(e => e.kgid === officerKgid);
    if (!employee) return [];
    return cases.filter(c => c.policePersonId === employee.id && c.caseStatus === "UNDER_INVESTIGATION");
  }

  static async getHighPriorityAlerts(): Promise<CaseDetailsUI[]> {
    const cases = await this.getCases();
    return cases.filter(c => c.caseStatus === "UNDER_INVESTIGATION" && c.priority === "HIGH");
  }

  static async getRecentActivity(): Promise<ActivityLog[]> {
    try {
      return await client.get<ActivityLog[]>("/api/activity-logs");
    } catch {
      return [];
    }
  }

  static async getCaseActivity(caseId: number): Promise<ActivityLog[]> {
    try {
      const logs = await this.getRecentActivity();
      return logs
        .filter(log => log.caseId === caseId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch {
      return [];
    }
  }

  // --- Notes Operations with Audit Timeline triggers ---
  static async getNotesForCase(caseId: number): Promise<InvestigationNote[]> {
    return CaseRepository.getNotesByCase(caseId);
  }

  static async addNote(caseId: number, content: string, officerKgid: string): Promise<InvestigationNote | null> {
    const lookups = await CaseRepository.getLookups();
    const employee = lookups.employees.find(e => e.kgid === officerKgid);
    if (!employee) return null;

    const targetCase = await this.getCaseById(caseId);
    if (!targetCase) return null;

    const authorName = `${employee.firstName} ${employee.lastName}`;
    const note = await CaseRepository.addNote({
      caseId,
      content,
      createdBy: authorName,
      createdKgid: officerKgid
    });

    // Log Note Addition Activity
    await this.logActivity(caseId, targetCase.crimeNo, targetCase.caseNo, officerKgid, "NOTE_ADDED");

    return note;
  }

  static async updateNote(noteId: number, content: string, officerKgid: string): Promise<InvestigationNote | null> {
    const lookups = await CaseRepository.getLookups();
    const employee = lookups.employees.find(e => e.kgid === officerKgid);
    if (!employee) return null;

    const authorName = `${employee.firstName} ${employee.lastName}`;
    const note = await CaseRepository.updateNote(noteId, content, authorName, officerKgid);
    if (!note) return null;

    const targetCase = await this.getCaseById(note.caseId);
    if (targetCase) {
      await this.logActivity(note.caseId, targetCase.crimeNo, targetCase.caseNo, officerKgid, "NOTE_EDITED");
    }

    return note;
  }

  static async deleteNote(noteId: number, officerKgid: string): Promise<boolean> {
    const lookups = await CaseRepository.getLookups();
    const employee = lookups.employees.find(e => e.kgid === officerKgid);
    if (!employee) return false;

    const authorName = `${employee.firstName} ${employee.lastName}`;
    // softDeleteNote returns caseId
    const res: any = await CaseRepository.softDeleteNote(noteId, authorName, officerKgid);
    if (!res) return false;

    const targetCase = await this.getCaseById(res.caseId);
    if (targetCase) {
      await this.logActivity(res.caseId, targetCase.crimeNo, targetCase.caseNo, officerKgid, "NOTE_DELETED");
    }
    return true;
  }

  static async getLookupData() {
    const lookups = await CaseRepository.getLookups();
    return {
      categories: lookups.categories,
      gravities: lookups.gravities,
      crimeHeads: lookups.crimeHeads,
      crimeSubHeads: lookups.crimeSubHeads,
      units: lookups.units,
      employees: lookups.employees
    };
  }
}
