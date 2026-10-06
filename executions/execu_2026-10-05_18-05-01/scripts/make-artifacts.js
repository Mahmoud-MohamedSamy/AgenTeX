// Build run-summary.json (schemaVersion 2), bugs/bug-list.md and report.md from results.jsonl.
const fs = require('fs'); const path = require('path');
const RUN = path.resolve(__dirname, '..'); const rd = f => path.join(RUN, f);
const all = fs.readFileSync(rd('results.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const isMeta = r => /\./.test(r.id) || /^(SETUP|CLEANUP|REVERT|SCRIPT)/.test(r.id) || /^G\.|^C\.|^I\.|^K\./.test(r.id);
const rows = all.filter(r => !isMeta(r));
const groupOf = id => { const m = id.match(/^(E2E|SEC|[A-Z])/); return m ? m[1] : '?'; };
const GN = { A: 'A — Access and permissions', B: 'B — Module list', C: 'C — Create / delete custom module', D: 'D — Rename a module', E: 'E — Module detail', F: 'F — Fields listing and standard fields', G: 'G — Layouts', H: 'H — Permissions and visibility', I: 'I — Fields in the Layout Builder', J: 'J — Data Types and Capabilities', K: 'K — Organize Tabs and tab bar', L: 'L — Security, i18n, a11y, perf, compat', E2E: 'E2E journeys', SEC: 'Security finding (extra)', Z: 'Z — Gaps (Missing, retest when built)' };
const order = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'SEC', 'E2E', 'Z'];
const num = id => { const m = id.match(/(\d+)/); return m ? +m[1] : 0; };
rows.sort((a, b) => order.indexOf(groupOf(a.id)) - order.indexOf(groupOf(b.id)) || num(a.id) - num(b.id) || a.id.localeCompare(b.id));
const ST = { PASS: 'passed', FAIL: 'failed', BLOCKED: 'blocked', INCONCLUSIVE: 'blocked', 'NOT RUN': 'notrun', MISSING: 'na', INFO: 'na', PENDING: 'notrun' };
const cnt = {}; for (const r of rows) cnt[r.verdict] = (cnt[r.verdict] || 0) + 1;
const shotPath = (r) => r.shot ? [{ path: 'browser-sessions/mfadmin-180501-9c45/' + r.shot.replace(/^screenshots\//, 'screenshots/'), caption: r.id }] : [];
const ann = id => fs.existsSync(rd(`bugs/screenshots/annotated/${id}-vs-zoho.png`)) ? [{ path: `bugs/screenshots/annotated/${id}-vs-zoho.png`, caption: `${id} vs Zoho` }] : [];
const fails = rows.filter(r => r.verdict === 'FAIL');
const sevRank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
fails.sort((a, b) => (sevRank[a.severity || 'Low'] - sevRank[b.severity || 'Low']) || order.indexOf(groupOf(a.id)) - order.indexOf(groupOf(b.id)));
const TITLES = {
  'SEC-1': 'A CRM Admin profile gives module/field administration inside Desk (cross-app permission leak)', F9: 'Records can be saved without the required record-name field', I13: 'A saved field\'s data type can be changed', I14: 'Record API ignores single-line max length', I16: 'Record API ignores number min/max and accepts text in number fields', I18: 'Record API accepts invalid email, phone and javascript: URLs', I20: 'Record API accepts pick-list values that are not in the list', I25: 'Field regex is saved but not enforced on save',
  B8: 'Standard modules offer Delete, and five row-menu items do nothing', B5: 'A disabled module still accepts records (NDC-1864)', C3: 'A module can be created with a blank (whitespace) name', D5: 'Rename accepts an empty name or another module\'s name', D7: 'Module save has no lost-update protection (stale rowVersion accepted)', D9: 'Layout builder → Rename Module crashes the page', G6: 'Set as default on a layout that holds records returns 500', G26: 'Layout save has no lost-update protection; rowVersion never increases', I17: 'Record API accepts invalid dates', I22: 'Record API ignores multi-select max items', 'E2E-1': 'A new lookup to Contacts is not registered as a related module of Contacts',
  B2: 'Module list shows "UN" as last modifier of every seeded module', B7: 'Desk Web Tabs placeholder says "inside the CRM"', B10: 'Desk Setup sidebar says "Set up your CRM"', C6: 'Two modules can share the same display name', G4: 'Layout builder does not warn about a duplicate layout name before saving', I11: 'Field label length (50) not enforced by the API', I32: 'Two lookups to the same module can use the same related-list title', I33: 'A multi-module lookup can be saved with no modules', L7: 'Arabic UI leaves "Create New Layout" and the layouts description in English', L9: 'Two layout-builder buttons have no accessible name'
};
// bug list
let md = `# Bug list — Desk Modules, Tabs and Fields (run execu_2026-10-05_18-05-01)\n\nTarget: staging-desk.taviportal.com (NDC-Staging), admin "Mahmoud TAVI" (second admin), headless Chromium, 5–6 Oct 2026. ${fails.length} failed rows. Gaps against Zoho are **not** bugs — they are the MISSING rows in report.md (retest when built).\n\nEvidence rule (user, 4 Oct 2026): screenshots only for failed rows, annotated against Zoho where a screen exists; API-only failures carry the request/response in the note.\n\n`;
fails.forEach((r, i) => {
  const ev = [...ann(r.id), ...shotPath(r)].map(e => e.path);
  md += `## ${i + 1}. ${TITLES[r.id] || r.id} — ${r.severity || 'Low'}\n\n- **Scenario:** ${r.id}\n- **Expected vs actual:** ${r.note}\n${ev.length ? `- **Evidence:** ${ev.map(p => '`' + p + '`').join(', ')}\n` : '- **Evidence:** API request/response in the note (no screen)\n'}${r.id === 'B5' ? '- **Existing ticket:** NDC-1864 (do not refile)\n' : ''}\n`;
});
fs.writeFileSync(rd('bugs/bug-list.md'), md);
// run summary
const tc = rows.map(r => ({ name: `${r.id} — ${(TITLES[r.id] || r.note || '').slice(0, 90)}`, spec: 'docs/desk-modules-fields/spec-desk-modules-fields.md', status: ST[r.verdict] || 'notrun', session: r.id === 'A2' || r.id === 'J7' || r.id === 'A7' || r.id === 'A5' || r.id === 'K7' ? 'mfagent-180501-9c45' : 'mfadmin-180501-9c45', screenshots: r.verdict === 'FAIL' ? [...ann(r.id), ...shotPath(r)] : [], steps: [{ desc: GN[groupOf(r.id)] || groupOf(r.id), status: ST[r.verdict] || 'notrun', note: `${r.verdict}${r.severity ? ' (' + r.severity + ')' : ''}: ${r.note || ''}`.slice(0, 900) }] }));
const summary = { total: rows.length, passed: cnt.PASS || 0, failed: cnt.FAIL || 0, blocked: (cnt.BLOCKED || 0) + (cnt.INCONCLUSIVE || 0), naDescoped: (cnt.MISSING || 0) + (cnt.INFO || 0), notRun: (cnt['NOT RUN'] || 0) + (cnt.PENDING || 0) };
const pre = { node: { ok: true, version: 'v24.14.1' }, 'playwright-cli': { ok: true, version: '0.1.22' }, playwright: { ok: true, version: 'playwright@1.62.1' }, curl: { ok: true, version: 'curl 8.16.0' }, sqlcmd: { ok: false }, az: { ok: false } };
const runSummary = { schemaVersion: 2, title: 'Desk Modules, Tabs and Fields — functional run — 2026-10-06', date: '2026-10-05 to 2026-10-06', run: { startedAt: '2026-10-05T15:05:01Z', endedAt: '2026-10-05T22:58:39Z', durationMs: 113 * 60000, mode: 'sequential', environment: '', targetUrl: 'https://staging-desk.taviportal.com', loginMode: 'fresh', sessions: [{ session: 'mfadmin-180501-9c45', spec: 'docs/desk-modules-fields/spec-desk-modules-fields.md', label: 'mfadmin' }, { session: 'mfagent-180501-9c45', spec: 'docs/desk-modules-fields/spec-desk-modules-fields.md', label: 'mfagent' }], tools: pre }, summary, testCases: tc, defects: fails.map((r, i) => ({ id: i + 1, title: TITLES[r.id] || r.id, severity: r.severity || 'Low', scenario: r.id, actual: (r.note || '').slice(0, 600), evidence: [...ann(r.id), ...shotPath(r)].map(e => e.path) })) };
fs.writeFileSync(rd('run-summary.json'), JSON.stringify(runSummary, null, 1));
// report rows table per group
let tbl = '';
for (const g of order) { const gr = rows.filter(r => groupOf(r.id) === g); if (!gr.length) continue; tbl += `\n### ${GN[g]}\n\n| Row | Verdict | Note |\n|---|---|---|\n`; for (const r of gr) tbl += `| ${r.id} | ${r.verdict}${r.severity && r.verdict === 'FAIL' ? ' (' + r.severity + ')' : ''} | ${(r.note || '').replace(/\|/g, '/').replace(/\n/g, ' ').slice(0, 420)} |\n`; }
fs.writeFileSync(rd('report-rows.md'), tbl);
console.log(JSON.stringify(summary), 'fails', fails.length);
