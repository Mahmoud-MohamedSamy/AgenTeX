# CRM Automation Execution Order — feature map

App: TAVI CRM staging — https://staging-crm.taviportal.com (tenant NDC-Staging `a7a7a7a7-0000-0000-0000-000000000004`), verified 18 Oct 2026.
Spec: `docs/crm-automation-execution-order/spec-crm-automation-execution-order.md` · Gaps: NDC-2294 · Brief for sessions: `docs/crm-automation-execution-order/automation-brief.md`.
Order under test: Assignment → Review → Workflow (+actions) → Approval → Blueprint.

## How it is tested
API level, several users per case, no browser: `CrmUser.as(email)` signs in through `POST /api/v1/iam/auth/login`
(body email, password, device_label, remember_me; header `x-tenant-id`), tokens 5 min, refresh `POST /iam/auth/refresh`.
A second sign-in no longer ends the account's other sessions (checked 18 Oct 2026), so parallel classes share accounts.
Credentials: `docs/Credentials/Microsoft Edge Passwords.csv` (browser export WITHOUT header row; `Credentials.find(file, host, email)`).

Run: `./mvnw test -Dfeature=crmautomationorder -Dtags=crm-harness` (S0) · all groups `-Dtags=crm-order` · one group `-Dtags=group-b` · one case `-Dcases=F-07`.

## UI layer (Selenium, added 21 Oct 2026)
`UiSmokeTest` (groups `crm-ui`, `smoke`; NDC-1672 for K-10): the five setup screens create → list → reopen → delete a process
(UI-01…UI-05), the record page follows Review → Approval → Blueprint (UI-06), Save disabled with nothing editable (K-10).
Browser = Owner (Desk session reused on the CRM host, `CrmSetupPage.ensureCrm`); setup the screens cannot reach and the
safety-net cleanup go through the API as CRM Admin B. Names `QA AEO UI …`, every process restricted to names starting
with that prefix; the class creates its own Leads layout "QA AEO Layout UI" (all users, so the Owner's pickers list it) and deletes it.
Pages: `pages/CrmSetupPage` (shared: dialogs, listboxes, condition builder, row menus, people picker) + one per screen, `LeadRecordPage`.
Zoho references: `zoho/01…05-*.png` (org943261092, read-only, 21 Oct 2026) via `@ZohoRef`.

Run: `./mvnw test -Dtest=UiSmokeTest -Dheadless=true "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.host=staging-crm.taviportal.com -Dcredentials.account=ndc-staging-owner@taviportal.com`
(the default `credentials.file` no longer exists). One case: `-Dtest=UiSmokeTest#ui03WorkflowRule`.

UI traps (21 Oct 2026):
- Every list row has "Actions for <name>" → Edit / Delete (workflow adds Activate/Deactivate, Test rule; blueprint Clone, Version history); Delete asks in a dialog.
- Custom dropdowns are `[role=listbox] [role=option]`; long ones (fields, users) are searchable — `option()` types into the popup "Search" box. The list pages also carry a native "Filter by module" select with the same option names: always scope to the listbox / dialog.
- Dependent pickers load late (review "Choose Layout", blueprint layout/field selects): `openDropdown` / `selectWhenLoaded` wait and retry.
- Labels wrap their inputs in the review dialog ("Process Name"): the first textbox candidate is a label descendant, else text went into Description.
- Condition builder (all five): field button `aria-label="— select field —"` (its text is the chosen field), button `Operator`, value input; the Leads name field is "Name"; operator "starts with".
- Workflow editor has no plain Save — "Save & Activate" (a new rule is saved Active); deactivate from the list. Trigger buttons Create/Edit/… sit in group "Execute based on" and the wizard footer also has "Create". Field Update is inline: "Add field" adds a row only after the module fields load; Leads has no Description field on screen — use "Comment".
- Review editor: "Pick at least one field to review." — the Field Set is a dropdown whose button reads "Clear all fields"; reviewers come from a people-picker dialog (search, checkbox rows, Save).
- Approval editor: rule sections are accordions (expand "Who should approve", "Process Admin Settings"); "Loading fields…" can take ~20 s on staging. A process admin is required.
- Blueprint dialog: Module / Choose layout / Choose field are native selects inside the dialog; states are the picklist values in lower case ("chat", "web"); clicking two states joins them with an unnamed edge; "Save as draft" keeps it inactive. Leaving an unsaved designer raises a beforeunload prompt (`leaveDraft`).
- The CRM home dashboard can time out on staging (renderer timeout); the session hop uses `/settings`.
- A lead left pending approval blocks deleting both itself and its approval process (409 "already exists" on the next run): release it (reject) before cleanup. Leftovers: `-Dtest=UiSmokeTest#zzSweepLeftovers -Duisweep=list|delete`.
- Workflow condition on Lead Owner: field `owner` (datatype user); the screen saves `{kind:Comparison, field:owner, operator:Equal, value:{kind:string, stringValue:<user id>}}`; value kinds uuid/user are refused (400); `owner_id` is an unknown field. It never matches (21 Oct).
- A lead's Related To / Contact Name on a task page appear only after "Loading layout…" ends; wait for it.
- Update-mode imports match only on a unique field placed on the chosen layout; Leads' only unique field is "name" (on no layout) → `CrmApi.placeFieldOnLayout(admin, LEADS, qaLayout, "name")`. Update mode still validates every required field (send first_name, phone, single_line_3_9).
- Users: Settings → Users row menu Manage | Suspend | Remove from CRM (suspended → Reactivate); `GET /iam/users?app_key=crm` gives status. Conversion mapping: `GET /modules/{leads}/conversion/config`. API Integration: `/iam/integrations/clients` (token scoped to records:ingest).
- Settings deep links (e.g. /settings/users) redirect home: navigate through the Settings menu (`LeadRecordPage.clickText`).
- Another session may be editing `crmdeskintegration` at the same time: a compile error there blocks every run — wait, do not touch their files.

## Accounts (profiles read 18 Oct 2026)
| Account | Profile | Manager | Use |
|---|---|---|---|
| ndc-staging-owner@taviportal.com | Owner | – | shared with teammates |
| mmohamed@anyware.software | CRM Admin | – | process admin / reviewer (org picker shows the tenant as "Anyware") |
| mahmoud.mahamed1515@gmail.com | CRM Admin, Desk Administrator | – | process admin / approver |
| mahmoud.mmohamedsamy@gmail.com | Supervisor, Desk Administrator | – | manager of valafo4080 → "submitter's manager" approver |
| nameb56175@airhemp.com | User | Hegazy (not ours) | submitter / record owner |
| valafo4080@94an.com | "test" | mahmoud.mmohamedsamy | submitter |

## Ids
Modules: Leads `841043e1-…`, Deals `f42cbafd-…`, Tasks `a9d87b62-…` (CrmOrderFeature). Standard layouts: Leads `bf971461-…`, Deals `fcba0068-…` (pipeline Standard `5170500c-…`), Tasks `40c084f2-…`.
Required fields: Leads first_name, phone (`^01[0125]\d{8}$`), single_line_3_9 · Deals name, deal_name (+ pipeline) · Tasks name, subject.

## API (shapes verified)
- Records `POST /modules/{m}/records {layout_id, data:[{field, value:{kind,value}}]}` — "kind" must be the first key. API-created records have `source: manual`.
- Assignment rules `/workflow/assignment-rules` (allowedChannels WebForm/Api/Import; entries condition + target Category members; fallback LeaveUnassigned/DefaultUser). PATCH full object to toggle isActive.
- Review `/workflow/review-processes` — **only one per module+layout, inactive ones count** → each session creates its own restricted QA layout (`POST /modules/{m}/layouts` copy of Standard, then PUT accessMode "selected"; `DELETE /modules/{m}/layouts/{id}` removes it). Toggle `PATCH …/{id}/active {isActive, pendingAction: reject_all|move_to_system}` (pendingAction required when it holds records). Runtime: `GET /workflow/reviews/records/{m}/{r}/history` (cycles[].requestId/status), `GET /workflow/reviews/{req}`, `POST …/{req}/fields/{f}/approve|reject {reasonId, comment}`, `…/{req}/reject|approve|resubmit`, reasons `GET /workflow/review-rejection-reasons`. Statuses pending_for_review → in_review → rejected/approved.
- Workflow `/workflow/rules` (+ `/activate`, `/deactivate`), executions `/workflow/executions?recordId=`.
- Approval `/workflow/approval-processes` (+ `/{id}/active {isActive}`), runtime `GET /workflow/approvals/records/{m}/{r}` (instanceId, state, canApprove, canResubmit, viewerDecisionBlockedReason), `POST /workflow/approvals/{inst}/approve|reject|resubmit|delegate|takeover/*`. Reject/approve answer 204; resubmit makes a new instance.
- Blueprint `POST /modules/{m}/blueprints {isActive, definition}`; Stage blueprints need `definition.pipelineId` (a new Deals layout gets its own Standard pipeline: `GET /modules/{deals}/pipelines?layout_id=`). Runtime `GET /modules/{m}/records/{r}/blueprint-state`, `POST …/blueprint-transitions/{transitionId}` with `{}`. Governed field edit → 422 BLUEPRINT_GOVERNED_FIELD.
- Timeline `GET /timeline/records/{moduleKey}/{r}/feed`.

## Traps
- Teammates' active rules: Leads lead_status "Interested" fires "test last activity"; Tasks status "Completed" fires "ActionsOnTaskCompletionFromWorkqueue"; approval "AP" = Full Name contains "AP" (case-sensitive); assignment/workflow AEX-01. Never use those values/names.
- `/iam/me/profile` has no `{data}` envelope.
- Staging drops connections; CrmUser retries 3× on network errors / 502-504.
- Record list (probed 18 Oct 2026): plain `GET /modules/{m}/records?page=N` is NEWEST first, 100/page (`per_page` changes size; `page_size` ignored); `sort_by=created_at&sort_order=desc` returns OLDEST first; `?q=` finds nothing. Held (review) records are not listed — use `CrmApi.findRecord` (newest pages + review queue) / `importedRecordId` (executions carry correlationId = import session id).
- Review status after a resubmit is `pending_for_re_review`; `approvalState` "none" = no approval (CrmApi returns null). A workflow rule may hold only ONE FieldUpdate action (Wf.fieldUpdate merges).
- userN gets 403 PERMISSION_DENIED editing its own lead after an admin tagged it / after review approval (C-10, I-10).
- Cleanup: `-Dtags=crm-teardown` (OrderHarnessTest.purgeLeftovers) removes QA AEO records on QA layouts, QA AEO processes, QA layouts.
- Git Bash mangles `/workflow/...` args for node scripts → `MSYS_NO_PATHCONV=1`.

- Records list sort parameter is `sort_dir` (asc|desc), NOT `sort_order` (ignored → ascending). Blueprint reorder: `PATCH /modules/{m}/blueprints/sort {"items":[{"id","sort_order"}]}` (`{"ids":[…]}` answers 204 but does nothing). No reorder control in the UI.
- Delayed (scheduled) **Field Update** actions run immediately (bug B-12) — use a delayed **Webhook** (httpbin) to test scheduling/cancellation; dispatches via `GET /workflow/executions/{executionId}` (`data.dispatches[].status/lastAttemptAt`).
- Tasks `status` has datatype `status` (not `pick_list`) → blueprints refuse it; use Priority. Leads `lead_status` is also datatype `status`.
- Profile "test" (valafo4080) holds `workflow:approval:admin` → `isProcessAdmin=true` on every approval (it can approve its own submissions). For self-approval checks use userN.
- `record_owner` reviewer/approver is resolved before the assignment rule's owner on import (B-04/B-05); a process admin then becomes the approver — never make the importer the process admin when judging it.
- A lead converted while held for review stays REVIEW_LOCKED and blocks its layout's deletion: reject its review (`POST /workflow/reviews/{req}/reject`) then delete (see VerifyV5FollowUpTest.zzCleanupFirstRun).
- `GET /iam/profiles/{id}/permissions` and `/iam/me/permissions` list permission keys (`workflow:approval:admin`, …).
- The `crm-order` suite runs the whole package, which now includes the Verify* classes: run it with `-Dtags=crm-order` (or `-Dtest=…`), and the re-verification with `-Dsuite=crm-verify` / `crm-verify2`.

## Test inventory
| Case | Test | Groups | Last result |
|---|---|---|---|
| S0-01..03 | OrderHarnessTest | crm-harness | PASSED 18 Oct 2026 |
| A–K, E2E, Z (184 rows) | Group*Test | crm-order, group-a…k | 18 Oct final: 129 pass / 35 fail / 20 inconclusive / 3 not run (`target/crm-order-final.tsv`) |
| Re-verification of 25 candidates | VerifyV1…V5 (+VerifyBase) | crm-verify | 19 Oct: 15 bugs confirmed (B-01…B-15), 15 cleared — see `executions/execu_2026-10-18_crm-automation-order/report.md` |
| G-13 | GroupGChainTest.g13DealsImport | crm-order | PASSED 19 Oct (18 Oct failure not reproducible) |
| UI-01 | UiSmokeTest.ui01AssignmentRule | crm-ui, smoke | PASSED 21 Oct 2026 |
| UI-02 | UiSmokeTest.ui02ReviewProcess | crm-ui, smoke | PASSED 21 Oct 2026 |
| UI-03 | UiSmokeTest.ui03WorkflowRule | crm-ui, smoke | PASSED 21 Oct 2026 (Active after Save & Activate, Inactive after Deactivate) |
| UI-04 | UiSmokeTest.ui04ApprovalProcess | crm-ui, smoke | PASSED 21 Oct 2026 |
| UI-05 | UiSmokeTest.ui05Blueprint | crm-ui, smoke | PASSED 21 Oct 2026 |
| UI-06 | UiSmokeTest.ui06OrderOnRecordPage | crm-ui | PASSED 21 Oct 2026 (review → approval → blueprint shown in order) |
| E-16 | UiSmokeTest.e16RelatedToShowsName | crm-ui, NDC-1328 | PASSED 21 Oct 2026 (task shows Related To name; no ids in the designer) |
| K-09 | UiSmokeTest.k09ApprovalStatusOnScreen | crm-ui, NDC-1645, NDC-1652 | PASSED 21 Oct 2026 |
| F-02 | UiSmokeTest.f02OwnerCriterionFromScreen + VerifyV6OpenCasesTest.f02OwnerCriterion | crm-ui-f02, crm-verify6 | FAILED 21 Oct 2026: Lead Owner condition never matches (candidate bug) |
| E-04, B-13 | VerifyV6OpenCasesTest.e04AfterEmailToInbox, b13ReviewSla60 / b13CheckAndCleanup | crm-verify6 | E-04 email sent to the user's inbox (to confirm); B-13 escalation notification received |
| K-10 | UiSmokeTest.k10SaveDisabledWhenNothingEditable | crm-ui, NDC-1672 | PASSED 21 Oct 2026 (Save disabled, 0 editable fields, "Locked while awaiting approval") |

Bug → test map (19 Oct): B-01 D-21/H-03 · B-02 H-02 · B-03 G-07 · B-04 F-03 · B-05 F-01 · B-06 G-04 · B-07 A-04 · B-08 C-12 · B-09 E-13 · B-10 G-16 · B-11 C-14 (VerifyV2.c14Limits) · B-12 C-11/H-05/C-15 (VerifyV5.c11FieldUpdateDelay) · B-13 H-05 (VerifyV5.h05WebhookAfterConvert) · B-14 F-20 · B-15 E-09. Test defects to fix in the Group tests: D-05 (read approval_status, not the old instance state), E-15/J-01/E2E-5 (blueprint on Tasks Priority), E-18 (sort body), C-11/H-05/C-15 (use delayed webhook), list sort (`sort_dir`), C-09/A-08/D-17/K-09 expectations.

## Run history
| Date | Scope | Passed | Failed | Notes |
|---|---|---|---|---|
| 2026-10-18 | S0 harness | 3 | 0 | per-session QA layouts created and deleted (204) |
| 2026-10-18 | Run 1, all groups | 71 | 35 | 81 inconclusive — HTTP 429 sign-in storm (6 JVMs) |
| 2026-10-18 | Run 2, suite crm-order | 117 | 37 | 33 inconclusive |
| 2026-10-18 | Run 2 + 3 final | 129 | 35 | 20 inconclusive, 3 not run |
| 2026-10-19 | Re-verification crm-verify + crm-verify2 + G-13 | – | – | 15 confirmed bugs, 6 not a bug, 5 test defects, 1 inconclusive (H-04), 8 gaps (NDC-2294); final GET check: 0 QA AEO leftovers |
| 2026-10-21 | UI layer, UiSmokeTest (7) | 7 | 0 | full-class run 5/7: K-10 hit a leftover approval of an earlier run (pending lead blocked cleanup — K-10 now rejects it), UI-05 list page slow; both re-run green; `zzSweepLeftovers -Duisweep=list` → 0 QA AEO UI leftovers |
| 2026-10-21 | UI layer full class, re-run | 6 | 1 | UI-05 read the reopened name before the designer filled it (test timing; now waits) → UI-05 re-run PASSED. Earlier run stopped by low memory; UI-02 once showed "Something went wrong." on Done (not reproduced). Sweep now also removes stray QA AEO Layout UI layouts |
| 2026-10-21 | Open cases E-04, F-02, E-16, K-09, B-13 | 3 | 1 | E-16, K-09, B-13 pass; F-02 Lead Owner condition never matches (candidate bug); E-04 email sent, inbox to confirm. The 70-min B-13 watch was stopped by low memory at +25 min; a one-shot check after the due time found the escalation notification |
| 2026-10-21 | A-13, G-05, J-04, A-10, A-17 + blocker re-check | 3 | 1 | A-13/G-05/J-04 pass; A-17 suspended member still assigned (candidate B-17); A-10 inconclusive; web form still 404, API channel still manual, Deals conversion target has no mappings |
