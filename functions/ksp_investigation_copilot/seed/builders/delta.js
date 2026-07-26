const { insertInBatches, getDateOffset, getRowIdMappings } = require('./helpers');

async function seedDelta(datastore, zcql) {
  const caseId = 4;
  const baseMs = new Date("2026-03-12 11:30:00").getTime();

  // Load lookup mappings to map integer IDs to live ROWIDs
  const maps = await getRowIdMappings(zcql);

  // 1. CaseMaster (Delta Human Trafficking)
  const caseData = {
    id: caseId,
    crimeNo: "104430006202600004",
    caseNo: "202600004",
    crimeRegisteredDate: getDateOffset(baseMs, 0),
    policePersonId: maps.Employee[3], // Live ROWID for Inspector Anil Gowda
    policeStationId: maps.Unit[7],   // Live ROWID for Malleshwaram Police Station
    caseCategoryId: maps.CaseCategory[1], // Live ROWID for FIR
    gravityOffenceId: maps.GravityOffence[1], // Live ROWID for Heinous
    crimeMajorHeadId: maps.CrimeHead[30],   // Live ROWID for Crimes Against Body
    crimeMinorHeadId: maps.CrimeSubHead[302], // Live ROWID for Grievous Hurt / Kidnapping Front
    caseStatus: "UNDER_INVESTIGATION",
    casePriority: "HIGH",
    briefFacts: "Interstate trafficking ring detected operating across borders of Karnataka. Suspects used private utility vehicles to transport individuals. Vehicle logs identify Toyota Fortuner KA-01-ME-1234 traversing border checkposts under suspicious manifests.",
    incidentFromDate: getDateOffset(baseMs, -30),
    incidentToDate: getDateOffset(baseMs, -1),
    infoReceivedPSDate: getDateOffset(baseMs, -0.5),
    latitude: 12.8423,
    longitude: 77.6601,
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
    console.error("[Seeder Error] Failed to seed CaseMaster for Case Delta:", err.message);
    throw err;
  }

  // 2. Victims (2 Victims)
  const victims = [
    {
      id: 7,
      caseId: caseRowId,
      name: "Meena Deshpande",
      age: 21,
      gender: "FEMALE",
      phone: "9822334455",
      email: "meena.d@example.com",
      address: "Hubballi Rural, Dharwad District, Karnataka"
    },
    {
      id: 8,
      caseId: caseRowId,
      name: "Rohan Patil",
      age: 17,
      gender: "MALE",
      phone: "9901010101",
      email: "rohan.p@example.com",
      address: "Belagavi Town, Karnataka"
    }
  ];
  try {
    const existV = await zcql.executeZCQLQuery(`SELECT id FROM Victim WHERE caseId = '${caseRowId}'`);
    if (existV.length === 0) {
      await insertInBatches(datastore.table("Victim"), victims);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Victim for Case Delta:", err.message);
  }

  // 3. Suspects (2 Suspects)
  const suspects = [
    {
      id: 7,
      caseId: caseRowId,
      name: "Jagdish Prasad",
      age: 48,
      gender: "MALE",
      phone: "9845330011",
      email: "jagdish.prasad@borderlink.in",
      adress: "Hotel Room 204, Majestic, Bangalore",
      status: "SUSPECTED",
      extractedEntities: JSON.stringify({ alias: ["JP"], vehicle: ["KA-01-ME-1234"] })
    },
    {
      id: 8,
      caseId: caseRowId,
      name: "Karan Johar",
      age: 35,
      gender: "MALE",
      phone: "9833445566",
      email: "karan.j@borderlink.in",
      adress: "Apartment 15, Electronic City, Bangalore",
      status: "ABSCONDING",
      extractedEntities: JSON.stringify({ alias: ["Agent Karan"] })
    }
  ];
  try {
    const existS = await zcql.executeZCQLQuery(`SELECT id FROM Suspect WHERE caseId = '${caseRowId}'`);
    if (existS.length === 0) {
      await insertInBatches(datastore.table("Suspect"), suspects);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Suspect for Case Delta:", err.message);
  }

  // 4. Evidence (3 pieces)
  const evidenceData = [
    {
      id: 10,
      evidenceNo: "EV-2026-000010",
      caseId: caseRowId,
      crimeNo: "104430006202600004",
      title: "Border Checkpost Toll Registry Log",
      description: "Excel toll pass logs documenting transit of Fortuner vehicle KA-01-ME-1234 crossing Attibele Checkpost.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-13",
      collectionTime: "11:00",
      latitude: 12.8423,
      longitude: 77.6601,
      collectorName: "Anil Gowda",
      collectorKgid: "112233",
      fileHash: "d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
      fileSize: 34500,
      mimeType: "application/pdf",
      fileName: "attibele_toll_log.pdf",
      tags: JSON.stringify(["border_control", "checkpost", "toll_log"]),
      ocrText: "ATTIBELE TOLL: VEHICLE KA-01-ME-1234. TIMESTAMP: 2026-03-04 23:45. ROUTE: BENGALURU TO HOSUR.",
      aiLabels: JSON.stringify(["toll", "border"]),
      analysisSummary: "Toll log confirms the vehicle crossed Karnataka state border matching timestamps of the Narcotics Case (Case Bravo).",
      extractedEntities: JSON.stringify({ vehicle: ["KA-01-ME-1234"] }),
      createdAt: getDateOffset(baseMs, 1),
      updatedAt: getDateOffset(baseMs, 1)
    },
    {
      id: 11,
      evidenceNo: "EV-2026-000011",
      caseId: caseRowId,
      crimeNo: "104430006202600004",
      title: "Seized Identity Documents - Scan Batch",
      description: "Scans of duplicate Aadhaar cards and passports recovered during search of Jagdish Prasad's Majestic room.",
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-14",
      collectionTime: "14:30",
      latitude: 12.9756,
      longitude: 77.5723,
      collectorName: "Anil Gowda",
      collectorKgid: "112233",
      fileHash: "a1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
      fileSize: 859000,
      mimeType: "application/pdf",
      fileName: "forged_id_batch.pdf",
      tags: JSON.stringify(["identity", "forgery", "aadhaar"]),
      ocrText: "GOVERNMENT OF INDIA: AADHAAR CARD. NAME: MEENA DESHPANDE. CARD NO: 1122-3344-5566.",
      aiLabels: JSON.stringify(["document", "forgery"]),
      analysisSummary: "Forged Aadhaar card details for Victim Meena, manufactured by Jagdish Prasad's syndicate.",
      extractedEntities: JSON.stringify({ person: ["Meena Deshpande"], other: ["1122-3344-5566"] }),
      createdAt: getDateOffset(baseMs, 1.5),
      updatedAt: getDateOffset(baseMs, 1.5)
    },
    {
      id: 12,
      evidenceNo: "EV-2026-000012",
      caseId: caseRowId,
      crimeNo: "104430006202600004",
      title: "Transit Guest Register - Majestic Lodge",
      description: "Photo of guest register showing booking entries under alias profiles matching Jagdish Prasad.",
      evidenceType: "IMAGE",
      status: "SECURED",
      collectionDate: "2026-03-14",
      collectionTime: "15:00",
      latitude: 12.9756,
      longitude: 77.5723,
      collectorName: "Anil Gowda",
      collectorKgid: "112233",
      fileHash: "f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
      fileSize: 450200,
      mimeType: "image/jpeg",
      fileName: "majestic_lodge_guestbook.jpg",
      tags: JSON.stringify(["majestic", "lodge", "guestbook"]),
      ocrText: "MAJESTIC LODGE REGISTER: ROOM 204. GUEST NAME: JP PRASAD. CHECK-IN: 2026-03-04 18:00.",
      aiLabels: JSON.stringify(["image", "text_on_image"]),
      analysisSummary: "Guestbook logs associate Suspect Jagdish Prasad (alias JP) to Room 204 on Majestic node.",
      extractedEntities: JSON.stringify({ person: ["JP Prasad"], location: ["Room 204"] }),
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
    console.warn("[Seeder Warning] Failed to seed EvidenceMaster for Case Delta:", err.message);
  }

  // 5. CustodyEvents (4 events)
  const custody = [
    {
      id: 13,
      evidenceId: evidenceRowIds[10],
      eventTimestamp: getDateOffset(baseMs, 1.2),
      officerName: "Anil Gowda",
      officerKgid: "112233",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Toll transit record sheets uploaded."
    },
    {
      id: 14,
      evidenceId: evidenceRowIds[11],
      eventTimestamp: getDateOffset(baseMs, 1.7),
      officerName: "Anil Gowda",
      officerKgid: "112233",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Forged Aadhaar card scans cataloged."
    },
    {
      id: 15,
      evidenceId: evidenceRowIds[12],
      eventTimestamp: getDateOffset(baseMs, 2.2),
      officerName: "Anil Gowda",
      officerKgid: "112233",
      action: "REGISTERED",
      previousState: "None",
      currentState: "SECURED",
      remarks: "Majestic lodge register photo secured."
    },
    {
      id: 16,
      evidenceId: evidenceRowIds[11],
      eventTimestamp: getDateOffset(baseMs, 3.2),
      officerName: "Priyanka Patil",
      officerKgid: "KGID000005",
      action: "TRANSFERRED",
      previousState: "SECURED",
      currentState: "SECURED",
      remarks: "Transferred documents to Document Examination Cell."
    }
  ];
  try {
    if (evidenceRowIds[10] && evidenceRowIds[11] && evidenceRowIds[12]) {
      const existC = await zcql.executeZCQLQuery(`SELECT id FROM CustodyEvent WHERE evidenceId IN ('${evidenceRowIds[10]}','${evidenceRowIds[11]}','${evidenceRowIds[12]}')`);
      if (existC.length === 0) {
        await insertInBatches(datastore.table("CustodyEvent"), custody);
      }
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed CustodyEvent for Case Delta:", err.message);
  }

  // 6. InvestigationNotes (4 notes)
  const notes = [
    {
      id: 13,
      caseId: caseRowId,
      content: "Initiated human trafficking search operations following tip-offs of cross-state movements.",
      createdBy: "Anil Gowda",
      createdKgid: "112233",
      createdAt: getDateOffset(baseMs, 0.5),
      updatedAt: getDateOffset(baseMs, 0.5),
      isDeleted: false
    },
    {
      id: 14,
      caseId: caseRowId,
      content: "Border checks show Fortuner KA-01-ME-1234 crossed the Attibele toll multiple times, matching the vehicle seized in Malleshwaram (Case Bravo!).",
      createdBy: "Anil Gowda",
      createdKgid: "112233",
      createdAt: getDateOffset(baseMs, 1.5),
      updatedAt: getDateOffset(baseMs, 1.5),
      isDeleted: false
    },
    {
      id: 15,
      caseId: caseRowId,
      content: "Raided Majestic Lodge Room 204. Recovered forged credentials. Jagdish Prasad (alias JP) arrested at check-in location.",
      createdBy: "Anil Gowda",
      createdKgid: "112233",
      createdAt: getDateOffset(baseMs, 2.5),
      updatedAt: getDateOffset(baseMs, 2.5),
      isDeleted: false
    },
    {
      id: 16,
      caseId: caseRowId,
      content: "Preparing interrogation logs for Jagdish Prasad. Searching for accomplice Agent Karan.",
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
    console.warn("[Seeder Warning] Failed to seed InvestigationNote for Case Delta:", err.message);
  }

  // 7. ActivityLogs (10 logs)
  const logs = [];
  const logActions = ["CREATED", "NOTE_ADDED", "EVIDENCE_ADDED", "STATUS_CHANGED"];
  for (let i = 1; i <= 10; i++) {
    logs.push({
      id: 30 + i,
      caseId: caseRowId,
      crimeNo: "104430006202600004",
      caseNo: "202600004",
      officerName: "Anil Gowda",
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
    console.warn("[Seeder Warning] Failed to seed ActivityLog for Case Delta:", err.message);
  }
}

module.exports = {
  seedDelta
};
