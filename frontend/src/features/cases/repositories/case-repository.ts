import { 
  CaseMaster, 
  CaseCategory, 
  GravityOffence, 
  CrimeHead, 
  CrimeSubHead, 
  Unit, 
  Employee,
  Victim,
  Suspect,
  InvestigationNote
} from "../types";

// Static Lookups conforming to ER Diagram
export const MOCK_CATEGORIES: CaseCategory[] = [
  { id: 1, name: "FIR" },
  { id: 2, name: "UDR" },
  { id: 3, name: "Zero FIR" },
  { id: 4, name: "PAR" }
];

export const MOCK_GRAVITY: GravityOffence[] = [
  { id: 1, name: "Heinous" },
  { id: 2, name: "Non-Heinous" }
];

export const MOCK_CRIME_HEADS: CrimeHead[] = [
  { id: 10, name: "Crimes Against Property" },
  { id: 20, name: "Cyber Crime" },
  { id: 30, name: "Crimes Against Body" },
  { id: 40, name: "Economic Offenses" }
];

export const MOCK_CRIME_SUB_HEADS: CrimeSubHead[] = [
  { id: 101, name: "House Break-in & Burglary" },
  { id: 102, name: "Armed Robbery" },
  { id: 201, name: "Identity Theft & Phishing" },
  { id: 202, name: "Online Financial Fraud" },
  { id: 301, name: "Murder" },
  { id: 302, name: "Grievous Hurt" }
];

export const MOCK_UNITS: Unit[] = [
  { id: 6, name: "Bengaluru Cyber Crime PS", district: "Bengaluru City" },
  { id: 7, name: "Malleshwaram Police Station", district: "Bengaluru City" },
  { id: 8, name: "Mysuru Town Police Station", district: "Mysuru District" }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, kgid: "123456", firstName: "Ramesh", lastName: "Kumar", rank: "Sub-Inspector", designation: "Investigating Officer" },
  { id: 2, kgid: "999999", firstName: "Kiran", lastName: "Reddy", rank: "DSP", designation: "Superintendent of Police" },
  { id: 3, kgid: "112233", firstName: "Anil", lastName: "Gowda", rank: "Inspector", designation: "Circle Officer" }
];

// Seeded victims and suspects conforming to unified Person models
const SEED_VICTIMS: Record<number, Victim[]> = {
  1: [
    { id: 101, name: "Shivanna Gowda", age: 48, contact: "+91 94808 12345", description: "Complainant whose retirement savings were targeted", injuryType: "None" }
  ],
  2: [
    { id: 102, name: "Devika Rani", age: 34, contact: "+91 94808 67890", description: "Homeowner", injuryType: "None" }
  ],
  3: [
    { id: 103, name: "Meena Kumari", age: 24, contact: "+91 99009 11223", description: "College student", injuryType: "None" }
  ]
};

const SEED_SUSPECTS: Record<number, Suspect[]> = {
  1: [
    { id: 201, name: "Unknown caller posing as SBI agent", age: 0, contact: "Unknown", description: "Voice phishing perpetrator", status: "ABSCONDING" },
    { id: 202, name: "Imran Khan", age: 29, contact: "8899889988", description: "Mule account owner registered in Jamtara", status: "SUSPECTED" }
  ],
  2: [
    { id: 203, name: "Venkatesh alias Kariya", age: 32, contact: "Unknown", description: "Known offender active in Malleshwaram area", status: "ABSCONDING" }
  ],
  3: [
    { id: 204, name: "Suresh P.", age: 25, contact: "7766554433", description: "Former classmate of victim", status: "INTERROGATED" }
  ]
};

// Initial mock cases database
const mockCasesDb: CaseMaster[] = [
  {
    id: 1,
    crimeNo: "104430006202600001",
    caseNo: "202600001",
    crimeRegisteredDate: "2026-03-12T10:30:00Z",
    policePersonId: 1,
    policeStationId: 6,
    caseCategoryId: 1,
    gravityOffenceId: 2,
    crimeMajorHeadId: 20,
    crimeMinorHeadId: 202,
    caseStatus: "UNDER_INVESTIGATION",
    priority: "HIGH",
    briefFacts: "The complainant reports that on 2026-03-11, they received a text message containing a phishing link posing as their bank. Upon clicking the link and entering credentials, unauthorized transactions amounting to ₹1,50,000 were debited from their savings account to a suspicious merchant wallet.",
    incidentFromDate: "2026-03-11T14:00:00Z",
    incidentToDate: "2026-03-11T14:30:00Z",
    infoReceivedPSDate: "2026-03-12T09:00:00Z",
    latitude: 12.9716,
    longitude: 77.5946,
    createdAt: "2026-03-12T10:30:00Z",
    updatedAt: "2026-03-12T10:30:00Z",
    victims: SEED_VICTIMS[1],
    suspects: SEED_SUSPECTS[1]
  },
  {
    id: 2,
    crimeNo: "104430006202600002",
    caseNo: "202600002",
    crimeRegisteredDate: "2026-04-05T09:15:00Z",
    policePersonId: 3,
    policeStationId: 7,
    caseCategoryId: 1,
    gravityOffenceId: 1,
    crimeMajorHeadId: 10,
    crimeMinorHeadId: 101,
    caseStatus: "UNDER_INVESTIGATION",
    priority: "MEDIUM",
    briefFacts: "Between 2026-04-04 18:00 and 2026-04-05 06:00, unknown perpetrators broke the lock of the rear gate of a residential villa and stole gold jewelry weighing approximately 120 grams and ₹50,000 in cash. The occupants were away traveling.",
    incidentFromDate: "2026-04-04T18:00:00Z",
    incidentToDate: "2026-04-05T06:00:00Z",
    infoReceivedPSDate: "2026-04-05T08:00:00Z",
    latitude: 12.9922,
    longitude: 77.5712,
    createdAt: "2026-04-05T09:15:00Z",
    updatedAt: "2026-04-05T09:15:00Z",
    victims: SEED_VICTIMS[2],
    suspects: SEED_SUSPECTS[2]
  },
  {
    id: 3,
    crimeNo: "104430006202600003",
    caseNo: "202600003",
    crimeRegisteredDate: "2026-05-18T16:00:00Z",
    policePersonId: 1,
    policeStationId: 6,
    caseCategoryId: 1,
    gravityOffenceId: 2,
    crimeMajorHeadId: 20,
    crimeMinorHeadId: 201,
    caseStatus: "CLOSED",
    priority: "LOW",
    briefFacts: "Suspect Suresh P. created a fraudulent social media profile mimicking the complainant's identity and solicited financial loans from the complainant's contact list, resulting in online scam transfers.",
    incidentFromDate: "2026-05-10T09:00:00Z",
    incidentToDate: "2026-05-15T18:00:00Z",
    infoReceivedPSDate: "2026-05-18T11:00:00Z",
    latitude: 12.9254,
    longitude: 77.5829,
    createdAt: "2026-05-18T16:00:00Z",
    updatedAt: "2026-05-20T14:30:00Z",
    victims: SEED_VICTIMS[3],
    suspects: SEED_SUSPECTS[3]
  }
];

// Initial mock investigation notes database
const mockNotesDb: InvestigationNote[] = [
  {
    id: 1,
    caseId: 1,
    content: "Sent official requisition letters to the bank's fraud monitoring team requesting transaction IP logs and beneficiary wallet registration documents.",
    createdBy: "Ramesh Kumar",
    createdKgid: "123456",
    createdAt: "2026-03-12T11:30:00Z",
    updatedAt: "2026-03-12T11:30:00Z",
    isDeleted: false
  },
  {
    id: 2,
    caseId: 1,
    content: "CDR details of the suspect mobile number received. Analysing cell tower locations pointing to locations near Deoghar, Jharkhand.",
    createdBy: "Ramesh Kumar",
    createdKgid: "123456",
    createdAt: "2026-03-14T14:20:00Z",
    updatedAt: "2026-03-14T14:20:00Z",
    isDeleted: false
  },
  {
    id: 3,
    caseId: 2,
    content: "Retrieved local CCTV footage from neighboring intersection. A silver sedan was spotted idling near the gate during the incident window. Enhancing registration numbers.",
    createdBy: "Anil Gowda",
    createdKgid: "112233",
    createdAt: "2026-04-05T10:45:00Z",
    updatedAt: "2026-04-05T10:45:00Z",
    isDeleted: false
  }
];

export class CaseRepository {
  static async getAll(): Promise<CaseMaster[]> {
    return mockCasesDb.filter(c => c.caseStatus !== "ARCHIVED");
  }

  static async getById(id: number): Promise<CaseMaster | null> {
    const record = mockCasesDb.find(c => c.id === id);
    if (!record || record.caseStatus === "ARCHIVED") return null;
    return { ...record };
  }

  static async create(data: Omit<CaseMaster, "id" | "createdAt" | "updatedAt">): Promise<CaseMaster> {
    const newId = mockCasesDb.length > 0 ? Math.max(...mockCasesDb.map(c => c.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    // Auto populate seeded victims/suspects if not provided
    const newRecord: CaseMaster = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now,
      victims: data.victims || [],
      suspects: data.suspects || []
    };
    mockCasesDb.push(newRecord);
    return { ...newRecord };
  }

  static async update(id: number, data: Partial<Omit<CaseMaster, "id" | "createdAt" | "updatedAt">>): Promise<CaseMaster | null> {
    const idx = mockCasesDb.findIndex(c => c.id === id);
    if (idx === -1 || mockCasesDb[idx].caseStatus === "ARCHIVED") return null;
    
    const now = new Date().toISOString();
    const updatedRecord = {
      ...mockCasesDb[idx],
      ...data,
      updatedAt: now
    };
    mockCasesDb[idx] = updatedRecord;
    return { ...updatedRecord };
  }

  static async softDelete(id: number): Promise<boolean> {
    const idx = mockCasesDb.findIndex(c => c.id === id);
    if (idx === -1) return false;
    
    mockCasesDb[idx] = {
      ...mockCasesDb[idx],
      caseStatus: "ARCHIVED",
      updatedAt: new Date().toISOString()
    };
    return true;
  }

  // --- Notes CRUD operations ---
  static async getNotesByCase(caseId: number): Promise<InvestigationNote[]> {
    return mockNotesDb.filter(n => n.caseId === caseId && !n.isDeleted);
  }

  static async addNote(noteData: Omit<InvestigationNote, "id" | "createdAt" | "updatedAt" | "isDeleted">): Promise<InvestigationNote> {
    const newId = mockNotesDb.length > 0 ? Math.max(...mockNotesDb.map(n => n.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newNote: InvestigationNote = {
      ...noteData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      isDeleted: false
    };
    mockNotesDb.push(newNote);
    return { ...newNote };
  }

  static async updateNote(
    id: number, 
    content: string, 
    officerName: string, 
    officerKgid: string
  ): Promise<InvestigationNote | null> {
    const idx = mockNotesDb.findIndex(n => n.id === id && !n.isDeleted);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    const updatedNote: InvestigationNote = {
      ...mockNotesDb[idx],
      content,
      lastModifiedBy: officerName,
      lastModifiedKgid: officerKgid,
      updatedAt: now
    };
    mockNotesDb[idx] = updatedNote;
    return { ...updatedNote };
  }

  static async softDeleteNote(
    id: number, 
    officerName: string, 
    officerKgid: string
  ): Promise<InvestigationNote | null> {
    const idx = mockNotesDb.findIndex(n => n.id === id && !n.isDeleted);
    if (idx === -1) return null;

    mockNotesDb[idx] = {
      ...mockNotesDb[idx],
      isDeleted: true,
      lastModifiedBy: officerName,
      lastModifiedKgid: officerKgid,
      updatedAt: new Date().toISOString()
    };
    return { ...mockNotesDb[idx] };
  }
}
