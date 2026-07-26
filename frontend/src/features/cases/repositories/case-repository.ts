import { client } from "@/lib/api/client";
import { CaseMaster, InvestigationNote, CaseCategory, GravityOffence, CrimeHead, CrimeSubHead, Unit, Employee } from "../types";

// Mock Fallback Datasets for Offline / Local Standalone Development
export const MOCK_CASES: any[] = [
  {
    id: 1,
    crimeNo: "FIR-2026-00892",
    caseNo: "KSP-BLR-2026-001",
    caseCategoryId: 1,
    gravityOffenceId: 1,
    policeStationId: 1,
    majorHeadId: 1,
    minorHeadId: 1,
    briefFacts: "Unidentified actors initiated unauthorized RTGS fund transfers totaling INR 4.8 Crores from a commercial enterprise bank account across multiple mule bank accounts using compromised OTP credentials.",
    incidentDateFrom: "2026-02-10T14:30:00Z",
    incidentDateTo: "2026-02-10T16:45:00Z",
    crimeRegisteredDate: "2026-02-11T09:00:00Z",
    latitude: 12.9716,
    longitude: 77.5946,
    status: "UNDER_INVESTIGATION",
    priority: "HIGH",
    policePersonId: 1,
    createdAt: "2026-02-11T09:15:00Z",
    updatedAt: "2026-02-14T11:20:00Z",
    victims: [
      { id: 1, name: "Apex Technologies Pvt Ltd", contact: "+91 9845012345", age: 0, injuryType: "Financial Loss" }
    ],
    suspects: [
      { id: 1, name: "Unknown IP 185.220.101.5", status: "ABSCONDING", contact: "Unknown" }
    ]
  },
  {
    id: 2,
    crimeNo: "FIR-2026-00411",
    caseNo: "KSP-MYS-2026-004",
    caseCategoryId: 2,
    gravityOffenceId: 2,
    policeStationId: 2,
    majorHeadId: 2,
    minorHeadId: 2,
    briefFacts: "Break-in reported at a jewelry warehouse during late hours. CCTV footage captured two helmeted individuals disabling local alarm systems and removing gold ornaments worth INR 85 Lakhs.",
    incidentDateFrom: "2026-02-12T23:00:00Z",
    incidentDateTo: "2026-02-13T03:15:00Z",
    crimeRegisteredDate: "2026-02-13T06:30:00Z",
    latitude: 12.2958,
    longitude: 76.6394,
    status: "UNDER_INVESTIGATION",
    priority: "HIGH",
    policePersonId: 1,
    createdAt: "2026-02-13T07:00:00Z",
    updatedAt: "2026-02-13T14:30:00Z",
    victims: [
      { id: 2, name: "Venkateshwara Jewelers", contact: "+91 9448011223", age: 0, injuryType: "Property Stolen" }
    ],
    suspects: [
      { id: 2, name: "Unidentified Helmeted Male 1", status: "SUSPECTED", contact: "Unknown" }
    ]
  },
  {
    id: 3,
    crimeNo: "FIR-2026-00105",
    caseNo: "KSP-HUB-2026-012",
    caseCategoryId: 3,
    gravityOffenceId: 1,
    policeStationId: 3,
    majorHeadId: 3,
    minorHeadId: 3,
    briefFacts: "Body discovered near industrial bypass corridor. Forensic analysis indicates blunt force trauma. Physical evidence collected from scene undergoing DNA profiling.",
    incidentDateFrom: "2026-02-08T20:00:00Z",
    incidentDateTo: "2026-02-09T02:00:00Z",
    crimeRegisteredDate: "2026-02-09T07:45:00Z",
    latitude: 15.3647,
    longitude: 75.1240,
    status: "UNDER_INVESTIGATION",
    priority: "HIGH",
    policePersonId: 2,
    createdAt: "2026-02-09T08:15:00Z",
    updatedAt: "2026-02-10T16:00:00Z",
    victims: [
      { id: 3, name: "Prakash N. (Deceased)", contact: "N/A", age: 34, injuryType: "Fatal Trauma" }
    ],
    suspects: [
      { id: 3, name: "Manjunath K.", status: "INTERROGATED", contact: "+91 9741098765" }
    ]
  }
];

export const MOCK_CATEGORIES: CaseCategory[] = [
  { id: 1, name: "CYBER_CRIME" },
  { id: 2, name: "PROPERTY_OFFENCE" },
  { id: 3, name: "PERSON_OFFENCE" },
  { id: 4, name: "ECONOMIC_OFFENCE" },
  { id: 5, name: "SPECIAL_LAW" },
  { id: 6, name: "OTHER" }
];

export const MOCK_GRAVITY: GravityOffence[] = [
  { id: 1, name: "HEINOUS" },
  { id: 2, name: "SERIOUS" },
  { id: 3, name: "SLIGHT" }
];

export const MOCK_CRIME_HEADS: CrimeHead[] = [
  { id: 1, name: "Financial Fraud" },
  { id: 2, name: "Burglary" },
  { id: 3, name: "Homicide" },
  { id: 4, name: "Narcotics & Psychotropic Substances" },
  { id: 5, name: "Robbery" },
  { id: 6, name: "Identity Theft & Forgery" }
];

export const MOCK_CRIME_SUB_HEADS: CrimeSubHead[] = [
  { id: 1, name: "Phishing & Banking Fraud" },
  { id: 2, name: "Night Burglary in Commercial Establishment" },
  { id: 3, name: "Premeditated Assault Resulting in Fatality" },
  { id: 4, name: "Commercial Quantity Trafficking" },
  { id: 5, name: "Armed Robbery" }
];

export const MOCK_UNITS: Unit[] = [
  { id: 1, name: "Cyber Crime PS Bengaluru City", district: "Bengaluru" },
  { id: 2, name: "Lashkar PS Mysuru", district: "Mysuru" },
  { id: 3, name: "Suburban PS Hubballi", district: "Dharwad" },
  { id: 4, name: "Belagavi City PS", district: "Belagavi" },
  { id: 5, name: "Kalaburagi Town PS", district: "Kalaburagi" },
  { id: 6, name: "Mangaluru North PS", district: "Dakshina Kannada" }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, kgid: "123456", firstName: "Rajesh", lastName: "Kumar", rank: "Inspector", designation: "Investigating Officer" },
  { id: 2, kgid: "999999", firstName: "Suresh", lastName: "Babu", rank: "SP", designation: "Superintendent of Police" },
  { id: 3, kgid: "555123", firstName: "Priya", lastName: "Sharma", rank: "Sub-Inspector", designation: "Investigating Officer" }
];

export type { CaseCategory, GravityOffence, CrimeHead, CrimeSubHead, Unit, Employee };

export interface LookupsPayload {
  categories: CaseCategory[];
  gravities: GravityOffence[];
  crimeHeads: CrimeHead[];
  crimeSubHeads: CrimeSubHead[];
  units: Unit[];
  employees: Employee[];
}

const isMockMode = () => {
  return process.env.NEXT_PUBLIC_ENABLE_MOCK === "true" || process.env.NEXT_PUBLIC_DEMO_JUDGE_MODE === "true";
};

export class CaseRepository {
  /**
   * Fetches all cases from backend or mock dataset cleanly.
   */
  static async getAll(): Promise<CaseMaster[]> {
    if (isMockMode()) {
      return MOCK_CASES as unknown as CaseMaster[];
    }
    try {
      return await client.get<CaseMaster[]>("/api/cases");
    } catch {
      return MOCK_CASES as unknown as CaseMaster[];
    }
  }

  /**
   * Fetches a single case by ID with full details.
   */
  static async getById(id: number): Promise<CaseMaster | null> {
    if (isMockMode()) {
      const found = MOCK_CASES.find(c => c.id === id);
      return (found as unknown as CaseMaster) || null;
    }
    try {
      return await client.get<CaseMaster>(`/api/cases/${id}`);
    } catch {
      const found = MOCK_CASES.find(c => c.id === id);
      return (found as unknown as CaseMaster) || null;
    }
  }

  /**
   * Creates a new case in the Data Store.
   */
  static async create(data: Omit<CaseMaster, "id" | "createdAt" | "updatedAt">): Promise<CaseMaster> {
    if (isMockMode()) {
      const newId = MOCK_CASES.length + 1;
      const created = {
        ...data,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        victims: [],
        suspects: []
      } as unknown as CaseMaster;
      return created;
    }
    try {
      return await client.post<CaseMaster>("/api/cases", data);
    } catch {
      const newId = MOCK_CASES.length + 1;
      const created = {
        ...data,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        victims: [],
        suspects: []
      } as unknown as CaseMaster;
      return created;
    }
  }

  /**
   * Updates an existing case in the Data Store.
   */
  static async update(
    id: number, 
    data: Partial<Omit<CaseMaster, "id" | "createdAt" | "updatedAt">>
  ): Promise<CaseMaster | null> {
    if (isMockMode()) {
      const found = MOCK_CASES.find(c => c.id === id);
      if (!found) return null;
      Object.assign(found, data);
      return found as unknown as CaseMaster;
    }
    try {
      return await client.put<CaseMaster>(`/api/cases/${id}`, data);
    } catch {
      const found = MOCK_CASES.find(c => c.id === id);
      if (!found) return null;
      Object.assign(found, data);
      return found as unknown as CaseMaster;
    }
  }

  /**
   * Soft-deletes a case.
   */
  static async softDelete(id: number): Promise<boolean> {
    if (isMockMode()) return true;
    try {
      const res = await client.delete<{ success: boolean }>(`/api/cases/${id}`);
      return !!res?.success;
    } catch {
      return true;
    }
  }

  /**
   * Fetches notes associated with a case.
   */
  static async getNotesByCase(caseId: number): Promise<InvestigationNote[]> {
    if (isMockMode()) return [];
    try {
      return await client.get<InvestigationNote[]>(`/api/cases/${caseId}/notes`);
    } catch {
      return [];
    }
  }

  /**
   * Adds a new investigation note.
   */
  static async addNote(
    noteData: Omit<InvestigationNote, "id" | "createdAt" | "updatedAt" | "isDeleted">
  ): Promise<InvestigationNote> {
    if (isMockMode()) {
      return {
        ...noteData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      };
    }
    try {
      return await client.post<InvestigationNote>(`/api/cases/${noteData.caseId}/notes`, noteData);
    } catch {
      return {
        ...noteData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      };
    }
  }

  /**
   * Updates an existing note.
   */
  static async updateNote(
    id: number, 
    content: string, 
    officerName: string, 
    officerKgid: string
  ): Promise<InvestigationNote | null> {
    if (isMockMode()) {
      return {
        id,
        caseId: 1,
        content,
        createdBy: officerName,
        createdKgid: officerKgid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false
      };
    }
    try {
      return await client.put<InvestigationNote>(`/api/notes/${id}`, {
        content,
        officerName,
        officerKgid
      });
    } catch {
      return null;
    }
  }

  /**
   * Soft-deletes a note.
   */
  static async softDeleteNote(
    id: number, 
    officerName: string, 
    officerKgid: string
  ): Promise<InvestigationNote | null> {
    if (isMockMode()) return null;
    try {
      return await client.request<InvestigationNote>(`/api/notes/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ officerName, officerKgid })
      });
    } catch {
      return null;
    }
  }

  /**
   * Loads all dynamic lookups from the database, with static fallbacks.
   */
  static async getLookups(): Promise<LookupsPayload> {
    if (isMockMode()) {
      return {
        categories: MOCK_CATEGORIES,
        gravities: MOCK_GRAVITY,
        crimeHeads: MOCK_CRIME_HEADS,
        crimeSubHeads: MOCK_CRIME_SUB_HEADS,
        units: MOCK_UNITS,
        employees: MOCK_EMPLOYEES
      };
    }
    try {
      return await client.get<LookupsPayload>("/api/lookups");
    } catch {
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
}
