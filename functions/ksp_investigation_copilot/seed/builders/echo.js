const { insertInBatches, getDateOffset, getRowIdMappings } = require('./helpers');

async function seedEcho(datastore, zcql) {
  const caseId = 5;
  const baseMs = new Date("2026-03-15 15:30:00").getTime();

  // Load lookup mappings to map integer IDs to live ROWIDs
  const maps = await getRowIdMappings(zcql);

  // 1. CaseMaster (Echo Missing Person)
  const caseData = {
    id: caseId,
    crimeNo: "104430006202600005",
    caseNo: "202600005",
    crimeRegisteredDate: getDateOffset(baseMs, 0),
    policePersonId: maps.Employee[1], // Live ROWID for Sub-Inspector Ramesh Kumar
    policeStationId: maps.Unit[1],   // Live ROWID for Whitefield PS
    caseCategoryId: maps.CaseCategory[1], // Live ROWID for FIR
    gravityOffenceId: maps.GravityOffence[2], // Live ROWID for Non-Heinous
    crimeMajorHeadId: maps.CrimeHead[70],   // Live ROWID for Missing Person
    crimeMinorHeadId: maps.CrimeSubHead[701], // Live ROWID for Runaway Minor / Youth Front
    caseStatus: "UNDER_INVESTIGATION",
    casePriority: "MEDIUM",
    briefFacts: "Report of a missing college student, Tarun Bhat, who went offline from Whitefield. Laptop ping telemetry records active logins from IP 103.44.20.10, matching the wallet server login nodes from the Cyber Phishing case (Case Alpha!). Investigation is tracing coordinates.",
    incidentFromDate: getDateOffset(baseMs, -72),
    incidentToDate: getDateOffset(baseMs, -6),
    infoReceivedPSDate: getDateOffset(baseMs, -3),
    latitude: 12.9698,
    longitude: 77.7499,
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
    console.error("[Seeder Error] Failed to seed CaseMaster for Case Echo:", err.message);
    throw err;
  }

  // 2. Victims (2 Victims)
  const victims = [
    {
      id: 9,
      caseId: caseRowId,
      name: "Tarun Bhat",
      age: 19,
      gender: "MALE",
      phone: "9988776655",
      email: "tarun.bhat@student.in",
      address: "Hostel Block B, MVJ College, Whitefield, Bangalore"
    },
    {
      id: 10,
      caseId: caseRowId,
      name: "Sumithra Bhat",
      age: 46,
      gender: "FEMALE",
      phone: "9900887766",
      email: "sumithra.bhat@parent.com",
      address: "No. 45, 1st Main Road, Mysuru Town"
    }
  ];
  try {
    const existV = await zcql.executeZCQLQuery(`SELECT id FROM Victim WHERE caseId = '${caseRowId}'`);
    if (existV.length === 0) {
      await insertInBatches(datastore.table("Victim"), victims);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Victim for Case Echo:", err.message);
  }

  // 3. Suspects (2 Suspects)
  const suspects = [
    {
      id: 9,
      caseId: caseRowId,
      name: "Lokesh Gowda",
      age: 22,
      gender: "MALE",
      phone: "9845889900",
      email: "lokesh.gowda@peer.in",
      adress: "Room 10, PG Hostel, Whitefield, Bangalore",
      status: "SUSPECTED",
      extractedEntities: JSON.stringify({ alias: ["Loki"], ip: ["103.44.20.10"] })
    },
    {
      id: 10,
      caseId: caseRowId,
      name: "Dinesh Gowda",
      age: 24,
      gender: "MALE",
      phone: "9833556677",
      email: "dinesh.g@peer.in",
      adress: "PG Accommodation, Whitefield, Bangalore",
      status: "INTERROGATED",
      extractedEntities: JSON.stringify({ alias: ["Dinnu"] })
    }
  ];
  try {
    const existS = await zcql.executeZCQLQuery(`SELECT id FROM Suspect WHERE caseId = '${caseRowId}'`);
    if (existS.length === 0) {
      await insertInBatches(datastore.table("Suspect"), suspects);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Suspect for Case Echo:", err.message);
  }

  // 4. Evidence (3 pieces)
  const evidenceData = [
    {
      id: 13,
      evidenceNo: "EV-2026-000013",
      caseId: caseRowId,
      crimeNo: "104430006202600005",
      title: "Laptop Network Log History",
      description: "Log sheet of router access detailing MAC and IP addresses of Tarun's laptop prior to going missing.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-16",
      collectionTime: "10:30",
      latitude: 12.9698,
      longitude: 77.7499,
      collectorName: "Ramesh Kumar",
      collectorKgid: "123456",
      fileHash: "e1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3",
      fileSize: 18900,
      mimeType: "application/pdf",
      fileName: "laptop_network_log.pdf",
      tags: JSON.stringify(["network", "router_log", "mac_log"]),
      ocrText: "ROUTER SCAN: MAC: AA-BB-CC-DD-EE-FF. IP: 103.44.20.10. TIMESTAMP: 2026-03-01 12:00.",
      aiLabels: JSON.stringify(["network", "ip"]),
      analysisSummary: "Router logs verify access node IP 103.44.20.10 which is identical to Case Alpha's phishing mule wallet access IP.",
      extractedEntities: JSON.stringify({ other: ["103.44.20.10"] }),
      createdAt: getDateOffset(baseMs, 1),
      updatedAt: getDateOffset(baseMs, 1)
    },
    {
      id: 14,
      evidenceNo: "EV-2026-000014",
      caseId: caseRowId,
      crimeNo: "104430006202600005",
      title: "Cell Tower Pings Log - Tarun's SIM",
      description: "Mobile tower logs tracking the location ping updates from Tarun's phone SIM card.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-16",
      collectionTime: "11:30",
      latitude: 12.9698,
      longitude: 77.7499,
      collectorName: "Ramesh Kumar",
      collectorKgid: "123456",
      fileHash: "a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4",
      fileSize: 22400,
      mimeType: "application/pdf",
      fileName: "cell_tower_pings.pdf",
      tags: JSON.stringify(["location", "ping", "cell_tower"]),
      ocrText: "TOWER RECORD: MSISDN: 9988776655. LAST TOWER ID: TWR-WHITEFIELD-04. TIMESTAMP: 2026-03-01 12:30.",
      aiLabels: JSON.stringify(["location", "ping"]),
      analysisSummary: "Cell tower logs show Tarun's phone went offline in Whitefield zone, matching coordinates 12.96, 77.74.",
      extractedEntities: JSON.stringify({ phone: ["9988776655"], location: ["TWR-WHITEFIELD-04"] }),
      createdAt: getDateOffset(baseMs, 1.2),
      updatedAt: getDateOffset(baseMs, 1.2)
    },
    {
      id: 15,
      evidenceNo: "EV-2026-000015",
      caseId: caseRowId,
      crimeNo: "104430006202600005",
      title: "CCTV Camera Log Scan - Whitefield Gate 2",
      description: "Still image clip scanning vehicle exiting college Gate 2 during late night hours.",
      evidenceType: "IMAGE",
      status: "SECURED",
      collectionDate: "2026-03-17",
      collectionTime: "14:00",
      latitude: 12.9698,
      longitude: 77.7499,
      collectorName: "Ramesh Kumar",
      collectorKgid: "123456",
      fileHash: "f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      fileSize: 312000,
      mimeType: "image/jpeg",
      fileName: "college_gate_cctv.jpg",
      tags: JSON.stringify(["cctv", "camera", "gate_log"]),
      ocrText: "CCTV SECURITY CLIP: EXIT GATE 2. VEHICLE KA-01-ME-1234. TIMESTAMP: 2026-03-01 23:30.",
      aiLabels: JSON.stringify(["cctv", "text_on_image"]),
      analysisSummary: "CCTV log captures transit vehicle KA-01-ME-1234 exiting campus (linked to Case Bravo and Case Delta!).",
      extractedEntities: JSON.stringify({ vehicle: ["KA-01-ME-1234"] }),
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
    console.warn("[Seeder Warning] Failed to seed EvidenceMaster for Case Echo:", err.message);
  }

  // 5. CustodyEvents (4 events)
  const custody = [
    {
      id: 17,
      evidenceId: evidenceRowIds[13],
      eventTimestamp: getDateOffset(baseMs, 1.2),
      officerName: "Ramesh Kumar",
      officerKgid: "123456",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Laptop network log sheets cataloged."
    },
    {
      id: 18,
      evidenceId: evidenceRowIds[14],
      eventTimestamp: getDateOffset(baseMs, 1.7),
      officerName: "Ramesh Kumar",
      officerKgid: "123456",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Mobile tower logs secured."
    },
    {
      id: 19,
      evidenceId: evidenceRowIds[15],
      eventTimestamp: getDateOffset(baseMs, 2.2),
      officerName: "Ramesh Kumar",
      officerKgid: "123456",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "College security gate CCTV frame cataloged."
    },
    {
      id: 20,
      evidenceId: evidenceRowIds[13],
      eventTimestamp: getDateOffset(baseMs, 3.2),
      officerName: "Priyanka Patil",
      officerKgid: "KGID000005",
      action: "TRANSFERRED",
      previousState: "SECURED",
      currentState: "SECURED",
      remarks: "Transferred network logs to Cyber Analysis team."
    }
  ];
  try {
    if (evidenceRowIds[13] && evidenceRowIds[14] && evidenceRowIds[15]) {
      const existC = await zcql.executeZCQLQuery(`SELECT id FROM CustodyEvent WHERE evidenceId IN ('${evidenceRowIds[13]}','${evidenceRowIds[14]}','${evidenceRowIds[15]}')`);
      if (existC.length === 0) {
        await insertInBatches(datastore.table("CustodyEvent"), custody);
      }
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed CustodyEvent for Case Echo:", err.message);
  }

  // 6. InvestigationNotes (4 notes)
  const notes = [
    {
      id: 17,
      caseId: caseRowId,
      content: "Received missing person report from Tarun's mother, Sumithra Bhat. Tarun was last seen leaving college campus on 2026-03-01.",
      createdBy: "Ramesh Kumar",
      createdKgid: "123456",
      createdAt: getDateOffset(baseMs, 0.5),
      updatedAt: getDateOffset(baseMs, 0.5),
      isDeleted: false
    },
    {
      id: 18,
      caseId: caseRowId,
      content: "Acquired college hostel access logs. Tarun's roommate Lokesh Gowda reports Tarun was stressed about some online trading accounts.",
      createdBy: "Ramesh Kumar",
      createdKgid: "123456",
      createdAt: getDateOffset(baseMs, 1.5),
      updatedAt: getDateOffset(baseMs, 1.5),
      isDeleted: false
    },
    {
      id: 19,
      caseId: caseRowId,
      content: "Analysed CCTV logs. Seizure vehicle KA-01-ME-1234 (Toyota Fortuner from Case Bravo!) was seen leaving gate 2 at exit time. This confirms a highly dangerous link.",
      createdBy: "Ramesh Kumar",
      createdKgid: "123456",
      createdAt: getDateOffset(baseMs, 2.5),
      updatedAt: getDateOffset(baseMs, 2.5),
      isDeleted: false
    },
    {
      id: 20,
      caseId: caseRowId,
      content: "Whitefield team coordinating with Narcotics and Trafficking investigators (Inspector Anil's team). Dispatched urgent alerts.",
      createdBy: "Ramesh Kumar",
      createdKgid: "123456",
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
    console.warn("[Seeder Warning] Failed to seed InvestigationNote for Case Echo:", err.message);
  }

  // 7. ActivityLogs (10 logs)
  const logs = [];
  const logActions = ["CREATED", "NOTE_ADDED", "EVIDENCE_ADDED", "STATUS_CHANGED"];
  for (let i = 1; i <= 10; i++) {
    logs.push({
      id: 40 + i,
      caseId: caseRowId,
      crimeNo: "104430006202600005",
      caseNo: "202600005",
      officerName: "Ramesh Kumar",
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
    console.warn("[Seeder Warning] Failed to seed ActivityLog for Case Echo:", err.message);
  }
}

module.exports = {
  seedEcho
};
