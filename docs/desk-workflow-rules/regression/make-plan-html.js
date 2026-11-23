// Renders plan-workflow-rules-regression.html from cases.json. Run: node make-plan-html.js
const fs = require('fs');
const path = require('path');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'cases.json'), 'utf8'));
const RES = {}; try { for (const l of fs.readFileSync(path.join(__dirname, "../../../executions/execu_2026-11-22_desk-wf-regression/out/results.jsonl"), "utf8").trim().split(/\r?\n/)) { const r = JSON.parse(l); RES[r.id] = r; } } catch (e) { }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fam = { C: 'record', E: 'record', CE: 'record', D: 'delete', FC: 'record', DT: 'date', CR: 'event', AR: 'event', PT: 'event', CM: 'event', HR: 'event' };
const allowed = new Set(d.allowedOnDeleteOrDate);
// runtime coverage plan: R = run for real in RC group, S = save check only
const runOn = { C: 1, E: 1, FC: 1, CM: 1, AR: 1, D: 1, DT: 1 };
let grid = '<table class="mx"><thead><tr><th class="corner">Action ↓ · Trigger →</th>' +
  d.triggers.map(([k, l]) => `<th title="${esc(l)}"><span>${esc(l)}</span></th>`).join('') + '</tr></thead><tbody>';
let cAllowed = 0, cBarred = 0, cRun = 0;
for (const [ak, al, t] of d.actions) {
  grid += `<tr><th>${esc(al)}${d.oncePerSection.includes(ak) ? ' <em title="Only once per instant / scheduled section">1×</em>' : ''}</th>`;
  for (const [tk] of d.triggers) {
    const f = fam[tk];
    const barred = (f === 'delete' || f === 'date') && !allowed.has(ak);
    const chat = t === 'chat' || t === 'im';
    if (barred) { cBarred++; grid += '<td class="no" title="Barred — save must be refused">✕</td>'; continue; }
    cAllowed++;
    const run = runOn[tk] && !chat;
    if (run) cRun++;
    grid += `<td class="${run ? 'run' : 'ok'}" title="${run ? 'Save + run for real' : 'Save check'}">${run ? '●' : '○'}</td>`;
  }
  grid += '</tr>';
}
grid += '</tbody></table>';

const groupOrder = Object.keys(d.groups);
const counts = {}; d.cases.forEach(c => counts[c.group] = (counts[c.group] || 0) + 1);
const p0 = d.cases.filter(c => c.pri === 'P0').length;
const types = [...new Set(d.cases.map(c => c.type))].sort();
const needs = d.cases.filter(c => c.needs);
const zoho = d.cases.filter(c => c.zoho);
const bugs = d.cases.filter(c => c.bug);

const opsRows = Object.entries(d.ops).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${v.map(esc).join(' · ')}</td></tr>`).join('');

const RESULTS_CARD = require("./results-card.js")(d, RES, esc);
const html = `<title>Desk Workflow Rules Regression Plan</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
/* Layout: sticky header with filters over a single 980px column: summary, inventory, matrix, decisions, case groups */
:root{
  --bg:#f4f6f8; --surface:#ffffff; --fg:#16202a; --muted:#5b6774; --line:#dbe0e6; --accent:#0f6e78; --accent-soft:#e1f0f1;
  --ok:#1b7f45; --ok-bg:#e3f4ea; --no:#b42a2a; --no-bg:#fbe8e8; --warn:#a85a05; --warn-bg:#fcefdc; --info:#3f5f9a; --info-bg:#e7edf8;
  --sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Arial,sans-serif; --mono:"IBM Plex Mono",ui-monospace,Consolas,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#11161c; --surface:#1a2129; --fg:#e5e9ee; --muted:#98a3b0; --line:#2c3540; --accent:#4fc0c9; --accent-soft:#16343a;
  --ok:#5fd18e; --ok-bg:#173326; --no:#ff7b7b; --no-bg:#3a1c1e; --warn:#f0a54d; --warn-bg:#3a2a16; --info:#8fb0ee; --info-bg:#1d2a42; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#11161c; --surface:#1a2129; --fg:#e5e9ee; --muted:#98a3b0; --line:#2c3540; --accent:#4fc0c9; --accent-soft:#16343a;
  --ok:#5fd18e; --ok-bg:#173326; --no:#ff7b7b; --no-bg:#3a1c1e; --warn:#f0a54d; --warn-bg:#3a2a16; --info:#8fb0ee; --info-bg:#1d2a42; color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:15px;line-height:1.5}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--surface)}
.wrap{max-width:980px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
header{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--surface);border-bottom:1px solid var(--line)}
header .wrap{padding-block:12px 10px;display:grid;gap:8px}
h1{font-size:20px;margin:0;letter-spacing:-.01em;text-wrap:balance}
h2{font-size:17px;margin:0 0 10px;text-wrap:balance}
h3{font-size:14px;margin:0;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.sub{color:var(--muted);font-size:13px}
.filters{display:flex;flex-wrap:wrap;gap:8px}
.filters select,.filters input{font:inherit;font-size:13px;padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg);min-width:0}
.filters input{flex:1 1 180px}
main .wrap{padding-block:18px 48px;display:grid;gap:22px}
section.card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px;min-width:0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.stat{border:1px solid var(--line);border-radius:6px;padding:10px 12px}
.stat b{display:block;font-size:22px;font-variant-numeric:tabular-nums}
.stat span{font-size:12px;color:var(--muted)}
p{margin:0 0 8px;max-width:72ch}
ul,ol{margin:0 0 8px;padding-left:20px}
li{margin:2px 0}
.scroll{overflow-x:auto}
table{border-collapse:collapse;font-size:13px;width:100%}
td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.mx{width:auto}
.mx th,.mx td{border:1px solid var(--line);padding:3px 5px;text-align:center}
.mx tbody th{text-align:left;white-space:nowrap;font-weight:500}
.mx thead th{height:120px;vertical-align:bottom;white-space:nowrap}
.mx thead th span{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600}
.mx .corner{text-align:left;vertical-align:bottom;font-size:12px;color:var(--muted)}
.mx td.run{background:var(--ok-bg);color:var(--ok)}
.mx td.ok{color:var(--ok)}
.mx td.no{background:var(--no-bg);color:var(--no)}
.mx em{font-style:normal;font-size:11px;color:var(--warn)}
.legend{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:var(--muted);margin-top:8px}
.grp{display:grid;gap:8px}
.grp-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;border-bottom:2px solid var(--line);padding-bottom:4px}
.case{display:grid;grid-template-columns:76px 1fr;gap:4px 12px;padding:8px 0;border-bottom:1px solid var(--line)}
.case:last-child{border-bottom:0}
.cid{font-family:var(--mono);font-size:12px;color:var(--accent);padding-top:2px}
.ct{font-weight:500;min-width:0}
.ce{color:var(--muted);font-size:13px;min-width:0}
.tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.pill{font-size:11px;padding:1px 7px;border-radius:10px;background:var(--accent-soft);color:var(--accent);white-space:nowrap}
.pill.p0{background:var(--no-bg);color:var(--no);font-weight:600}
.pill.need{background:var(--warn-bg);color:var(--warn)}
.pill.zoho{background:var(--info-bg);color:var(--info)}
.pill.bug{background:var(--bg);color:var(--fg);border:1px solid var(--line)}
.pill.v-BLOCKED{background:var(--bg);color:var(--muted);border:1px dashed var(--muted);font-weight:600}.pill.v-PASS{background:var(--ok-bg);color:var(--ok);font-weight:600}.pill.v-FAIL{background:var(--no-bg);color:var(--no);font-weight:600}.pill.v-FINDING,.pill.v-PARTIAL,.pill.v-INCONCLUSIVE{background:var(--warn-bg);color:var(--warn);font-weight:600}.pill.v-NOTRUN{background:var(--bg);color:var(--muted);border:1px dashed var(--line)}.pill.v-NA{background:var(--bg);color:var(--muted)}
.rn{font-size:13px;margin-top:4px;padding:4px 8px;border-left:2px solid var(--line);color:var(--fg)}
.res td:first-child{white-space:nowrap;font-family:var(--mono);font-size:12px}
.q{border-left:3px solid var(--warn);padding:6px 10px;background:var(--warn-bg);border-radius:0 6px 6px 0;margin-bottom:8px}
.q b{display:block}
code{font-family:var(--mono);font-size:12px}
.empty{color:var(--muted);font-style:italic}
@media (max-width:520px){.case{grid-template-columns:1fr}.mx thead th{height:100px}}
</style>
<header><div class="wrap">
  <h1>Desk Workflow Rules — go-live regression plan</h1>
  <div class="sub">NDC-Staging · staging-desk.taviportal.com · inventory read from the live build 22 Nov 2026 · <b>Run 1 done 22 Nov 2026 — 197 of 339 cases run</b></div>
  <div class="filters">
    <select id="fg" aria-label="Group"><option value="">All groups</option>${groupOrder.map(g => `<option value="${g}">${g} · ${esc(d.groups[g])} (${counts[g]})</option>`).join('')}</select>
    <select id="fp" aria-label="Priority"><option value="">P0 + P1</option><option>P0</option><option>P1</option></select>
    <select id="ft" aria-label="Type"><option value="">All types</option>${types.map(t => `<option>${esc(t)}</option>`).join('')}</select>
    <select id="fx" aria-label="Flags"><option value="">No flag filter</option><option value="needs">Needs setup / your OK</option><option value="zoho">Zoho check</option><option value="bug">Linked bug</option></select>
    <select id="fs" aria-label="Result"><option value="">All results</option><option>PASS</option><option>FAIL</option><option>FINDING</option><option>PARTIAL</option><option>BLOCKED</option><option>INCONCLUSIVE</option><option>NOT RUN</option><option>N/A</option></select>
    <input id="fq" type="search" placeholder="Search cases" aria-label="Search cases">
  </div>
  <div class="sub" id="shown"></div>
</div></header>
<main><div class="wrap">

${RESULTS_CARD}
<section class="card">
  <h2>Summary</h2>
  <div class="stats">
    <div class="stat"><b>${d.cases.length}</b><span>cases in ${groupOrder.length} groups</span></div>
    <div class="stat"><b>${p0}</b><span>P0 (must pass for go-live)</span></div>
    <div class="stat"><b>11</b><span>"Execute based on" options</span></div>
    <div class="stat"><b>26</b><span>action types in Desk</span></div>
    <div class="stat"><b>${Object.values(d.ops).reduce((a, v) => a + v.length, 0)}</b><span>operator × data-type cells</span></div>
    <div class="stat"><b>${cAllowed + cBarred}</b><span>trigger × action cells (${cBarred} must be refused)</span></div>
  </div>
  <p style="margin-top:12px">Scope: every trigger and its sub-options, every condition operator for every data type, related Contact/Account fields and ticket facts, every action with all of its options, instant and scheduled, and the combinations between them. A full cross product (11 triggers × 26 actions × 93 operator cells × modes × scopes) is over 500,000 runs, so the plan covers combinations in three layers:</p>
  <ol>
    <li><b>Each part alone, fully</b> — every trigger option (TR, TF, TD, TE), every operator (CO), every action option (AC, AT, AX). One simple partner for the other parts.</li>
    <li><b>Every pair that has a rule</b> — trigger × action: all 286 cells checked at save time (MX), and each allowed action run for real under each trigger family (RC). Trigger × condition where the meaning changes, such as "changed" on create, Delete values, Date re-check, facts on ticket events (TC).</li>
    <li><b>Realistic stacks</b> — several rules, order and chains (MR), other automation (IN), and 5 end-to-end journeys (E2E).</li>
  </ol>
  <p>Up to 10 actions fit in one rule, so the runtime cells are packed: about 30 QA rules cover the 100+ runtime cells. Every QA rule has the guard condition <code>Subject starts with "QA WF "</code>, so teammates' tickets are never touched.</p>
</section>

<section class="card">
  <h2>What the build offers today</h2>
  <h3>Execute based on</h3>
  <ul>
    <li><b>A Record Action</b> — Create · Edit · Create or Edit · Delete · Field Changed (watch 1+ fields, Any / All in the same save, "Also run when a record is created")</li>
    <li><b>A Date-Time field</b> — date field, N Minutes / Hours / Days before or after, Counting = Elapsed time or Business hours (minutes/hours only)</li>
    <li><b>A Ticket Event</b> — Customer Reply · Agent Response · Private Thread (incoming and outgoing / incoming / outgoing) · Comment (any / public / private) · Happiness Rating (all / Good / Okay / Bad), several at once</li>
    <li>Rule Mode Recurring / One time · Layout scope · Department scope. Record Note and Score triggers are CRM-only and stay hidden in Desk.</li>
  </ul>
  <h3 style="margin-top:12px">Condition operators</h3>
  <div class="scroll"><table><tbody>${opsRows}</tbody></table></div>
  <p class="sub" style="margin-top:6px">Plus related fields <code>contact_id.*</code> and <code>account_id.*</code>, ticket facts (Number of Threads, Number of Comments, Recent Comment, Recent Comment Type, Is Overdue, Execution Time), Current Time as a date value, Criteria Pattern, up to 25 conditions.</p>
  <h3 style="margin-top:12px">Actions (26)</h3>
  <p>${d.actions.map(a => esc(a[1])).join(' · ')}. Up to 10 per rule; Owner Assignment, Remove Tags and Send happiness email once per section; other types can repeat. Every type can also be a scheduled action.</p>
</section>

<section class="card">
  <h2>Trigger × action matrix</h2>
  <p>On Delete and Date-Time rules may only use Email, Task, Webhook, Create Record and Function. The other 21 must be refused in the editor <em>and</em> by the API ("can't run on a rule triggered by a deleted record or by a date").</p>
  <div class="scroll">${grid}</div>
  <div class="legend"><span>● save + run for real (${cRun})</span><span>○ save check only (${cAllowed - cRun})</span><span>✕ must be refused (${cBarred})</span><span>1× once per section</span><span>Chat / IM rows run only if a connection exists</span></div>
</section>

<section class="card">
  <h2>Decisions I need from you</h2>
  <div class="q"><b>1. Shared settings (${needs.length} cases need setup)</b>Customer Happiness on, business hours + one holiday, suspending a QA agent, a QA SLA, a QA custom action. Shall I set these up (scoped to a QA department, restored after), or test only what is already configured and mark the rest Blocked?</div>
  <div class="q"><b>2. Chat and IM connections</b>Slack, Teams, Google Chat and WhatsApp had no connection in October. Is any connected now, or are AX-01..05 and RC-06 out of scope?</div>
  <div class="q"><b>3. Zoho checks (${zoho.length} cases marked "Zoho check")</b>Behaviour where TAVI has no written rule (loops, rule order on the same field, merge, One time after reactivation). Check live in Zoho Desk, or record TAVI's behaviour and ask you?</div>
  <div class="q"><b>4. Inboxes</b>Customer replies through Gmail (mahmoud.mmohamedsamy@gmail.com) and the Help Center portal, as in earlier runs?</div>
  <div class="q"><b>5. Order</b>All P0 first across groups, then P1 — or group by group?</div>
</section>

<section class="card">
  <h2>Linked bugs and earlier findings (${bugs.length} cases)</h2>
  <p>${[...new Set(bugs.map(c => c.bug))].map(esc).join(' · ')}</p>
  <p class="sub">The open-ticket list will be refreshed from Plane before the execution plan, and each open ticket mapped to its case.</p>
</section>

<div id="groups" class="grp"></div>
<p class="sub">Generated by <code>docs/desk-workflow-rules/regression/build-cases.js</code> · ${esc(d.source)}</p>
</div></main>
<script>
const G=${JSON.stringify(d.groups)};
const C=${JSON.stringify(d.cases.map(c => [c.id, c.group, c.title, c.expected, c.pri, c.type, c.needs, c.zoho, c.bug, (RES[c.id]||{}).verdict||"NOT RUN", (RES[c.id]||{}).note||""]))};
const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function render(){
  const st=$('fs').value,g=$('fg').value,p=$('fp').value,t=$('ft').value,x=$('fx').value,q=$('fq').value.trim().toLowerCase();
  const rows=C.filter(c=>(!g||c[1]===g)&&(!p||c[4]===p)&&(!t||c[5]===t)&&(!x||(x==='needs'?c[6]:x==='zoho'?c[7]:c[8]))&&(!st||c[9]===st)&&(!q||(c.join(' ').toLowerCase().includes(q))));
  $('shown').textContent=rows.length+' of '+C.length+' cases shown';
  let h='';
  for(const k of Object.keys(G)){
    const r=rows.filter(c=>c[1]===k); if(!r.length)continue;
    h+='<section class="card"><div class="grp-h"><h2>'+k+' · '+esc(G[k])+'</h2><span class="sub">'+r.length+'</span></div>';
    for(const c of r){
      h+='<div class="case"><div class="cid">'+c[0]+'</div><div><div class="ct">'+esc(c[2])+'</div><div class="ce">Expected: '+esc(c[3])+'</div><div class="tags">'
        +'<span class="pill'+(c[4]==='P0'?' p0':'')+'">'+c[4]+'</span><span class="pill">'+esc(c[5])+'</span>'
        +(c[6]?'<span class="pill need">Needs: '+esc(c[6])+'</span>':'')+(c[7]?'<span class="pill zoho">'+esc(c[7])+'</span>':'')+(c[8]?'<span class="pill bug">'+esc(c[8])+'</span>':'')+'<span class="pill v-'+c[9].replace(/[^A-Z]/g,'')+'">'+c[9]+'</span>'
        +'</div>'+(c[10]?'<div class="rn">'+esc(c[10])+'</div>':'')+'</div></div>';
    }
    h+='</section>';
  }
  $('groups').innerHTML=h||'<p class="empty">No case matches these filters.</p>';
}
['fg','fp','ft','fx','fs'].forEach(i=>$(i).addEventListener('change',render));$('fq').addEventListener('input',render);
render();
</script>
`;
fs.writeFileSync(path.join(__dirname, 'plan-workflow-rules-regression.html'), html);
console.log('written', html.length, 'bytes; matrix allowed', cAllowed, 'barred', cBarred, 'run', cRun);
