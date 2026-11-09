// Replaces the attachment on NDC-2661 / NDC-2662 (first upload still had the "DRAFT" label): delete our earlier upload, upload the re-rendered image, read back.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const csv = process.argv[2]; const RUN = path.join(__dirname, '..');
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')]; const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p) => { const r = await fetch(API + p, { method: m, headers: H }); return { s: r.status, j: await r.json().catch(() => null) }; };
(async () => {
  const filed = JSON.parse(fs.readFileSync(path.join(RUN, 'filed-findings.json'), 'utf8'));
  for (const f of filed) { const at = await call('GET', `/work-items/${f.id}/attachments/`); for (const a of (at.j?.results || at.j || []).filter(a => a.attributes?.name === f.img)) console.log('delete old', f.img, (await call('DELETE', `/work-items/${f.id}/attachments/${a.id}/`)).s); }
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(RUN, 'attach-findings.json')], { encoding: 'utf8' }).trim());
  for (const f of filed) { const at = await call('GET', `/work-items/${f.id}/attachments/`); console.log('NDC-' + f.seq, (at.j?.results || at.j || []).map(a => a.attributes?.name + ' ' + (a.updated_at || a.created_at || '').slice(11, 19)).join(', ')); }
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
