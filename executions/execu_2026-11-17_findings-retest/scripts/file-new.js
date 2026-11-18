// Files new findings N1-N6 (user 18 Nov: "file the new findings => N1 and N2 mahmoud hegazy mfathy, N3 - N6 mahmoud hegazy eahmed"). Bug, Desk module, current sprint, one annotated image each.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2';
const MAHMOUD = 'e1364b0b-d3cd-4167-8261-6194577a480a', HEGAZY = '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b', MFATHY = '82cf7a79-0707-4f47-97ca-f8926587b6db', EAHMED = '9529016b-e67d-42b9-815c-263f673b8252';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-new.json'); const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com, NDC-Staging, Edge + API, owner account (ndc-staging-owner); found 17 Nov 2026 during the findings retest, N1 checked again 18 Nov. Test data deleted after.';
const BUGS = {
  N1: { title: 'Workflow Rules | Execution History cannot be reached from the app; it opens only by typing its address', labels: ['Workflow Rules'], img: 'N1-execution-history-no-link.png', who: [MAHMOUD, HEGAZY, MFATHY],
    summary: 'The Execution History page (every workflow and assignment-rule run) works at /settings/workflow-executions, but no menu, button or link in the app leads to it. Admins cannot find the run history unless they know the address.',
    steps: ['Sign in as an admin and open Setup › Automation › Workflow Rules.', 'Look for a way to open the runs of the rules (header, tabs, filters).', 'Open any rule and look again.', 'Look through the Setup menu (Automation section).', 'Type /settings/workflow-executions in the address bar.'],
    expected: 'An "Execution History" link on the Workflow Rules page or in the Setup menu, and a link from each rule to its own runs.',
    actual: 'Steps 2-4: no link anywhere (the Workflow Rules page has only "New Rule", the All / Active / Inactive tabs and filters; the Automation menu lists Workflow Rules, Actions, SLA & Escalation, Support Plans, Assignment Rules, Macros, Blueprints, AI Tagging, Ticket Archiving, Time Tracking). Step 5: the page opens and works; no Setup menu item is highlighted.' },
  N2: { title: 'Workflow Rules | A rule saved through the API with another department\'s tag: the tag is silently not applied and the run says Succeeded', labels: ['Workflow Rules'], img: 'N2-api-tag-other-dept-silent.png', who: [MAHMOUD, HEGAZY, MFATHY],
    summary: 'The rule editor now offers only the rule department\'s tags (NDC-3058), but the API still accepts another department\'s tag on Add Tags. At run time that tag is not added to the ticket, while Execution History reports Add Tags "Succeeded" and still lists the tag under Target.',
    steps: ['Create a Desk workflow rule limited to QA AO Dept A, On Edit, with Add Tags.', 'Through the API, PATCH the rule\'s Add Tags action with a tag that belongs to Customer Support (e.g. "QA WF tag A" of Customer Support).', 'Edit a QA AO Dept A ticket so the rule runs.', 'Read the ticket\'s tags and the run in Execution History.'],
    expected: 'Step 2 is refused (422), as the editor only offers the department\'s tags; or, at run time, the action is shown as failed with the reason.',
    actual: 'Step 2: 200, stored. Step 4: the Customer Support tag is not on the ticket; Execution History shows Add Tags "Succeeded" and the dropped tag id under Target (run 0d751c04, ticket #5098, 17 Nov 16:06:57 UTC).' },
  N3: { title: 'Contracts | After a department-only change, coverage counts the other department\'s support plan as active', labels: ['SLA & Business Hours'], img: 'N3-contract-coverage-other-plan.png', who: [MAHMOUD, HEGAZY, EAHMED],
    summary: 'Changing only a contract\'s department is accepted and keeps the old department\'s support plan on the contract (reported with NDC-2841 / finding F06). The coverage check then reports that other department\'s plan as active on the contract. In round 20 (16 Nov) the same check reported no plan.',
    steps: ['Create a contract in Dept A (QA RT19 SLA Dept) with a Dept A support plan.', 'Change only its Department to Dept B (QA RT19 SLA Dept B) and save.', 'Read the contract and GET /desk/sla/contracts/{id}/coverage.'],
    expected: 'The department-only change is refused (Zoho: "You cannot update a Contract\'s department."), or the plan is cleared and coverage shows no plan in force.',
    actual: 'Step 2: 200; the contract is in Dept B with the Dept A plan. Step 3: coverage reports "QA RT20 BS Plan 2841 A w2pv" (Dept A) active on the Dept B contract (2 contracts, 17 Nov 16:03-16:04 UTC). Controls work: department + plan B together 200; plan A on a Dept B contract 422 SUPPORT_PLAN_OTHER_DEPARTMENT.' },
  N4: { title: 'Tickets | Clone form shows Ticket Owner "Unassigned", but the saved clone is owned by the current user', labels: ['Tickets'], img: 'N4-clone-owner-form-vs-saved.png', who: [MAHMOUD, HEGAZY, EAHMED],
    summary: 'When a ticket is cloned from a department where the current user is not an agent, the Clone form shows Ticket Owner "Unassigned". Saving without changing it creates the clone owned by the current user (the create request sends no owner). The form does not show what will be saved.',
    steps: ['As the owner account, open a ticket of a department the owner is not an agent of (e.g. QA RT19 SLA Dept), owned by another agent.', '⋮ › Clone; look at Ticket Owner.', 'Save without changing it.', 'Look at the new ticket\'s owner.'],
    expected: 'The saved owner matches the form. In Zoho Desk (checked live 17 Nov) Clone keeps the source ticket\'s owner.',
    actual: 'Step 2: "Unassigned". Step 4: #5081 owned by ndc-staging-owner (the user who cloned), 17 Nov 17:57 Cairo.' },
  N5: { title: 'Departments | The disable dialog says tickets are kept, but they are moved to the "Transfer to" department', labels: ['Desk Settings'], img: 'N5-disable-dept-dialog-wording.png', who: [MAHMOUD, HEGAZY, EAHMED],
    summary: 'Disabling a department with "Transfer to" now moves its tickets to the chosen department. The dialog does not say this: it says the department\'s tickets are kept, and the transfer line mentions only agents and channels.',
    steps: ['Setup › Departments › ⋮ on a department that has tickets › disable.', 'Read the dialog.', 'Choose a department in Transfer to and click Transfer and Disable.', 'Open one of the department\'s tickets.'],
    expected: 'The dialog says the tickets (and how many) will move to the chosen department.',
    actual: 'Step 2: "The department is not deleted. Its tickets, history and configuration are kept, and enabling it again brings the department back." and "It currently has 1 agent(s) and 1 channel(s). Choose an active department to transfer them to." Step 4: the ticket is now in the chosen department.' },
  N6: { title: 'Tickets | The first conversation of a ticket created without a contact shows "Unknown sender"', labels: ['Tickets'], img: 'N6-unknown-sender.png', who: [MAHMOUD, HEGAZY, EAHMED],
    summary: 'A ticket created by an agent without a contact (through the API or from the Clone form) shows its first message from "Unknown sender" with a "US" avatar.',
    steps: ['Create a ticket with no contact (API, or ⋮ › Clone of a ticket without a contact, then Save).', 'Open the ticket\'s Conversation tab.'],
    expected: 'The agent who created the ticket is shown as the sender, or no sender line is shown.',
    actual: '"Unknown sender" on #4997 (API, 17 Nov 17:50) and #5081 (Clone form, 17 Nov 17:57).' },
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
    const cr = await call('POST', '/work-items/', { name: b.title, description_html: html, priority: 'low', state: BUG, labels, assignees: b.who, start_date: '2026-11-18' });
    if (!cr.j || !cr.j.id) { console.log(key, 'create failed', cr.s, JSON.stringify(cr.j).slice(0, 300)); continue; }
    const id = cr.j.id; done[key] = ['NDC-' + cr.j.sequence_id, id]; fs.writeFileSync(OUTF, JSON.stringify(done));
    const mo = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] }); const cy = await call('POST', `/cycles/${cur.id}/cycle-issues/`, { issues: [id] }); const a = await attach(id, b.img);
    console.log(key, '->', done[key][0], 'labels', labels.length + '/' + b.labels.length, 'module', mo.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
