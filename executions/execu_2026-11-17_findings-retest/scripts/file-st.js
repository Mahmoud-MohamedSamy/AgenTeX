// Files new findings N1-N6 (user 18 Nov: "file the new findings => N1 and N2 mahmoud hegazy mfathy, N3 - N6 mahmoud hegazy eahmed"). Bug, Desk module, current sprint, one annotated image each.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2';
const MAHMOUD = 'e1364b0b-d3cd-4167-8261-6194577a480a', HEGAZY = '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', MFATHY = '82cf7a79-0707-4f47-97ca-f8926587b6db', EAHMED = '9529016b-e67d-42b9-815c-263f673b8252';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-st.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com, NDC-Staging, API with the Desk Administrator account (mahmoud.mahamed1515), 19 Nov 2026; QA tickets in Marketing and Customer Support, QA SLA policy in Customer Support; test data deleted and the status list restored after.';
const BUGS = {
  'ST-2': { title: 'Tickets | A status change saved on the ticket never reaches Desk: Desk keeps the old status, closed time and workload', labels: ['Tickets'], img: 'ST-2-desk-status-not-updated.png', who: [MAHMOUD, HEGAZY, EAHMED], priority: 'high',
    summary: 'Moving a ticket to another status returned success and the ticket record holds the new status, but the Desk side of the ticket (the one queues, closed time, agent workload and SLA use) still showed Open an hour later. For a closed-type status this means the ticket has no closed time and keeps counting as the agent’s open work. 4 of 39 moves were affected on 19 Nov; they happened around a staging outage (500 errors at about 09:10 UTC) and nothing repaired them afterwards. Same kind of drift as the 17 Nov background-processing problem.',
    steps: ['Create a ticket in Marketing as Open, owned by an agent.', 'Change its Status to another status, e.g. QA NDC Not Approved E-Top-Up Manager (type closed), through the API or the ticket page.', 'Read the ticket record (GET /modules/{tickets}/records/{id}) and the Desk ticket (GET /desk/tickets/{id}).', 'Check the agent’s open-ticket count (GET /desk/agents/{id}/workload) and the ticket in the queues.', 'Read the Desk ticket again an hour later.'],
    expected: 'Once the change is saved, the Desk ticket shows the same status; a closed-type status sets the closed time and removes the ticket from the agent’s open work. If the Desk update fails, it is retried or the change is refused, so the two never disagree.',
    actual: 'Record: new status. Desk ticket: still Open, closed_at empty, still counted in the agent’s workload, an hour later. Tickets: QA NDC Finance team after Validation, QA NDC Not Approved E-Top-Up Manager (closed type), QA NDC Needs NDC Finance investigation, QA NDC Banking sector investigation (19 Nov ~09:05-09:10 UTC). The other 35 moves updated both sides.' },
  'ST-3': { title: 'Ticket Statuses | Changing a status type updates closed time and workload of tickets in it, but not their SLA', labels: ['Tickets', 'SLA & Business Hours'], img: 'ST-3-type-change-sla.png', who: [MAHMOUD, HEGAZY, EAHMED], priority: 'medium',
    summary: 'On Setup > Ticket Access > Ticket statuses, changing the type of a status that already has tickets updates their closed time and the agent workload at once, but their SLA does not follow: it keeps running after the status becomes closed, pauses late (and with more time left than before) when it becomes on hold, and stays paused when the status goes back to open.',
    steps: ['Put a ticket with a running SLA (QA SLA, response 1 h, resolution 4 h, Customer Support) and two tickets owned by an agent (Marketing) in a status of type Open (e.g. QA NDC Distributor).', 'In Ticket statuses, change that status to type Closed. Read the tickets’ closed time, the agent workload and GET /desk/tickets/{id}/sla after 20 s and 2 min.', 'Change the type to On Hold and read again after 20 s and 2 min.', 'Change the type back to Open and read again after 90 s and 4 min.'],
    expected: 'Tickets already in the status behave exactly like tickets moved into it: Closed stops the SLA (resolution met), On Hold pauses it at once keeping the time left, Open resumes it from where it paused.',
    actual: 'Closed (10:05 UTC): closed_at set to 10:05:18 and workload 4 -> 2, but the SLA kept running (first response 3,542 s -> 3,441 s left). On Hold: closed_at cleared, workload back to 4; the SLA still ran 20 s later and was paused after 2 min with first response 3,586 s left, up from 3,407 s (about 3 minutes of elapsed time lost). Open again: the SLA was still paused 4 minutes later (3,586 s / 14,386 s unchanged). The status list was restored after the test.' },
};
async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'screenshots/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length }); if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id); const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); return 'attached ' + r3.s;
}
(async () => {
  if (!KEY) throw new Error('no key');
  const cur = (await call('GET', '/cycles/7143596a-fcfb-48b6-a6ee-193bfc04bfdd/')).j;
  console.log('cycle', cur.name, cur.start_date, cur.end_date);
  let L = [], c = ''; for (let i = 0; i < 6; i++) { const j = (await call('GET', '/labels/?per_page=100' + (c ? '&cursor=' + c : ''))).j; L = L.concat(j.results || []); if (!j.next_page_results) break; c = j.next_cursor; }
  const lid = n => (L.find(l => l.name === n) || {}).id;
  if (process.argv[2] === 'check') { for (const b of Object.values(BUGS)) console.log(b.labels.map(n => n + ':' + (lid(n) ? 'ok' : 'MISSING')).join(' ')); return; }
  for (const [key, b] of Object.entries(BUGS)) {
    if (done[key]) { console.log(key, 'already filed', done[key][0]); continue; }
    const html = '<div><h2>Summary</h2><p>' + esc(b.summary) + '</p>'
      + '<h2>Steps to Reproduce</h2><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
      + '<h2>Expected Result</h2><p>' + esc(b.expected) + '</p><h2>Actual Result</h2><p>' + esc(b.actual) + '</p>'
      + '<h2>Environment</h2><p>' + esc(ENV) + '</p><h2>Attachment</h2><p>Annotated evidence: ' + esc(b.img) + '.</p></div>';
    const labels = b.labels.map(lid).filter(Boolean);
    const cr = await call('POST', '/work-items/', { name: b.title, description_html: html, priority: b.priority, state: BUG, labels, assignees: b.who, start_date: '2026-11-19' });
    if (!cr.j || !cr.j.id) { console.log(key, 'create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); continue; }
    const id = cr.j.id; done[key] = ['NDC-' + cr.j.sequence_id, id]; fs.writeFileSync(OUTF, JSON.stringify(done));
    const mo = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] }); const cy = await call('POST', `/cycles/${cur.id}/cycle-issues/`, { issues: [id] }); const a = await attach(id, b.img);
    console.log(key, '->', done[key][0], 'labels', labels.length + '/' + b.labels.length, 'module', mo.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
