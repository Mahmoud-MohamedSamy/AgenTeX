const fs = require('fs');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const call = async p => { const r = await fetch(BASE + p, { headers: { 'x-api-key': KEY } }); return r.json(); };
(async () => {
  const cy = await call('/cycles/?per_page=50'); console.log('CYCLES', (cy.results || []).filter(c => /1[5-8]/.test(c.name)).map(c => [c.id, c.name, c.start_date, c.end_date].join(' ')).join('\n'));
  const s = await (await fetch('https://api.plane.so/api/v1/workspaces/ahmed-hegazy/work-items/search/?search=' + encodeURIComponent(process.argv[2] || 'clone'), { headers: { 'x-api-key': KEY } })).json().catch(() => ({}));
  for (const q of ['clone', 'spam', 'Clone', 'Spam', 'move']) { const r = await (await fetch('https://api.plane.so/api/v1/workspaces/ahmed-hegazy/work-items/search/?search=' + q, { headers: { 'x-api-key': KEY } })).json().catch(e => ({ e: e.message })); const it = (r.issues || r.results || []); console.log('SEARCH', q, it.length, it.slice(0, 15).map(x => (x.project__identifier || 'NDC') + '-' + x.sequence_id + ' ' + x.name).join(' || ')); }
})().catch(e => console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')));
