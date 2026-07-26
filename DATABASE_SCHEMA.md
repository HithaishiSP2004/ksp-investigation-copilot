# DATABASE SCHEMA
## KSP AI Investigation Copilot — Zoho Catalyst Data Store
### Revision: 2026-07-19 | Single Source of Truth Redirect

> **Important**: This document has been synchronized and consolidated into the canonical database deployment package.

To view the authoritative schema, column attributes, indexes, and database relationship map, please refer to the primary single source of truth (SSOT) document:

👉 **[deployment/database/DATABASE_BLUEPRINT.md](./deployment/database/DATABASE_BLUEPRINT.md)**

---

## Canonical Deployment Package Files

For database creation and seeding, use the following execution scripts:

1. **[`01_schema.sql`](./deployment/database/01_schema.sql)** — authoritative DDL structure using only the 10 Catalyst-supported types.
2. **[`02_lookup_seed.sql`](./deployment/database/02_lookup_seed.sql)** — lookup table seeds (using `&` for `CrimeSubHead` to match frontend typings).
3. **[`03_demo_seed.sql`](./deployment/database/03_demo_seed.sql)** — AI-enriched transactional and demo seed statements in Catalyst-supported DateTime format (`YYYY-MM-DD HH:MM:SS`).
4. **[`04_migration.sql`](./deployment/database/04_migration.sql)** — Incremental columns (`extractedEntities` and `relationships`).
5. **[`05_verify.sql`](./deployment/database/05_verify.sql)** — Count matching, lookup integrity checks, and validation of joins.

---

## Catalyst-Native Data Type Rules

All schema definitions, code variables, and scripts must adhere strictly to these Catalyst Console data types:
* **`VarChar(N)`** (maximum `255` characters; supports Unique, Search Index, Default, Mandatory).
* **`Text`** (maximum `10,000` characters; supports **only** Mandatory and PII; **no** Unique or Search Index support).
* **`Int`** / **`BigInt`** (standard and large numeric types).
* **`Double`** (decimal/float representations).
* **`Boolean`** (logical true/false).
* **`Date`** / **`DateTime`** (date and timestamp fields).
* **`Foreign Key`** (Console-enforced relationship joins).
* **`Encrypted Text`** (sensitive field encryption).

For detailed setup instructions, see the **[Catalyst Console Setup Guide](./deployment/database/CATALYST_DATASTORE_SETUP.md)**.
