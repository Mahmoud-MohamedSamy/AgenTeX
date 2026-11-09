// READ-ONLY: latest comments of given tickets
const fs = require('fs');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').split(/\r?\n/).map(l => l.split(',')).flat().find(c => /^"?plane_/.test(c)).replace(/"/g, '');
const P = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const items = require('../after/plane-crm-items-end.json');
(async () => { for (const s of process.argv.slice(2)) { const it = items.find(x => x.seq === +s);
  const r = await fetch(P + '/work-items/' + it.id + '/comments/', { headers: { 'X-API-Key': KEY } }); const j = await r.json(); const c = (j.results || j).slice(-2);
  console.log('NDC-' + s, it.state, it.updated, '\n  ' + c.map(x => x.created_at + ' ' + (x.comment_stripped || (x.comment_html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').slice(0, 500)).join('\n  ')); } })();
