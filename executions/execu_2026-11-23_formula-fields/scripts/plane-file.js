// node plane-file.js <tokenCsv> [--one]  — creates the work items in ../plane-draft.json (skips ones already in ../filed.json),
// adds each to its module(s) and the cycle. Token read from the CSV column "Secret key", never printed.
const fs = require('fs'), path = require('path'); const RUN = path.join(__dirname, '..');
const [csv, flag] = process.argv.slice(2);
const rows = fs.readFileSync(csv, 'utf8').trim().split(/\r?\n/).map(l => l.split(',')); const KEY = rows[1][rows[0].indexOf('Secret key')].trim();
const { meta, bugs } = JSON.parse(fs.readFileSync(path.join(RUN, 'plane-draft.json'), 'utf8'));
const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${meta.projectId}`;
const FILED = path.join(RUN, 'filed.json'); const filed = fs.existsSync(FILED) ? JSON.parse(fs.readFileSync(FILED, 'utf8')) : {};
const call = async (m, p, b) => { const r = await fetch(BASE + p, { method: m, headers: { 'X-API-Key': KEY, 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { } return { s: r.status, j, t: t.slice(0, 300) }; };
(async () => {
  for (const b of bugs) {
    if (filed[b.id]) continue;
    const r = await call('POST', '/work-items/', { name: b.name, description_html: b.description_html, priority: b.priority, state: b.state, assignees: b.assignees });
    if (r.s >= 300) { console.log(b.id, 'CREATE FAILED', r.s, r.t); break; }
    const id = r.j.id, seq = r.j.sequence_id; filed[b.id] = { id, key: 'NDC-' + seq, image: b.image, name: b.name }; fs.writeFileSync(FILED, JSON.stringify(filed, null, 1));
    const c = await call('POST', `/cycles/${b.cycle}/cycle-issues/`, { issues: [id] });
    const ms = []; for (const mid of b.moduleIds) { const m = await call('POST', `/modules/${mid}/module-issues/`, { issues: [id] }); ms.push(m.s); }
    console.log(b.id, 'NDC-' + seq, 'cycle', c.s, 'modules', ms.join(','));
    if (flag === '--one') break;
  }
})();
