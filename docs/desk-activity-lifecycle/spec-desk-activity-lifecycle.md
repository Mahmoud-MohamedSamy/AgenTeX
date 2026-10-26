# Spec — Desk Activity Life Cycle (Tasks, Calls, Events)

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging) |
| Feature | Activities: create (Activities page, ticket ACTIVITY tab, contact/account), the life cycle of each kind (Task: status → complete → reopen; Call: scheduled → started → ended / missed / rescheduled / cancelled → reopen; Event: scheduled → completed / cancelled → reopen, invitees and RSVP), overdue logic, reminders, views (predefined + custom), list layouts, bulk update, export, detail page (comments, attachments, time entry, timer), Calendar, delete / spam, API, automation hooks |
| Reference | Zoho Desk Activities — `reference/zoho-docs-inventory.md` (≈150 items, help.zoho.com + Desk OAS) and live org `taviportal` (read-only, 26 Oct 2026: Add Task / Call / Event forms, empty activities list) |
| Plane | No single PRD. **NDC-1865** "Desk Features Testing" checklist item "Activity Life Cycle". Related: NDC-1782 (activities gaps, only SMS reminders left), NDC-2008 (Phase 3: table view, more views, bulk update, several reminders, timer), NDC-1959 (parent). Regression: NDC-1907, NDC-1803, NDC-1813, NDC-1332 (all Done) |
| Gap list | `desk-activity-lifecycle-missing-list.md` (= Group Z) |
| Build map | `reference/tavi-build-map.md` · fields `reference/tavi-activity-fields-2026-10-26.json` · strings `reference/tavi-locale-activities.txt` |
| Written | 26 Oct 2026 from bundle `index-PA6o3K2s.js`, locale `desk`, live API (GET) and UI |
| Case prefix | `ACT-` (automation: feature `deskactivities`, `@CaseId("ACT-B3")`) |

---

## Feature inventory

### Built in Desk (found 26 Oct 2026)
- Three modules Tasks / Calls / Events (records API) with the status lists in §2.2; Add from the Activities page, the ticket ACTIVITY tab, contacts and accounts — B, C, H.
- Task life cycle: status picker, **Mark as Complete** / **Reopen Task**, Completed Time, "Overdue" / "Late by …" — D.
- Call life cycle: Start Call / End Call (Outcome, notes → ticket private comment), Mark as missed, Reschedule (log a missed call), Cancel Call, Reopen Call, completed calls read-only — E.
- Event life cycle: Mark as Completed, Cancel, Reopen Event, invitees (agents + contacts, email invite, RSVP) — F.
- Reminders: up to 5 per activity, pop-up / email (SMS shown but off), on due/start, before N min/h/d, at a date — G.
- Views: 20+ predefined, custom views (share with agents), sort, search, filter; layouts Classic / Compact / Table + Manage columns; Export (xlsx / csv); bulk **Update** — B, J.
- Detail page: properties panel, inline edit, comments (@mention, edit, delete), attachments, time entry, timer — I.
- Calendar (Month / Week / Day, All Users) — K. *(TAVI extra; Zoho has no native activity calendar.)*

### Missing in Desk (Group Z) — see the missing list.

### Not a gap
- Recurring activities (Zoho Desk has none).
- Kanban for activities (Zoho has none).
- Event End Time instead of Duration (different model, same result).
- Click-to-call (excluded in NDC-2008; telephony is NDC-2001).

---

## 0 How to run

1. **Order:** §1 → A → B (read) → C → D → E → F → G → H → I → J → K → L → M → N → O → E2E → Z. Take the baseline (§1.3) first, diff it last.
2. **Serial:** every row that writes. Activity records are tenant-wide and visible to teammates in "All Activities"; run writers one at a time.
3. **Tags:** `[func]` `[ui]` `[api]` `[data]` (data-class sweep, record each value) `[sec]` 🔒 (permissions) `[conc]` `[a11y]` `[i18n]` `[perf]` (exclusive, run alone) `[serial]` `[mail]` (sends an email — only to `mmohamed@anyware.software`) `[slow]` (waits for a clock: reminders, overdue).
4. **Verdicts:** Pass · Fail (bug) · Gap (Zoho has it, TAVI does not → Group Z) · Inconclusive (blocked by environment — never Fail) · Not run.
5. **Evidence:** failed cases only, TAVI left vs live Zoho right (user rule); passes get a one-line note.

## 1 Preconditions

### 1.1 Accounts
| Label | Account | Profile / departments | Use |
|---|---|---|---|
| AG | `fedelav803@meinvr.com` | Desk Agent, Customer Support | main runner (non-admin) |
| AD | `mahmoud.mmohamedsamy@gmail.com` | Desk Admin, HR / Marketing / Sales | admin rows, other-department rows |
| OW | `ndc-staging-owner` | owner, all departments | **do not sign in** (shared; a new sign-in revokes teammates' sessions) |
Credentials: `docs/Credentials/Microsoft Edge Passwords.csv` + `automation/.auth/extra-credentials.csv` (never printed). One sign-in per account per run.

### 1.2 Test data
- Prefix **`QA ACT `** on every subject; QA tickets subject `QA ACT ticket <n>` in Customer Support, contact email `mmohamed@anyware.software`.
- Times are relative to *now* (UTC stored, shown in the tenant zone) — record the zone.
- Cleanup: delete every `QA ACT ` record of the run (records API DELETE → Recycle Bin), then purge from the Recycle Bin if allowed (memory: bin purge of Desk items may fail — record `failed[]`).

### 1.3 Baseline
`executions/<run>/baseline/`: counts per module, `GET /desk/activity-views`, reminder options, the 3 modules' fields. After the run: the same GETs; diff must show only QA rows gone.

### 1.4 Blockers (mark Inconclusive, not Fail)
- Reminder delivery (G) needs the notify service: options say pop-up and email are on; if no pop-up/email arrives in 10 min → Inconclusive with the reminder `state`.
- AG's mailbox (`@meinvr.com`) cannot be read → email reminders are checked through the reminder `state = sent`, not the inbox.
- Owner-only views / team views need a team for AG (check `GET /desk/agents/me/teams`).

### 1.5 Cannot be undone cleanly
Invitation emails to contacts (F); reminder emails; history / audit entries.

## 2 Surface and contract

### 2.1 API (`/api/v1`, `Authorization: Bearer`, `x-app-key: desk`)
`GET/POST /modules/{mid}/records` (list: `page, per_page, sort_by, sort_dir, filters=[{field, operator, value}]`), `GET/PATCH/DELETE /modules/{mid}/records/{id}`, `/desk/activity-views`, `/desk/activities/{id}/reminders`, `/desk/activities/reminders/options`, `/desk/activities/{id}/invitees[/me|/{iid}/rsvp]`, `/desk/activities/invited`, `/desk/activities/{id}/timer…`, `/desk/timers/current`. Record values: `{field, value:{kind:"string", value}}` with `kind` first.

### 2.2 Field register
| Kind | Field | Type | Req | Allowed / limit | Zoho |
|---|---|---|---|---|---|
| Task | subject | single_line | ✔ | max? (record) | 50 UI / 300 API |
| Task | status | status | | Not Started, Deferred, In Progress, Waiting on Someone, Canceled, Completed | same 6 |
| Task | priority | pick_list | | highest, high, normal, low, lowest | same 5 (labels capitalised) |
| Task | category | pick_list | | follow_up, meeting, email, research, documentation, other | free picklist |
| Task | due_date | date_time | | | optional |
| Call | call_start_time | date_time | ✔ | | required |
| Call | call_status | pick_list | | scheduled, in_progress, completed, missed, cancelled | Completed, Scheduled, Missed, Canceled, In Progress |
| Call | call_type | pick_list | | inbound, outbound, missed | inbound / outbound (default outbound) |
| Call | call_duration | single_line | | text (record format) | required, seconds |
| Event | title, from_time, to_time | | ✔ | to_time > from_time | Start + Duration required |
| Event | status | pick_list | | scheduled, deferred, completed, cancelled | not documented |
| all | department | | | not on the forms | **required** in Zoho |
| all | contact_id | lookup | | | required for calls / events in Zoho |

### 2.3 Messages (en, verbatim from the locale)
"{{kind}} added." · "Activity updated." · "Call started." · "Call completed." · "Call logged as missed." · "Call cancelled." · "Completed calls cannot be edited. Reopen the call to change it." · "Call reopened." · "Rescheduled." · "Missed call logged and rescheduled." · "The end must be after the start." · "Reminder saved." · "An activity can have up to {{count}} reminders." · "The reminder time has already passed. Choose a later time." · "Choose at least one way to be alerted." · "Invitees saved. New invitees were emailed an invitation." · "An event can have up to {{count}} invitees; the rest were not added." · "This activity could not be found." · "Some fields could not be set with your permissions."

### 2.4 Data classes (D-classes for text / date fields)
D1 empty · D2 spaces only · D3 1 char · D4 max · D5 max+1 · D6 Arabic / RTL · D7 emoji · D8 HTML/script `<img src=x onerror=alert(1)>` · D9 SQL-ish `' OR 1=1--` · D10 leading/trailing spaces · D11 past date · D12 far-future date (2100) · D13 invalid date string · D14 wrong type (number / object) · D15 unknown picklist value.

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-A1 | Agent sees Activities | AG opens `/activities` and the nav tab | Page loads with All Activities, Tasks, Calls, Events | `[func]` |
| ACT-A2 | Admin tab bar | AD's tab bar | Activities reachable (tab or More menu); record if hidden | `[ui]` |
| ACT-A3 | Department scope — list | AD (not in Customer Support) lists Tasks | Record whether AG's Customer Support activities are visible to an admin of other departments; compare with Zoho (department-specific modules) | `[sec]` 🔒 |
| ACT-A4 | Department scope — direct URL | AD opens AG's QA task URL | Same rule as A3; no partial data leak | `[sec]` 🔒 |
| ACT-A5 | Edit someone else's activity | AG edits a teammate's task (owner ≠ AG) | Allowed or refused per profile ("Update/Delete All Records" in Zoho); record | `[sec]` 🔒 |
| ACT-A6 | Reopen permission | AG reopens a task owned by someone else | Zoho: only admin or task owner can reopen; TAVI record | `[sec]` 🔒 |
| ACT-A7 | No / expired token | GET records / reminders without a bearer | 401, no data | `[api]` `[sec]` |
| ACT-A8 | Other tenant | foreign token on a QA activity id | 404 / 403 | `[api]` `[sec]` |

## Group B — Lists and views

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-B1 | All Activities renders | Open `/activities` | "All Activities (N)", Total Count = sum of the 3 modules' non-spam totals | `[func]` |
| ACT-B2 | Kind tabs | Click Tasks / Calls / Events | Only that kind; counts match the API | `[func]` |
| ACT-B3 | Predefined views list | Open the view picker | Lists the views of §Feature inventory; compare with Zoho's 16 / 14 / 16 / 14 | `[func]` |
| ACT-B4 | Open / Completed / Canceled | Seed one QA task per status; open each view | Each task appears only in the right views | `[func]` `[serial]` |
| ACT-B5 | Overdue view | QA task due yesterday, not completed; another completed with past due | First in Overdue; completed one not | `[func]` `[serial]` |
| ACT-B6 | Today's / Tomorrow's / Next 7 Days + Overdue / Today + Overdue | Seed due today, tomorrow, +5 d, +10 d, −1 d | Each view holds exactly the right ones | `[func]` `[serial]` |
| ACT-B7 | My views | QA task owned by AG vs owned by AD | "My …" shows only AG's | `[func]` `[serial]` |
| ACT-B8 | Missed Calls view | Call marked missed | In Missed Calls / My Missed Calls | `[func]` `[serial]` |
| ACT-B9 | Spam view | Activity linked to a spam ticket | Shown in Spam Activities, hidden from All (filter is_spam false) | `[func]` `[serial]` |
| ACT-B10 | Sort | Each sort key asc / desc | Order matches the field values | `[func]` |
| ACT-B11 | Search | Part of a QA subject, other case, Arabic, nonsense | Filters; "No activity matches your search." for nonsense | `[func]` `[ui]` |
| ACT-B12 | Filter panel | Filter by owner, status, due range | Rows match | `[func]` |
| ACT-B13 | Custom view create | New view "QA ACT view", criteria status = Not Started, share Only me | "View saved."; listed after standard views; rows match | `[func]` `[serial]` |
| ACT-B14 | Custom view validation | Empty name; share with agents but none chosen | "Give the view a name." / "Choose at least one agent to share the view with." | `[func]` `[ui]` |
| ACT-B15 | Custom view sharing | Share with AD; AD opens it | AD sees it; AG's private views are not visible to AD | `[func]` `[sec]` `[serial]` |
| ACT-B16 | Custom view delete | Delete QA view | Confirm text "“{{name}}” will be deleted for everyone who uses it."; gone for AD too | `[func]` `[serial]` |
| ACT-B17 | Predefined views locked | Try edit / delete a predefined view (UI + `PUT /desk/activity-views/{predefined}`) | Not possible | `[func]` `[api]` |
| ACT-B18 | Last view remembered | Pick a view, reload | Same view (Zoho remembers the last view) | `[ui]` |
| ACT-B19 | Overdue badge | Row with past due, open | "Overdue" badge; a completed one has none | `[ui]` |
| ACT-B20 | Empty states | View with no rows | The view's empty text (§locale `activities.empty.*`) | `[ui]` |
| ACT-B21 | Paging / load more | Kind with > 50 rows | "Load more {{kind}}" loads the next page, no duplicates | `[func]` |

## Group C — Create

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-C1 | Add Task — minimum | Add Activity → Task, subject only, Save | "Task added."; owner = me; status default (record vs Zoho "Not Started"); priority default (record) | `[func]` `[serial]` |
| ACT-C2 | Add Task — all fields | Every field incl. ticket, contact, team, category, reminder | All saved; detail shows them; API values match | `[func]` `[serial]` |
| ACT-C3 | Required subject | Save with empty subject | Blocked with a field error; nothing created | `[func]` `[ui]` |
| ACT-C4 | Subject D-classes | D1–D10 on subject (UI + API) | D1/D2 refused; D4 accepted; D5 refused with a clear error (record max); D6/D7 kept; D8 stored as text, never executed; D10 trimmed (record) | `[data]` `[sec]` `[serial]` |
| ACT-C5 | Add Call — scheduled | Direction Outbound, status Scheduled, start +1 h | "Call added."; shows in Open / upcoming | `[func]` `[serial]` |
| ACT-C6 | Add Call — log completed call | Status Completed, start −1 h, duration 00:05 | Saved as completed; read-only after (E8) | `[func]` `[serial]` |
| ACT-C7 | Call required start time | No start time | Blocked | `[func]` |
| ACT-C8 | Call duration D-classes | 00:05, 5, 99:99, -1, abc (UI + API) | Only valid HH:MM accepted (record what the API takes — field is free text) | `[data]` `[serial]` |
| ACT-C9 | Add Event | Start +1 d 10:00, end 11:00 | "Event added." | `[func]` `[serial]` |
| ACT-C10 | Event end before start | End 09:00 | "The end must be after the start." (UI); API refuses too | `[func]` `[api]` |
| ACT-C11 | Picklist D15 via API | status "Done", priority "urgent", call_status "ringing" | 4xx each, field named; nothing saved (cf. NDC-2226/2234) | `[api]` `[data]` |
| ACT-C12 | Date D11–D14 via API | due "2026-13-45", "abc", 12345 | 4xx; nothing saved (cf. NDC-2242) | `[api]` `[data]` |
| ACT-C13 | Link to a ticket | Pick a QA ticket in "Ticket" | Activity shows on the ticket's ACTIVITY tab (H) | `[func]` `[serial]` |
| ACT-C14 | Link to a contact | Pick a contact | Shows on the contact's activities tab | `[func]` `[serial]` |
| ACT-C15 | Owner = team | Owner a team (Zoho: owner may be a team) | Record whether a team can be the owner or only "Team" field | `[func]` `[serial]` |
| ACT-C16 | Cancel the drawer | Fill then Cancel | Nothing created | `[func]` |
| ACT-C17 | Double submit | Double-click Save | One record only | `[conc]` `[serial]` |
| ACT-C18 | Department | Look for Department on the form; check the saved `department` | Zoho requires Department; TAVI: record (Z) | `[func]` |
| ACT-C19 | Created By | After C1 | "Created By <me>" (not "Unknown user"), Modified By set | `[func]` |

## Group D — Task life cycle

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-D1 | Status walk | Not Started → In Progress → Waiting on Someone → Deferred → Completed (detail picker) | Each change saved, "Activity updated."; history / audit entry each (record) | `[func]` `[serial]` |
| ACT-D2 | Mark as Complete | Footer Mark as Complete | Status Completed; Completed Time = now; button becomes Reopen Task | `[func]` `[serial]` |
| ACT-D3 | Complete from the list | Row checkbox "Mark … as complete" | Completed; leaves Open / Overdue views | `[func]` `[serial]` |
| ACT-D4 | Reopen | Reopen Task | Status = **Not Started** (Zoho); Completed Time cleared (record) | `[func]` `[serial]` |
| ACT-D5 | Canceled | Set Canceled | Leaves Open; in Canceled views; not Overdue | `[func]` `[serial]` |
| ACT-D6 | Overdue derivation | Due −1 h, open | Overdue badge, "Late by …"; after completing, no badge | `[func]` `[slow]` `[serial]` |
| ACT-D7 | No due date | Task without due date | Never overdue; sorts last (record) | `[func]` |
| ACT-D8 | Completed via API | PATCH status Completed | completed_time set server-side | `[api]` `[serial]` |
| ACT-D9 | Edit a completed task | Change priority on a completed task | Allowed (Zoho allows) — record | `[func]` `[serial]` |
| ACT-D10 | Priority label | Detail shows priority | Shows the label "Highest", not the raw key `highest` | `[ui]` |

## Group E — Call life cycle

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-E1 | Start Call | Scheduled QA call → Start Call | "Call started."; status in_progress; start time = now (record) | `[func]` `[serial]` |
| ACT-E2 | End Call answered | End Call → Outcome Answered, notes "QA notes" | "Call completed."; status completed; duration filled; end time set | `[func]` `[serial]` |
| ACT-E3 | Call notes to ticket | E2 on a ticket-linked call | Ticket gets a **private comment** "Call notes: QA notes" | `[func]` `[serial]` |
| ACT-E4 | End Call unanswered | Outcome Unanswered | Record status (missed?) and message | `[func]` `[serial]` |
| ACT-E5 | Mark as missed | Scheduled call → Mark as missed | "Call logged as missed."; status missed; in Missed views | `[func]` `[serial]` |
| ACT-E6 | Reschedule with missed log | Reschedule, tick "The call went unanswered — log a missed call", new time +1 d | "Missed call logged and rescheduled."; a missed-call entry exists; the call moves to the new time | `[func]` `[serial]` |
| ACT-E7 | Reschedule validation | No date; past date | "Pick a date and time."; past refused (record) | `[func]` |
| ACT-E8 | Completed read-only | Edit a completed call | "Completed calls cannot be edited. Reopen the call to change it."; PATCH via API refused too (record) | `[func]` `[api]` `[serial]` |
| ACT-E9 | Cancel Call | Cancel Call | "Call cancelled."; status cancelled; in Canceled views | `[func]` `[serial]` |
| ACT-E10 | Reopen Call | Reopen a completed / cancelled call | "Call reopened."; editable again (regression **NDC-1813**) | `[func]` `[serial]` |
| ACT-E11 | Overdue scheduled call | Scheduled call with start −1 h | Overdue badge until completed / missed / cancelled | `[func]` `[slow]` `[serial]` |
| ACT-E12 | Start a cancelled call | Start Call on cancelled | Not offered | `[func]` |

## Group F — Event life cycle and invitees

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-F1 | Mark as Completed | Event → Mark as Completed | status completed; leaves Open | `[func]` `[serial]` |
| ACT-F2 | Cancel | Cancel | status cancelled | `[func]` `[serial]` |
| ACT-F3 | Reopen Event | Reopen | status scheduled (record) | `[func]` `[serial]` |
| ACT-F4 | Event does not auto-complete | Event ended 1 h ago | Still open (Zoho: closes only by status) | `[func]` |
| ACT-F5 | Invite agent + contact | Invite AD and contact `mmohamed@anyware.software` | "Invitees saved. New invitees were emailed an invitation."; summary "0 going · … · 2 not answered" | `[func]` `[mail]` `[serial]` |
| ACT-F6 | RSVP as invitee | AD → Your answer Accept | "Answer saved."; summary updates; AD sees the event in `/desk/activities/invited` | `[func]` `[serial]` |
| ACT-F7 | Invitee limit | Add more than the limit by API | "An event can have up to {{count}} invitees; the rest were not added." / 4xx | `[api]` `[data]` |
| ACT-F8 | Contact without email | Invite a contact with no email | Refused: "A contact needs an email address to be invited." | `[func]` |
| ACT-F9 | Remove invitee | Remove AD | AD no longer in invited list | `[func]` `[serial]` |

## Group G — Reminders

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-G1 | Options | GET options | popup, email true; sms false; max 5 | `[api]` |
| ACT-G2 | Set reminder at due | Task due +10 min, reminder "On the due date", pop-up | "Reminder saved."; state "Reminds at …" | `[func]` `[serial]` |
| ACT-G3 | Before N | 5 minutes before | state shows the right time | `[func]` `[serial]` |
| ACT-G4 | Fires | Wait for G3 time | Pop-up "Task reminder" with Open / Dismiss; state "Sent …" (regression **NDC-1332**) | `[func]` `[slow]` `[serial]` |
| ACT-G5 | Five reminders | Add 5, then a 6th | 6th refused: "An activity can have up to 5 reminders." | `[func]` `[data]` `[serial]` |
| ACT-G6 | Validation | offset 0 / -1 / 1.5 / abc; custom time in the past; no channel | Messages of §2.3 | `[func]` `[data]` |
| ACT-G7 | No due date | Reminder "On the due date" on a task without due | "Waits for a due date" | `[func]` `[serial]` |
| ACT-G8 | Closed before firing | Complete the task before the reminder | Not sent: "Not sent: the activity was already closed." | `[func]` `[slow]` `[serial]` |
| ACT-G9 | SMS option | Pick SMS | Disabled: "SMS reminders aren't switched on for this workspace." (NDC-1782) | `[ui]` |
| ACT-G10 | Team reminder | Activity owned by a team | Every team member alerted (Zoho) — record | `[func]` `[slow]` `[serial]` |
| ACT-G11 | Remove | Remove a reminder | "Reminder removed." | `[func]` `[serial]` |

## Group H — Ticket relationship

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-H1 | Add from ticket | QA ticket → ACTIVITY → Add a Task | Ticket pre-filled; saved (regression **NDC-1907**, as agent) | `[func]` `[serial]` |
| ACT-H2 | Tab views | Upcoming / Overdue / Completed / All / Spam | Right rows in each | `[func]` `[serial]` |
| ACT-H3 | Tab sort | Due / Start vs Created | Order correct | `[func]` |
| ACT-H4 | Complete from the tab | Checkbox on the row | Completed (Zoho: checkbox closes it) | `[func]` `[serial]` |
| ACT-H5 | Ticket history | After H1 and H4 | Ticket History shows "task added / completed" (record; Zoho unclear) | `[func]` |
| ACT-H6 | Close ticket with open activities | Close the QA ticket while a task is open | Record: allowed / warned / blocked (Zoho mobile doc: tasks first) | `[func]` `[serial]` |
| ACT-H7 | Activity count on ticket | `GET /desk/tickets/{id}` counts, list column | Zoho `taskCount`; TAVI record (Z) | `[api]` |
| ACT-H8 | Spam inheritance | Mark the QA ticket as spam | Its activities become spam (Spam views) and leave All | `[func]` `[serial]` |
| ACT-H9 | Delete ticket | Delete the QA ticket | Linked activities: record (kept / orphan link / deleted) | `[func]` `[serial]` |
| ACT-H10 | Contact tab | Contact page activities tab | Lists its activities; Add works | `[func]` `[serial]` |

## Group I — Detail page

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-I1 | Inline edit | Title, priority, due date, category, owner | Each saves with "Activity updated." | `[func]` `[serial]` |
| ACT-I2 | Comments | Add, edit, delete own comment (regression **NDC-1803**) | "Comment added." / "Comment updated." / "Comment deleted." | `[func]` `[serial]` |
| ACT-I3 | @mention | Mention AD | AD notified (record) | `[func]` `[serial]` |
| ACT-I4 | Attachments | Upload a 10 KB txt; a 0-byte file; a 30 MB file | Small one listed; limits enforced with a message (record) | `[func]` `[data]` `[serial]` |
| ACT-I5 | Time entry | Log 30 min | Listed; total | `[func]` `[serial]` |
| ACT-I6 | Timer | Start, stop | Time entry created; `GET /desk/timers/current` empty after | `[func]` `[serial]` |
| ACT-I7 | Not found | Open a random id | "This activity could not be found." | `[ui]` |
| ACT-I8 | Stale edit | Two tabs edit status | Second save: conflict or last-write-wins (record) | `[conc]` `[serial]` |
| ACT-I9 | Delete from detail | Look for Delete | Zoho: Delete → Recycle Bin. TAVI: record (Z) | `[func]` |

## Group J — Table, bulk, export

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-J1 | Layouts | Classic / Compact / Table | Each renders; choice remembered | `[ui]` |
| ACT-J2 | Manage columns | Hide Priority, add Team, reorder | Persisted; record per-user or for everyone (Zoho: everyone) | `[func]` |
| ACT-J3 | Bulk update status | Select 3 QA tasks → Update → Status Completed | "Status updated on 3 activities." | `[func]` `[serial]` |
| ACT-J4 | Bulk update mixed kinds | 1 task + 1 call → Update status | Skipped message for kinds without the field, or a shared field only | `[func]` `[serial]` |
| ACT-J5 | Bulk owner | Update owner on 2 | Owner changed | `[func]` `[serial]` |
| ACT-J6 | Bulk delete | Look for Delete in the bulk bar | Zoho: mass Delete; TAVI record (Z) | `[func]` |
| ACT-J7 | Export | Export this view xlsx and csv | File with every row of the view; counts match | `[func]` |
| ACT-J8 | Export cancel | Start then Cancel export | "The export was cancelled." | `[func]` |

## Group K — Calendar

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-K1 | Month / Week / Day | Switch | QA task / call / event at their times | `[func]` |
| ACT-K2 | All Users vs me | Filter | Right owner set | `[func]` |
| ACT-K3 | Create from calendar | Create → Task | Opens the add form with the clicked date (record) | `[func]` `[serial]` |
| ACT-K4 | Open from calendar | Click an item | Opens its detail | `[func]` |

## Group L — Delete, recycle bin, spam

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-L1 | Delete via API | DELETE a QA task | 200; gone from lists; in Recycle Bin (record) | `[api]` `[serial]` |
| ACT-L2 | Restore | Restore from Recycle Bin | Back with its links and reminders (record) | `[func]` `[serial]` |
| ACT-L3 | Reminder after delete | Delete a task with a pending reminder | Reminder not sent | `[func]` `[slow]` `[serial]` |
| ACT-L4 | Mark activity spam directly | UI / API `is_spam` true | Zoho: not allowed directly (inherited only) — record | `[func]` `[api]` |

## Group M — API and security

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-M1 | List filters | `filters` due_date `before_now` + status not Completed | Same rows as the Overdue view | `[api]` |
| ACT-M2 | Read-only fields | PATCH completed_time, created_by, approval_status | Ignored or 4xx; values unchanged | `[api]` `[sec]` |
| ACT-M3 | XSS in subject / comment | D8 in subject, description, comment | Rendered as text in list, detail, calendar, ticket tab, export | `[sec]` `[serial]` |
| ACT-M4 | Reminder on someone else's activity | AD sets a reminder on AG's task via API | Allowed / 403 per access (record) | `[sec]` 🔒 |
| ACT-M5 | RSVP as non-invitee | AG posts RSVP for an invitee id of AD | 403 | `[sec]` 🔒 |
| ACT-M6 | Mass assignment | POST record with `id`, `created_at`, `is_spam` | Ignored / 4xx | `[api]` `[sec]` |

## Group N — Automation and notifications

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-N1 | Workflow rule on Tasks | Rules list → module picker | Tasks / Calls / Events offered (Zoho: alerts + custom functions only) | `[func]` |
| ACT-N2 | Webhook on activity events | Look for task / call / event events | Zoho Task_Add / Update / Delete … (Z) | `[func]` |
| ACT-N3 | Assignment notification | Assign a QA task to AD | AD notified (in-app / email) — Zoho emails the assignee | `[func]` `[serial]` |
| ACT-N4 | Workflow Task action | Existing ticket rule with a Task action (regression NDC-2510) | Task created with ticket link | `[func]` |

## Group O — i18n, a11y, performance, compatibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| ACT-O1 | Arabic UI | Switch EN → AR | All activity strings translated; RTL layout; dates localised | `[i18n]` |
| ACT-O2 | Keyboard | Tab through list, add form, detail | Every control reachable, visible focus; drawer traps focus; Escape closes | `[a11y]` |
| ACT-O3 | Names | Row checkboxes, icon buttons | Accessible names ("Mark {{title}} as complete") | `[a11y]` |
| ACT-O4 | Load time | All Activities with 128 rows | First rows < 3 s (record) | `[perf]` |
| ACT-O5 | Mobile width | 390 px | List and detail usable | `[ui]` |

## E2E journeys `[serial]`

| ID | Journey |
|---|---|
| ACT-E2E1 | Ticket follow-up: QA ticket → Add Task (due +2 min, reminder at due) → reminder pops → Mark as Complete → ticket tab Completed → reopen → complete again. |
| ACT-E2E2 | Call: schedule call on ticket → Start → End unanswered → Reschedule with missed log → Start → End answered with notes → ticket has private comment → reopen → edit → complete. |
| ACT-E2E3 | Event: create with AD + contact invitees → AD accepts → cancel event → reopen → complete. |
| ACT-E2E4 | Negative recovery: create with invalid status by API (refused) → create valid → bulk update to Completed → export → delete → restore. |

## Group Z — Gaps (see the missing list)

| ID | Item | How to check | Expected (Zoho) |
|---|---|---|---|
| Z1 | Department on activities | Add forms; `department` on a saved record; admin of another department opens a CS ticket's task (ACT-A3) | Department required; owner list limited to it; other departments cannot see it |
| Z2 | Delete from the activity page | Detail page actions (ACT-I9) | Delete → Recycle Bin |
| Z3 | Delete in the bulk bar | Table layout, select rows (ACT-J6) | Delete (and Assign To) next to Update |
| Z4 | Activity count on the ticket | `GET /desk/tickets/{id}` counts (ACT-H7) | Count of the ticket's tasks (`taskCount`) |
| Z5 | Ticket-activities API and filters | `GET /desk/activities`, ticket activities, Overdue / Today filters, count | Zoho `/tickets/{id}/activities`, `dueDate=Overdue`, `/tasks/count` |

## Traceability

No PRD with numbered requirements. Coverage by source:
- NDC-2008 Phase 3: table view J1–J2 · more views B3, B6, B8 · bulk update J3–J5 · several reminders G5 · team owner C15 · invitees F5–F9 · timer I6 · SMS G9 (click-to-call excluded).
- NDC-1782: custom views B13–B16 · predefined views B3–B9 · reminders G · team assignment C15.
- Regression: NDC-1907 → H1 · NDC-1803 → I2 · NDC-1813 → E10 · NDC-1332 → G4.
- Zoho inventory groups 1–9 → C, D–F, G, B/J, H, A, N, (customisation: out of scope here, Modules & Fields spec), (reports: Z), M.

## Reporting
- `executions/<run>/report.md` + `report.html`: per case verdict, failed cases with TAVI-vs-Zoho evidence, gaps restated, inconclusive list with the blocker.
- Tokens: report lengths only, never values. Do not log `/iam/auth` traffic.
- Revert: final GET diff against the baseline; list any QA record that could not be removed.
