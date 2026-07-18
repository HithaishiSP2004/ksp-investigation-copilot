import { 
  CaseRepository, 
  MOCK_CATEGORIES, 
  MOCK_GRAVITY, 
  MOCK_CRIME_HEADS, 
  MOCK_CRIME_SUB_HEADS, 
  MOCK_UNITS, 
  MOCK_EMPLOYEES 
} from "../repositories/case-repository";
import { CaseMaster, CaseDetailsUI, CaseStatus, CasePriority, InvestigationNote } from "../types";
import { SearchService } from "@/lib/services/search-service";

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

// Global immutable activity logger state (business actions trigger writes, no edits/CRUD allowed on logs)
const activityLogsDb: ActivityLog[] = [
  { id: 1, caseId: 1, crimeNo: "104430006202600001", caseNo: "202600001", officerName: "Ramesh Kumar", action: "CREATED", timestamp: "2026-03-12T10:30:00Z" },
  { id: 2, caseId: 2, crimeNo: "104430006202600002", caseNo: "202600002", officerName: "Anil Gowda", action: "CREATED", timestamp: "2026-04-05T09:15:00Z" },
  { id: 3, caseId: 3, crimeNo: "104430006202600003", caseNo: "202600003", officerName: "Ramesh Kumar", action: "CREATED", timestamp: "2026-05-18T16:00:00Z" },
  { id: 4, caseId: 3, crimeNo: "104430006202600003", caseNo: "202600003", officerName: "Ramesh Kumar", action: "STATUS_CHANGED", timestamp: "2026-05-20T14:30:00Z" }
];

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

  private static denormalize(caseMaster: CaseMaster): CaseDetailsUI {
    const category = MOCK_CATEGORIES.find(c => c.id === caseMaster.caseCategoryId)?.name || "FIR";
    const gravity = MOCK_GRAVITY.find(g => g.id === caseMaster.gravityOffenceId)?.name || "Non-Heinous";
    const majorHead = MOCK_CRIME_HEADS.find(m => m.id === caseMaster.crimeMajorHeadId)?.name || "Unknown";
    const minorHead = MOCK_CRIME_SUB_HEADS.find(m => m.id === caseMaster.crimeMinorHeadId)?.name || "Unknown";
    const unit = MOCK_UNITS.find(u => u.id === caseMaster.policeStationId);
    const employee = MOCK_EMPLOYEES.find(e => e.id === caseMaster.policePersonId);

    return {
      ...caseMaster,
      categoryName: category,
      gravityName: gravity,
      majorHeadName: majorHead,
      minorHeadName: minorHead,
      stationName: unit?.name || "Unknown Station",
      districtName: unit?.district || "Unknown District",
      officerName: employee ? `${employee.firstName} ${employee.lastName}` : "Unassigned",
      officerRank: employee?.rank || "Constable",
      victims: caseMaster.victims || [],
      suspects: caseMaster.suspects || []
    };
  }

  static async getCases(officerKgid?: string): Promise<CaseDetailsUI[]> {
    if (officerKgid) {
      // Future scope: filter by assigning officer
    }
    const rawCases = await CaseRepository.getAll();
    return rawCases.map(this.denormalize);
  }

  static async getCaseById(id: number): Promise<CaseDetailsUI | null> {
    const rawCase = await CaseRepository.getById(id);
    if (!rawCase) return null;
    return this.denormalize(rawCase);
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
    
    // Auto-generate Crime Number (1 digit Category [1=FIR] + 4 digit District ID [0443] + 4 digit Station ID [0062] + 4 digit Year + 5 digit Serial)
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
    const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);
    const newLogId = activityLogsDb.length + 1;
    activityLogsDb.unshift({
      id: newLogId,
      caseId: created.id,
      crimeNo: created.crimeNo,
      caseNo: created.caseNo,
      officerName: employee ? `${employee.firstName} ${employee.lastName}` : "Officer",
      action: "CREATED",
      timestamp: new Date().toISOString()
    });

    return this.denormalize(created);
  }

  static async updateCase(
    id: number,
    data: Partial<Omit<CaseMaster, "id" | "createdAt" | "updatedAt">>,
    officerKgid: string
  ): Promise<CaseDetailsUI | null> {
    const updated = await CaseRepository.update(id, data);
    if (!updated) return null;

    const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);
    const newLogId = activityLogsDb.length + 1;
    activityLogsDb.unshift({
      id: newLogId,
      caseId: updated.id,
      crimeNo: updated.crimeNo,
      caseNo: updated.caseNo,
      officerName: employee ? `${employee.firstName} ${employee.lastName}` : "Officer",
      action: data.caseStatus ? "STATUS_CHANGED" : "UPDATED",
      timestamp: new Date().toISOString()
    });

    return this.denormalize(updated);
  }

  static async softDeleteCase(id: number, officerKgid: string): Promise<boolean> {
    const target = await CaseRepository.getById(id);
    if (!target) return false;

    const success = await CaseRepository.softDelete(id);
    if (success) {
      const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);
      const newLogId = activityLogsDb.length + 1;
      activityLogsDb.unshift({
        id: newLogId,
        caseId: id,
        crimeNo: target.crimeNo,
        caseNo: target.caseNo,
        officerName: employee ? `${employee.firstName} ${employee.lastName}` : "Officer",
        action: "ARCHIVED",
        timestamp: new Date().toISOString()
      });
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
    
    // Map filters to compatible fields
    const searchFilters: Partial<Record<keyof CaseDetailsUI, unknown>> = {};
    if (filters) {
      if (filters.status) searchFilters.caseStatus = filters.status;
      if (filters.priority) searchFilters.priority = filters.priority;
      if (filters.officerId) searchFilters.policePersonId = filters.officerId;
    }

    return SearchService.search<CaseDetailsUI>(
      cases,
      query,
      ["crimeNo", "caseNo", "briefFacts", "officerName", "stationName"],
      searchFilters
    );
  }

  static async getDashboardMetrics(officerKgid: string): Promise<DashboardMetrics> {
    const cases = await this.getCases();
    const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);

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
    const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);
    if (!employee) return [];
    return cases.filter(c => c.policePersonId === employee.id && c.caseStatus === "UNDER_INVESTIGATION");
  }

  static async getHighPriorityAlerts(): Promise<CaseDetailsUI[]> {
    const cases = await this.getCases();
    return cases.filter(c => c.caseStatus === "UNDER_INVESTIGATION" && c.priority === "HIGH");
  }

  static getRecentActivity(): ActivityLog[] {
    return activityLogsDb.slice(0, 8);
  }

  static getCaseActivity(caseId: number): ActivityLog[] {
    // Return chronological logs for a specific case
    return activityLogsDb
      .filter(log => log.caseId === caseId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // --- Notes Operations with Audit Timeline triggers ---
  static async getNotesForCase(caseId: number): Promise<InvestigationNote[]> {
    return CaseRepository.getNotesByCase(caseId);
  }

  static async addNote(caseId: number, content: string, officerKgid: string): Promise<InvestigationNote | null> {
    const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);
    if (!employee) return null;

    const targetCase = await CaseRepository.getById(caseId);
    if (!targetCase) return null;

    const authorName = `${employee.firstName} ${employee.lastName}`;
    const note = await CaseRepository.addNote({
      caseId,
      content,
      createdBy: authorName,
      createdKgid: officerKgid
    });

    // Write Timeline log
    const newLogId = activityLogsDb.length + 1;
    activityLogsDb.unshift({
      id: newLogId,
      caseId,
      crimeNo: targetCase.crimeNo,
      caseNo: targetCase.caseNo,
      officerName: authorName,
      action: "NOTE_ADDED",
      timestamp: new Date().toISOString()
    });

    return note;
  }

  static async updateNote(noteId: number, content: string, officerKgid: string): Promise<InvestigationNote | null> {
    const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);
    if (!employee) return null;

    const authorName = `${employee.firstName} ${employee.lastName}`;
    const note = await CaseRepository.updateNote(noteId, content, authorName, officerKgid);
    if (!note) return null;

    const targetCase = await CaseRepository.getById(note.caseId);
    if (targetCase) {
      const newLogId = activityLogsDb.length + 1;
      activityLogsDb.unshift({
        id: newLogId,
        caseId: note.caseId,
        crimeNo: targetCase.crimeNo,
        caseNo: targetCase.caseNo,
        officerName: authorName,
        action: "NOTE_EDITED",
        timestamp: new Date().toISOString()
      });
    }

    return note;
  }

  static async deleteNote(noteId: number, officerKgid: string): Promise<boolean> {
    const employee = MOCK_EMPLOYEES.find(e => e.kgid === officerKgid);
    if (!employee) return false;

    const authorName = `${employee.firstName} ${employee.lastName}`;
    const note = await CaseRepository.softDeleteNote(noteId, authorName, officerKgid);
    if (!note) return false;

    const targetCase = await CaseRepository.getById(note.caseId);
    if (targetCase) {
      const newLogId = activityLogsDb.length + 1;
      activityLogsDb.unshift({
        id: newLogId,
        caseId: note.caseId,
        crimeNo: targetCase.crimeNo,
        caseNo: targetCase.caseNo,
        officerName: authorName,
        action: "NOTE_DELETED",
        timestamp: new Date().toISOString()
      });
    }
    return true;
  }

  static getLookupData() {
    return {
      categories: MOCK_CATEGORIES,
      gravities: MOCK_GRAVITY,
      crimeHeads: MOCK_CRIME_HEADS,
      crimeSubHeads: MOCK_CRIME_SUB_HEADS,
      units: MOCK_UNITS,
      employees: MOCK_EMPLOYEES
    };
  }
}
