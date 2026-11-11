# Spec — Desk Approvals page (NDC-2871)

| | |
|---|---|
| App | TAVI Desk, `https://staging-desk.taviportal.com`, tenant **NDC-Staging** (owner `ndc-staging-owner`) |
| Feature | One Approvals page for manual ticket approvals, held web form submissions and blueprint "Submit for approval" steps |
| Requirements | NDC-2871 (Plane, no API section) · full doc with API proposal: Claude Doc "TAVI Desk Approvals Page Requirements" · `requirements-desk-pending-approvals.md` · `plane-description.md` |
| Sample page | `pending-approvals-sample.html` (annotated; pins map to PA-IDs) |
| Status | Written 11 Nov 2026, before the build. Run when NDC-2871 reaches Ready For Test. Step 0.2 re-maps the build first, because names, routes and endpoints may differ from the proposal |

Tags: `[func]` `[ui]` `[ux]` `[api]` `[sec]` (needs a lower-permission user) `[data]` (data-class sweep) `[conc]` (two sessions) `[serial]` (changes tenant-wide settings or uses the shared web form) `[perf]` `[i18n]` `[a11y]` `[compat]` `[reg]` (existing feature must still work) `[zoho]` (compare with live Zoho, read-only).

Each row: **ID · Title · Steps · Expected · Tags · Req**. Expected = what NDC-2871 asks for. When the build differs, record the actual result and whether the difference is a bug or a decision (ask the user).

---

## Feature inventory

### Already built before NDC-2871 (checked 2 and 11 Nov 2026)
- Ticket approvals: Approval tab on the ticket; request (subject, description, approvers: agents or teams); approve, reject (comment), cancel. API `/desk/tickets/{id}/approvals`, `/approve`, `/reject`, `/cancel`; non-approver → 403 `APPROVAL_NOT_APPROVER`; empty approvers → 400.
- Web form hold: form setting `definition.review` `{mode: none|approval|spam, spam_threshold}`; per-form Pending tab (`/settings/channels/web-forms/advanced/{id}?tab=pending`); API `GET /web-forms/{id}/pending?status=pending|pending_confirmation|approved|rejected|confirmed`, `POST /web-forms/{id}/pending/{pid}/{approve|reject}`; permission "web form approve". No approver list per form; reject has no reason.
- Blueprint: "Submit for approval" can be a During step of a transition (designer).

### New in NDC-2871 (what this spec tests)
- Approvals page `/approvals` with count in the navigation, four lists, counts, filters, search, details, actions (approve, reject with reason, bulk, remind, cancel, reassign, decide on behalf), overdue and reminders, notifications, new permissions, integrations (history, workflow triggers, view filter, reports).
- Web form changes PA-WF-4 (approver list per form), PA-WF-5 (reject reason), PA-WF-6 (department and priority before approve), PA-WF-8 (mark as spam).
- Rules for manual approvers (PA-MAN-2) and the "Approval pending" marker (PA-MAN-3).

### Open questions that change expected results (confirm with the user before the run)
- "All approvers" mode built or not (PA-ACT-5). If not: rows E6, E7 and parts of AC-7 become "not in this release".
- Decide on behalf built or not (PA-ACT-9). If not: E14, E15 become "not in this release".
- Default overdue limit and the setting's location (PA-OVD-1).
- Whether reply review (T-28) shows on the page. Not expected in this release; record only.

---

## 0 How to run

### 0.1 Order
1. Step 0.2 (map the build), then §1 preconditions and baseline.
2. Groups A → C (read-only on seeded data), then D → K (writes), then E2E, then Z.
3. Groups marked `[serial]` run alone: they change the shared Tech Webform, Settings → Approvals, or a blueprint.
4. Clean up with §1.5 before reporting.

### 0.2 Map the build first (read-only, about 15 minutes)
- Open `/approvals` as the owner. Record the route, the navigation entry, list names, filter names, the detail layout and the labels of every action.
- Read the Desk bundle for the new chunk (search `approvals` in `/assets/index-*.js`). Record the API paths it calls, permission keys, i18n keys, and the error codes it maps.
- Call the list endpoint once as owner and once as Agent C. Record the item shape and whether it has a server-computed `can` block (or equivalent).
- Update the "Actual" names in §2 and adjust row wording before running. Do not run rows against guessed names.

### 0.3 Rules for the run
- NDC-Staging only. Sign each account in once per run (one stored session or token per account); never print credential files or tokens.
- Two sessions of the same account must use separate sign-ins (sharing one refresh token revokes all sessions).
- Every record this spec makes starts with **"QA PA "** (subject, form name, blueprint name, department). Never act on records without that prefix, including the 2 Tech Webform submissions pending since 10 Nov.
- Stop on HTTP 429. Do not retry in a loop.

---

## 1 Preconditions

### 1.1 Accounts (labels from `docs/Credentials/TAVI Desk Credentials.csv`; confirm roles in Settings → Agents at the start)

| Role in this spec | Who | Needs |
|---|---|---|
| Owner (O) | `ndc-staging-owner` | Admin; has "Manage approvals" by default (PA-PERM-5) |
| Agent A (requester) | a Desk Agent in QA PA Dept 1 | No approval permissions |
| Agent B (approver) | a second agent in QA PA Dept 1 | No approval permissions; named as approver |
| Agent C (outsider) | an agent NOT in QA PA Dept 1 | Must not see Dept 1 items |
| Agent D (second approver) | a third agent in QA PA Dept 1, also in team QA PA Team | Named with B for multi-approver rows |
| Supervisor S | an agent with "View department approvals" for QA PA Dept 2 only | For scope rows |

If fewer than five agents are free, ask the user before reusing one in two roles; never reuse across A/B (requester and approver must differ).

### 1.2 Test data

| Item | Value |
|---|---|
| Departments | QA PA Dept 1 (A, B, D), QA PA Dept 2 (S, C) — business hours 24×7 unless a row says otherwise |
| Team | QA PA Team (D + one more) in Dept 1 |
| Tickets | `QA PA T01`…`T20` in Dept 1, `QA PA T21`…`T25` in Dept 2, contact "QA PA Contact" with a mailbox the user can read |
| Web form | **QA PA Form** (copy of Tech Webform fields), Dept 1, Review = Approval, approvers B and QA PA Team (once PA-WF-4 exists). Second form **QA PA Form Spam**, Review = Spam, threshold 90 |
| Blueprint | **QA PA Refund**, Dept 1, criteria Subject starts with "QA PA bp": Open → Validation → Finance review → Closed. Transition "Send to Finance" (Validation → Finance review) has Submit for approval, approver B. Transition "Approve replacement" variant needs a field from the approver (for E12) |
| Workflow rule | **QA PA WF approved**: on "Approval approved", add comment "QA PA wf ran" (only if PA-INT-2 is built) |
| View | **QA PA pending view**: filter "Has pending approval" = yes (PA-INT-3) |

### 1.3 Baseline (save before writes)
- `GET /web-forms` and the definitions of any form this spec touches.
- Settings → Approvals values (overdue default) and profile permissions of the accounts above.
- Counts: owner's Waiting for me, All pending, Decided; Tech Webform pending count (2 on 11 Nov).
- Save to `executions/execu_<date>_desk-approvals/baseline.json`.

### 1.4 Environment blockers
- Email checks (reminders, rejection reason to submitter) need a mailbox the user can read; else mark Inconclusive.
- Overdue rows need either a short limit (if configurable, e.g. 1 h) or a wait; plan K-group rows at the start of the day.
- Performance rows (N8, N9) need seeded volume; ask the user before creating >200 records.

### 1.5 Cleanup (in this order)
1. Cancel every pending QA PA manual approval; reject every pending QA PA web form submission ("QA PA cleanup").
2. Revoke QA PA tickets from QA PA Refund, deactivate and delete the blueprint.
3. Delete QA PA tickets, contact, forms, workflow rule, view; move remaining tickets out and delete QA PA departments and team.
4. Restore Settings → Approvals and profile permissions from the baseline.
5. Check the 2 Tech Webform submissions are still pending and untouched.

---

## 2 Surface and contract (fill "Actual" in step 0.2)

| Proposed (NDC-2871 / doc) | Actual |
|---|---|
| Route `/approvals`, nav entry "Approvals" with count | |
| Lists: Waiting for me · Requested by me · All pending · Decided | |
| `GET /desk/approvals` (+ filters, `meta.counts`) | |
| `GET /desk/approvals/{id}`, `/approve`, `/reject`, `/spam`, `/cancel`, `/remind`, `/reassign`, `/comments`, `/bulk`, `GET /desk/approvals/counts` | |
| Errors: 403 `APPROVAL_NOT_APPROVER`, 404 no access, 409 `APPROVAL_ALREADY_DECIDED`, 422 needs transition form, 429 `APPROVAL_REMIND_TOO_SOON` | |
| Permissions "View department approvals", "Manage approvals" | |
| Settings → Approvals (default overdue limit) | |

### 2.1 Messages to check verbatim (en)
- "Nothing is waiting for your approval." · "No approvals match these filters." · "Approvals could not be loaded. Check your connection and try again." · "Approved" · "Rejected" · "Already approved by {name} at {time}" · "2 approved, 1 failed: …" · "Waiting for approval from {name}".

### 2.2 Data classes (reject reason, comment, search)
Empty · 1–2 characters · exactly 3 · 2000 · 2001 · spaces only · leading/trailing spaces · Arabic · mixed Arabic/English · emoji · `<script>alert(1)</script>` · `<b>bold</b>` · SQL-like `' OR 1=1 --` · line breaks · 10 KB paste.

---

## Group A — Access, permissions and navigation

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| A1 | Nav entry for every agent | Sign in as O, A, B, C, S; look at Desk navigation | "Approvals" shown to all; opens `/approvals` | `[func]` | PA-NAV-1, PA-PERM-1 |
| A2 | Nav count = my pending | Seed 3 manual approvals for B; open Desk as B | Count 3; as A count 0 and hidden | `[func]` | PA-NAV-2 |
| A3 | Count hidden at 0, "99+" above 99 | B with 0; then (if allowed) 100 pending for B via API | Hidden; "99+" | `[ui]` | PA-NAV-2 |
| A4 | Count refreshes | Page open as B; A requests one more from another session; wait 60 s, or focus the tab | Count goes up without reload | `[func]` | PA-NAV-2 |
| A5 | Deep link | Open `/approvals?item={id}` from the notification and by pasting | Page opens with that item's details | `[func]` | PA-NAV-3 |
| A6 | Deep link to an item I cannot see | C opens B's item link | Not shown; generic "not found" (no subject leaked) | `[sec]` | PA-PERM-2, NFR-5 |
| A7 | All pending hidden for agents | A, B, C: look for All pending | Not offered; direct URL/param refused or empty | `[sec]` | PA-TAB-1 |
| A8 | Supervisor scope | S opens All pending | Only QA PA Dept 2 items; counts match | `[sec]` | PA-PERM-2, AC-9 |
| A9 | Admin sees all | O opens All pending | Items from both departments | `[func]` | Users table |
| A10 | Department access | C (not in Dept 1) lists, searches, filters by Dept 1, calls list API with Dept 1 id | Never sees Dept 1 items or counts | `[sec]` | PA-PERM-2, NFR-5 |
| A11 | Requester loses access | A requests on T05; move A out of Dept 1 | A still sees the request in Requested by me with subject only, no ticket link | `[sec]` | PA-PERM-2 |
| A12 | New permissions in Profiles | Settings → Profiles → Desk | "View department approvals" and "Manage approvals" listed; Owner and Admin have both | `[func]` | PA-PERM-5 |
| A13 | Removing a permission takes effect | Remove "View department approvals" from S's profile; S reloads | All pending gone; API refuses | `[sec]` `[serial]` | PA-PERM-5 |
| A14 | Team approver membership at decision time | Request on T06 with approver QA PA Team; remove D from the team; D tries to approve | D refused; another team member can approve | `[sec]` | PA-PERM-4 |
| A15 | Non-approver cannot decide | C and A call approve and reject on B's item (UI and API) | No buttons; API 403 `APPROVAL_NOT_APPROVER` | `[sec]` `[api]` | PA-PERM-3, AC-2 |

## Group B — Lists, data per item, sort and paging

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| B1 | Waiting for me holds all three sources | Seed one manual (T01), one web form submission (QA PA Form), one blueprint step (T10) for B | All three in B's Waiting for me, each with the right source | `[func]` | PA-TAB-1, PA-LIST-1 |
| B2 | Requested by me | As A after B1 | Manual and blueprint items A started; not the web form one | `[func]` | PA-TAB-1 |
| B3 | Decided list | Approve, reject, cancel one each; let one web form item expire (if a short expiry can be set) | All four in Decided, newest first, with who and when | `[func]` | PA-TAB-3 |
| B4 | Decided limited to 90 days and to what I could see | Compare B's and C's Decided | C does not see Dept 1 decisions | `[sec]` | PA-TAB-3 |
| B5 | Manual item fields | Inspect the T01 item | Ticket number + subject, source Manual, contact name/email, department, requested by A, approver B, waiting time, Pending, actions | `[ui]` | PA-LIST-1 |
| B6 | Web form item fields | Inspect the submission | Form name, first line of message, "not a ticket yet" marker, submitted name/email, "web form" as requester, no ticket number | `[ui]` | PA-LIST-1, PA-WF-2 |
| B7 | Blueprint item fields | Inspect T10 | Blueprint name, Validation → Finance review, requested by A | `[ui]` | PA-LIST-1 |
| B8 | Team and several approvers | Request on T02 to B + QA PA Team | Team shown as a team; mode shown ("any one", or "all" if built) | `[ui]` | PA-LIST-1, PA-ACT-5 |
| B9 | Default sort | Create items 1 min apart | Waiting for me and All pending oldest first; Requested by me and Decided newest first | `[func]` | PA-LIST-2 |
| B10 | Sort by each column | Sort by number, waiting, department, requester, both directions | Correct order; ties stable | `[func]` | PA-LIST-2 |
| B11 | Paging | ≥ 30 pending items for B | 25 per page, total "1–25 of N", next page correct, no duplicates or gaps | `[func]` | PA-LIST-3 |
| B12 | Item opens details; number opens ticket | Click row; click ticket number | Details open; ticket opens | `[func]` | PA-LIST-4 |
| B13 | Item decided elsewhere while open | B has the list open; D approves the shared item in another session | Row marked "Approved by D …", no actions; leaves on refresh | `[conc]` | PA-LIST-5 |
| B14 | Ticket deleted while open | Delete T03 (pending approval) from another session | Row marked, no actions; gone on refresh; approval Cancelled | `[conc]` | PA-LIST-5, PA-INT-6 |
| B15 | Empty states | B with nothing pending; filters matching nothing; block the API (offline) | The three messages in §2.1, with their actions; never blank | `[ux]` | PA-LIST-6 |
| B16 | List state in URL | Set list, filters, sort; copy URL; open in a new session | Same view | `[func]` | PA-TAB-4 |
| B17 | Remembered next visit | Change list and filters; sign out and in | Same view restored | `[func]` | PA-TAB-4 |
| B18 | Counts follow department scope | Switch scope Dept 1 / Dept 2 / all | All counts and list counts change to match | `[func]` | PA-NAV-4, PA-NAV-5, PA-TAB-2 |
| B19 | Count cards filter | Click overdue, web form, blueprint counts | List filtered; click again clears | `[func]` | PA-NAV-5 |

## Group C — Filters and search

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| C1 | Source filter, several | Manual + Blueprint | Only those sources | `[func]` | PA-FLT-1 |
| C2 | Each other filter | Department, requested by, approver (as O/S), waiting buckets, date range, blueprint, web form, priority — one at a time | Each returns exactly the matching items | `[func]` | PA-FLT-1 |
| C3 | Approver filter hidden for agents | As B | Not offered; API param ignored or refused | `[sec]` | PA-FLT-1 |
| C4 | Filters combine | Source Web form + waiting > 4 h | AND of both | `[func]` | PA-FLT-1 |
| C5 | Active filters listed, clear one, clear all | Apply 3; remove 1; clear all | Chips/list update; full list back | `[ux]` | PA-FLT-2 |
| C6 | Search by number | "1043" and "#1043" | Same result | `[func]` | PA-FLT-3 |
| C7 | Search other fields | Subject word, contact name, contact email, submitter email, approval subject | Each finds the item | `[func]` | PA-FLT-3 |
| C8 | Arabic search | Item with Arabic subject; search part of it | Found | `[i18n]` | PA-FLT-3 |
| C9 | Search timing | Type quickly; watch requests | One request ~300 ms after typing stops | `[perf]` | PA-FLT-3 |
| C10 | Search data classes | §2.2 classes in the search box | No error, no script runs, no server error | `[data]` `[sec]` | PA-FLT-3 |
| C11 | Server-side | With > 25 items, search for one on page 2 | Found (not only the loaded page) | `[func]` | PA-FLT-4 |

## Group D — Item details

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| D1 | Header | Open each source | Source, status, title, waiting time; ticket link except for web form | `[ui]` | PA-DTL-1 |
| D2 | Request block | Manual item with B + D | Subject, description, requester, time, each approver with own state, mode | `[func]` | PA-DTL-2 |
| D3 | Ticket summary read-only | Manual and blueprint | Status, priority, owner, department, contact, channel, created, SLA due, last 2 messages; nothing editable | `[func]` | PA-DTL-3 |
| D4 | Web form block | Submission with 3 fields, 1 attachment, duplicate email | All fields in form order, attachment with size (downloads), spam score/signals, expiry, duplicate hint with links | `[func]` | PA-DTL-4 |
| D5 | Blueprint block | T10 | Blueprint, Validation → Finance review, transition name, values entered by A, what approve and reject do | `[func]` | PA-DTL-5 |
| D6 | Activity | After request, remind, comment, reassign, decision | All events in time order with actor | `[func]` | PA-DTL-6 |
| D7 | Comment without deciding | B comments; A comments; C tries via API | Shown in activity and on the ticket Approval tab; C refused | `[func]` `[sec]` | PA-DTL-7 |
| D8 | Comment data classes | §2.2 classes | Limits enforced with a clear message; stored text shown as text | `[data]` `[sec]` | PA-DTL-7 |
| D9 | Actions follow permissions | Same item as A, B, C, S, O | Each sees only allowed actions; matches server answers | `[sec]` | PA-DTL-8, PA-API-2 (doc) |
| D10 | Next / previous by keyboard | Open item, press the keys | Moves through the current list order | `[a11y]` | PA-DTL-9 |

## Group E — Actions

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| E1 | Approve with comment | B approves T01 with a comment | "Approved"; leaves Waiting for me; counts −1; ticket Approval tab Approved by B with comment; A notified | `[func]` | PA-ACT-1, AC-1 |
| E2 | Approve without comment | B approves T04 | Works | `[func]` | PA-ACT-1 |
| E3 | Reject needs a reason | B rejects with empty, 2 chars, spaces only | Refused with a clear message | `[func]` `[data]` | PA-ACT-2 |
| E4 | Reject reason limits | 3 chars, 2000, 2001, Arabic, script text | 3 and 2000 accepted; 2001 refused; script shown as text | `[data]` `[sec]` | PA-ACT-2 |
| E5 | Reject | B rejects T05 with a reason | "Rejected"; reason on ticket; A notified with reason | `[func]` | PA-ACT-2 |
| E6 | Any one | Approvers B + D, mode any one; B approves | Approved at once; D's item leaves D's list | `[func]` | PA-ACT-5 |
| E7 | All (if built) | Mode all; B approves, then D approves; second item B approves, D rejects | First: "1 of 2" then Approved; second: Rejected | `[func]` | PA-ACT-5 |
| E8 | Bulk approve | B selects 3 and approves with one comment | All approved; result summary | `[func]` | PA-ACT-3 |
| E9 | Bulk with a failure | One of 3 cancelled meanwhile | "2 approved, 1 failed" with the reason | `[func]` `[conc]` | PA-ACT-3, AC-8 |
| E10 | Bulk limit | Select 51 | Refused or capped at 50 with a message | `[func]` | PA-ACT-3 |
| E11 | Bulk reject needs a reason | Bulk reject with empty reason | Refused | `[func]` | PA-ACT-3 |
| E12 | Bulk skips blueprint items that need the form | Include the "Approve replacement" item | Excluded with "open to approve" note | `[func]` | PA-ACT-3, PA-BP-3 |
| E13 | Remind | A reminds on T07; again within the hour | First: B gets in-app + email; second refused, shows last-sent time | `[func]` | PA-ACT-4 |
| E14 | Decide on behalf (if built) | O approves B's item without typing a reason; then with a reason | First refused; second works; history "Approved by O on behalf of B" | `[func]` `[sec]` | PA-ACT-9 |
| E15 | Decide on behalf needs Manage approvals | S tries | Refused | `[sec]` | PA-ACT-9 |
| E16 | Cancel request | A cancels T08 (pending manual) | Cancelled; B told it is no longer needed | `[func]` | PA-ACT-6 |
| E17 | Cancel not offered where not allowed | B on A's request; A on a blueprint item; A on a decided item | No cancel; API refuses | `[sec]` | PA-ACT-6 |
| E18 | Reassign | S (Dept 2 item) or O replaces B with D | D gets the item + notification; B loses it; activity entry | `[func]` | PA-ACT-7 |
| E19 | Reassign only to someone with access | Reassign to C (no Dept 1 access) | Refused | `[sec]` | PA-ACT-7 |
| E20 | Two approvers at once | B and D (separate sessions) approve and reject the same any-one item within 1 s | One decision; the other sees "Already approved by …"; history has one decision | `[conc]` | PA-ACT-8, AC-7 |
| E21 | Double click | Double-click Approve; send the approve call twice | One decision; second call returns the same result, not an error | `[conc]` | PA-ACT-10, NFR-3 |

## Group F — Manual requests (ticket side)

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| F1 | Ticket Approval tab unchanged | Run T-27-01…06 from the manual test plan | All pass as before | `[reg]` | PA-MAN-1 |
| F2 | Decision on ticket shows on page and back | Approve on the ticket tab; reject another on the page | Each shows in the other place | `[func]` | PA-MAN-1 |
| F3 | Approver must have department access | A picks C (outside Dept 1) in the ticket picker; and via API | Not offered; API refuses | `[sec]` | PA-MAN-2 |
| F4 | "Approval pending" marker | Ticket with a pending approval, in lists and on the ticket; then decide | Marker shown; gone after the decision | `[ui]` | PA-MAN-3 |

## Group G — Web form submissions `[serial]`

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| G1 | Review modes unchanged | QA PA Form: None, Approval, Spam (threshold 90) — submit once in each | None → ticket at once; Approval → held; Spam → held only if score ≥ 90 | `[reg]` | PA-WF-1 |
| G2 | Held submission is not a ticket | Submit with Review = Approval | No ticket, not in views, reports or SLA counts | `[func]` | PA-WF-2 |
| G3 | Same item in Pending tab and page | Approve on the page; reject another in the form's Pending tab | Each decision shows in both places | `[func]` | PA-WF-3 |
| G4 | Approver list per form | Set approvers B + QA PA Team; submit | B and team members get the item in Waiting for me and a notification; A does not | `[func]` | PA-WF-4 |
| G5 | Empty approver list = today | Clear the list; submit | Anyone with "web form approve" can decide (as today) | `[reg]` | PA-WF-4 |
| G6 | Approver list only offers people with access | Try to add C | Not offered or refused | `[sec]` | PA-WF-4 |
| G7 | Reject requires a reason, optional email | Reject without reason; then with reason + "send to submitter" | First refused; second: submitter gets the reason; no ticket | `[func]` | PA-WF-5, AC-4 |
| G8 | Reject without sending | Reject with reason, box off | Submitter gets nothing | `[func]` | PA-WF-5 |
| G9 | Department and priority before approve | Change to Dept 2 + High; approve | Ticket created in Dept 2 with High; values submitted unchanged | `[func]` | PA-WF-6, AC-3 |
| G10 | Submitted values not editable | Look for edit on values; try via API | Not possible | `[sec]` | PA-WF-6 |
| G11 | Approve creates the ticket and runs automation | Assignment rule + workflow rule on Dept 1; approve | Ticket created now; assignment, workflow, SLA, auto-reply run in that order; history "Approved by … from web form QA PA Form" | `[func]` | PA-WF-7, PA-INT-5 |
| G12 | Mark as spam | Mark one as spam, with and without "block email" | No ticket; submission gone; email blocked only when ticked | `[func]` | PA-WF-8 |
| G13 | Attachments | Approve one with a file; reject another with a file | File on the new ticket; rejected file no longer downloadable | `[func]` | PA-WF-9 |
| G14 | Turning Review off keeps held items | 2 held; set Review = None | Both still listed and decidable | `[func]` | PA-WF-10 |
| G15 | Expiry | Held item past its expiry time (shortest setting) | Moves to Decided as Expired; no ticket | `[func]` | §8.1 web form |
| G16 | Pending confirmation | Form with double opt-in; submit, don't confirm | Shown as pending confirmation, not decidable until confirmed (or as the build defines; record) | `[func]` | PA-WF-1 |
| G17 | Spam score shown | Spam-mode item | Score and signals in details | `[ui]` | PA-DTL-4 |

## Group H — Blueprint approval steps `[serial]`

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| H1 | Waiting state on the ticket | A runs "Send to Finance" on T10 | Ticket shows "Waiting for approval from B"; no transitions can run; item on B's page | `[func]` | PA-BP-1, AC-5 |
| H2 | Approvers from the step | Step with a team; run it | Team members see the item | `[func]` | PA-BP-2 |
| H3 | Approve from the page | B approves | Ticket in Finance review; after-transition actions ran; state SLA started | `[func]` | PA-BP-3, AC-5 |
| H4 | Reject from the page | Another ticket; B rejects with a reason | Stays in Validation; form data in activity; A notified with reason; A can run it again | `[func]` | AC-6 |
| H5 | Step needs the approver's fields | "Approve replacement" item; click approve on the page | Sent to the ticket's transition form; direct approve call refused (422 or equivalent) | `[func]` | PA-BP-3 |
| H6 | Same effect from ticket and page | Approve one on the ticket | Page updates to Approved | `[func]` | PA-BP-3 |
| H7 | Timers keep running | Note state timer and SLA before; wait 10 min while pending | Both advanced; waiting time shown | `[func]` | PA-BP-4 |
| H8 | Edit while pending | Edit subject and priority of T11 while pending | Stays in blueprint; still one pending approval | `[reg]` | PA-BP-5 |
| H9 | Ticket leaves the blueprint | Revoke T12; move T13 to Dept 2; close T14 — each while pending | Each approval Cancelled with "Ticket left the blueprint" | `[func]` | §8.1 blueprint |

## Group K — Overdue, reminders, notifications `[serial]`

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| K1 | Overdue by limit source | Items with: step limit 1 h, form "Decide within" 1 h, Desk default | Each flagged overdue after its own limit, in department business hours | `[func]` | PA-OVD-1 |
| K2 | Business hours | Dept 1 hours Mon–Fri 9–17; request at 16:30 with 1 h limit | Overdue at 09:30 next working day, not 17:30 | `[func]` | PA-OVD-1 |
| K3 | One automatic reminder at the limit | Wait past the limit | Approvers get one reminder (in-app + email), not repeated | `[func]` | PA-OVD-2 |
| K4 | Escalation at 2× | Wait to twice the limit | Supervisor/department admins notified once | `[func]` | PA-OVD-2 |
| K5 | Overdue shown and counted | After K1 | "Overdue by …" on item; overdue count matches | `[ui]` | PA-OVD-3 |
| K6 | Notification matrix | Trigger each event in the NDC-2871 table | Right people, in-app and email as the table says; email links open the item | `[func]` | Notifications table |
| K7 | Notification language | B set to Arabic; trigger a request | Arabic text | `[i18n]` | PA-NTF-1 |
| K8 | Email preference | B turns approval emails off | No email; in-app still arrives; "new request" in-app cannot be turned off | `[func]` | PA-NTF-2 |

## Group L — Integrations

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| L1 | Ticket History | After request, decision, cancel, reassign on T15 | Each in History with actor and comment | `[func]` | PA-INT-1 |
| L2 | Workflow triggers | QA PA WF approved; approve a manual item and a blueprint item; reject one with source condition | Rule runs only on matching events and sources | `[func]` | PA-INT-2 |
| L3 | View filter | QA PA pending view | Shows exactly tickets with a pending approval | `[func]` | PA-INT-3 |
| L4 | Reports | Approvals report by source, status, department, approver; time to decide | Numbers match the seeded data | `[func]` | PA-INT-4 |
| L5 | Merge | Merge T16 (pending) into T17 | T16's approval Cancelled "Ticket merged into #…" | `[func]` | PA-INT-6 |
| L6 | Delete and restore | Delete T18 (pending); restore from Recycle Bin | Cancelled on delete; stays cancelled after restore | `[func]` | PA-INT-6 |
| L7 | Department move | Move T19 (pending, approver B) to Dept 2 | Approval stays; B flagged "No access"; counted as overdue for supervisors | `[func]` | PA-INT-7 |

## Group N — Security, i18n, accessibility, performance, compatibility

| ID | Title | Steps | Expected | Tags | Req |
|---|---|---|---|---|---|
| N1 | IDs from another tenant or department | Call details/decision with ids from Dept 2 (as B) and a random UUID | 404, no data | `[sec]` `[api]` | NFR-5 |
| N2 | Export and notifications do not leak | If an export exists; check C's notifications | No Dept 1 items | `[sec]` | NFR-5 |
| N3 | Stored text is shown as text | Script and HTML in reason, comment, web form values | Shown as text everywhere (page, ticket, email) | `[sec]` | §2.2 |
| N4 | Arabic layout | Switch to Arabic | Page right-to-left; ticket numbers and times left-to-right inside text; all labels Arabic | `[i18n]` | PA-I18N-1 |
| N5 | Time zone and date format | Change B's profile time zone and format | All times follow it | `[i18n]` | PA-I18N-2 |
| N6 | Keyboard only | Do E1, E5, E8 without a mouse | All possible; focus moves into details and back; dialogs keep focus | `[a11y]` | PA-A11Y-1 |
| N7 | Not colour alone; action names | Screen reader / accessibility tree | Status in text; buttons read "Approve ticket #…" | `[a11y]` | PA-A11Y-2, PA-A11Y-3 |
| N8 | List speed | 10,000 pending items, 50 departments (only with user OK) | List under 800 ms p95 over 20 calls | `[perf]` | NFR-1 |
| N9 | Count speed | Same data | Count under 200 ms p95 | `[perf]` | NFR-2 |
| N10 | Phone width | 400 px wide | Works, no sideways scrolling, details full screen | `[compat]` | NFR-4 |
| N11 | Browsers | Chrome, Edge, Firefox latest | Same behaviour | `[compat]` | — |

## E2E journeys `[serial]`

| ID | Journey | Covers |
|---|---|---|
| E2E-1 | Customer submits QA PA Form → held → B sees it in Waiting for me with notification → B sets priority High and approves → ticket created, assigned, auto-reply received → ticket shows "Approved by B from web form" | AC-3, G4, G9, G11 |
| E2E-2 | A runs "Send to Finance" on a refund ticket → waiting state → B rejects with reason → A fixes and runs again → B approves from the page → ticket in Finance review, SLA started | AC-5, AC-6, H1–H4 |
| E2E-3 | A requests approval from B + D (any one) → nobody acts → overdue reminder → escalation to S → S reassigns to D → D approves → History shows every step | K1–K4, E18, L1 |
| E2E-4 | Arabic user B handles one item from each source by keyboard only | N4, N6, AC-10 |

## Group Z — Not in this release (confirm still absent; not bugs)

| ID | Item |
|---|---|
| Z1 | Multi-level chains or amount-based rules |
| Z2 | Approving from email without signing in |
| Z3 | Mobile app screens |
| Z4 | Reply review (T-28) as a source on this page |

---

## Traceability

| Requirement | Rows |
|---|---|
| PA-PERM-1…5 | A1, A6–A15 |
| PA-NAV-1…5 | A1–A5, B18, B19 |
| PA-TAB-1…4 | A7, B1–B4, B16, B17 |
| PA-LIST-1…6 | B5–B15 |
| PA-FLT-1…4 | C1–C11 |
| PA-DTL-1…9 | D1–D10, G17 |
| PA-ACT-1…10 | E1–E21 |
| PA-MAN-1…3 | F1–F4 |
| PA-WF-1…10 | G1–G16 |
| PA-BP-1…5 | H1–H9 |
| PA-OVD-1…3 | K1–K5 |
| Notifications, PA-NTF-1…2 | K6–K8 |
| PA-INT-1…7 | L1–L7, G11 |
| PA-I18N, PA-A11Y | N4–N7 |
| NFR-1…5 | N1, N2, N8–N10, E21 |
| AC-1…10 | E1, A15, G9, G7, H1/H3, H4, E20, E9, A8, N4 |

## Reporting
- Results in `executions/execu_<date>_desk-approvals/` (report.md + HTML report), one row per ID: Pass / Fail / Inconclusive / Not in release, with evidence.
- Failed rows only get screenshots (annotated; side-by-side with Zoho only where a `[zoho]` comparison applies).
- Retest result goes on NDC-2871 as a comment after the user approves; bugs filed separately and linked to NDC-2871.
