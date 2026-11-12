// Files the Validation Rules bugs + gap ticket in Plane (NDC) and attaches evidence. Idempotent via out/plane-filed.json. API key never printed.
const fs = require('fs'), path = require('path');
const KEY = fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const EV = path.join(__dirname, '../evidence'); const OUT = path.join(__dirname, '../out/plane-filed.json');
const done = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const STATE = { Bug: '34a7f4b6-7207-4955-b927-0d8d1dd3c666', Backlog: '34d8facd-e0c8-42ee-b397-f3afdc6a5a6f' };
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '9529016b-e67d-42b9-815c-263f673b8252'];
const { items, gap } = require('./plane-items.js');
const all = [...items.map(i => ({ ...i, state: 'Bug' })), { ...gap, state: 'Backlog' }];
const attach = async (id, file) => { const buf = fs.readFileSync(file), name = path.basename(file);
  const c = await fetch(`${B}/work-items/${id}/attachments/`, { method: 'POST', headers: H, body: JSON.stringify({ name, type: 'image/png', size: buf.length }) });
  const cj = await c.json(); if (!c.ok) throw new Error('attach create ' + c.status + ' ' + JSON.stringify(cj).slice(0, 200));
  const fd = new FormData(); for (const [k, v] of Object.entries(cj.upload_data.fields || {})) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), name);
  const u = await fetch(cj.upload_data.url, { method: 'POST', body: fd }); if (!u.ok && u.status !== 204) throw new Error('upload ' + u.status);
  const aid = cj.asset_id || (cj.attachment && cj.attachment.id); return (await fetch(`${B}/work-items/${id}/attachments/${aid}/`, { method: 'PATCH', headers: H, body: JSON.stringify({ is_uploaded: true }) })).status; };
(async () => {
  for (const it of all) {
    if (!done[it.key]) {
      const r = await fetch(`${B}/work-items/`, { method: 'POST', headers: H, body: JSON.stringify({ name: it.name, description_html: it.html, state: STATE[it.state], priority: it.priority, assignees: ASSIGNEES, labels: it.labels, start_date: '2026-11-13' }) });
      const j = await r.json(); if (!r.ok) { console.log('CREATE FAIL', it.key, r.status, JSON.stringify(j).slice(0, 300)); continue; }
      done[it.key] = { id: j.id, seq: j.sequence_id, name: it.name, modules: it.modules, attached: [] }; fs.writeFileSync(OUT, JSON.stringify(done, null, 1));
    }
    const d = done[it.key];
    for (const img of it.imgs) if (!d.attached.includes(img)) { try { await attach(d.id, path.join(EV, img)); d.attached.push(img); fs.writeFileSync(OUT, JSON.stringify(done, null, 1)); } catch (e) { console.log('ATTACH FAIL', it.key, img, e.message.slice(0, 200)); } }
    console.log('NDC-' + d.seq, it.priority, it.state, d.attached.length + '/' + it.imgs.length + ' image(s)', '|', it.name.slice(0, 90));
  }
})().catch(e => { console.error('ERR', e.message.replace(/plane_[A-Za-z0-9]+/g, '<key>')); process.exit(1); });
