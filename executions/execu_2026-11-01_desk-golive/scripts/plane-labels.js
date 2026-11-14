const fs = require('fs');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
(async () => { let L = [], c = ''; for (let i = 0; i < 6; i++) { const r = await fetch(BASE + '/labels/?per_page=100' + (c ? '&cursor=' + c : ''), { headers: { 'x-api-key': KEY } }); const j = await r.json(); L = L.concat(j.results || []); if (!j.next_page_results) break; c = j.next_cursor; }
  console.log(L.map(l => l.name).sort().join(' | '));
  const cy = await (await fetch(BASE + '/cycles/?cycle_view=current', { headers: { 'x-api-key': KEY } })).json(); console.log('current cycle:', JSON.stringify((cy.results || []).map(x => [x.id, x.name, x.start_date, x.end_date])));
})().catch(e => console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')));
