# Spec — Desk Assignment Rules, Ticket Assignment and Triaging

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging) |
| Feature | Setup → Automation → **Assignment Rules** (Rules, Team Assignment, Agent Skills, Backlog, Notifications), **manual assignment** of tickets (owner / team fields, Pick up, Unassign, bulk Assign To, Move, Share, unassigned views), and assignment done by **other automation** (workflow Owner Assignment, macros, SLA escalation, department routing) |
| Scope | The three Zoho articles: [Assign tickets manually](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assign-tickets-manually), [Assigning tickets using workflows / assignment rule](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-using-workflows-assignment-rule), [Automatic triaging and assignment](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/automatic-triaging-and-assignment-of-tickets), and the pages they link to |
| Plane | **NDC-1978** "Assignment rules and skills" (plan item under NDC-1953 "Desk: Teams and agents"; 6 details = Z1, Z2, Z3, Z4, Z7, Z11). Related: NDC-1976 (agent online / offline status), NDC-1975 (working teams; NDC-1910 team form 400), NDC-1980 (reassign on leave), NDC-1780 (bulk actions), NDC-1897 / NDC-1898 (owner picker), NDC-1585 (CRM import assignment rule). NDC-1254 "Assignment Rules" is an empty holder. **No PRD with numbered requirements** |
| Missing list | `docs/desk-assignment-rules/desk-assignment-rules-missing-list.md` (15 items = Z1–Z15; nothing filed in Plane) |
| Gap evidence | `docs/desk-assignment-rules/evidence/NN-<item>-vs-zoho.png`, all shown in `evidence/evidence-report.md`; originals in `evidence/originals/` |
| Reference notes | `reference/zoho-docs-inventory.md` (Zoho help / API / editions, with sources) · `reference/zoho-live-notes.md` (what was seen in Zoho on 6 Oct 2026) · `reference/tavi-build-map.md` (pages, strings, API, permissions) · `reference/tavi-baseline-2026-10-06.json` (API baseline) |
| Written | 6 Oct 2026, from bundle `index-Co3RWIzd.js` (chunks `AssignmentRulesPage-DZu1-MER.js`, `assignment-api.client-C2iBNVJR.js`, `CriteriaBuilder-DwLgmCen.js`, `useTicketOwnership-Cuo9U1nu.js`), locales `desk`, `desk-tickets`, `crm-workflow`, the live API (GET only) and the UI (owner and second admin) |
| Status | **Draft for review** |

---

## Feature inventory

### Built in Desk (found 6 Oct 2026)
**Rules tab** — department picker; rules run in order on a ticket that "arrives with no owner and no team"; first active match wins — B1–B10, D1–D14
- Editor: Rule name (≤ 120), Description (≤ 1000), Active; criteria on 23 ticket fields with a criteria pattern; Assign to An agent / A team / Round robin — C1–C30
- Round robin: pool Selected agents / A team's members; Sequence / Load-based / Skill-based; Capacity per agent 1–1000; Keep excess tickets in backlog — E1–E16

**Team Assignment** — per department Off / Round robin / Load-based with capacity and backlog — F1–F8
**Agent Skills** — skills (Tickets "Skills" picklist options) ticked per agent — G1–G8
**Backlog** — waiting tickets, reason, attempts, Process now; processed every minute and when an agent frees up — H1–H8
**Notifications** — two organisation-wide switches (agent, team) — I1–I7
**Manual assignment** — Ticket Owner / Teams fields, Unassign, Pick up, list/queue Assign, bulk Assign To, Move ticket with Assign to, Share, Unassigned views and filters, HQ Unassigned widget — J1–J24
**Other automation** — workflow Owner Assignment (user / user field / role / role round robin), Macros assign, SLA escalation reassign, Department "Routing" — K1–K10

### Missing in Desk (Group Z)
- Already in NDC-1978: update trigger (Z1), Move Ticket to (Z2), business-hours criteria (Z3), date / number operators (Z4), exclude agents (Z7), skills management (Z11).
- New (missing list items 5, 6, 8, 9, 10, 12, 13, 14, 15): contact / account / owner / team criteria (Z5), master switch (Z6), online-only round robin (Z8), department and agent thresholds (Z9), backlog options (Z10), workflow assign to team (Z12), AI owner prediction (Z13), notification rules per department with templates (Z14), API coverage (Z15).

### Not a gap
- Several targets in one rule (TAVI: one rule per action) · online status in the picker (Zoho native has none) · "Assign to me" (Zoho has none; TAVI Pick up is extra) · rule limits per plan · Supervisor rules, Schedules, Blueprint owners (other features).

### Not yet confirmed
- Real assignment results — no tickets and no email channel on the tenant (§1.4).
- Whether round robin skips offline agents (server side).
- Whether the department "Routing" field changes anything (K8).
- Whether the generic module assignment-rule engine is reachable for Desk Tickets (K9).

---

## 0 How to run

1. **Order:** §1 preconditions → A → B → G (read) → H (read) → I (read) → C → B-write → D → E → F → G-write → H-write → I-write → J → K → L → E2E → Z. Take the baseline (§1.3) before A and diff it after the last group.
2. **Serial only:** B-write, C-save rows, D, E, F, G-write, I-write, K and every `[serial]` row. Rules, team assignment, skills and notification settings are **tenant-wide per department**; round-robin order and load depend on every other ticket — never run two writers at once, and never run D/E while anyone else creates tickets in the same department.
3. **Parallel allowed:** A (read), B (read), C (validation only, Cancel), H (read), J read rows, L-ui and every API GET row.
4. **Exclusive:** `[perf]` rows run alone, with nothing else signed in to the account.
5. **`[data]` rows** record: field / operator / value (exact bytes for odd input), what the UI showed, what the API stored (GET after save), and pass / fail per row.
6. **Tickets:** create test tickets **through the API or the New Ticket form with no owner and no team** (an agent-created ticket gets the creator as owner — clear it, or use the API). Record each ticket id, number, department and the time of creation (round robin depends on order).
7. **Sessions:** the access token is short-lived; on 6 Oct 2026 every session ended after 20–30 minutes (`POST /iam/auth/refresh` → 401) and a second sign-in of the same account can revoke the first. One script = one sign-in; re-sign-in on 401; use the second admin for long UI runs. Report token **lengths** only.
8. **Verdicts:** Pass / Fail / Blocked / Inconclusive. A row blocked by §1.4 is **Inconclusive, not Fail**.

---

## 1 Preconditions

### 1.1 Accounts
| Role | Account (from `docs/Credentials/TAVI DESK Credentials.txt`) | Status |
|---|---|---|
| Tenant owner (admin) | `ndc-staging-owner@taviportal.com` (user `97be04b6-…`) | Works; has `desk:assignment:manage` |
| Second admin | `mahmoud.mohamed1@taviportal.com` ("Mahmoud TAVI", `18ba78c4-…`) | Works; used for the captures |
| Agent | `mahmoud.mmohamedsamy@gmail.com` ("Mahmoud Samy", `d23fb4e0-…`) | Has `desk:assignment:manage` (200) — profile to be confirmed |
| Lower-profile agent 🔒 | `mahmoud.mahamed1515@gmail.com` (`3445ec4a-…`) | `GET /desk/assignment-rules` → 403 "Missing required permission 'desk:assignment:manage'." Use for A rows. Check it has no CRM Admin profile (memory: a Gmail test user keeps CRM Admin) |
| User of another tenant | any throwaway tenant | A10 only |
| Zoho Desk reference | `docs/Credentials/ZOHO DESK Credentials.txt` (CEO), desk.zoho.com, **Edge only**, read-only (one QA rule allowed, deleted after) | Works |

All 4 TAVI users are agents of all 5 departments. Never print passwords or tokens in evidence.

### 1.2 Test data
- Prefix every rule, team, skill option, macro and ticket subject with `QA AR ` (e.g. rule `QA AR Billing to Sara`, ticket subject `QA AR 001 billing`).
- Departments (created 6 Oct 2026 at the user's request, all with the 4 agents, routing `round_robin`):
  Customer Support `7e1ac409-58b0-41ab-97e1-0e7d5c8c5158` (**default**) · Sales `ef8dc91f-1d30-491d-a1fc-9b62b96eca94` · Marketing `2a73bbc0-efb3-4250-bf9b-2fdc98236794` · HR `08fd8684-c5c0-4d4d-86f9-2be70cf61e53` · Tech `19510fdc-91f3-4a7a-8888-153f1318b765`.
- Tickets module `88e8ea44-1658-4df3-9930-d0902b91073d`.
- Run D/E/F in **Tech** (no one else uses it) and keep Customer Support for E2E.
- Skills options on Tickets: tier_1_support, tier_2_support, escalation_handling, billing, account_management, product_expertise.
- Teams: none. Create `QA AR Team A` (2 agents) and `QA AR Team B` (1 agent) in Tech for F, D5, E3 — blocked while NDC-1910 (team form 400) is open; try the API.

### 1.3 Baseline (restore point)
Saved 6 Oct 2026 in `reference/tavi-baseline-2026-10-06.json`. Before group A, refresh it into the run's `baseline/`:
- `GET /desk/departments`; for each: `GET /desk/assignment-rules?department_id=` (all `{rules:[]}`) and `GET /desk/departments/{id}/team-assignment` (all `{mode:"off", capacity_limit:null, use_backlog:true}`).
- `GET /desk/assignment/notification-settings` (`{notify_agent_on_assignment:true, notify_team_on_assignment:true}`).
- `GET /desk/agent-skills` (no agent has skills), `GET /desk/assignment-backlog` (empty), `GET /desk/teams` (none).
- Ticket Access → Agent availability settings, and each test agent's presence.
Revert = delete every `QA AR` rule, team, ticket and macro; restore team assignment, skills and notifications; prove it with the final diff (§Reporting).

### 1.4 Environment blockers
| Blocker | Rows affected | Action |
|---|---|---|
| **No tickets** on the tenant and **no email channel** | D, E, F, H-write, I-delivery, J, K, E2E | Create tickets through the API / New Ticket form (§0.6). Rows that need an inbound email are Inconclusive until a channel is set up — please configure one support mailbox |
| **No teams**; the team form fails (NDC-1910) | D5, E3, E12, F1–F8, J7, J12 | Inconclusive until a team can be saved |
| Lower-profile account not confirmed | 🔒 rows | Use `mahmoud.mahamed1515` only after its profiles are checked |
| Agent presence cannot be forced from a script | E9, E10, K6 | Sign the agent out (`/desk/agents/me/presence/sign-out`) or wait for the idle timeout; record what presence showed |
| Notification delivery needs real inboxes | I4–I7 | Check in-app bell only; email/SMS Inconclusive |
| Sessions end every 20–30 minutes | all long UI rows | Re-sign-in; do not count a 401 as a product failure unless it happens within a minute of sign-in |

### 1.5 Things that cannot be undone cleanly
- The 5 departments stay; **Customer Support is the default and cannot be deleted**.
- Ticket numbers do not go back; deleted tickets go to the Recycle Bin (purge them, NDC-1637).
- Ticket history keeps owner changes and rule names after the rule is deleted.
- Round-robin position (who is next) is server state — deleting and recreating a rule may reset it; record it.
- Notifications already sent cannot be recalled.

---

## 2 Surface and contract

### 2.1 Admin API (all under `/api/v1`, header `Authorization: Bearer …`, `x-app-key: desk`)
| Method | Path | Body / notes |
|---|---|---|
| GET | `/desk/assignment-rules?department_id={id}` | `{rules:[…]}`; client sorts by `sort_order`, then name |
| POST | `/desk/assignment-rules` | create (body shape from the editor: name, description, is_active, department_id, conditions, pattern, action) |
| PUT | `/desk/assignment-rules/{id}` | update |
| DELETE | `/desk/assignment-rules/{id}` | delete |
| PUT | `/desk/assignment-rules/order` | `{department_id, rule_ids:[…]}` |
| GET | `/desk/assignment-rules/{id}` | **405** today |
| GET / PUT | `/desk/departments/{id}/team-assignment` | `{mode: off\|sequence\|load, capacity_limit: null\|1–1000, use_backlog: bool}` |
| GET | `/desk/agent-skills` | `{skills, skill_options, agents:[{user_id, name, skills}]}` |
| PUT | `/desk/agents/{userId}/skills` | `{skills:[…]}` |
| GET | `/desk/assignment-backlog?department_id=&team_id=` | list + `meta.total_count` |
| POST | `/desk/assignment-backlog/process` | `{}` → assigned / remaining |
| GET / PUT | `/desk/assignment/notification-settings` | `{notify_agent_on_assignment, notify_team_on_assignment}` |
| POST | `/desk/tickets/{id}/assign` | `{owner_id, team_id}` (one of them, or both null to unassign) |
| POST | `/desk/tickets/{id}/pick-up` | |
| POST | `/desk/tickets/bulk/assign` · `/desk/tickets/bulk/pick-up` | per-ticket results `{ticket_id, ok, error}` |
| POST | `/desk/tickets/{id}/move` | department + optional owner / team |
| GET / PUT | `/desk/agents/me/presence` (+ `/heartbeat`, `/sign-out`) | availability |

Permissions: `desk:assignment:manage` (whole page), `desk:ticket:assign`, `desk:ticket:assign_unassigned`, `desk:ticket:view_unassigned`, `desk:ticket:pick_up`, `desk:ticket:bulk`, `desk:ticket:move`, `desk:ticket:share`, `desk:ticket:macro`.

### 2.2 Field register (client limits — the server must enforce the same)
| Field | Kind | Limits / rules |
|---|---|---|
| Rule name | text, required | ≤ 120 ("Keep the name under 120 characters.") |
| Description | text | ≤ 1000 |
| Active | switch | default on |
| Condition field | select | 23 ticket fields; system-managed, owner, team, department, shared_departments and unmapped datatypes excluded |
| Operator | select | text: equals, not_equal_to, contains, does_not_contain, starts_with, ends_with, is_empty, is_not_empty · option: equals, not_equal_to, contains_any_of, is_empty, is_not_empty · multi option: contains, does_not_contain, contains_any_of, is_empty, is_not_empty · number: equals, not_equal_to, is_empty, is_not_empty · boolean: equals |
| Value / Values | text / select / comma list | required unless is_empty / is_not_empty |
| Criteria pattern | text | numbers, and, or, brackets; every condition used once; brackets needed when mixing and/or; empty = all (AND) |
| Assign to | radio | agent (user of the department) · team (team of the department) · round_robin |
| Pool | radio | agents (≥ 1 selected) · team |
| Strategy | radio | sequence · load · skills |
| Capacity per agent | integer | 1–1000 or empty |
| Keep excess tickets in backlog | switch | default on |
| Team Assignment mode | radio | off · sequence · load (+ capacity, backlog) |
| Idle after (Ticket Access) | integer | 1–120 minutes |

### 2.3 Page states and messages (en, verbatim)
- No permission: "You can't manage assignment" / "Assignment rules, team assignment, agent skills and assignment notifications need the "Manage assignment rules" permission. Ask an administrator to add it to your profile."
- No department: "Create a department first — assignment rules and team assignment belong to a department."
- No rules: "No assignment rules yet" / "Tickets in this department stay unassigned until an agent picks them up. Add a rule to assign them automatically."
- No department agents: "This department has no agents yet. Add agents to it under Departments."
- No fields: "The tickets field list could not be loaded, so conditions cannot be edited right now."
- No skill options: "The Skills field of Tickets has no options yet. Add them under Modules & Fields, then assign them to agents here."
- Backlog empty: "Nothing is waiting — every ticket found an agent." Processed: "{{assigned}} assigned, {{remaining}} still waiting."
- Load errors: "The assignment rules could not be loaded." · "The team assignment of this department could not be loaded." · "The agent skills could not be loaded." · "The backlog could not be loaded." · "The assignment notification settings could not be loaded."
- Ownership errors: see `reference/tavi-build-map.md` → Manual assignment.

### 2.4 Data classes
D1 empty · D2 whitespace only · D3 single char · D4 max length (120 / 1000) · D5 max+1 · D6 leading/trailing spaces · D7 case variants (duplicate name) · D8 Arabic · D9 mixed Arabic/Latin + RTL marks · D10 emoji/astral · D11 HTML/script (`<img src=x onerror=alert(1)>`) · D12 SQL-ish (`' OR 1=1 --`) · D13 path/URL chars · D14 zero-width/control chars · D15 numeric edge (0, -1, 1.5, 1000, 1001, 1e9, `١٠`) · D16 date edge (n/a until Z4) · D17 type confusion (number as string, array for scalar, object, null) · D18 unknown key / unknown field key / unknown operator · D19 duplicate (same rule name, same agent twice in a pool) · D20 limit+1 items (many conditions, many rules).

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| A1 | Admin sees the page | Owner → Setup → Automation | "Assignment Rules" listed; page opens with five tabs | `[func]` |
| A2 | No `desk:assignment:manage` — UI | 🔒 `mahmoud.mahamed1515` opens the menu and `/settings/automation/assignment-rules` by URL | Menu item hidden or page shows "You can't manage assignment"; no rule, skill or setting data shown | `[sec]` 🔒 |
| A3 | No permission — API reads | 🔒 GET `/desk/assignment-rules`, `/desk/agent-skills`, `/desk/assignment-backlog`, `/desk/assignment/notification-settings`, `/desk/departments/{id}/team-assignment` | 403 each (rules already 403 on 6 Oct 2026) | `[sec]` 🔒 |
| A4 | No permission — API writes | 🔒 POST / PUT / DELETE rules, PUT order, PUT team-assignment, PUT skills, POST backlog/process, PUT notification-settings | 403 each; baseline unchanged (GET diff) | `[sec]` 🔒 |
| A5 | Assign permission split | Agent with `desk:ticket:assign_unassigned` but not `desk:ticket:assign`: assign an unassigned ticket, then reassign one owned by someone else | First works; second refused "This ticket belongs to another agent. Only a supervisor can reassign it." | `[sec]` 🔒 `[serial]` |
| A6 | Pick up permission | Agent without `desk:ticket:pick_up` | No Pick up button; POST `/pick-up` → 403 | `[sec]` 🔒 |
| A7 | View unassigned | Agent without `desk:ticket:view_unassigned` | Unassigned view / filter / HQ widget hidden or empty; GET of an unassigned ticket refused | `[sec]` 🔒 |
| A8 | Department scope | Agent who is not in Tech opens a Tech ticket, Tech rules by API | Refused / not listed (compare Ticket Access scope setting) | `[sec]` 🔒 |
| A9 | Shared ticket limits | Share a ticket to Sales with Full Access; Sales agent tries Assign | Refused: "Your department's access to this ticket does not allow this." | `[sec]` `[serial]` |
| A10 | Other tenant | Another tenant's token: GET `/desk/assignment-rules?department_id=<NDC id>`, PUT a rule id | 404 / 403; nothing returned or changed | `[sec]` |
| A11 | No / expired / revoked token | Same calls with no bearer, an old bearer, a revoked one | 401; no data | `[sec]` |

## Group B — Rules list

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| B1 | Department picker | Open Rules | Lists the 5 departments; default selected first; switching reloads that department's rules only | `[func]` |
| B2 | Empty state | Department with no rules | Texts of §2.3; New Rule button | `[func]` |
| B3 | List row | Create 3 rules in Tech (agent, team, round robin) | Rows "Rule 1…3", summary "Assign to {{name}}" / "Assign to team {{name}}" / "Round robin · Sequence · 2 agents", "Every ticket" or "N conditions" | `[func]` `[serial]` |
| B4 | Reorder | Move rule 3 up twice | "Order saved."; reload keeps order; PUT `/order` body has all 3 ids | `[func]` `[serial]` |
| B5 | Reorder edges | Move up on the first, down on the last | Buttons disabled; no request | `[func]` |
| B6 | Activate / deactivate | Toggle a rule | Toasts "Rule deactivated." / "Rule activated."; API `is_active` matches | `[func]` `[serial]` |
| B7 | Delete | Delete a rule | Confirm "Delete this rule?" with the name; "Rule deleted."; tickets it assigned keep their owner (check one) | `[func]` `[serial]` |
| B8 | Unknown agent / team | Rule assigns to an agent, then remove that agent from Tech (or delete the team) | Summary "an unknown agent" / "an unknown team"; matching tickets are not assigned to a removed agent | `[func]` `[serial]` |
| B9 | Two tabs reorder | Tab 1 reorders, tab 2 (stale) reorders differently | Last write wins or a conflict message — record which; no rule lost or duplicated | `[conc]` `[serial]` |
| B10 | Many rules | 50 rules in Tech (API) | List renders, order kept, reorder still works; record any server limit | `[data]` `[perf]` |

## Group C — Rule editor (create / edit, no ticket needed)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| C1 | Open / Cancel | New Rule → Cancel; Edit → Cancel; Escape; × | Nothing saved (no POST / PUT) | `[func]` |
| C2 | Name D1–D3, D6 | Empty, spaces, 1 char, padded | D1/D2 "Enter a rule name."; D3 saves; D6 trimmed (check API) | `[data]` |
| C3 | Name D4 / D5 | 120 and 121 chars | 120 saves; 121 "Keep the name under 120 characters."; API refuses 121 too | `[data]` |
| C4 | Name D8–D14 | Arabic, mixed, emoji, `<img …>`, SQL, zero-width | Saved and shown as text; no script runs in list, toast or confirm dialog | `[data]` `[sec]` |
| C5 | Duplicate name D7 / D19 | Same name twice, case variants | Record behaviour (Zoho: allowed); no crash | `[data]` |
| C6 | Description D4 / D5 | 1000 / 1001 chars | 1001 refused "Keep the description under 1000 characters." (UI and API) | `[data]` |
| C7 | Inactive on create | Create with Active off | Saved inactive; skipped by D rows | `[func]` |
| C8 | Field list | Add condition → Field | Exactly the 23 fields of §2.2; no owner, team, department | `[func]` |
| C9 | Operators per kind | Pick Subject, Priority, Skills, Customer Responded, a number field | Operators as §2.2; switching field resets an operator that no longer applies ("This operator does not apply to the field.") | `[func]` |
| C10 | Value required | Operator "is" with empty value | "Enter a value."; is_empty / is_not_empty need no value | `[func]` |
| C11 | Option values | Priority "is any of" | Multi pick from low / medium / high / urgent | `[func]` |
| C12 | Comma list | Subject "is any of"-style values with commas, spaces, duplicates | Record how they are split and stored | `[data]` |
| C13 | Pattern valid | 3 conditions, pattern `1 and (2 or 3)` | Saves; API stores it | `[func]` |
| C14 | Pattern errors | `1 and`, `1 and (2 or 3`, `1 and 4`, `1 and 2` (3 unused), `1 and 2 or 3` | syntax / unknown_condition / missing_condition / ambiguous messages; Save blocked | `[func]` `[data]` |
| C15 | Pattern empty | 3 conditions, empty pattern | All must match (AND) — prove in D9 | `[func]` |
| C16 | Remove a condition used in the pattern | Remove condition 2 | Pattern renumbered or error — record; never saves a dangling reference | `[func]` |
| C17 | Many conditions D20 | 25, 26, 50 conditions | Record the limit; no crash (Zoho: 25 per target) | `[data]` |
| C18 | Assign to agent | Pick agent | Only the department's agents listed; "Pick an agent." if none | `[func]` |
| C19 | Assign to team | Pick team | Only the department's teams; "Pick a team." if none | `[func]` |
| C20 | Round robin pool | Selected agents with none ticked | "Pick at least one agent, or a team." | `[func]` |
| C21 | Capacity D15 | 0, -1, 1.5, 1, 1000, 1001, `١٠`, empty | 1–1000 and empty save; others "Enter a whole number from 1 to 1000, or leave it empty." (UI and API) | `[data]` |
| C22 | Department without agents | Remove all agents from HR, open editor | "This department has no agents yet…" | `[func]` `[serial]` |
| C23 | Edit keeps values | Edit a saved round-robin rule | All fields come back; Save sends PUT, "Rule saved." | `[func]` `[serial]` |
| C24 | Double submit | Click Save twice fast | One rule created | `[conc]` `[serial]` |
| C25 | Stale edit | Tab 1 edits, tab 2 deletes the rule, tab 1 saves | Clear error, no ghost rule | `[conc]` `[serial]` |
| C26 | API type confusion D17 / D18 | POST with `capacity:"5"`, `conditions:{}`, unknown operator, unknown field key, agent of another department, team of another department, user id that does not exist | 400 with a field error each; nothing stored | `[sec]` `[data]` |
| C27 | API department mismatch | POST a rule for Tech whose action names a Sales agent | Refused (the UI only offers Tech agents) | `[sec]` |
| C28 | Session expiry | Let the session expire with the editor open, then Save | Re-sign-in prompt or clear error; no silent loss | `[func]` |
| C29 | Audit log | After C-saves, open Audit Log (entity `assignment_rule`) | Create / update / delete entries with actor and time | `[func]` |
| C30 | Arabic UI | Switch to AR and open the editor | All labels translated, RTL layout, pattern hint readable | `[i18n]` |

## Group D — Rule execution: direct rules `[serial]` (Tech)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| D1 | Every ticket → agent | Rule "Every ticket → Mahmoud Samy"; create a ticket in Tech with no owner / team | Owner = Mahmoud Samy; history "Owner changed" names the rule (record wording) | `[func]` |
| D2 | Criteria match | Priority is high → Samy; ticket with high | Assigned | `[func]` |
| D3 | Criteria miss | Same rule; ticket with low | Stays unassigned (no other rule) | `[func]` |
| D4 | First match wins | Rule 1 high → Samy, rule 2 every ticket → TAVI; high ticket | Samy only; rule 2 skipped | `[func]` |
| D5 | Team | Rule → `QA AR Team A`, Team Assignment Off | Ticket in the team queue, no owner; team notified (I3) | `[func]` |
| D6 | Inactive rule skipped | Deactivate rule 1; high ticket | Rule 2 applies | `[func]` |
| D7 | Ticket arrives with an owner | Create with owner set | Rules do not change it | `[func]` |
| D8 | Ticket arrives with a team | Create with team set | Rules do not change it | `[func]` |
| D9 | AND / OR pattern | Rule `1 and (2 or 3)` with priority / channel / language; 4 tickets covering each truth case | Only the matching ones assigned | `[func]` `[data]` |
| D10 | Operators sweep | One rule per operator kind (text contains / starts / ends, option any-of, multi-option contains, boolean, empty / not empty) | Each matches exactly as defined; Arabic and mixed-case values (D7, D8) | `[data]` |
| D11 | Ticket update does not trigger | Update an unassigned ticket so it now matches a rule | Not assigned (documents Z1) | `[func]` |
| D12 | Other department | Rule in Tech; ticket in Sales | Not assigned by the Tech rule | `[func]` |
| D13 | Moved ticket | Move an unassigned Sales ticket to Tech | Record whether Tech rules run (the move dialog says it "arrives … as a new ticket … unassigned unless you pick someone") | `[func]` |
| D14 | Channels | Tickets from API, New Ticket form, web form, email (if §1.4 allows), import | Rules run for each source — record any source that skips them (compare NDC-1585 on CRM import) | `[func]` |

## Group E — Round robin `[serial]` (Tech)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| E1 | Sequence | Pool Samy, TAVI, mahamed1515; 6 tickets one by one | Each agent gets 2, in a fixed order; record the order | `[func]` |
| E2 | Sequence after pool edit | Remove one agent, add another, 3 more tickets | Record whether the order resets (Zoho: editing the agent list resets it) | `[func]` |
| E3 | Team members pool | Pool = Team A (2 members); 4 tickets | 2 each | `[func]` |
| E4 | Load-based | Give Samy 3 open tickets by hand; load rule; 3 tickets | Go to the agents with the fewest active (open / on hold) tickets | `[func]` |
| E5 | Load counts closed? | Close 2 of Samy's tickets; next ticket | Closed ones no longer count | `[func]` |
| E6 | Skill-based | Samy: billing; TAVI: billing + tier_2; ticket Skills = billing, tier_2 | Only TAVI eligible; with Skills = billing they take turns | `[func]` |
| E7 | Skill-based, nobody eligible | Ticket Skills = escalation_handling (no agent has it) | Backlog with "No eligible agent" (backlog on) or unassigned (off) | `[func]` |
| E8 | Skill-based, ticket has no skills | Ticket with empty Skills | Record: everyone eligible, or nobody | `[func]` |
| E9 | Capacity | Capacity 2; give each agent 2 active tickets; new ticket | Backlog "Everyone at capacity" | `[func]` |
| E10 | Capacity frees up | Close one of Samy's tickets | Backlog ticket goes to Samy within a minute ("whenever an agent frees up") | `[func]` |
| E11 | Backlog off | Same as E9 with backlog off | Ticket stays unassigned; not in Backlog | `[func]` |
| E12 | Offline agent | Sign Samy out (presence offline); 3 tickets | Record whether Samy still gets tickets (Zoho: online only by default — Z8) | `[func]` |
| E13 | Idle agent | Idle timeout 1 minute; leave Samy idle | Same as E12 after idle | `[func]` |
| E14 | Agent removed from department | Remove TAVI from Tech; next tickets | TAVI never chosen | `[func]` |
| E15 | Concurrency | Create 10 tickets in parallel (API) | No agent above capacity; no ticket assigned twice; total = 10 | `[conc]` `[perf]` |
| E16 | Round robin does not override | Ticket created with owner, or assigned by macro / workflow first | Round robin leaves it | `[func]` |

## Group F — Team Assignment `[serial]` (Tech; needs a team — §1.4)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| F1 | Off | Mode Off; rule assigns to Team A | Ticket waits in the team queue, no owner | `[func]` |
| F2 | Round robin | Mode Round robin; 4 tickets to Team A | Members take turns | `[func]` |
| F3 | Load-based | Mode Load-based | Fewest active tickets first | `[func]` |
| F4 | Capacity + backlog | Capacity 1, backlog on, both members full | Backlog (Team column filled); assigned when one frees up | `[func]` |
| F5 | Capacity + no backlog | Backlog off | Ticket stays in the team queue | `[func]` |
| F6 | Manual team assign | Assign a ticket to Team A from the ticket (J7) | Team Assignment picks a member as in F2 / F3 | `[func]` |
| F7 | Capacity D15 | 0, 1001, empty, `abc` (UI and API) | As C21 | `[data]` |
| F8 | Save / reload | Save each mode | "Team assignment saved."; GET matches; other departments unchanged | `[func]` |

## Group G — Agent Skills

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| G1 | List | Open Agent Skills | All agents with "No skills"; search works ("No agents match.") | `[func]` |
| G2 | Edit skills | Give Samy billing + tier_1 | "Skills saved."; GET `/desk/agent-skills` matches | `[func]` `[serial]` |
| G3 | Remove all | Clear Samy's skills | "No skills" | `[func]` `[serial]` |
| G4 | Skill option renamed / removed | Rename or remove a Skills option in Modules and Fields | Agent skills update or show the orphan clearly; skill-based rules still behave (record) | `[func]` `[serial]` |
| G5 | No options | (Do not run on the shared Tickets field — reason only) Field with no options | "The Skills field of Tickets has no options yet…" | `[func]` |
| G6 | API unknown skill | PUT skills `["not_a_skill"]`, `[""]`, 1000 items, a string instead of an array | 400; nothing stored | `[sec]` `[data]` |
| G7 | API other agent | PUT `/desk/agents/{non-agent user}/skills` | 400 / 404 | `[sec]` |
| G8 | Arabic | AR UI | Labels translated; skill values shown as stored | `[i18n]` |

## Group H — Backlog

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| H1 | Empty | Open Backlog | "0 tickets waiting", "Nothing is waiting — every ticket found an agent." | `[func]` |
| H2 | Rows | After E9 | Ticket, Department, Team, Rule, Reason, Queued, Attempts; "Open ticket" opens it | `[func]` |
| H3 | Filter | Department filter Tech / Sales / All | Counts match | `[func]` |
| H4 | Process now | Free capacity, click Process now | "{{assigned}} assigned, {{remaining}} still waiting." | `[func]` `[serial]` |
| H5 | Automatic run | Wait 1–2 minutes after freeing capacity | Assigned without Process now; Attempts grows while still blocked | `[func]` `[serial]` |
| H6 | Order | 3 waiting tickets, free one slot at a time | First come, first served | `[func]` `[serial]` |
| H7 | Ticket changed while waiting | Assign or close a waiting ticket by hand | Leaves the backlog | `[func]` `[serial]` |
| H8 | Rule deleted while waiting | Delete the rule of a waiting ticket | Record: ticket leaves backlog or stays with "Rule" blank; no error | `[func]` `[serial]` |

## Group I — Notifications

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| I1 | Read | Open Notifications | Both switches on (baseline); channels note | `[func]` |
| I2 | Save | Turn one off, Save, reload; restore | "Notification settings saved."; GET matches | `[func]` `[serial]` |
| I3 | Agent notified | Rule assigns to Samy | Samy gets an in-app notification (bell) | `[func]` `[serial]` |
| I4 | Self-assign not notified | Samy picks up a ticket | No notification to Samy | `[func]` `[serial]` |
| I5 | Team notified | Rule → Team A (mode Off) | Every member notified | `[func]` `[serial]` |
| I6 | Switch off honoured | Agent switch off; repeat I3 | No notification | `[func]` `[serial]` |
| I7 | Email / SMS | Per §1.4 | Inconclusive unless real inboxes | `[func]` |

## Group J — Manual assignment

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| J1 | Owner field | Ticket detail → Ticket Owner (Shift + A) | Search; only agents who can own tickets in this department (compare NDC-1897 / NDC-1898) | `[func]` |
| J2 | Assign agent | Pick Samy | Owner shown; history "Owner changed"; Samy notified (I3) | `[func]` `[serial]` |
| J3 | Unassign | Unassign | Owner "Unassigned"; ticket in Unassigned views | `[func]` `[serial]` |
| J4 | Pick up | Unassigned ticket → Pick up | "The ticket is now yours." | `[func]` `[serial]` |
| J5 | Pick up race | Two agents click Pick up at once | One wins; the other "Someone else picked up this ticket first." | `[conc]` `[serial]` |
| J6 | Pick up refused | Pick up a ticket owned by someone else, or outside scope | "You can pick up only unassigned tickets you can see and tickets of your teams." | `[func]` |
| J7 | Team field | Assign to Team A; clear team | Team shown / cleared; agent and team never both set ("A ticket goes to an agent or a team, not both.") | `[func]` `[serial]` |
| J8 | Team of another department | API assign a Tech ticket to a Sales team | "That team doesn't serve this ticket's department." | `[sec]` |
| J9 | Agent of another department | API assign to a user who is not a Tech agent | "This agent can't own tickets in this ticket's department." | `[sec]` |
| J10 | Both owner and team | API `{owner_id, team_id}` both set | 400 "exclusive" | `[sec]` |
| J11 | Bulk Assign To agent | Tick 3 tickets → Assign To → Samy | "3 records assigned to Mahmoud Samy."; each ticket's history | `[func]` `[serial]` |
| J12 | Bulk Assign To team | Teams tab → Team A | All 3 in the team queue | `[func]` `[serial]` |
| J13 | Bulk mixed rights | Include a shared (limited) ticket | "…shared with your department with limited access. Deselect it…" | `[func]` |
| J14 | Bulk partial failure | Include a ticket assigned to someone else (agent without `assign`) | Per-ticket result; others still assigned | `[func]` |
| J15 | Bulk pick up | Bulk pick up 3 unassigned | All mine | `[func]` `[serial]` |
| J16 | Queue card Assign | Agent Queue / Team Queue card → Assign | Same as J2 | `[func]` |
| J17 | Move with assign | Move a Sales ticket to Tech with "Assign to" Samy | Ticket in Tech, status Open, owner Samy; only Tech agents / teams offered ("Only agents and teams of the chosen department are offered.") | `[func]` `[serial]` |
| J18 | Move errors | Same department, inactive department, agent not in the department, both agent and team | Messages from `tickets.moveDialog.errors.*` | `[func]` |
| J19 | Share | Share to Sales (Full / Restricted / Read-only) | Sales cannot change owner or status at any level | `[sec]` `[serial]` |
| J20 | Unassigned views | Unassigned Open Tickets view, Unassigned filter, HQ Unassigned widget | Counts agree with the API | `[func]` |
| J21 | New Ticket default owner | Agent creates a ticket | Owner = the creator (same as Zoho); rules do not run on it (D7) | `[func]` |
| J22 | Read-only banner | Agent opens a colleague's ticket without rights | "You can read this ticket but not change it…" and no assign controls | `[sec]` 🔒 |
| J23 | Macro assign | Macro "Assign to Samy" / "Unassign" on a ticket | Owner set / cleared; "A ticket's owner and team can only be changed with Assign." for other macro field updates | `[func]` `[serial]` |
| J24 | Arabic / RTL | AR UI: picker, bulk bar, move dialog | Translated, RTL, names not mangled | `[i18n]` |

## Group K — Other automation that assigns

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| K1 | Workflow Owner Assignment — user | Workflow on Tickets (On Create) → Owner Assignment specific user | Owner set; record the order against assignment rules (which runs first) | `[func]` `[serial]` |
| K2 | Workflow — role round robin | Owner Assignment → role | Users of the role in turn ("…assigned in a round-robin pattern") | `[func]` `[serial]` |
| K3 | Workflow — user field | Owner from a user field | Owner = that field's user | `[func]` `[serial]` |
| K4 | Workflow on update | Workflow On Update sets owner | Works on update (rules don't — Z1) | `[func]` `[serial]` |
| K5 | SLA escalation reassign | SLA escalation "Assign to an agent / team" | Owner changed at escalation; event row "Reassign"; "The assignee is unavailable" reason when relevant | `[func]` `[serial]` |
| K6 | Assignee unavailable | SLA reassign to an offline agent | Record reason row `reassign_unavailable` / `assignee_unavailable` | `[func]` |
| K7 | Order of automation | Ticket matching a workflow, a rule and a macro | Record which wins; compare Zoho (Direct > Workflow > SLA > Round robin…) | `[func]` `[serial]` |
| K8 | Department "Routing" | Change Tech Routing to Least busy / Skill match with no rules | Record whether anything is assigned; if nothing, the field has no effect (possible bug, missing list note) | `[func]` `[serial]` |
| K9 | Generic module rules | Modules and Fields → Tickets row menu → Assignment Rules | Record whether the generic engine opens for Desk Tickets and how it relates to Settings → Assignment Rules | `[func]` |
| K10 | Agent deactivated | Deactivate an agent who is in a rule and owns tickets | Record what happens to the rule and the tickets (Zoho forces reassignment — NDC-1980) | `[func]` `[serial]` |

## Group L — Security, i18n/RTL, accessibility, performance, compatibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| L1 | Stored XSS | Rule name / description / condition value D11 | Rendered as text in list, editor, backlog "Rule" column, audit log, history | `[sec]` |
| L2 | IDOR on rule id | PUT / DELETE a rule id of another department you cannot manage, or another tenant | 403 / 404 | `[sec]` |
| L3 | Enumeration | GET rules with random department ids | 404 / empty without leaking existence | `[sec]` |
| L4 | Mass assignment | POST a rule with extra keys (`id`, `tenant_id`, `created_by`, `sort_order`) | Ignored or 400 | `[sec]` |
| L5 | CSRF / CORS | Write from another origin | Refused | `[sec]` |
| L6 | Arabic page | AR UI, all five tabs | All strings translated (check `settings.assignment.*` in `ar` locale), RTL layout, numbers and toasts right | `[i18n]` |
| L7 | Keyboard and screen reader | Tabs, editor, Move up/down, switches | Every control reachable; labels "Move {{name}} up", "Rule {{name}} active"; errors announced (`role=alert`) | `[a11y]` |
| L8 | Mobile width | 375 px | Editor usable; no horizontal scroll | `[ui]` |
| L9 | Load | 100 rules in one department; 500 tickets through round robin (API) | Page < 3 s; assignment < 5 s per ticket; no double assignment | `[perf]` |
| L10 | Browsers | Chromium, Edge, Firefox | Same behaviour | `[compat]` |

---

## E2E journeys

| ID | Journey | Expected |
|---|---|---|
| E2E-1 | Billing desk: admin gives Samy and TAVI the "billing" skill → rule in Customer Support "Classification is Billing → Round robin · Skill-based · capacity 2 · backlog on" → 5 billing tickets arrive | 2 each, 5th waits in Backlog "Everyone at capacity"; Samy closes one → 5th goes to Samy; both notified |
| E2E-2 | Team intake: team "QA AR Team A" in Tech, Team Assignment Load-based → rule "Every ticket → Team A" → 4 tickets | Members get 2 each by load; team notified when a ticket lands with no owner (mode Off variant) |
| E2E-3 | Manual triage: tickets arrive with no rules → agent filters Unassigned → bulk Assign To Samy → Samy picks up another → supervisor moves one to Sales with Assign to | Owners correct; history complete; Sales sees only its agents in the move dialog |
| E2E-4 | Negative recovery: rule points at an agent who is then removed from the department → new tickets → admin sees "an unknown agent" → fixes the rule → Process now | No ticket assigned to the removed agent; after the fix new tickets assigned; nothing lost in the backlog |
| E2E-5 | Permission journey: lower-profile agent cannot open Assignment Rules, cannot reassign a colleague's ticket, can pick up unassigned | Messages of §2.3 / J6 / A5 |

---

## Group Z — Gaps (run to confirm they are still missing or now built)

Z1, Z2, Z3, Z4, Z7 and Z11 are in **NDC-1978** (details 1–6). **Z5, Z6, Z8, Z9, Z10, Z12, Z13, Z14 and Z15 are new** (missing list items 5, 6, 8, 9, 10, 12, 13, 14, 15) and are not filed in Plane. "Live" = seen in the Zoho Desk org on 6 Oct 2026 (Enterprise trial); "Docs" = Zoho help / API only. Every Z row is expected to fail until the function is built.

| ID | Gap | How to test | Expected (Zoho) |
|---|---|---|---|
| Z1 | Run on ticket update (NDC-1978 · 1) | D11; look for an "Execute on" option in the editor | Live: "Execute Rule on" Ticket Create (default) / Ticket Update, on direct and round-robin rules |
| Z2 | Move Ticket to (NDC-1978 · 2) | Editor → Assign to | Live: target has "Ticket coming to", Criteria, **Move Ticket to** department, Assign Ticket to |
| Z3 | Business-hours / holiday criteria (NDC-1978 · 3) | C8 | Live: "Execution Time" — during / outside business hours of, on a holiday of, not a holiday of |
| Z4 | Date fields and operators (NDC-1978 · 4) | C8, C9 | Live: Due Date, Created / Modified / Closed Time with is, isn't, is after, is before, between, not between, empty; value "Current Time". Numbers with < > = |
| Z5 | Contact / account / owner / team / tags criteria (item 5) | C8 | Live: 38 ticket fields incl. Ticket Owner, Team, Tags, Contact Name, Account Name, Product Name, Is Overdue, Number of Threads; 26 contact and 14 account fields |
| Z6 | Master switch (item 6) | Rules tab header | Live: "Direct Assignment Rules" and "Round Robin Rules" toggles |
| Z7 | Exclude agents in a team pool (NDC-1978 · 5) | Editor → Round robin → A team's members | Docs: "Exclude agents from this assignment" |
| Z8 | Online-only round robin + offline switch (item 8) | E12, E13; look for the switch | Live: online agents only by default (email channel); preference "Assign tickets to offline agents" |
| Z9 | Department and agent thresholds (item 9) | Look for a department default and per-agent override | Live: "Department wise threshold" (40 here; docs 1–200) and "Agent level threshold" overriding it |
| Z10 | Backlog options (item 10) | Look for per-department switch, limit and order | Live: "Assign backlogs" per department. Docs: 1–50 per run, order by Due Date or Created Time; "Assign tickets on closure" |
| Z11 | Skills management (NDC-1978 · 6) | Look for Skills setup | Live: Skills / Skill Types; skill = type + criteria + agents; docs: auto-add preferences, up to 10 skills per ticket, recalculate |
| Z12 | Workflow assign to team / agent in team (item 12) | Workflow Owner Assignment targets | Docs: Agent / Team / Agent in a Team |
| Z13 | AI owner prediction (item 13) | Look for owner prediction | Docs: Zia Field Predictions on Ticket Owner with accuracy, auto-update or confirm; Professional+ |
| Z14 | Notification rules per department, per channel, templates; department "new ticket" alert (item 14) | I-group; look for templates and department alerts | Live: Notification Rules per department, email + mobile toggles; Department Notifications "Creating a new ticket". Docs: editable templates |
| Z15 | API (item 15) | GET `/desk/assignment-rules/{id}` and the 404 routes of §2.1 note | Docs: get / reorder / on-off rules, routing preferences, skills, skill types, online / offline agents, agent ticket counts |

---

## Traceability

There is no PRD with numbered requirements in Plane (NDC-1254 is empty; NDC-1978 is a plan item). Traceability is to the three Zoho articles, NDC-1978 details and existing defects.

| Area | Scenarios | Related Plane items |
|---|---|---|
| Manual assignment (article 1) | J1–J24, A5–A9, E2E-3, E2E-5 | NDC-1897, NDC-1898, NDC-1780, NDC-1891 |
| Assignment rules — direct (article 2) | B1–B10, C1–C30, D1–D14, Z1–Z6 | NDC-1978 (1–4), NDC-1585 |
| Assignment rules — round robin (article 2) | E1–E16, F1–F8, H1–H8, Z7–Z10 | NDC-1978 (5), NDC-1976, NDC-1975, NDC-1910 |
| Workflows and other automation (article 2) | K1–K10, J23, Z12 | NDC-1980, NDC-1211 |
| Triaging: skills, availability, AI (article 3) | G1–G8, E6–E8, E12–E13, Z8, Z11, Z13 | NDC-1978 (6), NDC-1976 |
| Notifications | I1–I7, Z14 | — |
| API | §2.1, C26, C27, G6, G7, J8–J10, Z15 | — |
| Security | A1–A11, L1–L5 | — |
| i18n, a11y, perf, compat | C30, G8, J24, L6–L10, B10, E15 | — |

Every scenario maps to at least one area; every Z row maps to a missing-list item.

---

## Reporting

- Folder: `executions/<run>/` with `report.md`, API request / response (redacted) and screenshots.
- Evidence rule (user, 4 Oct 2026): **screenshots only for failed rows**, each annotated side by side against live Zoho Desk (TAVI left, Zoho right, table "Behaviour | Zoho | TAVI | Match"). Passed rows get a verdict and one line of text. Reuse `evidence/make-evidence.js`.
- Redaction: never write tokens, cookies or passwords — write `Bearer <len=1263>`. Mask other users' emails.
- Each Fail: steps, expected, actual, evidence, and the existing NDC item it matches (see Traceability) before suggesting anything new. Run the false-positive checklist: permission, department scope, stale SPA cache, revoked or expired token (§0.7), another tester's ticket in the same department, round-robin position left over from an earlier row.
- Coverage gaps restated at the end: 🔒 rows, team rows (NDC-1910) and email rows are Inconclusive while the §1.4 blockers stand.
- Revert proof: after cleanup repeat every §1.3 GET and diff against the baseline. Only expected differences are allowed (Recycle Bin entries if not purged, ticket number counter, audit entries), listed by id. The 5 departments are part of the new baseline.
