// Attaches one local file to a Plane work item: create attachment -> upload to the presigned storage URL -> mark uploaded.
// Usage: node plane-attach.js <workItemId> <file>. The API key is read from the Downloads CSV and never printed.
const fs = require('fs'), path = require('path');
const csv = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',');
const KEY = csv[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
// Appends HTML (from a file) to a work item's description. Usage: node plane-append-desc.js <workItemId> <append.html>
const [wid, addFile] = process.argv.slice(2);
(async () => {
  const h = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
  const g = await fetch(`${B}/work-items/${wid}/`, { headers: h }); const gj = await g.json(); if (!g.ok) throw new Error('get ' + g.status);
  const add = fs.readFileSync(addFile, 'utf8').replace(/\n\s*/g, '');
  if ((gj.description_html || '').includes('Rebuild of NDC')) { console.log('already appended'); return; }
  const p = await fetch(`${B}/work-items/${wid}/`, { method: 'PATCH', headers: h, body: JSON.stringify({ description_html: (gj.description_html || '') + add }) });
  console.log('patch', p.status, (gj.description_html || '').length, '->', ((gj.description_html || '') + add).length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
