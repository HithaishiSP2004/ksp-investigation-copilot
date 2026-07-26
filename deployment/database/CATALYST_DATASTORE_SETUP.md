# Catalyst Data Store Setup Guide
## KSP AI Investigation Copilot
### Revision: 2026-07-19

> **Important**: Zoho Catalyst does **not** support DDL (CREATE TABLE / ALTER TABLE) via ZCQL.  
> Tables and columns must be created manually in the Catalyst Console UI.  
> Seed data can be inserted via the Query Editor in the console, or programmatically via the REST API / SDK script.

---

## Part 1 — Create Tables in the Catalyst Console

### How to Open the Data Store
1. Log in to [console.catalyst.zoho.com](https://console.catalyst.zoho.com)
2. Select project **KSP_Investigation_Copilot**
3. Navigate to **Storage → Data Store**
4. Click **Create Table** for each table below in the listed order

---

### Table Creation Sequence (Dependency Order)

| Step | Table | Type | Relational Parent |
|------|-------|------|-------------------|
| 1 | `CaseCategory` | Lookup | — |
| 2 | `GravityOffence` | Lookup | — |
| 3 | `CrimeHead` | Lookup | — |
| 4 | `CrimeSubHead` | Lookup | — |
| 5 | `Unit` | Lookup | — |
| 6 | `Employee` | Lookup | — |
| 7 | `CaseMaster` | Core | 1, 2, 3, 4, 5, 6 |
| 8 | `Victim` | Core | 7 |
| 9 | `Suspect` | Core | 7 |
| 10 | `InvestigationNote` | Core | 7 |
| 11 | `EvidenceMaster` | Core | 7 |
| 12 | `CustodyEvent` | Event Log | 11 |
| 13 | `IntelligenceRecord` | AI Telemetry | 11 |
| 14 | `ExtractedEntity` | AI Telemetry | 11, 13 |
| 15 | `ReviewEvent` | AI Audit Trail | 11, 14 |
| 16 | `ActivityLog` | System Audit Trail | 7 |

---

### Table Schema Configuration Reference

> **Important Column Properties**:
> * **`VarChar(N)`**: Maximum `255` characters. Supports unique checks, default values, and search indexing.
> * **`Text`**: Maximum `10,000` characters. Supports **only** Mandatory and PII settings. **Cannot** be Unique or Search Indexed.
> * **`Foreign Key`**: Links a column to a parent table. Enables ZCQL JOIN queries. Select **Foreign Key** as the column type in the console UI.

---

#### 1. `CaseCategory`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `name` | VarChar | 50 | Yes | Yes | Yes | |

#### 2. `GravityOffence`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `name` | VarChar | 50 | Yes | Yes | Yes | |

#### 3. `CrimeHead`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `name` | VarChar | 100 | Yes | No | Yes | |

#### 4. `CrimeSubHead`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `name` | VarChar | 100 | Yes | No | Yes | Use `&` not `and` |

#### 5. `Unit`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `name` | VarChar | 255 | Yes | No | Yes | |
| `district` | VarChar | 100 | Yes | No | Yes | |

#### 6. `Employee`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `kgid` | VarChar | 20 | Yes | Yes | Yes | Government ID |
| `firstName` | VarChar | 100 | Yes | No | Yes | |
| `lastName` | VarChar | 100 | Yes | No | Yes | |
| `rank` | VarChar | 100 | Yes | No | Yes | |
| `designation` | VarChar | 100 | Yes | No | Yes | |

#### 7. `CaseMaster`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `crimeNo` | VarChar | 50 | Yes | Yes | Yes | Search Indexed |
| `caseNo` | VarChar | 20 | Yes | No | Yes | |
| `crimeRegisteredDate` | DateTime | — | Yes | No | Yes | |
| `policePersonId` | Foreign Key | — | Yes | No | Yes | Target: `Employee` |
| `policeStationId` | Foreign Key | — | Yes | No | Yes | Target: `Unit` |
| `caseCategoryId` | Foreign Key | — | Yes | No | Yes | Target: `CaseCategory` |
| `gravityOffenceId` | Foreign Key | — | Yes | No | Yes | Target: `GravityOffence` |
| `crimeMajorHeadId` | Foreign Key | — | Yes | No | Yes | Target: `CrimeHead` |
| `crimeMinorHeadId` | Foreign Key | — | Yes | No | Yes | Target: `CrimeSubHead` |
| `caseStatus` | VarChar | 30 | Yes | No | Yes | Enum: UNDER_INVESTIGATION... |
| `priority` | VarChar | 10 | Yes | No | Yes | Enum: HIGH | MEDIUM | LOW |
| `briefFacts` | Text | — | Yes | No | No | Narrative (no index) |
| `incidentFromDate` | DateTime | — | Yes | No | Yes | |
| `incidentToDate` | DateTime | — | Yes | No | Yes | |
| `infoReceivedPSDate` | DateTime | — | Yes | No | Yes | |
| `latitude` | Double | — | Yes | No | Yes | |
| `longitude` | Double | — | Yes | No | Yes | |
| `createdAt` | DateTime | — | Yes | No | Yes | |
| `updatedAt` | DateTime | — | Yes | No | Yes | |

#### 8. `Victim`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `caseId` | Foreign Key | — | Yes | No | Yes | Target: `CaseMaster` |
| `name` | VarChar | 255 | Yes | No | Yes | |
| `age` | Int | — | Yes | No | Yes | |
| `contact` | VarChar | 50 | No | No | Yes | |
| `description` | Text | — | No | No | No | PII=Yes |
| `injuryType` | VarChar | 50 | No | No | Yes | |

#### 9. `Suspect`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `caseId` | Foreign Key | — | Yes | No | Yes | Target: `CaseMaster` |
| `name` | VarChar | 255 | Yes | No | Yes | |
| `age` | Int | — | Yes | No | Yes | |
| `contact` | VarChar | 50 | No | No | Yes | |
| `description` | Text | — | No | No | No | PII=Yes |
| `status` | VarChar | 30 | Yes | No | Yes | Enum: ABSCONDING... |

#### 10. `InvestigationNote`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `caseId` | Foreign Key | — | Yes | No | Yes | Target: `CaseMaster` |
| `content` | Text | — | Yes | No | No | Journal body |
| `createdBy` | VarChar | 255 | Yes | No | Yes | |
| `createdKgid` | VarChar | 20 | Yes | No | Yes | |
| `createdAt` | DateTime | — | Yes | No | Yes | |
| `updatedAt` | DateTime | — | Yes | No | Yes | |
| `lastModifiedBy` | VarChar | 255 | No | No | Yes | |
| `lastModifiedKgid` | VarChar | 20 | No | No | Yes | |
| `isDeleted` | Boolean | — | Yes | No | Yes | Default: false |

#### 11. `EvidenceMaster`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `evidenceNo` | VarChar | 30 | Yes | Yes | Yes | Pattern EV-YYYY-NNNNNN |
| `caseId` | Foreign Key | — | Yes | No | Yes | Target: `CaseMaster` |
| `crimeNo` | VarChar | 50 | Yes | No | Yes | |
| `title` | VarChar | 255 | Yes | No | Yes | |
| `description` | Text | — | Yes | No | No | |
| `evidenceType` | VarChar | 20 | Yes | No | Yes | Enum: PHYSICAL | DIGITAL... |
| `status` | VarChar | 30 | Yes | No | Yes | Enum: SECURED... |
| `collectionDate` | Date | — | Yes | No | Yes | YYYY-MM-DD |
| `collectionTime` | VarChar | 10 | Yes | No | Yes | HH:MM |
| `latitude` | Double | — | Yes | No | Yes | |
| `longitude` | Double | — | Yes | No | Yes | |
| `collectorName` | VarChar | 255 | Yes | No | Yes | |
| `collectorKgid` | VarChar | 20 | Yes | No | Yes | |
| `fileHash` | VarChar | 100 | Yes | No | Yes | SHA-256 |
| `fileSize` | BigInt | — | Yes | No | Yes | bytes |
| `mimeType` | VarChar | 100 | Yes | No | Yes | |
| `fileName` | VarChar | 255 | Yes | No | Yes | |
| `tags` | Text | — | No | No | No | JSON string[] |
| `ocrText` | Text | — | No | No | No | Raw OCR Text |
| `aiLabels` | Text | — | No | No | No | JSON string[] |
| `analysisSummary` | Text | — | No | No | No | AI Summary |
| `extractedEntities` | Text | — | No | No | No | JSON Record (Added via migration) |
| `createdAt` | DateTime | — | Yes | No | Yes | |
| `updatedAt` | DateTime | — | Yes | No | Yes | |

#### 12. `CustodyEvent`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `evidenceId` | Foreign Key | — | Yes | No | Yes | Target: `EvidenceMaster` |
| `timestamp` | DateTime | — | Yes | No | Yes | |
| `officerName` | VarChar | 255 | Yes | No | Yes | |
| `officerKgid` | VarChar | 20 | Yes | No | Yes | |
| `action` | VarChar | 30 | Yes | No | Yes | Enum: REGISTERED... |
| `previousState` | VarChar | 100 | Yes | No | Yes | |
| `currentState` | VarChar | 100 | Yes | No | Yes | |
| `remarks` | Text | — | Yes | No | No | |

#### 13. `IntelligenceRecord`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | VarChar | 50 | Yes | Yes | Yes | Stable UUID |
| `evidenceId` | Foreign Key | — | Yes | No | Yes | Target: `EvidenceMaster` |
| `version` | Int | — | Yes | No | Yes | |
| `analyzedAt` | DateTime | — | Yes | No | Yes | |
| `ocrRawText` | Text | — | Yes | No | No | |
| `ocrConfidence` | Double | — | Yes | No | Yes | |
| `ocrProvider` | VarChar | 100 | Yes | No | Yes | |
| `analysisSummary` | Text | — | Yes | No | No | |
| `aiLabels` | Text | — | Yes | No | No | JSON string[] |
| `overallConfidence` | Double | — | Yes | No | Yes | |
| `provider` | VarChar | 100 | Yes | No | Yes | |
| `relationships` | Text | — | No | No | No | JSON EntityRelationship[] (Added via migration) |

#### 14. `ExtractedEntity`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | VarChar | 50 | Yes | Yes | Yes | Stable UUID |
| `intelligenceRecordId` | Foreign Key | — | Yes | No | Yes | Target: `IntelligenceRecord` |
| `sourceEvidenceId` | Foreign Key | — | Yes | No | Yes | Target: `EvidenceMaster` |
| `value` | Text | — | Yes | No | No | Text type (can exceed 255 chars) |
| `type` | VarChar | 30 | Yes | No | Yes | PERSON | PHONE... |
| `confidence` | Double | — | Yes | No | Yes | |
| `extractionMethod` | VarChar | 50 | Yes | No | Yes | |
| `extractedAt` | DateTime | — | Yes | No | Yes | |
| `reviewStatus` | VarChar | 20 | Yes | No | Yes | Default: 'PENDING' |

#### 15. `ReviewEvent`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | VarChar | 50 | Yes | Yes | Yes | Stable UUID |
| `entityId` | Foreign Key | — | Yes | No | Yes | Target: `ExtractedEntity` |
| `evidenceId` | Foreign Key | — | Yes | No | Yes | Target: `EvidenceMaster` |
| `officerKgid` | VarChar | 20 | Yes | No | Yes | |
| `officerName` | VarChar | 255 | Yes | No | Yes | |
| `action` | VarChar | 30 | Yes | No | Yes | Enum: ACCEPTED... |
| `previousStatus` | VarChar | 20 | Yes | No | Yes | |
| `newStatus` | VarChar | 20 | Yes | No | Yes | |
| `timestamp` | DateTime | — | Yes | No | Yes | |

#### 16. `ActivityLog`
| Column Name | Catalyst Type | Max Length | Required | Unique | Search Index | Notes |
|---|---|---|---|---|---|---|
| `id` | Int | — | Yes | Yes | Yes | Business key |
| `caseId` | Foreign Key | — | Yes | No | Yes | Target: `CaseMaster` |
| `crimeNo` | VarChar | 50 | Yes | No | Yes | |
| `caseNo` | VarChar | 20 | Yes | No | Yes | |
| `officerName` | VarChar | 255 | Yes | No | Yes | |
| `action` | VarChar | 30 | Yes | No | Yes | Enum: CREATED... |
| `timestamp` | DateTime | — | Yes | No | Yes | |

---

## Part 2 — Add Migration Columns

Add these columns manually in the console:
- `EvidenceMaster` → Add Column `extractedEntities` (Type: **Text**, Mandatory: **No**, PII: **Yes**)
- `IntelligenceRecord` → Add Column `relationships` (Type: **Text**, Mandatory: **No**)

---

## Part 3 — Seed Database

Choose **one** of the two seeding methods:

### Method A: Execute SQL via Console Query Editor
1. Open [`02_lookup_seed.sql`](./02_lookup_seed.sql) and run all INSERT statements.
2. Open [`03_demo_seed.sql`](./03_demo_seed.sql) and run all transactional and AI inserts.

### Method B: Run Seeder Script via REST API
1. Install dependencies:
   ```bash
   npm install node-fetch
   ```
2. Configure credentials in PowerShell:
   ```powershell
   $env:CATALYST_PROJECT_ID="your_project_id"
   $env:CATALYST_ACCESS_TOKEN="your_oauth_token"
   ```
3. Execute the script:
   ```bash
   node deployment/database/seed_via_api.js
   ```

---

## Part 4 — Verify Deployment

Open [`05_verify.sql`](./05_verify.sql). Run the queries in the **Query Editor** to confirm:
- Expected row counts are present
- All relations join correctly without ZCQL compilation errors
- No orphan rows are present
