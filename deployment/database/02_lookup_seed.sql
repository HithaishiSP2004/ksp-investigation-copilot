-- ============================================================================
-- 02_lookup_seed.sql — KSP AI Investigation Copilot
-- Lookup / Reference Table Seeds
-- Revision: 2026-07-19
-- ============================================================================
-- Run this AFTER tables are created in the Catalyst Console.
-- Execute each block in sequence via: Console → Data Store → Query Editor.
-- DateTime format for Catalyst: 'YYYY-MM-DD HH:MM:SS'
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CaseCategory
-- ----------------------------------------------------------------------------
INSERT INTO CaseCategory (id, name) VALUES (1, 'FIR');
INSERT INTO CaseCategory (id, name) VALUES (2, 'UDR');
INSERT INTO CaseCategory (id, name) VALUES (3, 'Zero FIR');
INSERT INTO CaseCategory (id, name) VALUES (4, 'PAR');

-- ----------------------------------------------------------------------------
-- 2. GravityOffence
-- ----------------------------------------------------------------------------
INSERT INTO GravityOffence (id, name) VALUES (1, 'Heinous');
INSERT INTO GravityOffence (id, name) VALUES (2, 'Non-Heinous');

-- ----------------------------------------------------------------------------
-- 3. CrimeHead
-- ----------------------------------------------------------------------------
INSERT INTO CrimeHead (id, name) VALUES (10, 'Crimes Against Property');
INSERT INTO CrimeHead (id, name) VALUES (20, 'Cyber Crime');
INSERT INTO CrimeHead (id, name) VALUES (30, 'Crimes Against Body');
INSERT INTO CrimeHead (id, name) VALUES (40, 'Economic Offenses');

-- ----------------------------------------------------------------------------
-- 4. CrimeSubHead
-- CANONICAL VALUES: use & not "and" — matches DATABASE_SCHEMA.md and TypeScript
-- ----------------------------------------------------------------------------
INSERT INTO CrimeSubHead (id, name) VALUES (101, 'House Break-in & Burglary');
INSERT INTO CrimeSubHead (id, name) VALUES (102, 'Armed Robbery');
INSERT INTO CrimeSubHead (id, name) VALUES (201, 'Identity Theft & Phishing');
INSERT INTO CrimeSubHead (id, name) VALUES (202, 'Online Financial Fraud');
INSERT INTO CrimeSubHead (id, name) VALUES (301, 'Murder');
INSERT INTO CrimeSubHead (id, name) VALUES (302, 'Grievous Hurt');

-- ----------------------------------------------------------------------------
-- 5. Unit
-- ----------------------------------------------------------------------------
INSERT INTO Unit (id, name, district) VALUES (6, 'Bengaluru Cyber Crime PS', 'Bengaluru City');
INSERT INTO Unit (id, name, district) VALUES (7, 'Malleshwaram Police Station', 'Bengaluru City');
INSERT INTO Unit (id, name, district) VALUES (8, 'Mysuru Town Police Station', 'Mysuru District');

-- ----------------------------------------------------------------------------
-- 6. Employee
-- ----------------------------------------------------------------------------
INSERT INTO Employee (id, kgid, firstName, lastName, rank, designation) VALUES (1, '123456', 'Ramesh', 'Kumar', 'Sub-Inspector', 'Investigating Officer');
INSERT INTO Employee (id, kgid, firstName, lastName, rank, designation) VALUES (2, '999999', 'Kiran', 'Reddy', 'DSP', 'Superintendent of Police');
INSERT INTO Employee (id, kgid, firstName, lastName, rank, designation) VALUES (3, '112233', 'Anil', 'Gowda', 'Inspector', 'Circle Officer');
