// node build.js → spec-formula-fields.md + formula-fields-test-plan.html (from cases.js)
const fs = require('fs'), p = require('path'), d = __dirname;
delete require.cache[require.resolve('./cases.js')];
const D = require('./cases.js');
const cases = D.cases.map(([id, g, app, t, s, e, pr, via]) => ({ id, g, app, t, s, e, pr, via }));
const md = c => String(c).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const count = (f) => cases.filter(f).length;

let out = `# ${D.title}\n\nPlanned ${D.date} · ${cases.length} cases · P0 ${count(c => c.pr === 'P0')}, P1 ${count(c => c.pr === 'P1')}, P2 ${count(c => c.pr === 'P2')}\n\n`;
out += `## What the build offers (facts)\n\n${D.facts.map(f => '- ' + f).join('\n')}\n\n## Setup and data\n\n${D.setup.map(f => '- ' + f).join('\n')}\n\n`;
out += `## Groups\n\n| Group | Name | Cases | Covers |\n|---|---|---|---|\n` + D.groups.map(([k, t, ds]) => `| ${k} | ${t} | ${count(c => c.g === k)} | ${md(ds)} |`).join('\n') + '\n\n';
for (const [k, t, ds] of D.groups) {
  out += `## ${k} — ${t}\n\n${ds}\n\n| ID | App | Title | Steps | Expected | Pri | Via |\n|---|---|---|---|---|---|---|\n`;
  out += cases.filter(c => c.g === k).map(c => `| ${c.id} | ${c.app} | ${md(c.t)} | ${md(c.s)} | ${md(c.e)} | ${c.pr} | ${c.via} |`).join('\n') + '\n\n';
}
fs.writeFileSync(p.join(d, 'spec-formula-fields.md'), out);

const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(D.title)}</title><style>
:root{--bg:#fff;--fg:#1f2328;--mut:#59636e;--bd:#d1d9e0;--soft:#f6f8fa;--acc:#0969da}
@media(prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--mut:#9198a1;--bd:#3d444d;--soft:#151b23;--acc:#4493f8}}
body{font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--fg);margin:0;padding:24px;max-width:1400px;margin:auto}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 6px}.mut{color:var(--mut)}
ul{margin:6px 0 0 18px;padding:0}li{margin:3px 0}
.bar{position:sticky;top:0;background:var(--bg);padding:10px 0;border-bottom:1px solid var(--bd);display:flex;gap:8px;flex-wrap:wrap;align-items:center;z-index:1}
select,input{font:inherit;padding:4px 8px;border:1px solid var(--bd);border-radius:6px;background:var(--bg);color:var(--fg)}
table{border-collapse:collapse;width:100%;margin-top:8px}th,td{border:1px solid var(--bd);padding:6px 8px;vertical-align:top;text-align:left}
th{background:var(--soft);font-weight:600}td.id{white-space:nowrap;font-weight:600}
.pill{display:inline-block;padding:0 7px;border-radius:10px;border:1px solid var(--bd);font-size:12px;white-space:nowrap}
.P0{border-color:#cf222e;color:#cf222e}.P1{border-color:#9a6700;color:#9a6700}
code{font-family:ui-monospace,Consolas,monospace;font-size:12.5px}
</style></head><body>
<h1>${esc(D.title)}</h1>
<div class="mut">TAVI CRM + Desk on NDC-Staging, compared with Zoho · planned ${esc(D.date)} · <b>${cases.length}</b> cases (P0 ${count(c => c.pr === 'P0')}, P1 ${count(c => c.pr === 'P1')}, P2 ${count(c => c.pr === 'P2')}) · not run yet</div>
<h2>What the build offers</h2><ul>${D.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
<h2>Setup and data</h2><ul>${D.setup.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
<h2>Groups</h2><table><tr><th>Group</th><th>Name</th><th>Cases</th><th>Covers</th></tr>${D.groups.map(([k, t, ds]) => `<tr><td class="id">${k}</td><td>${esc(t)}</td><td>${count(c => c.g === k)}</td><td>${esc(ds)}</td></tr>`).join('')}</table>
<h2>Cases</h2>
<div class="bar"><select id="g" aria-label="Group"><option value="">All groups</option>${D.groups.map(([k, t]) => `<option value="${k}">${k} — ${esc(t)}</option>`).join('')}</select>
<select id="p" aria-label="Priority"><option value="">All priorities</option><option>P0</option><option>P1</option><option>P2</option></select>
<select id="a" aria-label="App"><option value="">All apps</option><option>Both</option><option>CRM</option><option>Desk</option></select>
<input id="q" type="search" placeholder="Search" aria-label="Search"><span id="n" class="mut"></span></div>
<table><thead><tr><th>ID</th><th>App</th><th>Title</th><th>Steps</th><th>Expected</th><th>Pri</th><th>Via</th></tr></thead><tbody id="tb"></tbody></table>
<script>
const C=${JSON.stringify(cases).replace(/</g, '\\u003c')};
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function r(){const g=$('g').value,p=$('p').value,a=$('a').value,q=$('q').value.toLowerCase();
const L=C.filter(c=>(!g||c.g===g)&&(!p||c.pr===p)&&(!a||c.app===a)&&(!q||(c.id+c.t+c.s+c.e).toLowerCase().includes(q)));
$('n').textContent=L.length+' shown';
$('tb').innerHTML=L.map(c=>'<tr><td class="id">'+c.id+'</td><td>'+c.app+'</td><td>'+esc(c.t)+'</td><td><code>'+esc(c.s)+'</code></td><td>'+esc(c.e)+'</td><td><span class="pill '+c.pr+'">'+c.pr+'</span></td><td>'+c.via+'</td></tr>').join('');}
['g','p','a','q'].forEach(i=>$(i).addEventListener('input',r));r();
</script></body></html>`;
fs.writeFileSync(p.join(d, 'formula-fields-test-plan.html'), html);
console.log('cases', cases.length, 'groups', D.groups.map(([k]) => k + ':' + count(c => c.g === k)).join(' '));
