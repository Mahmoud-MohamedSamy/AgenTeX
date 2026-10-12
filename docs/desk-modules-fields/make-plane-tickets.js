// Builds the Plane ticket payloads (name, priority, description_html) for the bugs in bug-report-data.js.
// Output: plane-tickets.json. MF-13 is skipped (already NDC-1864).
const fs = require('fs'), path = require('path');
const B = require('./bug-report-data.js');
const RUNW = { 1: '5–6 Oct 2026', 2: '6–7 Oct 2026' };
const RELATED = { 'MF-11': 'Same root cause as the CRM users/profiles shown in other Desk pickers: NDC-2204, NDC-1915.', 'MF-46': 'Related: NDC-1797 (some records cannot be deleted forever in a bulk delete).', 'MF-42': 'Related: NDC-1444 (rollup says there is no lookup when there is one).', 'MF-18': 'Related: NDC-1588 (default layout handling).', 'MF-34': 'Related: NDC-1230 (Controlling Field dropdown in Conditional Visibility).', 'MF-01': 'MF-11 (Access Control picker lists CRM users) is the same family: Desk reads CRM data.' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inl = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const out = [];
for (const b of B) {
  if (b.ticket) continue;
  let h = `<p><strong>Summary</strong></p><p>${inl(b.summary)}</p>`;
  h += `<p><strong>Steps to reproduce</strong></p><ol>${b.steps.map(s => `<li><p>${inl(s)}</p></li>`).join('')}</ol>`;
  h += `<p><strong>Expected result</strong></p><p>${inl(b.expected)}</p>`;
  h += `<p><strong>Actual result</strong></p><p>${inl(b.actual)}</p>`;
  if (b.req) h += `<p><strong>Request</strong></p><pre><code>${esc(b.req)}</code></pre>`;
  if (b.res) h += `<p><strong>Response</strong></p><pre><code>${esc(b.res)}</code></pre>`;
  h += `<p><strong>Evidence</strong></p><p>${b.evidence.length ? 'Attached: the annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table) and the original screenshot.' : (b.req ? 'API only — see the request and response above.' : 'No screenshot — follow the steps above.')}</p>`;
  h += `<p><strong>Environment</strong></p><p>staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, ${RUNW[b.run]}; ${esc(b.env)}.</p>`;
  const notes = [`Severity: ${b.sev}. Spec row ${esc(b.spec)} in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run ${b.run}.`];
  if (RELATED[b.id]) notes.push(RELATED[b.id]);
  notes.push(`Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (${b.id}).`);
  h += `<p><strong>Additional notes</strong></p><ul>${notes.map(n => `<li><p>${n}</p></li>`).join('')}</ul>`;
  out.push({ mf: b.id, name: `Modules and Fields | ${b.title}`, priority: b.pri.toLowerCase(), html: h, evidence: b.evidence, run: b.run });
}
fs.writeFileSync(path.join(__dirname, 'plane-tickets.json'), JSON.stringify(out, null, 1));
console.log(out.length, 'tickets;', out.reduce((a, t) => a + t.html.length, 0), 'chars of html');
