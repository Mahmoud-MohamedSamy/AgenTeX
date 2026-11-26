// Renders plan-blueprint-regression.html from cases.json. Run: node make-plan-html.js
const fs = require('fs');
const path = require('path');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'cases.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const G = Object.keys(d.groups);
const counts = {}; d.cases.forEach(c => counts[c.group] = (counts[c.group] || 0) + 1);
const p0 = d.cases.filter(c => c.pri === 'P0').length;
const types = [...new Set(d.cases.map(c => c.type))].sort();
const needs = {}; d.cases.filter(c => c.needs).forEach(c => (needs[c.needs] = needs[c.needs] || []).push(c.id));
const bugSet = new Set(); d.cases.forEach(c => c.bug && c.bug.split(/,\s*/).forEach(b => bugSet.add(b)));

const newSince = [
  ['Strict Mode', 'Restrict All / Specified / All Except, 6 actions + field list (was gap Z1)', 'SM'],
  ['Dynamic transition owners', 'Assign / clear owners of a transition on one ticket (Z2)', 'DO'],
  ['Blueprint-level owners', 'Transition Owners for every transition without its own, incl. another department', 'DT'],
  ['Order of transitions', 'Per state, common transitions move everywhere (Z3)', 'ST'],
  ['Field checks', 'Condition + admin message on a During field (Z4)', 'TU'],
  ['Submit for approval item', 'Default approvers, approver teams, decide-within hours (Z5)', 'TU'],
  ['Share item', 'Default department and access, cap of 10 (Z6)', 'TU'],
  ['Transition drafts', 'Save draft on the ticket form, discarded when the ticket moves (Z8)', 'RN'],
  ['Required for some agents/teams', 'Per-item required list (Z9)', 'TU'],
  ['Reply / rating filters', 'Customer replies vs private thread answers; Good / Okay / Bad (Z10)', 'ST, TM'],
  ['Escalation levels', 'Several levels, before / at / after the limit, recipients, template (Z11)', 'ST, TM'],
  ['Business hours per state', 'Pick a set; deleted set falls back (Z12)', 'ST, TM'],
  ['Blueprint views + filter', 'Active Blueprint Tickets, All / My / My Team / Unassigned Transitions (Z13)', 'RS'],
  ['Blueprint dashboard', 'Limits met / missed, time in state, manual vs automatic moves (Z14)', 'RS'],
  ['Separate revoke permission', 'desk:ticket:blueprint_revoke (Z15)', 'AC'],
  ['Minutes / hours / days', 'Time-limit units (NDC-3063)', 'ST'],
  ['Flow view on the ticket', 'View configured actions, what each step asks for (NDC-3056)', 'RN'],
  ['Designer local draft + conflict', 'Restore unsaved changes; Reload / Keep my changes', 'VR'],
];

const questions = [
  ['Where do we run it?', 'My proposal: NDC-Staging, a QA department of its own ("QA BP Reg Dept") so QA blueprints never catch real tickets, plus the guard criterion Subject starts with "QA BP ". Customer Support was used on 13 Nov; a separate department is safer before go-live.'],
  ['Zoho comparison', 'Only rows tagged Zoho (7) and failed rows get a live Zoho check. Your Zoho Desk org techegysolutions is the only one that still works. OK to create throwaway records there and delete them after?'],
  ['Shared settings', '4 TM rows need business hours switched to Mon–Fri for a few minutes and a holiday added, and 3 rows need Customer Happiness ON for the QA department. OK to change and restore them?'],
  ['Out of scope?', 'I left out the iOS / Android apps, SMS and AI. CRM-only bugs on the same engine (NDC-2334, 2659, 2729, 3011) are mapped to their Desk equivalent rows, not run in CRM. Tell me if you want any of them in.'],
];

const X = require('./exec-plan.js');
const RC = require('./results-card.js'); const RES = RC.res(); const RESULTS = RC(d, esc);
const ph = {}; d.cases.forEach(c => { const p = X.phaseOf(c); (ph[p] = ph[p] || []).push(c); });
const phName = Object.fromEntries(X.phases.map(p => [p.id, p.name]));
const phGroups = p => { const g = {}; (ph[p] || []).forEach(c => g[c.group] = (g[c.group] || 0) + 1); return Object.entries(g).map(([k, v]) => `${k} ${v}`).join(' · '); };
const EXEC = `<section class="card" id="exec">
  <h2>Execution plan (step 2 of 3)</h2>
  <p>Run on <b>NDC-Staging</b> in a new department <b>QA BP Reg Dept</b> (your choice, 24 Nov). About <b>21 h of work, so 2½–3 working days</b>, mostly unattended. Every one of the ${d.cases.length} cases belongs to one phase; the phase pill on each case and the Phase filter at the top show which.</p>
  <div class="scroll"><table><thead><tr><th>Phase</th><th>Cases</th><th>Time</th><th>How</th><th>Groups</th></tr></thead><tbody>
  ${X.phases.map(p => `<tr><td><b>${p.id}</b> ${esc(p.name)}</td><td class="num">${(ph[p.id] || []).length || '—'}</td><td>${esc(p.time)}</td><td>${esc(p.how)}</td><td><code>${esc(phGroups(p.id) || 'setup only')}</code></td></tr>`).join('')}
  </tbody></table></div>
  <div class="phs">${X.phases.map(p => `<div class="ph"><h3>${p.id} · ${esc(p.name)} <span class="sub">${esc(p.time)}</span></h3><ul>${p.body.map(b => `<li>${esc(b)}</li>`).join('')}</ul></div>`).join('')}</div>
  <h3 class="h3">Gates</h3>
  <div class="scroll"><table><tbody>${X.gates.map(([a, b, c]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table></div>
  <h3 class="h3">Rules for the whole run</h3>
  <ul>${X.rules.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
</section>
<section class="card">
  <h2>Decisions still open</h2>
  <div class="qs">${X.decisions.map(([a, b]) => `<div class="q"><b>${esc(a)}</b>${esc(b)}</div>`).join('')}</div>
  <p class="sub" style="margin-top:10px">Answered 24 Nov: cases approved; run in a new QA department. When you approve this plan, Phase 0 starts. Nothing goes to Plane before Gate C.</p>
</section>`;

const caseHtml = G.map(g => {
  const rows = d.cases.filter(c => c.group === g).map(c => {
    const p = X.phaseOf(c);
    const pills = [`<span class="pill ${c.pri === 'P0' ? 'p0' : ''}">${c.pri}</span>`, `<span class="pill phase">${p} ${esc(phName[p])}</span>`, `<span class="pill">${esc(c.type)}</span>`];
    if (c.needs) pills.push(`<span class="pill need">Needs: ${esc(c.needs)}</span>`);
    if (c.zoho) pills.push(`<span class="pill zoho">Zoho: ${esc(c.zoho)}</span>`);
    if (c.bug) pills.push(`<span class="pill bug">${esc(c.bug)}</span>`);
    const r = RES[c.id]; const v = r ? r.verdict : 'NOT RUN'; pills.unshift(`<span class="pill v-${v.replace(/[^A-Z]/g, '')}">${esc(v)}</span>`);
    return `<div class="case" data-g="${c.group}" data-ph="${p}" data-v="${v.replace(/[^A-Z]/g, '')}" data-p="${c.pri}" data-t="${esc(c.type)}" data-n="${c.needs ? 1 : 0}" data-z="${c.zoho ? 1 : 0}" data-b="${c.bug ? 1 : 0}"><div class="cid">${c.id}</div><div class="cb"><div class="ct">${esc(c.title)}</div><div class="ce">${esc(c.expected)}</div><div class="tags">${pills.join('')}</div>${r ? `<div class="rn">${esc(r.note)}</div>` : ''}</div></div>`;
  }).join('');
  return `<section class="card grp" data-grp="${g}"><div class="grp-h"><h2>${g} · ${esc(d.groups[g])}</h2><span class="sub">${counts[g]} cases</span></div>${rows}</section>`;
}).join('\n');

const html = `<title>Desk Blueprint Regression Plan</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
/* Layout: sticky header with filters over one 980px column: summary, what is new, open questions, case groups. Same look as the Workflow Rules plan. */
:root{
  --bg:#f4f6f8; --surface:#ffffff; --fg:#16202a; --muted:#5b6774; --line:#dbe0e6; --accent:#0f6e78; --accent-soft:#e1f0f1;
  --no:#b42a2a; --no-bg:#fbe8e8; --warn:#a85a05; --warn-bg:#fcefdc; --info:#3f5f9a; --info-bg:#e7edf8;
  --sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",Arial,sans-serif; --mono:"IBM Plex Mono",ui-monospace,Consolas,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#11161c; --surface:#1a2129; --fg:#e5e9ee; --muted:#98a3b0; --line:#2c3540; --accent:#4fc0c9; --accent-soft:#16343a;
  --no:#ff7b7b; --no-bg:#3a1c1e; --warn:#f0a54d; --warn-bg:#3a2a16; --info:#8fb0ee; --info-bg:#1d2a42; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#11161c; --surface:#1a2129; --fg:#e5e9ee; --muted:#98a3b0; --line:#2c3540; --accent:#4fc0c9; --accent-soft:#16343a;
  --no:#ff7b7b; --no-bg:#3a1c1e; --warn:#f0a54d; --warn-bg:#3a2a16; --info:#8fb0ee; --info-bg:#1d2a42; color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:15px;line-height:1.5}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--surface)}
.wrap{max-width:980px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
header{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--surface);border-bottom:1px solid var(--line)}
header .wrap{padding-block:12px 10px;display:grid;gap:8px}
h1{font-size:20px;margin:0;letter-spacing:-.01em;text-wrap:balance}
h2{font-size:17px;margin:0 0 10px;text-wrap:balance}
.grp-h h2{margin:0}
.sub{color:var(--muted);font-size:13px}
.filters{display:flex;flex-wrap:wrap;gap:8px}
.filters select,.filters input{font:inherit;font-size:13px;padding:5px 8px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg);min-width:0}
.filters input{flex:1 1 180px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
main .wrap{padding-block:18px 48px;display:grid;gap:22px}
section.card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px;min-width:0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.stat{border:1px solid var(--line);border-radius:6px;padding:10px 12px}
.stat b{display:block;font-size:22px;font-variant-numeric:tabular-nums}
.stat span{font-size:12px;color:var(--muted)}
p{margin:0 0 8px;max-width:72ch}
ol,ul{margin:0 0 8px;padding-left:20px}
li{margin:2px 0}
.scroll{overflow-x:auto}
table{border-collapse:collapse;font-size:13px;width:100%}
td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
th{color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
.grp{display:grid;gap:4px}
.grp-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;border-bottom:2px solid var(--line);padding-bottom:6px}
.case{display:grid;grid-template-columns:76px 1fr;gap:4px 12px;padding:8px 0;border-bottom:1px solid var(--line)}
.case:last-child{border-bottom:0}
.cid{font-family:var(--mono);font-size:12px;color:var(--accent);padding-top:2px}
.cb{min-width:0}
.ct{font-weight:500}
.ce{color:var(--muted);font-size:13px}
.tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.pill{font-size:11px;padding:1px 7px;border-radius:10px;background:var(--accent-soft);color:var(--accent);white-space:nowrap}
.pill.p0{background:var(--no-bg);color:var(--no);font-weight:600}
.pill.need{background:var(--warn-bg);color:var(--warn)}
.pill.zoho{background:var(--info-bg);color:var(--info)}
.pill.bug{background:var(--bg);color:var(--fg);border:1px solid var(--line);white-space:normal}
.q{border-left:3px solid var(--warn);padding:8px 12px;background:var(--warn-bg);border-radius:0 6px 6px 0}
.q b{display:block}
.qs{display:grid;gap:8px}
code{font-family:var(--mono);font-size:12px}
.pill.phase{background:var(--surface);color:var(--accent);border:1px solid var(--accent)}
.num{font-variant-numeric:tabular-nums;text-align:right}
.phs{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:14px}
.ph{border:1px solid var(--line);border-radius:6px;padding:10px 12px;min-width:0}
.ph h3,.h3{font-size:14px;margin:0 0 6px}
.h3{margin-top:16px}
.ph ul{font-size:13px}
.pill.v-PASS{background:var(--accent-soft);color:var(--accent);font-weight:600}.pill.v-FAIL{background:var(--no-bg);color:var(--no);font-weight:700}.pill.v-FINDING,.pill.v-PARTIAL,.pill.v-INCONCLUSIVE{background:var(--warn-bg);color:var(--warn);font-weight:600}.pill.v-BLOCKED,.pill.v-NOTRUN,.pill.v-NA{background:var(--bg);color:var(--muted);border:1px dashed var(--muted)}
.rn{font-size:13px;margin-top:4px;padding:4px 8px;border-left:2px solid var(--line);color:var(--fg);overflow-wrap:anywhere}
@media (max-width:520px){.case{grid-template-columns:1fr}}
</style>
<header><div class="wrap">
  <h1>Desk Blueprint — go-live regression plan</h1>
  <div class="sub">NDC-Staging · staging-desk.taviportal.com · inventory read from the live build 24 Nov 2026 · <b>Run done 24 Nov 2026</b> · results on every case · nothing filed in Plane</div>
  <div class="filters">
    <select id="fr" aria-label="Result"><option value="">All results</option><option value="PASS">PASS</option><option value="FAIL">FAIL</option><option value="FINDING">FINDING</option><option value="PARTIAL">PARTIAL</option><option value="INCONCLUSIVE">INCONCLUSIVE</option><option value="BLOCKED">BLOCKED</option><option value="NOTRUN">NOT RUN</option><option value="NA">N/A</option></select>
    <select id="fh" aria-label="Phase"><option value="">All phases</option>${X.phases.filter(p => ph[p.id]).map(p => `<option value="${p.id}">${p.id} · ${esc(p.name)} (${ph[p.id].length})</option>`).join('')}</select>
    <select id="fg" aria-label="Group"><option value="">All groups</option>${G.map(g => `<option value="${g}">${g} · ${esc(d.groups[g])} (${counts[g]})</option>`).join('')}</select>
    <select id="fp" aria-label="Priority"><option value="">P0 + P1</option><option>P0</option><option>P1</option></select>
    <select id="ft" aria-label="Type"><option value="">All types</option>${types.map(t => `<option>${esc(t)}</option>`).join('')}</select>
    <select id="fx" aria-label="Flags"><option value="">No flag filter</option><option value="n">Needs setup / your OK</option><option value="z">Zoho check</option><option value="b">Linked Plane ticket</option></select>
    <input id="fq" type="search" placeholder="Search cases" aria-label="Search cases">
  </div>
  <div class="sub" id="shown"></div>
</div></header>
<main><div class="wrap">

${RESULTS}

${EXEC}

<section class="card">
  <h2>Case list summary (approved 24 Nov)</h2>
  <div class="stats">
    <div class="stat"><b>${d.cases.length}</b><span>cases in ${G.length} groups</span></div>
    <div class="stat"><b>${p0}</b><span>P0 (must pass for go-live)</span></div>
    <div class="stat"><b>${bugSet.size}</b><span>Plane tickets mapped to cases</span></div>
    <div class="stat"><b>${newSince.length}</b><span>features built since the 1 Nov spec</span></div>
    <div class="stat"><b>${Object.values(needs).flat().length}</b><span>cases need setup or your OK</span></div>
    <div class="stat"><b>${d.cases.filter(c => c.zoho).length}</b><span>cases with a Zoho check</span></div>
  </div>
  <p style="margin-top:12px">Scope: every screen, option, message and API route of Desk Blueprints as the current build ships them. The list was built from the live build (designer, ticket and dashboard texts, 456 + 199 strings, and the API routes the screens call), the 1 Nov spec and the 13 Nov A6 run (187 rows), and the 60 Blueprint tickets in Plane.</p>
  <ol>
    <li><b>Setup</b>: who can use it (AC), the list (LS), the designer (DT, SM, CV), each transition part (TB, TU, TF), each state option (ST), publish checks (PI), drafts and versions (VR).</li>
    <li><b>Runtime</b>: how tickets enter and leave (EN), running steps (RN), per-ticket owners (DO), timers, SLA and customer triggers (TM), other automation (IN), where results show (RS).</li>
    <li><b>Cross-cutting</b>: UI, Arabic, accessibility, browsers (UX), API and security (API), speed (PF), every Plane ticket (RG), Zoho gaps left (ZP), and 8 end-to-end journeys (E2E).</li>
  </ol>
  <p>Every field item type is a case of its own (16 types), and so is every Strict Mode action (6). Each Plane ticket appears in RG and, where it fits, inside the feature case too, so a regression shows up in both places.</p>
</section>

<section class="card">
  <h2>Built since the 1 Nov spec</h2>
  <p class="sub">These were gaps on NDC-2754 / NDC-2799 or bug fixes. They had runtime checks on 13 Nov, but no full-option test yet.</p>
  <div class="scroll"><table><thead><tr><th>Feature</th><th>What it does</th><th>Groups</th></tr></thead><tbody>
  ${newSince.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td><code>${esc(c)}</code></td></tr>`).join('')}
  </tbody></table></div>
  <p class="sub" style="margin-top:8px">Still missing vs Zoho: widgets in the transition form (ZP-01).</p>
</section>

<section class="card">
  <h2>Setup some cases need</h2>
  <div class="scroll"><table><thead><tr><th>Need</th><th>Cases</th></tr></thead><tbody>
  ${Object.entries(needs).map(([k, v]) => `<tr><td>${esc(k)}</td><td><code>${v.join(', ')}</code></td></tr>`).join('')}
  </tbody></table></div>
</section>

${caseHtml}

</div></main>
<script>
(function(){
  var $=function(id){return document.getElementById(id)};
  var cs=[].slice.call(document.querySelectorAll('.case')), gs=[].slice.call(document.querySelectorAll('.grp'));
  function run(){
    var g=$('fg').value,p=$('fp').value,t=$('ft').value,x=$('fx').value,q=$('fq').value.trim().toLowerCase(),n=0;
    cs.forEach(function(c){
      var h=$('fh').value, rv=$('fr').value;
      var ok=(!rv||c.dataset.v===rv)&&(!h||c.dataset.ph===h)&&(!g||c.dataset.g===g)&&(!p||c.dataset.p===p)&&(!t||c.dataset.t===t)&&(!x||c.dataset[x]==='1')&&(!q||c.textContent.toLowerCase().indexOf(q)>-1);
      c.hidden=!ok; if(ok)n++;
    });
    gs.forEach(function(s){s.hidden=!s.querySelector('.case:not([hidden])')});
    $('shown').textContent=n+' of ${d.cases.length} cases shown';
  }
  ['fr','fh','fg','fp','ft','fx'].forEach(function(id){$(id).addEventListener('change',run)});
  $('fq').addEventListener('input',run); run();
})();
</script>`;
fs.writeFileSync(path.join(__dirname, 'plan-blueprint-regression.html'), html);
console.log('written', html.length);
