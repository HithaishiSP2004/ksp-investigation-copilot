// Linear Congruential Generator for deterministic random data
function createRandom(seed = 42) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Helper to run inserts in parallel batches of 10 to avoid rate limits
async function insertInBatches(table, rows, batchSize = 10) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    await Promise.all(chunk.map(row => table.insertRow(row)));
  }
}

// Helper to get formatted timestamps relative to a base date
// Catalyst DateTime format: 'YYYY-MM-DD HH:MM:SS'
function getDateOffset(baseMs, hoursOffset) {
  const date = new Date(baseMs + hoursOffset * 60 * 60 * 1000);
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

async function getRowIdMappings(zcql) {
  const [cats, gravs, heads, subs, units, emps] = await Promise.all([
    zcql.executeZCQLQuery("SELECT ROWID, id FROM CaseCategory"),
    zcql.executeZCQLQuery("SELECT ROWID, id FROM GravityOffence"),
    zcql.executeZCQLQuery("SELECT ROWID, id FROM CrimeHead"),
    zcql.executeZCQLQuery("SELECT ROWID, id FROM CrimeSubHead"),
    zcql.executeZCQLQuery("SELECT ROWID, id FROM Unit"),
    zcql.executeZCQLQuery("SELECT ROWID, id FROM Employee")
  ]);

  const map = {
    CaseCategory: {},
    GravityOffence: {},
    CrimeHead: {},
    CrimeSubHead: {},
    Unit: {},
    Employee: {}
  };

  cats.forEach(r => map.CaseCategory[r.CaseCategory.id] = r.CaseCategory.ROWID);
  gravs.forEach(r => map.GravityOffence[r.GravityOffence.id] = r.GravityOffence.ROWID);
  heads.forEach(r => map.CrimeHead[r.CrimeHead.id] = r.CrimeHead.ROWID);
  subs.forEach(r => map.CrimeSubHead[r.CrimeSubHead.id] = r.CrimeSubHead.ROWID);
  units.forEach(r => map.Unit[r.Unit.id] = r.Unit.ROWID);
  emps.forEach(r => map.Employee[r.Employee.id] = r.Employee.ROWID);

  return map;
}

module.exports = {
  createRandom,
  insertInBatches,
  getDateOffset,
  getRowIdMappings
};
