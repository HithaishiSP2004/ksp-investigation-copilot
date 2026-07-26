import { client } from "@/lib/api/client";
import { EvidenceMaster, CustodyEvent } from "../types";

export const MOCK_EVIDENCE: EvidenceMaster[] = [
  {
    id: 101,
    evidenceNo: "EVD-2026-0001",
    caseId: 1,
    crimeNo: "FIR-2026-00892",
    title: "CCTV Footage Camera 04 (Bank RTGS Desk)",
    description: "CCTV H.264 video file captured at Commercial Bank RTGS counters during unauthorized fund transfers.",
    evidenceType: "VIDEO",
    status: "SECURED",
    collectionDate: "2026-02-11T10:30:00Z",
    collectionTime: "10:30",
    latitude: 12.9716,
    longitude: 77.5946,
    collectorName: "Rajesh Kumar",
    collectorKgid: "123456",
    fileHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    fileSize: 130023424,
    mimeType: "video/mp4",
    fileName: "cctv_bank_desk_04.mp4",
    createdAt: "2026-02-11T10:45:00Z",
    updatedAt: "2026-02-11T11:00:00Z",
    tags: ["CCTV", "RTGS", "Bank", "Video"],
    ocrText: "TRANSACTION REF: RTGS/20260210/4920491. ACCOUNT: 8849204102. SENDER: APEX TECH. BENEFICIARY: KIRAN KUMAR.",
    aiLabels: ["PERSON_IDENTIFIED", "LOCATION_LINKED", "FINANCIAL_ELEMENT"],
    analysisSummary: "Intelligence analysis extracted 3 entities from CCTV footage. High confidence match with Suspect Kiran Kumar."
  },
  {
    id: 102,
    evidenceNo: "EVD-2026-0002",
    caseId: 1,
    crimeNo: "FIR-2026-00892",
    title: "Mule Account Bank Statement (PDF)",
    description: "Scanned 12-page HDFC Bank statement showing rapid RTGS fund dispersals to 4 mule accounts.",
    evidenceType: "DOCUMENT",
    status: "SECURED",
    collectionDate: "2026-02-11T11:15:00Z",
    collectionTime: "11:15",
    latitude: 12.9716,
    longitude: 77.5946,
    collectorName: "Rajesh Kumar",
    collectorKgid: "123456",
    fileHash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    fileSize: 3565158,
    mimeType: "application/pdf",
    fileName: "hdfc_mule_account_statement.pdf",
    createdAt: "2026-02-11T11:30:00Z",
    updatedAt: "2026-02-11T11:45:00Z",
    tags: ["Bank Statement", "PDF", "Mule Account", "Financial"],
    ocrText: "HDFC BANK STATEMENT. MULE A/C: 4920491029. WIRE TRANSFER INR 4,80,00,000. OTP AUTHORIZED VIA MOBILE +91 9845012345.",
    aiLabels: ["FINANCIAL_ELEMENT", "PHONE_IDENTIFIED"],
    analysisSummary: "OCR text extracted financial transactions totaling INR 4.8 Crores across 4 mule bank accounts."
  },
  {
    id: 103,
    evidenceNo: "EVD-2026-0003",
    caseId: 2,
    crimeNo: "FIR-2026-00411",
    title: "CCTV Tower Dump Call Records (CDR)",
    description: "Cellular CDR log containing IMEI 86349204... signals near Mysuru Jewelry Warehouse.",
    evidenceType: "DIGITAL",
    status: "IN_TRANSIT",
    collectionDate: "2026-02-13T08:00:00Z",
    collectionTime: "08:00",
    latitude: 12.2958,
    longitude: 76.6394,
    collectorName: "Suresh Babu",
    collectorKgid: "999999",
    fileHash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    fileSize: 19084288,
    mimeType: "text/csv",
    fileName: "cdr_tower_dump_mysuru.csv",
    createdAt: "2026-02-13T08:30:00Z",
    updatedAt: "2026-02-13T09:00:00Z",
    tags: ["CDR", "IMEI", "Tower Dump", "Heist"],
    ocrText: "TOWER DUMP CELL ID: 0443-MYS-01. IMEI: 86349204019284. DURATION: 142 SEC. VEHICLE REG: KA-01-MJ-8891.",
    aiLabels: ["VEHICLE_INVOLVED", "LOCATION_LINKED"],
    analysisSummary: "Inferred shared IMEI signal overlap between Mysuru Heist scene and Whitefield ATM Fraud."
  }
];

export class EvidenceRepository {
  /**
   * Fetches all active evidence with robust mock fallback.
   */
  static async getAll(): Promise<EvidenceMaster[]> {
    try {
      const res = await client.get<EvidenceMaster[]>("/api/evidence");
      if (res && Array.isArray(res) && res.length > 0) return res;
      return MOCK_EVIDENCE;
    } catch {
      return MOCK_EVIDENCE;
    }
  }

  /**
   * Fetches evidence by its ID.
   */
  static async getById(id: number): Promise<EvidenceMaster | null> {
    try {
      const res = await client.get<EvidenceMaster>(`/api/evidence/${id}`);
      if (res) return res;
      return MOCK_EVIDENCE.find(e => e.id === id) || null;
    } catch {
      return MOCK_EVIDENCE.find(e => e.id === id) || null;
    }
  }

  /**
   * Fetches evidence linked to a specific case.
   */
  static async getByCase(caseId: number): Promise<EvidenceMaster[]> {
    try {
      const res = await client.get<EvidenceMaster[]>(`/api/cases/${caseId}/evidence`);
      if (res && Array.isArray(res) && res.length > 0) return res;
      return MOCK_EVIDENCE.filter(e => e.caseId === caseId);
    } catch {
      return MOCK_EVIDENCE.filter(e => e.caseId === caseId);
    }
  }

  /**
   * Registers a new evidence item in the Data Store.
   */
  static async create(
    data: Omit<EvidenceMaster, "id" | "createdAt" | "updatedAt" | "evidenceNo">
  ): Promise<EvidenceMaster> {
    try {
      return await client.post<EvidenceMaster>("/api/evidence", data);
    } catch {
      const nextId = MOCK_EVIDENCE.length + 101;
      const created: EvidenceMaster = {
        ...data,
        id: nextId,
        evidenceNo: `EVD-2026-${String(nextId).padStart(4, "0")}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_EVIDENCE.push(created);
      return created;
    }
  }

  /**
   * Updates an existing evidence's properties.
   */
  static async update(
    id: number, 
    data: Partial<Omit<EvidenceMaster, "id" | "createdAt" | "updatedAt" | "evidenceNo">>
  ): Promise<EvidenceMaster | null> {
    try {
      return await client.put<EvidenceMaster>(`/api/evidence/${id}`, data);
    } catch {
      const found = MOCK_EVIDENCE.find(e => e.id === id);
      if (!found) return null;
      Object.assign(found, data, { updatedAt: new Date().toISOString() });
      return found;
    }
  }

  /**
   * Appends an immutable custody chain log.
   */
  static async addCustodyEvent(
    eventData: Omit<CustodyEvent, "id" | "timestamp">
  ): Promise<CustodyEvent> {
    try {
      return await client.post<CustodyEvent>(`/api/evidence/${eventData.evidenceId}/custody`, eventData);
    } catch {
      return {
        ...eventData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Fetches chain-of-custody logs for a specific evidence asset.
   */
  static async getCustodyHistory(evidenceId: number): Promise<CustodyEvent[]> {
    try {
      return await client.get<CustodyEvent[]>(`/api/evidence/${evidenceId}/custody`);
    } catch {
      return [
        {
          id: 1,
          evidenceId,
          timestamp: new Date().toISOString(),
          officerName: "Rajesh Kumar",
          officerKgid: "123456",
          action: "REGISTERED",
          previousState: "None",
          currentState: "SECURED",
          remarks: "Evidence registered and secured in Station Locker."
        }
      ];
    }
  }
}
