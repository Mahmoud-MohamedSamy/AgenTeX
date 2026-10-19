// Builds the Plane change draft for review (19 Oct 2026): plane-draft.json (what will be posted) + plane-draft.html (preview).
// Usage: node scripts/make-plane-draft.js   — nothing is sent to Plane by this script.
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..'); const SP = path.join(__dirname, 'specs');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const spec = n => JSON.parse(fs.readFileSync(path.join(SP, n), 'utf8'));
const ENV = 'staging-crm.taviportal.com · tenant NDC-Staging (Africa/Cairo) · Edge';
const table = rows => '<table><tbody><tr><th><p>#</p></th><th><p>Check</p></th><th><p>Expected</p></th><th><p>Now</p></th><th><p>Result</p></th></tr>' +
  rows.map(r => '<tr>' + r.map((c, i) => `<td><p>${i === 4 && /FAIL|PARTIAL/.test(c) ? '<b>' + esc(c) + '</b>' : esc(c)}</p></td>`).join('') + '</tr>').join('') + '</tbody></table>';
const head = (t, d) => `<p><b>${esc(t)}</b> ${esc(ENV)} · ${esc(d)}.</p>`;
const ev = imgs => `<p>Evidence (annotated): ${imgs.map(esc).join(', ')}</p>`;
const P = [];
const done = (id, title, verdict, dev, rows, imgs, extra, specFile) => P.push({ id, title, to: 'Done', from: 'Ready For Test', imgs,
  comment: head(`Retest — ${verdict} → Done.`, specFile.date) + `<p><b>Developer's note checked first:</b> ${esc(dev)}</p>` + table(rows) + (extra ? `<p>${extra}</p>` : '') + ev(imgs) });
const T = [
  ['NDC-2095', 'Date-time today/yesterday/tomorrow use the UTC day instead of the tenant time zone', 'PASS', 'Not a code defect: the Org time zone was still UTC.', 'NDC-2095.json', 'Org time zone changed UTC → Africa/Cairo in Company Settings and kept (agreed).'],
  ['NDC-2096', 'A user without the review permission can filter by review_status through the views API', 'NOT A BUG (verified)', 'The review state is already on every record payload the user may read; the UI gate only controls the filter list.', 'NDC-2096.json', 'Retested twice. Optional hardening (reject the criterion server-side for users without review permission) is left to the developer.'],
  ['NDC-2097', 'A criterion on a field hidden from the viewer exposes its value in the view editor and the view API', 'PASS', 'Hidden-field values are withheld on read; the masked document cannot be saved back.', 'NDC-2097.json', 'Note: the value can still be inferred from the results — flagged by the developer as a product call.'],
  ['NDC-1787', 'Filter control is rendered only for My Open Activities', 'PASS', 'Shared filter seam; My Jobs excluded (needs its own design).', 'NDC-1787.json', 'My Jobs still has no filter, as stated by the developer.'],
  ['NDC-1821', 'Deleted records from Workqueue don\'t move to the recycle bin', 'PASS', 'Same delete endpoint as the module list; retest both paths.', 'NDC-1821.json', ''],
  ['NDC-1234', '[Epic] Approval Process — prevent endless re-entry & post-approval edits of sensitive fields', 'PASS', 'Held in Ready For Test only for 5 linked bugs (NDC-1645, 1646, 1652, 1672, 1697).', 'NDC-1234.json', 'All five linked bugs are Done; smoke-tested with a temporary process "QA RT ap" (removed after the run). Its 13 child stories are still in Backlog — housekeeping for the epic owner.'],
  ['NDC-1947', 'A user without "Manage Shared Views" cannot save a private view (only me view)', 'NOT A BUG (verified)', 'Only-me views need no permission; system views have no "Save to view" by design.', 'NDC-1947.json', 'A "save as new view" shortcut on All Leads would be a product decision, not part of this ticket.'],
  ['NDC-2100', 'View API accepts non-numeric Amount values and stores them as raw strings', 'PASS', 'Numeric criteria parsed and rewritten as numbers; anything else refused with 422.', 'NDC-2100.json', ''],
  ['NDC-2102', 'View API accepts an operator that does not fit the field type (Amount "contains" → 201)', 'PASS', 'Server-side operators-per-datatype table; mismatch refused with 422.', 'NDC-2102.json', ''],
];
for (const [id, title, verdict, dev, sf, extra] of T) { const s = spec(sf); done(id, title, verdict, dev, s.rows, [s.out], esc(extra), s); }
// NDC-2104 — decision + round 2
{ const s = spec('NDC-2104-r2.json'); P.splice(0, 0, { id: 'NDC-2104', title: s.title, to: 'Done', from: 'Ready For Test', imgs: ['NDC-2104-retest-PASS.png', 'NDC-2104-retest-DECISION.png'],
  comment: head('Decision + retest — PASS → Done.', '19 Oct 2026') + '<p><b>Decision (19 Oct):</b> keep the label <b>"Last Activity"</b>; its value is the record\'s last modified time. No rename, and the Zoho-style activity stamp is not part of this ticket (NDC-1868 P1-5).</p>' + table(s.rows) + ev(['NDC-2104-retest-PASS.png', 'NDC-2104-retest-DECISION.png']) }); }
// NDC-2098 — comment already posted 19 Oct 10:03; state only
P.splice(0, 0, { id: 'NDC-2098', title: '?view= with a deleted or foreign view ID falls back to the last-used view instead of All Leads', to: 'Bug', from: 'Ready For Test', imgs: ['NDC-2098-retest-DECISION.png'], comment: null, note: 'State change only. The decision comment ("fall back to All Records of the selected module") was posted on 19 Oct 10:03; it already says "moved to Bug". The evidence image will be attached.' });
// NDC-1819 — checklist + functional findings
{ const a = spec('NDC-1819.json'), f = spec('NDC-1819-f.json'), c = spec('NDC-1819-c.json');
  const fails = f.rows.filter(r => r[4] === 'FAIL');
  P.splice(0, 0, { id: 'NDC-1819', title: 'Workqueue Missings (Zoho-parity list, 13 items)', to: 'Bug', from: 'Ready For Test', imgs: ['NDC-1819-retest-PARTIAL.png', 'NDC-1819-functional-PARTIAL.png', 'NDC-1819-columns-PARTIAL.png'],
    comment: head('Retest — PARTIAL → moved to Bug.', '18–19 Oct 2026') +
      '<p><b>Developer\'s note checked first (14 Oct):</b> Category View fixed; filter items through NDC-1787/1788; items 3–11 listed as not done. Several of those have shipped since (table settings, resize, column menu, date periods, row actions).</p>' +
      '<h3>1. The 13-item checklist (retested twice, same result): 4 pass · 5 partial · 4 missing</h3>' + table(a.rows) +
      '<h3>2. Functional test of the newly delivered features (19 Oct)</h3><p>Works: sort from the column menu, Hide column (kept after reload), records per page (kept), drag-resize (kept) and Reset Column Size, Manage Columns search / Show / Hide, filter field search, row Edit / Delete / Add Note, and the periods Due today, Tomorrow, Next 7 days, This / Next week, This / Next month, On a specific date.</p>' + table(f.rows) +
      '<h3>3. Utility-column menus and column width limits (19 Oct)</h3>' + table(c.rows) +
      '<h3>4. New defects found</h3><ol>' +
      '<li><b>Locked column can be hidden but not shown again.</b> Full Name and Phone are locked in Manage Columns (Hide disabled), but their header menu still offers "Hide column". After hiding Phone that way, Show is disabled — only "Reset to default columns" brings it back, and the reset also hides Company.</li>' +
      '<li><b>Clip Text does not clip date cells.</b> In a narrowed Created At column the date breaks over 5 lines ("18/1 / 0/20 / 26 / 3:31 / PM") and the header overlaps the next one.</li>' +
      '<li><b>Activity periods disagree.</b> Overdue = 2, Today = 1, but Today &amp; Overdue = 110 (20 of them Completed); All open = 112, also with Completed tasks. Cause seen in the data: 110 of 118 tasks came from an Excel import and store due_date as text ("09/21/2026 11:00 AM"); bucket=overdue only reads ISO dates, the other buckets count the text ones and do not exclude Completed. The side-panel counts are blank for some periods.</li>' +
      '<li><b>Sort is not kept after a reload.</b></li>' +
      '<li><b>Utility columns have a no-op "Hide column" menu.</b> The ⋮ row-options column and Add Note (My Leads), and the ⋮ row-options column and Mark as completed (Tasks), each show a ≡ menu whose only option, Hide column, does nothing; the menu button has an empty name ("Column options: "). These columns should have no menu.</li>' +
      '<li><b>Header label collides with the ≡ icon at minimum width.</b> At the 105 px floor the icon overlaps "Full Name", "Lead Status", "Lead Owner", "Created At", "Company". Cell values are cut to "QA RT …" / "ndc-st…" (the full value is in the hover tooltip).</li>' +
      '<li><b>No maximum column width.</b> Full Name could be dragged to 2708 px and then 5204 px, pushing every other column off-screen (table 3707 px in a 1002 px viewport).</li></ol>' +
      '<p><b>Still open from the checklist:</b> items 1, 2, 5, 6 (missing) and the Pin / × / "Mark as completed" / step-1 parts of items 4, 7, 9, 10, 13. Suggest splitting these and the 7 defects above into child tickets.</p>' + ev(['NDC-1819-retest-PARTIAL.png', 'NDC-1819-functional-PARTIAL.png', 'NDC-1819-columns-PARTIAL.png']) }); }
// Already done today — attachments only
const ATT = [['NDC-1788', 'NDC-1788-retest-PARTIAL.png'], ['NDC-1789', 'NDC-1789-retest-FAIL.png'], ['NDC-2124', 'NDC-2124-retest-FAIL.png']];
const cleanup = [
  ['Leads "QA RT del-list 1821", "QA RT del-wq 1821"', 'Recycle Bin', 'Purge from the bin'],
  ['Leads "QA RT tz L1–L4" (L1 has a QA RT note, L2 an edited description)', 'Active', 'Delete, then purge'],
  ['Deals "QA RT amt 15000", "QA RT amt 1e9", "QA RT ap 1" (Approved, owned by test user 1)', 'Active', 'Delete, then purge'],
  ['Approval process "QA RT ap" (Deals)', 'Active', 'Deactivate, then delete'],
  ['Views: "QA RT review-gate" (test user 1), "QA RT k7", "QA RT tz-day", "QA RT private-user2" (test user 2), 7 × "QA RT amt / op …" (Deals), 51 × "QA RT ov-01…51"', 'Active', 'Delete, then purge'],
  ['ndc-staging-owner Leads list-preferences (51 column overrides)', 'Changed', 'Restore the backup in v2124-setup.json (viewColumns empty)'],
  ['Test user 2 Leads list-preferences (column hidden on All Leads)', 'Changed', '"Use the view\'s columns"'],
  ['Work Queue → Tasks filter "Priority equals highest" (existed before the run)', 'Cleared', 'Restore'],
  ['My Leads columns / rows per page / widths / Wrap-Clip (1819 functional pass)', 'Already restored 19 Oct', '—'],
  ['Company time zone', 'UTC → Africa/Cairo', 'Keep Cairo (your instruction)'],
  ['Session state / scratch files', 'Local', 'Delete the saved browser state files; keep scripts and evidence'],
];
fs.writeFileSync(path.join(RUN, 'plane-draft.json'), JSON.stringify({ changes: P, attachOnly: ATT, cleanup }, null, 1));
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots/annotated', n)).toString('base64');
const card = c => `<section class="card"><header><span class="id">${c.id}</span> <span class="t">${esc(c.title)}</span><span class="st"><span class="s rft">${c.from}</span> → <span class="s ${c.to === 'Done' ? 'done' : 'bug'}">${c.to}</span></span></header>
${c.comment ? `<div class="lbl">New comment</div><div class="comment">${c.comment}</div>` : `<p class="note">${esc(c.note)}</p>`}
<div class="lbl">Attachments (${c.imgs.length})</div><div class="imgs">${c.imgs.map(n => `<figure><img src="${img(n)}" alt="${n}"><figcaption>${n}</figcaption></figure>`).join('')}</div></section>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plane Change Draft</title><style>
:root{--bg:#f5f6f8;--fg:#1d2330;--mut:#5b6476;--card:#fff;--bd:#dfe3ea;--ok:#127a3a;--okb:#e3f5ea;--bug:#b42318;--bugb:#fde8e6;--rft:#8a5a00;--rftb:#fff2d6}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#14171d;--fg:#e6e9ef;--mut:#9aa3b5;--card:#1c2028;--bd:#2c3240;--okb:#16351f;--bugb:#3a1d1a;--rftb:#3a2e12;--ok:#5fd38a;--bug:#ff8a7a;--rft:#f3c35b}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,Segoe UI,sans-serif}main{max-width:1100px;margin:auto;padding:24px 16px}
h1{font-size:22px;margin:0 0 4px}.sub{color:var(--mut);margin:0 0 20px}.card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:16px;margin:0 0 18px}
header{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px}.id{font-weight:700}.t{flex:1;min-width:200px}.s{padding:2px 8px;border-radius:999px;font-size:12px;font-weight:600}
.rft{background:var(--rftb);color:var(--rft)}.done{background:var(--okb);color:var(--ok)}.bug{background:var(--bugb);color:var(--bug)}
.lbl{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mut);margin:12px 0 6px}.comment{border:1px solid var(--bd);border-radius:8px;padding:10px 14px;overflow-x:auto}
.comment table{border-collapse:collapse;width:100%;font-size:13px}.comment td,.comment th{border:1px solid var(--bd);padding:4px 6px;vertical-align:top;text-align:left}.comment p{margin:4px 0}.comment h3{font-size:14px;margin:12px 0 6px}
.imgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}figure{margin:0}figure img{width:100%;border:1px solid var(--bd);border-radius:6px;cursor:zoom-in}figcaption{font-size:12px;color:var(--mut)}
.note{color:var(--mut)}table.plain{border-collapse:collapse;width:100%}table.plain td,table.plain th{border:1px solid var(--bd);padding:6px;text-align:left;vertical-align:top}.warn{background:var(--rftb);color:var(--fg);border-radius:8px;padding:10px 14px}
</style></head><body><main><h1>Plane change draft — retest round 18–19 Oct 2026</h1><p class="sub">Nothing below has been sent yet. ${P.length} tickets change state; 3 tickets already moved today only get their evidence attached; then cleanup.</p>
<p class="warn"><b>Evidence attachments:</b> Plane only takes files from a public URL, and the temporary upload host was blocked by auto mode earlier. To attach these images either allow uploads to litterbox.catbox.moe (files expire after 1 hour), or I post the comments and you drag the images in from <code>screenshots/annotated/</code>.</p>
<h2>Summary</h2><table class="plain"><tr><th>Ticket</th><th>State</th><th>Comment</th><th>Attachments</th></tr>${P.map(c => `<tr><td>${c.id}</td><td>${c.from} → <b>${c.to}</b></td><td>${c.comment ? 'New' : 'Already posted'}</td><td>${c.imgs.length}</td></tr>`).join('')}${ATT.map(a => `<tr><td>${a[0]}</td><td>Already Bug</td><td>Already posted</td><td>1 (${a[1]})</td></tr>`).join('')}</table>
<h2>Changes per ticket</h2>${P.map(card).join('')}
<h2>Evidence for tickets already moved (attach only)</h2><div class="imgs">${ATT.map(a => `<figure><img src="${img(a[1])}" alt="${a[1]}"><figcaption>${a[0]} — ${a[1]}</figcaption></figure>`).join('')}</div>
<h2>Cleanup plan (staging-crm, after the Plane updates)</h2><table class="plain"><tr><th>Item</th><th>Now</th><th>Action</th></tr>${cleanup.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table>
</main><script>document.querySelectorAll('figure img').forEach(i=>i.onclick=()=>window.open().document.write('<img src="'+i.src+'" style="max-width:100%">'))</script></body></html>`;
fs.writeFileSync(path.join(RUN, 'plane-draft.html'), html);
console.log('wrote plane-draft.html + plane-draft.json:', P.map(c => c.id + '→' + c.to).join(', '));
