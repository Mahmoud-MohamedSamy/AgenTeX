// node make-wave-report.js <wave dir> <data.js> <out.html> — builds the review report for one wave from cases.md + results.md + a data file (bugs, gaps, notes).
const fs = require('fs'), path = require('path');
const [dir, dataFile, out] = process.argv.slice(2);
const D = require(path.resolve(dataFile));
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
const table = f => fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/).filter(l => /^\| W\d-\d+/.test(l)).map(l => l.split('|').slice(1, -1).map(x => x.trim()));
const cases = Object.fromEntries(table('cases.md').map(r => [r[0], r]));
const res = table('results.md');
const vclass = v => /^PASS/.test(v) ? 'pass' : /^FAIL/.test(v) ? 'fail' : /^INCONCLUSIVE/.test(v) ? 'inc' : 'nr';
const counts = res.reduce((m, r) => (m[vclass(r[1])]++, m), { pass: 0, fail: 0, inc: 0, nr: 0 });
const img = p => { try { return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64'); } catch (e) { return ''; } };
const rows = res.map(r => { const c = cases[r[0]] || []; return `<tr class="${vclass(r[1])}" data-v="${vclass(r[1])}"><td class="id">${r[0]}</td><td>${esc(c[1])}</td><td>${md(c[2])}</td><td>${md(c[3])}</td><td>${md(c[4])}</td><td><span class="v ${vclass(r[1])}">${esc(r[1])}</span></td><td>${md(r[2])}</td></tr>`; }).join('\n');
const bug = b => `<article class="card bug" id="${b.id}"><header><span class="tag">${b.id}</span><span class="sev ${b.sev.toLowerCase()}">${b.sev}</span><h3>${esc(b.title)}</h3></header>
<dl><dt>Cases</dt><dd>${esc(b.cases)}</dd><dt>Where</dt><dd>${md(b.where)}</dd></dl>
<h4>Steps</h4><ol>${b.steps.map(s => `<li>${md(s)}</li>`).join('')}</ol>
<div class="ea"><div><h4>Expected</h4><p>${md(b.expected)}</p></div><div><h4>Actual</h4><p>${md(b.actual)}</p></div></div>
${b.request ? `<h4>Request and response (from the run, ids shortened)</h4><pre>${esc(b.request)}</pre>` : ''}
<h4>Zoho Desk</h4><p>${md(b.zoho)}</p><h4>Evidence</h4><p>${md(b.evidence)}</p>${(b.images||[]).map(p => `<figure class="ev"><img src="${img(p)}" alt="${esc(b.id)} TAVI vs Zoho"></figure>`).join('')}${b.note ? `<p class="note">${md(b.note)}</p>` : ''}</article>`;
const list = a => `<ul>${a.map(x => `<li>${md(x)}</li>`).join('')}</ul>`;
const shots = (D.shots || []).map(s => `<figure><img src="${img(s.file)}" alt="${esc(s.alt)}"><figcaption>${md(s.caption)}</figcaption></figure>`).join('');
const X = D.rerun ? (() => {
  const t = fs.readFileSync(path.join(dir, D.rerun.file), 'utf8').split(/\r?\n/).filter(l => /^\| W\d-/.test(l)).map(l => l.split('|').slice(1, -1).map(x => x.trim()));
  const c = t.reduce((m, r) => (m[vclass(r[1])]++, m), { pass: 0, fail: 0, inc: 0, nr: 0 });
  const rr = t.map(r => { const cs = D.rerun.cases[r[0]] || cases[r[0]] || []; return `<tr data-v="${vclass(r[1])}"><td class="id">${r[0]}</td><td>${md(cs[2] || '')}</td><td><span class="v ${vclass(r[1])}">${esc(r[1])}</span></td><td>${md(r[2])}</td></tr>`; }).join('\n');
  return `<section><h2>${esc(D.rerun.title)}</h2><p class="meta">${md(D.rerun.meta)}</p><div class="strip"><div class="tile"><b>${t.length}</b><span>rows</span></div><div class="tile pass"><b>${c.pass}</b><span>pass</span></div><div class="tile fail"><b>${c.fail}</b><span>fail</span></div></div><div class="tbl"><table><thead><tr><th>Id</th><th>Screen / API</th><th>Verdict</th><th>Result</th></tr></thead><tbody>${rr}</tbody></table></div></section>`;
})() : '';
const html = `<title>${esc(D.title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,600&display=swap">
<style>
/* Layout: one reading column — verdict strip, decisions, bug drafts, gaps, full case register, cleanup. */
:root{--bg:#f6f7f9;--panel:#fff;--fg:#1b2230;--muted:#5d6676;--line:#dfe3ea;--accent:#2d5bd7;--code:#eef1f6;
--ok:#1f7a4d;--ok-bg:#e3f3ea;--warn:#9a6200;--warn-bg:#fbf0d9;--bad:#b4232c;--bad-bg:#fbe4e5;--grey-bg:#eceef2;
--display:"Fraunces",Georgia,serif;--body:"IBM Plex Sans",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12161d;--panel:#1a2029;--fg:#e4e8ef;--muted:#9aa3b2;--line:#2c3441;--accent:#7ea2ff;--code:#222a35;--ok:#6fd3a0;--ok-bg:#16352a;--warn:#f0bf63;--warn-bg:#3a2f16;--bad:#ff8f95;--bad-bg:#3d1c20;--grey-bg:#252c37;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#12161d;--panel:#1a2029;--fg:#e4e8ef;--muted:#9aa3b2;--line:#2c3441;--accent:#7ea2ff;--code:#222a35;--ok:#6fd3a0;--ok-bg:#16352a;--warn:#f0bf63;--warn-bg:#3a2f16;--bad:#ff8f95;--bad-bg:#3d1c20;--grey-bg:#252c37;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:15px/1.6 var(--body)}
.wrap{max-width:1180px;margin:0 auto;padding-block:28px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:26px}
h1{font:600 clamp(24px,3.4vw,34px)/1.15 var(--display);margin:0;text-wrap:balance}
h2{font:600 21px/1.3 var(--display);margin:0 0 10px;text-wrap:balance}
h3{font:600 16px/1.35 var(--body);margin:0}
h4{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:14px 0 4px}
p{margin:0 0 8px;max-width:85ch}.meta{color:var(--muted)}
code,pre{font-family:var(--mono);font-size:12.5px;background:var(--code);border-radius:4px}
code{padding:1px 4px}pre{padding:10px 12px;overflow-x:auto;white-space:pre-wrap;word-break:break-word;margin:0}
.strip{display:flex;flex-wrap:wrap;gap:10px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:10px 16px;display:grid;min-width:120px}
.tile b{font:500 24px var(--mono);font-variant-numeric:tabular-nums}.tile span{color:var(--muted);font-size:13px}
.tile.pass b{color:var(--ok)}.tile.fail b{color:var(--bad)}.tile.inc b{color:var(--warn)}
.box{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:16px 20px}
.box ul,.box ol,.card ol,.card ul{margin:0;padding-left:20px;display:grid;gap:5px}
.decide{border-left:4px solid var(--accent)}
.card{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:16px 20px}
.card header{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px}
.tag{font-family:var(--mono);font-size:13px;background:var(--grey-bg);border-radius:4px;padding:1px 7px}
.sev{font-size:12px;font-weight:600;border-radius:999px;padding:1px 9px}
.sev.medium{background:var(--warn-bg);color:var(--warn)}.sev.low{background:var(--grey-bg);color:var(--muted)}.sev.high{background:var(--bad-bg);color:var(--bad)}
dl{display:grid;grid-template-columns:max-content 1fr;gap:4px 14px;margin:0}dt{color:var(--muted);font-size:13px}dd{margin:0}
.ea{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.note{color:var(--muted);font-size:13.5px}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
figure{margin:0;background:var(--panel);border:1px solid var(--line);border-radius:8px;overflow:hidden}
figure img{display:block;width:100%}figcaption{padding:8px 12px;font-size:13px;color:var(--muted)}
.bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px}
.bar button{font:inherit;font-size:13px;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:999px;padding:4px 12px;cursor:pointer}
.bar button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--panel)}
.bar button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.tbl{overflow-x:auto;background:var(--panel);border:1px solid var(--line);border-radius:8px}
table{border-collapse:collapse;width:100%;min-width:1050px;font-size:13px}
th{text-align:left;font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);padding:8px 10px;background:var(--panel)}
td{border-bottom:1px solid var(--line);padding:8px 10px;vertical-align:top}td.id{font-family:var(--mono);white-space:nowrap}
.v{display:inline-block;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:500;white-space:nowrap}
.v.pass{background:var(--ok-bg);color:var(--ok)}.v.fail{background:var(--bad-bg);color:var(--bad)}.v.inc{background:var(--warn-bg);color:var(--warn)}.v.nr{background:var(--grey-bg);color:var(--muted)}
figure.ev{margin:12px 0 0}figure.ev img{display:block;width:100%;border:1px solid var(--line);border-radius:6px}
.gapdraft{border:1px dashed var(--line);border-radius:8px;padding:14px 18px;background:var(--bg)}
</style>
<div class="wrap">
<header><h1>${esc(D.heading)}</h1><p class="meta">${md(D.meta)}</p></header>
<div class="strip"><div class="tile"><b>${res.length}</b><span>cases</span></div><div class="tile pass"><b>${counts.pass}</b><span>pass</span></div><div class="tile fail"><b>${counts.fail}</b><span>fail</span></div><div class="tile inc"><b>${counts.inc}</b><span>inconclusive</span></div><div class="tile"><b>${counts.nr}</b><span>not run</span></div></div>
<section class="box decide"><h2>For your review</h2>${list(D.decisions)}</section>
<section><h2>Bug drafts (not filed)</h2><div class="grid2" style="grid-template-columns:1fr">${D.bugs.map(bug).join('')}</div></section>
${X}
<section class="box"><h2>Gaps against Zoho found in this wave</h2>${list(D.gaps)}</section>
<section class="box"><h2>Known Plane tickets</h2>${list(D.tickets)}</section>
<section class="box"><h2>Inconclusive and not run</h2>${list(D.inconclusive)}</section>
${shots ? `<section><h2>Screens</h2><div class="grid2">${shots}</div></section>` : ''}
<section><h2>All ${res.length} cases</h2>
<div class="bar" role="group" aria-label="Filter by verdict"><button aria-pressed="true" data-f="">All</button><button aria-pressed="false" data-f="fail">Fail ${counts.fail}</button><button aria-pressed="false" data-f="inc">Inconclusive ${counts.inc}</button><button aria-pressed="false" data-f="nr">Not run ${counts.nr}</button><button aria-pressed="false" data-f="pass">Pass ${counts.pass}</button></div>
<div class="tbl"><table><thead><tr><th>Id</th><th>Row</th><th>Screen / API</th><th>Steps</th><th>Expected</th><th>Verdict</th><th>Result</th></tr></thead><tbody id="tb">${rows}</tbody></table></div></section>
<section class="box"><h2>Test data and cleanup</h2>${list(D.cleanup)}</section>
${D.gapTicket ? `<section class="box"><h2>Draft go-live gap ticket (not filed)</h2><div class="gapdraft">${D.gapTicket}</div></section>` : ''}
</div>
<script>
const bs=[...document.querySelectorAll('.bar button')],trs=[...document.querySelectorAll('#tb tr')];
bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));const f=b.dataset.f;trs.forEach(t=>t.hidden=!!f&&t.dataset.v!==f);}));
</script>`;
fs.writeFileSync(out, html); console.log('written', out, JSON.stringify(counts));
