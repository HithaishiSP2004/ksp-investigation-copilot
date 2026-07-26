const { insertInBatches } = require('./builders/helpers');

async function seedVoiceTelemetry(datastore, zcql, case1RowId, case3RowId, case5RowId) {
  const baseMs = new Date("2026-03-21 11:00:00").getTime();

  const voiceDocs = [
    {
      id: 121,
      evidenceNo: "EV-AUD-001",
      caseId: case5RowId, // Link to Case 5 ROWID
      crimeNo: "104430006202600005",
      title: "Kannada Witness Statement — MVJ Classmate",
      description: "Audio statement by classmate Ramesh H. transcribed and translated using Catalyst Speech-to-Text and Translation services.",
      evidenceType: "AUDIO",
      status: "SECURED",
      collectionDate: "2026-03-21",
      collectionTime: "11:00",
      latitude: 12.9698,
      longitude: 77.7499,
      collectorName: "Ramesh Kumar",
      collectorKgid: "123456",
      fileHash: "0f101112131415161718191a1b1c1d1e1f20a1b2c3d4e5f60708090a0b0c0d0e",
      fileSize: 1845000,
      mimeType: "audio/wav",
      fileName: "kannada_witness_statement.wav",
      tags: JSON.stringify(["witness_voice", "kannada", "translation", "speech_to_text"]),
      ocrText: "ORIGINAL TRANSCRIPT (KANNADA): ತರುಣ್ ಮಾರ್ಚ್ 1 ರಂದು ಸಂಜೆ ಬಿಳಿ ಬಣ್ಣದ ಫಾರ್ಚುನರ್ ಕಾರನ್ನು ಹತ್ತಿ ಹೋಗುವುದನ್ನು ನಾನು ನೋಡಿದೆ. TRANSLATION (ENGLISH): I saw Tarun boarding a white Fortuner car on March 1st evening.",
      aiLabels: JSON.stringify(["translated", "kannada", "fortuner_link"]),
      analysisSummary: "Classmate confirms Tarun boarded the Toyota Fortuner vehicle (KA-01-ME-1234) on the evening of his disappearance.",
      extractedEntities: JSON.stringify({ person: ["Tarun"], vehicle: ["KA-01-ME-1234"] }),
      createdAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19)
    },
    {
      id: 122,
      evidenceNo: "EV-AUD-002",
      caseId: case1RowId, // Link to Case 1 ROWID
      crimeNo: "104430006202600001",
      title: "Hindi Witness Statement — Mohit Sharma Interrogation Audio",
      description: "Audio statement by suspect Mohit Sharma confessing to SIM card usage, transcribed and translated using Catalyst AI services.",
      evidenceType: "AUDIO",
      status: "SECURED",
      collectionDate: "2026-03-21",
      collectionTime: "11:30",
      latitude: 12.9716,
      longitude: 77.5946,
      collectorName: "Siddharth Sagar",
      collectorKgid: "KGID000004",
      fileHash: "101112131415161718191a1b1c1d1e1f20a1b2c3d4e5f60708090a0b0c0d0e0f",
      fileSize: 2450000,
      mimeType: "audio/mp3",
      fileName: "hindi_suspect_confession.mp3",
      tags: JSON.stringify(["suspect_voice", "hindi", "translation", "speech_to_text"]),
      ocrText: "ORIGINAL TRANSCRIPT (HINDI): मुझे यह सिम 9876543210 एक अनजान आदमी ने दिया था, जिसके लिए उसने मुझे पैसे दिए थे। TRANSLATION (ENGLISH): An unknown man gave me this SIM 9876543210, for which he paid me money.",
      aiLabels: JSON.stringify(["translated", "hindi", "confession"]),
      analysisSummary: "Suspect confesses to acting as a mule caller using burner SIM 9876543210.",
      extractedEntities: JSON.stringify({ phone: ["9876543210"] }),
      createdAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19)
    },
    {
      id: 123,
      evidenceNo: "EV-AUD-003",
      caseId: case3RowId, // Link to Case 3 ROWID
      crimeNo: "104430006202600003",
      title: "English Statement — Bank Manager",
      description: "Audio brief by Bank Manager explaining account opening files for account 1122334455.",
      evidenceType: "AUDIO",
      status: "SECURED",
      collectionDate: "2026-03-21",
      collectionTime: "12:00",
      latitude: 12.2958,
      longitude: 76.6394,
      collectorName: "Kiran Reddy",
      collectorKgid: "999999",
      fileHash: "1112131415161718191a1b1c1d1e1f20a1b2c3d4e5f60708090a0b0c0d0e0f10",
      fileSize: 1250000,
      mimeType: "audio/wav",
      fileName: "english_manager_statement.wav",
      tags: JSON.stringify(["manager_voice", "english", "speech_to_text"]),
      ocrText: "TRANSCRIPT (ENGLISH): The account 1122334455 was registered under Zenith Trading. Signatory matches Animesh Roy's files.",
      aiLabels: JSON.stringify(["english", "account_brief"]),
      analysisSummary: "Bank manager verifies that Zenith Trading was the legal owner of the laundering account.",
      extractedEntities: JSON.stringify({ person: ["Animesh Roy"], other: ["1122334455"] }),
      createdAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19)
    }
  ];

  try {
    const exist = await zcql.executeZCQLQuery("SELECT id FROM EvidenceMaster WHERE id IN (121, 122, 123)");
    const existIds = new Set(exist.map(r => parseInt(r.EvidenceMaster.id, 10)));
    const voiceToInsert = voiceDocs.filter(v => !existIds.has(v.id));
    if (voiceToInsert.length > 0) {
      await insertInBatches(datastore.table("EvidenceMaster"), voiceToInsert);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Voice Telemetry:", err.message);
  }
}

module.exports = {
  seedVoiceTelemetry
};
