// Round 10: comment + state change + annotated evidence (user's instruction 2 Nov 2026: "update plane tickets status with comment and annotated evidence").
// PASS → Done; FAIL / PARTIAL → Bug; BLOCKED → comment only. Untested tickets are not touched.
// Usage: node scripts/post-r10.js <token.csv> [--dry] [--only=NDC-x,…]. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..');
const [csv, ...flags] = process.argv.slice(2); const DRY = flags.includes('--dry');
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 6; i++) { let r; try { r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); } catch (e) { await new Promise(s => setTimeout(s, 8000)); continue; } if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const E = require('./ev-r10-data.js');
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const onlyArg = (flags.find(f => f.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const APPROVED = onlyArg.length ? onlyArg : Object.keys(E).map(n => 'NDC-' + n);
// verdict overrides decided by the user at Gate 2 (1 Nov 2026)
const OVERRIDE = {};
const SUM = Object.fromEntries(Object.entries(E).map(([n, e]) => ['NDC-' + n, e.sum]));
(async () => {
  const log = []; const map = { dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: {} }; const done = [];
  for (const key of APPROVED) {
    const t = META.find(x => x.key === key); const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs-r10', key + '.json'), 'utf8'));
    const v = OVERRIDE[key]?.v || spec.verdict; const pass = v === 'PASS'; const blocked = v === 'BLOCKED'; const target = pass ? DONE : blocked ? null : BUG; const tname = pass ? 'Done' : blocked ? 'no state change' : 'Bug';
    const w = await call('GET', `/work-items/${t.id}/`);
    if (w.j?.state !== RFT) { log.push(key + ' SKIPPED — not in Ready For Test'); continue; }
    const still = spec.rows.filter(r => r[4] === 'FAIL');
    const html = `<p><strong>Retest ${v} — ${E[key.slice(4)].date || '2 Nov 2026'}</strong>${pass ? '' : blocked ? ' (not fully testable today — state unchanged)' : ' → moved to Bug'}<br>Environment: ${E[key.slice(4)].env ? esc(E[key.slice(4)].env) : `${t.mod === 'Desk' ? 'staging-desk' : 'staging-crm'}.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner${t.mod === 'Desk' ? ', test user 3 as Desk Agent' : ', test users (CRM User profile)'}`}<br>Method: API and screen</p>`
      + (OVERRIDE[key]?.note ? `<p><strong>${esc(OVERRIDE[key].note)}</strong></p>` : '') + `<p>${esc(SUM[key])}</p><p>Checked:</p><ul>${spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
      + (still.length ? `<p><strong>Still failing:</strong></p><ul>${still.map(r => `<li>${esc(r[1])}: expected ${esc(r[2])}, actual ${esc(r[3])}</li>`).join('')}</ul>` : '')
      + `<p>Evidence: ${esc(spec.out)} (attached)</p>`;
    if (DRY) { log.push(`${key} ${v} → ${tname} (dry) ${html.length} chars, ${spec.out}`); continue; }
    const c = await call('POST', `/work-items/${t.id}/comments/`, { comment_html: html });
    const u = target ? await call('PATCH', `/work-items/${t.id}/`, { state: target }) : { s: '-' };
    log.push(`${key} ${v} comment ${c.s} | ${tname} ${u.s}`); map.files[spec.out] = t.id; done.push({ key, id: t.id, out: spec.out });
    await new Promise(s => setTimeout(s, 1200));
  }
  console.log(log.join('\n'));
  if (!done.length || process.env.NOATTACH) return;
  fs.writeFileSync(path.join(RUN, 'attach-r10.json'), JSON.stringify(map));
  console.log(execFileSync('node', [path.join(process.env.USERPROFILE, '.claude/skills/retest-ready-tickets/scripts/plane-attach.js'), csv, 'ahmed-hegazy', PID, path.join(RUN, 'attach-r10.json')], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }).trim());
  const back = [];
  for (const { key, id, out } of done) { const r = await call('GET', `/work-items/${id}/?expand=state`); const a = await call('GET', `/work-items/${id}/attachments/`);
    back.push(`${key} → ${r.j?.state?.name} | image ${(a.j?.results || a.j || []).some(x => x.attributes?.name === out) ? 'yes' : 'MISSING'}`); await new Promise(s => setTimeout(s, 400)); }
  console.log('READ BACK\n' + back.join('\n'));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
