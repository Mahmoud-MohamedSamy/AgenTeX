# Retest round 8 — Mahmoud Mohamed · 31 CRM tickets (27 Oct 2026)

Gate 1 (user, 27 Oct): retest all 31; staging-crm + CRM Admin (mahmoud.mahamed1515), test user 1, Desk agent OK; QA RT data OK (cleanup once at the end); shared settings may be changed and restored (integration lock, layout access, Deals "pipeline" custom field); emails incl. a failing one OK.
Only developer note this round: NDC-2419 (fix deployed to crm.taviportal.com 102.206 only; staging-crm 41.128 likely needs a metadata-engine restart). Others: 0 comments.
NDC-2653 (custom Deals field "pipeline") is still Bug → pipeline tickets may still be blocked; widen + restore as in r6 if needed.

## Coverage plan
| # | Ticket | Automation (asserts expected behaviour) | Extra by hand |
|---|---|---|---|
| 1 | 1335 | — | new layout with predefined fields only (UI); existing layout save |
| 2 | 2294 | GroupKZRegressionGapsTest / W3RetestTest | item by item (12 items) |
| 3 | 1344 | AuditLogTest | entity filter labels by hand |
| 4 | 2621 | PipelineTest (moveDealByEdit, moveDealByMassUpdate, offers all) | UI change-pipeline dialog, Mass Update message |
| 5 | 2630 | — | send failing email, toast/timeline/Mails tab |
| 6 | 2632 | ChannelsApiTest#notificationsAnswer | bell + My Notifications UI |
| 7 | 2634 | ChannelsApiTest#portalLinkOpens | on/off pages |
| 8 | 2406 | crmdeskintegration | delete via integration → Desk bin → restore |
| 9 | 2419 | VerifyV1AssignImportTest A-01/A-02 | dev claim: staging needs restart |
| 10 | 1797 | RecycleBinTest#orphanItemCanBeDeleted | bulk delete forever |
| 11 | 2622 | SearchActivitiesTest#userProfileCanSearch | UI search box as test user 1 |
| 12 | 2623 | SearchActivitiesTest (recurring) | — |
| 13 | 2624 | TimelineTest#deletionIsLogged | attachments add/remove |
| 14 | 2645 | — | export All fields column count |
| 15 | 2646 | SetupApiTest#validationRuleApplied | edit path |
| 16 | 2647 | — | rollup in report |
| 17 | 2620 | — | UI attachments section height |
| 18 | 2410 | — | contract lock |
| 19–21 | 1324/1316/1312 | PipelineTest | UI |
| 22 | 1694 | — | API empty teamspace + switcher |
| 23 | 2648 | SetupApiTest#duplicateFolderName | — |
| 24 | 2649 | SetupApiTest#emptyDependencyRefused | record with Red + C |
| 25 | 2650 | SetupApiTest#layoutAssignmentsApi | PUT accessMode read back |
| 26 | 2625 | TagsTest#tenTagLimit | — |
| 27 | 2626 | — | list/record/stage labels UI |
| 28 | 2627 | RecordScreensUiTest#timelineWording | renamed modules |
| 29 | 2629 | — | Activity Reminders lists UI |
| 30 | 2631 | ChannelsApiTest#unknownPlaceholderNotSilent | compose |
| 31 | 2633 | — | My Notifications labels |

## Results (filled as we go)
### Automation run 1 (auto-run1.log) + run 2 (auto-run2.log) — tests run as ndc-staging-owner; facts in automation/target/crmhierarchy-facts.txt
- 2632 PASS: /notifications, /unread-count, /preferences/me = 200 for owner and test user 1 (M09). UI bell/My Notifications still to look at (with 2633).
- 2634 PASS (API): portal on → link 200 (M07). UI check of the page + "off" page still to do.
- 2631 PASS (API): template with {{company_name}} → 422 MAIL_TEMPLATE_UNKNOWN_PLACEHOLDER "These placeholders can't be filled when composing: {{company_name}}. Use one of: …".
- Pipelines (2621/1312/1316/1324): create with pipeline id 201; PATCH to "1" + test-01 → 200 and stored; mass-update → 200 moved; [PL-07] pipeline field options {} (the custom-field allowed_values gone?). UI checks still to do.
- 2622 PASS (API): test user 1 search 200 (GS-03). UI still to do.
- 2623 PASS: weekly ×3 → 3 tasks with the subject after completing the first (AC-01).
- 2625 PASS: 10 tags 200; 11 → 422 RECORD_TAG_LIMIT_EXCEEDED "A record can have at most 10 tags."; record keeps 10.
- 2624 delete part PASS: entries RecordRestored, RecordDeleted, NoteAdded, FieldChanged, RecordCreated. Attachments part still to do.
- 2649 empty map PASS: 422 DEPENDENCY_MAP_INVALID "The parent (controlling) field is required." Record Red + C still to do.
- 2650 assignments PASS: GET 200, POST 201. PUT accessMode read-back still to do.
- 2646 PASS (test updated to criteria object): create 50 → 422 VALIDATION_RULE_FAILED with the rule's message; edit 3→999 → 422, stored 3; garbage condition → 422 VALIDATION_RULE_INVALID. UI tab "In Development"? to look.
- 2648 PASS: duplicate folder → 409 FOLDER_ALREADY_EXISTS "A folder named 'QA W5 Folder' already exists in this teamspace. Choose a different name."; dup teamspace 409.
- 1694 API PASS (new test emptyTeamspaceRefused): no modules / [] → 400 TEAMSPACE_MODULES_REQUIRED.
- 2627: UI test timed out (renderer) → by hand.
- 1797: RecycleBinTest#orphanItemCanBeDeleted not run (needs -Dw2.purgeOrphan=true); RB-05 lists 107 orphan bin items (incl. qa_w5_* modules from the wave tests themselves).
### Manual checks (27 Oct)
- 2650 PASS (API): QA layout 6bf87122 on Leads: PUT accessMode selected + assignedProfiles [User 11111111-…103] → 200, read back selected + [User]; POST layouts/assignments {profileId, layoutId} → 201, GET lists it. Profiles expose `profileId` (my first try sent undefined → 400 "assignedProfiles[0] not in the expected format", correct). Observations: PUT all_users with assignedProfiles [] keeps the old profile in the list; POST assignment without profileId was accepted and stored profileId null.
- Side effect of the 2650 fix on automation: QA AEO session layouts were saved "selected" with no profiles (ignored before) → test user 1 now gets 403 creating on them; LEADS_QA_LAYOUT f56991e7 no longer exists (create on it → 403 "Permission denied", not 404). CrmOrderFeature.LEADS_QA_LAYOUT now overridable with -Dcrm.leadsLayout.
- 2649 PASS: dependency map body {controllingFieldId, dependentFieldId, valueMap {Red:[A,B], Green:[C]}} → 201 on QA module qa_rt_r8 (064aa360); record Red + C → 422 DEPENDENCY_VALUE_NOT_ALLOWED "'C' is not allowed in 'QA Child' when 'QA Colour' is 'Red'. Allowed: …"; Red + A 201; Green + C 201.
- 2647 setup: child module qa_rt_r8c (b690647a) lookup qa_parent + qa_amount; rollup qa_rollup sum on qa_rt_r8; record 22ab5b7b = 12 on the record. Report query format changed (POST /reporting/query ir_version 12–16 → 400) → check through the UI report builder.
- Deals custom field "pipeline" (6b44c7c9) is now datatype "pipeline" (was pick_list ["Standard (Standard)"]), options {} → pipeline moves work (NDC-2653 data fixed).
- 2419 PASS (manual repro): rule "QA RT r8 AR api" (54dbfced, Api+Import, names "QA RT r8 AR…" → test user 2). Test user 1 POST lead source api → 201, owner = test user 2 (51666421), execution AR Fired; control lead (no match) owner stays test user 1. Import A-02 PASS in automation (owner valafo4080). Developer note said staging not deployed — it works on staging now.
- 2406 FAIL (RemainingApiTest e8e9): cross-deleted Desk contact GET 404, recycle-bin item null, restore impossible.
- 1344 (AuditLogTest): 53 entity options, no duplicates; labels to check.
- 2294 group-z: z2 manual_approval=true → lead went live (UI should say Coming soon — to check); z3 Record Score / Notes triggers refused; z4 Meeting / Call / Function / CreateConnectedRecord refused; z6 review functions refused ('functions' unknown); z7 error now lists approver modes "anyone, everyone_sequential, everyone_parallel" (test sent an old value → recheck by hand); z8 Call Function not accepted; z9 blueprint after-actions refused; z5 blocked by the layout 403.
- 2419 detail: automation A-01 read the owner too early: timeline of lead 2a2f3f4a shows RecordCreated 15:11:17.540 → OwnerChanged 15:11:19.974 (rule's owner written ~2.4 s after the 201, which still shows the creator). GroupAJTest now waits up to 30 s. Observation: the API response and the first reads show the creator as owner for ~2.5 s.
- 2410 PASS (FinishTest#d6Lock): lock on → PATCH contract_name 422 CRM_OWNED_FIELD_LOCKED "Contract Name comes from the CRM deal and cannot be changed in Desk while 'Lock CRM-owned fields on the contract' is on"; lock off → 200 saved. Test restores the setting.
- 2294 items: (5) Assign Owner by assignment rule: kind accepted + stored, workflow ran the rule (owner = rule user), only-online + email options stored; "transfer related records" NOT stored → partial. (7) Everyone: approver mode validated (users + everyone → 400 "Only a role or a group approver can ask everyone to approve"), but for role / group the stored approver reads back mode null for everyone_parallel / everyone_sequential / anyone (UI sends approver.mode) → FAIL (not stored). (10) per-process rejection reasons PASS: review process stores rejectionReasons [{labelEn, labelAr, orderIndex}] (org list still separate). (6) review eventFunctions key exists in the API/editor; not runnable (no custom action on staging) → NOT VERIFIED. (11) scheduled FieldUpdate (delaySeconds 120) PASS: created 15:26:23 → FieldChanged 15:28:32. Editor allows delay for FieldUpdate, OwnerAssignment, AddTags, RemoveTags.
- 2627 PASS: lead timeline "Lead created by test user 1"; Transactions timeline "Transactions created" = the module's configured singular name ("Transactions"; Customers singular is "Customers" too — data config).
- 2626 PASS: Transactions list Pipeline column "Standard"/"1" (names); record page Pipeline "Standard", stage bar Qualification / Needs Analysis / Proposal / Negotiation / Closed Won / Closed Lost; Stage field "Needs Analysis".
- 1324 PASS: list pencil → "Change pipeline?" New pipeline "1", Stage in the new pipeline (stages of "1": test-01, test-02, Qualification, Needs Analysis, Negotiation, Proposal, Identify Decision Makers); Change pipeline → PATCH 200, stored pipeline 640e03a4 ("1"), stage test-01.
- 1312 PASS: same dialog asks the stage in the destination pipeline; deal lands on test-01 of "1".
- 1316 PASS: Mass Update offers Pipeline (Standard (Default), 1) + Stage in the new pipeline (defaults to first stage "Qualification", hint shown) → POST mass-update 200 {updated 1, failed 0}; stored 5170500c / qualification.
- 2621 PASS: moved by the dialog (list/record), by Mass Update and by API (automation PL-06/PL-08).
- Side effect found while testing: Transactions list kept opening "QA AEO Layout SE" (a leftover automation layout whose access listed my profile) and the layout picker could not switch away; fixed by setting the leftover QA AEO layouts (Deals SB/SC/SE/SF, Leads SA/SB/SB 310080/SC/SD/SE/SF 522360, Tasks SC/SE/SF) back to all_users. Caused by my own helper change (all profiles) in runs 4–5 — helper now uses all_users. These leftover layouts are for cleanup.
- New observation: Transactions list shows a "Not Found" toast on load (1 of 3 loads).
- 2633 PASS: Settings › Signals = My Notifications (/settings/notifications/preferences): every signal has a name ("Email opened", "Activity reminders: due now", "Mass delete: finished with errors", "Ticket mention", …); Arabic too ("تذكيرات الأنشطة: المستحقة الآن", "الحذف الجماعي: فشل"); no raw keys.
- 2632 PASS (UI): bell lists today's notifications ("You've been assigned …", "… needs your approval"); no notification call ≥ 400.
- 2629 PASS: Reminder card fields / Additional users / Additional profiles each in a 254 px box with its own scroll (content 3734 / 445 / 1304 px); clicking "Area Manager Cairo" selects exactly it (counter 1), undo → 0; card fields refuse a 6th (max 5, stated). Nothing saved.
- 2622 PASS (UI): test user 1 search "QA RT r8" → results, /search 200, no "You don't have access to search".
- 2634 PASS: QA portal e9b9b750 on → signed-out link 200 "Sign in" page (username/password, Arabic switch); off → "This portal is not available — The company that sent you this link has switched this portal off…".
- 2620 BLOCKED: the lead Overview no longer has an "Attachments" section (Files tab instead); uploads fail on staging: POST /files 201 then PUT /s3/anyware-files/… 500 ("Couldn't upload … Please try again.") → storage down; can't load 15 files.
- 2624 attachments part BLOCKED (same storage 500); deletion part PASS.
- 2630 PARTIAL: as owner (taviportal.com sender, Zoho connection without zoid): send → 422 MAIL_SEND_FAILED "No Zoho account found for sender …" (no longer "Sent"); Mails list shows the email with status "failed" + last_error. Still: timeline logs "EmailSent" for it; /emails/sendability says can_send true for this sender. (New test ChannelsApiTest#sendResultIsHonest; its cleanup timed out → QA lead "QA W4 Send …" to clean.) My own account can't send at all (Gmail address, no provider for gmail.com — compose says so up front).
- 2645 PASS: Export dialog help now "Every field on the layout this list shows, plus Record ID, Tags and the audit columns."; dialog request GET …/records/export?format=xlsx&scope=all&layout_id=… (no columns param = All fields); same request as CSV for Leads Standard → 17 columns = Record ID + the 11 layout fields (Full Name … Address 5) + Tags + Created At/By + Last Modified At/By; 178 rows. (My first probe used layoutId → ignored → 564 columns; not the screen's request.) Leads list again opened on a leftover "QA AEO Layout V2" (pinned) → cleanup.
- 1344 PASS (UI + AuditLogTest): All Entities filter 69 options, no duplicates; modules by name ("QA RT r8", "Transactions"…), deleted modules as "QA W5 Auto 424213 (deleted)"; no raw keys / "23c1a6s8d46a" / "Test" / "Mail agent signature row" / "Module view pin" (mail folded into "Email"); groups Module Configuration, Email, Security and System present. Minor: "Org currency" (lower-case c).
- 1335 PASS: Leads › Layouts › Create New Layout (predefined fields only: Name, Created/Modified Time/By) › Save → POST /layouts 201 "New Layout" 78288b9b, no PUT /fields, no Subform error; Save again → PUT /layouts/78288b9b 200 (no duplicate). Minor: URL stays …/layouts/new after the first save. Layout 78288b9b → cleanup.
- 1797 PASS: delete forever of an orphan item (QA W5 R1, module qa_w5_auto_442716 deleted) as CRM Admin → 200 succeeded, gone from the bin (refused on 26 Oct). Deleting a module that still has records now → 409 MODULE_HAS_DESCENDANTS (cascade offered) → no new orphans. Own item (module qa_rt_r8o) deleted forever 200. Module qa_rt_r8o (b97a713b) → cleanup.
- 2294 more items: (1) PASS import option now "Trigger automation and process management" ("Run workflow rules, review and approval processes and blueprints on the imported records. Off by default…"). (2) OK per ticket: "Manual Record Approval — COMING SOON" (API still accepts manual_approval=true silently, lead goes live — z2). (4) PARTIAL: CRM workflow actions CreateMeeting / ScheduleCall / CreateConnectedRecord / RunCustomAction exist and validate (subject, venue, target module + lookup, custom action id). Rule on QA RT r8: ScheduleCall Succeeded (call cd52350c related_to the record), CreateConnectedRecord Succeeded (qa_rt_r8c 9261a22c, qa_parent = record), CreateMeeting Cancelled — "HTTP 422" at run time (subject + venue given). Function (RunCustomAction) not runnable (no custom action). (3) FAIL: trigger kinds RecordScore / RecordNotes / ScoreChanged / NoteAdded → 400 "Unknown trigger kind". (8) Approval "Call Functions" offered (pick a custom action) → not runnable (no custom action). (9) Blueprint designer after-actions now createTask, createRecord, webhook, addTags {tags}, convertLead {} (Leads only), customAction → API check blocked: creating any layout on Leads now answers 500 (test needs a QA layout). (12) FAIL: no multi-condition wording/feature in workflow rules. (13) PASS: API create with "trigger": [] → no workflow run; without → Fired.
- Staging degradation from ~19:00 UTC: (a) file storage PUT /s3/anyware-files → 500 (uploads); (b) POST /modules/{Leads}/layouts → 500 INTERNAL_ERROR for any body, while the QA module accepts layouts (Leads has Module Image on → likely storage); deleting my QA layout 6bf87122 (29 left) did not help (not a count limit); (c) POST /reporting/query → 503 permission_service_degraded. Blocked now: 2620, 2624 (attachments), 2647 (report), 2294 item 9.
