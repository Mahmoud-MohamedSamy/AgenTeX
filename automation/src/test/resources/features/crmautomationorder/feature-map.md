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

Bug → test map (19 Oct): B-01 D-21/H-03 · B-02 H-02 · B-03 G-07 · B-04 F-03 · B-05 F-01 · B-06 G-04 · B-07 A-04 · B-08 C-12 · B-09 E-13 · B-10 G-16 · B-11 C-14 (VerifyV2.c14Limits) · B-12 C-11/H-05/C-15 (VerifyV5.c11FieldUpdateDelay) · B-13 H-05 (VerifyV5.h05WebhookAfterConvert) · B-14 F-20 · B-15 E-09. Test defects to fix in the Group tests: D-05 (read approval_status, not the old instance state), E-15/J-01/E2E-5 (blueprint on Tasks Priority), E-18 (sort body), C-11/H-05/C-15 (use delayed webhook), list sort (`sort_dir`), C-09/A-08/D-17/K-09 expectations.

## Run history
| Date | Scope | Passed | Failed | Notes |
|---|---|---|---|---|
| 2026-10-18 | S0 harness | 3 | 0 | per-session QA layouts created and deleted (204) |
| 2026-10-18 | Run 1, all groups | 71 | 35 | 81 inconclusive — HTTP 429 sign-in storm (6 JVMs) |
| 2026-10-18 | Run 2, suite crm-order | 117 | 37 | 33 inconclusive |
| 2026-10-18 | Run 2 + 3 final | 129 | 35 | 20 inconclusive, 3 not run |
| 2026-10-19 | Re-verification crm-verify + crm-verify2 + G-13 | – | – | 15 confirmed bugs, 6 not a bug, 5 test defects, 1 inconclusive (H-04), 8 gaps (NDC-2294); final GET check: 0 QA AEO leftovers |
