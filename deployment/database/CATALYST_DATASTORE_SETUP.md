# Catalyst Data Store Setup Guide
## KSP AI Investigation Copilot

> **Important**: Zoho Catalyst does **not** support DDL (CREATE TABLE / ALTER TABLE) via REST API or CLI.  
> Tables and columns must be created manually in the Catalyst Console.  
> Row data can be inserted via ZCQL in the console, or via the REST API / SDK from a script.

This guide provides everything needed to set up the Data Store from scratch.

---

## Part 1 — Create Tables in the Catalyst Console

### How to Open the Data Store
1. Log in to [console.catalyst.zoho.com](https://console.catalyst.zoho.com)
2. Select project **KSP_Investigation_Copilot**
3. Navigate to **Storage → Data Store**
4. Click **Create Table** for each table below

---

### Table 1: `CaseCategory`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `name` | Text | 50 | Yes | Yes |

---

### Table 2: `GravityOffence`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `name` | Text | 50 | Yes | Yes |

---

### Table 3: `CrimeHead`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `name` | Text | 100 | Yes | No |

---

### Table 4: `CrimeSubHead`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `name` | Text | 100 | Yes | No |

---

### Table 5: `Unit`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `name` | Text | 255 | Yes | No |
| `district` | Text | 100 | Yes | No |

---

### Table 6: `Employee`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `kgid` | Text | 20 | Yes | Yes |
| `firstName` | Text | 100 | Yes | No |
| `lastName` | Text | 100 | Yes | No |
| `rank` | Text | 100 | Yes | No |
| `designation` | Text | 100 | Yes | No |

---

### Table 7: `CaseMaster`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `crimeNo` | Text | 50 | Yes | Yes |
| `caseNo` | Text | 20 | Yes | No |
| `crimeRegisteredDate` | Text | 30 | Yes | No |
| `policePersonId` | Number | — | Yes | No |
| `policeStationId` | Number | — | Yes | No |
| `caseCategoryId` | Number | — | Yes | No |
| `gravityOffenceId` | Number | — | Yes | No |
| `crimeMajorHeadId` | Number | — | Yes | No |
| `crimeMinorHeadId` | Number | — | Yes | No |
| `caseStatus` | Text | 30 | Yes | No |
| `priority` | Text | 10 | Yes | No |
| `briefFacts` | Long Text | — | Yes | No |
| `incidentFromDate` | Text | 30 | Yes | No |
| `incidentToDate` | Text | 30 | Yes | No |
| `infoReceivedPSDate` | Text | 30 | Yes | No |
| `latitude` | Decimal | — | Yes | No |
| `longitude` | Decimal | — | Yes | No |
| `createdAt` | Text | 30 | Yes | No |
| `updatedAt` | Text | 30 | Yes | No |

---

### Table 8: `Victim`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `caseId` | Number | — | Yes | No |
| `name` | Text | 255 | Yes | No |
| `age` | Number | — | Yes | No |
| `contact` | Text | 50 | No | No |
| `description` | Long Text | — | No | No |
| `injuryType` | Text | 50 | No | No |

---

### Table 9: `Suspect`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `caseId` | Number | — | Yes | No |
| `name` | Text | 255 | Yes | No |
| `age` | Number | — | Yes | No |
| `contact` | Text | 50 | No | No |
| `description` | Long Text | — | No | No |
| `status` | Text | 30 | Yes | No |

---

### Table 10: `InvestigationNote`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `caseId` | Number | — | Yes | No |
| `content` | Long Text | — | Yes | No |
| `createdBy` | Text | 255 | Yes | No |
| `createdKgid` | Text | 20 | Yes | No |
| `createdAt` | Text | 30 | Yes | No |
| `updatedAt` | Text | 30 | Yes | No |
| `lastModifiedBy` | Text | 255 | No | No |
| `lastModifiedKgid` | Text | 20 | No | No |
| `isDeleted` | Boolean | — | Yes | No |

---

### Table 11: `EvidenceMaster`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `evidenceNo` | Text | 30 | Yes | Yes |
| `caseId` | Number | — | Yes | No |
| `crimeNo` | Text | 50 | Yes | No |
| `title` | Text | 255 | Yes | No |
| `description` | Long Text | — | Yes | No |
| `evidenceType` | Text | 20 | Yes | No |
| `status` | Text | 30 | Yes | No |
| `collectionDate` | Text | 20 | Yes | No |
| `collectionTime` | Text | 10 | Yes | No |
| `latitude` | Decimal | — | Yes | No |
| `longitude` | Decimal | — | Yes | No |
| `collectorName` | Text | 255 | Yes | No |
| `collectorKgid` | Text | 20 | Yes | No |
| `fileHash` | Text | 100 | Yes | No |
| `fileSize` | Number | — | Yes | No |
| `mimeType` | Text | 100 | Yes | No |
| `fileName` | Text | 255 | Yes | No |
| `tags` | Long Text | — | No | No |
| `ocrText` | Long Text | — | No | No |
| `aiLabels` | Long Text | — | No | No |
| `analysisSummary` | Long Text | — | No | No |
| `createdAt` | Text | 30 | Yes | No |
| `updatedAt` | Text | 30 | Yes | No |

---

### Table 12: `CustodyEvent`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `evidenceId` | Number | — | Yes | No |
| `timestamp` | Text | 30 | Yes | No |
| `officerName` | Text | 255 | Yes | No |
| `officerKgid` | Text | 20 | Yes | No |
| `action` | Text | 30 | Yes | No |
| `previousState` | Text | 100 | Yes | No |
| `currentState` | Text | 100 | Yes | No |
| `remarks` | Long Text | — | Yes | No |

---

### Table 13: `IntelligenceRecord`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Text | 50 | Yes | Yes |
| `evidenceId` | Number | — | Yes | No |
| `version` | Number | — | Yes | No |
| `analyzedAt` | Text | 30 | Yes | No |
| `ocrRawText` | Long Text | — | Yes | No |
| `ocrConfidence` | Decimal | — | Yes | No |
| `ocrProvider` | Text | 100 | Yes | No |
| `analysisSummary` | Long Text | — | Yes | No |
| `aiLabels` | Long Text | — | Yes | No |
| `overallConfidence` | Decimal | — | Yes | No |
| `provider` | Text | 100 | Yes | No |

---

### Table 14: `ExtractedEntity`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Text | 50 | Yes | Yes |
| `intelligenceRecordId` | Text | 50 | Yes | No |
| `sourceEvidenceId` | Number | — | Yes | No |
| `value` | Text | 500 | Yes | No |
| `type` | Text | 30 | Yes | No |
| `confidence` | Decimal | — | Yes | No |
| `extractionMethod` | Text | 50 | Yes | No |
| `extractedAt` | Text | 30 | Yes | No |
| `reviewStatus` | Text | 20 | Yes | No |

---

### Table 15: `ReviewEvent`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Text | 50 | Yes | Yes |
| `entityId` | Text | 50 | Yes | No |
| `evidenceId` | Number | — | Yes | No |
| `officerKgid` | Text | 20 | Yes | No |
| `officerName` | Text | 255 | Yes | No |
| `action` | Text | 30 | Yes | No |
| `previousStatus` | Text | 20 | Yes | No |
| `newStatus` | Text | 20 | Yes | No |
| `timestamp` | Text | 30 | Yes | No |

---

### Table 16: `ActivityLog`
| Column Name | Data Type | Max Length | Required | Unique |
|---|---|---|---|---|
| `id` | Number | — | Yes | Yes |
| `caseId` | Number | — | Yes | No |
| `crimeNo` | Text | 50 | Yes | No |
| `caseNo` | Text | 20 | Yes | No |
| `officerName` | Text | 255 | Yes | No |
| `action` | Text | 30 | Yes | No |
| `timestamp` | Text | 30 | Yes | No |

---

## Part 2 — Insert Seed Data via ZCQL Console

After creating all tables, navigate to **Data Store → Query Editor** in the Catalyst Console and run each block below in order.

> ZCQL supports standard SQL INSERT syntax inside the console query window.

### Step 1: Seed CaseCategory
```sql
INSERT INTO CaseCategory (id, name) VALUES (1, 'FIR');
INSERT INTO CaseCategory (id, name) VALUES (2, 'UDR');
INSERT INTO CaseCategory (id, name) VALUES (3, 'Zero FIR');
INSERT INTO CaseCategory (id, name) VALUES (4, 'PAR');
```

### Step 2: Seed GravityOffence
```sql
INSERT INTO GravityOffence (id, name) VALUES (1, 'Heinous');
INSERT INTO GravityOffence (id, name) VALUES (2, 'Non-Heinous');
```

### Step 3: Seed CrimeHead
```sql
INSERT INTO CrimeHead (id, name) VALUES (10, 'Crimes Against Property');
INSERT INTO CrimeHead (id, name) VALUES (20, 'Cyber Crime');
INSERT INTO CrimeHead (id, name) VALUES (30, 'Crimes Against Body');
INSERT INTO CrimeHead (id, name) VALUES (40, 'Economic Offenses');
```

### Step 4: Seed CrimeSubHead
```sql
INSERT INTO CrimeSubHead (id, name) VALUES (101, 'House Break-in and Burglary');
INSERT INTO CrimeSubHead (id, name) VALUES (102, 'Armed Robbery');
INSERT INTO CrimeSubHead (id, name) VALUES (201, 'Identity Theft and Phishing');
INSERT INTO CrimeSubHead (id, name) VALUES (202, 'Online Financial Fraud');
INSERT INTO CrimeSubHead (id, name) VALUES (301, 'Murder');
INSERT INTO CrimeSubHead (id, name) VALUES (302, 'Grievous Hurt');
```

### Step 5: Seed Unit
```sql
INSERT INTO Unit (id, name, district) VALUES (6, 'Bengaluru Cyber Crime PS', 'Bengaluru City');
INSERT INTO Unit (id, name, district) VALUES (7, 'Malleshwaram Police Station', 'Bengaluru City');
INSERT INTO Unit (id, name, district) VALUES (8, 'Mysuru Town Police Station', 'Mysuru District');
```

### Step 6: Seed Employee
```sql
INSERT INTO Employee (id, kgid, firstName, lastName, rank, designation) VALUES (1, '123456', 'Ramesh', 'Kumar', 'Sub-Inspector', 'Investigating Officer');
INSERT INTO Employee (id, kgid, firstName, lastName, rank, designation) VALUES (2, '999999', 'Kiran', 'Reddy', 'DSP', 'Superintendent of Police');
INSERT INTO Employee (id, kgid, firstName, lastName, rank, designation) VALUES (3, '112233', 'Anil', 'Gowda', 'Inspector', 'Circle Officer');
```

---

## Part 3 — Insert Demo Data via ZCQL Console

### Step 7: Seed CaseMaster
```sql
INSERT INTO CaseMaster (id, crimeNo, caseNo, crimeRegisteredDate, policePersonId, policeStationId, caseCategoryId, gravityOffenceId, crimeMajorHeadId, crimeMinorHeadId, caseStatus, priority, briefFacts, incidentFromDate, incidentToDate, infoReceivedPSDate, latitude, longitude, createdAt, updatedAt) VALUES (1, '104430006202600001', '202600001', '2026-03-12T10:30:00Z', 1, 6, 1, 2, 20, 202, 'UNDER_INVESTIGATION', 'HIGH', 'The complainant reports that on 2026-03-11 they received a phishing text message posing as their bank. Unauthorized transactions of 150000 rupees were debited from their savings account to a suspicious merchant wallet.', '2026-03-11T14:00:00Z', '2026-03-11T14:30:00Z', '2026-03-12T09:00:00Z', 12.971600, 77.594600, '2026-03-12T10:30:00Z', '2026-03-12T10:30:00Z');

INSERT INTO CaseMaster (id, crimeNo, caseNo, crimeRegisteredDate, policePersonId, policeStationId, caseCategoryId, gravityOffenceId, crimeMajorHeadId, crimeMinorHeadId, caseStatus, priority, briefFacts, incidentFromDate, incidentToDate, infoReceivedPSDate, latitude, longitude, createdAt, updatedAt) VALUES (2, '104430006202600002', '202600002', '2026-04-05T09:15:00Z', 3, 7, 1, 1, 10, 101, 'UNDER_INVESTIGATION', 'MEDIUM', 'Unknown perpetrators broke the rear gate lock of a residential villa between 2026-04-04 and 2026-04-05 and stole gold jewelry of 120 grams and 50000 rupees cash.', '2026-04-04T18:00:00Z', '2026-04-05T06:00:00Z', '2026-04-05T08:00:00Z', 12.992200, 77.571200, '2026-04-05T09:15:00Z', '2026-04-05T09:15:00Z');

INSERT INTO CaseMaster (id, crimeNo, caseNo, crimeRegisteredDate, policePersonId, policeStationId, caseCategoryId, gravityOffenceId, crimeMajorHeadId, crimeMinorHeadId, caseStatus, priority, briefFacts, incidentFromDate, incidentToDate, infoReceivedPSDate, latitude, longitude, createdAt, updatedAt) VALUES (3, '104430006202600003', '202600003', '2026-05-18T16:00:00Z', 1, 6, 1, 2, 20, 201, 'CLOSED', 'LOW', 'Suspect Suresh P. created a fraudulent social media profile mimicking the complainant identity and solicited financial loans from the contact list resulting in online scam transfers.', '2026-05-10T09:00:00Z', '2026-05-15T18:00:00Z', '2026-05-18T11:00:00Z', 12.925400, 77.582900, '2026-05-18T16:00:00Z', '2026-05-20T14:30:00Z');
```

### Step 8: Seed Victim
```sql
INSERT INTO Victim (id, caseId, name, age, contact, description, injuryType) VALUES (101, 1, 'Shivanna Gowda', 48, '+91 94808 12345', 'Complainant whose retirement savings were targeted', 'None');
INSERT INTO Victim (id, caseId, name, age, contact, description, injuryType) VALUES (102, 2, 'Devika Rani', 34, '+91 94808 67890', 'Homeowner', 'None');
INSERT INTO Victim (id, caseId, name, age, contact, description, injuryType) VALUES (103, 3, 'Meena Kumari', 24, '+91 99009 11223', 'College student', 'None');
```

### Step 9: Seed Suspect
```sql
INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (201, 1, 'Unknown caller posing as SBI agent', 0, 'Unknown', 'Voice phishing perpetrator', 'ABSCONDING');
INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (202, 1, 'Imran Khan', 29, '8899889988', 'Mule account owner registered in Jamtara', 'SUSPECTED');
INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (203, 2, 'Venkatesh alias Kariya', 32, 'Unknown', 'Known offender active in Malleshwaram area', 'ABSCONDING');
INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (204, 3, 'Suresh P.', 25, '7766554433', 'Former classmate of victim', 'INTERROGATED');
```

### Step 10: Seed InvestigationNote
```sql
INSERT INTO InvestigationNote (id, caseId, content, createdBy, createdKgid, createdAt, updatedAt, isDeleted) VALUES (1, 1, 'Sent official requisition letters to the bank fraud monitoring team requesting transaction IP logs and beneficiary wallet registration documents.', 'Ramesh Kumar', '123456', '2026-03-12T11:30:00Z', '2026-03-12T11:30:00Z', false);
INSERT INTO InvestigationNote (id, caseId, content, createdBy, createdKgid, createdAt, updatedAt, isDeleted) VALUES (2, 1, 'CDR details of the suspect mobile number received. Analysing cell tower locations pointing to locations near Deoghar Jharkhand.', 'Ramesh Kumar', '123456', '2026-03-14T14:20:00Z', '2026-03-14T14:20:00Z', false);
```

### Step 11: Seed EvidenceMaster
```sql
INSERT INTO EvidenceMaster (id, evidenceNo, caseId, crimeNo, title, description, evidenceType, status, collectionDate, collectionTime, latitude, longitude, collectorName, collectorKgid, fileHash, fileSize, mimeType, fileName, tags, createdAt, updatedAt) VALUES (1, 'EV-2026-000001', 1, '104430006202600001', 'Beneficiary Wallet Account Statement', 'PDF bank statement detailing money transfers routed from the complainant savings account.', 'DOCUMENT', 'SECURED', '2026-03-12', '11:00', 12.971600, 77.594600, 'Ramesh Kumar', '123456', 'a3a25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0021', 450230, 'application/pdf', 'wallet_statement_transfers.pdf', '["phishing","bank_statement","mule_wallet"]', '2026-03-12T11:00:00Z', '2026-03-12T11:00:00Z');

INSERT INTO EvidenceMaster (id, evidenceNo, caseId, crimeNo, title, description, evidenceType, status, collectionDate, collectionTime, latitude, longitude, collectorName, collectorKgid, fileHash, fileSize, mimeType, fileName, tags, createdAt, updatedAt) VALUES (2, 'EV-2026-000002', 2, '104430006202600002', 'Intersection CCTV Footage Screenshot', 'Image captured from intersection camera showing suspect silver sedan idling during the burglary timeframe.', 'IMAGE', 'SECURED', '2026-04-05', '10:15', 12.992200, 77.571200, 'Anil Gowda', '112233', 'c5c25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0042', 2048500, 'image/png', 'cctv_suspect_vehicle.png', '["burglary","cctv_frame","vehicle_plate"]', '2026-04-05T10:15:00Z', '2026-04-05T10:15:00Z');

INSERT INTO EvidenceMaster (id, evidenceNo, caseId, crimeNo, title, description, evidenceType, status, collectionDate, collectionTime, latitude, longitude, collectorName, collectorKgid, fileHash, fileSize, mimeType, fileName, tags, createdAt, updatedAt) VALUES (3, 'EV-2026-000003', 3, '104430006202600003', 'Suspect Mobile Device OnePlus 11R', 'Recovered physical mobile handset containing fraudulent social media logins and spoofed contacts logs.', 'DEVICE', 'SUBMITTED_TO_COURT', '2026-05-19', '12:30', 12.925400, 77.582900, 'Ramesh Kumar', '123456', 'f1f25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0063', 0, 'application/octet-stream', 'oneplus_handset_recovered', '["identity_theft","physical_device","handset"]', '2026-05-19T12:30:00Z', '2026-05-20T16:00:00Z');
```

### Step 12: Seed CustodyEvent
```sql
INSERT INTO CustodyEvent (id, evidenceId, timestamp, officerName, officerKgid, action, previousState, currentState, remarks) VALUES (1, 1, '2026-03-12T11:00:00Z', 'Ramesh Kumar', '123456', 'REGISTERED', 'None', 'SECURED', 'Seized wallet transfer details from complainant at PS console.');
INSERT INTO CustodyEvent (id, evidenceId, timestamp, officerName, officerKgid, action, previousState, currentState, remarks) VALUES (2, 2, '2026-04-05T10:15:00Z', 'Anil Gowda', '112233', 'REGISTERED', 'None', 'SECURED', 'Screenshotted suspect sedan vehicle license plates from intersection CCTV files.');
INSERT INTO CustodyEvent (id, evidenceId, timestamp, officerName, officerKgid, action, previousState, currentState, remarks) VALUES (3, 3, '2026-05-19T12:30:00Z', 'Ramesh Kumar', '123456', 'REGISTERED', 'None', 'SECURED', 'Physical recovery of suspect OnePlus 11R mobile handset during search warrant execution.');
INSERT INTO CustodyEvent (id, evidenceId, timestamp, officerName, officerKgid, action, previousState, currentState, remarks) VALUES (4, 3, '2026-05-20T16:00:00Z', 'Ramesh Kumar', '123456', 'STATUS_CHANGED', 'SECURED', 'SUBMITTED_TO_COURT', 'Transferred OnePlus handset to Court Registry under formal request seal.');
```

### Step 13: Seed ActivityLog
```sql
INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, timestamp) VALUES (1, 1, '104430006202600001', '202600001', 'Ramesh Kumar', 'CREATED', '2026-03-12T10:30:00Z');
INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, timestamp) VALUES (2, 2, '104430006202600002', '202600002', 'Anil Gowda', 'CREATED', '2026-04-05T09:15:00Z');
INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, timestamp) VALUES (3, 3, '104430006202600003', '202600003', 'Ramesh Kumar', 'CREATED', '2026-05-18T16:00:00Z');
INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, timestamp) VALUES (4, 3, '104430006202600003', '202600003', 'Ramesh Kumar', 'STATUS_CHANGED', '2026-05-20T14:30:00Z');
```

---

## Part 4 — REST API Seed Script (Alternative to ZCQL)

If you prefer scripted insertion using the Catalyst REST API instead of the ZCQL console, use the Node.js script at:

📄 `deployment/database/seed_via_api.js`

Prerequisites:
```bash
npm install node-fetch
```

Run:
```bash
node deployment/database/seed_via_api.js
```

The script reads your `PROJECT_ID` and `ACCESS_TOKEN` from environment variables:
```bash
# Set before running
set CATALYST_PROJECT_ID=your_project_id
set CATALYST_ACCESS_TOKEN=your_oauth_token
```

---

## Part 5 — Verification

After seeding, run these ZCQL SELECT queries in the console to verify record counts:

```sql
SELECT COUNT(*) FROM CaseCategory;       -- Expected: 4
SELECT COUNT(*) FROM GravityOffence;     -- Expected: 2
SELECT COUNT(*) FROM CrimeHead;          -- Expected: 4
SELECT COUNT(*) FROM CrimeSubHead;       -- Expected: 6
SELECT COUNT(*) FROM Unit;               -- Expected: 3
SELECT COUNT(*) FROM Employee;           -- Expected: 3
SELECT COUNT(*) FROM CaseMaster;         -- Expected: 3
SELECT COUNT(*) FROM Victim;             -- Expected: 3
SELECT COUNT(*) FROM Suspect;            -- Expected: 4
SELECT COUNT(*) FROM InvestigationNote;  -- Expected: 2
SELECT COUNT(*) FROM EvidenceMaster;     -- Expected: 3
SELECT COUNT(*) FROM CustodyEvent;       -- Expected: 4
SELECT COUNT(*) FROM ActivityLog;        -- Expected: 4
```

Verify the application can read the data:
- [ ] Login and confirm the Dashboard shows 3 active cases
- [ ] Navigate to a case and confirm victim, suspect, and notes load correctly
- [ ] Navigate to Evidence Vault and confirm 3 assets appear
- [ ] Check custody timeline for Evidence ID 3 shows 2 events (REGISTERED → SUBMITTED_TO_COURT)
