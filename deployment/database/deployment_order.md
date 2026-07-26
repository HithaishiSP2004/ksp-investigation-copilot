# Deployment Order — KSP AI Investigation Copilot
## Catalyst Data Store Deployment Sequence
### Revision: 2026-07-19

---

## Overview

This document defines the exact file execution order and prerequisites for deploying the Catalyst Data Store from scratch.

> **Catalyst Console required**: Tables and columns must be created manually in the Catalyst Console. SQL files serve as the authoritative reference for what to configure.

---

## Prerequisites

1. Log in to [console.catalyst.zoho.com](https://console.catalyst.zoho.com)
2. Select project **KSP_Investigation_Copilot**
3. Navigate to **Storage → Data Store**

---

## Step 1 — Create Tables (`01_schema.sql`)

Open [01_schema.sql](./01_schema.sql) as your reference.

Create all 16 tables in this exact sequence in the Catalyst Console:

| # | Table | Action |
|---|-------|--------|
| 1 | `CaseCategory` | Create table |
| 2 | `GravityOffence` | Create table |
| 3 | `CrimeHead` | Create table |
| 4 | `CrimeSubHead` | Create table |
| 5 | `Unit` | Create table |
| 6 | `Employee` | Create table |
| 7 | `CaseMaster` | Create table — set FK columns as `Foreign Key` type |
| 8 | `Victim` | Create table — set `caseId` as `Foreign Key → CaseMaster` |
| 9 | `Suspect` | Create table — set `caseId` as `Foreign Key → CaseMaster` |
| 10 | `InvestigationNote` | Create table — set `caseId` as `Foreign Key → CaseMaster` |
| 11 | `EvidenceMaster` | Create table — set `caseId` as `Foreign Key → CaseMaster` |
| 12 | `CustodyEvent` | Create table — set `evidenceId` as `Foreign Key → EvidenceMaster` |
| 13 | `IntelligenceRecord` | Create table — set `evidenceId` as `Foreign Key → EvidenceMaster` |
| 14 | `ExtractedEntity` | Create table — set FK columns as `Foreign Key` |
| 15 | `ReviewEvent` | Create table — set FK columns as `Foreign Key` |
| 16 | `ActivityLog` | Create table — set `caseId` as `Foreign Key → CaseMaster` |

> ⚠️ **All relational columns must be `Foreign Key` type in Catalyst Console.** Setting them as `Int` breaks ZCQL JOIN queries.

---

## Step 2 — Apply Migrations (`04_migration.sql`)

Open [04_migration.sql](./04_migration.sql) for column details.

Manually add these columns in the Catalyst Console before seeding:

| Table | Column | Type | Mandatory |
|-------|--------|------|-----------|
| `EvidenceMaster` | `extractedEntities` | Text | No |
| `IntelligenceRecord` | `relationships` | Text | No |

---

## Step 3 — Seed Lookup Data (`02_lookup_seed.sql`)

Open [02_lookup_seed.sql](./02_lookup_seed.sql).  
Navigate to: **Console → Data Store → Query Editor**  
Run all INSERT statements. Verify with `SELECT COUNT(*) FROM CaseCategory;` → Expected: 4.

---

## Step 4 — Seed Demo Data (`03_demo_seed.sql`)

Open [03_demo_seed.sql](./03_demo_seed.sql).  
Run all INSERT blocks in sequence (Blocks 1–10).  
Each block can be run individually.

---

## Step 5 — Verify (`05_verify.sql`)

Open [05_verify.sql](./05_verify.sql).  
Run all verification queries.  
Confirm all expected row counts match.  
Confirm referential integrity JOIN queries return expected rows.

---

## Deprecated Files (Do Not Use for New Deployments)

| Old File | Replaced By |
|----------|-------------|
| `catalyst_schema.sql` | `01_schema.sql` |
| `seed_lookup_data.sql` | `02_lookup_seed.sql` |
| `seed_demo_data.sql` | `03_demo_seed.sql` |
| `seed.sql` | `02_lookup_seed.sql` + `03_demo_seed.sql` |
| `migration.sql` | `04_migration.sql` |

---

## Canonical File Structure

```
deployment/database/
├── 01_schema.sql          ← Create tables (Console reference)
├── 02_lookup_seed.sql     ← Seed lookup/reference tables
├── 03_demo_seed.sql       ← Seed transactional & AI demo data
├── 04_migration.sql       ← Add migration columns (Console reference)
├── 05_verify.sql          ← Post-deployment verification queries
├── DATABASE_BLUEPRINT.md  ← Full schema documentation (SSOT)
├── deployment_order.md    ← This file
└── execution_order.md     ← Step-by-step Console instructions
```
