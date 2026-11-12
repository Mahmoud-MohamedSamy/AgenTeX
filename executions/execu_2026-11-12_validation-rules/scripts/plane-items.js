// Validation Rules: Plane items (12 bugs + 1 gap ticket), house style. Used by file-plane.js.
const ENV = (extra) => `<h2>Environment</h2><ul><li>Staging, tenant NDC-Staging, 12–13 Nov 2026</li><li>Owner account${extra ? '; ' + extra : ''}</li><li>Test data used the prefix "QA VR1112" and was deleted after the check.</li></ul>`;
const li = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
const ol = a => '<ol>' + a.map(x => `<li>${x}</li>`).join('') + '</ol>';
const bug = ({ summary, env, steps, expected, actual, notes }) => `<div><h2>Summary</h2><p>${summary}</p>${ENV(env)}<h2>Steps to reproduce</h2>${ol(steps)}<h2>Expected result</h2><p>${expected}</p><h2>Actual result</h2>${li(actual)}${notes && notes.length ? '<h2>Notes</h2>' + li(notes) : ''}</div>`;
const L = { mf: 'b4793725-8568-4924-ae21-055387b991f2', bp: 'abdc5684-1c9c-46f3-b7ce-f7b7909b42fc', a11y: '594b65cc-5f36-4c32-9071-4b0cb9dd336a' };
const M = { crm: 'dea98455-e533-4b49-8a48-6fb88f3249a3', desk: '274a73de-564a-4b8c-8b51-74fe8304e7c2' };
module.exports = { M, items: [
 { key: 'B01-I1', name: 'Validation Rules | Two admins editing the same rule: the second save silently wipes out the first', priority: 'high', labels: [L.mf], modules: [M.crm, M.desk], imgs: ['crm-I1-conflict.png'], html: bug({
   summary: 'When two admins have the same validation rule open, the one who saves last overwrites the other\'s change without any message. The server can already detect this (it answers "This validation rule was changed by someone else" when it gets an old version), but the rule editor does not send the version, so the check never runs.',
   env: 'Leads › Validation Rules, two browser tabs',
   steps: ['Open Settings › Modules and Fields › Leads › Validation Rules.', 'Open the same rule for editing in tab A and in tab B.', 'In tab B change the description to "changed in tab 2" and click Save.', 'In tab A (still showing the old copy) change the description to "changed in tab 1" and click Save.', 'Reload the rule.'],
   expected: 'Tab A\'s save is refused with a clear message such as "This rule was changed by someone else. Reload it and try again", as the API already does.',
   actual: ['Tab A\'s save is accepted with no message.', 'Tab B\'s change is lost; the rule now holds "changed in tab 1".', 'The rule\'s version jumps from 5 to 7, showing both saves were written.', 'A PUT with the old rowVersion through the API is correctly refused with 409 VALIDATION_RULE_CONFLICT, so only the editor is missing the check.'],
   notes: ['Case I1. The Desk rule editor uses the same component.', 'Evidence: crm-I1-conflict.png (attached).'] }) },
 { key: 'B02-H6H7', name: 'Validation Rules | A user is blocked by a rule on a field they cannot edit or cannot see', priority: 'high', labels: [L.mf], modules: [M.crm, M.desk], imgs: [], html: bug({
   summary: 'If the field a rule checks is read-only or hidden for a user\'s profile, the rule still runs for that user. The user cannot type a value, so they cannot save the record at all. Zoho CRM skips a validation rule when the field is read-only for the user\'s profile.',
   env: 'CRM: CRM User with profile "User"; Desk: test user switched to Desk Agent for the check, then switched back',
   steps: ['On Leads (or Tickets), add a rule on a custom text field: "is empty" → "Note is required", Don\'t save, active.', 'In Field permissions, make that field read-only for the profile User (Desk: Desk Agent).', 'Sign in as a user with that profile and create a record without the note (they cannot edit it).', 'Repeat with the field hidden for that profile.'],
   expected: 'The user is not blocked by a field they cannot change or see. The rule still runs for users who can edit the field.',
   actual: ['Read-only field: the save is refused with "QA H6 note is required" (CRM and Desk).', 'Hidden field: the save is refused with the same message, for a field the user cannot even see (CRM and Desk).', 'Effective permissions confirm the field is read_only / hidden for that user.', 'For the owner the rule still blocks, which is correct.'],
   notes: ['Cases H6 and H7 (Zoho item Z11).', 'API checks; no screenshot.'] }) },
 { key: 'B03-G14', name: 'Validation Rules | A value typed in a blueprint transition form skips the validation rules (CRM)', priority: 'high', labels: [L.mf, L.bp], modules: [M.crm], imgs: ['crm-G14-bad.png'], html: bug({
   summary: 'A blueprint transition that asks for a field lets the user save a value that an active validation rule refuses. Neither the transition form nor the server checks the rules.',
   env: 'QA blueprint on a QA Leads layout: transition "QA to Reject" asks for the text field; active rule "text cannot start with BAD"',
   steps: ['Create a Leads validation rule on a text field: starts with "BAD" → "Text cannot start with BAD", Don\'t save, active.', 'Create a blueprint on the same layout whose transition asks for that text field.', 'Open a lead in the first state and click the transition button.', 'Type "BAD-bp" in the text field and click Execute.'],
   expected: 'The transition is refused with "Text cannot start with BAD", the same as a normal save.',
   actual: ['The transition succeeds (POST …/blueprint-transitions/{id} → 200).', 'The lead now holds "BAD-bp" and has moved to the next state.', 'No verify call is made from the transition form.'],
   notes: ['Case G14. The after-transition field update also writes a value past an active rule; Zoho lets after-transition updates through too, so that part is not reported as a bug.', 'Evidence: crm-G14-bad.png (attached).'] }) },
 { key: 'B04-G18', name: 'Validation Rules | A value typed in a ticket blueprint step skips the validation rules (Desk)', priority: 'high', labels: [L.mf, L.bp], modules: [M.desk], imgs: ['desk-G18-typed.png', 'desk-G18-after.png'], html: bug({
   summary: 'On a Desk ticket, a blueprint step that asks for a field saves a value that an active validation rule refuses.',
   env: 'QA blueprint (Customer Support) on a QA Tickets layout; step "QA to Reject" asks for the text field; active rule "text cannot start with BAD"',
   steps: ['Create a Tickets validation rule on a text field: starts with "BAD", Don\'t save, active.', 'Create a blueprint on the same layout whose step asks for that field.', 'Open a ticket in the first state, click the step "QA to Reject".', 'Type "BAD-bp" and click Run.'],
   expected: 'The step is refused with the rule message and the ticket stays in its state.',
   actual: ['No field check is shown while typing or on Run.', 'The step succeeds (200, body {"fields":{"qa_vr_text":"BAD-bp"}}) and the ticket moves to Reject with "BAD-bp" saved.'],
   notes: ['Case G18.', 'Evidence: desk-G18-typed.png, desk-G18-after.png (attached).'] }) },
 { key: 'B05-J7', name: 'Validation Rules | Old Desk rule says it "can\'t be applied" for the wrong reason, and is still applied', priority: 'medium', labels: [L.mf], modules: [M.desk], imgs: ['desk-B8-list.png', 'desk-J7-editor.png'], html: bug({
   summary: 'The existing Desk rule "QA NDC Reject needs a reason" has no layout. The list and editor say "This rule can\'t be applied (a field it uses changed or was deleted)". The real cause is the missing layout, and the server still applies the rule.',
   env: 'Tickets › Validation Rules, rule "QA NDC Reject needs a reason" (created 3 Nov, no layout)',
   steps: ['Open Settings › Modules and Fields › Tickets › Validation Rules.', 'Look at the rule "QA NDC Reject needs a reason" and open it.', 'Set a ticket to status "QA NDC Reject" without a reason and save.'],
   expected: 'The warning names the real problem (no layout chosen) and matches what the server does.',
   actual: ['List and editor: "This rule can\'t be applied (a field it uses changed or was deleted). Edit it to rebuild it."', 'The editor opens with Layout empty; no field was changed or deleted.', 'The ticket save is still refused with "Please add a clear rejection reason", so the rule is being applied.'],
   notes: ['Case J7. The API gives conditionError "A Desk validation rule applies to one layout; choose it."', 'Evidence: desk-B8-list.png, desk-J7-editor.png (attached).'] }) },
 { key: 'B06-J2', name: 'Validation Rules | A field used in a rule\'s "Applies when" can be deleted, and the rule stays Active but broken', priority: 'medium', labels: [L.mf], modules: [M.crm, M.desk], imgs: [], html: bug({
   summary: 'The field a rule checks is protected from deletion, but a field used only in the rule\'s "Applies when" part can be deleted with no warning. The rule stays Active and silently stops working.',
   env: 'Leads and Tickets',
   steps: ['Create a rule on field A with "Applies when" field B equals a value.', 'Delete field B in Modules and Fields.', 'Open the rule list and save a record that the rule should refuse.'],
   expected: 'The delete is refused (or warns) the same way it is for the checked field (FIELD_IN_USE_BY_RULE), or the rule is switched off and clearly flagged.',
   actual: ['The field is deleted (204) with no warning.', 'The rule stays Active; GET shows conditionError "\'qa_vr_j2\' is not a field of this module".', 'Records the rule should refuse are saved.'],
   notes: ['Case J2. Same family: removing a pick-list value used by a rule (J4) and removing the checked field from the layout (J3) also leave the rule Active with no warning.'] }) },
 { key: 'B07-J6', name: 'Validation Rules | Deleting a layout leaves its rules in the list, Active, pointing to a missing layout', priority: 'medium', labels: [L.mf], modules: [M.crm, M.desk], imgs: [], html: bug({
   summary: 'A layout that has active validation rules can be deleted. Its rules stay in the list and stay Active, pointing to a layout that no longer exists.',
   env: 'Leads and Tickets',
   steps: ['Create a layout and an active rule for it.', 'Delete the layout.', 'Open the Validation Rules list and the rule.'],
   expected: 'The layout delete warns about the rules, and the rules are removed or switched off and flagged.',
   actual: ['The layout is deleted (204) with no warning.', 'The rule stays listed and Active; GET shows conditionError "Layout … is not a layout of this module".'],
   notes: ['Case J6.'] }) },
 { key: 'B08-C7', name: 'Validation Rules | A deleted department shows as a raw id in the Desk rule list, and the rule gives no warning', priority: 'medium', labels: [L.mf], modules: [M.desk], imgs: ['desk-N3-list.png', 'desk-C7-editor.png'], html: bug({
   summary: 'When a department used by a Desk validation rule is deleted, the rule list shows the department\'s raw id, the editor hides it, and the rule stays Active with no warning.',
   env: 'Tickets › Validation Rules, rule for "QA VR1112 C7 dept" + Customer Support',
   steps: ['Create a department and a Tickets rule for that department and Customer Support.', 'Delete the department.', 'Open the Validation Rules list, then open the rule and save it.'],
   expected: 'The list and editor show "(deleted department)", as planned in the UI text; the rule still loads and saves.',
   actual: ['List: Departments column shows "d2a27f92-6a33-4a6f-8fce-7b63c9fe0e1d, Customer Support".', 'Editor: only Customer Support is ticked; the deleted department is not shown anywhere.', 'Save works (200) and the deleted id is kept in the rule.', 'No warning on the rule.'],
   notes: ['Case C7.', 'Evidence: desk-N3-list.png, desk-C7-editor.png (attached).'] }) },
 { key: 'B09-E2', name: 'Validation Rules | A message set to show "at the top of the form" is not brought into view', priority: 'medium', labels: [L.mf], modules: [M.crm], imgs: ['crm-E2-top.png', 'crm-E2-top-scrolled.png', 'zoho-E2-alert.png'], html: bug({
   summary: 'With "Show the error: At the top of the form", a refused save draws the message at the top, but the page does not scroll to it and the field is not marked. A user lower down the form sees nothing happen.',
   env: 'Leads, QA layout',
   steps: ['Create a rule with "Show the error: At the top of the form".', 'Open a new lead, scroll down to the checked field, type a value the rule refuses.', 'Click Save without scrolling.'],
   expected: 'The page scrolls to the message (or the field is also marked), so the user sees why the save failed. Zoho shows the alert where the user can see it.',
   actual: ['The message is added at the top of the form, out of view.', 'The page stays where it is and the field has no error mark.'],
   notes: ['Case E2.', 'Evidence: crm-E2-top.png (what the user sees), crm-E2-top-scrolled.png (the message after scrolling up), zoho-E2-alert.png (Zoho) (attached).'] }) },
 { key: 'B10-M4', name: 'Validation Rules | Screen readers are not told why a save was refused', priority: 'medium', labels: [L.mf, L.a11y], modules: [M.crm, M.desk], imgs: ['crm-M4-refused.png', 'desk-M4-refused.png'], html: bug({
   summary: 'When a validation rule refuses a save, the message appears under the field but is not linked to it or announced, so screen-reader users get no feedback.',
   env: 'Leads and Tickets record forms',
   steps: ['Create a rule that refuses a value.', 'Open a new record, type the refused value and click Save.', 'Inspect the field and the message in the page.'],
   expected: 'The field has aria-invalid="true", aria-describedby points to the message, the message is announced (role="alert" or a live region), and focus goes to the refused field.',
   actual: ['No aria-invalid and no aria-describedby on the input (CRM and Desk).', 'No role="alert" or aria-live region.', 'CRM moves focus to the refused field; Desk moves focus to Subject instead.'],
   notes: ['Case M4.', 'Evidence: crm-M4-refused.png, desk-M4-refused.png (attached).'] }) },
 { key: 'B11-B2', name: 'Validation Rules | CRM rule list shows the raw layout id instead of the layout name', priority: 'low', labels: [L.mf], modules: [M.crm], imgs: ['crm-B2-list.png'], html: bug({
   summary: 'On a fresh page load the CRM Validation Rules list shows the layout\'s id in the Layout column. The name appears only after a save in the same page.',
   env: 'Leads › Validation Rules, English and Arabic',
   steps: ['Create a rule for a custom layout.', 'Reload Settings › Modules and Fields › Leads › Validation Rules.'],
   expected: 'The Layout column shows the layout name, as the Desk list does.',
   actual: ['Layout column: "9f0069ec-a4a0-4f50-8342-44c1af1be1f5" instead of "QA VR1112 Layout".', 'Seen in English and Arabic, and again on 13 Nov with a new layout.'],
   notes: ['Case B2.', 'Evidence: crm-B2-list.png (attached).'] }) },
 { key: 'B12-K3', name: 'Validation Rules | Deleting a rule through another module\'s address answers "deleted" but deletes nothing', priority: 'low', labels: [L.mf], modules: [M.crm, M.desk], imgs: [], html: bug({
   summary: 'DELETE /modules/{other module}/validation-rules/{id} answers 204 for a rule that belongs to a different module, but the rule is not deleted. GET through the wrong module correctly answers 404.',
   env: 'API, Leads rule addressed through Contacts (and Tickets through Desk Contacts)',
   steps: ['Take a Leads rule id.', 'Send GET /modules/{contacts id}/validation-rules/{rule id}.', 'Send DELETE /modules/{contacts id}/validation-rules/{rule id}.', 'Send GET /modules/{leads id}/validation-rules/{rule id}.'],
   expected: 'The wrong-module DELETE answers 404, the same as GET.',
   actual: ['GET via the other module: 404 (correct).', 'DELETE via the other module: 204.', 'The rule is still there (GET on Leads 200).'],
   notes: ['Case K3. Same on Desk.'] }) },
],
gap: { key: 'GAP', name: 'Validation Rules: features Zoho CRM and Zoho Desk have that TAVI is missing', priority: 'medium', labels: [L.mf], modules: [M.crm, M.desk], imgs: [], html:
`<p><strong>Summary</strong></p>
<p>We compared TAVI CRM and Desk Validation Rules with Zoho CRM and Zoho Desk (live test orgs and docs) and ran 174 test cases on NDC-Staging on 12–13 Nov 2026. This ticket lists what Zoho has and TAVI does not have yet. The bugs found in the same run are filed as separate tickets. Related: NDC-2646 (rules not applied, now fixed), NDC-2536, NDC-1988, NDC-2535.</p>
<p><strong>Already done in TAVI</strong></p>
<ul><li><p>Rules block or warn on create, edit, inline edit, mass update, import and API saves, in CRM and Desk.</p></li>
<li><p>Lookup, checkbox, owner and Status fields can be checked (were missing at intake).</p></li>
<li><p>Lead convert runs the rules of the target module, like Zoho.</p></li>
<li><p>Function rules call an outside HTTPS address with a signed request; a slow, failing or offline function refuses the save safely.</p></li>
<li><p>TAVI also has regex checks, English + Arabic messages, warn-and-save-anyway, "trigger when it does not match", All-layouts rules, a full rules API, bigger limits (25 conditions, 1000-character messages) and protection against deleting a checked field. Zoho does not have these.</p></li></ul>
<p><strong>Missing — rule types and values</strong></p>
<ol><li>Function code inside the product. Zoho CRM lets the admin write the check as a Deluge function inside Zoho. TAVI only calls an outside HTTPS address, so the customer needs their own server.</li>
<li>Relative dates in date rules (Zoho Desk accepts \${CURRENTTIME}). TAVI takes only fixed dates; the API refuses "today" and \${CURRENTTIME}.</li></ol>
<p><strong>Missing — behaviour</strong></p>
<ol start="3"><li>Show every failing condition. Zoho CRM shows all alerts when several conditions fail; TAVI stops at the first matching condition.</li>
<li>Prompt when removing the checked field from a Desk layout. Zoho Desk asks and then switches the rule off; TAVI allows it with no prompt and the rule stays Active.</li></ol>
<p><strong>Could not be checked</strong></p>
<ul><li><p>Help Center ticket forms: the public form needs a CAPTCHA. Please run cases G15, G16 and X4 by hand, or give QA a Help Center customer login.</p></li>
<li><p>Web forms: POST /api/v1/web-forms/public/&lt;key&gt;/session answers 404 for every form on NDC-Staging (same area as NDC-2732). Please fix so we can test rules on web form submissions (G12; Zoho sends such records to approval).</p></li>
<li><p>Kanban moves: the Leads Kanban does not load (NDC-2993). Please fix so we can test rules on Kanban moves (G6).</p></li></ul>
<p><strong>Additional notes</strong></p>
<ul><li><p>Not gaps: Zoho also lets after-transition and workflow field updates write values that break a rule; TAVI does the same.</p></li>
<li><p>Possible bug to check separately: a function rule accepts internal addresses (https://localhost, 169.254.169.254, 10.x) at save. Please confirm the server refuses to call private addresses.</p></li>
<li><p>Possible bug to check separately: merging records or tickets keeps a value that an active rule refuses.</p></li>
<li><p>Possible bug to check separately: the function request has no timestamp in its signature, so a captured request could be replayed; the layout id is not sent.</p></li>
<li><p>Test sheet with all 174 cases and results: https://claude.ai/artifact/Dqx4bfePnFaL1DZUu5tS1u</p></li>
<li><p>All test data was deleted after the run.</p></li></ul>
<p><strong>Environment</strong></p>
<p>NDC-Staging (staging-crm / staging-desk.taviportal.com), Chromium, 12–13 Nov 2026, owner account; Zoho CRM and Zoho Desk test orgs.</p>` }
};
