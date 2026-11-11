// Files the held bug batch (user, 10 Nov 2026: "file the found bugs with annotated evidence"): SL-62, SL-38, SL-57, SL-54.
// NT-16 no longer reproduces (not filed); NT-07 waits on the user's Gmail check (not filed).
// Plane REST with the API key from Downloads (never printed); same fields as NDC-2825/2826.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads';
const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3';
const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const LABEL_SLA = 'eebb0fe0-596b-4764-a971-3caa2b20071d', LABEL_AO = 'e449cd35-5c91-4f32-8359-6aabc6ce08ff';
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2';
const CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..');
const OUTF = path.join(RUN, 'plane-filed-batch.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const ENV = '<p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, 1440×900, owner account, 10 Nov 2026. Compared with Zoho Desk help articles (live Zoho Desk did not load on this network).</p>';
const ATT = img => '<p><strong>Attachment</strong></p><p>Annotated comparison attached (' + img + ').</p>';

const bugs = [
  {
    key: 'SL-62', priority: 'high', image: 'SL-62-countdown-mode-columns-fail-vs-zoho.png',
    name: 'Tickets | Countdown Mode does not load: 6 of 7 columns show "Couldn\'t load these tickets"',
    html: '<p><strong>Summary</strong></p><p>Switching a ticket view to Countdown Mode shows the seven columns, but six of them (Overdue, No Due Date, Due in 1 hour, Due today, Due tomorrow, Due later) show "Couldn\'t load these tickets" and a message "At most 25 filter conditions are allowed." Only the On Hold column loads. Retry does not help, so Countdown Mode cannot be used.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Sign in as an admin who belongs to many departments (the owner account here).</li><li>Go to Tickets and open the All Tickets view.</li><li>Open the view-mode menu at the top right and choose Countdown Mode.</li><li>Wait for the columns to load, then click Retry in any column.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>Each column lists the tickets that fall in it, as in Zoho Desk\'s Countdown Mode (up to seven columns by due time).</li><li>No error message.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>Overdue, No Due Date, Due in 1 hour, Due today, Due tomorrow and Due later all show "Couldn\'t load these tickets".</li><li>A message appears: "At most 25 filter conditions are allowed."</li><li>Retry fails the same way. Only On Hold shows tickets.</li></ul>'
      + '<p><strong>Note for developers</strong></p><p>Each column request to the tickets list sends more than 25 filter conditions and is refused with INVALID_FILTERS. Seen as the owner (member of about 40 departments); it reproduced on 9 and 10 Nov.</p>'
      + '<p><strong>Environment</strong></p>' + ENV + ATT('SL-62-countdown-mode-columns-fail-vs-zoho.png')
  },
  {
    key: 'SL-38', priority: 'medium', image: 'SL-38-sla-applied-after-allowance-used-up-vs-zoho.png',
    name: 'SLA | When a support plan\'s ticket allowance is used up, the plan\'s SLA still runs on the next tickets',
    html: '<p><strong>Summary</strong></p><p>A ticket-based support plan (for example 1 ticket per month) should only cover that number of tickets. In Desk, once the allowance is used up, the next ticket from the same customer still gets the same SLA, now shown as "Department policy", with response and resolution timers running. The ticket even says "The support plan\'s ticket allowance is used up for this cycle." In Zoho Desk, "the remaining tickets will not adhere to the selected SLA".</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>In Setup › SLA &amp; Escalation, create an SLA for a department with "Execute only when associated with an Account" turned on.</li><li>In Support Plans, create a ticket-based plan with that SLA and an allowance of 1 ticket per month.</li><li>Create an account and a contract for it in the same department, using that plan.</li><li>Create a ticket for that account. Open it and look at the SLA panel: it is covered by the contract and plan, "0 tickets left".</li><li>Create a second ticket for the same account and open its SLA panel.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>The second ticket does not get the plan\'s SLA, because the allowance is used up.</li><li>No response or resolution timers run for it from that SLA.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The second ticket gets the same SLA, shown as "Covered by: Department policy".</li><li>First response and resolution are both "Running" and will escalate.</li><li>The panel shows "The support plan\'s ticket allowance is used up for this cycle." but it has no effect.</li><li>A ticket with no account gets no SLA from this policy, so the allowance is the only thing that is ignored.</li></ul>'
      + '<p><strong>Environment</strong></p>' + ENV + ATT('SL-38-sla-applied-after-allowance-used-up-vs-zoho.png')
  },
  {
    key: 'SL-57', priority: 'low', image: 'SL-57-template-used-by-sla-deleted-without-warning-vs-zoho.png',
    name: 'SLA | An escalation email template that an SLA uses can be deleted with no warning',
    html: '<p><strong>Summary</strong></p><p>An escalation email template chosen in an SLA escalation level can be deleted from Email Templates with only a generic confirmation. Nothing says an SLA uses it. Afterwards the SLA silently falls back to the default escalation email, and the admin only finds out by opening that SLA target ("A template that no longer exists"). Desk already refuses to delete business hours that an SLA uses, so templates behave differently.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Create an escalation email template (Agent Notification, SLA escalation) in Setup › Email Templates.</li><li>In Setup › SLA &amp; Escalation, create an SLA whose response escalation level 1 uses that template, and save.</li><li>Go back to Setup › Email Templates, open the template\'s actions menu and click Delete.</li><li>Read the confirmation and click Delete.</li><li>Open the SLA again, go to its target and look at the escalation\'s Agent Notification Template.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>When deleting, the admin is told the template is used by an SLA (name it), and either cannot delete it or is asked to pick a replacement.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The dialog only says "will be deleted. This can\'t be undone from this page."; the template is deleted.</li><li>The SLA now shows "A template that no longer exists" and "The default escalation email is being used". This is visible only inside the target editor.</li></ul>'
      + '<p><strong>Note</strong></p><p>Zoho\'s help covers only the delete steps (public templates cannot be deleted); what Zoho does for a template an SLA uses is not documented and was not seen live. Low priority because escalations still go out with the default email.</p>'
      + '<p><strong>Environment</strong></p>' + ENV + ATT('SL-57-template-used-by-sla-deleted-without-warning-vs-zoho.png')
  },
  {
    key: 'SL-54', priority: 'low', image: 'SL-54-before-due-escalation-longer-than-target-vs-zoho.png',
    name: 'SLA | A "Before due" escalation longer than the target time can be saved',
    html: '<p><strong>Summary</strong></p><p>An SLA target can respond within 1 hour while its escalation is set to "Before due by 2 hours". That escalation would be due an hour before the ticket even exists. The editor and the server accept it without any message. Levels that are out of order are already refused, so this one check is missing.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Go to Setup › SLA &amp; Escalation and click New SLA. Enter a name, tick Ticket Create and click Next.</li><li>Click Add Target. Set Respond Within to 1 Hours.</li><li>Turn on Response Escalation. In Level 1 set When to Escalate to "Before due" and By to 2 Hours.</li><li>Save the target, then save the SLA.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>The target cannot be saved and a message says the Before-due time must be shorter than the target time.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The target and the SLA save with no message.</li><li>The saved SLA has a 1-hour response target and an escalation 2 hours before it is due.</li></ul>'
      + '<p><strong>Environment</strong></p>' + ENV + ATT('SL-54-before-due-escalation-longer-than-target-vs-zoho.png')
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
    const c = await call('POST', '/work-items/', { name: b.name, description_html: b.html, priority: b.priority, state: BUG, labels: [LABEL_AO, LABEL_SLA], assignees: ASSIGNEES, start_date: '2026-11-10' });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id, priority: b.priority, title: b.name, image: 'evidence/annotated/' + b.image }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    console.log(b.key, '->', done[b.key].seq, 'module', m.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
