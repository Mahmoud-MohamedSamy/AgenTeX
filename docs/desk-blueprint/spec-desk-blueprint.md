# Spec — Desk Blueprint (with SLA tie-in)

| | |
|---|---|
| App | TAVI Desk, `https://staging-desk.taviportal.com`, org **Anyware** |
| Feature | Setup → Automation → Blueprints, tickets inside a blueprint, state time limits next to the department SLA |
| PRD | NDC-1974 (two lines, no requirements) |
| Gap list | [`desk-blueprint-missing-list.md`](desk-blueprint-missing-list.md) (15 items → Group Z) |
| Reference | `reference/tavi-build-map.md`, `reference/zoho-docs-inventory.md`, baseline `reference/tavi-baseline-2026-11-01.json` |
| Common lenses | `Suit 1/_COMMON.md` (lenses, D1–D20 data classes) where present; otherwise the data classes in §2.4 |
| Status | Written 1 Nov 2026. Run 1–2 Nov 2026 (Phases 1–3): results in `executions/execu_2026-11-01_desk-blueprint/report.md` and `run-report.html`; open rows in §1.4 and "Run status" below. Updated 2 Nov 2026 |

Tags: `[func]` `[ui]` `[ux]` `[api]` `[sec]` 🔒 (needs a lower-permission user) `[data]` (data-class sweep) `[conc]` `[serial]` (writes tenant-wide config or runs tickets through a blueprint) `[perf]` (exclusive) `[i18n]` `[a11y]` `[compat]` `[reg NDC-x]` (regression of a filed bug) `[zoho]` (check live Zoho Desk read-only and compare; user request 2 Nov 2026).

---

## Feature inventory

### Built in Desk (found 1 Nov 2026)
- Blueprints list, grouped by department:
  - Order, activate / deactivate, include tickets, revoke tickets, delete (Recycle Bin; refused while tickets are inside).
  - In-progress count and Draft badge.
- Designer:
  - Details: name, description, layout, criteria, Continuous.
  - Canvas: states from ticket statuses, Add State (creates a status), common transitions, parallel steps and branches, 16 connections per state.
  - Undo / redo / tidy layout, Save Draft, Save and Publish, publish checks, Versions with restore.
- Transition:
  - Before: agents, teams, ticket owner, another department with an access level, criteria.
  - During: reply, comment, attachment, resolution, fields, checklist, message, each required or optional and ordered.
  - After: field update, notification, task, webhook, Desk email, custom action.
- State:
  - Ends the blueprint.
  - Time limit (hours), warning before, business or calendar clock.
  - Actions at the warning and when the limit runs out, and an auto-move when it runs out.
  - Run a transition on customer reply or rating.
- Ticket:
  - Pill, progress bar, Steps card (time in state, due, overdue, warning, next step).
  - Transition form, Status locked, reply does not close.
  - Revoke one ticket or many (bulk), history events.
- API: listed in §2.1.

### Missing in Desk (Group Z)
Items 1–15 of the missing list → Z1–Z15.

### Not a gap
- Clone a blueprint.
- Roles as owners.
- Department change as an action.
- Edition caps.
- Webhook and notification after-actions (these are Desk extras).

### Not yet confirmed (decide in the run)
- Whether the department SLA pauses in an On Hold-type blueprint state, and whether the state timer pauses too (K14, K15).
- What happens to tickets inside when a state or transition is removed in a new published version (H9, H10).
- Whether a workflow rule or the API can change Status while the ticket is in a blueprint (L3, L4).
- Whether criteria are checked again on edit, or only at entry (I4).

---

## 0 How to run

1. **Order:** §1 preconditions → A → B (read) → C–G (designer rows that end with Cancel) → H → B-write → I → J → K → L → M → N → E2E → Z. Take the baseline (§1.3) before A and diff it after the last group.
2. **Serial only:** everything that saves, publishes, activates, orders, includes or revokes a blueprint, and every I, J, K, L row.
   - Blueprint order and criteria are department-wide: a QA blueprint catches every new ticket in its department.
   - Run only in the QA department (§1.2), never two writers at once, and agree a quiet window with the team.
3. **Parallel allowed:** A (reads), B reads, C–G rows that end with Cancel / close the panel, M reads, every API GET row.
4. **Exclusive:** `[perf]` rows run alone.
5. **`[data]` rows** record:
   - the input (exact bytes for odd input);
   - what the UI showed;
   - what the API stored (GET after save);
   - pass or fail per row.
6. **Tickets:** create QA tickets by API or New Ticket in the QA department, subject prefix `QA BP `. Record id, number, layout, created time and which blueprint and state they entered (`GET …/records/{id}/blueprint-state`).
7. **Timers:** use a short time limit (for example 0.05 h = 3 min, if accepted; otherwise 1 h). Give the server up to 2 minutes past each due time, and poll `blueprint-state` instead of sleeping blindly.
8. **Sessions:**
   - One sign-in per account per run; a new sign-in may revoke the old token.
   - Stop on HTTP 429 and do not retry in a loop.
   - Never print credential files; report token **lengths** only.
9. **Tools:** Edge (`channel: 'msedge'`). In Git Bash set `MSYS_NO_PATHCONV=1` for `/desk/...` paths. The owner account opens an org picker: choose **Anyware**, not the Sandbox.
10. **Verdicts:** Pass, Fail, Blocked, Inconclusive. A row blocked by §1.4 is **Inconclusive, not Fail**.
11. **Evidence:** screenshots only for **failed** rows, each side by side with Zoho where Zoho has the behaviour. Passed rows get one line of text.

---

## 1 Preconditions

### 1.1 Accounts
| Role | Account | Use |
|---|---|---|
| Tenant owner (admin) | `anyware-staging-owner@anyware.software`, org Anyware (password from the user, not stored in the repo) | All write rows |
| Agents (2 Nov 2026) | Org **NDC-Staging** (tenant `a7a7a7a7-0000-0000-0000-000000000004`), accounts in `docs/Credentials/TAVI Desk Credentials.csv` (gitignored; never print it). Owner `ndc-staging-owner@anyware.software` (agent of all departments) | Agent rows run there, in department **Customer Support** |
| Agent A | `fedelav803@meinvr.com` — Desk Agent, Customer Support | Plain agent: transition owner, J rows, F3/F6 receiver |
| Agent B | `kinase5517@meinvr.com` — Desk Administrator, Customer Support | Second member / team owner |
| Agent C (another department) | `pacox68754@meinvr.com` or `mahmoud.mohamed2@taviportal.com` — Desk Supervisor, Tech | Cross-department owner and share rows (D6–D8, J9) |
| Lower-profile user 🔒 | Agent A (Desk Agent profile; check it lacks `desk:blueprints:manage`) | A rows |
| Other tenant user | any throwaway tenant | A9 |
| Zoho Desk reference | `hmohammed@anyware.software` (trial org `techsolutionsegypt`), Edge, normal user agent, **read only** | Side-by-side evidence for failed rows |

### 1.2 Test data
- Prefix every blueprint, status, team, template, task and ticket subject with **`QA BP `**.
- Department: **QA WF Dept R** (`9a7e391c-be72-49e4-a1cf-763e5c88e23d`), the QA-named department. Confirm with the user first that no one else uses it. Agents A and B must be members.
- Tickets module `e8e5e302-3873-4e32-b945-c9cd25c7659d`.
- Every QA blueprint gets the entry criterion **`Subject starts with "QA BP "`**, so it never catches other people's tickets.
- Status values:
  - Use the existing Open, On Hold, Escalated and Closed.
  - Rows that create a status use `QA BP Verify` (Open type) and `QA BP Done` (Closed type).
  - Statuses created by Add State stay in the ticket Status field (see §1.5).
- Email template: one Desk template `QA BP template`.
- Custom action: one active Desk custom action that is safe to run. **Ask the user**: the existing 13 call the NDC flight API.
- Webhook receiver: an HTTPS endpoint that logs the request. **Ask before using a public service.** Without one, F5 and K-webhook rows are Inconclusive.

### 1.3 Baseline (restore point)
Saved 1 Nov 2026 in `reference/tavi-baseline-2026-11-01.json`. Refresh it into the run folder before A:
- `GET /modules/{tickets}/blueprints?includeInactive=true`: 4 blueprints.
  - Demo · Refund approval (techSupport, active, 2 in progress)
  - Demo · Hardware RMA (Call Center, active, 2 in progress)
  - Demo · Onboarding (inactive)
  - Test Blueprint (Tech, inactive)
- `GET …/blueprints/{id}/versions` for each.
- `GET /desk/ticket-statuses`, `/desk/departments`, `/desk/sla/policies`, `/desk/business-hours`.
- `blueprint-state` of the Demo tickets in progress (#804, #805, gfd103, gfd104).

**Revert:**
- Revoke and delete every `QA BP` blueprint, then purge it from the Recycle Bin.
- Delete QA tickets, tasks and statuses (if a status cannot be deleted, record it).
- Put the order of the department's blueprints back.
- Prove it with the final diff (Reporting).

### 1.4 Environment blockers
| Blocker | Rows | Action |
|---|---|---|
| Business hours are 24×7. **Resolved 2 Nov (user OK):** Default can be switched briefly to 24 hours Mon–Fri (`preset 24_5`, `timing_mode same`, `hours 00:00–23:59`) and restored; custom hours that clash with agent shifts are refused (`business_hours.would_invalidate_shifts`). Departments have no business-hours profile of their own. Holidays go on the default list (`/desk/holiday-lists/{id}/holidays`) | G6, G7, K8, K9, Z12 | Run, restore and verify field by field. Compare only settled due times (`provisional: false`, ~25 s after entry) |
| Agent accounts — **resolved 2 Nov**: available on NDC-Staging (§1.1), not on Anyware | A, D, E12, F3, F6, J9 | Run the agent rows on NDC-Staging, department Customer Support |
| Demo blueprints are active in techSupport and Call Center with tickets inside | I, L | Do not touch them. Work only in QA WF Dept R |
| No webhook receiver | F5, K12 | Inconclusive until a receiver is approved |
| No safe custom action | F7, K13 | Ask the user |
| Customer reply and rating need a real customer mailbox, and Customer Happiness switched on | K3, K4, K5 | Use a Gmail contact (anyware.software replies are untrusted); check Customer Happiness; else Inconclusive |
| No IM channel seen | N10, Z-IM note | Inconclusive |

### 1.5 Things that cannot be undone cleanly
- A status created by **Add State** (`POST /desk/blueprints/states {name, type}`) becomes a value of the ticket Status field (`datatypeOptions.allowed_values`). It can be removed with `PUT /modules/{tickets}/fields/{id}` `{fieldName, labels, datatypeKey, datatypeOptions:{allowed_values}, required, unique}`; refused while a ticket is in that state (FIELD_OPTION_IN_BLUEPRINT). `PUT /desk/ticket-statuses` only saves status settings and does not delete.
- Ticket numbers, ticket history lines ("Entered blueprint …") and audit entries stay.
- Emails, notifications and webhooks already sent cannot be recalled.
- A revoked ticket keeps the status it had. Its old timers do not come back.
- Published versions stay in the version list.

---

## 2 Surface and contract

### 2.1 API (under `/api/v1`, `Authorization: Bearer …`, `x-app-key: desk`). Envelope `{success, data, error:{code,message,details}, meta}`
| Method | Path | Body / notes |
|---|---|---|
| GET | /modules/{m}/blueprints?includeInactive=true | list |
| GET | /modules/{m}/blueprints/{id} | one, with `definition` |
| POST | /modules/{m}/blueprints | `{definition, isActive?}` (record the exact body the UI sends) |
| PUT | /modules/{m}/blueprints/{id} | full update |
| DELETE | /modules/{m}/blueprints/{id} | Recycle Bin; BLUEPRINT_IN_PROGRESS while tickets are inside |
| PATCH | /modules/{m}/blueprints/sort | order |
| PUT | …/{id}/draft · POST …/{id}/publish | draft, publish |
| GET | …/{id}/versions · …/versions/{v} · POST …/versions/{v}/restore | versions |
| POST | …/{id}/mass-include · …/mass-exclude | CRM-style membership (check whether Desk accepts it) |
| POST | /desk/blueprints/{id}/include | `{ticket_ids, state}`, record the body; result `{included, skipped, unknown}` |
| POST | /desk/blueprints/{id}/revoke | `{ticket_ids, after}`, paged; `{revoked, skipped, unknown}` |
| GET | /modules/{m}/records/{id}/blueprint-state | `states[{blueprintDefinitionId, activeStates, allStates, allTransitions, enteredAt, warning_due_at, escalation_due_at, auto_due_at}]` |
| GET | /modules/{m}/records/{id}/blueprint-transitions | transitions this user can run, with `during`, `after`, `desk_items` |
| POST | /modules/{m}/records/{id}/blueprint-transitions/{tid} · /desk/tickets/{id}/blueprint-transitions/{tid} | run (timeout 55 s in the client) |
| POST | /desk/tickets/{id}/blueprint/revoke · /desk/tickets/bulk/blueprint-revoke `{ticket_ids}` | revoke |
| GET | /desk/tickets/{id}/history · /desk/tickets/{id}/sla | results |

Error codes to see: TICKET_IN_BLUEPRINT, TICKET_NOT_IN_BLUEPRINT, BLUEPRINT_NOT_OWNER, BLUEPRINT_IN_PROGRESS, BLUEPRINT_STATE_OCCUPIED, FIELD_OPTION_IN_BLUEPRINT, BLUEPRINT_STATE_CHANGED, BLUEPRINT_RUN_INCOMPLETE; skip reasons TICKET_DEPARTMENT_MISMATCH, TICKET_MERGED, TICKET_SHARE_ACCESS_DENIED, TICKET_WRITE_FORBIDDEN, NOT_FOUND.

### 2.2 Field register (no client max length was found in the code; the server must set and enforce limits)
| Field | Kind | Known rule |
|---|---|---|
| Blueprint name | text, required | "The blueprint needs a name"; max length unknown → B/C `[data]` |
| Description | text | — |
| Department | pick (one) | required to govern tickets |
| Layout | pick | Any layout or one |
| Criteria | condition builder + pattern | — |
| State name (Add State) | text, required | clash: "{{name}} already exists as {{type}}" |
| State type | Open / On Hold / Closed | Closed = ends the blueprint (changeable) |
| Transition name | text, required | per from/to message |
| Time limit | number, hours | must be set when a warning is set |
| Warn before | number, hours | must be smaller than the limit |
| Auto-move wait | minutes ≥ 1 | "must wait at least 1 minute" |
| Connections per state | count | max 16 |
| Checklist item | text | — |
| Message | text | — |
| Webhook URL | URL | SSRF rules (NDC-2537) |

### 2.3 Page states and messages (en, verbatim from the build)
- List: "No blueprints in {{department}} yet", "Add a department before you create a blueprint.", "You don't have access to Blueprints" / "Ask an admin for the "Manage blueprints" permission.", "Couldn't load blueprints.", "{{count}} tickets in progress", "Tickets in progress not counted yet".
- Delete: "Delete {{name}}? It moves to the Recycle Bin."; "{{count}} tickets are in progress in {{name}}. Revoke them before deleting it."
- Designer: "{{count}} issues to fix before publishing", "A state can have up to 16 connections.", "{{count}} tickets are in {{state}}. Revoke them before removing it.", "Draw states and connectors on a larger screen. You can edit settings here."
- Ticket: "This ticket follows blueprint {{name}}. Use its transitions.", "You are not an owner of this transition.", "No transitions you can run", "Blueprint unavailable. Status is read-only until it loads", "Fill in the required items to run {{name}}", "{{transition}} ran. The ticket moved to {{state}}.", "Reply sent. The ticket stays open because it follows blueprint {{name}}. Use its transitions to close it."
- Revoke: "Take this ticket out of {{name}}? It keeps its status." / "Status becomes editable again and the step's timers stop."

### 2.4 Data classes (text fields)
Empty, spaces only, 1 char, 60 / 100 / 255 / 256 / 1000 chars, Arabic, mixed RTL/LTR, emoji, leading/trailing spaces, HTML `<b>x</b>`, script `<img src=x onerror=alert(1)>`, SQL-ish `' OR 1=1--`, `{{subject}}` / `${field}` tokens, a duplicate of an existing name, case-only duplicate.

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| A1 | Admin sees the page | Owner → Setup → Automation | "Blueprints" listed and opens | `[func]` |
| A2 | No permission, UI | 🔒 user opens the menu and `/settings/automation/blueprints`, `/…/{id}`, `/…/new` by URL | Menu item hidden; "You don't have access to Blueprints"; no blueprint data in network responses | `[sec]` `[ui]` 🔒 |
| A3 | No permission, API reads | 🔒 GET list, one, versions | 403, no data | `[api]` `[sec]` 🔒 |
| A4 | No permission, API writes | 🔒 POST / PUT / DELETE / sort / draft / publish / restore / include / revoke | 403 each; baseline unchanged | `[api]` `[sec]` 🔒 |
| A5 | Agents can still see the ticket's steps | 🔒 agent who is a transition owner opens a QA ticket in a blueprint | Steps card and their transitions shown, with no designer access | `[func]` 🔒 |
| A6 | Ticket revoke by a non-admin | Agent A: revoke from the ticket menu and by `POST /desk/tickets/{id}/blueprint/revoke` | Record who may revoke (only one permission exists → Z15). 2 Nov: Desk Agent → 403 "Missing required permission 'desk:ticket:blueprint_revoke'" | `[sec]` 🔒 |
| A7 | Run a transition as non-owner by API | Agent B (not owner) POSTs the transition | 403 BLUEPRINT_NOT_OWNER; ticket unchanged | `[api]` `[sec]` |
| A8 | Ticket you cannot see | Agent of another department GETs `blueprint-state` / runs a transition of a ticket not shared with them | 404 / 403, no data | `[api]` `[sec]` |
| A9 | Other tenant | Another tenant's token: GET a blueprint id, PUT it, run a transition | 404 / 403; nothing changed | `[api]` `[sec]` |
| A10 | No / expired token | Same calls without a bearer or with an old one | 401 | `[api]` `[sec]` |
| A11 | CRM blueprints not in Desk | GET with `x-app-key: desk` | Only Desk ticket blueprints | `[api]` `[sec]` |

## Group B — Blueprints list

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| B1 | List renders | Open the page | Title, subtitle, Create Blueprint; grouped by department; each row shows mini diagram, name, layout, states count, Draft badge, in-progress count, status; matches the API | `[func]` `[ui]` |
| B2 | In-progress count | Compare with tickets inside (`blueprint-state`) | Count matches; "not counted yet" only while loading | `[func]` |
| B3 | Department without blueprints | Pick QA WF Dept R | "No blueprints in QA WF Dept R yet" + body text | `[ui]` |
| B4 | No departments | Tenant without departments (read the code path or a throwaway tenant) | "Add a department before you create a blueprint." | `[ui]` |
| B5 | Blueprint without a department | API-create one without departmentId | Shown under "Blueprints without a department" with the hint; it governs no ticket (I-row check) | `[func]` `[serial]` |
| B6 | Activate / deactivate | Toggle a QA blueprint | Status changes; `isActive` matches; no error toast | `[func]` `[serial]` |
| B7 | Reorder | Drag QA blueprint 2 above 1; reload | Order kept; `sortOrder` matches; keyboard reorder works (a11y) | `[func]` `[a11y]` `[serial]` |
| B8 | Delete empty | Delete a QA blueprint with 0 tickets | Confirm text; "Moved to the Recycle Bin"; restore from the bin brings it back (record active state) | `[func]` `[serial]` |
| B9 | Delete with tickets inside | Delete a QA blueprint with 1 ticket | Refused: "1 ticket is in progress in … Revoke it before deleting the blueprint." | `[func]` `[serial]` |
| B10 | Long / odd names | Names from §2.4 | Row truncates with a tooltip; no layout break; XSS shown as text | `[data]` `[ui]` `[sec]` |
| B11 | Load failure | Block the list call (devtools offline) | "Couldn't load blueprints." with Retry | `[ui]` |

## Group C — Designer: details, states, canvas, publish checks

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| C1 | New blueprint opens | Create Blueprint | Empty canvas text "Drag a status from the list onto the canvas, or use Add State to create one."; details panel | `[ui]` |
| C2 | Name required | Publish with no name | Issue "The blueprint needs a name"; nothing saved | `[func]` |
| C3 | Name data classes | §2.4 on name and description: XSS text, Arabic, emoji, trailing spaces, 300+ characters | Same as **live Zoho** (Setup → Blueprint → Create Blueprint, read only: try typing, do not save in Zoho unless the user approves): stored as typed or trimmed, Zoho's length limit and message; XSS inert. TAVI 1–2 Nov: stored as typed, trailing spaces kept, no limit (309 chars) | `[data]` `[sec]` `[zoho]` |
| C4 | Duplicate name | Same name as another blueprint in the department | Same as **live Zoho** (does Zoho refuse a duplicate blueprint name, and with what message). TAVI 1–2 Nov: allowed | `[data]` `[zoho]` |
| C5 | Layout | Any layout vs one layout | `layoutId` / `layoutName` stored; ticket with another layout does not enter (I3) | `[func]` |
| C6 | Criteria builder | Add conditions (text, pick list, tags, date), pattern | Saved in `entryCriteria`; summary shows "Tickets that match" | `[func]` |
| C7 | Field fixed | Look at Field | "Ticket status", not editable | `[ui]` |
| C8 | Drag states | Drag Open, Escalated, Closed from Used/Other statuses | Nodes placed; palette marks "On the canvas" | `[func]` `[ui]` |
| C9 | Add State | Add `QA BP Verify` (Open) | New status in `/desk/ticket-statuses` with type open; on canvas | `[func]` `[serial]` |
| C10 | Add State clash | Add "Open" or "open" | "“Open” already exists as Open" | `[data]` |
| C11 | Add State data classes | §2.4 for the status name | Arabic / emoji / long handled; no broken status | `[data]` `[serial]` |
| C12 | Closed type ends | Mark a state Closed / Ends the blueprint | Flag icon; `isTerminal: true`; tickets leave the blueprint there (I-row) | `[func]` |
| C13 | Same state twice | Force the same state twice (API) | "{{state}} is on the canvas twice" / API refuses | `[api]` `[data]` |
| C14 | Unreachable state | State with no incoming transition | "{{state}} cannot be reached from the start" | `[func]` |
| C15 | Transition without source / target | API body with a missing / unknown `fromStateId` / `toStateId` | Publish issue; API 400 | `[api]` |
| C16 | 16 connections | Connect a 17th transition to one state | "A state can have up to 16 connections."; counter "16 of 16" | `[data]` |
| C17 | Common transition | Set "Cancel" common | Listed in COMMON TRANSITIONS; offered from every non-final state on tickets (J-row) | `[func]` |
| C18 | Parallel steps | Transition with 1 parallel step | "needs at least two parallel steps, or none"; with 2 → OK; with branches as well → refused | `[func]` |
| C19 | Remove a state in use | Remove a state where a QA ticket sits | "1 ticket is in {{state}}. Revoke it before removing the state." | `[func]` `[serial]` |
| C20 | Status gone | Delete a status used on the canvas (in Ticket statuses) | Refused (FIELD_OPTION_IN_BLUEPRINT with count) whether or not a ticket is in that state. 2 Nov: refused only with a ticket inside; with none it is removed and tickets then move into it — **NDC-2775** | `[func]` `[serial]` |
| C21 | Undo / redo / tidy | Add, move, undo, redo, tidy | Canvas follows; no lost transitions | `[ui]` |
| C22 | Zoom / fit / phone width | Zoom, fit; open at 390 px | Phone shows "Draw states and connectors on a larger screen"; settings still editable | `[ui]` `[compat]` |
| C23 | Leave with unsaved changes | Edit, then Back | Asked to keep or discard (record); nothing published | `[ux]` |

## Group D — Transition: Before

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| D1 | No owners | Leave owners empty | Hint "Any agent in the department who can edit the ticket"; Agents A and B both see the button | `[func]` |
| D2 | Agent owner | Add Agent A | Only A sees and can run it; B gets "No transitions you can run" / 403 | `[func]` `[sec]` |
| D3 | Team owner | Add the team of B | Team members see it; others do not | `[func]` |
| D4 | Ticket owner | Tick Ticket owner | The current owner sees it; after the owner changes, the new owner sees it | `[func]` |
| D5 | Owner removed | Remove A from the department, or deactivate A | Record: A no longer runs it; the blueprint shows a warning or still publishes | `[func]` `[serial]` |
| D6 | Another department, Full | Owner C from another department, access Full | "While the ticket is in {{state}}, Desk shares it with {{department}} at Full access."; C sees and runs it | `[func]` `[serial]` |
| D7 | Read only / Restricted owner with a required reply | Access Read only + During reply required | Refused: "{{owner}} has Read only access and cannot send the required reply." | `[func]` |
| D8 | Share limit | Ticket already shared with 10 departments | History "Not shared with {{department}}: the ticket has 10 shared departments" | `[func]` `[serial]` |
| D9 | Criteria | Criteria "Priority is High" | Button only on matching tickets; hint text shown | `[func]` |
| D10 | Criteria and API | Run the hidden transition by API on a non-matching ticket | Refused; ticket unchanged | `[api]` `[sec]` |

## Group E — Transition: During

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| E1 | No items | Transition with no items | "Nothing to fill in, so the agent runs it in one click."; ticket form "Nothing to fill in. Run moves the ticket on." | `[func]` `[ui]` |
| E2 | Reply required | Add Reply, required | Form shows the reply box "To {{contact}}" and the latest contact message; Run disabled until typed; the reply is sent to the contact and logged | `[func]` |
| E3 | Comment required | Internal comment | Saved as a private comment ("Only agents see this") | `[func]` |
| E4 | Attachment required | Attachment | Run needs a file; file on the ticket | `[func]` |
| E5 | Resolution required | Resolution | Ticket resolution set | `[func]` |
| E6 | Field required | Priority required | Field in the form; value saved; history source = blueprint | `[func]` |
| E7 | Field types | Required fields of each type (text, number, date, pick list, multi-select, lookup, user, checkbox) | Each control renders and saves; invalid input refused (record) | `[data]` |
| E8 | Checklist | 2 checks mandatory, 1 optional | Run needs both mandatory ticks | `[func]` |
| E9 | Message | Message text | Shown to the agent, read only | `[ui]` |
| E10 | Order | Move items up / down | Ticket form shows the same order | `[func]` |
| E11 | Optional items | Mark items optional | Run works without them | `[func]` |
| E12 | Access withheld | Agent whose access has no replies runs a transition with an optional reply / a required reply | Optional: "…runs without one."; required: "This step needs a reply… Ask an admin for access." | `[func]` 🔒 |
| E13 | Data classes in the form | §2.4 in reply / comment / resolution / text field | Stored as text; XSS inert in the conversation and history | `[data]` `[sec]` |
| E14 | Field validation absent | Look for a validation rule option | Not offered (→ Z4) | `[func]` |

## Group F — Transition: After

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| F1 | Field update | Set Priority = High; set a contact field via contact | Ticket / contact updated after the run; history source = blueprint | `[func]` |
| F2 | Field update address | Update an address field | Subfields kept `[reg NDC-1436]` | `[func]` |
| F3 | Notification | Title, body, notify owner + a team | In-app notification to the owner and team members | `[func]` |
| F4 | Create task | desk_tasks with subject, due, priority, assignee | Task created and linked to the ticket; names shown, not ids `[reg NDC-1328]`; only Desk task module offered `[reg NDC-2729]` | `[func]` |
| F5 | Webhook | POST to the receiver | Request arrives with ticket data `[reg NDC-2540]`; internal / metadata URLs refused `[reg NDC-2537]` | `[func]` `[sec]` |
| F6 | Send email | QA BP template to the contact + owner + a team | Email delivered; "Recipients are people in Desk. Free addresses are not offered." | `[func]` |
| F7 | Custom action | Safe active Desk custom action | Runs once with the ticket as context; refused reasons shown for inactive / not-Desk / record-bound actions | `[func]` |
| F8 | Order | 3 after-actions reordered | Run in that order (timestamps) | `[func]` |
| F9 | Workflow after the transition | QA workflow rule On Edit on the ticket | Runs after transitions with and without required fields `[reg NDC-2420]` | `[func]` `[serial]` |
| F10 | Merge tokens | `{{subject}}` in notification / task / webhook body | Replaced with the ticket value | `[func]` |

## Group G — State time limits (SLA tie-in, designer)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| G1 | No limit | Leave Time limit empty | "No limit"; no due on tickets | `[func]` |
| G2 | Limit + warning | 2 h, warn 1 h | Example text shows start / warning / due; `slaMinutes 120`, `slaPreExpiryMinutes 60` | `[func]` |
| G3 | Warning not smaller | Warn 2 h, limit 2 h; warn without limit | "The warning must come before the time limit."; publish issue | `[data]` |
| G4 | Limit values | 0, -1, 0.05, 0.5, 1, 9999, text, empty | Rule per value recorded; minutes stored match | `[data]` |
| G5 | Auto-move | When it runs out → a transition | `autoTransitionId` stored; wait < 1 min refused; transition with required items / parallel steps refused | `[func]` |
| G6 | Business vs calendar | Same limit, two states, one each | Different settled due times when business hours are not 24×7 (§1.4). 2 Nov: weekend counted — **NDC-2774** | `[func]` |
| G7 | Example text | Business hours selected | Example uses the tenant's hours, not a fixed "Monday to Friday, 9 to 5 week" (possible bug) | `[ui]` |
| G8 | Actions at the warning / when it runs out | Add notification + field update to each list | Saved in `slaWarning` / `slaEscalation` | `[func]` |
| G9 | Customer triggers | When the customer replies → a transition; when rates → another | Stored; transition must start from this state; not on exit states ("a customer reply cannot move a ticket out of an exit state") | `[func]` |
| G10 | Reopen hint | No reply trigger | "Nothing set, so a customer reply reopens the ticket as it does today." | `[ui]` |
| G11 | Auto-close shown | Open "On Hold" of Demo · Refund approval (read only) | Panel shows the 3-day auto-close it has (`autoTransitionAfterMinutes 4320`); today it shows "No limit" (possible bug) | `[func]` |

## Group H — Save, drafts, versions, concurrency, audit

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| H1 | Save Draft | Change a published QA blueprint, Save Draft | Draft badge; tickets keep using the published version | `[func]` `[serial]` |
| H2 | Publish | Save and Publish | Version n+1; "Published"; new tickets use it | `[func]` `[serial]` |
| H3 | Publish blocked | Leave 2 issues | "2 issues to fix before publishing"; each issue jumps to the item | `[func]` |
| H4 | Versions | Open Versions; view v1 | Read-only view; restore v1 → new draft or version (record) | `[func]` `[serial]` |
| H5 | Double click Publish | Click twice fast | One version created | `[conc]` `[serial]` |
| H6 | Two tabs | Tab 1 and tab 2 edit, both publish | Second gets a conflict, not a silent overwrite (record) | `[conc]` `[serial]` |
| H7 | Partial body | PUT with only `{definition:{name}}` | Refused, or other fields kept (no wipe) | `[api]` `[serial]` |
| H8 | Read-only keys | PUT with `id`, `in_progress_count`, `createdAt` changed | Ignored or refused | `[api]` |
| H9 | Remove a transition in use | New version without a transition a ticket was about to run | The ticket's Steps refresh; running the old id → BLUEPRINT_STATE_CHANGED or clear error | `[func]` `[serial]` |
| H10 | Rename a state | Change a state's name in a new version | Tickets keep their status; record history | `[func]` `[serial]` |
| H11 | Session expired | Let the token expire, then Publish | Sign-in asked; draft not lost (record) | `[ux]` |
| H12 | Audit log | After H1–H4 | Audit Log has create / update / publish / restore / delete entries with readable text `[reg NDC-1643]` | `[func]` |

## Group I — Ticket entry and membership `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| I1 | Enter on create | New QA ticket matching criteria | `blueprint-state` shows the blueprint and start state; history "Entered blueprint … at Open" | `[func]` |
| I2 | Criteria not met | Ticket without the prefix | No blueprint | `[func]` |
| I3 | Layout | Ticket with another layout | No blueprint | `[func]` |
| I4 | Edit to match later | Ticket that did not match is edited to match | Record: enters or not (Zoho: entry only) | `[func]` |
| I5 | First match wins | Two QA blueprints both match | Ticket enters the one higher in the order; swap order → new tickets enter the other | `[func]` |
| I6 | Other department | Matching ticket in another department | No blueprint | `[func]` |
| I7 | Inactive blueprint | Deactivate, create a ticket | New tickets do not enter; tickets already inside continue | `[func]` |
| I8 | Include tickets | Include 3 existing QA tickets at state Escalated | "3 tickets included"; history names the admin; skipped reasons listed (other department, merged, share only) | `[func]` |
| I9 | Include a ticket already in a blueprint | Include a ticket in another blueprint | Skipped "In blueprint {{name}}" (record) | `[func]` |
| I10 | Revoke one | Ticket menu → Revoke blueprint | Keeps status; Status editable; timers stop; history "revoked" | `[func]` |
| I11 | Revoke all | List → Revoke tickets | Every ticket leaves; counts; "Tickets you see only through a share are skipped and listed." | `[func]` |
| I12 | Bulk revoke | Ticket list, select 2 in and 1 out → Revoke Blueprint | "Remove 2 tickets from their blueprints?"; "None of the selected tickets is in a blueprint." when none | `[func]` |
| I13 | Complete | Run to a Closed state | History "Completed blueprint"; Steps card gone; Status editable | `[func]` |
| I14 | Mass include / exclude (CRM routes) | POST `/modules/{m}/blueprints/{id}/mass-include` | Record whether Desk accepts it and keeps the same rules as `/desk/blueprints/{id}/include` | `[api]` |
| I15 | Merged ticket | Merge a ticket that is in a blueprint | Record what happens to its blueprint | `[func]` |

## Group J — Running transitions on tickets `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| J1 | Steps card | Open a ticket in the blueprint | Pill, progress bar, Steps with Now, time in state, due / warning, next steps | `[ui]` |
| J2 | Run with no items | Click a next step | "{{transition}} ran. The ticket moved to {{state}}."; status changed; history "{{actor}} ran {{transition}} in {{name}}" | `[func]` |
| J3 | Run with required items | Open the form, leave empty, Run | "Fill in the required items to run {{name}}"; then fill and run | `[func]` |
| J4 | Status locked | Try to change Status in the ticket, in the list, by bulk and by API PATCH | UI locked "Set by blueprint …"; bulk skipped "follows a blueprint"; API 4xx TICKET_IN_BLUEPRINT | `[func]` `[api]` |
| J5 | Close by reply | Reply with "send and close" | "Reply sent. The ticket stays open…" | `[func]` |
| J6 | Close ticket button | Click "Close ticket" on a ticket in a blueprint | Refused with the blueprint message, or hidden (possible bug: shown today) | `[func]` |
| J7 | Stale form | Two agents open the same form; A runs; B runs | B gets "This ticket moved to {{state}} a moment ago." and a reload | `[conc]` |
| J8 | Double click Run | Click Run twice fast | One transition, one set of after-actions | `[conc]` |
| J9 | Cross-department owner | Agent C runs the step on the shared ticket | Works with Full access; share removed after leaving the state (record) | `[func]` |
| J10 | Incomplete run | Make an item fail (e.g. attachment too big) after the move | "The ticket moved, but its other items were not saved. Retry to save them." Retry saves them once | `[func]` |
| J11 | Network loss | Cut the network on Run | "We couldn't confirm the run. Retry sends the same form again."; no double move | `[func]` `[conc]` |
| J12 | Leave form with text | Type, then close | "The reply and notes were not saved. Leave without saving them?" | `[ux]` |
| J13 | Common transition | Run "Cancel" from a middle state | Moves to its target | `[func]` |
| J14 | Parallel steps | Run steps of a parallel group | Group shows done / total; moves on only when all are done | `[func]` |
| J15 | Continuous | Continuous blueprint with an empty-item step after the first | Second step runs on its own | `[func]` |

## Group K — Automatic moves, timers and the department SLA `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| K1 | Due on entry | Enter a state with limit L | `escalation_due_at` = entered + L (clock rules) | `[func]` |
| K2 | Warning actions | Wait past the warning time | Warning actions run once; Steps shows "Warning …" | `[func]` |
| K3 | Customer reply trigger | Customer replies from Gmail | Ticket moves by the set transition; history "Moved by … when the customer replied"; no reopen | `[func]` |
| K4 | No reply trigger | State without it; customer replies | Normal reopen behaviour (hint G10) | `[func]` |
| K5 | Rating trigger | Customer rates Good, then Bad on another ticket | Both move (no filter today → Z10) | `[func]` |
| K6 | Time limit runs out | Wait past due | Escalation actions run once; Steps "Overdue by …"; history | `[func]` |
| K7 | Auto-move on timer | State with auto transition | Moves at the time; history "Moved by … when the time limit passed" | `[func]` |
| K8 | Business-hours clock | Enter on a working day, limit crossing a weekend (§1.4) | Due counted in working time only. 2 Nov: Saturday counted (blueprint and department SLA) — **NDC-2774** | `[func]` |
| K9 | Holiday | Business day marked as a holiday | Not counted. 2 Nov: Pass | `[func]` |
| K10 | Leaving the state stops timers | Run a transition before due | Old warning / escalation do not fire later | `[func]` |
| K11 | Revoke stops timers | Revoke before due | Nothing fires later | `[func]` |
| K12 | Escalation webhook | Webhook in "when it runs out" | Request arrives `[reg NDC-2540]` | `[func]` |
| K13 | Escalation custom action | Custom action at the warning | Runs once | `[func]` |
| K14 | Department SLA in an On Hold state | Ticket with a department SLA enters a blueprint state on an On Hold-type status | Department SLA response / resolution pause; resume on leaving. Compare with **live Zoho** (SLA timer while a blueprint state uses an On Hold status). TAVI 1–2 Nov: pauses and resumes | `[func]` `[zoho]` |
| K15 | State timer in On Hold | Same, the state has its own limit | Compare with **live Zoho** (does the state-level SLA keep running in an On Hold status). TAVI 1–2 Nov: keeps running | `[func]` `[zoho]` |
| K16 | Both overdue | Department SLA and state limit both pass | Both shown separately (SLA Violated pill + Overdue by in Steps); no mixed-up times | `[ui]` |
| K17 | Department SLA reapply | Reapply SLA on a ticket in a blueprint | Blueprint state untouched; compare with **live Zoho** where reapply exists. TAVI 1–2 Nov: state kept | `[func]` `[zoho]` |

## Group L — Automation interplay `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| L1 | Workflow on create decides entry | QA workflow sets a field on create that the criteria use | Record order (Zoho: workflow, SLA and assignment run before the blueprint) | `[func]` |
| L2 | Assignment rule then blueprint | Assignment rule + blueprint with "Ticket owner" as owner | The assigned agent is the transition owner | `[func]` |
| L3 | Workflow sets Status | QA workflow Field Update Status on a ticket in a blueprint | Refused or skipped; the blueprint state is not moved back `[reg NDC-2730]` | `[func]` |
| L4 | API sets Status | PATCH status by API | TICKET_IN_BLUEPRINT | `[api]` |
| L5 | Macro sets Status | QA macro with a status change | Same as L3 | `[func]` |
| L6 | Supervise / time rule | Time-based rule changes Status | Same as L3 | `[func]` |
| L7 | Department change | Move the ticket to another department | Same as **live Zoho** (Zoho refuses moving a ticket that is in a blueprint — confirm live and record the message). TAVI 1–2 Nov: move allowed, ticket leaves the blueprint, status kept | `[func]` `[zoho]` |
| L8 | Approval process | If Desk approvals exist: approve a QA ticket that matches; edit a ticket that is in a blueprint | The approved ticket enters the blueprint `[reg NDC-2707]`; the edit does not drop it out `[reg NDC-2334]` | `[func]` |

## Group M — Where results appear

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| M1 | Ticket history | After I and J runs | Each event in History with actor, blueprint, transition, time; field changes marked source blueprint | `[func]` |
| M2 | Timeline / Activity | Ticket Activity tab | Blueprint entry and moves visible `[reg NDC-2321]` | `[func]` |
| M3 | Ticket list | List view of QA tickets | Blueprint icon; record whether a blueprint / state column or filter exists (→ Z13) | `[ui]` |
| M4 | Audit log | Audit Log entity filter | Blueprint entity listed once with readable text `[reg NDC-2293]` | `[func]` |
| M5 | Analytics | Look for blueprint reports / dashboard | None today (→ Z14) | `[func]` |
| M6 | Recycle Bin | Deleted QA blueprint | In the bin; restore and purge work (check `failed[]`) | `[func]` |

## Group N — Security, i18n / RTL, accessibility, performance, compatibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| N1 | XSS in names and texts | Script payload in blueprint, state, transition, checklist, message, notification | Shown as text in the designer, ticket, history, notification, email | `[sec]` |
| N2 | Type confusion | API bodies with numbers as strings, arrays as objects, unknown `kind`, huge arrays | 400 with a field message, never 500 | `[sec]` `[api]` |
| N3 | Ids of another tenant | Owner / team / department / template / custom action id from another tenant | Refused | `[sec]` |
| N4 | Enumeration 🔒 | Random blueprint / transition ids | Same 404 for missing and forbidden | `[sec]` 🔒 |
| N5 | Arabic UI | Switch to AR | Every string translated (designer, ticket form, history, toasts); canvas and arrows mirror sensibly | `[i18n]` |
| N6 | RTL text | Arabic names in states / transitions | Correct direction on canvas and ticket | `[i18n]` |
| N7 | Keyboard and screen reader | Tab through list, designer panels, ticket form | Labels ("Drag to reorder …", "Diagram of …"), focus order, Escape closes dialogs | `[a11y]` |
| N8 | Big blueprint | 30 states, 80 transitions (Add State for the extra statuses, removed after) | Designer stays usable; publish < 5 s. 2 Nov: API create 2.5 s, publish 2.2 s; designer first load ~60 s on slow staging — re-measure | `[perf]` |
| N9 | Many tickets | Include / revoke 500 tickets | Paged; counts correct; "stopped before the end" resume works | `[perf]` |
| N10 | IM ticket | Required reply transition on an IM ticket | Record (Zoho opens the IM reply) — Inconclusive without IM | `[compat]` |
| N11 | Browsers | Edge, Chrome, Firefox, Safari (if any) | Designer drag and drop works | `[compat]` |

## E2E journeys `[serial]`

| ID | Journey | Expected |
|---|---|---|
| E2E-1 | Refund flow: admin builds Open → Verify (checklist + comment) → Approve (owner Agent A, resolution) → Closed, publishes; a customer emails; ticket enters; Agent B cannot approve; Agent A approves | Each step as designed, after-actions run, history complete, blueprint completed |
| E2E-2 | Waiting for customer: Ask documents (required reply) → On Hold with reply trigger + 3-day auto-close (use minutes); customer replies → back; second ticket gets no reply → auto-closed | Moves by reply and by timer, department SLA paused in On Hold (K14) |
| E2E-3 | Escalation: state limit + warning + escalation notification + auto-move to Escalated | Warning and escalation once each, then auto-move |
| E2E-4 | Cross-department: transition owned by another department at Full access | Ticket shared while in the state, C runs it, share ends |
| E2E-5 | Negative recovery: publish a broken blueprint (issues), fix, publish; remove a state with tickets inside (refused), revoke, remove, publish; restore an old version | Clear messages at each block; tickets never stuck; final state as designed |
| E2E-6 | Change after the fact: deactivate with tickets inside, edit and publish a new version, delete after revoking all | Old tickets continue / revoke cleanly; delete only when empty |

## Group Z — Gaps (run to confirm they are still missing or now built)

Each row: look in the UI and the API. **Still missing** = the item stays open. **Built** = run the expected behaviour and tell the user.

| ID | Item | How to check | Expected (Zoho) |
|---|---|---|---|
| Z1 | Strict Mode | Blueprint details; try editing other fields and replying on a ticket in a blueprint | Lock all / selected / all except selected actions and fields |
| Z2 | Change transition owners inside a ticket | Ticket Steps card / transition menu | Admin or owner reassigns the owner of the next transition |
| Z3 | Order of transition buttons | State panel | Drag order; ticket shows that order |
| Z4 | Field check with an error message | During → Field options; API `fieldValidations` | Rule per field + custom error; run refused with that message |
| Z5 | Submit for approval in a transition | During item list | Approval step with approvers |
| Z6 | Share as a During step | During item list | Agent picks a department and access |
| Z7 | Widgets in the transition form | During item list | Extension shown in the form |
| Z8 | Transition draft | Ticket transition form | Save draft, reopen later with the typed values |
| Z9 | Required items per agent group | During settings | Different required items per group |
| Z10 | Rating / reply filters for automatic moves | State → Customer triggers | Good / Okay / Bad; public / private reply |
| Z11 | Several escalation levels per state | State → Time limit | Level 1…n, each at its own time with recipients and template |
| Z12 | Business-hours set per state | State → Clock | Pick a business-hours set (with its holidays) |
| Z13 | Blueprint views in the ticket list | Ticket list views | Active Blueprint Tickets, All / My / My Team / Unassigned Transitions |
| Z14 | Blueprint dashboard | Analytics; `/…/blueprints/reports`, `/stats` | Active / completed, SLA-violated tickets and states, met vs missed %, average time per blueprint and state, transition counts; filters |
| Z15 | Separate revoke permission | Profiles → permissions | "Revoke blueprint" apart from manage |

---

## Run status (2 Nov 2026, after Phase 4)

| Bucket | Rows |
|---|---|
| Fail — filed | G11 NDC-2755, G7 NDC-2756, J6 NDC-2757, N2/C6 NDC-2758, G3 NDC-2761, G4 NDC-2762, G5 NDC-2763, L3 NDC-2764, G6/K8 NDC-2774, C20 NDC-2775; E4 NDC-2753 (other reporter, still fails) |
| Compared with live Zoho (Phase 4) | C3 **differs**: Zoho refuses special characters ("Special characters are not allowed.") and caps the name at 60 characters (description 1000); TAVI accepts both (image BP-C3-name-rules-vs-zoho.png). Arabic/emoji/trailing spaces same. K14 same as Zoho docs (SLA freezes in On Hold, resumes recalculated) |
| Live Zoho with QA records (user OK, 2 Nov) | C4 same (Zoho saves a duplicate name, draft and active). K15 same (Zoho state timer keeps running in On Hold). K17 TAVI extra (Zoho has no SLA reapply on the ticket). L7 **differs**: Zoho allows the move, the ticket leaves the blueprint and Status resets to Open (owner unassigned); TAVI keeps the status. C3 filed as NDC-2780 |
| Agent rows (NDC-Staging, Phase 4) | Pass: A2, A3, A4, A5, A7, A8, D1, D2, D3, D4, D6, D7, E12 (optional reply), F3, J9. Record: A6 — Desk Agent refused, a separate permission `desk:ticket:blueprint_revoke` exists (Z15 is partly built). Inconclusive: F6 (no email trace). Not run: D5 (changes shared accounts). Blocked: D8 (only 5 departments) |
| Not run — blocked | K3–K5 (customer mailbox), F5/K12 (webhook receiver), F7/K13 (safe custom action), N10 (IM channel) |
| Re-measure | N8 designer load; C20 designer warning (seen 2 Nov: "QA BP Verify is no longer a ticket status") |
| Automation | Java: BlueprintRunTest, BlueprintAdminTest, BlueprintTimerTest, BlueprintUiBugTest, BlueprintPhase2ApiTest, BlueprintScreenTest (5/10 pass on 2 Nov, test fixes pending) — `automation/src/test/resources/features/deskblueprint/feature-map.md` |
| Everything else | Pass (see report) |

## Traceability

NDC-1974 has no numbered requirements. Its two lines and the build contract are traced instead.

| Source | Requirement | Scenarios |
|---|---|---|
| NDC-1974 | "A fixed sequence of steps a ticket must pass through" | C8–C18, I1, J1–J4, E2E-1 |
| NDC-1974 | "Refund tickets must pass Verify → Approve → Pay" | E2E-1 |
| NDC-1974 | "Needs first: SLA policies" | G1–G11, K1–K17, E2E-2, E2E-3 |
| NDC-1974 | "Needs first: workflow triggers" | F9, L1–L6 |
| Build — list | grouping, order, activate, delete, in-progress count | B1–B11, I5, I7 |
| Build — designer | details, states, canvas, issues, parallel, common, continuous | C1–C23, J13–J15 |
| Build — before / during / after | owners, share, criteria, 7 items, 6 actions | D1–D10, E1–E14, F1–F10 |
| Build — state limits and triggers | limit, warning, clock, auto-move, reply / rating | G1–G11, K1–K13 |
| Build — save / versions | draft, publish, versions, conflicts, audit | H1–H12 |
| Build — membership | include, revoke (one / bulk / all), complete | I8–I15 |
| Build — ticket UX | Steps card, form, locked status, errors, retry | J1–J15 |
| Build — permission | `desk:blueprints:manage`, owners, tenant isolation | A1–A11, N3, N4 |
| Department SLA tie-in | pause in On Hold, both overdue, reapply | K14–K17 |
| Bugs on the same engine | NDC-2540, 2537, 2420, 2730, 2729, 1328, 1436, 2707, 2334, 2321, 2293, 1643 | F2, F4, F5, F9, K12, L3, L8, M2, M4, H12 |
| Missing list | 15 gaps | Z1–Z15 |
| Possible bugs (missing list notes) | auto-close hidden, fixed week text, Reopened type, Close ticket button | G11, G7, C12 (+ status check), J6 |

## Reporting

- Run folder `executions/execu_<date>_desk-blueprint/`: report.md, results per row, evidence only for failed rows (TAVI vs Zoho side by side).
- Redact tokens (lengths only), mailboxes and customer data.
- Restate the coverage gaps: Inconclusive rows and their blocker (§1.4).
- Revert proof: after the run, GET the same endpoints as §1.3 and diff them against the baseline. Expected differences are only ones the user agreed to (for example a QA status that cannot be deleted); list each one.
