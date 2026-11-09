// READ-ONLY: node plane-desc.js <out.json> <seq...>  -> description text of each ticket (GET only)
const fs = require('fs');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').split(/\r?\n/).map(l => l.split(',')).flat().find(c => /^"?plane_/.test(c)).replace(/"/g, '');
const P = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const items = require('../baseline/plane-crm-items.json');
(async () => {
  const out = {};
  for (const s of process.argv.slice(3)) {
    const it = items.find(x => x.seq === +s); if (!it) { out[s] = 'not in dump'; continue; }
    const r = await fetch(P + '/work-items/' + it.id + '/', { headers: { 'X-API-Key': KEY } }); const j = await r.json();
    out['NDC-' + s] = { name: j.name, state: it.state, desc: (j.description_stripped || (j.description_html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').slice(0, 1800) };
    await new Promise(z => setTimeout(z, 700));
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1)); console.log('ok', Object.keys(out).length);
})();
