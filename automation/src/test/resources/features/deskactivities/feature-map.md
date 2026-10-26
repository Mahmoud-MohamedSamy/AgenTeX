# Desk Activity Life Cycle — feature map

> Read before testing; update after every run.
> App: TAVI Desk `https://staging-desk.taviportal.com` · Reference: Zoho Desk Activities · Created 2026-10-26
> Docs: `docs/desk-activity-lifecycle/` (spec, missing list, reference/tavi-build-map.md, zoho-docs-inventory.md). Manual run: `executions/execu_2026-10-26_desk-activities-replies/`.

## Where it lives
| What | Path / id |
|---|---|
| Activities list | `/activities` (sub-nav All Activities, Tasks, Calls, Events) |
| Kind lists | `/modules/{moduleId}` (view picker → "All views ›" submenu holds the 18 views) |
| Detail | `/modules/{moduleId}/records/{id}` |
| Calendar | `/calendar` |
| Tasks / Calls / Events / Tickets | `d120a6c2-…` / `f7e488b5-…` / `6fb19115-…` / `88e8ea44-…` (DeskActivitiesFeature) |
| Customer Support dept | `7e1ac409-58b0-41ab-97e1-0e7d5c8c5158` |

## Accounts
- Agent `fedelav803@meinvr.com` (Desk Agent, Customer Support) — API via `AppUser` (credentials: Edge Passwords + `.auth/extra-credentials.csv`), browser via `-Dcredentials.file=.auth/extra-credentials.csv -Dcredentials.account=fedelav803@meinvr.com`.
- Admin `mahmoud.mmohamedsamy@gmail.com` (HR / Marketing / Sales) for cross-department rows. Never sign in as the shared owner.

## API
| Method | Path | Notes |
|---|---|---|
| POST/GET/PATCH/DELETE | `/modules/{mid}/records[/{id}]` | body `{data:[{field, value:{kind,value}}]}` — `kind` FIRST (`DeskActivitiesApi.body`) |
| GET | `/modules/{mid}/records?page&per_page&sort_by&sort_dir&filters=[…]` | list |
| GET/POST/DELETE | `/desk/activities/{id}/reminders[/{rid}]` | `{timing: at|before|custom, offset_value, offset_unit, custom_at, channels:[popup,email]}`; max 5 |
| GET | `/desk/activities/reminders/options` | popup/email true, sms false |
| GET/POST | `/desk/activities/{id}/comments` | activity comments |
| GET | `/desk/activity-views` | custom views |

Statuses: task `Not Started…Completed` (labels), call_status `scheduled|in_progress|completed|missed|cancelled`, event status `scheduled|deferred|completed|cancelled`, priority `highest…lowest`.

## Tests
| Class | Case | Groups | Last result (26 Oct, new build) |
|---|---|---|---|
| ActivityApiTest.noTokenIs401 | ACT-A7 | smoke | pass |
| .picklistsAreValidated | ACT-C11 | regression | pass |
| .requiredAndDates | ACT-C7/C10/C12 | regression | pass |
| .subjectLimits | ACT-C4 | regression | pass (max 255) |
| .newTaskGetsDefaultStatus | ACT-C1 | bug A-B2 (NDC-2638) | FAIL (status null) |
| .completedTimeSetByServer | ACT-D8 | bug A-B5 (NDC-2641) | FAIL |
| .completedTimeIsReadOnly | ACT-M2 | bug A-B5 (NDC-2641) | FAIL |
| .callDurationValidated | ACT-C8 | bug A-B6 (NDC-2642) | FAIL |
| .completedCallReadOnlyInApi | ACT-E8 | bug A-B4 (NDC-2640) | FAIL |
| .reminderRules | ACT-G1..G9 | regression | pass |
| .deleteTask | ACT-L1 | regression | pass |
| .activityOfHiddenTicketIsHidden | ACT-A3 | possible-bug A-B8 | FAIL |
| .ticketCountsActivities | ACT-H7 | gap | FAIL (gap Z4) |
| ActivityUiTest.completeAndReopenTask | ACT-D2/D4 | smoke | pass |
| .rescheduleWithMissedLog | ACT-E6 | bug A-B1 (NDC-2637) | FAIL |
| .rescheduleWithoutLog | ACT-E6c | regression | pass |
| .priorityLabel | ACT-D10 | bug A-B3 (NDC-2639) | FAIL ("highest") |

Run: `mvnw test -Dsuite=desk-activities-replies-api` (no browser) · `mvnw test -Dsuite=desk-activities-replies-ui -Dbase.url=https://staging-desk.taviportal.com -Dcredentials.file=.auth/extra-credentials.csv -Dcredentials.account=fedelav803@meinvr.com`

## Traps
- The add-activity drawer fields have no labels: subject = placeholder "Type or pick a subject"; the rest are unnamed buttons.
- The reminder editor is inline on the detail page (not a dialog); its radios are unlabelled (values at / before / custom).
- Toasts: Selenium cannot read the sonner toast text (empty even via a document query); verdicts never depend on it — read the record instead.
- New build (index-7qe5X0Gd.js) added `data-testid` (desk-reschedule-start, desk-reschedule-log-missed, desk-activity-priority …) — now the first locator candidates.
- The Desk Agent cannot delete tickets (403): QA tickets created by tests stay; activities delete fine.
- Two playwright/Java runs on the same machine ran it out of memory once (JVM hs_err) — close idle browser sessions first.
- A concurrent build in `automation/` once removed classes mid-run (NoClassDefFoundError) — just rerun.

## Run history
| Date | Scope | Result |
|---|---|---|
| 2026-10-26 | API 13 + UI 4 (first run) | API: 7 pass, 6 bug/gap fail as expected · UI: 2 pass, 2 bug fail |
