# Spec — Desk Workflow Rules

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging). The NDC-2203 retest on 11 Oct 2026 also used `https://desk.anyware.software` (same accounts, same module ids) — record which host each run uses |
| Feature | Setup → Automation → **Workflow Rules** (list, New Rule wizard, rule editor: trigger, conditions, instant and scheduled actions, Test rule), Setup → Automation → **Actions** (saved-action library), **Execution History** (`/settings/workflow-executions`), and what a rule leaves on the ticket (fields, tags, history, tasks, records) |
| Focus | Functional · API (the important endpoints) · UI / UX. Security, i18n, accessibility and performance are covered by a short Group O |
| Plane | **NDC-2203** "Workflow Missings" (gap list) · NDC-1986 (ticket triggers, Phase 2) · NDC-1987 (macros and workflow actions, Phase 3) · NDC-1989 (custom scripts) · parent NDC-1954. Open bugs: **NDC-2205** (On Edit / Field Changed fire on create), **NDC-2204** (Roles = CRM profiles), **NDC-2173** (narrow Name column). NDC-1251 "Workflow Rules" is an empty holder — **no PRD with numbered requirements** |
| Missing list | `docs/desk-workflow-rules/desk-workflow-rules-missing-list.md` (28 items = Z1–Z28) |
| Gap evidence | `docs/desk-workflow-rules/evidence/` — 6 annotated images, shown in `evidence/evidence-report.md` |
| Reference | `reference/tavi-build-map.md` (pages, strings, API, limits) · `reference/zoho-docs-inventory.md` · `reference/zoho-live-notes.md` · `reference/tavi-baseline-2026-10-11.json` (the 4 existing rules, empty action library) |
| Written | 12 Oct 2026, from bundle `index-B6ABKo1E.js` (chunks `pages-Cp9_IlRF.js`, `src-CaDdDRtX.js`), locale `crm-workflow`, the live API (GET only) and the UI, as the owner |
| Status | **Draft for review — do not run until the user says so** |

---

## Feature inventory

### Built in Desk (found 11 Oct 2026)
- **Rules list** — search, module filter, columns Name · Module · Trigger · Mode · Actions · Status · Updated, row menu Edit / Activate / Deactivate / Test rule / Delete, bulk delete to the Recycle Bin, limit 50 rules per module. Covered by B1–B14.
- **New Rule wizard** — Module (8 modules), Rule Name, Description, Layout (All layouts / one layout), "When should this rule be executed?". Covered by C1–C10.
- **Trigger** — *A Record Action*: Create, Edit, Create or Edit, Delete, Field Changed (one watch field). *A Date-Time field*: N minutes, hours or days before or after a date field, counting elapsed time or business hours. Rule mode Recurring / One time. Covered by D1–D12.
- **Conditions** — "All {{module}}" or matching conditions, up to 25, AND / OR toggles, criteria pattern, 21 ticket fields + Tags, operators per type, "changed". Covered by E1–E16.
- **Actions** — instant and scheduled; max 10 per rule; each type once per rule; inline or saved:
  - Field Update, Owner Assignment, Webhook, Email, Task, Create Record, Add Tags, Remove Tags, Send happiness email.
  - Scheduled actions accept only Webhook, Email, Task, Create Record and Send happiness email.
  - Merge fields `${field}`.
  - Covered by F1–F24.
- **Save** — Save / Save & Activate, validation list "Fix these before saving:", conflict "This rule was changed since you opened it", draft resume, audit log. Covered by G1–G10.
- **Execution** — rules run on record events and dates; the actions change the ticket or create records; webhooks run asynchronously with retries. Covered by H, I and J.
- **Saved-action library** — 8 types, Used by, Active, module filter, type fixed after creation. Covered by K1–K10.
- **Test rule** — dry run on a sample record. Covered by L1–L6.
- **Execution History** — list, filters, detail with dispatched actions. Covered by M1–M8.
- **Ticket History and Audit Log** — covered by N1–N5.

### Missing in Desk (Group Z)
- 28 items: triggers Z1–Z7, where a rule applies Z8–Z9, conditions Z10–Z13, actions Z14–Z27, ticket history Z28.
- Already in NDC-2203: Z1–Z5, Z14–Z17, Z19–Z23, Z25, Z26. NDC-2203 lists Cliq for Z24.
- New: Z6–Z13, Z18, Z24 (Slack, Teams, Google Chat), Z27, Z28.

### Not a gap
- Cloning and ordering rules.
- "Changed from / to" operators.
- Task reminders.
- Webhook subscriptions, Supervisor Rules and Schedules (separate Zoho features).
- Rule-count API.
- The Time Entry module.

### Not yet confirmed
- Whether rules run on tickets made by API, import, bulk edit, macros or other rules (H14–H17).
- Whether more than one matching rule runs, and in which order (H9, H10).
- Whether a rule can re-trigger itself (loop, H18).
- How the server detects a stale save (the PATCH body has no version; the UI reacts to error code `CONFLICT`) — G5.

---

## 0 How to run

1. **Order:** §1 preconditions → A → B (read) → C → D → E → F → G → K → L → B-write → H → I → J → M → N → O → E2E → Z. Take the baseline (§1.3) before A and diff it after the last group.
2. **Serial only:** every row that saves a rule or action, and every H, I and J row. Rules are **tenant-wide per module**: a rule saved by one run fires on every ticket anyone creates. Never run two writers at once, and agree a quiet window with the teammates who share the owner account.
3. **Parallel allowed:** A (reads), B (reads), C–F validation rows that end with Cancel, L (dry runs save nothing), M (reads), every API GET row.
4. **Exclusive:** `[perf]` rows run alone.
5. **`[data]` rows** record: field, operator and value (exact bytes for odd input); what the UI showed; what the API stored (GET after save); pass or fail per row.
6. **Tickets:** create test tickets through the Desk web form, the New Ticket form or the API, in the QA department (§1.2). Record each ticket id, number, layout and creation time. One ticket per row unless the row says otherwise.
7. **Wait for async work:** check results by polling, not by sleeping blindly.
   - Webhook, Email, Task and Create Record run asynchronously.
   - Check them with Execution History (`GET /workflow/executions?recordId=`) until every dispatch is Succeeded, Failed or Dead-lettered, or 2 minutes pass.
   - Scheduled and date-time rows give the server up to 2 minutes past the due time.
8. **Sessions:**
   - A new sign-in of the shared owner account revokes the old token (`SESSION_REVOKED`).
   - Use one sign-in per script, and sign in again on a 401.
   - Run long UI rows with the second admin.
   - Report token **lengths** only, never values.
9. **Tools on this machine:** Edge (`channel: 'msedge'`) when bundled Chromium times out. In Git Bash, set `MSYS_NO_PATHCONV=1` before passing `/workflow/...` paths.
10. **Verdicts:** Pass, Fail, Blocked or Inconclusive. A row blocked by §1.4 is **Inconclusive, not Fail**.
11. **Evidence:** screenshots only for **failed** rows, each annotated side by side against live Zoho where Zoho has the behaviour (memory rule). Passed rows get a verdict and one line of text.

---

## 1 Preconditions

### 1.1 Accounts
| Role | Account (from `docs/Credentials/TAVI DESK Credentials.txt`) | Use |
|---|---|---|
| Tenant owner (admin) | `ndc-staging-owner` (user `97be04b6-…`) | All write rows. **Shared with teammates** — see §0.2 |
| Second admin | "Mahmoud TAVI" | Long UI rows, two-tab rows (G4, G5) |
| Agent | "Mahmoud Samy" | Owner / task assignee targets, A rows |
| Lower-profile agent 🔒 | `mahmoud.mahamed1515` | A rows (no `workflow:*` permissions). Confirm its profile first |
| User of another tenant | any throwaway tenant | A10 only |
| Zoho Desk reference | `docs/Credentials/ZOHO DESK Credentials.txt` (CEO), Edge, normal user agent, read only | Side-by-side evidence for failed rows. **Trial expires about 20 Oct 2026** |

### 1.2 Test data
- Prefix every rule, saved action, tag, task and ticket subject with **`QA WF `**, for example rule `QA WF D1 create`, ticket `QA WF H1 001`.
- Tickets module `88e8ea44-1658-4df3-9930-d0902b91073d`; Standard layout `1b55c25d-eb27-4046-afd1-b292398b435b`; Calls module `f7e488b5-0232-42fd-811c-1f24356af653`.
- Departments: run in **Tech** `19510fdc-91f3-4a7a-8888-153f1318b765`. Customer Support `7e1ac409-…` is the default and the teammates use it.
- Every QA rule gets a condition **`Subject starts with "QA WF "`** (plus the row's own condition). QA rules then never touch other people's tickets, and other people's tickets never count in QA results.
- Tags: create `QA WF tag A`, `QA WF tag B`, `QA WF tag C` first (Tags are used as an observable result).
- Email template: one `QA WF template` with `{{recipient_name}}`, `${subject}`, `${recordId}`.
- Webhook receiver: an HTTPS endpoint the server can reach that logs method, headers and body and can be told to answer 200, 4xx, 5xx or hang.
  - **Ask the user before using a public service** (for example webhook.site): it receives ticket data.
  - Without a receiver, the I-webhook rows are Inconclusive.

### 1.3 Baseline (restore point)
Saved 11 Oct 2026 in `reference/tavi-baseline-2026-10-11.json`. Refresh it into the run's `baseline/` before group A:
- `GET /workflow/rules` — 4 Tickets rules by a teammate, all active:
  - On Create with Priority High / Urgent → Add Tag, Field Update, Task, Create Record (Calls)
  - On Edit → Add Tag
  - Field Changed (subject) → Add Tag
  - On Create with Priority Low / Medium → Task (scheduled)
- `GET /workflow/rules?isActive=false` (empty) and `GET /workflow/actions` (empty).
- `GET /workflow/executions?take=50` (keep the newest id, so QA runs can be told apart).
- Tags list and email templates used by the 4 rules.

**Revert:**
- Delete every `QA WF` rule, saved action, tag, task, Calls record and ticket.
- Purge them from the Recycle Bin.
- Set any teammate rule you were allowed to switch off back to its baseline `isActive`.
- Prove it with the final diff (see Reporting).

### 1.4 Environment blockers
| Blocker | Rows affected | Action |
|---|---|---|
| **The 4 teammate rules fire on every new ticket** (all four priorities on create, any edit, any subject change). QA tickets get extra tags, tasks and Calls records, and rows that count side effects become unreliable | H, I, J, E2E | **Ask the user / the teammate** whether the 4 rules may be deactivated during the run (and reactivated after, checked by the baseline diff). If not, every count-based row compares against the expected extra effects of those 4 rules and says so |
| Shared owner account (teammates sign in too) | all write rows | Agree a time window; re-sign-in on `SESSION_REVOKED` |
| No webhook receiver | I12–I17 | Inconclusive until the user approves a receiver (§1.2) |
| Email delivery needs a real inbox and a template | I18–I21 | Use an internal user whose mailbox QA can read; otherwise check the dispatch status only and mark delivery Inconclusive |
| Happiness email needs Customer Happiness ratings and the Ticket Closed email switched on | I28–I30 | Check Setup → Customer Happiness; if off, expect "nothing is sent" (that is the documented rule) and mark delivery Inconclusive |
| Business-hours counting needs Company → Business Hours | J5, J6 | If none, expect elapsed time ("without them the rule counts elapsed time instead") |
| No tenant to test cross-tenant | A10 | Inconclusive until one exists |

### 1.5 Things that cannot be undone cleanly
- Ticket numbers do not go back; deleted tickets, rules and actions go to the Recycle Bin (purge them).
- Execution History rows and ticket history lines stay after the rule is deleted.
- Emails, webhooks and in-app notifications already sent cannot be recalled.
- A One-time rule remembers which records it already fired on; deleting and recreating the rule may reset that — record it.
- Scheduled actions already queued are cancelled when a rule is deleted (documented); a rule that is only deactivated — record what happens (J9).

---

## 2 Surface and contract

### 2.1 API (all under `/api/v1`, header `Authorization: Bearer …`, `x-app-key: desk`). Envelope `{success, data, error:{code,message}, meta}`
| Method | Path | Body / notes | Priority |
|---|---|---|---|
| GET | `/workflow/rules?moduleId=&isActive=&skip=&take=` | list | **High** |
| GET | `/workflow/rules/{id}` | one rule, includes `version` | **High** |
| POST | `/workflow/rules` | `{moduleId, layoutId, name, description, trigger, criteria, mode, actions[], isActive}` → toast "Workflow rule saved successfully" | **High** |
| PATCH | `/workflow/rules/{id}` | `{name, description, layoutId, trigger, criteria, mode, actions, isActive}` (no version in the body); stale → `error.code = CONFLICT` | **High** |
| DELETE | `/workflow/rules/{id}` | to the Recycle Bin; scheduled actions cancelled | **High** |
| POST | `/workflow/rules/{id}/activate` · `/deactivate` | "Workflow rule activated" / "deactivated" | **High** |
| PUT | `/workflow/rules/reorder` | `{moduleId, orderedRuleIds}` → "Rule order saved" | Medium |
| POST | `/workflow/rules/{id}/execute` | test run of a saved rule (needs `workflow:rule:execute`) | Medium |
| POST | `/workflow/rules/evaluate` | test run of a draft | Medium |
| GET / POST / PATCH / DELETE | `/workflow/actions[/{id}]` | saved actions; list filters `moduleId`, `type`, `isActive` | **High** |
| GET | `/workflow/actions/{id}/usage` | rules that use the action | Medium |
| GET | `/workflow/executions?ruleId=&assignmentRuleId=&recordId=&skip=&take=` · `/{id}` | execution history (outcome, dispatches) | **High** |
| GET | `/modules/{moduleId}/fields` | fields the editor offers | Low |

Trigger kinds: `RecordCreated`, `RecordUpdated`, `RecordCreatedOrUpdated`, `RecordDeleted`, `SpecificFieldChanged` (`fieldName`), `DateFieldRelative` (`dateFieldName`, `offsetSeconds`, `offsetMode` wall_clock / business_hours).

Criteria kinds: `Comparison`, `StringMatch`, `Membership`, `Existence`, `Logical`, `Changed`, `ChangedFrom`, `ChangedTo`, `NotContains`, `Between`.

Action types: `FieldUpdate`, `OwnerAssignment`, `Webhook`, `Email`, `Task`, `CreateRecord`, `AddTags`, `RemoveTags`, `SendHappinessEmail`; `CustomFunction` is coded but off ("Phase 4").

Permissions: `workflow:rule:view`, `workflow:rule:manage`, `workflow:rule:execute`, `workflow:action:view`, `workflow:action:manage`, `workflow:execution:view`.

### 2.2 Field register (client limits — the server must enforce the same)
| Field | Kind | Limits / rules |
|---|---|---|
| Module | select, required | Tickets, Contacts, Accounts, Products, Calls, Events, Tasks, Contracts — "Pick a module." |
| Rule name | text, required | "Give the rule a name." Max length not stated in strings — find it (C4) |
| Description | text | optional |
| Layout | select | All layouts (default) or one layout of the module |
| Trigger | radio | §2.1 kinds; Field Changed needs a watch field ("Pick the field to watch."); Date-Time needs a date field ("Pick the date field for the trigger.") — "This module has no date fields, so it cannot use a date trigger." |
| Offset | number + unit + direction + counting | Minutes / Hours / Days, before / after, Elapsed time / Business hours |
| Rule mode | radio | Recurring (default) / One time |
| Conditions | list | 0–25 ("Limit reached — a rule can have at most 25 conditions."); incomplete → "Complete the incomplete conditions." |
| Criteria pattern | text | numbers, and, or, brackets |
| Actions | list | 1–10 ("Add at least one action." / "Limit reached — a rule can have at most 10 actions."); each type once ("Every action type is already added…"); identical actions → "Two actions are identical — remove or change the duplicate." |
| Scheduled delay | number + hours / days | Webhook, Email, Task, Create Record, Send happiness email only |
| Email | recipients ≥ 1 (users, roles, user fields), template required | "Every Email action needs at least one recipient." / "Select a template for the Email action (it supplies the subject and body)." |
| Owner Assignment | Users / Roles / User Fields, required | "Pick who the Owner Assignment action assigns the record to." |
| Create Record | target module + layout + required fields | "Pick a target module for the Create Record action." / "Fill in every field on the Create Record action — required fields can't be empty." |
| Add / Remove Tags | ≥ 1 tag; Add = append / replace | "Select at least one tag for the Add Tags action." · Remove Tags not allowed on Delete or Date triggers |
| Webhook | method POST / PUT / PATCH, URL, timeout seconds, headers, body template | async; retries on 5xx; 4xx is final |
| Task | title required, description, due (specific date / trigger date + N days), status, priority, assignee (default record owner), Notify Assignee | no reminder in Desk |
| Rules per module | — | 50 ("Limit reached — a module can have at most 50 rules.") |

### 2.3 Page states and messages (en, verbatim)
- No view permission: "You don't have permission to view workflow rules" / "Ask a tenant administrator to grant you 'workflow:rule:view'."
- No manage permission (editor): "You don't have permission to author workflow rules" / "…grant you 'workflow:rule:manage'." Row menu hints: "Requires workflow:rule:manage", "Requires workflow:rule:execute".
- History: "You don't have permission to view execution history" / "…grant you 'workflow:execution:view'."
- Empty list: "No workflow rules yet" / "Create a rule to automate field updates, owner assignment, emails, tasks, and more when records change." Filtered: "No matching rules" / "No workflow rules match your search or filter."
- Delete: "Delete workflow rule "{{name}}"? This cannot be undone." Bulk: "Delete {{count}} workflow rules?" / "The {{count}} selected rules will be moved to the Recycle Bin and their scheduled actions cancelled." / "{{count}} rules deleted" / "{{deleted}} deleted, {{failed}} failed".
- Editor: "Fix these before saving:" · "Rule changed" / "This rule was changed since you opened it. Reload the latest version? Your unsaved changes will be lost." · "Resume your draft?" · "Discard draft?" · "Rule not found" / "This workflow rule doesn't exist or you no longer have access to it."
- Saved action: "This saved action is inactive — it will be skipped when the rule runs." · "This saved action no longer exists — pick another." · "No saved actions for this module yet — create one in Settings → Automation → Actions."
- Test: "Criteria matched" / "Did not match" / "evaluated in {{ms}}ms" / "Async actions queued ({{count}})".
- Execution History: "No executions yet" / "Workflow runs appear here once a rule fires." · outcomes Pending, Fired, No match, Failed · dispatch status Pending, In progress, Succeeded, Failed, Dead-lettered, Cancelled.

### 2.4 Data classes
Use D1–D20 from `Suit 1/_COMMON.md` §5 (empty, whitespace, 1 char, max, max+1, padded, case variants, Arabic, mixed RTL, emoji, HTML/script, SQL-ish, URL chars, zero-width, numeric edge, date edge, type confusion, unknown key, duplicate, limit+1). Extra for this feature: **D21 merge-field edge** (`${unknown_field}`, `$${`, `${subject`, nested `${${x}}`, 10 kB body) · **D22 URL edge** (http://, localhost, 127.0.0.1, 169.254.169.254, internal hostnames, IDN, 2 kB URL).

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| A1 | Admin sees the pages | Owner → Setup → Automation | "Workflow Rules" and "Actions" listed; both open | `[func]` |
| A2 | No view permission — UI | 🔒 user opens the menu and `/settings/automation/workflow-rules`, `/settings/automation/actions`, `/settings/workflow-executions` by URL | Menu items hidden; each page shows its no-permission message (§2.3); no rule data in the page or network | `[sec]` `[ui]` 🔒 |
| A3 | No permission — API reads | 🔒 GET rules, one rule, actions, usage, executions | 403 each, no data | `[api]` `[sec]` 🔒 |
| A4 | No permission — API writes | 🔒 POST / PATCH / DELETE rule, activate, deactivate, reorder, POST / PATCH / DELETE action | 403 each; baseline unchanged (GET diff) | `[api]` `[sec]` 🔒 |
| A5 | View but not manage | User with `workflow:rule:view` only | List visible; New Rule, Edit, Activate, Delete disabled with "Requires workflow:rule:manage"; editor URL shows "You don't have permission to author workflow rules"; PATCH → 403 | `[sec]` `[ui]` 🔒 |
| A6 | Manage but not execute | User without `workflow:rule:execute` | "Test rule" disabled ("Requires workflow:rule:execute"); POST `/execute` → 403 | `[sec]` 🔒 |
| A7 | Actions permissions | User without `workflow:action:manage` | Actions page read-only; POST `/workflow/actions` → 403 | `[sec]` 🔒 |
| A8 | Execution history permission | User without `workflow:execution:view` | Page shows its message; GET `/workflow/executions` → 403 | `[sec]` 🔒 |
| A9 | CRM rules not visible in Desk | GET `/workflow/rules` with `x-app-key: desk` | Only `appKey: desk` rules; no CRM rules (record `appKey` of each) | `[api]` `[sec]` |
| A10 | Other tenant | Another tenant's token: GET a rule id from this tenant, PATCH it, GET its executions | 404 / 403; nothing returned or changed | `[api]` `[sec]` |
| A11 | No / expired / revoked token | Same calls without a bearer, with an old one, with a revoked one | 401; no data | `[api]` `[sec]` |

## Group B — Rules list

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| B1 | List renders | Open the page | Title, subtitle, New Rule, search, "All modules", columns Name · Module · Trigger · Mode · Actions · Status · Updated; the 4 baseline rules match the API | `[func]` `[ui]` |
| B2 | Trigger column text | Compare each row with its `trigger` | On Create / On Edit / On Create or Edit / On Delete / "Field Changed: {{field}}" / "{{amount}} {{unit}} {{direction}}" (+ "· business hours") | `[func]` |
| B3 | Search | Type part of a name, a name in another case, Arabic, nonsense | Filters as you type; case-insensitive (record); "No matching rules" for nonsense | `[func]` `[ui]` |
| B4 | Module filter | Pick each module | Only that module's rules; empty modules show the filtered empty state; URL / state after reload (record) | `[func]` |
| B5 | Empty state | Filter to a module with no rules | "No workflow rules yet" texts with New Rule (§2.3) | `[ui]` |
| B6 | Long name | Rule with a 120-char name with no spaces (NDC-2173) | Name truncates with an ellipsis and a tooltip; it does not break into a tall stack — **regression NDC-2173** | `[ui]` `[serial]` |
| B7 | Row menu | Open ⋯ on a row | Edit, Activate or Deactivate, Test rule, Delete | `[ui]` |
| B8 | Activate / deactivate from the list | Toggle a QA rule | Toast "Workflow rule deactivated" / "activated"; Status badge changes; `isActive` in the API matches | `[func]` `[api]` `[serial]` |
| B9 | Delete one | Delete a QA rule | Confirm "Delete workflow rule "…"? This cannot be undone."; row gone; rule in the Recycle Bin (record — the dialog says "cannot be undone" but bulk text says Recycle Bin) | `[func]` `[serial]` |
| B10 | Bulk delete | Select 2 QA rules → Delete (2) | "Delete 2 workflow rules?" / "…moved to the Recycle Bin and their scheduled actions cancelled."; "2 rules deleted" | `[func]` `[serial]` |
| B11 | Bulk delete partial | Select 2, delete one of them by API first, then confirm | "1 deleted, 1 failed" (or equivalent); list refreshed | `[func]` `[conc]` `[serial]` |
| B12 | Restore from Recycle Bin | Restore the rule from B9 | Rule back with its actions, inactive or active (record); its scheduled actions are not resurrected | `[func]` `[serial]` |
| B13 | Reorder | `PUT /workflow/rules/reorder` with the QA rules reversed | "Rule order saved"; `position` matches; list order matches; record whether the UI has any reorder control | `[api]` `[serial]` |
| B14 | 50-rule limit | Create QA rules by API up to 50 on Tickets (counting the 4 baseline) | At 50: New Rule disabled with "Limit reached — a module can have at most 50 rules."; POST #51 refused by the API too | `[data]` `[api]` `[serial]` |

## Group C — New Rule wizard

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| C1 | Open / Cancel | New Rule → Cancel; Escape; reopen | Nothing saved (no POST) | `[func]` |
| C2 | Module list | Open Module | Tickets, Contacts, Accounts, Products, Calls, Events, Tasks, Contracts (scroll to the end, record any more); search works | `[func]` `[ui]` |
| C3 | Required fields | Next with no module / no name | "Pick a module." / "Give the rule a name." | `[func]` |
| C4 | Name D1–D6 | Empty, spaces, 1 char, 255, 256, 1000 chars, padded | Find the max length; padded name trimmed (API); spaces-only refused | `[data]` |
| C5 | Name D8–D14 | Arabic, mixed RTL, emoji, `<img src=x onerror=alert(1)>`, SQL, zero-width | Saved and shown as text everywhere (list, editor header, toasts, history); no script runs | `[data]` `[sec]` |
| C6 | Duplicate name | Same name twice, case variants | Record (Zoho allows it); no crash | `[data]` |
| C7 | Description | Empty, 1000 and 5000 chars, HTML | Saved as text; record any limit | `[data]` |
| C8 | Layout scope | All layouts vs Standard | Hints shown ("This rule applies to records on every layout…" / "…only to records created with this layout…"); field pickers follow the layout | `[func]` `[ui]` |
| C9 | Draft resume | Start a rule, fill some parts, close the tab, open New Rule for the same module | "Resume your draft?" with Resume / Start fresh; Resume restores everything; Start fresh → "Discard draft?" | `[func]` `[ui]` |
| C10 | Wizard → editor | Next → Create | Opens the editor canvas (When → Condition → Action); record whether a rule is already stored at this point (GET) | `[func]` `[api]` |

## Group D — Trigger (editor "When")

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| D1 | Record actions | Open When | Create · Edit · Create or Edit · Delete · Field Changed; summary sentence changes per choice ("This rule will be executed when a record in Tickets is …") | `[func]` `[ui]` |
| D2 | Field Changed needs a field | Pick Field Changed, Save with no watch field | "Pick the field to watch." | `[func]` |
| D3 | Watch-field list | Open WATCH FIELD | Record the list; compare with the condition field list (E2) | `[func]` |
| D4 | Date-Time needs a field | Pick A Date-Time field, no field | "Pick the date field for the trigger." | `[func]` |
| D5 | Date fields offered | Open Date field on Tickets | Only date / date-time fields (Due Date, Created Time, Closed Time, Response Due Date …) — record | `[func]` |
| D6 | Module without date fields | Pick a module with no date field (find one) | "This module has no date fields, so it cannot use a date trigger." | `[func]` |
| D7 | Offset values D15 | 0, -1, 1.5, 1, 59, 60 minutes, 1000 days, empty, `١٠` | Record what is accepted; API `offsetSeconds` = amount × unit; nonsense refused in UI and API | `[data]` `[api]` |
| D8 | Counting mode hints | Switch Elapsed time / Business hours | Hint texts shown; summary adds "business" | `[ui]` |
| D9 | Rule mode | Recurring ↔ One time | Descriptions shown; `mode` in the API | `[func]` `[api]` |
| D10 | Delete + Remove Tags | Trigger Delete, action Remove Tags | "Remove Tags can't run on a rule triggered by a deleted record or by a date…"; same for Date trigger | `[func]` |
| D11 | Score value hidden | Look for "Score value" | Not offered (Phase 5 flag); API POST with an unknown trigger kind → 400 | `[func]` `[api]` |
| D12 | Done / collapse | Click Done | Panel collapses to the summary; values kept | `[ui]` |

## Group E — Conditions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| E1 | All vs matching | Switch "All Tickets" / "Tickets matching certain conditions" | "No conditions — actions run on every event of this trigger."; API `criteria` null / set | `[func]` `[api]` |
| E2 | Field list | Open the field picker | 21 fields: Subject … Approval Status + Tags; search filters; compare with Z12 | `[func]` |
| E3 | Operators per type | Subject, Priority, Skills, Due Date, Ticket Owner, Contact, Tags | Operators as §2.1 build map; switching field resets the operator | `[func]` |
| E4 | Values | Pick list values as chips; text; date picker; user picker; lookup search | Values stored with the right `kind` (string / timestamp / …) | `[func]` `[api]` |
| E5 | Field with no options | A pick-list field with no options | "This field has no options configured, so a value must be typed…" | `[ui]` |
| E6 | Required value | "equals" with empty value | Condition marked Incomplete; Save → "Complete the incomplete conditions." | `[func]` |
| E7 | AND / OR toggle | 3 conditions, toggle connectors | Pattern updates; summary shows and / or | `[func]` |
| E8 | Pattern valid | `(1 and 2) or 3` | Saved; API `criteria` is a `Logical` tree that matches | `[func]` `[api]` |
| E9 | Pattern errors | `1 and`, `(1 and 2`, `1 and 4`, `1 and 2` (3 unused), `1 and 2 or 3` | Error message for each; Save blocked — record wording | `[func]` `[data]` |
| E10 | Remove a condition used in the pattern | Remove condition 2 | Pattern renumbered or error; never a dangling reference | `[func]` |
| E11 | 25-condition limit | Add 25, then the 26th | "Limit reached — a rule can have at most 25 conditions."; API refuses 26 | `[data]` `[api]` |
| E12 | "changed" operator | Subject changed (on an Edit rule) | Saved as `Changed`; meaning tested in H6 | `[func]` |
| E13 | Tags condition | Tags contains any of / all of / none of | Saved; merged / deleted tag shown as "Deleted tag" | `[func]` |
| E14 | Address field | A whole address field | "A condition on a whole address does not work. Pick one part of it instead…" (on a module that has one) | `[ui]` |
| E15 | Value D8–D14 | Arabic, emoji, HTML, zero-width in a text value | Stored exactly; matched exactly (H4) | `[data]` |
| E16 | API-only kinds | POST criteria with `ChangedFrom`, `ChangedTo`, `NotContains`, `Between` | Record: accepted and evaluated, or 400. If accepted, the UI must still open the rule (summary shows "changed from …") | `[api]` |

## Group F — Actions (editor)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| F1 | Picker — instant | Add action on an empty rule | 9 types (Field Update … Send happiness email); "Or use a saved action" | `[func]` `[ui]` |
| F2 | Picker — scheduled | Add scheduled action | Webhook, Email, Task, Create Record, Send happiness email only | `[func]` |
| F3 | One action per type | Add Field Update, then open the picker | Field Update no longer offered; once all are used: "Every action type is already added…". **Check the possible bug:** Add Tags, Task, Create Record were still offered on a rule that had them | `[func]` |
| F4 | 10-action limit | Add 10 (instant + scheduled) | "Limit reached — a rule can have at most 10 actions."; API refuses 11 | `[data]` `[api]` |
| F5 | No action | Save with no action | "Add at least one action." | `[func]` |
| F6 | Field Update | Add Status, Priority, Description, a date-only field, an address field | Only writable fields offered ("No writable fields available…" otherwise); address hint "Fill only the parts to change…"; empty address → "Fill at least one part of the address ({{field}})." | `[func]` |
| F7 | Field Update read-only fields | API POST a FieldUpdate on Ticket Number, Created Time, a formula | Refused (cf. CRM bug NDC-1437) | `[api]` `[sec]` |
| F8 | Owner Assignment | Users / Roles / User Fields | Users = Desk agents; **Roles must be Desk roles (CEO, Manager), not CRM profiles — regression NDC-2204**; User Fields = user-type fields; hint "The users in the role will be assigned in a round-robin pattern." | `[func]` |
| F9 | Webhook form | Method, URL, timeout, headers, body | POST / PUT / PATCH only; URL required; header add / remove; body placeholder | `[func]` `[ui]` |
| F10 | Webhook URL D22 | http://, localhost, 127.0.0.1, 169.254.169.254, internal host, 2 kB URL | Record UI + API behaviour; internal / metadata addresses must be refused (O3) | `[data]` `[sec]` |
| F11 | Email form | No recipient; no template; recipients of each kind | "Every Email action needs at least one recipient." / "Select a template…"; free-text address not accepted | `[func]` |
| F12 | Task form | Title empty; due Specific date / Trigger date + N; status, priority; assignee empty | "Title" required; assignee hint; no Reminder field in Desk | `[func]` |
| F13 | Create Record form | Target module Calls → layout → required fields | Required fields added automatically; empty required → "Fill in every field…"; layout list for multi-layout modules; deleted layout → "Layout no longer exists ({{id}})" | `[func]` |
| F14 | Add Tags | No tag; Append vs Replace | "Select at least one tag for the Add Tags action."; mode stored `append` / `overwrite` | `[func]` |
| F15 | Remove Tags | No tag | "Select at least one tag for the Remove Tags action." | `[func]` |
| F16 | Send happiness email | Add it | Three info texts (once per ticket, nothing sent while ratings are off) | `[ui]` |
| F17 | Merge fields | Insert field in Task title, webhook body | `${subject}` inserted; `${recordId}`, `${moduleId}` listed; `$${` literal | `[func]` |
| F18 | Merge-field edge D21 | `${unknown}`, `${subject`, `$${x}`, 10 kB body | Saved; rendered as documented ("a missing field renders empty") — proved in I | `[data]` |
| F19 | Duplicate identical actions | API POST two identical actions (types allowed twice by API?) | "Two actions are identical…" in UI; API behaviour recorded | `[api]` |
| F20 | Use a saved action | Switch an action to "Use a saved action", pick one | "Configuration resolves live from the library action."; badge "saved" | `[func]` |
| F21 | Saved action from another module | Library has only Contacts actions | "Your saved actions belong to other modules — a rule can only use actions saved for its own module." | `[func]` |
| F22 | Saved slot empty | "Use a saved action" with nothing picked → Save | "Pick a saved action for each "Use a saved action" slot." | `[func]` |
| F23 | Remove action | Remove one | Gone from the list; picker offers the type again | `[func]` |
| F24 | Delay values | Scheduled action delay 0, 1 hour, 30 days, -1, 1.5 | Record accepted values; API `delaySeconds` | `[data]` `[api]` |

## Group G — Save, concurrency, audit

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| G1 | Save | Valid rule → Save | Toast "Workflow rule saved successfully"; back to the list; GET returns exactly what was entered | `[func]` `[api]` `[serial]` |
| G2 | Save & Activate | New inactive rule → Save & Activate | Saved and active | `[func]` `[serial]` |
| G3 | Validation list | Break several things → Save | "Fix these before saving:" lists each problem; nothing sent | `[func]` `[ui]` |
| G4 | Double submit | Click Save twice fast | One rule created | `[conc]` `[serial]` |
| G5 | Stale edit (two tabs) | Tab 1 and tab 2 open the same QA rule; tab 2 saves; tab 1 saves | Tab 1 gets "Rule changed" with Reload latest; no silent overwrite. Record how the server knows (no version in the body) and the HTTP code | `[conc]` `[api]` `[serial]` |
| G6 | Edit after delete | Tab 1 edits, tab 2 deletes, tab 1 saves | Clear error; no ghost rule; "Rule not found" on reload | `[conc]` `[serial]` |
| G7 | API partial body | PATCH with only `{name}` | Record: only the name changes, or 400; actions never wiped | `[api]` `[serial]` |
| G8 | API type confusion D17 / D18 | POST with `actions:{}`, `trigger:"x"`, unknown action type, `CustomFunction`, unknown field, tag id of another tenant, user id that does not exist, `moduleId` of a CRM module | 400 with a clear error each; nothing stored | `[api]` `[sec]` `[data]` |
| G9 | Session expiry | Let the session end with the editor open, then Save | Sign-in prompt or clear error; draft kept (C9) | `[func]` |
| G10 | Audit log | After G1–G6, open Audit Log (entity workflow_rule, saved_action) | Create / update / delete / activate entries with actor, time and a link back to the rule | `[func]` |

## Group H — Execution: record triggers and conditions `[serial]`

Every rule here has the guard condition `Subject starts with "QA WF "` and one observable action (Add Tags `QA WF tag A` unless stated). "Fires" = tag present and an Execution History row with outcome Fired for that record.

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| H1 | On Create | Rule Create; create a QA ticket | Fires once | `[func]` |
| H2 | On Create does not fire on edit | Edit that ticket | No second run of the Create rule | `[func]` |
| H3 | On Edit fires on edit only | Rule Edit; create a ticket, then edit it | **Does not fire on create** (regression NDC-2205); fires once on the edit | `[func]` |
| H4 | Field Changed | Rule Field Changed (Priority); create; change Subject; change Priority | Fires only on the Priority change — **not on create (NDC-2205)**, not on Subject | `[func]` |
| H5 | Create or Edit | Rule Create or Edit | Fires on create and on each edit (Recurring) | `[func]` |
| H6 | "changed" condition | Edit rule with "Status changed" | Fires on a status change, not on other edits | `[func]` |
| H7 | On Delete | Rule Delete with a Webhook or Task action; delete a QA ticket | Fires; action runs with the deleted ticket's values | `[func]` |
| H8 | Condition match / miss | Priority is one of high; tickets with high and low | Fires for high only; low → no Fired row (or "No match") | `[func]` |
| H9 | Two rules match | Two QA rules on Create, each adds a different tag | Both fire (Zoho runs all matching rules) — record order and whether `position` matters | `[func]` |
| H10 | Order matters? | Rule 1 sets Priority urgent, rule 2 has condition Priority urgent | Record whether rule 2 sees rule 1's change; reorder (B13) and repeat | `[func]` |
| H11 | Inactive skipped | Deactivate a QA rule; create a ticket | No run | `[func]` |
| H12 | One-time mode | One time + Create or Edit; create, edit, edit | Fires once only | `[func]` |
| H13 | Layout scope | Rule scoped to a second ticket layout (if one exists); ticket on Standard | Does not fire; fires on the scoped layout | `[func]` |
| H14 | Created by API | Create a QA ticket by API | Record whether rules run (Zoho: not documented) | `[func]` `[api]` |
| H15 | Bulk edit / import | Bulk-update 3 QA tickets; import 2 | Record whether Edit / Create rules run, and how many runs | `[func]` |
| H16 | Changed by a macro | Run a macro that edits a QA ticket | Record whether Edit rules run | `[func]` |
| H17 | Changed by another rule | Rule A (Create) sets Priority; Rule B (Field Changed Priority) adds a tag | **Expected per NDC-2205: a workflow's own update is not an edit** — record | `[func]` |
| H18 | Loop guard | Rule Edit → Field Update Description = "${description}x" | Does not loop forever; record how many runs | `[func]` |
| H19 | Duplicate runs | Create one QA ticket with one Create rule | **Exactly one** Execution History row (possible bug: every rule logged twice) | `[func]` |
| H20 | Unicode match | Condition Subject contains Arabic / emoji (E15) | Matches exactly; no false match on similar text | `[data]` |

## Group I — Execution: action results `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| I1 | Field Update text | Set Description = "QA WF ${subject}" | Ticket shows the rendered text; history line | `[func]` |
| I2 | Field Update pick list / status | Set Priority urgent, Status On Hold | Values set; SLA / status side effects as for a manual change | `[func]` |
| I3 | Field Update date-only | Set a date-only field | Stores the date, not a timestamp (cf. NDC-1438) | `[func]` |
| I4 | Field Update address part | Change City only | Other parts kept (cf. NDC-1436) | `[func]` |
| I5 | Field Update before save | Create rule sets a required-looking field | Record: the value is in the first saved version ("before it's saved") | `[func]` |
| I6 | Owner — user | Assign to Mahmoud Samy | Owner set; assignment notification follows the Assignment settings | `[func]` |
| I7 | Owner — user field | Assign to "Created By" | Owner = creator | `[func]` |
| I8 | Owner — role round robin | Assign to role Manager (Desk role); 3 tickets | Owners rotate among the role's users; **not CRM profiles (NDC-2204)** | `[func]` |
| I9 | Owner — inactive / removed user | Target user deactivated | Action fails cleanly; Execution History shows Failed with a reason; ticket not broken | `[func]` |
| I10 | Owner vs Assignment rules | QA Assignment rule and Owner workflow both apply | Record which wins (Zoho: assignment first, then workflow) | `[func]` |
| I11 | Webhook POST | Receiver answers 200 | One request: method, URL, headers, body with merge fields rendered; dispatch Succeeded, HTTP 200 | `[func]` `[api]` |
| I12 | Webhook PUT / PATCH | Same with PUT, PATCH | Method honoured | `[func]` |
| I13 | Webhook 5xx retry | Receiver answers 500 twice, then 200 | Retries; attempts count in history; finally Succeeded | `[func]` |
| I14 | Webhook 4xx | Receiver answers 404 | No retry ("4xx is terminal"); Failed with HTTP 404 | `[func]` |
| I15 | Webhook timeout | Receiver hangs past the timeout | Failed / retried per policy; record attempts and the last error | `[func]` |
| I16 | Webhook always fails | Receiver always 500 | Dead-lettered after N attempts — record N and the timing | `[func]` |
| I17 | Webhook body D21 | Unknown field, `$${`, 10 kB body, JSON special chars in subject | Missing field renders empty; JSON stays valid (subject with `"` escaped) | `[data]` |
| I18 | Email to a user | Template + one user | Dispatch Succeeded; mail arrives with `{{recipient_name}}` and `${subject}` rendered | `[func]` |
| I19 | Email to a role / user field | Role Manager; user field Ticket Owner | One mail per resolved user; empty owner → record | `[func]` |
| I20 | Email template deleted | Delete the template, fire | Failed with a reason (Zoho fails silently — TAVI should do better) | `[func]` |
| I21 | Email scheduled | Delay 1 hour (or shortest allowed) | Sent after the delay; cancelled if the ticket no longer matches (J7) | `[func]` |
| I22 | Task | Title "QA WF ${subject}", due trigger + 2 days, priority, status | Task in Desk Tasks, linked to the ticket, owner = ticket owner (or unassigned), due date right | `[func]` |
| I23 | Task notify | Notify Assignee on | In-app notification to the assignee | `[func]` |
| I24 | Create Record | Calls on Standard with Subject + Start Time | Call created on that layout, values set, link to the ticket (record) (cf. NDC-1515) | `[func]` |
| I25 | Create Record required field missing | API: omit a required field | Refused on save, or Failed at run time with a reason — record | `[api]` |
| I26 | Add Tags append / replace | Ticket with tag B; Add A (append), then Add C (replace) | B+A, then only C | `[func]` |
| I27 | Remove Tags | Remove A | A removed; merged tag removed too (documented) | `[func]` |
| I28 | Send happiness email | Ratings on; close a QA ticket with the rule | Ticket Closed email with the rating link to the requester | `[func]` |
| I29 | Happiness — already rated / pending | Fire again after a rating; and while a link is pending | Not re-sent after a rating; a pending link is re-sent as a new link | `[func]` |
| I30 | Happiness — ratings off | Turn ratings off (restore after) | Nothing sent; dispatch shows why (record) | `[func]` |
| I31 | Saved action used live | Rule uses a saved Task action; edit the saved action; fire | The new configuration is used ("resolves live") | `[func]` |
| I32 | Inactive saved action | Deactivate the saved action; fire | Skipped; history says so | `[func]` |
| I33 | Action failure isolation | Rule with a failing webhook + Add Tags | Tags still added; the failure only marks the webhook | `[func]` |

## Group J — Date-time triggers and scheduled actions `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| J1 | N minutes before a date | Date-Time: 5 minutes before Due Date; ticket due in 15 minutes | Fires about 10 minutes after creation (± 2 minutes) | `[func]` |
| J2 | N minutes after a date | 5 minutes after Due Date | Fires about 5 minutes after the due time | `[func]` |
| J3 | Date in the past | Ticket whose Due Date is already past the offset | Record: fires at once, or never | `[func]` |
| J4 | Date changed | Move Due Date after scheduling | Rescheduled to the new date; old schedule not run | `[func]` |
| J5 | Business hours | 2 hours before, counting business hours, with Company hours set | Counts only open hours (hint example) | `[func]` |
| J6 | No business hours set | Same with none | Counts elapsed time ("without them…") | `[func]` |
| J7 | Scheduled action cancelled | Create rule with scheduled Task (+1 h) and condition Priority high; set Priority low before the hour | Task not created; dispatch Cancelled ("cancelled if the record stops matching") | `[func]` |
| J8 | Rule deleted | Delete a rule with a queued scheduled action | Cancelled (bulk-delete text says so) | `[func]` |
| J9 | Rule deactivated | Deactivate instead | Record: cancelled or still runs | `[func]` |
| J10 | Ticket deleted | Delete the ticket with a queued action | Cancelled or Failed cleanly | `[func]` |
| J11 | Pending in history | While queued | Execution History shows the dispatch Pending with "Next" time | `[func]` `[ui]` |

## Group K — Saved actions library

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| K1 | List | Open Actions | Type tabs All, Email, Task, Field Update, Webhook, Owner, Create Record, Add Tags, Remove Tags; module and status filters; columns Name · Type · Module · Used by · Status · Updated; empty state "No actions yet" | `[func]` `[ui]` |
| K2 | New Action types | New Action | 8 types; "Pick a type. You can't change it later…"; **no Send happiness email** (possible bug) | `[func]` |
| K3 | Create each type | One QA action per type on Tickets | Saved; listed under its tab; GET `/workflow/actions` matches | `[func]` `[api]` `[serial]` |
| K4 | Validation | Name empty, module empty, type-specific required fields | Same messages as F; nothing saved | `[func]` |
| K5 | Type cannot change | PATCH `type` of a saved action | Refused or ignored — record | `[api]` |
| K6 | Used by / usage | Use one action in 2 rules | "Used by" = 2; GET `/actions/{id}/usage` lists both rules | `[func]` `[api]` `[serial]` |
| K7 | Delete in use | Delete an action used by a rule | Blocked with a message, or rule shows "This saved action no longer exists — pick another." — record (Zoho: not documented) | `[func]` `[serial]` |
| K8 | Inactive | Set Active off | Rule editor warns "…inactive — it will be skipped when the rule runs." | `[func]` |
| K9 | Module restriction | Contacts action in a Tickets rule (API) | Refused | `[api]` |
| K10 | Name D-classes | D1, D4/D5, D8–D11 | Same handling as rule names (C4, C5) | `[data]` |

## Group L — Test rule (dry run)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| L1 | Test a saved rule | Row menu → Test rule; sample record id of a matching QA ticket | "Criteria matched", time in ms, what would be dispatched; **nothing saved** (ticket and history unchanged, no Execution History row) | `[func]` `[api]` |
| L2 | No match | Non-matching record | "Did not match" | `[func]` |
| L3 | Field values JSON | Valid and invalid FieldValueDTO JSON | Valid evaluates; invalid → "JSON error: {{message}}" | `[func]` `[data]` |
| L4 | Draft evaluate | `POST /workflow/rules/evaluate` with a draft body | Same answer as L1 for the same input; nothing stored | `[api]` |
| L5 | Wrong id | Unknown / other-tenant record id | Clear error, no data from another tenant | `[api]` `[sec]` |
| L6 | Scheduled actions in test | Rule with a delayed action | "would dispatch after {{seconds}}s" | `[func]` |

## Group M — Execution History

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| M1 | How to reach it | Look in the Setup menu, the rules list, the editor | Record every entry point; **today none (possible bug)** | `[ui]` |
| M2 | List | Open `/settings/workflow-executions` | Columns When · Rule · Module · Record · Trigger · Outcome · Actions run; newest first | `[func]` `[ui]` |
| M3 | Filters | Workflow rule, Record ID, Assignment rule, Clear filters | Filter the list and the API call (`ruleId`, `recordId`); empty → "No matching executions" | `[func]` `[api]` |
| M4 | Detail | Open a Fired row | Heading, "Triggered by … · evaluated at …", outcome, criteria matched, module, record, sync ms, correlation; dispatched actions with status, attempts, HTTP, last error, next / completed | `[func]` |
| M5 | Trigger shown right | Row for a Field Changed run | Trigger = "Field Changed", **not "On Create" (NDC-2205)** | `[func]` |
| M6 | Record link | Click the record | Opens the ticket (record) | `[ui]` |
| M7 | Paging | More than one page of runs | Paging works; counts match the API | `[func]` |
| M8 | Deleted rule | Run of a rule that was later deleted | Row still readable; rule name kept or "deleted" shown | `[func]` |

## Group N — Ticket history and audit

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| N1 | Ticket history line | After I1, I6, I26 | History shows each change; record the actor ("by System") and whether the rule name appears (Z28) | `[func]` |
| N2 | Department line | Any QA ticket's history | Department shown by **name**, not the raw id (possible bug seen on #62) | `[ui]` |
| N3 | Task / record link | After I22, I24 | The task / call is linked from the ticket | `[func]` |
| N4 | Audit log entries | After G and K | Rule and saved-action create / update / delete / activate entries | `[func]` |
| N5 | Audit link | Click an audit entry | Opens the rule / action page | `[ui]` |

## Group O — Security, i18n / RTL, accessibility, performance, compatibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| O1 | Stored XSS | `<img src=x onerror=alert(1)>` in rule name, description, saved action name, task title, merge-field text, tag name | Shown as text in list, editor, toasts, dialogs, Execution History, Audit Log, ticket history, task | `[sec]` |
| O2 | Template injection | Ticket subject `${description}` / `{{recipient_email}}` used in a merge field | Rendered once as text, not evaluated again | `[sec]` |
| O3 | SSRF | Webhook to `http://169.254.169.254/latest/meta-data`, `http://localhost`, internal service names, a redirect to them | Refused on save or at send time; nothing internal reached (receiver logs, error text does not leak internal data) | `[sec]` |
| O4 | Header injection | Header value with CR/LF; header name `Host` / `Authorization` | Refused or sanitised | `[sec]` |
| O5 | Data leakage | Webhook / email of a rule includes only the triggering record | No other tenant's or other record's data | `[sec]` |
| O6 | Enumeration | GET random rule / action / execution ids | 404 without detail; same time for found / not found (rough) | `[sec]` 🔒 |
| O7 | Arabic UI | Switch to AR; list, wizard, editor, actions, history | All labels translated; RTL layout; arrows flipped; summaries readable | `[i18n]` `[ui]` |
| O8 | Keyboard | Wizard, editor and pickers by keyboard only | Every control reachable; focus visible; Escape closes pickers; dialogs trap focus | `[a11y]` |
| O9 | Screen-reader names | Inspect row menu, toggles, icon buttons | Accessible names ("Actions for {{name}}", "Remove condition", "Remove action") | `[a11y]` |
| O10 | Narrow screens | 1280, 1024, 768 px | Editor canvas and pickers usable; no cut-off Save | `[ui]` |
| O11 | List with 50 rules | B14 data | Page loads < 3 s; search instant | `[perf]` |
| O12 | Burst | 50 QA tickets in 1 minute with 3 active QA rules | All runs recorded once; no lost actions; queue drains — record times | `[perf]` |
| O13 | Browsers | Chrome, Edge, Firefox (latest) — list + editor + save | Same behaviour | `[compat]` |

---

## E2E journeys `[serial]`

| ID | Journey | Steps | Expected |
|---|---|---|---|
| E2E-1 | Urgent ticket escalation | Rule: Create, Priority urgent → Owner = Manager role (round robin), Add Tag "QA WF urgent", Task "Call customer" due +1 day, Email to owner. Create 2 urgent QA tickets | Each: owner from the Manager role in turn, tag, task, mail; Execution History 1 row each, all dispatches Succeeded |
| E2E-2 | Follow-up after no change | Rule: Date-Time 10 minutes after Due Date, condition Status is Open → Task + Webhook. One ticket left open, one closed before the due time | Open ticket gets the task and webhook; closed ticket gets nothing |
| E2E-3 | Saved action reuse | Saved Email action used in 2 rules; edit the template once | Both rules send the new text; Used by = 2 |
| E2E-4 | Field watch | Rule: Field Changed Status → Add Tag "QA WF status changed"; edit other fields, then status | Tag added only after the status change; not on create (NDC-2205) |
| E2E-5 | Negative recovery | Rule with a webhook that returns 500 → fix the receiver → next ticket | First run retries and ends Failed / Dead-lettered with the error; fix; next ticket Succeeded. Rule stays active; the ticket is not damaged |
| E2E-6 | Clean-up | Bulk delete all QA rules; restore one from the Recycle Bin; delete again; purge | Lists and baseline diff back to §1.3 |

---

## Group Z — Gaps (run to confirm they are still missing or now built)

Each row: look for the capability in the UI and the API. **Still missing** = Pass for the gap list (the item stays open). **Built** = run the expected behaviour, then tell the user so the item can be closed in NDC-2203. Evidence images: `evidence/0N-…png`.

| ID | Item | How to check | Expected (Zoho) | Evidence |
|---|---|---|---|---|
| Z1 | Customer Reply trigger | When panel; API trigger kinds; reply to a QA ticket as the customer | Rule runs when the customer replies (e.g. reopen a closed ticket) | 01 |
| Z2 | Agent Response trigger | Same; agent replies | Runs on each agent reply | 01 |
| Z3 | Private Thread trigger | Same | Incoming / Outgoing / both | 01 |
| Z4 | Happiness Rating trigger | Same; rate a QA ticket | All ratings / Good / Okay / Bad / Okay or Bad | 01 |
| Z5 | Comment trigger | Same; add a comment | Runs when a comment is added | 01 |
| Z6 | Field Update on several fields | Watch field picker | Up to 3 fields with Any / All | 01 |
| Z7 | Several events in one rule | Trigger options | Tick several events in one rule | 01 |
| Z8 | Rules per department | List and rule body | Department picker; rule belongs to one department | 02 |
| Z9 | Active / Inactive tabs | List | Tabs or a status filter | 02 |
| Z10 | Contact / account conditions | Field picker | Contacts and Accounts field groups | 03 |
| Z11 | Business hours / holiday condition | Field picker | "Execution Time" with during / outside business hours, on / not a holiday | 03 |
| Z12 | Missing ticket fields in conditions | Field picker vs `/modules/{tickets}/fields` | Happiness Rating, Team, Created / Closed Time, SLA flags, Spam, Ticket Number … offered | 03 |
| Z13 | Missing operators | Operator picker | doesn't contain; between / not between; current time | 03 |
| Z14 | Add Comment | Action picker | Public / private comment | 04 |
| Z15 | Send Email Reply | Action picker | Reply logged in the conversation, From address | 04 |
| Z16 | Email to contact / outside addresses | Email action recipients | Notify Contact, Additional Recipients, teams | 05 |
| Z17 | Assign to a team | Owner action | Agent / Team / Agent in a Team | 05 |
| Z18 | Several actions of one type | Picker after adding Email | Up to 10 alerts / tasks / field updates per rule | 05 |
| Z19 | Add Followers | Action picker | Followers added | 04 |
| Z20 | Mark as Spam | Action picker | Ticket (and optionally contact) marked spam | 04 |
| Z21 | Share Ticket | Action picker | Share with a department and access level | 04 |
| Z22 | Change Layout | Action picker | Ticket moved to another layout | 04 |
| Z23 | Custom Functions | Action picker; capability flag | Scripted action available | 04 |
| Z24 | Chat notifications | Action picker | Cliq, Slack, Teams, Google Chat | 04 |
| Z25 | Instant-messaging reply / notify | Action picker | WhatsApp / Telegram … template message | 04 |
| Z26 | Skills actions | Action picker | Add / Remove / Recalculate Skills, Reassign by skills | 04 |
| Z27 | AI actions | Action picker | Field extraction / prediction, generate content, auto reply | 04 |
| Z28 | Rule name in ticket history | Ticket History after a run | Rule name, action, status and reason on the ticket | 06 |

---

## Traceability

There is no PRD with numbered requirements (NDC-1251 is empty). Coverage is traced to the build's own contract, the open bugs and the gap list.

| Source | Requirement | Scenarios |
|---|---|---|
| Build — list | search, module filter, columns, row menu, bulk delete, limit 50 | B1–B14 |
| Build — wizard | module, name, description, layout, draft | C1–C10 |
| Build — triggers | 5 record actions, date-time with offsets and business hours, rule mode | D1–D12, H1–H7, H12, J1–J6 |
| Build — conditions | all / matching, 25 conditions, pattern, operators, changed, tags | E1–E16, H6, H8, H20 |
| Build — actions | 9 types, instant / scheduled, 10 max, one per type, saved, merge fields | F1–F24, I1–I33, J7–J11 |
| Build — save | validation, conflict, double submit, partial body, audit | G1–G10, N4, N5 |
| Build — saved actions | 8 types, usage, inactive, delete in use, module rule | K1–K10, I31, I32, E2E-3 |
| Build — test rule | execute, evaluate, permission | L1–L6, A6 |
| Build — execution history | list, filters, detail, permission | M1–M8, A8 |
| Build — permissions | 6 workflow permissions, tenant isolation | A1–A11, O6 |
| NDC-2205 | On Edit / Field Changed must not fire on create; workflow updates are not edits | H3, H4, H17, M5, E2E-4 |
| NDC-2204 | Roles list = Desk roles | F8, I8 |
| NDC-2173 | Long names in the Name column | B6 |
| NDC-1437 / 1438 / 1436 / 1515 (CRM engine bugs) | read-only fields, date-only, address, create-record layout | F7, I3, I4, I24 |
| NDC-2203 + missing list | 28 gaps | Z1–Z28 |
| Possible bugs (missing list notes) | duplicate runs, no menu link, picker offers used types, no happiness saved action, department id in history | H19, M1, F3, K2, N2 |

Every row of the build map has at least one scenario. A requirement added later (a PRD, or an NDC-2203 item moved to "built") must get a row here.

---

## Reporting

- **Report:** `executions/<date>_desk-workflow-rules/report.md` with:
  - one line per row: ID, verdict, one-sentence result;
  - the extent report;
  - a list of new bugs (house style, one Plane item per bug, after the user agrees).
- **Evidence:**
  - Screenshots for **failed rows only**, annotated side by side against live Zoho, in `screenshots/annotated/<id>-vs-zoho.png`. Where Zoho has no such behaviour, use a TAVI-only image and say "Not comparable".
  - Redact tokens, cookies and webhook secrets; report token **lengths** only.
  - Never paste customer data from teammates' tickets.
- **API evidence:** method, path, status code, error code and the shape of the body. Leave out ids of other people's records.
- **Coverage gaps:** restate the §1.4 blockers that left rows Inconclusive, and the "Not yet confirmed" list with what the run learned.
- **Revert proof:** a final GET of rules, actions, tags and the teammate rules' `isActive`, diffed against the §1.3 baseline. Any difference is listed and explained. A deleted-but-not-purged QA item counts as a difference.
- **Group Z:** a short table "still missing / now built" per item, so NDC-2203 can be updated in one go.
