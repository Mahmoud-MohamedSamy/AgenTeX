# CRM Ready-For-Test tickets — source data (Plane, read 2026-10-21)

Project efce4d84-5876-4015-b472-2efca7ad73f3. Tenant for all: NDC-Staging, Anyware CRM, https://crm.taviportal.com. Comment author ids are Plane user uuids.

## NDC-1302 — Deals | Selecting a stage on a deal either fails with "Validation failed" or applies the stage but switches the deal to the default pipeline
uuid: 2610d4f4-1d79-4d2b-80d1-e70ac05915c7

**Steps**
1. Settings › Pipelines: pipelines Standard (default), test, Test-Pipeline, each with own stages.
2. Deals › Create Deal; Amount 5000, Deal name testdeal-01.
3. Change pipeline Standard → Test-Pipeline; Save. Record opens; note pipeline shown.
4. Click stage test-02; read message, check stage applied.
5. Try stage qualification; note outcome.
6. Change pipeline back to Test-Pipeline, select a stage again.
7. After any applied stage, check which pipeline the deal is on.

**Expected**
- Selecting a stage applies it and saves successfully.
- Deal remains on its own pipeline — never moved by a stage selection.
- Stages offered are the deal's own pipeline's stages, all selectable.
- If a stage genuinely cannot be applied, message names the field and rule that failed.

**Actual (old)**: "Validation failed" — PATCH /api/v1/modules/f42cbafd…/records/1d92d094… → 422 (x3). Other attempts: stage applied but deal moved to Standard (Default). Message names no field/rule.

**Environment**: URL https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/records/1d92d094-084b-449d-92de-9877adf1b181; Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; layout fcba0068-d67f-44f5-8412-cdef9c09e16e; deal testdeal-01 (1d92d094-084b-449d-92de-9877adf1b181); stages tried test-01, test-02, qualification. Jam https://jam.dev/c/669a8a1a-b5f7-47bd-915c-20b67b933bce

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:39: "Retest on staging-crm, 2026-10-21: FIXED. Deal on a non-default pipeline: PATCH only the stage → 200 and the deal stays on its pipeline (no switch to default). A stage outside the pipeline → 422 naming the stage, the pipeline and the allowed stages, shown by the deployed UI instead of "Validation failed"."

## NDC-1332 — Activity Reminders | Before, due-time and overdue reminders all fail to fire at the specified time
uuid: edf694eb-7174-4d5c-9b31-8bf12cc9f7e1

**Steps**
1. Tasks module, open/create a task.
2. Due date a short time ahead (here 01/09/2026 11:14 AM); Reminder 5.
3. Save; confirm both values shown on record.
4. Wait for the before reminder; check notifications panel.
5. Wait for due time; check panel.
6. Wait until overdue; check panel.
7. Repeat for a Call and a Meeting.

**Expected**
- Before reminder arrives at configured interval ahead of due time, to the activity owner.
- Due-time reminder arrives when due, to the activity owner.
- Overdue reminder arrives after due time, to activity owner, Org-unit lead, and any additional recipient.
- Each notification identifies the activity and its due time.
- Reminders fire regardless of whether the user is viewing the record.

**Actual (old)**: No reminder notification at any point. Panel only has approval/review entries ("test was approved", "A record was rejected in review"). Reminder value stored and displayed; only delivery fails.

**Environment**: URL https://crm.taviportal.com/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/records/e2958666-3f84-4054-b377-7046f182dcd1; Tasks module a9d87b62-b704-4c2e-b2d5-1b745d7c2065; task "Webinar" (e2958666-3f84-4054-b377-7046f182dcd1). Jam https://jam.dev/c/858bfd77-335f-436e-9ad9-5383bce5e436

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:38: "Retest on staging-crm, 2026-10-21: FIXED. QA task due 08:30Z with a 5-minute reminder: notification "reminder.before" fired at 08:25:00Z and "reminder.overdue" at 08:31:00Z (overdue_after = 1 min), for the record owner. Each stage replaces the previous one in the panel, so the due-time notice was not seen separately — please confirm it in the UI."

## NDC-1308 — Pipelines | Stage Probability is shared across all layouts rather than being set per layout
uuid: 1c246961-6535-4806-a8c2-6ac5c62d87c2

**Steps**
1. Settings › Pipelines; ensure two pipelines share stage test-01.
2. First pipeline selected → Stage Probability; set test-01 to 15%, forecast Best Case; Save probabilities ("Stage probabilities saved").
3. Pipeline selector (showing Standard) → switch to another pipeline; Stage Probability again.
4. Look at test-01 probability/forecast.

**Expected**
- Each pipeline holds its own probability and forecast category for its stages.
- Changing a stage's probability in one pipeline does not affect the same stage in another.
- Switching pipeline shows that pipeline's own values.
- Stage Probability modal makes clear which pipeline's settings are being edited.

**Actual (old)**: test-01 at 15% / Best Case carried into the other pipeline; probability is a property of the stage, not stage-in-pipeline.

**Environment**: URL https://crm.taviportal.com/settings/pipelines; pipelines Standard and one other; stage test-01. Jam https://jam.dev/c/0d7658e4-be89-4d7e-9a2b-e0586338561d

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:39: "Retest on staging-crm, 2026-10-21: FIXED. Setting a stage probability for one pipeline (PUT /stage-probability?pipeline_id=… qualification=15) → 200; the Standard pipeline and the module master keep their own value (18). The deployed modal has a pipeline selector and "Editing the stages of {pipeline}"."

## NDC-1323 — Import Deals | Pipeline is not offered in field mapping, while Probability and Expected Revenue are offered although they are derived
uuid: 0224a274-9b0f-49b7-97f9-ffbffe83df10

**Steps**
1. Prepare Deals-01.xlsx with columns Pipeline, Probability, Expected Revenue.
2. Deals › Import Deals › Browse file › Next; Operation step › Next → Map fields.
3. Open target picker for Pipeline column — look for Pipeline field (none; set Do not import).
4. Picker for Probability column — Probability (%) offered; Expected Revenue column — Expected Revenue offered.
5. Complete import; open imported record, check pipeline/probability/expected revenue.

**Expected**
- Pipeline available as a target field so imported deals can be assigned a pipeline.
- Where pipeline is set, stage also established — from mapped stage column or defaulting to that pipeline's first stage.
- Probability (%) and Expected Revenue not offered (derived from stage and amount).
- Picker offers user-settable fields, excludes system-maintained ones.

**Actual (old)**: No Pipeline field; trying offered Probability (%) instead → error "These fields are mapped more than once probability". Pipeline column dropped. Probability/Expected Revenue mappable. Import 1 Added, record ImportedDeal-01 with no pipeline from file.

**Environment**: URL https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/import; Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; file Deals-01.xlsx; record ImportedDeal-01; result 1 Added/0 Updated/0 Skipped/0 Errors. Jam https://jam.dev/c/0bcb4fd1-c4a1-44ca-a7b0-55b8c6d85387

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:40: "Retest on staging-crm, 2026-10-21: FIXED. Deals CSV upload → suggested mapping Pipeline → pipeline; the mappable field list includes pipeline and no longer offers probability or expected_revenue."

## NDC-1325 — Pipelines | Deleting a pipeline with closed deals does not transfer them, leaving deals pointing at a pipeline that no longer exists
uuid: e6f69ff9-9466-4dfd-8253-88b2856f4d42

**Steps**
1. Deals › open ImportedDeal-01; change pipeline to twersda (confirm Change pipeline).
2. Move the deal to a closed stage (won or lost).
3. Settings › Pipelines › three-dot menu of twersda › Delete; confirm "Delete pipeline?" modal.
4. Read message after deletion.
5. Deals module › Pipeline column for affected deals.
6. Compare: delete a pipeline holding only open deals — transfer offered.

**Expected**
- Deleting a pipeline offers to transfer all its deals (open or closed) to another pipeline.
- Closed deals handled the same as open — prompt does not depend on deal status.
- No deal left referring to a pipeline that no longer exists.
- Pipeline field always shows a pipeline name, never a raw identifier.

**Actual (old)**: No transfer prompt for closed deals; message "0 moved, 2 retained. 0 skipped."; Deals list Pipeline column shows the deleted pipeline's raw id; open-deal path does prompt.

**Environment**: URLs https://crm.taviportal.com/settings/pipelines and https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; pipeline deleted twersda; deal ImportedDeal-01 (6bf6c759-e32b-451a-b395-430506507eb0); Deals list 117 records after. Jam https://jam.dev/c/97162b2c-2aa1-46f4-a44e-5c7ddb178146

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:40: "Retest on staging-crm, 2026-10-21: FIXED. Pipeline holding one closed_won and one open deal → DELETE with a target pipeline and stage remap → 200 {"transferred":2,"retained":0}. Closed deal moved to the target as closed_won, open deal to the remapped stage; the deleted pipeline returns 404. UI copy reads "Transfer deals (open and closed)"."

## NDC-1172 — Teamspace | A CRM Admin can open any teamspace they are not on the access list of, whatever accessibility option is set
uuid: 244331d7-49dc-4f9d-9fba-947440bb2433

**Steps**
1. As owner: Settings > Customization > Teamspace; edit a teamspace (e.g. "TestTeamspace").
2. Permissions > Accessible To = "Selected Users"; Edit list to contain only one user (not the CRM Admin tester); Save dialog; Save page ("Teamspace updated successfully").
3. Log out; log in as a CRM Admin profile user not on the list.
4. Sidebar teamspace switcher → select the restricted teamspace; expand a folder, open a module (e.g. Leads).
5. Repeat with the other two options: org unit the CRM Admin is not in; profile other than CRM Admin.

**Expected**
- User not covered by the accessibility rule does not see the teamspace in the switcher, regardless of profile.
- If reached by another route, access refused rather than contents loading.
- CRM Admin subject to teamspace accessibility like any profile; if meant to bypass, the setting should say so.

**Actual (old)**: Restricted teamspace shown in switcher for CRM Admin; folders load; Leads module listed 23 leads; same for all three options; nothing indicates restriction.

**Environment**: Tavi CRM https://crm.taviportal.com (Teamspace / Leads); reporter cetow80696; captured 19 Aug 2026. Jam https://jam.dev/c/604ce602-893a-427d-8524-4c699182408d

**Comments**
- e1364b0b-d3cd-4167-8261-6194577a480a, 2026-08-22 15:58: "Retest of NDC-1172 on 22 Aug. Partially fixed: (1) If a CRM Admin user doesn't have access to a teamspace it will not be available for him ⇒ Correct. (2) A teamspace's admin (Teamspace Creator) has no access to his teamspace and it's not available for him ⇒ Incorrect. https://jam.dev/c/61047ba4-6fe2-4a13-b95e-92917c215d95. Additional findings: (a) Modules section in teamspace settings page appears empty after saving the teamspace and trying to access its settings page again. (b) Any user who can access teamspaces page can see teamspace he doesn't have access to, and accessing that teamspace settings page displays the logged in user as Teamspace Admin. https://jam.dev/c/3cd27924-a437-4b7e-94d5-43b1e66fc78d"
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:38: "Retest on staging-crm, 2026-10-21: FIXED. QA teamspace with access "selected" and an ACL that excludes the caller (one other user; then profile Manager; then profile User): as the owner (same admin-bypass keys as CRM Admin) GET /teamspaces does not list it and GET /teamspaces/{id} and /folders → 403 PERMISSION_DENIED. Not re-checked with a separate CRM Admin login, and the org-unit option was not tested."

## NDC-1333 — Activity Reminders | The settings page has two scroll bars, causing unpredictable scrolling
uuid: de47141e-6067-44f5-9bd0-e0520030ecf7

**Steps**
1. Settings › Activity Reminders; note outer page scroll bar and inner panel scroll bar.
2. Scroll to Reminder card fields, toggle Call Duration.
3. Scroll to Additional users, select a user; to Additional profiles, select a profile.
4. Scroll back to Reminder card fields, toggle a field again.
5. Move pointer between inner panel and page background while scrolling; note which area moves.

**Expected**
- Single scroll bar; consistent scrolling wherever the pointer is.
- Moving between sections predictable; sections stay where expected.
- Clicking a checkbox affects the item shown at that position and never scrolls the page.

**Actual (old)**: Two scroll bars; scroll target depends on pointer; displayed item and clicked item fall out of step (click registered on a user's email while toggling a Reminder card field).

**Environment**: URL https://crm.taviportal.com/settings/activity-reminders; sections Reminder card fields, Additional users, Additional profiles; items Call Duration, Contact Name, Provider; Mahmoud Samy, Mahmoud Mohamed, Ahmed Hegazy NDC, ndc-staging-owner; CRM Admin, User. Jam https://jam.dev/c/18b0d304-bc14-41bc-9299-c3a98dfa972d

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:38: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). The inner principal list on the Activity Reminders page no longer has its own max-height/overflow, so only the settings column scrolls (client-engine 0a8125e0f). Please confirm visually."

## NDC-1344 — Audit Log | The entity filter is incomplete and does not cover all system entities
uuid: 6caaf05c-1eaf-4935-837e-43e983976444

**Steps**
1. Settings › Security Control › Audit Log; click All Entities filter; scroll full list.
2. Compare to Settings features (Modules and Fields, Automation, Process Management, Data, Integrations, Security Control).
3. Note missing features and internally-named entries.

**Expected**
- Every entity a user can create/change/delete has a type in the filter.
- List complete and consistent — related features not listed individually while siblings missing.
- Every entry has a user-facing label, not an internal/table name.
- Grouping: Automation NOT grouped (Workflow Rule, Review Process, Approval Process, Assignment Rule, Action, Blueprint each own filter); Module Configuration ONE filter (layouts, layout rules, validation rules, fields, field permissions, pipelines, stages, record locking configuration, lead conversion mapping, tags, buttons, links, map dependency fields); Import / Export NOT grouped (each own); Email ONE filter (Email Templates, Email Signature, Email Providers, the four Mail rows); Security and System ONE filter (Security Policies, Capabilities, Data Types, Timeline Visibility, Activity Reminders, Web Tabs); Company ONE filter (Business Hours and Shift).

**Actual (old)**: 27 options: All Entities, Contact, Lead, Account, Deal, User, Profile, Permission, Org Unit, Business Hours, Shift, Company, Global Set, Dashboard, Teamspace, Workflow Rule, Approval Process, Email Template, audit log entry, Setting, Import, Mass Delete, Mail connection row, Mail message row, Mail outbox row, Mail system connection row, Session. Missing: modules Task, Call, Meeting, Subscription, custom modules; automation Review Process, Assignment Rule, Action, Blueprint; all module configuration (Module, Layout, Layout Rule, Validation Rule, Field, Field Permission, Pipeline, Stage, Record Locking Configuration, Lead Conversion Mapping, Tag, Button, Link, Map Dependency Field); Export, Recycle Bin; Email Signature, Email Provider; Security Policy, Capability, Data Type, Timeline Visibility, Activity Reminder, Web Tab. Internal names: "audit log entry" → Audit Log Entry; "Setting" too vague; 4 "Mail … row" → user-facing names or fold into Email.

**Environment**: URL https://crm.taviportal.com/settings/security/audit-log. Jam https://jam.dev/c/221a6abf-f709-4ea2-a0e2-8067d586ca65

**Comments**
- e1364b0b-d3cd-4167-8261-6194577a480a, 2026-09-08 15:20 (mentions @9529016b-e67d-42b9-815c-263f673b8252): "Some Entity filters need explanation because the name itself doesn't indicate what it should contain: User list preference; Record link; Messaging outbox row; Leads (why is it the only module with its own entity, while other entities cover all modules' records and configuration); Audit log entry; Global set"
- e1364b0b-d3cd-4167-8261-6194577a480a, 2026-09-08 15:24: "Retest of NDC-1344 Failed. Audit Log | Assignment rule, Review process, Actions, and Pipeline entities are missing in entity filter https://jam.dev/c/3d6b2b5b-3214-47c5-97b2-0fbbe0fd52e0"
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:38: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle + locale). The Audit Log entity filter now includes grouped options for Module Configuration, Email (incl. signatures), Security and System, plus review process, assignment rule, saved action, blueprint, record export and recycle bin; raw names are replaced by labels ("Module Configuration", "Security and System", "Workspace Setting", …). Please confirm in the UI."

## NDC-1444 — Modules and Fields | Rollup Summary says the related module has no lookup pointing at this module, when it does
uuid: 40563a1b-3839-45ab-bc3e-2ee2e7f10945

**Steps**
1. Settings › Modules and Fields › Deals, open a layout; Connected To field properties › ADVANCED tab; confirm "Let users choose the related module at record creation" ticked and Leads among checked Related Modules. Cancel.
2. Settings › Modules and Fields › Leads, edit a layout; from New Fields add a Rollup Summary field; properties › ADVANCED.
3. Related Module = Deals; open Related List (Lookup Field) dropdown; read the message beneath.
4. Repeat with Contacts.

**Expected**
- Related List (Lookup Field) offers lookup fields on the selected module pointing at the edited module — including Connected To on Deals.
- "No lookup field" warning only when the selected module genuinely has none.
- Once relation, field and function chosen, rollup saves with the layout.

**Actual (old)**: Deals → "The selected module has no lookup field pointing at this module — add one there first, or pick another module." though Deals.Connected To (multi-module) includes Leads. Contacts → same. Dropdown empty. Second message "A rollup needs its related list, field and function before the layout can be saved." — layout can't save.

**Environment**: Leads module 841043e1-c078-41f9-8d6e-dfd61bee45c3; layout 563411f4-6c8e-4b98-a91d-c618d88a5138; related modules tried Deals (f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430), Contacts (6f553963-01d6-4b68-9fb3-143d23044c41), Leads; qualifying lookup "Connected To" on Deals (multi-module: Leads, Contacts, Deals, Accounts); field added "Rollup Summary 2". Jam https://jam.dev/c/e137b47d-65f5-46cd-9ca8-6024822a2d13

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:31: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). The Rollup Summary lookup check now accepts single-target, multi-module (target_modules) and related_module lookups, and reads the module id from the layout store (client-engine 0a8125e0f). Deals.connected_to (multi-module incl. Leads) now qualifies. Please confirm end-to-end in the UI."

## NDC-1518 — Import | "Update existing only" does not offer a Target layout, unlike the other two operations
uuid: 91be14ee-9c6c-439b-942d-96505d2d80ec

**Steps**
1. Leads › Import Leads; upload UpdateExistingRecords_StandardLayout.xlsx › Next.
2. Operation step: Add new records → panels Duplicate handling and Target layout (default "Default layout").
3. Add and update → layout choice also offered.
4. Update existing only → only "Match records on", no Target layout.

**Expected**
- Update existing only offers a Target layout choice, like the other two.
- The three operations consistent in settings, except where a setting genuinely does not apply.

**Actual (old)**: Update existing only shows only Match records on (Unique field selector + "Don't overwrite existing values with empty cells"); no Target layout. Add new records shows Target layout with "Imported records are shown only on the layout they're added to. Pick which layout these records should appear under." Add and update offers layout.

**Environment**: URL https://crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/import; Leads module 841043e1-c078-41f9-8d6e-dfd61bee45c3; file UpdateExistingRecords_StandardLayout.xlsx. Jam https://jam.dev/c/f2d4d94c-9c32-49f2-84c6-7e1d546e3942

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:32: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). The Target layout section now renders for every operation including "Update existing only" (shown when the module has 2+ layouts), with an update-specific hint; GET /import/{s}/fields?mode=update returns the layout-scoped fields. Please confirm in the UI."

## NDC-1587 — Import + Recycle Bin | Undo Import in Import History page doesn't move the undone records to the Recycle Bin.
uuid: 736ec092-bd74-481f-a9c0-47107c5b14d1

**Steps**
1. Leads › Import Leads; upload Excel with ≥1 lead, map, submit; wait "Import complete", count goes up.
2. Leads action menu › Import History; the import's three-dot menu › Undo import; dialog says records move to recycle bin.
3. Click Undo import → status "Undone", "Import undone" message.
4. Settings → Data Administration → Recycle Bin; Module filter = Leads; look for removed records.

**Expected**
- Undone records appear in Recycle Bin as the dialog promises.
- Restorable from there, ideally as a single group for the whole undone import.
- Recoverable for the normal 60-day retention.

**Actual (old)**: Records removed, import marked Undone; nothing new in Recycle Bin (latest Leads entry 3 days old); unrecoverable; no error; normal deletes do reach the bin.

**Environment**: https://crm.taviportal.com, Leads module; import session adab1a3f-3922-436f-a451-4589da075bde, file ValidSheetLeads(xlsx).xlsx. Jam https://jam.dev/c/106f646d-375e-4dba-b4ab-d5ae4b047b2a

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:32: "Retest on staging-crm, 2026-10-21: FIXED. Undo Import → 204; the module's records list is empty and the 3 undone records appear in the Recycle Bin under one deletion group, expiring in 60 days."

## NDC-1588 — Modules and Fields | Default layout is not marked and there is no option to set a layout to default.
uuid: 264f81b0-684d-49ac-82e7-5e49bf262ad3

**Steps**
1. Settings → Customization → Modules and Fields › Leads; Layouts tab — look at columns and rows.
2. Hover a layout row › three-dot menu; look at options.

**Expected**
- Layouts table shows which layout is default (badge or column).
- Row menu includes option to set that layout as default.
- Default layout cannot be deleted or deactivated while it holds that role.

**Actual (old)**: Columns Name, Shared To, Last Modified, Status only; no default marked. Menu: Rename, Edit Layout, Clone Layout, Layout Permission, Delete — no set default. 5 layouts on Leads, one switched off; can't tell if it is the default.

**Environment**: URL https://crm.taviportal.com/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3; Leads module 841043e1-c078-41f9-8d6e-dfd61bee45c3, 5 layouts. Jam https://jam.dev/c/48832ab0-99ae-47b0-a4ef-2e9d0f936fe2

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:31: "Retest on staging-crm, 2026-10-21: FIXED. GET layouts returns isDefault:true on the default; POST …/layouts/{id}/set-default → 200 and the flag moves; deleting the default → 409 DEFAULT_LAYOUT_REQUIRED. The deployed UI has "Set as default" and the default badge."

## NDC-1229 — Modules and Fields: Lead Conversion Mapping | The field picker returns "No results found" for a custom module's auto-created fields
uuid: a4403d79-8ac7-45fa-a6dc-a663dcf34362

**Steps**
1. Settings › Modules and Fields › Create New Module; display name "partners", CRM Teamspace, Create.
2. Open the new module and its layout; confirm auto-created fields present incl. Name. Do not add own fields.
3. Modules › Leads › Lead Conversion Mapping tab; mapping row for the new module › target-field picker ("— Not mapped —").
4. Look at fields offered; for comparison add a field by hand and check whether it appears.

**Expected**
- Fields offered: target module's editable fields, including auto-created ones; Name available to map a lead's name; editable fields visible in the module layout available in picker; auto-created vs hand-added makes no difference.
- Not offered: fields with Auto-fill configured (Fill from other than "Don't auto-fill"); system-populated fields (Created By, Created Time, Modified By, Modified Time, Record ID).

**Actual (old)**: Picker "No results found"; Name not listed; stays "— Not mapped —"; converted lead would populate nothing.

**Environment**: URL https://crm.taviportal.com/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3; custom module "partners" (06a21727-dd80-4478-89b7-e4a2f611657f), layout d95b70a4-45b8-430c-aeed-8f61cf9aced1; source Leads (841043e1-c078-41f9-8d6e-dfd61bee45c3). Jam https://jam.dev/c/6177320a-2689-4ed6-938f-e6af6b663f12

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:30: "Retest on staging-crm, 2026-10-21: FIXED. New custom module: `name` is a normal field (isSystemManaged=false) and maps from Leads (PUT conversion config → 200, mapping kept); auto-filled fields (created_*/modified_*) are marked isSystemManaged and excluded. Deployed picker filters only system-managed fields (client-engine 3a1769f08, metadata-engine fb85739)."

## NDC-1230 — Modules and Fields: Field Properties | The Controlling Field dropdown in Conditional Visibility does not list the current layout's fields
uuid: 3b6dccbb-bebd-43d1-8133-ae46e4f28168

**Steps**
1. Settings › Modules and Fields › Leads; edit "New Layout"; note its fields.
2. Phone Number field options menu › properties › VALIDATION tab › Create Validation Rule.
3. Toggle Conditional visibility on; open CONTROLLING FIELD dropdown ("Select field…").
4. Compare listed fields to the layout's fields.

**Expected**
- Dropdown lists the fields on the layout being edited.
- Any field on that layout that can drive a visibility rule is selectable.
- The field being configured is excluded.
- Fields from other layouts not offered.

**Actual (old)**: Dropdown does not show current layout's fields; controlling field cannot be selected; rule cannot be configured.

**Environment**: Leads module (841043e1-c078-41f9-8d6e-dfd61bee45c3 per other tickets); layout "New Layout"; field Phone Number. Jam https://jam.dev/c/cd88f767-198a-4eb3-a8d7-d6506e00dfb4

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:31: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). The Controlling Field dropdown is built from the fields placed on the current layout (excluding the field itself), with an empty-state message when there are none (client-engine 3a1769f08). Please confirm in the UI."

## NDC-1295 — Pipelines | A stage deleted from the module's layout still appears in the pipeline's available stages list and fails with a 422 when selected
uuid: a496cc10-a256-4eb5-9cde-b551b8ad67f4

**Steps**
1. Settings › Pipelines › open Test-Pipeline; Add Stages › Create New Stage; name test-stage; Save (added to pipeline).
2. Settings › Modules and Fields › Deals; open layout with Stage field; Stage properties › delete test-stage value; Apply, Save.
3. Back to Settings › Pipelines › same pipeline › Add Stages; look at list; select test-stage.

**Expected**
- Stage deleted from the module layout no longer appears in Add Stages list.
- List offers only stages the module currently recognises.
- Selecting a stage from the list always succeeds — never offer a stage the server rejects.

**Actual (old)**: test-stage still listed; selecting → "These stages are not in the module's stage list: test-stage."; POST /api/v1/modules/f42cbafd…/pipelines/55fad966…/stages → 422; no indication in list.

**Environment**: Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; pipeline Test-Pipeline (55fad966-57ac-4974-922b-177120a6c181); layouts 7d1b1a96-a590-45d7-9551-64b1cb7e41d1 and fcba0068-d67f-44f5-8412-cdef9c09e16e; stage test-stage. Jam https://jam.dev/c/2ba441c1-9705-4f50-9fec-b7a6fe6f5ec2

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:39: "Retest on staging-crm, 2026-10-21: FIXED. A stage removed from the Deals Stage field is pruned from the pipeline and no longer offered in the available-stages list (stage-probability source: 0 hits). Adding it directly is refused with 422 "not in the module's stage list", which is now correct since the picker no longer shows it."

## NDC-1312 — Pipelines | Changing a deal's pipeline does not ask which stage the deal should move to
uuid: ce5dac3d-cf36-417f-afb0-ad599be28017

**Steps**
1. Deals › open deal test-01; confirm current pipeline Standard (Default) and stage.
2. Pipeline selector at top › choose test; confirmation modal — no stage selection; click Change pipeline.
3. Repeat to Test-Pipeline; same modal.
4. Check which stage the deal is on in its new pipeline.

**Expected**
- Changing pipeline asks which stage in the new pipeline the deal moves to.
- Stage list offered = destination pipeline's stages.
- Deal ends on a stage that belongs to its new pipeline.
- If no stage chosen, change blocked or defaults to new pipeline's first stage, and says so clearly.

**Actual (old)**: Modal only asks to confirm; Change pipeline completes ("Record updated successfully") with no stage chosen; both Standard → test and test → Test-Pipeline; deal left unmapped to new pipeline's stages.

**Environment**: Deals module (f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430); deal test-01; pipelines Standard (Default) → test → Test-Pipeline. Jam https://jam.dev/c/a378d2a6-ff40-4db5-a21e-3f223e92ab47

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:40: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle + server code). The change-pipeline modal asks for "Stage in the new pipeline" (defaults to the first stage); the server moves a cross-pipeline change to the destination's first stage. Not exercised end-to-end: the Deals module on the test tenant has no pipeline field. Please confirm on NDC-Staging."

## NDC-1314 — Deals - Mass Update | Probability and Expected Revenue are offered for mass update although they are derived values
uuid: 971d3df7-5307-4e35-ae22-8834da0cdc20

**Steps**
1. Deals module; tick two or more deals; actions menu › Mass Update.
2. Choose a field; review list. Select Probability (%) = 50; Add another field › Expected Revenue = 5000.
3. Update records; refresh and compare values to each deal's stage probability and amount.

**Expected**
- Probability (%) not offered in Mass Update — determined by stage (Stage Probability).
- Expected Revenue not offered — calculated from Amount and probability.
- Mass Update list includes only fields a user is meant to set directly.

**Actual (old)**: Both offered and selectable; 50 and 5000 applied to 2 deals; "2 records updated", no warning; stored figures no longer follow stage/amount; no indication whether recalculated.

**Environment**: URL https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; 2 records. Jam https://jam.dev/c/83f6b93c-ccfa-4464-a756-b62773c45286

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:40: "Retest on staging-crm, 2026-10-21: FIXED. Mass update with probability / expected_revenue → 422 DERIVED_FIELD_READ_ONLY; the deployed mass-update field list excludes both."

## NDC-1316 — Deals - Mass Update | Pipeline is not offered as a field, so deals cannot be moved between pipelines in bulk
uuid: 4c9b218f-b4a4-4a43-b279-92042723719d

**Steps**
1. Deals module; tick two or more deals; actions menu › Mass Update.
2. Choose a field; type "pipeline" in search; note result.
3. Scroll full list; confirm Pipeline not present under any other name.

**Expected**
- Pipeline available in Mass Update to move deals between pipelines in bulk.
- Selecting destination pipeline also prompts for the stage.
- Stage list = destination pipeline's stages.
- Stage defaults to first stage of destination pipeline. (Reference: Zoho CRM mass update offers Pipeline and Stage together.)

**Actual (old)**: "pipeline" → "No results found"; not in list; bulk move impossible; no stage prompt.

**Environment**: Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430. Jam https://jam.dev/c/3d79833d-fa2c-4c98-8ff2-36e343469f08

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:40: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). Mass Update now offers Pipeline, and requires both the destination pipeline and stage. Not exercised end-to-end: the Deals module on the test tenant has no pipeline field. Please confirm on NDC-Staging."

## NDC-1324 — Deals Listing Page | Editing the Pipeline field inline shows an empty pipeline list
uuid: b983cc0e-7117-4929-a173-f81dd841000b

**Steps**
1. Deals listing page; locate deal test-01 (amount 1,500).
2. Click its Pipeline cell to edit inline; "Select pipeline…" opens; look at options; click again.
3. Open the deal's record page; check Pipeline there.

**Expected**
- Inline Pipeline field lists the module's pipelines.
- Pipelines offered match the record page.
- Selecting a pipeline applies it to the deal.
- Changing pipeline here also establishes the deal's stage.

**Actual (old)**: "Select pipeline…" list empty (twice); cannot change from list; record page shows Standard (Default) with stages incl. qualification.

**Environment**: URL https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/list/deals; Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430; deal test-01 (8ba8bdd0-33a1-4cbc-9607-5669487ce170), amount 1,500; pipeline Standard (Default), stage qualification. Jam https://jam.dev/c/19693318-c9d4-48e2-85a3-0f788efc42f2

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:40: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). Inline-editing Pipeline on the Deals list now opens the change-pipeline modal (with layout and current pipeline) instead of the empty combobox. Not exercised end-to-end: the Deals module on the test tenant has no pipeline field. Please confirm on NDC-Staging."

## NDC-1586 — Modules and Fields | Formula field does not offer other fields in the layout to use.
uuid: e8f73d93-38b9-486e-91d0-5638e6ac581d

**Steps**
1. Settings → Modules and Fields › Leads; open "FieldPermissions" layout.
2. Click the Formula field › Field Properties › ADVANCED tab.
3. Look at "Insert a field" section (above Functions).

**Expected**
- "Insert a field" lists other fields on the module for insertion into the expression.
- List reflects fields that actually exist — those placed on this layout.
- "No other fields on this module yet" only when the module genuinely has no other fields.

**Actual (old)**: Shows "No other fields on this module yet" although layout has Address Permission, Phone Permission, Email Permission, Number Permission, Decimal Permission, Currency Permission etc., and New Fields shows "Unused Fields (453)"; Functions list populated; only way is typing API name.

**Environment**: URL https://crm.taviportal.com/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/563411f4-6c8e-4b98-a91d-c618d88a5138; Leads module 841043e1-c078-41f9-8d6e-dfd61bee45c3; layout FieldPermissions (563411f4-6c8e-4b98-a91d-c618d88a5138). Jam https://jam.dev/c/c4c332f7-cb89-42d3-98b5-63b8363c45b6

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:31: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). The formula editor's "Insert a field" list is built from the layout's placed fields (excluding other formula / rollup fields) and the module id comes from the current layout (client-engine 0a8125e0f). Please confirm in the UI."

## NDC-1589 — Import History | "Download error rows" is not available for an import that finished with errors
uuid: 512965dd-0d39-46c3-9743-12871d0af880

**Steps** (covers test case IMP-058)
1. Leads module; import an Excel file with ≥1 row failing validation; complete and close the wizard.
2. Leads action menu › Import History; find the import (Status "Completed with errors", Result shows error count).
3. Three-dot menu at end of row; look at options.

**Expected**
- Options menu offers a way to download the error rows for that import.
- Download works after the wizard has been closed, so failed rows can be corrected and re-imported.
- Menu also offers a way to view the import's details.

**Actual (old)**: Menu has only "Undo import"; no "Download error rows", no "View details"; history holds imports with 1, 5 and 25 error rows, none retrievable.

**Environment**: URL https://crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/import/history; Leads module; signed in as "ND"; reported from screenshot (no Jam).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:32: "Retest on staging-crm, 2026-10-21: FIXED. An import ending partially_completed (3 created, 2 errors) is listed in Import History; GET /import/{s}/errors → 200 xlsx with the 2 failed rows and an error-reason column. The deployed history row menu has "Download error rows" (disabled only when there are no errors)."
- Note: no "View details" option is mentioned in the dev comment.

## NDC-1592 — Import | Importing with a column contains multiple values separated by ',' and ';' to a multi-select field is not accepted
uuid: f021226a-adbc-4eb1-8370-57ffe3eb0804

**Steps**
1. Ensure Leads has a multi-select field with ≥2 options.
2. Excel with Name and Multi Select columns: one row single valid option, one row two valid options comma-separated, one row two valid options semicolon-separated.
3. Leads › Import Leads; upload › Next; "What should this import do?" = Add new records, choose target layout › Next.
4. "Map your columns to fields": map Multi Select column to the multi-select field › Next; Assign & approve › Save & next.
5. Review and submit: check "Rows that will import" / "Rows with errors"; tick confirmation › Submit; check created rows.

**Expected**
- Cell with several options separated by commas or semicolons is split into separate options.
- Each option matched against the field's option list and stored as multi-select value.
- Rows with either separator import successfully, as a Tags column accepts both.
- If an option in a cell doesn't exist, the error names that option rather than rejecting the whole value.

**Actual (old)**: Multi-value rows (comma or semicolon) counted as errors; single-option rows import; Tag delimiter setting exists for Tags (comma/semicolon) but nothing for multi-select; 12 rows → 4 imported, 8 errors.

**Environment**: Leads module import; file ImportWithValidAndInvalidOptions.xlsx (12 rows); import session 67810046-e04f-47f0-8c95-a4e243bf4da0; field Multi Select Permission; layout FieldPermissions (563411f4-6c8e-4b98-a91d-c618d88a5138 per NDC-1586). Imported and error sheets attached to ticket. Jam https://jam.dev/c/64e45ee9-f0dd-48fa-8edb-4dd16845d443

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:33: "Retest on staging-crm, 2026-10-21: FIXED. Multi-select cells "Red, Green" and "Red;Blue" both validate and import as arrays (e.g. ["Red","Blue"]). An unknown option ("Red,Purple") fails with "'Purple' is not one of the allowed multi-select values.""

## NDC-1232 — [Enhancement] Data Types | The header row scrolls out of view and columns are too narrow, wrapping values across multiple lines
uuid: 59cf8a69-473d-489a-96ab-d264d1679be6

**Steps**
1. Settings › Customization › Data Types.
2. Note header: Label, Category, Source, Create Layout Rule, Create Validation Rule, Edit Properties, Mark Required, Permanently Delete, + a column cut off at right.
3. Note wrapping in Label, Category, Source.
4. Scroll down past first rows; look for header; try to identify each checkbox column.
5. Note horizontal scrollbar and column truncated to "Re…".

**Expected**
- Header row stays fixed while list scrolls.
- Column widths suit content: datatype names, category and source values on a single line.
- Capability columns sized to headings so each is identifiable.
- Table fits available width, or makes clear further columns exist to the right.
- Row heights consistent and compact.

**Actual (old)**: Header scrolls away leaving unlabelled checkbox columns; Label wraps ("Add / ress / address", "Auto / Nu / mbe / r", "Chec / kbox / checkbox", "Ima / ge / Uplo / ad"); Source "Syste / m"; Category "Advance / d"; rightmost truncated "Re…" needing horizontal scroll; rows too tall.

**Environment**: URL https://crm.taviportal.com/settings/data-types; viewport ~1272 × 866; reported 25 Aug 2026 (no Jam).

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:31: "Retest on staging-crm, 2026-10-21: DONE (verified in deployed CSS/bundle). Data Types table header is sticky, the body scrolls under it, cells no longer wrap and columns have minimum widths (client-engine 3a1769f08). Please confirm visually."

## NDC-1311 — Pipelines | Reason for Loss appears as a plain text field in the stage-change modal instead of a picklist
uuid: 4a98471d-0c0e-403e-8a5f-91ed1c9b2971

**Steps**
1. Deals module; open a deal; confirm Reason For Loss is a picklist with predefined options.
2. Stage strip: click needs_analysis, then proposal, then closed_lost.
3. Modal "verify details": Amount, Closing date, Reason for loss; try to select a configured option.
4. Type free text "test", Amount, Closing date › Save and close.
5. Scroll record; check saved Reason for Loss.

**Expected**
- Reason for loss presented as a picklist of the field's configured options.
- User chooses from options rather than typing.

**Actual (old)**: Plain text input; no options; "test" accepted; record shows Reason for Loss: test, Stage closed_lost, Amount $1,500.00, Closing Date 31/08/2026; "Record updated successfully".

**Environment**: Deals module (f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430); field Reason for Loss; stage closed_lost; values Amount 1500, Closing date 08/31/2026, reason "test". Jam https://jam.dev/c/9bd22bd6-b857-49fa-a46a-6a97224812e1

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:39: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). The stage-change modal builds Reason for Loss as a picklist from the field's values. Server also refuses free text: closed_lost + reason "test" → 422 PICKLIST_VALUE_INVALID. Please confirm in the UI."

## NDC-1422 — Login History | Login History labels a phone-browser sign-in as channel "Mobile", so it cannot be told apart from a mobile-app session
uuid: dcf8a3c2-b39c-47ae-988d-b8bc3304df5b

**Steps** (test case LH-015 — Device / Browser shows OS, browser, device type and channel)
1. Sign in to the CRM from a browser on a phone.
2. Sign in again from a desktop browser.
3. Settings › Security Control > Login History; look at Device / Browser for the two newest sessions.

**Expected**
- Phone session shows "iOS · Safari", device type "Mobile", channel "Web".
- Channel says how the CRM was reached (web vs mobile app), not a repeat of the device type.

**Actual (old)**: Phone session "iOS · Safari" + "Mobile" + "Mobile" (no "Web"); desktop session correctly "Desktop" + "Web"; nothing distinguishes phone-browser from mobile-app sign-in.

**Environment**: Settings > Security Control > Login History, NDC-Staging; phone session iPhone / Mobile Safari, page viewed on Windows 10 / Edge 152; observed 06/09/2026; also on 4 earlier real-user sessions. (No Jam.)

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:38: "Retest on staging-crm, 2026-10-21: FIXED. Login with an iPhone Mobile Safari user agent → Login History row: OS iOS, browser Safari, device Mobile, access type Web (desktop Chrome shows Desktop/Web). The deployed label for the mobile-app channel is now "Mobile app", so the two can be told apart."

## NDC-1517 — Import | CSV files are rejected — the import wizard accepts only .xlsx and .xls
uuid: 6d8fdb42-0477-4df3-afaa-3cf76da9ff33

**Steps**
1. Leads module › actions menu › Import Leads.
2. "Upload Excel file" step: select/drag a .csv into the dropzone; read message.

**Expected**
- Wizard accepts .csv alongside .xlsx and .xls.
- CSV proceeds normally through mapping, operation and submission.
- Step label and dropzone text name every accepted format rather than "Excel file".

**Actual (old)**: .csv rejected with "Only Excel files (.xlsx, .xls) are supported."; step labelled "Upload Excel file"; must convert to .xlsx.

**Environment**: URL https://crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/import; Leads module 841043e1-c078-41f9-8d6e-dfd61bee45c3. Jam https://jam.dev/c/14e82725-fc72-430f-9220-db16e5bf0d77

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:32: "Retest on staging-crm, 2026-10-21: FIXED. Uploading a 5-row .csv → 201 pending_mapping, headers and rows parsed, import completed. The deployed wizard accepts .xlsx/.xls/.csv and the hint reads "Choose an Excel (.xlsx, .xls) or CSV (.csv) file"."
- Note: dev comment doesn't mention the step label "Upload Excel file" being renamed.

## NDC-1519 — Import | "Match records on" appears above Target layout, and its warning says the module has no unique field rather than the layout
uuid: eaf20f6c-8298-4d1c-9bf1-1344e34e0156

**Steps**
1. Leads › Import Leads; upload a file › Next.
2. Operation step › Add and update; note panel order; read warning in Match records on; note Target layout below it (default "Default layout").

**Expected**
- Target layout shown first, so layout chosen before match field.
- Match records on follows, offering unique fields of the selected layout.
- Changing layout updates fields available for matching.
- Warning says the layout has no unique field, naming the layout — not the module.

**Actual (old)**: Match records on above Target layout; warning "This module has no unique field, so existing records can't be matched. Add a unique field first, or choose 'Add new records'."; user can't tell which layout it refers to.

**Environment**: URL https://crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/import; Leads module 841043e1-c078-41f9-8d6e-dfd61bee45c3; operation Add and update; target layout Default layout. Jam https://jam.dev/c/30f74925-37e7-42f7-b515-7a05e52eb24a

**Comments**
- e1364b0b-d3cd-4167-8261-6194577a480a, 2026-09-10 11:39: "This bug can be fixed by choosing the target layout outside "What should this import do?" section, refer to the screenshot from Zoho Import Feature" (+ embedded Zoho screenshot, asset 01b981d5-f005-4aac-bf18-0ea98a5058cf)
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:32: "Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle + locale). Target layout now renders before the operation and "Match records on" sections; the warning reads 'The "{layout}" layout has no unique field, so existing records can't be matched…' (names the layout). Please confirm in the UI."

## NDC-1590 — Import | Importing rows allows to set a percent-type field to a value above its maximum allowed value (100%).
uuid: ad40253a-f054-4ae5-991e-e992ffc99b4b

**Steps**
1. Excel for Leads with Name and Percent columns; one row percent = 200.
2. Leads › Import Leads; upload › Next; "What should this import do?" = Add new records, choose target layout › Next.
3. Map Percent column to the module's percent field › Next; Assign & approve › Save & next; tick confirmation › Submit.
4. Open the record created from the 200 row; look at the percent field.

**Expected**
- Row with percent above 100 rejected at validation, like other numeric-limit violations.
- Validation summary counts it as error row with a reason naming the allowed range.
- No record created from that row.
- Percent field never stores a value above 100%.

**Actual (old)**: 200 row passes validation; record created showing 200%; summary flags 5 other numeric rows (decimal, long integer, currency limits) but not percent; only non-numeric percent rejected.

**Environment**: Leads module import; file ImportWithValidAndInvalidNumerics.xlsx (7 rows, attached to ticket); import session dd0447ff-e607-4c81-9bba-263f651ce961; field Percent Permission (percent_8_9); record "invalid percent (max)" (cc0bb82f-8768-428d-b429-9cdf4428b2f5); layout FieldPermissions. Jam https://jam.dev/c/3ac15568-879f-4f0b-8ce9-9023c61718c1

**Comments**
- 00a20184-a95d-4ad8-a9d9-6273a8ba704f, 2026-10-21 11:33: "Retest on staging-crm, 2026-10-21: FIXED. Percent cell "150" → validation issue "Percent value must be between 0 and 100"; on execute that row is an error and not created, while the row with 50 imports."

