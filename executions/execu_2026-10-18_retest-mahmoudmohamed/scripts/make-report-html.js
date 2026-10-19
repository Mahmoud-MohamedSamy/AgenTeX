// Builds report.html (self-contained, annotated images embedded) for the 18 Oct 2026 retest round.
// Usage: node scripts/make-report-html.js
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots/annotated', n)).toString('base64');
const PL = 'https://plane.anyware.software'; // display only; ids below are the Plane identifiers

const V = { PASS: ['ok', 'Pass'], NAB: ['ok', 'Not a bug'], PARTIAL: ['warn', 'Partial'], FAIL: ['bug', 'Fail'], INFO: ['info', 'Info'], TODO: ['info', 'Not started'], DEC: ['dec', 'Needs decision'] };
const pill = k => `<span class="pill ${V[k][0]}">${V[k][1]}</span>`;

const tickets = [
  { n: 1, id: 'NDC-1819', pri: 'Urgent', feat: 'Work Queue', title: 'Workqueue Missings (Zoho-parity list, 13 items)', v: 'PARTIAL', action: 'Bug + comment, or split the open items into child tickets', img: ['NDC-1819-retest-PARTIAL.png', 'NDC-1819-functional-PARTIAL.png', 'NDC-1819-columns-PARTIAL.png'],
    dev: 'Partly delivered (14 Oct): Category View fix; filter items through NDC-1787/1788; items 3–11 listed as not done and needing their own tickets.',
    summary: '4 pass, 5 partial, 4 missing (retested twice). Functional pass on the new features, 19 Oct: sort, hide, records per page, drag-resize and Reset Column Size (kept after reload), Manage Columns search/show/hide, row Edit / Delete / Add Note and most periods work. New defects: (a) a locked column (Phone, Full Name) can be hidden from its header menu and then cannot be shown again — Show is disabled; only Reset to default restores it, and that also drops Company; (b) Clip Text does not clip date cells; (c) periods disagree: Overdue = 2 while Today & Overdue = 110 including 20 Completed — 110 of 118 tasks came from an Excel import with text due dates ("09/21/2026 11:00 AM"), which Overdue skips and the other buckets count; All open also lists Completed tasks; (d) sort is not kept after reload; (e) the utility columns (the ⋮ row-options column, Add Note, Mark as completed) show a ≡ menu whose only option, Hide column, does nothing; (f) at the 105 px minimum width the ≡ icon overlaps header labels and values are cut (full value in the hover tooltip); (g) no maximum width — Full Name reached 5204 px.',
    items: [['1', 'Filter panel design like Zoho', 'Criteria-row bar, not Zoho\'s side panel', 'FAIL'], ['2', 'System Defined / By Fields / Related Modules', '"Filter By Fields" + "System Fields"; no Locked/Touched/Untouched, no related modules', 'FAIL'], ['3', 'Options per field type', 'Type-specific operators (27 for dates)', 'PASS'], ['4', 'Filter search + clear (×)', 'Search present; no × after typing', 'PARTIAL'], ['5', 'Alphabet filter (Leads/Contacts)', 'Not present', 'FAIL'], ['6', 'Alphabet + normal filters together', 'Not testable (item 5 missing)', 'FAIL'], ['7', 'Column menu Asc/Desc/Pin/Hide', 'Asc, Desc, Hide — no Pin', 'PARTIAL'], ['8', 'Table settings, drag-resize, Reset Column Size', 'All present; 142→257 px; reset disabled until resized, then restores', 'PASS'], ['9', 'Manage Columns search / clear / pin', 'Search + clear present; no pin', 'PARTIAL'], ['10', 'Row actions left + Add Note; no redundant Mark as Completed', 'Left ⋮ + Add Note; Tasks menu still has "Mark as completed"', 'PARTIAL'], ['11', 'Date filter options', 'All of Zoho\'s + "Next 7 days"', 'PASS'], ['12', 'Category View staged until Save', 'Staged in dialog; Cancel discards; Save applies', 'PASS'], ['13', 'Create Queue + per module, skip step 1', 'Module preselected, but still on step 1 (layout required)', 'PARTIAL']] },
  { n: 2, id: 'NDC-2095', pri: 'High', feat: 'Custom Views', title: 'Date-time today/yesterday/tomorrow use the UTC day instead of the tenant time zone', v: 'PASS', action: 'Done + comment', img: 'NDC-2095-retest-PASS.png',
    dev: 'Not a code defect: the Org setting general.company.locale.timezone is still UTC; set it to Africa/Cairo and retest.',
    summary: 'Claim verified (Org was "UTC", Default). Set to Africa/Cairo in Company Settings (kept). Leads at 17 Oct 23:50, 18 Oct 00:10, 18 Oct 23:50, 19 Oct 00:10 Cairo: Today = L2 + L3, Yesterday = L1, Tomorrow = L4 — view grid, view API and records filter agree.' },
  { n: 3, id: 'NDC-2096', pri: 'High', feat: 'Custom Views', title: 'A user without the review permission can filter by review_status through the views API', v: 'NAB', action: 'Done + comment (verified not a bug)', img: 'NDC-2096-retest-NOT-A-BUG.png',
    dev: 'Not a confidentiality issue: the review state is already on every record payload the user may read; the frontend gate only controls the filter vocabulary.',
    summary: 'Retested twice. UI still hides Review Status from test user 1; the API still accepts it (201, 6 of 28 leads). Those 6 are exactly the leads whose own payload carries __review_state__ = "approved", so nothing new is exposed. Optional hardening offered by the developer.' },
  { n: 4, id: 'NDC-2097', pri: 'High', feat: 'Custom Views', title: 'A criterion on a field hidden from the viewer exposes its value in the view editor and the view API', v: 'PASS', action: 'Done + comment', img: 'NDC-2097-retest-PASS.png',
    dev: 'Fixed: ModuleViewSettingsFls withholds the value of a hidden field on read; the masked document cannot be saved back. Inference from results remains a product call.',
    summary: 'As test user 1: view API returns value null; editor shows only the banner and an empty row; Save is blocked client-side and the owner\'s criteria stay "company = test". The record can still be inferred from the results (by design, flagged by the developer).' },
  { n: 5, id: 'NDC-1787', pri: 'High', feat: 'Work Queue', title: 'Filter control is rendered only for My Open Activities', v: 'PASS', action: 'Done + comment', img: 'NDC-1787-retest-PASS.png',
    dev: 'Fixed together with NDC-1788: shared filter seam; ad-hoc conditions appended to the queue scope. My Jobs excluded (needs its own design).',
    summary: 'Funnel on every queue (saved and criteria-based). My Leads: Lead Status = No Answer narrows 45 → 1; request keeps owner = $me first. My Jobs still has no filter, as the developer stated.' },
  { n: 6, id: 'NDC-1788', pri: 'High', feat: 'Work Queue', title: 'Filter offers only Status and Priority — every other layout field is unavailable', v: 'PARTIAL', action: 'Bug + comment', img: 'NDC-1788-retest-PARTIAL.png',
    dev: 'Fixed: full filterable catalogue with datatype operators; option labels instead of raw tokens ("Low" not "low").',
    summary: 'Field search, 12 layout + 7 system fields and type-driven operators are there. Still failing: Priority values show low / normal / high / highest (grid shows Highest); Created By, Modified At and Modified By are missing.' },
  { n: 7, id: 'NDC-1821', pri: 'High', feat: 'Work Queue', title: 'Deleted records from Workqueue don\'t move to the recycle bin', v: 'PASS', action: 'Done + comment', img: 'NDC-1821-retest-PASS.png',
    dev: 'Same delete endpoint as the module list; the bin row is written by the audit consumer. Retest both paths in one pass.',
    summary: 'Work Queue row Delete → 204; Leads list Delete Selected → 204. Both leads appear in the Recycle Bin (CRM / Leads, Expires in 60 days), by API and in the UI.' },
  { n: 8, id: 'NDC-1234', pri: 'High', feat: 'Approval Process', title: '[Epic] Approval Process — prevent endless re-entry & post-approval edits of sensitive fields', v: 'PASS', action: 'Done + comment (children: housekeeping)', img: 'NDC-1234-retest-PASS.png',
    dev: 'Retested 24 Sep: every claim exercised worked; held in Ready For Test only for 5 linked bugs (NDC-1645, 1646, 1652, 1672, 1697).',
    summary: 'All five linked bugs are Done. Smoke test with a temporary process: Approval Status read-only with 4 values; entry guard auto-injected; pending → approved; allowed edit keeps Approved (re-entry blocked); non-owner refused on locked Amount (422 APPROVAL_LOCKED); owner override logged on the timeline; status not writable. Its 13 child stories are still in Backlog.' },
  { n: 9, id: 'NDC-1947', pri: 'Medium', feat: 'Custom Views', title: 'A user without "Manage Shared Views" cannot save a private view (only me view)', v: 'NAB', action: 'Done + comment (verified not a bug)', img: 'NDC-1947-retest-NOT-A-BUG.png',
    dev: 'Not a bug: Only-me views need no permission; only sharing options are gated. System views (All Leads) have no "Save to view" by design.',
    summary: 'Test user 2 (no metadata.views.manage) saved a private view (201) and saved column changes to it ("Save to view"). On All Leads only "Use the view\'s columns" is offered — by design; a "save as new view" shortcut would be a product call.' },
  { n: 10, id: 'NDC-2098', pri: 'Medium', feat: 'Custom Views', title: '?view= with a deleted or foreign view ID falls back to the last-used view instead of All Leads', v: 'DEC', action: 'Your decision: close as designed, or change request (fallback to All Leads)', img: 'NDC-2098-retest-DECISION.png',
    dev: 'Specified precedence: ?view= → last view → All. Falling back to All Leads is a one-line change but a behaviour decision.',
    summary: 'Verified: own view opens; deleted and foreign ids show "That view is no longer available. Showing your default view.", ?view= is removed, nothing of the foreign view is shown, and the page lands on the last-used view (QA RT k7), not All Leads.' },
  { n: 11, id: 'NDC-2100', pri: 'Medium', feat: 'Custom Views', title: 'View API accepts non-numeric Amount values and stores them as raw strings', v: 'PASS', action: 'Done + comment', img: 'NDC-2100-retest-PASS.png',
    dev: 'Fixed: numeric criteria parsed and rewritten as numbers; anything else refused with 422.',
    summary: '"15,000" → 15000 and "1e9" → 1000000000 (and they match the QA RT deals); "abc", Arabic-Indic digits, "15 000", "1.2.3" → 422 "That value is not a number."' },
  { n: 12, id: 'NDC-2102', pri: 'Medium', feat: 'Custom Views', title: 'View API accepts an operator that does not fit the field type (Amount "contains" → 201)', v: 'PASS', action: 'Done + comment', img: 'NDC-2102-retest-PASS.png',
    dev: 'Fixed: server-side operators-per-datatype table; mismatch refused with 422.',
    summary: 'Amount contains / starts_with → 422 "That operator cannot be used on this field."; equals, greater_than, is_empty still save.' },
  { n: 13, id: 'NDC-2104', pri: 'Medium', feat: 'Custom Views', title: '"Last Activity" in view criteria is the record\'s modified time; adding a note does not update it', v: 'PASS', action: 'Decision 19 Oct: keep the label "Last Activity" = last modified time → Done + comment', img: ['NDC-2104-retest-PASS.png', 'NDC-2104-retest-DECISION.png'],
    dev: 'Not a defect: "Last Activity" is the label for last_modified_at; notes never touch the record row. Options: rename label, or build the field (NDC-1868 P1-5).',
    summary: 'Retested 19 Oct with the agreed behaviour (label kept, value = last modified): "Last Activity is Today" returned nothing before the edit; editing QA RT tz L2 moved its Last Activity to 19/10/2026 10:07 AM and the criteria then returned L2 only (API and view grid agree). A note alone does not move it, as agreed.' },
  { n: 14, id: 'NDC-2124', pri: 'Low', feat: 'Custom Views', title: 'List preferences accept more than 50 column overrides; no oldest-dropped rule', v: 'FAIL', action: 'Bug + comment', img: 'NDC-2124-retest-FAIL.png',
    dev: 'Not a code defect: the 50 cap with oldest-dropped eviction lives in the frontend; retest through the UI.',
    summary: 'Through the UI on 51 views the cap holds (50 remain), but the wrong override is dropped: ov-38 was evicted while ov-01 (the oldest) stayed. The stored keys come back in a different order (looks sorted by view id), so "oldest" is picked from a reordered object.' },
  { n: 15, id: 'NDC-1789', pri: 'Low', feat: 'Work Queue', title: 'Applied filters don\'t persist on refresh / next session (new login)', v: 'FAIL', action: 'Bug + comment', img: 'NDC-1789-retest-FAIL.png',
    dev: 'Built and deployed 15 Oct: filters kept per user, per list in module preferences; restored on refresh and new login.',
    summary: 'The filter is saved server-side and Clear filters / scope work, but a refresh or a new login opens Tasks unfiltered (112) — restored only after switching to another section and back (44). Restored once, lost on 4 of 4 later reloads and on a fresh login.' },
];
const todo = [];
const obs = ['Work Queue → My Open Activities → "All open" Tasks lists tasks with Status = Completed.', 'Queue badge counts differ from "Total Records" for some queues (e.g. test 46 vs 0) — may be load timing; not investigated.', 'Create Queue dialog showed "The server took too long to respond. Please try again." once.', 'NDC-2097: the first editor load hung on "Loading fields…" for more than 15 s; a reload worked.', 'The browser tab crashed three times — twice when opening Settings → Approval Processes and once on the Work Queue; NDC-1234 was finished by API.', 'Sessions of the shared ndc-staging-owner account were revoked several times (/login?reason=revoked) — likely other people signing in to the same account.'];
const ledger = [['Leads "QA RT del-list 1821", "QA RT del-wq 1821"', 'In Recycle Bin', 'Purge'], ['Leads "QA RT tz L1–L4" (one has a QA RT note)', 'Active', 'Delete + purge'], ['Deals "QA RT amt 15000", "QA RT amt 1e9", "QA RT ap 1" (now owned by test user 1, Approved)', 'Active', 'Delete + purge'], ['Approval process "QA RT ap" (Deals, active)', 'Active', 'Deactivate + delete'], ['Views "QA RT review-gate", "QA RT k7", "QA RT tz-day", "QA RT private-user2", 7 × "QA RT amt / op …" (Deals), 51 × "QA RT ov-01…51"', 'Active', 'Delete + purge'], ['Leads list-preferences of ndc-staging-owner (51 column overrides)', 'Changed', 'Restore the saved backup (viewColumns was empty)'], ['Leads list-preferences of test user 2 (column hidden on All Leads)', 'Changed', '"Use the view\'s columns"'], ['Work Queue → Tasks filter "Priority equals highest" (existed before the run)', 'Cleared', 'Restore'], ['Arrange queues mode / Phone column width', 'Already restored', '—'], ['Company time zone', 'UTC → Africa/Cairo', 'Keep Cairo (your instruction)']];
const count = k => tickets.filter(t => t.v === k).length;
const byFeat = {}; tickets.forEach(t => (byFeat[t.feat] = byFeat[t.feat] || []).push(t));

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Retest Round Report</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@500;700&family=Public+Sans:wght@400;600&family=JetBrains+Mono:wght@400&display=swap">
<style>
:root{--bg:#f6f7f9;--surface:#fff;--fg:#1c2330;--muted:#5b6577;--line:#dde1e8;--accent:#2456c9;--code-bg:#eef1f6;
--bug:#b4232a;--bug-bg:#fbe9ea;--warn:#8a5a00;--warn-bg:#fdf1d8;--ok:#19703e;--ok-bg:#e3f4ea;--info:#3d4a63;--info-bg:#e8ecf3;
--fd:"Schibsted Grotesk","Segoe UI",system-ui,sans-serif;--fb:"Public Sans","Segoe UI",system-ui,sans-serif;--fm:"JetBrains Mono",Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12161d;--surface:#1a2029;--fg:#e4e8ef;--muted:#9aa4b5;--line:#2c3442;--accent:#7ea2ff;--code-bg:#222a36;
--bug:#ff8a8f;--bug-bg:#3a1d21;--warn:#f2c35b;--warn-bg:#362a12;--ok:#6fd69a;--ok-bg:#16301f;--info:#b7c3da;--info-bg:#252e3d;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#12161d;--surface:#1a2029;--fg:#e4e8ef;--muted:#9aa4b5;--line:#2c3442;--accent:#7ea2ff;--code-bg:#222a36;
--bug:#ff8a8f;--bug-bg:#3a1d21;--warn:#f2c35b;--warn-bg:#362a12;--ok:#6fd69a;--ok-bg:#16301f;--info:#b7c3da;--info-bg:#252e3d;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 var(--fb)}
main{max-width:1040px;margin:0 auto;padding:32px 16px 64px}
h1,h2,h3{font-family:var(--fd);line-height:1.25;margin:0}h1{font-size:28px}h2{font-size:20px;margin:40px 0 12px}h3{font-size:17px}
.sub{color:var(--muted);margin:6px 0 0}code{font-family:var(--fm);font-size:13px;background:var(--code-bg);padding:1px 5px;border-radius:4px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:24px 0 0}
.stat{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px 14px}.stat b{display:block;font:700 26px var(--fd)}.stat span{color:var(--muted);font-size:13px}
.note{background:var(--info-bg);color:var(--fg);border-radius:8px;padding:12px 14px;margin:16px 0 0;font-size:14px}
table{width:100%;border-collapse:collapse;background:var(--surface);border:1px solid var(--line);border-radius:8px;overflow:hidden;font-size:14px}
th{text-align:left;font-weight:600;color:var(--muted);background:var(--code-bg);padding:8px 10px}td{padding:8px 10px;border-top:1px solid var(--line);vertical-align:top}
.wrap{overflow-x:auto}a{color:var(--accent)}
.pill{display:inline-block;font-size:12px;font-weight:600;padding:2px 9px;border-radius:999px;white-space:nowrap}
.ok{color:var(--ok);background:var(--ok-bg)}.dec{color:#6d28d9;background:#efe7ff}.warn{color:var(--warn);background:var(--warn-bg)}.bug{color:var(--bug);background:var(--bug-bg)}.info{color:var(--info);background:var(--info-bg)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:18px;margin:16px 0}
.card header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.card header .id{font:700 17px var(--fd)}.card header .t{flex:1;min-width:220px}
dl{display:grid;grid-template-columns:150px 1fr;gap:6px 14px;margin:14px 0}dt{color:var(--muted);font-size:13px}dd{margin:0}
@media (max-width:640px){dl{grid-template-columns:1fr}dt{margin-top:6px}}
details{margin-top:10px}summary{cursor:pointer;color:var(--accent);font-weight:600}
figure{margin:12px 0 0}figure img{width:100%;border:1px solid var(--line);border-radius:6px;cursor:zoom-in}figcaption{color:var(--muted);font-size:13px}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;overflow:auto;z-index:9;padding:16px}.lb img{width:100%;max-width:1600px;display:block;margin:0 auto}.lb.on{display:block}
ul{padding-left:20px}
</style></head><body><main>
<h1>Retest round — Ready For Test</h1>
<p class="sub">Assignee MahmoudMohamed · project NDC · module CRM · 18 Oct 2026 · staging-crm.taviportal.com (tenant NDC-Staging)</p>
<div class="stats">
<div class="stat"><b>15</b><span>Ready For Test tickets</span></div>
<div class="stat"><b>15</b><span>Retested</span></div>
<div class="stat"><b style="color:var(--ok)">${count('PASS') + count('NAB')}</b><span>Pass / not a bug</span></div>
<div class="stat"><b style="color:var(--warn)">${count('PARTIAL')}</b><span>Partial</span></div>
<div class="stat"><b style="color:var(--bug)">${count('FAIL')}</b><span>Fail</span></div>
<div class="stat"><b style="color:#7c3aed">${count('DEC')}</b><span>Needs your decision</span></div>
</div>
<p class="note"><b>Plane has not been changed.</b> The "Proposed action" column is what will be applied after your review. All 15 tickets are retested; the test data is still on staging and will be cleaned up in one pass after your review (see Cleanup).</p>

<h2>Results</h2>
<div class="wrap"><table><tr><th>#</th><th>Ticket</th><th>Priority</th><th>Feature</th><th>Verdict</th><th>Proposed action</th></tr>
${tickets.map(t => `<tr><td>${t.n}</td><td><a href="#${t.id}">${t.id}</a><br><span class="sub">${esc(t.title)}</span></td><td>${t.pri}</td><td>${t.feat}</td><td>${pill(t.v)}</td><td>${esc(t.action)}</td></tr>`).join('')}
${todo.map(r => `<tr><td>${r[0]}</td><td>${r[1]}<br><span class="sub">${esc(r[4])}</span></td><td>${r[2]}</td><td>${r[3]}</td><td>${pill('TODO')}</td><td>—</td></tr>`).join('')}
</table></div>

${Object.entries(byFeat).map(([f, ts]) => `<h2>CRM › ${f}</h2>` + ts.map(t => `<section class="card" id="${t.id}">
<header><span class="id">${t.id}</span><span class="t">${esc(t.title)}</span>${pill(t.v)}</header>
<dl><dt>Priority</dt><dd>${t.pri}</dd><dt>Developer said</dt><dd>${esc(t.dev)}</dd><dt>Retest result</dt><dd>${esc(t.summary)}</dd><dt>Proposed action</dt><dd>${esc(t.action)}</dd></dl>
${t.items ? `<div class="wrap"><table><tr><th>#</th><th>Item</th><th>Now</th><th>Result</th></tr>${t.items.map(i => `<tr><td>${i[0]}</td><td>${esc(i[1])}</td><td>${esc(i[2])}</td><td>${pill(i[3])}</td></tr>`).join('')}</table></div>` : ''}
<details${t.v === 'FAIL' || t.v === 'PARTIAL' ? ' open' : ''}><summary>Annotated evidence</summary>${[].concat(t.img).map(m => `<figure><img src="${img(m)}" alt="${t.id} annotated retest evidence"><figcaption>${m} — click to enlarge</figcaption></figure>`).join('')}</details>
</section>`).join('')).join('')}

<h2>Other observations (not filed)</h2>
<ul>${obs.map(o => `<li>${esc(o)}</li>`).join('')}</ul>

<h2>Cleanup (after the whole round)</h2>
<div class="wrap"><table><tr><th>Item</th><th>State now</th><th>Action</th></tr>${ledger.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table></div>

<h2>Method</h2>
<ul><li>No tagged automation existed for these tickets, so every retest was manual: browser (playwright-cli, Edge) plus API calls. Scripts are in <code>scripts/</code>.</li>
<li>Accounts: ndc-staging-owner (CRM Admin), test user 1 (User profile, no review permission, Company hidden).</li>
<li>Developer comments were verified before each retest. NDC-1819 and NDC-2096 were retested twice on request.</li>
<li>NDC-1234 was smoke-tested with a temporary approval process; NDC-2124 was run through the UI on 51 views as the developer asked.</li>
<li><b>Security note:</b> two secrets appeared in this session’s output by mistake — a Zoho password (first line of the Edge password export) and one single-use CRM refresh token (already rotated). Nothing was written to files or sent elsewhere.</li>
<li>Evidence: one annotated image per ticket (pass or fail). Originals are in <code>screenshots/raw/</code>.</li></ul>
</main>
<div class="lb" id="lb"><img alt=""></div>
<script>
const lb=document.getElementById('lb');document.querySelectorAll('figure img').forEach(i=>i.addEventListener('click',()=>{lb.firstElementChild.src=i.src;lb.classList.add('on')}));
lb.addEventListener('click',()=>lb.classList.remove('on'));document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});
</script></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('wrote report.html', Math.round(html.length / 1024) + ' KB');
