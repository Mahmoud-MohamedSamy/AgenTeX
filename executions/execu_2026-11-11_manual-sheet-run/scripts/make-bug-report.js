// Builds bug-report.html (self-contained, images embedded) from bugs.js + evidence/annotated.
const fs=require('fs'),path=require('path');const D=path.join(__dirname,'..');const bugs=require('./bugs');
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const img=b=>{const f=path.join(D,'evidence/annotated',b.id+'-'+b.cases.split(/[ ,]/)[0]+'-FAIL.png');return fs.existsSync(f)?'data:image/png;base64,'+fs.readFileSync(f).toString('base64'):null;};
const sevOrder={High:0,Medium:1,Low:2};const list=[...bugs].sort((a,b)=>sevOrder[a.sev]-sevOrder[b.sev]||a.id.localeCompare(b.id));
const cnt=s=>bugs.filter(b=>b.sev===s).length;
const html=`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Desk Sheet Run Bugs</title>
<style>
:root{--bg:#f4f6f8;--panel:#fff;--ink:#16202b;--mute:#5b6876;--line:#dde3e9;--accent:#1f5fa8;--hi:#b3261e;--hibg:#fbe4e2;--med:#8a5a00;--medbg:#fbf0d6;--lo:#3d5a80;--lobg:#e6eef7}
@media (prefers-color-scheme:dark){:root{--bg:#11161c;--panel:#18202a;--ink:#e3e9ef;--mute:#9aa7b4;--line:#2a3542;--accent:#7fb0ea;--hi:#f19b94;--hibg:#3b1a18;--med:#efc56d;--medbg:#382c12;--lo:#9cc1ea;--lobg:#1e2a38;color-scheme:dark}}
body{margin:0;background:var(--bg);color:var(--ink);font:14.5px/1.5 "Segoe UI",system-ui,sans-serif}
.w{max-width:1180px;margin:0 auto;padding:24px 16px 60px}h1{font-size:24px;margin:0}h2{font-size:17px;margin:28px 0 10px}
.sub{color:var(--mute);max-width:85ch}.note{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:6px;padding:10px 14px;margin:14px 0;font-size:13.5px}
.k{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.k div{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:8px 14px}.k b{font-size:22px;display:block}
table{border-collapse:collapse;width:100%;background:var(--panel);font-size:13.5px}td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}th{color:var(--mute);font-weight:600}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:6px}
.sev{display:inline-block;font-weight:600;font-size:12px;padding:1px 8px;border-radius:9px}.High{background:var(--hibg);color:var(--hi)}.Medium{background:var(--medbg);color:var(--med)}.Low{background:var(--lobg);color:var(--lo)}
.bug{background:var(--panel);border:1px solid var(--line);border-radius:8px;margin:18px 0;padding:14px 18px}
.bug h3{margin:0 0 4px;font-size:17px}.meta{color:var(--mute);font-size:13px;margin-bottom:8px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.grid>div{min-width:0}@media(max-width:760px){.grid{grid-template-columns:1fr}}
.lab{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);font-weight:600;margin-top:8px}
ol{margin:4px 0;padding-left:20px}.ev{margin-top:10px}.ev img{width:100%;border:1px solid var(--line);border-radius:6px}
.card{background:var(--bg);border:1px dashed var(--line);border-radius:6px;padding:8px 12px;font-family:Consolas,ui-monospace,monospace;font-size:12.5px;overflow-wrap:anywhere}
a{color:var(--accent)}
</style></head><body><div class="w">
<h1>TAVI Desk — bugs found in the manual-sheet run (draft)</h1>
<p class="sub">Run on NDC-Staging (staging-desk.taviportal.com), 11 Nov 2026, while executing the 711-case manual test sheet. ${bugs.length} draft bugs from ${new Set(bugs.flatMap(b=>b.cases.split(/,\s*/))).size} sheet cases/observations. Not filed in Plane. Test data was deleted and purged after each feature.</p>
<div class="k"><div><b>${bugs.length}</b>draft bugs</div><div><b style="color:var(--hi)">${cnt('High')}</b>High</div><div><b style="color:var(--med)">${cnt('Medium')}</b>Medium</div><div><b style="color:var(--lo)">${cnt('Low')}</b>Low</div><div><b>${bugs.filter(b=>b.panels).length}</b>with annotated screenshots</div></div>
<div class="note"><b>Evidence status:</b> each image shows the TAVI screen with numbered boxes and, on the right, the expected behaviour from the test sheet. <b>Zoho Desk has not been captured yet</b>, so no Zoho behaviour is claimed here. Bugs without a usable screenshot have a data card (API / email facts). Severity is a suggestion.</div>
<h2>Summary</h2><div class="tw"><table><tr><th>ID</th><th>Severity</th><th>Bug</th><th>Area</th><th>Sheet case</th></tr>
${list.map(b=>`<tr><td><a href="#${b.id}">${b.id}</a></td><td><span class="sev ${b.sev}">${b.sev}</span></td><td>${esc(b.title)}</td><td>${esc(b.area)}</td><td>${esc(b.cases)}</td></tr>`).join('')}</table></div>
<h2>Details</h2>
${list.map(b=>{const im=img(b);return `<section class="bug" id="${b.id}"><h3>${b.id} · ${esc(b.title)}</h3><div class="meta"><span class="sev ${b.sev}">${b.sev}</span> · ${esc(b.area)} · sheet case ${esc(b.cases)} · environment NDC-Staging, Edge</div>
<div class="grid"><div><div class="lab">Steps to reproduce</div><ol>${b.steps.map(s=>'<li>'+esc(s)+'</li>').join('')}</ol></div><div><div class="lab">Expected</div><div>${esc(b.expected)}</div><div class="lab">Actual</div><div>${esc(b.actual)}</div></div></div>
<div class="ev"><div class="lab">Evidence</div>${im?`<img src="${im}" alt="Annotated evidence for ${b.id}">`:`<div class="card">${esc(b.card||'—')}</div>`}</div></section>`;}).join('')}
<p class="sub">Generated ${new Date().toISOString().slice(0,16).replace('T',' ')} UTC from scripts/bugs.js. Source results: results.json / results page artifact SUde9e6vD7FJnZFu4djZAp.</p>
</div></body></html>`;
fs.writeFileSync(path.join(D,'bug-report.html'),html);console.log((html.length/1048576).toFixed(1)+' MB');
