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
