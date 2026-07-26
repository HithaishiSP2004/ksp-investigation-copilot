# Execution Order — KSP AI Investigation Copilot
## Step-by-Step Catalyst Console Instructions
### Revision: 2026-07-19

---

## How to Use This Guide

Each step below maps to a specific SQL file. Open the file, follow the Console instructions, and run the queries.

> **Important**: Zoho Catalyst does NOT support `CREATE TABLE` or `ALTER TABLE` via ZCQL. All schema creation and column additions must be done through the **Catalyst Console UI**.

---

## PHASE 1: Schema Creation

**File**: [01_schema.sql](./01_schema.sql) (Console reference — read only)

### Step 1.1 — Open Console
1. Go to [console.catalyst.zoho.com](https://console.catalyst.zoho.com)
2. Select **KSP_Investigation_Copilot**
3. Go to **Storage → Data Store**

### Step 1.2 — Create Each Table
For each of the 16 tables in dependency order, click **Create Table** and add columns as specified in `01_schema.sql`.

**Critical type rules:**
- Never use `Number`, `Decimal`, `Float`, or `Long Text` — these are not supported
- Use `VarChar` (max 255) for short strings needing Unique or Search Index
- Use `Text` (max 10,000) for long narrative fields — **cannot** be Unique or Search Indexed
- Use `DateTime` for all date+time fields
- Use `Date` for date-only fields (`collectionDate`)
- Use `Double` for decimal values (coordinates, confidence scores)
- Use `Foreign Key` for all relationship references — NOT `Int`

---

## PHASE 2: Migration Columns

**File**: [04_migration.sql](./04_migration.sql) (Console reference — read only)

### Step 2.1 — Add `extractedEntities` to EvidenceMaster
1. Open `EvidenceMaster` table in Console
2. Click **Edit Table → Add Column**
3. Column name: `extractedEntities`
4. Type: **Text**
5. Mandatory: **No**
6. PII/ePHI: **Yes**

### Step 2.2 — Add `relationships` to IntelligenceRecord
1. Open `IntelligenceRecord` table in Console
2. Click **Edit Table → Add Column**
3. Column name: `relationships`
4. Type: **Text**
5. Mandatory: **No**
6. PII/ePHI: **No**

---

## PHASE 3: Seed Lookup Data

**File**: [02_lookup_seed.sql](./02_lookup_seed.sql)

1. Go to **Console → Data Store → Query Editor**
2. Copy and run each INSERT block in order:
   - Block 1: CaseCategory (4 rows)
   - Block 2: GravityOffence (2 rows)
   - Block 3: CrimeHead (4 rows)
   - Block 4: CrimeSubHead (6 rows) — **use `&` not `and`**
   - Block 5: Unit (3 rows)
   - Block 6: Employee (3 rows)

3. Verify: `SELECT COUNT(*) FROM Employee;` → Expected: 3

---

## PHASE 4: Seed Demo Data

**File**: [03_demo_seed.sql](./03_demo_seed.sql)

Run each block in sequence via Query Editor:

| Block | Table | Rows |
|-------|-------|------|
| 1 | CaseMaster | 3 |
| 2 | Victim | 3 |
| 3 | Suspect | 4 |
| 4 | InvestigationNote | 3 |
| 5 | EvidenceMaster | 3 |
| 6 | CustodyEvent | 4 |
| 7 | ActivityLog | 4 |
| 8 | IntelligenceRecord | 1 |
| 9 | ExtractedEntity | 2 |
| 10 | ReviewEvent | 2 |

> **DateTime format**: All `DateTime` values use `'YYYY-MM-DD HH:MM:SS'` format (not ISO 8601 with `T` and `Z`).

---

## PHASE 5: Verification

**File**: [05_verify.sql](./05_verify.sql)

Run all verification queries. Confirm:

| Check | Expected |
|-------|----------|
| CaseCategory count | 4 |
| GravityOffence count | 2 |
| CrimeHead count | 4 |
| CrimeSubHead count | 6 |
| Unit count | 3 |
| Employee count | 3 |
| CaseMaster count | 3 |
| Victim count | 3 |
| Suspect count | 4 |
| InvestigationNote count | 3 |
| EvidenceMaster count | 3 |
| CustodyEvent count | 4 |
| ActivityLog count | 4 |
| IntelligenceRecord count | 1 |
| ExtractedEntity count | 2 |
| ReviewEvent count | 2 |
| `extractedEntities` column exists | No SELECT error |
| `relationships` column exists | No SELECT error |
| CrimeSubHead id=101 name | House Break-in & Burglary |
| Active investigation cases | 2 rows |

---

## Recommended Search Indexes (Configure in Console)

After creating tables, enable Search Index on these columns for query performance:

| Table | Column |
|-------|--------|
| Employee | kgid |
| CaseMaster | crimeNo, caseStatus, policePersonId |
| Victim | caseId |
| Suspect | caseId, status |
| InvestigationNote | caseId, isDeleted |
| EvidenceMaster | evidenceNo, caseId, status, collectorKgid |
| CustodyEvent | evidenceId |
| IntelligenceRecord | evidenceId |
| ExtractedEntity | intelligenceRecordId, reviewStatus |
| ReviewEvent | entityId |
| ActivityLog | caseId |
