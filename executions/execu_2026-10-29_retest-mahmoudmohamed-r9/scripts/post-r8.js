// Round 8: comment + state change for every retested ticket except NDC-2620 (user, 28 Oct 2026: "move them to the new status, anything partial,
// not runnable, fail => bug with comment and annotated evidence except NDC-2620"). PASS → Done; PARTIAL / FAIL / BLOCKED (not runnable) → Bug.
// Comment = summary + the rows of the same spec as the image. Then attaches the images and reads every ticket back.
// Usage: node scripts/post-r8.js <token.csv> [--only=NDC-1,NDC-2]. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..');
const [csv, ...flags] = process.argv.slice(2);
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 6; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const R = JSON.parse(fs.readFileSync(path.join(RUN, 'results.json'), 'utf8'));
let list = R.tickets.filter(t => t.id !== 'NDC-2620');
const only = (flags.find(f => f.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean); if (only.length) list = list.filter(t => only.includes(t.id));
const LABEL = { PASS: 'PASS', PARTIAL: 'PARTIAL', FAIL: 'FAIL', BLOCKED: 'NOT RUNNABLE ON STAGING' };
(async () => {
  const log = []; const map = { dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: {} }; const done = [];
  for (const t of list) {
    const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs-r8', `${t.id}.json`), 'utf8'));
    const w = await call('GET', `/work-items/${t.uuid}/`);
    if (w.j?.state !== RFT) { log.push(t.id + ' SKIPPED — not in Ready For Test'); continue; }
    const pass = t.v === 'PASS';
    const html = `<p><strong>Retest ${LABEL[t.v]} — 27–28 Oct 2026</strong>${pass ? '' : ' → moved to Bug'}<br>Environment: staging-crm.taviportal.com, NDC-Staging, Edge (headless) + API; accounts: CRM Admin, test user 1, owner account through the automation</p>`
      + (t.dev && !/^No developer comment/.test(t.dev) ? `<p><strong>Developer's note checked:</strong> ${esc(t.dev)} — ${esc(t.devHeld)}</p>` : '')
      + `<p>${esc(t.summary)}</p><p>Checked:</p><ul>${spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
      + (t.still && t.still.length ? `<p><strong>Still failing:</strong></p><ul>${t.still.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '')
      + (t.v === 'BLOCKED' ? '<p><strong>Moved to Bug (QA decision):</strong> this part could not be run on staging (see above); please move it back to Ready For Test once staging storage / reporting is healthy.</p>' : '')
      + `<p>Evidence: ${esc(spec.out)} (attached)</p>`;
    const c = await call('POST', `/work-items/${t.uuid}/comments/`, { comment_html: html });
    const u = await call('PATCH', `/work-items/${t.uuid}/`, { state: pass ? DONE : BUG });
    log.push(`${t.id} ${t.v} comment ${c.s} | ${pass ? 'Done' : 'Bug'} ${u.s}`); map.files[spec.out] = t.uuid; done.push({ t, out: spec.out });
    await new Promise(s => setTimeout(s, 1200));
  }
  console.log(log.join('\n'));
  if (!done.length) return;
  fs.writeFileSync(path.join(RUN, 'attach-r8.json'), JSON.stringify(map));
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(RUN, 'attach-r8.json')], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim());
  const back = [];
  for (const { t, out } of done) { const r = await call('GET', `/work-items/${t.uuid}/?expand=state`); const a = await call('GET', `/work-items/${t.uuid}/attachments/`);
    back.push(`${t.id} → ${r.j?.state?.name} | image ${(a.j?.results || a.j || []).some(x => x.attributes?.name === out) ? 'yes' : 'MISSING'}`); await new Promise(s => setTimeout(s, 400)); }
  console.log('READ BACK\n' + back.join('\n'));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
