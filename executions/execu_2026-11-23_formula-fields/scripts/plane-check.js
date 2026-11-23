const fs = require('fs'); const [csv] = process.argv.slice(2); const rows = fs.readFileSync(csv, 'utf8').trim().split(/\r?\n/).map(l => l.split(',')); const KEY = rows[1][rows[0].indexOf('Secret key')].trim();
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3'; const f = JSON.parse(fs.readFileSync('../filed.json', 'utf8'));
const get = async p => (await fetch(BASE + p, { headers: { 'X-API-Key': KEY } })).json();
(async () => { const cyc = await get('/cycles/8347595f-5728-4093-bb08-f451e7faa47b/cycle-issues/?per_page=200'); const inCyc = new Set((cyc.results || cyc).map(x => x.id || x.issue));
 for (const [k, v] of Object.entries(f)) { const w = await get('/work-items/' + v.id + '/'); const a = await get('/work-items/' + v.id + '/attachments/'); const att = (Array.isArray(a) ? a : a.results || []).filter(x => x.is_uploaded);
  console.log(v.key, w.priority, w.state === '34a7f4b6-7207-4955-b927-0d8d1dd3c666' ? 'Bug' : w.state, 'assignees', (w.assignees || []).length, 'cycle', inCyc.has(v.id) ? 'S17' : '?', 'desc', (w.description_html || '').length > 500 ? 'ok' : 'SHORT', 'images', att.length); } })();
