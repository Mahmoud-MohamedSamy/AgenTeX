// Writes the API/automation evidence cards for retest round 8 (27–28 Oct 2026, CRM) and renders each with apicard.js.
// Usage: node cards-r8.js [card-name ...] → scripts/cards-r8/*.json, screenshots/raw/NDC-*-api.png, scripts/cards-r8/boxes.json (row boxes for specs-r8.js)
// Facts come only from notes-r8.md and the automation facts (automation/target/crmhierarchy-facts.txt, crmdesk-write-facts.txt, auto-run*.log).
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const DATE = '27 Oct 2026';
const L = '/api/v1/modules/{Leads}', D = '/api/v1/modules/{Transactions}', Q = '/api/v1/modules/{QA RT r8}';
const C = {
  'NDC-1335-api.png': { title: 'NDC-1335 · New Leads layout with predefined fields only — Save (layout builder network)', rows: [
    ['first Save', `POST ${L}/layouts (name "New Layout", predefined fields)`, '201 — layout 78288b9b created; no PUT on any field, no "Failed to update options for Subform"', 'ok'],
    ['second Save', `PUT ${L}/layouts/78288b9b`, '200 — same layout updated; still one "New Layout" (no duplicate)', 'ok'],
    ['round 4 (26 Oct)', 'Save of a new predefined-only layout', 'PUT /fields/5dd25be0 (Subform, 0 subfields) → 422; layout not created — gone now', 'info']] },
  'NDC-2294-api.png': { title: 'NDC-2294 · Automation gap list — what each item does on staging (API, automation, screen)', rows: [
    ['1 import option', 'Import wizard › Assign', '"Trigger automation and process management" — runs workflow, review/approval, blueprint; off by default', 'ok'],
    ['2 manual approval', 'Import wizard / API manual_approval=true', '"Enable manual approval — COMING SOON" (allowed by the ticket); API accepts the flag silently, lead goes live', 'ok'],
    ['3 score / notes triggers', 'POST /workflow/rules trigger RecordScore / RecordNotes / ScoreChanged / NoteAdded', '400 "Unknown trigger kind"', 'bad'],
    ['4 meeting / call / connected', 'Rule on QA RT r8: CreateMeeting + ScheduleCall + CreateConnectedRecord', 'Call created, related to the record; connected record created (qa_parent = record); Meeting dispatch Cancelled — HTTP 422', 'bad'],
    ['5 assign by rule', 'GroupKZ z5 (owner by assignment rule + options)', 'Rule ran, owner = rule user; online-only + email stored; "transfer related records" NOT stored', 'bad'],
    ['6 review functions', 'Review process eventFunctions', 'Field exists in API + editor; needs a custom action — none on staging (not runnable)', 'info'],
    ['7 Anyone / Everyone', 'Approval, role approver, mode everyone_parallel / everyone_sequential / anyone', '201 but read back mode null for every mode (users + everyone correctly refused)', 'bad'],
    ['8 approval Call Function', 'Approval editor "Call Functions"', 'Needs a custom action — none on staging (not runnable)', 'info'],
    ['9 blueprint after-actions', 'Designer: createRecord, addTags, convertLead, customAction', 'API check blocked: POST layout on Leads 500 (staging outage) — not runnable', 'info'],
    ['10 rejection reasons', 'Review process with reasons A / B', 'Stored on the process (EN/AR, order); org list separate', 'ok'],
    ['11 scheduled actions', 'Field Update delaySeconds 120 on a QA record', 'Created 15:26:23 → FieldChanged 15:28:32 (delay honoured)', 'ok'],
    ['12 several conditions', 'Workflow rule editor / API', 'Not available', 'bad'],
    ['13 "trigger": []', 'Two API creates, with / without "trigger": []', 'With []: no rule run; without: Fired', 'ok']] },
  'NDC-1344-api.png': { title: 'NDC-1344 · Audit Log entity filter (AuditLogTest + screen)', rows: [
    ['automation', 'AuditLogTest.entityFilterHasNoDuplicates (C-3)', '53 entity options from facets; duplicates (case-insensitive): none — PASS', 'ok'],
    ['screen', 'Settings › Audit Log › All Entities', '69 options: "Records (all modules)", modules by name (QA RT r8, Transactions…), deleted ones "… (deleted)", groups Module Configuration / Email / Security and System', 'ok'],
    ['round 4 leftovers', 'Raw keys, "23c1a6s8d46a", "Test", "Mail agent signature row", "Module view pin"', 'None present', 'ok']] },
  'NDC-2621-api.png': { title: 'NDC-2621 · Moving a deal to another pipeline — dialog, Mass Update, API', rows: [
    ['field', `GET ${D}/fields apiName "pipeline"`, 'datatype "pipeline" (was a pick list allowing only "Standard (Standard)")', 'ok'],
    ['dialog (list pencil)', 'Change pipeline? → "1", stage test-01', 'PATCH 200; stored pipeline 640e03a4 ("1"), stage test-01', 'ok'],
    ['Mass Update', 'Pipeline Standard + first stage', 'POST mass-update 200 {updated 1, failed 0}; stored Standard / qualification', 'ok'],
    ['API (PipelineTest)', 'PL-04 create with id · PL-06 PATCH to "1" · PL-08 mass-update', '201 · 200 pipeline now 640e03a4 · 200 moved=true', 'ok']] },
  'NDC-2630-api.png': { title: 'NDC-2630 · A send that fails (owner, taviportal.com sender, Zoho connection without zoid)', rows: [
    ['pre-check', 'GET /api/v1/emails/sendability', 'can_send true, provider zoho — the sender is let through', 'bad'],
    ['send', 'POST /mail/drafts → POST /mail/drafts/{id}/send', '422 MAIL_SEND_FAILED "No Zoho account found for sender \'ndc-staging-owner@…\'" — no longer "Sent"', 'ok'],
    ['record Mails', 'GET /mail/records/leads/{id}/emails', 'status "failed", last_error with the reason', 'ok'],
    ['timeline', 'GET /timeline/records/leads/{id}/feed', 'EmailSent, RecordCreated — the failed email is logged as sent', 'bad'],
    ['own account (Gmail)', 'Send Email on a lead', 'Compose says "You can\'t send email yet: no provider is connected for gmail.com…"', 'info']] },
  'NDC-2632-api.png': { title: 'NDC-2632 · Notification calls for two users (ChannelsApiTest M09) + bell', rows: [
    ['owner', 'GET /notifications?limit=5 · /unread-count · /preferences/me', '200 · 200 · 200', 'ok'],
    ['test user 1 (User profile)', 'same three calls', '200 · 200 · 200', 'ok'],
    ['bell (CRM Admin)', 'Open the bell', 'Today\'s notifications listed; no notification call ≥ 400', 'ok']] },
  'NDC-2634-api.png': { title: 'NDC-2634 · Customer portal link, signed out', rows: [
    ['create + on', 'POST /record-portals · PATCH is_enabled true', '201 · 200 (QA RT r8 Portal e9b9b750)', 'info'],
    ['link, portal on', 'GET /portal/rp1.… (new signed-out context)', '200 — "Sign in" page (username, password, العربية)', 'ok'],
    ['link, portal off', 'PATCH is_enabled false → GET link', '200 — "This portal is not available — … switched this portal off"', 'ok']] },
  'NDC-2406-api.png': { title: 'NDC-2406 · Desk contact deleted by the integration (RemainingApiTest E8/E9)', rows: [
    ['setup', 'Preference "Delete the corresponding Desk contact"; linked CRM contact deleted', 'Desk contact removed', 'info'],
    ['E9 Desk contact', 'GET Desk contact', '404', 'info'],
    ['E9 recycle bin', 'GET /audit/recycle-bin/items?app_key=desk', 'no item for the contact (null) — restore impossible', 'bad'],
    ['restore', 'Restore from the Desk recycle bin', 'n/a — nothing to restore', 'bad']] },
  'NDC-2419-api.png': { title: 'NDC-2419 · Assignment rule on API and import creates', rows: [
    ['rule', 'POST /workflow/assignment-rules "QA RT r8 AR api" (Api+Import, names "QA RT r8 AR…" → test user 2)', '201, active', 'info'],
    ['API create (test user 1)', `POST ${L}/records source api "QA RT r8 AR api 1"`, '201; owner = test user 2 (51666421); execution AR Fired', 'ok'],
    ['control', `POST ${L}/records "QA RT r8 control 1" (no match)`, 'owner = test user 1; no rule run', 'ok'],
    ['timing (A-01 test)', 'Timeline of lead 2a2f3f4a', 'RecordCreated 15:11:17.540 → OwnerChanged 15:11:19.974 (owner written ~2.4 s after the 201)', 'info'],
    ['import (A-02)', 'Import with the rule', 'owner valafo4080 (rule user), AR Fired', 'ok']] },
  'NDC-1797-api.png': { title: 'NDC-1797 · Delete forever an item whose module no longer exists', rows: [
    ['orphan item', 'GET /audit/recycle-bin/items — "QA W5 R1", module qa_w5_auto_442716 (deleted)', 'listed', 'info'],
    ['delete forever', 'POST /audit/recycle-bin/delete {ids:[aca36754…]} (CRM Admin)', '200 succeeded [aca36754…], failed [] — gone from the bin', 'ok'],
    ['26 Oct', 'Same for items of deleted modules', 'recyclebin.error.forbidden (Owner) — fixed', 'info'],
    ['new orphans', 'DELETE /modules/{qa_rt_r8o} with a record in the bin', '409 MODULE_HAS_DESCENDANTS (cascade offered)', 'ok']] },
  'NDC-2622-api.png': { title: 'NDC-2622 · Global search for a User-profile user', rows: [
    ['API (GS-03)', 'GET /search?q=… as test user 1', '200', 'ok'],
    ['screen', 'Top search box "QA RT r8" as test user 1', 'Records listed (119); /search 200; no "You don\'t have access to search"', 'ok']] },
  'NDC-2623-api.png': { title: 'NDC-2623 · Recurring task (SearchActivitiesTest AC-01)', rows: [
    ['save', 'Task repeat Weekly, ends after 3', 'repeat {"type":"weekly","ends":"after","afterCount":3}', 'info'],
    ['tasks', 'Tasks with the subject after completing the first', '3', 'ok']] },
  'NDC-2624-api.png': { title: 'NDC-2624 · Timeline entries (TimelineTest) and attachments', rows: [
    ['deletion (automation)', 'Lead: create, change Company, note, delete, restore', 'RecordCreated, FieldChanged:company, NoteAdded, RecordDeleted, RecordRestored', 'ok'],
    ['attachments', 'Upload a file on a QA lead (Files tab)', 'POST /files 201 → PUT /s3/anyware-files/… 500 ("Couldn\'t upload … Please try again.") — not runnable on staging', 'bad']] },
  'NDC-2645-api.png': { title: 'NDC-2645 · Export "All fields" on Leads (Standard layout)', rows: [
    ['dialog request', 'Export Leads › All fields', 'GET …/records/export?format=xlsx&scope=all&layout_id=… (no columns parameter)', 'info'],
    ['same request, CSV', `GET ${L}/records/export?format=csv&scope=all&layout_id={Standard}`, '17 columns: Record ID, Full Name, Email, Phone, Company, Lead Source, Lead Status, Reason, Comment, Complaint Reason, Lead Owner, Address 5, Tags, Created At, Created By, Last Modified At, Last Modified By', 'ok'],
    ['before', 'All fields (26 Oct)', '~400 columns incl. other layouts\' and unused fields', 'info']] },
  'NDC-2646-api.png': { title: 'NDC-2646 · Validation rule on a QA module (SetupApiTest C04)', rows: [
    ['rule', 'POST /validation-rules condition {op:gt, field:qa_num, value:10}', '201', 'info'],
    ['create 50', 'POST records qa_num 50', '422 VALIDATION_RULE_FAILED "QA number must be 10 or less"', 'ok'],
    ['edit 3 → 999', 'PATCH record', '422; value stays 3', 'ok'],
    ['garbage condition', 'condition "garbage ((( not an expression"', '422 VALIDATION_RULE_INVALID "The condition could not be understood…"', 'ok'],
    ['control', 'POST records qa_num 5', '201', 'ok']] },
  'NDC-2647-api.png': { title: 'NDC-2647 · Rollup in reports — data ready, reporting down', rows: [
    ['rollup', 'QA RT r8 record with children 5 + 7', 'qa_rollup = 12 on the record', 'ok'],
    ['report query', 'POST /reporting/query (dataset QA RT r8: name, qa_rollup)', '503 permission_service_degraded "Permission service is temporarily unavailable." (since ~19:00 UTC) — not runnable', 'bad']] },
  'NDC-2410-api.png': { title: 'NDC-2410 · CRM-owned contract field in Desk (FinishTest D6)', rows: [
    ['lock on', 'PATCH Desk contract contract_name', '422 CRM_OWNED_FIELD_LOCKED "Contract Name comes from the CRM deal and cannot be changed in Desk while …"; name unchanged', 'ok'],
    ['lock off', 'Same PATCH', '200 — saved', 'ok'],
    ['restore', 'Setting back on', 'done by the test', 'info']] },
  'NDC-1694-api.png': { title: 'NDC-1694 · Teamspace without modules (SetupApiTest C11, new test)', rows: [
    ['no modules', 'POST /teamspaces {name}', '400 TEAMSPACE_MODULES_REQUIRED "Add at least one module to save this teamspace."', 'ok'],
    ['empty list', 'POST /teamspaces {module_ids: []}', '400 TEAMSPACE_MODULES_REQUIRED', 'ok']] },
  'NDC-2648-api.png': { title: 'NDC-2648 · Duplicate folder name (SetupApiTest C12)', rows: [
    ['duplicate folder', 'POST /teamspaces/{id}/folders same name', '409 FOLDER_ALREADY_EXISTS "A folder named \'QA W5 Folder\' already exists in this teamspace. Choose a different name."', 'ok'],
    ['control', 'Duplicate teamspace name', '409', 'ok']] },
  'NDC-2649-api.png': { title: 'NDC-2649 · Dependency maps on the QA module', rows: [
    ['empty map', 'POST /dependency-maps {}', '422 DEPENDENCY_MAP_INVALID "The parent (controlling) field is required."', 'ok'],
    ['real map', 'Colour → Child: Red → A, B; Green → C', '201', 'info'],
    ['Red + C', `POST ${Q}/records`, '422 DEPENDENCY_VALUE_NOT_ALLOWED "\'C\' is not allowed in \'QA Child\' when \'QA Colour\' is \'Red\'"', 'ok'],
    ['controls', 'Red + A · Green + C', '201 · 201', 'ok']] },
  'NDC-2650-api.png': { title: 'NDC-2650 · Layout access through the API (QA layout on Leads)', rows: [
    ['PUT access', 'PUT /layouts/{QA} accessMode selected + [User profile]', '200; read back selected + [11111111-…103]', 'ok'],
    ['assignments', 'POST /layouts/assignments {profileId, layoutId} · GET', '201 · 200 listed (was 500 / 405)', 'ok'],
    ['observation', 'PUT all_users with assignedProfiles []', 'old profile kept in the list', 'info'],
    ['observation', 'POST assignment without profileId', 'accepted, stored profileId null', 'info']] },
  'NDC-2625-api.png': { title: 'NDC-2625 · Tag limit (TagsTest TG-02)', rows: [
    ['10 tags', 'POST /records/{id}/tags (10 ids)', '200; record holds 10', 'ok'],
    ['11 tags', 'POST same with 11', '422 RECORD_TAG_LIMIT_EXCEEDED "A record can have at most 10 tags."; record keeps 10', 'ok']] },
  'NDC-2631-api.png': { title: 'NDC-2631 · Template placeholder check (ChannelsApiTest W4-B6)', rows: [
    ['save', 'POST /mail/templates body with {{company_name}}', '422 MAIL_TEMPLATE_UNKNOWN_PLACEHOLDER "These placeholders can\'t be filled when composing: {{company_name}}. Use one of: {{recipient_email}}, …"', 'ok']] },
  'NDC-1312-api.png': { title: 'NDC-1312 · Change pipeline asks the stage in the new pipeline', rows: [
    ['dialog', 'Pipeline "1"', '"Stage in the new pipeline" lists the stages of "1" (test-01, test-02, Qualification, …)', 'ok'],
    ['confirm', 'Change pipeline with test-01', 'PATCH 200; stored pipeline 640e03a4, stage test-01', 'ok']] },
  'NDC-1316-api.png': { title: 'NDC-1316 · Mass Update of Pipeline', rows: [
    ['field', 'Mass Update › Pipeline', 'New pipeline (Standard (Default), 1) + Stage in the new pipeline, default first stage with a hint', 'ok'],
    ['update', 'POST /records/mass-update', '200 {total 1, updated 1, failed 0}; stored Standard / qualification', 'ok']] },
  'NDC-1324-api.png': { title: 'NDC-1324 · Inline edit of Pipeline on the Transactions list', rows: [
    ['pencil', 'Pipeline cell › pencil', '"Change pipeline?" dialog with New pipeline and its stages (not an empty picker)', 'ok'],
    ['apply', 'Change pipeline → "1", test-01', 'Stored; the list shows Pipeline "1"', 'ok']] },
  'NDC-2626-api.png': { title: 'NDC-2626 · Pipeline and stage labels', rows: [
    ['list', 'Transactions list, Pipeline column', '"Standard" / "1" (names)', 'ok'],
    ['record', 'Deal page', 'PIPELINE Standard; stage bar Qualification … Closed Won / Closed Lost; Stage "Needs Analysis"', 'ok']] },
  'NDC-2627-api.png': { title: 'NDC-2627 · Timeline "created" wording', rows: [
    ['Leads', 'Timeline of a lead', '"Lead created by test user 1"', 'ok'],
    ['Transactions', 'Timeline of a deal', '"Transactions created" = the module\'s configured singular name ("Transactions")', 'ok']] },
  'NDC-2629-api.png': { title: 'NDC-2629 · Activity Reminders lists (box sizes measured in the page)', rows: [
    ['Reminder card fields', 'Box height / content', '254 px / 3734 px — own scroll bar', 'ok'],
    ['Additional users', 'Box height / content', '254 px / 445 px', 'ok'],
    ['Additional profiles', 'Box height / content', '254 px / 1304 px', 'ok'],
    ['click', 'Area Manager Cairo → undo', 'exactly that item selected (1 selected) → 0 selected; nothing saved', 'ok']] },
  'NDC-2633-api.png': { title: 'NDC-2633 · My Notifications names (Settings › Signals)', rows: [
    ['English', 'Per-signal delivery list', 'Email opened, Link clicked, …, Activity reminders: due now, Mass delete: finished with errors, Ticket mention — no raw keys', 'ok'],
    ['Arabic', 'Same page in العربية', 'فتح البريد، … تذكيرات الأنشطة: المستحقة الآن، الحذف الجماعي: فشل — no raw keys', 'ok']] },
};
const DIR = path.join(__dirname, 'cards-r8'); fs.mkdirSync(DIR, { recursive: true });
const boxFile = path.join(DIR, 'boxes.json');
const boxes = fs.existsSync(boxFile) ? JSON.parse(fs.readFileSync(boxFile, 'utf8')) : {};
const only = process.argv.slice(2);
for (const [out, s] of Object.entries(C)) {
  if (only.length && !only.some(o => out.includes(o))) continue;
  const f = path.join(DIR, out.replace('.png', '.json'));
  fs.writeFileSync(f, JSON.stringify({ out, date: DATE, host: 'staging-crm.taviportal.com', who: 'mahmoud.mahamed1515 (CRM Admin); test user 1; owner account through the automation', ...s }, null, 1));
  const res = execFileSync('node', [path.join(__dirname, 'apicard.js'), f], { encoding: 'utf8' }).trim();
  boxes[out] = JSON.parse(res.slice(res.indexOf('[')));
}
fs.writeFileSync(boxFile, JSON.stringify(boxes, null, 1)); console.log('cards:', Object.keys(C).length);
