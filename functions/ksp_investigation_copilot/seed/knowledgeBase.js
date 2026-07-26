const fs = require('fs');
const path = require('path');
const { insertInBatches } = require('./builders/helpers');

async function seedKnowledgeBase(datastore, zcql, case1RowId, case2RowId) {
  const baseMs = new Date("2026-03-20 10:00:00").getTime();
  
  // Dynamically resolve RAG documents from v1 folder
  const kbDir = path.join(__dirname, 'knowledgeBase', 'v1');
  const metadata = JSON.parse(fs.readFileSync(path.join(kbDir, 'metadata.json'), 'utf8'));

  const kbDocs = [];
  metadata.files.forEach((file, idx) => {
    const content = fs.readFileSync(path.join(kbDir, file), 'utf8').trim();
    const docId = 101 + idx;
    const isNarco = file.includes('narcotics');
    
    kbDocs.push({
      id: docId,
      evidenceNo: `KB-DOC-${String(docId).padStart(3, '0')}`,
      caseId: isNarco ? case2RowId : case1RowId,
      crimeNo: isNarco ? "104430006202600002" : "104430006202600001",
      title: file.split('.')[0].replace(/_/g, ' ').toUpperCase(),
      description: `Police SOP reference manuals under KB registry version ${metadata.version}`,
      evidenceType: "DOCUMENT",
      status: "SECURED",
      collectionDate: "2026-03-20",
      collectionTime: "10:00",
      latitude: 12.9716,
      longitude: 77.5946,
      collectorName: "System Administrator",
      collectorKgid: "KGID000001",
      fileHash: "e5f607" + String(docId),
      fileSize: Buffer.byteLength(content),
      mimeType: "text/plain",
      fileName: file,
      tags: JSON.stringify(["sop", "rag", "police_manual"]),
      ocrText: content,
      aiLabels: JSON.stringify(["sop", "kb_doc"]),
      analysisSummary: `Knowledge base document loaded dynamically from RAG version ${metadata.version}`,
      extractedEntities: JSON.stringify({ org: ["KSP"] }),
      createdAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date(baseMs).toISOString().replace('T', ' ').substring(0, 19)
    });
  });

  try {
    const exist = await zcql.executeZCQLQuery("SELECT id FROM EvidenceMaster WHERE id IN (101, 102, 103, 104, 105)");
    const existIds = new Set(exist.map(r => parseInt(r.EvidenceMaster.id, 10)));
    const docsToInsert = kbDocs.filter(d => !existIds.has(d.id));
    if (docsToInsert.length > 0) {
      await insertInBatches(datastore.table("EvidenceMaster"), docsToInsert);
    }
  } catch (err) {
    console.warn("[Seeder Warning] Failed to seed Knowledge Base:", err.message);
  }
}

module.exports = {
  seedKnowledgeBase
};
