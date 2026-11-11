// Files SL-51, NT-24, SL-21, SL-22 (user, 10 Nov 2026: file the 4 cases that differ from Zoho as bugs with annotated evidence, Zoho behaviour as expected; and no. 5). Plane REST, key never printed.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-zoho4.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };

const SLA = 'eebb0fe0-596b-4764-a971-3caa2b20071d', AEO = 'e449cd35-5c91-4f32-8359-6aabc6ce08ff', MAIL = '6b131130-3422-4cce-8563-338328b44671';
const ENV = '<p><strong>Environment</strong></p><p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account. Zoho Desk behaviour is taken from the Zoho Desk help pages (not checked in a live Zoho Desk, because Zoho Setup pages do not load on our network).</p>';
const bugs = [
  { key: 'SL-51', priority: 'medium', labels: [SLA, AEO], image: 'SL-51-removed-agent-dropped-from-escalation-not-replaced-vs-zoho.png',
    name: 'SLA | Removing an agent drops them from SLA escalations instead of handing the escalation to another agent',
    html: '<p><strong>Summary</strong></p><p>When an admin removes an agent who is named in an SLA escalation, TAVI only offers a replacement for the agent\'s open tickets. The agent is just taken out of the escalation. An escalation level that named only that agent is left with nobody to notify, and the admin is not asked who should take it over. Zoho Desk asks for a replacement agent and puts that agent into the escalation.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Go to Setup › SLA &amp; Escalation and open an SLA policy in a department.</li><li>In an escalation level, choose one agent in "Notify" and save.</li><li>Go to Setup › Agents, open the actions menu for that agent and choose "Remove from Desk".</li><li>Read the dialog.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>As in Zoho Desk: when the agent is removed, the admin chooses another agent (or chooses to leave it empty), and that agent replaces the removed one in the SLA escalations ("whom to escalate"), as well as in assignment rules and other places.</li><li>The escalation keeps notifying someone after the agent is removed.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The dialog offers a replacement only for open tickets ("Customer Support: Leave unassigned").</li><li>It lists "SLA escalations: 1" and says escalations "stop naming this agent; a rule that only named them is turned off".</li><li>There is no way to choose who takes over the escalation, so a level that named only this agent will notify nobody.</li></ul>'
      + ENV + '<p>Agent "Test SL-51" in QA AO Dept A, named alone in level 1 of SLA policy "QA AO SL51d…" (10 Nov 2026, 15:30 UTC). The removal was not confirmed, because the agent also owns another team\'s open ticket. Zoho source: help.zoho.com "Adding and managing agents" › Deleting agents.</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (SL-51-removed-agent-dropped-from-escalation-not-replaced-vs-zoho.png): the TAVI Remove from Desk dialog next to the Zoho Desk help text.</p>' },
  { key: 'NT-24', priority: 'medium', labels: [AEO, MAIL], image: 'NT-24-bulk-close-sends-closed-mail-vs-zoho.png',
    name: 'Notifications | Closing tickets in bulk sends the "ticket closed" email to every customer',
    html: '<p><strong>Summary</strong></p><p>When an agent selects several tickets in the list and closes them together, TAVI sends the "Your ticket has been closed" email to the customer of every ticket. Zoho Desk does not send notification emails when tickets are closed in bulk, so a mass clean-up does not flood customers with emails.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Make sure the "ticket closed" customer notification is on for the department.</li><li>Open Tickets › All Tickets in Table View.</li><li>Tick two open tickets that have a customer with an email address.</li><li>Click Close and confirm "Close 2 tickets".</li><li>Open each ticket and look at the conversation.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>The tickets are closed.</li><li>As in Zoho Desk: no "ticket closed" email is sent, because notification rules do not run when tickets are closed with a bulk action.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>Both tickets are closed.</li><li>Each ticket shows a "Your ticket #… has been closed" email sent by System to the customer (#2664 and #2665, 10 Nov 2026 18:09 Cairo time).</li></ul>'
      + ENV + '<p>QA AO Dept A, tickets #2664 and #2665, 10 Nov 2026 16:09 UTC. Zoho source: help.zoho.com "Performing bulk updates" › Closing tickets: "Notification rules will not be triggered when tickets are closed using bulk actions."</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (NT-24-bulk-close-sends-closed-mail-vs-zoho.png): the bulk close, the closed email on the ticket, and the Zoho Desk help note.</p>' },
  { key: 'SL-21', priority: 'medium', labels: [SLA, AEO], image: 'SL-21-escalation-skips-chosen-agents-without-ticket-access-vs-zoho.png',
    name: 'SLA | Escalation does not notify the agents chosen in it when they cannot see the ticket',
    html: '<p><strong>Summary</strong></p><p>An SLA escalation can name any agent, including agents from other departments. When the escalation fires, TAVI skips every chosen agent who cannot see the ticket, and only the ticket History shows it. In the test, nobody was notified. In Zoho Desk, the users chosen in the escalation are emailed when the SLA is violated.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Go to Setup › SLA &amp; Escalation and create an SLA policy in a department, with a 1-minute first response target.</li><li>In escalation level 1 (at due), choose two agents in "Notify": one from another department and one from this department.</li><li>Create a ticket in the department that matches the policy, owned by another agent, and wait 2 minutes.</li><li>Open the ticket and go to the History tab.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>As in Zoho Desk: an email notification is sent to the users chosen in the escalation when the SLA is violated.</li><li>If TAVI does limit who can be notified, the escalation editor should say so when the agent is chosen, not skip the agent silently later.</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>The ticket shows SLA Violated and SLA Escalated.</li><li>History, SLA escalation level 1: "Mahmoud Samy · Skipped: No access to the ticket", "Mahmoud TAVIPortal · Skipped: No access to the ticket", "Skipped: No one to notify".</li><li>No email is sent, and the policy editor gave no warning when these agents were chosen.</li></ul>'
      + ENV + '<p>QA AO Dept A, SLA policy "QA AO SL214oya", ticket #2663, 10 Nov 2026 16:01 UTC. Mahmoud TAVIPortal works in Tech only. Ticket data sharing is Private. Zoho source: help.zoho.com "Creating and using SLAs": "An email notification is sent to the selected users when the SLA is violated."</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (SL-21-escalation-skips-chosen-agents-without-ticket-access-vs-zoho.png).</p>' },
  { key: 'SL-22', priority: 'high', labels: [SLA, AEO, MAIL], image: 'SL-22-escalation-email-never-reaches-department-agent-vs-zoho.png',
    name: 'SLA | The agent chosen in an SLA escalation gets no email, even as a member and admin of the ticket\'s department',
    html: '<p><strong>Summary</strong></p><p>An SLA escalation that notifies an agent of the ticket\'s own department sends no email. The agent is a Desk Administrator and a member of the department, but with ticket data sharing set to Private they cannot see a ticket owned by another agent. The escalation skips them as "No access to the ticket" and ends with "No one to notify". Tickets created by an agent are owned by that agent (NDC-2840), so in practice escalations reach almost nobody. Same cause as {{SL21}}, but here the agent belongs to the department.</p>'
      + '<p><strong>Steps to Reproduce</strong></p><ol><li>Check that Setup › Ticket Access › Data sharing for tickets is "Private".</li><li>Go to Setup › SLA &amp; Escalation and create an SLA policy in a department, with a 1-minute first response target.</li><li>In level 1 (at due) choose an agent who is a member of that department, with a custom escalation email template. In level 2 (1 minute after due) choose the same agent with the default template.</li><li>As another agent, create a ticket in the department that matches the policy, and wait 3 minutes.</li><li>Check the chosen agent\'s mailbox, then open the ticket\'s History tab.</li></ol>'
      + '<p><strong>Expected Result</strong></p><ul><li>As in Zoho Desk: the agent chosen in the escalation gets an email at each level (the custom template at level 1, the default at level 2).</li></ul>'
      + '<p><strong>Actual Result</strong></p><ul><li>No escalation email arrived in the agent\'s mailbox (checked by the user for runs on 9 Nov and on 10 Nov at 17:37 Cairo time).</li><li>History on both levels: "Mahmoud Samy · Skipped: No access to the ticket", then "Skipped: No one to notify".</li><li>The ticket shows SLA Violated and SLA Escalated, so the escalation itself ran.</li></ul>'
      + ENV + '<p>QA AO Dept A, SLA policy "QA AO SL224oya", ticket #2662, 10 Nov 2026 16:01–16:02 UTC; earlier runs SL22pczr (9 Nov) and SL22jof1 (10 Nov 15:37 UTC). Agent Mahmoud Samy: Desk Administrator, member of QA AO Dept A. Zoho source: help.zoho.com "Creating and using SLAs".</p>'
      + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (SL-22-escalation-email-never-reaches-department-agent-vs-zoho.png).</p>' }];

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
    const c = await call('POST', '/work-items/', { name: b.name, description_html: b.html.replace('{{SL21}}', (done['SL-21']||{}).seq||'the SL-21 bug'), priority: b.priority, state: BUG, labels: b.labels, assignees: ASSIGNEES, start_date: '2026-11-10' });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id, title: b.name, priority: b.priority, image: 'evidence/annotated/' + b.image }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    const back = await call('GET', `/work-items/${id}/`); const att = await call('GET', `/work-items/${id}/attachments/`);
    console.log(b.key, '->', done[b.key].seq, '| module', m.s, '| cycle', cy.s, '|', a, '| state ok', back.j.state === BUG, '| attachments', (Array.isArray(att.j) ? att.j : att.j.results || []).length);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
