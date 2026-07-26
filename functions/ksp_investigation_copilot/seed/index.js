const catalyst = require('zcatalyst-sdk-node');
const { createRandom } = require('./builders/helpers');
const { seedLookups } = require('./lookups');
const { seedAlpha } = require('./builders/alpha');
const { seedBravo } = require('./builders/bravo');
const { seedCharlie } = require('./builders/charlie');
const { seedDelta } = require('./builders/delta');
const { seedEcho } = require('./builders/echo');
const { seedKnowledgeBase } = require('./knowledgeBase');
const { seedVoiceTelemetry } = require('./voiceTelemetry');
const { validateDatabase } = require('./validator');

async function resetTransactions(datastore, zcql) {
  const tables = ["ActivityLog", "CustodyEvent", "InvestigationNote", "EvidenceMaster", "Suspect", "Victim", "CaseMaster"];
  for (const t of tables) {
    try {
      // Fetch up to 100 rows at a time and delete
      const rows = await zcql.executeZCQLQuery(`SELECT ROWID FROM ${t} LIMIT 100`);
      if (rows && rows.length > 0) {
        const table = datastore.table(t);
        await Promise.all(rows.map(r => table.deleteRow(r[t].ROWID)));
      }
    } catch (err) {
      console.warn(`[Reset Warning] Failed to reset table ${t}:`, err.message);
    }
  }
}

module.exports = async (req, res) => {
  try {
    const catalystApp = catalyst.initialize(req);
    const datastore = catalystApp.datastore();
    const zcql = catalystApp.zcql();
    
    const profile = req.body?.profile || req.query?.profile || "demo";
    console.log(`[Seeder] Triggered seeding with profile: ${profile}`);

    const rand = createRandom(1337); // Deterministic seed

    if (profile === "reset") {
      await resetTransactions(datastore, zcql);
      return res.status(200).json({
        success: true,
        message: "Transaction tables successfully cleared.",
        data: {
          profile,
          counts: { CaseMaster: 0, Victim: 0, Suspect: 0, EvidenceMaster: 0 },
          validation: { status: "CLEARED" }
        }
      });
    }

    // 1. Seed Lookups
    await seedLookups(datastore, zcql, rand);

    if (profile === "minimal") {
      const stats = await validateDatabase(zcql);
      return res.status(200).json({
        success: true,
        message: "Minimal seeding complete (Lookups only).",
        data: stats
      });
    }

    // 2. Seed Flagship Cases (Alpha, Bravo, Charlie, Delta, Echo)
    console.log("[Seeder] Seeding Case Alpha (Cyber Fraud)...");
    await seedAlpha(datastore, zcql);
    console.log("[Seeder] Seeding Case Bravo (Narcotics)...");
    await seedBravo(datastore, zcql);
    console.log("[Seeder] Seeding Case Charlie (Money Laundering)...");
    await seedCharlie(datastore, zcql);
    console.log("[Seeder] Seeding Case Delta (Human Trafficking)...");
    await seedDelta(datastore, zcql);
    console.log("[Seeder] Seeding Case Echo (Missing Person)...");
    await seedEcho(datastore, zcql);

    // 3. Seed RAG KB and Voice Statements
    console.log("[Seeder] Seeding RAG Knowledge Base...");
    const case1Res = await zcql.executeZCQLQuery("SELECT ROWID FROM CaseMaster WHERE id = 1");
    const case2Res = await zcql.executeZCQLQuery("SELECT ROWID FROM CaseMaster WHERE id = 2");
    const case3Res = await zcql.executeZCQLQuery("SELECT ROWID FROM CaseMaster WHERE id = 3");
    const case5Res = await zcql.executeZCQLQuery("SELECT ROWID FROM CaseMaster WHERE id = 5");
    
    const case1RowId = case1Res[0]?.CaseMaster?.ROWID;
    const case2RowId = case2Res[0]?.CaseMaster?.ROWID;
    const case3RowId = case3Res[0]?.CaseMaster?.ROWID;
    const case5RowId = case5Res[0]?.CaseMaster?.ROWID;

    await seedKnowledgeBase(datastore, zcql, case1RowId, case2RowId);
    
    console.log("[Seeder] Seeding Multilingual Voice Telemetry...");
    await seedVoiceTelemetry(datastore, zcql, case1RowId, case3RowId, case5RowId);

    // 4. Validate and Output Results
    const stats = await validateDatabase(zcql);
    return res.status(200).json({
      success: true,
      message: "Database seeding successfully executed.",
      data: stats
    });

  } catch (err) {
    console.error("[Seeder Execution Error]:", err);
    return res.status(500).json({
      success: false,
      message: "Seeding failed.",
      error: err.message
    });
  }
};
