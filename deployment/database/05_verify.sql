-- ============================================================================
-- 05_verify.sql — KSP AI Investigation Copilot
-- Post-Deployment Verification Queries
-- Revision: 2026-07-19
-- ============================================================================
-- Run via: Console → Data Store → Query Editor
-- Expected row counts are listed as comments next to each query.
-- ============================================================================


-- ============================================================================
-- SECTION 1: Row Count Verification
-- ============================================================================

-- Lookup tables
SELECT COUNT(*) FROM CaseCategory;           -- Expected: 4
SELECT COUNT(*) FROM GravityOffence;         -- Expected: 2
SELECT COUNT(*) FROM CrimeHead;              -- Expected: 4
SELECT COUNT(*) FROM CrimeSubHead;           -- Expected: 6
SELECT COUNT(*) FROM Unit;                   -- Expected: 3
SELECT COUNT(*) FROM Employee;               -- Expected: 3

-- Transactional core tables
SELECT COUNT(*) FROM CaseMaster;             -- Expected: 3
SELECT COUNT(*) FROM Victim;                 -- Expected: 3
SELECT COUNT(*) FROM Suspect;                -- Expected: 4
SELECT COUNT(*) FROM InvestigationNote;      -- Expected: 3 (0 soft-deleted)
SELECT COUNT(*) FROM EvidenceMaster;         -- Expected: 3
SELECT COUNT(*) FROM CustodyEvent;           -- Expected: 4
SELECT COUNT(*) FROM ActivityLog;            -- Expected: 4

-- AI telemetry tables
SELECT COUNT(*) FROM IntelligenceRecord;     -- Expected: 1
SELECT COUNT(*) FROM ExtractedEntity;        -- Expected: 2
SELECT COUNT(*) FROM ReviewEvent;            -- Expected: 2


-- ============================================================================
-- SECTION 2: Lookup Value Integrity
-- ============================================================================

-- CrimeSubHead canonical values (must use & not 'and')
SELECT id, name FROM CrimeSubHead WHERE id IN (101, 201);
-- Expected:
--   101 | House Break-in & Burglary
--   201 | Identity Theft & Phishing

-- CaseCategory completeness
SELECT id, name FROM CaseCategory ORDER BY id;
-- Expected: FIR, UDR, Zero FIR, PAR

-- GravityOffence completeness
SELECT id, name FROM GravityOffence ORDER BY id;
-- Expected: Heinous, Non-Heinous


-- ============================================================================
-- SECTION 3: Referential Integrity Checks
-- ============================================================================

-- Cases reference valid officers and stations
SELECT id, crimeNo, caseStatus, policePersonId, policeStationId
FROM CaseMaster
ORDER BY id;
-- Expected: 3 rows, policePersonId in {1,3}, policeStationId in {6,7}

-- All victims reference existing cases
SELECT v.id, v.name, v.caseId, cm.crimeNo
FROM Victim v
JOIN CaseMaster cm ON v.caseId = cm.id;
-- Expected: 3 rows

-- All suspects reference existing cases
SELECT s.id, s.name, s.caseId, s.status
FROM Suspect s
JOIN CaseMaster cm ON s.caseId = cm.id;
-- Expected: 4 rows

-- Active notes (soft-delete check)
SELECT id, caseId, createdBy, isDeleted
FROM InvestigationNote
WHERE isDeleted = FALSE;
-- Expected: 3 rows

-- Evidence references valid cases
SELECT em.id, em.evidenceNo, em.caseId, em.status, em.extractedEntities
FROM EvidenceMaster em
JOIN CaseMaster cm ON em.caseId = cm.id
ORDER BY em.id;
-- Expected: 3 rows, extractedEntities column populated for rows 1 and 2

-- Custody chain for each evidence item
SELECT id, evidenceId, action, previousState, currentState, timestamp
FROM CustodyEvent
ORDER BY evidenceId, id;
-- Expected: 4 rows, continuity from REGISTERED → SUBMITTED_TO_COURT for evidence 3

-- Intelligence records reference valid evidence
SELECT ir.id, ir.evidenceId, ir.version, ir.relationships
FROM IntelligenceRecord ir
JOIN EvidenceMaster em ON ir.evidenceId = em.id;
-- Expected: 1 row, relationships column populated

-- Extracted entities reference valid intelligence records
SELECT ee.id, ee.type, ee.value, ee.reviewStatus, ee.intelligenceRecordId
FROM ExtractedEntity ee
JOIN IntelligenceRecord ir ON ee.intelligenceRecordId = ir.id;
-- Expected: 2 rows (Imran Khan: PERSON, 8899889988: PHONE), both ACCEPTED

-- Review events reference valid entities
SELECT rv.id, rv.entityId, rv.action, rv.officerKgid, rv.timestamp
FROM ReviewEvent rv
JOIN ExtractedEntity ee ON rv.entityId = ee.id;
-- Expected: 2 rows, action=ACCEPTED for both


-- ============================================================================
-- SECTION 4: Business Logic Validation
-- ============================================================================

-- Cases under active investigation
SELECT crimeNo, caseStatus, priority
FROM CaseMaster
WHERE caseStatus = 'UNDER_INVESTIGATION'
ORDER BY id;
-- Expected: 2 rows (cases 1 and 2)

-- High priority open cases
SELECT crimeNo, priority
FROM CaseMaster
WHERE priority = 'HIGH' AND caseStatus != 'CLOSED' AND caseStatus != 'ARCHIVED';
-- Expected: 1 row (104430006202600001)

-- All absconding suspects
SELECT id, name, caseId FROM Suspect WHERE status = 'ABSCONDING';
-- Expected: 2 rows (Venkatesh alias Kariya, Unknown caller posing as SBI agent)

-- Evidence not yet submitted to court
SELECT evidenceNo, status FROM EvidenceMaster WHERE status = 'SECURED';
-- Expected: 2 rows (EV-2026-000001, EV-2026-000002)

-- Pending entity reviews (should be empty after seeding)
SELECT id, value, type FROM ExtractedEntity WHERE reviewStatus = 'PENDING';
-- Expected: 0 rows (both entities were accepted during seeding)

-- Activity log: case creation events
SELECT caseId, action, officerName, timestamp
FROM ActivityLog
WHERE action = 'CREATED'
ORDER BY timestamp;
-- Expected: 3 rows


-- ============================================================================
-- SECTION 5: Column Existence Spot Check
-- ============================================================================
-- These queries verify that migration columns (extractedEntities, relationships)
-- exist on their respective tables. A SELECT error means the column is missing.

SELECT extractedEntities FROM EvidenceMaster LIMIT 1;
-- Expected: returns a row (NULL or JSON string). Error = column missing.

SELECT relationships FROM IntelligenceRecord LIMIT 1;
-- Expected: returns a row (NULL or JSON string). Error = column missing.
