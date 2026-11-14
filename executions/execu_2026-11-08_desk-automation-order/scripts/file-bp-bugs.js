// Files the Blueprint A6 batch D-1..D-11 (user 13 Nov 2026: "yes file them all"; image layout approved).
// Plane REST with the user's API key (never printed). Bug state, labels Blueprint + Automation Execution Order, module Desk, Sprint 15, NDC-2788 assignees.
const fs = require('fs'), path = require('path');
const KEY = (fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').match(/plane_[A-Za-z0-9_-]+/) || [])[0];
const BASE = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ASSIGNEES = ['e1364b0b-d3cd-4167-8261-6194577a480a', '82cf7a79-0707-4f47-97ca-f8926587b6db', '9c2ff309-bbdb-4be3-b819-3022d9cf3c3b'];
const LABELS = ['abdc5684-1c9c-46f3-b7ce-f7b7909b42fc', 'e449cd35-5c91-4f32-8359-6aabc6ce08ff']; // Blueprint, Automation Execution Order
const MODULE_DESK = '274a73de-564a-4b8c-8b51-74fe8304e7c2', CYCLE_15 = '3a5ac486-3f65-4632-ab05-8f790e61c7b0';
const RUN = path.join(__dirname, '..'); const OUTF = path.join(RUN, 'plane-filed-blueprint.json');
const done = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF, 'utf8')) : {};
const call = async (m, p, body) => { const r = await fetch(BASE + p, { method: m, headers: { 'x-api-key': KEY, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); let j; try { j = JSON.parse(t); } catch (e) { j = t.slice(0, 300); } return { s: r.status, j }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ENV = 'staging-desk.taviportal.com (NDC-Staging), Microsoft Edge, Windows 10, owner account, 12–13 Nov 2026.';
const ZENV = ' Compared live with Zoho Desk (test account techsolutionsegypt; test blueprint deleted afterwards).';
const html = b => '<p><strong>Summary</strong></p><p>' + esc(b.summary) + '</p>'
  + '<p><strong>Steps to Reproduce</strong></p><ol>' + b.steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>'
  + '<p><strong>Expected Result</strong></p><ul>' + b.expected.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + '<p><strong>Actual Result</strong></p><ul>' + b.actual.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>'
  + (b.zoho ? '<p><strong>Zoho Desk</strong></p><p>' + esc(b.zoho) + '</p>' : '')
  + (b.note ? '<p><strong>Note</strong></p><p>' + esc(b.note) + '</p>' : '')
  + '<p><strong>Environment</strong></p><p>' + esc(ENV + (b.zoho ? ZENV : '')) + '</p>'
  + '<p><strong>Attachment</strong></p><p>Annotated evidence attached (' + esc(b.image) + ').</p>';

const bugs = [
  { key: 'D-1', priority: 'medium', image: 'BP-H12-blueprint-changes-not-in-audit-log-vs-zoho.png', name: 'Blueprint | Creating, editing, publishing or deleting a blueprint leaves no entry in the Audit Log',
    summary: 'Blueprint changes are not recorded in the Audit Log at all. Zoho Desk logs every blueprint add, update and delete.',
    steps: ['Go to Settings › Automation › Blueprints and create a blueprint.', 'Edit it (for example the description) and click Save and Publish.', 'Delete the blueprint.', 'Open Settings › Audit Log (All Entities, Any time).'],
    expected: ['One readable entry for each change: blueprint created, updated, published and deleted, with name, user, IP and department.'],
    actual: ['No entry for any of the four changes. On 13 Nov 20:24 Cairo blueprint "QA BP D1 audit" was created, edited, published and deleted; the log shows only sign-ins at that time.', 'GET /audit/events?app_key=desk has no blueprint event either; the only blueprint entries ever seen are "restored" and "purged".'],
    zoho: 'Setup › Audit Log lists blueprint "QA BP I4 throwaway" as Blueprint - (Tickets) · ADD, UPDATE and DELETE, each with user, IP and department.',
    note: 'Spec rows H12 and M4. Related earlier fix: NDC-1643.' },
  { key: 'D-2', priority: 'medium', image: 'BP-H6-second-editor-overwrites-first-silently.png', name: 'Blueprint | Two people editing the same blueprint: the second save silently replaces the first person\'s change',
    summary: 'If a blueprint is changed in another tab or by another admin while you have it open, your Save and Publish overwrites that change with no warning.',
    steps: ['Open the same blueprint in two browser tabs (or as two admins).', 'In tab 1 change the name and click Save and Publish.', 'In tab 2 (still showing the old version) change only the description and click Save and Publish.', 'Reload the blueprint.'],
    expected: ['Tab 2 is told the blueprint changed since it was opened and can reload; no change is lost.'],
    actual: ['Tab 2 saves and publishes with no message (Version 2).', 'After reload the name is back to the old one: tab 1\'s rename is lost. Only tab 2\'s description is kept.'],
    note: 'Same problem as NDC-2965 (Workflow Rules). Spec row H6.' },
  { key: 'D-3', priority: 'medium', image: 'BP-J15-continuous-blueprint-next-step-not-automatic-vs-zoho.png', name: 'Blueprint | A continuous blueprint does not run the next step by itself',
    summary: 'A blueprint marked as continuous behaves like a normal one: after a transition, the next transition (which asks for nothing) does not run on its own.',
    steps: ['Create a blueprint with Advanced configuration = Continuous: Open → Escalated ("first", one checklist item) → On Hold ("auto", no items) → Closed.', 'Create a matching ticket and run "first".', 'Wait and look at the ticket.'],
    expected: ['As soon as "first" completes, "auto" runs by itself and the ticket moves to On Hold.'],
    actual: ['The ticket stays in Escalated ("In Escalated for 2 minutes"); "QA auto" waits for a click (checked after 30 s and 2 min; also seen 12 Nov).', 'The blueprint shows Advanced configuration "Continuous" (continuous: true is stored).'],
    zoho: 'Create Blueprint › "Is this a continuous Blueprint?": "In a continuous Blueprint, the next transition is automatically triggered as soon as the current transition is completed." (setting text seen live; a continuous run was not done in Zoho).',
    note: 'Spec row J15.' },
  { key: 'D-4', priority: 'medium', image: 'BP-F2-blueprint-field-change-missing-from-history-vs-zoho.png', name: 'Blueprint | Field changes made by a blueprint are missing from the ticket\'s History tab',
    summary: 'When a transition\'s After action changes a field, the ticket History tab does not show that change. The server records it.',
    steps: ['Create a blueprint whose transition has an After action "Field update" (e.g. Description = "QA F2D set by blueprint").', 'Run the transition on a ticket.', 'Open the ticket › History.'],
    expected: ['A history line for the field change (old → new), marked as done by the blueprint transition.'],
    actual: ['History shows "<agent> ran QA F2 desc in QA BP F2D" and the status change, but no Description line.', 'GET /desk/tickets/{id}/history does contain ticket.field_changed for description (source blueprint).', 'A manual change of the same field is shown normally. Same for an address field changed by the blueprint.'],
    zoho: 'Ticket #191 History after a transition with an After field update: "Ticket updated as part of transition actions · Blueprint name … · Transition name QA move · Phone changed from -None- to 010000014".',
    note: 'Found while running spec row F2 (address field, which passed) and M1.' },
  { key: 'D-5', priority: 'low', image: 'BP-F2-address-change-shown-as-raw-json.png', name: 'Ticket History | An address field change is shown as raw code text',
    summary: 'When an address field changes, the History tab shows the old and new value as JSON text.',
    steps: ['Add an address field to Tickets (it was a QA field, deleted after the test).', 'On a ticket with a full address, change the City from Cairo to Tanta.', 'Open the ticket › History.'],
    expected: ['A readable line, e.g. "City: Cairo → Tanta", or the full address as plain text.'],
    actual: ['Old {"zip": "11511", "city": "Cairo", "state": "Cairo Gov", "street": "1 QA Street", "country": "Egypt"}', 'New {"street":"1 QA Street","city":"Tanta","state":"Cairo Gov","zip":"11511","country":"Egypt"}'],
    note: 'Not compared with Zoho (Zoho Desk tickets were not checked for an address field type).' },
  { key: 'D-6', priority: 'low', image: 'BP-M1-history-shows-internal-blueprint-event-names-vs-zoho.png', name: 'Ticket History | Blueprint lines show the internal name "BlueprintStateChanged" and text like "QA BP F2U|entered|Open"',
    summary: 'Besides the readable blueprint lines, ticket History shows extra lines with an internal event name and internal detail text.',
    steps: ['Put a ticket into a blueprint and run a transition.', 'Open the ticket › History.'],
    expected: ['Only readable lines (e.g. "Entered blueprint … at Open", "<agent> ran <transition> in <blueprint>").'],
    actual: ['Extra lines titled "BlueprintStateChanged" with Detail "QA BP JU: QA verify", "QA BP K: QA back" or the pipe-joined "QA BP F2U|entered|Open".'],
    zoho: 'Every blueprint line is readable: "Blueprint applied · Blueprint name …", "Blueprint transition performed by <agent> · Blueprint name · Transition name · From state · To state", "Ticket updated on completion of transition".',
    note: 'Spec row M1.' },
  { key: 'D-7', priority: 'medium', image: 'BP-H11-unsaved-designer-change-lost-on-session-expiry.png', name: 'Blueprint | Unsaved designer changes are lost when the session expires',
    summary: 'If the session expires while a blueprint has unsaved changes, Save and Publish sends you to sign in and the changes are gone afterwards, with no warning.',
    steps: ['Open a blueprint in the designer and change the description (do not save).', 'Let the session expire.', 'Click Save and Publish, then sign in again.'],
    expected: ['A warning before the change is lost, or the change kept (local draft) and restored after sign-in.'],
    actual: ['"Your session expired. Please sign in again." (good).', 'After sign-in the designer opens with the old description; the change is lost and nothing warned about it.'],
    note: 'Spec row H11. Not compared with Zoho.' },
  { key: 'D-8', priority: 'medium', image: 'BP-D5-only-owner-suspended-ticket-stuck.png', name: 'Blueprint | If the only owner of a transition is deactivated, nobody can run it and no warning is shown',
    summary: 'A transition owned by one agent becomes impossible to run when that agent is suspended. Tickets waiting on it are stuck and the blueprint shows no warning.',
    steps: ['Create a blueprint where transition "QA onlyA" (Open → Escalated) has only agent A as owner.', 'Put a ticket into it.', 'Suspend agent A.', 'As an admin open the ticket and the blueprint.'],
    expected: ['Someone can still move the ticket (admin or a fallback), or the blueprint flags the transition as having no active owner.'],
    actual: ['Ticket: "No transitions you can run"; Status locked. API run by the admin: 403 "You are not an owner of this transition."', 'Designer: Status Active, no warning; re-saving the blueprint works with no message.'],
    note: 'Spec row D5. Agent A was reactivated right after the test. Not compared with Zoho.' },
  { key: 'D-9', priority: 'low', image: 'BP-N3-transition-owner-that-does-not-exist-accepted.png', name: 'Blueprint | A transition owner that does not exist is accepted and shown as a raw id',
    summary: 'The blueprints API accepts a transition owner user id that does not exist; the designer then shows the raw id as an "Agent" owner.',
    steps: ['Save a blueprint through POST /api/v1/modules/{tickets}/blueprints with before.allowedUserIds = [a random UUID].', 'Open the blueprint and click the transition › Before.'],
    expected: ['Refused, like an owner id from another tenant (which is refused correctly).'],
    actual: ['HTTP 201; the id is stored.', 'Designer › Who can run this: "5327d6ce-320e-4039-8c1a-95edb4cb2d4f · Agent".'],
    note: 'Same kind of problem as NDC-2999 (Workflow Rules). Spec row N3.' },
  { key: 'D-10', priority: 'low', image: 'BP-N8-large-blueprint-labels-overlap.png', name: 'Blueprint designer | On a large blueprint the transition labels and buttons overlap; Firefox takes 43 s to open it',
    summary: 'With 30 states and 80 transitions the designer is slow to open (very slow in Firefox) and the transition labels and their buttons cover each other.',
    steps: ['Create a blueprint with 30 states and 80 transitions.', 'Open it in the designer in Edge, Chrome and Firefox.'],
    expected: ['Labels readable and clickable on a dense graph.', 'The designer opens in a few seconds.'],
    actual: ['Labels and their + / delete buttons overlap on every row.', 'Time to open: Edge 9.0 s, Chrome 10.7 s, Firefox 43 s. (API create 0.8 s and publish 0.9 s are fine.)'],
    note: 'Spec row N8. Not compared with Zoho.' },
  { key: 'D-11', priority: 'low', image: 'BP-H3-issue-list-name-not-clickable-department-not-counted.png', name: 'Blueprint designer | Issue list before publishing: the "name" line can\'t be clicked and a missing department isn\'t counted',
    summary: 'The "issues to fix before publishing" box links transition issues, but the blueprint name issue is plain text and an empty Department is not listed.',
    steps: ['Click New blueprint, add two transitions without names, leave Name and Department empty.', 'Look at the issue box above the canvas.'],
    expected: ['Every issue is a link that jumps to the item (Name too).', 'The empty Department is counted and listed ("4 issues").'],
    actual: ['"3 issues to fix before publishing": "The blueprint needs a name" is plain text.', 'Department is red on the field but not in the count or list.'],
    note: 'Spec row H3 (the rest of H3 passes). Not compared with Zoho.' },
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
    if (!fs.existsSync(path.join(RUN, 'evidence/annotated', b.image))) { console.log(b.key, 'no image, skipped'); continue; }
    const c = await call('POST', '/work-items/', { name: b.name, description_html: html(b), priority: b.priority, state: BUG, labels: LABELS, assignees: ASSIGNEES, start_date: '2026-11-13' });
    if (!c.j || !c.j.id) { console.log(b.key, 'create failed', c.s, JSON.stringify(c.j).slice(0, 300)); continue; }
    const id = c.j.id; done[b.key] = { id, seq: 'NDC-' + c.j.sequence_id, priority: b.priority, title: b.name, image: 'evidence/annotated/' + b.image }; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    const m = await call('POST', `/modules/${MODULE_DESK}/module-issues/`, { issues: [id] });
    const cy = await call('POST', `/cycles/${CYCLE_15}/cycle-issues/`, { issues: [id] });
    const a = await attach(id, b.image);
    done[b.key].module = m.s; done[b.key].cycle = cy.s; done[b.key].attach = a; fs.writeFileSync(OUTF, JSON.stringify(done, null, 2));
    console.log(b.key, '->', done[b.key].seq, b.priority, 'module', m.s, 'cycle', cy.s, a);
  }
})().catch(e => { console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')); process.exit(1); });
