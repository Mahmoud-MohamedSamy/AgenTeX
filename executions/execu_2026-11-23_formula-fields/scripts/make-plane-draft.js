// node make-plane-draft.js → ../plane-draft.html + ../plane-draft.json (exact description_html per bug; images embedded for review)
const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..');
delete require.cache[require.resolve('./bugs.js')]; const { meta, bugs } = require('./bugs.js');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ul = a => '<ul>' + a.map(x => `<li><p>${esc(x)}</p></li>`).join('') + '</ul>'; const ol = a => '<ol>' + a.map(x => `<li><p>${esc(x)}</p></li>`).join('') + '</ol>';
const desc = b => `<h2>Summary</h2><p>${esc(b.summary)}</p><h2>Steps to reproduce</h2>${ol(b.steps)}<h2>Expected result</h2>${ul(b.expected)}<h2>Actual result</h2>${ul(b.actual)}` +
  (b.notes.length ? `<h2>Notes</h2>${ul(b.notes)}` : '') + `<h2>Environment</h2>${ul(b.env)}<h2>Evidence</h2>${ul([b.img + ' (attached)', 'Test cases: ' + b.cases + ' — ' + meta.plan])}`;
const out = bugs.map(b => ({ id: b.id, name: b.title, priority: b.pri, modules: b.mods, moduleIds: b.mods.map(m => meta.modules[m]), state: meta.stateId, cycle: meta.cycleId, assignees: meta.assignees.map(a => a[1]), image: b.img, description_html: desc(b) }));
fs.writeFileSync(path.join(RUN, 'plane-draft.json'), JSON.stringify({ meta, bugs: out }, null, 1));
const P = { high: '#dc2626', medium: '#d97706', low: '#2563eb' };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Plane draft — Formula field bugs (${bugs.length})</title><style>
:root{--bg:#fff;--fg:#1f2328;--mut:#59636e;--bd:#d1d9e0;--soft:#f6f8fa}@media(prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--mut:#9198a1;--bd:#3d444d;--soft:#151b23}}
body{font:14px/1.55 system-ui,"Segoe UI",sans-serif;background:var(--bg);color:var(--fg);max-width:1200px;margin:auto;padding:24px}h1{font-size:22px;margin:0 0 4px}.mut{color:var(--mut)}
table.idx{border-collapse:collapse;width:100%;margin:14px 0}table.idx td,table.idx th{border:1px solid var(--bd);padding:5px 8px;text-align:left}table.idx th{background:var(--soft)}
.bug{border:1px solid var(--bd);border-radius:10px;padding:16px 20px;margin:22px 0}.bug h2{font-size:17px;margin:0 0 6px}.meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.pill{border-radius:10px;padding:0 9px;font-size:12px;border:1px solid var(--bd)}.pri{color:#fff;border:none}.desc h2{font-size:14px;margin:14px 0 4px;text-transform:uppercase;letter-spacing:.03em;color:var(--mut)}.desc ul,.desc ol{margin:0;padding-left:20px}.desc p{margin:2px 0}
img{max-width:100%;border:1px solid var(--bd);border-radius:6px;margin-top:10px}a{color:inherit}</style></head><body>
<h1>Plane draft — ${bugs.length} formula-field bugs</h1><div class="mut">Nothing posted yet. Project ${meta.project} · state ${meta.state} · cycle ${meta.cycle} · assignees ${meta.assignees.map(a => a[0]).join(', ')} · image attached to each via the Plane API (private).</div>
<table class="idx"><tr><th>#</th><th>Priority</th><th>Module</th><th>Title</th><th>Cases</th></tr>${bugs.map((b, i) => `<tr><td>${i + 1}</td><td><span class="pill pri" style="background:${P[b.pri]}">${b.pri}</span></td><td>${b.mods.join(' + ')}</td><td><a href="#${b.id}">${esc(b.title)}</a></td><td>${esc(b.cases)}</td></tr>`).join('')}</table>
${out.map((o, i) => { const b = bugs[i]; const img = path.join(RUN, 'screenshots/annotated', b.img); return `<div class="bug" id="${b.id}"><h2>${i + 1}. ${esc(b.title)}</h2><div class="meta"><span class="pill pri" style="background:${P[b.pri]}">${b.pri}</span><span class="pill">${b.mods.join(' + ')}</span><span class="pill">${meta.state}</span><span class="pill">${meta.cycle}</span><span class="pill">${esc(b.img)}</span></div><div class="desc">${o.description_html}</div>${fs.existsSync(img) ? `<img src="data:image/png;base64,${fs.readFileSync(img).toString('base64')}" alt="${esc(b.img)}">` : '<p style="color:#dc2626">image missing</p>'}</div>`; }).join('')}
</body></html>`;
fs.writeFileSync(path.join(RUN, 'plane-draft.html'), html); console.log('plane-draft', bugs.length, 'bugs');
