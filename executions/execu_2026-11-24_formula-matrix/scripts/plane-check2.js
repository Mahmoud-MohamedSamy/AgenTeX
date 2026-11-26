const fs = require('fs'); const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split(/\r?\n/).map(l => l.split(',')); const KEY = rows[1][rows[0].indexOf('Secret key')].trim();
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3'; const g = async p => (await fetch(BASE + p, { headers: { 'X-API-Key': KEY } })).json();
(async () => { const f = JSON.parse(fs.readFileSync('filed.json', 'utf8')); const old = JSON.parse(fs.readFileSync('../execu_2026-11-23_formula-fields/filed.json', 'utf8'));
  for (const k of ['B1', 'B2', 'B3', 'B4']) { const w = await g(`/work-items/${f[k].id}/`); const a = await g(`/work-items/${f[k].id}/attachments/`);
    console.log(f[k].key, '|', w.priority, '|', w.state === '34a7f4b6-7207-4955-b927-0d8d1dd3c666' ? 'Bug' : w.state, '| assignees', (w.assignees || []).length, '| images', (Array.isArray(a) ? a : a.results || []).length, '|', w.name.slice(0, 70)); }
  for (const k of ['F06', 'F09', 'GAPS', 'F04', 'F12', 'F02']) { const a = await g(`/work-items/${old[k].id}/attachments/`); const c = await g(`/work-items/${old[k].id}/comments/`); const list = c.results || c; const mine = list.find(x => x.id === f['comment ' + k].id);
    console.log(old[k].key, '| comment', mine ? 'present' : 'MISSING', '| images now', (Array.isArray(a) ? a : a.results || []).length); } })();
