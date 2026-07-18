# Catalyst Data Store Deployment Order

Follow this exact sequence to configure the Zoho Catalyst Data Store for the KSP AI Investigation Copilot.

---

## 1. Database Table Creation

All SQL statements in `catalyst_schema.sql` must be executed in the exact order written. This satisfies all foreign key references during creation:

1. **Lookup / Reference Tables**:
   - `CaseCategory`
   - `GravityOffence`
   - `CrimeHead`
   - `CrimeSubHead`
   - `Unit`
   - `Employee`

2. **Core Transactional Tables**:
   - `CaseMaster` (Depends on all lookup tables)
   - `Victim` (Depends on `CaseMaster`)
   - `Suspect` (Depends on `CaseMaster`)
   - `InvestigationNote` (Depends on `CaseMaster`)
   - `EvidenceMaster` (Depends on `CaseMaster`)
   - `CustodyEvent` (Depends on `EvidenceMaster`)

3. **AI Intelligence & Audit Log Tables**:
   - `IntelligenceRecord` (Depends on `EvidenceMaster`)
   - `ExtractedEntity` (Depends on `IntelligenceRecord` and `EvidenceMaster`)
   - `ReviewEvent` (Depends on `ExtractedEntity` and `EvidenceMaster`)
   - `ActivityLog` (Depends on `CaseMaster`)

*Action*: Open the **Catalyst Data Store Console** -> **SQL Editor** and execute the tables creation scripts from `catalyst_schema.sql`.

---

## 2. Index Configuration

Ensure the recommended index definitions are created for the primary transactional columns to speed up dashboard metrics and search:

1. Index `crimeNo` and `caseStatus` on `CaseMaster`.
2. Index `caseId` on `Victim`, `Suspect`, and `InvestigationNote`.
3. Index `evidenceNo`, `caseId`, and `status` on `EvidenceMaster`.
4. Index `evidenceId` on `CustodyEvent`, `IntelligenceRecord`.
5. Index `intelligenceRecordId` on `ExtractedEntity`.
6. Index `entityId` on `ReviewEvent`.
7. Index `caseId` on `ActivityLog`.

---

## 3. Seed Lookup Data

Lookup and configuration tables must be populated before inserting transaction files.
Execute the SQL inserts in `seed_lookup_data.sql` inside the Catalyst SQL Console.

*Tables Populated*:
- `CaseCategory` (4 records)
- `GravityOffence` (2 records)
- `CrimeHead` (4 records)
- `CrimeSubHead` (6 records)
- `Unit` (3 records)
- `Employee` (3 records)

---

## 4. Seed Demo Data

Once reference indexes are active, populate transactional and timeline demo data.
Execute the SQL inserts in `seed_demo_data.sql` inside the Catalyst SQL Console.

*Tables Populated*:
- `CaseMaster` (3 records)
- `Victim` (3 records)
- `Suspect` (4 records)
- `InvestigationNote` (2 records)
- `EvidenceMaster` (3 records)
- `CustodyEvent` (4 records)
- `ActivityLog` (4 records)
- `IntelligenceRecord` (1 record)
- `ExtractedEntity` (2 records)
- `ReviewEvent` (2 records)
