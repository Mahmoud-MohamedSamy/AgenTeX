// Builds a self-contained report (annotated images embedded) for one batch of the 21 Oct 2026 retest round.
// Usage: node scripts/make-report-html.js <results.json> <out.html>
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const [src, out] = process.argv.slice(2);
const R = JSON.parse(fs.readFileSync(path.join(RUN, src), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots/annotated', n)).toString('base64');
const V = { PASS: ['ok', 'Pass'], 'NOT A BUG': ['ok', 'Not a bug'], PARTIAL: ['warn', 'Partial'], FAIL: ['bug', 'Fail'], BLOCKED: ['info', 'Blocked'], DECISION: ['dec', 'Needs decision'] };
const ACT = { PASS: 'Done + comment + image', 'NOT A BUG': 'Done + comment + image', PARTIAL: 'Bug + comment + image', FAIL: 'Bug + comment + image', BLOCKED: 'Comment only', DECISION: 'Your decision' };
const pill = k => `<span class="pill ${V[k][0]}">${V[k][1]}</span>`;
const PRI = ['Urgent', 'High', 'Medium', 'Low', 'None'];
const T = [...R.tickets].sort((a, b) => PRI.indexOf(a.pri) - PRI.indexOf(b.pri));
const count = k => T.filter(t => t.v === k).length;
const ledger = fs.existsSync(path.join(RUN, 'ledger.md')) ? fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8') : '';
const ledgerRows = ledger.split(/\r?\n/).filter(l => /^\|/.test(l) && !/^\|\s*-/.test(l)).slice(1).map(l => l.split('|').slice(1, -1).map(c => c.trim()));

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(R.batch)} Retest Report</title><style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#111827;--mute:#6b7280;--line:#e5e7eb;--ok:#16a34a;--bug:#dc2626;--warn:#d97706;--info:#2563eb;--dec:#7c3aed}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b1020;--card:#121a2e;--ink:#e5e7eb;--mute:#9ca3af;--line:#243049}}
:root[data-theme="dark"]{--bg:#0b1020;--card:#121a2e;--ink:#e5e7eb;--mute:#9ca3af;--line:#243049}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 "Segoe UI",system-ui,sans-serif}
main{max-width:1240px;margin:0 auto;padding:24px 16px 64px}h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px}h3{margin:0;font-size:17px}
.sub{color:var(--mute);margin:0 0 18px}.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px}.kpi b{display:block;font-size:28px}.kpi span{color:var(--mute);font-size:13px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}
th,td{padding:9px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;font-size:14px}th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mute)}
.tw{overflow-x:auto}.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;color:#fff;white-space:nowrap}
.pill.ok{background:var(--ok)}.pill.bug{background:var(--bug)}.pill.warn{background:var(--warn)}.pill.info{background:var(--info)}.pill.dec{background:var(--dec)}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin:16px 0}.card header{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.meta{color:var(--mute);font-size:13px}.card p{margin:8px 0}.card ul{margin:6px 0 6px 18px;padding:0}.card img{width:100%;border:1px solid var(--line);border-radius:10px;margin-top:10px}
details summary{cursor:pointer;color:var(--info);margin-top:8px}code{font-size:13px}a{color:var(--info)}
</style></head><body><main>
<h1>${esc(R.title)}</h1><p class="sub">${esc(R.date)} · ${esc(R.env)}</p>
<div class="kpis"><div class="kpi"><b>${T.length}</b><span>tickets retested</span></div><div class="kpi"><b style="color:var(--ok)">${count('PASS') + count('NOT A BUG')}</b><span>pass → Done</span></div>
<div class="kpi"><b style="color:var(--bug)">${count('FAIL')}</b><span>fail → Bug</span></div><div class="kpi"><b style="color:var(--warn)">${count('PARTIAL')}</b><span>partial → Bug</span></div>
<div class="kpi"><b style="color:var(--info)">${count('BLOCKED')}</b><span>blocked</span></div><div class="kpi"><b style="color:var(--bug)">${R.observations.filter(o => o[0] === 'New defect').length}</b><span>new defect candidates</span></div></div>
<p class="sub" style="margin-top:14px">${esc(R.devNote)}</p>
<h2>Results</h2><div class="tw"><table><thead><tr><th>#</th><th>Ticket</th><th>Priority</th><th>Feature</th><th>Title</th><th>Verdict</th><th>Proposed Plane action</th></tr></thead><tbody>
${T.map((t, i) => `<tr><td>${i + 1}</td><td><a href="#${t.id}">${t.id}</a></td><td>${t.pri}</td><td>${esc(t.feat)}</td><td>${esc(t.title)}</td><td>${pill(t.v)}</td><td>${ACT[t.v]}</td></tr>`).join('')}
</tbody></table></div>
<h2>Tickets</h2>
${T.map(t => `<section class="card" id="${t.id}"><header>${pill(t.v)}<h3>${t.id} — ${esc(t.title)}</h3></header><div class="meta">${t.pri} · ${esc(t.feat)}</div>
<p><b>Developer said:</b> ${esc(t.dev)}<br><b>Did it hold:</b> ${esc(t.devHeld)}</p><p><b>Retest:</b> ${esc(t.summary)}</p>
${t.still ? `<p><b>Still failing:</b></p><ul>${t.still.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
${(t.img || []).map(n => `<img loading="lazy" alt="${esc(n)}" src="${img(n)}">`).join('')}</section>`).join('')}
<h2>Observations and new defect candidates</h2><p class="sub">Not part of the retested tickets. Nothing is filed in Plane unless you ask.</p>
<div class="tw"><table><thead><tr><th>Type</th><th>What</th><th>Detail</th></tr></thead><tbody>${R.observations.map(o => `<tr><td>${esc(o[0])}</td><td>${esc(o[1])}</td><td>${esc(o[2])}</td></tr>`).join('')}</tbody></table></div>
<h2>Test data ledger (cleanup after the whole round)</h2><div class="tw"><table><thead><tr><th>Ticket</th><th>Kind</th><th>Id</th><th>Name / change</th><th>Cleanup</th></tr></thead><tbody>
${ledgerRows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
<h2>Security notes</h2><ul><li>Passwords were read from the local credentials CSV and never printed; bearer tokens and JWTs are redacted in all logs.</li><li>No /iam/auth traffic was captured. Session state files live in the session scratchpad and are deleted at cleanup.</li><li>Evidence stays local until you approve the Plane draft; attachments then go through Plane's own API (private).</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, out), html); console.log('wrote', out, Math.round(html.length / 1024) + ' KB');
