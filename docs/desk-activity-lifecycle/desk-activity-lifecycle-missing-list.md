# Activity Life Cycle: features Zoho Desk has that Desk is missing

**Plane: NDC-2635** (bugs NDC-2637 … NDC-2643)

Checked 26 Oct 2026 on `https://staging-desk.taviportal.com` (agent `fedelav803`, admin `mahmoud.mmohamedsamy`), against the Zoho Desk help docs (`reference/zoho-docs-inventory.md`) and our live Zoho Desk org (portal `taviportal`, read-only). There is no single PRD; the feature is item "Activity Life Cycle" of NDC-1865, and earlier parity items are NDC-1782 (only SMS reminders left) and NDC-2008 (Phase 3). Staging was redeployed during the run (bundle `index-PA6o3K2s.js` → `index-7qe5X0Gd.js`); every item below was seen on the new build too.

## Already done in Desk
- Tasks, calls and events can be added from the Activities page, from a ticket's ACTIVITY tab (ticket pre-filled) and from contacts and accounts.
- Task status list matches Zoho (Not Started, Deferred, In Progress, Waiting on Someone, Canceled, Completed). Mark as Complete fills Completed Time; Reopen Task goes back to Not Started.
- Calls: Start Call, End Call with outcome (notes go to the ticket as a private comment), Mark as missed, Cancel Call, Reopen Call, Reschedule without a missed-call log. A completed call is read-only on its page.
- Events: Mark as Completed, Cancel, Reopen Event; an event does not close by itself when its time passes (same as Zoho).
- Overdue badge on open activities whose due or start time has passed.
- 18 task views (All, My, Open, My Open, Completed, Canceled, Overdue, My Overdue, Today's, Tomorrow's, Today + Overdue, Next 7 Days + Overdue, Deferred, Waiting on Someone, My Completed, My Canceled, My Team, Spam) and the same per kind; they show the right records. Custom views can be added.
- Classic, Compact and Table layouts, sort, search, filter, Export (xlsx / csv), bulk Update.
- Reminders: up to 5 per activity, pop-up and email, at the due time, before it, or at a set time; clear messages for every wrong value; a reminder of a closed activity is skipped. The pop-up arrived 5 seconds after the due time.
- Comments with @mention, edit and delete; attachments; time entry and timer on activities.
- Desk also has a Calendar (month / week / day), event invitees with RSVP, and a timer — Zoho Desk has none of these.

## Missing — settings and fields
1. Department on every activity. In Zoho it is required, it limits the owner list to that department's agents, and an activity is only seen inside its department. Desk forms have no Department, and an admin outside Customer Support can open and edit the activities of Customer Support tickets that are 404 for them.

## Missing — list and page actions
2. Delete from the activity's page (Zoho: Delete → Recycle Bin). Desk has no Delete action on the task, call or event page; only the API can delete.
3. Delete in the bulk bar (Zoho mass actions: Update, Delete, Assign To). Desk's bulk bar has Update only.

## Missing — where activities show
4. Activity count on the ticket (Zoho returns `taskCount` on the ticket). Desk ticket counts are replies, comments, attachments and time entries only.

## Missing — API
5. A ticket-activities endpoint and ready-made filters (Zoho: `GET /tickets/{id}/activities`, `dueDate=Overdue|Today|Tomorrow`, `/tasks/count`). Desk only has the generic records API; `/desk/activities`, `/desk/activities/stats` and `/desk/activities/reports` return 404.

## Could not be checked
- Reminder emails: the agent's mailbox cannot be read. Please confirm an email reminder arrives (or give us an agent with a readable mailbox).
- Event invitation emails to a contact (sent to mmohamed@anyware.software at about 12:05). Please confirm one arrived.
- Workflow rules and webhooks on Tasks / Calls / Events (Zoho: alerts, custom functions, Task_Add / Update / Delete webhooks). Please confirm whether these modules are meant to appear in the rule and webhook pickers so we can test them.
- Import of tasks and calls from CSV, and restoring a deleted activity from the Recycle Bin. Please give an account that can use Data Administration so we can test them.

## Additional notes
- Not gaps: recurring activities and a kanban view (Zoho Desk has neither); closing a ticket with open tasks is allowed in both (Zoho only advises it in the mobile docs); events use an end time instead of a duration.
- Possible bug to check separately: a task saved without a status (the add form has no default) has no status at all and never appears in Open, My Open or Overdue (A-B2 = NDC-2638).
- Possible bug to check separately: "Reschedule" with "log a missed call" ticked fails with "One or more fields in the payload are read-only." and the call is not moved (A-B1 = NDC-2637).
- Possible bug to check separately: priority, call status and direction show raw keys ("highest", "scheduled", "outbound") on the activity page, the list and the ticket tab (A-B3 = NDC-2639).
- Possible bug to check separately: a completed call is read-only on its page but can still be changed through the API (A-B4 = NDC-2640).
- Possible bug to check separately: Completed Time is filled by the browser, not the server: completing through the API leaves it empty, and a client can set any date in it (A-B5 = NDC-2641).
- Possible bug to check separately: call duration accepts any text ("abc", "-1", "99:99") (A-B6 = NDC-2642).
- Possible bug to check separately: the add-activity form fields and the reminder radio buttons have no accessible names (A-B7 = NDC-2643).
- Regression checks now passing: NDC-1907 (Add Task from a ticket as an agent), NDC-1803 (edit / delete activity comments), NDC-1813 (Reopen Call), NDC-1332 (reminders fire).
- Test spec: docs/desk-activity-lifecycle/spec-desk-activity-lifecycle.md in the QA repository; automation feature `deskactivities`.
- Tenant changes: QA tasks, calls, events and tickets prefixed "QA ACT" were created by the agent account; all 66 activities were deleted afterwards (they sit in the Recycle Bin). The QA tickets are listed in the run report.

## Environment
staging-desk.taviportal.com, Edge, 26 October 2026, Desk Agent and Desk Admin accounts.
