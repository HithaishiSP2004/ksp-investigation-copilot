-- ============================================================================
-- 03_demo_seed.sql — KSP AI Investigation Copilot
-- Transactional & AI Demo Data Seeds
-- Revision: 2026-07-19
-- ============================================================================
-- Run AFTER 02_lookup_seed.sql.
-- DateTime format for Catalyst: 'YYYY-MM-DD HH:MM:SS'
-- Date format for Catalyst:     'YYYY-MM-DD'
-- Text columns storing JSON: insert raw JSON string (no outer quotes escaping needed).
-- ============================================================================


-- ============================================================================
-- BLOCK 1: CaseMaster (3 demo cases)
-- ============================================================================

INSERT INTO CaseMaster (
    id, crimeNo, caseNo, crimeRegisteredDate,
    policePersonId, policeStationId, caseCategoryId, gravityOffenceId,
    crimeMajorHeadId, crimeMinorHeadId,
    caseStatus, casePriority, briefFacts,
    incidentFromDate, incidentToDate, infoReceivedPSDate,
    latitude, longitude, createdAt, updatedAt
) VALUES (
    1,
    '104430006202600001',
    '202600001',
    '2026-03-12 10:30:00',
    1, 6, 1, 2,
    20, 202,
    'UNDER_INVESTIGATION',
    'HIGH',
    'The complainant reports that on 2026-03-11, they received a text message containing a phishing link posing as their bank. Upon clicking the link and entering credentials, unauthorized transactions amounting to Rs.1,50,000 were debited from their savings account to a suspicious merchant wallet.',
    '2026-03-11 14:00:00',
    '2026-03-11 14:30:00',
    '2026-03-12 09:00:00',
    12.971600, 77.594600,
    '2026-03-12 10:30:00',
    '2026-03-12 10:30:00'
);

INSERT INTO CaseMaster (
    id, crimeNo, caseNo, crimeRegisteredDate,
    policePersonId, policeStationId, caseCategoryId, gravityOffenceId,
    crimeMajorHeadId, crimeMinorHeadId,
    caseStatus, casePriority, briefFacts,
    incidentFromDate, incidentToDate, infoReceivedPSDate,
    latitude, longitude, createdAt, updatedAt
) VALUES (
    2,
    '104430006202600002',
    '202600002',
    '2026-04-05 09:15:00',
    3, 7, 1, 1,
    10, 101,
    'UNDER_INVESTIGATION',
    'MEDIUM',
    'Between 2026-04-04 18:00 and 2026-04-05 06:00, unknown perpetrators broke the lock of the rear gate of a residential villa and stole gold jewelry weighing approximately 120 grams and Rs.50,000 in cash. The occupants were away traveling.',
    '2026-04-04 18:00:00',
    '2026-04-05 06:00:00',
    '2026-04-05 08:00:00',
    12.992200, 77.571200,
    '2026-04-05 09:15:00',
    '2026-04-05 09:15:00'
);

INSERT INTO CaseMaster (
    id, crimeNo, caseNo, crimeRegisteredDate,
    policePersonId, policeStationId, caseCategoryId, gravityOffenceId,
    crimeMajorHeadId, crimeMinorHeadId,
    caseStatus, casePriority, briefFacts,
    incidentFromDate, incidentToDate, infoReceivedPSDate,
    latitude, longitude, createdAt, updatedAt
) VALUES (
    3,
    '104430006202600003',
    '202600003',
    '2026-05-18 16:00:00',
    1, 6, 1, 2,
    20, 201,
    'CLOSED',
    'LOW',
    'Suspect Suresh P. created a fraudulent social media profile mimicking the complainant''s identity and solicited financial loans from the complainant''s contact list, resulting in online scam transfers.',
    '2026-05-10 09:00:00',
    '2026-05-15 18:00:00',
    '2026-05-18 11:00:00',
    12.925400, 77.582900,
    '2026-05-18 16:00:00',
    '2026-05-20 14:30:00'
);


-- ============================================================================
-- BLOCK 2: Victim (3 victims, one per case)
-- ============================================================================

INSERT INTO Victim (id, caseId, name, age, contact, description, injuryType) VALUES (101, 1, 'Shivanna Gowda', 48, '+91 94808 12345', 'Complainant whose retirement savings were targeted', 'None');
INSERT INTO Victim (id, caseId, name, age, contact, description, injuryType) VALUES (102, 2, 'Devika Rani', 34, '+91 94808 67890', 'Homeowner', 'None');
INSERT INTO Victim (id, caseId, name, age, contact, description, injuryType) VALUES (103, 3, 'Meena Kumari', 24, '+91 99009 11223', 'College student', 'None');


-- ============================================================================
-- BLOCK 3: Suspect (4 suspects)
-- ============================================================================

INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (201, 1, 'Unknown caller posing as SBI agent', 0, 'Unknown', 'Voice phishing perpetrator', 'ABSCONDING');
INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (202, 1, 'Imran Khan', 29, '8899889988', 'Mule account owner registered in Jamtara', 'SUSPECTED');
INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (203, 2, 'Venkatesh alias Kariya', 32, 'Unknown', 'Known offender active in Malleshwaram area', 'ABSCONDING');
INSERT INTO Suspect (id, caseId, name, age, contact, description, status) VALUES (204, 3, 'Suresh P.', 25, '7766554433', 'Former classmate of victim', 'INTERROGATED');


-- ============================================================================
-- BLOCK 4: InvestigationNote (2 notes for case 1, 1 for case 2)
-- ============================================================================

INSERT INTO InvestigationNote (
    id, caseId, content, createdBy, createdKgid, createdAt, updatedAt, isDeleted
) VALUES (
    1, 1,
    'Sent official requisition letters to the bank''s fraud monitoring team requesting transaction IP logs and beneficiary wallet registration documents.',
    'Ramesh Kumar', '123456',
    '2026-03-12 11:30:00', '2026-03-12 11:30:00',
    FALSE
);

INSERT INTO InvestigationNote (
    id, caseId, content, createdBy, createdKgid, createdAt, updatedAt, isDeleted
) VALUES (
    2, 1,
    'CDR details of the suspect mobile number received. Analysing cell tower locations pointing to locations near Deoghar, Jharkhand.',
    'Ramesh Kumar', '123456',
    '2026-03-14 14:20:00', '2026-03-14 14:20:00',
    FALSE
);

INSERT INTO InvestigationNote (
    id, caseId, content, createdBy, createdKgid, createdAt, updatedAt, isDeleted
) VALUES (
    3, 2,
    'Retrieved local CCTV footage from neighboring intersection. A silver sedan was spotted idling near the gate during the incident window. Enhancing registration numbers.',
    'Anil Gowda', '112233',
    '2026-04-05 10:45:00', '2026-04-05 10:45:00',
    FALSE
);


-- ============================================================================
-- BLOCK 5: EvidenceMaster (3 evidence items)
-- Includes extractedEntities column (added via 04_migration.sql)
-- ============================================================================

INSERT INTO EvidenceMaster (
    id, evidenceNo, caseId, crimeNo, title, description, evidenceType, status,
    collectionDate, collectionTime, latitude, longitude,
    collectorName, collectorKgid,
    fileHash, fileSize, mimeType, fileName,
    tags, ocrText, aiLabels, analysisSummary, extractedEntities,
    createdAt, updatedAt
) VALUES (
    1,
    'EV-2026-000001',
    1, '104430006202600001',
    'Beneficiary Wallet Account Statement',
    'PDF bank statement detailing money transfers routed from the complainant''s savings account.',
    'DOCUMENT', 'SECURED',
    '2026-03-12', '11:00',
    12.971600, 77.594600,
    'Ramesh Kumar', '123456',
    'a3a25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0021',
    450230, 'application/pdf', 'wallet_statement_transfers.pdf',
    '["phishing","bank_statement","mule_wallet"]',
    NULL, NULL, NULL,
    '{"PERSON":["Imran Khan"],"PHONE":["8899889988"]}',
    '2026-03-12 11:00:00', '2026-03-12 11:00:00'
);

INSERT INTO EvidenceMaster (
    id, evidenceNo, caseId, crimeNo, title, description, evidenceType, status,
    collectionDate, collectionTime, latitude, longitude,
    collectorName, collectorKgid,
    fileHash, fileSize, mimeType, fileName,
    tags, ocrText, aiLabels, analysisSummary, extractedEntities,
    createdAt, updatedAt
) VALUES (
    2,
    'EV-2026-000002',
    2, '104430006202600002',
    'Intersection CCTV Footage Screenshot',
    'Image captured from YES intersection camera showing suspect silver sedan idling during the burglary timeframe.',
    'IMAGE', 'SECURED',
    '2026-04-05', '10:15',
    12.992200, 77.571200,
    'Anil Gowda', '112233',
    'c5c25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0042',
    2048500, 'image/png', 'cctv_suspect_vehicle.png',
    '["burglary","cctv_frame","vehicle_plate"]',
    NULL, NULL, NULL,
    '{"VEHICLE":["Silver Sedan"]}',
    '2026-04-05 10:15:00', '2026-04-05 10:15:00'
);

INSERT INTO EvidenceMaster (
    id, evidenceNo, caseId, crimeNo, title, description, evidenceType, status,
    collectionDate, collectionTime, latitude, longitude,
    collectorName, collectorKgid,
    fileHash, fileSize, mimeType, fileName,
    tags, ocrText, aiLabels, analysisSummary, extractedEntities,
    createdAt, updatedAt
) VALUES (
    3,
    'EV-2026-000003',
    3, '104430006202600003',
    'Suspect Mobile Device (OnePlus 11R)',
    'Recovered physical mobile handset containing fraudulent social media logins and spoofed contacts logs.',
    'DEVICE', 'SUBMITTED_TO_COURT',
    '2026-05-19', '12:30',
    12.925400, 77.582900,
    'Ramesh Kumar', '123456',
    'f1f25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0063',
    0, 'application/octet-stream', 'oneplus_handset_recovered',
    '["identity_theft","physical_device","handset"]',
    NULL, NULL, NULL,
    '{}',
    '2026-05-19 12:30:00', '2026-05-20 16:00:00'
);


-- ============================================================================
-- BLOCK 6: CustodyEvent (4 chain-of-custody events)
-- ============================================================================

INSERT INTO CustodyEvent (id, evidenceId, eventTimestamp, officerName, officerKgid, action, previousState, currentState, remarks)
VALUES (1, 1, '2026-03-12 11:00:00', 'Ramesh Kumar', '123456', 'REGISTERED', 'None', 'SECURED', 'Seized wallet transfer details from complainant at PS console.');

INSERT INTO CustodyEvent (id, evidenceId, eventTimestamp, officerName, officerKgid, action, previousState, currentState, remarks)
VALUES (2, 2, '2026-04-05 10:15:00', 'Anil Gowda', '112233', 'REGISTERED', 'None', 'SECURED', 'Screenshotted suspect sedan vehicle license plates from intersection CCTV files.');

INSERT INTO CustodyEvent (id, evidenceId, eventTimestamp, officerName, officerKgid, action, previousState, currentState, remarks)
VALUES (3, 3, '2026-05-19 12:30:00', 'Ramesh Kumar', '123456', 'REGISTERED', 'None', 'SECURED', 'Physical recovery of suspect OnePlus 11R mobile handset during search warrant execution.');

INSERT INTO CustodyEvent (id, evidenceId, eventTimestamp, officerName, officerKgid, action, previousState, currentState, remarks)
VALUES (4, 3, '2026-05-20 16:00:00', 'Ramesh Kumar', '123456', 'STATUS_CHANGED', 'SECURED', 'SUBMITTED_TO_COURT', 'Transferred OnePlus handset to Court Registry under formal request seal.');


-- ============================================================================
-- BLOCK 7: ActivityLog (4 case audit events)
-- ============================================================================

INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, eventTimestamp)
VALUES (1, 1, '104430006202600001', '202600001', 'Ramesh Kumar', 'CREATED', '2026-03-12 10:30:00');

INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, eventTimestamp)
VALUES (2, 2, '104430006202600002', '202600002', 'Anil Gowda', 'CREATED', '2026-04-05 09:15:00');

INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, eventTimestamp)
VALUES (3, 3, '104430006202600003', '202600003', 'Ramesh Kumar', 'CREATED', '2026-05-18 16:00:00');

INSERT INTO ActivityLog (id, caseId, crimeNo, caseNo, officerName, action, eventTimestamp)
VALUES (4, 3, '104430006202600003', '202600003', 'Ramesh Kumar', 'STATUS_CHANGED', '2026-05-20 14:30:00');


-- ============================================================================
-- BLOCK 8: IntelligenceRecord (1 AI analysis record)
-- Includes relationships column (added via 04_migration.sql)
-- ============================================================================

INSERT INTO IntelligenceRecord (
    id, evidenceId, version, analyzedAt,
    ocrRawText, ocrConfidence, ocrProvider,
    analysisSummary, aiLabels, overallConfidence, provider,
    relationships
) VALUES (
    'intel-uuid-1',
    1, 1,
    '2026-03-12 12:00:00',
    'Bank Statement Account details. Beneficiary: Imran Khan. Phone: 8899889988. Account No: 9876543210.',
    0.95, 'CATALYST_ZIA_OCR',
    'AI extracted beneficiary account associated with suspect Imran Khan and contact mobile number.',
    '["phishing","mule_account","fraud"]',
    0.92, 'CATALYST_ZIA_OCR',
    '[{"id":"rel-1-1","fromEntityId":"entity-uuid-1","toEntityId":"entity-uuid-2","relationshipType":"HAS_CONTACT","confidence":0.882,"sourceEvidenceId":1}]'
);


-- ============================================================================
-- BLOCK 9: ExtractedEntity (2 entities from the above intelligence record)
-- ============================================================================

INSERT INTO ExtractedEntity (id, intelligenceRecordId, sourceEvidenceId, value, type, confidence, extractionMethod, extractedAt, reviewStatus)
VALUES ('entity-uuid-1', 'intel-uuid-1', 1, 'Imran Khan', 'PERSON', 0.98, 'ZIA_NLP', '2026-03-12 12:00:00', 'ACCEPTED');

INSERT INTO ExtractedEntity (id, intelligenceRecordId, sourceEvidenceId, value, type, confidence, extractionMethod, extractedAt, reviewStatus)
VALUES ('entity-uuid-2', 'intel-uuid-1', 1, '8899889988', 'PHONE', 0.99, 'REGEX_PATTERN', '2026-03-12 12:00:00', 'ACCEPTED');


-- ============================================================================
-- BLOCK 10: ReviewEvent (2 officer review decisions)
-- ============================================================================

INSERT INTO ReviewEvent (id, entityId, evidenceId, officerKgid, officerName, action, previousStatus, newStatus, eventTimestamp)
VALUES ('review-uuid-1', 'entity-uuid-1', 1, '123456', 'Ramesh Kumar', 'ACCEPTED', 'PENDING', 'ACCEPTED', '2026-03-12 12:05:00');

INSERT INTO ReviewEvent (id, entityId, evidenceId, officerKgid, officerName, action, previousStatus, newStatus, eventTimestamp)
VALUES ('review-uuid-2', 'entity-uuid-2', 1, '123456', 'Ramesh Kumar', 'ACCEPTED', 'PENDING', 'ACCEPTED', '2026-03-12 12:05:10');
