// Files the Desk bulk Close bug from bulk-close-bug/draft.json (user approved 13 Nov 2026). Resumable via bulk-close-bug/filed.json.
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, '..', 'bulk-close-bug');
const rows = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/).map(l => l.split(','));
const ki = rows[0].findIndex(h => /secret key/i.test(h)); const KEY = rows[1][ki >= 0 ? ki : rows[0].length - 1].trim();
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9529016b-e67d-42b9-815c-263f673b8252', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const T2823 = '9b91e6e7-c554-4f70-8a9a-46ab39f95915';
const IMG = 'Desk-bulk-close-500-FAIL.png';
const OUTF = path.join(DIR, 'filed.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const save = () => fs.writeFileSync(OUTF, JSON.stringify(done, null, 1));
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
async function attach(id, file) {
  const buf = fs.readFileSync(path.join(DIR, file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length }); if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id); const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); return r3.s < 300 ? 'ok' : 'step3 ' + r3.s;
}
(async () => {
  const d = JSON.parse(fs.readFileSync(path.join(DIR, 'draft.json'), 'utf8'));
  let L = [], c = ''; for (let i = 0; i < 6; i++) { const j = (await call('GET', '/labels/?per_page=100' + (c ? '&cursor=' + c : ''))).j; L = L.concat(j.results || []); if (!j.next_page_results) break; c = j.next_cursor; }
  const labels = d.fields.labels.map(n => (L.find(l => l.name.toLowerCase() === n.toLowerCase()) || {}).id).filter(Boolean);
  if (!done.id) {
    const cr = await call('POST', '/work-items/', { name: d.name, description_html: d.description_html, priority: 'high', state: BUG, labels, assignees: ASSIGNEES, start_date: '2026-11-13' });
    if (!cr.j || !cr.j.id) { console.log('create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); return; }
    done.id = cr.j.id; done.key = 'NDC-' + cr.j.sequence_id; done.labels = labels.length; save();
  }
  if (!done.module) { done.module = (await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [done.id] })).s; save(); }
  if (!done.cycle) { done.cycle = (await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [done.id] })).s; save(); }
  if (done.attach !== 'ok') { done.attach = await attach(done.id, IMG); save(); }
  if (!done.relation || done.relation >= 300) { done.relation = (await call('POST', `/work-items/${done.id}/relations/`, { relation_type: 'relates_to', issues: [T2823] })).s; save(); }
  console.log(JSON.stringify(done));
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
