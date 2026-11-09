// Round 14 (8 Nov 2026) Gate 2: comment + state + attach map. PASS → Done; FAIL/PARTIAL → Bug; BLOCKED → comment only.
// Usage: node post-r14.js <token.csv> [--post]   Without --post it only writes plane-draft.html + attach-map.json (no Plane write).
// Token read by column "Secret key", never printed. Skips tickets that are no longer in Ready For Test.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const [csv, flag] = process.argv.slice(2); const POST = flag === '--post';
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 6; i++) { let r; try { r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); } catch (e) { await new Promise(s => setTimeout(s, 8000)); continue; } if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const META = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(RUN, 'out', 'rft.json'), 'utf8')).map(w => ['NDC-' + w.seq, w.id]));
const SUM = {
  'NDC-2754': 'The last open case from 7 Nov is fixed: a step owner without the share permission can now complete a step that requires a Share. Desk Agent fedelav803, owner of QA alt on an admin-owned ticket, added a share to another department and ran the step, from the screen and by API; the ticket moved to Closed and the share was saved. The plain Share action still needs the share permission, as the note says.',
  'NDC-2811': 'Round robin now skips an agent whose Email status is off for tickets with no channel and lists them as SKIPPED. A Chat ticket can still go to that agent while Chat is on. With Email off for the whole pool the ticket waits unassigned, and it is assigned when the department allows offline agents.',
  'NDC-2812': 'With Team Assignment off, every way to give a ticket to a team that I tried is refused with team_assignment_off: single assign, bulk assign, moving a ticket into the department, deleting a team and moving its tickets, reassigning a departing agent\'s work, and rules. Agents are still accepted, and teams are accepted again when the setting is back on.',
  'NDC-2813': 'The New Ticket form now saves the owner it shows. Owner left as the signed-in agent: the ticket is theirs (a matching direct rule can still assign someone else). Owner cleared: saved unassigned and round robin assigns it (the NDC-2275 case). An API create with source api or web_form and no owner stays unassigned so the rules route it.',
  'NDC-2814': '"Execution Time on a holiday of <list>" now matches a holiday list that is not linked to business hours, and "not a holiday of" behaves the other way round. Lists without today do not match. An unlinked list does not close any business hours.',
};
(async () => {
  const log = []; const map = { dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: {} }; const draft = [];
  for (const key of Object.keys(SUM)) {
    const id = META[key]; const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', key + '.json'), 'utf8')); const v = spec.verdict;
    const target = v === 'PASS' ? DONE : v === 'BLOCKED' ? null : BUG; const tname = target === DONE ? 'Done' : target === BUG ? 'Bug' : 'no state change';
    const still = spec.rows.filter(r => r[4] === 'FAIL' || r[4] === 'PARTIAL');
    const html = `<p><strong>Retest ${v} — ${esc(spec.date)}</strong> → ${target ? 'moved to ' + tname : 'comment only'}<br>Environment: staging-desk.taviportal.com, tenant NDC-Staging, ${esc(spec.env.split(' · ').slice(2).join(' · '))}<br>Method: ${/Edge/.test(spec.env) ? 'API and screen' : /screen/.test(spec.env) ? 'API and screen' : 'API'}</p>`
      + `<p>${esc(SUM[key])}</p><p>Checked:</p><ul>${spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
      + (still.length ? `<p>Still failing:</p><ul>${still.map(r => `<li>${esc(r[1])}: expected ${esc(r[2])}, actual ${esc(r[3])}</li>`).join('')}</ul>` : '')
      + `<p>Evidence: ${esc(spec.out)} (attached)</p>`;
    draft.push(`<h3>${key} → ${tname}</h3><p style="color:#555">Attach: ${esc(spec.out)}</p>${html}`); map.files[spec.out] = id;
    const w = await call('GET', `/work-items/${id}/`); const inRft = w.j?.state === RFT;
    if (!POST) { log.push(`${key} ${inRft ? 'in RFT' : 'NOT in RFT (state ' + w.s + ')'} → would ${tname}`); continue; }
    if (!inRft) { log.push(key + ' SKIPPED — not in Ready For Test'); delete map.files[spec.out]; continue; }
    const c = await call('POST', `/work-items/${id}/comments/`, { comment_html: html }); const s = target ? await call('PATCH', `/work-items/${id}/`, { state: target }) : { s: '-' };
    log.push(`${key} comment ${c.s} state→${tname} ${s.s}`);
  }
  fs.writeFileSync(path.join(RUN, 'plane-draft.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plane draft r14</title><body style="font:14px system-ui;max-width:1000px;margin:auto;padding:16px"><h2>Plane draft — round 14 (8 Nov 2026)</h2><p>Exactly what will be posted. Cleanup plan: delete all QA RT14 objects in ledger.md (tickets, rules, holiday lists, SLA policy, team, 2 departments, blueprint), purge them from the Recycle Bin, delete the saved sign-in files.</p><hr>${draft.join('<hr>')}</body>`);
  fs.writeFileSync(path.join(RUN, 'attach-map.json'), JSON.stringify(map, null, 1)); console.log(log.join('\n'));
})().catch(e => console.log('ERR', String(e.message).replace(/plane_api_\w+/g, '<t>')));
