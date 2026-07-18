import { ReportData } from "../types";

export class TemplateEngine {
  static compile(data: ReportData, templateType: string = "default"): string {
    if (templateType === "brief") {
      return `
        <h1>OFFICER BRIEFING: ${data.crimeNo}</h1>
        <p><strong>Status:</strong> ${data.caseNo}</p>
        <p><strong>Summary:</strong> ${data.summary.substring(0, 100)}...</p>
      `;
    }

    // Default template rendering complete Case Report
    const victimsHtml = data.victims.map(v => 
      `<li><strong>${v.name}</strong> (Age: ${v.age || "N/A"}) - Contact: ${v.contact || "N/A"} (${v.role})</li>`
    ).join("");

    const suspectsHtml = data.suspects.map(s => 
      `<li><strong>${s.name}</strong> (Age: ${s.age || "N/A"}) - Status: ${s.status}</li>`
    ).join("");

    const evidenceHtml = data.evidence.map(e => 
      `<tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${e.evidenceNo}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${e.title}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${e.type}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${e.status}</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-size: 10px;">${e.hash.substring(0, 16)}...</td>
      </tr>`
    ).join("");

    const timelineHtml = data.timelineSummary.map(t => 
      `<li><small>${t.time}</small> - <strong>${t.event}</strong> (Recorded by: ${t.officer})</li>`
    ).join("");

    const tasksHtml = data.outstandingTasks.map(t => 
      `<li>[ ] ${t}</li>`
    ).join("");

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 2px solid #002e6e; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #002e6e; margin: 0; font-size: 24px;">KARNATAKA STATE POLICE</h1>
          <h2 style="color: #555; margin: 5px 0 0 0; font-size: 16px; font-weight: normal; letter-spacing: 1px;">INVESTIGATION SUMMARY BRIEF</h2>
          <p style="margin: 5px 0 0 0; font-size: 11px; color: #777;">Generated on: ${new Date().toLocaleString()}</p>
        </div>

        <div style="margin-bottom: 25px; background: #f9f9f9; border: 1px solid #e5e5e5; padding: 15px; border-radius: 6px;">
          <h3 style="margin-top: 0; color: #002e6e; border-bottom: 1px solid #ddd; padding-bottom: 5px;">CASE DETAILS</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr><td style="width: 30%; font-weight: bold; padding: 4px 0;">Crime No (FIR):</td><td>${data.crimeNo}</td></tr>
            <tr><td style="font-weight: bold; padding: 4px 0;">Case Serial No:</td><td>${data.caseNo}</td></tr>
            <tr><td style="font-weight: bold; padding: 4px 0;">Subject Header:</td><td>${data.title}</td></tr>
          </table>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #002e6e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">BRIEF FACTS OF CASE</h3>
          <p style="font-size: 13px; text-align: justify; margin: 0;">${data.summary}</p>
        </div>

        <div style="margin-bottom: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h3 style="color: #002e6e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">COMPLAINANTS / VICTIMS</h3>
            <ul style="font-size: 12px; margin: 0; padding-left: 20px;">
              ${victimsHtml || "<li>No victims linked.</li>"}
            </ul>
          </div>
          <div>
            <h3 style="color: #002e6e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">ACCUSED / SUSPECTS</h3>
            <ul style="font-size: 12px; margin: 0; padding-left: 20px;">
              ${suspectsHtml || "<li>No suspects identified.</li>"}
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #002e6e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">SECURED FORENSIC EVIDENCE</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 8px; border: 1px solid #ddd;">Evidence No</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Asset Title</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Type</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Custody State</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Checksum SHA-256</th>
              </tr>
            </thead>
            <tbody>
              ${evidenceHtml || '<tr><td colspan="5" style="padding: 8px; text-align: center;">No evidence linked.</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 25px; background: #fffcf0; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px;">
          <h3 style="color: #b45309; margin-top: 0; font-size: 14px; border-bottom: 1px solid #fef3c7; padding-bottom: 3px;">AI INTEL EXTRACTS & ANNOTATIONS</h3>
          <pre style="font-family: inherit; font-size: 12px; margin: 0; white-space: pre-wrap; text-align: justify;">${data.intelligenceSummary}</pre>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #002e6e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">CHRONOLOGICAL TIMELINE HIGHLIGHTS</h3>
          <ul style="font-size: 12px; margin: 0; padding-left: 20px; line-height: 1.8;">
            ${timelineHtml || "<li>No events logged.</li>"}
          </ul>
        </div>

        <div style="margin-bottom: 15px;">
          <h3 style="color: #002e6e; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">OUTSTANDING INVESTIGATION TASKS</h3>
          <ul style="font-size: 12px; margin: 0; padding-left: 20px; list-style-type: none; line-height: 1.8;">
            ${tasksHtml}
          </ul>
        </div>

        <div style="margin-top: 40px; border-top: 1px dashed #aaa; padding-top: 20px; font-size: 12px; color: #555;">
          <div style="float: right; text-align: center; width: 200px;">
            <div style="height: 50px;"></div>
            <p style="border-top: 1px solid #333; margin: 5px 0 0 0; font-weight: bold;">Investigating Officer</p>
            <p style="margin: 0; font-size: 10px; color: #777;">Signature and Stamp</p>
          </div>
          <div style="clear: both;"></div>
        </div>
      </div>
    `;
  }
}
