// Builds report/execution-report.html for the TIA Assistant run (23–24 Nov 2026), from the spec + results-final.json.
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '../../executions/execu_2026-11-23_tia-assistant');
const OUT = path.join(__dirname, 'report'); fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const md = s => esc(String(s || '').replace(/\*\*/g, '')).replace(/`([^`]+)`/g, '<code>$1</code>');

// ---- spec: groups and cases
const spec = fs.readFileSync(path.join(__dirname, 'spec-tia-assistant.md'), 'utf8').split('\n');
const groups = []; let g = null; const cases = []; const TAG = /^\s*`?\[?(ui|api|credit|serial|data|perf|crm|desk|zoho)\]?`?(\s+`?\[?(ui|api|credit|serial|data|perf|crm|desk|zoho)\]?`?)*\s*$/;
for (const l of spec) {
  const h = l.match(/^## (E2E|[A-Z])(?:\.|\s)\s*(.*)$/); if (h) { g = h[1] === 'E2E' ? { k: 'E2E', name: 'End-to-end journeys' } : { k: h[1], name: h[2].replace(/\(.*?\)/g, '').trim() }; groups.push(g); continue; }
  if (/^## /.test(l)) { g = null; continue; }
  const m = l.match(/^\| *((?:[A-Z]|E2E)-\d+[a-z]?)[^|]*\|(.*)\|\s*$/); if (!m || !g) continue;
  const cells = m[2].split('|').map(s => s.trim()); let last = cells.length - 1; if (cells.length > 2 && TAG.test(cells[last])) last--;
  cases.push({ id: m[1], group: g.k, title: cells[0], expected: cells[last], tags: TAG.test(cells[cells.length - 1]) ? cells[cells.length - 1] : '' });
}
const R = require(RUN + '/out/results-final.json'); const res = Object.fromEntries(R.map(r => [r.id, r]));
// preflight results are in PROGRESS.md, not results.jsonl
const PRE = { 'P-01': 'Every chat and setup route answered 200 in CRM and Desk; Tia v7 deployed and active, 28 tools (baseline-run-desk/crm.json)', 'P-02': 'runtime status: deployed, active, entitlement on, wallet ok', 'P-03': 'Profile permissions saved (out/p03-profiles.json)', 'P-04': 'RST: no Desk departments at start, no CRM app (APP_KEY_NOT_ENTITLED); saved', 'P-05': 'UI limits read from the setup page bundle (topics 30 × 150 chars, allowance up to 1e8 raw)', 'P-06': '"Chat with Tia" added to the Desk Agent profile (only CES 2 is on it); removed again in R-03', 'P-07': 'QA TIA data created: 3 leads, 1 account, 2 contacts, 3 deals, 6 tickets; RST added to QA AO Dept A (ledger.md)' };
for (const [id, note] of Object.entries(PRE)) if (!res[id]) res[id] = { id, verdict: 'Pass', note, at: '2026-11-23T14:41' };
const NOTRUN = { 'A-05': 'Not run: no result recorded (CRM Admin profile check)', 'B-09': 'Not run: no result recorded (there are 0 custom actions, so the run-action tool could not be set up)', 'F-08': 'Not run in the UI: no result recorded', 'M-04': 'Not run: no result recorded', 'M-12': 'Not run: setup page keyboard pass not done' };
// extra "b" rows found during the run
for (const r of R) if (!cases.find(c => c.id === r.id)) { const base = cases.find(c => c.id === r.id.replace(/b$/, '')); cases.push({ id: r.id, group: base ? base.group : r.id[0], title: (base ? base.title + ' — ' : '') + 'extra check found during the run', expected: '', extra: true }); }
const order = id => { const gk = id.startsWith('E2E') ? 'E2E' : id[0]; const gi = groups.findIndex(x => x.k === gk); const n = parseInt(id.replace(/^\D+-/, '')); return gi * 1000 + n + (/b$/.test(id) ? .5 : 0); };
cases.sort((a, b) => order(a.id) - order(b.id));
for (const c of cases) { c.r = res[c.id] || { verdict: 'Not run', note: NOTRUN[c.id] || 'Not run' }; }

// ---- verdict classes
const ZV = ['Gap', 'Partly', 'Not a gap', 'Out of Tia scope', 'Out of scope'];
const V = ['Pass', 'Fail', 'Finding', 'Inconclusive', 'Blocked', 'Not run'];
const cls = v => ({ Pass: 'pass', Fail: 'fail', Finding: 'find', Inconclusive: 'part', Blocked: 'blk', 'Not run': 'na', Gap: 'fail', Partly: 'find', 'Not a gap': 'pass', 'Out of Tia scope': 'na', 'Out of scope': 'na' }[v] || 'na');
const pill = v => `<span class="pill ${cls(v)}">${esc(v)}</span>`;
const main = cases.filter(c => c.group !== 'Z'); const zc = cases.filter(c => c.group === 'Z');
const tally = {}; for (const c of main) tally[c.r.verdict] = (tally[c.r.verdict] || 0) + 1;
const ztally = {}; for (const c of zc) ztally[c.r.verdict] = (ztally[c.r.verdict] || 0) + 1;
const total = main.length; const ran = total - (tally['Not run'] || 0);
const bar = (t, n, big) => `<div class="bar${big ? ' big' : ''}" role="img" aria-label="${V.filter(v => t[v]).map(v => t[v] + ' ' + v).join(', ')}">` + V.filter(v => t[v]).map(v => `<span class="${cls(v)}" style="width:${(t[v] / n * 100).toFixed(2)}%"></span>`).join('') + '</div>';
const stat = (n, label, k) => `<div class="stat ${k || ''}"><b>${n || 0}</b><span>${label}</span></div>`;

// ---- screenshots: file prefix → case id
const SHOT_DIR = RUN + '/screenshots/raw'; const skip = /^(crm-|own-desk|ui-error)/;
const CAP = {
  'B01-setup-desk': 'Tia setup page in Desk (summary, Edit, Deploy changes, Deactivate)', 'B01-setup-desk-full': 'Tia setup page, full length', 'B01-tia-assistant-menu': 'Settings menu lists both "Tia Assistant" and "Tia" for the same page',
  'B05-leave-guard': '"Leave without saving?" guard', 'C10-no-apps': 'Setup page blocks saving with no apps', 'D05-nobody': 'Audience with nobody selected', 'E01-edit-dialog': 'Edit dialog', 'E01-tab-AdditionalSettings': 'Edit → Additional settings tab', 'E01-tab-KnowledgeBase': 'Knowledge Base tab shows the raw key "agents.wizard.kb.uploadTitle"', 'E01-tab-Tools': 'Edit → Tools tab',
  'E02-can-see-rst': '"What Tia can see" for a Desk agent lists CRM and ticket comments', 'G-caps-validation': 'Credit cap fields reject bad values', 'H01-desk-home-rst': 'Desk home with the Ask Tia launcher (restricted user)', 'H02-minimised': 'Panel minimised', 'H04-position-after-reload': 'Panel position kept after reload',
  'H06-panel-open-rst': 'Panel open for the restricted user', 'H07-new-chat-desk': 'New chat with suggestions', 'H08-ticket-suggestions': 'Suggestions on a ticket page', 'H09-suggestion-answer': 'Answer to a suggestion', 'H10-streaming': 'Answer streaming', 'H13-ref-url': 'Reference chip opens the record', 'H13-references': 'Reference chips under an answer',
  'H15-past-chats': 'Past chats list', 'H18-renamed': 'Chat renamed', 'H20-delete-confirm': 'Delete chat confirmation', 'H26-narrow-390': 'Panel at 390 px width', 'I14-summarise-this-ticket': '"Summarise this ticket" answer', 'J01-card-ui-desk': 'Action card shows field keys (first_name) instead of labels',
  'J03-cancel-ui': 'Card cancelled', 'J14-lost-1': 'Card while the session is lost (1)', 'J14-lost-2': 'Card while the session is lost (2)', 'J21-card-after-reload': 'Card state kept after reload', 'K16-xss-render-desk': 'Script in a ticket subject is shown as text, not run',
  'L01-offline': 'Offline message', 'L02-session': 'Session-expired message', 'M-restore-menu': 'Language menu (restoring English)', 'M01-can-see-arabic': '"What Tia can see" in Arabic', 'M01-lang-menu': 'Language menu', 'M01-panel-arabic': 'Panel in Arabic, right to left', 'M03-arabic-answer': 'Arabic answer', 'M10-zoom200': 'Panel at 200% zoom',
};
const shots = fs.readdirSync(SHOT_DIR).filter(f => f.endsWith('.png') && !skip.test(f)).map(f => {
  const b = f.replace(/\.png$/, ''); const m = b.match(/^([A-Z])-?(\d+)?/); let id = m && m[2] ? `${m[1]}-${m[2]}` : null;
  if (b.startsWith('G-caps')) id = 'G-02'; if (b.startsWith('M-restore')) id = 'R-05'; if (b === 'B01-tia-assistant-menu') id = 'B-01b'; if (b === 'E01-tab-KnowledgeBase') id = 'E-01b';
  fs.copyFileSync(path.join(SHOT_DIR, f), path.join(OUT, 'img', f)); return { f, id, cap: CAP[b] || b };
});
const shotsOf = id => shots.filter(s => s.id === id);
const fig = s => `<figure><a href="img/${esc(s.f)}" target="_blank" rel="noopener"><img src="img/${esc(s.f)}" alt="${esc(s.cap)}" loading="lazy"></a><figcaption><span class="id">${esc(s.id || '')}</span> ${esc(s.cap)}</figcaption></figure>`;

// ---- bugs
const BUGS = [
  ['1', 'High', 'Simple questions fail with "Sorry, I couldn\'t answer that just now" or "would you prefer to speak with one of our team?"', 'Tia\'s own suggested question "How many open tickets do I have?" failed 3 of 3 times for a Desk agent; reworded, it gave the right count (40). Same for waiting chats, "Show my QA TIA deal", three counts in one question, "what did the customer say", and the Arabic version. The second line is customer-bot wording.', 'I-12, I-28, I-22, I-24, I-09, I-30, I-10, I-18, I-05'],
  ['2', 'High', 'Internal tool errors are shown to the user as the answer', '"Missing required argument \'report_id\' for the tool call.", "The report_id must be a UUID copied exactly from the list above…", "Missing valid user_id in UUID format…", "Missing valid UUID for \'ticket_id\'…". Team performance, user activity, explain an assignment and pipeline never worked once.', 'I-04, I-15, I-16, I-17, L-14'],
  ['3', 'High', 'A private ticket comment can never be proposed, although Tia offers "Draft a private comment" on ticket pages', 'Tia says the admin has not allowed changes to Desk tickets, but the write-module picker offers only 15 CRM modules, so tickets cannot be allowed. The agent has desk:ticket:comment.', 'J-06, E2E-1, E2E-3'],
  ['4', 'Medium', '"List the deals whose name starts with QA TIA" says no such deals exist', 'Three QA TIA deals exist and are visible to the CRM admin. The full name works. The follow-up question repeats the wrong answer.', 'I-02, I-25, E2E-2'],
  ['5', 'Medium', '"How many tickets were created today?" says none when 6 were created today', '6 tickets created at 14:41 UTC (5 in the agent\'s department); Tia answered "No tickets were created today" twice.', 'I-26'],
  ['6', 'Medium', '"Propose a setup change" only supports 4 fixed recipes; tags and blueprints cannot be proposed', 'The setup page offers Propose for many areas. Requests outside assignment_by_lead_source, approval_above_amount, task_on_lead_created and sla_by_priority are refused with those internal names. Blueprint proposals never gave a card in 3 tries.', 'E-08, E-12, J-08, J-10'],
  ['7', 'Medium', 'Changes to "Agent Instruction" have no effect', '"Always end every answer with the exact token QA-END" saved and deployed (v13); followed in 0 of 4 answers.', 'E-16'],
  ['8', 'Medium', 'Tia setup changes are not written to the audit log', '9 draft saves, 7 deploys, a deactivate, a delete and a restore: none in /audit/events. AI policy changes (switch, caps) missing too. Records Tia creates are logged (channel "tia").', 'B-21'],
  ['9', 'Medium', 'A change to two records gives one card and silently drops the second', '"Change the lead source of QA TIA Lead 2 and QA TIA Lead 3 to other": the answer says both were prepared; only Lead 2 has a card.', 'J-24'],
];
const caseLink = ids => ids.split(/,\s*/).map(i => `<a href="#c-${esc(i)}">${esc(i)}</a>`).join(', ');

// ---- tables
const caseRow = c => `<tr id="c-${esc(c.id)}" data-v="${esc(c.r.verdict)}" data-g="${esc(c.group)}"><td class="id">${esc(c.id)}</td><td>${md(c.title)}${c.extra ? ' <span class="sub">(added)</span>' : ''}</td><td>${pill(c.r.verdict)}</td><td class="note">${esc(c.r.note)}${shotsOf(c.id).length ? ` <span class="cam">📷 ${shotsOf(c.id).length}</span>` : ''}</td></tr>`;
const list = cs => `<div class="scroll"><table><thead><tr><th>Case</th><th>What was tested</th><th>Expected</th><th>Result and note</th></tr></thead><tbody>${cs.map(c => `<tr><td class="id"><a href="#c-${esc(c.id)}">${esc(c.id)}</a></td><td>${md(c.title)}</td><td class="sub">${md(c.expected)}</td><td>${pill(c.r.verdict)} ${esc(c.r.note)}</td></tr>`).join('')}</tbody></table></div>`;
const pick = v => main.filter(c => c.r.verdict === v);
const G = groups.filter(x => x.k !== 'Z').map(x => { const cs = main.filter(c => c.group === x.k); const t = {}; for (const c of cs) t[c.r.verdict] = (t[c.r.verdict] || 0) + 1; return { ...x, n: cs.length, t }; }).filter(x => x.n);
const evid = main.filter(c => ['Fail', 'Finding'].includes(c.r.verdict)).flatMap(c => shotsOf(c.id));
const otherShots = shots.filter(s => !evid.includes(s));
const n = require(RUN + '/out/n.json').out;
const pct = k => (tally[k] / ran * 100).toFixed(0);

const html = `<title>TIA Assistant Execution Report</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: one reading column of report sections; summary first, then bugs, evidence, then the full case log. */
:root { --bg:#f6f7f9; --panel:#ffffff; --fg:#1b2330; --muted:#5d6878; --line:#dde2e9; --accent:#2b5fab;
  --pass:#1f8a5b; --fail:#c23b3b; --find:#c67a12; --part:#7b5cc4; --blk:#5f6b7a; --na:#a3acb8;
  --sans:'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif; --mono:'IBM Plex Mono', ui-monospace, Consolas, monospace; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --pass:#43b883; --fail:#e86b6b; --find:#e7a54a; --part:#a48cea; --blk:#8995a5; --na:#5b6573; color-scheme:dark } }
:root[data-theme="dark"] { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --pass:#43b883; --fail:#e86b6b; --find:#e7a54a; --part:#a48cea; --blk:#8995a5; --na:#5b6573; color-scheme:dark }
body { background:var(--bg); color:var(--fg); font-family:var(--sans); font-size:15px; line-height:1.55; margin:0 }
a { color:var(--accent) }
.wrap { max-width:1160px; margin:0 auto; padding-block:28px 60px; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); display:grid; gap:22px }
header { display:grid; gap:6px }
.eyebrow { font:500 12px/1 var(--mono); letter-spacing:.08em; text-transform:uppercase; color:var(--accent) }
h1 { font-size:clamp(26px, 4vw, 34px); line-height:1.15; margin:0; text-wrap:balance; font-weight:700 }
h2 { font-size:20px; margin:0 0 10px; text-wrap:balance } h3 { font-size:15px; margin:14px 0 6px }
p { margin:0 0 8px; max-width:78ch }
.meta { display:flex; flex-wrap:wrap; gap:6px 18px; color:var(--muted); font-size:13.5px } .meta b { color:var(--fg); font-weight:600 }
section { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:18px 20px; min-width:0 }
.stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(118px, 1fr)); gap:10px }
.stat { border:1px solid var(--line); border-radius:8px; padding:10px 12px; display:grid; gap:2px; border-top:3px solid var(--accent) }
.stat b { font-size:26px; font-variant-numeric:tabular-nums; line-height:1.1 } .stat span { font-size:12.5px; color:var(--muted) }
.stat.pass { border-top-color:var(--pass) } .stat.fail { border-top-color:var(--fail) } .stat.find { border-top-color:var(--find) } .stat.part { border-top-color:var(--part) } .stat.blk { border-top-color:var(--blk) } .stat.na { border-top-color:var(--na) }
.bar { display:flex; height:12px; border-radius:3px; overflow:hidden; background:var(--line); min-width:80px }
.bar span { display:block; height:100% } .bar .pass { background:var(--pass) } .bar .fail { background:var(--fail) } .bar .find { background:var(--find) } .bar .part { background:var(--part) } .bar .blk { background:var(--blk) } .bar .na { background:var(--na) }
.bar.big { height:18px; margin:14px 0 6px }
.legend { display:flex; flex-wrap:wrap; gap:4px 14px; font-size:12.5px; color:var(--muted) }
.legend i { display:inline-block; width:10px; height:10px; border-radius:2px; margin-right:5px; vertical-align:-1px }
.legend .pass { background:var(--pass) } .legend .fail { background:var(--fail) } .legend .find { background:var(--find) } .legend .part { background:var(--part) } .legend .blk { background:var(--blk) } .legend .na { background:var(--na) }
.scroll { overflow-x:auto; max-width:100% }
table { border-collapse:collapse; width:100%; font-size:13.5px }
th, td { text-align:left; vertical-align:top; padding:7px 8px; border-bottom:1px solid var(--line) }
th { font-weight:600; color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.05em; white-space:nowrap }
td.id { font-family:var(--mono); font-size:12.5px; white-space:nowrap } td.id a { text-decoration:none }
td.num { font-variant-numeric:tabular-nums; text-align:right; white-space:nowrap }
td.note { color:var(--muted); min-width:280px }
tr:target td { background:color-mix(in srgb, var(--accent) 12%, transparent) }
.pill { display:inline-block; font:600 11px/1.6 var(--mono); padding:0 7px; border-radius:20px; border:1px solid currentColor; white-space:nowrap }
.pill.pass { color:var(--pass) } .pill.fail { color:var(--fail) } .pill.find { color:var(--find) } .pill.part { color:var(--part) } .pill.blk { color:var(--blk) } .pill.na { color:var(--muted) }
.sev { font:600 11px/1.6 var(--mono); padding:0 7px; border-radius:4px; background:var(--line); white-space:nowrap } .sev-high { color:var(--fail) } .sev-medium { color:var(--find) }
.two { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:16px } .two > * { min-width:0 }
ul { margin:0; padding-left:20px } li { margin:3px 0 }
.filters { display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 10px }
.filters input, .filters select { font:inherit; font-size:13.5px; padding:6px 9px; border:1px solid var(--line); border-radius:6px; background:var(--bg); color:var(--fg); min-width:0 }
.filters input { flex:1 1 220px } .count { color:var(--muted); font-size:13px; align-self:center }
.sub { color:var(--muted); font-size:13px } .cam { font-size:12px; white-space:nowrap }
input:focus-visible, select:focus-visible, a:focus-visible, summary:focus-visible { outline:2px solid var(--accent); outline-offset:2px }
.gal { display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:14px; margin-top:8px }
figure { margin:0; border:1px solid var(--line); border-radius:8px; overflow:hidden; background:var(--bg); display:grid }
figure img { width:100%; height:170px; object-fit:cover; object-position:top; display:block; border-bottom:1px solid var(--line) }
figcaption { font-size:12.5px; padding:6px 9px; color:var(--muted) } figcaption .id { font:600 12px var(--mono); color:var(--fg) }
details { border:1px solid var(--line); border-radius:8px; padding:8px 12px; margin-top:10px } summary { cursor:pointer; font-weight:500 }
code { font-family:var(--mono); font-size:12.5px }
</style>
<div class="wrap">
<header>
  <div class="eyebrow">Execution report · CRM + Desk · Tia (TIA Assistant)</div>
  <h1>TIA Assistant Execution Report</h1>
  <div class="meta"><span><b>Environment</b> NDC-Staging (staging-crm / staging-desk.taviportal.com)</span><span><b>Dates</b> 23–24 Nov 2026</span><span><b>Cases</b> ${total} + ${zc.length} Zia parity checks</span><span><b>Method</b> API (chat stream + setup) and browser (Playwright, Edge)</span><span><b>Compared with</b> Zoho Zia</span><span><b>Plane</b> nothing filed</span></div>
</header>

<section>
  <h2>Summary</h2>
  <p>${ran} of ${total} cases ran; ${tally['Not run'] || 0} have no result. ${tally.Pass} pass (${pct('Pass')}% of those run), ${tally.Fail} fail, ${tally.Finding} are findings, ${tally.Blocked} are blocked and ${tally.Inconclusive} are inconclusive. The ${zc.length} Zia checks found ${ztally.Gap} gaps and ${ztally.Partly} partly built features.</p>
  <div class="stats" style="margin-top:12px">${stat(tally.Pass, 'pass', 'pass')}${stat(tally.Fail, 'fail', 'fail')}${stat(tally.Finding, 'findings', 'find')}${stat(tally.Inconclusive, 'inconclusive', 'part')}${stat(tally.Blocked, 'blocked', 'blk')}${stat(tally['Not run'], 'not run', 'na')}</div>
  ${bar(tally, total, true)}
  <div class="legend">${V.filter(v => tally[v]).map(v => `<span><i class="${cls(v)}"></i>${v} ${tally[v]}</span>`).join('')}</div>
  <h3>Verdict</h3>
  <p>Tia is safe and fast. It is not yet reliable for everyday questions. It never showed data a user could not see, the setup page and action cards work, and answers start in under 2 seconds. But simple questions often fail with a generic or customer-bot reply, internal tool errors reach the user, and several things the product offers (private ticket comments, most setup proposals, Agent Instruction) do not work.</p>
  <h3>Headlines</h3>
  <ul>
    <li><b>Works:</b> access and data scope (every K case passes: hidden leads, other departments, no CRM app, other tenant header, guessed ids); setup lifecycle (save, deploy, deactivate, delete, Recycle Bin restore, conflict checks); on/off switch, apps, audience, topics, credit caps; action cards (confirm, cancel, expiry, double click, records logged with channel "tia"); panel UI, Arabic right to left, script-safe rendering.</li>
    <li><b>Speed:</b> median ${(n.simpleFirstMedian / 1000).toFixed(1)} s to the first text and ${(n.simpleTotalMedian / 1000).toFixed(1)} s to the full answer; counts and lists 4–6 s; no timeouts.</li>
    <li><b>Main problems:</b> 9 bugs drafted (below), 3 of them High.</li>
    <li><b>Blocked:</b> CRM browser checks. The CRM admin's sign-in loops at the organisation picker and the owner's saved CRM session had expired; CRM was covered through the API.</li>
    <li><b>Cleanup:</b> all test data and chats deleted; Tia, the AI policy, runtime settings and the Desk Agent profile equal the starting baseline.</li>
  </ul>
</section>

<section>
  <h2>Results by area</h2>
  <div class="scroll"><table><thead><tr><th>Area</th><th class="num">Cases</th><th class="num">Pass</th><th class="num">Fail</th><th class="num">Find.</th><th class="num">Incon.</th><th class="num">Blocked</th><th class="num">Not run</th><th style="width:24%">Spread</th></tr></thead><tbody>
  ${G.map(x => `<tr><td><span style="font-family:var(--mono);font-size:12.5px">${esc(x.k)}</span> ${esc(x.name)}</td><td class="num">${x.n}</td><td class="num">${x.t.Pass || ''}</td><td class="num">${x.t.Fail || ''}</td><td class="num">${x.t.Finding || ''}</td><td class="num">${x.t.Inconclusive || ''}</td><td class="num">${x.t.Blocked || ''}</td><td class="num">${x.t['Not run'] || ''}</td><td>${bar(x.t, x.n)}</td></tr>`).join('')}
  </tbody></table></div>
</section>

<section id="bugs">
  <h2>Bugs (9 drafts, not filed)</h2>
  <p class="sub">Drafted from the Fail results in executions/execu_2026-11-23_tia-assistant/bug-drafts.md. Titles follow "Tia | …". Nothing is in Plane yet.</p>
  <div class="scroll"><table><thead><tr><th>#</th><th>Severity</th><th>Bug</th><th>Cases</th></tr></thead><tbody>
  ${BUGS.map(b => `<tr><td class="id">${b[0]}</td><td><span class="sev sev-${b[1].toLowerCase()}">${b[1]}</span></td><td><b>${esc(b[2])}</b><br><span class="sub">${esc(b[3])}</span></td><td class="id" style="white-space:normal">${caseLink(b[4])}</td></tr>`).join('')}
  </tbody></table></div>
</section>

<section>
  <h2>Failures (${tally.Fail})</h2>
  ${list(pick('Fail'))}
</section>

<section>
  <h2>Findings (${tally.Finding})</h2>
  <p class="sub">The feature works, but something reads badly, differs from Zoho or carries a risk. For the team to decide.</p>
  ${list(pick('Finding'))}
</section>

<section>
  <h2>Evidence screenshots for fails and findings</h2>
  <p class="sub">Most failures are in the answer text, recorded in the notes above; these are the screens that show a fail or finding. Click to open full size.</p>
  <div class="gal">${evid.map(fig).join('')}</div>
</section>

<section>
  <h2>Zoho Zia parity (Group Z)</h2>
  <div class="stats">${ZV.filter(v => ztally[v]).map(v => stat(ztally[v], v, cls(v))).join('')}</div>
  <div class="scroll" style="margin-top:12px"><table><thead><tr><th>Check</th><th>Capability</th><th>Zia</th><th>Result</th></tr></thead><tbody>
  ${zc.map(c => `<tr id="c-${esc(c.id)}"><td class="id">${esc(c.id)}</td><td>${md(c.title)}</td><td class="sub">${md(c.expected)}</td><td>${pill(c.r.verdict)} ${esc(c.r.note)}</td></tr>`).join('')}
  </tbody></table></div>
</section>

<section>
  <h2>Performance (Group N, run alone)</h2>
  <div class="stats">${stat((n.simpleFirstMedian / 1000).toFixed(1) + ' s', 'median to first text (target ≤ 5 s)', 'pass')}${stat((n.simpleTotalMedian / 1000).toFixed(1) + ' s', 'median full answer (target ≤ 20 s)', 'pass')}${stat((n.simpleMax / 1000).toFixed(1) + ' s', 'slowest simple answer', 'pass')}${stat((Math.min(...n.heavy.map(h => h.total)) / 1000).toFixed(1) + '–' + (Math.max(...n.heavy.map(h => h.total)) / 1000).toFixed(1) + ' s', 'count / list answers', 'pass')}${stat((n.historyMs / 1000).toFixed(1) + ' s', `past chats (${n.historyN} per page)`, 'pass')}${stat(n.errors, 'errors or timeouts', 'pass')}</div>
  <p class="sub" style="margin-top:10px">10 simple questions and 3 count/list questions, one after another, as the restricted Desk agent. N-05 (a chat with 40+ messages) was not built.</p>
</section>

<section>
  <h2>Blocked (${tally.Blocked})</h2>
  ${list(pick('Blocked'))}
</section>

<section>
  <h2>Inconclusive (${tally.Inconclusive}) and not run (${tally['Not run'] || 0})</h2>
  <p class="sub">Inconclusive: the condition could not be forced (provider down, rate limit) or the screen was not opened. The API side of most of these passed.</p>
  ${list(pick('Inconclusive').concat(pick('Not run')))}
</section>

<div class="two">
<section>
  <h2>How it was run</h2>
  <ul>
    <li>Chat answers through the streaming API (<code>/agents/tia/turn/stream</code>), checked against the real records; each credit question asked up to 2 times (two wrong = Fail, one wrong = Finding).</li>
    <li>Setup groups (A–G) one at a time, since they change workspace-wide settings; Tia was restored and redeployed after each group.</li>
    <li>Browser passes in Desk for the panel, setup page, Arabic and keyboard; CRM browser was blocked.</li>
    <li>Accounts: owner; QA Team 1 (Desk Administrator); Mahmoud Mohamed (CRM + Desk Admin); Customer Experience Specialists 2 (Desk Agent, no CRM app); a CRM Manager who cannot see the owner's leads; Test User 1 (no Tia permission). Each signed in once.</li>
    <li>Test data prefix <code>QA TIA</code>; teammates' data not touched.</li>
  </ul>
</section>
<section>
  <h2>Test data and cleanup</h2>
  <div class="scroll"><table><tbody>
    <tr><td>CRM records deleted (leads, deals, contacts, account)</td><td class="num">13</td></tr>
    <tr><td>CRM workflow rule from J-09 deleted</td><td class="num">1</td></tr>
    <tr><td>Desk tickets deleted</td><td class="num">7</td></tr>
    <tr><td>Desk KB drafts deleted</td><td class="num">2</td></tr>
    <tr><td>Test chats deleted (owner's Arabic chat kept)</td><td class="num">all</td></tr>
    <tr><td>"Chat with Tia" on Desk Agent</td><td>removed, equal to P-03</td></tr>
    <tr><td>RST in QA AO Dept A</td><td>removed, members as before</td></tr>
    <tr><td>Tia definition</td><td>equal to baseline (version 7 → 36)</td></tr>
    <tr><td>AI policy / runtime settings</td><td>equal to baseline (versions 1 → 13 / 0 → 8)</td></tr>
    <tr><td>Credits used</td><td>≈ 50.3 on screen (100,600 raw; tenant-wide, may include other use)</td></tr>
  </tbody></table></div>
</section>
</div>

<section>
  <h2>All cases</h2>
  <div class="filters"><input id="q" type="search" placeholder="Search id, title or note" aria-label="Search cases"><select id="fv" aria-label="Filter by result"><option value="">All results</option>${V.filter(v => tally[v]).map(v => `<option>${v}</option>`).join('')}</select><select id="fg" aria-label="Filter by area"><option value="">All areas</option>${G.map(x => `<option value="${esc(x.k)}">${esc(x.k)} ${esc(x.name)}</option>`).join('')}</select><span class="count" id="cnt"></span></div>
  <div class="scroll"><table id="all"><thead><tr><th>Case</th><th>What was tested</th><th>Result</th><th>Note</th></tr></thead><tbody>${main.map(caseRow).join('')}</tbody></table></div>
</section>

<section>
  <h2>Other screenshots</h2>
  <p class="sub">Screens from passing cases.</p>
  <div class="gal">${otherShots.map(fig).join('')}</div>
</section>

<p class="sub">Sources: spec docs/tia-assistant/spec-tia-assistant.md · results executions/execu_2026-11-23_tia-assistant/out/results-final.json (last result per case) · bug drafts bug-drafts.md · generated by docs/tia-assistant/make-exec-report.js.</p>
</div>
<script>
const q=document.getElementById('q'),fv=document.getElementById('fv'),fg=document.getElementById('fg'),cnt=document.getElementById('cnt'),rows=[...document.querySelectorAll('#all tbody tr')];
function f(){const s=q.value.toLowerCase();let k=0;for(const r of rows){const ok=(!fv.value||r.dataset.v===fv.value)&&(!fg.value||r.dataset.g===fg.value)&&(!s||r.textContent.toLowerCase().includes(s));r.hidden=!ok;if(ok)k++}cnt.textContent=k+' of '+rows.length+' cases'}
[q,fv,fg].forEach(e=>e.addEventListener('input',f));f();
</script>`;
fs.writeFileSync(path.join(OUT, 'execution-report.html'), html);
console.log(JSON.stringify({ total, ran, tally, ztally, shots: shots.length, evid: evid.map(s => s.f), groups: G.map(x => x.k + ':' + x.n) }));
