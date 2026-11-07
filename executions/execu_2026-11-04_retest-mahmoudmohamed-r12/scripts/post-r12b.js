// Round 12 Gate 2 (approved 6 Nov 2026): comment + state + attach map. PASS → Done; FAIL/PARTIAL → Bug; NDC-2630 → Bug (user decision).
// Usage: node post-r12b.js <token.csv> [--dry]. Token read by column "Secret key", never printed. Skips tickets not in Ready For Test.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const [csv, flag] = process.argv.slice(2); const DRY = flag === '--dry';
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 6; i++) { let r; try { r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); } catch (e) { await new Promise(s => setTimeout(s, 8000)); continue; } if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const META = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(RUN, 'meta-r12b.json'), 'utf8')).map(([k, id, p, m]) => [k, { id, mod: m }]));
Object.assign(META, { 'NDC-1948': { id: 'fa456b4f-dd0d-4784-93f4-d7297672963d', mod: 'CRM' }, 'NDC-2764': { id: 'd9242f6d-5205-48b5-9434-5998b51614fe', mod: 'Desk' }, 'NDC-2773': { id: 'a3b3a11e-eade-4758-8933-cf681784e10c', mod: 'CRM' }, 'NDC-2136': { id: '9f559025-4222-4823-933b-57eb3bff3635', mod: 'CRM' } });
const SUM = {
  'NDC-2275': 'Assignment works on ticket update and for direct rules, but round robin never runs when a ticket is created: a ticket created by an agent (New Ticket form with Ticket Owner cleared, the request sends owner = null) or by API gets the creator as owner, so the matching Round Robin rule (On Ticket Create) never assigns it.',
  'NDC-1948': 'Retested 4 Nov (no change since). The note is saved and shown, and the Timeline tab is hidden for the denied user, but after a reload the Notes card says "No notes yet" although GET …/notes returns the note.',
  'NDC-2630': 'The original case (a connected mail provider whose send fails) could not be retested: NDC-Staging no longer has the Zoho connection for taviportal.com, and an SMTP connection with a wrong host or password is refused on save. Moved to Bug per QA lead so a working test setup can be provided. The no-provider case works.',
  'NDC-2801': 'The layout list on Create Ticket now follows the Department.',
  'NDC-2803': 'Templates now belong to a department and a layout, and Create Ticket offers only matching templates. Note (API only): a template can still be saved with a layout of another department, or with a field the layout does not contain.',
  'NDC-2791': 'Mark as Required now applies only to the layout where it is marked.',
  'NDC-2796': 'A department can have several layouts and tickets keep them, but the department default is not pre-selected on Create Ticket and Change Layout still lists every layout.',
  'NDC-2794': 'The rule saves "Team with agent" correctly, but when it fires the team is set and then cleared: the ticket ends with the agent and no team.',
  'NDC-2774': 'Tickets created 1.3 s, 6 s and 60 s after switching the default hours to Mon–Fri all skip the weekend, for the blueprint state and the SLA.',
  'NDC-2764': 'Retested 4 Nov. The rule no longer changes Status on a blueprint ticket; its other updates are applied.',
  'NDC-2754': 'Items 1, 3, 4, 5 and 15 work; item 2 partly shown; item 10 configured but not runnable (rating links disabled on the tenant). Item 6: a Share to the ticket\'s own department is accepted and the transition runs although nothing is shared.',
  'NDC-2773': 'Retested 4 Nov. The digit rule is listed and checked live.',
  'NDC-2800': 'Agents list rows are compact and text no longer breaks mid-word.',
  'NDC-2799': 'Items 8, 9, 11, 12, 13 and 14 behave as described (item 7 stays blocked).',
  'NDC-2752': 'All nine items work on Setup › Customization › Skills and on tickets.',
  'NDC-2136': 'Retested 4 Nov (no change since). Leads list p95 13.1 s, Transactions 5.3 s; target 1.5 s.',
  'NDC-2137': 'Column headers now load within target, but the cards never load: every column request ends with skip_total=true and returns 500 INTERNAL_ERROR ("An unexpected error occurred"). The same 500 happens on any CRM records list called with skip_total=true (Leads, Deals, Contacts, Tasks); without it the same calls return 200.',
  'NDC-2643': 'Every field and reminder option in the Task, Call and Event drawers now has an accessible name.',
  'NDC-2776': 'Phone is limited to 20 characters with clear messages; no server error.',
  'NDC-2399': 'Checked with Settings › CRM ⇄ Desk Integration › Sync all customers (same initial import; no disconnect). The admin gets a bell with counts and reasons, and the Failure Log and its Skipped filter list the run\'s records.',
};
const MOVE = { 'NDC-2630': 'Bug' };
(async () => {
  const log = []; const map = { dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: {} }; const draft = [];
  for (const key of Object.keys(SUM)) {
    const t = META[key]; const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs-r12', key + '.json'), 'utf8')); const v = spec.verdict;
    const target = MOVE[key] === 'Bug' ? BUG : v === 'PASS' ? DONE : BUG; const tname = target === DONE ? 'Done' : 'Bug';
    const w = await call('GET', `/work-items/${t.id}/`); if (w.j?.state !== RFT) { log.push(key + ' SKIPPED — not in Ready For Test'); continue; }
    const still = spec.rows.filter(r => r[4] === 'FAIL');
    const html = `<p><strong>Retest ${v} — ${esc(spec.date)}</strong> → moved to ${tname}<br>Environment: ${t.mod === 'Desk' ? 'staging-desk.taviportal.com' : 'staging-crm.taviportal.com'}, tenant NDC-Staging, Edge (headless) + API; ${esc(spec.env.split('·').slice(3).join('·').trim() || 'owner')}<br>Method: API and screen</p>`
      + `<p>${esc(SUM[key])}</p><p>Checked:</p><ul>${spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
      + (still.length ? `<p>Still failing:</p><ul>${still.map(r => `<li>${esc(r[1])}: expected ${esc(r[2])}, actual ${esc(r[3])}</li>`).join('')}</ul>` : '')
      + `<p>Evidence: ${esc(spec.out)} (attached)</p>`;
    draft.push(`<h3>${key} → ${tname}</h3>${html}`);
    map.files[spec.out] = t.id;
    if (DRY) { log.push(key + ' would → ' + tname); continue; }
    const c = await call('POST', `/work-items/${t.id}/comments/`, { comment_html: html }); const s = await call('PATCH', `/work-items/${t.id}/`, { state: target });
    log.push(`${key} comment ${c.s} state→${tname} ${s.s}`);
  }
  fs.writeFileSync(path.join(RUN, 'plane-draft.html'), `<!doctype html><meta charset="utf-8"><title>Plane draft r12</title><body style="font:14px system-ui;max-width:1000px;margin:auto">${draft.join('<hr>')}</body>`);
  fs.writeFileSync(path.join(RUN, 'attach-map.json'), JSON.stringify(map, null, 1)); console.log(log.join('\n'));
})().catch(e => console.log('ERR', String(e.message).replace(/plane_api_\w+/g, '<t>')));
