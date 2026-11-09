// Files the two approved finding drafts (user, 27 Oct 2026: "publish the two findings") from findings-draft.json, adds them to module Desk, attaches the images, reads back.
// Usage: node scripts/file-findings.js <token.csv>. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const csv = process.argv[2]; const RUN = path.join(__dirname, '..');
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 5; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const LABEL = { 'Tickets': 'c250807e-0e69-4057-82e2-32ccf9803ed4', 'Workflow Rules': 'bf14090c-73c4-4e27-923e-59ffd0ccb7cb' };
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
(async () => {
  const drafts = JSON.parse(fs.readFileSync(path.join(RUN, 'findings-draft.json'), 'utf8')); const filed = []; const map = { dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: {} };
  for (const d of drafts) {
    const html = d.html.replace(/-DRAFT\.png/g, '.png');
    const c = await call('POST', '/work-items/', { name: d.name, description_html: html, priority: d.priority, state: BUG, assignees: ASSIGNEES, labels: d.labels.map(l => LABEL[l]) });
    const id = c.j?.id; console.log('create', c.s, id ? 'NDC-' + c.j.sequence_id : JSON.stringify(c.j).slice(0, 200)); if (!id) continue;
    console.log('module Desk', (await call('POST', `/modules/${DESK}/module-issues/`, { issues: [id] })).s);
    const final = d.img.replace('-DRAFT.png', '.png'); fs.copyFileSync(path.join(map.dir, d.img), path.join(map.dir, final)); map.files[final] = id; filed.push({ id, seq: c.j.sequence_id, img: final });
  }
  fs.writeFileSync(path.join(RUN, 'attach-findings.json'), JSON.stringify(map));
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(RUN, 'attach-findings.json')], { encoding: 'utf8' }).trim());
  for (const f of filed) { const w = await call('GET', `/work-items/${f.id}/?expand=state,labels,assignees`); const at = await call('GET', `/work-items/${f.id}/attachments/`);
    console.log(`read back NDC-${f.seq} | ${w.j?.state?.name} | ${w.j?.priority} | ${(w.j?.labels || []).map(l => l.name).join(',')} | ${(w.j?.assignees || []).map(a => a.display_name).join(',')} | ${(at.j?.results || at.j || []).map(a => a.attributes?.name).join(',')} | ${w.j?.name}`); }
  fs.writeFileSync(path.join(RUN, 'filed-findings.json'), JSON.stringify(filed, null, 1));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
