import { EvidenceMaster, CustodyEvent } from "../types";

// Seeded Forensic Assets databases
const mockEvidenceDb: EvidenceMaster[] = [
  {
    id: 1,
    evidenceNo: "EV-2026-000001",
    caseId: 1,
    crimeNo: "104430006202600001",
    title: "Beneficiary Wallet Account Statement",
    description: "PDF bank statement detailing money transfers routed from the complainant's savings account.",
    evidenceType: "DOCUMENT",
    status: "SECURED",
    collectionDate: "2026-03-12",
    collectionTime: "11:00",
    latitude: 12.9716,
    longitude: 77.5946,
    collectorName: "Ramesh Kumar",
    collectorKgid: "123456",
    fileHash: "a3a25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0021",
    fileSize: 450230,
    mimeType: "application/pdf",
    fileName: "wallet_statement_transfers.pdf",
    tags: ["phishing", "bank_statement", "mule_wallet"],
    createdAt: "2026-03-12T11:00:00Z",
    updatedAt: "2026-03-12T11:00:00Z"
  },
  {
    id: 2,
    evidenceNo: "EV-2026-000002",
    caseId: 2,
    crimeNo: "104430006202600002",
    title: "Intersection CCTV Footage Screenshot",
    description: "Image captured from YES intersection camera showing suspect silver sedan idling during the burglary timeframe.",
    evidenceType: "IMAGE",
    status: "SECURED",
    collectionDate: "2026-04-05",
    collectionTime: "10:15",
    latitude: 12.9922,
    longitude: 77.5712,
    collectorName: "Anil Gowda",
    collectorKgid: "112233",
    fileHash: "c5c25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0042",
    fileSize: 2048500,
    mimeType: "image/png",
    fileName: "cctv_suspect_vehicle.png",
    tags: ["burglary", "cctv_frame", "vehicle_plate"],
    createdAt: "2026-04-05T10:15:00Z",
    updatedAt: "2026-04-05T10:15:00Z"
  },
  {
    id: 3,
    evidenceNo: "EV-2026-000003",
    caseId: 3,
    crimeNo: "104430006202600003",
    title: "Suspect Mobile Device (OnePlus 11R)",
    description: "Recovered physical mobile handset containing fraudulent social media logins and spoofed contacts logs.",
    evidenceType: "DEVICE",
    status: "SUBMITTED_TO_COURT",
    collectionDate: "2026-05-19",
    collectionTime: "12:30",
    latitude: 12.9254,
    longitude: 77.5829,
    collectorName: "Ramesh Kumar",
    collectorKgid: "123456",
    fileHash: "f1f25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0063",
    fileSize: 0,
    mimeType: "application/octet-stream",
    fileName: "oneplus_handset_recovered",
    tags: ["identity_theft", "physical_device", "handset"],
    createdAt: "2026-05-19T12:30:00Z",
    updatedAt: "2026-05-20T16:00:00Z"
  }
];

// Seeded Custody Events database
const mockCustodyDb: CustodyEvent[] = [
  {
    id: 1,
    evidenceId: 1,
    timestamp: "2026-03-12T11:00:00Z",
    officerName: "Ramesh Kumar",
    officerKgid: "123456",
    action: "REGISTERED",
    previousState: "None",
    currentState: "SECURED",
    remarks: "Seized wallet transfer details from complainant at PS console."
  },
  {
    id: 2,
    evidenceId: 2,
    timestamp: "2026-04-05T10:15:00Z",
    officerName: "Anil Gowda",
    officerKgid: "112233",
    action: "REGISTERED",
    previousState: "None",
    currentState: "SECURED",
    remarks: "Screenshotted suspect sedan vehicle license plates from intersection CCTV files."
  },
  {
    id: 3,
    evidenceId: 3,
    timestamp: "2026-05-19T12:30:00Z",
    officerName: "Ramesh Kumar",
    officerKgid: "123456",
    action: "REGISTERED",
    previousState: "None",
    currentState: "SECURED",
    remarks: "Physical recovery of suspect OnePlus 11R mobile handset during search warrant execution."
  },
  {
    id: 4,
    evidenceId: 3,
    timestamp: "2026-05-20T16:00:00Z",
    officerName: "Ramesh Kumar",
    officerKgid: "123456",
    action: "STATUS_CHANGED",
    previousState: "SECURED",
    currentState: "SUBMITTED_TO_COURT",
    remarks: "Transferred OnePlus handset to Court Registry under formal request seal."
  }
];

export class EvidenceRepository {
  static async getAll(): Promise<EvidenceMaster[]> {
    return mockEvidenceDb.filter((ev) => ev.status !== "ARCHIVED");
  }

  static async getById(id: number): Promise<EvidenceMaster | null> {
    const record = mockEvidenceDb.find((ev) => ev.id === id);
    if (!record || record.status === "ARCHIVED") return null;
    return { ...record };
  }

  static async getByCase(caseId: number): Promise<EvidenceMaster[]> {
    return mockEvidenceDb.filter((ev) => ev.caseId === caseId && ev.status !== "ARCHIVED");
  }

  static async create(data: Omit<EvidenceMaster, "id" | "createdAt" | "updatedAt" | "evidenceNo">): Promise<EvidenceMaster> {
    const newId = mockEvidenceDb.length > 0 ? Math.max(...mockEvidenceDb.map((e) => e.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    // Generate human-readable Evidence Number: EV-YYYY-000000
    const currentYear = new Date().getFullYear();
    const runningCode = String(newId).padStart(6, "0");
    const evidenceNo = `EV-${currentYear}-${runningCode}`;

    const newRecord: EvidenceMaster = {
      ...data,
      id: newId,
      evidenceNo,
      createdAt: now,
      updatedAt: now
    };
    mockEvidenceDb.push(newRecord);
    return { ...newRecord };
  }

  static async update(id: number, data: Partial<Omit<EvidenceMaster, "id" | "createdAt" | "updatedAt" | "evidenceNo">>): Promise<EvidenceMaster | null> {
    const idx = mockEvidenceDb.findIndex((e) => e.id === id);
    if (idx === -1 || mockEvidenceDb[idx].status === "ARCHIVED") return null;

    const now = new Date().toISOString();
    const updated = {
      ...mockEvidenceDb[idx],
      ...data,
      updatedAt: now
    };
    mockEvidenceDb[idx] = updated;
    return { ...updated };
  }

  // --- Immutable Custody tracking (append-only) ---
  static async addCustodyEvent(eventData: Omit<CustodyEvent, "id" | "timestamp">): Promise<CustodyEvent> {
    const newId = mockCustodyDb.length > 0 ? Math.max(...mockCustodyDb.map((c) => c.id)) + 1 : 1;
    const timestamp = new Date().toISOString();
    const newEvent: CustodyEvent = {
      ...eventData,
      id: newId,
      timestamp
    };
    mockCustodyDb.push(newEvent);
    return { ...newEvent };
  }

  static async getCustodyHistory(evidenceId: number): Promise<CustodyEvent[]> {
    return mockCustodyDb
      .filter((c) => c.evidenceId === evidenceId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }
}
