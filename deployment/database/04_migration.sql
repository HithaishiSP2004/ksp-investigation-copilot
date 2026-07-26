-- ============================================================================
-- 04_migration.sql — KSP AI Investigation Copilot
-- Incremental Schema Migrations
-- Revision: 2026-07-19
-- ============================================================================
-- Contains ONLY ALTER TABLE statements for columns added after initial schema.
-- Run AFTER 01_schema.sql tables are created in the Catalyst Console.
-- Never re-creates tables. Never contains INSERT or SELECT statements.
-- ============================================================================
-- NOTE: Zoho Catalyst does NOT support ALTER TABLE via ZCQL.
--       These columns must be ADDED MANUALLY in the Catalyst Console:
--       Console → Data Store → [Table] → Edit → Add Column.
--       This file documents the exact columns and types to add.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- MIGRATION 001: Add extractedEntities to EvidenceMaster
-- Reason: TypeScript interface EvidenceMaster.extractedEntities (evidence/types/index.ts:30)
--         is written by IntelligenceService (intelligence-service.ts:99).
--         The original catalyst_schema.sql omitted this column.
-- ----------------------------------------------------------------------------
-- Console: EvidenceMaster → Add Column
--   Column Name : extractedEntities
--   Type        : Text
--   Mandatory   : No
--   PII/ePHI    : Yes  (contains extracted personal information)
ALTER TABLE EvidenceMaster ADD COLUMN extractedEntities Text NULL;


-- ----------------------------------------------------------------------------
-- MIGRATION 002: Add relationships to IntelligenceRecord
-- Reason: TypeScript interface IntelligenceRecord.relationships (intelligence/types/index.ts:85)
--         is rendered in intelligence-panel.tsx (lines 521-533) as a relationship graph.
--         Without this column, relationship data is lost after each analysis.
-- ----------------------------------------------------------------------------
-- Console: IntelligenceRecord → Add Column
--   Column Name : relationships
--   Type        : Text
--   Mandatory   : No
--   PII/ePHI    : No
ALTER TABLE IntelligenceRecord ADD COLUMN relationships Text NULL;


-- ============================================================================
-- FUTURE MIGRATIONS — add below this line with a new MIGRATION NNN block.
-- ============================================================================
