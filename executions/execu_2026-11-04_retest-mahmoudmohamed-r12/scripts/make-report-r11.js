// Round 11 report (3 Nov 2026, NDC-Staging): results, the Plane draft (exact comments from plane-draft.json, made by post-r11.js --dry), evidence, cleanup plan, security notes.
// Facts from ev-r11-data.js, notes-r11.md and ledger.md. Output: ../report.html (self-contained, images embedded).
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..'); const E = require('./ev-r11-data.js');
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const DRAFT = JSON.parse(fs.readFileSync(path.join(RUN, 'plane-draft.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = f => { const p = path.join(RUN, 'screenshots', 'annotated', f); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null; };
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280' };
const PC = { urgent: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#2563eb' };
const PO = { urgent: 0, high: 1, medium: 2, low: 3 };
const ACTION = { PASS: '→ Done + comment + image', FAIL: '→ Bug + comment + image', BLOCKED: 'comment + image only (stays in Ready For Test)' };
const rows = META.map(m => ({ m, n: m.key.slice(4), e: E[m.key.slice(4)], d: DRAFT.find(x => x.key === m.key) }))
  .sort((a, b) => (a.m.mod > b.m.mod ? 1 : a.m.mod < b.m.mod ? -1 : 0) || PO[a.m.pri] - PO[b.m.pri] || a.m.key.localeCompare(b.m.key));
const cnt = v => rows.filter(r => r.e.verdict === v).length;
const badge = (t, c) => `<span class="b" style="background:${c}">${esc(t)}</span>`;
const tr = r => `<tr><td><a href="#t${r.n}">${r.m.key}</a></td><td>${badge(r.m.pri, PC[r.m.pri])}</td><td>${esc(r.m.mod)}</td><td>${esc(r.m.name)}</td><td>${badge(r.e.verdict, VC[r.e.verdict])}</td><td>${esc(r.e.sum)}</td><td>${esc(ACTION[r.e.verdict])}</td></tr>`;
const card = r => { const f = `${r.m.key}-retest-${r.e.verdict}.png`; const src = img(f);
  return `<section class="card" id="t${r.n}"><h3>${r.m.key} ${badge(r.m.pri, PC[r.m.pri])} ${badge(r.e.verdict, VC[r.e.verdict])}</h3><p class="t">${esc(r.m.name)}</p>
  <p><b>Plane action:</b> ${esc(ACTION[r.e.verdict])}</p><details open><summary>Comment exactly as it will be posted</summary><div class="cm">${r.d ? r.d.html : '<i>not in draft</i>'}</div></details>
  ${src ? `<details><summary>Annotated evidence — ${esc(f)}</summary><img src="${src}" alt="${esc(f)}"></details>` : ''}</section>`; };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest Round 11 Report</title>
<style>:root{--bg:#f8fafc;--fg:#0f172a;--mut:#475569;--card:#fff;--bd:#e2e8f0}body{margin:0;font:14px/1.5 system-ui,Segoe UI,sans-serif;background:var(--bg);color:var(--fg)}main{max-width:1240px;margin:0 auto;padding:24px 16px}
h1{margin:0 0 4px}h2{margin:28px 0 10px}.mut{color:var(--mut)}.b{display:inline-block;color:#fff;border-radius:10px;padding:1px 9px;font-size:12px;font-weight:600;text-transform:uppercase;white-space:nowrap}
.sum{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.sum div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:110px}.sum b{font-size:22px;display:block}
table{border-collapse:collapse;width:100%;background:var(--card);font-size:13px}th,td{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:#f1f5f9}.wrap{overflow-x:auto}
.card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:14px 16px;margin:14px 0}.card h3{margin:0 0 4px}.t{color:var(--mut);margin:0 0 8px}.cm{background:#f8fafc;border:1px solid var(--bd);border-radius:6px;padding:8px 12px;font-size:13px}
details summary{cursor:pointer;color:#2563eb;margin:6px 0}details img{max-width:100%;border:1px solid var(--bd);border-radius:6px;margin-top:6px}ul{margin:6px 0 6px 20px}.note{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:10px 14px}</style></head><body><main>
<h1>Retest round 11 — Ready For Test, Mahmoud Mohamed</h1>
<p class="mut">NDC · 18 tickets in Ready For Test on 3 Nov 2026 (14 Desk Blueprint / Business Hours bugs + NDC-2661, NDC-2701, NDC-2113, NDC-2137) · tenant <b>NDC-Staging</b> (staging-desk / staging-crm.taviportal.com) · Edge (headless) + API · owner ndc-staging-owner; Desk Administrator mahmoud.mahamed1515 · report ${new Date().toISOString().slice(0, 10)}. <b>Nothing has been posted to Plane yet</b> — this is the draft for your approval.</p>
<div class="sum"><div><b>18</b>retested</div><div><b style="color:${VC.PASS}">${cnt('PASS')}</b>pass → Done</div><div><b style="color:${VC.FAIL}">${cnt('FAIL')}</b>fail → Bug</div><div><b style="color:${VC.BLOCKED}">${cnt('BLOCKED')}</b>blocked (stays)</div></div>
<h2>Results and proposed Plane actions</h2><div class="wrap"><table><tr><th>Ticket</th><th>Priority</th><th>Module</th><th>Title</th><th>Verdict</th><th>Result</th><th>Plane action</th></tr>${rows.map(tr).join('')}</table></div>
<h2>Needs your decision</h2><ul>
<li><b>NDC-2764</b> (blocked): the Tickets module already has the maximum 50 workflow rules (all NDC setup, 48 created today), so a QA rule cannot be added. To finish it I need one free slot — e.g. you or the NDC team delete or free one rule, or tell me which one I may remove temporarily and restore.</li>
<li><b>NDC-2774</b> (fail): the developer's cache fix is not effective for the first seconds after a change (blueprint 6–17 s, SLA ≥ 17 s). Proposed: back to Bug.</li>
<li><b>NDC-2137</b> (fail): p95 12.5 s against 2 s. Staging was slow on first loads today (~40–80 s per fresh page), but the reloads measured had the app frame up in ~1 s, so the board itself takes p95 10.2 s. Proposed: back to Bug with that caveat.</li></ul>
<h2>Ticket details</h2>${rows.map(card).join('')}
<h2>Test data and cleanup plan (after the Plane update)</h2><p>Everything created is listed in <code>ledger.md</code> (prefix "QA RT11"):</p><ul>
<li>Desk: departments QA RT11 Dept A / Dept B; QA RT11 blueprints; QA RT11 tickets (incl. 2 in Customer Support for NDC-2661); SLA policy QA RT11 BH SLA.</li>
<li>CRM: leads QA RT11 2701 ×2, QA RT11 2113 ×3; deals QA RT11 2113 ×2; private Kanban views QA RT11 2113 ×2.</li>
<li>Already restored during the run (verified): default business hours 24×7 (×3), ticket Status values (42), Leads field B2C Lead Status (Interested, Pending), mahmoud.mahamed1515 profiles (Desk Administrator + Manager @ HR).</li>
<li>Cleanup = delete by exact id, re-inventory to zero, then Recycle Bin purge of QA RT11 items, and delete local sign-in files.</li></ul>
<h2>Environment notes</h2><ul>
<li>Sign-in page takes ~80 s to render; the username box lost its autocomplete attribute (helper adjusted).</li>
<li>The shared owner account was signed out once mid-run (someone else signed in); signed in again once.</li>
<li>Once a "You don't have access to Desk" page for mahmoud.mahamed1515 — transient (API showed its profiles unchanged, next load fine).</li>
<li>staging-crm once rendered a blank page / "Something went wrong" for ~3 min; recovered.</li>
<li>Two-factor: owner must set it up by 09/11/2026, others by 10/11/2026.</li></ul>
<h2>Security notes</h2><div class="note"><ul>
<li><b>My mistake (3 Nov):</b> while checking the layout of <code>docs/Credentials/TAVI Desk Credentials.csv</code>, my mask kept cells containing "@" — and the passwords contain "@", so the password column of 9 rows was printed into this session's tool output (the shared password of belopoy720, fedelav803, kinase5517, mahmoud.mohamed2, pacox68754, pobit51574, mahmoud.mohamed1, and the password of mahmoud.mahamed1515 and mahmoud.mmohamedsamy). Please change them. I now mask by column only.</li>
<li>No tokens or passwords are in this report, the comments or the images. Evidence goes to Plane only through Plane's API.</li>
<li>Plane token <code>secret-key-1793537440144.csv</code>: revoke it and delete the file when done.</li></ul></div>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('report.html', Math.round(html.length / 1024), 'KB');
