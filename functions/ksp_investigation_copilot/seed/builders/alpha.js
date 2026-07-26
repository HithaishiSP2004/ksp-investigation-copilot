const { insertInBatches, getDateOffset, getRowIdMappings } = require('./helpers');

async function seedAlpha(datastore, zcql) {
  const caseId = 1;
  const baseMs = new Date("2026-03-01 10:00:00").getTime();

  // Load lookup mappings to map integer IDs to live ROWIDs
  const maps = await getRowIdMappings(zcql);

  // 1. CaseMaster (Cyber Fraud Syndicate)
  const caseData = {
    id: caseId,
    crimeNo: "104430006202600001",
    caseNo: "202600001",
    crimeRegisteredDate: getDateOffset(baseMs, 0),
    policePersonId: maps.Employee[4], // Live ROWID for Siddharth Sagar
    policeStationId: maps.Unit[6],   // Live ROWID for Bengaluru Cyber Crime PS
    caseCategoryId: maps.CaseCategory[1], // Live ROWID for FIR
    gravityOffenceId: maps.GravityOffence[2], // Live ROWID for Non-Heinous
    crimeMajorHeadId: maps.CrimeHead[20],   // Live ROWID for Cyber Crime
    crimeMinorHeadId: maps.CrimeSubHead[202], // Live ROWID for Online Financial Fraud
    caseStatus: "UNDER_INVESTIGATION",
    casePriority: "HIGH",
    briefFacts: "A sophisticated cyber-phishing campaign posing as Karnataka Bank defrauded several victims by diverting funds to a central mule UPI wallet (kspbank@upi). The syndicate operated using virtual private networks and burner SIM card 9876543210.",
    incidentFromDate: getDateOffset(baseMs, -24),
    incidentToDate: getDateOffset(baseMs, -2),
    infoReceivedPSDate: getDateOffset(baseMs, -1),
    latitude: 12.9716,
    longitude: 77.5946,
    createdAt: getDateOffset(baseMs, 0),
    updatedAt: getDateOffset(baseMs, 4)
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
    console.error("[Seeder Error] Failed to seed CaseMaster for Case Alpha:", err.message);
    throw err; // CaseMaster is critical, we must throw
  }

  // 2. Victims (2 Victims)
  const victims = [
    {
      id: 1,
      caseId: caseRowId,
      name: "Shruti Hegde",
      age: 34,
      gender: "FEMALE",
      phone: "9811223344",
      email: "shruti.h@example.com",
      address: "No. 12, 4th Cross, Indiranagar, Bangalore"
    },
    {
      id: 2,
      caseId: caseRowId,
      name: "Rajesh Gowda",
      age: 45,
      gender: "MALE",
      phone: "9900112233",
      email: "rajesh.g@example.com",
      address: "No. 88, ITPL Main Road, Whitefield, Bangalore"
    }
  ];
  try {
    const existV = await zcql.executeZCQLQuery(`SELECT id FROM Victim WHERE caseId = '${caseRowId}'`);
    if (existV.length === 0) {
      await insertInBatches(datastore.table("Victim"), victims);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Victim for Case Alpha:", err.message);
  }

  // 3. Suspects (2 Suspects)
  const suspects = [
    {
      id: 1,
      caseId: caseRowId,
      name: "Mohit Sharma",
      age: 28,
      gender: "MALE",
      phone: "9876543210",
      email: "mohit.cyber@mule.in",
      adress: "Rental Room 3, 2nd Block, Peenya Industrial Area, Bangalore",
      status: "SUSPECTED",
      extractedEntities: JSON.stringify({ alias: ["Mule operator"], device: ["Redmi Note 10"] })
    },
    {
      id: 2,
      caseId: caseRowId,
      name: "Alok Dubey",
      age: 31,
      gender: "MALE",
      phone: "9731223344",
      email: "alok.dubey@hacker.io",
      adress: "PG Accommodation, Marathahalli, Bangalore",
      status: "ABSCONDING",
      extractedEntities: JSON.stringify({ alias: ["Shadow coder"] })
    }
  ];
  try {
    const existS = await zcql.executeZCQLQuery(`SELECT id FROM Suspect WHERE caseId = '${caseRowId}'`);
    if (existS.length === 0) {
      await insertInBatches(datastore.table("Suspect"), suspects);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Suspect for Case Alpha:", err.message);
  }

  // 4. Evidence (3 pieces)
  const evidenceData = [
    {
      id: 1,
      evidenceNo: "EV-2026-000001",
      caseId: caseRowId,
      crimeNo: "104430006202600001",
      title: "Bank Statement - Fraudulent UPI Transfers",
      description: "PDF bank statement containing details of Rs. 1,50,000 sent from victim Shruti's account to beneficiary wallet kspbank@upi.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-02",
      collectionTime: "11:00",
      latitude: 12.9716,
      longitude: 77.5946,
      collectorName: "Siddharth Sagar",
      collectorKgid: "KGID000004",
      fileHash: "a1b2c3d4e5f60708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
      fileSize: 204850,
      mimeType: "application/pdf",
      fileName: "victim_statement_fraud.pdf",
      tags: JSON.stringify(["cyber", "phishing", "bank_record"]),
      ocrText: "TRANSFER RECEIPT: SUCCESS. TO: kspbank@upi. FROM: SHRUTI HEGDE. AMOUNT: 150000. DATE: 2026-03-01. IP LOCATION: 12.95, 77.58.",
      aiLabels: JSON.stringify(["financial", "transfer", "phishing"]),
      analysisSummary: "AI detected transaction to flagged UPI wallet (kspbank@upi) from Indiranagar node.",
      extractedEntities: JSON.stringify({ person: ["Shruti Hegde"], email: ["kspbank@upi"] }),
      createdAt: getDateOffset(baseMs, 2),
      updatedAt: getDateOffset(baseMs, 2)
    },
    {
      id: 2,
      evidenceNo: "EV-2026-000002",
      caseId: caseRowId,
      crimeNo: "104430006202600001",
      title: "Call Detail Records (CDR) - SIM 9876543210",
      description: "Excel records of calling history showing high density of coordination calls from location Peenya tower.",
      evidenceType: "DIGITAL",
      status: "SECURED",
      collectionDate: "2026-03-03",
      collectionTime: "14:15",
      latitude: 12.98,
      longitude: 77.54,
      collectorName: "Siddharth Sagar",
      collectorKgid: "KGID000004",
      fileHash: "f6e7d8c9b0a1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7",
      fileSize: 45890,
      mimeType: "application/vnd.ms-excel",
      fileName: "cdr_9876543210.xlsx",
      tags: JSON.stringify(["cdr", "burner_sim", "peenya"]),
      ocrText: "CDR EXCEL: IMEI: IMEI8899889988. CALL TO: 9876543210. CELL ID: TWR-PEENYA-01. TIMESTAMP: 2026-03-01 11:30.",
      aiLabels: JSON.stringify(["call_log", "cdr", "imei"]),
      analysisSummary: "CDR links burner SIM 9876543210 to IMEI8899889988. Calls cluster heavily around Peenya tower.",
      extractedEntities: JSON.stringify({ phone: ["9876543210"], other: ["IMEI8899889988"] }),
      createdAt: getDateOffset(baseMs, 3),
      updatedAt: getDateOffset(baseMs, 3)
    },
    {
      id: 3,
      evidenceNo: "EV-2026-000003",
      caseId: caseRowId,
      crimeNo: "104430006202600001",
      title: "IP Login Log History",
      description: "Server audit record detailing access IPs used to monitor the beneficiary wallet.",
      evidenceType: "DIGITAL",
      status: "SECURED",
      collectionDate: "2026-03-04",
      collectionTime: "09:00",
      latitude: 12.9716,
      longitude: 77.5946,
      collectorName: "Siddharth Sagar",
      collectorKgid: "KGID000004",
      fileHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      fileSize: 12300,
      mimeType: "text/plain",
      fileName: "wallet_ip_log.txt",
      tags: JSON.stringify(["ip_log", "login_history"]),
      ocrText: "ACCESS LOG FOR WALLET kspbank@upi. LOGIN IP: 103.44.20.10. DATE: 2026-03-01. LOCATION: Indiranagar Node.",
      aiLabels: JSON.stringify(["ip", "network"]),
      analysisSummary: "Logs indicate constant wallet access from IP 103.44.20.10 located in Indiranagar Node.",
      extractedEntities: JSON.stringify({ other: ["103.44.20.10"] }),
      createdAt: getDateOffset(baseMs, 4),
      updatedAt: getDateOffset(baseMs, 4)
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
    console.warn("[Seeder Warning] Failed to seed EvidenceMaster for Case Alpha:", err.message);
  }

  // 5. CustodyEvents (4 events)
  const custody = [
    {
      id: 1,
      evidenceId: evidenceRowIds[1],
      eventTimestamp: getDateOffset(baseMs, 2.5),
      officerName: "Siddharth Sagar",
      officerKgid: "KGID000004",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Received digital document copy from bank fraud unit."
    },
    {
      id: 2,
      evidenceId: evidenceRowIds[2],
      eventTimestamp: getDateOffset(baseMs, 3.5),
      officerName: "Siddharth Sagar",
      officerKgid: "KGID000004",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Sourced CDR log sheet from network service provider."
    },
    {
      id: 3,
      evidenceId: evidenceRowIds[3],
      eventTimestamp: getDateOffset(baseMs, 4.5),
      officerName: "Siddharth Sagar",
      officerKgid: "KGID000004",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Extracted access log text file from mule server."
    },
    {
      id: 4,
      evidenceId: evidenceRowIds[1],
      eventTimestamp: getDateOffset(baseMs, 5.5),
      officerName: "Priyanka Patil",
      officerKgid: "KGID000005",
      action: "TRANSFERRED",
      previousState: "SECURED",
      currentState: "SECURED",
      remarks: "Transferred to Forensic Cell for file signature check."
    }
  ];
  try {
    if (evidenceRowIds[1] && evidenceRowIds[2] && evidenceRowIds[3]) {
      const existC = await zcql.executeZCQLQuery(`SELECT id FROM CustodyEvent WHERE evidenceId IN ('${evidenceRowIds[1]}','${evidenceRowIds[2]}','${evidenceRowIds[3]}')`);
      if (existC.length === 0) {
        await insertInBatches(datastore.table("CustodyEvent"), custody);
      }
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed CustodyEvent for Case Alpha:", err.message);
  }

  // 6. InvestigationNotes (4 notes)
  const notes = [
    {
      id: 1,
      caseId: caseRowId,
      content: "FIR registered. The modus operandi involves SMS bank spoofing asking the user to update their KYC parameters using a fraudulent bank portal link.",
      createdBy: "Siddharth Sagar",
      createdKgid: "KGID000004",
      createdAt: getDateOffset(baseMs, 1),
      updatedAt: getDateOffset(baseMs, 1),
      isDeleted: false
    },
    {
      id: 2,
      caseId: caseRowId,
      content: "Acquired statements from Shruti Hegde and Rajesh Gowda. Both confirmed loss occurred within minutes of using the fake portal.",
      createdBy: "Siddharth Sagar",
      createdKgid: "KGID000004",
      createdAt: getDateOffset(baseMs, 2),
      updatedAt: getDateOffset(baseMs, 2),
      isDeleted: false
    },
    {
      id: 3,
      caseId: caseRowId,
      content: "Burner SIM card 9876543210 located. Sourced cell tower records confirming active logins. Linked cell ID matches Peenya Tower nodes.",
      createdBy: "Siddharth Sagar",
      createdKgid: "KGID000004",
      createdAt: getDateOffset(baseMs, 3),
      updatedAt: getDateOffset(baseMs, 3),
      isDeleted: false
    },
    {
      id: 4,
      caseId: caseRowId,
      content: "Dispatched warning signals to cyber crime networks to freeze beneficiary wallet address kspbank@upi.",
      createdBy: "Siddharth Sagar",
      createdKgid: "KGID000004",
      createdAt: getDateOffset(baseMs, 4),
      updatedAt: getDateOffset(baseMs, 4),
      isDeleted: false
    }
  ];
  try {
    const existN = await zcql.executeZCQLQuery(`SELECT id FROM InvestigationNote WHERE caseId = '${caseRowId}'`);
    if (existN.length === 0) {
      await insertInBatches(datastore.table("InvestigationNote"), notes);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed InvestigationNote for Case Alpha:", err.message);
  }

  // 7. ActivityLogs (10 logs)
  const logs = [];
  const logActions = ["CREATED", "NOTE_ADDED", "EVIDENCE_ADDED", "STATUS_CHANGED"];
  for (let i = 1; i <= 10; i++) {
    logs.push({
      id: i,
      caseId: caseRowId,
      crimeNo: "104430006202600001",
      caseNo: "202600001",
      officerName: "Siddharth Sagar",
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
    console.warn("[Seeder Warning] Failed to seed ActivityLog for Case Alpha:", err.message);
  }

  // 8. ReviewEvents (AI Persona Recommendations: 1 approved, 1 rejected/override)
  const reviews = [
    {
      id: 1,
      caseId: caseRowId,
      evidenceId: evidenceRowIds[1],
      recommType: "SUSPECT_LINK",
      recommValue: "Evidence Analyst AI suggested linking case to local petty offender Suresh Gowda based on surname similarity.",
      confidence: 0.54,
      status: "REJECTED",
      reviewedBy: "Siddharth Sagar",
      remarks: "Rejected: Suresh Gowda is a vehicle driver in Mysuru, not linked to the Bangalore Cyber Phishing syndicate network. Discrepancy logged.",
      createdAt: getDateOffset(baseMs, 3)
    },
    {
      id: 2,
      caseId: caseRowId,
      evidenceId: evidenceRowIds[2],
      recommType: "CROSS_CASE_LINK",
      recommValue: "Crime Link Engine AI detected 98% matching burner IMEI in Narcotics Case Bravo suspect device logs.",
      confidence: 0.97,
      status: "APPROVED",
      reviewedBy: "Siddharth Sagar",
      remarks: "Approved: Conclusive connection via shared burner IMEI. Coordinated with Inspector Anil's team.",
      createdAt: getDateOffset(baseMs, 4)
    }
  ];
  try {
    const existR = await zcql.executeZCQLQuery(`SELECT id FROM ReviewEvent WHERE caseId = '${caseRowId}'`);
    if (existR.length === 0) {
      await insertInBatches(datastore.table("ReviewEvent"), reviews);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed ReviewEvent for Case Alpha:", err.message);
  }
}

module.exports = {
  seedAlpha
};
