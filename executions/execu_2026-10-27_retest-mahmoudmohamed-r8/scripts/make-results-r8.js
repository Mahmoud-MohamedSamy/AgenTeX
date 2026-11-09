// Writes results.json for retest round 8 (27–28 Oct 2026, 31 CRM tickets) from the facts in notes-r8.md, for make-report-html.js.
// Usage: node scripts/make-results-r8.js
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const P = 'PASS', F = 'FAIL', W = 'PARTIAL', B = 'BLOCKED', I = 'INFO';
const PRI = { urgent: 'Urgent', high: 'High', medium: 'Medium', low: 'Low', none: 'None' };
const NODEV = 'No developer comment on the ticket.';
// id: [verdict, dev, devHeld, summary, still[], items?]
const T = {
  'NDC-1335': [P, 'Returned from Bug (round 4: a new predefined-only layout failed on the unrelated Subform field, 422).', 'Fixed.',
    'Leads › Layouts › Create New Layout with predefined fields only (Name, Created/Modified Time/By) › Save → POST /layouts 201 ("New Layout"), no PUT on any field, no Subform error. Save again → PUT on the same layout 200, no duplicate. Minor: the URL stays …/layouts/new after the first save.'],
  'NDC-2294': [W, NODEV, '—', '13 items checked by API, automation and the screen: 5 done (1, 2, 10, 11, 13), 2 partly (4, 5), 3 missing (3, 7, 12), 3 not runnable or blocked on staging (6, 8, 9).',
    ['Item 3: Record Score / Record Notes triggers — unknown trigger kind (400).', 'Item 4: Create Meeting action — rule saves, but at run time the meeting creation fails (HTTP 422, dispatch Cancelled).', 'Item 5: Assign Owner by assignment rule — "transfer related records" option is not stored.', 'Item 7: "Everyone" (parallel / sequential) for role and group approvers — accepted on save but read back as mode null.', 'Item 12: several conditions in one workflow rule — not available.'],
    [['1', 'Import option renamed', '"Trigger automation and process management"', 'Import wizard, options step', 'Label and help text exactly as asked; off by default', P],
     ['2', 'Manual approval of imported records', 'Implemented, or "Coming soon" kept', 'Import wizard; API manual_approval=true', '"Manual Record Approval — COMING SOON" (as the ticket allows); the API still accepts manual_approval=true silently and the lead goes live', P],
     ['3', 'Record Score / Record Notes triggers', 'Offered', 'POST /workflow/rules with RecordScore / RecordNotes / ScoreChanged / NoteAdded', '400 "Unknown trigger kind"', F],
     ['4', 'Meeting, Call, Function, Create Connected Record actions', 'Offered and working', 'Rule on QA module with CreateMeeting + ScheduleCall + CreateConnectedRecord; RunCustomAction', 'Call created and related to the record; connected record created with the lookup set; Meeting Cancelled (HTTP 422); Function needs a custom action (none on staging)', W],
     ['5', 'Assign Owner by an assignment rule (+ online only, email, transfer related)', 'All options', 'GroupKZ z5 (layouts fixed)', 'Kind stored, the workflow ran the rule (owner = rule user), only-online and email options stored; "transfer related records" not stored', W],
     ['6', 'Functions on review events', 'Settable and running', 'Review process API / editor', 'eventFunctions exists in the editor and the API; needs a custom action (none on staging)', I, 'Not runnable'],
     ['7', '"Anyone" / "Everyone" for role and group approvers', 'Stored and applied', 'Approval process with a role approver, modes everyone_parallel / everyone_sequential / anyone', 'Users + Everyone refused correctly ("Only a role or a group approver can ask everyone to approve"); for role / group every mode reads back null', F],
     ['8', 'Approval Call Function really runs', 'Runs', 'Approval editor', '"Call Functions" offered (pick a custom action); none exists on staging', I, 'Not runnable'],
     ['9', 'Blueprint after-actions Convert, Function, Tags, Create record', 'Offered', 'Blueprint designer code; GroupKZ z9 with the designer\'s kinds', 'Designer offers createRecord, addTags, convertLead (Leads), customAction; API check blocked — creating a layout on Leads answers 500 since ~19:00 UTC', I, 'Blocked'],
     ['10', 'Rejection reasons per review process', 'Saved with the process', 'Review process with two reasons (EN / AR)', 'Stored on the process with order; the org-wide list is separate', P],
     ['11', 'Field Update, Assign Owner, Tags as scheduled actions; delay honoured', 'Delay honoured', 'Scheduled Field Update 120 s on a QA record', 'Created 15:26:23, field changed 15:28:32 (delay honoured); the editor allows a delay for FieldUpdate, OwnerAssignment, AddTags, RemoveTags', P],
     ['12', 'Several conditions in one rule, first match wins', 'Available', 'Workflow editor wording / API', 'Not available', F],
     ['13', '"trigger": [] on API create skips automation', 'No workflow runs', 'Two API creates on the QA module, with and without "trigger": []', 'With [] no rule run; without, the rule Fired', P]]],
  'NDC-1344': [P, 'Returned from Bug (round 4: new modules by key, unknown "23c1a6s8d46a" / "Test", internal names).', 'Fixed.',
    'All Entities filter: 69 options, no duplicates (AuditLogTest), modules by name ("QA RT r8", "Transactions"…), deleted modules shown as "… (deleted)", no raw keys, no "23c1a6s8d46a" / "Test" / "Mail agent signature row" / "Module view pin"; Module Configuration, Email, Security and System grouped. Minor: "Org currency" lower-case c.'],
  'NDC-2621': [P, NODEV, '—', 'A deal moves to pipeline "1" in all three ways: list/record "Change pipeline?" dialog (PATCH 200, stored pipeline 1 / stage test-01), Mass Update (200, updated 1) and the API (PL-06, PL-08). The custom Deals field "pipeline" is now of type pipeline (was a pick list with only "Standard (Standard)").'],
  'NDC-2630': [W, NODEV, '—', 'Sent as the owner (taviportal.com sender, Zoho connection without zoid): the send now answers 422 MAIL_SEND_FAILED with the reason, and the Mails list shows the email as "failed" with the error.',
    ['The timeline still logs "EmailSent" for the failed email.', 'GET /emails/sendability still answers can_send true for this sender, so the screen lets the user try.']],
  'NDC-2632': [P, NODEV, '—', 'GET /notifications, /unread-count, /preferences/me = 200 for the owner and test user 1 (ChannelsApiTest); the bell lists today\'s notifications; no notification call ≥ 400.'],
  'NDC-2634': [P, NODEV, '—', 'QA portal switched on → the public link (signed out) opens the "Sign in" page; switched off → "This portal is not available — The company that sent you this link has switched this portal off…". No nginx 404.'],
  'NDC-2406': [F, NODEV, '—', 'Integration test E8/E9: deleting the linked CRM contact deletes the Desk contact (GET 404), but there is no Desk recycle-bin item and it cannot be restored.',
    ['Desk contact deleted by the integration is not in the Desk recycle bin (item null) and cannot be restored.']],
  'NDC-2419': [P, 'Developer (27 Oct): metadata-engine fix deployed on crm.taviportal.com only; staging-crm likely needs a restart.', 'Works on staging-crm now.',
    'API create by test user 1 matching an Api-channel rule → owner = rule user (test user 2), execution "Fired"; control lead keeps the creator. Import (A-02) assigns the rule user. Note: the owner is written ~2.4 s after the 201 (the response still shows the creator); the automated test now waits for it.'],
  'NDC-1797': [P, 'Returned from Bug (26 Oct: items of deleted modules could not be deleted forever or restored).', 'Fixed.',
    'An orphan item (module deleted) is now deleted forever by a CRM Admin (succeeded, gone from the bin). Deleting a module that still has records answers 409 MODULE_HAS_DESCENDANTS (cascade offered), so new orphans are not created.'],
  'NDC-2622': [P, NODEV, '—', 'Test user 1 (built-in User profile): /search 200 (automation) and the top search box returns records with no "You don\'t have access to search".'],
  'NDC-2623': [P, NODEV, '—', 'Task "Weekly, ends after 3 times" → 3 tasks with the subject after the first is completed (SearchActivitiesTest).'],
  'NDC-2624': [B, NODEV, '—', 'Deletion part PASS: timeline has RecordCreated, FieldChanged, NoteAdded, RecordDeleted, RecordRestored (TimelineTest). Attachment add / remove could not be tested: file uploads fail on staging (PUT /s3/… 500).',
    []],
  'NDC-2645': [P, NODEV, '—', 'Export help now reads "Every field on the layout this list shows, plus Record ID, Tags and the audit columns." The dialog\'s request for Leads Standard returns 17 columns = Record ID + the 11 layout fields + Tags + 4 audit columns.'],
  'NDC-2646': [P, NODEV, '—', 'Rule {gt qa_num 10}: create with 50 → 422 with the rule\'s message; edit 3 → 999 → 422, value stays 3; a text / nonsense condition → 422 VALIDATION_RULE_INVALID (SetupApiTest updated to the criteria format).'],
  'NDC-2647': [B, NODEV, '—', 'Rollup set up on a QA module (record shows 12). The report query answers 503 "Permission service is temporarily unavailable" since ~19:00 UTC — retest when reporting recovers.', []],
  'NDC-2620': [B, NODEV, '—', 'The lead Overview no longer has an "Attachments" section (files are in the Files tab). Uploading 15 files to check the Files list fails: POST /files 201 then PUT /s3/… 500 ("Couldn\'t upload … Please try again."). Retest when storage recovers.', []],
  'NDC-2410': [P, NODEV, '—', 'Lock on → editing the contract name in Desk answers 422 CRM_OWNED_FIELD_LOCKED "Contract Name comes from the CRM deal and cannot be changed in Desk while …"; lock off → the edit saves (FinishTest#d6Lock).'],
  'NDC-1324': [P, 'Returned from Bug (26 Oct: blocked by the custom pipeline field).', 'Fixed.', 'List pencil → "Change pipeline?" with New pipeline "1" and the stages of "1"; Change pipeline → stored pipeline 1, stage test-01.'],
  'NDC-1316': [P, 'Returned from Bug (26 Oct: blocked).', 'Fixed.', 'Mass Update offers Pipeline (Standard (Default), 1) + "Stage in the new pipeline" defaulting to the first stage with a hint → updated 1, failed 0; stored Standard / qualification.'],
  'NDC-1312': [P, 'Returned from Bug (26 Oct: blocked).', 'Fixed.', 'The change-pipeline dialog asks the stage in the destination pipeline (its own stages) and the deal lands on the chosen stage (test-01 of "1").'],
  'NDC-1694': [P, 'Returned from Bug (round 4: the API still created empty teamspaces).', 'Fixed.', 'POST /teamspaces without modules or with [] → 400 TEAMSPACE_MODULES_REQUIRED (new test emptyTeamspaceRefused); the screen already blocked it.'],
  'NDC-2648': [P, NODEV, '—', 'Duplicate folder name → 409 FOLDER_ALREADY_EXISTS "A folder named \'…\' already exists in this teamspace. Choose a different name."; duplicate teamspace 409.'],
  'NDC-2649': [P, NODEV, '—', 'Empty map → 422 "The parent (controlling) field is required."; real map Red → A, B: record Red + C → 422 "\'C\' is not allowed in \'QA Child\' when \'QA Colour\' is \'Red\'"; Red + A and Green + C saved.'],
  'NDC-2650': [P, NODEV, '—', 'PUT accessMode "selected" + User profile → stored and read back; POST /layouts/assignments → 201 and listed by GET. Observations: sending an empty profile list keeps the old one; an assignment without a profile is accepted with profileId null.'],
  'NDC-2625': [P, NODEV, '—', '10 tags → 200; 11 → 422 RECORD_TAG_LIMIT_EXCEEDED "A record can have at most 10 tags."; the record keeps 10.'],
  'NDC-2626': [P, NODEV, '—', 'Transactions list Pipeline column shows "Standard" / "1"; record page Pipeline "Standard", stage bar Qualification / Needs Analysis / Proposal / Negotiation / Closed Won / Closed Lost; Stage field "Needs Analysis".'],
  'NDC-2627': [P, NODEV, '—', 'Lead timeline "Lead created by test user 1"; Transactions timeline "Transactions created" = the module\'s configured singular name ("Transactions").'],
  'NDC-2629': [P, NODEV, '—', 'Reminder card fields, Additional users and Additional profiles each sit in a 254 px box with its own scroll bar; clicking an item selects exactly that item (counter 1 → 0 on undo); the field list caps at 5 as stated. Nothing saved.'],
  'NDC-2631': [P, NODEV, '—', 'A template with {{company_name}} is refused: 422 MAIL_TEMPLATE_UNKNOWN_PLACEHOLDER "These placeholders can\'t be filled when composing: {{company_name}}. Use one of: …".'],
  'NDC-2633': [P, NODEV, '—', 'Settings › Signals (My Notifications) lists every type by name ("Email opened", "Activity reminders: due now", "Mass delete: finished with errors"…) in English and Arabic; no raw keys.'] };
const tickets = META.map(m => { const t = T[m.key]; if (!t) throw new Error('no result for ' + m.key);
  return { id: m.key, uuid: m.id, pri: PRI[m.pri] || 'None', mod: m.mod, feat: m.labels.join(', ') || '—', title: m.name, v: t[0], dev: t[1], devHeld: t[2], summary: t[3], still: t[4] && t[4].length ? t[4] : undefined, items: t[5], img: [] }; });
const n = k => tickets.filter(t => t.v === k).length;
const R = { batch: 'CRM', title: 'Retest round 8 — Mahmoud Mohamed · NDC · 31 CRM tickets', date: '27–28 Oct 2026',
  env: 'staging-crm.taviportal.com (+ staging-desk for the integration) · tenant NDC-Staging · Edge headless + API · mahmoud.mahamed1515 (CRM Admin), test user 1, owner account through the automation',
  devNote: `Result so far: ${n(P)} pass, ${n(W)} partial, ${n(F)} fail, ${n(B)} blocked by the staging outage from ~19:00 UTC on 27 Oct (file storage 500, Leads layout create 500, reporting 503). Evidence images and the Plane draft are not made yet; nothing is posted to Plane.`,
  tickets,
  observations: [
    ['New defect', 'Creating any layout on Leads answers 500 (since ~19:00 UTC 27 Oct)', 'POST /modules/{Leads}/layouts → 500 INTERNAL_ERROR for any body (Standard views or a copy); a QA module still accepts layouts. Possibly the same storage outage (Leads has Module Image on). Recheck before filing.'],
    ['Environment', 'File storage and reporting down', 'PUT /s3/anyware-files/… → 500 on every upload; POST /reporting/query → 503 permission_service_degraded.'],
    ['Observation', 'A non-existent layout id answers 403', 'Creating a record on a deleted layout answers 403 "Permission denied." instead of 404 / 422.'],
    ['Observation', 'Transactions list "Not Found" toast', 'Seen once on loading the Transactions list.'],
    ['Observation', 'Layout list pinned by a layout that lists the user\'s profile', 'A "selected" layout naming the user\'s profile opens instead of the default and the layout picker cannot switch away. Triggered by my own test-helper change (QA layouts with every profile) — reverted on 14 leftover QA layouts and the helper now uses all_users.'],
    ['Observation', 'Owner from an assignment rule arrives ~2.4 s after an API create', 'The 201 and reads in the first seconds show the creator (NDC-2419).'],
    ['Automation', 'Tests updated / added', 'SetupApiTest (criteria-object validation rule + edit check; teamspace needs a module; new emptyTeamspaceRefused), ChannelsApiTest#sendResultIsHonest (new), GroupAJTest A-01 waits for the async owner, GroupKZ z7/z9 use the current approver modes and after-action kinds, CrmApi.createQaLayout uses all_users; tags NDC-2419/2646/2648/2649/2650/1694/2630 added.']] };
fs.writeFileSync(path.join(RUN, 'results.json'), JSON.stringify(R, null, 1));
console.log('results.json:', tickets.length, 'tickets —', n(P), 'pass,', n(W), 'partial,', n(F), 'fail,', n(B), 'blocked');
