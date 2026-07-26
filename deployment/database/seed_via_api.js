/**
 * Catalyst Data Store Seed Script
 * Uses the Catalyst REST API to insert seed data into all tables.
 *
 * Prerequisites:
 *   npm install node-fetch
 *
 * Usage:
 *   Windows PowerShell:
 *     $env:CATALYST_PROJECT_ID="your_project_id"
 *     $env:CATALYST_ACCESS_TOKEN="your_oauth_token"
 *     node deployment/database/seed_via_api.js
 *
 * How to get your OAuth token:
 *   - Open the Catalyst Console → Profile → API Console
 *   - Or use: https://accounts.zoho.in/oauth/v2/auth with scope=ZohoCatalyst.datastore.ALL
 */

const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const PROJECT_ID = process.env.CATALYST_PROJECT_ID;
const ACCESS_TOKEN = process.env.CATALYST_ACCESS_TOKEN;

// Catalyst API base URL — change domain if your project is on .eu or .in DC
const BASE_URL = `https://api.catalyst.zoho.com/baas/v1/project/${PROJECT_ID}/table`;

if (!PROJECT_ID || !ACCESS_TOKEN) {
  console.error("ERROR: Missing required environment variables.");
  console.error("  CATALYST_PROJECT_ID — your Catalyst project ID");
  console.error("  CATALYST_ACCESS_TOKEN — a valid Zoho OAuth2 access token");
  process.exit(1);
}

/**
 * Insert rows into a Catalyst Data Store table.
 * @param {string} tableName - Exact table name as created in the Catalyst Console
 * @param {object[]} rows - Array of row objects; keys must match column names exactly
 */
async function insertRows(tableName, rows) {
  const url = `${BASE_URL}/${tableName}/row`;
  const headers = {
    Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    Environment: "Development",
  };

  let successCount = 0;
  for (const row of rows) {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(row),
    });

    const result = await response.json();
    if (response.ok && result.status === "success") {
      successCount++;
    } else {
      console.error(`  ✗ Failed to insert into ${tableName}:`, JSON.stringify(result));
    }
  }

  console.log(`  ✓ ${tableName}: ${successCount}/${rows.length} rows inserted`);
}

// ==========================================
// SEED DATA — Lookup Tables
// ==========================================

const CASE_CATEGORIES = [
  { id: 1, name: "FIR" },
  { id: 2, name: "UDR" },
  { id: 3, name: "Zero FIR" },
  { id: 4, name: "PAR" },
];

const GRAVITY_OFFENCES = [
  { id: 1, name: "Heinous" },
  { id: 2, name: "Non-Heinous" },
];

const CRIME_HEADS = [
  { id: 10, name: "Crimes Against Property" },
  { id: 20, name: "Cyber Crime" },
  { id: 30, name: "Crimes Against Body" },
  { id: 40, name: "Economic Offenses" },
];

const CRIME_SUB_HEADS = [
  { id: 101, name: "House Break-in & Burglary" },
  { id: 102, name: "Armed Robbery" },
  { id: 201, name: "Identity Theft & Phishing" },
  { id: 202, name: "Online Financial Fraud" },
  { id: 301, name: "Murder" },
  { id: 302, name: "Grievous Hurt" },
];

const UNITS = [
  { id: 6, name: "Bengaluru Cyber Crime PS", district: "Bengaluru City" },
  { id: 7, name: "Malleshwaram Police Station", district: "Bengaluru City" },
  { id: 8, name: "Mysuru Town Police Station", district: "Mysuru District" },
];

const EMPLOYEES = [
  { id: 1, kgid: "123456", firstName: "Ramesh", lastName: "Kumar", rank: "Sub-Inspector", designation: "Investigating Officer" },
  { id: 2, kgid: "999999", firstName: "Kiran", lastName: "Reddy", rank: "DSP", designation: "Superintendent of Police" },
  { id: 3, kgid: "112233", firstName: "Anil", lastName: "Gowda", rank: "Inspector", designation: "Circle Officer" },
];

// ==========================================
// SEED DATA — Transactional Tables
// ==========================================

const CASES = [
  {
    id: 1, crimeNo: "104430006202600001", caseNo: "202600001",
    crimeRegisteredDate: "2026-03-12 10:30:00",
    policePersonId: 1, policeStationId: 6, caseCategoryId: 1,
    gravityOffenceId: 2, crimeMajorHeadId: 20, crimeMinorHeadId: 202,
    caseStatus: "UNDER_INVESTIGATION", priority: "HIGH",
    briefFacts: "The complainant reports that on 2026-03-11, they received a text message containing a phishing link posing as their bank. Upon clicking the link and entering credentials, unauthorized transactions amounting to Rs.1,50,000 were debited from their savings account to a suspicious merchant wallet.",
    incidentFromDate: "2026-03-11 14:00:00", incidentToDate: "2026-03-11 14:30:00",
    infoReceivedPSDate: "2026-03-12 09:00:00",
    latitude: 12.971600, longitude: 77.594600,
    createdAt: "2026-03-12 10:30:00", updatedAt: "2026-03-12 10:30:00",
  },
  {
    id: 2, crimeNo: "104430006202600002", caseNo: "202600002",
    crimeRegisteredDate: "2026-04-05 09:15:00",
    policePersonId: 3, policeStationId: 7, caseCategoryId: 1,
    gravityOffenceId: 1, crimeMajorHeadId: 10, crimeMinorHeadId: 101,
    caseStatus: "UNDER_INVESTIGATION", priority: "MEDIUM",
    briefFacts: "Between 2026-04-04 18:00 and 2026-04-05 06:00, unknown perpetrators broke the lock of the rear gate of a residential villa and stole gold jewelry weighing approximately 120 grams and Rs.50,000 in cash. The occupants were away traveling.",
    incidentFromDate: "2026-04-04 18:00:00", incidentToDate: "2026-04-05 06:00:00",
    infoReceivedPSDate: "2026-04-05 08:00:00",
    latitude: 12.992200, longitude: 77.571200,
    createdAt: "2026-04-05 09:15:00", updatedAt: "2026-04-05 09:15:00",
  },
  {
    id: 3, crimeNo: "104430006202600003", caseNo: "202600003",
    crimeRegisteredDate: "2026-05-18 16:00:00",
    policePersonId: 1, policeStationId: 6, caseCategoryId: 1,
    gravityOffenceId: 2, crimeMajorHeadId: 20, crimeMinorHeadId: 201,
    caseStatus: "CLOSED", priority: "LOW",
    briefFacts: "Suspect Suresh P. created a fraudulent social media profile mimicking the complainant's identity and solicited financial loans from the complainant's contact list, resulting in online scam transfers.",
    incidentFromDate: "2026-05-10 09:00:00", incidentToDate: "2026-05-15 18:00:00",
    infoReceivedPSDate: "2026-05-18 11:00:00",
    latitude: 12.925400, longitude: 77.582900,
    createdAt: "2026-05-18 16:00:00", updatedAt: "2026-05-20 14:30:00",
  },
];

const VICTIMS = [
  { id: 101, caseId: 1, name: "Shivanna Gowda", age: 48, contact: "+91 94808 12345", description: "Complainant whose retirement savings were targeted", injuryType: "None" },
  { id: 102, caseId: 2, name: "Devika Rani", age: 34, contact: "+91 94808 67890", description: "Homeowner", injuryType: "None" },
  { id: 103, caseId: 3, name: "Meena Kumari", age: 24, contact: "+91 99009 11223", description: "College student", injuryType: "None" },
];

const SUSPECTS = [
  { id: 201, caseId: 1, name: "Unknown caller posing as SBI agent", age: 0, contact: "Unknown", description: "Voice phishing perpetrator", status: "ABSCONDING" },
  { id: 202, caseId: 1, name: "Imran Khan", age: 29, contact: "8899889988", description: "Mule account owner registered in Jamtara", status: "SUSPECTED" },
  { id: 203, caseId: 2, name: "Venkatesh alias Kariya", age: 32, contact: "Unknown", description: "Known offender active in Malleshwaram area", status: "ABSCONDING" },
  { id: 204, caseId: 3, name: "Suresh P.", age: 25, contact: "7766554433", description: "Former classmate of victim", status: "INTERROGATED" },
];

const NOTES = [
  {
    id: 1, caseId: 1,
    content: "Sent official requisition letters to the bank's fraud monitoring team requesting transaction IP logs and beneficiary wallet registration documents.",
    createdBy: "Ramesh Kumar", createdKgid: "123456",
    createdAt: "2026-03-12 11:30:00", updatedAt: "2026-03-12 11:30:00",
    isDeleted: false,
  },
  {
    id: 2, caseId: 1,
    content: "CDR details of the suspect mobile number received. Analysing cell tower locations pointing to locations near Deoghar, Jharkhand.",
    createdBy: "Ramesh Kumar", createdKgid: "123456",
    createdAt: "2026-03-14 14:20:00", updatedAt: "2026-03-14 14:20:00",
    isDeleted: false,
  },
  {
    id: 3, caseId: 2,
    content: "Retrieved local CCTV footage from neighboring intersection. A silver sedan was spotted idling near the gate during the incident window. Enhancing registration numbers.",
    createdBy: "Anil Gowda", createdKgid: "112233",
    createdAt: "2026-04-05 10:45:00", updatedAt: "2026-04-05 10:45:00",
    isDeleted: false,
  },
];

const EVIDENCE = [
  {
    id: 1, evidenceNo: "EV-2026-000001", caseId: 1, crimeNo: "104430006202600001",
    title: "Beneficiary Wallet Account Statement",
    description: "PDF bank statement detailing money transfers routed from the complainant's savings account.",
    evidenceType: "DOCUMENT", status: "SECURED",
    collectionDate: "2026-03-12", collectionTime: "11:00",
    latitude: 12.971600, longitude: 77.594600,
    collectorName: "Ramesh Kumar", collectorKgid: "123456",
    fileHash: "a3a25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0021",
    fileSize: 450230, mimeType: "application/pdf", fileName: "wallet_statement_transfers.pdf",
    tags: '["phishing","bank_statement","mule_wallet"]',
    ocrText: null, aiLabels: null, analysisSummary: null,
    extractedEntities: '{"PERSON":["Imran Khan"],"PHONE":["8899889988"]}',
    createdAt: "2026-03-12 11:00:00", updatedAt: "2026-03-12 11:00:00",
  },
  {
    id: 2, evidenceNo: "EV-2026-000002", caseId: 2, crimeNo: "104430006202600002",
    title: "Intersection CCTV Footage Screenshot",
    description: "Image captured from YES intersection camera showing suspect silver sedan idling during the burglary timeframe.",
    evidenceType: "IMAGE", status: "SECURED",
    collectionDate: "2026-04-05", collectionTime: "10:15",
    latitude: 12.992200, longitude: 77.571200,
    collectorName: "Anil Gowda", collectorKgid: "112233",
    fileHash: "c5c25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0042",
    fileSize: 2048500, mimeType: "image/png", fileName: "cctv_suspect_vehicle.png",
    tags: '["burglary","cctv_frame","vehicle_plate"]',
    ocrText: null, aiLabels: null, analysisSummary: null,
    extractedEntities: '{"VEHICLE":["Silver Sedan"]}',
    createdAt: "2026-04-05 10:15:00", updatedAt: "2026-04-05 10:15:00",
  },
  {
    id: 3, evidenceNo: "EV-2026-000003", caseId: 3, crimeNo: "104430006202600003",
    title: "Suspect Mobile Device (OnePlus 11R)",
    description: "Recovered physical mobile handset containing fraudulent social media logins and spoofed contacts logs.",
    evidenceType: "DEVICE", status: "SUBMITTED_TO_COURT",
    collectionDate: "2026-05-19", collectionTime: "12:30",
    latitude: 12.925400, longitude: 77.582900,
    collectorName: "Ramesh Kumar", collectorKgid: "123456",
    fileHash: "f1f25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0063",
    fileSize: 0, mimeType: "application/octet-stream", fileName: "oneplus_handset_recovered",
    tags: '["identity_theft","physical_device","handset"]',
    ocrText: null, aiLabels: null, analysisSummary: null,
    extractedEntities: '{}',
    createdAt: "2026-05-19 12:30:00", updatedAt: "2026-05-20 16:00:00",
  },
];

const CUSTODY_EVENTS = [
  { id: 1, evidenceId: 1, timestamp: "2026-03-12 11:00:00", officerName: "Ramesh Kumar", officerKgid: "123456", action: "REGISTERED", previousState: "None", currentState: "SECURED", remarks: "Seized wallet transfer details from complainant at PS console." },
  { id: 2, evidenceId: 2, timestamp: "2026-04-05 10:15:00", officerName: "Anil Gowda", officerKgid: "112233", action: "REGISTERED", previousState: "None", currentState: "SECURED", remarks: "Screenshotted suspect sedan vehicle license plates from intersection CCTV files." },
  { id: 3, evidenceId: 3, timestamp: "2026-05-19 12:30:00", officerName: "Ramesh Kumar", officerKgid: "123456", action: "REGISTERED", previousState: "None", currentState: "SECURED", remarks: "Physical recovery of suspect OnePlus 11R mobile handset during search warrant execution." },
  { id: 4, evidenceId: 3, timestamp: "2026-05-20 16:00:00", officerName: "Ramesh Kumar", officerKgid: "123456", action: "STATUS_CHANGED", previousState: "SECURED", currentState: "SUBMITTED_TO_COURT", remarks: "Transferred OnePlus handset to Court Registry under formal request seal." },
];

const ACTIVITY_LOGS = [
  { id: 1, caseId: 1, crimeNo: "104430006202600001", caseNo: "202600001", officerName: "Ramesh Kumar", action: "CREATED", timestamp: "2026-03-12 10:30:00" },
  { id: 2, caseId: 2, crimeNo: "104430006202600002", caseNo: "202600002", officerName: "Anil Gowda", action: "CREATED", timestamp: "2026-04-05 09:15:00" },
  { id: 3, caseId: 3, crimeNo: "104430006202600003", caseNo: "202600003", officerName: "Ramesh Kumar", action: "CREATED", timestamp: "2026-05-18 16:00:00" },
  { id: 4, caseId: 3, crimeNo: "104430006202600003", caseNo: "202600003", officerName: "Ramesh Kumar", action: "STATUS_CHANGED", timestamp: "2026-05-20 14:30:00" },
];

const INTELLIGENCE_RECORDS = [
  {
    id: "intel-uuid-1",
    evidenceId: 1,
    version: 1,
    analyzedAt: "2026-03-12 12:00:00",
    ocrRawText: "Bank Statement Account details. Beneficiary: Imran Khan. Phone: 8899889988. Account No: 9876543210.",
    ocrConfidence: 0.95,
    ocrProvider: "CATALYST_ZIA_OCR",
    analysisSummary: "AI extracted beneficiary account associated with suspect Imran Khan and contact mobile number.",
    aiLabels: '["phishing","mule_account","fraud"]',
    overallConfidence: 0.92,
    provider: "CATALYST_ZIA_OCR",
    relationships: '[{"id":"rel-1-1","fromEntityId":"entity-uuid-1","toEntityId":"entity-uuid-2","relationshipType":"HAS_CONTACT","confidence":0.882,"sourceEvidenceId":1}]'
  }
];

const EXTRACTED_ENTITIES = [
  { id: "entity-uuid-1", intelligenceRecordId: "intel-uuid-1", sourceEvidenceId: 1, value: "Imran Khan", type: "PERSON", confidence: 0.98, extractionMethod: "ZIA_NLP", extractedAt: "2026-03-12 12:00:00", reviewStatus: "ACCEPTED" },
  { id: "entity-uuid-2", intelligenceRecordId: "intel-uuid-1", sourceEvidenceId: 1, value: "8899889988", type: "PHONE", confidence: 0.99, extractionMethod: "REGEX_PATTERN", extractedAt: "2026-03-12 12:00:00", reviewStatus: "ACCEPTED" }
];

const REVIEW_EVENTS = [
  { id: "review-uuid-1", entityId: "entity-uuid-1", evidenceId: 1, officerKgid: "123456", officerName: "Ramesh Kumar", action: "ACCEPTED", previousStatus: "PENDING", newStatus: "ACCEPTED", timestamp: "2026-03-12 12:05:00" },
  { id: "review-uuid-2", entityId: "entity-uuid-2", evidenceId: 1, officerKgid: "123456", officerName: "Ramesh Kumar", action: "ACCEPTED", previousStatus: "PENDING", newStatus: "ACCEPTED", timestamp: "2026-03-12 12:05:10" }
];

// ==========================================
// MAIN — Execute seed in dependency order
// ==========================================

async function main() {
  console.log("KSP Investigation Copilot — Catalyst Data Store Seeder");
  console.log("=".repeat(55));
  console.log(`Project ID : ${PROJECT_ID}`);
  console.log(`API Base   : ${BASE_URL}`);
  console.log("");

  console.log("[ Step 1 ] Seeding Lookup Tables...");
  await insertRows("CaseCategory", CASE_CATEGORIES);
  await insertRows("GravityOffence", GRAVITY_OFFENCES);
  await insertRows("CrimeHead", CRIME_HEADS);
  await insertRows("CrimeSubHead", CRIME_SUB_HEADS);
  await insertRows("Unit", UNITS);
  await insertRows("Employee", EMPLOYEES);

  console.log("\n[ Step 2 ] Seeding Transactional Tables...");
  await insertRows("CaseMaster", CASES);
  await insertRows("Victim", VICTIMS);
  await insertRows("Suspect", SUSPECTS);
  await insertRows("InvestigationNote", NOTES);
  await insertRows("EvidenceMaster", EVIDENCE);
  await insertRows("CustodyEvent", CUSTODY_EVENTS);
  await insertRows("ActivityLog", ACTIVITY_LOGS);

  console.log("\n[ Step 3 ] Seeding AI Telemetry...");
  await insertRows("IntelligenceRecord", INTELLIGENCE_RECORDS);
  await insertRows("ExtractedEntity", EXTRACTED_ENTITIES);
  await insertRows("ReviewEvent", REVIEW_EVENTS);

  console.log("\n=".repeat(55));
  console.log("Seeding complete. Run verification queries in the Catalyst Console.");
  console.log("See: deployment/database/05_verify.sql");
}

main().catch((err) => {
  console.error("Fatal error during seeding:", err.message);
  process.exit(1);
});
