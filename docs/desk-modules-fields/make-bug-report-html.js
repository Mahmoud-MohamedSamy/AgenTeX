// Builds desk-modules-fields-bug-report.html from desk-modules-fields-bug-report.md.
// Usage: node make-bug-report-html.js   (run from any folder)
// Evidence screenshots that exist on disk are embedded as base64, so the HTML works on its own.
const fs = require('fs'), path = require('path');
const DIR = __dirname, ROOT = path.resolve(DIR, '../..');
const RUNS = { 1: 'executions/execu_2026-10-05_18-05-01', 2: 'executions/execu_2026-10-06_23-09-45' };
const md = fs.readFileSync(path.join(DIR, 'desk-modules-fields-bug-report.md'), 'utf8');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

// Bugs: "### MF-xx — title" blocks
const bugs = [];
const blocks = md.split(/^### /m).slice(1);
for (const b of blocks) {
  const lines = b.split('\n'); const [id, ...t] = lines[0].split(' — '); const title = t.join(' — ').trim();
  const meta = lines.find(l => l.startsWith('**Severity:**')) || '';
  const sev = (meta.match(/Severity:\*\* (\w+)/) || [])[1], pri = (meta.match(/Priority:\*\* (\w+)/) || [])[1];
  const spec = (meta.match(/Spec rows?:\*\* ([^·]+)/) || [])[1].trim(), run = +(meta.match(/Run (\d)/) || [])[1];
  const ticket = (meta.match(/Existing ticket: ([^*]+)/) || [])[1];
  const body = lines.slice(1).filter(l => l.trim() && !l.startsWith('**Severity:**') && !/^---/.test(l) && !/^## /.test(l)).map(l => l.replace(/^- /, ''));
  const evLine = body.find(l => /^\*\*Evidence:\*\*/.test(l)) || '';
  const shots = [...evLine.matchAll(/`([^`]+\.png)`/g)].map(m => m[1]).map(p => {
    const abs = path.join(ROOT, RUNS[run], p);
    return fs.existsSync(abs) ? { name: path.basename(p), data: 'data:image/png;base64,' + fs.readFileSync(abs).toString('base64') } : null;
  }).filter(Boolean);
  bugs.push({ id: id.trim(), title, sev, pri, spec, run, ticket, body, shots });
}

// Header facts from the first table
const facts = [...md.split('## Summary')[0].matchAll(/^\| (App|Spec|Runs|Accounts|Total) \| (.+) \|$/gm)].map(m => [m[1], m[2]]);
const notes = (md.split('## Notes')[1] || '').split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
const count = (k, v) => bugs.filter(b => b[k] === v).length;
const SEV = ['Critical', 'High', 'Medium', 'Low'], PRI = ['Urgent', 'High', 'Medium', 'Low'];

const card = b => `
<article class="bug" data-sev="${b.sev}" data-pri="${b.pri}" data-run="${b.run}" data-text="${esc((b.id + ' ' + b.title + ' ' + b.spec + ' ' + b.body.join(' ')).toLowerCase())}">
  <button class="bug-head" aria-expanded="false">
    <span class="bid">${b.id}</span>
    <span class="btitle">${inline(b.title)}</span>
    <span class="tags"><span class="pill sev-${b.sev}">${b.sev}</span><span class="pill pri pri-${b.pri}">${b.pri}</span></span>
    <span class="chev" aria-hidden="true">›</span>
  </button>
  <div class="bug-body">
    <p class="meta">Spec row <strong>${esc(b.spec)}</strong> · Run ${b.run}${b.ticket ? ` · <span class="ticket">Existing ticket ${esc(b.ticket)} — do not refile</span>` : ''}</p>
    <ul>${b.body.map(l => `<li>${inline(l)}</li>`).join('')}</ul>
    ${b.shots.map(s => `<figure><a href="${s.data}" target="_blank" rel="noopener"><img src="${s.data}" alt="${esc(s.name)}" loading="lazy"></a><figcaption>${esc(s.name)}</figcaption></figure>`).join('')}
  </div>
</article>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Modules and Fields Bugs</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1b1f24;--muted:#5d6670;--line:#e3e6ea;--accent:#2563eb;
--crit:#b42318;--crit-bg:#fde8e7;--high:#c2410c;--high-bg:#fff0e5;--med:#a16207;--med-bg:#fef6dc;--low:#3f6212;--low-bg:#ecf6e3;--urg:#7e22ce;--urg-bg:#f3e8ff}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#111418;--card:#1a1e24;--ink:#e7eaee;--muted:#9aa3ad;--line:#2b3139;--accent:#6ea0ff;
--crit:#ff8a80;--crit-bg:#3a1714;--high:#ffab70;--high-bg:#3a2112;--med:#f2c94c;--med-bg:#352b0e;--low:#a8d67d;--low-bg:#1f2d14;--urg:#d4a6ff;--urg-bg:#2c1a40}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1080px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:26px;margin:0 0 4px}.sub{color:var(--muted);margin:0 0 20px}
.facts{display:grid;grid-template-columns:max-content 1fr;gap:4px 16px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:14px}
.facts dt{color:var(--muted)}.facts dd{margin:0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:8px}
.stat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;cursor:pointer;text-align:left;color:inherit;font:inherit}
.stat b{display:block;font-size:26px;line-height:1.1}.stat span{color:var(--muted);font-size:13px}
.stat.on{outline:2px solid var(--accent)}
.stat.sev-Critical b{color:var(--crit)}.stat.sev-High b{color:var(--high)}.stat.sev-Medium b{color:var(--med)}.stat.sev-Low b{color:var(--low)}
.label{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:16px 0 6px}
.tools{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0 12px;align-items:center}
.tools input,.tools select{font:inherit;color:inherit;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px 10px}
.tools input{flex:1;min-width:200px}.tools button{font:inherit;background:none;border:0;color:var(--accent);cursor:pointer}
.shown{color:var(--muted);font-size:14px}
.bug{background:var(--card);border:1px solid var(--line);border-radius:10px;margin-bottom:8px;overflow:hidden}
.bug-head{all:unset;box-sizing:border-box;width:100%;display:flex;gap:12px;align-items:center;padding:12px 14px;cursor:pointer}
.bug-head:focus-visible{outline:2px solid var(--accent)}
.bid{font-family:ui-monospace,Consolas,monospace;font-size:13px;color:var(--muted);min-width:52px}
.btitle{flex:1;font-weight:600}.tags{display:flex;gap:6px;flex-shrink:0}
.pill{font-size:12px;font-weight:600;padding:2px 8px;border-radius:999px;white-space:nowrap}
.sev-Critical.pill{color:var(--crit);background:var(--crit-bg)}.sev-High.pill{color:var(--high);background:var(--high-bg)}
.sev-Medium.pill{color:var(--med);background:var(--med-bg)}.sev-Low.pill{color:var(--low);background:var(--low-bg)}
.pri{border:1px solid var(--line);color:var(--muted);background:transparent}.pri-Urgent{color:var(--urg);background:var(--urg-bg);border-color:transparent}
.chev{color:var(--muted);transition:transform .15s;font-size:20px}.bug.open .chev{transform:rotate(90deg)}
.bug-body{display:none;padding:0 16px 14px 78px;border-top:1px solid var(--line)}.bug.open .bug-body{display:block}
.bug-body ul{padding-left:18px;margin:8px 0}.bug-body li{margin:4px 0}
.meta{color:var(--muted);font-size:14px;margin:10px 0 0}.ticket{color:var(--urg)}
code{font-family:ui-monospace,Consolas,monospace;font-size:.88em;background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:0 4px;overflow-wrap:anywhere}
figure{margin:10px 0}figure img{max-width:100%;border:1px solid var(--line);border-radius:6px;display:block}figcaption{font-size:12px;color:var(--muted)}
.notes{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px 12px 32px;margin-top:24px}
.empty{color:var(--muted);padding:20px;text-align:center;display:none}
@media (max-width:640px){.bug-head{flex-wrap:wrap}.btitle{flex-basis:100%;order:3}.bug-body{padding-left:16px}.facts{grid-template-columns:1fr}}
</style></head><body><div class="wrap">
<h1>Modules and Fields — bug report</h1>
<p class="sub">TAVI Desk · ${bugs.length} bugs · missing features vs Zoho Desk are tracked separately in NDC-2174</p>
<dl class="facts">${facts.map(([k, v]) => `<dt>${k}</dt><dd>${inline(v)}</dd>`).join('')}</dl>
<div class="label">Severity — click to filter</div>
<div class="stats">${SEV.map(s => `<button class="stat sev-${s}" data-k="sev" data-v="${s}"><b>${count('sev', s)}</b><span>${s}</span></button>`).join('')}</div>
<div class="label">Priority — click to filter</div>
<div class="stats">${PRI.map(p => `<button class="stat" data-k="pri" data-v="${p}"><b>${count('pri', p)}</b><span>${p}</span></button>`).join('')}</div>
<div class="tools">
  <input id="q" type="search" placeholder="Search bugs, spec rows, endpoints…" aria-label="Search bugs">
  <select id="run" aria-label="Run"><option value="">All runs</option><option value="1">Run 1</option><option value="2">Run 2</option></select>
  <button id="all">Expand all</button><button id="reset">Clear filters</button>
  <span class="shown" id="shown"></span>
</div>
<section id="list">${bugs.map(card).join('')}</section>
<p class="empty" id="empty">No bugs match these filters.</p>
<div class="label">Notes</div>
<ul class="notes">${notes.map(n => `<li>${inline(n)}</li>`).join('')}</ul>
</div>
<script>
const f={sev:'',pri:''};const q=document.getElementById('q'),run=document.getElementById('run'),bugs=[...document.querySelectorAll('.bug')];
function apply(){const t=q.value.trim().toLowerCase();let n=0;for(const b of bugs){const ok=(!f.sev||b.dataset.sev===f.sev)&&(!f.pri||b.dataset.pri===f.pri)&&(!run.value||b.dataset.run===run.value)&&(!t||b.dataset.text.includes(t));b.style.display=ok?'':'none';if(ok)n++}
document.getElementById('shown').textContent=n+' of '+bugs.length+' shown';document.getElementById('empty').style.display=n?'none':'block';
document.querySelectorAll('.stat').forEach(s=>s.classList.toggle('on',f[s.dataset.k]===s.dataset.v))}
document.querySelectorAll('.stat').forEach(s=>s.onclick=()=>{f[s.dataset.k]=f[s.dataset.k]===s.dataset.v?'':s.dataset.v;apply()});
bugs.forEach(b=>b.querySelector('.bug-head').onclick=()=>{const o=b.classList.toggle('open');b.querySelector('.bug-head').setAttribute('aria-expanded',o)});
document.getElementById('all').onclick=e=>{const open=e.target.textContent==='Expand all';bugs.forEach(b=>{b.classList.toggle('open',open);b.querySelector('.bug-head').setAttribute('aria-expanded',open)});e.target.textContent=open?'Collapse all':'Expand all'};
document.getElementById('reset').onclick=()=>{f.sev=f.pri='';q.value='';run.value='';apply()};
q.oninput=apply;run.onchange=apply;apply();
</script></body></html>`;
const out = path.join(DIR, 'desk-modules-fields-bug-report.html');
fs.writeFileSync(out, html);
console.log(`bugs ${bugs.length}; with screenshots ${bugs.filter(b => b.shots.length).length} (${bugs.reduce((a, b) => a + b.shots.length, 0)} images); size ${(fs.statSync(out).size / 1e6).toFixed(1)} MB`);
console.log('missing images:', bugs.flatMap(b => [...(b.body.find(l => /Evidence/.test(l)) || '').matchAll(/`([^`]+\.png)`/g)].map(m => m[1]).filter(p => !fs.existsSync(path.join(ROOT, RUNS[b.run], p))).map(p => b.id + ' ' + p)).join(', ') || 'none');
