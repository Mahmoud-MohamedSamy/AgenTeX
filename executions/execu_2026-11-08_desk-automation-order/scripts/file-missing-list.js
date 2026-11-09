// Files the Desk automation missing list as ONE Plane item with the 15 annotated images (user, 9 Nov 2026: file it, Bug, Medium,
// Desk, Sprint 15, assignees as NDC-2811; exclusions: contact fields in criteria, AI owner suggestion, Zoho Cliq action, AI actions).
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const f = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, f), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const BASE = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-missing-list.json');
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const li = a => a.map(x => `<li><p>${x}</p></li>`).join('');
const ol = (start, a) => `<ol start="${start}">${a.map(x => `<li>${x}</li>`).join('')}</ol>`;
const html = [
  '<p><strong>Summary</strong></p>',
  '<p>We compared the Desk automations (direct assignment, workflow rules, SLA, round robin, blueprint, notifications, macros) with Zoho Desk. This ticket lists what Zoho has and Desk does not have yet. Each item has an annotated image: Desk on the left, seen live on NDC-Staging on 9 Nov 2026; Zoho on the right, from Zoho\'s help pages because live Zoho Desk did not load on our network. The image file name starts with the item number.</p>',
  '<p><strong>Already done in Desk</strong></p>',
  `<ul>${li([
    'Predefined views Response Overdue Tickets and SLA Violated Tickets.',
    'SLA Tickets static report, and SLA metrics in the Agent Performance report.',
    'SLA Dashboard with violations grouped by hour and date.',
    'Countdown Mode in the ticket list (it has a loading bug, reported separately).',
    'Contract expiry notification (whom to notify, days before).',
    'Applying a macro to several selected tickets from the ticket list (More › Macro).',
    'Business hours with holidays; SLA due times count only open hours and skip holidays.',
    'Desk also has more than Zoho: up to 50 SLA targets (Zoho 10), reapplying an SLA to open tickets, macro comment and resolution actions, and rating-received and reply-not-delivered notification rules.'
  ])}</ul>`,
  '<p><strong>Missing — workflow rules</strong></p>',
  ol(1, ['Email alerts to typed outside addresses. Zoho has "Additional Recipients"; Desk says "Free-text addresses aren\'t allowed".']),
  '<p><strong>Missing — SLA and business hours</strong></p>',
  ol(2, ['Business hours that run past midnight (for example 10:00 PM to 1:00 AM). Desk refuses them: "End time must be after start time".']),
  '<p><strong>Missing — blueprint</strong></p>',
  ol(3, ['Widgets inside a transition. Desk offers fields, a checklist and an instructional message only.']),
  '<p><strong>Missing — notifications</strong></p>',
  ol(4, [
    'Agent rule "Assigning a blueprint transition".',
    'Contact rule "Receiving a reply" (a new reply on the requester\'s ticket).',
    'CC rule "Receiving a reply". Desk has only the CC acknowledgement.',
    'Separate rules for calls, tasks and events. Desk has one rule each for assigning, completing and mentioning an activity, shared by all three.',
    'Turning off one department\'s notifications for an agent. Desk\'s My Notifications has channels and signal types only, for all departments at once.'
  ]),
  '<p><strong>Missing — macros</strong></p>',
  ol(9, [
    'Custom function action. Desk has 9 macro actions and none runs a custom function.',
    'Reusing saved actions in macros. Workflow rules have "Use a saved action"; macros do not.',
    'Macro runs in the Bulk Actions Log. Today the log shows only mass delete, import, export, Recycle Bin bulk and data backup.'
  ]),
  '<p><strong>Missing — other automation</strong></p>',
  ol(12, [
    'Supervisor rules (time-based automation), for example acting on tickets with no reply for 2 days.',
    'Automation Studio.',
    'Schedules (run a custom action at a set time or on repeat).',
    'A webhook list and API pages in Setup. Today a webhook exists only as an action inside a workflow rule.'
  ]),
  '<p><strong>Could not be checked</strong></p>',
  `<ul>${li([
    'Five more possible gaps need live Zoho Desk to confirm, because Zoho\'s help pages do not settle them: workflow conditions on Name and To Address; choosing a public or private reply in a blueprint transition; a separate holiday list for a blueprint state; an agent filter on the Blueprint dashboard; saving a half-done transition. Please give us a working Zoho Desk session (live Zoho did not load on our network) so we can confirm and add them.'
  ])}</ul>`,
  '<p><strong>Additional notes</strong></p>',
  `<ul>${li([
    'Filed separately as bugs: NDC-2825 (an SLA set to run on Ticket Update does not restart when the ticket is updated) and NDC-2826 (SLA target conditions have no number or date operators; this was an item of this list).',
    'Left out on purpose: more contact fields in assignment criteria, AI suggestion of a ticket owner, the Zoho Cliq notification action, AI actions, SMS sending, instant messaging and mobile apps.',
    'Not gaps: a workflow rule in Zoho also takes one "Execute on" option, so Desk is the same there; support plan types HOURS and PRICE exist only in Zoho\'s API.',
    'Possible bug to check separately: Countdown Mode cannot load 6 of its 7 columns for a user in many departments ("At most 25 filter conditions are allowed").',
    'Possible bug to check separately: an email template can be deleted while an SLA escalation level uses it, with no warning.',
    'Possible bug to check separately: with many tickets created at once, some did not get their SLA, and "reapply to open tickets" queued 134 of 300.',
    'Test spec: docs/desk-automation-execution-order/spec-desk-automation-order.md and docs/desk-sla-escalation/spec-desk-sla-escalation.md in the QA repository.',
    'Nothing was left changed on the tenant for this list; screens were opened read-only and edits were cancelled.'
  ])}</ul>`,
  '<p><strong>Environment</strong></p>',
  '<p>staging-desk.taviportal.com (NDC-Staging), Microsoft Edge on Windows 10, 1440×900, owner account, 9 Nov 2026. Zoho Desk help.zoho.com articles, 9 Nov 2026.</p>'
].join('');
(async () => {
  const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
  if (!done.id) {
    const c = await call('POST', '/work-items/', { name: 'Desk Automation: features Zoho Desk has that Desk is missing', description_html: html, priority: 'medium', state: '34a7f4b6-7207-4955-b927-0d8d1dd3c666', labels: ['e449cd35-5c91-4f32-8359-6aabc6ce08ff'], assignees: ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'], start_date: '2026-11-09' });
    if (!c.j || !c.j.id) { console.log('create failed', c.s, JSON.stringify(c.j).slice(0, 300)); return; }
    done.id = c.j.id; done.seq = 'NDC-' + c.j.sequence_id; done.files = {}; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    console.log('created', done.seq, 'module', (await call('POST', '/modules/274a73de-564a-4b8c-8b51-74fe8304e7c2/module-issues/', { issues: [done.id] })).s, 'cycle', (await call('POST', '/cycles/3a5ac486-3f65-4632-ab05-8f790e61c7b0/cycle-issues/', { issues: [done.id] })).s);
  }
  const dir = path.join(RUN, 'evidence/annotated');
  const files = fs.readdirSync(dir).filter(n => /^\d\d-.*\.png$/.test(n)).sort();
  for (const name of files) {
    if (done.files[name]) continue;
    const buf = fs.readFileSync(path.join(dir, name));
    const r1 = await call('POST', `/work-items/${done.id}/attachments/`, { name, type: 'image/png', size: buf.length }); if (r1.s >= 300) { console.log(name, 'step1', r1.s); continue; }
    const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), name);
    const r2 = await fetch(up.url, { method: 'POST', body: fd }); if (r2.status >= 300) { console.log(name, 'step2', r2.status); continue; }
    const aid = r1.j.asset_id || (r1.j.attachment && r1.j.attachment.id);
    const r3 = await call('PATCH', `/work-items/${done.id}/attachments/${aid}/`, { is_uploaded: true });
    done.files[name] = r3.s; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
  }
  console.log(done.seq, 'attachments', Object.keys(done.files).length, 'of', files.length);
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
