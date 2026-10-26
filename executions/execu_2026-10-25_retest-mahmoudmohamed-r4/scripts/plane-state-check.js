// Read-only: current state of every ticket in results.json. Token from CSV, never printed.
const fs = require('fs'); const rows = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const ST = { '11f2d31f-9d01-4463-a1de-ce99521b97aa': 'Done', '34a7f4b6-7207-4955-b927-0d8d1dd3c666': 'Bug', 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1': 'Ready For Test' };
(async () => { const c = {}; const odd = []; for (const t of require('../results.json').tickets) { const r = await fetch(`${API}/work-items/${t.uuid}/`, { headers: { 'X-API-Key': TOKEN } }); if (r.status !== 200) { odd.push(t.id + ' HTTP ' + r.status); continue; } const w = await r.json(); const s = ST[w.state] || w.state; c[s] = (c[s] || 0) + 1; if (s !== 'Ready For Test') odd.push(t.id + ' ' + s); } console.log(JSON.stringify({ counts: c, notRFT: odd })); })().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
