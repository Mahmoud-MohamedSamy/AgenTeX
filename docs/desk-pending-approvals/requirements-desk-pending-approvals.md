# TAVI Desk: Pending Approvals page (requirements)

| | |
|---|---|
| Product | TAVI Desk |
| Feature | One page that lists every ticket or submission waiting for an approval decision |
| Status | Draft for developers, 11 Nov 2026 |
| Sample page | `pending-approvals-sample.html` (same folder). Each numbered pin on it points to a requirement ID below. |
| Related | T-27 ticket approvals (built), T-28 reply review (built), NDC-1974 / NDC-2754 blueprint ("Submit for approval" as a transition step), Web forms (NDC-1488, NDC-2732, NDC-2751) |

---

## 1. Problem

Desk can put work on hold for an approval in three places:

1. **Manual request.** An agent opens a ticket, goes to the **Approval** tab and sends an approval request to one or more approvers.
2. **Web form.** A web form can be set to hold new submissions until someone approves them. Only an approved submission becomes a ticket.
3. **Blueprint.** A blueprint transition can include a **Submit for approval** step. The ticket waits at that transition until the approval is decided.

Each of these can only be seen from inside one ticket (or not at all, for held web form submissions, because they are not tickets yet). There is no page where:

- an approver sees everything waiting for them,
- an agent sees the status of the requests they sent,
- a supervisor or admin sees what is stuck, for how long, and with whom.

So approvals are missed, and tickets and submissions wait without anyone noticing.

### What exists today (seen on NDC-Staging, 2 Nov 2026)

| Part | Today | Source |
|---|---|---|
| Request approval on a ticket | `POST /desk/tickets/{id}/approvals` `{subject, description, approver_user_ids[]}` → 201, `status: pending` | Go-live wave 2 run |
| List a ticket's approvals | `GET /desk/tickets/{id}/approvals` | same |
| Approve / reject / cancel | `POST …/approvals/{aid}/approve`, `/reject` (body `{comment}`), `/cancel` | same |
| Only an approver can decide | Others get 403 `APPROVAL_NOT_APPROVER` | same |
| No approver | 400 `approver_user_ids required` | same |
| Approvers can be a team | Approval tab showed "Approvers: Customer Experience Specialists 2" | same |
| Approval tab on the ticket | Shows Pending / Approved / Cancelled cards, Approve / Reject for the approver, Cancel request for the requester | same |
| Blueprint "Submit for approval" step | Built in the designer (`/workflow/approvals` in the bundle) | Gap re-check, 8 Nov |
| Web form "approve before it becomes a ticket" | Described by the product team; the screen to approve held submissions is missing | This request |
| A list across tickets | **Missing.** No route, no view, no counter | This request |

These requirements add the cross-ticket page and the list API. They keep the existing per-ticket API and Approval tab working as they are.

### Reference products

- Zoho Desk shows approvals only on the ticket's Approval tab; the approver gets an email link (Zoho Desk inventory ZT-162, ZR-95). Zoho documents no central list, so this page goes beyond Zoho Desk.
- Zoho CRM has a central "Approvals" list under My Jobs (waiting for my approval, my requests). TAVI CRM has `/workflow/my-requests`. The Desk page should feel the same so users of both apps recognise it.

---

## 2. Goals and non-goals

**Goals**

- G1. One place to see and decide every pending approval, whatever its source.
- G2. Approvers can decide quickly, one by one or in bulk, without opening each ticket.
- G3. Requesters can follow their requests and send reminders or cancel.
- G4. Supervisors and admins can find stuck approvals (old, overdue, approver gone) and reassign them.
- G5. Every decision is kept in history with who, when and why.

**Not in this release**

- Building new approval rules (multi-level chains, "approve if amount > X"). The page shows what the existing sources create.
- Approving from email without signing in (keep the current email-link behaviour, if any).
- Mobile app screens (the web page must work at phone width, see NFR-4).

---

## 3. Users and permissions

| Role | Sees | Can do |
|---|---|---|
| Approver (any agent named as approver, or a member of a team named as approver) | Items where they are an approver | Approve, Reject, Comment, Open the ticket |
| Requester (agent who sent a manual request or ran a blueprint transition) | Items they requested | Remind, Cancel (manual requests only), Comment, Open |
| Supervisor (new permission `desk:approvals:view_department`) | All items in departments they belong to | View, Reassign approver, Remind |
| Admin (new permission `desk:approvals:manage`) | All items in all departments | View, Reassign approver, Remind, Cancel any manual request, Decide on behalf (with reason, see PA-ACT-9) |

Rules:

- **PA-PERM-1** The page and the nav entry are shown to every agent with Desk access. What they see is filtered by the table above.
- **PA-PERM-2** An agent never sees an item from a department they cannot access, even if they are the requester. (If the requester lost access, the item still shows in their "Requested by me" list with subject only and no ticket link.)
- **PA-PERM-3** Approve and Reject buttons are shown only to approvers of that item (and to admins under PA-ACT-9). The server must keep returning 403 `APPROVAL_NOT_APPROVER` for anyone else, whatever the UI shows.
- **PA-PERM-4** For a team approver, every current member of the team counts as an approver. Membership is checked at decision time, not at request time.
- **PA-PERM-5** The new permissions appear in Settings → Profiles under Desk with the labels "View department approvals" and "Manage approvals". Owner and Admin profiles have both by default.

---

## 4. Navigation and page layout

- **PA-NAV-1** Add **Approvals** to the Desk left sidebar, below Team Queue. Route: `/approvals` (Desk app). Icon: a check inside a shield or clipboard.
- **PA-NAV-2** The sidebar entry shows a counter of items **waiting for me** (pending, I am an approver). It hides at 0 and shows "99+" above 99. It refreshes when the page is focused and at least every 60 seconds (or by push, if the notifications channel is available).
- **PA-NAV-3** The notification bell and email for a new approval request link straight to `/approvals?item={id}` which opens the page with that item's detail panel open.
- **PA-NAV-4** The page has a header: title "Approvals", the department picker (same control as the Tickets header: All departments or one), a search box, and a refresh button.
- **PA-NAV-5** Below the header there are **summary cards** (counts for the current tab and department): Waiting for me · Overdue · Web form submissions · Blueprint steps. Clicking a card applies that filter.

### 4.1 Tabs

- **PA-TAB-1** Tabs: **Waiting for me** (default), **Requested by me**, **All pending** (supervisors/admins only), **Decided**.
- **PA-TAB-2** Each tab shows its count. Counts follow the department picker.
- **PA-TAB-3** "Decided" lists approved, rejected, cancelled and expired items from the last 90 days, newest first, for the items the user could see while pending.
- **PA-TAB-4** The selected tab, filters and sort are kept in the URL query so links can be shared, and remembered per user for the next visit.

---

## 5. The list

- **PA-LIST-1** Columns (in this order):
  1. Checkbox (bulk select; hidden in "Decided")
  2. **Item**: ticket number + subject (link). For a held web form submission: "Web form submission" + form name + first line of the message, and a grey "Not a ticket yet" label.
  3. **Source**: chip, one of *Manual request*, *Web form*, *Blueprint*. Blueprint chip shows "Blueprint name · From state → To state".
  4. **Contact · Department**: contact name and email (for web form: the submitted name and email), with the department on the line below. (Kept in one column so the row fits a 1280 px screen without sideways scrolling.)
  5. *(Department is shown inside column 4.)*
  6. **Requested by**: avatar + name. For web form: "Web form". For blueprint: the agent who started the transition.
  7. **Approvers**: avatars (max 3, then "+n"). Team approvers show the team name. Show "Any one" or "All" next to the avatars when there is more than one approver (see PA-ACT-5).
  8. **Waiting**: time since requested ("3 h", "2 d"). Red when overdue (PA-OVD-1).
  9. **Status**: Pending / Approved / Rejected / Cancelled / Expired pill (Decided tab), or the progress "1 of 2 approved" for All-mode items.
  10. **Actions**: Approve and Reject buttons when the user can decide; otherwise a "Remind" icon (requester) or nothing.
- **PA-LIST-2** Default sort: oldest request first in "Waiting for me" and "All pending"; newest first in "Requested by me" and "Decided". Sortable columns: Item number, Waiting, Department, Requested by.
- **PA-LIST-3** Page size 25 with "Load more" (or numbered pages; follow the Tickets list). Show "Showing 1–25 of 132".
- **PA-LIST-4** Clicking a row (not the buttons) opens the **detail panel** on the right (section 7). Clicking the ticket number opens the ticket in the same tab; Ctrl/Cmd-click opens a new tab.
- **PA-LIST-5** A row whose item changed while the page was open (decided by someone else, cancelled, ticket deleted) is greyed with a short note ("Approved by Sara 1 min ago") and its buttons are removed. It leaves the list on refresh.
- **PA-LIST-6** Empty states:
  - Waiting for me, none: "Nothing is waiting for your approval." plus a link to "Requested by me".
  - Filters hide everything: "No approvals match these filters." plus "Clear filters".
  - Load error: "Approvals could not be loaded. Check your connection and try again." plus "Try again". Never a blank page.

---

## 6. Filters and search

- **PA-FLT-1** Filters: Source (multi), Department (follows the header picker), Requested by (agent), Approver (agent or team; supervisors/admins only), Waiting (any, > 4 h, > 1 day, > 3 days, overdue), Requested date range, Blueprint (name), Web form (name), Priority of the ticket.
- **PA-FLT-2** Active filters show as removable chips above the list, with "Clear all".
- **PA-FLT-3** Search matches ticket number (with or without #), subject, contact name/email, web form submitter email, and approval subject. Arabic text is matched as typed. Results update after 300 ms without typing.
- **PA-FLT-4** Filter and search are applied on the server (the list can hold thousands of rows).

---

## 7. Detail panel

Opens on the right, over the list (full screen at phone width). Close with ×, Esc, or a click outside.

- **PA-DTL-1** Header: source chip, status pill, item title, ticket number link "Open ticket ↗" (not for held submissions), waiting time.
- **PA-DTL-2** **Request** block: subject, description (manual requests), requested by and when, approvers with each one's decision state (Pending / Approved at … / Rejected at …), and the mode "Any one approver" / "All approvers".
- **PA-DTL-3** **Ticket summary** block (manual and blueprint): status, priority, owner, department, contact, channel, created time, SLA due, last 2 messages (collapsed). Read-only.
- **PA-DTL-4** **Web form submission** block (web form source): form name, submitted at, every submitted field as label → value in the form's field order, attachments (download, with size), submitter IP and country if the form records them, and a duplicate hint: "This email has 2 open tickets" with links.
- **PA-DTL-5** **Blueprint step** block (blueprint source): blueprint name, current state → target state, the transition name, the values the agent entered in the transition form (fields, comment, attachments), and what will happen on approval ("Ticket moves to *Finance review*") and on rejection ("Ticket stays in *Validation*").
- **PA-DTL-6** **Activity** block: timeline of the approval (requested, reminded, reassigned, each approver's decision, comments), newest at the bottom.
- **PA-DTL-7** **Comment** box: approvers, requester and admins can add a comment without deciding. Comments show in the timeline and on the ticket's Approval tab.
- **PA-DTL-8** Footer buttons follow PA-ACT rules: Reject (secondary, red text), Approve (primary). For requesters: Remind, Cancel request. For admins: Reassign approver.
- **PA-DTL-9** Up/Down arrow keys (or J/K) move to the previous/next item while the panel is open, so an approver can work through the queue.

---

## 8. Actions

- **PA-ACT-1 Approve.** Opens a small in-page dialog with an optional comment (max 2000 characters) and "Approve". Calls the source's approve endpoint. On success: toast "Approved", row leaves the Waiting list, counter drops by one.
- **PA-ACT-2 Reject.** Dialog with a **required** reason (min 3, max 2000 characters). For web form items, also a "Send this reason to the submitter" checkbox (off by default) and the email preview. On success: toast "Rejected".
- **PA-ACT-3 Bulk approve / reject.** With rows selected, a bar shows "3 selected · Approve · Reject · Clear". One comment / reason applies to all. Bulk is limited to 50 rows. The result lists what failed and why, for example "2 approved, 1 failed: #1043 was already decided by Sara". Blueprint items whose transition form has required fields the approver must fill are excluded from bulk, with the note "Open to approve".
- **PA-ACT-4 Remind.** Requester (or supervisor/admin) sends the approvers a reminder (bell + email). Max one reminder per item per hour; the button shows "Reminded 20 min ago" when blocked.
- **PA-ACT-5 Several approvers.** Each request has a mode:
  - *Any one* (default, and the only mode the current API has): the first decision decides the item.
  - *All*: the item is approved when every approver approves; one rejection rejects it.
  If *All* is not built in this release, show no mode and treat every request as *Any one*. The page must not invent a mode the server does not enforce.
- **PA-ACT-6 Cancel request.** Requester or admin, manual requests only, pending only. Confirm in-page. Status → Cancelled. Blueprint items are cancelled by revoking the transition from the ticket, not from this page.
- **PA-ACT-7 Reassign approver.** Supervisor/admin replaces one approver with another agent or team who can access the ticket's department. Logged in Activity; new approver is notified.
- **PA-ACT-8 Concurrency.** If the item was already decided or cancelled when the user acts, the server answers 409 `APPROVAL_ALREADY_DECIDED` with who and when; the UI shows "Already approved by Sara at 10:42" and refreshes the row. No double decisions.
- **PA-ACT-9 Decide on behalf (admin).** Admin with `desk:approvals:manage` may approve or reject an item where they are not an approver, only after typing a reason. The history shows "Approved by Admin on behalf of Sara".
- **PA-ACT-10** All buttons are disabled while a request is running, to stop double clicks.

### 8.1 What each decision does, per source

| Source | Approved | Rejected | Cancelled / expired |
|---|---|---|---|
| Manual request | Approval status Approved on the ticket's Approval tab; ticket history entry; requester notified; workflow trigger "Approval approved" fires (PA-INT-2) | Status Rejected with the reason; requester notified; trigger "Approval rejected" | Status Cancelled; approvers notified it is no longer needed |
| Web form | A ticket is created from the submission **at approval time**: assignment rules, workflow rules (on create), SLA and auto-acknowledgement run as for a normal web form ticket. The ticket shows "Approved by … from web form *Name*" in History. The new ticket number is shown in a toast with a link | No ticket is created. The submission is kept as Rejected for 30 days (Decided tab), then deleted. Optional email with the reason to the submitter | Held submissions expire after N days (form setting, default 30) as Expired. Nothing is created |
| Blueprint | The transition completes: after-transition actions run, the ticket moves to the target state, state SLA starts | The ticket stays in the current state; the transition form data is kept in the Activity; the transition owner is notified with the reason and can run it again | If the ticket leaves the blueprint (revoke, department move, close) the pending approval becomes Cancelled with the reason ("Ticket left the blueprint") |

---

## 9. Source-specific rules

### 9.1 Manual requests

- **PA-MAN-1** Everything already built on the ticket's Approval tab keeps working. The page reads and acts through the same endpoints.
- **PA-MAN-2** The approver picker on the ticket must only offer agents and teams that can access the ticket's department. (Today a non-agent / outside agent can be chosen; go-live check T-27-03 and the "apNotAgent" result returned 201.)
- **PA-MAN-3** The ticket list and ticket header show a small "Approval pending" badge on tickets with at least one pending approval, linking to the Approval tab.

### 9.2 Web form submissions held for approval

- **PA-WF-1** Web form settings have "Approve submissions before they become tickets" (on/off) and "Approvers" (agents and/or teams with access to the form's department). If the setting exists today, keep it; if not, it is part of this work.
- **PA-WF-2** A held submission is stored with: form id, department, submitted fields, attachments, submitter email/name, submitted at, IP / user agent (if collected). It is not a ticket, has no ticket number, and does not count in ticket views, reports or SLA.
- **PA-WF-3** The submitter sees the form's normal "Thank you" message. (Optional setting, later: a different message "We will review your request".)
- **PA-WF-4** Before approval an approver can correct the **department** and **priority** that the new ticket will get (dropdowns in the detail panel). Submitted field values cannot be edited.
- **PA-WF-5** "Mark as spam" is a third action for web form items: no ticket, submission deleted, submitter email optionally added to the blocked list (uses the existing spam/block feature if present).
- **PA-WF-6** Attachments of held submissions are scanned and stored like ticket attachments, and moved to the ticket on approval. They are deleted with the submission on reject/expire.
- **PA-WF-7** Turning the setting off on a form does not drop the submissions already held; they stay on the page until decided or expired.

### 9.3 Blueprint "Submit for approval" steps

- **PA-BP-1** When an agent runs a transition that has a Submit-for-approval step, the ticket shows "Waiting for approval" on the blueprint bar and the transition buttons are disabled, with the tooltip "Waiting for approval from Sara".
- **PA-BP-2** The approvers are those set in the blueprint step (users, teams, or "Ticket owner's manager" if supported). They see the item on this page.
- **PA-BP-3** Approving from this page has the same effect as approving from the ticket. If the transition has during-fields the approver must fill, the page opens the ticket's transition form instead of approving directly.
- **PA-BP-4** State timers and SLA continue while waiting (same as Zoho; a state's own timer keeps running). The waiting time is shown so the approver knows the SLA risk.
- **PA-BP-5** Editing the ticket while the approval is pending must not drop the ticket out of the blueprint and must not start a second approval. (Regression of NDC-2334 / NDC-2707 on CRM.)

---

## 10. Overdue and reminders

- **PA-OVD-1** An item is **overdue** when it has waited longer than its limit: per blueprint step (if the step has one), per web form (setting "Decide within", default 24 h business hours), and for manual requests a Desk-wide default (Settings → Approvals, default 24 h). Business hours follow the department's business hours.
- **PA-OVD-2** At the limit, approvers get one automatic reminder; at 2× the limit, the requester's supervisor (or the department's admins) gets an escalation notice.
- **PA-OVD-3** Overdue items show a red "Overdue by 5 h" in the Waiting column and count in the Overdue card.

---

## 11. Notifications

| Event | Who | Bell | Email |
|---|---|---|---|
| New request | Approvers | Yes | Yes (link to `/approvals?item=`) |
| Reminder / overdue | Approvers | Yes | Yes |
| Escalation (2× limit) | Supervisor / dept admins | Yes | Yes |
| Approved / rejected | Requester; ticket owner if different | Yes | Yes (reject email has the reason) |
| Reassigned | New approver; old approver | Yes | New approver only |
| Cancelled / expired | Approvers | Yes | No |

- **PA-NTF-1** Notification texts are translatable (English and Arabic at least) and follow the user's language.
- **PA-NTF-2** Users can turn the email part off in their notification preferences; the bell cannot be turned off for "New request".

---

## 12. Integrations

- **PA-INT-1** Ticket History records every approval event (requested, decided, cancelled, reassigned) with actor and comment.
- **PA-INT-2** Workflow rules get two triggers on Tickets: "Approval approved" and "Approval rejected", with the source as a condition. (Check the existing Desk workflow trigger list first; add only if missing.)
- **PA-INT-3** Ticket views get a filter "Has pending approval" (yes/no).
- **PA-INT-4** Reports: count of approvals by source, status, department, approver; average and 90th-percentile time to decide.
- **PA-INT-5** Automation execution order: when a web form submission is approved, the ticket-create automations run in the same order as for a ticket created directly by the web form (assignment → workflow → SLA → notifications).
- **PA-INT-6** Merging tickets: pending approvals of the merged (child) ticket are cancelled with the reason "Ticket merged into #N". Deleting a ticket cancels its pending approvals; restoring from the Recycle Bin does not reopen them.
- **PA-INT-7** Department move: pending approvals stay; approvers who cannot access the new department are flagged "No access" in the detail panel and the item shows in the Overdue card for supervisors to reassign.

---

## 13. API

New list endpoint (one list for all sources):

```
GET /desk/approvals
  ?tab=waiting_for_me|requested_by_me|all_pending|decided
  &source=manual,web_form,blueprint
  &department_id=…&requested_by=…&approver_id=…
  &waiting_gt=PT4H&overdue=true
  &requested_from=2026-11-01&requested_to=2026-11-11
  &blueprint_id=…&web_form_id=…&priority=…
  &q=…&sort=requested_at|-requested_at|ticket_number|department
  &page=1&page_size=25
→ 200 { data: [ApprovalItem], meta: { total, page, page_size, counts: { waiting_for_me, requested_by_me, all_pending, decided, overdue, web_form, blueprint } } }
```

```
ApprovalItem {
  id, source: "manual"|"web_form"|"blueprint",
  status: "pending"|"approved"|"rejected"|"cancelled"|"expired",
  mode: "any"|"all",
  subject, description,
  ticket: { id, number, subject, priority, status, department_id } | null,   // null for held web form submissions
  submission: { id, web_form_id, web_form_name, email, name, first_line } | null,
  blueprint: { id, name, transition_id, transition_name, from_state, to_state } | null,
  department: { id, name },
  requested_by: { id, name, avatar } | null,      // null for web form
  requested_at, due_at, overdue: bool,
  approvers: [{ type: "user"|"team", id, name, decision: "pending"|"approved"|"rejected", decided_at }],
  can: { approve: bool, reject: bool, cancel: bool, remind: bool, reassign: bool, decide_on_behalf: bool },
  last_reminded_at, decided_by, decided_at, decision_comment
}
```

Other endpoints:

| Method | Path | Notes |
|---|---|---|
| GET | `/desk/approvals/{id}` | Full item with timeline, submission fields, blueprint form values |
| POST | `/desk/approvals/{id}/approve` | `{comment?}`; for web form also `{department_id?, priority?}` → returns `{ticket_id, ticket_number}` |
| POST | `/desk/approvals/{id}/reject` | `{reason}` required; web form `{notify_submitter: bool}` |
| POST | `/desk/approvals/{id}/spam` | Web form only |
| POST | `/desk/approvals/{id}/cancel` | Manual only |
| POST | `/desk/approvals/{id}/remind` | 429 `APPROVAL_REMIND_TOO_SOON` within 1 h |
| POST | `/desk/approvals/{id}/reassign` | `{from_approver, to_approver}` |
| POST | `/desk/approvals/{id}/comments` | `{content}` |
| POST | `/desk/approvals/bulk` | `{action: approve|reject, ids[≤50], comment|reason}` → per-id results |
| GET | `/desk/approvals/counts` | For the sidebar badge; cheap |

- **PA-API-1** The existing `/desk/tickets/{id}/approvals…` endpoints stay and share the same storage, so a decision made in either place shows in both.
- **PA-API-2** The `can` block is computed on the server. The UI shows buttons from `can`, never from its own role checks.
- **PA-API-3** Errors: 400 validation (with field), 403 `APPROVAL_NOT_APPROVER`, 404 (no access is reported as 404 so items are not leaked), 409 `APPROVAL_ALREADY_DECIDED` (with `decided_by`, `decided_at`), 422 for blueprint items that need the transition form, 429 for remind.
- **PA-API-4** Audit: every write stores actor, time, IP and user agent.

---

## 14. Language, accessibility, layout

- **PA-I18N-1** All texts in English and Arabic. Arabic switches the page to right-to-left: sidebar on the right, detail panel opens from the left, chips and avatars mirrored, numbers and ticket ids stay left-to-right inside the text.
- **PA-I18N-2** Times use the user's time zone and date format from their profile.
- **PA-A11Y-1** All actions reachable by keyboard; focus moves into the detail panel when it opens and back to the row when it closes; dialogs trap focus.
- **PA-A11Y-2** Status is shown by text as well as colour.
- **PA-A11Y-3** Buttons have accessible names that include the item ("Approve ticket #1043").

---

## 15. Non-functional

- **NFR-1** List API answers in under 800 ms (p95) for an org with 10,000 pending items and 50 departments.
- **NFR-2** The counts endpoint answers in under 200 ms (p95).
- **NFR-3** Decisions are idempotent per item (repeat calls after success return the same result, not an error).
- **NFR-4** The page works at 400 px width: list becomes cards, detail panel full screen, bulk bar at the bottom.
- **NFR-5** No item a user cannot access appears in counts, search results, exports or notifications.

---

## 16. Acceptance criteria (main flows)

**AC-1 Approver sees and approves a manual request**
Given agent A requests approval on ticket #1043 from agent B
When B opens Approvals
Then "Waiting for me" shows #1043 with source "Manual request", requested by A, waiting time, and the sidebar counter is 1
When B clicks Approve and confirms
Then the toast says "Approved", the row leaves the list, the counter is 0, the ticket's Approval tab shows Approved by B, and A gets a notification.

**AC-2 Non-approver cannot decide**
Given agent C is not an approver of #1043
Then C does not see #1043 in "Waiting for me" and sees no Approve/Reject button anywhere for it
And a direct API call by C to approve returns 403 `APPROVAL_NOT_APPROVER`.

**AC-3 Web form submission approved becomes a ticket**
Given web form "Refund request" holds submissions for approval, approver B
When a customer submits the form
Then no ticket is created, and B sees "Web form submission · Refund request · Not a ticket yet"
When B changes priority to High and approves
Then a ticket is created with priority High, assignment and workflow rules run, and the toast links to the new ticket number.

**AC-4 Web form submission rejected**
When B rejects with reason "Duplicate of #1040" and ticks "Send this reason to the submitter"
Then no ticket is created, the submitter gets the email with the reason, and the item shows in "Decided" as Rejected for 30 days.

**AC-5 Blueprint step approved**
Given ticket #1050 is in blueprint "Refund" state Validation and agent A runs transition "Send to Finance" which needs approval from B
Then the ticket's transition buttons are disabled with "Waiting for approval from B" and B sees the item with "Refund · Validation → Finance review"
When B approves
Then the ticket moves to Finance review and the after-transition actions run.

**AC-6 Blueprint step rejected**
When B rejects with a reason
Then #1050 stays in Validation, A is notified with the reason, and A can run the transition again.

**AC-7 Two approvers decide at the same time**
Given an "Any one" item with approvers B and D
When B approves and D clicks Reject a moment later
Then D sees "Already approved by B at 10:42", the item is Approved, and there is one decision in history.

**AC-8 Bulk approve with a failure**
When B selects 3 items and approves, and one was cancelled meanwhile
Then the result says "2 approved, 1 failed" with the reason for the failed one.

**AC-9 Department scoping**
Given supervisor S has `desk:approvals:view_department` in department Tech only
Then "All pending" shows only Tech items, and counts and search exclude other departments.

**AC-10 Arabic**
When the user switches to Arabic
Then the page, chips, dialogs, toasts and notifications are Arabic and right-to-left.

---

## 17. Test notes for QA

- Data prefix "QA PA " in subjects; one QA department; approvers = two agents and one team.
- Each source × each action × each role (approver, non-approver, requester, supervisor, admin).
- Concurrency (two browsers), bulk with mixed results, approver removed from department, ticket merged / deleted / moved / closed while pending, web form expiry, remind limit, Arabic, phone width.
- Regression: existing ticket Approval tab (T-27-01..06), reply review (T-28), blueprint transitions (spec-desk-blueprint).

---

## 18. Open questions for the product owner

1. Is "Approve submissions before they become tickets" already in the web form settings, or is it new in this work?
2. Do we need the *All approvers* mode now, or is *Any one* enough for the first release?
3. Should the SLA pause while a blueprint step waits for approval? (Proposed: no, same as Zoho.)
4. Default overdue limit (proposed 24 business hours) and default web form expiry (proposed 30 days).
5. Should reply review requests (T-28, "send reply for review") also appear on this page as a fourth source? (Proposed: yes, in a later release.)
6. Is "Decide on behalf" (PA-ACT-9) wanted, or should admins only reassign?
