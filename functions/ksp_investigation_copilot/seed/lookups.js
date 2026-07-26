const { insertInBatches } = require('./builders/helpers');

const FIRST_NAMES = [
  "Ramesh", "Suresh", "Kiran", "Anil", "Vijay", "Sandhya", "Deepa", "Arjun", "Vikram", "Sunil",
  "Priya", "Rahul", "Ganesh", "Mahesh", "Rajesh", "Aishwarya", "Lakshmi", "Harish", "Naveen", "Pradeep"
];
const LAST_NAMES = [
  "Kumar", "Reddy", "Gowda", "Nair", "Rao", "Patil", "Sharma", "Singh", "Joshi", "Shetty",
  "Murthy", "Desai", "Hegde", "Bhat", "Prasad", "Pillai", "Das", "Sen", "Menon", "Acharya"
];
const PS_NAMES = [
  "Whitefield PS", "Koramangala PS", "Electronic City PS", "Cubbon Park PS", "HAL PS",
  "Indiranagar PS", "Jayanagar PS", "Sadashivanagar PS", "Yeshwanthpur PS", "Banashankari PS",
  "Malleshwaram Police Station", "Mysuru Town Police Station", "HSR Layout PS", "BTM Layout PS", "Marathahalli PS",
  "Varthur PS", "Bellandur PS", "Mahadevapura PS", "K R Puram PS", "R T Nagar PS",
  "Kalyan Nagar PS", "Hebbal PS", "Peenya PS", "Rajajinagar PS", "Vijayanagar PS"
];

async function seedLookups(datastore, zcql, rand) {
  // A. CaseCategory
  console.log("[Seeder] Seeding CaseCategory...");
  const targetCategories = [
    { id: 1, categoryName: "FIR", categoryCode: "FIR", description: "First Information Report", isActive: true },
    { id: 2, categoryName: "UDR", categoryCode: "UDR", description: "Unnatural Death Report", isActive: true },
    { id: 3, categoryName: "Zero FIR", categoryCode: "ZFIR", description: "Zero First Information Report", isActive: true },
    { id: 4, categoryName: "PAR", categoryCode: "PAR", description: "Police Action Report", isActive: true }
  ];
  const existCats = await zcql.executeZCQLQuery("SELECT id FROM CaseCategory");
  const existCatIds = new Set(existCats.map(r => parseInt(r.CaseCategory.id, 10)));
  const catsToInsert = targetCategories.filter(c => !existCatIds.has(c.id));
  if (catsToInsert.length > 0) {
    await insertInBatches(datastore.table("CaseCategory"), catsToInsert);
  }

  // B. GravityOffence
  console.log("[Seeder] Seeding GravityOffence...");
  const targetGravities = [
    { id: 1, offenceName: "Heinous", offenceCode: "HEIN", severity: "HIGH", description: "Heinous offences", isActive: true },
    { id: 2, offenceName: "Non-Heinous", offenceCode: "NHEIN", severity: "MEDIUM", description: "Non-Heinous offences", isActive: true }
  ];
  const existGravs = await zcql.executeZCQLQuery("SELECT id FROM GravityOffence");
  const existGravIds = new Set(existGravs.map(r => parseInt(r.GravityOffence.id, 10)));
  const gravsToInsert = targetGravities.filter(g => !existGravIds.has(g.id));
  if (gravsToInsert.length > 0) {
    await insertInBatches(datastore.table("GravityOffence"), gravsToInsert);
  }

  // C. CrimeHead
  console.log("[Seeder] Seeding CrimeHead...");
  const targetHeads = [
    { id: 10, name: "Crimes Against Property" },
    { id: 20, name: "Cyber Crime" },
    { id: 30, name: "Crimes Against Body" },
    { id: 40, name: "Economic Offenses" },
    { id: 50, name: "Narcotics" },
    { id: 60, name: "Fraud" },
    { id: 70, name: "Missing Person" }
  ];
  const existHeads = await zcql.executeZCQLQuery("SELECT id FROM CrimeHead");
  const existHeadIds = new Set(existHeads.map(r => parseInt(r.CrimeHead.id, 10)));
  const headsToInsert = targetHeads.filter(h => !existHeadIds.has(h.id));
  if (headsToInsert.length > 0) {
    const crimeHeadDetails = await datastore.getTableDetails("CrimeHead");
    const cols = crimeHeadDetails.columnDetails || crimeHeadDetails._tableDetails?.column_details || [];
    const hasNameCol = cols.some(c => (c.column_name || c.columnName) === "name");
    
    console.log(`[Seeder] CrimeHead has name column? ${hasNameCol}`);
    const preparedHeads = targetHeads.map(h => {
      const obj = { id: h.id };
      if (hasNameCol) obj.name = h.name;
      return obj;
    });
    await insertInBatches(datastore.table("CrimeHead"), preparedHeads);
  }

  // D. CrimeSubHead
  console.log("[Seeder] Seeding CrimeSubHead...");
  const targetSubHeads = [
    { id: 101, name: "House Break-in & Burglary" },
    { id: 102, name: "Armed Robbery" },
    { id: 201, name: "Identity Theft & Phishing" },
    { id: 202, name: "Online Financial Fraud" },
    { id: 301, name: "Murder" },
    { id: 302, name: "Grievous Hurt" },
    { id: 401, name: "Tax Evasion" },
    { id: 402, name: "Money Laundering" },
    { id: 501, name: "Drug Peddling" },
    { id: 502, name: "Smuggling" },
    { id: 601, name: "Insurance Scam" },
    { id: 602, name: "Identity Fraud" },
    { id: 701, name: "Runaway Minor" },
    { id: 702, name: "Missing Elderly" }
  ];
  const existSubHeads = await zcql.executeZCQLQuery("SELECT id FROM CrimeSubHead");
  const existSubIds = new Set(existSubHeads.map(r => parseInt(r.CrimeSubHead.id, 10)));
  const subsToInsert = targetSubHeads.filter(s => !existSubIds.has(s.id));
  if (subsToInsert.length > 0) {
    await insertInBatches(datastore.table("CrimeSubHead"), subsToInsert);
  }

  // E. Unit (25 items)
  console.log("[Seeder] Seeding Unit...");
  const targetUnits = [];
  for (let i = 1; i <= 25; i++) {
    const psName = PS_NAMES[i - 1];
    const dist = psName.includes("Mysuru") ? "Mysuru District" : "Bengaluru City";
    targetUnits.push({
      id: i,
      name: psName,
      district: dist
    });
  }
  const existUnits = await zcql.executeZCQLQuery("SELECT id FROM Unit");
  const existUnitIds = new Set(existUnits.map(r => parseInt(r.Unit.id, 10)));
  const unitsToInsert = targetUnits.filter(u => !existUnitIds.has(u.id));
  if (unitsToInsert.length > 0) {
    await insertInBatches(datastore.table("Unit"), unitsToInsert);
  }

  // F. Employee (60 items with designated officer personas)
  console.log("[Seeder] Seeding Employee...");
  const ranks = ["DSP", "Inspector", "Sub-Inspector", "Assistant Sub-Inspector", "Head Constable", "Constable"];
  const targetEmployees = [
    { id: 1, kgid: "123456", firstName: "Ramesh", lastname: "Kumar", rank: "Sub-Inspector", designation: "Investigating Officer" },
    { id: 2, kgid: "999999", firstName: "Kiran", lastname: "Reddy", rank: "DSP", designation: "Superintendent of Police" },
    { id: 3, kgid: "112233", firstName: "Anil", lastname: "Gowda", rank: "Inspector", designation: "Circle Officer" },
    { id: 4, kgid: "KGID000004", firstName: "Siddharth", lastname: "Sagar", rank: "Sub-Inspector", designation: "Cyber Analyst" },
    { id: 5, kgid: "KGID000005", firstName: "Priyanka", lastname: "Patil", rank: "Assistant Sub-Inspector", designation: "Forensic Expert" },
    { id: 6, kgid: "KGID000006", firstName: "Manjunath", lastname: "Hegde", rank: "Head Constable", designation: "Station Writer" }
  ];
  for (let i = 7; i <= 60; i++) {
    const fn = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const rk = ranks[Math.floor(rand() * ranks.length)];
    targetEmployees.push({
      id: i,
      kgid: `KGID${String(i).padStart(6, '0')}`,
      firstName: fn,
      lastname: ln,
      rank: rk,
      designation: rk === "DSP" ? "Superintendent of Police" : rk.includes("Inspector") ? "Investigating Officer" : "Beat Officer"
    });
  }
  const existEmps = await zcql.executeZCQLQuery("SELECT id FROM Employee");
  const existEmpIds = new Set(existEmps.map(r => parseInt(r.Employee.id, 10)));
  const empsToInsert = targetEmployees.filter(e => !existEmpIds.has(e.id));
  if (empsToInsert.length > 0) {
    await insertInBatches(datastore.table("Employee"), empsToInsert);
  }
}

module.exports = {
  seedLookups
};
