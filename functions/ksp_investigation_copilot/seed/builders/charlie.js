const { insertInBatches, getDateOffset, getRowIdMappings } = require('./helpers');

async function seedCharlie(datastore, zcql) {
  const caseId = 3;
  const baseMs = new Date("2026-03-10 09:00:00").getTime();

  // Load lookup mappings to map integer IDs to live ROWIDs
  const maps = await getRowIdMappings(zcql);

  // 1. CaseMaster (Charlie Money Laundering)
  const caseData = {
    id: caseId,
    crimeNo: "104430006202600003",
    caseNo: "202600003",
    crimeRegisteredDate: getDateOffset(baseMs, 0),
    policePersonId: maps.Employee[2], // Live ROWID for DSP Kiran Reddy
    policeStationId: maps.Unit[8],   // Live ROWID for Mysuru Town Police Station
    caseCategoryId: maps.CaseCategory[1], // Live ROWID for FIR
    gravityOffenceId: maps.GravityOffence[1], // Live ROWID for Heinous
    crimeMajorHeadId: maps.CrimeHead[40],   // Live ROWID for Economic Offenses
    crimeMinorHeadId: maps.CrimeSubHead[402], // Live ROWID for Money Laundering
    caseStatus: "UNDER_INVESTIGATION",
    casePriority: "MEDIUM",
    briefFacts: "Suspected money laundering using a shell company front called Zenith Trading. Investigation reveals unauthorized transactions depositing over Rs. 50,000,000 into Bank Account 1122334455, which is also identified as a destination account for multiple Cyber Phishing scams.",
    incidentFromDate: getDateOffset(baseMs, -60),
    incidentToDate: getDateOffset(baseMs, -5),
    infoReceivedPSDate: getDateOffset(baseMs, -2),
    latitude: 12.2958,
    longitude: 76.6394,
    createdAt: getDateOffset(baseMs, 0),
    updatedAt: getDateOffset(baseMs, 2)
  };

  let caseRowId;
  try {
    const exist = await zcql.executeZCQLQuery(`SELECT ROWID FROM CaseMaster WHERE id = ${caseId}`);
    if (exist.length === 0) {
      const inserted = await datastore.table("CaseMaster").insertRow(caseData);
      caseRowId = inserted.ROWID;
    } else {
      caseRowId = exist[0].CaseMaster.ROWID;
    }
  } catch (err) {
    console.error("[Seeder Error] Failed to seed CaseMaster for Case Charlie:", err.message);
    throw err;
  }

  // 2. Victims (2 Victims)
  const victims = [
    {
      id: 5,
      caseId: caseRowId,
      name: "Reserve Bank Compliance Unit",
      age: 0,
      gender: "OTHER",
      phone: "02222601000",
      email: "compliance@rbi.org.in",
      address: "Mumbai Central, Maharashtra"
    },
    {
      id: 6,
      caseId: caseRowId,
      name: "Karnataka State Financial Registry",
      age: 0,
      gender: "OTHER",
      phone: "08022251111",
      email: "registry.finance@karnataka.gov.in",
      address: "Multistorey Building, Bangalore"
    }
  ];
  try {
    const existV = await zcql.executeZCQLQuery(`SELECT id FROM Victim WHERE caseId = '${caseRowId}'`);
    if (existV.length === 0) {
      await insertInBatches(datastore.table("Victim"), victims);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Victim for Case Charlie:", err.message);
  }

  // 3. Suspects (2 Suspects)
  const suspects = [
    {
      id: 5,
      caseId: caseRowId,
      name: "Animesh Roy",
      age: 44,
      gender: "MALE",
      phone: "9945000111",
      email: "animesh.roy@zenithtrading.in",
      adress: "Villas 12, Nandi Hills Road, Devanahalli, Bangalore",
      status: "SUSPECTED",
      extractedEntities: JSON.stringify({ alias: ["Director Animesh"], bank: ["1122334455"] })
    },
    {
      id: 6,
      caseId: caseRowId,
      name: "Priyesh Mehta",
      age: 38,
      gender: "MALE",
      phone: "9900223344",
      email: "priyesh.ca@mehta-associates.com",
      adress: "Apartment 404, Kalyan Nagar, Bangalore",
      status: "INTERROGATED",
      extractedEntities: JSON.stringify({ alias: ["CA Priyesh"] })
    }
  ];
  try {
    const existS = await zcql.executeZCQLQuery(`SELECT id FROM Suspect WHERE caseId = '${caseRowId}'`);
    if (existS.length === 0) {
      await insertInBatches(datastore.table("Suspect"), suspects);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Suspect for Case Charlie:", err.message);
  }

  // 4. Evidence (3 pieces)
  const evidenceData = [
    {
      id: 7,
      evidenceNo: "EV-2026-000007",
      caseId: caseRowId,
      crimeNo: "104430006202600003",
      title: "Zenith Trading Financial Ledger",
      description: "Excel sheets detailing transaction journals containing cash inflow matching bank deposits.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-11",
      collectionTime: "10:30",
      latitude: 12.2958,
      longitude: 76.6394,
      collectorName: "Kiran Reddy",
      collectorKgid: "999999",
      fileHash: "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      fileSize: 489000,
      mimeType: "application/pdf",
      fileName: "financial_ledger_zenith.pdf",
      tags: JSON.stringify(["audit", "ledger", "financial"]),
      ocrText: "LEDGER AUDIT: CASH INFLOW DEPOSIT INTO ACCOUNT 1122334455. TRANSFERS TOTAL RS. 5,00,00,000.",
      aiLabels: JSON.stringify(["ledger", "bank_account"]),
      analysisSummary: "Transaction log matches destination account 1122334455 which is linked to Cyber Phishing (Case Alpha).",
      extractedEntities: JSON.stringify({ other: ["1122334455"] }),
      createdAt: getDateOffset(baseMs, 1),
      updatedAt: getDateOffset(baseMs, 1)
    },
    {
      id: 8,
      evidenceNo: "EV-2026-000008",
      caseId: caseRowId,
      crimeNo: "104430006202600003",
      title: "Corporate Registration Document",
      description: "Incorporation certificate for Zenith Trading listing dummy board members and directors.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-12",
      collectionTime: "12:00",
      latitude: 12.2958,
      longitude: 76.6394,
      collectorName: "Kiran Reddy",
      collectorKgid: "999999",
      fileHash: "f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
      fileSize: 1045000,
      mimeType: "application/pdf",
      fileName: "incorporation_certificate.pdf",
      tags: JSON.stringify(["corporate", "dummy_directors", "certificate"]),
      ocrText: "CERTIFICATE OF INCORPORATION: ZENITH TRADING PRIVATE LTD. DIRECTORS: ANIMESH ROY, PRIYESH MEHTA.",
      aiLabels: JSON.stringify(["certificate", "corporate"]),
      analysisSummary: "Corporate document lists Suspects Animesh and Priyesh as key signatories.",
      extractedEntities: JSON.stringify({ person: ["Animesh Roy", "Priyesh Mehta"] }),
      createdAt: getDateOffset(baseMs, 1.5),
      updatedAt: getDateOffset(baseMs, 1.5)
    },
    {
      id: 9,
      evidenceNo: "EV-2026-000009",
      caseId: caseRowId,
      crimeNo: "104430006202600003",
      title: "Bank Account Audit Statement - Account 1122334455",
      description: "Bank audit log documenting multiple micro-deposits from external sources followed by immediate lump-sum transfers.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-13",
      collectionTime: "15:00",
      latitude: 12.2958,
      longitude: 76.6394,
      collectorName: "Kiran Reddy",
      collectorKgid: "999999",
      fileHash: "c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1",
      fileSize: 85900,
      mimeType: "application/pdf",
      fileName: "bank_audit_1122334455.pdf",
      tags: JSON.stringify(["audit", "bank_statement"]),
      ocrText: "AUDIT LOG DETAILS: DEPOSIT FROM MULTIPLE ACCOUNTS TO A/C 1122334455. SOURCE INCLUDES WALLET kspbank@upi.",
      aiLabels: JSON.stringify(["audit", "mule_account"]),
      analysisSummary: "Evidence demonstrates the account acted as a laundry sink for the kspbank@upi phishing wallet.",
      extractedEntities: JSON.stringify({ other: ["1122334455", "kspbank@upi"] }),
      createdAt: getDateOffset(baseMs, 2),
      updatedAt: getDateOffset(baseMs, 2)
    }
  ];

  const evidenceRowIds = {};
  try {
    const existE = await zcql.executeZCQLQuery(`SELECT ROWID, id FROM EvidenceMaster WHERE caseId = '${caseRowId}'`);
    if (existE.length === 0) {
      for (const ev of evidenceData) {
        const inserted = await datastore.table("EvidenceMaster").insertRow(ev);
        evidenceRowIds[ev.id] = inserted.ROWID;
      }
    } else {
      existE.forEach(r => {
        evidenceRowIds[parseInt(r.EvidenceMaster.id, 10)] = r.EvidenceMaster.ROWID;
      });
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed EvidenceMaster for Case Charlie:", err.message);
  }

  // 5. CustodyEvents (4 events)
  const custody = [
    {
      id: 9,
      evidenceId: evidenceRowIds[7],
      eventTimestamp: getDateOffset(baseMs, 1.2),
      officerName: "Kiran Reddy",
      officerKgid: "999999",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "financial ledger documents logged."
    },
    {
      id: 10,
      evidenceId: evidenceRowIds[8],
      eventTimestamp: getDateOffset(baseMs, 1.7),
      officerName: "Kiran Reddy",
      officerKgid: "999999",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Incorporation certificate filed."
    },
    {
      id: 11,
      evidenceId: evidenceRowIds[9],
      eventTimestamp: getDateOffset(baseMs, 2.2),
      officerName: "Kiran Reddy",
      officerKgid: "999999",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Bank account audit sheet secured."
    },
    {
      id: 12,
      evidenceId: evidenceRowIds[9],
      eventTimestamp: getDateOffset(baseMs, 3.2),
      officerName: "Priyanka Patil",
      officerKgid: "KGID000005",
      action: "TRANSFERRED",
      previousState: "SECURED",
      currentState: "SECURED",
      remarks: "Transferred bank statement to Forensic Auditor."
    }
  ];
  try {
    if (evidenceRowIds[7] && evidenceRowIds[8] && evidenceRowIds[9]) {
      const existC = await zcql.executeZCQLQuery(`SELECT id FROM CustodyEvent WHERE evidenceId IN ('${evidenceRowIds[7]}','${evidenceRowIds[8]}','${evidenceRowIds[9]}')`);
      if (existC.length === 0) {
        await insertInBatches(datastore.table("CustodyEvent"), custody);
      }
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed CustodyEvent for Case Charlie:", err.message);
  }

  // 6. InvestigationNotes (4 notes)
  const notes = [
    {
      id: 9,
      caseId: caseRowId,
      content: "Opened economic offense investigation against Zenith Trading following RBI compliance flagging.",
      createdBy: "Kiran Reddy",
      createdKgid: "999999",
      createdAt: getDateOffset(baseMs, 0.5),
      updatedAt: getDateOffset(baseMs, 0.5),
      isDeleted: false
    },
    {
      id: 10,
      caseId: caseRowId,
      content: "Director Animesh Roy claims incoming funds were legitimate trade receipts. However, invoicing records lack supporting logistics data.",
      createdBy: "Kiran Reddy",
      createdKgid: "999999",
      createdAt: getDateOffset(baseMs, 1.5),
      updatedAt: getDateOffset(baseMs, 1.5),
      isDeleted: false
    },
    {
      id: 11,
      caseId: caseRowId,
      content: "Seized bank account 1122334455 statement. Discovered active deposits from kspbank@upi, verifying integration with Cyber Syndicate (Case Alpha).",
      createdBy: "Kiran Reddy",
      createdKgid: "999999",
      createdAt: getDateOffset(baseMs, 2.5),
      updatedAt: getDateOffset(baseMs, 2.5),
      isDeleted: false
    },
    {
      id: 12,
      caseId: caseRowId,
      content: "Freezing account 1122334455 assets. Preparing notices for CA Priyesh Mehta.",
      createdBy: "Kiran Reddy",
      createdKgid: "999999",
      createdAt: getDateOffset(baseMs, 3.5),
      updatedAt: getDateOffset(baseMs, 3.5),
      isDeleted: false
    }
  ];
  try {
    const existN = await zcql.executeZCQLQuery(`SELECT id FROM InvestigationNote WHERE caseId = '${caseRowId}'`);
    if (existN.length === 0) {
      await insertInBatches(datastore.table("InvestigationNote"), notes);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed InvestigationNote for Case Charlie:", err.message);
  }

  // 7. ActivityLogs (10 logs)
  const logs = [];
  const logActions = ["CREATED", "NOTE_ADDED", "EVIDENCE_ADDED", "STATUS_CHANGED"];
  for (let i = 1; i <= 10; i++) {
    logs.push({
      id: 20 + i,
      caseId: caseRowId,
      crimeNo: "104430006202600003",
      caseNo: "202600003",
      officerName: "Kiran Reddy",
      action: logActions[i % logActions.length],
      eventTimestamp: getDateOffset(baseMs, i * 6)
    });
  }
  try {
    const existL = await zcql.executeZCQLQuery(`SELECT id FROM ActivityLog WHERE caseId = '${caseRowId}'`);
    if (existL.length === 0) {
      await insertInBatches(datastore.table("ActivityLog"), logs);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed ActivityLog for Case Charlie:", err.message);
  }
}

module.exports = {
  seedCharlie
};
