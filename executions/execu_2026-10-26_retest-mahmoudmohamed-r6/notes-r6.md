# Round 6 notes — 47 CRM tickets (26 Oct 2026)

User at Gate 1: retest all; staging + test users OK; QA data OK; shared settings may be changed and must be reverted after; webhook receivers (webhook.site) OK.

## Environment issue
- 26 Oct ~14:30 UTC: audit service returns 500 on `/audit/events`, `/audit/login-history`, `/audit/recycle-bin/items` (rest of API 200). Blocks NDC-2381, NDC-2293 (API part), NDC-2418, and bin cleanup. Retry later.

## Automation run 1 (tags, auto-run1.log)
- PASS: TeamspaceAccessTest.crmAdminNotOnListIsRefused (1172), otherProfileNotOnListIsRefused (1699, Supervisor not Manager), memberCannotAdminister (1701, rename + self-admin only); UiSmokeTest.wh22BlueprintWebhookFromScreen (2540); ImportTest.triggerOffRunsNoWorkflow (2302); RecordScreensUiTest.pipelinesPageLoads (2386); AccessScreensUiTest.auditLog (2293 UI).
- FAIL (env): AuditLogTest x2, LoginHistoryTest — audit 500.
- FAIL: PipelineTest.createWithPipelineId 422, moveDealByEdit 422 (staging pipeline pick list restricted to "Standard" since 24 Oct — same blocker as round 4).

## Automation hierarchy (auto-hier.log)
- 2413 reporting mode: reportingManagerSeesReport PASS, reportingSupervisorManager PASS, reportingReportNotUp / NotInChain PASS (controls); reportingIndirect SKIPPED (needs a third user without view-all).
- 2412 role mode: roleManagerProfileSameDepartment PASS; roleSuperiorSameDepartment FAIL (Supervisor does not see lower-ranked User's leads, same dept); roleSuperiorOtherDepartment FAIL (preview promises "A Manager sees every User in the tenant"); controls PASS.
- 2416: HierarchyApiTest.userCannotSetOwnManager PASS (+ userCannotAssignManager PASS).
- 2414: HierarchyApiTest.deskProfileGrantsCrmViewAll FAIL — Desk profile still gives CRM view-all.

## Automation run 2 (auto-run2.xml / .log)
- 2542 PASS: invite lifetime 0 and 10000 → 400 iam.invite.lifetime_out_of_range "lifetime_days must be between 1 and 90 days"; bad email / no profile 400 (US-06).
- 2543 PASS: rename built-in User → 409 SYSTEM_PROFILE_PROTECTED "Built-in profiles cannot be renamed. Clone the profile…"; not renamed (PR-06).
- 2546 PASS: PATCH rank 600 under rank-300 parent → 400 "Profile rank (600) must be lower than parent profile's rank (300)."; valid edits 204 (PR-04).
- 2545 PASS: idle limit 2 min — busy session 200 through 210 s; idle session token+refresh 401; policy restored to 60 (SP-04). Login History part not checkable (audit 500).
- 2296 PASS: convert pending-approval lead → 422 APPROVAL_LOCKED (User-profile valafo4080 and CRM Admin); delete also locked (D-21, H-03).
- 2297 PASS: convert lead under review → 422 REVIEW_LOCKED (User nameb56175 and CRM Admin) (H-02).
- 2540 PASS: blueprint After-transition webhook → 1 request (WH-10); SLA escalation → field update + 1 webhook request at +93 s (WH-11). Also UiSmokeTest WH-22 from the designer PASS.
- 2541 PASS: approval Call Webhook to 500 receiver: approve → 3 requests in 4 min, dispatch logged (Pending, attempts 3) (WH-16); reject → same (WH-19).
- 2539 approve PASS: approval webhook body "owner":"3445ec4a…" = lead owner (WH-15). Reject path (WH-09) test error: approval state 404 after reject — rerun.
- 2415 PASS: HierarchyUiTest.tabRenders (B5/D2) — history shows who changed the mode.
- 2302 via review (G-04): test error — reviewer account 403 "Missing required permission 'workflow:review:view'" on review history. Check by hand.

## Automation run 3 + 4 (auto-run3.xml, auto-run4.xml)
- 2419 PARTIAL: import choosing the rule → owner = rule user (A-02 PASS); API-channel create → owner stays the creator test user 1 45ffbc5b… instead of rule user 51666421… (A-01 FAIL).
- 2298 server PASS: API-only rule chosen on import → owner null, execution logged; Import-channel control → owner valafo4080 (A-04). UI part (is the API-only rule offered in the wizard?) → check by hand.
- 2309 PASS: imported, rule-assigned lead under review → reviewerUserIds = assigned owner; owner approves → 200 (F-01).
- 2308 PASS: imported, rule-assigned lead → currentApprovers = assigned owner; can approve (F-03).
- 2391 PASS: workflow with Owner = assigned user criteria fires (F-02).
- 2539 PASS (reject too): WH-09 reject webhook body "owner":"3445ec4a…".
- 2422 PASS (UI A-10): requireOnline=false → test user 2 (first member); requireOnline=true → Owner (online) — offline member skipped.
- 2411 PASS (UI A-17): test user 2 suspended → lead owner = fallback Supervisor; test user 2 reactivated (active).
- 2322 PASS: one And group with 24 → 201, 25 → 201, 26 → 400 "at most 25 conditions (this one has 26)".
- 2382 PASS (after removing a staging blocker for the test): Deals has a CUSTOM pick-list field with api name "pipeline" (created 24 Oct by ndc-staging-owner on layout "Wonder Travel", allowed ["Standard (Standard)"]) that validates every deal's pipeline value → any real pipeline id 422 "Invalid value for: Pipeline". Temporarily widened, then restored exactly (PUT 200, allowed ["Standard (Standard)"]). With it widened: create on pipeline "1" → stored 640e03a4/test-01; PATCH a Standard deal to pipeline "1" → moved (5170500c → 640e03a4, stage test-01); stage closed_won (not in "1") → 422. NEW DEFECT CANDIDATE: a custom field may take the system api name "pipeline" and then hijacks validation of the real pipeline module-wide. QA deals d13c0de2, bfd949ed, 0e718071, bffaa096.
- 2334 PASS (F-20): deal in a published blueprint edited to match an On Edit approval → approval null, still governed (blueprint-state has states); control deal outside the blueprint → pending_approval.
- 2302 PASS for the reported case (G-04 through review): import with trigger automation off, review approved → workflow not run (description null). Observation (GroupGChainTest G-04b): import with automation off still puts the lead in a blueprint (governed=true; wfFired 0, approval null, review null) — ticket's expected says Zoho's option also covers blueprints → raise at Gate 2.
- 2281 PASS: Leads › Filter › Owner offers Current user + the 9 CRM users (= /iam/users?app_key=crm), no Desk-only agents (fedelav803 absent). Evidence 2281-01/02.
- 2323 PASS: scheduled (120 s) webhook rule; lead 1 converted at once → no dispatch, nothing received; control lead 2 → Webhook Succeeded at 15:10:41 (+2 min), receiver got only the control (recordId 5898eb60). Rule 1448ac2e (cleanup).
- 2384 PASS: Create module dialog now has Module name (plural) + (singular), auto-filled from display name ("QA RT partners" / "QA RT partner", key qa_rt_partners); Create → POST 201; module abf9acff created (cleanup).
- 2388 PASS: new module QA RT partners listed under Conversion Targets switched off (no Create when, no Field Mapping column); API conversion/targets isConversionTarget=false.
- 1864 PASS: QA RT partners switched off from the list (toggle → 'Module updated successfully', API status disabled); not in sidebar; direct URL shows 'QA RT partners is disabled … can't be opened or created until it is switched back on'; GET records and POST record → 403 'This module is disabled…'.
- 1873 PASS: new Lookup renamed "Lookup Contacts" → API NAME follows (lookup_contacts), shown read-only ('fixed once the layout is saved'); Save → POST field 201 + PUT layout 200, field lookup_contacts 74e730ba (cleanup); second new Lookup with the same label → lookup_contacts_2 (no reuse). Layout QA RT r6 layout 212d0ec2 (cleanup).
- 1444 PASS end-to-end: Rollup ADVANCED › Related module Transactions (=Deals) offers Connected To / Lookup / Multi-Select Lookup, Customers (=Contacts) Connected To / Lookup; no 'no lookup' warning; Connected To › Amount › Sum, label QA RT rollup r6 → Save: POST field 201 (2 s), PUT layout 200 (3 s); field qa_rt_rollup_r6 f95c0430 on the layout (cleanup).
- 2383 PASS: same save persisted (layout lastModified 15:15:51, rollup on layout); layout PUT now 3 s (was 14–18 s) — a truly slow save could not be reproduced.
- 1863 PASS: field menu now offers Remove from Layout → dialog 'Move to Unused Fields' / 'Delete Permanently'; Delete Permanently on QA field lookup_contacts → DELETE field 204; Save → PUT layout 200, no error; field gone from module and layout. Observation: the Save also PUT 2 untouched fields (5dd25be0, 9eff6424).
- 2423 PASS (on QA fields of QA layout): Phone ⋮ Set Permission › Validation regex ^01[0125]\d{8}$ → Apply → Save → PUT field 200 with regex; after reload editor and API show the same regex. Email ⋮ Mark as Unique + Mark as Required → Save → PATCH constraint {required:true,unique:true} 200, API unique/required true. Records: phone 123 → 422 'does not match the required pattern'; 01012345678 → 201; duplicate email → 422 'already in use'; missing email → 422 'is required'. QA email set back to not required right after (module-wide). (Earlier missing backslash was my tooling, not the app.)
- 2547 PASS: Permissions page button now 'Create profile' and opens 'Create profile' dialog (label matches action).
- 2282 PASS: Deals (Transactions) Kanban (QA view 'QA RT 2282 kb', cleanup): Layout picklist only in the page header; toolbar shows 'Pipeline' label + Standard picklist; no duplicate unlabeled Layout picklist.
- 1823 PASS: Convert Lead › Create a new Transactions (Deal): Probability (%) and Expected Revenue show a lock, greyed, typing ignored; Stage Qualification + Amount 10000 → Probability 10, Expected Revenue 1000 auto-filled. Not converted; QA lead 2acfe5f8 (cleanup).

## Outage 26 Oct ~15:45 UTC
- IAM 503 ("IAM is unreachable, so the ACL principals could not be validated") on teamspace ACL, then /iam/me, /iam/users, /modules all 500; UI "You don't have access to CRM". Audit already 500 since 14:30. Polling (poll.js).
- Pending because of the outage: 1701 (member admin actions), 1699 (Manager profile user), 1172 (Settings › Teamspace list as non-listed CRM Admin), 1678 (teamspace icon/admin/description), 2385 (import review errors table), 2298 UI (is the API-only rule offered in the wizard), 2381 / 2293 / 2418 (audit).
- QA teamspace QA RT TS r6 f7082675 created (ACL with test user 1 not applied — IAM 503); description persisted via API; teamspace has icon/iconColor fields now.

## Evidence built (subagent, specs-r6.js + cards-r6.js): 38 images. Gaps to close when staging returns
- 2542: lifetime -1 and the Invite dialog in the UI not covered.
- 2382: record page / list inline edit / Mass Update paths not covered (API only).
- 2334: scenario 2 (approval criteria = the transition's own target state) not covered.
- 2309: checked on Leads (F-01), ticket was Contacts.
- 2386: thin evidence (no screenshot this round) — take a direct-load screenshot of Settings › Pipelines.
- 2281 / 2388 / 1444: the screenshot doesn't show the checked list — retake if time allows.

## 27 Oct — staging recovered; rerun (auto-run6.xml)
- 2381 PASS: AuditLogTest.recordLifecycleIsLogged + setupChangesAreLogged PASS (logoutNamesUser inconclusive: no logout event in newest 200).
- 2293 no-duplicates PASS (entityFilterHasNoDuplicates, AccessScreensUiTest.auditLog) — grouping / internal entries checked by hand below.
- 2418 PASS: LoginHistoryTest.expiredSessionsNotActive, revokedSessionStopsWorking, deniedUserCannotExport.
- 2419 still PARTIAL: A-01 API create → owner nameb56175 (creator), rule 1be065d1 Fired, expected valafo4080.
- 2414 still FAIL: deskProfileGrantsCrmViewAll.
- 2412 still PARTIAL: roleSuperiorSameDepartment FAIL, roleSuperiorOtherDepartment FAIL, roleManagerProfileSameDepartment PASS.
- Plane 27 Oct: 34 PASS tickets → Done + comment + image, read back 34/34 OK. NDC-2302 held (Zoho question).
- 1701 PASS (full scope): plain member test user 1 on QA RT TS r6 (access) → canManage=false; create folder 403, PUT acl 403, rename 403, create module 403, access-mode 403; Settings › Teamspace shows 'You don't have permission to manage teamspaces'; teamspace unchanged (modified by mahmoud.mahamed1515). Evidence 1701-01.
- 1699 BLOCKED: no user in the tenant holds the Manager profile (users: User×3, test, CRM Admin×3, Supervisor, Owner); assigning Manager/CRM Admin to test user 2 was refused by the agent's safety check (privilege change). Automation still passes for a Supervisor not on the list (25 Oct scope).
- 1172 PASS: QA RT 1172 (access selected, only test user 1 = admin): me (CRM Admin, not on list) → not in GET /teamspaces, GET teamspace 403, folders 403; Settings › Teamspace does not list it (lists CRM Teamspace, New Teamspace, QA RT TS r6); org-unit option (ACL = test user 1 admin + org unit 5533f730, I am in root 'Organization') → still not listed / 403; admin test user 1 keeps access (changed the ACL 200). Profile option covered by automation (Supervisor not on list refused). Evidence 1172-01.
- 1678 PASS: Edit Teamspace: tile opens 'Teamspace icon' picker (20 icons, 8 colours, Use initials); Admin opens 'Select the teamspace admin' (all CRM users); picked Rocket/pink + admin test user 1 + added module → Save: PUT teamspace 200, PUT acl 200, toast '1 module added to this teamspace'; API icon Rocket, iconColor pink, admin 45ffbc5b; description kept; list shows pink rocket tile + description. Observations: Add Modules lists raw module keys (leads, contacts, qa_rt_partners…); Save needs at least one module; when the editor hands admin to someone else, the follow-up PATCH access-mode returns 403 silently (mode was unchanged).
- 2385 PASS: Leads import (QA-RT-2385-inv.csv, 3 rows, layout FieldPermissions, Percent 250 on row 3) → Review: 'Rows with errors 1'; All errors table lists Row 3 | Percent Permission | 250 | 'The value isn't a valid percentage: Percent value must be between 0 and 100.' | Invalid format (1–1 of 1). Not submitted. Evidence 2385-imp-4-review.
- 2298 PASS (full): QA rules 'QA RT 2298 api-only' (channels Api) + 'QA RT 2298 import' (channels Import), both active; Leads import Assign step → rule list offers AssignmentRule-Leads-Approval, AEX-01, QA RT 2298 import, test — the API-only rule is NOT offered. Server part (A-04) PASS earlier. Evidence 2298-01/02.
- 2293 PASS (full): All Entities filter 67 options, no duplicates; grouped (Approval + Approval Override indented under Approval Process; Saved View / Saved View Sharing); 'Test', 'Module view pin', 'User list preference' gone; searches approval/blueprint/work/act/saved view return one entry each. Observation: 'Audit Log Entry' and 'Mail agent signature row' still look internal. Evidence 2293-01/02.
- 2542 gap closed 27 Oct: POST /iam/users/invite lifetime_days -1 (qa.rt.2542.minus1@example.com, profile User) → 400 iam.invite.lifetime_out_of_range 'lifetime_days must be between 1 and 90 days (received -1).' (nothing created). UI Invite dialog not checked.
- 2386 evidence 27 Oct: Settings › Pipelines opened directly (25 s) renders Manage Pipelines page, no 'Loading board…' (2386-01-direct-load).
- 1699 PASS (27 Oct, user switched test user 2 to Manager): QA RT TS r6 ACL = test user 1 admin + profiles User/Supervisor/test (no Manager) → test user 2 (Manager) GET /teamspaces lists CRM Teamspace, New Teamspace, QA RT 1172 (its org unit is on that list) but not QA RT TS r6; GET teamspace 403, folders 403. User to switch test user 2 back to 'test'.

## NDC-2412 against the user's rule (27 Oct): same rank never; higher rank sees lower ranks in the SAME org unit only; other org unit never; owner sees all (auto-run7.xml, VisibilityTest updated: I4 flipped, I2b/I4b/I7/I8 added, tagged NDC-2412)
- PASS: I2 Users in different OUs don't see each other; I2b Users in the same OU don't; I1/I5 User doesn't see a superior; I3b Manager@Sales sees User@Sales; I7 Manager@Sales sees Supervisor@Sales (Supervisor doesn't see Manager); I4 Supervisor@HR doesn't see User@Sales; I8 owner sees all.
- FAIL: I3 Supervisor(300)@Sales does NOT see User(100)@Sales (owner-set false, N-created false). I4b Manager(500)@HR DOES see User(100)@Sales (owner-set true, N-created true).
- Pattern: visibility follows the profile parent tree (Manager is parent of User and Supervisor) tenant-wide, ignoring org unit and rank.

## NDC-2302 — Zoho real behaviour (27 Oct, user authorized a live test in org943261092)
- QA blueprint "QA RT 2302 BP" (Leads, Standard, field Rating, entry Last Name starts with "QA RT 2302", states -None- → Acquired).
- Import step "Assign": section "Trigger Automation and Process Management", checkbox "Trigger configured automations and processes for new and updated records" (unticked by default, no tooltip).
- A import, box OFF → lead NOT in the blueprint (no blueprint bar after 5 and 8 min; API RECORD_NOT_IN_PROCESS, $process_flow=false). B import, box ON → in the blueprint (Current State -None-, transition "QA RT 2302 Go"; API 200). C manual create → in the blueprint.
- => TAVI (lead enters the blueprint with automation off) differs from Zoho → NDC-2302 FAIL for the blueprint part.
- Zoho cleanup: 3 QA leads deleted + purged from Zoho recycle bin; QA blueprint deleted; 2 Import History rows remain (no delete option). Screens zoho-2302-*.png.

## NDC-2302 TAVI re-check (27 Oct) — matches Zoho
- QA blueprint "QA RT 2302 TAVI BP" 38abad3b (Leads, QA RT r6 layout, lead_source chat→web, entry first_name startsWith "QA RT 2302"), active.
- UI import "QA RT 2302 tavi off" (Review: "Automation and process management: Not triggered") → lead 96061733 NOT in the blueprint (blueprint-state states []). 
- UI import "QA RT 2302 tavi on" (Assign: ticked "Trigger automation and process management — Run workflow rules, review and approval processes and blueprints on the imported records. Off by default — a bulk import is a pure data load…"; Review: "Triggered on import") → lead f814b24e in the blueprint (state chat).
- Manual create "QA RT 2302 tavi manual" e512668a → in the blueprint (state chat).
- => TAVI = Zoho. The earlier G-04b "governed=true" happened after a review approval (an edit), not from the import itself. Evidence: 2302-tavi-lead-off/on, 2302-imp-4-review, 2302on-assign-ticked, 2302on-review + zoho-2302-*.
