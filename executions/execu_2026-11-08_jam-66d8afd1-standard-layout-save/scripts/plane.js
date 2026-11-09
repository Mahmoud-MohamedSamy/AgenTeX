// Plane REST helper using the user's API key (never printed).
// node plane.js get <path>            e.g. get projects/<pid>/work-items/?per_page=5
// node plane.js post|patch <path> <jsonFile>
// node plane.js attach <workItemId> <file>
const fs = require('fs'); const path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const row = fs.readFileSync(path.join(DL, f), 'utf8').split(/\r?\n/).filter(Boolean)[1];
const KEY = (row.match(/plane_[A-Za-z0-9_-]+/) || [])[0]; if (!KEY) { console.error('no key'); process.exit(1); }
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/';
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3';
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 500); } return { s: r.status, j }; };
(async () => {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'get') { const r = await call('GET', a); console.log(JSON.stringify(r, null, 1)); return; }
  if (cmd === 'post' || cmd === 'patch') { const r = await call(cmd.toUpperCase(), a, JSON.parse(fs.readFileSync(b, 'utf8'))); console.log(JSON.stringify(r, null, 1)); return; }
  if (cmd === 'attach') { const buf = fs.readFileSync(b); const name = path.basename(b);
    const r1 = await call('POST', `projects/${PID}/work-items/${a}/attachments/`, { name, type: 'image/png', size: buf.length });
    if (r1.s >= 300) { console.log('step1', r1.s, JSON.stringify(r1.j).slice(0, 300)); return; }
    const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), name);
    const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) { console.log('step2', r2.status); return; }
    const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id);
    const r3 = await call('PATCH', `projects/${PID}/work-items/${a}/attachments/${aid}/`, { is_uploaded: true });
    console.log('attached', name, 'asset', aid, 'patch', r3.s); return; }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
