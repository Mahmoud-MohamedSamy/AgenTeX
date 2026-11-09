// Files the 4 approved bugs from plane-draft.json (user approved 7 Nov: "publish the bugs you found"). Key from Downloads CSV, never printed.
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const csv = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/)[1].split(',');
const KEY = csv[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const h = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const OUTF = path.join(RUN, 'out/plane-filed.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
(async () => {
  const d = JSON.parse(fs.readFileSync(path.join(RUN, 'plane-draft.json'), 'utf8'));
  for (const b of d.bugs) {
    if (done[b.key]) { console.log(b.key, 'already', done[b.key].seq); continue; }
    const r = await fetch(`${B}/work-items/`, { method: 'POST', headers: h, body: JSON.stringify({ name: 'Assignment Rules | ' + b.name, description_html: b.description_html, priority: b.priority, state: BUG, labels: b.labels, assignees: ASSIGNEES }) });
    const j = await r.json(); if (!r.ok) throw new Error(b.key + ' create ' + r.status + ' ' + JSON.stringify(j).slice(0, 300));
    done[b.key] = { id: j.id, seq: 'NDC-' + j.sequence_id, image: b.attach };
    fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    console.log(b.key, '->', done[b.key].seq, j.id);
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
