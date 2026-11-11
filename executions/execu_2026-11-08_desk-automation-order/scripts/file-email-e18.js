// Files EM-08 and E18-03 (user asked 10 Nov 2026: "file EM-08 and E18-03 with annotated evidence"). Plane REST with the API key (never printed).
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-email-e18.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };

const bugs = [
  { key: 'EM-08', priority: 'medium', labels: ['6b131130-3422-4cce-8563-338328b44671'], image: 'EM-08-email-overview-says-mail-arriving-vs-customer-mailbox.png',
    name: 'Email | Setup says "Mail is arriving" even when customer mail does not reach Desk',
    html: '<p><strong>Summary</strong></p><p>The Email Overview page shows a green "Mail is arriving" status and "4 of 4 done", but it does not know whether mail actually arrives. On 9 Nov a customer reply never reached Desk while the page showed exactly this status, so the admin is told everything is fine when it is not.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Go to Setup › Channels › Email › Overview and look at the status card at the top.</li><li>From a ticket in Customer Support, send an agent reply to a customer mailbox.</li><li>From that customer mailbox, reply to the agent email.</li><li>Wait 40 minutes and open the ticket in Desk.</li><li>Go back to the Email Overview page.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>If customer mail is not arriving, the page warns about it.</li><li>The page shows when the last email was received, so the admin can see whether mail really arrives.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The page shows a green "Mail is arriving. Customers can write in, and replies go out. Nothing is waiting on you." and "4 of 4 done".</li><li>There is no time of the last email received anywhere on the page.</li><li>The same card says "The mail provider did not answer when we checked taviportal.com. This says nothing about whether mail is arriving."</li><li>The customer reply sent on 9 Nov at 3:30 PM (Cairo) never appeared on the ticket or as a new ticket, while the status stayed green. Seen again on 10 Nov.</li></ul>'
      + '<p><strong>Environment</strong></p><p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account; 9 Nov and 10 Nov 2026 (09:31 UTC). Receiving address customer-support@help-staging.anyware.software; customer mailbox mmohamed@anyware.software.</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (EM-08-email-overview-says-mail-arriving-vs-customer-mailbox.png): the Overview status next to the ticket with no customer reply and the customer mailbox showing the reply was sent.</p>' },
  { key: 'E18-03', priority: 'low', labels: ['5ad0a95a-678e-4485-845d-bb93c27dce36'], image: 'E18-03-backlog-skips-old-ticket-without-reason.png',
    name: 'Assignment Rules | Round robin backlog skips an old ticket without saying why',
    html: '<p><strong>Summary</strong></p><p>The 30-day rule works: a backlog ticket with no customer reply in the last 30 days is not assigned. But nothing tells the agent or admin why. The ticket stays unassigned in the backlog with no entry in its History, while newer tickets are assigned within seconds.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>In a department with a round robin rule, open Round Robin Preferences, turn on "Assign tickets to offline agents" and set the department threshold to 1, so new tickets wait in the backlog.</li><li>Create a new ticket that matches the rule. It waits unassigned.</li><li>Reopen an old ticket (created more than 30 days ago, with no customer reply), move it to the same department and clear its owner. It waits unassigned.</li><li>Turn the department threshold off and turn on "Assign backlogs".</li><li>After a few minutes, open both tickets and look at the owner and the History tab.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>The new ticket is assigned from the backlog.</li><li>The old ticket is left out because of the 30-day rule, and its History (or the backlog view) says why, for example "Not assigned: no customer reply in the last 30 days".</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The new ticket (#2453) was assigned to Test User 1 13 seconds after the backlog was released; its History says "Taken from the backlog".</li><li>The old ticket (#1) was still unassigned 32 minutes later.</li><li>Its History shows only the reopen, the move and the owner change. Nothing says it was skipped or why.</li><li>Same result on 9 Nov (twice) and 10 Nov.</li></ul>'
      + '<p><strong>Environment</strong></p><p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account; QA AS6 Dept B, round robin rule "QA E18 manual"; 10 Nov 2026 10:02–10:36 UTC. Zoho Desk was not checked live for a skip reason.</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (E18-03-backlog-skips-old-ticket-without-reason.png): TAVI\'s 30-day rule text, the new ticket taken from the backlog, and the old ticket still unassigned with no reason in its History.</p>' }];

async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'evidence/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length }); if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v);
  fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id);
  return 'attached ' + (await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true })).s;
}
(async () => {
  for (const b of bugs) {
    if (done[b.key]) { console.log(b.key, 'already filed', done[b.key].seq); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: b.html, priority: b.priority, state: BUG, labels: b.labels, assignees: ASSIGNEES, start_date: '2026-11-10' });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id, title: b.name, priority: b.priority, image: 'evidence/annotated/' + b.image }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    const back = await call('GET', `/work-items/${id}/`); const att = await call('GET', `/work-items/${id}/attachments/`);
    console.log(b.key, '->', done[b.key].seq, '| module', m.s, '| cycle', cy.s, '|', a, '| state ok', back.j.state === BUG, '| attachments', (Array.isArray(att.j) ? att.j : att.j.results || []).length);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
