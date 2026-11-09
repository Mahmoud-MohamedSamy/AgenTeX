// Round 10 — final report for the whole case (2–3 Nov 2026): every ticket with its verdict and Plane state, blocked tickets, cleanup, environment, observations, security notes.
// Facts from ev-r10-data.js (verdicts + one-line results), notes-r10.md and ledger.md. Output: ../report-final.html (self-contained; images embedded on demand).
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..'); const E = require('./ev-r10-data.js');
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = f => { const p = path.join(RUN, 'screenshots', 'annotated', f); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null; };
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280' };
const PC = { urgent: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#2563eb' };
const PORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
const SPECIAL = { 'NDC-2387': 'Done (moved by someone else during the round; our PASS not posted)' };
const plane = (key, v) => SPECIAL[key] || (v === 'PASS' ? 'Done' : v === 'BLOCKED' ? 'Ready For Test (not moved)' : 'Bug');
const rows = META.map(m => { const n = m.key.slice(4); const e = E[n]; return { m, n, e, v: e ? e.verdict : '—', where: e && e.env ? 'NDC-Staging, 3 Nov' : 'Anyware, 2 Nov' }; })
  .sort((a, b) => (a.m.mod > b.m.mod ? 1 : a.m.mod < b.m.mod ? -1 : 0) || PORDER[a.m.pri] - PORDER[b.m.pri] || a.m.key.localeCompare(b.m.key));
const posted = rows.filter(r => r.e && !SPECIAL[r.m.key]);
const cnt = k => posted.filter(r => plane(r.m.key, r.v) === k).length;
const badge = (t, c) => `<span class="b" style="background:${c}">${esc(t)}</span>`;
const tr = r => { const src = r.e ? img(`${r.m.key}-retest-${r.v}.png`) : null;
  return `<tr><td>${esc(r.m.key)}</td><td>${badge(r.m.pri, PC[r.m.pri])}</td><td>${esc(r.m.mod === 'None' ? 'CRM (no module)' : r.m.mod)}</td><td>${esc(r.m.name)}</td><td>${badge(r.v, VC[r.v] || '#94a3b8')}</td><td>${esc(plane(r.m.key, r.v))}</td><td>${esc(r.where)}</td><td>${esc(r.e ? r.e.sum : '')}${src ? `<details><summary>evidence</summary><img src="${src}" alt=""></details>` : ''}</td></tr>`; };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest Round 10 — Final Report</title>
<style>:root{--bg:#f8fafc;--fg:#0f172a;--mut:#475569;--card:#fff;--bd:#e2e8f0}body{margin:0;font:14px/1.5 system-ui,Segoe UI,sans-serif;background:var(--bg);color:var(--fg)}main{max-width:1280px;margin:0 auto;padding:24px 16px}
h1{margin:0 0 4px}h2{margin:28px 0 10px}.mut{color:var(--mut)}.b{display:inline-block;color:#fff;border-radius:10px;padding:1px 9px;font-size:12px;font-weight:600;text-transform:uppercase;white-space:nowrap}
.sum{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.sum div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:120px}.sum b{font-size:22px;display:block}
table{border-collapse:collapse;width:100%;background:var(--card);font-size:13px}th,td{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:#f1f5f9;position:sticky;top:0}.wrap{overflow-x:auto}
ul{margin:6px 0 6px 20px}details summary{cursor:pointer;color:#2563eb}details img{max-width:900px;width:100%;border:1px solid var(--bd);border-radius:6px;margin-top:6px}.note{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px 14px}</style></head><body><main>
<h1>Retest round 10 — final report</h1>
<p class="mut">Mahmoud Mohamed · NDC · Ready For Test tickets of 2 Nov 2026 (59; NDC-2701 and NDC-2630 held by you) · retested 2 Nov on tenant <b>Anyware</b> and 3 Nov on <b>NDC-Staging</b> (your instruction) · report ${new Date().toISOString().slice(0, 10)}. Method: API + Edge (headless) screens; evidence = one annotated image per ticket, attached in Plane.</p>
<div class="sum"><div><b>${rows.filter(r => r.e).length}</b>retested</div><div><b style="color:${VC.PASS}">${cnt('Done')}</b>→ Done</div><div><b style="color:${VC.FAIL}">${cnt('Bug')}</b>→ Bug</div><div><b style="color:${VC.BLOCKED}">${cnt('Ready For Test (not moved)')}</b>blocked (not moved)</div><div><b>2</b>held by you</div><div><b>1</b>moved by others</div></div>
<h2>All tickets</h2><p class="mut">Grouped by module, then priority. Plane state = what this round posted (every posted ticket was read back: one retest comment + its image). Click "evidence" for the annotated image.</p>
<div class="wrap"><table><tr><th>Ticket</th><th>Priority</th><th>Module</th><th>Title</th><th>Verdict</th><th>Plane now</th><th>Tested on</th><th>Result</th></tr>${rows.map(tr).join('')}</table></div>
<h2>Blocked — left in Ready For Test</h2><ul>
<li><b>NDC-2661</b> — API passes; the screen check (no false "Permission denied." after Save) could not run: staging-desk stopped loading on 3 Nov.</li>
<li><b>NDC-2113</b> — needs a removed pick-list value (API refuses pick-list edits) and a Deals record without a stage.</li>
<li><b>NDC-2137</b> — load-time ticket; staging too slow for a fair measurement.</li></ul><p>Details: <code>report-blocked.html</code>.</p>
<h2>Cleanup</h2><ul>
<li><b>NDC-Staging (3 Nov): done and verified.</b> Deleted by exact id: 2 Desk calls (incl. the missed-call entry), 1 Desk contact, Desk module "QA RT r10 QC", CRM module "QA RT r10 1630"; the QA ticket was already gone (404 for every account, not in the bin) right after its contact was deleted; the NDC-2248 record was deleted forever during the test. Re-inventory: everything 404, no QA records or QA modules left. Recycle Bin not purged (1 contact + 2 calls, expire after 60 days).</li>
<li><b>CRM ⇄ Desk integration (NDC-Staging):</b> you disconnected it; I reconnected it for NDC-2399 — enabled, not paused, mapping contacts / accounts / deals as before.</li>
<li><b>Anyware-Staging: not cleaned</b> (your decision 3 Nov). The round-10 Anyware items stay as listed in <code>ledger.md</code>; test user 3 is still a Desk Agent and member of "QA WF Dept R". The Anyware owner now stops at a two-factor "Verify" step.</li>
<li>Local sign-in files and credential copies in the scratchpad deleted.</li></ul>
<h2>Environment problems that slowed the round</h2><ul>
<li>2 Nov: pages 60–90 s to render; metadata-engine outage; permission-service outage (503) that signed sessions out; saves timing out (504 after ~180 s).</li>
<li>3 Nov: local DNS for staging-desk dropped for ~2 min; staging-desk rendered blank pages; layout editor timed out.</li>
<li>One session per user: signing a user into Desk signs them out of CRM (and the reverse); shared accounts are also signed out by other people.</li>
<li>Two-factor rollout: ndc-staging-owner must set it up by 09/11/2026, the other NDC users by 10/11/2026 — scripted retests will need a code after that.</li>
<li>Claude Code's auto-mode safety check refused the integration Disconnect / Connect even after your OK — you did the Disconnect.</li></ul>
<h2>Observations (not filed)</h2><ul>
<li>Desk ticket History shows a raw row "BlueprintStateChanged · Detail Test Tickets From Mail &amp; Webform|entered|Open".</li>
<li>Desk quick-create dialog header says "Status changed to 'Escalate'" when the trigger field is not Status (NDC-2262 setup).</li>
<li>Desk Recycle Bin Module filter offers Parent Skill / Skill / Skill Category (configuration entities).</li>
<li>Desk visibility rule: while a required field is shown, the record API does not enforce Required (NDC-2231 setup).</li>
<li>Deleting a Desk contact removed its ticket for good (not in the Recycle Bin) — seen during cleanup; worth confirming.</li>
<li>NDC-2659 (Anyware): portal-access dispatch says "sent" while the access email failed (MAIL_SEND_FAILED).</li></ul>
<h2>Security notes</h2><div class="note"><ul>
<li><b>Credential exposure (my mistake, 3 Nov):</b> while checking <code>docs/Credentials/TAVI DESK Credentials.txt</code> (JSON) my masking failed and four plaintext passwords were printed into this session's tool output (ndc-staging-owner@taviportal.com, mahmoud.mohamed1@taviportal.com, mahmoud.mmohamedsamy@gmail.com, mahmoud.mahamed1515@gmail.com). Please change them.</li>
<li>Plane API token <code>secret-key-1793537440144.csv</code> (Downloads) — revoke it in Plane and delete the file when you're done.</li>
<li>No tokens or passwords were written to reports, comments or images; evidence was attached only through Plane's API (no public file host).</li></ul></div>
<h2>Files</h2><ul><li><code>notes-r10.md</code> — source of truth, ticket by ticket</li><li><code>ledger.md</code> — every QA item created and the cleanup</li><li><code>report-remaining.html</code>, <code>report-blocked.html</code> — interim reports</li><li><code>screenshots/annotated/</code> — evidence images; <code>screenshots/raw/</code> — originals</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report-final.html'), html);
console.log('report-final.html', Math.round(html.length / 1024 / 1024 * 10) / 10, 'MB', JSON.stringify({ done: cnt('Done'), bug: cnt('Bug'), blocked: cnt('Ready For Test (not moved)') }));
