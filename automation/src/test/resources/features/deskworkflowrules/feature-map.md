# Desk Workflow Rules — feature map

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI Desk — automation runs on `https://staging-desk.taviportal.com` since 12 Oct 2026 (manual retests used `desk.anyware.software`; same module ids) · Reference product: Zoho Desk · Created 2026-10-11
> Deeper docs: `docs/desk-workflow-rules/` (missing list, reference/tavi-build-map.md, zoho-docs-inventory.md, evidence/).

## Where it lives
| What | Path / id |
|---|---|
| Rules list | `/settings/automation/workflow-rules` |
| New rule (editor) | `/settings/automation/workflow-rules/new?moduleId=<id>` |
| Saved rule | `/settings/automation/workflow-rules/<ruleId>` (`?test=1` = Test Rule) |
| Saved actions library | `/settings/automation/actions` |
| Execution History | `/settings/workflow-executions` (no menu link) |
| Desk roles | `/settings/roles` |
| Tickets module id | `88e8ea44-1658-4df3-9930-d0902b91073d` |
| Ticket view | `/views/all/tickets/<recordId>` |

## Pages and page objects
| Page object | Covers | Key elements |
|---|---|---|
| `WorkflowRulesListPage` | list, "Create in another module" › Ticket | heading, newRuleButton, ruleRow{0}, createInAnotherModule |
| `RuleEditorPage` | WHEN / CONDITION / ACTION canvas, save | whenCard, executeBasedOnGroup, triggerButton{0}, actionType{0}, fieldUpdateValue{0}, saveAndActivateButton, toasts |
| `TicketFormPage` | new-ticket form (only to fire rules) | contactEmail, subject, description, selectButton{n}, saveButton |
| `ExecutionHistoryPage` | execution log | rows |

## Flows (as the UI really behaves)
1. **New rule:** clear `workflow-rule-draft-*` from localStorage → open the new-rule URL → if "Resume your draft?" shows, click **Start fresh** → wait for the card "This rule will be executed…".
2. **Name / layout:** Layout button → option "Standard"; pencil "Edit rule name" → textbox → Enter.
3. **WHEN:** click the "This rule will be executed" card → group "Execute based on" → button Create / Edit / Create or Edit / Delete / Field Changed (Field Changed adds a single-select "Watch field") or text "A Date-Time field" → **Done**.
4. **CONDITION:** "Edit conditions" → radio "Tickets matching certain conditions" → "— select field —" → option → "Operator" → option ("is one of") → value chips (high, urgent) → Done.
5. **ACTION:** "Add action" → card whose title starts with the type (Field Update, Owner Assignment, Webhook, Email, Task, Create Record, Add Tags, Remove Tags, Send happiness email) → Field Update: "Add field" → "— select field —" → field → value box in the row that has "Remove <field>".
6. **Save:** "Save & Activate" → toast (`[data-sonner-toast]`); success moves the URL to `/workflow-rules/<uuid>`.
7. **Ticket to fire rules:** rules list → "Create in another module" → menuitem Ticket → email `name@example.com` box, subject combobox (Escape after typing), Description, 2nd "Select" = Status (Open), then 2nd "Select" again = Priority (high) → Save → URL holds the ticket id.

## API (`/api/v1`, `Authorization: Bearer`, `x-app-key: desk`)
| Method | Path | Used for |
|---|---|---|
| GET | /workflow/rules?take=100 | find QA rules for cleanup |
| POST | /workflow/rules/{id}/deactivate | cleanup |
| GET | /modules/{moduleId}/records/{id} | read ticket fields after a rule ran (`data.data[] = {field, value}`) |
| GET | /workflow/executions?recordId= | which rules ran |
| POST / PATCH / DELETE | /workflow/rules[/{id}] | build QA rules (`Rules` builder = the editor's body shape) |
| POST | /workflow/rules/{id}/activate · /deactivate | pause / restore teammates' rules; activate on an active rule → 409 "Rule is already active." |
| PUT | /workflow/rules/reorder | `{moduleId, orderedRuleIds}` |
| POST | /workflow/rules/evaluate · /{id}/execute | Test rule (dry run) |
| GET / POST / PATCH / DELETE | /workflow/actions[/{id}] · /{id}/usage | saved actions; body `{moduleId, name, description, isActive, action:{type, order, …}}` |
| POST | /modules/{tickets}/records | create a QA ticket: `{data:[{field, value:{kind:"string", value}}], layout_id}`. **Needs `status`** (no status → 422 "Status is required."); `kind` must come first in every value (else 500, see Traps). QA tickets use `department` = Tech |
| PATCH / DELETE | /modules/{tickets}/records/{id} | edit (fires Edit rules) / delete (Recycle Bin) |
| GET / POST | /desk/tags · body `{department_id, name}` | tags are per department; ticket field `tags` = array of tag ids |

Workflow value shape (rules) differs from record value shape: rules use `{kind:"string", stringValue}`, `{kind:"int", intValue}`, `{kind:"timestamp", timestampValue}`; records use `{kind:"string", value}`.

Token: verified 12 Oct 2026 on staging — `api.tokenScript` reads the cookie `aw_staging_access_token` (5-minute token, refreshed by the app); GET /workflow/rules with it + `x-app-key: desk` returns 200. Auth details: `features/login/feature-map.md`. `DeskWorkflowRulesApi.requireAuth()` still SKIPs a test before it creates data if the API is unusable.

## Traps and workarounds
- **Login is rate-limited (HTTP 429)** and every new login revokes the previous session (the owner account is shared with teammates). The framework logs in once and reuses `.auth/<account>.json`; never loop logins.
- 11 Oct 2026 (afternoon): both `ndc-staging-owner` entries in `TAVI DESK Credentials.txt` returned "Invalid email or password" — password probably changed. Confirm with the user before retrying.
- Host has slow/blank periods: wait on elements, not sleeps (page objects already do).
- Drafts: after "Discard" the editor still offers "Resume your draft?" → always clear `workflow-rule-draft-*` first.
- Desk host tenant has no departments → no tags; use Field Update as the observable action.
- The tenant has teammates' rules on Tickets — never edit or deactivate rules that don't start with "QA ".
- **API must work or the verdict is fake:** before 11 Oct 2026 the token was not configured. The record read returned 401, gave an empty map, and the NDC-2205 assertion passed falsely. Cleanup also failed without a message. `record()` now throws on non-200, and every test that creates rules (NDC-2205 and NDC-2206) calls `requireAuth()` first, so it is SKIPPED (never passed) when the API is unusable.
- NDC-2205 tests use an **On Create control rule** (Description = `QA control 2205 <n>`). If the control has not run within 45 s, the test SKIPs as inconclusive (engine down or slow), so a skip is not a pass.
- Field Changed › Watch field option "Subject" is assumed from the manual retest rule name "QA 2205 On Field Changed Subject" and is not confirmed in Selenium. If `option{Subject}` is BROKEN, look at the open listbox.
- Zoho Desk (reference) needs Edge with a normal user agent; content sits in the `ShowHomePage.do` iframe; read-only.
- **Teammates' rules are paused for execution tests** (user approved 12 Oct 2026): `pauseOtherRules()` deactivates every active non-"QA " Tickets rule and writes the ids to `target/paused-teammate-rules.txt`; each test's cleanup reactivates them. **After an aborted run, run `mvnw test -Dtest=WorkflowDiagTest#restorePausedRules`** and check "paused left: 0".
- QA data: rules / actions / tags / ticket subjects start with `QA WF `; every QA rule carries the guard condition `subject starts with "QA WF "`. QA tickets and tags live in the **Tech** department (`QA_DEPARTMENT_ID`); teammates test Assignment Rules in Customer Support. (The 500s seen there on 12 Oct were the `kind`-order bug, not the department.)
- **Access token expiry:** the 5-minute token cookie disappears when it expires and the app only refreshes while a page is active → API calls without a token (401 TOKEN_MISSING). `DeskWorkflowRulesApi.token()` reloads the page and re-reads the cookie, so long tests (webhook retries, scheduled actions) and cleanups keep working.
- Staging network: one "Connection timed out" to the API from Java on 12 Oct; curl worked a minute later. A restore whose answer got lost leaves the rule active → second activate says 409 "Rule is already active" (treated as restored).
- The old `TicketFormPage.create(...)` picks Status/Priority by the order of "Select" boxes; on 12 Oct the form layout changed and it opened Priority instead of Status. Tests now create tickets through the API.

- **`kind` must be the first JSON key (app bug, 12 Oct 2026):** any value object such as `{"value":"x","kind":"string"}` makes POST /records answer **500**, and the same body with `kind` first works. Java `Map.of` key order changes on every JVM start, so this looked like "random 500s on ticket create" (it also caused the earlier "no department → 500"). Always build `kind` objects with `Rules.kinded(...)`. WFR-API-T3 keeps the bug visible.
- **API calls can stall:** on 12 Oct a GET /workflow/rules sent a chunked reply that never finished and hung a run for 20 min. `ApiClient` now has connect 30 s / socket 90 s timeouts. `pauseOtherRules` writes the paused-ids file after each rule.
- Allure request attachments mask `Authorization` / `Cookie` (`[ BLACKLISTED ]`); before 12 Oct they held the bearer token, and old `target/allure-results` were deleted.
- Date-relative (Date-Time) rules accept only async actions (Webhook, Task, Email, Create Record): Field Update / Add Tags → 400 "A date-relative rule may only use actions that run asynchronously". Email actions need `emailSubject` and `emailBody`.
- "Permission denied: connect" from Java = local network blip (seen once on 12 Oct); rerun, then run `restorePausedRules`, which also purges QA rules, actions and tickets.
- **UI changes 14 Oct 2026:** a successful save returns to the rules list (not the rule page); the Date-Time trigger needs a "Date field" pick (`dateFieldButton`, aria-label Date field) and hides Field Update / Owner / Add Tags / Remove Tags; Field Changed pre-selects a watch field; Owner Assignment has Users / Roles (CEO, Manager) / Profiles (5 Desk profiles) / User Fields; rules list has a Departments column and filter.
- **Ticket tags:** the record create body does not save `tags`; put starting tags on with `POST /desk/tickets/{id}/tags {tag_ids}` (`api.addTicketTags`).
- **Flaky network to staging:** run in small batches with `bash target/run-batches.sh` (reads `target/batches.txt`, one -Dtest filter per line; waits for staging, restores paused rules, stops on sign-in failure).
- **Two UI builds:** on staging the WHEN panel is `<fieldset><legend>Execute based on</legend>` (no `role=group` div). `executeBasedOnGroup` and `triggerButton` carry candidates for both builds; the framework `role=group` strategy now also matches fieldset/legend.
- The WHEN panel is open by default on a new staging rule (the When card click still works).

## Test inventory
| Case | Test method | Groups (bugs) | Last result |
|---|---|---|---|
| WFR-001 | DeskWorkflowRulesSmokeTest.rulesListOpens | smoke, regression | PASSED 12 Oct 2026 (staging) |
| WFR-002 | DeskWorkflowRulesSmokeTest.editorOffersRecordTriggers | smoke, regression | PASSED 12 Oct 2026 (staging, after fieldset locators) |
| WFR-Z01 | WorkflowParityGapsTest.zohoTriggersOffered | parity, NDC-2203 | not run yet |
| WFR-Z06 | WorkflowParityGapsTest.watchFieldTakesSeveralFields | parity, NDC-2203 | not run yet |
| WFR-Z14 | WorkflowParityGapsTest.zohoActionsOffered | parity, NDC-2203 | not run yet |
| WFR-031 | WorkflowBugRetestTest.ownerAssignmentRolesAreDeskRoles | NDC-2204 | not run yet |
| WFR-012 | WorkflowBugRetestTest.onEditRuleDoesNotFireOnCreate | NDC-2205 | not run yet (rewritten 11 Oct 2026: control rule + API pre-check) |
| WFR-013 | WorkflowBugRetestTest.fieldChangedRuleDoesNotFireOnCreate | NDC-2205 | not run yet (added 11 Oct 2026) |
| WFR-020 | WorkflowBugRetestTest.dateTimeRuleCanBeSaved | NDC-2206 | not run yet (Date-Time sub-options unverified) |

## Open bugs covered
| Bug | Test | Status at last manual retest (11 Oct 2026) |
|---|---|---|
| NDC-2203 | WorkflowParityGapsTest.* | open — 5 triggers and 14 actions missing, Watch field single-select |
| NDC-2204 | ownerAssignmentRolesAreDeskRoles | fails — Roles shows CRM profiles |
| NDC-2205 | onEditRuleDoesNotFireOnCreate, fieldChangedRuleDoesNotFireOnCreate | fails — On Edit / Field Changed fire on create |
| NDC-2206 | dateTimeRuleCanBeSaved | fails — POST /workflow/rules 500 |

## Run history
| Date | Scope | Passed | Failed | Healed | Notes |
|---|---|---|---|---|---|
| 2026-10-11 | manual retest (playwright-cli) | — | 4 bugs still open | — | before automation; see executions/execu_2026-10-11_retest-ndc2203-2206 |
| 2026-10-11 | NDC-2205 retest prep (offline) | — | — | — | Added WFR-013 (Field Changed), control rule, API pre-check, token config. Compiled; selftest 4/4; dry run selects exactly 2 tests for -Dtags=NDC-2205. Live run not done yet. |
| 2026-10-12 | smoke WFR-001/002 on staging (read-only) | 2 | 0 | 0 | First automated live run. First attempt: session revoked mid-run (framework fixed: persist rotated tokens, keep cookie domain). Second: WFR-002 BROKEN executeBasedOnGroup = staging uses fieldset/legend; locators updated, both pass. Bug tests (NDC-2204/2205/2206) not run: user asked for read-only today. |
| 2026-10-12 | full regression run 1 (staging) | 2 | 11 | 0 | All ticket creates 500 → app bug: `kind` must be the first JSON key (WFR-API-T3). Login page then stopped rendering; 64 skipped. |
| 2026-10-12 | full regression run 2 (staging) | 19 | 20 | 0 | 39 skipped on staging network errors (read timeout / connection reset / token cookie gone). NDC-2204, NDC-2206, NDC-2173 and NDC-2205 (Field Changed) look fixed; Z9 built; the other Z gaps are still missing. Possible bugs: M1, K2; I26 to confirm. Report: executions/execu_2026-10-12_desk-workflow-rules/report.md. Save locator fixed (new rule only has Save & Activate); WFR-031 data = staging Desk roles. |
| 2026-10-13 | rerun of the 39 skipped, in batches of 5 then 2 (`target/run-batches.sh`) | 37 | 5 | 0 | All 39 ran. Bugs: B-1 kind order (API-T3), F7 created_by Field Update accepted, K2, I14 404 shown as cancelled, F3 picker offers used types. NDC-2205 fixed (H3+H4). I26 cleared (tags go through POST /desk/tickets/{id}/tags; the create body ignores tags). J7 inconclusive (no dispatch row). Network drops forced batching. Rule editor now shows "Departments … Change" (Z8 partly built). |
| 2026-10-14 | the 9 cases left from 12 Oct + fixes, batches of 2–3 | 10 | 2 | 0 | Every automated case has now run. Final: 62 pass, 7 bugs (B-1…B-7, incl. B-6 no Execution History menu link, B-7 cancelled scheduled action has no dispatch row), 12 Zoho gaps. NDC-2204/2205/2206/2173 look fixed. Z8 built. WFR-012/013 retired from regression (old ticket form; H3/H4 cover them). |
| 2026-10-14 | H/I/J remaining cases (`WorkflowHijTest`), batches of 1–5 | 20 | 2 | 0 | New bugs B-8 (Create Record skips required fields, no owner) and B-9 (owner by role round robin assigns nobody). Emails / happiness skipped by request. H13, H16, I3, I4, I9, I10, J5, J6 wait for the user's OK (shared settings). No macros on staging; Tickets have 1 layout and no date-only or address field. Roles = /iam/org-units (desk CEO, Manager); users list /iam/users has orgUnitId. Tasks made by rules go when their ticket is deleted. |
| 2026-10-14 | H13, I3, I4 on a temporary QA layout (user rule: field / layout changes only on a separate QA layout) | 3 | 0 | 0 | `WorkflowDiagTest#qaLayoutSetup` / `#qaLayoutTeardown` (group qa-layout): Standard saved to target/standard-layout-baseline.json and compared after every step (never changed). Layout created with `assignedProfiles: []` — the app's clone flow copies profiles, never do that. Date-only Field Update value = timestamp "YYYY-MM-DDT00:00:00", stored as the date; address part key = `<field>.city`; record address value = {kind:object, properties:{street,city,…}}. |
