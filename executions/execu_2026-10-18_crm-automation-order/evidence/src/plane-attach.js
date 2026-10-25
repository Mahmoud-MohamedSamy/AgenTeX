// Uploads one image as an attachment to a Plane work item. The API key is read from the CSV (row 2, "Secret" column)
// and never printed. Usage: node plane-attach.js <keyCsv> <issueUuid> <imagePath>
const fs = require('fs');
const path = require('path');
const [keyCsv, issueId, img] = process.argv.slice(2);
const rows = fs.readFileSync(keyCsv, 'utf8').trim().split(/\r?\n/).map(l => l.split(','));
const col = rows[0].findIndex(h => /secret/i.test(h));
const KEY = rows[1][col].trim().replace(/^"|"$/g, '');
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3/issues/' + issueId + '/issue-attachments/';
(async () => {
  const buf = fs.readFileSync(img);
  const name = path.basename(img);
  const r1 = await fetch(BASE, { method: 'POST', headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, type: 'image/png', size: buf.length }) });
  const j1 = await r1.json().catch(() => ({}));
  if (!r1.ok) { console.log('step1', r1.status, JSON.stringify(j1).slice(0, 300)); process.exit(1); }
  const up = j1.upload_data;
  const fd = new FormData();
  for (const [k, v] of Object.entries(up.fields || {})) fd.append(k, v);
  fd.append('file', new Blob([buf], { type: 'image/png' }), name);
  const r2 = await fetch(up.url, { method: 'POST', body: fd });
  if (!r2.ok) { console.log('step2', r2.status, (await r2.text()).slice(0, 300)); process.exit(1); }
  const r3 = await fetch(BASE + j1.asset_id + '/', { method: 'PATCH', headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' }, body: '{}' });
  console.log(name, 'uploaded; mark-complete', r3.status);
})().catch(e => { console.log('error', e.message); process.exit(1); });
