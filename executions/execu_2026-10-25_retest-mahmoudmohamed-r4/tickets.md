# Retest round 4 — ticket specs (Mahmoud Mohamed, 50 tickets)

- **Pulled:** 25 Oct 2026 from Plane project NDC (efce4d84-5876-4015-b472-2efca7ad73f3), read-only (workitem retrieve_by_identifier + all comment pages).
- **Latest deploy note found:** no comment carries a version/release deploy note. The newest developer notes are the 21 Oct 2026 batch by author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (11:05–11:40 +03:00), which cite commits: metadata-engine **fb85739** (NDC-1337, 11:31), client-engine **3a1769f08** (NDC-1232, 11:31), client-engine **0a8125e0f** (NDC-1333, 11:38); the last one of the batch is NDC-1324 at 11:40:38 +03:00 (no commit named). Nothing from developers after 21 Oct; the newest comment of all is the QA pass on NDC-1337 (25 Oct 16:27 +02:00).
- **Authors seen:** e1364b0b-… = QA account; 00a20184-a95d-4ad8-a9d9-6273a8ba704f = developer (not on the given list, posts "Retest on staging … FIXED / NOT TESTED / PARTLY FIXED" notes); 9c2ff309-… = developer (only on NDC-1554); 83c4a765-… = no comments on these 50.
- **No comments at all:** 1335, 1693, 1695, 1698, 1599, 1692, 1598, 1689, 1691, 1694, 1700, 2393, 2394, 2395, 2396, 2397, 2398, 2403, 2404, 2405, 2399, 2400, 2401, 2402, 2407, 2408, 2409, 1597, 1600, 1795, 1797, 1601, 1603, 1602.
- No inline images in any comment (evidence referenced by filename only).

# CRM

## NDC-1302 — Deals | Selecting a stage on a deal either fails with "Validation failed" or applies the stage but switches the deal to the default pipeline
uuid: 2610d4f4-1d79-4d2b-80d1-e70ac05915c7
priority: urgent

**Steps**
1. Settings › Pipelines — confirm pipelines Standard (default), test, Test-Pipeline, each with own stages.
2. Deals › Create Deal; Amount 5000, Deal name testdeal-01.
3. Change pipeline Standard → Test-Pipeline; Save. Record opens — note pipeline shown.
4. Click a stage (test-02); read message, check stage applied. Try another (qualification).
5. Use Change pipeline to set back to Test-Pipeline, select a stage again.
6. After any applied stage, check which pipeline the deal is on.

**Expected**
- Stage applies and saves; deal stays on its own pipeline (never moved).
- Stages offered = deal's own pipeline's stages, all selectable.
- If a stage cannot be applied, message names the field and rule.

**Actual (old)**
- "Validation failed": PATCH /api/v1/modules/f42cbafd…/records/1d92d094… → 422 (3 times: 32.1s, 34.2s, 46.3s).
- Other attempts: stage applied but deal moved to default pipeline Standard; record showed "Standard (Default)" though created on Test-Pipeline.
- Message names no field/rule.

**Environment** NDC-Staging, Anyware CRM Deals; https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/records/1d92d094-084b-449d-92de-9877adf1b181 (Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430, layout fcba0068-d67f-44f5-8412-cdef9c09e16e); stages tried test-01, test-02, qualification; Edge 152, Win10. Jam https://jam.dev/c/669a8a1a-b5f7-47bd-915c-20b67b933bce

**Comments**
1. 2026-10-21T11:39:51+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix/self-retest note): "Retest on staging-crm, 2026-10-21: FIXED. Deal on a non-default pipeline: PATCH only the stage → 200 and the deal stays on its pipeline (no switch to default). A stage outside the pipeline → 422 naming the stage, the pipeline and the allowed stages, shown by the deployed UI instead of 'Validation failed'."
2. 2026-10-21T15:53:10+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest PARTIAL — 21 Oct 2026.** Env staging-crm.taviportal.com, NDC-Staging, Edge headless (playwright), main account mahmoud.mahamed1515 (CRM Admin + Desk Administrator); helpers ndc-staging-owner, test user 1 (nameb56175), mahmoud.mmohamedsamy. Manual browser + API. Dev note holds for deals already on a non-default pipeline; not covered: a deal cannot get onto a non-default pipeline in the first place. Stage selection on deal already on pipeline "1" works UI+API (3 stage clicks applied, pipeline kept); outside stage → clear 422. But a deal created on pipeline "1" (UI and API) or moved with Change pipeline is stored on the default — 201/200 with pipeline silently replaced; a stage of the chosen pipeline is rejected ("not part of the 'Standard' pipeline"). Same on Test layout. Only an import puts a deal on a non-default pipeline.
   - Deal keeps pipeline it was created on / moved to → Create & Change pipeline 200/201 but server stores default; record shows Standard (Default) [FAIL]
   - Stage selection keeps pipeline → deal on "1": qualification, negotiation, test-01 applied, pipeline unchanged [PASS]
   - Stages offered = deal's own pipeline → test-01 … identify_decision_makers shown and selectable [PASS]
   - Clear message when refused → 422 "Stage 'qualification' is not part of the 'Test-Pipeline copy' pipeline. Choose one of: …" [PASS]
   - Still failing: Step 3 create on Test-Pipeline/"1" → stored on Standard (Default) (POST 201, pipeline replaced). Step 10 Change pipeline → PATCH 200 but pipeline unchanged (Standard). Evidence: NDC-1302-retest-PARTIAL.png.

## NDC-1337 — Field Permissions | Permissions are not enforced from either the Field Permissions tab or the layout builder — every field stays readable and writable
uuid: 7bebac68-d7df-4c90-8b90-73e985d0d539
priority: urgent

**Steps**
1. Settings › Modules and Fields › Leads › Fields tab › Field Permissions; choose a profile; set some fields Read Only, others Don't Show; Save.
2. Open a layout for editing › field cog › Set Permission › PERMISSIONS tab › restriction for the same profile › Apply; save layout.
3. Sign in as a user subject to those permissions › Leads › Create Lead.
4. Check Don't Show fields absent; try typing in Read Only fields; fill, Save, open the record and check values.

**Expected**
- Don't Show fields not on the form; Read Only visible but not editable and changes rejected; only Read and Write editable.
- Enforced identically whichever screen set them; record save rejects writes to restricted fields (server-side, not only the form).

**Actual (old)**
- No permission enforced from either route; Don't Show fields appear; Read Only fields accept input; record saves values in all; both screens report "saved".

**Environment** NDC-Staging, Anyware CRM; Leads module 841043e1-c078-41f9-8d6e-dfd61bee45c3; Edge 151, Win10. Jam https://jam.dev/c/d364e9d7-b6d2-4c20-b9e8-1214befe12bf

**Comments**
1. 2026-10-21T11:31:24+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): Retest attempt on staging-crm 2026-10-21: NOT TESTED — needs a restricted non-admin user login (only tenant owner available, which bypasses field permissions by design). Code fix on metadata-engine staging (fb85739: resolver bypass narrowed from metadata.acl.manage to tenant admin, so a stock CRM Admin is now subject to field permissions). Left In Progress until tested with a restricted user.
2. 2026-10-25T16:27:08+02:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retested 25 Oct 2026 (CRM go-live Wave 1) — passes on staging-crm.** API: profile with Company = Don't Show and a field = Read Only → writing either refused 422 FIELD_PERMISSION_DENIED; hidden value not returned. Screen (restricted user): Company not on create form or record page; read-only field (Email) shown but cannot be typed into. Control: owner sees both. Not retested yet: setting the permission from the layout builder dialog (it was set via API), and import (Wave 2). State not changed. Automation: crmaccess FieldPermissionTest + RestrictedUserUiTest.

## NDC-1335 — Modules and Fields | Saving a layout fails with "Failed to update options for Subform" when the layout has no subform — a 404 on a non-existent field
uuid: 7e7ab4ed-955a-4bcd-a947-a70c1cd04ac2
priority: urgent

**Steps**
1. Settings › Modules and Fields › Leads; open layout "New Layout 2" for editing.
2. Make any change, Save; note red banner "Failed to update options for Subform" (several times); confirm layout has no Subform field.
3. Click Cancel — unsaved-changes prompt (save did not complete).
4. Separately create a new layout with only system predefined fields (no additions), Save — same error.

**Expected**
- Layout saves with confirmation; no Subform error when there is no subform; a failing field is named with the reason; predefined-only new layout saves.

**Actual (old)**
- "Failed to update options for Subform" ×8; PUT /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/fields/05f054f7-c3fc-4454-9a87-6543a2b90b8d → 404 (at 4.6s and 24.1s); save never completes; same on new predefined-only layout.

**Environment** NDC-Staging, CRM Settings › Modules and Fields › Leads › layout editor; Leads 841043e1-c078-41f9-8d6e-dfd61bee45c3; Edge 151, Win10. Jam https://jam.dev/c/5afb54f5-b342-4b5f-83dd-4d59c485ae89

**Comments** — none.

## NDC-1693 — Modules and Fields | Creating a new module returns 500 Internal Server Error.
uuid: 272041ae-50ce-44b2-8b53-874a7e5fa60c
priority: urgent

**Steps**
1. Settings › Customization › Modules and Fields (https://crm.taviportal.com/settings/modules-and-fields) › "+ Create New Module".
2. Choose a teamspace; display name "testModule"; key as generated "testmodule"; Description empty; Create.
3. Repeat with another teamspace (tried "test" and "CRM Teamspace").

**Expected**
- Module created and listed; otherwise an explanatory message; a valid request never gives a server error.

**Actual (old)**
- HTTP 500; "An unexpected error occurred. Trace id: …" inline and as toast; module not created; same for both teamspaces; no console errors (server-side).

**Environment** Anyware CRM https://crm.taviportal.com/settings/modules-and-fields; Edge 152.0.7977.83, Win10. Jam https://jam.dev/c/da1e0a09-01e4-49b5-a3ba-a24cded28f09

**Comments** — none.

## NDC-1344 — Audit Log | The entity filter is incomplete and does not cover all system entities
uuid: 6caaf05c-1eaf-4935-837e-43e983976444
priority: high

**Steps**
1. Settings › Security Control › Audit Log (https://crm.taviportal.com/settings/security/audit-log).
2. Click the "All Entities" filter; scroll the full list.
3. Compare with Settings features (Modules and Fields, Automation, Process Management, Data, Integrations, Security Control); note missing types and internal names.

**Expected**
- Every entity a user can create/change/delete has a filter type; list complete and consistent; user-facing labels only.
- Required grouping: Automation NOT grouped (Workflow Rule, Review Process, Approval Process, Assignment Rule, Action, Blueprint each separate); Module Configuration = ONE filter (layouts, layout rules, validation rules, fields, field permissions, pipelines, stages, record locking configuration, lead conversion mapping, tags, buttons, links, map dependency fields); Import / Export NOT grouped (separate); Email = ONE filter (Email Templates, Email Signature, Email Providers, the 4 Mail rows); Security and System = ONE filter (Security Policies, Capabilities, Data Types, Timeline Visibility, Activity Reminders, Web Tabs); Company = ONE filter (Business Hours, Shift).
- Missing to add: modules Task, Call, Meeting, Subscription + custom modules; Review Process, Assignment Rule, Action (saved actions), Blueprint; Export, Recycle Bin; Email Signature, Email Provider; security items above.
- Rename: "audit log entry" → Audit Log Entry; "Setting" too vague; Mail connection/message/outbox/system connection row → user-facing or folded into Email.

**Actual (old)**
- 27 options: All Entities, Contact, Lead, Account, Deal, User, Profile, Permission, Org Unit, Business Hours, Shift, Company, Global Set, Dashboard, Teamspace, Workflow Rule, Approval Process, Email Template, audit log entry, Setting, Import, Mass Delete, Mail connection row, Mail message row, Mail outbox row, Mail system connection row, Session.
- Only 4 modules; automation partial; no module configuration; no Export/Recycle Bin; 6 internal names; inconsistent grouping.

**Environment** NDC-Staging, CRM Settings › Security Control › Audit Log; Edge 152, Win10. Jam https://jam.dev/c/221a6abf-f709-4ea2-a0e2-8067d586ca65

**Comments**
1. 2026-09-08T15:20:29+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA): @mention 9529016b-e67d-42b9-815c-263f673b8252 — some entity filters need explanation as names don't say what they contain: User list preference; Record link; Messaging outbox row; Leads (why only module with its own entity while others cover all modules' records and configuration); Audit log entry; Global set.
2. 2026-09-08T15:24:51+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): Retest of NDC-1344 Failed — Assignment rule, Review process, Actions, and Pipeline entities missing in entity filter. Jam https://jam.dev/c/3d6b2b5b-3214-47c5-97b2-0fbbe0fd52e0
3. 2026-10-21T11:38:48+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): FIXED (verified in deployed bundle + locale). Filter now has grouped options Module Configuration, Email (incl. signatures), Security and System, plus review process, assignment rule, saved action, blueprint, record export and recycle bin; raw names replaced by labels ("Module Configuration", "Security and System", "Workspace Setting", …). Please confirm in UI.
4. 2026-10-21T15:53:57+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest PARTIAL — 21 Oct 2026** (staging-crm, NDC-Staging, Edge headless, mahmoud.mahamed1515; manual browser + API). Missing entities and groups held; duplicates/raw names not fixed. Also Audit Log recorded no events between 20 Oct 21:33 UTC and 21 Oct 11:14 UTC.
   - Missing entities added → all present: Review Process, Assignment Rule, Action, Custom Action, Blueprint, Web Form, Customer Portal, Import, Export, Mass Delete, Recycle Bin, SMS, Skill… [PASS]
   - Grouping → single options; Module Configuration sends the grouped entity types [PASS]
   - User-facing labels → "Audit Log Entry" labelled [PASS]
   - Consistent list → duplicates Workflow rule / Workflow Rule, Approval process / Approval Process, Blueprint ×3, Profile ×2; raw types Mail template, Module view among modules [FAIL]
   - No repeated module block → modules block repeated at end of list [FAIL]
   - Feed labels → "restored a audit.entity.leads" raw i18n key [FAIL]
   - New finding → no audit events 20 Oct 21:33–21 Oct 11:14 UTC (pipelines, imports, records, settings changed) [INFO]
   - Still failing: entity list duplicates & raw types; feed raw key audit.entity.leads instead of Lead. Evidence NDC-1344-retest-PARTIAL.png.

## NDC-1333 — Activity Reminders | The settings page has two scroll bars, causing unpredictable scrolling
uuid: de47141e-6067-44f5-9bd0-e0520030ecf7
priority: high

**Steps**
1. Settings › Activity Reminders (https://crm.taviportal.com/settings/activity-reminders); note outer page scroll + inner panel scroll.
2. Scroll to Reminder card fields, toggle Call Duration; scroll to Additional users, select a user; scroll to Additional profiles, select a profile.
3. Scroll back up and toggle a field again; move pointer between inner panel and page background while scrolling.

**Expected**
- Single scroll bar; predictable section movement; a checkbox click always affects the item shown there and never scrolls the page.

**Actual (old)**
- Two scroll bars (page + inner panel); scroll target depends on pointer; displayed vs clicked item fall out of step (click registered on a user's email while toggling a Reminder card field).

**Environment** NDC-Staging, CRM Settings › Activity Reminders; items: Call Duration, Contact Name, Provider; users Mahmoud Samy, Mahmoud Mohamed, Ahmed Hegazy NDC, ndc-staging-owner; profiles CRM Admin, User; Edge 151, Win10, 1912×922. Jam https://jam.dev/c/18b0d304-bc14-41bc-9299-c3a98dfa972d

**Comments**
1. 2026-10-21T11:38:31+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): FIXED (verified in deployed bundle). Inner principal list no longer has its own max-height/overflow, so only the settings column scrolls (client-engine 0a8125e0f). Please confirm visually.
2. 2026-10-21T15:53:20+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest FAIL — 21 Oct 2026.** Partly: inner list no longer scrolls, but page still has two scroll layers — settings column (scrollHeight 2733 in 664) and window (document 2727 in 720). Wheeling past column end scrolls window 2007 px and page content disappears (blank page).
   - No scroll area inside users/profiles lists → no own overflow [PASS]
   - Only one scroll bar → two layers remain; wheel past column end scrolls window 2007 px, blank page [FAIL]
   - Checkbox click never scrolls → no mis-click seen (headless) [INFO]
   - Still failing: Step 1/5 single scroll bar expected. Evidence NDC-1333-retest-FAIL.png.

## NDC-1695 — Teamspace | Renaming a folder returns success but doesn't actually change the folder name.
uuid: 1f8d297e-3c5b-45ea-8a02-23a627a07b05
priority: high

**Steps**
1. Settings › Customization › Teamspace (https://crm.taviportal.com/settings/teamspace) › open a teamspace with a folder (teamspace "test" 8ee1838d-258b-4d48-bd3c-8cdcc94a9673).
2. Note folder name under Modules; rename "test" → "TestFolder" (folder 5561193a-c858-4e1f-8268-676b1ceddf01); confirm new name in Modules card.
3. Save; wait for "Teamspace updated successfully".
4. Reload / navigate away and back; check folder name under Modules and in left navigation.

**Expected**
- New name persists after save and reload, shown in left nav; if not saveable, fail with a reason rather than success.

**Actual (old)**
- Success toast shown, but after reload folder shows original name; no error/warning.

**Environment** Anyware CRM https://crm.taviportal.com/settings/teamspace (Edit Teamspace); Edge 152.0.7977.83, Win10. Jam https://jam.dev/c/1fdb4259-9794-4b45-b9ae-e3c09602aac9

**Comments** — none.

## NDC-1698 — Teamspace | There is no delete button/icon for modules that belongs to folders unlike Root modules that has a delete icon.
uuid: 58b2cbc1-4ad2-4936-8131-d9155f75ebf8
priority: high

**Steps**
1. Settings › Customization › Teamspace › open a teamspace.
2. Under Modules › "Create Folder", name it; "Add Modules" into that folder; add a second module at the root; Save.
3. Compare end of row for in-folder module vs root module; try to remove the in-folder module without deleting the folder.

**Expected**
- In-folder module has same delete icon as root module; removing one module doesn't affect folder or siblings; row controls independent of folder placement.

**Actual (old)**
- No delete icon on in-folder module row (no row menu); root module has one; folder delete removes whole folder; only way to remove is deleting the folder.

**Environment** CRM https://crm.taviportal.com/settings/teamspace (Edit Teamspace); teamspace "test" — folder "test" containing "subscriptions"; "meetings" at root; Edge, Windows; signed in as ndc-staging-owner; 16 Sept 2026.

**Comments** — none.

## NDC-1231 — Modules and Fields: Field Properties | Selecting "another field on the same form" in Auto-fill reverts to "Don't auto-fill"
uuid: be737169-4caf-48c5-8b8f-20b3894b2bbe
priority: medium

**Steps**
1. Settings › Modules and Fields › Leads › open a layout for editing.
2. Options menu on field "Single Line 2" › properties › ADVANCED tab › Auto-fill section.
3. FILL FROM dropdown › select "another field on the same form"; observe value; look for a picker listing other layout fields.
4. Compare: select "The agent's saved setting" (SETTING picker, e.g. Wallet Number (Personal Settings)) and "The logged-in user" (USER ATTRIBUTE picker, e.g. Full name) — both hold selection.

**Expected**
- Same-form option stays selected; picker lists other layout fields; field takes the chosen field's value while empty ("Fill this field automatically while it is empty. A value someone already saved is never overwritten."); behaves like the other two sources.

**Actual (old)**
- Dropdown reverts to "Don't auto-fill" immediately; no source picker; cannot configure/save; other two sources work.

**Environment** NDC-Staging, CRM Settings › Modules and Fields › Leads › layout › Field Properties › Advanced › Auto-fill; FILL FROM options: Don't auto-fill · The agent's saved setting · The logged-in user · another field on the same form; Edge 151, Win10. Jam https://jam.dev/c/6be4dbd9-3d6b-4cfd-a7f2-18314bb67ef0

**Comments**
1. 2026-09-13T15:02:00+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retested 13 Sep 2026 — still failing.** Jam https://jam.dev/c/6eea7a9a-2267-4149-8523-a9d8ec0f679f. Configuration side fixed; behaviour not. Works now: FILL FROM holds same-form option (select value="record_field"); source picker appears (second select value="name"); setting saves/persists — PUT /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/fields/9eff6424-a58a-4b51-98f8-98a5d68c053a sent datatypeOptions.auto_fill = { source: "record_field", key: … } → 200, config.auto_fill.source "record_field" echoed at rowVersion 3; follow-up label PATCH re-confirmed at rowVersion 4. Still fails: with field configured to fill from Name, creating a record on that layout leaves it empty (source populated, target blank — value never copied). Fix covers properties panel and persistence only; auto-fill never evaluated when record form runs.

## NDC-1312 — Pipelines | Changing a deal's pipeline does not ask which stage the deal should move to
uuid: ce5dac3d-cf36-417f-afb0-ad599be28017
priority: medium

**Steps**
1. Deals › open deal test-01 (pipeline Standard (Default)); confirm current pipeline and stage.
2. Click pipeline selector at top of record › choose "test"; confirmation modal appears — note no stage selection; click Change pipeline.
3. Repeat with "Test-Pipeline"; after the change check the deal's stage in the new pipeline.

**Expected**
- Pipeline change asks for the stage in the new pipeline; stage list = destination pipeline's stages; deal ends on a stage belonging to new pipeline; if no stage chosen, block or default to first stage and say so.

**Actual (old)**
- Modal only confirms; "Record updated successfully"; deal moved with no stage chosen (Standard → test, test → Test-Pipeline); left in a pipeline whose stages it was never mapped to.

**Environment** NDC-Staging, CRM Deals record pipeline selector; deal test-01; pipelines Standard (Default) → test → Test-Pipeline; Edge 152, Win10. Jam https://jam.dev/c/a378d2a6-ff40-4db5-a21e-3f223e92ab47

**Comments**
1. 2026-10-21T11:40:05+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): FIXED (verified in deployed bundle + server code). Change-pipeline modal asks for "Stage in the new pipeline" (defaults to first stage); server moves a cross-pipeline change to the destination's first stage. Not exercised end-to-end: Deals module on the test tenant has no pipeline field. Please confirm on NDC-Staging.
2. 2026-10-21T15:54:46+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest FAIL — 21 Oct 2026.** UI part held; the change itself fails. Modal asks "Stage in the new pipeline" (destination stages, first by default). Confirming fails: server validates stage against old/default pipeline (422 "not part of the 'Standard Pipeline' pipeline") or returns 200 without moving the deal.
   - Modal asks stage in new pipeline → test-01, test-02 for "Test-Pipeline copy"; defaults to first stage with hint [PASS]
   - Deal ends on stage of new pipeline → PATCH pipeline=Test-Pipeline copy + stage=test-02 → 422 "Stage 'test-02' is not part of the 'Standard Pipeline' pipeline"; deal stays Standard Pipeline / value_proposition [FAIL]
   - Same on Standard layout → PATCH 200 but stored pipeline stays Standard (see NDC-1302) [FAIL]
   - Still failing: Steps 2–4 expected deal moved at chosen stage; actual 422 / pipeline unchanged. Evidence NDC-1312-retest-FAIL.png.

## NDC-1316 — Deals - Mass Update | Pipeline is not offered as a field, so deals cannot be moved between pipelines in bulk
uuid: 4c9b218f-b4a4-4a43-b279-92042723719d
priority: medium

**Steps**
1. Deals module (f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430); tick 2+ deals; actions menu › Mass Update.
2. Click "Choose a field"; type "pipeline"; note result; scroll full field list.

**Expected**
- Pipeline available in Mass Update; choosing destination pipeline also prompts for stage; stage list = destination pipeline's stages; defaults to destination's first stage (as in Zoho CRM).

**Actual (old)**
- "pipeline" search → "No results found"; Pipeline not anywhere; no bulk pipeline move; no stage prompt.

**Environment** NDC-Staging, CRM Deals Mass Update; reference Zoho CRM mass update (Pipeline + Stage together); Edge 152, Win10. Jam https://jam.dev/c/3d79833d-fa2c-4c98-8ff2-36e343469f08

**Comments**
1. 2026-10-21T11:40:28+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): FIXED (verified in deployed bundle). Mass Update now offers Pipeline, requires both destination pipeline and stage. Not exercised end-to-end (test tenant Deals has no pipeline field). Please confirm on NDC-Staging.
2. 2026-10-21T15:54:59+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest FAIL — 21 Oct 2026.** UI held; update fails. Mass Update offers Pipeline with destination stage (first default). Update records → "Updated 0. 2 could not be updated" — stage validated against Standard; failures listed by record UUID.
   - Pipeline available → listed (search "pipe" finds it) [PASS]
   - Stage from destination → "Stage in the new pipeline": test-01 (default) … identify_decision_makers [PASS]
   - Deals moved in bulk → "Updated 0. 2 could not be updated": Stage 'test-02' is not part of the 'Standard' pipeline [FAIL]
   - Failure list readable → rows identified by record UUID only [INFO]
   - Still failing: Step 3 expected 2 deals moved to pipeline "1" / test-02; actual Updated 0, 2 failed. Evidence NDC-1316-retest-FAIL.png.

## NDC-1324 — Deals Listing Page | Editing the Pipeline field inline shows an empty pipeline list
uuid: b983cc0e-7117-4929-a173-f81dd841000b
priority: medium

**Steps**
1. Deals listing https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/list/deals; locate deal test-01 (8ba8bdd0-33a1-4cbc-9607-5669487ce170), amount 1,500.
2. Click its Pipeline cell to edit inline; "Select pipeline…" control opens — check options; click again.
3. Open the same deal's record page and compare Pipeline field.

**Expected**
- Inline Pipeline lists the module's pipelines (same as record page); selecting applies it; changing pipeline also establishes the stage.

**Actual (old)**
- "Select pipeline…" list empty (twice); pipeline can't be changed from list; record page shows Standard (Default), stage qualification.

**Environment** NDC-Staging, CRM Deals listing inline edit; Edge 152, Win10. Jam https://jam.dev/c/19693318-c9d4-48e2-85a3-0f788efc42f2

**Comments**
1. 2026-10-21T11:40:38+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): FIXED (verified in deployed bundle). Inline-editing Pipeline on Deals list opens the change-pipeline modal (with layout and current pipeline) instead of empty combobox. Not exercised end-to-end (test tenant). Please confirm on NDC-Staging.
2. 2026-10-21T15:55:00+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest FAIL — 21 Oct 2026.** UI held; change does not apply. Inline edit opens change-pipeline modal with pipelines and stage; Change pipeline → PATCH 200 but deal stays on Standard (same root cause as NDC-1302).
   - Inline field lists pipelines → modal lists other pipeline ("1"); empty combobox gone [PASS]
   - Changing pipeline also sets stage → "Stage in the new pipeline" shown (qualification kept, exists in both) [PASS]
   - Selecting a pipeline applies it → PATCH 200 but stored pipeline still Standard; list and record show Standard [FAIL]
   - Still failing: "Selecting a pipeline applies it to the deal" — pipeline unchanged. Evidence NDC-1324-retest-FAIL.png.

## NDC-1593 — Import | Field-level permissions are not enforced, and a user can insert value into fields he doesn't have access to (Read/ Read and Edit) through import
uuid: dea744ef-8c6a-465c-aa95-08d79d675299
priority: medium

**Steps**
1. Settings → Modules and Fields → Leads › open layout (FieldPermissions 563411f4-6c8e-4b98-a91d-c618d88a5138).
2. Field Edit Properties › PERMISSIONS tab › Read only for your user's profile (11111111-1111-1111-1111-111111111105) › Apply › Save. Confirm on Create Lead the field is not editable.
3. Leads › Import Leads › upload Excel with a column for that field (Rich Text Permission, rich_text_8_9, 505ae4bf-c5ae-4298-9385-e1693059beeb).
4. Map fields step › Field dropdown for the column › check list; select restricted field › Next.
5. Assign & approve › Save & next; Review and submit › tick confirmation › Submit.
6. Open created record, check the restricted field. Repeat with field set to Hidden.

**Expected**
- Hidden fields not in mapping dropdown; read-only fields can't be selected as target; if supplied anyway, validation flags row with permission reason and row not imported.

**Actual (old)**
- Read-only and Hidden fields both in dropdown and selectable; validation "1 of 1 rows valid, 0 errors"; import writes value into the restricted field; same user can't type it on the form.

**Environment** TAVI CRM https://crm.taviportal.com Leads import; import session f37ccd55-f279-4749-84db-5277506f46dc; Edge 152.0.7977.83, Win10. Jam https://jam.dev/c/084bd839-6d74-447c-a9ae-8c9517cc96b3

**Comments**
1. 2026-10-21T11:33:14+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): NOT TESTED — field permissions don't apply to tenant admin, no restricted user login available. Fix (import permission gate: hidden fields dropped, read-only mapping blocked) deployed: staging GET /import/{s}/fields now returns a per-field "permission" value. Left In Progress until tested with a restricted user.

## NDC-1599 — Import | Importing to a field with Profile Visibility set to "Read" fills the field successfully with no problems ignoring the profile visibility.
uuid: a1ce40d2-7034-4ca9-8229-992adb312dd3
priority: medium

**Steps**
1. Settings → Modules and Fields → Leads › layout 114a5fb6-0a30-4b2c-ac9c-e8c3e51a21f1 with Single Line field (single_line, 7a2dec4e-7da6-428f-b7c2-85f257e6cfb1).
2. Field properties › PERMISSIONS › Profile Visibility = Read for your profile (11111111-1111-1111-1111-111111111105) › Apply, save.
3. Sign out, sign in as a user on that profile; confirm field read-only on record form.
4. Import Leads › upload Excel with a column for the field › Map fields › select the read-only field.
5. Continue Assign & approve, Review and submit › Submit; open created record and check the field.

**Expected**
- Read field not offered as import mapping target; Read means read from any source incl. import.

**Actual (old)**
- Field in dropdown and selectable; validation "1 of 1 rows valid, 0 errors"; value written; same user can't type into it on the form.

**Environment** TAVI CRM https://crm.taviportal.com Leads import; import session e3549407-cd92-4f10-abfa-edb383c4c81c; Edge 152.0.7977.83, Win10. Jam https://jam.dev/c/d56267c7-67e1-49c5-9596-3eff225878c5

**Comments** — none.

## NDC-1692 — Teamspace | Modules added to teamspace under a created folder (not Root) appears right away in the left pane as Root modules until the changes are saved. Also, deleting a folder that contains modules doesn't ask the user about associated modules behavior.
uuid: 852a67cc-74a1-4abd-94b3-c54a3e8fbdf0
priority: medium

**Steps**
1. Settings › Customization › Teamspace (https://crm.taviportal.com/settings/teamspace) › open a teamspace ("test").
2. "Create Folder", name it; "Add Modules", select several, Add.
3. Before saving, check left nav pane: where modules appear, is folder shown.
4. Save ("Teamspace updated successfully"); compare left pane.
5. Reopen teamspace › folder menu › Delete; read the dialog options; confirm; check which modules remain and where.

**Expected**
- Left pane shows saved state only until Save (or, if unsaved shown, nested under the folder).
- Deleting a folder with modules asks what to do: remove modules with folder, or move them to another folder / teamspace root; states number of modules affected; confirm button names the outcome; text describes what actually happens.

**Actual (old)**
- Modules appear in left pane before save, flat at root; after save pane corrects (nested).
- Delete offers only Cancel / "Delete folder"; dialog says folder and modules permanently deleted with all records, cannot be undone — but modules actually remain, moved to root.

**Environment** CRM Edit Teamspace; teamspace "test" — folder "Untitled Folder 1" with tasks, calls, meetings, subscriptions; leads and contacts at root; Edge 152.0.7977.83, Win10. Jam https://jam.dev/c/f4222669-cf29-4109-afb0-66a30c7c6b04

**Comments** — none.

## NDC-1232 — [Enhancement] Data Types | The header row scrolls out of view and columns are too narrow, wrapping values across multiple lines
uuid: 59cf8a69-473d-489a-96ab-d264d1679be6
priority: low

**Steps**
1. Settings › Customization › Data Types (https://crm.taviportal.com/settings/data-types).
2. Note header: Label, Category, Source, Create Layout Rule, Create Validation Rule, Edit Properties, Mark Required, Permanently Delete, + a column cut at right.
3. Check Label/Category/Source wrapping; scroll down past first rows; look for header; identify checkbox columns; note horizontal scrollbar and "Re…" column.

**Expected**
- Header fixed while scrolling; values on one line; capability columns sized to headings; table fits width or clearly indicates more columns; compact consistent rows.

**Actual (old)**
- Header scrolls away (unlabelled checkbox columns); Label wraps ("Add / ress / address", "Auto / Nu / mbe / r", "Chec / kbox / checkbox", "Ima / ge / Uplo / ad"); Source "Syste / m"; Category "Advance / d"; rightmost truncated "Re…"; rows several times too tall.

**Environment** NDC-Staging, CRM Settings › Customization › Data Types; Edge, ~1272×866; reported 25 Aug 2026.

**Comments**
1. 2026-10-21T11:31:09+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): DONE (verified in deployed CSS/bundle). Header sticky, body scrolls under it, cells no longer wrap, columns have minimum widths (client-engine 3a1769f08). Please confirm visually.
2. 2026-10-21T15:55:39+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest PARTIAL — 21 Oct 2026.** Sticky: yes; readable: no. Header stays but is transparent — rows scroll visibly under/through labels. Table 1432 px in a 954 px area; right-most column cut with no hint. Values no longer wrap; rows 44 px.
   - Header fixed → sticky but no background: row text overlaps labels [FAIL]
   - Table fits or shows more columns → 1432 px in 954 px; "Permanently Delete" cut off, no hint [FAIL]
   - Values one line, compact rows → labels don't wrap (name + API key two lines by design); rows 44 px [PASS]
   - Capability columns identifiable → headings complete (Create Layout Rule … Set Unique) [PASS]
   - Still failing: header needs a background; columns overflow without affordance. Evidence NDC-1232-retest-PARTIAL.png.

## NDC-1554 — [Enhancement] Import | Tag delimiter should be static helper text rather than a picklist, since both comma and semicolon are accepted
uuid: 424a4cb2-e177-407c-8c0f-b613e8629e7b
priority: low

**Steps**
1. Leads › Import Leads (https://crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/import).
2. Upload a file with a Tags column; Next to Map fields; map Tags column → Tags field (columns mapped: Name, Single Line Permission, Phone Permission, Email Permission, Tags — 5 of 5).
3. Look at the "Tag delimiter" control: single choice, defaults to "Comma ( , )"; helper text only "Splits a cell mapped to Tags into multiple tags."

**Expected**
- Tag delimiter dropdown removed; static helper text exactly: "Use , or ; as tag delimiters. Use one or the other within a field — mixing both in the same field is not accepted. Any other delimiter is not accepted."
- Tags split correctly with either character, no configuration.
- A field mixing both delimiters reported as an error naming the row and the field.

**Actual (old)**
- Dropdown requires one delimiter (default Comma); helper text doesn't say which characters accepted; implies semicolons not separators; mixed-delimiter field not accepted but no warning beforehand.

**Environment** NDC-Staging, CRM Leads › Import Leads › Map fields; Leads 841043e1-c078-41f9-8d6e-dfd61bee45c3; sample Tags value "New, Excel Imported, 9/9/2026"; Edge; reported 9 Sep 2026.

**Comments**
1. 2026-09-10T09:13:06+03:00 — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer — verification attempt): Not exercised in this pass — NOT moved. Attempted on crm.taviportal.com 2026-09-10. This is a CRM ticket (Leads › Import Leads › Map fields on crm.taviportal.com), not omnichannel like the rest of client-engine PR #344 wave; currently in Backlog rather than Bug unlike the other 27 in that wave. Reached importer but couldn't pass step 1: uploader takes .xlsx/.xls only (not CSV); a synthetic inline-strings workbook was accepted ("leads-tags.xlsx, 2 KB") but Next stayed disabled with no message — likely the synthetic workbook, not filed as defect; a real Excel-exported .xlsx needed. To close: import a genuine Excel file with a Tags column, map to Tags, confirm dropdown gone and helper text reads exactly the text above; check mixed-delimiter field reported as error naming row and field. Sample rows: "New, Excel Imported, 9/9/2026" (commas), "Alpha;Beta;Gamma" (semicolons), "One, Two;Three" (mixed, should be refused).

## NDC-1598 — [Enhancement] Modules and Fields | Field Listing page is missing a layout filter
uuid: 1afec5d6-f4a0-4295-bf3c-aa5f85fe2f79
priority: low

**Steps**
1. Settings → Modules and Fields → Leads → Fields → Field Listing (https://crm.taviportal.com/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3).
2. Check toolbar (search box for field names/data types + Create and Edit Fields button) for a layout control; check Layouts column chips (Name field shows FieldPermissions, New Layout, New Layout 2, "+1").
3. Search a layout name in the search box.

**Expected (proposed)**
- Layout dropdown in the Field Listing toolbar inline with search and Create and Edit Fields; lists every module layout + "All Layouts", tick on current selection.
- Selecting a layout filters to its fields; All Layouts restores full list incl. fields on no layout.
- Reference Zoho CRM (defaults to a single layout; deliberate decision whether to default to All Layouts).

**Actual (old)**
- One flat list, no layout control; layout chips truncated "+1"; search doesn't match layout names.

**Environment** TAVI CRM Leads module Fields › Field Listing tab; compared to Zoho CRM; 13 Sep 2026.

**Comments** — none.

## NDC-1689 — Teamspace | The delete icon on the Edit Teamspace page does nothing
uuid: 6eb261d3-b747-400e-a2d5-80ee6ec6efe8
priority: low

**Steps**
1. Settings › Customization › Teamspace (https://crm.taviportal.com/settings/teamspace); click a teamspace (breadcrumb Customization › Teamspace › Edit Teamspace).
2. Click the trash icon at top right of the teamspace card (level with the name); observe.
3. Back on the list, click the trash icon on the same teamspace's row; compare.

**Expected**
- Edit-page delete asks for confirmation then deletes (like list page); or, if not offered there, icon removed.

**Actual (old)**
- Click does nothing: no dialog, no deletion, no message; list-page icon works.

**Environment** CRM Edit Teamspace; teamspace "CRM Teamspace", Admin ndc-staging-owner, Accessible To All Users; Edge, Windows; signed in ndc-staging-owner; 16 Sept 2026.

**Comments** — none.

## NDC-1691 — Teamspace | Modules cannot be dragged and dropped between folders or out to the teamspace root on the Edit Teamspace page
uuid: c538e788-a842-4fe4-8a8a-6812baf3f876
priority: low

**Steps**
1. Settings › Customization › Teamspace › open a teamspace with ≥2 folders (e.g. "Sales": leads, contacts, deals, accounts, subscriptions; "Activities": tasks, calls, meetings).
2. Press-hold "leads" in first folder, drag over second folder, release; check it moved.
3. Drag same module out to the empty area of the Modules card (outside folders); check it moved to root.
4. Repeat with "meetings" in second folder.

**Expected**
- Module draggable folder → folder and saved; draggable out to teamspace root; visible pick-up and drop-target indication.

**Actual (old)**
- Rows not draggable; no handle; no drop target/indicator; nothing moves, no message.

**Environment** CRM Edit Teamspace; "CRM Teamspace" with folders Sales / Activities; Edge, Windows; ndc-staging-owner; 16 Sept 2026.

**Comments** — none.

## NDC-1694 — Teamspace | A teamspace can be saved with zero modules.
uuid: 1ad3dd03-65db-49ef-9ee4-955bf051191f
priority: low

**Steps**
1. Settings › Customization › Teamspace (https://crm.taviportal.com/settings/teamspace) › "+ Create New Teamspace".
2. Name "New Teamspace"; add no modules/folders (Modules placeholder shown); Permissions default; Save.
3. Check the teamspace list.

**Expected**
- Not saveable without ≥1 module; Save disabled until a module is added with the reason stated next to it; if intentionally allowed, empty teamspace not offered in the teamspace switcher.

**Actual (old)**
- Save enabled with empty Modules; "Teamspace saved successfully"; listed with "0 modules"; no warning.

**Environment** CRM Create New Teamspace; "New Teamspace", Accessible To All Users, Admin ndc-staging-owner, 0 modules; Edge 152.0.7977.83, Win10. Jam https://jam.dev/c/0c906351-5177-4d35-9411-048888ec75fc

**Comments** — none.

## NDC-1700 — Teamspace | Teamspace admin displays the current logged in user instead of the actual user set as teamspace admin.
uuid: 7c105508-5990-481f-898a-31c4d3c12773
priority: low

**Steps**
1. Sign in as tenant owner › Settings › Customization › Teamspace › open a teamspace; note Admin field under Permissions.
2. Sign out, sign in as a different user with teamspace settings access; open the same teamspace; compare Admin.
3. Open other teamspaces and check their Admin fields.

**Expected**
- Admin shows the stored admin; same regardless of viewer; each teamspace shows its own admin.

**Actual (old)**
- Admin = signed-in user: "Mahmoud Mohamed" when viewed by that user, "ndc-staging-owner" when viewed by owner; every teamspace shows the viewer.

**Environment** CRM Edit Teamspace; teamspaces "test", "CRM Teamspace", "New Teamspace"; users Mahmoud Mohamed and ndc-staging-owner; Edge 152.0.7977.83, Win10. Jam https://jam.dev/c/4e555681-ef46-4250-9544-fa9d693ccbc0

**Comments** — none.

# Desk

## NDC-2220 — Modules and Fields | Profiles chosen in the Create Module dialog are not applied
uuid: 982c0bb5-01f3-4514-a010-15bc162f30de
priority: urgent

**Steps**
1. Setup → Modules and Fields → Create New Module.
2. Name "QA MF Closed", Module Permission: tick only Desk Administrator → Create.
3. Sign in as a Desk Agent; open the "+" create menu and the module page; create a record.

**Expected**
- Agent does not see the module and cannot read/create its records; if saving the permission fails, dialog shows an error.

**Actual (old)**
- No error; agent sees module (sidebar and "+" menu), lists and creates records; Access Control still "All Users".
- PUT /api/v1/modules/{module_id}/permissions {"profileIds":["44444444-4444-4444-4444-444444444401"]} → 404 {"success":false,"error":{"code":"NOT_FOUND","message":"The requested resource was not found."}}. Agent: GET /modules/{module_id}/records → 200; POST /modules/{module_id}/records → 201.

**Environment** staging-desk.taviportal.com (NDC-Staging), TAVI Desk web, headless Chromium, 6–7 Oct 2026; owner creates module; Desk Agent mahmoud.mohamed1 (profile lowered) checks access. Severity Critical; spec row H10 (docs/desk-modules-fields/spec-desk-modules-fields.md), bug MF-02. Evidence: annotated TAVI vs Zoho image + original screenshot attached.

**Comments**
1. 2026-10-21T11:07:54+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): FIXED. PUT /modules/{id}/permissions {"profileIds":[…]} → 200 (was 404); GET returns the profile; module ACL access_mode "selected" with that profile.
2. 2026-10-21T17:00:11+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest PARTIAL — 21 Oct 2026.** Env staging-desk.taviportal.com, NDC-Staging, Edge headless; main mahmoud.mahamed1515 (Desk Administrator + CRM Admin); mahmoud.mmohamedsamy (Desk Administrator) for permission check; QA modules QA RT MF / QA RT Closed / QA RT Closed UI / QA RT xxxx (26 chars). Applying/enforcing held; module still shown to users not allowed. Create Module with Module Permission = Desk Administrator → POST 201 + PUT permissions 200, ACL selected. Module restricted to Desk Agent: a Desk Administrator not on list gets 403 reading/creating records, but module still in GET /modules and "+" create menu.
   - Profiles chosen applied → PUT permissions 200; ACL selected; API refuses others (403) [PASS]
   - User outside permission doesn't see module → still in "+" menu and GET /modules; click → 403 [FAIL]
   - Evidence NDC-2220-retest-PARTIAL.png.

## NDC-2233 — Modules and Fields | File and image upload restrictions are not enforced
uuid: 54c2b73e-047a-44b8-a50f-8a2586e6ced3
priority: high

**Steps**
1. Create File Upload field "QA MF file" allowed extensions [pdf], max 1 MB; Image Upload "QA MF img" [png], 1 MB.
2. On create form upload qa-mf.txt, qa-mf.png and a 2.2 MB PDF to QA MF file.
3. API: POST /api/v1/modules/{module_id}/records {"data":[{"field":"name","value":{"kind":"string","value":"QA MF upload api"}},{"field":"qa_file","value":{"kind":"object","properties":{"url":{"kind":"string","value":"x"},"mime":{"kind":"string","value":"text/plain"},"name":{"kind":"string","value":"qa-mf.txt"},"size":{"kind":"number","value":22}}}}],"layout_id":"{default_layout_id}"} — field options {"allowed_extensions":["pdf"],"max_size_mb":1}.

**Expected**
- Wrong type and too-large files refused with a message, on form and API.

**Actual (old)**
- Form accepts .txt and .png silently, no message for 2.2 MB file; API 201 Created. (SVG with script did not run.)

**Environment** staging-desk.taviportal.com (NDC-Staging), Desk web, headless Chromium, 6–7 Oct 2026; second admin (Desk Administrator). Severity High; spec row I38, bug MF-36.

**Comments**
1. 2026-10-21T11:05:20+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): PARTLY FIXED → back to Bug. API fixed: .txt/.png on [pdf] field → 422 "File type is not allowed"; 2.2 MB pdf → 422 "exceeds maximum size of 1 MB"; same for image field; valid png → 201. Remaining: form still shows no message on wrong-type/too-large pick — upload editor (client-engine libs/records-ui/src/registry/live/advanced.tsx) reads config.allowedExtensions / config.maxSize but nothing maps field options allowed_extensions / max_size_mb into them; file only refused by server on Save.

## NDC-2393 — CRM - Desk Integration | Unlink does not stop the sync: the next change links the pair again by email
uuid: 345ef0c3-275c-40bb-b107-a3d69efda0cb
priority: high

**Steps**
1. Take a linked contact pair (Desk contact + CRM contact, same email).
2. Desk contact → CRM pane → Unlink → confirm (dialog: "Syncing stops for this record until it is linked again.").
3. In CRM, change the contact's Title; wait ~40 s; open the Desk contact and the link list.
4. API: DELETE /api/v1/desk/integrations/crm/links/{linkId} → 204; PATCH /api/v1/modules/{crm contacts}/records/{id} {title} → 200; GET /api/v1/desk/integrations/crm/links?kind=contact; POST /api/v1/desk/integrations/crm/links {kind, crm_record_id, desk_record_id}.

**Expected**
- Record stays unlinked; CRM change not written to Desk (as dialog promises).

**Actual (old)**
- Link back (sync_status synced, match_source match_existing); Desk Title shows CRM value; manual re-link → 409 "The crm record is already linked."

**Environment** staging-desk.taviportal.com + staging-crm.taviportal.com (NDC-Staging), API, 20 Oct 2026, owner account. Spec rows I9, I8; gaps NDC-2392; PRD NDC-1669; bug CD-01 (evidence CD-01-unlink-does-not-stop-sync-vs-zoho.png).

**Comments** — none.

## NDC-2246 — Modules and Fields | Custom data types are listed but cannot be used to create a field (API)
uuid: da48cfe4-52d7-4307-9ad4-b53e8ac47451
priority: medium

**Steps**
1. POST /api/v1/custom-datatypes {"key":"qa_mf_dt2","label":"QA MF dt2","base_datatype_key":"single_line","icon":"type"} → 201.
2. GET /api/v1/fields/datatypes — qa_mf_dt2 listed.
3. POST /api/v1/modules/{module_id}/fields {"fields":[{"fieldName":"qa_cdt2","labels":{"en":"QA MF cdt2"},"datatypeKey":"qa_mf_dt2","required":false,"unique":false,"uniquePeerModuleIds":[]}]}.

**Expected**
- Field created with the custom type.

**Actual (old)**
- 400 {"code":"DATATYPE_KEY_UNKNOWN","message":"Field 'qa_cdt2': Datatype key 'qa_mf_dt2' is not a recognized datatype. Call GET /api/v1/fields/datatypes …"}; blocks spec J4 (delete a type in use).

**Environment** staging-desk.taviportal.com (NDC-Staging), API, 6–7 Oct 2026; second admin (Desk Administrator). Severity Medium; spec J4; bug MF-39.

**Comments**
1. 2026-10-21T17:04:01+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest PARTIAL — 21 Oct 2026** (staging-desk, NDC-Staging, Edge headless; mahmoud.mahamed1515 + mahmoud.mmohamedsamy; QA modules QA RT MF / QA RT Closed / QA RT Closed UI / QA RT xxxx). Dev note: —. Field with custom data type now accepted (201, was 400) but stored with base type single_line — custom type not kept.
   - Field created with custom type → created but stored as single_line; nothing refers to custom type (blocks "delete a type in use", J4) [FAIL]
   - Still failing: expected datatypeKey qa_rt_dt; actual "single_line". Evidence NDC-2246-retest-PARTIAL.png.

## NDC-2249 — Modules and Fields | Arabic UI leaves "Create New Layout" and the layouts description in English
uuid: 09342bb6-1402-4317-ada4-efd876ce0615
priority: medium

**Steps**
1. Switch UI to العربية.
2. Setup → Modules and Fields → open a module → Layouts.

**Expected**
- All text in Arabic.

**Actual (old)**
- "Create New Layout" and "Design your own layouts to fit your business processes…" in English.

**Environment** staging-desk.taviportal.com (NDC-Staging), Desk web, headless Chromium, 5–6 Oct 2026; Desk Administrator. Severity Low; spec L7; bug MF-23. Annotated TAVI vs Zoho image + screenshot attached.

**Comments**
1. 2026-10-21T17:04:03+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest PARTIAL — 21 Oct 2026.** Dev note: —. Button and description translated; Layouts table header "Last Modified" still English.
   - Create New Layout + description in Arabic → إنشاء تخطيط جديد / description translated [PASS]
   - All text Arabic → "Last Modified" column header English [FAIL]
   - Evidence NDC-2249-retest-PARTIAL.png.

## NDC-2394 — CRM - Desk Integration | Handshake Mode is still offered while the sync is paused
uuid: 30db2da2-741f-4669-b918-ad23f2743d45
priority: medium

**Steps**
1. Desk → Settings → CRM ⇄ Desk Integration → Pause sync (any reason).
2. Desk → Tickets → All Tickets → open Layout picker ("Classic View ▾").
3. Control: Disconnect and open picker again.

**Expected**
- Handshake Mode removed from picker with explanation while paused or disconnected (NDC-1669 §8 AC); Zoho: pausing stops all data exchange.

**Actual (old)**
- Paused: Handshake Mode listed under Work Modes and selectable. Disconnected: hidden (correct).

**Environment** staging-desk.taviportal.com (NDC-Staging), Edge, 20–21 Oct 2026, owner; sync resumed after. Spec K10; gaps NDC-2392; PRD NDC-1669; bug CD-02 (CD-02-handshake-offered-while-paused-vs-zoho.png).

**Comments** — none.

## NDC-2395 — CRM - Desk Integration | Failure Log reasons show raw record ids instead of record names
uuid: 6528401a-da40-4376-841f-25c90fab83b7
priority: medium

**Steps**
1. Have a CRM contact with email E linked to a Desk contact.
2. Create a second Desk contact with the same email E.
3. Desk → Settings → CRM ⇄ Desk Integration → Failure Log (API GET /api/v1/desk/integrations/crm/failures, last_error).

**Expected**
- Reason names the records (e.g. "already paired with Desk contact Mahmoud Mohamed"); NDC-1669 §10 readable reasons; Zoho shows record + reason.

**Actual (old)**
- "The CRM contacts record 514badee-c11a-… with the same email is already paired with Desk record cf51f6b3-cc88-…" — two full UUIDs on screen and in API last_error.

**Environment** staging-desk.taviportal.com (NDC-Staging), Edge + API, 19–20 Oct 2026, owner; 18 Oct failures show same text. Spec H10, G19; gaps NDC-2392; PRD NDC-1669; bug CD-03.

**Comments** — none.

## NDC-2396 — CRM - Desk Integration | The settings API saves invalid field mappings
uuid: 896468cb-2eef-4543-8f13-734357f05737
priority: medium

**Steps**
1. GET /api/v1/desk/integrations/crm/config.
2. Add one contact mapping row and PUT body back with fresh row_version, once per case:
   - contacts.mappings += {crm_field:"no_such_field_qa", desk_field:"description"}
   - contacts.mappings += {crm_field:"description", desk_field:"no_such_field_qa"}
   - contacts.mappings += {crm_field:"account_id" (lookup), desk_field:"description"}
   - contacts.mappings += {crm_field:"", desk_field:"description"}

**Expected**
- 422 with codes crm_field_unknown, desk_field_unknown, lookup_not_mappable, incomplete ("Pick a CRM field or clear this mapping.").

**Actual (old)**
- 200 for all four; row stored. (Direction, enums, read-only target, one-way pair correctly refused 422 CRM_SYNC_MAPPING_INVALID.)

**Environment** staging-desk.taviportal.com (NDC-Staging), API, 20 Oct 2026, owner. Spec C17, C10; gaps NDC-2392; PRD NDC-1669; similar to NDC-1273; bug CD-04.

**Comments** — none.

## NDC-2397 — CRM - Desk Integration | Settings save without row_version is accepted, so the lost-update check can be skipped
uuid: 26fdc768-743c-48bb-8037-7e18a6cef006
priority: medium

**Steps**
1. GET /api/v1/desk/integrations/crm/config.
2. Make one harmless change; PUT /api/v1/desk/integrations/crm/config without the row_version key (control: old row_version → 409 CONFLICT).

**Expected**
- Version required: 400/409/428 like the stale case ("Another administrator saved these settings while you were editing…").

**Actual (old)**
- 200; change stored, row_version advances.

**Environment** staging-desk.taviportal.com (NDC-Staging), API, 20 Oct 2026, owner; settings restored. Spec F5; gaps NDC-2392; PRD NDC-1669; bug CD-05.

**Comments** — none.

## NDC-2398 — CRM - Desk Integration | Sync History has no "failed" count
uuid: a30030d3-c2ec-4d10-ae59-04713b3a7791
priority: medium

**Steps**
1. Have ≥1 failed sync on a day (Failure Log not empty).
2. Desk → Settings → CRM ⇄ Desk Integration → Sync History (GET /api/v1/desk/integrations/crm/history?days=7).

**Expected**
- Per day/direction/record type: added, updated and failed counts (Zoho; NDC-1669 §10).

**Actual (old)**
- Rows only {date, direction, module, added, updated}, e.g. {"date":"2026-10-20","direction":"desk_to_crm","module":"contacts","added":3,"updated":3} / {"date":"2026-10-20","direction":"crm_to_desk","module":"contacts","added":9,"updated":10}.

**Environment** staging-desk.taviportal.com (NDC-Staging), Edge + API, 19–20 Oct 2026, owner. Spec H3; gaps NDC-2392; PRD NDC-1669; bug CD-06.

**Comments** — none.

## NDC-2403 — CRM - Desk Integration | Sync creates a Desk contact without its mandatory Last name
uuid: 39742df1-1a69-4323-be5d-14b7477bbf2e
priority: medium

**Steps**
1. Check Last name is required on the Desk contact layout (it is on staging).
2. Create a CRM contact with First name and Email only.
3. Wait for sync; open the Desk contact.

**Expected**
- Record fails with readable "mandatory field missing" reason in Failure Log (Zoho), or Desk fills an admin-chosen value; a required field is never left empty.

**Actual (old)**
- Desk contact created with last_name = null; no failure logged.

**Environment** staging-crm + staging-desk.taviportal.com (NDC-Staging), API, 21 Oct 2026, owner; QA records deleted. Spec G18; gaps NDC-2392; PRD NDC-1669; bug CD-11.

**Comments** — none.

## NDC-2404 — CRM - Desk Integration | Handshake Mode does not match requesters by phone
uuid: e052bf37-a420-42a2-950f-42aa4284c8ae
priority: medium

**Steps**
1. Create a CRM contact with a phone and no email.
2. Pause sync; create a Desk contact with the same phone and a ticket for it; resume.
3. Open ticket list in Handshake Mode (API POST /api/v1/desk/integrations/crm/tickets/classify).

**Expected**
- Classified Contacts/Leads, matched by phone (NDC-1669 §8 AC; Zoho: "Classification uses the CRM email or phone").

**Actual (old)**
- not_in_crm (New), both for a ticket with only the phone and for the Desk contact with that phone.

**Environment** staging-crm + staging-desk (NDC-Staging), API, 21 Oct 2026, owner; QA records deleted. Spec K4; gaps NDC-2392; PRD NDC-1669; bug CD-12.

**Comments** — none.

## NDC-2405 — CRM - Desk Integration | Changing the delete preference applies to a delete made earlier
uuid: daedede5-6b6e-4a03-86f4-2e8b5701ffb5
priority: medium

**Steps**
1. Configuration Details → Preferences: "On deleting a CRM contact" = Keep (default: "Keep the Desk contact and flag its link for review").
2. Pause sync (or busy queue) and delete a linked CRM contact.
3. Change preference to "Delete the corresponding Desk contact" and save.
4. Resume, wait ~45 s, open the Desk contact.

**Expected**
- Delete keeps the preference in force when it happened (Keep): Desk contact stays, link flagged (NDC-1669 §5 AC: not retroactive).

**Actual (old)**
- Desk contact deleted under the new preference (seen twice).

**Environment** staging-crm + staging-desk (NDC-Staging), API, 21 Oct 2026, owner; preferences restored, QA records deleted. Spec E8; gaps NDC-2392; PRD NDC-1669; bug CD-13.

**Comments** — none.

## NDC-2250 — Modules and Fields | Module list shows "UN" as last modifier of every seeded module
uuid: b32c95c3-9569-4976-abd9-df8611470a39
priority: low

**Steps**
1. Setup → Modules and Fields → look at Last Modified (GET /api/v1/modules).

**Expected**
- A real name (or "System").

**Actual (old)**
- "UN" on all 9 seeded modules; GET /api/v1/modules 200 with "lastModifiedByName": "" (created by system user a7a7a7a7-…0004).

**Environment** staging-desk.taviportal.com (NDC-Staging), Desk web, headless Chromium, 5–6 Oct 2026; Desk Administrator. Severity Low; spec B2; bug MF-24.

**Comments**
1. 2026-10-21T11:08:49+03:00 — author 00a20184-a95d-4ad8-a9d9-6273a8ba704f (developer — fix note): FIXED. GET /modules → seeded Desk modules have lastModifiedByName "System"; list renders "System" instead of "UN" for an empty name.
2. 2026-10-21T17:04:04+03:00 — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest): **Retest PARTIAL — 21 Oct 2026.** Over-corrected: "UN" gone but "System" on every module incl. Tickets (API: ndc-staging-owner) and QA RT MF (API: mahmoud.mahamed1515).
   - Real name or System → "System" shown for every module, hiding real names [FAIL]
   - Still failing: Last Modified must show the real modifier when there is one. Evidence NDC-2250-retest-PARTIAL.png.

## NDC-2399 — CRM - Desk Integration | No notice to the admin when the initial sync finishes
uuid: ba8e7ade-fce1-47b5-8a0d-bfffde52ad95
priority: low

**Steps**
1. Desk → Settings → CRM ⇄ Desk Integration → Disconnect, then Connect.
2. Wait for initial imports to finish (Sync History or GET /api/v1/desk/integrations/crm/runs).
3. Check the admin's notifications (bell / email).

**Expected**
- Admin told when initial sync is done (NDC-1669 §4); Zoho emails added / updated / ignored counts and skip reasons.

**Actual (old)**
- Runs initial_customers and initial_contracts finished within seconds; no notification.

**Environment** staging-desk.taviportal.com (NDC-Staging), Edge + API, 20 and 21 Oct 2026 (two approved reconnects), owner. Spec B11; gaps NDC-2392; PRD NDC-1669; bug CD-07.

**Comments** — none.

## NDC-2400 — CRM - Desk Integration | Desk contact list shows raw sync values "synced" / "needs_attention"
uuid: a25ec87f-08fe-4f23-aa0f-9917be10ae5f
priority: low

**Steps**
1. Desk → Customers → All Contacts.
2. Look at the status chip under linked contacts.

**Expected**
- Labels "Synced", "Needs attention", "Unlinked" (TAVI's own strings, as on the contact page).

**Actual (old)**
- Raw "synced" and "needs_attention".

**Environment** staging-desk.taviportal.com (NDC-Staging), Edge, 19–21 Oct 2026, owner. Spec I16; gaps NDC-2392; PRD NDC-1669; bug CD-08.

**Comments** — none.

## NDC-2401 — CRM - Desk Integration | Pause with a long reason fails with a server error (HTTP 500)
uuid: 71e613a6-f2c4-41ea-b4d7-828409e32e83
priority: low

**Steps**
1. POST /api/v1/desk/integrations/crm/pause {reason: 1206 characters}.
2. Control: POST /api/v1/desk/integrations/crm/pause {reason: "QA CD pause … <b>x</b>"} → 200 (stored as text).

**Expected**
- 400 stating the maximum length; Pause dialog limits the field.

**Actual (old)**
- 500 INTERNAL "An unexpected error occurred."; not paused.

**Environment** staging-desk.taviportal.com (NDC-Staging), API, 20 Oct 2026, owner. Spec B4; gaps NDC-2392; PRD NDC-1669; bug CD-09.

**Comments** — none.

## NDC-2402 — CRM - Desk Integration | Customer statistics answer 200 for a contact that does not exist
uuid: 4eb61add-499a-43ba-b97f-8f52b8e9dba5
priority: low

**Steps**
1. GET /api/v1/desk/integrations/crm/customers/contact/{random uuid}/stats?months=6.
2. Control: GET /api/v1/desk/integrations/crm/context/contact/{random uuid}/info → 404 (correct).

**Expected**
- 404 for a non-existent record.

**Actual (old)**
- 200 {"total":0,"open":0,…}.

**Environment** staging-desk.taviportal.com (NDC-Staging), API, 19 Oct 2026, owner. Spec O3; gaps NDC-2392; PRD NDC-1669; bug CD-10.

**Comments** — none.

## NDC-2407 — CRM - Desk Integration | With "No access" the CRM pane is still offered and hangs on "Loading…"
uuid: d9be6bbe-3b08-4b46-96fa-d3bb74439f5b
priority: low

**Steps**
1. Desk → Settings → CRM ⇄ Desk Integration → Permissions: Desk Agent → Contacts = No access.
2. Sign in as an agent with the Desk Agent profile; open a ticket of a linked contact.
3. Open the CRM rail icon.

**Expected**
- No CRM pane or rail icon (NDC-1669 §6 AC), or at least a clear "Your profile cannot open this tab." state.

**Actual (old)**
- CRM rail icon and "CRM Contact Info" pane offered; spinner "Loading…" never ends (data calls 403; no data leak).

**Environment** staging-desk.taviportal.com (NDC-Staging), Edge, 21 Oct 2026, Desk agent account (Desk Agent profile); access restored. Spec J4; gaps NDC-2392; PRD NDC-1669; bug CD-15.

**Comments** — none.

## NDC-2408 — CRM - Desk Integration | The CRM pane error "Could not load this section." has no Retry
uuid: 9172815a-4166-4c5b-bf49-d6577fa56987
priority: low

**Steps**
1. Make the pane's calls fail (DevTools: block request URLs containing /desk/integrations/crm/context).
2. Open a ticket of a linked contact (e.g. ticket #298) and the CRM pane.

**Expected**
- "Could not load this section." with a Retry button (app already has the "Retry" string).

**Actual (old)**
- Message only; no Retry.

**Environment** staging-desk.taviportal.com (NDC-Staging), Edge, 21 Oct 2026, owner, ticket #298. Spec I18; gaps NDC-2392; PRD NDC-1669; bug CD-16.

**Comments** — none.

## NDC-2409 — CRM - Desk Integration | Integration settings changes are not in the Audit Log
uuid: e5df6fb8-650d-4056-ab6b-3323587c4151
priority: low

**Steps**
1. Save any change on Desk → Settings → CRM ⇄ Desk Integration (e.g. a delete preference).
2. Open tenant Audit Log (API GET /api/v1/audit/events).

**Expected**
- An entry saying who changed which integration setting and when.

**Actual (old)**
- Events for other areas; none for the integration (100 newest events checked 21 Oct) despite pause, mappings, delete preferences, permissions, connect/disconnect changes 20–21 Oct.

**Environment** staging-desk.taviportal.com (NDC-Staging), API, 21 Oct 2026, owner. Spec F8; gaps NDC-2392; PRD NDC-1669; bug CD-17.

**Comments** — none.

# Recycle Bin

## NDC-1597 — Recycle Bin | The module filter is incomplete and does not cover all system modules
uuid: e9d8afc7-7498-4ad9-8109-6b80db724105
priority: high

**Steps**
1. Settings → Data Administration → Recycle Bin (https://crm.taviportal.com/settings/data/recycle-bin).
2. Filters › Module dropdown; search "pipeline", then "review", then "assignment" — note no options; clear and scroll full list.
3. Check table Module column — an item with module Blueprint exists; search dropdown for "blueprint" and record whether offered.

**Expected**
- Module filter covers every system module that can appear in the bin; any item visible in Module column filterable by that module; searching an unavailable module shows a message, not an empty list; module names formatted consistently.

**Actual (old)**
- Pipeline, Review Process, Assignment Rule absent; Blueprint has no label entry though in bin; searches for pipeline/review/assignment/action return nothing, no explanation.
- Module column mixes formatted names (Approval Process, Blueprint, Workflow Rule) with raw lowercase CRM names (subscriptions, calls, tasks, meetings) — no labels.

**Environment** TAVI CRM https://crm.taviportal.com/settings/data/recycle-bin, bin 1000+ items; Edge 152.0.7977.83, Win10; signed in as "ND"; 13 Sep 2026. Jam https://jam.dev/c/faca686c-68fd-49d8-a9b6-3dd2fcfc2e6a

**Comments** — none.

## NDC-1600 — Recycle Bin | The Deleted by filter only lists users who currently have items in the bin, so most of the tenant's users cannot be selected
uuid: db49fd3d-7a18-4bb0-97c3-e8ba362f0bab
priority: high

**Steps**
1. Settings → Data Administration → Recycle Bin (https://crm.taviportal.com/settings/data/recycle-bin).
2. Filters › Deleted by dropdown; look at users offered; search for a colleague with an account.
3. Compare with Settings → Users (all tenant users).

**Expected**
- Deleted by lists every user the current user may filter by, with or without items in the bin; a user with nothing returns empty result with a clear message; options don't change as items are restored/deleted/expire; optional count beside each name.

**Actual (old)**
- Only users with ≥1 item in the bin offered — 1 of 7 users; no way/message for others; search for absent user returns nothing. (Page already loads full user directory.)

**Environment** TAVI CRM recycle bin, NDC-Staging, 1000+ items, 7 active users; signed in as "ND"; 13 Sep 2026.

**Comments** — none.

## NDC-1795 — Recycle Bin | Mass deleting records doesn't fetch the next list of records automatically and require the user to load them manually by clicking on Load More.
uuid: 9055774f-badf-4ed9-95d4-5079f8855547
priority: high

**Steps**
1. Settings → Data → Recycle Bin.
2. Tick top checkbox to select all on the page (50); Delete (50) › Delete forever.
3. Look at the list — next records don't load; refresh browser — remaining records appear.
4. Optional: Filters › Deals (155), select all, repeat — same.

**Expected**
- After Delete forever the list refreshes itself and shows next records; module counts in Filters (e.g. Deals) update.

**Actual (old)**
- List not refreshed, next records don't appear; full page refresh needed.

**Environment** TAVI CRM crm.taviportal.com Recycle Bin; Edge 153.0.8010.53, Win10, 1272×866; user ndc-staging-owner; 23 Sep 2026 16:27 Cairo. Jam https://jam.dev/c/9f044eb8-4153-4658-9559-ce8008eb36ab

**Comments** — none.

## NDC-1797 — Recycle Bin | Some records can't be deleted forever in a bulk delete and stay in the Recycle Bin.
uuid: 2d00ee7f-5f93-4dee-b959-161486a97919
priority: high

**Steps**
1. Settings → Data → Recycle Bin (no filter).
2. Select all on page (50); Delete (50) › Delete forever.
3. Refresh browser; check top of list — some deleted records still there (e.g. "test delete", "test", "test@test.com").

**Expected**
- All selected records permanently deleted; if one can't be, user told which and why.

**Actual (old)**
- Only some deleted — 12 of 50 stayed; still listed after refresh.

**Environment** TAVI CRM Recycle Bin; Edge 153.0.8010.53, Win10, 1272×473; ndc-staging-owner; 23 Sep 2026 16:52 Cairo. Jam https://jam.dev/c/37c14680-c5d4-4daf-90d8-a350cdba7e12

**Comments** — none.

## NDC-1601 — Recycle Bin | Selecting a Module or Deleted by option removes other options from the same dropdown, so the filter cannot be changed without clearing it first
uuid: d2251673-ef41-4f52-88fe-4f6872081379
priority: medium

**Steps**
1. Settings → Data Administration → Recycle Bin › Filters.
2. Module dropdown › scroll to bottom; note Approval Process, Blueprint, Workflow Rule, Subscriptions, Calls, Tasks.
3. Select Subscriptions; reopen Module dropdown, scroll to bottom; look for the other options.
4. Repeat on Deleted by dropdown.

**Expected**
- Dropdown options unchanged by current selection; another module choosable directly without clearing; filter changes rows shown, not choices.

**Actual (old)**
- After Subscriptions, the six are gone (only Subscriptions at end); after Leads, list ends at Canned Reply with none of the six; must clear filter to switch; Deleted by same.

**Environment** TAVI CRM recycle bin, NDC-Staging, 1000+ items; Edge 152.0.7977.83, Win10; "ND"; 13 Sep 2026. Jam https://jam.dev/c/149f100f-2772-406b-b75b-eb3d7b7e5e3d

**Comments** — none.

## NDC-1603 — Recycle Bin | Restoring a record with duplicate data to a unique field is accepted without validation.
uuid: aca8f04a-d1bf-4291-8add-987a7a7cd59d
priority: medium

**Steps**
1. Settings → Modules and Fields → Leads › open layout (New Layout) › set Name field unique › Save.
2. In Leads note existing record "RCB-020".
3. Settings → Data Administration → Recycle Bin › tick a deleted record also named RCB-020 › Restore › confirm (POST /api/v1/audit/recycle-bin/restore).
4. Check Leads list; for comparison edit a third record's Name to RCB-020 and save.

**Expected**
- Restore refused (value in use), item reported failed with conflict message; operator told which item and why, with option to rename on restore or skip; unique field never duplicated on live records by any route.

**Actual (old)**
- Restore 200 with item under succeeded; two RCB-020 records (count 9 → 10); editing third record rejected "Name is already in use by another record."; no warning on restore.

**Environment** TAVI CRM Leads, layout New Layout; Chrome 152.0.7977.83, Win10; 13 Sep 2026. Jam https://jam.dev/c/dba9d84c-b194-48b0-9457-ff4478c943b2

**Comments** — none.

## NDC-1602 — Recycle Bin | Empty Bin returns 504 Gateway Timeout.
uuid: 7f0cd60b-84ae-488e-9fd0-6a1447121c33
priority: high

**Steps**
1. Settings → Data Administration → Recycle Bin on a bin with "1000+ items".
2. Empty Bin › confirm; banner "Working on it… this can take a moment. You can keep using the page."
3. Wait ~10 s; note error; check whether previously listed items remain.

**Expected**
- Empty completes without timeout regardless of size; runs in background as promised and reports processed/failed counts; if incomplete, says what was removed; clears the whole bin, not only items loaded on screen.

**Actual (old)**
- POST /api/v1/audit/recycle-bin/delete with 100 ids → 504 after 10.09 s; "The request timed out. Please try again."; request synchronous despite banner; only 100 items submitted of 1000+; ≥2 submitted items still present.

**Environment** TAVI CRM https://crm.taviportal.com/settings/data/recycle-bin; Edge 152.0.7977.83, Win10; 13 Sep 2026. Jam https://jam.dev/c/8cd488b3-aad3-40e4-bf65-507c6dcfd434

**Comments** — none.
