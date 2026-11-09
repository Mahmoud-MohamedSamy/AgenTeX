// Files SL-12 and SL-30 as Plane bugs (user asked 9 Nov 2026: "file the 2 Fails with annotated evidence").
// Uses the Plane API key from Downloads via ../../execu_2026-11-06_desk-assignment-skills/scripts/plane.js helpers (key never printed).
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3';
const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const LABEL_SLA = 'eebb0fe0-596b-4764-a971-3caa2b20071d';
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2';
const CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..');
const OUTF = path.join(RUN, 'plane-filed-sla.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const ENV = '<p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, 1440×900, owner account, 9 Nov 2026. Compared with Zoho Desk help and API documentation (live Zoho Desk did not load on this network).</p>';

const bugs = [
  {
    key: 'SL-30', priority: 'high', image: 'SL-30-sla-not-reset-on-update-vs-zoho.png',
    name: 'SLA | Updating a ticket does not restart an SLA that is set to run on Ticket Update',
    html: '<p><strong>Summary</strong></p><p>An SLA set to run on Ticket Create and Ticket Update is applied when the ticket is created, but editing the ticket afterwards does not restart it. The response and resolution due times stay counted from the creation time. In Zoho Desk, when several options are selected, the SLA resets for each update.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Go to Setup › SLA &amp; Escalation and create an SLA for a department.</li><li>Under "When do you want to execute the SLA", tick Ticket Create and select Ticket Update.</li><li>Add a target (for example respond within 30 minutes, resolve within 2 hours) and save.</li><li>Create a ticket in that department that matches the target. Note the Due Date and Response Due Date in Ticket Properties.</li><li>Wait a few minutes, then change a field on the ticket (for example Priority from High to Medium) and save.</li><li>Reload the ticket and look at the Due Date, the Response Due Date and the Activity tab.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>The update starts the SLA again, as Zoho does ("If multiple options are selected, the SLA will reset for each update").</li><li>The Due Date and Response Due Date are counted again from the time of the update.</li><li>The Activity tab shows the SLA being applied again.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>Nothing changes. Ticket #1769 was created at 2:42 PM and its priority was changed at 2:54 PM; the Due Date stayed 4:42 PM and the Response Due Date stayed 3:12 PM.</li><li>The Activity tab shows only the first "SLA applied", from creation.</li><li>So the Ticket Update option has no effect once the ticket has an SLA.</li></ul>'
      + '<p><strong>Environment</strong></p>' + ENV
      + '<p><strong>Attachment</strong></p><p>Annotated comparison with Zoho attached (SL-30-sla-not-reset-on-update-vs-zoho.png).</p>'
  },
  {
    key: 'SL-12', priority: 'medium', image: 'SL-12-sla-no-number-date-operators-vs-zoho.png',
    name: 'SLA | Target conditions offer no number or date operators (greater than, less than, between, before, after)',
    html: '<p><strong>Summary</strong></p><p>When you add a condition to an SLA target, every field gets the same four operators: is, isn\'t, is empty and is not empty. Number and date fields have no greater than, less than, between, is before or is after. Zoho Desk offers these for its SLA conditions, so targets such as "amount greater than 1,000" or "due date before a date" cannot be set up in Desk.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Go to Setup › SLA &amp; Escalation and click New SLA.</li><li>Enter a name, tick Ticket Create and click Next.</li><li>Click Add Target and choose "Tickets matching certain conditions".</li><li>In the condition, choose a number field (for example QA NDC Amount).</li><li>Open the operator list.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>Number fields offer comparisons such as less than, greater than and between.</li><li>Date fields offer is before, is after, between and not between, as in Zoho Desk.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The operator list shows only is, isn\'t, is empty and is not empty.</li><li>There is no way to compare a number or a date in an SLA target condition.</li></ul>'
      + '<p><strong>Environment</strong></p>' + ENV
      + '<p><strong>Attachment</strong></p><p>Annotated comparison with Zoho attached (SL-12-sla-no-number-date-operators-vs-zoho.png).</p>'
  }
];

async function attach(id, file) {
  const buf = fs.readFileSync(path.join(RUN, 'evidence/annotated', file));
  const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: file, type: 'image/png', size: buf.length });
  if (r1.s >= 300) return 'step1 ' + r1.s;
  const up = r1.j.upload_data; const fd = new FormData();
  for (const [k, v] of Object.entries(up.fields)) fd.append(k, v);
  fd.append('file', new Blob([buf], { type: 'image/png' }), file);
  const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) return 'step2 ' + r2.status;
  const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id);
  const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true });
  return 'attached ' + r3.s;
}

(async () => {
  for (const b of bugs) {
    if (done[b.key]) { console.log(b.key, 'already filed', done[b.key].seq); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: b.html, priority: b.priority, state: BUG, labels: [LABEL_SLA], assignees: ASSIGNEES, start_date: '2026-11-09' });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    console.log(b.key, '->', done[b.key].seq, 'module', m.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
