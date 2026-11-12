// Read-only Plane checks before filing the workflow batch: label ids, open cycles, NDC-2811 assignees, possible duplicates.
const fs = require('fs'), path = require('path');
const KF = 'D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv';
const KEY = (fs.readFileSync(KF, 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const W = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy', BASE = W + '/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const call = async p => { const r = await fetch(BASE + p, { headers: { 'x-api-key': KEY } }); return r.json(); };
(async () => {
  console.log('key found', !!KEY);
  const L = await call('/labels/?per_page=200'); console.log('labels', (L.results || L).filter(x => /workflow|automation|desk/i.test(x.name)).map(x => x.name + '=' + x.id).join(' | '));
  const C = await call('/cycles/?per_page=50'); console.log('cycles', (C.results || C).filter(x => /15|16/.test(x.name)).map(x => x.name + '=' + x.id + ' ' + x.start_date + '..' + x.end_date).join(' | '));
  let items = [], cur = null; for (let i = 0; i < 12; i++) { const r = await call('/work-items/?per_page=100&order_by=-created_at' + (cur ? '&cursor=' + cur : '')); items.push(...(r.results || [])); if (!r.next_page_results) break; cur = r.next_cursor; }
  const i2811 = items.find(x => x.sequence_id === 2811); console.log('2811 assignees', i2811 && JSON.stringify(i2811.assignees), 'state', i2811 && i2811.state);
  const rx = /workflow|criteria pattern|placeholder|recordId|header|double.?click|overwrit|happiness email|create record|kind.*first|internal (field )?names|trigger column|field update|created by|rule name/i;
  console.log('scanned', items.length); console.log(items.filter(x => rx.test(x.name)).map(x => 'NDC-' + x.sequence_id + ' ' + x.created_at.slice(0, 10) + ' ' + x.name).join('\n'));
})();
