// Posts the approved NDC-2203 round-7 comment (plane-draft.json), moves it to Bug (user, 27 Oct), attaches the evidence, reads back.
// Usage: node scripts/post-2203.js <token.csv>. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const csv = process.argv[2]; const RUN = path.join(__dirname, '..');
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 5; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
(async () => {
  const [d] = JSON.parse(fs.readFileSync(path.join(RUN, 'plane-draft.json'), 'utf8'));
  const w = await call('GET', `/work-items/${d.uuid}/`); if (w.j?.state !== RFT) { console.log('SKIPPED — not in Ready For Test any more'); return; }
  const c = await call('POST', `/work-items/${d.uuid}/comments/`, { comment_html: d.html }); console.log('comment', c.s);
  const u = await call('PATCH', `/work-items/${d.uuid}/`, { state: BUG }); console.log('state Bug', u.s);
  fs.writeFileSync(path.join(RUN, 'attach-2203.json'), JSON.stringify({ dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: { [d.img]: d.uuid } }));
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(RUN, 'attach-2203.json')], { encoding: 'utf8' }).trim());
  const r = await call('GET', `/work-items/${d.uuid}/?expand=state`); const cm = await call('GET', `/work-items/${d.uuid}/comments/`); const at = await call('GET', `/work-items/${d.uuid}/attachments/`);
  const last = (cm.j?.results || cm.j || []).sort((a, b) => a.created_at < b.created_at ? -1 : 1).pop();
  console.log('read back: state', r.j?.state?.name, '| last comment', last?.created_at, (last?.comment_stripped || '').slice(0, 90), '| attachments', (at.j?.results || at.j || []).map(a => a.attributes?.name).join(', '));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
