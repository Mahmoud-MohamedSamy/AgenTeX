// Writes the API/automation evidence cards for retest round 6 (26 Oct 2026, CRM) and renders each with apicard.js.
// Usage: node cards-r6.js [card-name ...]   → scripts/cards-r6/*.json, screenshots/raw/NDC-*.png, scripts/cards-r6/boxes.json (row boxes for specs-r6.js)
// Facts come only from notes-r6.md and the FACT/RESULT lines of auto-run1.log, auto-hier.log, auto-run2..5.xml, t1-out.json, k6-out.json, pipeline-field-baseline.json.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const DATE = '26 Oct 2026';
const AUTO = 'automation (CRM Admin mahmoud.mahamed1515 · test user 1 nameb56175 · test user 2 valafo4080)';
const L = '/api/v1/modules/{Leads}'; const D = '/api/v1/modules/{Deals}';
const C = {
  'NDC-2382-api.png': { title: 'NDC-2382 · Deals pipeline through the record API — staging blocker removed for the test, then restored', rows: [
    ['blocker (found)', `GET ${D}/fields → apiName "pipeline"`, 'CUSTOM pick_list (isCustomField true) created 2026-10-24 15:54 by ndc-staging-owner on layout "Wonder Travel"; allowed_values ["Standard (Standard)"] — it validates every deal\'s pipeline value', 'bad'],
    ['with the blocker (automation)', `POST ${D}/records {pipeline:"5170500c…" (Standard)} · PATCH → "1" 640e03a4…, stage test-01`, '422 RECORD_VALIDATION_FAILED "Invalid value for: Pipeline." (both; deal stays 5170500c)', 'bad'],
    ['blocker widened (test only)', `PUT ${D}/fields/{pipeline} — allowed values widened`, '200', 'info'],
    ['create on "1"', `POST ${D}/records {pipeline:"640e03a4…", stage:"test-01"}`, '201 — stored pipeline 640e03a4 ("1"), stage test-01', 'ok'],
    ['move a Standard deal', `PATCH ${D}/records/{id} {pipeline:"640e03a4…"}`, '200 — moved 5170500c → 640e03a4, stage test-01', 'ok'],
    ['stage not in the pipeline', `PATCH ${D}/records/{id} stage "closed_won" on pipeline "1"`, '422 — closed_won is not a stage of "1"', 'ok'],
    ['blocker restored', `PUT ${D}/fields/{pipeline} (baseline)`, '200 — allowed ["Standard (Standard)"] again, same as pipeline-field-baseline.json', 'info']] },
  'NDC-2412-api.png': { title: 'NDC-2412 · Hierarchy, Role mode — Leads visibility = Hierarchy (automation crmhierarchy VisibilityTest)', who: AUTO, rows: [
    ['I3b roleManagerProfileSameDepartment', 'V = Manager (500) @Sales, N = User (100) @Sales → V opens N\'s leads', 'PASS — owner-set lead visible = true, N-created lead visible = true', 'ok'],
    ['I3 roleSuperiorSameDepartment', 'V = Supervisor (300) @Sales, N = User (100) @Sales', 'FAIL — owner-set = false, N-created = false ("Users see their own records and those of lower-ranked users in their department")', 'bad'],
    ['I4 roleSuperiorOtherDepartment', 'V = Supervisor @HR, N = User @Sales', 'FAIL — V sees N\'s lead = false; preview promises "A Manager sees every User in the tenant, regardless of who they report to"', 'bad'],
    ['I1/I5 control', 'N opens own and superior V\'s lead', 'own = true, self-created = true, superior V\'s lead = false (correct)', 'ok'],
    ['I2 control', 'V = User @HR, N = User @Sales', 'V sees N = false, N sees V = false (correct)', 'ok'],
    ['rerun 27 Oct (auto-run6)', 'same VisibilityTest cases', 'same result — I3b PASS; I3 FAIL (owner-set false, N-created false); I4 FAIL; controls PASS', 'info']] },
  'NDC-2413-api.png': { title: 'NDC-2413 · Hierarchy, Reporting mode — Leads visibility = Hierarchy (automation crmhierarchy)', who: AUTO, rows: [
    ['J1/J3 reportingManagerSeesReport', 'N reports to V (both rank 100); V: GET /iam/me/subordinates, open N\'s leads', 'PASS — N listed = true; owner-set lead visible = true, N-created lead visible = true', 'ok'],
    ['J1s reportingSupervisorManager', 'N reports to V, V = Supervisor @Sales', 'PASS — owner-set = true, N-created = true', 'ok'],
    ['J2 control', 'N opens V\'s lead', 'false (report does not see manager — correct)', 'ok'],
    ['J5 control', 'N reports to someone else; V = Supervisor @Sales', 'V sees N = false (not in chain — correct)', 'ok'],
    ['reportingIndirect', 'manager of a manager', 'SKIPPED — needs a third user without view-all', 'info']] },
  'NDC-2416-api.png': { title: 'NDC-2416 · A User-profile user tries to set their own reporting manager (automation crmhierarchy)', who: AUTO, rows: [
    ['G9 userCannotSetOwnManager', 'nameb56175 (no iam.personal.reporting_hierarchy): PUT /api/v1/iam/me/profile {reporting_manager_id}', '403 — manager changed = false', 'ok'],
    ['A8 userCannotAssignManager', 'nameb56175: PATCH /api/v1/iam/users/{valafo4080}/reporting-manager', '403 FORBIDDEN "Cannot assign a reporting manager for this user." — changed = false', 'ok'],
    ['A7 permission', 'iam.personal.reporting_hierarchy', 'owner = false, User profile = false (no CRM profile grants it)', 'info'],
    ['restore', 'manager of test user 1', '204 — baseline restored ("no difference from the baseline")', 'info']] },
  'NDC-2414-api.png': { title: 'NDC-2414 · Desk Administrator profile and CRM view-all (automation crmhierarchy HierarchyApiTest)', who: AUTO, rows: [
    ['E7d deskProfileGrantsCrmViewAll', 'CRM Supervisor who also holds Desk Administrator: GET /api/v1/iam/me/permissions', 'FAIL — Desk Administrator (app desk) grants metadata.records.view_all = true; the user has view_all = true', 'bad'],
    ['E1/E7 profiles with view_all', 'GET /api/v1/iam/profiles/{id}/permissions', 'CRM Admin (crm), Desk Administrator (desk), Owner, test (crm)', 'bad'],
    ['effect', 'Leads visibility = Hierarchy', 'the CRM hierarchy does not apply to a Supervisor who also has a Desk profile', 'bad'],
    ['history', 'previous retest 25 Oct (Wave 1)', 'FAIL — unchanged', 'info'],
    ['rerun 27 Oct (auto-run6)', 'deskProfileGrantsCrmViewAll', 'same result — FAIL, Supervisor + Desk Administrator has view_all = true', 'bad']] },
  'NDC-2415-api.png': { title: 'NDC-2415 · Hierarchy Preference change history (automation crmhierarchy)', who: AUTO, rows: [
    ['HierarchyUiTest.tabRenders (B5/D2)', 'Company Settings › Hierarchy Preference › Change history', 'PASS — history rows show who changed the mode', 'ok'],
    ['A1/B1/B2/B4 page texts', 'same tab', 'texts missing: none; Role checked = true, Reporting checked = false; no raw keys', 'ok'],
    ['D1/D2 API', 'GET /api/v1/settings/history?key=general.company.hierarchy.preference&limit=10', '10 rows; newest reporting → role at 2026-10-25 13:45:44 by 97be04b6… (ndc-staging-owner)', 'info']] },
  'NDC-2540-api.png': { title: 'NDC-2540 · Blueprint webhook actions — After transition and SLA escalation (receiver webhook.site)', who: AUTO, rows: [
    ['WH-10 before transition', 'lead fa3280ca… in state chat', 'requests = 0 (expected 0)', 'info'],
    ['WH-10 After transition', `POST ${L}/records/{id}/blueprint-transitions/t_qa_0`, '200, state web → 1 POST at 14:35:54 {"transitionId":"t_qa_0","toStateId":"web","recordId":"fa3280ca…"}', 'ok'],
    ['WH-11 SLA escalation', 'lead bfbb63f5…, slaDueAt 14:37:16; poll receiver', '+32 s 0 · +62 s 0 · +93 s 1 request + field update applied; POST at 14:37:36 {"transitionId":"sla:chat"}', 'ok'],
    ['WH-22 from the designer (UI)', 'UiSmokeTest: After action Webhook POST added in the designer, published', 'saved after.actions [{kind:webhook, verb:POST}] → lead eeedf8b8… state web, webhook requests = 1', 'ok']] },
  'NDC-2541-api.png': { title: 'NDC-2541 · Approval "Call Webhook" to a receiver answering HTTP 500 — retries and log', who: AUTO, rows: [
    ['WH-16 after approval', 'approve lead e3fb80a5… → 204; watch receiver 4 min', '+60 s 2 · +120 s 2 · +181 s 3 · +241 s 3 requests', 'ok'],
    ['WH-16 log', 'GET /api/v1/workflow/executions?recordId=e3fb80a5…', 'dispatch actionType Webhook, status Pending, attempts 3 (logged)', 'ok'],
    ['WH-19 after rejection', 'reject lead ba0a65ba… → 204, state rejected', '+60 s 2 · +120 s 2 · +180 s 3 · +241 s 3 requests', 'ok'],
    ['WH-19 log', 'GET /api/v1/workflow/executions?recordId=ba0a65ba…', 'dispatch Webhook, status Pending, attempts 3 (logged)', 'ok']] },
  'NDC-2539-api.png': { title: 'NDC-2539 · ${owner} merge field in approval Call Webhook bodies (receiver webhook.site)', who: AUTO, rows: [
    ['WH-08 approve', 'lead 1a81a2b2… approve → 204', 'POST 14:35:29 body … "owner":"3445ec4a-020e-4f12-b156-dd2de7610164"', 'ok'],
    ['WH-15 approve, owner recheck', 'lead 7e949f14…, record owner 3445ec4a… before and after approve', 'approval webhook body "owner":"3445ec4a…" = lead owner', 'ok'],
    ['WH-09 reject (rerun)', 'lead 269f13e6… reject → 204, state rejected', 'POST 14:53:12 body … "owner":"3445ec4a-020e-4f12-b156-dd2de7610164"', 'ok'],
    ['WH-09 first run', 'run 2', 'test error: approval state 404 after reject (tooling) — rerun in run 3 passed', 'info']] },
  'NDC-2545-api.png': { title: 'NDC-2545 · Idle timeout 2 min — busy session vs idle session (automation SessionPolicyTest SP-04)', who: AUTO, rows: [
    ['policy', 'PUT security policy idle_timeout_minutes = 2 (baseline: max concurrent 20, idle 60)', '200', 'info'],
    ['busy session', 'GET /api/v1/iam/me every 30 s', '200 at 30, 60, 90, 120, 150, 180, 210 s; at the end token 200 / refresh 200', 'ok'],
    ['idle session', 'no requests, then GET with token and refresh', 'token 401 / refresh 401 — signed out', 'ok'],
    ['restore', 'idle_timeout_minutes = 60', '200 — max concurrent 20, idle 60 (= baseline)', 'info'],
    ['Login History', 'GET /api/v1/audit/login-history', '500 (audit service down since ~14:30 UTC) — not checkable this round', 'info']] },
  'NDC-2543-api.png': { title: 'NDC-2543 · Rename the built-in "User" profile (automation AdminApiTest PR-06)', who: 'automation (ndc-staging-owner)', rows: [
    ['rename built-in User', 'PATCH /api/v1/iam/profiles/11111111-…-111111111103 {"name":"…renamed"}', '409 SYSTEM_PROFILE_PROTECTED "Built-in profiles cannot be renamed. Clone the profile to create one you can rename."', 'ok'],
    ['read back', 'GET /api/v1/iam/profiles', 'renamed = false — still "User"', 'ok'],
    ['custom profile edits', 'PATCH a QA custom profile (rank 200, parent) — NDC-2546 run', '204 — custom profiles still editable', 'ok']] },
  'NDC-2546-api.png': { title: 'NDC-2546 · Edit a profile\'s rank above its parent\'s (automation LeftoversApiTest PR-04)', who: 'automation (ndc-staging-owner)', rows: [
    ['valid edit', 'PATCH /api/v1/iam/profiles/{QA} {"rank":200}', '204', 'ok'],
    ['valid edit', 'PATCH {parent: Supervisor, rank: 100}', '204', 'ok'],
    ['rank above parent', 'PATCH {"rank":600} under a rank-300 parent', '400 VALIDATION_ERROR "Profile rank (600) must be lower than parent profile\'s rank (300)."', 'ok'],
    ['read back', 'GET /api/v1/iam/profiles', 'rank stays 100, parent 11111111-…104 (Supervisor)', 'ok'],
    ['cleanup', 'DELETE QA profiles', '204', 'info']] },
  'NDC-2542-api.png': { title: 'NDC-2542 · Invitation lifetime validation (automation AdminApiTest US-06)', who: 'automation (ndc-staging-owner) + API check 27 Oct', date: '26–27 Oct 2026', rows: [
    ['lifetime 0', 'POST /api/v1/iam/users/invite {lifetime_days:0}', '400 iam.invite.lifetime_out_of_range "lifetime_days must be between 1 and 90 days (received 0)."', 'ok'],
    ['lifetime -1 (27 Oct)', 'POST /api/v1/iam/users/invite {lifetime_days:-1, profile User}', '400 iam.invite.lifetime_out_of_range "lifetime_days must be between 1 and 90 days (received -1)." — nothing created', 'ok'],
    ['lifetime 10000', 'POST /api/v1/iam/users/invite {lifetime_days:10000}', '400 iam.invite.lifetime_out_of_range "…between 1 and 90 days (received 10000)."', 'ok'],
    ['bad email (control)', 'POST /api/v1/iam/users/invite {email:"bad"}', '400 VALIDATION_ERROR "Email must be valid."', 'ok'],
    ['no profile (control)', 'POST /api/v1/iam/users/invite (unknown profile)', '400 VALIDATION_ERROR "Unknown profile."', 'ok']] },
  'NDC-2296-api.png': { title: 'NDC-2296 · Convert a lead waiting for approval (automation D-21 / H-03)', who: AUTO, rows: [
    ['D-21 convert, User profile', `valafo4080: POST ${L}/records/{id}/convert`, '422 APPROVAL_LOCKED "This record is awaiting approval and cannot be converted until the approval is complete."', 'ok'],
    ['D-21 convert, CRM Admin', `mmohamed: POST ${L}/records/{id}/convert`, '422 APPROVAL_LOCKED (same message)', 'ok'],
    ['D-21 delete (control)', `both users: DELETE ${L}/records/{id}`, '422 APPROVAL_LOCKED "…cannot be deleted until the approval is complete."', 'ok'],
    ['H-03 convert', 'nameb56175 and mahmoud.mahamed1515: POST …/convert', '422 APPROVAL_LOCKED (both)', 'ok']] },
  'NDC-2297-api.png': { title: 'NDC-2297 · Convert a lead held for review (automation H-02)', who: AUTO, rows: [
    ['H-02 convert, User profile', `nameb56175: POST ${L}/records/{id}/convert`, '422 REVIEW_LOCKED "This record is under review and cannot be converted until the review is complete."', 'ok'],
    ['H-02 convert, CRM Admin', `mmohamed: POST ${L}/records/{id}/convert`, '422 REVIEW_LOCKED (same message)', 'ok'],
    ['delete (control)', `DELETE ${L}/records/bb2717fd…`, '422 REVIEW_LOCKED "…cannot be deleted until the review is complete."', 'ok']] },
  'NDC-2309-api.png': { title: 'NDC-2309 · Reviewer "Record owner" on an imported, rule-assigned lead (automation F-01)', who: AUTO, rows: [
    ['import + rule (Import channel)', `POST ${L}/import … execute → completed`, 'lead 97c1fa12… owner = mahmoud.mahamed1515 (rule user), entryChannel excel_import', 'ok'],
    ['review request', 'GET /api/v1/workflow/reviews/{id}', 'pending_for_review, reviewerUserIds = [mahmoud.mahamed1515] = assigned owner', 'ok'],
    ['owner\'s queue', 'mahmoud.mahamed1515: GET /workflow/reviews/me', 'imported lead listed = true', 'ok'],
    ['owner reviews', 'POST /workflow/reviews/{id}/fields/email/approve', '200', 'ok'],
    ['control (manual lead)', 'lead d18fe5a7… owner mahmoud.mahamed1515', 'reviewerUserIds = [mahmoud.mahamed1515]', 'info']] },
  'NDC-2308-api.png': { title: 'NDC-2308 · Approver "Record Owner" on an imported, rule-assigned lead (automation F-03)', who: AUTO, rows: [
    ['import + rule (Import channel)', `POST ${L}/import … execute → completed (submitted by mmohamed)`, 'lead b66dd4f1… owner = mahmoud.mahamed1515 (rule user)', 'ok'],
    ['approval', `GET /api/v1/workflow/approvals/records/{Leads}/b66dd4f1…`, 'pending_approval, currentApprovers = [mahmoud.mahamed1515] = assigned owner (not the importer / process admin)', 'ok'],
    ['owner can act', 'mahmoud.mahamed1515 canApprove', 'true', 'ok'],
    ['controls (manual leads)', 'created by test user 1 / CRM Admin', 'currentApprovers = [nameb56175] / [mahmoud.mahamed1515] = owner', 'info']] },
  'NDC-2391-api.png': { title: 'NDC-2391 · Workflow rule with a Lead Owner condition (automation F-02, assignment → workflow)', who: AUTO, rows: [
    ['import + assignment rule', `POST ${L}/import … execute → completed, 1 created`, 'owner after import 3445ec4a… (mahmoud.mahamed1515) = expected', 'ok'],
    ['executions', 'GET /api/v1/workflow/executions?recordId=…', 'AssignmentRule → Fired, then Rule (Owner = 3445ec4a… criteria) → Fired', 'ok'],
    ['result', 'GroupFHandoffTest.f02AssignmentBeforeWorkflowOwnerCriteria', 'PASS — the owner condition matches the owner set by the rule', 'ok']] },
  'NDC-2422-api.png': { title: 'NDC-2422 · Assignment rule "Online status" availability (automation UiSmokeTest A-10, import through the UI)', who: AUTO, rows: [
    ['control: requireOnline = false', 'rule members test user 2 (first, no session), Owner; Leads › Import', 'lead cfcf5183… owner = test user 2 (first member)', 'ok'],
    ['requireOnline = true', 'same rule with Online status ticked', 'lead 8562056e… owner = Owner (online) — offline test user 2 skipped', 'ok']] },
  'NDC-2411-api.png': { title: 'NDC-2411 · Suspended member skipped, fallback gets the lead (automation UiSmokeTest A-17)', who: AUTO, rows: [
    ['suspend', 'Settings › Users › test user 2 › Manage › Suspend', 'status active → suspended', 'info'],
    ['import with the rule', 'Leads › Import, "Assign owner based on assignment rules"', 'lead 026b47c7… owner = Supervisor (fallback user)', 'ok'],
    ['reactivate', 'Settings › Users › test user 2 › Manage › Reactivate', 'status → active (restored)', 'info']] },
  'NDC-2419-api.png': { title: 'NDC-2419 · Assignment rules set the owner — import vs API channel (automation GroupAJTest)', who: AUTO, rows: [
    ['A-02 import choosing the rule', 'Leads import, rule chosen in the Assign step', 'lead 0c6d852e… owner = valafo4080 (rule user), rule Fired, source excel_import', 'ok'],
    ['A-01 API-channel create', `test user 1: POST ${L}/records (source api)`, 'lead a82cf193… owner = nameb56175 (creator 45ffbc5b…) — expected rule user 51666421…', 'bad'],
    ['A-01 execution', 'GET /workflow/executions?recordId=a82cf193…', 'assignment rule c5b0df2f… outcome Fired — but owner not changed', 'bad'],
    ['rerun 27 Oct (auto-run6)', `test user 1: POST ${L}/records (source api)`, 'same result — lead afd8b30c… owner = nameb56175 (creator), rule 1be065d1… Fired; expected 51666421… (valafo4080)', 'bad']] },
  'NDC-2334-api.png': { title: 'NDC-2334 · On Edit approval vs a deal in a published blueprint (automation VerifyV3 F-20)', who: AUTO, rows: [
    ['blueprint deal edited', `test user 1: PATCH ${D}/records/7aac7231… {next_step:"edit"} (matches the On Edit approval)`, '200 — approval = null, governed = true', 'ok'],
    ['blueprint state', `GET ${D}/records/7aac7231…/blueprint-state`, 'states: QA AEO V3 F-20 BP, target stage, activeStates ["qualification"] — still in the blueprint', 'ok'],
    ['control deal (no blueprint)', `PATCH ${D}/records/ab9a0c9e… same edit`, 'approval = pending_approval, governed = false (approval works outside blueprints)', 'info']] },
  'NDC-2302-api.png': { title: 'NDC-2302 · Import with "Trigger automation" off — review, workflow, approval, blueprint', who: AUTO, rows: [
    ['G-04r import, trigger off', `POST ${L}/import … execute (review process + On Create workflow active)`, 'completed — lead 848c3929…; review status null, Description null', 'ok'],
    ['G-04r after review step', 'approve / wait, read lead + executions', 'review = null, description = null, wfFired = 0, executions = [] — workflow not run', 'ok'],
    ['G-04b blueprint (observation)', 'GroupGChainTest.g04LeadsImportTriggerOff', 'owner set by assignment, review null, wfFired 0, approval null — but governed = true (lead entered a blueprint)', 'info'],
    ['first run (run 2)', 'reviewer history check', 'test error: 403 "Missing required permission \'workflow:review:view\'" (account) — rerun in run 5 passed', 'info']] },
  'NDC-2323-api.png': { title: 'NDC-2323 · Scheduled webhook (120 s) on a lead converted before it is due', rows: [
    ['rule', 'POST /api/v1/workflow/rules (Leads, On Create, scheduled Webhook +120 s)', '201 — rule 1448ac2e…', 'info'],
    ['lead 1 converted at once', `POST ${L}/records/3a22e4a4…/convert (15:08:41)`, '200', 'info'],
    ['lead 1 after 2+ min', 'executions / dispatches + receiver', 'no dispatch, nothing received — scheduled webhook cancelled', 'ok'],
    ['lead 2 control', 'executions / receiver', 'Webhook Succeeded 15:10:41 (+2 min); receiver got only recordId 5898eb60… (control)', 'ok']] },
  'NDC-2322-api.png': { title: 'NDC-2322 · Workflow rule criteria count — one And group', rows: [
    ['24 conditions', 'POST /api/v1/workflow/rules (Leads, On Create, And group × 24 leaves)', '201', 'ok'],
    ['25 conditions', 'same with 25 leaves', '201 — saved', 'ok'],
    ['26 conditions', 'same with 26 leaves', '400 "…at most 25 conditions (this one has 26)." — counts leaves only', 'ok']] },
  'NDC-2386-api.png': { title: 'NDC-2386 · Settings › Pipelines opened directly (automation RecordScreensUiTest)', who: AUTO, rows: [
    ['direct open', 'GET https://staging-crm.taviportal.com/settings/pipelines (new page, no in-app navigation)', 'RecordScreensUiTest.pipelinesPageLoads PASS', 'ok'],
    ['PL-02 after 30 s', '"Loading board…" still shown?', 'false — page left the loading state', 'ok'],
    ['PL-02 probe', 'board text "Standard" found?', 'false (same run logged a session-restore timeout just before); page load confirmed by hand 27 Oct', 'info']] },
  'NDC-1444-api.png': { title: 'NDC-1444 / NDC-2383 · Rollup Summary on Leads layout "QA RT r6 layout" — relations offered and save requests', rows: [
    ['Related module Transactions (Deals)', 'ADVANCED › Related List (Lookup Field)', 'offers Connected To · Lookup · Multi-Select Lookup — no "no lookup field" warning', 'ok'],
    ['Related module Customers (Contacts)', 'ADVANCED › Related List (Lookup Field)', 'offers Connected To · Lookup', 'ok'],
    ['rollup', 'Connected To › Amount › Sum, label "QA RT rollup r6" → Apply → Save', 'POST field 201 (2 s) → field qa_rt_rollup_r6 f95c0430', 'ok'],
    ['layout save', 'PUT /api/v1/modules/{Leads}/layouts/212d0ec2…', '200 in 3 s (21 Oct: no response, 14–18 s by API)', 'ok'],
    ['read back', 'GET layout', 'lastModified 15:15:51, rollup on the layout (not in Unused Fields)', 'ok']] },
  'NDC-2423-api.png': { title: 'NDC-2423 · Layout builder Save of validation regex and Unique/Required (QA fields on QA layout)', rows: [
    ['Phone regex', 'Set Permission › Validation regex ^01[0125]\\d{8}$ → Apply → Save', 'PUT field 200 with the regex; after reload editor and API show the same regex', 'ok'],
    ['Email unique + required', 'Mark as Unique + Mark as Required → Save', 'PATCH constraints {required:true, unique:true} 200; API unique = true, required = true', 'ok'],
    ['record: phone 123', `POST ${L}/records`, '422 "does not match the required pattern"', 'ok'],
    ['record: 01012345678', `POST ${L}/records`, '201', 'ok'],
    ['record: duplicate email', `POST ${L}/records`, '422 "already in use"', 'ok'],
    ['record: no email', `POST ${L}/records`, '422 "is required" — QA email set back to not required right after', 'ok']] },
  'NDC-2281-api.png': { title: 'NDC-2281 · Leads › Filter › Owner options vs CRM users', rows: [
    ['Owner filter options', 'Leads › Filter › Fields › Owner', '"Current user" + 9 users', 'ok'],
    ['CRM users', 'GET /api/v1/iam/users?app_key=crm', 'the same 9 users', 'ok'],
    ['Desk-only agent', 'fedelav803 (Desk agent, no CRM access)', 'absent from the Owner options', 'ok']] },
  // ───── 27 Oct (staging recovered, auto-run6.xml + manual) ─────
  'NDC-2381-api.png': { title: 'NDC-2381 · Audit Log recording — 27 Oct rerun (automation AuditLogTest)', who: AUTO, date: '27 Oct 2026', rows: [
    ['C-1 recordLifecycleIsLogged', `create → update → delete a QA record, then GET /api/v1/audit/events?app_key=crm`, 'PASS — after 3 s: created = true, updated = true (changes listed), deleted = true; actor ndc-staging-owner', 'ok'],
    ['C-2 setupChangesAreLogged', 'create profile · field permission · user override, then read audit events', 'PASS — profile created, field permission, user override all logged', 'ok'],
    ['C-2b logoutNamesUser', 'newest 200 iam events', 'inconclusive — no logout event among them (skipped)', 'info']] },
  'NDC-2418-api.png': { title: 'NDC-2418 · Login History session status — 27 Oct rerun (automation LoginHistoryTest)', who: AUTO, date: '27 Oct 2026', rows: [
    ['D-1 expiredSessionsNotActive', 'GET /api/v1/audit/login-history?status=active (up to 1,000 read)', 'PASS — 6 sessions Active, 0 past their expiry; oldest login 2026-10-27 06:33 (25 Oct: 346 Active, 306 past expiry)', 'ok'],
    ['D-4 revokedSessionStopsWorking', 'new session of test user 1 → revoke', 'PASS — token before 200; clear 204; token after 401', 'ok'],
    ['D-2 deniedUserCannotExport', 'view self/team/all denied, fresh sign-in', 'PASS — list 403, export 403 (0 bytes); control before override 200 / 200', 'ok']] },
  'NDC-2293-api.png': { title: 'NDC-2293 · Audit Log "All Entities" filter — automation + manual review (27 Oct)', who: 'automation + mahmoud.mahamed1515 (manual)', date: '27 Oct 2026', rows: [
    ['C-3 entityFilterHasNoDuplicates', 'audit facets API', 'PASS — 111 entity options, duplicates (case-insensitive): none', 'ok'],
    ['AU-05/06 AccessScreensUiTest', 'Audit Log screen, All Entities', 'PASS — filters missing: none; 56 options on screen, duplicates: none', 'ok'],
    ['manual: full list', 'All Entities, scrolled', '67 options, no duplicates; "Test", "Module view pin", "User list preference" gone', 'ok'],
    ['manual: grouping', 'search approval / saved view', 'Approval + Approval Override indented under Approval Process; Saved View Sharing under Saved View', 'ok'],
    ['manual: searches', 'approval · blueprint · work · act · saved view', 'one entry each (no repeats)', 'ok'],
    ['observation', 'list entries', '"Audit Log Entry" and "Mail agent signature row" still look internal', 'info']] },
  'NDC-1701-api.png': { title: 'NDC-1701 · Plain member (test user 1) on teamspace "QA RT TS r6" tries admin actions — 27 Oct', who: 'test user 1 (access only, not admin)', date: '27 Oct 2026', rows: [
    ['teamspace read', 'read the teamspace as the member', 'canManage = false', 'ok'],
    ['create folder', 'create a folder', '403', 'ok'],
    ['rewrite access list', 'rewrite the access list (PUT acl)', '403', 'ok'],
    ['rename', 'rename the teamspace', '403', 'ok'],
    ['add / create module', 'create a module in it', '403', 'ok'],
    ['change access mode', 'change the access mode', '403', 'ok'],
    ['read back (admin)', 'read the teamspace as admin', 'unchanged — last modified by mahmoud.mahamed1515 (not the member)', 'ok']] },
  'NDC-1172-api.png': { title: 'NDC-1172 · CRM Admin not on the access list of "QA RT 1172" (access Selected, only test user 1 = admin) — 27 Oct', date: '27 Oct 2026', rows: [
    ['Selected Users option', 'mahmoud.mahamed1515 (CRM Admin): GET /api/v1/teamspaces', 'QA RT 1172 not listed', 'ok'],
    ['direct routes', 'open the teamspace · its folders', '403 · 403', 'ok'],
    ['Settings › Teamspace', 'list as the same CRM Admin', 'lists CRM Teamspace, New Teamspace, QA RT TS r6 — not QA RT 1172', 'ok'],
    ['Org-unit option', 'ACL = test user 1 (admin) + org unit 5533f730; CRM Admin is in root "Organization"', 'still not listed; teamspace / folders 403', 'ok'],
    ['admin keeps access', 'test user 1 changes the access list', '200', 'ok'],
    ['Profile option', 'automation TeamspaceAccessTest', 'Supervisor not on the list refused (PASS, 26 Oct)', 'info']] },
  'NDC-1678-api.png': { title: 'NDC-1678 · Edit Teamspace "QA RT TS r6" — icon, admin, description (27 Oct)', date: '27 Oct 2026', rows: [
    ['save', 'Rocket icon, pink, admin test user 1, + 1 module → Save', 'PUT teamspace 200 · PUT acl 200 · toast "1 module added to this teamspace"', 'ok'],
    ['read back', 'GET /api/v1/teamspaces/{id}', 'icon Rocket, iconColor pink, admin 45ffbc5b… (test user 1); description kept', 'ok'],
    ['observation: Add Modules', 'Add Modules list', 'shows raw module keys (leads, contacts, qa_rt_partners…) instead of names', 'info'],
    ['observation: modules', 'Save with no module', 'Save needs at least one module', 'info'],
    ['observation: admin handover', 'editor hands admin to someone else → follow-up PATCH …/access-mode', '403, no message shown (mode was unchanged)', 'info']] },
  'NDC-2385-api.png': { title: 'NDC-2385 · Leads import QA-RT-2385-inv.csv (3 rows, layout FieldPermissions, Percent 250 on row 3) — Review step', date: '27 Oct 2026', rows: [
    ['summary', 'Review › Summary', 'Rows 3 · Rows that will import 2 · Rows with errors 1', 'ok'],
    ['All errors table', 'Review › All errors', 'Row 3 | Percent Permission | 250 | "The value isn\'t a valid percentage: Percent value must be between 0 and 100." | Invalid format (1–1 of 1)', 'ok'],
    ['not submitted', '—', 'import left at Review (no records created)', 'info']] },
  'NDC-2298-api.png': { title: 'NDC-2298 · Assignment rule limited to the API channel vs Leads import', who: 'automation (auto-run3 A-04) + mahmoud.mahamed1515 (UI, 27 Oct)', date: '26–27 Oct 2026', rows: [
    ['UI: rules offered (27 Oct)', 'Leads › Import › Assign › Choose assignment rule (QA rules "QA RT 2298 api-only" [Api] + "QA RT 2298 import" [Import], both active)', 'AssignmentRule-Leads-Approval, AEX-01, QA RT 2298 import, test — API-only rule NOT offered', 'ok'],
    ['A-04 rule', 'GET /workflow/assignment-rules/0e30673f…', 'allowedChannels ["Api"]', 'info'],
    ['A-04 API-only rule on import', `POST ${L}/import … (rule 0e30673f…)`, 'lead 32c4ebbd… owner = null; execution logged — no owner assigned', 'ok'],
    ['A-04 control: Import rule', `POST ${L}/import … (rule 0304dd1d…, [Import])`, 'lead 938be3f2… owner = valafo4080', 'ok']] },
  'NDC-1699-blocked.png': { title: 'NDC-1699 · Manager-profile user vs teamspace access list — BLOCKED (27 Oct)', date: '27 Oct 2026', rows: [
    ['precondition', 'Settings › Users / GET /api/v1/iam/users?app_key=crm', 'no user holds the Manager profile (User ×3, test, CRM Admin ×3, Supervisor, Owner)', 'bad'],
    ['make one', 'assign Manager (or CRM Admin) to test user 2', 'not done — refused by the agent\'s safety check (privilege change on a shared user)', 'bad'],
    ['related coverage', 'automation TeamspaceAccessTest.otherProfileNotOnListIsRefused', 'PASS — Supervisor not on the list cannot see / open the teamspace (25–26 Oct)', 'info'],
    ['to unblock', '—', 'a Manager-profile test user (or approval to assign Manager to test user 2 and revert)', 'info']] },
  'NDC-1699-api.png': { title: 'NDC-1699 · Manager-profile user vs teamspace "QA RT TS r6" access list (27 Oct)', who: 'test user 2 (profile Manager, switched by the user)', date: '27 Oct 2026', rows: [
    ['precondition', 'test user 2 profile', 'Manager (switched by the user for this test)', 'info'],
    ['access list', 'QA RT TS r6 ACL (access Selected)', 'test user 1 = admin + profiles User / Supervisor / test — Manager not on the list', 'info'],
    ['teamspace list', 'GET /api/v1/teamspaces', 'CRM Teamspace, New Teamspace, QA RT 1172 — QA RT TS r6 NOT listed', 'ok'],
    ['open directly', 'GET /api/v1/teamspaces/{QA RT TS r6} · …/folders', '403 · 403', 'ok'],
    ['control: covered teamspace', 'QA RT 1172 (its org unit is on that list)', 'listed — access works when the user is covered', 'ok']] },
  'NDC-2412-rule-api.png': { title: 'NDC-2412 · Role mode against the user\'s rule (27 Oct) — VisibilityTest, Leads visibility = Hierarchy', who: AUTO, date: '27 Oct 2026', rows: [
    ['I2 same profile, other OU', 'V = User @HR, N = User @Sales', 'V sees N = false, N sees V = false', 'ok'],
    ['I2b same profile, same OU', 'V = User @Sales, N = User @Sales', 'V sees N = false, N sees V = false', 'ok'],
    ['I1/I5 lower does not see higher', 'N = User opens own and superior V\'s lead', 'own = true, self-created = true, superior V\'s lead = false', 'ok'],
    ['I3b higher, same OU', 'V = Manager (500) @Sales, N = User (100) @Sales', 'owner-set = true, N-created = true', 'ok'],
    ['I7 higher, same OU', 'V = Manager (500) @Sales, N = Supervisor (300) @Sales', 'V sees N: true / true; N sees V\'s lead = false', 'ok'],
    ['I4 higher, other OU', 'V = Supervisor @HR, N = User @Sales', 'V sees N\'s lead = false', 'ok'],
    ['I8 tenant owner', 'owner opens N\'s and V\'s leads', 'owner-set = true, N-created = true, V\'s = true', 'ok'],
    ['I3 higher, same OU', 'V = Supervisor (300) @Sales, N = User (100) @Sales', 'FAIL — owner-set = false, N-created = false (does NOT see)', 'bad'],
    ['I4b higher, other OU', 'V = Manager (500) @HR, N = User (100) @Sales', 'FAIL — owner-set = true, N-created = true (DOES see across org units)', 'bad']] },
  'NDC-qa-rt-partners.png': { title: 'Module "QA RT partners" lifecycle — NDC-2384 (create) · NDC-2388 (conversion target) · NDC-1864 (disable)', rows: [
    ['NDC-2384 create', 'Create module dialog → POST /api/v1/teamspaces/5ea90671…/modules {plural, singular, key qa_rt_partners}', '201 — module abf9acff created', 'ok'],
    ['NDC-2388 conversion target', 'GET /api/v1/modules/{Leads}/conversion/targets', 'QA RT partners isConversionTarget = false (no Create when, no Field Mapping column)', 'ok'],
    ['NDC-1864 switch off', 'Modules list status toggle', '"Module updated successfully"; module status disabled; not in sidebar', 'ok'],
    ['NDC-1864 read records', 'GET /api/v1/modules/{QA RT partners}/records', '403 "This module is disabled…"', 'ok'],
    ['NDC-1864 create record', 'POST /api/v1/modules/{QA RT partners}/records', '403 "This module is disabled…"', 'ok']] },
};
const DIR = path.join(__dirname, 'cards-r6'); fs.mkdirSync(DIR, { recursive: true });
const boxFile = path.join(DIR, 'boxes.json');
const boxes = fs.existsSync(boxFile) ? JSON.parse(fs.readFileSync(boxFile, 'utf8')) : {};
const only = process.argv.slice(2);
for (const [out, s] of Object.entries(C)) {
  if (only.length && !only.some(o => out.includes(o))) continue;
  const f = path.join(DIR, out.replace('.png', '.json'));
  fs.writeFileSync(f, JSON.stringify({ out, date: DATE, ...s }, null, 1));
  const res = execFileSync('node', [path.join(__dirname, 'apicard.js'), f], { encoding: 'utf8' }).trim();
  boxes[out] = JSON.parse(res.slice(res.indexOf('[')));
  console.log(res);
}
fs.writeFileSync(boxFile, JSON.stringify(boxes, null, 1));
