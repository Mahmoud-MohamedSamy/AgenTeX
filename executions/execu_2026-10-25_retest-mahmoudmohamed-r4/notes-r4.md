# Round 4 notes (25 Oct 2026, evening) — 50 tickets
Baseline: baseline.json (bin 16 items, prefs versions leads 20 / tasks 16 / deals 2 / contacts 107).

## NDC-1302 — FAIL
- No new developer comment since our 21 Oct PARTIAL.
- Pipelines on Deals Standard layout: Standard [default] (qualification…closed_lost), "1" 640e03a4 (test-01, test-02, qualification, needs_analysis, negotiation, proposal, identify_decision_makers).
- API create on "1"/test-01 → 422 PICKLIST_VALUE_INVALID "Pipeline: '640e03a4-…' is not one of the allowed values (Standard (Standard))." (was 201 + silent switch on 21 Oct).
- API PATCH an existing deal to "1"/test-01 → same 422; deal stays on Standard.
- UI Create Transactions: Pipeline picker offers "Standard Default" and "1"; picking "1" offers its 7 stages; Save → POST 422, page shows the raw message with the pipeline id at the top (1302-01..05).
- Result: a deal still cannot be put on a non-default pipeline; behaviour changed from silent switch to explicit refusal with a raw-id message.
- Cleanup: deals "QA RT 1302 move" ×2 (ebfc151f, 5712b381).

## Incident (found 25 Oct ~23:20) — round 3 cleanup broke 3 list pages; fixed
- Round 3 cleanup restored Deals/Contacts/Tasks list prefs from baseline null → PUT {} (null is rejected with 400; DELETE → 405).
- An existing prefs object without visibleKeys/hiddenKeys crashes the list page: "Something went wrong", console TypeError "Cannot read properties of undefined (reading 'length')" in useResolvedLayout. Also with {lastView:'list',pageSize,hiddenKeys:[]}. Test user 2 (prefs null) unaffected.
- Fix: PUT {lastView:'list', pageSize:25, hiddenKeys:[], visibleKeys:[]} → pages load with default columns: Contacts 7, Tasks 135, Deals 56 records; Work Queue OK.
- App finding (observation): list page crashes when list-preferences exist but lack visibleKeys — should fall back to defaults.
- Rule for cleanup: never PUT {} — when the baseline was null use the empty-arrays form above.

## NDC-1312 — FAIL
- Deal detail → Pipeline → "1": dialog "Change pipeline? … Stage in the new pipeline: qualification — The deal keeps its current stage" (dev's stage question held).
- Change pipeline → PATCH 422 toast "Pipeline: '640e03a4-…' is not one of the allowed values (Standard (Standard))."; deal stays Standard/qualification (1312-02..04).

## NDC-1324 — FAIL (worse than 21 Oct)
- Deals list Pipeline column shows the raw pipeline id "5170500c-b335-479c-96d1-ed138965c345" for every deal (not "Standard").
- Inline edit (hover → Edit field) opens a plain picker: chip shows the raw id; dropdown offers only "Standard (Standard)" — pipeline "1" not offered; the change-pipeline modal seen on 21 Oct is gone (1324-02..04).

## NDC-1316 — FAIL
- Mass Update (2 deals) → Pipeline field: "New pipeline" (Standard (Default), 1) + "Stage in the new pipeline" (7 stages of "1"), hint "Defaults to the first stage…".
- Update records → POST /records/mass-update 422 "Pipeline: '640e03a4-…' is not one of the allowed values (Standard (Standard))."; dialog stays open, no message shown, no toast; both deals still Standard/qualification (1316-01..06).
- Common cause 1302/1312/1316/1324: the Pipeline pick-list field only allows "Standard"; pipeline "1" exists on the layout but is rejected.

## ⚠ Staging blocker — Deals Pipeline field corrupted (affects 1302, 1312, 1316, 1324)
- GET /modules/{Deals}/fields → pipeline: datatypeKey pick_list, datatypeOptions {"allowed_values":["Standard (Standard)"]}, lastModified 2026-10-24T15:54:43Z by ndc-staging-owner.
- Every deal write that sends a pipeline is refused: API with Standard id 5170500c → 422 "…'5170500c-…' is not one of the allowed values (Standard (Standard))"; with "Standard" → 422; UI Create Transactions with the default Standard → 422 (deal-ui-default-save). Deals can only be created without the pipeline field (API).
- So the pipeline tickets cannot be judged on staging now: the 422s are caused by this field config, not necessarily by the pipeline fix. UI parts that could be checked: Change-pipeline dialog asks for the stage (1312), Mass Update offers Pipeline + stage (1316); inline edit (1324) now a plain picker with raw ids.
- Automation NDC-1337 run 25 Oct ~23:45: 9 tests, 4 PASS (hiddenFieldNotReturned, hiddenFieldNotWritable, listHidesHiddenField, readOnlyFieldNotWritable), 1 FAIL transactionsFieldPermissions (same Pipeline 422 creating the test deal), 2 SKIP + 2 config failures (RestrictedUserUiTest: docs/Credentials/TAVI Staging Desk Credentials.csv missing — environment, not a bug).

## NDC-1337 — PASS
- Go-live retest earlier on 25 Oct (QA comment 16:27) passed API + restricted-user screens; open item was the layout-builder route.
- Automation -Dtags=NDC-1337: 4 API checks PASS (hidden not returned/not writable, read-only not writable, list hides hidden); transactionsFieldPermissions FAIL only because creating its deal hits the Pipeline-field 422 (staging blocker above); RestrictedUserUiTest not run (credentials CSV missing).
- Layout-builder route: temp field qa_rt_fp (44241857) on Leads layout "test" → Field options → Set Permission → PERMISSIONS → profile "test" Read cleared → Apply → Save → field-permissions shows profile 64d4aae0 (= "test", test user 2) hidden (1337-01..03).
- As test user 2: POST lead with qa_rt_fp → 422 FIELD_PERMISSION_DENIED "Field 'qa_rt_fp' is hidden for your profile and cannot be written."; without it → 201; Create Lead form on layout "test" has no "QA RT FP" (1337-04).
- Cleanup: field qa_rt_fp (44241857); lead c2989364 "QA RT 1337 u2 plain".

## NDC-1335 — PARTIAL
- Ticket's "New Layout 2" no longer exists; used Leads layout "test".
- Existing layout: wait for full load, switch Module Image off, Save → PUT /fields/... ×5 200 + PUT /layouts/6261fa51 200, toasts "Field updated successfully", "Layout updated successfully"; no Subform error; Cancel → no unsaved prompt; change stored (moduleImageEnabled false). Save took 46 s (1335-00, 1335-02).
- New layout (Create New Layout → predefined Basic Information: Name, Created By, Modified By) → Save → PUT /fields/5dd25be0 (field "Subform", type subform, 0 subfields, only on layout "فاتورة") 422 DATATYPE_SUBFORM_NO_SUBFIELDS "A subform needs at least one subfield before it can be saved — otherwise it saves with nothing for users to fill in."; toast shows it; layout not created (1335-05). Same failure class as step 4 (was 404, now 422).
- Observation: saving before the builder finished loading the "test" layout (it first shows an empty template) created a NEW layout "Standard Layout" dff47b4e instead of updating "test" (1335-01). Cleanup: delete dff47b4e; restore "test" Module Image to on.

## NDC-1693 — PASS
- No developer comment. Settings › Modules and Fields › Create New Module: CRM Teamspace "QA RT Module 1693" (key qa_rt_module_1693) → POST /teamspaces/5ea90671/modules 201, dialog closes, module listed (1693-01, 1693-02). New Teamspace "QA RT Module 1693 b" → 201 (1693-03).
- Duplicate key (API) → 409 MODULE_ALREADY_EXISTS "Module key already exists in this organization." — no 500.
- Cleanup: modules ef70c152, c56f2e10.

## NDC-1344 — PARTIAL
- Automation tag NDC-1344 exists only in a javadoc (AuditLogTest) — no @Test group, nothing ran; checked by hand.
- Entity filter: 58 options, no duplicates (was Workflow rule/Rule, Approval process/Process, Blueprint ×3, Profile ×2) and no repeated module block — fixed (1344-01).
- Still wrong: new modules listed by key "qa_rt_module_1693", "qa_rt_module_1693_b" (labels "QA RT Module 1693", "…b" exist and other modules show labels); "23c1a6s8d46a" and "Test" listed among module records but not modules of this CRM (GET /modules); internal-style names "Mail agent signature row", "Module view pin".
- Feed: deleted + restored lead → "mahmoud.mahamed1515 restored a Lead named QA RT 1337 u2 plain" — raw key audit.entity.leads gone (1344-03).

## NDC-1333 — PASS
- Settings › Activity Reminders at 1280×720: window does not scroll (document 720 = viewport); only the settings column scrolls (DIV overflow-y-auto, 664 px high). The left Setup menu has its own scroll (navigation, separate panel). Wheeling 40× past the end: window stays at 0, content stays visible (no blank page) (1333-01, 1333-02).
- Column scrollHeight grows while scrolling (2127 → 5797) — lists load more rows; no jump.
- Clicking the Quality profile checkbox ticks Quality (the item under the pointer); "You have unsaved activity-reminder changes" bar appears and the column shifts 53 px to keep the row in place; unticking restores; nothing saved (1333-03).

## Teamspace group (no developer comments on any) — test teamspace "QA RT TS" c7bb126d (created 21:29 UTC, deleted at the end via 1689)
### NDC-1694 — PARTIAL
- UI: Create New Teamspace "QA RT TS" with no modules → Save disabled, hint "Add at least one module to save this teamspace." (1694-01..03).
- API: POST /teamspaces {name:"QA RT TS empty", modules:[]} → 201; "QA RT TS empty" (0 modules) is offered in the sidebar teamspace switcher (1694-04) — ticket: if allowed, an empty teamspace must not be offered there.
### NDC-1695 — PASS
- Folder "QA RT Folder A" renamed to "QA RT Folder A2" on Edit Teamspace → Save (PUT 200) → reload: card shows A2; GET folders A2; left navigation (QA RT TS selected) shows "QA RT Folder A2" with Tasks, Calls (1695-01, 1695-02).
### NDC-1698 — PASS
- Modules inside a folder have the same × as root modules (1698-01 / ts-06). × on "calls" inside Folder A2 → Save → calls removed, tasks and the folder kept (API: tasks→72da143f) (1698-02).
### NDC-1691 — PASS
- Rows have drag handles. Drag "tasks" from Folder A2 onto Folder B → moved; drag "meetings" from Folder B to below the root module → moved to root (1691-01..03). Save → API: tasks folder=80520ced (B), meetings folder=- (root); both folders kept.
### NDC-1692 — PASS
- On an existing teamspace, Add Modules links immediately ("Modules linked successfully"); leads added to Folder B is saved at once and the sidebar nests it under Folder B (1692-01, 1692-02) — no unsaved state shown flat at root.
- Delete Folder B (2 modules): dialog "Delete folder "QA RT Folder B"? The folder has 2 modules." with "Move modules and delete folder" (Select folder: Root / QA RT Folder A2) or "Remove modules and delete folder"; button "Move & Delete" (1692-03). Move to Root → folder deleted, tasks and leads at root (1692-05) — matches the dialog.
### NDC-1700 — PASS
- Teamspace has no admin field in /teamspaces; admin is stored in the ACL. Signed in as mahmoud.mahamed1515: New Teamspace shows ndc-staging-owner (its admin/creator), CRM Teamspace "—" (system creator), QA RT TS me — not the viewer.
- Changed QA RT TS admin to ndc-staging-owner (picker "Select the teamspace admin") → Save (PUT /acl 200) → reload shows ndc-staging-owner while signed in as mahmoud.mahamed1515 (1700-01..03).
### NDC-1689 — PASS
- Edit Teamspace trash icon: with modules → dialog "Can't delete "QA RT TS" — This teamspace still contains 4 modules. Delete or move them to another teamspace first…" (1689-01). After removing the modules (removal applies immediately; server 0 modules) → "Delete "QA RT TS"? This permanently deletes the teamspace and its folders." → Delete teamspace → DELETE ?cascade=true 204, gone from list (1689-03, 1689-04).
- Observation: module add/remove on Edit Teamspace applies immediately, while rename/admin/drag wait for Save.
- Cleanup: teamspace "QA RT TS empty" a1a9bba3; sidebar switched back to CRM Teamspace.

## NDC-1231 — PASS
- Field "Fill From Name" (fill_from_phone, 9eff6424) on Leads Test Layout 1 has auto_fill {source: record_field, key: name}.
- Create Lead (Test Layout 1): type Name "QA RT 1231 fill" → Fill From Name shows "QA RT 1231 fill" on the form; Save → POST sends it, 201; stored name and fill_from_phone both "QA RT 1231 fill" (1231-01, 1231-02).
- Typed "manual value" into Fill From Name first, then Name → stays "manual value" (not overwritten) (1231-03).
- Cleanup: lead 816c0c4e.

## NDC-1593 — PASS / NDC-1599 — PASS (import as a restricted user)
- Profile "test" (64d4aae0, test user 2): qa_rt_fp hidden (set via layout builder, 1337), qa_rt_ro (d65bacbf, new on layout "test") read_only (POST /field-permissions 200).
- Test user 2 → Import Leads → imp1593.xlsx (columns Name, Full Name, Single Line Permission, QA RT FP, QA RT RO) → layout "test" → Map fields: field list has no "QA RT FP" (hidden not offered); "QA RT RO (read-only for your profile)" is listed but disabled (cannot be chosen) (1593-imp-1..3). Same list for every column.
- Server side for hidden writes already shown in 1337 (record API 422 FIELD_PERMISSION_DENIED). Import wizard left at mapping (not submitted).

## NDC-1554 — PASS
- Map fields: "Tag delimiter" is now two static chips ", " and "; " with helper text exactly "Use , or ; as tag delimiters. Use one or the other within a field — mixing both in the same field is not accepted. Any other delimiter is not accepted." (no picker) (1593-imp-3).
- Admin import imp1554.xlsx (Tags "qart1,qart2" / "qart3;qart4" / "qart5,qart6;qart7") → Review: "1 of 3 rows have errors" — Tags · Invalid format · "Row 4: qart5,qart6;qart7" (names row and field); Submit → Added 2, Errors 1; both imported leads have 2 tags each (1554-imp-4, 1554-imp-5).
- Observation: under "All errors 1" the error table says "No errors match your filters" (empty) — same as NDC-2385.
- Cleanup: leads 2c183532 (semi), f65046ac (comma); tags qart1–qart4; field qa_rt_ro d65bacbf; import history entries.

## NDC-1232 — PASS
- Settings › Data Types at 1280×866: header sticky with solid white background (thead/th rgb 255,255,255); after scrolling the body the rows pass under an opaque header (1232-02). Was transparent on 21 Oct.
- Table 1432 px in a 962 px area, overflow-x auto; right edge fades (more columns hint); scrolling right reaches Set Unique, a left fade appears (1232-01, 1232-03). All 11 headings complete; rows 44 px; labels on one line.
- Observation: when scrolled right the Label column scrolls away (no sticky first column), rows lose their names.

## NDC-1598 — PASS
- Leads › Fields › Field Listing: toolbar has "Layout" select (All Layouts, every layout incl. Standard Layout/فاتورة, "Not on any layout") next to "Search Fields or Data Types" and Create and Edit Fields.
- Layout "test" → 18 rows = API fields on layout "test" (18); includes QA RT RO; excludes Test Layout 1-only "Fill From Name" (1598-02). All Layouts → 569 rows.

## Desk — Modules & Fields (staging-desk, mahmoud.mahamed1515 Desk Administrator; 2nd user mahmoud.mmohamedsamy Desk Administrator + Supervisor)
### NDC-2250 — PASS
- GET /modules: Tickets lastModifiedByName "ndc-staging-owner"; other seeded modules "System" (created and last changed by system). UI list: "Tickets … NS ndc-staging-owner 19/10/2026", others "System 06/09/2026" (2250-01). New module QA RT Agents Only → lastModifiedByName "mahmoud.mahamed1515". Real names shown again (21 Oct showed "System" for all).
### NDC-2220 — PASS (INFO)
- Create module dialog: "QA RT Agents Only", Module Permission = Desk Agent only → POST /teamspaces/a641f1df/modules 201 + PUT /modules/01727195/permissions {profileIds:[…402]} 200; ACL access_mode "selected" (2220-01, 2220-02).
- As mahmoud.mmohamedsamy (Desk Administrator + Supervisor, not allowed): "+" create menu lists Ticket, Contact, Account, Task, Call, Event, Contract — no QA RT Agent Only; not in sidebar; GET records → 403 (2220-03).
- INFO: GET /modules still returns the module (metadata) to this user.
### NDC-2246 — PASS
- POST /custom-datatypes qa_rt_dt4 (base single_line) 201, listed in /fields/datatypes; field qa_rt_cdt with datatypeKey qa_rt_dt4 → 201, stored datatypeKey single_line + datatypeOptions.custom_datatype_key "qa_rt_dt4" (custom type kept as a reference).
- DELETE /custom-datatypes/qa_rt_dt4 while in use → 409 DATATYPE_IN_USE "Datatype is in use by at least one field draft." (unblocks J4).
### NDC-2233 — PASS
- Fields on QA RT Agents Only: qa_rt_file (file_upload, [pdf], 1 MB), qa_rt_img (image_upload, [png], 1 MB); inputs now carry accept=".pdf" / ".png".
- Create form: .txt into file → "File type not allowed. Allowed: pdf"; 2.2 MB pdf → "File is too large. Maximum size is 1 MB."; .txt into image → "File type not allowed. Allowed: png"; 33 B pdf → accepted (qa-rt-ok.pdf · 33 B · Replace) (2233-file_txt, file_big, img_txt, file_ok). Form left without saving.
- API: wrong type → 422 "File type is not allowed; allowed types: pdf."; 2.2 MB → 422 "File upload exceeds maximum size of 1 MB.". Note: value now uses filename/size_bytes keys.
- Cleanup (Desk): module QA RT Agents Only 01727195 (cascade), custom datatype qa_rt_dt4 (after the field is gone).

### NDC-2249 — PASS
- Desk in Arabic (dir rtl) → Setup › Modules and Fields › QA RT Agents Only › Layouts: headers الاسم / مشارك مع / آخر تعديل / الحالة ("Last Modified" now translated); no English strings except the "Ctrl K" shortcut (2249-01). Language restored to English.

## CRM ⇄ Desk integration — API group (integration connected, not paused; config backed up in integration-baseline.json, row_version 41667254; restored and diffed equal after the writes)
### NDC-2402 — PASS: GET /desk/integrations/crm/customers/contact/{random}/stats?months=6 → 404 (was 200); context/contact/{random}/info → 404.
### NDC-2401 — PASS: POST /pause reason 1206 chars → 400 VALIDATION_ERROR "The pause reason can be at most 500 characters." (was 500); not paused.
### NDC-2397 — PASS: PUT /config without row_version → 400 ""row_version" is required: send the row_version these settings were read at, so a save never overwrites another administrator's changes." (was 200).
### NDC-2396 — PASS (INFO): unknown CRM field → 422 crm_field_unknown; unknown Desk field → desk_field_unknown; empty CRM field → incomplete; lookup account_id → 422 but reason desk_field_unknown (expected lookup_not_mappable) — refused, reason code off. Nothing stored.
### NDC-2398 — PASS: GET /history?days=7 rows have date, direction, module, added, updated, failed (e.g. 2026-10-25 desk_to_crm accounts added 1 updated 0 failed 1).
### NDC-2409 — PARTIAL: one successful config save → audit event (actor me, time, entity "CRM ⇄ Desk integration settings", action config.updated). Desk Audit Log shows "mahmoud.mahamed1515 updated CRM ⇄ Desk integration settings' action from blank value to config.updated" (2409-01) — raw value, and it does not say which setting changed.

## CRM ⇄ Desk — data group (CRM side as test user 1 nameb56175; Desk as mahmoud.mahamed1515)
### NDC-2403 — PASS
- CRM contact "QA RT 2403" (first name + email only, 14318a6e) → after 45 s no Desk contact; Failure Log "Mandatory field missing: Last Name is required in Desk, but the CRM record has no value for it. Fill it in CRM, or map another CRM field to it." Control "QA RT 2393 Pair" (d9a7b0fa, with last name) → Desk contact f0de6428, link synced.
### NDC-2393 — PASS
- DELETE /links/61f4a99c → 204; CRM PATCH title "QA RT after unlink" → 200; 50 s later: no link for the pair, Desk title still empty (not synced). Manual POST /links → 201 (f2e7a3dd) (was 409 because it had re-linked).
### NDC-2395 — PASS (INFO)
- Desk contact "QA RT 2395 Dup" (c5f64eca) with the paired email → Failure Log: "The CRM contacts record "QA RT 2393 Pair" with the same email is already paired with Desk record "QA RT 2393 Pair"." — both records named, API and UI (2395-01).
- INFO: older account failures still read "…Desk record e94d9d81-…" — that Desk account no longer exists (404), so no name is available.
### NDC-2400 — PASS: Desk › Contacts list chips "Synced" / "Needs attention" (19), no raw values (2400-01).
### NDC-2394 — PASS: sync paused (POST /pause 200) → Tickets › layout picker: Work Modes shows "Handshake Mode is unavailable while the CRM sync is paused." (no Handshake option) (2394-01).
### NDC-2404 — PASS: CRM contact "QA RT 2404 Phone" (860c468b, phone +201005552404, no email) created; paused; Desk contact "QA RT 2404 desk" (0c7e7a90) same phone + ticket fd913c6d, plus phone-only ticket 6fbde867; resume; 50 s later POST /tickets/classify → both crm_contact_or_lead (was not_in_crm).
### NDC-2405 — PASS: on_crm_delete = keep; paused; CRM contact d9a7b0fa deleted (204); preference changed to delete (PUT 200); resume; 50 s later Desk contact f0de6428 still there (not deleted), link needs_attention. Preference restored to keep.
### NDC-2408 — PASS: ticket #469 (fd913c6d) of linked Desk contact "QA RT 2404 desk"; CRM pane normally shows CRM Contact Info; with /desk/integrations/crm/context requests aborted → "Could not load this section." + Retry button; after unblocking, Retry loads the pane (QA RT 2404 desk · Synced, Info tab) (2408-01..03).
### NDC-2407 — PASS: panel.profile_access set (Desk Agent contacts + accounts none, others full; PUT 200). Agent fedelav803 (Desk Agent) opens ticket #298: no CRM rail icon, no pane (only Ticket Properties) (2407-01). Control after restoring profile_access [] → agent sees "CRM Contact Info" rail (2407-02). (Agent signed in via login-desk-x.js reading automation/.auth/extra-credentials.csv.)
### NDC-2399 — BLOCKED (needs OK): requires Disconnect + Connect of the shared staging integration to see the initial-sync notice; approval covered pause/resume/settings only. Ask at Gate 2.
- Integration config after all changes diffed identical to integration-baseline.json (except row_version). Status: enabled, not paused.
- Cleanup (integration data): CRM contacts 14318a6e (2403), 860c468b (2404) [d9a7b0fa deleted]; Desk contacts f0de6428, c5f64eca, 0c7e7a90 + their synced CRM/Desk partners; Desk tickets fd913c6d (#469), 6fbde867 (#470); links f2e7a3dd.

## Recycle Bin group (CRM, 35 items in bin at start, mostly another session's QA W2 data)
### NDC-1597 — PARTIAL
- Module filter (Filters › Module) lists 40 modules with counts, all formatted labels (Accounts, Contacts, Leads, Workflow Rule, Saved View, Org Unit, Profile, Approval Process, Blueprint …); no raw lowercase names (1597-01). Blueprint now offered.
- Still missing: search "pipeline", "review", "assignment", "action" → "No results found" — Pipeline, Review Process, Assignment Rule, Action not offered. Odd entry "23c1a6s8d46a (1)".
### NDC-1600 — PASS: Deleted by lists all 16 users with counts incl. 0 (Ahmed Hegazy NDC (0) … ndc-staging-owner (34), test user 1 (1), test user 2 (0)) (1600-01).
### NDC-1601 — PASS: select Leads (7) in Module → reopen → all 41 options still there (1601-01).
### NDC-1795 — PASS / NDC-1797 — PASS
- 60 leads "QA RT 1795 bulk 01–60" created and deleted → bin filter Starts with "QA RT 1795" → "60 items", 50 rows on page; select all → "Delete (50)" → "Permanently delete 50 records? This can't be undone." → Delete forever → POST /recycle-bin/delete ids=50 200 (all succeeded) → list re-fetched automatically (GET items ×2) and shows the remaining 10 without a page refresh (1795-01, 1795-02); API: 60 → 10 (all 50 gone).
### NDC-1603 — PASS (INFO)
- Unique field qa_rt_uniq (1ef504b5) on Leads layout "test". Lead "QA RT 1603 B" (value QA-RT-U1) → duplicate while live → 422 "QA RT Uniq is already in use by another record."; B deleted; "QA RT 1603 A" created with QA-RT-U1.
- Bin → Restore B → POST /recycle-bin/restore 200 {succeeded: [], failed: [{reason_key "recyclebin.error.name_conflict", detail "QA RT Uniq is already in use by another record."}]}; toast "QA RT 1603 B: QA RT Uniq is already in use by another record."; only A holds the value (1603-01).
- INFO: no "rename on restore" option (ticket suggested rename or skip; it is skipped).
### NDC-1602 — BLOCKED
- Bin filled to 244 items (200 "QA RT 1602 fill 001–200" leads deleted + others). Clicking Empty Bin was refused by the Claude Code auto-mode classifier (irreversible deletion) although the user approved testing it. Not run; needs the user to allow it (or run Empty Bin themselves). The 200 QA RT fill items stay in the bin until cleanup.

## Second retest — 26 Oct 2026 (user: "retest the 2 tickets that still in ready for test")
### NDC-1602 — PASS → Done
- Bin 281 items (API). Empty Bin › type DELETE › confirm (07:58:09 UTC). Page sent 6 × POST /audit/recycle-bin/delete (50,50,50,50,50,31 ids), all 200, 1.4–5.6 s each; no 504.
- Banner "Working on it…" → "Deleting… 100 of 281 items done. You can keep using the page."; count went 281 → 181 → 17.
- 16 left (API): owner's items of deleted/test modules (14 Sep–18 Oct) → recyclebin.error.forbidden. Second Empty Bin: 17 ids, 0 ok, 16 forbidden + 1 not_found ("QA W2 UI 50121", stale row). Toasts per item ("(no name): You don't have permission to do this. (8 items)"). INFO: no final summary; header 17 vs 16.
### NDC-2399 — PARTIAL → Bug
- Config backed up (integration-before-2399.json). Disconnect 08:04:19 UTC, Connect 08:05:03 UTC ("Integration connected.").
- Runs: initial_customers requested 19, skipped 14, needs_attention 5; initial_contracts requested 2, needs_attention 2.
- Bell: "CRM customer sync finished: 0 added, 0 updated, 5 could not sync" and "CRM contract sync finished: 0 added, 0 updated, 2 could not sync", body "The Failure Log lists the records that could not sync." Titles truncated in the list.
- Missing: skipped count (14); Failure Log still 19 entries, newest 07:30 UTC — none of the 7. Email not checked (no mailbox access).
- Config after = before (only import timestamps).
- Plane: both commented + state set + image attached (scripts/plane-post-rt2.js, plane-attach.js with attach-rt2.json); read back OK.
