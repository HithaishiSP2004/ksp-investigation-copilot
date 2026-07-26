const { insertInBatches, getDateOffset, getRowIdMappings } = require('./helpers');

async function seedBravo(datastore, zcql) {
  const caseId = 2;
  const baseMs = new Date("2026-03-05 14:00:00").getTime();

  // Load lookup mappings to map integer IDs to live ROWIDs
  const maps = await getRowIdMappings(zcql);

  // 1. CaseMaster (Narcotics Bust & Hidden Twist Linkage)
  const caseData = {
    id: caseId,
    crimeNo: "104430006202600002",
    caseNo: "202600002",
    crimeRegisteredDate: getDateOffset(baseMs, 0),
    policePersonId: maps.Employee[3], // Live ROWID for Inspector Anil Gowda
    policeStationId: maps.Unit[7],   // Live ROWID for Malleshwaram Police Station
    caseCategoryId: maps.CaseCategory[1], // Live ROWID for FIR
    gravityOffenceId: maps.GravityOffence[1], // Live ROWID for Heinous
    crimeMajorHeadId: maps.CrimeHead[50],   // Live ROWID for Narcotics
    crimeMinorHeadId: maps.CrimeSubHead[501], // Live ROWID for Drug Peddling
    caseStatus: "UNDER_INVESTIGATION",
    casePriority: "HIGH",
    briefFacts: "KSP Narcotics raid near Malleshwaram recovered a major cache of contraband. A courier vehicle (KA-01-ME-1234) was seized. A burner phone containing device IMEI8899889988 and SIM number 9876543210 was recovered from a suspect during detention.",
    incidentFromDate: getDateOffset(baseMs, -6),
    incidentToDate: getDateOffset(baseMs, -1),
    infoReceivedPSDate: getDateOffset(baseMs, -0.5),
    latitude: 12.9922,
    longitude: 77.5712,
    createdAt: getDateOffset(baseMs, 0),
    updatedAt: getDateOffset(baseMs, 3)
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
    console.error("[Seeder Error] Failed to seed CaseMaster for Case Bravo:", err.message);
    throw err;
  }

  // 2. Victims (2 Victims)
  const victims = [
    {
      id: 3,
      caseId: caseRowId,
      name: "State of Karnataka",
      age: 0,
      gender: "OTHER",
      phone: "0802221111",
      email: "state.police@karnataka.gov.in",
      address: "Vidhana Soudha, Bengaluru"
    },
    {
      id: 4,
      caseId: caseRowId,
      name: "Local Residents Welfare",
      age: 40,
      gender: "OTHER",
      phone: "9845012345",
      email: "welfare.malleswaram@example.com",
      address: "15th Cross, Malleshwaram, Bangalore"
    }
  ];
  try {
    const existV = await zcql.executeZCQLQuery(`SELECT id FROM Victim WHERE caseId = '${caseRowId}'`);
    if (existV.length === 0) {
      await insertInBatches(datastore.table("Victim"), victims);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Victim for Case Bravo:", err.message);
  }

  // 3. Suspects (2 Suspects)
  const suspects = [
    {
      id: 3,
      caseId: caseRowId,
      name: "Vikram Malhotra",
      age: 26,
      gender: "MALE",
      phone: "9876543210",
      email: "vikram.malhotra@drugnet.in",
      adress: "Apartment 104, Malleshwaram Main Rd, Bangalore",
      status: "UNDER_CUSTODY",
      extractedEntities: JSON.stringify({ alias: ["Vicky"], phone: ["9876543210"], imei: ["IMEI8899889988"] })
    },
    {
      id: 4,
      caseId: caseRowId,
      name: "Suresh Gowda",
      age: 39,
      gender: "MALE",
      phone: "9844001122",
      email: "suresh.g@courier.in",
      adress: "Transit Quarter, Yeshwanthpur, Bangalore",
      status: "INTERROGATED",
      extractedEntities: JSON.stringify({ vehicle: ["KA-01-ME-1234"] })
    }
  ];
  try {
    const existS = await zcql.executeZCQLQuery(`SELECT id FROM Suspect WHERE caseId = '${caseRowId}'`);
    if (existS.length === 0) {
      await insertInBatches(datastore.table("Suspect"), suspects);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Suspect for Case Bravo:", err.message);
  }

  // 4. Evidence (3 pieces)
  const evidenceData = [
    {
      id: 4,
      evidenceNo: "EV-2026-000004",
      caseId: caseRowId,
      crimeNo: "104430006202600002",
      title: "Contraband Seizure Pouch",
      description: "Physical evidence pouch containing seized narcotics logs, weight logs (500g MDMA).",
      evidenceType: "PHYSICAL",
      status: "SECURED",
      collectionDate: "2026-03-05",
      collectionTime: "15:00",
      latitude: 12.9922,
      longitude: 77.5712,
      collectorName: "Anil Gowda",
      collectorKgid: "112233",
      fileHash: "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
      fileSize: 0,
      mimeType: "application/octet-stream",
      fileName: "contraband_pouch_seizure.dat",
      tags: JSON.stringify(["narcotics", "seizure", "physical"]),
      ocrText: "KSP SEIZURE RECORD: ITEM MDMA QUANTITY 500G. COLLECTED AT MALLESHWARAM BUS TERMINUS.",
      aiLabels: JSON.stringify(["narcotics", "mdma", "seizure"]),
      analysisSummary: "Physical seizure authenticated.",
      extractedEntities: JSON.stringify({ org: ["KSP"], location: ["Malleshwaram Bus Terminus"] }),
      createdAt: getDateOffset(baseMs, 1),
      updatedAt: getDateOffset(baseMs, 1)
    },
    {
      id: 5,
      evidenceNo: "EV-2026-000005",
      caseId: caseRowId,
      crimeNo: "104430006202600002",
      title: "Seized Android Phone - Redmi Note 10",
      description: "Suspect Vikram Malhotra's mobile device containing IMEI8899889988. Device is locked.",
      evidenceType: "DEVICE",
      status: "SECURED",
      collectionDate: "2026-03-05",
      collectionTime: "15:15",
      latitude: 12.9922,
      longitude: 77.5712,
      collectorName: "Anil Gowda",
      collectorKgid: "112233",
      fileHash: "d8c9b0a1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9",
      fileSize: 0,
      mimeType: "application/octet-stream",
      fileName: "redmi_note_10_device.dat",
      tags: JSON.stringify(["device", "phone", "suspect_mobile"]),
      ocrText: "DEVICE SCAN DETAILS: MODEL REDMI NOTE 10. SERIAL: RED-554433. IMEI1: IMEI8899889988.",
      aiLabels: JSON.stringify(["device", "imei"]),
      analysisSummary: "AI linked IMEI8899889988 to target SIM 9876543210 (Case Alpha burner SIM!).",
      extractedEntities: JSON.stringify({ other: ["IMEI8899889988"] }),
      createdAt: getDateOffset(baseMs, 1.5),
      updatedAt: getDateOffset(baseMs, 1.5)
    },
    {
      id: 6,
      evidenceNo: "EV-2026-000006",
      caseId: caseRowId,
      crimeNo: "104430006202600002",
      title: "Toyota Fortuner Seizure Vehicle Log",
      description: "Logs and vehicle inventory retrieved from transit vehicle KA-01-ME-1234.",
      evidenceType: "PHYSICAL",
      status: "SECURED",
      collectionDate: "2026-03-05",
      collectionTime: "16:00",
      latitude: 12.9922,
      longitude: 77.5712,
      collectorName: "Anil Gowda",
      collectorKgid: "112233",
      fileHash: "e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
      fileSize: 15400,
      mimeType: "application/pdf",
      fileName: "vehicle_seizure_log.pdf",
      tags: JSON.stringify(["vehicle", "transport", "fortuner"]),
      ocrText: "VEHICLE SEIZURE: TOYOTA FORTUNER. REG NO: KA-01-ME-1234. DRIVER: SURESH GOWDA. OWNER: VIKRAM MALHOTRA.",
      aiLabels: JSON.stringify(["vehicle", "transport"]),
      analysisSummary: "Vehicle links directly to the transport courier of human trafficking (Case Delta!).",
      extractedEntities: JSON.stringify({ vehicle: ["KA-01-ME-1234"], person: ["Suresh Gowda"] }),
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
    console.warn("[Seeder Warning] Failed to seed EvidenceMaster for Case Bravo:", err.message);
  }

  // 5. CustodyEvents (4 events)
  const custody = [
    {
      id: 5,
      evidenceId: evidenceRowIds[4],
      eventTimestamp: getDateOffset(baseMs, 1.2),
      officerName: "Anil Gowda",
      officerKgid: "112233",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "MDMA pouch weighed, logged, and secured in station locker."
    },
    {
      id: 6,
      evidenceId: evidenceRowIds[5],
      eventTimestamp: getDateOffset(baseMs, 1.7),
      officerName: "Anil Gowda",
      officerKgid: "112233",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Redmi Note 10 device bagged in static-shield forensic pouch."
    },
    {
      id: 7,
      evidenceId: evidenceRowIds[6],
      eventTimestamp: getDateOffset(baseMs, 2.2),
      officerName: "Anil Gowda",
      officerKgid: "112233",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Seized Fortuner vehicle towed to police compound."
    },
    {
      id: 8,
      evidenceId: evidenceRowIds[5],
      eventTimestamp: getDateOffset(baseMs, 3.2),
      officerName: "Priyanka Patil",
      officerKgid: "KGID000005",
      action: "TRANSFERRED",
      previousState: "SECURED",
      currentState: "SECURED",
      remarks: "Transferred phone device to Cyber Forensic Lab for data extraction."
    }
  ];
  try {
    if (evidenceRowIds[4] && evidenceRowIds[5] && evidenceRowIds[6]) {
      const existC = await zcql.executeZCQLQuery(`SELECT id FROM CustodyEvent WHERE evidenceId IN ('${evidenceRowIds[4]}','${evidenceRowIds[5]}','${evidenceRowIds[6]}')`);
      if (existC.length === 0) {
        await insertInBatches(datastore.table("CustodyEvent"), custody);
      }
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed CustodyEvent for Case Bravo:", err.message);
  }

  // 6. InvestigationNotes (4 notes)
  const notes = [
    {
      id: 5,
      caseId: caseRowId,
      content: "Intelligence report received regarding MDMA transit through Malleshwaram. Conducted roadblock and successfully detained Vikram Malhotra.",
      createdBy: "Anil Gowda",
      createdKgid: "112233",
      createdAt: getDateOffset(baseMs, 0.5),
      updatedAt: getDateOffset(baseMs, 0.5),
      isDeleted: false
    },
    {
      id: 6,
      caseId: caseRowId,
      content: "Driver Suresh Gowda claimed to be a hired transporter with no knowledge of the pouch content. Verifying the vehicle registration profile.",
      createdBy: "Anil Gowda",
      createdKgid: "112233",
      createdAt: getDateOffset(baseMs, 1.5),
      updatedAt: getDateOffset(baseMs, 1.5),
      isDeleted: false
    },
    {
      id: 7,
      caseId: caseRowId,
      content: "Analysed burner phone. Discovered device IMEI8899889988 has active matches in cyber phishing logs (Case Alpha!). Highly suspicious threat convergence.",
      createdBy: "Anil Gowda",
      createdKgid: "112233",
      createdAt: getDateOffset(baseMs, 2.5),
      updatedAt: getDateOffset(baseMs, 2.5),
      isDeleted: false
    },
    {
      id: 8,
      caseId: caseRowId,
      content: "Dispatched alert notification to ACP/DCP regarding cross-border narcotics and cyber crime links.",
      createdBy: "Anil Gowda",
      createdKgid: "112233",
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
    console.warn("[Seeder Warning] Failed to seed InvestigationNote for Case Bravo:", err.message);
  }

  // 7. ActivityLogs (10 logs)
  const logs = [];
  const logActions = ["CREATED", "NOTE_ADDED", "EVIDENCE_ADDED", "STATUS_CHANGED"];
  for (let i = 1; i <= 10; i++) {
    logs.push({
      id: 10 + i,
      caseId: caseRowId,
      crimeNo: "104430006202600002",
      caseNo: "202600002",
      officerName: "Anil Gowda",
      action: logActions[i % logActions.length],
      eventTimestamp: getDateOffset(baseMs, i * 5)
    });
  }
  try {
    const existL = await zcql.executeZCQLQuery(`SELECT id FROM ActivityLog WHERE caseId = '${caseRowId}'`);
    if (existL.length === 0) {
      await insertInBatches(datastore.table("ActivityLog"), logs);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed ActivityLog for Case Bravo:", err.message);
  }
}

module.exports = {
  seedBravo
};
