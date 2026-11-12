// Files the Workflow Rules batch (user, 12 Nov 2026: "make the images then file them all with annotated evidence").
// 13 items from report-workflow-plane-drafts.html (D-07 dropped: TAVI history now shows the status change and the rule).
// Plane REST with the user's API key (never printed); same fields as NDC-2825/2826 batch: Bug, Desk, Sprint 15, NDC-2811 assignees.
const fs = require('fs'), path = require('path');
const KF = 'D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv';
const KEY = (fs.readFileSync(KF, 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const LABELS = ['bf14090c-73c4-4e27-923e-59ffd0ccb7cb', 'e449cd35-5c91-4f32-8359-6aabc6ce08ff']; // Workflow Rules, Automation Execution Order
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-workflow.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account, 11–12 Nov 2026.';
const ZENV = ' Compared live with Zoho Desk (test account, nothing left behind) and Zoho Desk help articles.';
const html = b => '<p><strong>Summary</strong></p><p>' + esc(b.summary) + '</p>'
  + '<p><strong>Steps to Reproduce</strong></p><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
  + '<p><strong>Expected Result</strong></p><ul>' + b.expected.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + '<p><strong>Actual Result</strong></p><ul>' + b.actual.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + (b.zoho ? '<p><strong>Zoho Desk</strong></p><p>' + esc(b.zoho) + '</p>' : '')
  + (b.note ? '<p><strong>Note</strong></p><p>' + esc(b.note) + '</p>' : '')
  + '<p><strong>Environment</strong></p><p>' + esc(ENV + (b.zoho ? ZENV : '')) + '</p>'
  + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (' + esc(b.image) + ').</p>';
const imgs = JSON.parse(fs.readFileSync(path.join(RUN, 'evidence/specs/wf-images.json'), 'utf8'));

const bugs = [
  { key: 'D-01', priority: 'medium', name: 'Workflow Rules | A criteria pattern that leaves out a condition is accepted, and that condition is ignored',
    summary: 'When the criteria pattern does not use every condition number, the rule is saved and the missing condition is silently ignored. Zoho Desk refuses such a pattern.',
    steps: ['Go to Settings › Automation › Workflow Rules and click New Rule (Tickets).', 'Add 3 conditions.', 'Click Edit Pattern, type 1 and 2, and click Apply.', 'Click Save & Activate.'],
    expected: ['The pattern is refused with a message like Zoho\'s: "Numbers in this pattern do not match with the numbers used in the Criteria Editor".', 'The rule cannot be saved until every condition number is used.'],
    actual: ['The rule saves.', 'Condition 3 stays on the screen but is not part of the criteria, so the rule fires even when condition 3 is false.', 'Other pattern errors are handled well: "Pattern ends unexpectedly.", "Missing closing parenthesis.", "Pattern refers to condition 4, which doesn\'t exist."'],
    zoho: 'A pattern "1" with 2 conditions shows "Numbers in this pattern do not match with the numbers used in the Criteria Editor" and is not applied.' },
  { key: 'D-02', priority: 'medium', name: 'Workflow Rules | A rule can have only one Field Update action',
    summary: 'A rule cannot hold a second Field Update action (with the same delay). Zoho Desk allows several field updates in one rule.',
    steps: ['Create a workflow rule for Tickets.', 'Add a Field Update action, then add a second instant Field Update action.', 'Save.'],
    expected: ['Several actions of the same type are allowed, as in Zoho Desk: up to 10 field updates, 10 alerts and 10 tasks per rule.', 'One Field Update can also set several fields.'],
    actual: ['Error 400: "A rule can have only one \'FieldUpdate\' action with the same delay."', 'Two Task actions are now accepted, so only Field Update (and other one-per-type actions) are limited.'],
    zoho: 'Help "Creating Workflow Rule": up to 10 alerts, 10 tasks and 10 field updates per rule. In the live editor the Field Update dialog has a "+" to set more fields.' },
  { key: 'D-03', priority: 'medium', name: 'Workflow Rules | The rules API accepts a Field Update on the system field Created By',
    summary: 'The rule editor correctly does not offer Created By in a Field Update, but the rules API accepts it and saves the rule. Other system fields such as Ticket Number are refused.',
    steps: ['Send POST /api/v1/workflow/rules with a Field Update action on created_by.', 'Send the same with ticket_number.', 'In the rule editor, add a Field Update and search the field list for "Created".'],
    expected: ['created_by is refused like ticket_number ("Field is read-only and cannot be changed").', 'As in Zoho Desk, only editable ticket fields can be set by a Field Update.'],
    actual: ['created_by: HTTP 201, the rule is saved.', 'ticket_number: HTTP 422 "Field \'ticket_number\' is read-only and cannot be changed." (correct).', 'Editor: "Created" gives "No results found" (correct).'],
    zoho: 'The live Field Update field list offers only the 14 editable ticket fields (Contact Name … Language); Created By and other system fields are not offered.' },
  { key: 'D-04', priority: 'low', name: 'Workflow Rules | Rule name length is only checked when you save',
    summary: 'The rule name box accepts any length; the limit appears only as an error when you save. Zoho Desk\'s name box stops at its limit while you type.',
    steps: ['Click New Rule (Tickets) and type a rule name longer than 200 characters.', 'Add a condition and an action.', 'Click Save & Activate.'],
    expected: ['The name box stops at the limit while typing (Zoho: 50 characters), so no error at save.', 'If the description keeps its 2000-character limit, the box shows it while typing.'],
    actual: ['No limit while typing.', 'At save: "Name: The length of \'Name\' must be 200 characters or fewer. You entered 253 characters."', 'The description is also refused above 2000 characters only at save.'],
    zoho: 'Rule Name box has maxlength 50 and stops typing at 50 characters; Description has no limit.' },
  { key: 'D-05', priority: 'medium', name: 'Workflow Rules | ${recordId} and ${moduleId} come out empty in a Field Update',
    summary: 'The editor help says ${recordId} and ${moduleId} are always available, but they are replaced with nothing when the rule runs.',
    steps: ['Create a rule On Create with a Field Update: Description = R[${recordId}] M[${moduleId}] S[${subject}].', 'Create a matching ticket.', 'Open the ticket.'],
    expected: ['${recordId} and ${moduleId} are replaced with the ticket\'s ID and the module.', 'As in Zoho Desk, where ${Cases.Request Id} gives the ticket number, no listed placeholder comes out empty.'],
    actual: ['Ticket #3160 shows "R[] M[] S[QA AO WF EV5 ticket]": the two placeholders are empty; ${subject} works.'],
    zoho: 'Help "Creating and managing email templates": ${Cases.Request Id} is replaced with the ticket\'s ID/number.' },
  { key: 'D-06', priority: 'low', name: 'Workflow Rules | Rules list shows internal field names in the Trigger column',
    summary: 'The Trigger column shows internal field names and "1 days". Zoho Desk shows field labels.',
    steps: ['Go to Settings › Automation › Workflow Rules.', 'Look at the Trigger column of rules that run on a field change or relative to a date.'],
    expected: ['Field labels, as in Zoho Desk: "Field Changed: QA NDC Related Branch", "Field Changed: Ticket Owner", "1 day before Due Date".'],
    actual: ['"Field Changed: qa_ndc_related_branch", "Field Changed: owner", "Field Changed: status", "Date-Field Relative: due_date (1 days before)". Same in Arabic.'],
    zoho: 'Rules use field labels everywhere; internal names are never shown.' },
  { key: 'D-08', priority: 'high', name: 'Workflow Rules | A line break in a webhook header value adds an extra header to the outgoing request',
    summary: 'A Webhook action header value that contains a line break is sent as two headers. Anyone who can edit rules can add any header to outgoing webhook requests (header injection).',
    steps: ['Create a rule On Create with a Webhook action to a request catcher (webhook.site).', 'Add header X-QA with the value a + line break + Injected: 1 (saved through the rules API).', 'Create a matching ticket and look at the request the catcher received.'],
    expected: ['Header names and values with line breaks are refused at save.', 'Reserved headers such as Host are refused too.', 'Only the configured headers are sent.'],
    actual: ['The rule is saved.', 'The catcher received two headers: x-qa: a and injected: 1. Execution History: Webhook Succeeded.', 'A Host header override is also accepted.'],
    note: 'Zoho Desk workflow rules have no Webhook action, so this is not a Zoho comparison; it is a security defect in TAVI\'s own feature.' },
  { key: 'D-09', priority: 'high', name: 'Workflow Rules | Script saved in an Add Comment action runs when an admin opens the rule',
    summary: 'An Add Comment action body that contains HTML is rendered as HTML in the rule editor, so a script in it runs in the admin\'s browser.',
    steps: ['Save a rule (through the rules API) whose Add Comment body is <img src=x onerror="window.__xss=1">.', 'As an admin, open the rule in the editor.'],
    expected: ['The body is shown as plain text everywhere; no script runs.'],
    actual: ['The editor renders the image tag and its onerror script runs (window.__xss is set).', 'The rules list, Execution History and the ticket comment are safe.'],
    note: 'The input was saved through the API; the editor is the part that renders it unsafely.' },
  { key: 'D-10', priority: 'high', name: 'Workflow Rules | Double-clicking Save & Activate creates two identical rules',
    summary: 'The Save & Activate button stays active while the save runs, so a double click creates two identical active rules.',
    steps: ['Click New Rule (Tickets), add a condition and a Field Update.', 'Double-click Save & Activate.', 'Search the rules list for the rule name.'],
    expected: ['One rule is created; the button is disabled while saving.'],
    actual: ['Two identical active rules "QA AO WF EV10 double save" were created at the same minute (seen 3 times on 12 Nov).'] },
  { key: 'D-11', priority: 'medium', name: 'Workflow Rules | Saving a rule silently overwrites a change made by someone else',
    summary: 'If a rule is changed in another tab or by another admin while you have it open, your save overwrites that change with no warning.',
    steps: ['Admin A opens a rule in the editor.', 'Meanwhile the rule is renamed in a second tab (or by another admin).', 'Admin A changes the description and clicks Save.'],
    expected: ['Admin A is told the rule was changed and asked to reload; no change is lost.'],
    actual: ['The save succeeds with no warning, and the rename from the other tab is lost (the name goes back to the old one).', 'The save request carries no version, so the server cannot detect the conflict.'],
    note: 'Same problem was filed for Scoring Rules (NDC-2939) and Global Sets (NDC-2868).' },
  { key: 'D-12', priority: 'low', name: 'Workflow Rules | "Send happiness email" is logged as Succeeded while ratings are off',
    summary: 'With Customer Happiness switched off, the Send happiness email action sends nothing but is logged as Succeeded with no reason.',
    steps: ['Make sure Customer Happiness is off.', 'Create a rule On Create with the action Send happiness email.', 'Create a matching ticket and open Execution History.'],
    expected: ['The run says the action was skipped because ratings are off (the editor itself says "Nothing is sent while ratings … are switched off").'],
    actual: ['Execution: SendHappinessEmail Succeeded, with no reason (ticket #3163). Nothing in the ticket history.'] },
  { key: 'D-13', priority: 'high', name: 'Records API | 500 error when "kind" is not the first key of a field value',
    summary: 'Creating a record through the API fails with a server error when the keys of a field value are in a different order.',
    steps: ['POST /api/v1/modules/{tickets}/records with a field value {"value":"x","kind":"string"}.', 'Send the same request with {"kind":"string","value":"x"}.'],
    expected: ['Both requests are accepted; JSON key order must not matter.'],
    actual: ['First request: HTTP 500 INTERNAL_ERROR "An unexpected error occurred".', 'Second request: HTTP 201, record created.'] },
  { key: 'D-14', priority: 'medium', name: 'Workflow Rules | Create Record action skips required fields and leaves the new record without an owner',
    summary: 'A Create Record action creates records that break the target module\'s required fields, and the new record has no owner. The run is logged as Succeeded.',
    steps: ['Create a rule On Create with a Create Record action in Calls, setting only the Start Time (Subject left out).', 'Create a matching ticket.', 'Open the new Call.'],
    expected: ['The rule cannot be saved without the required fields, or the run fails with a clear reason.', 'The new record has a real owner.'],
    actual: ['The Call is created with no Subject; Call Owner is Unassigned and Created By shows "Unknown user".', 'Execution History: CreateRecord Succeeded.'],
    note: 'The owner part is the Desk side of NDC-2726 (CRM: records created by Create Record don\'t take the triggering record\'s owner).' },
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
  if (!KEY) throw new Error('no key');
  for (const b of bugs) {
    if (done[b.key]) { console.log(b.key, 'already filed', done[b.key].seq); continue; }
    b.image = imgs[b.key]; if (!b.image || /^ERR/.test(b.image)) { console.log(b.key, 'no image, skipped'); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: html(b), priority: b.priority, state: BUG, labels: LABELS, assignees: ASSIGNEES, start_date: '2026-11-12' });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id, priority: b.priority, title: b.name, image: 'evidence/annotated/' + b.image }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    done[b.key].module = m.s; done[b.key].cycle = cy.s; done[b.key].attach = a; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    console.log(b.key, '->', done[b.key].seq, 'module', m.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
