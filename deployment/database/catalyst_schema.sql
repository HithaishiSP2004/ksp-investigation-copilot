-- Catalyst Data Store Schema Definition
-- Conforming exactly to DATABASE_SCHEMA.md and application types

-- Drop existing tables if they exist to allow clean recreation
DROP TABLE IF EXISTS ActivityLog;
DROP TABLE IF EXISTS ReviewEvent;
DROP TABLE IF EXISTS ExtractedEntity;
DROP TABLE IF EXISTS IntelligenceRecord;
DROP TABLE IF EXISTS CustodyEvent;
DROP TABLE IF EXISTS EvidenceMaster;
DROP TABLE IF EXISTS InvestigationNote;
DROP TABLE IF EXISTS Suspect;
DROP TABLE IF EXISTS Victim;
DROP TABLE IF EXISTS CaseMaster;
DROP TABLE IF EXISTS Employee;
DROP TABLE IF EXISTS Unit;
DROP TABLE IF EXISTS CrimeSubHead;
DROP TABLE IF EXISTS CrimeHead;
DROP TABLE IF EXISTS GravityOffence;
DROP TABLE IF EXISTS CaseCategory;

-- ==========================================
-- 1. LOOKUP / REFERENCE TABLES
-- ==========================================

CREATE TABLE CaseCategory (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE GravityOffence (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE CrimeHead (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE CrimeSubHead (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Unit (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL
);

CREATE TABLE Employee (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    kgid VARCHAR(20) NOT NULL UNIQUE,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    rank VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL
);

-- ==========================================
-- 2. TRANSACTIONAL TABLES
-- ==========================================

CREATE TABLE CaseMaster (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    crimeNo VARCHAR(50) NOT NULL UNIQUE,
    caseNo VARCHAR(20) NOT NULL,
    crimeRegisteredDate VARCHAR(30) NOT NULL,
    policePersonId INT NOT NULL,
    policeStationId INT NOT NULL,
    caseCategoryId INT NOT NULL,
    gravityOffenceId INT NOT NULL,
    crimeMajorHeadId INT NOT NULL,
    crimeMinorHeadId INT NOT NULL,
    caseStatus VARCHAR(30) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    briefFacts TEXT NOT NULL,
    incidentFromDate VARCHAR(30) NOT NULL,
    incidentToDate VARCHAR(30) NOT NULL,
    infoReceivedPSDate VARCHAR(30) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    createdAt VARCHAR(30) NOT NULL,
    updatedAt VARCHAR(30) NOT NULL,
    FOREIGN KEY (policePersonId) REFERENCES Employee(id),
    FOREIGN KEY (policeStationId) REFERENCES Unit(id),
    FOREIGN KEY (caseCategoryId) REFERENCES CaseCategory(id),
    FOREIGN KEY (gravityOffenceId) REFERENCES GravityOffence(id),
    FOREIGN KEY (crimeMajorHeadId) REFERENCES CrimeHead(id),
    FOREIGN KEY (crimeMinorHeadId) REFERENCES CrimeSubHead(id)
);

CREATE TABLE Victim (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    caseId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    contact VARCHAR(50) NULL,
    description TEXT NULL,
    injuryType VARCHAR(50) NULL,
    FOREIGN KEY (caseId) REFERENCES CaseMaster(id)
);

CREATE TABLE Suspect (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    caseId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    contact VARCHAR(50) NULL,
    description TEXT NULL,
    status VARCHAR(30) NOT NULL,
    FOREIGN KEY (caseId) REFERENCES CaseMaster(id)
);

CREATE TABLE InvestigationNote (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    caseId INT NOT NULL,
    content TEXT NOT NULL,
    createdBy VARCHAR(255) NOT NULL,
    createdKgid VARCHAR(20) NOT NULL,
    createdAt VARCHAR(30) NOT NULL,
    updatedAt VARCHAR(30) NOT NULL,
    lastModifiedBy VARCHAR(255) NULL,
    lastModifiedKgid VARCHAR(20) NULL,
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (caseId) REFERENCES CaseMaster(id)
);

CREATE TABLE EvidenceMaster (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    evidenceNo VARCHAR(30) NOT NULL UNIQUE,
    caseId INT NOT NULL,
    crimeNo VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidenceType VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    collectionDate VARCHAR(20) NOT NULL,
    collectionTime VARCHAR(10) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    collectorName VARCHAR(255) NOT NULL,
    collectorKgid VARCHAR(20) NOT NULL,
    fileHash VARCHAR(100) NOT NULL,
    fileSize BIGINT NOT NULL,
    mimeType VARCHAR(100) NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    tags TEXT NULL, -- Serialized JSON string array
    ocrText TEXT NULL,
    aiLabels TEXT NULL, -- Serialized JSON string array
    analysisSummary TEXT NULL,
    createdAt VARCHAR(30) NOT NULL,
    updatedAt VARCHAR(30) NOT NULL,
    FOREIGN KEY (caseId) REFERENCES CaseMaster(id)
);

CREATE TABLE CustodyEvent (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    evidenceId INT NOT NULL,
    timestamp VARCHAR(30) NOT NULL,
    officerName VARCHAR(255) NOT NULL,
    officerKgid VARCHAR(20) NOT NULL,
    action VARCHAR(30) NOT NULL,
    previousState VARCHAR(100) NOT NULL,
    currentState VARCHAR(100) NOT NULL,
    remarks TEXT NOT NULL,
    FOREIGN KEY (evidenceId) REFERENCES EvidenceMaster(id)
);

-- ==========================================
-- 3. AI INTELLIGENCE / ANNOTATION TABLES
-- ==========================================

CREATE TABLE IntelligenceRecord (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(50) NOT NULL UNIQUE,
    evidenceId INT NOT NULL,
    version INT NOT NULL,
    analyzedAt VARCHAR(30) NOT NULL,
    ocrRawText TEXT NOT NULL,
    ocrConfidence DECIMAL(3, 2) NOT NULL,
    ocrProvider VARCHAR(100) NOT NULL,
    analysisSummary TEXT NOT NULL,
    aiLabels TEXT NOT NULL, -- Serialized JSON string array
    overallConfidence DECIMAL(3, 2) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    FOREIGN KEY (evidenceId) REFERENCES EvidenceMaster(id)
);

CREATE TABLE ExtractedEntity (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(50) NOT NULL UNIQUE,
    intelligenceRecordId VARCHAR(50) NOT NULL,
    sourceEvidenceId INT NOT NULL,
    value VARCHAR(500) NOT NULL,
    type VARCHAR(30) NOT NULL,
    confidence DECIMAL(3, 2) NOT NULL,
    extractionMethod VARCHAR(50) NOT NULL,
    extractedAt VARCHAR(30) NOT NULL,
    reviewStatus VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (intelligenceRecordId) REFERENCES IntelligenceRecord(id),
    FOREIGN KEY (sourceEvidenceId) REFERENCES EvidenceMaster(id)
);

CREATE TABLE ReviewEvent (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id VARCHAR(50) NOT NULL UNIQUE,
    entityId VARCHAR(50) NOT NULL,
    evidenceId INT NOT NULL,
    officerKgid VARCHAR(20) NOT NULL,
    officerName VARCHAR(255) NOT NULL,
    action VARCHAR(30) NOT NULL,
    previousStatus VARCHAR(20) NOT NULL,
    newStatus VARCHAR(20) NOT NULL,
    timestamp VARCHAR(30) NOT NULL,
    FOREIGN KEY (entityId) REFERENCES ExtractedEntity(id),
    FOREIGN KEY (evidenceId) REFERENCES EvidenceMaster(id)
);

CREATE TABLE ActivityLog (
    ROWID BIGINT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL UNIQUE,
    caseId INT NOT NULL,
    crimeNo VARCHAR(50) NOT NULL,
    caseNo VARCHAR(20) NOT NULL,
    officerName VARCHAR(255) NOT NULL,
    action VARCHAR(30) NOT NULL,
    timestamp VARCHAR(30) NOT NULL,
    FOREIGN KEY (caseId) REFERENCES CaseMaster(id)
);

-- ==========================================
-- 4. RECOMMENDED INDEXES
-- ==========================================
CREATE INDEX idx_casemaster_crimeno ON CaseMaster(crimeNo);
CREATE INDEX idx_casemaster_status ON CaseMaster(caseStatus);
CREATE INDEX idx_casemaster_officer ON CaseMaster(policePersonId);

CREATE INDEX idx_victim_case ON Victim(caseId);
CREATE INDEX idx_suspect_case ON Suspect(caseId);
CREATE INDEX idx_notes_case ON InvestigationNote(caseId);

CREATE INDEX idx_evidence_no ON EvidenceMaster(evidenceNo);
CREATE INDEX idx_evidence_case ON EvidenceMaster(caseId);
CREATE INDEX idx_evidence_status ON EvidenceMaster(status);

CREATE INDEX idx_custody_evidence ON CustodyEvent(evidenceId);
CREATE INDEX idx_intel_evidence ON IntelligenceRecord(evidenceId);
CREATE INDEX idx_entity_record ON ExtractedEntity(intelligenceRecordId);
CREATE INDEX idx_review_entity ON ReviewEvent(entityId);
CREATE INDEX idx_activity_case ON ActivityLog(caseId);
