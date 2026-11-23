// Builds findings-review.html: every open finding of the workflow-rules regression as a full ticket draft, for review before filing.
const fs = require('fs'), path = require('path');
const D = require('./bug-drafts.js').filter(d => d.kind !== 'FAIL');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Re-check on 23 Nov 2026 against the current build (rv1/rv3 runs, UI/code checks).
const V = {
  'MR-07': ['yes', 'Pending action Cancelled ("rule_action … no longer exists"), nothing ran'],
  'AT-12': ['yes', 'Offline Dev Team 2 got the ticket; no-skill ticket kept its owner but still Succeeded'],
  'AT-03': ['yes', 'Empty in comment (#7216); not offered in Insert field (168 entries)'],
  'CF-11': ['yes', 'SLA violated empty; "is false" did not match'],
  'PF-03': ['yes', '49 s to first row with 227 rules; a reload took over 3 min'],
  'AC-25': ['yes', 'Succeeded on a ticket with no contact'],
  'API-01': ['yes', 'Partial save → conditions null (API only; the editor sends the full rule)'],
  'AC-03': ['yes', '"Problem" stored as-is'],
  'CO-86': ['yes', 'No match on upper case; editor code saves text operators case-sensitive'],
  'CO-90': ['yes', 'From after To saved (201); editor date fields have no order check'],
  'CO-92': ['yes', 'Tag deleted (204); rule stays active and keeps the tag id'],
  'TD-13': ['no', 'UI message seen 22 Nov'],
  'MX-04': ['yes', 'On Delete + Send happiness email saved (201)'],
  'UX-09': ['yes', 'Default sample {"revenue": …} in the app code and panel (23 Nov)'],
  'L-10': ['no', 'UI seen 22 Nov'],
  'L-09': ['no', 'API behaviour 22 Nov'],
  'RG-02': ['yes', 'CRM role saved as owner role and email recipient (23 Nov)'],
  'AC-10': ['yes', 'Editor + Zoho checked; API path skips (23 Nov)'],
  'TR-06': ['yes', 'Clean department: no run on create, one run on a no-change save'],
  'TR-12': ['yes', 'Automatic department/tag edits ran the On Edit rule (23 Nov)'],
  'TD-11': ['yes', 'Due date 30 min in the past: no run'],
};
const REL = {
  'MR-07': ['NDC-2323 (Done) — pending scheduled actions on a converted lead'],
  'AT-12': ['NDC-2973 (Done) — Owner Assignment assigned suspended agents', 'NDC-2932 / NDC-2931 — skill-based assignment rules'],
  'AT-03': ['NDC-2958 (Done) — ${recordId} and ${moduleId} came out empty'],
  'AC-25': ['NDC-3110 (Done) — Add Tags showed Succeeded when no tag was added'],
  'AC-03': ['NDC-2953 (Done) — API accepted a Field Update on Created By'],
  'CO-92': ['NDC-3111 (Done) — API saved a rule with another department\'s tag'],
  'MX-04': ['NDC-2998 (Done) — API accepted a date trigger on a non-date field'],
  'RG-02': ['NDC-2999 (Done) — Owner Assignment saved any role or user value'],
  'AC-10': ['NDC-2999 (Done) — Owner Assignment saved any role or user value'],
  'TR-06': ['NDC-2205 (Done) — On Edit rules fired on new tickets'],
  'TR-12': ['NDC-2205 (Done) — On Edit rules fired on new tickets'],
};
const Z = {
  'CO-86': ['live', 'differs', 'Zoho ignores letter case: "contains qa zwf lower" and "is qa zwf eq exact" matched upper-case subjects (4 of 4 tickets assigned). Tested with assignment rules, which use the same conditions.'],
  'CF-11': ['live', 'differs', 'A Zoho ticket with no SLA has Is Escalated = false and Is Overdue = false (explicit false), so "is false" matches it.'],
  'AT-03': ['docs', 'differs', 'Zoho’s ticket placeholder list includes Request Id (the ticket number).'],
  'AT-12': ['docs', 'differs', 'Zoho skill-based routing assigns only agents online in the email channel unless "Assign tickets to offline agents" is turned on (off by default).'],
  'AC-10': ['live', 'same', 'Zoho’s Assign Ticket action offers Agent / Team / Agent in a Team only: no assignment-rule option, like TAVI’s editor.'],
  'MR-07': ['docs', 'n/a', 'Zoho workflows have no scheduled actions ("no built-in delay or scheduling"); TAVI-only feature, judged on its own: pending actions are lost silently.'],
  'TD-11': ['docs', 'n/a', 'Zoho workflows have no date-field triggers; TAVI-only feature. Suggest showing "skipped — time already passed" in Execution History.'],
  'TR-06': ['live (assignment rule)', 'same', 'Zoho treats a save with no change as an edit: an Edit-only rule ran when a ticket was saved with the same Priority (checked live 23 Nov with an Edit-only assignment rule; the workflow builder could not be opened under automation). So TAVI matches Zoho here.'],
  'TR-12': ['live (assignment rule)', 'same', 'Zoho treats adding a tag as an edit: an Edit-only rule ran when only a tag was added (checked live 23 Nov, assignment rule as stand-in). TAVI’s case is a tag added automatically by the system; Zoho’s test added it by API.'],
};
const ZB = { differs: 'TAVI differs from Zoho', same: 'Same as Zoho', 'n/a': 'No Zoho equivalent', '?': 'Zoho not checked' };
const FILED = {"MR-07":3203,"AT-12":3204,"AT-03":3205,"CF-11":3206,"PF-03":3207,"AC-25":3208,"AC-03":3209,"CO-86":3210,"CO-90":3211,"CO-92":3212,"MX-04":3213,"UX-09":3214,"RG-02":3215};
const REC = { file: ['Filed in Plane', 'file'], check: ['Check one thing first', 'check'], decide: ['Decision needed', 'decide'] };
const order = { file: 0, check: 1, decide: 2 }, pr = { High: 0, Medium: 1, Low: 2 };
const items = [...D].sort((a, b) => order[a.rec] - order[b.rec] || pr[a.pri] - pr[b.pri]);
const cnt = k => items.filter(d => d.rec === k).length;
const card = d => { const v = V[d.id] || ['no', '']; const r = REC[d.rec];
  return `<article class="card" id="${esc(d.id)}"><header><span class="id">${esc(d.id)}${d.also ? ' + ' + esc(d.also) : ''}</span><span class="tag ${r[1]}">${FILED[d.id] ? 'Filed NDC-' + FILED[d.id] : r[0]}</span><span class="pri p-${esc(d.pri.toLowerCase())}">${esc(d.pri)}</span><span class="ver v-${v[0]}">${v[0] === 'yes' ? 'Re-checked 23 Nov ✓' : v[0] === 'partly' ? 'Re-checked 23 Nov (partly)' : 'Not re-run today'}</span></header>
  <h2>${esc(d.title)}</h2>
  <div class="grid"><section><h3>Steps to reproduce</h3><ol>${d.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>
  <section><h3>Expected</h3><p>${esc(d.expected)}</p><h3>Actual</h3><p>${esc(d.actual)}</p>${d.check ? `<h3>${d.rec === 'decide' ? 'Decision' : 'Before filing'}</h3><p class="note">${esc(d.check)}</p>` : ''}</section></div>
  <dl><dt>Re-check</dt><dd>${esc(v[1])}</dd>${Z[d.id] ? `<dt>Zoho (${esc(Z[d.id][0])})</dt><dd><b>${esc(ZB[Z[d.id][1]])}.</b> ${esc(Z[d.id][2])}</dd>` : `<dt>Zoho</dt><dd>Not a Zoho-parity question (validation, reporting or performance).</dd>`}<dt>Evidence</dt><dd>${esc(d.evidence)}</dd>${REL[d.id] ? `<dt>Related in Plane</dt><dd>${REL[d.id].map(esc).join('<br>')}</dd>` : ''}<dt>Environment</dt><dd>NDC-Staging (staging-desk.taviportal.com), Desk → Tickets, owner account, API + Edge on Windows 10, 22–23 Nov 2026</dd><dt>Plane fields</dt><dd>Project NDC · label Workflow Rules · state Bug · module Desk · Sprint 17 · assignees MahmoudMohamed, mfathy, Hegazy</dd></dl></article>`; };
const html = `<title>Workflow Rules Findings Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: summary table first, then one card per finding grouped by recommendation. */
:root { --bg:#f6f7f9; --panel:#fff; --fg:#1b2330; --muted:#5d6878; --line:#dde2e9; --accent:#2b5fab; --ok:#1f8a5b; --warn:#c67a12; --bad:#c23b3b; --dec:#7b5cc4;
  --sans:'IBM Plex Sans', system-ui, 'Segoe UI', sans-serif; --mono:'IBM Plex Mono', ui-monospace, Consolas, monospace }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --ok:#43b883; --warn:#e7a54a; --bad:#e86b6b; --dec:#a48cea; color-scheme:dark } }
:root[data-theme="dark"] { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --ok:#43b883; --warn:#e7a54a; --bad:#e86b6b; --dec:#a48cea; color-scheme:dark }
body { background:var(--bg); color:var(--fg); font-family:var(--sans); font-size:15px; line-height:1.55 }
.wrap { max-width:1080px; margin:0 auto; padding-block:28px 60px; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); display:grid; gap:18px }
.eyebrow { font:500 12px var(--mono); letter-spacing:.08em; text-transform:uppercase; color:var(--accent) }
h1 { font-size:clamp(24px, 4vw, 32px); margin:4px 0 6px; text-wrap:balance }
p { margin:0 0 8px; max-width:78ch }
.sub { color:var(--muted); font-size:13.5px }
.box { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:16px 18px; min-width:0 }
.stats { display:flex; flex-wrap:wrap; gap:10px; margin-top:10px }
.stat { border:1px solid var(--line); border-radius:8px; padding:8px 12px; min-width:120px }
.stat b { font-size:22px; display:block; font-variant-numeric:tabular-nums }
.stat span { font-size:12.5px; color:var(--muted) }
.scroll { overflow-x:auto }
table { border-collapse:collapse; width:100%; font-size:13.5px }
th, td { text-align:left; padding:7px 8px; border-bottom:1px solid var(--line); vertical-align:top }
th { font-size:12px; text-transform:uppercase; letter-spacing:.05em; color:var(--muted) }
td a { color:var(--accent); text-decoration:none; font-family:var(--mono); font-size:12.5px; white-space:nowrap }
.card { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:16px 18px; display:grid; gap:8px; scroll-margin-top:12px; min-width:0 }
.card header { display:flex; flex-wrap:wrap; gap:8px; align-items:center }
.card h2 { font-size:17px; margin:0; text-wrap:balance }
.card h3 { font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); margin:8px 0 4px }
.card ol { margin:0; padding-left:20px } .card li { margin:3px 0 }
.grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:4px 22px } .grid > * { min-width:0 }
.note { border-left:3px solid var(--warn); padding-left:10px }
dl { display:grid; grid-template-columns:max-content 1fr; gap:4px 14px; margin:6px 0 0; font-size:13px; border-top:1px solid var(--line); padding-top:8px }
dt { color:var(--muted) } dd { margin:0; min-width:0 }
.id { font:600 13px var(--mono) }
.tag, .pri, .ver { font:600 11px/1.7 var(--mono); padding:0 8px; border-radius:20px; border:1px solid currentColor; white-space:nowrap }
.tag.file { color:var(--ok) } .tag.check { color:var(--warn) } .tag.decide { color:var(--dec) }
.p-high { color:var(--bad) } .p-medium { color:var(--warn) } .p-low { color:var(--muted) }
.v-yes { color:var(--ok) } .v-partly { color:var(--warn) } .v-no { color:var(--muted) }
h2.grp { font-size:19px; margin:10px 0 0 }
</style>
<div class="wrap">
<div><div class="eyebrow">Review before filing · Desk · Workflow Rules</div><h1>Workflow Rules Findings Review</h1>
<p>Every open finding from the workflow-rules regression (NDC-Staging, 22–23 Nov 2026), written as a full Plane ticket. Nothing here is filed. The two confirmed bugs are already in Plane: <b>NDC-3186</b> (TC-01, "changed" matches on create) and <b>NDC-3196</b> (OB-02, Test rule on an unsaved department-limited rule). AC-07 was withdrawn (it works with Desk roles).</p>
<p><b>Fixed on the 23 Nov re-check (removed from this list):</b> TD-13 / MX-06 — the misleading "can't run … by a date" message is gone; L-10 — the list now shows "n of 200 rules used in this department" (it seems to count active rules only); L-09 — the rules page loads all rules page by page, so the 200-per-call API cap has no user impact.</p>
<p><b>Closed as not bugs (23 Nov):</b> TR-06 (a save with no change runs On Edit rules) and TR-12 (automatic tag edits run On Edit rules) — Zoho behaves the same (live check).</p>
<p class="sub"><b>Zoho comparison (23 Nov):</b> CO-86 and CF-11 were tested live in the Zoho Desk test portal (temporary data, deleted and purged); AT-03, AT-12, MR-07 and TD-11 come from Zoho's help docs; AC-10 was checked live earlier. TR-06 and TR-12 could not be checked live because Zoho's rule builder would not load reliably under automation.</p>
<p class="sub">Before writing this, every finding the API can test was re-run on today's build, open questions were answered from the app code where possible, and Plane was searched for duplicates: none found, related tickets are listed on each card.</p>
<div class="stats"><div class="stat"><b>${items.length}</b><span>findings</span></div><div class="stat"><b>${cnt('file')}</b><span>ready to file</span></div><div class="stat"><b>${cnt('check')}</b><span>check one thing first</span></div><div class="stat"><b>${cnt('decide')}</b><span>decision needed</span></div><div class="stat"><b>${items.filter(d => (V[d.id] || [])[0] === 'yes').length}</b><span>re-checked today</span></div></div></div>
<div class="box"><div class="scroll"><table><thead><tr><th>Case</th><th>Title</th><th>Priority</th><th>Status</th><th>Re-check</th><th>Zoho</th></tr></thead><tbody>
${items.map(d => `<tr><td><a href="#${esc(d.id)}">${esc(d.id)}</a></td><td>${esc(d.title.replace(/^(Desk )?Workflow Rules \| /, ''))}</td><td><span class="pri p-${esc(d.pri.toLowerCase())}">${esc(d.pri)}</span></td><td><span class="tag ${REC[d.rec][1]}">${FILED[d.id] ? 'Filed NDC-' + FILED[d.id] : REC[d.rec][0]}</span></td><td><span class="ver v-${(V[d.id] || ['no'])[0]}">${(V[d.id] || ['no'])[0] === 'yes' ? '✓ 23 Nov' : (V[d.id] || ['no'])[0] === 'partly' ? 'partly' : '22 Nov'}</span></td><td class="sub">${Z[d.id] ? esc(ZB[Z[d.id][1]]) : '—'}</td></tr>`).join('')}
</tbody></table></div></div>
${['file', 'check', 'decide'].map(k => items.some(d => d.rec === k) ? `<h2 class="grp">${REC[k][0]} (${cnt(k)})</h2>` + items.filter(d => d.rec === k).map(card).join('') : '').join('')}
<p class="sub">Source: docs/desk-workflow-rules/regression/bug-drafts.js · run folder executions/execu_2026-11-22_desk-wf-regression · regression report claude.ai/artifact/3WW2VwvWmusr3FGnFZUKa2</p>
</div>`;
fs.writeFileSync(path.join(__dirname, 'findings-review.html'), html); console.log('written', html.length, 'items', items.length, 'file', cnt('file'), 'check', cnt('check'), 'decide', cnt('decide'));
