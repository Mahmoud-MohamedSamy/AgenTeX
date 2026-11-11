TAVI Desk needs one Approvals page that lists every ticket or web form submission waiting for a decision, from all three sources: manual requests, web forms and blueprint steps. This item gives the behaviour and rules. Screen layout is left to design; the API design is left to the developers.

## Summary

| Item | Value |
| --- | --- |
| Product | TAVI Desk |
| Feature | Approvals page: one list of everything waiting for an approval decision |
| Builds on | T-27 ticket approvals (built), web form Review setting (built), blueprint "Submit for approval" step (NDC-1974, NDC-2754) |
| Related | T-28 reply review; web forms (NDC-1488, NDC-2732, NDC-2751) |
| Requirement IDs | PA-xxx (functional), NFR-x (non-functional), AC-x (acceptance) |

## Problem

Approvals can only be seen inside one ticket, and held web form submissions only inside each form's own settings, so approvals are missed and work waits unnoticed.

Desk puts work on hold for an approval in three places:

- **Manual request.** An agent sends an approval request from the ticket's Approval tab to one or more approvers.
- **Web form.** A web form holds new submissions until someone approves them. Only an approved submission becomes a ticket.
- **Blueprint.** A transition with a "Submit for approval" step waits until the approval is decided.

No place lets an approver see everything waiting for them, lets a requester follow their requests, or lets a supervisor find what is stuck and with whom.

### What exists today (NDC-Staging, checked 2 and 11 Nov 2026)

| Part | Today |
| --- | --- |
| Request approval on a ticket | Built: subject, description, one or more approvers; status Pending |
| Approve, reject, cancel on the ticket | Built, on the ticket's Approval tab |
| Only an approver can decide | Built: others are refused (403 APPROVAL_NOT_APPROVER) |
| Team as approver | Accepted ("Customer Experience Specialists 2" shown as approver) |
| Blueprint "Submit for approval" step | Built in the designer |
| Web form hold | Built: each form's Review setting is None, Approval or Spam; held submissions sit in a Pending tab on that form, with approve and reject; permission "web form approve" |
| A list across tickets and forms | Missing: no page, no list, no counter |

The ticket Approval tab and the form Pending tab stay as they are. This work adds the page that collects all of them.

### Reference products

- Zoho Desk shows approvals only on the ticket's Approval tab, and the approver gets an email link. Its documentation describes no central list.
- Zoho CRM has a central Approvals list (waiting for my approval, my requests). The Desk page should behave the same way so users of both apps recognise it.

## Goals and non-goals

**Goals**

- G1. One place to see and decide every pending approval, whatever its source.
- G2. Approvers decide quickly, one by one or in bulk, without opening each ticket.
- G3. Requesters follow their requests, send reminders, and cancel.
- G4. Supervisors and admins find stuck approvals (old, overdue, approver gone) and reassign them.
- G5. Every decision is kept in history with who, when and why.

**Not in this release**

- New approval rules (multi-level chains, "approve if amount > X"). The page shows what the existing sources create.
- Approving from email without signing in.
- Mobile app screens. The web page must still work at phone width (NFR-4).

## Users and permissions

What a user sees depends on their role; the server decides, never the screen.

| Role | Sees | Can do |
| --- | --- | --- |
| Approver (named agent, or member of a named team) | Items where they are an approver | Approve, reject, comment, open the ticket |
| Requester (sent a manual request or ran a blueprint transition) | Items they requested | Remind, cancel (manual only), comment, open |
| Supervisor (new permission "View department approvals") | All items in their departments | View, reassign approver, remind |
| Admin (new permission "Manage approvals") | All items in all departments | View, reassign, remind, cancel any manual request, decide on behalf (PA-ACT-9) |

- **PA-PERM-1** Every agent with Desk access can open the Approvals page. The content is filtered by the table above.
- **PA-PERM-2** An agent never sees an item from a department they cannot access. A requester who lost access still sees their request with the subject only and no ticket link.
- **PA-PERM-3** Only approvers of an item (and admins under PA-ACT-9) can approve or reject it. The server keeps refusing anyone else, whatever the screen shows.
- **PA-PERM-4** For a team approver, every current team member counts as an approver. Membership is checked at decision time, not request time.
- **PA-PERM-5** The new permissions appear in Settings → Profiles under Desk as "View department approvals" and "Manage approvals". Owner and Admin profiles have both by default.

## Functional requirements

### Access and counts

- **PA-NAV-1** Desk has an Approvals page at the route /approvals, reachable from the Desk navigation.
- **PA-NAV-2** The navigation shows the number of items waiting for the signed-in user (pending, user is an approver). Hidden at 0, "99+" above 99. Refreshed when the page gets focus and at least every 60 seconds, or by push if available.
- **PA-NAV-3** Notifications about a new request link to /approvals?item={id}, which opens that item's details directly.
- **PA-NAV-4** The page can be scoped to all departments or one department. The scope applies to every list, count and search on the page.
- **PA-NAV-5** The page gives four counts for the current scope: waiting for me, overdue, web form submissions, blueprint steps. Each count can be used as a filter.

### Lists

- **PA-TAB-1** Four lists: Waiting for me (default), Requested by me, All pending (supervisors and admins only), Decided.
- **PA-TAB-2** Each list shows its count, following the department scope.
- **PA-TAB-3** Decided holds approved, rejected, cancelled and expired items from the last 90 days, newest first, limited to items the user could see while they were pending.
- **PA-TAB-4** The chosen list, filters and sort are kept in the URL so links can be shared, and remembered per user for the next visit.

### Data shown per item

- **PA-LIST-1** Each item shows:
    - ticket number and subject; for a held web form submission, the form name, the first line of the message, and a clear "not a ticket yet" marker
    - source: manual request, web form, or blueprint (with blueprint name and from-state → to-state)
    - contact name and email (for web form: the submitted name and email) and department
    - requested by (agent; "web form" for submissions; for blueprint, the agent who ran the transition)
    - approvers, with team approvers named as teams, and the mode ("any one" or "all") when there is more than one
    - waiting time since the request, and whether it is overdue
    - status (pending, approved, rejected, cancelled, expired) or progress such as "1 of 2 approved"
    - only the actions the user is allowed to take on it (decided by the server)
- **PA-LIST-2** Default sort: oldest first in Waiting for me and All pending; newest first in Requested by me and Decided. Sortable by item number, waiting time, department, requester.
- **PA-LIST-3** 25 items per page, with the total shown ("1–25 of 132").
- **PA-LIST-4** Selecting an item opens its details (PA-DTL). The ticket number opens the ticket.
- **PA-LIST-5** An item that changed while the list was open (decided by someone else, cancelled, ticket deleted) is marked with who and when ("Approved by Sara 1 min ago") and can no longer be acted on. It leaves the list on refresh.
- **PA-LIST-6** Empty and error states:
    - Nothing waiting: "Nothing is waiting for your approval." with a way to Requested by me.
    - Filters hide everything: "No approvals match these filters." with Clear filters.
    - Load error: "Approvals could not be loaded. Check your connection and try again." with Try again. Never a blank page.

### Filters and search

- **PA-FLT-1** Filters: source (several), department, requested by, approver (agent or team; supervisors and admins only), waiting time (any, over 4 h, over 1 day, over 3 days, overdue), request date range, blueprint, web form, ticket priority.
- **PA-FLT-2** Active filters are listed and each can be removed; one action clears all.
- **PA-FLT-3** Search matches ticket number (with or without #), subject, contact name or email, web form submitter email, and approval subject. Arabic text matches as typed. Runs 300 ms after typing stops.
- **PA-FLT-4** Filtering and search run on the server.

### Item details

- **PA-DTL-1** Details show source, status, title, waiting time, and a link to the ticket (not for held submissions).
- **PA-DTL-2** Request: subject, description (manual), requester and time, each approver with their own decision state and time, and the mode.
- **PA-DTL-3** Ticket summary (manual and blueprint), read-only: status, priority, owner, department, contact, channel, created time, SLA due, last 2 messages.
- **PA-DTL-4** Web form submission: form name, submitted time, every submitted field in form order, attachments with size, spam score and signals, expiry time, and a duplicate hint ("This email has 2 open tickets" with links).
- **PA-DTL-5** Blueprint step: blueprint name, current state → target state, transition name, the values the agent entered in the transition form, and what approve and reject will each do.
- **PA-DTL-6** Activity: requested, reminded, reassigned, each decision, and comments, in time order.
- **PA-DTL-7** Approvers, requester and admins can comment without deciding. Comments also show on the ticket's Approval tab.
- **PA-DTL-8** The actions offered follow PA-ACT and what the server allows for this user.
- **PA-DTL-9** With details open, the user can move to the previous or next item by keyboard.

### Actions

- **PA-ACT-1 Approve.** Optional comment (max 2000 characters). On success: confirmation "Approved", the item leaves Waiting for me, counts drop by one.
- **PA-ACT-2 Reject.** Reason required (3 to 2000 characters). For web form items, an option to send the reason to the submitter (off by default). Confirmation "Rejected".
- **PA-ACT-3 Bulk approve or reject.** Up to 50 items, one comment or reason for all. The result lists each failure with its reason, for example "2 approved, 1 failed: #1043 was already decided by Sara". Blueprint items whose transition form needs fields from the approver are excluded and must be opened.
- **PA-ACT-4 Remind.** Requester, supervisor or admin sends approvers a reminder (in-app and email). Max one per item per hour; the user is told when the last one was sent.
- **PA-ACT-5 Several approvers.** Mode "any one" (default, and the only mode today): the first decision decides. Mode "all": approved when every approver approves; one rejection rejects. If "all" is not built in this release, treat every request as "any one" and show no mode.
- **PA-ACT-6 Cancel request.** Requester or admin, manual requests only, pending only, after confirmation. Blueprint items are cancelled by revoking the transition on the ticket.
- **PA-ACT-7 Reassign approver.** Supervisor or admin replaces an approver with an agent or team that can access the department. Logged in activity; the new approver is notified.
- **PA-ACT-8 Concurrency.** Acting on an item already decided or cancelled is refused with who and when; the user sees "Already approved by Sara at 10:42". Never two decisions.
- **PA-ACT-9 Decide on behalf.** An admin with "Manage approvals" may decide an item where they are not an approver, with a typed reason. History shows "Approved by Admin on behalf of Sara".
- **PA-ACT-10** An action cannot be sent twice while it is running.

### What each decision does

| Source | Approved | Rejected | Cancelled or expired |
| --- | --- | --- | --- |
| Manual request | Approval tab shows Approved; ticket history entry; requester notified; workflow trigger "Approval approved" (PA-INT-2) | Rejected with reason; requester notified; trigger "Approval rejected" | Cancelled; approvers told it is no longer needed |
| Web form | Ticket created at approval time; assignment, workflow (on create), SLA and auto-reply run as for a normal web form ticket; history says "Approved by … from web form X"; new ticket number shown | No ticket; kept as Rejected for 30 days, then deleted; optional email with reason to submitter | Expires at the submission's expiry time; nothing created |
| Blueprint | Transition completes: after-transition actions run, ticket moves to target state, state SLA starts | Ticket stays in current state; form data kept in activity; transition owner notified with reason and can run it again | If the ticket leaves the blueprint (revoke, department move, close), the approval becomes Cancelled: "Ticket left the blueprint" |

## Source-specific rules

### Manual requests

- **PA-MAN-1** The ticket's Approval tab keeps working as today. The page reads and acts on the same approvals.
- **PA-MAN-2** Only agents and teams that can access the ticket's department can be chosen as approvers. Today an outside agent is accepted (go-live check T-27-03).
- **PA-MAN-3** Tickets with at least one pending approval are marked as "Approval pending" in ticket lists and on the ticket.

### Web form submissions held for approval

Checked on NDC-Staging, 11 Nov 2026: the hold is built per form. What is missing is a place that collects held submissions from all forms, and a few rules below. Tech Webform has Review = Approval and 2 submissions pending since 10 Nov 15:04, over a day, with no one notified.

- **PA-WF-1 (exists)** Each form has a Review setting: None; Approval (every submission is held); Spam (held only when the spam score reaches the threshold, default 90). With double opt-in, a submission waits as "pending confirmation" until the submitter confirms. Keep as is.
- **PA-WF-2 (exists)** A held submission is stored outside tickets with its values, file count, spam score and signals, received time and expiry time. It has no ticket number and does not count in ticket views, reports or SLA.
- **PA-WF-3 (exists)** Each form has a Pending tab (Settings → Channels → Web forms → the form → Pending) filtered by pending, pending confirmation, approved, rejected, with approve and reject. The Approvals page lists the same items from every form and uses the same decision, so a decision in either place shows in both.
- **PA-WF-4 (change)** Today anyone with the "web form approve" permission can decide on every form. Add an optional approver list per form (agents or teams with access to the form's department). Empty list = today's behaviour. Listed approvers get these items in Waiting for me and are notified.
- **PA-WF-5 (change)** Reject takes no reason today. Make a reason required, with an option to email it to the submitter.
- **PA-WF-6 (new)** Before approving, the approver can change the department and priority the new ticket will get. Submitted values cannot be edited.
- **PA-WF-7 (exists, to verify)** Approve creates the ticket, and ticket-create automation runs in the normal order (PA-INT-5).
- **PA-WF-8 (new)** Mark as spam: no ticket, submission deleted, submitter email optionally added to the blocked list.
- **PA-WF-9** Attachments move to the ticket on approval and are deleted with the submission on reject or expiry.
- **PA-WF-10** Setting Review back to None does not drop submissions already held; they stay until decided or expired.

### Blueprint "Submit for approval" steps

- **PA-BP-1** While the approval is pending, the ticket shows "Waiting for approval from …" and its transitions cannot be run.
- **PA-BP-2** Approvers are those set in the blueprint step (users or teams).
- **PA-BP-3** Approving from the Approvals page has the same effect as approving on the ticket. If the transition needs fields from the approver, the approver is sent to the ticket's transition form instead.
- **PA-BP-4** State timers and SLA keep running while waiting, as in Zoho. Waiting time is visible so the approver sees the SLA risk.
- **PA-BP-5** Editing the ticket while the approval is pending must not drop it out of the blueprint or start a second approval (same defect class as CRM NDC-2334 and NDC-2707).

## Overdue, notifications and integrations

### Overdue and reminders

- **PA-OVD-1** An item is overdue when it has waited past its limit: the blueprint step's limit if set; the web form's "Decide within" (default 24 business hours); otherwise the Desk default in Settings → Approvals (default 24 business hours). Business hours follow the department.
- **PA-OVD-2** At the limit, approvers get one automatic reminder. At twice the limit, the requester's supervisor (or department admins) gets an escalation notice.
- **PA-OVD-3** Overdue items are flagged with how long they are overdue and counted in the overdue count.

### Notifications

| Event | Who | In-app | Email |
| --- | --- | --- | --- |
| New request | Approvers | Yes | Yes, linking to the item |
| Reminder or overdue | Approvers | Yes | Yes |
| Escalation (2× limit) | Supervisor or department admins | Yes | Yes |
| Approved or rejected | Requester; ticket owner if different | Yes | Yes (reject includes the reason) |
| Reassigned | New and old approver | Yes | New approver only |
| Cancelled or expired | Approvers | Yes | No |

- **PA-NTF-1** Texts are translatable (at least English and Arabic) and follow the user's language.
- **PA-NTF-2** Users can turn off the email part in their preferences; the in-app notice for a new request cannot be turned off.

### Integrations

- **PA-INT-1** Ticket History records every approval event (requested, decided, cancelled, reassigned) with actor and comment.
- **PA-INT-2** Workflow rules on Tickets get triggers "Approval approved" and "Approval rejected", with source as a condition. Add only if missing.
- **PA-INT-3** Ticket views get the filter "Has pending approval".
- **PA-INT-4** Reports: approvals by source, status, department and approver; average and 90th-percentile time to decide.
- **PA-INT-5** An approved web form submission runs ticket-create automation in the normal order: assignment → workflow → SLA → notifications.
- **PA-INT-6** Merging cancels the merged ticket's pending approvals ("Ticket merged into #N"). Deleting a ticket cancels them; restoring it does not reopen them.
- **PA-INT-7** After a department move, pending approvals stay; approvers without access to the new department are flagged "No access" and the item counts as overdue so supervisors reassign it.

## Language, accessibility and non-functional

- **PA-I18N-1** All texts in English and Arabic. Arabic is right-to-left; numbers and ticket ids stay left-to-right inside text.
- **PA-I18N-2** Times use the user's time zone and date format from their profile.
- **PA-A11Y-1** Every action works by keyboard; focus moves into item details when opened and back when closed.
- **PA-A11Y-2** Status is given in text, not by colour alone.
- **PA-A11Y-3** Action names include the item ("Approve ticket #1043") for screen readers.

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-1 | List response time, org with 10,000 pending items and 50 departments | Under 800 ms (p95) |
| NFR-2 | Navigation count response time | Under 200 ms (p95) |
| NFR-3 | Decisions are idempotent per item | Repeat after success returns the same result |
| NFR-4 | Works at phone width | 400 px, no sideways scrolling |
| NFR-5 | No leak of items the user cannot access | Counts, search, export, notifications |

## Acceptance criteria

| ID | Given | When | Then |
| --- | --- | --- | --- |
| AC-1 | Agent A requests approval on ticket #1043 from agent B | B opens Approvals, then approves | #1043 is in B's Waiting for me with source, requester and waiting time, count 1. After approving: "Approved", item leaves the list, count 0, ticket Approval tab shows Approved by B, A is notified |
| AC-2 | Agent C is not an approver of #1043 | C opens Approvals, or tries to approve another way | C does not see #1043 in Waiting for me and is offered no approve or reject; the server refuses the decision |
| AC-3 | Web form "Refund request" has Review = Approval, approver B | A customer submits; B sets priority High and approves | No ticket before approval. After: ticket created with priority High, assignment and workflow rules run, new ticket number shown |
| AC-4 | Same form | B rejects with "Duplicate of #1040" and chooses to notify | No ticket; submitter gets the reason by email; item is in Decided as Rejected for 30 days |
| AC-5 | Ticket #1050 in blueprint "Refund", state Validation; agent A runs "Send to Finance", approval from B | B approves | Before: transitions blocked, "Waiting for approval from B"; item shows Validation → Finance review. After: ticket in Finance review, after-transition actions ran |
| AC-6 | Same as AC-5 | B rejects with a reason | #1050 stays in Validation; A is notified with the reason and can run the transition again |
| AC-7 | "Any one" item, approvers B and D | B approves, D rejects a moment later | D is told "Already approved by B at 10:42"; item Approved; one decision in history |
| AC-8 | B selects 3 items; one was cancelled meanwhile | B bulk-approves | Result: "2 approved, 1 failed" with the reason |
| AC-9 | Supervisor S has "View department approvals" for Tech only | S opens All pending, searches | Only Tech items; counts and search exclude other departments |
| AC-10 | User language Arabic | User opens Approvals and acts | Page, messages and notifications in Arabic, right-to-left |

## QA notes

- Test data prefix "QA PA " in subjects; one QA department; approvers = two agents and one team.
- Cover each source × each action × each role (approver, non-approver, requester, supervisor, admin).
- Edge cases: two browsers deciding at once, bulk with mixed results, approver removed from the department, ticket merged, deleted, moved or closed while pending, web form expiry, remind limit, Arabic, phone width.
- Regression: ticket Approval tab (T-27-01..06), reply review (T-28), blueprint transitions (spec-desk-blueprint), web form Pending tab.

## Open questions

- Are the web form changes PA-WF-4, PA-WF-5, PA-WF-6 and PA-WF-8 wanted?
- Is the "all approvers" mode needed now, or is "any one" enough for the first release?
- Should SLA pause while a blueprint step waits for approval? Proposed: no, as in Zoho.
- Default overdue limit (proposed 24 business hours)?
- Should reply review requests (T-28) appear on this page as a fourth source? Proposed: yes, in a later release.
- Is "decide on behalf" (PA-ACT-9) wanted, or should admins only reassign?
