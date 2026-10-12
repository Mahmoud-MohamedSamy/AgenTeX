// Builds desk-modules-fields-bug-report.md from bug-report-data.js. Then run make-bug-report-html.js.
const fs = require('fs'), path = require('path');
const B = require('./bug-report-data.js');
const RUNS = { 1: { dir: 'executions/execu_2026-10-05_18-05-01', when: '5–6 Oct 2026' }, 2: { dir: 'executions/execu_2026-10-06_23-09-45', when: '6–7 Oct 2026' } };
const SEV = ['Critical', 'High', 'Medium', 'Low'], PRI = ['Urgent', 'High', 'Medium', 'Low'];
const cnt = (k, v) => B.filter(b => b[k] === v).length;
const env = b => `staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, ${RUNS[b.run].when} (run ${b.run}); ${b.env}.`;
const block = (label, text) => text ? `**${label}:**\n\n\`\`\`\n${text}\n\`\`\`\n\n` : '';
let md = `# Bug report — Desk Modules, Tabs and Fields

| | |
|---|---|
| App | TAVI Desk — \`https://staging-desk.taviportal.com\` (tenant NDC-Staging) |
| Spec | \`docs/desk-modules-fields/spec-desk-modules-fields.md\` (206 rows) |
| Runs | Run 1 \`${RUNS[1].dir}\` (${RUNS[1].when}) · Run 2 \`${RUNS[2].dir}\` (${RUNS[2].when}) |
| Total | **${B.length} bugs** — ${B.filter(b => b.run === 1).length} from run 1, ${B.filter(b => b.run === 2).length} from run 2 |
| Plane | Filed 12 Oct 2026 as **NDC-2219 … NDC-2262** (label Modules & Fields, module Desk, state Bug); MF-13 is the existing NDC-1864. Evidence files in \`bug-evidence/\` are named after their ticket. |

Missing features compared with Zoho Desk are **not** in this report — they are in **NDC-2174**.

**Severity** = how bad the effect is. **Priority** = suggested fix order.
**Evidence:** UI bugs have an annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table). API bugs have no image; the request and response are written out. Image files are in \`docs/desk-modules-fields/bug-evidence/\`, named \`<ticket>-annotated.png\` and \`<ticket>-screenshot.png\`.
Placeholders: \`{module_id}\`, \`{layout_id}\`, \`{field_id}\` … are the ids of the QA objects used in the run.

## Summary

| Severity | Count | | Priority | Count |
|---|---|---|---|---|
${SEV.map((s, i) => `| ${s} | ${cnt('sev', s)} | | ${PRI[i]} | ${cnt('pri', PRI[i])} |`).join('\n')}

| # | Bug | Severity | Priority | Spec row | Run |
|---|---|---|---|---|---|
${B.map(b => `| ${b.id} | ${b.title} | ${b.sev} | ${b.pri} | ${b.spec} | ${b.run} |`).join('\n')}

`;
for (const s of SEV) {
  const L = B.filter(b => b.sev === s); if (!L.length) continue;
  md += `---\n\n## ${s}\n\n`;
  for (const b of L) {
    md += `### ${b.id} — ${b.title}\n**Plane:** ${b.plane || '—'} · **Severity:** ${b.sev} · **Priority:** ${b.pri} · **Spec row:** ${b.spec} · **Run ${b.run}**${b.ticket ? ` · **Existing ticket: ${b.ticket}**` : ''}\n\n`;
    md += `**Summary:** ${b.summary}\n\n**Steps to reproduce:**\n\n${b.steps.map((x, i) => `${i + 1}. ${x}`).join('\n')}\n\n**Expected result:** ${b.expected}\n\n**Actual result:** ${b.actual}\n\n`;
    md += block('Request', b.req) + block('Response', b.res);
    md += `**Evidence:** ${b.evidence.length ? b.evidence.map(p => '`' + p.replace('docs/desk-modules-fields/', '') + '`').join(', ') : (b.req ? 'API only — see the request and response above.' : 'No screenshot — follow the steps above.')}\n\n**Environment:** ${env(b)}\n\n`;
  }
}
md += `---

## Notes
- MF-05 to MF-09, MF-20, MF-21, MF-37 and MF-40 share one cause: the record API does not validate values against the field settings. They can be fixed and retested together.
- MF-33 and MF-34 share one cause: layout rules (dependencies and conditional visibility) are stored, but neither the form nor the record API applies them.
- MF-01 and MF-11 both come from Desk reading CRM data (permissions and the user/profile directory).
- Not bugs: default values for fields (I19, I24) are not built yet — recorded as MISSING (missing list item 13).
- Removed after re-check (7 Oct 2026): the earlier MF-44 ("auto-fill offers only system fields") was a test-setup artefact — on the Tickets layout the picker lists all fields.
- QA items left in the Recycle Bin by the runs cannot be purged because of MF-46; they expire after 60 days.
`;
fs.writeFileSync(path.join(__dirname, 'desk-modules-fields-bug-report.md'), md);
const miss = B.flatMap(b => b.evidence.filter(p => !fs.existsSync(path.resolve(__dirname, '../..', p.startsWith('docs/') ? '' : RUNS[b.run].dir, p))).map(p => b.id + ' ' + p));
console.log(`bugs ${B.length}; with evidence images ${B.filter(b => b.evidence.length).length}; missing files: ${miss.length ? miss.join(', ') : 'none'}`);
