# Desk Blueprint (with SLA tie-in) — feature map

App: TAVI Desk staging `https://staging-desk.taviportal.com`, **org Anyware** (tenant `a7a7a7a7-0000-0000-0000-000000000002`), owner `anyware-staging-owner@anyware.software`.
Reference: Zoho Desk Blueprint (Enterprise trial). Spec: `docs/desk-blueprint/spec-desk-blueprint.md`. Gap item NDC-2754; bugs NDC-2753, NDC-2755, NDC-2756, NDC-2757.

## How to run
```
./mvnw test -Dtest='BlueprintRunTest,BlueprintAdminTest,BlueprintTimerTest,BlueprintUiBugTest' -Dheadless=true
./mvnw test -Dtags=NDC-2755            # one bug (UI)
./mvnw test -Dtest=BlueprintTimerTest  # slow, ~4 min, run alone
```
- API tests need no browser: `DeskBlueprintApi` signs in once per JVM via `POST /iam/auth/login` with `x-tenant-id`, password from the gitignored `automation/.auth/extra-credentials.csv` (row host `staging-desk.taviportal.com`). 429 stops everything.
- UI tests (`BlueprintUiBugTest`) switch the account in a static block: `credentials.file=.auth/extra-credentials.csv`, `credentials.account=anyware-staging-owner@…`, `auth.org=Anyware` (org picker). Saved session `.auth/staging-desk…_anyware-staging-owner….json`.
- Everything is created in department **QA WF Dept R** (`9a7e391c-be72-49e4-a1cf-763e5c88e23d`), names/subjects start `QA BP `, entry criterion `subject contains "QA BP "`. Admin tests clean up after each test; others after the class. `leftovers.js`-style check: list blueprints/tickets starting `QA BP `.

## API (under /api/v1, x-app-key desk, x-tenant-id)
| Method | Path | Notes |
|---|---|---|
| GET/POST | /modules/{tickets}/blueprints[?includeInactive=true] | body `{definition, isActive}`; 201 |
| GET/PUT/DELETE | /modules/{tickets}/blueprints/{id} | DELETE 409 `BLUEPRINT_IN_PROGRESS` while tickets inside; **GET returns the draft while hasDraft** |
| PUT | …/{id}/draft · POST …/{id}/publish | drafts are not live until publish (checked through a ticket) |
| GET | …/{id}/versions · POST …/versions/{number}/restore | restore takes the version **number** |
| PATCH | …/blueprints/sort | `{department_id, items:[{id, sort_order}]}` |
| POST | /desk/blueprints/{id}/include | `{state_id, ticket_ids}` |
| POST | /desk/blueprints/{id}/revoke | `{ticket_ids:null, after:null}` = all |
| GET | /modules/{tickets}/records/{id}/blueprint-state | states[0]: blueprintDefinitionId, activeStates, enteredAt, warning_due_at, escalation_due_at |
| GET | …/records/{id}/blueprint-transitions | runnable transitions (`transitionName`) |
| POST | /desk/tickets/{id}/blueprint-transitions/{tid} | body `{run_id (uuid, required), expected_state_id, fields:{name:value}, checklist:{id:true}, reply, comment:{content,is_public}, attachment_ids, resolution:{content,notify_contact}}` |
| POST | /desk/tickets/{id}/blueprint/revoke · /desk/tickets/bulk/blueprint-revoke `{ticket_ids}` | |
| POST | /modules/{tickets}/records | ticket: `data:[{field,value:{kind,value}}]`, needs **status**; department field is **`department`** (not department_id) |

## Definition shape (what the designer saves)
`{name, description, moduleKey:"desk_tickets", targetField:"status", departmentId, entryCriteria:{op:"contains"|"eq",field,value}, states:[{id,name,position,slaClock,slaMinutes,slaPreExpiryMinutes,slaPreExpiryEscalation[],slaEscalation[],autoTransitionId,autoTransitionAfterMinutes,isTerminal}], transitions:[{id,name,fromStateId,toStateId,isCommon,before,during:{checklist,deskItems,requiredFields},after:{actions}}]}`.
Action `setField {kind,field,value}` works for after-actions, warning and time-limit actions.

## Traps
- Staging: the designer and the ticket page sometimes hang on first load (skeleton / spinner); one reload fixes it (built into openBlueprint/openTicket).
- The step button (transition name) sits in the ticket header strip next to the "Steps: <blueprint>, <state>" chip; the Steps card shows the target status ("Next step Escalated").
- Business-clock due times are first returned with `provisional: true` (calendar placeholder) and recalculated ~25 s later; compare only `provisional: false` values.
- Default business hours: custom hours that conflict with agent shifts are refused (`business_hours.would_invalidate_shifts`); 24_5 needs `timing_mode: "same"` and `hours`. Departments have no business-hours profile of their own.
- Statuses = Status field `allowed_values`; Add State is `POST /desk/blueprints/states {name,type}`; remove via `PUT /modules/{tickets}/fields/{id}` with `{fieldName, labels, datatypeKey, datatypeOptions:{allowed_values}, required, unique}`. `PUT /desk/ticket-statuses` only saves settings (does not delete).
- **Never open two browser contexts from one saved session**: both refresh the same refresh token and the server revokes every session of the owner (1 Nov 23:49). One context per sign-in; save `storageState` back after use. Sharing the API token pair with a browser also revokes both.
- Transition criteria live in `before.visibilityCriteria` (`{op, field, value}`); `before.criteria` is silently ignored.
- Workflow rule criteria: `{kind:"StringMatch", field, operator, stringValue, caseInsensitive}` (not `value:{…}`).
- Department change: record PATCH is refused (OWNERSHIP_MANAGED_BY_DESK); use POST /desk/tickets/{id}/move `{department_id, owner_id, team_id}`.
- States must be existing ticket statuses (5 on this tenant). The owner is not an agent of QA WF Dept R: `owner` = owner account → 422 OWNER_NOT_ELIGIBLE.
- Criteria in another shape (e.g. workflow `{kind:"StringMatch",…}`) is **accepted** and behaves as "all tickets" (finding BP-N2).
- `x-tenant-id` header is ignored when a token is sent (token's tenant wins) — not a leak.
- React Flow: select a canvas node with a real mouse click (Actions), not a JS click.
- "Close ticket" on a ticket in a blueprint opens a confirm dialog, then the server refuses: "The blueprint "…" controls this ticket's status. Use one of its transitions."
- Teammates use org Anyware too (Demo blueprints, "Test Blueprint", "Test Tickets From Mail & Webform" catches every techSupport ticket). Never create tickets in techSupport.
- Git Bash: `MSYS_NO_PATHCONV=1` for `/modules/...` args to node scripts.

## Test inventory (Phase 1, owner only)
| Class | Cases |
|---|---|
| BlueprintRunTest | I1, I2, J2, J3/E3/E6/E8, J7, J8/H5, E5/F1/I13, J13/C17, J4/L4/I10, J9b, N2a |
| BlueprintAdminTest | A10/A3, A9, C2, C13, C15, C16, N2/C6, H1/H2/H4, H7, B9/C19/B8, I7, I5/B7, I8, I11/I12, I6 |
| BlueprintTimerTest | K1, K2, K6, K7, K10, K11, G2, G5, G8 |
| BlueprintUiBugTest | NDC-2755 (G11), NDC-2756 (G7), NDC-2757 (J6) |
| BlueprintPhase2ApiTest | C3, C4, C14, G3, G4, G5, G9, D9/D10, E7, E11, E13, F8/F4/F10 (+F3/F6 inconclusive), F9, L1, L3, L7, K14/K15/K17, N2, N4, N9 |
| UI rows (Playwright, executions/execu_2026-11-01_desk-blueprint/scripts) | ui-p2.js, ui-p3.js, ui-chrome.js: C1, C7, C16, C21–C23, G1–G3, G10, E1, E9, E10, E4/NDC-2753, E13/N1, N5–N7, N11 — not yet ported to Java |

## Run history
| Date | Scope | Result |
|---|---|---|
| 1 Nov 2026 | Phase 1 (owner only), 30 tests / 81 spec rows | 26 passed, 4 failed: new finding BP-N2 = NDC-2758 (unknown criteria shape = catch-all), NDC-2755 (hidden, not lost), NDC-2756, NDC-2757 (refused after confirm). First combined run had 10 network-error results, re-run clean. Report: executions/execu_2026-11-01_desk-blueprint/report.md |
| 1–2 Nov 2026 | Phase 2 owner only: 20 API tests + UI scripts | API 15 pass, 4 fail (BP-P2-1..4, filed 2 Nov as NDC-2761..2764), 1 inconclusive (F3/F6); UI rows pass; NDC-2753 still fails ("File … does not belong to you."). Report section "Phase 2" |
| 2 Nov 2026 | Filed NDC-2761..2764 (fresh repro: all can go live with silent timer failure); K16 both-overdue | K16 pass (scripts/k16.js; SLA policy targets accept unit "minutes") |
| 2 Nov 2026 | Phase 3 (approved tenant changes): business hours, holiday, Add State, status removal, big blueprint; screen tests ported (BlueprintScreenTest) | K16, K9, C9–C11, C20 (with ticket), N8 API pass; NDC-2774 (weekend counted, blueprint + SLA) and NDC-2775 (removed status) filed; BlueprintScreenTest 5/10 pass, 5 test fixes pending |
| 2 Nov 2026 | BlueprintScreenTest fixes (5 tests): designer + ticket page reload when the first load hangs; Tidy = "Tidy layout"; time limit = placeholder "No limit"; openState falls back to label press/release and focus+Enter; step-button wait; SLA card poll | statePanels, undoTidyAndLeave, phoneWidth, ticketFormOrder, bothOverdue all PASS (other 5 not re-run after the change). NDC-2780 filed (C3 name rules vs Zoho) |

## Open bugs
| Bug | Test | Last result |
|---|---|---|
| NDC-2755 | BlueprintUiBugTest.autoCloseVisibleAndKept | fails: panel hides the auto-close; Save + Publish keeps it |
| NDC-2756 | BlueprintUiBugTest.exampleUsesTenantHours | fails |
| NDC-2757 | BlueprintUiBugTest.noCloseButtonInBlueprint | fails: button + confirm dialog, then server refuses |
| NDC-2761 (BP-P2-1) G3 | BlueprintPhase2ApiTest.warningMustComeBeforeLimit | fails: warn ≥ limit / no limit saved by API |
| NDC-2762 (BP-P2-2) G4 | BlueprintPhase2ApiTest.limitValues | fails: slaMinutes -1 saved |
| NDC-2763 (BP-P2-3) G5 | BlueprintPhase2ApiTest.autoMoveRules | fails: auto-move to a transition from another state saved |
| NDC-2764 (BP-P2-4) L3 | BlueprintPhase2ApiTest.workflowCannotSetStatus | fails: workflow sets Status Closed, ticket leaves the blueprint |
| NDC-2753 | ui-p3.js (E4) | fails: run with attachment → 422 "File … does not belong to you." |
| NDC-2758 (BP-N2) | BlueprintAdminTest.badCriteriaShapeRefused | fails: 201 + catch-all |
