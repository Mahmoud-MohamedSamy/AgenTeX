// Attaches one local file to a Plane work item: create attachment -> upload to the presigned storage URL -> mark uploaded.
// Usage: node plane-attach.js <workItemId> <file>. The API key is read from the Downloads CSV and never printed.
const fs = require('fs'), path = require('path');
const csv = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1792931401453.csv', 'utf8').trim().split(/\r?\n/)[1].split(',');
const KEY = csv[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const [id, file] = process.argv.slice(2);
(async () => {
  const buf = fs.readFileSync(file), name = path.basename(file);
  const h = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
  const c = await fetch(`${B}/work-items/${id}/attachments/`, { method: 'POST', headers: h, body: JSON.stringify({ name, type: 'image/png', size: buf.length }) });
  const cj = await c.json(); if (!c.ok) throw new Error('create ' + c.status + ' ' + JSON.stringify(cj).slice(0, 300));
  const up = cj.upload_data, fd = new FormData();
  for (const [k, v] of Object.entries(up.fields || {})) fd.append(k, v);
  fd.append('file', new Blob([buf], { type: 'image/png' }), name);
  const u = await fetch(up.url, { method: 'POST', body: fd }); if (!u.ok && u.status !== 204) throw new Error('upload ' + u.status + ' ' + (await u.text()).slice(0, 200));
  const assetId = cj.asset_id || (cj.attachment && cj.attachment.id);
  const p = await fetch(`${B}/work-items/${id}/attachments/${assetId}/`, { method: 'PATCH', headers: h, body: JSON.stringify({ is_uploaded: true }) });
  console.log(name, '-> attached', p.status);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
