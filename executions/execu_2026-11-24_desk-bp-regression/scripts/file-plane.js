// Files the 5 approved drafts (user 24 Nov 2026: "File all 5"). Plane REST with the user's API key (never printed).
// Bug state, Blueprint label (+ Workflow Rules on R4), Desk module, Sprint 17, assignees MahmoudMohamed + mfathy + Hegazy, one annotated image each, relates-to links.
const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const kf = fs.readdirSync(DL).filter(n => /^secret-key-\d+\.csv$/.test(n)).sort().pop();
const KEY = (fs.readFileSync(path.join(DL, kf), 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const WS = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy';
const BASE = WS + '/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const L_BP = 'abdc5684-1c9c-46f3-b7ce-f7b7909b42fc', L_WF = 'bf14090c-73c4-4e27-923e-59ffd0ccb7cb';
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', SPRINT17 = '8347595f-5728-4093-bb08-f451e7faa47b';
const IMG = path.join(__dirname, '../evidence/annotated');
const OUTF = path.join(__dirname, '../out/plane-filed.json');
const ENV = 'NDC-Staging (staging-desk.taviportal.com), Desk → Tickets, department Customer Support; reproduced 24 Nov 2026 17:01 Cairo (owner + Agent A / Agent B accounts, Edge + API). Found in the Desk Blueprint go-live regression (24 Nov 2026).';
const call = async (m, p, body, base = BASE) => { const r = await fetch(base + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j, t: t.slice(0, 300) }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = b => '<p><strong>Summary</strong></p><p>' + esc(b.summary) + '</p>'
  + '<p><strong>Steps to Reproduce</strong></p><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
  + '<p><strong>Expected Result</strong></p><ul>' + b.expected.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + '<p><strong>Actual Result</strong></p><ul>' + b.actual.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + (b.note ? '<p><strong>Note</strong></p><p>' + esc(b.note) + '</p>' : '')
  + '<p><strong>Environment</strong></p><p>' + esc(ENV) + '</p>'
  + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (' + esc(b.image) + ').</p>';
const bugs = [
  { key: 'R1', name: 'Blueprint | A value typed in a transition form skips the field\'s own checks (text length, pick-list option, contact exists)', priority: 'high', labels: [L_BP], rel: ['NDC-3012', 'NDC-3060'], image: 'BP-R1-transition-form-skips-field-checks.png',
    summary: 'Values entered in a blueprint transition form are saved even when the field itself would refuse them. A normal ticket edit refuses the same values.',
    steps: ['Setup → Automation → Blueprints: create a blueprint whose transition "QA go" asks for the fields "QA NDC TKT/PNR NO" (single line, max 255), Category and Contact. Publish it.', 'Open a ticket in the blueprint and run "QA go" with: 400 characters in QA NDC TKT/PNR NO; Category "zzz-not-an-option"; Contact = an id that is no contact (the last two through the API, POST /desk/tickets/{id}/blueprint-transitions/go).', 'Open the ticket: Ticket Information and History.', 'Try the same three values in a normal edit of another ticket.'],
    expected: ['The transition is refused with the same messages as a normal edit: "QA NDC TKT/PNR NO is too long: 400 characters, the maximum is 255.", "Category: \'zzz-not-an-option\' is not one of the allowed values (general, technical, billing, account, feature_request, other).", "Contact: no record exists with id …".', 'The ticket stays in its state.'],
    actual: ['The transition runs (200) and the ticket moves to Escalated.', 'Stored: 400 characters in a 255-character field, Category = "zzz-not-an-option" (shown in Ticket Information and History), contact_id = an id of no contact.', 'The normal edit refuses all three (422 TEXT_TOO_LONG, PICKLIST_VALUE_INVALID, LOOKUP_RECORD_NOT_FOUND).'],
    note: 'Number, decimal, date, date-time, email and phone fields ARE checked in the transition, and validation rules apply (NDC-3012 still fixed). Example ticket #7614 (deleted after the test).' },
  { key: 'R2', name: 'Blueprint API | A blueprint body of the wrong shape returns internal .NET type names', priority: 'low', labels: [L_BP], rel: ['NDC-3069'], image: 'BP-R2-api-error-shows-dotnet-type-names.png',
    summary: 'When part of a blueprint definition has the wrong shape, the error message shows the server\'s internal class name and parser position.',
    steps: ['POST /api/v1/modules/{tickets}/blueprints with a transition whose "during" has "requiredFor": { "comment": ["x"] } (a list instead of an object).', 'Read the error message.'],
    expected: ['A readable message naming the field, e.g. "Required-for of transition \'QA go\' has the wrong format" (as done for owner ids in NDC-3069).'],
    actual: ['422 BLUEPRINT_DEFINITION_INVALID: "The JSON value could not be converted to MetadataEngine.Modules.Records.Application.Blueprint.RequiredForRule. Path: $.transitions[0].during.requiredFor.comment | LineNumber: 0 | BytePositionInLine: 696."'],
    note: 'A malformed owner id now gives "Transition QA go: \'not-a-uuid\' is not a valid user id." (NDC-3069 fixed); other fields still fall through to the parser text.' },
  { key: 'R3', name: 'Blueprint | A named transition owner who cannot edit the ticket is told "You are not an owner of this transition"', priority: 'low', labels: [L_BP], rel: ['NDC-3117'], image: 'BP-R3-owner-without-edit-access-told-not-owner.png',
    summary: 'A Desk Agent named as the owner of a transition cannot run it on a ticket owned by a colleague; the refusal says they are not an owner instead of the real reason (no edit access). The designer gives no warning.',
    steps: ['Blueprint transition "QA Approve" with owner = Agent A (Desk Agent profile, edits only own / unassigned tickets).', 'Assign a ticket in the blueprint to Agent B.', 'Sign in as Agent A, open the ticket; run the step through the API.'],
    expected: ['The refusal names the real reason, e.g. "You can\'t change this ticket, so you can\'t run QA Approve".', 'The designer warns when an owner\'s profile cannot act on tickets owned by others.'],
    actual: ['Screen: read-only banner "You can read this ticket but not change it…" and "No transitions you can run — … only its owners can run it" (A is the owner).', 'API: run → 403 BLUEPRINT_NOT_OWNER "You are not an owner of this transition."', 'On an unassigned ticket A runs the step normally.'],
    note: 'Same class as NDC-3117 (wrong refusal message). Example ticket #7615 (deleted after the test).' },
  { key: 'R4', name: 'Workflow Rules | Execution history says "Fired" when a status change was skipped because the ticket is in a blueprint', priority: 'low', labels: [L_BP, L_WF], rel: ['NDC-2764'], image: 'BP-R4-workflow-log-fired-when-status-skipped.png',
    summary: 'A workflow rule that sets Status on a ticket in a blueprint is correctly blocked, but its execution log reports "Fired" with no sign the update was skipped.',
    steps: ['Workflow rule On Edit, Field Update Status = Closed, Customer Support, criteria Subject starts with the test prefix.', 'Ticket in a blueprint, state Escalated; edit its description.', 'Open the rule\'s Execution History.'],
    expected: ['Status unchanged (blueprint keeps control).', 'The execution shows the field update was skipped because a blueprint controls Status.'],
    actual: ['Status unchanged (Escalated) — correct.', 'Every execution logged as "Fired" (3 of 3), no skip note.'],
    note: 'Also seen 14 Nov 2026 (automation-order run, side finding L6). Example ticket #7616 (deleted after the test).' },
  { key: 'R5', name: 'Blueprint | A transition owner listed under another department is saved even though they are not an agent of that department', priority: 'low', labels: [L_BP], rel: [], image: 'BP-R5-other-department-owner-not-agent-saved.png',
    summary: 'Before → Another department accepts an agent who is not a member of that department; the step is then unusable for them.',
    steps: ['Transition "QA Review" → Before → Another department: Tech, Full access, agent "Test User 1" (not a Tech agent). Save and publish.', 'A ticket enters the state (it is shared with Tech at Full).', 'Sign in as Test User 1 and open the ticket / run the step.'],
    expected: ['The save is refused or warns: "Test User 1 is not an agent of Tech" (unknown and view-only owners are already refused).'],
    actual: ['Saved (201) with no warning.', 'The ticket is shared with Tech, but Test User 1 is offered no step and running it returns 403 BLUEPRINT_NOT_OWNER.', 'With a real Tech agent the same setup works.'],
    note: 'Example ticket #7617 (deleted after the test).' },
];
(async () => {
  const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
  const idOf = async ident => { const r = await call('GET', `/work-items/${ident}/`, undefined, WS); return r.j?.id; };
  for (const b of bugs) {
    if (done[b.key]?.id) { console.log(b.key, 'already filed', done[b.key].ident); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: html(b), priority: b.priority, state: BUG, labels: b.labels, assignees: ASSIGNEES, start_date: '2026-11-24' });
    const id = c.j?.id; if (!id) { console.log(b.key, 'create failed', c.s, c.t); continue; }
    const ident = 'NDC-' + c.j.sequence_id; done[b.key] = { id, ident }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${SPRINT17}/cycle-issues/`, { issues: [id] });
    // attach
    const file = path.join(IMG, b.image); const buf = fs.readFileSync(file);
    const r1 = await call('POST', `/work-items/${id}/attachments/`, { name: b.image, type: 'image/png', size: buf.length });
    let att = 'fail ' + r1.s;
    if (r1.s < 300) { const up = r1.j.upload_data; const fd = new FormData(); for (const [k, v] of Object.entries(up.fields)) fd.append(k, v); fd.append('file', new Blob([buf], { type: 'image/png' }), b.image);
      const r2 = await fetch(up.url, { method: 'POST', body: fd }); const aid = r1.j.asset_id || r1.j.attachment?.id; const r3 = await call('PATCH', `/work-items/${id}/attachments/${aid}/`, { is_uploaded: true }); att = r2.status + '/' + r3.s; }
    let rel = '-'; if (b.rel.length) { const ids = (await Promise.all(b.rel.map(idOf))).filter(Boolean); const r = await call('POST', `/work-items/${id}/relations/`, { relation_type: 'relates_to', issues: ids }); rel = r.s + ' (' + ids.length + '/' + b.rel.length + ')'; }
    Object.assign(done[b.key], { module: m.s, cycle: cy.s, attach: att, relations: rel }); fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    console.log(b.key, ident, 'module', m.s, 'cycle', cy.s, 'attach', att, 'rel', rel);
  }
  // read back
  for (const [k, v] of Object.entries(done)) { const r = await call('GET', `/work-items/${v.id}/?expand=labels,assignees`); const a = await call('GET', `/work-items/${v.id}/attachments/`);
    console.log('readback', v.ident, r.j?.priority, (r.j?.labels || []).map(x => x.name || x).join('+'), (r.j?.assignees || []).length + ' assignees', 'attachments', (Array.isArray(a.j) ? a.j : a.j?.results || []).length, '|', String(r.j?.name).slice(0, 70)); }
})().catch(e => console.error('ERR', String(e.message).replace(/plane_[\w-]+/g, '<key>')));
