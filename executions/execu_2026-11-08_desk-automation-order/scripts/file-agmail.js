// Files the agent-notification email bug (user, 11 Nov 2026: "file it as high with annotated evidence and comment on NDC-2853"). Plane REST with the API key (never printed).
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const AEO = 'e449cd35-5c91-4f32-8359-6aabc6ce08ff', MAIL = '6b131130-3422-4cce-8563-338328b44671';
const NDC2853 = 'ce98ef15-863f-4d40-b8e6-813425f2b132';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-agmail.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const IMG = 'AG-MAIL-agent-notification-email-not-sent-with-default-template-vs-zoho.png';
const name = 'Notifications | Agent notification rules with Email on send no email, only the in-app notification, unless a custom template is chosen';
const html = '<p><strong>Summary</strong></p><p>Agent notification rules such as "Assigning a ticket" show Email switched on and "Sent as: in-app notification + email", but with the default template they send only the in-app notification. No email reaches the agent. The default template is called "the in-app notification only", and a hint says to choose a template to also send an email. In Zoho Desk, an enabled agent notification rule sends the email with its predefined template; customising the template is optional. Agents who are not looking at Desk never hear about tickets assigned to them, ratings or comments.</p>'
  + '<p><strong>Steps to Reproduce</strong></p><ol><li>Go to Setup › Customization › Notifications and choose a department.</li><li>Under Agent Notifications, look at "Assigning a ticket": Email is on and the template is "Default — the in-app notification only".</li><li>As the agent, open My Notifications and check that the Email channel and "Tickets assigned to you" email are on.</li><li>Assign a ticket in that department to the agent.</li><li>Check the agent\'s bell and the agent\'s mailbox (including Spam).</li></ol>'
  + '<p><strong>Expected Result</strong></p><ul><li>As in Zoho Desk: the agent gets an email for the assignment, using the rule\'s predefined template, because the rule\'s Email switch is on.</li><li>The same for the other agent rules with Email on (ticket rating, comment added, ticket assigned to the agent\'s team).</li><li>If TAVI keeps an "in-app only" default, the row must not say Email on and "Sent as: in-app notification + email".</li></ul>'
  + '<p><strong>Actual Result</strong></p><ul><li>The bell shows "Ticket #2859 assigned to you", "Ticket #2818 assigned to you" and "Good rating on ticket #2818".</li><li>None of these emails arrived in the agent\'s mailbox (Mahmoud Samy, checked by the user, 11 Nov 2026).</li><li>A newly invited agent got no emails either: "Ticket #2856 assigned to you", a comment on #2856, and team ticket #2858.</li><li>The rule row shows Email on and "Sent as: in-app notification + email", and the template is "Default — the in-app notification only".</li></ul>'
  + '<p><strong>Environment</strong></p><p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10. Department QA AO Dept A; agents Mahmoud Samy (Desk Administrator) and a new test agent; 11 Nov 2026, 09:48–11:33 UTC. Customer emails from the same department (ticket closed, rating request) do arrive, so outgoing mail works. Zoho source: help.zoho.com "Managing Notification Rules/Triggers in Zoho Desk": "notifications can be sent via e-mail" and "The notification rules have their predefined template" (help page, not checked in a live Zoho Desk).</p>'
  + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (' + IMG + '): the rule row, the agent\'s bell and settings, and the Zoho Desk help text.</p>';
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
  if (!done.bug) {
    const c = await call('POST', '/work-items/', { name, description_html: html, priority: 'high', state: BUG, labels: [AEO, MAIL], assignees: ASSIGNEES, start_date: '2026-11-11' });
    if (!c.j || !c.j.id) { console.log('create failed', c.s, JSON.stringify(c.j).slice(0, 300)); return; }
    done.bug = { id: c.j.id, seq: 'NDC-' + c.j.sequence_id, title: name, priority: 'high', image: 'evidence/annotated/' + IMG }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [c.j.id] }); const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [c.j.id] });
    const a = await attach(c.j.id, IMG); const back = await call('GET', `/work-items/${c.j.id}/`); const att = await call('GET', `/work-items/${c.j.id}/attachments/`);
    console.log('filed', done.bug.seq, '| module', m.s, '| cycle', cy.s, '|', a, '| state ok', back.j.state === BUG, '| priority', back.j.priority, '| attachments', (Array.isArray(att.j) ? att.j : att.j.results || []).length);
  } else console.log('already filed', done.bug.seq);
  if (!done.comment2853) {
    const ch = '<p><strong>Related: ' + done.bug.seq + '</strong></p><p>On 11 Nov 2026 we found that agent notification rules with the default template send no email at all, only the in-app notification (' + done.bug.seq + '). The cause stated here (the chosen agent is skipped as "No access to the ticket") is still what the ticket History shows. But when this is fixed, please also check that the escalation email actually reaches the agent\'s mailbox, because agent emails are not arriving for other notifications either.</p>';
    const r = await call('POST', `/work-items/${NDC2853}/comments/`, { comment_html: ch });
    done.comment2853 = r.s; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2)); console.log('comment on NDC-2853', r.s);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
