export type CaseStatus = "UNDER_INVESTIGATION" | "CHARGE_SHEETED" | "CLOSED" | "ARCHIVED";
export type CasePriority = "HIGH" | "MEDIUM" | "LOW";

export interface CaseCategory {
  id: number;
  name: string; // FIR, UDR, PAR, Zero FIR
}

export interface GravityOffence {
  id: number;
  name: string; // Heinous, Non-Heinous
}

export interface CrimeHead {
  id: number;
  name: string; // e.g., Crimes Against Property, Cyber Crime
}

export interface CrimeSubHead {
  id: number;
  name: string; // e.g., Murder, Burglary, Online Fraud
}

export interface Unit {
  id: number;
  name: string; // Police Station name
  district: string;
}

export interface Employee {
  id: number;
  kgid: string;
  firstName: string;
  lastName: string;
  rank: string;
  designation: string;
}

// Unified Person Domain Model (To prevent duplication and accommodate Complainants, Witness, etc.)
export interface Person {
  id: number;
  name: string;
  age: number;
  contact?: string;
  description?: string;
}

// Composition of Person for Victims
export interface Victim extends Person {
  injuryType?: string; // e.g., Minor, Grievous, Fatal, None
}

// Composition of Person for Suspects
export interface Suspect extends Person {
  status: "ABSCONDING" | "UNDER_CUSTODY" | "SUSPECTED" | "INTERROGATED";
}

// Notes data model with detailed audits
export interface InvestigationNote {
  id: number;
  caseId: number;
  content: string;
  createdBy: string;
  createdKgid: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy?: string;
  lastModifiedKgid?: string;
  isDeleted: boolean;
}

export interface CaseMaster {
  id: number;
  crimeNo: string; // Structured FIR number
  caseNo: string;  // YYYY + 5 digit serial
  crimeRegisteredDate: string; // ISO Date String
  policePersonId: number; // FK to Employee
  policeStationId: number; // FK to Unit
  caseCategoryId: number; // FK to CaseCategory
  gravityOffenceId: number; // FK to GravityOffence
  crimeMajorHeadId: number; // FK to CrimeHead
  crimeMinorHeadId: number; // FK to CrimeSubHead
  caseStatus: CaseStatus;
  priority: CasePriority;
  briefFacts: string;
  incidentFromDate: string;
  incidentToDate: string;
  infoReceivedPSDate: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  victims?: Victim[];
  suspects?: Suspect[];
}

// Client-facing visual case presentation interface (denormalized)
export interface CaseDetailsUI extends CaseMaster {
  categoryName: string;
  gravityName: string;
  majorHeadName: string;
  minorHeadName: string;
  stationName: string;
  districtName: string;
  officerName: string;
  officerRank: string;
  victims: Victim[];
  suspects: Suspect[];
}
