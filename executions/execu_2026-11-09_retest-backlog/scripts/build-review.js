const fs=require('fs'),path=require('path');const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog';
const posted=JSON.parse(fs.readFileSync(path.join(R,'plane-draft.json'),'utf8'))['NDC-2174'].comment_html; // identical to the read-back of comment 122ff5ef (checked 9 Nov)
const img='data:image/png;base64,'+fs.readFileSync(path.join(R,'evidence/annotated/NDC-2174-retest-PARTIAL.png')).toString('base64');
const rows=[
['10','Statuses per department','Department + layout picker; "Use only the statuses picked below"; saved','PASS'],
['10','Only picked statuses usable','Ticket page + new-ticket form show Open / Escalated / Closed only; API refuses On Hold (422)','PASS'],
['10','Default status on new ticket','Default Escalated not applied: form shows "Select"; API says "Status is required."','FAIL'],
['6','Pick-list tools','Bulk add (duplicate skipped), Sort A–Z, Replace, Clear all; order saved; unknown value refused','PASS'],
['7','Rounding','Round off, 2 places: 12.345→12.35, 7.3449→7.34, 1.005→1.01','PASS'],
['8','Lookup options','Filter "Email contains qa.webform" → picker shows only 5 matching contacts (API not filtered)','PASS'],
['12','Default value','Pre-filled on form; stored when empty; typed value kept','PASS']];
const C={PASS:'#1a7f37',FAIL:'#c62828'};
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NDC-2174 Retest Review</title><style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d1d1f;--mut:#5b6170;--line:#e3e6eb;--warnbg:#fff7e6;--warnln:#f0b429}
@media (prefers-color-scheme:dark){:root{--bg:#15171b;--card:#1e2127;--ink:#e8eaed;--mut:#a0a6b1;--line:#30343c;--warnbg:#2b2416;--warnln:#b7862a}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Segoe UI",Arial,sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px}
h1{font-size:24px;margin:0 0 4px}.sub{color:var(--mut);margin-bottom:16px}section{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:20px;margin-bottom:20px;overflow-x:auto}
h2{margin:0 0 10px;font-size:18px}.warn{background:var(--warnbg);border:1px solid var(--warnln);border-radius:8px;padding:12px 16px;margin-bottom:20px}
table{border-collapse:collapse;width:100%}td,th{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}th{background:rgba(127,127,127,.08)}
.comment{border-left:4px solid #3b82f6;padding:4px 16px;background:rgba(59,130,246,.06);border-radius:4px}img{max-width:100%;border:1px solid var(--line);border-radius:6px}
.kv td:first-child{color:var(--mut);width:180px}.b{font-weight:700}ol li{margin:4px 0}
</style></head><body><main>
<h1>NDC-2174 retest — review</h1><div class="sub">Modules and Fields Missings · retest 9 Nov 2026 · NDC-Staging</div>
<div class="warn"><b>Already posted.</b> This comment and image went on NDC-2174 on 9 Nov 2026 at 14:02 (Cairo), before this review was asked for. What you see below is read back from Plane. If anything needs changing, I can edit the comment in place, delete it, or remove the image.</div>
<section><h2>Ticket</h2><table class="kv"><tr><td>Ticket</td><td>NDC-2174 — Modules and Fields Missings</td></tr><tr><td>State</td><td>Backlog (unchanged)</td></tr><tr><td>Priority</td><td>Urgent</td></tr><tr><td>Result</td><td class="b" style="color:#b35900">PARTIAL — 6 of 7 checks pass</td></tr><tr><td>Comment id</td><td><code>122ff5ef-4585-4845-a4dd-dd5518e7df89</code></td></tr><tr><td>Attachment</td><td>NDC-2174-retest-PARTIAL.png (611 KB). The 3 Nov image has the same name; this one is the newer, larger file.</td></tr></table></section>
<section><h2>Results by item</h2><table><tr><th>Item</th><th>Check</th><th>What happened</th><th>Result</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="b" style="color:${C[r[3]]}">${r[3]}</td></tr>`).join('')}</table></section>
<section><h2>Comment as posted</h2><div class="comment">${posted}</div></section>
<section><h2>Attached evidence image</h2><img src="${img}" alt="NDC-2174 annotated evidence, TAVI vs Zoho"></section>
<section><h2>How it was tested</h2><ol><li>Created a throwaway department "QA RT9 2174 Dept" and a ticket layout used only by it.</li><li>On the Ticket Status page, limited that layout to Open, Escalated and Closed, default Escalated.</li><li>Created tickets by API and opened the ticket page and new-ticket form to check the status list and the default.</li><li>Added four throwaway fields (decimal, single line, pick list, lookup to Contacts), set Round off, a default value, bulk-added and sorted values, and a lookup filter in the layout editor, then saved.</li><li>Created tickets to check rounding, the default value, pick-list values and the lookup picker.</li><li>Deleted everything afterwards (department, layout, 4 fields, 7 tickets) and purged the tickets from the Recycle Bin.</li></ol>
<p class="sub">Zoho side of the image: Ticket Status and Edit Field screenshots plus help-page text from the 5 Oct intake (not re-captured today). Not tested: "what happens to a ticket moved onto it" (fallback to default).</p></section>
</main></body></html>`;
fs.writeFileSync(path.join(R,'review-NDC-2174.html'),html);console.log('ok',html.length);
