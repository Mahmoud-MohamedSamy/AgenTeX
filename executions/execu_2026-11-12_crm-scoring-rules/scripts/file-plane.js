// Files the Scoring Rules gap ticket and 11 bugs in Plane (NDC) with their annotated images. Idempotent: skips items already in out/plane-filed.json.
// The API key is read from the user's CSV and never printed.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const KEY = fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const DRAFT = path.join(ROOT, 'docs/crm-scoring-rules/plane-draft'); const ANN = path.join(__dirname, '../evidence/annotated');
const OUT = path.join(__dirname, '../out/plane-filed.json'); const done = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const STATE = { Bug: '34a7f4b6-7207-4955-b927-0d8d1dd3c666', Backlog: '34d8facd-e0c8-42ee-b397-f3afdc6a5a6f' };
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', '9529016b-e67d-42b9-815c-263f673b8252'];
const LABELS = ['a794ec3e-36bf-4250-bef0-e22160da0c46'];
const IMG = { 'B01-K1-deleted-field.html': ['K1-deleted-field-rule-vs-zoho.png'], 'B02-K2-removed-value.html': ['K2-removed-value-rule-vs-zoho.png'],
  'B03-A2-no-permission-screen.html': ['A2-no-permission-screen-vs-zoho.png'], 'B04-G9-threshold-input.html': ['G9-threshold-input-vs-zoho.png'],
  'B05-H2-no-version-overwrite.html': ['H2-no-version-overwrite.png'], 'B06-H4-duplicate-names.html': ['H4-duplicate-names-vs-zoho.png'],
  'B07-C19-identical-conditions.html': ['C19-identical-conditions-vs-zoho.png'], 'B08-I6-D15-api-conditions.html': ['I6-api-conditions.png'],
  'B09-I3-B10-unknown-ids.html': ['I3-B10-unknown-ids.png'], 'B10-J6-error-focus.html': ['J6-error-focus.png'], 'B11-F9-audit-unreadable.html': ['F9-audit-unreadable.png'],
  'B12-WF-hosted-link-404.html': ['WF-hosted-link-404.png'], 'gap-ticket.html': ['G1-update-old-records-vs-zoho.png', 'G2-record-scoring-section-vs-zoho.png', 'G3-conditions-and-pattern-vs-zoho.png'] };
const items = [{ file: 'gap-ticket.html', name: 'Scoring Rules: features Zoho CRM has that CRM is missing', priority: 'medium', state: 'Backlog', html: fs.readFileSync(path.join(DRAFT, 'gap-ticket.html'), 'utf8') }];
for (const f of fs.readdirSync(path.join(DRAFT, 'bugs')).sort()) {
  let t = fs.readFileSync(path.join(DRAFT, 'bugs', f), 'utf8'); const name = t.match(/Title: (.*?) -->/)[1]; const pr = t.match(/Priority: (\w+)/)[1].toLowerCase();
  t = t.replace(/<!--.*?-->\n?/g, '').replace(/<li>Evidence[^<]*<\/li>/g, '');
  const ev = f.startsWith('B12-WF') ? `<li>Evidence: ${IMG[f].join(', ')} (attached).</li>` : `<li>Evidence (TAVI left, Zoho right where it was checked): ${IMG[f].join(', ')} (attached).</li>`;
  t = /<h2>Notes<\/h2><ul>/.test(t) ? t.replace(/(<h2>Notes<\/h2><ul>[\s\S]*?)<\/ul>/, `$1${ev}</ul>`) : t.replace(/<\/div>\s*$/, `<h2>Notes</h2><ul>${ev}</ul></div>`);
  items.push({ file: f, name, priority: pr, state: 'Bug', html: t.trim() });
}
const attach = async (id, file) => { const buf = fs.readFileSync(file), name = path.basename(file);
  const c = await fetch(`${B}/work-items/${id}/attachments/`, { method: 'POST', headers: H, body: JSON.stringify({ name, type: 'image/png', size: buf.length }) });
  const cj = await c.json(); if (!c.ok) throw new Error('attach create ' + c.status + ' ' + JSON.stringify(cj).slice(0, 200));
  const fd = new FormData(); for (const [k, v] of Object.entries(cj.upload_data.fields || {})) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), name);
  const u = await fetch(cj.upload_data.url, { method: 'POST', body: fd }); if (!u.ok && u.status !== 204) throw new Error('upload ' + u.status);
  const aid = cj.asset_id || (cj.attachment && cj.attachment.id); const p = await fetch(`${B}/work-items/${id}/attachments/${aid}/`, { method: 'PATCH', headers: H, body: JSON.stringify({ is_uploaded: true }) }); return p.status; };
(async () => {
  for (const it of items) {
    if (!done[it.file]) {
      const r = await fetch(`${B}/work-items/`, { method: 'POST', headers: H, body: JSON.stringify({ name: it.name, description_html: it.html, state: STATE[it.state], priority: it.priority, assignees: ASSIGNEES, labels: it.file.startsWith('B12-WF') ? ['113c8156-5066-4fdc-8f63-6c6f548507f7'] : LABELS, start_date: '2026-11-12' }) });
      const j = await r.json(); if (!r.ok) { console.log('CREATE FAIL', it.file, r.status, JSON.stringify(j).slice(0, 300)); continue; }
      done[it.file] = { id: j.id, seq: j.sequence_id, name: it.name, attached: [] }; fs.writeFileSync(OUT, JSON.stringify(done, null, 1));
    }
    const d = done[it.file];
    for (const img of IMG[it.file]) if (!d.attached.includes(img)) { try { const s = await attach(d.id, path.join(ANN, img)); d.attached.push(img); fs.writeFileSync(OUT, JSON.stringify(done, null, 1)); } catch (e) { console.log('ATTACH FAIL', it.file, img, e.message.slice(0, 200)); } }
    console.log('NDC-' + d.seq, it.priority, it.state, d.attached.length + ' image(s)', '|', it.name.slice(0, 90));
  }
})().catch(e => { console.error('ERR', e.message.replace(/plane_[A-Za-z0-9]+/g, '<key>')); process.exit(1); });
