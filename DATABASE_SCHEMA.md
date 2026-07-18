# DATABASE SCHEMA
## KSP AI Investigation Copilot — Zoho Catalyst Data Store

This document defines the exact Catalyst Data Store schema derived from the implemented application types, Zod validation rules, and repository mock data. It is sufficient to recreate the entire database from scratch.

---

## Table: `CaseCategory`

**Purpose**: Lookup table. Categorizes a case registration type (FIR, UDR, etc.).

### Columns

| Column Name | Data Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | Auto | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Business key matching seed values |
| `name` | String (50) | Yes | Yes | — | Category label e.g. `FIR`, `UDR`, `Zero FIR`, `PAR` |

### Relationships
None — referenced by `CaseMaster.caseCategoryId`.

### Index Recommendations
- `id` (unique)

### Seed Data

| id | name |
|---|---|
| 1 | FIR |
| 2 | UDR |
| 3 | Zero FIR |
| 4 | PAR |

---

## Table: `GravityOffence`

**Purpose**: Lookup table. Classifies the gravity level of the offence.

### Columns

| Column Name | Data Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | Auto | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Business key |
| `name` | String (50) | Yes | Yes | — | `Heinous` or `Non-Heinous` |

### Relationships
Referenced by `CaseMaster.gravityOffenceId`.

### Index Recommendations
- `id` (unique)

### Seed Data

| id | name |
|---|---|
| 1 | Heinous |
| 2 | Non-Heinous |

---

## Table: `CrimeHead`

**Purpose**: Lookup table. Major classification of the criminal offence.

### Columns

| Column Name | Data Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | Auto | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Business key |
| `name` | String (100) | Yes | No | — | Major head label |

### Relationships
Referenced by `CaseMaster.crimeMajorHeadId`.

### Seed Data

| id | name |
|---|---|
| 10 | Crimes Against Property |
| 20 | Cyber Crime |
| 30 | Crimes Against Body |
| 40 | Economic Offenses |

---

## Table: `CrimeSubHead`

**Purpose**: Lookup table. Sub-classification of the criminal offence under a major head.

### Columns

| Column Name | Data Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | Auto | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Business key |
| `name` | String (100) | Yes | No | — | Sub-head label |

### Relationships
Referenced by `CaseMaster.crimeMinorHeadId`.

### Seed Data

| id | name |
|---|---|
| 101 | House Break-in & Burglary |
| 102 | Armed Robbery |
| 201 | Identity Theft & Phishing |
| 202 | Online Financial Fraud |
| 301 | Murder |
| 302 | Grievous Hurt |

---

## Table: `Unit`

**Purpose**: Lookup table. Police station and district registry.

### Columns

| Column Name | Data Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | Auto | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Business key |
| `name` | String (255) | Yes | No | — | Police station name |
| `district` | String (100) | Yes | No | — | Administrative district |

### Relationships
Referenced by `CaseMaster.policeStationId`.

### Seed Data

| id | name | district |
|---|---|---|
| 6 | Bengaluru Cyber Crime PS | Bengaluru City |
| 7 | Malleshwaram Police Station | Bengaluru City |
| 8 | Mysuru Town Police Station | Mysuru District |

---

## Table: `Employee`

**Purpose**: Lookup table. Officer directory used for case assignment.

### Columns

| Column Name | Data Type | Required | Unique | Default | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | Auto | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Business key |
| `kgid` | String (20) | Yes | Yes | — | Government KGID number |
| `firstName` | String (100) | Yes | No | — | Officer first name |
| `lastName` | String (100) | Yes | No | — | Officer last name |
| `rank` | String (100) | Yes | No | — | Police rank e.g. `Sub-Inspector`, `DSP` |
| `designation` | String (100) | Yes | No | — | Job designation |

### Relationships
Referenced by `CaseMaster.policePersonId`.

### Index Recommendations
- `kgid` (unique)

### Seed Data

| id | kgid | firstName | lastName | rank | designation |
|---|---|---|---|---|---|
| 1 | 123456 | Ramesh | Kumar | Sub-Inspector | Investigating Officer |
| 2 | 999999 | Kiran | Reddy | DSP | Superintendent of Police |
| 3 | 112233 | Anil | Gowda | Inspector | Circle Officer |

---

## Table: `CaseMaster`

**Purpose**: Primary table for all FIR and case registration records.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Application-level sequential ID |
| `crimeNo` | String (50) | Yes | Yes | Non-empty | Structured FIR number e.g. `104430006202600001` |
| `caseNo` | String (20) | Yes | No | Non-empty | YYYY + 5-digit serial e.g. `202600001` |
| `crimeRegisteredDate` | String (30) | Yes | No | ISO 8601 | Date and time the FIR was registered |
| `policePersonId` | Number | Yes | No | Min 1 | FK → `Employee.id` |
| `policeStationId` | Number | Yes | No | Min 1 | FK → `Unit.id` |
| `caseCategoryId` | Number | Yes | No | Min 1 | FK → `CaseCategory.id` |
| `gravityOffenceId` | Number | Yes | No | Min 1 | FK → `GravityOffence.id` |
| `crimeMajorHeadId` | Number | Yes | No | Min 1 | FK → `CrimeHead.id` |
| `crimeMinorHeadId` | Number | Yes | No | Min 1 | FK → `CrimeSubHead.id` |
| `caseStatus` | String (30) | Yes | No | Enum | `UNDER_INVESTIGATION`, `CHARGE_SHEETED`, `CLOSED`, `ARCHIVED` |
| `priority` | String (10) | Yes | No | Enum | `HIGH`, `MEDIUM`, `LOW` |
| `briefFacts` | Long Text | Yes | No | Min 10 chars | Modus operandi, description of the offence |
| `incidentFromDate` | String (30) | Yes | No | ISO 8601 | Start of incident window |
| `incidentToDate` | String (30) | Yes | No | ISO 8601 | End of incident window |
| `infoReceivedPSDate` | String (30) | Yes | No | ISO 8601 | Date information was received at the station |
| `latitude` | Decimal | Yes | No | 11.0–19.0 | GPS latitude (Karnataka region bounds enforced) |
| `longitude` | Decimal | Yes | No | 74.0–79.0 | GPS longitude (Karnataka region bounds enforced) |
| `createdAt` | String (30) | Yes | No | ISO 8601 | Record creation timestamp |
| `updatedAt` | String (30) | Yes | No | ISO 8601 | Last update timestamp |

### Relationships
- **One CaseMaster → Many Victim** (`Victim.caseId`)
- **One CaseMaster → Many Suspect** (`Suspect.caseId`)
- **One CaseMaster → Many InvestigationNote** (`InvestigationNote.caseId`)
- **One CaseMaster → Many EvidenceMaster** (`EvidenceMaster.caseId`)

### Index Recommendations
- `crimeNo` (unique)
- `caseStatus`
- `policePersonId`
- `priority`
- `crimeRegisteredDate`

### Seed Data (3 records)

| id | crimeNo | caseStatus | priority | policePersonId | policeStationId |
|---|---|---|---|---|---|
| 1 | 104430006202600001 | UNDER_INVESTIGATION | HIGH | 1 | 6 |
| 2 | 104430006202600002 | UNDER_INVESTIGATION | MEDIUM | 3 | 7 |
| 3 | 104430006202600003 | CLOSED | LOW | 1 | 6 |

---

## Table: `Victim`

**Purpose**: Stores complainant and victim records linked to a specific case. Extends the unified Person model.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Application-level sequential ID |
| `caseId` | Number | Yes | No | Min 1 | FK → `CaseMaster.id` |
| `name` | String (255) | Yes | No | Non-empty | Full name of the victim |
| `age` | Number | Yes | No | ≥ 0 | Age in years |
| `contact` | String (50) | No | No | — | Contact phone number |
| `description` | Long Text | No | No | — | Role or background description |
| `injuryType` | String (50) | No | No | — | `None`, `Minor`, `Grievous`, `Fatal` |

### Relationships
- **Many Victim → One CaseMaster** (`caseId`)

### Index Recommendations
- `caseId`

### Seed Data

| id | caseId | name | age | contact | injuryType |
|---|---|---|---|---|---|
| 101 | 1 | Shivanna Gowda | 48 | +91 94808 12345 | None |
| 102 | 2 | Devika Rani | 34 | +91 94808 67890 | None |
| 103 | 3 | Meena Kumari | 24 | +91 99009 11223 | None |

---

## Table: `Suspect`

**Purpose**: Stores accused and suspect records linked to a case. Extends the unified Person model.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Application-level sequential ID |
| `caseId` | Number | Yes | No | Min 1 | FK → `CaseMaster.id` |
| `name` | String (255) | Yes | No | Non-empty | Full name or alias of the suspect |
| `age` | Number | Yes | No | ≥ 0 | Age in years (0 = unknown) |
| `contact` | String (50) | No | No | — | Contact phone or `Unknown` |
| `description` | Long Text | No | No | — | Role or background description |
| `status` | String (30) | Yes | No | Enum | `ABSCONDING`, `UNDER_CUSTODY`, `SUSPECTED`, `INTERROGATED` |

### Relationships
- **Many Suspect → One CaseMaster** (`caseId`)

### Index Recommendations
- `caseId`
- `status`

### Seed Data

| id | caseId | name | status |
|---|---|---|---|
| 201 | 1 | Unknown caller posing as SBI agent | ABSCONDING |
| 202 | 1 | Imran Khan | SUSPECTED |
| 203 | 2 | Venkatesh alias Kariya | ABSCONDING |
| 204 | 3 | Suresh P. | INTERROGATED |

---

## Table: `InvestigationNote`

**Purpose**: Investigation notes journal. Officers add entries during the case lifecycle. Soft-delete only — records are never physically removed.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Application-level sequential ID |
| `caseId` | Number | Yes | No | Min 1 | FK → `CaseMaster.id` |
| `content` | Long Text | Yes | No | Non-empty | Note body text |
| `createdBy` | String (255) | Yes | No | Non-empty | Officer full name |
| `createdKgid` | String (20) | Yes | No | Non-empty | Officer KGID |
| `createdAt` | String (30) | Yes | No | ISO 8601 | Creation timestamp |
| `updatedAt` | String (30) | Yes | No | ISO 8601 | Last edit timestamp |
| `lastModifiedBy` | String (255) | No | No | — | Name of officer who last edited |
| `lastModifiedKgid` | String (20) | No | No | — | KGID of officer who last edited |
| `isDeleted` | Boolean | Yes | No | — | Soft-delete flag. `false` by default |

> **Constraint**: No physical DELETE operations permitted. Set `isDeleted = true` to archive. All queries must filter `isDeleted = false`.

### Relationships
- **Many InvestigationNote → One CaseMaster** (`caseId`)

### Index Recommendations
- `caseId`
- `isDeleted`
- `createdAt`

### Seed Data (2 records for caseId: 1)

| id | caseId | createdBy | createdKgid | isDeleted |
|---|---|---|---|---|
| 1 | 1 | Ramesh Kumar | 123456 | false |
| 2 | 1 | Ramesh Kumar | 123456 | false |

---

## Table: `EvidenceMaster`

**Purpose**: Forensic asset registry. Stores metadata for all collected physical and digital evidence items.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Application-level sequential ID |
| `evidenceNo` | String (30) | Yes | Yes | Pattern `EV-YYYY-NNNNNN` | Human-readable reference code |
| `caseId` | Number | Yes | No | Min 1 | FK → `CaseMaster.id` |
| `crimeNo` | String (50) | Yes | No | Non-empty | FIR number denormalized for search |
| `title` | String (255) | Yes | No | Non-empty | Short title of the asset |
| `description` | Long Text | Yes | No | Non-empty | Detailed description |
| `evidenceType` | String (20) | Yes | No | Enum | `PHYSICAL`, `DIGITAL`, `DOCUMENT`, `IMAGE`, `VIDEO`, `AUDIO`, `DEVICE` |
| `status` | String (30) | Yes | No | Enum | `SECURED`, `IN_TRANSIT`, `RELEASED`, `SUBMITTED_TO_COURT`, `ARCHIVED` |
| `collectionDate` | String (20) | Yes | No | Date string `YYYY-MM-DD` | Date the asset was collected |
| `collectionTime` | String (10) | Yes | No | `HH:MM` | Time of collection |
| `latitude` | Decimal | Yes | No | 11.0–19.0 | GPS latitude of collection point |
| `longitude` | Decimal | Yes | No | 74.0–79.0 | GPS longitude of collection point |
| `collectorName` | String (255) | Yes | No | Non-empty | Name of collecting officer |
| `collectorKgid` | String (20) | Yes | No | Non-empty | KGID of collecting officer |
| `fileHash` | String (100) | Yes | No | Non-empty | SHA-256 checksum of the file |
| `fileSize` | Number | Yes | No | ≥ 0 | File size in bytes |
| `mimeType` | String (100) | Yes | No | Non-empty | MIME type e.g. `application/pdf` |
| `fileName` | String (255) | Yes | No | Non-empty | Original file name |
| `tags` | Long Text | No | No | JSON array | Serialized `string[]` of classification tags |
| `ocrText` | Long Text | No | No | — | Raw text extracted by OCR provider (AI slot) |
| `aiLabels` | Long Text | No | No | JSON array | Serialized classification labels (AI slot) |
| `analysisSummary` | Long Text | No | No | — | AI analysis summary text (AI slot) |
| `createdAt` | String (30) | Yes | No | ISO 8601 | Registration timestamp |
| `updatedAt` | String (30) | Yes | No | ISO 8601 | Last update timestamp |

### Relationships
- **Many EvidenceMaster → One CaseMaster** (`caseId`)
- **One EvidenceMaster → Many CustodyEvent** (`CustodyEvent.evidenceId`)
- **One EvidenceMaster → Many IntelligenceRecord** (`IntelligenceRecord.evidenceId`)

### Index Recommendations
- `evidenceNo` (unique)
- `caseId`
- `status`
- `evidenceType`
- `collectorKgid`

### Seed Data (3 records)

| id | evidenceNo | caseId | evidenceType | status |
|---|---|---|---|---|
| 1 | EV-2026-000001 | 1 | DOCUMENT | SECURED |
| 2 | EV-2026-000002 | 2 | IMAGE | SECURED |
| 3 | EV-2026-000003 | 3 | DEVICE | SUBMITTED_TO_COURT |

---

## Table: `CustodyEvent`

**Purpose**: Immutable, append-only chain-of-custody log. Generated automatically by the service layer on every status change, tagging, or transfer. Never edited or deleted.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Application-level sequential ID |
| `evidenceId` | Number | Yes | No | Min 1 | FK → `EvidenceMaster.id` |
| `timestamp` | String (30) | Yes | No | ISO 8601 | Event timestamp |
| `officerName` | String (255) | Yes | No | Non-empty | Name of acting officer |
| `officerKgid` | String (20) | Yes | No | Non-empty | KGID of acting officer |
| `action` | String (30) | Yes | No | Enum | `REGISTERED`, `TRANSFERRED`, `STATUS_CHANGED`, `TAGGED`, `ARCHIVED`, `AI_CLASSIFICATION` |
| `previousState` | String (100) | Yes | No | Non-empty | State before event (use `None` for first entry) |
| `currentState` | String (100) | Yes | No | Non-empty | State after event |
| `remarks` | Long Text | Yes | No | Non-empty | Officer justification note |

> **Constraint**: No UPDATE or DELETE operations permitted on this table. Enforced at the `EvidenceService` layer. All writes are INSERT-only.

### Relationships
- **Many CustodyEvent → One EvidenceMaster** (`evidenceId`)

### Index Recommendations
- `evidenceId`
- `timestamp`

### Seed Data (4 records)

| id | evidenceId | action | previousState | currentState |
|---|---|---|---|---|
| 1 | 1 | REGISTERED | None | SECURED |
| 2 | 2 | REGISTERED | None | SECURED |
| 3 | 3 | REGISTERED | None | SECURED |
| 4 | 3 | STATUS_CHANGED | SECURED | SUBMITTED_TO_COURT |

---

## Table: `IntelligenceRecord`

**Purpose**: Versioned AI analysis record for a single evidence asset. Each re-analysis creates a new version; all versions are retained. The UI displays only the latest version.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | String (50) | Yes | Yes | UUID | Stable UUID |
| `evidenceId` | Number | Yes | No | Min 1 | FK → `EvidenceMaster.id` |
| `version` | Number | Yes | No | Min 1 | Monotonically increasing per evidence asset |
| `analyzedAt` | String (30) | Yes | No | ISO 8601 | Timestamp of analysis run |
| `ocrRawText` | Long Text | Yes | No | — | Full OCR text extracted from evidence |
| `ocrConfidence` | Decimal | Yes | No | 0.0–1.0 | OCR confidence score |
| `ocrProvider` | String (100) | Yes | No | Non-empty | Provider attribution e.g. `MOCK_OCR`, `CATALYST_ZIA_OCR` |
| `analysisSummary` | Long Text | Yes | No | — | Human-readable AI analysis summary |
| `aiLabels` | Long Text | Yes | No | JSON array | Serialized classification label strings |
| `overallConfidence` | Decimal | Yes | No | 0.0–1.0 | Overall analysis confidence |
| `provider` | String (100) | Yes | No | Non-empty | Top-level provider attribution string |

### Relationships
- **Many IntelligenceRecord → One EvidenceMaster** (`evidenceId`)
- **One IntelligenceRecord → Many ExtractedEntity** (`ExtractedEntity.intelligenceRecordId`)

### Index Recommendations
- `evidenceId`
- `version`
- Composite: `(evidenceId, version)` — unique

---

## Table: `ExtractedEntity`

**Purpose**: Named entities extracted from evidence via OCR and NLP pipelines. Each entity carries a stable UUID so officer review decisions persist across re-analyses.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | String (50) | Yes | Yes | UUID | Stable entity UUID — never changes across re-analyses |
| `intelligenceRecordId` | String (50) | Yes | No | Non-empty | FK → `IntelligenceRecord.id` |
| `sourceEvidenceId` | Number | Yes | No | Min 1 | FK → `EvidenceMaster.id` (denormalized) |
| `value` | String (500) | Yes | No | Non-empty | Raw extracted text value |
| `type` | String (30) | Yes | No | Enum | `PERSON`, `PHONE`, `VEHICLE`, `ADDRESS`, `EMAIL`, `ORGANIZATION`, `DATE`, `TIME`, `CURRENCY`, `IDENTITY_NUMBER` |
| `confidence` | Decimal | Yes | No | 0.0–1.0 | Extraction confidence |
| `extractionMethod` | String (50) | Yes | No | Non-empty | `REGEX_PATTERN`, `ZIA_NLP`, `QUICKML_LLM` |
| `extractedAt` | String (30) | Yes | No | ISO 8601 | Extraction timestamp |
| `reviewStatus` | String (20) | Yes | No | Enum, Default `PENDING` | `PENDING`, `ACCEPTED`, `REJECTED` |

### Relationships
- **Many ExtractedEntity → One IntelligenceRecord** (`intelligenceRecordId`)
- **Many ExtractedEntity → One EvidenceMaster** (`sourceEvidenceId`)
- **One ExtractedEntity → Many ReviewEvent** (`ReviewEvent.entityId`)

### Index Recommendations
- `intelligenceRecordId`
- `sourceEvidenceId`
- `reviewStatus`
- `type`

---

## Table: `ReviewEvent`

**Purpose**: Immutable audit log of officer accept/reject decisions on AI-extracted entities. Append-only — never edited or deleted.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | String (50) | Yes | Yes | UUID | Unique event UUID |
| `entityId` | String (50) | Yes | No | Non-empty | FK → `ExtractedEntity.id` |
| `evidenceId` | Number | Yes | No | Min 1 | FK → `EvidenceMaster.id` (denormalized) |
| `officerKgid` | String (20) | Yes | No | Non-empty | KGID of the reviewing officer |
| `officerName` | String (255) | Yes | No | Non-empty | Full name of the reviewing officer |
| `action` | String (30) | Yes | No | Enum | `ACCEPTED`, `REJECTED`, `RESET_TO_PENDING` |
| `previousStatus` | String (20) | Yes | No | Enum | Prior review status |
| `newStatus` | String (20) | Yes | No | Enum | Resulting review status |
| `timestamp` | String (30) | Yes | No | ISO 8601 | Decision timestamp |

> **Constraint**: No UPDATE or DELETE operations. Enforced at `IntelligenceService` layer. All writes are INSERT-only.

### Relationships
- **Many ReviewEvent → One ExtractedEntity** (`entityId`)
- **Many ReviewEvent → One EvidenceMaster** (`evidenceId`)

### Index Recommendations
- `entityId`
- `evidenceId`
- `officerKgid`
- `timestamp`

---

## Table: `ActivityLog`

**Purpose**: Immutable system audit trail for case-level operations. Generated automatically when cases are created, updated, or archived, and when notes are added, edited, or deleted.

### Columns

| Column Name | Data Type | Required | Unique | Validation | Description |
|---|---|---|---|---|---|
| `ROWID` | Number | Auto | Yes | — | Catalyst-generated primary key |
| `id` | Number | Yes | Yes | — | Application-level sequential ID |
| `caseId` | Number | Yes | No | Min 1 | FK → `CaseMaster.id` |
| `crimeNo` | String (50) | Yes | No | Non-empty | FIR number (denormalized) |
| `caseNo` | String (20) | Yes | No | Non-empty | Case serial (denormalized) |
| `officerName` | String (255) | Yes | No | Non-empty | Name of the acting officer |
| `action` | String (30) | Yes | No | Enum | `CREATED`, `UPDATED`, `STATUS_CHANGED`, `ARCHIVED`, `NOTE_ADDED`, `NOTE_EDITED`, `NOTE_DELETED` |
| `timestamp` | String (30) | Yes | No | ISO 8601 | Event timestamp |

> **Constraint**: No UPDATE or DELETE operations. Enforced at the service layer.

### Relationships
- **Many ActivityLog → One CaseMaster** (`caseId`)

### Index Recommendations
- `caseId`
- `timestamp`

### Seed Data (4 records)

| id | caseId | action | timestamp |
|---|---|---|---|
| 1 | 1 | CREATED | 2026-03-12T10:30:00Z |
| 2 | 2 | CREATED | 2026-04-05T09:15:00Z |
| 3 | 3 | CREATED | 2026-05-18T16:00:00Z |
| 4 | 3 | STATUS_CHANGED | 2026-05-20T14:30:00Z |

---

## Entity Relationship Summary

```
CaseCategory ──┐
GravityOffence─┤
CrimeHead ─────┤
CrimeSubHead───┤
Unit ──────────┤──► CaseMaster ──► Victim          (1:M)
Employee───────┘         │
                         ├──► Suspect              (1:M)
                         ├──► InvestigationNote    (1:M)
                         ├──► ActivityLog          (1:M)
                         └──► EvidenceMaster ──► CustodyEvent        (1:M)
                                      │
                                      └──► IntelligenceRecord ──► ExtractedEntity ──► ReviewEvent (1:M)
```

---

## Validation Constraints Summary

| Rule | Tables | Enforcement Level |
|---|---|---|
| GPS coordinates within Karnataka (lat 11–19, lon 74–79) | `CaseMaster`, `EvidenceMaster` | Zod form validation + service layer |
| `briefFacts` minimum 10 characters | `CaseMaster` | Zod form validation |
| `evidenceNo` pattern `EV-YYYY-NNNNNN` | `EvidenceMaster` | Repository auto-generation |
| Append-only — no edits or deletes | `CustodyEvent`, `ReviewEvent`, `ActivityLog` | Service layer constraint |
| Soft-delete only | `InvestigationNote` | Service layer; `isDeleted = true` |
| Entity UUID stable across re-analyses | `ExtractedEntity` | Intelligence service |
| Version monotonically increasing | `IntelligenceRecord` | Intelligence repository |
