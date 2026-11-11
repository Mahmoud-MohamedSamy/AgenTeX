// Builds report.html (self-contained, images embedded) from results.tsv + the bug/gap data below.
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'evidence/annotated', f)).toString('base64');

// results: last line per id wins
const rows = fs.readFileSync(path.join(RUN, 'results.tsv'), 'utf8').trim().split(/\r?\n/).slice(1).map(l => l.split('\t'));
const last = new Map(); rows.forEach(r => last.set(r[0], r));
const GROUP = { A: 'Access', B: 'List page', C: 'Create', D: 'Edit and save', E: 'Rename', F: 'Unused values', G: 'Replace', H: 'Clone, convert, delete', I: 'Linking fields', J: 'Used In', K: 'Records', L: 'Security, audit, speed' };
const groupOf = id => id.startsWith('E2E') ? 'E2E journeys' : (GROUP[id[0]] || 'Other');
const order = Object.values(GROUP).concat(['E2E journeys', 'Other']);
const res = [...last.values()].sort((a, b) => order.indexOf(groupOf(a[0])) - order.indexOf(groupOf(b[0])) || a[0].localeCompare(b[0], 'en', { numeric: true }));
const count = {}; res.forEach(r => count[r[1]] = (count[r[1]] || 0) + 1);
const V = ['Pass', 'Fail', 'Gap', 'Info', 'Blocked', 'Not run'];
const vcls = v => 'v-' + v.toLowerCase().replace(/\s+/g, '');

const bugs = [
  { id: 'B1', sev: 'High', title: 'A new pick list field can\'t use a global set',
    steps: ['Open the Leads › Standard layout editor.', 'Drag in a Pick List field.', 'Edit Properties › Advanced › Global set: choose "QA GS1111 Tier". The set\'s values appear.', 'Click Save.'],
    expected: 'The field is created and linked to the set. Zoho does this (seen live), and NDC-2806 S4 asks for "linking new or existing picklists".',
    actual: 'Error "Field \'…\': Option \'global_set_id\' is not supported for datatype \'pick_list\'." Nothing is saved. POST /modules/{id}/fields gives the same 400.',
    note: 'Workaround: create a local pick list, then Associate it with the set.', rows: 'I1, J3', img: 'B1-new-field-from-global-set-vs-zoho.png' },
  { id: 'B2', sev: 'High', title: 'Replace leaves workflow rules on the old value',
    steps: ['Create a rule: criteria "Tier = Bronze", action "set Tier = Silver".', 'Replace Bronze → Gold, then Silver → Gold.', 'Open the rule; switch it on and create a lead with Tier = Gold.'],
    expected: 'The rule\'s criteria and actions follow the new value. Zoho\'s Replace covers "Records, Criteria, Workflow Actions, Field Dependency"; its field update changed to Gold live. NDC-2806 S3 says the change propagates to workflows and criteria.',
    actual: 'Records move, but the rule still says "Bronze" and still sets "Silver", both now in Unused. The rule stops matching, and when it runs it writes "Silver" onto a new lead even though the set no longer offers it. Removing a value that a rule uses gives no warning either.',
    note: '', rows: 'G3, G3b, G3c, K5b, F1', img: 'B2-replace-leaves-workflow-rules-on-old-value-vs-zoho.png' },
  { id: 'B3', sev: 'Medium', title: 'Replace is refused when a custom view filters on the value',
    steps: ['Create a Leads view that filters on Tier = Gold.', 'Edit the set and Replace Gold → Silver Plus.'],
    expected: 'The view\'s filter changes to the new value and the view still shows the record (seen live in Zoho). NDC-2806 S3.',
    actual: '"Gold" is used by custom view filters. Change or remove it in those views first. The same block was seen in retest round 15 on 10 Nov.',
    note: '', rows: 'G2, F7, E2E-1', img: 'B3-replace-blocked-by-custom-view-vs-zoho.png' },
  { id: 'B4', sev: 'Low', title: 'A save without the version number overwrites the set (possible bug)',
    steps: ['PUT /global-sets/{id} without row_version.'],
    expected: 'Refused, like a stale save (409).',
    actual: '200 and the set is overwritten. The screen always sends the version, so only API clients are exposed.',
    note: '', rows: 'D8', img: null },
  { id: 'B5', sev: 'Low', title: 'Two editor labels are not translated in Arabic',
    steps: ['Switch the language to العربية.', 'Open Modules and Fields › Global Sets and edit a set.'],
    expected: 'Every label is in Arabic; the page is right-to-left.',
    actual: 'The page is right-to-left and mostly translated, but "VALUES (2)" and "Move 0 to used values" stay in English.',
    note: 'Language was switched back to English after the check.', rows: 'L4', img: null },
];

const gaps = [
  ['Managing values', [
    ['Replace doesn\'t update the places that use the value', 'Zoho changes records, view and workflow criteria, field updates and field dependency. TAVI refuses, or skips workflows (B2, B3).', 'NDC-2806 S3'],
    ['No way to delete an unused value for good', 'Zoho deletes from Unused, one at a time, and refuses a value still in use. TAVI has no route (all 404).', 'Confirmed F5'],
    ['Sort order preference isn\'t saved on the set', 'Zoho: Entered / Alphabetical, followed by list views, reports and dashboards. TAVI: one-time "Sort A–Z" button.', 'Not in PRD'],
    ['No predefined choices', 'Zoho\'s values menu has "Add Predefined Choices".', 'Not in PRD']]],
  ['Sets Zoho ships', [
    ['No ready-made Source and Industry sets', 'TAVI\'s Lead Source and Industry are separate local pick lists per module.', 'Not in PRD'],
    ['No Countries and States list for address fields', 'Zoho\'s list feeds every address Country/State field in 8 modules. TAVI country fields are free text.', 'Not in PRD']]],
  ['Where a set is used', [
    ['Used In doesn\'t list reports, field dependency or blueprints', 'TAVI says "Reports … are not listed here yet".', 'NDC-2806 S6'],
    ['No "which value is used where" view', 'Zoho lists, for one value, the field updates and workflows that use it.', 'Confirmed J7'],
    ['List has no module names or Created By column', 'Zoho shows module names as links plus Created By and Modified By. TAVI shows a field count.', 'Confirmed J8']]],
  ['Limits and API', [
    ['No limit on the number of sets', 'Zoho: 30 sets (Enterprise), 15 linked pick lists per module, 30 fields per set, 500 unused values. TAVI reached 51 sets with no refusal.', 'Confirmed C15'],
    ['No history of past replaces', 'Zoho returns past replacements and runs a long replace as a job with a notification.', 'Not in PRD']]],
];

const zohoUse = [
  ['Fields in any module', 'One set linked to fields in Leads and Contacts at once; the list shows "Leads, Contacts".'],
  ['Address Country / State', 'Built-in "Countries and States List" behind every address field in 8 modules, with codes and a Configure page.'],
  ['Ready-made sets', 'Source and Industry ship as sets; Team Member Role and Access drive Team Selling.'],
  ['Records', 'Rename shows the new label on every record; Replace moves records and updates their modified time.'],
  ['View and workflow criteria', 'Rename and Replace change the criteria (seen on a view).'],
  ['Workflow field updates', 'Replace changed a field update from Silver Plus to Gold (seen live).'],
  ['Field dependency, reports, blueprint', 'Named in Zoho\'s Replace note and API docs; not checked live.'],
];

const nGap = gaps.reduce((n, g) => n + g[1].length, 0);
let gi = 0;
const gapHtml = gaps.map(([g, items]) => `<div class="gapgroup"><h3>${esc(g)}</h3><ol start="${gi + 1}">${items.map(([t, d, p]) => { gi++; return `<li><div class="gt"><strong>${esc(t)}</strong><span class="tag">${esc(p)}</span></div><p>${esc(d)}</p></li>`; }).join('')}</ol></div>`).join('');

const bugHtml = bugs.map(b => `<article class="bug" id="${b.id}">
  <header class="bughead"><span class="bid">${b.id}</span><span class="sev sev-${b.sev.toLowerCase()}">${b.sev}</span><h3>${esc(b.title)}</h3></header>
  <div class="bugbody">
    <div class="bugtext">
      <h4>Steps</h4><ol>${b.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <h4>Expected</h4><p>${esc(b.expected)}</p>
      <h4>Actual</h4><p>${esc(b.actual)}</p>
      ${b.note ? `<p class="muted">${esc(b.note)}</p>` : ''}
      <p class="muted">Spec rows: ${esc(b.rows)}</p>
    </div>
    ${b.img ? `<figure><a href="#img-${b.id}"><img src="${img(b.img)}" alt="${esc(b.id)} TAVI vs Zoho comparison" loading="lazy"></a><figcaption>TAVI on the left, Zoho on the right. ${esc(b.img)}</figcaption></figure>` : ''}
  </div>
</article>`).join('');

const tableRows = res.map(r => `<tr data-v="${esc(r[1])}"><td class="id">${esc(r[0])}</td><td>${esc(groupOf(r[0]))}</td><td><span class="pill ${vcls(r[1])}">${esc(r[1])}</span></td><td class="fact">${esc(r[2])}</td></tr>`).join('');
const total = res.length;
const bar = V.filter(v => count[v]).map(v => `<span class="seg ${vcls(v)}" style="flex:${count[v]}" title="${v}: ${count[v]}"></span>`).join('');
const legend = V.filter(v => count[v]).map(v => `<button class="chip" data-f="${v}" aria-pressed="false"><span class="dot ${vcls(v)}"></span>${v} <b>${count[v]}</b></button>`).join('');

const html = `<title>CRM Global Sets Report</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: one reading column (max 1120px) — verdict strip, bugs with evidence, gaps, Zoho usage, filterable results table, cleanup */
:root{
  --bg:#f6f7f9; --surface:#ffffff; --ink:#18202b; --muted:#5b6574; --line:#dfe3ea; --accent:#1f5fbf;
  --pass:#1d7a46; --fail:#c2352b; --gap:#b36b00; --info:#3b6fb6; --blocked:#6b7280; --notrun:#8a93a3;
  --pass-bg:#e5f4ea; --fail-bg:#fbe7e5; --gap-bg:#fbf0dc; --info-bg:#e6eef9; --blocked-bg:#eceef1; --notrun-bg:#f0f1f4;
  --sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif; --mono:"IBM Plex Mono",ui-monospace,Consolas,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#11151b; --surface:#181e26; --ink:#e4e8ee; --muted:#9aa4b2; --line:#2a323d; --accent:#6ea2ef;
  --pass:#5cc78a; --fail:#f07a70; --gap:#e8a945; --info:#7fa8e6; --blocked:#9aa1ad; --notrun:#7d8695;
  --pass-bg:#173225; --fail-bg:#3a1d1b; --gap-bg:#3a2a12; --info-bg:#1b2a40; --blocked-bg:#23282f; --notrun-bg:#20252c; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#11151b; --surface:#181e26; --ink:#e4e8ee; --muted:#9aa4b2; --line:#2a323d; --accent:#6ea2ef;
  --pass:#5cc78a; --fail:#f07a70; --gap:#e8a945; --info:#7fa8e6; --blocked:#9aa1ad; --notrun:#7d8695;
  --pass-bg:#173225; --fail-bg:#3a1d1b; --gap-bg:#3a2a12; --info-bg:#1b2a40; --blocked-bg:#23282f; --notrun-bg:#20252c; color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:15px/1.6 var(--sans);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.wrap{max-width:1120px;margin:0 auto;padding-block:32px 64px;display:flex;flex-direction:column;gap:40px}
h1,h2,h3{text-wrap:balance;line-height:1.25;margin:0}
h1{font-size:30px;font-weight:700;letter-spacing:-.01em}
h2{font-size:20px;font-weight:600;padding-bottom:8px;border-bottom:1px solid var(--line)}
h3{font-size:16px;font-weight:600}
h4{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:14px 0 4px}
p{margin:0}
.muted{color:var(--muted);font-size:13px}
.mono,code{font-family:var(--mono);font-size:13px}
section{display:flex;flex-direction:column;gap:16px;min-width:0}
.top{display:flex;flex-direction:column;gap:10px}
.eyebrow{font:500 12px var(--mono);color:var(--accent);letter-spacing:.04em}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--muted);font-size:13px}
.meta b{color:var(--ink);font-weight:500}
.strip{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px;display:flex;flex-direction:column;gap:14px}
.bar{display:flex;height:12px;border-radius:6px;overflow:hidden;gap:2px}
.seg{display:block}
.seg.v-pass,.dot.v-pass{background:var(--pass)} .seg.v-fail,.dot.v-fail{background:var(--fail)} .seg.v-gap,.dot.v-gap{background:var(--gap)}
.seg.v-info,.dot.v-info{background:var(--info)} .seg.v-blocked,.dot.v-blocked{background:var(--blocked)} .seg.v-notrun,.dot.v-notrun{background:var(--notrun)}
.legend{display:flex;flex-wrap:wrap;gap:8px}
.chip{font:13px var(--sans);color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:4px 12px;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.chip b{font-variant-numeric:tabular-nums}
.chip[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.chip:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.dot{width:9px;height:9px;border-radius:50%;display:inline-block}
.keyline{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.key{border-left:3px solid var(--line);padding:2px 0 2px 12px}
.key.k-fail{border-color:var(--fail)} .key.k-gap{border-color:var(--gap)} .key.k-pass{border-color:var(--pass)}
.key strong{display:block;font-size:14px}
.bug{background:var(--surface);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.bughead{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.bid{font:600 13px var(--mono);color:var(--muted)}
.sev{font:600 11px var(--sans);text-transform:uppercase;letter-spacing:.06em;padding:2px 8px;border-radius:4px}
.sev-high{background:var(--fail-bg);color:var(--fail)} .sev-medium{background:var(--gap-bg);color:var(--gap)} .sev-low{background:var(--info-bg);color:var(--info)}
.bugbody{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:20px;padding:4px 18px 18px}
.bugtext ol{margin:0;padding-left:20px}
.bugtext p{max-width:62ch}
figure{margin:14px 0 0;display:flex;flex-direction:column;gap:6px;min-width:0}
figure img{display:block;width:100%;border:1px solid var(--line);border-radius:6px;background:#fff}
figcaption{font-size:12px;color:var(--muted);overflow-wrap:anywhere}
.gaps{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.gapgroup{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px;display:flex;flex-direction:column;gap:10px}
.gapgroup ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px}
.gapgroup li::marker{font:600 13px var(--mono);color:var(--gap)}
.gt{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:baseline}
.tag{font:500 11px var(--mono);color:var(--muted);border:1px solid var(--line);border-radius:4px;padding:0 6px;white-space:nowrap}
.gapgroup p{color:var(--muted);font-size:14px}
.uses{display:grid;grid-template-columns:minmax(150px,220px) minmax(0,1fr);border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--surface)}
.uses div{padding:10px 14px;border-top:1px solid var(--line)}
.uses div:nth-child(-n+2){border-top:0}
.uses .k{font-weight:600}
.tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.tools input{font:14px var(--sans);color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:7px 10px;min-width:0;flex:1 1 240px;max-width:360px}
.tablewrap{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface)}
table{border-collapse:collapse;width:100%;min-width:720px;font-size:14px}
th{font:600 12px var(--sans);text-transform:uppercase;letter-spacing:.05em;color:var(--muted);text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--surface)}
td{padding:9px 12px;border-top:1px solid var(--line);vertical-align:top}
td.id{font:500 13px var(--mono);white-space:nowrap}
td.fact{overflow-wrap:anywhere;max-width:62ch}
.pill{font:600 11px var(--sans);text-transform:uppercase;letter-spacing:.04em;padding:2px 8px;border-radius:4px;white-space:nowrap}
.pill.v-pass{background:var(--pass-bg);color:var(--pass)} .pill.v-fail{background:var(--fail-bg);color:var(--fail)} .pill.v-gap{background:var(--gap-bg);color:var(--gap)}
.pill.v-info{background:var(--info-bg);color:var(--info)} .pill.v-blocked{background:var(--blocked-bg);color:var(--blocked)} .pill.v-notrun{background:var(--notrun-bg);color:var(--notrun)}
.list{display:flex;flex-direction:column;gap:8px;padding-left:20px;margin:0}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px;display:flex;flex-direction:column;gap:8px}
.lightbox{position:fixed;inset:0;background:rgba(10,14,20,.88);display:none;align-items:flex-start;justify-content:center;overflow:auto;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) 16px max(16px,env(safe-area-inset-left,0px));z-index:20}
.lightbox:target{display:flex}
.lightbox img{max-width:1600px;width:100%;height:auto;border-radius:6px;background:#fff}
.lightbox a.close{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:calc(16px + env(safe-area-inset-right,0px));color:#fff;font:600 14px var(--sans);background:rgba(0,0,0,.5);padding:6px 12px;border-radius:6px;text-decoration:none}
a{color:var(--accent)}
@media (max-width:820px){.bugbody{grid-template-columns:minmax(0,1fr)}.uses{grid-template-columns:minmax(0,1fr)}.uses div:nth-child(2){border-top:0}.uses .k{padding-bottom:0}.uses .k+div{border-top:0;padding-top:2px}}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
</style>
<div class="wrap">
  <header class="top">
    <span class="eyebrow">QA REPORT · NDC-2806</span>
    <h1>CRM Global Sets: TAVI vs Zoho CRM</h1>
    <p style="max-width:70ch">We compared TAVI CRM's Global Sets with Zoho CRM, listed what is missing, wrote a test spec and ran it on NDC-Staging. Nothing has been filed in Plane yet; the bugs and the gap ticket are drafts.</p>
    <div class="meta"><span><b>Run</b> 11 Nov 2026</span><span><b>TAVI</b> staging-crm.taviportal.com, NDC-Staging, owner + CRM User account</span><span><b>Zoho</b> CRM test org org944965048 (Enterprise trial)</span><span><b>Spec</b> docs/crm-global-sets/spec-crm-global-sets.md</span></div>
  </header>

  <section aria-labelledby="h-sum">
    <h2 id="h-sum">Summary</h2>
    <div class="strip">
      <div class="bar" role="img" aria-label="Results by verdict">${bar}</div>
      <div class="legend">${legend}<span class="muted" style="align-self:center">${total} spec rows · click a verdict to filter the table</span></div>
    </div>
    <div class="keyline">
      <div class="key k-fail"><strong>5 bugs</strong><span class="muted">2 High, 1 Medium, 2 Low</span></div>
      <div class="key k-gap"><strong>${nGap} missing features</strong><span class="muted">compared with Zoho CRM; 5 confirmed in the run</span></div>
      <div class="key k-pass"><strong>Core works</strong><span class="muted">create, edit, rename, unused values, clone, convert, associate, delete, permissions, audit</span></div>
    </div>
  </section>

  <section aria-labelledby="h-bugs">
    <h2 id="h-bugs">Bugs</h2>
    ${bugHtml}
  </section>

  <section aria-labelledby="h-gaps">
    <h2 id="h-gaps">What Zoho has that TAVI is missing</h2>
    <div class="gaps">${gapHtml}</div>
    <p class="muted">Not gaps: Zoho runs Replace in the background; Zoho Sandbox rules; TAVI lets multi-select and radio-button fields use a set, which Zoho does not. Zoho quirks not to copy: its API stores record values that aren't in the set, and its replace API returned 500.</p>
  </section>

  <section aria-labelledby="h-zoho">
    <h2 id="h-zoho">Where Zoho CRM uses global sets</h2>
    <div class="uses">${zohoUse.map(([k, v]) => `<div class="k">${esc(k)}</div><div>${esc(v)}</div>`).join('')}</div>
  </section>

  <section aria-labelledby="h-res">
    <h2 id="h-res">All results</h2>
    <div class="tools"><label for="q" class="muted">Search</label><input id="q" type="search" placeholder="Row id or text, e.g. G2 or replace"><span class="muted" id="shown"></span></div>
    <div class="tablewrap"><table><thead><tr><th>Row</th><th>Area</th><th>Verdict</th><th>What happened</th></tr></thead><tbody id="tb">${tableRows}</tbody></table></div>
  </section>

  <section aria-labelledby="h-rest">
    <h2 id="h-rest">Not run, cleanup and next steps</h2>
    <div class="two">
      <div class="card"><h3>Not run or blocked</h3><ul class="list">
        <li>Field dependency (J5): needs a set field on a shared layout plus dependency rules; not run.</li>
        <li>Blueprint (J6): not set up for QA fields.</li>
        <li>Low-user screen (A5): staging did not load the page within 150 s for the second session; API rows show 403.</li>
        <li>Associate popup screen (I7): passed in round 15 (10 Nov) and by API today.</li>
        <li>Round 2 (same day) ran list filter, mass update, import, Kanban summary, screen create, Arabic UI, keyboard use and layout Used In.</li></ul></div>
      <div class="card"><h3>Cleanup</h3><ul class="list">
        <li>TAVI: all QA GS1111 sets, fields, records, the view and the rule deleted. Baseline diff clean. The Leads Standard layout held a QA field for a few minutes in round 2 (J3); it is gone again (layout v5, same fields as before).</li>
        <li>Deleted QA records and fields are still in the TAVI Recycle Bin: the purge was refused by the permission check.</li>
        <li>Zoho test org: workflow, field update, view, records, fields and sets deleted; records sit in Zoho's Recycle Bin.</li>
        <li>QA RT15 data belongs to round 15 and was left alone.</li></ul></div>
      <div class="card"><h3>Next steps</h3><ul class="list">
        <li>File the gap ticket (draft in docs/crm-global-sets/plane-draft) and B1–B5 with images, once assignee, state, priority, module and sprint are chosen.</li>
        <li>After B1 is fixed, run field dependency and Used In for layouts.</li></ul></div>
    </div>
  </section>
</div>
${bugs.filter(b => b.img).map(b => `<div class="lightbox" id="img-${b.id}"><a class="close" href="#${b.id}">Close</a><img src="${img(b.img)}" alt="${esc(b.id)} full size"></div>`).join('')}
<script>
(function(){
  var chips=[].slice.call(document.querySelectorAll('.chip')), q=document.getElementById('q'), rows=[].slice.call(document.querySelectorAll('#tb tr')), shown=document.getElementById('shown'), active=null;
  function apply(){ var t=(q.value||'').toLowerCase(), n=0; rows.forEach(function(r){ var ok=(!active||r.getAttribute('data-v')===active)&&(!t||r.textContent.toLowerCase().indexOf(t)>-1); r.hidden=!ok; if(ok)n++; }); shown.textContent=n+' of '+rows.length+' rows'; }
  chips.forEach(function(c){ c.addEventListener('click',function(){ var f=c.getAttribute('data-f'); active=active===f?null:f; chips.forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-f')===active));}); apply(); document.getElementById('h-res').scrollIntoView({behavior:'smooth',block:'start'}); }); });
  q.addEventListener('input',apply); apply();
})();
</script>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html);
console.log('report.html', Math.round(html.length / 1024) + ' KB', total + ' rows', JSON.stringify(count));
