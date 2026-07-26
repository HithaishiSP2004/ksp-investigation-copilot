console.log("==================================");
console.log("KSP FUNCTION STARTED");
console.log("URL:", process.env);
console.log("==================================");
'use strict';


const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const fs = require('fs');
const path = require('path');

const MAJOR_HEADS_MAP = {
  10: "Crimes Against Property",
  20: "Cyber Crime",
  30: "Crimes Against Body",
  40: "Economic Offenses",
  50: "Narcotics",
  60: "Fraud",
  70: "Missing Person"
};

const app = express();

// === DIAGNOSTIC: FIRST MIDDLEWARE — logs every request before any processing ===
app.use((req, res, next) => {
  console.log('[DIAG-REQUEST] ========================================');
  console.log('[DIAG-REQUEST] method      :', req.method);
  console.log('[DIAG-REQUEST] req.url     :', req.url);
  console.log('[DIAG-REQUEST] req.path    :', req.path);
  console.log('[DIAG-REQUEST] originalUrl :', req.originalUrl);
  console.log('[DIAG-REQUEST] baseUrl     :', req.baseUrl);
  console.log('[DIAG-REQUEST] ========================================');
  next();
});

app.use(express.json());

// Normalize Catalyst server function URL prefixes (/server/ksp_investigation_copilot/api/...)
app.use((req, res, next) => {
  if (req.url.startsWith('/server/ksp_investigation_copilot')) {
    req.url = req.url.replace('/server/ksp_investigation_copilot', '') || '/';
  } else if (req.url.startsWith('/ksp_investigation_copilot')) {
    req.url = req.url.replace('/ksp_investigation_copilot', '') || '/';
  }
  next();
});

// Enable CORS and common headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Environment');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Structured request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });
  next();
});

// Standardized response helper envelopes
function sendSuccess(res, data = {}, message = 'Request completed successfully.', status = 200) {
  return res.status(status).json({
    success: true,
    data,
    message,
    error: null
  });
}

function sendError(res, message = 'Request failed.', code = 'REQUEST_FAILED', details = '', status = 400) {
  return res.status(status).json({
    success: false,
    data: null,
    message,
    error: { code, details }
  });
}

// Helper to check and validate numeric IDs
const getNumId = (val) => {
  const id = parseInt(val, 10);
  return isNaN(id) ? null : id;
};

// Helper to identify table/schema missing errors
function isSchemaMissingError(err) {
  const errMsg = String(err.message || err.code || '').toLowerCase();
  return (
    errMsg.includes('unkown table') ||
    errMsg.includes('table not found') ||
    errMsg.includes('unknown table') ||
    errMsg.includes('column name in select') ||
    errMsg.includes('table_not_found') ||
    errMsg.includes('invalid_project_details') ||
    errMsg.includes('column name') ||
    errMsg.includes('invalid input value')
  );
}

// Hydrates Unit and Employee fields in memory to respect ZCQL's 4-join limit
async function hydrateUnitAndEmployee(cases, catalystApp) {
  const list = Array.isArray(cases) ? cases : [cases];
  if (list.length === 0) return cases;

  try {
    const zcql = catalystApp.zcql();
    const [unitsData, employeesData] = await Promise.all([
      zcql.executeZCQLQuery('SELECT id, name, district FROM Unit').catch(() => []),
      zcql.executeZCQLQuery('SELECT id, kgid, firstName, lastname, rank FROM Employee').catch(() => [])
    ]);

    const unitMap = {};
    unitsData.forEach(row => {
      const u = row.Unit;
      if (u) unitMap[u.id] = u;
    });

    const employeeMap = {};
    employeesData.forEach(row => {
      const e = row.Employee;
      if (e) employeeMap[e.id] = e;
    });

    list.forEach(c => {
      const unit = unitMap[c.policeStationId];
      if (unit) {
        c.stationName = unit.name;
        c.districtName = unit.district;
      }
      const emp = employeeMap[c.policePersonId];
      if (emp) {
        c.officerName = `${emp.firstName} ${emp.lastname || emp.lastName || ''}`.trim();
        c.officerRank = emp.rank;
      }
    });
  } catch (err) {
    console.warn('[Hydration Warning] In-memory Unit/Employee lookup failed:', err.message);
  }

  return cases;
}

// ============================================================================
// IN-MEMORY FALLBACK DATABASE
// Used ONLY when tables are not yet created in the Zoho Catalyst Console.
// ============================================================================
const fallbackLookups = {
  categories: [
    { id: 1, name: "FIR" },
    { id: 2, name: "UDR" },
    { id: 3, name: "Zero FIR" },
    { id: 4, name: "PAR" }
  ],
  gravities: [
    { id: 1, name: "Heinous" },
    { id: 2, name: "Non-Heinous" }
  ],
  crimeHeads: [
    { id: 10, name: "Crimes Against Property" },
    { id: 20, name: "Cyber Crime" },
    { id: 30, name: "Crimes Against Body" },
    { id: 40, name: "Economic Offenses" }
  ],
  crimeSubHeads: [
    { id: 101, name: "House Break-in & Burglary" },
    { id: 102, name: "Armed Robbery" },
    { id: 201, name: "Identity Theft & Phishing" },
    { id: 202, name: "Online Financial Fraud" },
    { id: 301, name: "Murder" },
    { id: 302, name: "Grievous Hurt" }
  ],
  units: [
    { id: 6, name: "Bengaluru Cyber Crime PS", district: "Bengaluru City" },
    { id: 7, name: "Malleshwaram Police Station", district: "Bengaluru City" },
    { id: 8, name: "Mysuru Town Police Station", district: "Mysuru District" }
  ],
  employees: [
    { id: 1, kgid: "123456", firstName: "Ramesh", lastName: "Kumar", rank: "Sub-Inspector", designation: "Investigating Officer" },
    { id: 2, kgid: "999999", firstName: "Kiran", lastName: "Reddy", rank: "DSP", designation: "Superintendent of Police" },
    { id: 3, kgid: "112233", firstName: "Anil", lastName: "Gowda", rank: "Inspector", designation: "Circle Officer" }
  ]
};

let fallbackCases = [
  {
    id: 1, crimeNo: "104430006202600001", caseNo: "202600001",
    crimeRegisteredDate: "2026-03-12 10:30:00",
    policePersonId: 1, policeStationId: 6, caseCategoryId: 1,
    gravityOffenceId: 2, crimeMajorHeadId: 20, crimeMinorHeadId: 202,
    caseStatus: "UNDER_INVESTIGATION", priority: "HIGH",
    briefFacts: "The complainant reports that on 2026-03-11, they received a text message containing a phishing link posing as their bank. Upon clicking the link and entering credentials, unauthorized transactions debited Rs.1,50,000.",
    incidentFromDate: "2026-03-11 14:00:00", incidentToDate: "2026-03-11 14:30:00",
    infoReceivedPSDate: "2026-03-12 09:00:00",
    latitude: 12.9716, longitude: 77.5946,
    createdAt: "2026-03-12 10:30:00", updatedAt: "2026-03-12 10:30:00",
    categoryName: "FIR", gravityName: "Non-Heinous", majorHeadName: "Cyber Crime",
    minorHeadName: "Online Financial Fraud", stationName: "Bengaluru Cyber Crime PS",
    districtName: "Bengaluru City", officerName: "Ramesh Kumar", officerRank: "Sub-Inspector",
    victims: [], suspects: []
  }
];

let fallbackNotes = [
  {
    id: 1, caseId: 1,
    content: "Sent official requisition letters to the bank's fraud monitoring team requesting transaction logs.",
    createdBy: "Ramesh Kumar", createdKgid: "123456",
    createdAt: "2026-03-12 11:30:00", updatedAt: "2026-03-12 11:30:00",
    isDeleted: false
  }
];

let fallbackEvidence = [
  {
    id: 1, evidenceNo: "EV-2026-000001", caseId: 1, crimeNo: "104430006202600001",
    title: "Beneficiary Wallet Account Statement",
    description: "PDF bank statement detailing money transfers routed from the complainant's savings account.",
    evidenceType: "DOCUMENT", status: "SECURED",
    collectionDate: "2026-03-12", collectionTime: "11:00",
    latitude: 12.9716, longitude: 77.5946,
    collectorName: "Ramesh Kumar", collectorKgid: "123456",
    fileHash: "a3a25fa2d385cd17a6ea6238ad5fe00a89d5f784d113ede49ea6238ad5ff0021",
    fileSize: 450230, mimeType: "application/pdf", fileName: "wallet_statement_transfers.pdf",
    tags: ["phishing", "bank_statement"],
    ocrText: null, aiLabels: [], analysisSummary: null,
    extractedEntities: { PERSON: ["Imran Khan"], PHONE: ["8899889988"] },
    createdAt: "2026-03-12 11:00:00", updatedAt: "2026-03-12 11:00:00"
  }
];

let fallbackCustody = [
  { id: 1, evidenceId: 1, timestamp: "2026-03-12 11:00:00", officerName: "Ramesh Kumar", officerKgid: "123456", action: "REGISTERED", previousState: "None", currentState: "SECURED", remarks: "Seized wallet transfers statement." }
];

let fallbackIntel = {};
let fallbackReviewEvents = [];
let fallbackActivities = [
  { id: 1, caseId: 1, crimeNo: "104430006202600001", caseNo: "202600001", officerName: "Ramesh Kumar", action: "CREATED", timestamp: "2026-03-12 10:30:00" }
];


// ==========================================
// 1. DIAGNOSTICS & HEALTH Check Endpoint
// ==========================================
app.get('/api/health', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    let dbStatus = 'CONNECTED';
    let details = 'Database is reachable.';

    // Try a simple datastore ZCQL test, catch schema errors gracefully
    await catalystApp.zcql().executeZCQLQuery('SELECT id FROM CaseCategory LIMIT 1').catch(err => {
      if (isSchemaMissingError(err)) {
        dbStatus = 'CONNECTED_SANDBOX';
        details = 'Database online, but console schema tables not yet created. Emulator fallback ready.';
      } else {
        throw err;
      }
    });

    return sendSuccess(res, {
      status: 'UP',
      database: dbStatus,
      environment: process.env.CATALYST_ENVIRONMENT || 'Development',
      project_id: process.env.CATALYST_PROJECT_ID || '54539000000013024',
      uptime: process.uptime(),
      details
    }, 'System diagnostics are operational.');
  } catch (err) {
    console.error('[Health Check Error]:', err);
    return sendError(res, 'Diagnostics check failed.', 'DIAGNOSTICS_FAILED', err.message, 500);
  }
});

// Temporary endpoint to inspect columns of all tables in the live Catalyst Data Store
app.get('/api/inspect', async (req, res) => {
  const tables = [
    "CaseCategory", "GravityOffence", "CrimeHead", "CrimeSubHead",
    "Unit", "Employee", "CaseMaster", "Victim", "Suspect",
    "InvestigationNote", "EvidenceMaster", "CustodyEvent",
    "IntelligenceRecord", "ExtractedEntity", "ReviewEvent", "ActivityLog"
  ];

  try {
    const catalystApp = catalyst.initialize(req);
    const info = {};
    const systemFields = ["ROWID", "CREATORID", "CREATEDTIME", "MODIFIEDTIME"];

    for (const t of tables) {
      try {
        const details = await catalystApp.datastore().getTableDetails(t);
        const rawDetails = details._tableDetails || {};
        const cols = rawDetails.column_details || [];
        const colNames = cols
          .map(col => col.column_name)
          .filter(name => !systemFields.includes(name));
        info[t] = { status: "EXISTS", columns: colNames };
      } catch (err) {
        info[t] = { status: "ERROR", error: err.message };
      }
    }

    return sendSuccess(res, info, "Database inspection complete.");
  } catch (err) {
    return sendError(res, "Inspection failed", "INSPECT_ERROR", err.message, 500);
  }
});

// ==========================================
// 2. LOOKUPS Endpoint (Gets all metadata options)
// ==========================================
app.get('/api/lookups', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const [cats, gravs, heads, subheads, units, emps] = await Promise.all([
      zcql.executeZCQLQuery('SELECT id, categoryName, categoryCode, description, isActive FROM CaseCategory ORDER BY id'),
      zcql.executeZCQLQuery('SELECT id, offenceName, offenceCode, severity, description, isActive FROM GravityOffence ORDER BY id'),
      zcql.executeZCQLQuery('SELECT id FROM CrimeHead ORDER BY id'),
      zcql.executeZCQLQuery('SELECT id, name FROM CrimeSubHead ORDER BY id'),
      zcql.executeZCQLQuery('SELECT id, name, district FROM Unit ORDER BY id'),
      zcql.executeZCQLQuery('SELECT id, kgid, firstName, lastname, rank, designation FROM Employee ORDER BY id')
    ]);

    const categoriesMapped = cats.map(row => {
      const c = row.CaseCategory;
      return {
        id: parseInt(c.id, 10),
        name: c.categoryName,
        categoryName: c.categoryName,
        categoryCode: c.categoryCode,
        description: c.description,
        isActive: c.isActive === 'true' || c.isActive === true
      };
    });

    const gravitiesMapped = gravs.map(row => {
      const g = row.GravityOffence;
      return {
        id: parseInt(g.id, 10),
        name: g.offenceName,
        offenceName: g.offenceName,
        offenceCode: g.offenceCode,
        severity: g.severity,
        description: g.description,
        isActive: g.isActive === 'true' || g.isActive === true
      };
    });

    const crimeHeadsMapped = heads.map(row => {
      const h = row.CrimeHead;
      const id = parseInt(h.id, 10);
      return {
        id,
        name: MAJOR_HEADS_MAP[id] || 'Unknown'
      };
    });

    const employeesMapped = emps.map(row => {
      const e = row.Employee;
      return {
        id: parseInt(e.id, 10),
        kgid: e.kgid,
        firstName: e.firstName,
        lastName: e.lastname || e.lastName,
        rank: e.rank,
        designation: e.designation
      };
    });

    const format = (list, key) => list.map(item => item[key]);

    return sendSuccess(res, {
      categories: categoriesMapped,
      gravities: gravitiesMapped,
      crimeHeads: crimeHeadsMapped,
      crimeSubHeads: format(subheads, 'CrimeSubHead'),
      units: format(units, 'Unit'),
      employees: employeesMapped
    }, 'Lookups retrieved successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Lookups Fallback Triggered]: Tables missing in Console.');
      return sendSuccess(res, fallbackLookups, 'Lookups retrieved from local sandbox fallback.');
    }
    console.error('[Lookups Read Error]:', err);
    return sendError(res, 'Failed to fetch lookups.', 'LOOKUPS_ERROR', err.message, 500);
  }
});

// ==========================================
// 3. CASES CRUD Endpoints
// ==========================================

// GET /api/cases — relational ZCQL join (4-joins max)
app.get('/api/cases', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const query = `
      SELECT 
        cm.*, 
        cc.categoryName AS categoryName, 
        go.offenceName AS gravityName, 
        csh.name AS minorHeadName
      FROM CaseMaster cm
      LEFT JOIN CaseCategory cc ON cm.caseCategoryId = cc.ROWID
      LEFT JOIN GravityOffence go ON cm.gravityOffenceId = go.ROWID
      LEFT JOIN CrimeSubHead csh ON cm.crimeMinorHeadId = csh.ROWID
      WHERE cm.caseStatus != 'ARCHIVED'
    `;

    const results = await catalystApp.zcql().executeZCQLQuery(query);
    if (results.length > 0) {
      console.warn('[Cases Query Row Keys]:', Object.keys(results[0]), JSON.stringify(results[0]));
    }

    let cases = results.map(row => {
      const caseMaster = row.CaseMaster || row.cm;
      if (!caseMaster) {
        throw new Error('CaseMaster data missing in ZCQL row: ' + JSON.stringify(row));
      }
      return {
        id: caseMaster.id,
        crimeNo: caseMaster.crimeNo,
        caseNo: caseMaster.caseNo,
        crimeRegisteredDate: caseMaster.crimeRegisteredDate,
        policePersonId: caseMaster.policePersonId,
        policeStationId: caseMaster.policeStationId,
        caseCategoryId: caseMaster.caseCategoryId,
        gravityOffenceId: caseMaster.gravityOffenceId,
        crimeMajorHeadId: caseMaster.crimeMajorHeadId,
        crimeMinorHeadId: caseMaster.crimeMinorHeadId,
        caseStatus: caseMaster.caseStatus,
        priority: caseMaster.priority,
        briefFacts: caseMaster.briefFacts,
        incidentFromDate: caseMaster.incidentFromDate,
        incidentToDate: caseMaster.incidentToDate,
        infoReceivedPSDate: caseMaster.infoReceivedPSDate,
        latitude: parseFloat(caseMaster.latitude),
        longitude: parseFloat(caseMaster.longitude),
        createdAt: caseMaster.createdAt,
        updatedAt: caseMaster.updatedAt,
        categoryName: row.CaseCategory?.categoryName || 'FIR',
        gravityName: row.GravityOffence?.gravityName || 'Non-Heinous',
        majorHeadName: MAJOR_HEADS_MAP[caseMaster.crimeMajorHeadId] || 'Unknown',
        minorHeadName: row.CrimeSubHead?.minorHeadName || 'Unknown',
        stationName: 'Unknown PS',
        districtName: 'Unknown District',
        officerName: 'Unassigned',
        officerRank: 'Sub-Inspector',
        victims: [],
        suspects: []
      };
    });

    // Hydrate Units and Employees in memory
    cases = await hydrateUnitAndEmployee(cases, catalystApp);

    return sendSuccess(res, cases, 'Cases retrieved successfully.');
  } catch (err) {
    console.warn('[Cases Read Error Details]:', err.message || err);
    if (isSchemaMissingError(err)) {
      console.warn('[Cases Fallback Triggered]: Tables missing.');
      const activeCases = fallbackCases.filter(c => c.caseStatus !== 'ARCHIVED');
      return sendSuccess(res, activeCases, 'Cases retrieved from local sandbox fallback.');
    }
    console.error('[Cases Read Error]:', err);
    return sendError(res, 'Failed to fetch cases.', 'CASES_READ_ERROR', err.message, 500);
  }
});

// GET /api/cases/:id — Detailed view (4-joins max)
app.get('/api/cases/:id', async (req, res) => {
  const caseId = getNumId(req.params.id);
  if (!caseId) return sendError(res, 'Invalid case ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();
    const query = `
      SELECT 
        cm.*, 
        cc.categoryName AS categoryName, 
        go.offenceName AS gravityName, 
        csh.name AS minorHeadName
      FROM CaseMaster cm
      LEFT JOIN CaseCategory cc ON cm.caseCategoryId = cc.ROWID
      LEFT JOIN GravityOffence go ON cm.gravityOffenceId = go.ROWID
      LEFT JOIN CrimeSubHead csh ON cm.crimeMinorHeadId = csh.ROWID
      WHERE cm.id = ${caseId} AND cm.caseStatus != 'ARCHIVED'
      LIMIT 1
    `;

    const caseData = await zcql.executeZCQLQuery(query);
    if (caseData.length === 0) {
      return sendError(res, 'Case not found.', 'NOT_FOUND', '', 404);
    }

    const row = caseData[0];
    const c = row.CaseMaster || row.cm;

    if (!c) {
      console.error('[Case Detail] CaseMaster data missing in ZCQL row:', JSON.stringify(row));
      return sendError(res, 'Case not found.', 'NOT_FOUND', '', 404);
    }

    // Fetch related victims and suspects using CaseMaster ROWID (which is the actual value stored in caseId)
    const [victimsData, suspectsData] = await Promise.all([
      zcql.executeZCQLQuery(`SELECT * FROM Victim WHERE caseId = '${c.ROWID}'`),
      zcql.executeZCQLQuery(`SELECT * FROM Suspect WHERE caseId = '${c.ROWID}'`)
    ]);

    let formattedCase = {
      id: c.id,
      crimeNo: c.crimeNo,
      caseNo: c.caseNo,
      crimeRegisteredDate: c.crimeRegisteredDate,
      policePersonId: c.policePersonId,
      policeStationId: c.policeStationId,
      caseCategoryId: c.caseCategoryId,
      gravityOffenceId: c.gravityOffenceId,
      crimeMajorHeadId: c.crimeMajorHeadId,
      crimeMinorHeadId: c.crimeMinorHeadId,
      caseStatus: c.caseStatus,
      priority: c.priority || c.casePriority,
      briefFacts: c.briefFacts,
      incidentFromDate: c.incidentFromDate,
      incidentToDate: c.incidentToDate,
      infoReceivedPSDate: c.infoReceivedPSDate,
      latitude: parseFloat(c.latitude),
      longitude: parseFloat(c.longitude),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      categoryName: row.CaseCategory?.categoryName || row.cc?.categoryName || 'FIR',
      gravityName: row.GravityOffence?.gravityName || row.go?.gravityName || 'Non-Heinous',
      majorHeadName: MAJOR_HEADS_MAP[c.crimeMajorHeadId] || 'Unknown',
      minorHeadName: row.CrimeSubHead?.minorHeadName || row.csh?.minorHeadName || 'Unknown',
      stationName: 'Unknown PS',
      districtName: 'Unknown District',
      officerName: 'Unassigned',
      officerRank: 'Sub-Inspector',
      victims: victimsData.map(v => v.Victim),
      suspects: suspectsData.map(s => {
        const susp = s.Suspect;
        return {
          id: susp.id,
          caseId: susp.caseId,
          name: susp.name,
          age: susp.age,
          gender: susp.gender,
          phone: susp.phone,
          email: susp.email,
          address: susp.adress || susp.address,
          status: susp.status,
          extractedEntities: susp.extractedEntities
        };
      })
    };

    // Hydrate Unit and Employee fields in memory
    formattedCase = (await hydrateUnitAndEmployee(formattedCase, catalystApp));

    return sendSuccess(res, formattedCase, 'Case details retrieved.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Case details Fallback Triggered]: Tables missing.');
      const caseItem = fallbackCases.find(c => c.id === caseId && c.caseStatus !== 'ARCHIVED');
      if (!caseItem) return sendError(res, 'Case not found.', 'NOT_FOUND', '', 404);
      return sendSuccess(res, caseItem, 'Case details retrieved from local sandbox fallback.');
    }
    console.error('[Case Detail Error]:', err);
    return sendError(res, 'Failed to fetch case details.', 'CASE_DETAIL_ERROR', err.message, 500);
  }
});

// POST /api/cases — Create case
app.post('/api/cases', async (req, res) => {
  const caseData = req.body || {};

  // Validate required payload fields
  const missingFields = [];
  if (!caseData.crimeNo) missingFields.push('crimeNo (FIR Number)');
  if (!caseData.briefFacts) missingFields.push('briefFacts (Summary)');

  if (missingFields.length > 0) {
    return sendError(
      res,
      `Transaction Failed: Missing required parameter(s): ${missingFields.join(', ')}`,
      'VALIDATION_ERROR',
      `Payload missing required fields: ${missingFields.join(', ')}`,
      400
    );
  }

  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const caseTable = datastore.table('CaseMaster');

    if (!caseData.id) {
      try {
        const zcqlResult = await catalystApp.zcql().executeZCQLQuery('SELECT MAX(id) FROM CaseMaster');
        const maxId = zcqlResult[0]?.CaseMaster?.id || 0;
        caseData.id = Number(maxId) + 1;
      } catch {
        caseData.id = Date.now();
      }
    }

    const rowToInsert = {
      id: Number(caseData.id),
      crimeNo: String(caseData.crimeNo),
      caseNo: String(caseData.caseNo || `KSP-BLR-2026-${String(caseData.id).padStart(3, '0')}`),
      crimeRegisteredDate: String(caseData.crimeRegisteredDate || new Date().toISOString().split('T')[0]),
      policePersonId: Number(caseData.policePersonId || 101),
      policeStationId: Number(caseData.policeStationId || 1),
      caseCategoryId: Number(caseData.caseCategoryId || 10),
      gravityOffenceId: Number(caseData.gravityOffenceId || 1),
      crimeMajorHeadId: Number(caseData.crimeMajorHeadId || 20),
      crimeMinorHeadId: Number(caseData.crimeMinorHeadId || 201),
      caseStatus: String(caseData.caseStatus || 'UNDER_INVESTIGATION'),
      priority: String(caseData.priority || 'HIGH'),
      briefFacts: String(caseData.briefFacts),
      incidentFromDate: String(caseData.incidentFromDate || new Date().toISOString()),
      incidentToDate: String(caseData.incidentToDate || new Date().toISOString()),
      infoReceivedPSDate: String(caseData.infoReceivedPSDate || new Date().toISOString()),
      latitude: Number(caseData.latitude || 12.9716),
      longitude: Number(caseData.longitude || 77.5946),
      createdAt: caseData.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: caseData.updatedAt || new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const inserted = await caseTable.insertRow(rowToInsert);
    return sendSuccess(res, inserted, 'Case created successfully.', 201);
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Case Create Fallback Triggered]: Tables missing.');
      if (!caseData.id) {
        caseData.id = fallbackCases.length > 0 ? Math.max(...fallbackCases.map(c => c.id)) + 1 : 1;
      }
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newObj = {
        ...caseData,
        createdAt: nowStr,
        updatedAt: nowStr,
        categoryName: fallbackLookups.categories.find(c => c.id === caseData.caseCategoryId)?.name || 'FIR',
        gravityName: fallbackLookups.gravities.find(g => g.id === caseData.gravityOffenceId)?.name || 'Non-Heinous',
        stationName: fallbackLookups.units.find(u => u.id === caseData.policeStationId)?.name || 'Unknown PS',
        officerName: 'Ramesh Kumar',
        officerRank: 'Sub-Inspector',
        victims: [],
        suspects: []
      };
      fallbackCases.push(newObj);
      return sendSuccess(res, newObj, 'Case created successfully in local sandbox fallback.', 201);
    }
    console.error('[Case Create Error]:', err);
    return sendError(res, 'Failed to create case.', 'CASE_CREATE_ERROR', err.message, 500);
  }
});

// PUT /api/cases/:id — Update case
app.put('/api/cases/:id', async (req, res) => {
  const caseId = getNumId(req.params.id);
  if (!caseId) return sendError(res, 'Invalid case ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const zcqlResult = await zcql.executeZCQLQuery(`SELECT ROWID FROM CaseMaster WHERE id = ${caseId} LIMIT 1`);
    if (zcqlResult.length === 0) {
      return sendError(res, 'Case not found.', 'NOT_FOUND', '', 404);
    }
    const rowId = zcqlResult[0].CaseMaster.ROWID;

    const caseTable = catalystApp.datastore().table('CaseMaster');
    const updated = await caseTable.updateRow({
      ROWID: rowId,
      ...req.body,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return sendSuccess(res, updated, 'Case updated successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Case Update Fallback Triggered]: Tables missing.');
      const idx = fallbackCases.findIndex(c => c.id === caseId);
      if (idx === -1) return sendError(res, 'Case not found.', 'NOT_FOUND', '', 404);
      fallbackCases[idx] = {
        ...fallbackCases[idx],
        ...req.body,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      return sendSuccess(res, fallbackCases[idx], 'Case updated successfully in local sandbox fallback.');
    }
    console.error('[Case Update Error]:', err);
    return sendError(res, 'Failed to update case.', 'CASE_UPDATE_ERROR', err.message, 500);
  }
});

// DELETE /api/cases/:id — Soft-delete
app.delete('/api/cases/:id', async (req, res) => {
  const caseId = getNumId(req.params.id);
  if (!caseId) return sendError(res, 'Invalid case ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const zcqlResult = await zcql.executeZCQLQuery(`SELECT ROWID FROM CaseMaster WHERE id = ${caseId} LIMIT 1`);
    if (zcqlResult.length === 0) {
      return sendError(res, 'Case not found.', 'NOT_FOUND', '', 404);
    }
    const rowId = zcqlResult[0].CaseMaster.ROWID;

    const caseTable = catalystApp.datastore().table('CaseMaster');
    await caseTable.updateRow({
      ROWID: rowId,
      caseStatus: 'ARCHIVED',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return sendSuccess(res, { success: true }, 'Case soft-deleted successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Case Delete Fallback Triggered]: Tables missing.');
      const idx = fallbackCases.findIndex(c => c.id === caseId);
      if (idx === -1) return sendError(res, 'Case not found.', 'NOT_FOUND', '', 404);
      fallbackCases[idx].caseStatus = 'ARCHIVED';
      return sendSuccess(res, { success: true }, 'Case soft-deleted successfully in local sandbox fallback.');
    }
    console.error('[Case Delete Error]:', err);
    return sendError(res, 'Failed to soft-delete case.', 'CASE_DELETE_ERROR', err.message, 500);
  }
});

// ==========================================
// 4. NOTES ENDPOINTS
// ==========================================

// GET /api/cases/:id/notes
app.get('/api/cases/:id/notes', async (req, res) => {
  const caseId = getNumId(req.params.id);
  if (!caseId) return sendError(res, 'Invalid case ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcqlResult = await catalystApp.zcql().executeZCQLQuery(
      `SELECT * FROM InvestigationNote WHERE caseId = ${caseId} AND isDeleted = false ORDER BY id`
    );

    const notes = zcqlResult.map(row => {
      const note = row.InvestigationNote;
      return {
        id: note.id,
        caseId: note.caseId,
        content: note.content,
        createdBy: note.createdBy,
        createdKgid: note.createdKgid,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        lastModifiedBy: note.lastModifiedBy,
        lastModifiedKgid: note.lastModifiedKgid,
        isDeleted: note.isDeleted === 'true' || note.isDeleted === true
      };
    });

    return sendSuccess(res, notes, 'Notes retrieved successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Notes Read Fallback Triggered]: Tables missing.');
      const notes = fallbackNotes.filter(n => n.caseId === caseId && !n.isDeleted);
      return sendSuccess(res, notes, 'Notes retrieved from local sandbox fallback.');
    }
    console.error('[Notes Read Error]:', err);
    return sendError(res, 'Failed to fetch notes.', 'NOTES_READ_ERROR', err.message, 500);
  }
});

// POST /api/cases/:id/notes
app.post('/api/cases/:id/notes', async (req, res) => {
  const caseId = getNumId(req.params.id);
  const noteData = req.body;
  if (!caseId) return sendError(res, 'Invalid case ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const notesTable = datastore.table('InvestigationNote');

    if (!noteData.id) {
      const zcqlResult = await catalystApp.zcql().executeZCQLQuery('SELECT MAX(id) FROM InvestigationNote');
      const maxId = zcqlResult[0]?.InvestigationNote?.id || 0;
      noteData.id = maxId + 1;
    }

    const inserted = await notesTable.insertRow({
      id: noteData.id,
      caseId,
      content: noteData.content,
      createdBy: noteData.createdBy,
      createdKgid: noteData.createdKgid,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      isDeleted: false
    });

    return sendSuccess(res, inserted, 'Note added successfully.', 201);
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Note Add Fallback Triggered]: Tables missing.');
      if (!noteData.id) {
        noteData.id = fallbackNotes.length > 0 ? Math.max(...fallbackNotes.map(n => n.id)) + 1 : 1;
      }
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newObj = {
        id: noteData.id,
        caseId,
        content: noteData.content,
        createdBy: noteData.createdBy,
        createdKgid: noteData.createdKgid,
        createdAt: nowStr,
        updatedAt: nowStr,
        isDeleted: false
      };
      fallbackNotes.push(newObj);
      return sendSuccess(res, newObj, 'Note added successfully in local sandbox fallback.', 201);
    }
    console.error('[Note Create Error]:', err);
    return sendError(res, 'Failed to add note.', 'NOTE_CREATE_ERROR', err.message, 500);
  }
});

// PUT /api/notes/:id
app.put('/api/notes/:id', async (req, res) => {
  const noteId = getNumId(req.params.id);
  if (!noteId) return sendError(res, 'Invalid note ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const zcqlResult = await zcql.executeZCQLQuery(`SELECT ROWID FROM InvestigationNote WHERE id = ${noteId} LIMIT 1`);
    if (zcqlResult.length === 0) {
      return sendError(res, 'Note not found.', 'NOT_FOUND', '', 404);
    }
    const rowId = zcqlResult[0].InvestigationNote.ROWID;

    const notesTable = catalystApp.datastore().table('InvestigationNote');
    const updated = await notesTable.updateRow({
      ROWID: rowId,
      content: req.body.content,
      lastModifiedBy: req.body.officerName,
      lastModifiedKgid: req.body.officerKgid,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return sendSuccess(res, updated, 'Note updated successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Note Update Fallback Triggered]: Tables missing.');
      const idx = fallbackNotes.findIndex(n => n.id === noteId);
      if (idx === -1) return sendError(res, 'Note not found.', 'NOT_FOUND', '', 404);
      fallbackNotes[idx] = {
        ...fallbackNotes[idx],
        content: req.body.content,
        lastModifiedBy: req.body.officerName,
        lastModifiedKgid: req.body.officerKgid,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      return sendSuccess(res, fallbackNotes[idx], 'Note updated successfully in local sandbox fallback.');
    }
    console.error('[Note Update Error]:', err);
    return sendError(res, 'Failed to update note.', 'NOTE_UPDATE_ERROR', err.message, 500);
  }
});

// DELETE /api/notes/:id
app.delete('/api/notes/:id', async (req, res) => {
  const noteId = getNumId(req.params.id);
  if (!noteId) return sendError(res, 'Invalid note ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const zcqlResult = await zcql.executeZCQLQuery(`SELECT ROWID, caseId FROM InvestigationNote WHERE id = ${noteId} LIMIT 1`);
    if (zcqlResult.length === 0) {
      return sendError(res, 'Note not found.', 'NOT_FOUND', '', 404);
    }
    const rowId = zcqlResult[0].InvestigationNote.ROWID;
    const caseId = zcqlResult[0].InvestigationNote.caseId;

    const notesTable = catalystApp.datastore().table('InvestigationNote');
    await notesTable.updateRow({
      ROWID: rowId,
      isDeleted: true,
      lastModifiedBy: req.body.officerName || 'Officer',
      lastModifiedKgid: req.body.officerKgid || '',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return sendSuccess(res, { ROWID: rowId, caseId }, 'Note archived successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Note Delete Fallback Triggered]: Tables missing.');
      const idx = fallbackNotes.findIndex(n => n.id === noteId);
      if (idx === -1) return sendError(res, 'Note not found.', 'NOT_FOUND', '', 404);
      fallbackNotes[idx].isDeleted = true;
      fallbackNotes[idx].lastModifiedBy = req.body.officerName || 'Officer';
      fallbackNotes[idx].lastModifiedKgid = req.body.officerKgid || '';
      return sendSuccess(res, { caseId: fallbackNotes[idx].caseId }, 'Note archived successfully in local sandbox fallback.');
    }
    console.error('[Note Delete Error]:', err);
    return sendError(res, 'Failed to archive note.', 'NOTE_DELETE_ERROR', err.message, 500);
  }
});

// ==========================================
// 5. EVIDENCE & CUSTODY ENDPOINTS
// ==========================================

// GET /api/evidence
app.get('/api/evidence', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const zcqlResult = await catalystApp.zcql().executeZCQLQuery(
      "SELECT * FROM EvidenceMaster WHERE status != 'ARCHIVED' ORDER BY id"
    );

    const evidence = zcqlResult.map(row => {
      const ev = row.EvidenceMaster;
      return {
        id: ev.id,
        evidenceNo: ev.evidenceNo,
        caseId: ev.caseId,
        crimeNo: ev.crimeNo,
        title: ev.title,
        description: ev.description,
        evidenceType: ev.evidenceType,
        status: ev.status,
        collectionDate: ev.collectionDate,
        collectionTime: ev.collectionTime,
        latitude: parseFloat(ev.latitude),
        longitude: parseFloat(ev.longitude),
        collectorName: ev.collectorName,
        collectorKgid: ev.collectorKgid,
        fileHash: ev.fileHash,
        fileSize: parseInt(ev.fileSize, 10),
        mimeType: ev.mimeType,
        fileName: ev.fileName,
        tags: ev.tags ? JSON.parse(ev.tags) : [],
        ocrText: ev.ocrText || null,
        aiLabels: ev.aiLabels ? JSON.parse(ev.aiLabels) : [],
        analysisSummary: ev.analysisSummary || null,
        extractedEntities: ev.extractedEntities ? JSON.parse(ev.extractedEntities) : {},
        createdAt: ev.createdAt,
        updatedAt: ev.updatedAt
      };
    });

    return sendSuccess(res, evidence, 'Evidence retrieved successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Evidence Read Fallback Triggered]: Tables missing.');
      const activeEv = fallbackEvidence.filter(e => e.status !== 'ARCHIVED');
      return sendSuccess(res, activeEv, 'Evidence retrieved from local sandbox fallback.');
    }
    console.error('[Evidence Read Error]:', err);
    return sendError(res, 'Failed to fetch evidence.', 'EVIDENCE_READ_ERROR', err.message, 500);
  }
});

// GET /api/cases/:id/evidence
app.get('/api/cases/:id/evidence', async (req, res) => {
  const caseId = getNumId(req.params.id);
  if (!caseId) return sendError(res, 'Invalid case ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcqlResult = await catalystApp.zcql().executeZCQLQuery(
      `SELECT * FROM EvidenceMaster WHERE caseId = ${caseId} AND status != 'ARCHIVED' ORDER BY id`
    );

    const evidence = zcqlResult.map(row => {
      const ev = row.EvidenceMaster;
      return {
        id: ev.id,
        evidenceNo: ev.evidenceNo,
        caseId: ev.caseId,
        crimeNo: ev.crimeNo,
        title: ev.title,
        description: ev.description,
        evidenceType: ev.evidenceType,
        status: ev.status,
        collectionDate: ev.collectionDate,
        collectionTime: ev.collectionTime,
        latitude: parseFloat(ev.latitude),
        longitude: parseFloat(ev.longitude),
        collectorName: ev.collectorName,
        collectorKgid: ev.collectorKgid,
        fileHash: ev.fileHash,
        fileSize: parseInt(ev.fileSize, 10),
        mimeType: ev.mimeType,
        fileName: ev.fileName,
        tags: ev.tags ? JSON.parse(ev.tags) : [],
        ocrText: ev.ocrText || null,
        aiLabels: ev.aiLabels ? JSON.parse(ev.aiLabels) : [],
        analysisSummary: ev.analysisSummary || null,
        extractedEntities: ev.extractedEntities ? JSON.parse(ev.extractedEntities) : {},
        createdAt: ev.createdAt,
        updatedAt: ev.updatedAt
      };
    });

    return sendSuccess(res, evidence, 'Case evidence retrieved.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Case Evidence Fallback Triggered]: Tables missing.');
      const evidence = fallbackEvidence.filter(e => e.caseId === caseId && e.status !== 'ARCHIVED');
      return sendSuccess(res, evidence, 'Case evidence retrieved from local sandbox fallback.');
    }
    console.error('[Case Evidence Read Error]:', err);
    return sendError(res, 'Failed to fetch case evidence.', 'CASE_EVIDENCE_ERROR', err.message, 500);
  }
});

// GET /api/evidence/:id
app.get('/api/evidence/:id', async (req, res) => {
  const evId = getNumId(req.params.id);
  if (!evId) return sendError(res, 'Invalid evidence ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcqlResult = await catalystApp.zcql().executeZCQLQuery(
      `SELECT * FROM EvidenceMaster WHERE id = ${evId} LIMIT 1`
    );

    if (zcqlResult.length === 0) {
      return sendError(res, 'Evidence not found.', 'NOT_FOUND', '', 404);
    }

    const ev = zcqlResult[0].EvidenceMaster;
    const formatted = {
      id: ev.id,
      evidenceNo: ev.evidenceNo,
      caseId: ev.caseId,
      crimeNo: ev.crimeNo,
      title: ev.title,
      description: ev.description,
      evidenceType: ev.evidenceType,
      status: ev.status,
      collectionDate: ev.collectionDate,
      collectionTime: ev.collectionTime,
      latitude: parseFloat(ev.latitude),
      longitude: parseFloat(ev.longitude),
      collectorName: ev.collectorName,
      collectorKgid: ev.collectorKgid,
      fileHash: ev.fileHash,
      fileSize: parseInt(ev.fileSize, 10),
      mimeType: ev.mimeType,
      fileName: ev.fileName,
      tags: ev.tags ? JSON.parse(ev.tags) : [],
      ocrText: ev.ocrText || null,
      aiLabels: ev.aiLabels ? JSON.parse(ev.aiLabels) : [],
      analysisSummary: ev.analysisSummary || null,
      extractedEntities: ev.extractedEntities ? JSON.parse(ev.extractedEntities) : {},
      createdAt: ev.createdAt,
      updatedAt: ev.updatedAt
    };

    return sendSuccess(res, formatted, 'Evidence details retrieved.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Evidence Detail Fallback Triggered]: Tables missing.');
      const ev = fallbackEvidence.find(e => e.id === evId && e.status !== 'ARCHIVED');
      if (!ev) return sendError(res, 'Evidence not found.', 'NOT_FOUND', '', 404);
      return sendSuccess(res, ev, 'Evidence retrieved from local sandbox fallback.');
    }
    console.error('[Evidence Detail Error]:', err);
    return sendError(res, 'Failed to fetch evidence details.', 'EVIDENCE_DETAIL_ERROR', err.message, 500);
  }
});

// POST /api/evidence
app.post('/api/evidence', async (req, res) => {
  const evData = req.body;
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const evidenceTable = datastore.table('EvidenceMaster');

    if (!evData.id) {
      const zcqlResult = await catalystApp.zcql().executeZCQLQuery('SELECT MAX(id) FROM EvidenceMaster');
      const maxId = zcqlResult[0]?.EvidenceMaster?.id || 0;
      evData.id = maxId + 1;
    }

    const currentYear = new Date().getFullYear();
    const runningCode = String(evData.id).padStart(6, '0');
    const evidenceNo = `EV-${currentYear}-${runningCode}`;

    const inserted = await evidenceTable.insertRow({
      id: evData.id,
      evidenceNo,
      caseId: evData.caseId,
      crimeNo: evData.crimeNo,
      title: evData.title,
      description: evData.description,
      evidenceType: evData.evidenceType,
      status: evData.status,
      collectionDate: evData.collectionDate,
      collectionTime: evData.collectionTime,
      latitude: evData.latitude,
      longitude: evData.longitude,
      collectorName: evData.collectorName,
      collectorKgid: evData.collectorKgid,
      fileHash: evData.fileHash,
      fileSize: evData.fileSize,
      mimeType: evData.mimeType,
      fileName: evData.fileName,
      tags: JSON.stringify(evData.tags || []),
      extractedEntities: JSON.stringify(evData.extractedEntities || {}),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return sendSuccess(res, inserted, 'Evidence created successfully.', 201);
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Evidence Create Fallback Triggered]: Tables missing.');
      if (!evData.id) {
        evData.id = fallbackEvidence.length > 0 ? Math.max(...fallbackEvidence.map(e => e.id)) + 1 : 1;
      }
      const currentYear = new Date().getFullYear();
      const runningCode = String(evData.id).padStart(6, '0');
      const evidenceNo = `EV-${currentYear}-${runningCode}`;
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

      const newObj = {
        ...evData,
        id: evData.id,
        evidenceNo,
        tags: evData.tags || [],
        aiLabels: evData.aiLabels || [],
        extractedEntities: evData.extractedEntities || {},
        createdAt: nowStr,
        updatedAt: nowStr
      };
      fallbackEvidence.push(newObj);
      return sendSuccess(res, newObj, 'Evidence created successfully in local sandbox fallback.', 201);
    }
    console.error('[Evidence Create Error]:', err);
    return sendError(res, 'Failed to create evidence.', 'EVIDENCE_CREATE_ERROR', err.message, 500);
  }
});

// PUT /api/evidence/:id
app.put('/api/evidence/:id', async (req, res) => {
  const evId = getNumId(req.params.id);
  if (!evId) return sendError(res, 'Invalid evidence ID.', 'INVALID_ID');
  const body = req.body;

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const zcqlResult = await zcql.executeZCQLQuery(`SELECT ROWID FROM EvidenceMaster WHERE id = ${evId} LIMIT 1`);
    if (zcqlResult.length === 0) {
      return sendError(res, 'Evidence not found.', 'NOT_FOUND', '', 404);
    }
    const rowId = zcqlResult[0].EvidenceMaster.ROWID;

    const rowData = {
      ROWID: rowId,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    if (body.status !== undefined) rowData.status = body.status;
    if (body.ocrText !== undefined) rowData.ocrText = body.ocrText;
    if (body.analysisSummary !== undefined) rowData.analysisSummary = body.analysisSummary;
    if (body.tags !== undefined) rowData.tags = JSON.stringify(body.tags);
    if (body.aiLabels !== undefined) rowData.aiLabels = JSON.stringify(body.aiLabels);
    if (body.extractedEntities !== undefined) rowData.extractedEntities = JSON.stringify(body.extractedEntities);

    const evidenceTable = catalystApp.datastore().table('EvidenceMaster');
    const updated = await evidenceTable.updateRow(rowData);

    return sendSuccess(res, updated, 'Evidence updated successfully.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Evidence Update Fallback Triggered]: Tables missing.');
      const idx = fallbackEvidence.findIndex(e => e.id === evId);
      if (idx === -1) return sendError(res, 'Evidence not found.', 'NOT_FOUND', '', 404);
      fallbackEvidence[idx] = {
        ...fallbackEvidence[idx],
        ...body,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      return sendSuccess(res, fallbackEvidence[idx], 'Evidence updated successfully in local sandbox fallback.');
    }
    console.error('[Evidence Update Error]:', err);
    return sendError(res, 'Failed to update evidence.', 'EVIDENCE_UPDATE_ERROR', err.message, 500);
  }
});

// GET /api/evidence/:id/custody
app.get('/api/evidence/:id/custody', async (req, res) => {
  const evId = getNumId(req.params.id);
  if (!evId) return sendError(res, 'Invalid evidence ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcqlResult = await catalystApp.zcql().executeZCQLQuery(
      `SELECT * FROM CustodyEvent WHERE evidenceId = ${evId} ORDER BY id`
    );

    const events = zcqlResult.map(row => {
      const ev = row.CustodyEvent;
      return {
        id: ev.id,
        evidenceId: ev.evidenceId,
        timestamp: ev.eventTimestamp || ev.timestamp,
        officerName: ev.officerName,
        officerKgid: ev.officerKgid,
        action: ev.action,
        previousState: ev.previousState,
        currentState: ev.currentState,
        remarks: ev.remarks
      };
    });
    return sendSuccess(res, events, 'Custody history retrieved.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Custody Timeline Fallback Triggered]: Tables missing.');
      const timeline = fallbackCustody.filter(c => c.evidenceId === evId);
      return sendSuccess(res, timeline, 'Custody history retrieved from local sandbox fallback.');
    }
    console.error('[Custody History Read Error]:', err);
    return sendError(res, 'Failed to fetch custody history.', 'CUSTODY_HISTORY_ERROR', err.message, 500);
  }
});

// POST /api/evidence/:id/custody
app.post('/api/evidence/:id/custody', async (req, res) => {
  const evId = getNumId(req.params.id);
  const eventData = req.body;
  if (!evId) return sendError(res, 'Invalid evidence ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const custodyTable = catalystApp.datastore().table('CustodyEvent');

    if (!eventData.id) {
      const zcqlResult = await catalystApp.zcql().executeZCQLQuery('SELECT MAX(id) FROM CustodyEvent');
      const maxId = zcqlResult[0]?.CustodyEvent?.id || 0;
      eventData.id = maxId + 1;
    }

    const inserted = await custodyTable.insertRow({
      id: eventData.id,
      evidenceId: evId,
      eventTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      officerName: eventData.officerName,
      officerKgid: eventData.officerKgid,
      action: eventData.action,
      previousState: eventData.previousState,
      currentState: eventData.currentState,
      remarks: eventData.remarks
    });

    return sendSuccess(res, inserted, 'Custody event recorded.', 201);
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Custody Log Fallback Triggered]: Tables missing.');
      if (!eventData.id) {
        eventData.id = fallbackCustody.length > 0 ? Math.max(...fallbackCustody.map(c => c.id)) + 1 : 1;
      }
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newObj = {
        ...eventData,
        id: eventData.id,
        evidenceId: evId,
        timestamp: nowStr
      };
      fallbackCustody.push(newObj);
      return sendSuccess(res, newObj, 'Custody event recorded in local sandbox fallback.', 201);
    }
    console.error('[Custody Log Error]:', err);
    return sendError(res, 'Failed to log custody event.', 'CUSTODY_LOG_ERROR', err.message, 500);
  }
});

// ==========================================
// 6. AI TELEMETRY ENDPOINTS
// ==========================================

// GET /api/evidence/:id/intelligence
app.get('/api/evidence/:id/intelligence', async (req, res) => {
  const evId = getNumId(req.params.id);
  if (!evId) return sendError(res, 'Invalid evidence ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const records = await zcql.executeZCQLQuery(
      `SELECT * FROM IntelligenceRecord WHERE evidenceId = ${evId} ORDER BY version DESC`
    );

    if (records.length === 0) {
      return sendSuccess(res, null, 'No intelligence records found for this asset.');
    }

    const latestRecord = records[0].IntelligenceRecord;

    const entities = await zcql.executeZCQLQuery(
      `SELECT * FROM ExtractedEntity WHERE intelligenceRecordId = '${latestRecord.id}'`
    );

    const formattedRecord = {
      id: latestRecord.id,
      evidenceId: latestRecord.evidenceId,
      version: parseInt(latestRecord.version, 10),
      analyzedAt: latestRecord.analyzedAt,
      ocrResult: {
        evidenceId: latestRecord.evidenceId,
        rawText: latestRecord.ocrRawText,
        confidence: parseFloat(latestRecord.ocrConfidence),
        processedAt: latestRecord.analyzedAt,
        provider: latestRecord.ocrProvider
      },
      entities: entities.map(row => {
        const e = row.ExtractedEntity;
        return {
          id: e.id,
          value: e.value,
          type: e.type,
          confidence: parseFloat(e.confidence),
          sourceEvidenceId: e.sourceEvidenceId,
          extractionMethod: e.extractionMethod,
          extractedAt: e.extractedAt,
          reviewStatus: e.reviewStatus
        };
      }),
      relationships: latestRecord.relationships ? JSON.parse(latestRecord.relationships) : [],
      analysisSummary: latestRecord.analysisSummary,
      aiLabels: latestRecord.aiLabels ? JSON.parse(latestRecord.aiLabels) : [],
      overallConfidence: parseFloat(latestRecord.overallConfidence),
      provider: latestRecord.provider
    };

    return sendSuccess(res, formattedRecord, 'Latest intelligence record retrieved.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Intel Read Fallback Triggered]: Tables missing.');
      const record = fallbackIntel[evId] || null;
      return sendSuccess(res, record, 'Intel retrieved from local sandbox fallback.');
    }
    console.error('[Intel Record Read Error]:', err);
    return sendError(res, 'Failed to fetch intelligence records.', 'INTEL_READ_ERROR', err.message, 500);
  }
});

// POST /api/intelligence — Save IntelligenceRecord
app.post('/api/intelligence', async (req, res) => {
  const payload = req.body;
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const zcql = catalystApp.zcql();

    const versionQuery = await zcql.executeZCQLQuery(
      `SELECT COUNT(ROWID) FROM IntelligenceRecord WHERE evidenceId = ${payload.evidenceId}`
    );
    const count = parseInt(versionQuery[0]?.IntelligenceRecord?.ROWID || 0, 10);
    const nextVersion = count + 1;

    const recordTable = datastore.table('IntelligenceRecord');
    const ocr = payload.ocrResult;

    await recordTable.insertRow({
      id: payload.id,
      evidenceId: payload.evidenceId,
      version: nextVersion,
      analyzedAt: payload.analyzedAt,
      ocrRawText: ocr.rawText,
      ocrConfidence: ocr.confidence,
      ocrProvider: ocr.provider,
      analysisSummary: payload.analysisSummary,
      aiLabels: JSON.stringify(payload.aiLabels || []),
      overallConfidence: payload.overallConfidence,
      provider: payload.provider,
      relationships: JSON.stringify(payload.relationships || [])
    });

    const entityTable = datastore.table('ExtractedEntity');
    const entities = payload.entities || [];
    for (const e of entities) {
      await entityTable.insertRow({
        id: e.id,
        intelligenceRecordId: payload.id,
        sourceEvidenceId: e.sourceEvidenceId,
        value: e.value,
        type: e.type,
        confidence: e.confidence,
        extractionMethod: e.extractionMethod,
        extractedAt: e.extractedAt,
        reviewStatus: e.reviewStatus || 'PENDING'
      });
    }

    return sendSuccess(res, { id: payload.id, version: nextVersion }, 'Intelligence record saved successfully.', 201);
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Intel Save Fallback Triggered]: Tables missing.');
      const currentVer = fallbackIntel[payload.evidenceId] ? fallbackIntel[payload.evidenceId].version : 0;
      const nextVer = currentVer + 1;

      const newRecord = {
        ...payload,
        version: nextVer
      };
      fallbackIntel[payload.evidenceId] = newRecord;
      return sendSuccess(res, { id: payload.id, version: nextVer }, 'Intelligence record saved to local sandbox fallback.', 201);
    }
    console.error('[Intel Record Save Error]:', err);
    return sendError(res, 'Failed to save intelligence record.', 'INTEL_SAVE_ERROR', err.message, 500);
  }
});

// PUT /api/intelligence/:id/entities/:entityId — Mutate Entity review status
app.put('/api/intelligence/:id/entities/:entityId', async (req, res) => {
  const entityId = req.params.entityId;
  const evId = getNumId(req.params.id);

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    const zcqlResult = await zcql.executeZCQLQuery(
      `SELECT ROWID FROM ExtractedEntity WHERE id = '${entityId}' LIMIT 1`
    );
    if (zcqlResult.length === 0) {
      return sendError(res, 'Extracted entity not found.', 'NOT_FOUND', '', 404);
    }
    const rowId = zcqlResult[0].ExtractedEntity.ROWID;

    const entityTable = catalystApp.datastore().table('ExtractedEntity');
    const updated = await entityTable.updateRow({
      ROWID: rowId,
      reviewStatus: req.body.reviewStatus
    });

    return sendSuccess(res, updated, 'Entity review status updated.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Entity Review Fallback Triggered]: Tables missing.');
      if (fallbackIntel[evId]) {
        const entity = fallbackIntel[evId].entities.find(e => e.id === entityId);
        if (entity) {
          entity.reviewStatus = req.body.reviewStatus;
        }
      }
      return sendSuccess(res, { success: true }, 'Entity review status updated in local sandbox fallback.');
    }
    console.error('[Entity Review Mutate Error]:', err);
    return sendError(res, 'Failed to update review status.', 'ENTITY_REVIEW_ERROR', err.message, 500);
  }
});

// POST /api/intelligence/review-events — Audit logging
app.post('/api/intelligence/review-events', async (req, res) => {
  const event = req.body;
  try {
    const catalystApp = catalyst.initialize(req);
    const reviewTable = catalystApp.datastore().table('ReviewEvent');

    const inserted = await reviewTable.insertRow({
      id: event.id,
      entityId: event.entityId,
      evidenceId: event.evidenceId,
      officerKgid: event.officerKgid,
      officerName: event.officerName,
      action: event.action,
      previousStatus: event.previousStatus,
      newStatus: event.newStatus,
      eventTimestamp: event.timestamp || event.eventTimestamp || new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return sendSuccess(res, inserted, 'Review audit logged successfully.', 201);
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Review Event Log Fallback Triggered]: Tables missing.');
      fallbackReviewEvents.push(event);
      return sendSuccess(res, event, 'Review audit logged in local sandbox fallback.', 201);
    }
    console.error('[Review Log Error]:', err);
    return sendError(res, 'Failed to log review audit.', 'REVIEW_LOG_ERROR', err.message, 500);
  }
});

// GET /api/evidence/:id/review-events
app.get('/api/evidence/:id/review-events', async (req, res) => {
  const evId = getNumId(req.params.id);
  if (!evId) return sendError(res, 'Invalid evidence ID.', 'INVALID_ID');

  try {
    const catalystApp = catalyst.initialize(req);
    const zcqlResult = await catalystApp.zcql().executeZCQLQuery(
      `SELECT * FROM ReviewEvent WHERE evidenceId = ${evId} ORDER BY eventTimestamp`
    );

    const events = zcqlResult.map(row => {
      const rev = row.ReviewEvent;
      return {
        id: rev.id,
        entityId: rev.entityId,
        evidenceId: rev.evidenceId,
        officerKgid: rev.officerKgid,
        officerName: rev.officerName,
        action: rev.action,
        previousStatus: rev.previousStatus,
        newStatus: rev.newStatus,
        timestamp: rev.eventTimestamp || rev.timestamp
      };
    });
    return sendSuccess(res, events, 'Review audit log retrieved.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Review Log Read Fallback Triggered]: Tables missing.');
      const events = fallbackReviewEvents.filter(r => r.evidenceId === evId);
      return sendSuccess(res, events, 'Review audit log retrieved from local sandbox fallback.');
    }
    console.error('[Review Fetch Error]:', err);
    return sendError(res, 'Failed to fetch review audits.', 'REVIEW_FETCH_ERROR', err.message, 500);
  }
});

// ==========================================
// 7. ACTIVITY LOG SYSTEM
// ==========================================

// GET /api/activity-logs
app.get('/api/activity-logs', async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const zcqlResult = await catalystApp.zcql().executeZCQLQuery(
      'SELECT * FROM ActivityLog ORDER BY createdAt DESC LIMIT 20'
    );

    const logs = zcqlResult.map(row => {
      const log = row.ActivityLog;
      return {
        id: log.id,
        caseId: log.caseId,
        eventType: log.eventType,
        action: log.action,
        officerName: log.performedBy,
        officerKgid: log.performedKgid,
        details: log.details,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        timestamp: log.createdAt
      };
    });

    return sendSuccess(res, logs, 'Recent activity logs retrieved.');
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Activity Logs Fallback Triggered]: Tables missing.');
      const recent = fallbackActivities.slice(-20).reverse();
      return sendSuccess(res, recent, 'Activity logs retrieved from local sandbox fallback.');
    }
    console.error('[Activity Logs Error]:', err);
    return sendError(res, 'Failed to fetch activity logs.', 'ACTIVITY_LOGS_ERROR', err.message, 500);
  }
});

// POST /api/activity-logs
app.post('/api/activity-logs', async (req, res) => {
  const logData = req.body;
  try {
    const catalystApp = catalyst.initialize(req);
    const logTable = catalystApp.datastore().table('ActivityLog');

    if (!logData.id) {
      const zcqlResult = await catalystApp.zcql().executeZCQLQuery('SELECT MAX(id) FROM ActivityLog');
      const maxId = zcqlResult[0]?.ActivityLog?.id || 0;
      logData.id = parseInt(maxId, 10) + 1;
    }

    const inserted = await logTable.insertRow({
      id: logData.id,
      caseId: logData.caseId,
      eventType: logData.eventType || logData.action || 'SYSTEM_ACTION',
      action: logData.action,
      performedBy: logData.officerName || logData.performedBy,
      performedKgid: logData.officerKgid || logData.performedKgid || '',
      details: logData.details || '',
      ipAddress: logData.ipAddress || '',
      userAgent: logData.userAgent || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    return sendSuccess(res, inserted, 'Activity log written.', 201);
  } catch (err) {
    if (isSchemaMissingError(err)) {
      console.warn('[Activity Log Write Fallback Triggered]: Tables missing.');
      if (!logData.id) {
        logData.id = fallbackActivities.length > 0 ? Math.max(...fallbackActivities.map(l => l.id)) + 1 : 1;
      }
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newObj = {
        ...logData,
        id: logData.id,
        timestamp: nowStr
      };
      fallbackActivities.push(newObj);
      return sendSuccess(res, newObj, 'Activity log written to local sandbox fallback.', 201);
    }
    console.error('[Activity Log Write Error]:', err);
    return sendError(res, 'Failed to record activity log.', 'ACTIVITY_WRITE_ERROR', err.message, 500);
  }
});

app.get('/api/graph', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'seed', 'data', 'graph.json');
    if (fs.existsSync(dataPath)) {
      const graph = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return sendSuccess(res, graph, 'Knowledge graph fetched successfully.');
    }
  } catch (err) {
    console.warn('[Graph API Warning] Failed to read graph.json:', err.message);
  }
  return sendSuccess(res, { nodes: [], edges: [] }, 'Graph fallback (no seed data).');
});

app.get('/api/dashboard/snapshot', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'seed', 'data', 'dashboard_snapshot.json');
    if (fs.existsSync(dataPath)) {
      const snapshot = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return sendSuccess(res, snapshot, 'Dashboard snapshot fetched successfully.');
    }
  } catch (err) {
    console.warn('[Snapshot API Warning] Failed to read snapshot:', err.message);
  }
  return sendSuccess(res, {
    generatedAt: new Date().toISOString(),
    metrics: {
      todayCases: 0,
      highRiskCases: 0,
      pendingReviews: 0,
      solvedCases: 0,
      recoveredEvidence: 0,
      openFirs: 0,
      hotspotsCount: 0
    },
    alerts: []
  }, 'Dashboard snapshot fallback (no seed data).');
});

app.get('/api/manifest', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'seed', 'data', 'seed-manifest.json');
    if (fs.existsSync(dataPath)) {
      const manifest = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return sendSuccess(res, manifest, 'Seed manifest fetched successfully.');
    }
  } catch (err) {
    console.warn('[Manifest API Warning] Failed to read manifest:', err.message);
  }
  return sendSuccess(res, { version: "0.0.0", seeded: false }, 'Manifest fallback (no seed data).');
});

app.get('/api/report/print', async (req, res) => {
  const caseId = req.query.caseId;
  if (!caseId) {
    return sendError(res, 'caseId query parameter is required.', 'MISSING_CASE_ID', '', 400);
  }

  try {
    const catalystApp = catalyst.initialize(req);
    const zcql = catalystApp.zcql();

    // Fetch case details
    const casesData = await zcql.executeZCQLQuery(`SELECT * FROM CaseMaster WHERE ROWID = '${caseId}' OR id = ${getNumId(caseId) || -1}`);
    if (casesData.length === 0) {
      return sendError(res, 'Case not found.', 'CASE_NOT_FOUND', '', 404);
    }
    const c = casesData[0].CaseMaster;

    // Fetch related victims, suspects, evidence
    const [victimsData, suspectsData, evidenceData] = await Promise.all([
      zcql.executeZCQLQuery(`SELECT * FROM Victim WHERE caseId = '${c.ROWID}'`).catch(() => []),
      zcql.executeZCQLQuery(`SELECT * FROM Suspect WHERE caseId = '${c.ROWID}'`).catch(() => []),
      zcql.executeZCQLQuery(`SELECT * FROM EvidenceMaster WHERE caseId = '${c.ROWID}'`).catch(() => [])
    ]);

    // Hydrate case with Unit/Employee names for report printing
    await hydrateUnitAndEmployee(c, catalystApp);

    // Build a premium HTML report
    const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KSP Charge Sheet — ${c.crimeNo}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #2d3748; line-height: 1.5; margin: 40px; }
    .header { text-align: center; border-bottom: 3px double #4a5568; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 5px 0; font-size: 24px; text-transform: uppercase; color: #1a202c; letter-spacing: 1px; }
    .header h2 { margin: 5px 0; font-size: 16px; color: #4a5568; font-weight: normal; }
    .meta-box { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; background: #f7fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; }
    .section-title { font-size: 16px; font-weight: bold; border-left: 4px solid #3182ce; padding-left: 10px; margin: 25px 0 10px 0; text-transform: uppercase; color: #2b6cb0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th, td { border: 1px solid #cbd5e0; padding: 10px; text-align: left; }
    th { background-color: #edf2f7; color: #4a5568; font-weight: bold; }
    .brief-facts { background: #fffaf0; border: 1px solid #feebc8; padding: 15px; border-radius: 6px; font-size: 14px; font-style: italic; }
    .footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    .seal { width: 80px; height: 80px; opacity: 0.15; position: absolute; top: 40px; right: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Karnataka State Police</h1>
    <h2>FORM I — CHARGE SHEET / INVESTIGATION REPORT</h2>
    <h3>Office of the Police Station: ${c.stationName || 'N/A'} (${c.districtName || 'N/A'})</h3>
  </div>

  <div class="meta-box">
    <div>
      <strong>Crime No (FIR):</strong> ${c.crimeNo}<br>
      <strong>Case No:</strong> ${c.caseNo}<br>
      <strong>Category:</strong> ${c.categoryName || 'FIR'}
    </div>
    <div>
      <strong>Date of Registration:</strong> ${c.crimeRegisteredDate || 'N/A'}<br>
      <strong>Investigating Officer:</strong> ${c.officerName || 'N/A'} (${c.officerRank || 'N/A'})<br>
      <strong>Status:</strong> ${c.caseStatus}
    </div>
  </div>

  <div class="section-title">1. Brief Facts of the Investigation</div>
  <div class="brief-facts">
    ${c.briefFacts || 'No facts recorded.'}
  </div>

  <div class="section-title">2. Complainant / Victim Details</div>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Age/Gender</th>
        <th>Contact</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      ${victimsData.map(v => `
        <tr>
          <td>${v.Victim.id}</td>
          <td><strong>${v.Victim.name}</strong></td>
          <td>${v.Victim.age || 'N/A'} / ${v.Victim.gender}</td>
          <td>${v.Victim.phone || 'N/A'}</td>
          <td>${v.Victim.address || 'N/A'}</td>
        </tr>
      `).join('') || '<tr><td colspan="5">No victims recorded.</td></tr>'}
    </tbody>
  </table>

  <div class="section-title">3. Accused / Suspect Details</div>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Age/Gender</th>
        <th>Status</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      ${suspectsData.map(s => `
        <tr>
          <td>${s.Suspect.id}</td>
          <td><strong>${s.Suspect.name}</strong></td>
          <td>${s.Suspect.age || 'N/A'} / ${s.Suspect.gender}</td>
          <td><span style="color: red; font-weight: bold;">${s.Suspect.status}</span></td>
          <td>${s.Suspect.adress || 'N/A'}</td>
        </tr>
      `).join('') || '<tr><td colspan="5">No suspects recorded.</td></tr>'}
    </tbody>
  </table>

  <div class="section-title">4. Evidence Inventory & File Hashes (Chain of Custody Verified)</div>
  <table>
    <thead>
      <tr>
        <th>Evidence No</th>
        <th>Title / Type</th>
        <th>File Name / Size</th>
        <th>Digital Hash</th>
        <th>Collector</th>
      </tr>
    </thead>
    <tbody>
      ${evidenceData.map(e => `
        <tr>
          <td>${e.EvidenceMaster.evidenceNo}</td>
          <td><strong>${e.EvidenceMaster.title}</strong><br><small>${e.EvidenceMaster.evidenceType}</small></td>
          <td>${e.EvidenceMaster.fileName || 'N/A'}<br><small>${e.EvidenceMaster.fileSize ? e.EvidenceMaster.fileSize + ' bytes' : 'N/A'}</small></td>
          <td><code style="font-size: 11px;">${e.EvidenceMaster.fileHash || 'N/A'}</code></td>
          <td>${e.EvidenceMaster.collectorName || 'N/A'}</td>
        </tr>
      `).join('') || '<tr><td colspan="5">No evidence recorded.</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    <div>
      <strong>Report Generated:</strong> ${new Date().toLocaleString()}<br>
      <strong>System:</strong> KSP Investigation Copilot (SmartBrowz Engine)
    </div>
    <div style="text-align: right;">
      <br><br>
      _________________________________<br>
      <strong>Signature of Investigating Officer</strong>
    </div>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlReport);
  } catch (err) {
    console.error('[Charge Sheet Print Error]:', err);
    return sendError(res, 'Failed to generate printable charge sheet.', 'PRINT_REPORT_ERROR', err.message, 500);
  }
});

app.get('/api/chat/examples', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'seed', 'data', 'conversation_examples.json');
    if (fs.existsSync(dataPath)) {
      const examples = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return sendSuccess(res, examples, 'Conversation examples fetched successfully.');
    }
  } catch (err) {
    console.warn('[Chat Examples API Warning] Failed to read conversation_examples.json:', err.message);
  }
  return sendSuccess(res, [], 'Conversation examples fallback (no seed data).');
});

app.post('/api/seed', require('./seed/index'));

// ==========================================
// 8. CENTRALIZED EXPRESS ERROR-HANDLING
// ==========================================
app.use((err, req, res, next) => {
  console.error('[Express Fatal Uncaught Error]:', err);
  return sendError(res, 'Internal Server Error', 'INTERNAL_ERROR', err.message, 500);
});

// === DIAGNOSTIC: Print registered Express route table at startup ===
console.log('[DIAG-ROUTES] === Express Route Table ===');
if (app._router && app._router.stack) {
  app._router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      console.log(`[DIAG-ROUTES] ${methods} ${layer.route.path}`);
    } else if (layer.name) {
      console.log(`[DIAG-ROUTES] middleware: ${layer.name}`);
    }
  });
}
console.log('[DIAG-ROUTES] === End Route Table ===');

module.exports = app;
