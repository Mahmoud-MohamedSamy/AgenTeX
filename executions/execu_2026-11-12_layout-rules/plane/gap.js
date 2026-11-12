// Creates the ONE gap ticket for Layout Rules (rerun-safe).
const { done, save, B, H, TODO, ASG, L } = require('./file.js');
const n = k => done.items[k].seq;
const html = `<p><strong>Summary</strong></p>
<p>We compared TAVI's Layout Rules (CRM and Desk) with Zoho CRM and Zoho Desk layout rules. This ticket lists what Zoho has and TAVI does not have yet. The feature is NDC-1988 (Desk Phase 3 "Layout rules, validation rules, nested picklists"); none of the items below is listed there as a later phase or a non-goal. The 19 bugs found in the same run are filed separately (${n('B-01')} to ${n('B-19')}).</p>
<p><strong>Already done in TAVI</strong></p>
<ul><li><p>Rules per layout with a primary field, several conditions per rule, and AND/OR sub-conditions.</p></li>
<li><p>CRM actions: show fields, show sections, mandatory, read-only (with profile exceptions), filter options, set value, suggest value, show message, show related lists, buttons and links, and verify fields.</p></li>
<li><p>Desk actions: show fields, show sections and mandatory, limited to departments, with an "Apply to Help Center" switch.</p></li>
<li><p>Rules run on the create and edit forms, on clone and on the Desk web form; import, workflow field updates and lead conversion skip them, the same as Zoho.</p></li>
<li><p>Rule list with search and filters (layout, status, department on Desk), on/off switch, rule order, and the check "one active rule per primary field".</p></li>
<li><p>Writes need the admin permission (403 for CRM User and Desk Agent); another tenant cannot read or change the rules.</p></li>
<li><p>TAVI also has a full API for rules, drag-to-reorder, one Desk rule for several departments, messages in English and Arabic, field-usage warnings and a "Rule not applied" flag, which Zoho does not have.</p></li></ul>
<p><strong>Missing — primary field</strong></p>
<ol><li>CRM primary field can be any field type except owner, multi-select, lookups, auto number, formula, file and multi-line. Today TAVI CRM allows only pick list, radio, checkbox, status and user fields (checked live in Zoho with Designation, Annual Revenue and Email). NDC-1988.</li>
<li>Desk primary field can also be a text, number, date or email field. Today TAVI Desk allows only pick list, checkbox, status, user, department and team. NDC-1988.</li></ol>
<p><strong>Missing — where rules run</strong></p>
<ol start="3"><li>Move a record to another layout from the edit page (Layout dropdown), with the new layout's rules applied. Today the edit page has no layout picker and PATCH with layout_id is ignored.</li>
<li>Blueprint transition form shows the fields a layout rule makes mandatory. Today the transition ignores them (bug ${n('B-04')}).</li>
<li>Suggest-value and verify-field pop-ups are remembered once a user acts on them. Today TAVI shows them again to every user after someone pressed Ignore.</li></ol>
<p><strong>Missing — permissions</strong></p>
<ol start="6"><li>A profile permission that lets a non-admin manage layout rules (Zoho: Customize / Manage Layouts and Fields). Today metadata.modules.manage still gives 403; only metadata.acl.manage (global Admin) works.</li></ol>
<p><strong>Could not be checked</strong></p>
<ul><li><p>Help Center ticket form with an "Apply to Help Center" rule (cases G17, G18, G19, X2, Z9, including Zoho's "primary field must be shown in the Help Center" check). The Help Center accepts tickets only from signed-in customers, and sign-up needs an emailed link and a captcha. Please give us a Help Center customer account (email and password), or allow switching the Help Center access mode to "open" during the test, so we can test these cases.</p></li>
<li><p>Rules on Kanban drag (cases G8, Z4). The Kanban view does not load (${n('side-kanban')}). Please fix it so we can test these cases.</p></li>
<li><p>Rules in the mobile app (case Z13). There is no TAVI mobile app yet; skipped on request.</p></li></ul>
<p><strong>Additional notes</strong></p>
<ul><li><p>Zoho also blocks mass update of a rule's primary field: filed as bug ${n('B-01')}.</p></li>
<li><p>Zoho refuses set value + suggest value, and mandatory + read-only, on the same field: filed as bug ${n('B-16')}.</p></li>
<li><p>Zoho keeps a value typed into a field that a rule then hides: filed as bug ${n('B-14')}.</p></li>
<li><p>Not gaps: validation rules, map dependency, field permissions and Blueprint are separate features in Zoho too and were tested only where they meet layout rules. Zoho editions (Enterprise / Ultimate) do not apply to TAVI.</p></li>
<li><p>Test sheet (186 cases, results per case): https://claude.ai/artifact/PUdj9axtAjCR8UQpegu5qC. Findings report: https://claude.ai/artifact/9u6DQiHiARBNFkZNauf5qv.</p></li>
<li><p>All test data (QA LR1112 fields, layouts, rules and records) was deleted from TAVI and the Zoho test org after the run.</p></li></ul>
<p><strong>Environment</strong></p>
<p>NDC-Staging (staging-crm.taviportal.com and staging-desk.taviportal.com), Chromium, 12 November 2026, admin account. Zoho CRM and Zoho Desk test orgs.</p>`;
(async () => {
  if (done.items.gap) return console.log('gap exists', done.items.gap.seq);
  const r = await fetch(B + '/work-items/', { method: 'POST', headers: H, body: JSON.stringify({ name: 'Layout Rules: features Zoho CRM and Zoho Desk have that TAVI is missing', description_html: html, priority: 'medium', state: TODO, assignees: ASG, labels: [L.mf], start_date: '2026-11-12' }) });
  const j = await r.json(); if (!r.ok) return console.log('FAIL', r.status, JSON.stringify(j).slice(0, 300));
  done.items.gap = { id: j.id, seq: 'NDC-' + j.sequence_id, mods: ['CRM', 'Desk'], att: [] }; save(); console.log('gap ->', done.items.gap.seq);
})();
