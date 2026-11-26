// Renders blueprint-issues-report.html from issues-data.js. Run: node make-issues-report.js
const fs = require('fs'); const path = require('path');
const MODE = process.argv[2] || 'issues'; const D = require(MODE === 'unfiled' ? './unfiled-data.js' : './issues-data.js'); const OUTNAME = MODE === 'unfiled' ? 'blueprint-unfiled-findings.html' : 'blueprint-issues-report.html';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const priCls = p => p === 'High' ? 'p-high' : p === 'Medium' ? 'p-med' : 'p-low';
const draft = (d, kind) => `<article class="item ${kind}" id="${esc(d.ids[0])}">
  <div class="item-h"><span class="ids">${d.ids.map(esc).join(' · ')}</span><span class="pill ${priCls(d.pri)}">${esc(d.pri)}</span>${d.rec ? `<span class="pill rec">${esc(d.rec)}</span>` : ''}</div>
  <h3>${esc(d.title)}</h3>
  <div class="cols">
    <div><h4>Steps</h4><ol>${d.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
    <div><h4>Expected</h4><p>${esc(d.expected)}</p><h4>Actual</h4><p>${esc(d.actual)}</p></div>
  </div>
  ${d.notes ? `<p class="note">${esc(d.notes)}</p>` : ''}
  ${d.evidence ? `<p class="sub">Evidence: ${esc(d.evidence)}</p>` : ''}
</article>`;
const partial = p => `<tr><td class="ids">${esc(p.id)}</td><td><b>${esc(p.title)}</b><div class="sub">Passed: ${esc(p.passed)}</div><div class="sub">Not covered: ${esc(p.missing)}</div></td><td>${p.bug ? `<span class="pill p-low">Issue</span> ${esc(p.issue)}${p.draft ? `<div class="sub">Draft: ${esc(p.draft)}</div>` : ''}` : `<span class="sub">${esc(p.issue)}</span>`}</td></tr>`;
const nFailCases = D.fails.reduce((a, d) => a + d.ids.length, 0);
const html = `<title>${MODE === 'unfiled' ? 'Desk Blueprint Unfiled Findings' : 'Desk Blueprint Regression Issues'}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
/* Layout: one 900px reading column; fail drafts, finding drafts, then a partials table. Same palette as the regression plan page. */
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
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:15px;line-height:1.55}
.wrap{max-width:900px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 56px;display:grid;gap:22px}
h1{font-size:24px;margin:0;letter-spacing:-.01em;text-wrap:balance}
h2{font-size:18px;margin:0;text-wrap:balance}
h3{font-size:16px;margin:4px 0 10px;text-wrap:balance}
h4{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:0 0 4px}
p{margin:0 0 10px;max-width:72ch}
ol{margin:0 0 10px;padding-left:20px}
li{margin:3px 0}
.sub{color:var(--muted);font-size:13px}
header{display:grid;gap:6px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.stat{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:10px 12px}
.stat b{display:block;font-size:22px;font-variant-numeric:tabular-nums}
.stat span{font-size:12px;color:var(--muted)}
section{display:grid;gap:12px}
.sec-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;border-bottom:2px solid var(--line);padding-bottom:6px}
.item{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--warn);border-radius:6px;padding:14px 16px;min-width:0}
.item.fail{border-left-color:var(--no)}
.item-h{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.ids{font-family:var(--mono);font-size:12px;color:var(--accent)}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.cols>div{min-width:0}
.note{background:var(--info-bg);color:var(--fg);border-radius:4px;padding:8px 10px;font-size:13px;margin-top:4px}
.pill{font-size:11px;padding:1px 8px;border-radius:10px;white-space:nowrap;font-weight:600}
.p-high{background:var(--no-bg);color:var(--no)}
.p-med{background:var(--warn-bg);color:var(--warn)}
.p-low{background:var(--accent-soft);color:var(--accent)}
.rec{background:var(--bg);color:var(--fg);border:1px solid var(--line);font-weight:500}
.scroll{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:14px;background:var(--surface);border:1px solid var(--line);border-radius:6px}
td,th{border-bottom:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}
th{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
code{font-family:var(--mono);font-size:12px}
@media (max-width:640px){.cols{grid-template-columns:1fr}}
</style>
<div class="wrap">
<header>
  <h1>${esc(D.title || 'Desk Blueprint regression — fails, findings and partials')}</h1>
  <div class="sub">${esc(D.intro || 'Run of 24 Nov 2026 on NDC-Staging (department QA BP Reg Dept, since removed). Drafts only — nothing is filed in Plane. Titles follow "Feature | Title"; priorities are suggestions.')}</div>
</header>
<div class="stats">
  ${D.fails.length ? `<div class="stat"><b>${D.fails.length}</b><span>bug drafts from ${nFailCases} failed cases</span></div>` : ''}
  <div class="stat"><b>${D.findings.length}</b><span>findings (${D.findings.reduce((a, d) => a + d.ids.length, 0)} cases)</span></div>
  ${D.partials.length ? `<div class="stat"><b>${D.partials.length}</b><span>partial cases (${D.partials.filter(p => p.bug).length} with an issue)</span></div>` : ''}
</div>
${D.fails.length ? `<section><div class="sec-h"><h2>Fail — bug drafts</h2><span class="sub">ready to file</span></div>${D.fails.map(d => draft(d, 'fail')).join('')}</section>` : ''}
<section><div class="sec-h"><h2>${MODE === 'unfiled' ? 'Drafts' : 'Findings — drafts to decide'}</h2><span class="sub">recommendation on each</span></div>${D.findings.map(d => draft(d, 'finding')).join('')}</section>
${D.partials.length ? `<section><div class="sec-h"><h2>Partial — what passed and what is left</h2><span class="sub">${D.partials.length} cases</span></div>
<div class="scroll"><table><thead><tr><th>Case</th><th>Coverage</th><th>Issue</th></tr></thead><tbody>${D.partials.map(partial).join('')}</tbody></table></div></section>` : ''}
<p class="sub">Full results on every case: regression plan page (artifact S214dEfyWD2d8fTL1tPwFD). Source: executions/execu_2026-11-24_desk-bp-regression/out/results.jsonl.</p>
</div>`;
fs.writeFileSync(path.join(__dirname, OUTNAME), html);
console.log('written', html.length);
