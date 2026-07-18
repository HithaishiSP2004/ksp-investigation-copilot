# Catalyst Data Store Verification Checklist

Ensure all checks in this list pass before completing the deployment.

---

## 1. Table Existence Verification
Run the following SQL query to verify all 16 tables exist:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```
*Expected Tables Checklist*:
- [ ] `CaseCategory`
- [ ] `GravityOffence`
- [ ] `CrimeHead`
- [ ] `CrimeSubHead`
- [ ] `Unit`
- [ ] `Employee`
- [ ] `CaseMaster`
- [ ] `Victim`
- [ ] `Suspect`
- [ ] `InvestigationNote`
- [ ] `EvidenceMaster`
- [ ] `CustodyEvent`
- [ ] `IntelligenceRecord`
- [ ] `ExtractedEntity`
- [ ] `ReviewEvent`
- [ ] `ActivityLog`

---

## 2. Seed Data Integrity Check
Verify that lookups and transactional seed rows have been inserted correctly:

- [ ] **Case Categories**: Run `SELECT COUNT(*) FROM CaseCategory;` (Expected: 4)
- [ ] **Gravity Levels**: Run `SELECT COUNT(*) FROM GravityOffence;` (Expected: 2)
- [ ] **Crime Heads**: Run `SELECT COUNT(*) FROM CrimeHead;` (Expected: 4)
- [ ] **Crime Sub-Heads**: Run `SELECT COUNT(*) FROM CrimeSubHead;` (Expected: 6)
- [ ] **Police Stations**: Run `SELECT COUNT(*) FROM Unit;` (Expected: 3)
- [ ] **Officers**: Run `SELECT COUNT(*) FROM Employee;` (Expected: 3)
- [ ] **FIR Cases**: Run `SELECT COUNT(*) FROM CaseMaster;` (Expected: 3)
- [ ] **Complainants / Victims**: Run `SELECT COUNT(*) FROM Victim;` (Expected: 3)
- [ ] **Accused / Suspects**: Run `SELECT COUNT(*) FROM Suspect;` (Expected: 4)
- [ ] **Investigation Notes**: Run `SELECT COUNT(*) FROM InvestigationNote;` (Expected: 2)
- [ ] **Forensic Evidence**: Run `SELECT COUNT(*) FROM EvidenceMaster;` (Expected: 3)
- [ ] **Custody Handover Logs**: Run `SELECT COUNT(*) FROM CustodyEvent;` (Expected: 4)
- [ ] **Activity Audits**: Run `SELECT COUNT(*) FROM ActivityLog;` (Expected: 4)

---

## 3. Foreign Key Constraint Checks
Run these validations to verify integrity constraints:
- [ ] **Cases Assigned**: `SELECT id, policePersonId FROM CaseMaster;` (Ensure all IDs match existing `Employee.id` values: 1 or 3)
- [ ] **Victims Linked**: `SELECT id, caseId FROM Victim;` (Ensure all caseIds match existing `CaseMaster.id` values: 1, 2, or 3)
- [ ] **Evidence Linked**: `SELECT id, caseId FROM EvidenceMaster;` (Ensure all caseIds match existing `CaseMaster.id` values: 1, 2, or 3)

---

## 4. Index Recommendations
Verify that primary performance indices exist:
- [ ] Unique index exists on `CaseMaster.crimeNo`
- [ ] Unique index exists on `EvidenceMaster.evidenceNo`
- [ ] Lookup indices exist on `CaseMaster.caseStatus` and `CaseMaster.policePersonId`
- [ ] Reference indices exist on `Victim.caseId`, `Suspect.caseId`, and `EvidenceMaster.caseId`

---

## 5. Repository Compatibility
Before release, verify matching models:
- [ ] All table and column names match the typescript interfaces in `src/features/cases/types/index.ts`, `src/features/evidence/types/index.ts`, and `src/features/intelligence/types/index.ts`.
- [ ] Data types in columns match application parsing schemas (e.g., coordinates stored as decimal numbers, dates as string formatted ISO stamps, tags as serialized JSON).
