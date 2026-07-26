# DATABASE BLUEPRINT
## KSP AI Investigation Copilot — Catalyst Data Store
### Revision: 2026-07-19 | Canonical Source of Truth

> This document is the **single source of truth** for the Catalyst Data Store schema.  
> All SQL files, TypeScript interfaces, repositories, and documentation must match this exactly.  
> If there is a conflict, **this document and the Catalyst Console take precedence**.

---

## Catalyst Data Type Reference

| Catalyst Type | SQL Equivalent | Max Size | Unique | Search Index |
|---|---|---|---|---|
| `VarChar` | VARCHAR(N) | 255 chars | ✅ | ✅ |
| `Text` | TEXT | 10,000 chars | ❌ | ❌ |
| `Int` | INT | ~10 digits | ✅ | ✅ |
| `BigInt` | BIGINT | ~19 digits | ✅ | ✅ |
| `Double` | DECIMAL/FLOAT | ~17 sig. digits | ❌ | ✅ |
| `Boolean` | BOOLEAN | true/false | ❌ | ✅ |
| `Date` | DATE | YYYY-MM-DD | ❌ | ✅ |
| `DateTime` | DATETIME | YYYY-MM-DD HH:MM:SS | ❌ | ✅ |
| `Foreign Key` | FK REFERENCE | parent table ref | ❌ | ✅ |
| `Encrypted Text` | — | PII encrypted | ❌ | ❌ |

> **`Text` columns cannot be Unique or Search Indexed.** Use `VarChar` for any column that needs either property.

---

## Section 1: Table Creation Order

| Step | Table | Type | Depends On |
|------|-------|------|------------|
| 1 | `CaseCategory` | Lookup | — |
| 2 | `GravityOffence` | Lookup | — |
| 3 | `CrimeHead` | Lookup | — |
| 4 | `CrimeSubHead` | Lookup | — |
| 5 | `Unit` | Lookup | — |
| 6 | `Employee` | Lookup | — |
| 7 | `CaseMaster` | Core | 1–6 |
| 8 | `Victim` | Core | 7 |
| 9 | `Suspect` | Core | 7 |
| 10 | `InvestigationNote` | Core | 7 |
| 11 | `EvidenceMaster` | Core | 7 |
| 12 | `CustodyEvent` | Event Log | 11 |
| 13 | `IntelligenceRecord` | AI | 11 |
| 14 | `ExtractedEntity` | AI | 11, 13 |
| 15 | `ReviewEvent` | AI Audit | 11, 14 |
| 16 | `ActivityLog` | Audit | 7 |

---

## Section 2: Schema — Every Table

---

### CaseCategory
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| name | VarChar(50) | Yes | Yes | — | — | FIR, UDR, Zero FIR, PAR |

---

### GravityOffence
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| name | VarChar(50) | Yes | Yes | — | — | Heinous, Non-Heinous |

---

### CrimeHead
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| name | VarChar(100) | Yes | No | — | — | |

---

### CrimeSubHead
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| name | VarChar(100) | Yes | No | — | — | Use `&` not `and` |

**Canonical seed values:**

| id | name |
|----|------|
| 101 | House Break-in & Burglary |
| 102 | Armed Robbery |
| 201 | Identity Theft & Phishing |
| 202 | Online Financial Fraud |
| 301 | Murder |
| 302 | Grievous Hurt |

---

### Unit
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| name | VarChar(255) | Yes | No | — | — | |
| district | VarChar(100) | Yes | No | — | — | |

---

### Employee
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| kgid | VarChar(20) | Yes | Yes | Yes | — | Gov ID |
| firstName | VarChar(100) | Yes | No | — | — | PII=Yes |
| lastName | VarChar(100) | Yes | No | — | — | PII=Yes |
| rank | VarChar(100) | Yes | No | — | — | |
| designation | VarChar(100) | Yes | No | — | — | |

---

### CaseMaster
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| crimeNo | VarChar(50) | Yes | Yes | Yes | — | Structured FIR no. |
| caseNo | VarChar(20) | Yes | No | — | — | YYYY + serial |
| crimeRegisteredDate | DateTime | Yes | No | — | — | |
| policePersonId | Foreign Key → Employee | Yes | No | Yes | — | |
| policeStationId | Foreign Key → Unit | Yes | No | — | — | |
| caseCategoryId | Foreign Key → CaseCategory | Yes | No | — | — | |
| gravityOffenceId | Foreign Key → GravityOffence | Yes | No | — | — | |
| crimeMajorHeadId | Foreign Key → CrimeHead | Yes | No | — | — | |
| crimeMinorHeadId | Foreign Key → CrimeSubHead | Yes | No | — | — | |
| caseStatus | VarChar(30) | Yes | No | Yes | — | UNDER_INVESTIGATION\|CHARGE_SHEETED\|CLOSED\|ARCHIVED |
| priority | VarChar(10) | Yes | No | — | — | HIGH\|MEDIUM\|LOW |
| briefFacts | Text | Yes | No | No | — | Min 10 chars (Zod enforced) |
| incidentFromDate | DateTime | Yes | No | — | — | |
| incidentToDate | DateTime | Yes | No | — | — | |
| infoReceivedPSDate | DateTime | Yes | No | — | — | |
| latitude | Double | Yes | No | — | — | Karnataka: 11.0–19.0 |
| longitude | Double | Yes | No | — | — | Karnataka: 74.0–79.0 |
| createdAt | DateTime | Yes | No | — | — | |
| updatedAt | DateTime | Yes | No | — | — | |

**PII**: Yes · **Relationships**: 1→M Victim, Suspect, InvestigationNote, EvidenceMaster, ActivityLog

---

### Victim
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| caseId | Foreign Key → CaseMaster | Yes | No | Yes | — | |
| name | VarChar(255) | Yes | No | — | — | PII=Yes |
| age | Int | Yes | No | — | — | ≥ 0 |
| contact | VarChar(50) | No | No | — | — | PII=Yes |
| description | Text | No | No | No | — | PII=Yes |
| injuryType | VarChar(50) | No | No | — | — | None\|Minor\|Grievous\|Fatal |

---

### Suspect
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| caseId | Foreign Key → CaseMaster | Yes | No | Yes | — | |
| name | VarChar(255) | Yes | No | — | — | PII=Yes |
| age | Int | Yes | No | — | — | 0 = unknown |
| contact | VarChar(50) | No | No | — | — | PII=Yes |
| description | Text | No | No | No | — | PII=Yes |
| status | VarChar(30) | Yes | No | Yes | — | ABSCONDING\|UNDER_CUSTODY\|SUSPECTED\|INTERROGATED |

---

### InvestigationNote
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| caseId | Foreign Key → CaseMaster | Yes | No | Yes | — | |
| content | Text | Yes | No | No | — | PII=Yes |
| createdBy | VarChar(255) | Yes | No | — | — | |
| createdKgid | VarChar(20) | Yes | No | — | — | |
| createdAt | DateTime | Yes | No | — | — | |
| updatedAt | DateTime | Yes | No | — | — | |
| lastModifiedBy | VarChar(255) | No | No | — | — | |
| lastModifiedKgid | VarChar(20) | No | No | — | — | |
| isDeleted | Boolean | Yes | No | Yes | false | Soft-delete flag |

> **Constraint**: No DELETE. Set `isDeleted = true` to archive.

---

### EvidenceMaster
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| evidenceNo | VarChar(30) | Yes | Yes | Yes | — | Pattern EV-YYYY-NNNNNN |
| caseId | Foreign Key → CaseMaster | Yes | No | Yes | — | |
| crimeNo | VarChar(50) | Yes | No | — | — | Denormalized |
| title | VarChar(255) | Yes | No | — | — | |
| description | Text | Yes | No | No | — | |
| evidenceType | VarChar(20) | Yes | No | — | — | PHYSICAL\|DIGITAL\|DOCUMENT\|IMAGE\|VIDEO\|AUDIO\|DEVICE |
| status | VarChar(30) | Yes | No | Yes | — | SECURED\|IN_TRANSIT\|RELEASED\|SUBMITTED_TO_COURT\|ARCHIVED |
| collectionDate | Date | Yes | No | — | — | YYYY-MM-DD |
| collectionTime | VarChar(10) | Yes | No | — | — | HH:MM |
| latitude | Double | Yes | No | — | — | PII=Yes, 11.0–19.0 |
| longitude | Double | Yes | No | — | — | PII=Yes, 74.0–79.0 |
| collectorName | VarChar(255) | Yes | No | — | — | |
| collectorKgid | VarChar(20) | Yes | No | Yes | — | |
| fileHash | VarChar(100) | Yes | No | — | — | SHA-256 |
| fileSize | BigInt | Yes | No | — | — | bytes |
| mimeType | VarChar(100) | Yes | No | — | — | |
| fileName | VarChar(255) | Yes | No | — | — | |
| tags | Text | No | No | No | — | JSON string[] |
| ocrText | Text | No | No | No | — | Raw OCR |
| aiLabels | Text | No | No | No | — | JSON string[] |
| analysisSummary | Text | No | No | No | — | |
| extractedEntities | Text | No | No | No | — | ⚠️ Added by MIGRATION 001 — JSON Record\<string,string[]\> |
| createdAt | DateTime | Yes | No | — | — | |
| updatedAt | DateTime | Yes | No | — | — | |

---

### CustodyEvent
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| evidenceId | Foreign Key → EvidenceMaster | Yes | No | Yes | — | |
| timestamp | DateTime | Yes | No | — | — | |
| officerName | VarChar(255) | Yes | No | — | — | |
| officerKgid | VarChar(20) | Yes | No | — | — | |
| action | VarChar(30) | Yes | No | — | — | REGISTERED\|TRANSFERRED\|STATUS_CHANGED\|TAGGED\|ARCHIVED\|AI_CLASSIFICATION |
| previousState | VarChar(100) | Yes | No | — | — | 'None' on first entry |
| currentState | VarChar(100) | Yes | No | — | — | |
| remarks | Text | Yes | No | No | — | |

> **Constraint**: INSERT only. No UPDATE or DELETE.

---

### IntelligenceRecord
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | VarChar(50) | Yes | Yes | — | — | UUID |
| evidenceId | Foreign Key → EvidenceMaster | Yes | No | Yes | — | |
| version | Int | Yes | No | — | — | Monotonically increasing |
| analyzedAt | DateTime | Yes | No | — | — | Maps to OcrResult.processedAt |
| ocrRawText | Text | Yes | No | No | — | Maps to OcrResult.rawText |
| ocrConfidence | Double | Yes | No | — | — | 0.0–1.0; maps to OcrResult.confidence |
| ocrProvider | VarChar(100) | Yes | No | — | — | Maps to OcrResult.provider |
| analysisSummary | Text | Yes | No | No | — | |
| aiLabels | Text | Yes | No | No | — | JSON string[] |
| overallConfidence | Double | Yes | No | — | — | 0.0–1.0 |
| provider | VarChar(100) | Yes | No | — | — | |
| relationships | Text | No | No | No | — | ⚠️ Added by MIGRATION 002 — JSON EntityRelationship[] |

> **Repository mapping note**: When reconstructing `IntelligenceRecord` from DB rows, map `analyzedAt → ocrResult.processedAt`. Load `ExtractedEntity` rows separately and assign to `entities[]`.

---

### ExtractedEntity
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | VarChar(50) | Yes | Yes | — | — | Stable UUID |
| intelligenceRecordId | Foreign Key → IntelligenceRecord | Yes | No | Yes | — | |
| sourceEvidenceId | Foreign Key → EvidenceMaster | Yes | No | — | — | Denormalized |
| value | Text | Yes | No | No | — | ⚠️ Text (not VarChar) — can exceed 255 chars |
| type | VarChar(30) | Yes | No | — | — | PERSON\|PHONE\|VEHICLE\|ADDRESS\|EMAIL\|ORGANIZATION\|DATE\|TIME\|CURRENCY\|IDENTITY_NUMBER |
| confidence | Double | Yes | No | — | — | 0.0–1.0 |
| extractionMethod | VarChar(50) | Yes | No | — | — | REGEX_PATTERN\|ZIA_NLP\|QUICKML_LLM |
| extractedAt | DateTime | Yes | No | — | — | |
| reviewStatus | VarChar(20) | Yes | No | Yes | 'PENDING' | PENDING\|ACCEPTED\|REJECTED |

---

### ReviewEvent
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | VarChar(50) | Yes | Yes | — | — | UUID |
| entityId | Foreign Key → ExtractedEntity | Yes | No | Yes | — | |
| evidenceId | Foreign Key → EvidenceMaster | Yes | No | — | — | Denormalized |
| officerKgid | VarChar(20) | Yes | No | — | — | |
| officerName | VarChar(255) | Yes | No | — | — | |
| action | VarChar(30) | Yes | No | — | — | ACCEPTED\|REJECTED\|RESET_TO_PENDING |
| previousStatus | VarChar(20) | Yes | No | — | — | |
| newStatus | VarChar(20) | Yes | No | — | — | |
| timestamp | DateTime | Yes | No | — | — | |

> **Constraint**: INSERT only. No UPDATE or DELETE.

---

### ActivityLog
| Column | Catalyst Type | Mandatory | Unique | Search Index | Default | Notes |
|--------|--------------|-----------|--------|-------------|---------|-------|
| ROWID | BigInt (auto) | — | — | — | — | System-managed |
| id | Int | Yes | Yes | — | — | Business key |
| caseId | Foreign Key → CaseMaster | Yes | No | Yes | — | |
| crimeNo | VarChar(50) | Yes | No | — | — | Denormalized |
| caseNo | VarChar(20) | Yes | No | — | — | Denormalized |
| officerName | VarChar(255) | Yes | No | — | — | |
| action | VarChar(30) | Yes | No | — | — | CREATED\|UPDATED\|STATUS_CHANGED\|ARCHIVED\|NOTE_ADDED\|NOTE_EDITED\|NOTE_DELETED |
| timestamp | DateTime | Yes | No | — | — | |

> **Constraint**: INSERT only. No UPDATE or DELETE.

---

## Section 3: Relationship Diagram

```
LOOKUP TIER
 CaseCategory ──┐
 GravityOffence ┤
 CrimeHead ─────┤──► CaseMaster
 CrimeSubHead ──┤       │
 Unit ──────────┤       ├──► Victim
 Employee ──────┘       ├──► Suspect
                         ├──► InvestigationNote
                         ├──► ActivityLog
                         └──► EvidenceMaster
                                   ├──► CustodyEvent
                                   └──► IntelligenceRecord
                                              └──► ExtractedEntity
                                                        └──► ReviewEvent

TypeScript Object → DB Column Mapping (IntelligenceRecord)
  record.analyzedAt          ←→  analyzedAt
  record.ocrResult.rawText   ←→  ocrRawText
  record.ocrResult.confidence←→  ocrConfidence
  record.ocrResult.provider  ←→  ocrProvider
  record.ocrResult.processedAt ←→ analyzedAt  (same field, different name)
  record.entities[]          ←→  ExtractedEntity rows (separate table)
  record.relationships[]     ←→  relationships (JSON.parse)
```

---

## Section 4: JSON Serialization Rules

All `Text` columns storing structured data must be handled as follows:

| Column | Table | TypeScript Type | On Write | On Read |
|--------|-------|-----------------|----------|---------|
| `tags` | EvidenceMaster | `string[]` | `JSON.stringify(arr)` | `JSON.parse(str)` |
| `aiLabels` | EvidenceMaster | `string[]` | `JSON.stringify(arr)` | `JSON.parse(str)` |
| `extractedEntities` | EvidenceMaster | `Record<string,string[]>` | `JSON.stringify(obj)` | `JSON.parse(str)` |
| `aiLabels` | IntelligenceRecord | `string[]` | `JSON.stringify(arr)` | `JSON.parse(str)` |
| `relationships` | IntelligenceRecord | `EntityRelationship[]` | `JSON.stringify(arr)` | `JSON.parse(str) ?? []` |

---

## Section 5: Deprecated Files

| File | Status | Replaced By |
|------|--------|-------------|
| `catalyst_schema.sql` | ⚠️ Deprecated | `01_schema.sql` |
| `seed_lookup_data.sql` | ⚠️ Deprecated | `02_lookup_seed.sql` |
| `seed_demo_data.sql` | ⚠️ Deprecated | `03_demo_seed.sql` |
| `seed.sql` | ⚠️ Deprecated | `02_lookup_seed.sql` + `03_demo_seed.sql` |
| `migration.sql` | ⚠️ Deprecated | `04_migration.sql` |

These files are retained for historical reference but **must not be used for new deployments**.
