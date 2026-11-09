// READ-ONLY Plane lookup (GET only). Key read from the user's CSV, never printed.
// node plane-read.js dump <out.json>   -> all CRM-module work items with state names
const fs = require('fs');
const KEY = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').split(/\r?\n/).map(l => l.split(',')).flat().find(c => /^"?plane_/.test(c)).replace(/"/g, '');
const W = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy', P = W + '/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const h = { 'X-API-Key': KEY };
const get = async u => { const r = await fetch(u, { headers: h }); if (!r.ok) throw new Error(r.status + ' ' + u); return r.json(); };
(async () => {
  const st = await get(P + '/states/'); const S = {}; for (const s of (st.results || st)) S[s.id] = s.name;
  const mods = await get(P + '/modules/'); const crm = (mods.results || mods).filter(m => /crm/i.test(m.name));
  const out = [];
  for (const m of crm) {
    let cursor = null;
    for (let i = 0; i < 40; i++) {
      const u = new URL(P + '/modules/' + m.id + '/module-issues/'); u.searchParams.set('per_page', '100'); if (cursor) u.searchParams.set('cursor', cursor);
      const j = await get(u.toString());
      for (const w of (j.results || [])) out.push({ seq: w.sequence_id, name: w.name, state: S[w.state] || w.state, module: m.name, id: w.id, updated: w.updated_at });
      if (!j.next_page_results) break; cursor = j.next_cursor;
    }
  }
  fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
  console.log('modules', crm.map(m => m.name).join(' | '), 'items', out.length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
