// Builds plane-draft.html (preview of what will be posted) from plane-draft.json. Nothing is sent to Plane.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const L = JSON.parse(fs.readFileSync(path.join(RUN, 'plane-draft.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots/annotated', n)).toString('base64');
const col = { Done: '#16a34a', Bug: '#dc2626' };
const cards = L.map(c => `<section><h2>${c.id} <span class="st" style="background:${col[c.state] || '#7c3aed'}">${c.state ? 'Ready For Test → ' + c.state : 'No state change — needs your decision'}</span></h2><div class="cm">${c.html}</div><img src="${img(c.img)}" alt="${esc(c.img)}"><p class="f">Attachment: ${esc(c.img)}</p></section>`).join('');
const n = s => L.filter(c => c.state === s).length;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plane Draft Round 3</title><style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#111827;--mute:#6b7280;--line:#e5e7eb}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b1020;--card:#121a2e;--ink:#e5e7eb;--mute:#9ca3af;--line:#243049}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1200px;margin:0 auto;padding:24px 16px 64px}
section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:16px 0}h2{font-size:18px;margin:0 0 10px}.st{color:#fff;border-radius:999px;padding:2px 10px;font-size:13px;margin-left:8px}
.cm{border-left:3px solid var(--line);padding-left:12px}img{width:100%;border:1px solid var(--line);border-radius:8px;margin-top:10px}.f{color:var(--mute);font-size:13px}</style></head><body><main>
<h1>Plane draft — retest round 3 (25 Oct 2026)</h1><p>Nothing has been posted. On approval: comment + annotated image on every ticket; state Ready For Test → Done (${n('Done')}), → Bug (${n('Bug')}), unchanged (${L.length - n('Done') - n('Bug')}, needs decision).</p>${cards}</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'plane-draft.html'), html); console.log('plane-draft.html', Math.round(html.length / 1024), 'KB');
