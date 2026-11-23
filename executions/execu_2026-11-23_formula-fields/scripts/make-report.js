// node make-report.js → ../report.html (self-contained). Source: ../PROGRESS.md tables + screenshots/annotated/*.png
const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..');
const md = fs.readFileSync(path.join(RUN, 'PROGRESS.md'), 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
// collect result rows from every table: | Case | Result | Note |
const rows = [];
for (const line of md.split('\n')) { const m = /^\| *([^|]+?) *\| *([^|]+?) *\| *(.*?) *\|$/.exec(line); if (!m || /^Case$|^---/.test(m[1])) continue; rows.push({ c: m[1], r: m[2], n: m[3] }); }
const kind = r => /^FAIL|FAIL \(/.test(r) && !/PASS/.test(r.split('/')[0]) ? 'fail' : /BLOCKED|NOT RUN|PARTIAL/.test(r) ? 'block' : /GAP/.test(r) ? 'gap' : /INFO|NOTE|DECISION|N\/A|NOT A GAP|covered/.test(r) ? 'info' : 'pass';
const cnt = { pass: 0, fail: 0, block: 0, gap: 0, info: 0 }; rows.forEach(x => cnt[x.k = kind(x.r)]++);
// annotated images
const AD = path.join(RUN, 'screenshots/annotated'); const imgs = fs.existsSync(AD) ? fs.readdirSync(AD).filter(f => f.endsWith('.png')).sort() : [];
const imgHtml = imgs.map(f => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(AD, f)).toString('base64')}" alt="${esc(f)}"><figcaption>${esc(f)}</figcaption></figure>`).join('');
const ledger = fs.existsSync(path.join(RUN, 'ledger.md')) ? fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8').trim().split('\n') : [];
const bugs = [
 ['High', 'Typing in the formula Expression box drops every space (CRM + Desk builder)', 'new (F01)'],
 ['High', 'Workflow field update and blueprint transition do not recalculate formulas (CRM + Desk Tickets)', 'H8, H9'],
 ['High', 'A field used by a formula can be deleted; formula silently wrong and can no longer be saved', 'K4'],
 ['Medium', 'Editing an expression / adding a formula does not update existing records', 'K1, H15'],
 ['Medium', 'Lookup, user and department fields give the record id, not the name', 'E20, E22, E23'],
 ['Medium', 'Desk assignment rules refuse formula fields in criteria', 'I8'],
 ['Medium', 'Multi-select, multi-select lookup, address and location read as empty', 'E17, E21, E24, E26'],
 ['Medium', 'Return type not enforced (number formula stores text, date formula stores a number)', 'B6, B7'],
 ['Medium', 'created_at / created_by blank in formulas on the first save', 'E30'],
 ['Low', 'text(date_time) gives UTC, not the org time zone', 'E19'],
 ['Low', 'min() counts a blank as 0 (avg skips blanks)', 'D8'],
 ['Low', 'Builder: no return type saved; raw server text for empty/broken expression; concat(,"a") not flagged; only first of two broken formulas named', 'B1, A7, G5, G13'],
 ['Low', 'Pick-list option rename silently breaks formulas; same-version layout saves both accepted; error text not linked for screen readers', 'K7, K11, M5'],
];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Formula fields — test run report, 23 Nov 2026</title><style>
:root{--bg:#fff;--fg:#1f2328;--mut:#59636e;--bd:#d1d9e0;--soft:#f6f8fa}@media(prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--mut:#9198a1;--bd:#3d444d;--soft:#151b23}}
body{font:14px/1.5 system-ui,"Segoe UI",sans-serif;background:var(--bg);color:var(--fg);max-width:1400px;margin:auto;padding:24px}h1{font-size:22px;margin:0}h2{font-size:17px;margin:28px 0 8px}.mut{color:var(--mut)}
.cards{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.card{border:1px solid var(--bd);border-radius:8px;padding:10px 14px;min-width:110px}.card b{font-size:22px;display:block}
table{border-collapse:collapse;width:100%}th,td{border:1px solid var(--bd);padding:5px 8px;text-align:left;vertical-align:top}th{background:var(--soft)}
.pill{display:inline-block;padding:0 8px;border-radius:10px;font-size:12px;color:#fff;white-space:nowrap}.pass{background:#16a34a}.fail{background:#dc2626}.block{background:#6b7280}.gap{background:#7c3aed}.info{background:#2563eb}
figure{margin:12px 0}figure img{max-width:100%;border:1px solid var(--bd);border-radius:6px}figcaption{font-size:12px;color:var(--mut)}code{font-family:ui-monospace,Consolas,monospace;font-size:12.5px}
select,input{font:inherit;padding:4px 8px;border:1px solid var(--bd);border-radius:6px;background:var(--bg);color:var(--fg)}</style></head><body>
<h1>Formula fields in a layout — test run report</h1>
<div class="mut">TAVI CRM + Desk · NDC-Staging · 23 Nov 2026 · plan docs/formula-fields (192 cases) · API cases run on both apps (identical results: one formula engine), screen cases on both where noted</div>
<div class="cards"><div class="card"><b>${rows.length}</b>result rows</div><div class="card"><b style="color:#16a34a">${cnt.pass}</b>pass</div><div class="card"><b style="color:#dc2626">${cnt.fail}</b>fail</div><div class="card"><b style="color:#7c3aed">${cnt.gap}</b>gap vs Zoho</div><div class="card"><b style="color:#6b7280">${cnt.block}</b>blocked / not run</div><div class="card"><b style="color:#2563eb">${cnt.info}</b>info</div></div>
<h2>Bugs to file (draft, not filed)</h2><table><tr><th>Priority</th><th>Bug</th><th>Cases</th></tr>${bugs.map(b => `<tr><td>${b[0]}</td><td>${esc(b[1])}</td><td>${b[2]}</td></tr>`).join('')}</table>
<h2>Evidence</h2>${imgHtml || '<p class="mut">No annotated images yet.</p>'}
<h2>All results</h2><p><select id="f"><option value="">All</option><option value="fail">Fail</option><option value="pass">Pass</option><option value="gap">Gap</option><option value="block">Blocked / not run</option><option value="info">Info</option></select> <input id="q" type="search" placeholder="Search"></p>
<table><thead><tr><th>Case</th><th>Result</th><th>Note</th></tr></thead><tbody id="tb">${rows.map(x => `<tr data-k="${x.k}"><td>${inline(x.c)}</td><td><span class="pill ${x.k}">${inline(x.r)}</span></td><td>${inline(x.n)}</td></tr>`).join('')}</tbody></table>
<h2>Test data ledger (to clean once at the end)</h2><ul>${ledger.map(l => `<li><code>${esc(l.replace(/^- /, ''))}</code></li>`).join('')}</ul>
<h2>Security notes</h2><ul><li>No passwords or tokens printed; sessions read from local state files only.</li><li>Six sign-ins in total: owner twice (one session lost to a stuck browser), CRM User, Desk Administrator, Desk Agent; one signed-out web form submit.</li><li>Live modules touched with QA FX items (user OK): Leads + Contacts (formula fields, 1 lead, 1 contact), Desk Tickets (4 formula fields, tickets, 1 blueprint, assignment rules). No email sent.</li><li>HTML/script in formula output rendered as text on record pages (L1).</li></ul>
<script>const f=document.getElementById('f'),q=document.getElementById('q');function r(){document.querySelectorAll('#tb tr').forEach(t=>{t.hidden=(f.value&&t.dataset.k!==f.value)||(q.value&&!t.innerText.toLowerCase().includes(q.value.toLowerCase()))})}f.oninput=r;q.oninput=r;</script>
</body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('report.html', rows.length, 'rows', JSON.stringify(cnt), 'images', imgs.length);
