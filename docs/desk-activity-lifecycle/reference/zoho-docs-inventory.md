# Zoho Desk Activities (Tasks, Calls, Events): capability inventory from the official docs

Researched 26 Oct 2026 for the TAVI Desk parity work. No login was used.
Tags: **[doc]** means the item is stated in an official Zoho source. **[inferred]** means it is my reading of the sources, or the sources are silent or contradict each other. Check every [inferred] item on live Zoho before you raise a bug.

Source key (each item cites one of these):
- S1 Working with Activities: https://help.zoho.com/portal/en/kb/desk/activities/articles/working-with-activities-in-zoho-desk
- S2 Managing and working with activities: https://help.zoho.com/portal/en/kb/desk/activities/articles/managing-and-working-activities
- S3 Managing and working with tasks: https://help.zoho.com/portal/en/kb/desk/activities/articles/managing-and-working-with-tasks
- S4 Working with Tasks: https://help.zoho.com/portal/en/kb/desk/activities/articles/working-with-tasks-zoho-desk
- S5 Add, Edit and Delete Tasks: https://help.zoho.com/portal/en/kb/desk/activities/articles/add-edit-and-delete-tasks
- S6 Setting Task Status, Due Date and Priority: https://help.zoho.com/portal/en/kb/desk/activities/articles/setting-task-status-due-date-and-priority
- S7 Closing and Re-opening Tasks: https://help.zoho.com/portal/en/kb/desk/activities/articles/closing-and-reopening-tasks
- S8 Assigning and Managing Task Owner: https://help.zoho.com/portal/en/kb/desk/activities/articles/assigning-and-managing-task-owner
- S9 Adding, Editing, and Deleting Calls: https://help.zoho.com/portal/en/kb/desk/activities/articles/adding-editing-and-deleting-calls
- S10 Adding, Editing, and Deleting Events: https://help.zoho.com/portal/en/kb/desk/activities/articles/adding-editing-and-deleting-events
- S11 Predefined and Custom Activity Views: https://help.zoho.com/portal/en/kb/desk/activities/articles/predefined-and-custom-activity-views-in-zoho-desk
- S12 Predefined and Custom Task Views: https://help.zoho.com/portal/en/kb/desk/activities/articles/predefined-and-custom-task-views-in-zoho-desk
- S13 Predefined and Custom Call Views: https://help.zoho.com/portal/en/kb/desk/activities/articles/predefined-and-custom-call-views-in-zoho-desk
- S14 Predefined and Custom Event Views: https://help.zoho.com/portal/en/kb/desk/activities/articles/predefined-and-custom-event-views-in-zoho-desk
- S15 Marking an Activity as Spam: https://help.zoho.com/portal/en/kb/desk/activities/articles/marking-an-activity-as-spam
- S16 Standard Modules and Fields: https://help.zoho.com/portal/en/kb/desk/customization/modules/articles/standard-modules-and-fields-zoho-desk
- S17 FAQs: Working on Tickets: https://help.zoho.com/portal/en/kb/desk/faqs/tickets/articles/faqs-working-on-tickets
- S18 Creating Workflow Rule: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/workflow-automations
- S19 FAQs: Workflow Rules: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-workflow-rules
- S20 Manage Profiles: https://help.zoho.com/portal/en/kb/desk/user-management-and-security/roles-and-profiles/articles/managing-user-profiles
- S21 Using Predefined Reports: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/reports/articles/using-predefined-reports-in-zoho-desk
- S22 Mobile, Accessing Activities Module (Android/iOS): https://help.zoho.com/portal/en/kb/desk/mobile-apps/android/ticket-management/articles/accessing-activities-module-in-android
- S23 Adding Custom Fields: https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/working-with-custom-fields
- S24 Desk API reference: https://desk.zoho.com/DeskAPIDocument (index: Tasks, Calls, Events, Activities, Recycle Bin, Modules)
- S25 Official Zoho Desk OpenAPI specs, which the API reference links to (github.com/zoho/zohodesk-oas, v1.0/Task.json, Call.json, Event.json, Activity.json, TaskComments.json, TaskAttachment.json, TaskTimeEntry.json, Recyclebin.json, Profile.json, Ticket.json, Webhook.json). Local copies: `./oas/`
- S26 Webhook documentation: https://desk.zoho.com/support/WebhookDocument.do
- S27 Pricing comparison: https://www.zoho.com/desk/pricing-comparison.html (it rendered in Arabic for this network, so some cells were unreadable)

---

## 1. Activity types, where you create them, and their fields

### 1.1 Types
1. There are three activity types: Task, Call and Event. They live together in the **Activities** module. [doc] S1, S2
2. A Task is a to-do item. It can stand alone or be linked to a ticket (example: "Fix Bug"). [doc] S1, S5
3. An Event is a calendared activity, such as a meeting or a trade show, with a time, date and duration. [doc] S1
4. A Call records an inbound or outbound call. You can log it during or after the call ("Log a Call"), or schedule it for later with a reminder to dial. [doc] S1, S9
5. Each type has its own module in the API and in setup (`tasks`, `calls`, `events`), plus an `activities` aggregate module. All three are department-specific (`isDeptSpecific: true`) and have a recycle bin (`hasRecycleBin: true`). [doc] S24 (organizationModules / myAccessibleModules)

### 1.2 Where activities are created
1. **Activities module**: open Tasks, Calls or Events from the left panel (bottom), then click the Add icon in the top bar ("Add Task", "Add Event", "Log a Call" / schedule), fill the form and click **Submit**. [doc] S5, S9, S10
2. **From a ticket**: open the ticket, go to the **Activity** tab, then **Add Activity** and pick Task, Call or Event. The ticket is pre-mapped in the form. [doc] S4, S10, S17
3. **Linking from the Activities module**: the **Ticket** lookup field on the Add form links the activity to a ticket. For Calls the field is labelled "Ticket Subject", and choosing a ticket auto-fills Contact Name. [doc] S9, S10
4. **From a Contact or Account record**: calls can be logged here, and the Activities sub-tab exists on Tickets, Contacts and Accounts. [doc] S9, S15
5. **Call interface**: the **Call Started** button shows only for contacts that have a phone number. With PhoneBridge enabled, a click-to-call icon appears beside the number. The **Call Ended** option links the call to the current ticket and adds the call notes as a ticket conversation. [doc] S9
6. **Automation**: ticket workflow rules (Task action) and macros can create and assign tasks. [doc] S4, S5, S8, S18
7. **Import**: tasks and calls can be imported from XLS or CSV, with a mapping to the related tickets. [doc] S5, S9
8. **API**: POST /api/v1/tasks, /calls and /events. [doc] S25
9. **Mobile app**: tasks, events and calls can be created there. The app cannot place a call; it only records and schedules calls. [doc] S22
10. No "quick create" popup is documented. Creation always goes through the Add form or the ticket's Add Activity. [inferred] S5, S10

### 1.3 Task fields
| # | Field | Type / limit | Required | Notes | Tag / source |
|---|---|---|---|---|---|
| 1 | Department | Picklist | Yes | Chosen first. It decides which agents can be assigned. | [doc] S16, S4 |
| 2 | Task Owner | Lookup (agent **or team**) | No | Defaults to the creator | [doc] S16, S4, S8 |
| 3 | Subject | Text, UI limit "Alphanumeric(50)"; API maxLength 300 | Yes | Mandatory and cannot be removed from table view | [doc] S16, S3, S25 |
| 4 | Due Date | Date/Time | No (API) | Set with a calendar, then **Set** | [doc] S16, S6 |
| 5 | Ticket | Lookup | No | | [doc] S16 |
| 6 | Contact | Lookup | No | | [doc] S3, S4 |
| 7 | Status | Picklist | No | See 2.1 | [doc] S6 |
| 8 | Priority | Picklist: Highest, High, Normal, Low, Lowest | No | The default is not documented | [doc] S6 |
| 9 | Category | Picklist (API string, max 120) | No | Used for identification and routing | [doc] S16, S4, S25 |
| 10 | Remind At / reminder | Checkbox plus settings | No | Needs a due date | [doc] S16, S17 |
| 11 | Description | Text area, 32,000 chars in the UI (API 65,535) | No | | [doc] S16, S25 |
| 12 | Layout | layoutId | No | | [doc] S25 |
| 13 | Team | teamId | No | | [doc] S25 |
| 14 | Custom fields | `cf` object | No | | [doc] S25, S26 |
- API create needs only `departmentId` and `subject`. [doc] S25 (Task.json, required list)
- Tasks also have an Attachments tab (cloud: WorkDrive, Google Drive, Dropbox, Evernote, OneDrive, Box, or Browse Files), comments, time entries and a task timer. [doc] S4, S5, S22, S24, S25

### 1.4 Call fields
| # | Field | Type | Required | Notes | Tag / source |
|---|---|---|---|---|---|
| 1 | Department | Picklist | Yes | | [doc] S16 |
| 2 | Call Owner | Picklist | No | The logging user. S2 says owner cannot be set at creation for calls and events, while S9 scheduling steps mention choosing an owner, so the docs disagree. | [doc] S9, S2, S16 |
| 3 | Subject | Text 50 (API 300) | Yes | | [doc] S16 |
| 4 | Direction | Select: Inbound / Outbound (API `inbound` / `outbound`) | No | Defaults to Outbound for Current and Scheduled calls | [doc] S9, S25 |
| 5 | Ticket | Lookup ("Ticket Subject") | No | | [doc] S9, S16 |
| 6 | Call Status / type | Select | Yes | UI: **Current call**, **Completed**, **Scheduled**. API enum: Completed, Scheduled, Missed, Canceled, In Progress | [doc] S9, S25 |
| 7 | Start Time | Date/Time | Yes | Defaults to the current date and time | [doc] S16 |
| 8 | Duration | Numeric (min:sec in the UI, seconds in the API) | Yes | Counts live for an ongoing call; you enter it for a completed call | [doc] S9, S16, S25 |
| 9 | Priority | Picklist | No | **Default High**. Values: Highest, High, Normal, Low, Lowest | [doc] S9 |
| 10 | Contact Name | Lookup | Yes | Auto-filled when you pick a ticket | [doc] S9, S16 |
| 11 | Remind me | Checkbox | No | Only for upcoming scheduled calls | [doc] S16, S17 |
| 12 | Description | Text area 32,000 | No | | [doc] S16 |
| 13 | recordingUrl | Text, max 2500 | No | API only: recording or voicemail URL | [doc] S25 |
| 14 | callId (live call), teamId, layoutId, cf | | | | [doc] S25 |
- API create required fields: contactId, departmentId, startTime, status, subject. [doc] S25
- Call results in the call interface: **Answered**, **Call Ended**, **Unanswered**. An activity is recorded whether or not the call is answered. [doc] S9

### 1.5 Event fields
| # | Field | Type | Required | Notes | Tag / source |
|---|---|---|---|---|---|
| 1 | Department | Picklist | Yes | | [doc] S16 |
| 2 | Event Owner | Picklist | No | | [doc] S16 |
| 3 | Subject | Text 50 (API 300) | Yes | | [doc] S16 |
| 4 | Category | Picklist (API max 120; sample "meeting") | No | | [doc] S16, S26 |
| 5 | Start Time | Date/Time | Yes | | [doc] S16, S10 |
| 6 | Duration | Numeric (API seconds) | Yes | | [doc] S16, S10, S25 |
| 7 | Ticket | Lookup | No | | [doc] S16 |
| 8 | Status | Picklist | No | Values not listed (sample "Not Started"; "Completed" closes) | [doc] S10, S26 |
| 9 | Priority | Picklist | No | | [doc] S16 |
| 10 | Contact Name | Lookup | Yes | | [doc] S16, S10 |
| 11 | Remind me | Checkbox | No | | [doc] S16 |
| 12 | Description | Text area 32,000 | No | | [doc] S16 |
- API create required fields: contactId, departmentId, startTime, subject. [doc] S25
- **No Location, End Time or Participants fields** appear in the Desk docs or the API schema. This differs from Zoho CRM Meetings. Events are defined by Start Time plus Duration. [doc] S16, S25 (absence) / [inferred] that they don't exist at all
- No recurring events are documented. [inferred] (absent from S10, S16, S25)

### 1.6 Common read-only attributes (from the API response)
1. id, creatorId, createdTime, modifiedTime, modifiedBy, completedTime, activityTime, **statusType (Open / Closed)**, isSpam, isTrashed, webUrl, layoutId, cf. Tasks and calls also return isCommented. [doc] S25

---

## 2. Life cycle

### 2.1 Status values
1. **Task**: Not Started, Deferred, In Progress, Waiting on Someone, Canceled, Completed. [doc] S6, S3, S4
2. **Call**: the UI types are Current call, Completed and Scheduled. The API enum is Completed, Scheduled, Missed, Canceled, In Progress. Webhook sample: "Scheduled". [doc] S9, S25, S26
3. **Event**: no values are listed in the docs. The webhook sample uses "Not Started", and "Completed" closes an event. Values are probably the same set as Tasks. [inferred] S10, S26
4. Every activity also has a derived **statusType: Open / Closed**. Completed counts as Closed. Canceled appears to count as Closed too, because "All Canceled Activities" is a separate view from Open. [doc] S25 / [inferred] for Canceled
5. **Only the system Status field set to "Completed" closes an activity.** A custom field with the same label does nothing. [doc] S5, S7, S10, S17

### 2.2 Completing and closing
1. **Task**: in the Task Details page, set Status to Completed, or click **Mark as Complete** at the bottom of the page. The closure timestamp (completedTime) updates. [doc] S7
2. **From the ticket's Activity tab**: click the **checkbox icon** next to an activity in the list to close it. [doc] S17
3. **Event**: does not close automatically when its duration ends. It closes only when Status is set to Completed. [doc] S10
4. **Call**: a scheduled call that is answered becomes Completed. **Once completed, a call record can no longer be edited.** [doc] S9
5. Completing a linked task does **not** notify the customer. The agent must tell them. [doc] S4, S7
6. Who can complete: support admins, and agents whose profile has the Tasks module permission (edit/update/create/view/delete). [doc] S4, S7
7. A "mark complete" mass action in the Activities list view is **not documented**. The mass actions are Update, Delete and Assign To, and Update with field = Status could do it. [inferred] S12

### 2.3 Reopening
1. A support admin or the **task owner** can reopen a completed task with **Reopen Task** at the bottom of Task Details. The status goes back to **Not Started**. [doc] S7
2. You can also reopen by setting the status to anything other than Completed. [doc] S3, S4
3. Reopening calls and events is not documented. Completed calls are read-only. [inferred] S9

### 2.4 Overdue
1. Overdue shows up only in views and filters (Overdue Tasks, My Overdue …, Today + Overdue, Next 7 Days + Overdue) and in the API filters `dueDate=Overdue` (tasks) and `startTime=Overdue` (calls, events). **There is no "Overdue" status value.** [doc] S12–S14, S25
2. Rule: a task is overdue when its Due Date is in the past and it is still open (statusType Open). A call or event is overdue when its Start Time is in the past and it is still open. [inferred] from the view names and the API filters
3. A task with no due date is never overdue. [inferred]
4. **Missed calls**: if a scheduled call is unanswered you are prompted to reschedule. If you don't, its status becomes **Missed**. There are views "All Missed Calls" and "My Missed Calls". [doc] S9, S11, S13
5. No automatic overdue email is documented. Workflow alerts or custom functions are the documented workaround. [inferred] S19

### 2.5 Reminders
1. Available on tasks, scheduled calls and events. A task needs a **due date**; a call or event needs a **start time**. Only **upcoming scheduled calls** can have a reminder. [doc] S17
2. Channels: **Alert through Pop-up**, **Email**, **SMS**. You can pick more than one. [doc] S5, S9, S10
3. Timing: a **relative** lead time before the due or start time, or an **absolute** specific date and time. The UI has a before/on toggle, a number, and a unit of minutes, hours or days. **The default lead time is 1 minute.** [doc] S4, S5, S9
4. Recipient: the owner, or the whole team when the activity is assigned to a team. [doc] S4, S10
5. API format: `reminder: [{reminderType: "RELATIVE", relativeReminderInMin: <int>, alertType: ["EMAIL","POPUP","SMS"]}]` or `{reminderType: "ABSOLUTE", reminderTime: "<iso>", alertType: [...]}`. [doc] S25
6. List filter: "Remind At". [doc] S3

### 2.6 Recurrence and rescheduling
1. Recurring tasks, calls and events: **not documented in Desk**. The CRM-style RRULE support only appears in Zoho CRM docs. [inferred]: treat as not supported.
2. Rescheduling a missed call creates a missed-call activity and moves the scheduled call's start date and time forward. [doc] S9
3. Reschedule a task or event by editing the Due Date or Start Time. [doc] S6, S10

### 2.7 Cancelling
1. The **Canceled** status exists for tasks and calls, and there are Canceled views for activities, tasks, calls and events. [doc] S6, S11–S14, S25
2. The calls article says to cancel a scheduled call with "Mark as Completed". This contradicts the Canceled status. Verify on live Zoho. [doc] S9 / [inferred] conflict

### 2.8 Editing
1. From the detail page: More (…) > **Edit** (or the Edit icon in the header), then **Save**. From the list view: hover over the row and click the Edit icon. [doc] S5, S9, S10
2. Inline edits on Task Details: click the Status, Due Date, Priority or Task Owner field directly. [doc] S6, S8
3. Editable fields: subject, owner, schedule, status, priority, related records. [doc] S2

### 2.9 Delete, Recycle Bin and restore
1. Delete from the detail page (Delete icon or More > Delete) and confirm. The activity goes to the **Recycle Bin**. [doc] S5, S9, S10
2. Mass Delete from the list view. [doc] S11, S12
3. Permanent delete and restore: **Setup > Data Administration > Recycle Bin**. Choose the module (Tasks, Calls or Events), select records, then **Delete** > OK, or **Restore** > Proceed. [doc] S9, S10, S11
4. Restoring also restores the associated records (tickets and contacts for calls). [doc] S9, S10
5. Permanently deleted activities cannot be restored. [doc] S9, S10, S11
6. Deleting a call does not delete its linked ticket. [doc] S9
7. API: POST /{module}/moveToTrash `{entityIds}`, and /api/v1/recycleBin with module = tasks, calls or events; restore, restoreAll, delete, deleteAll. [doc] S25

### 2.10 Spam
1. Activities cannot be marked or unmarked as spam directly. They inherit spam from the linked contact or ticket. [doc] S15
2. Views: Spam Activities, Spam Tasks, Spam Calls, Spam Events. There is also a spam filter on the Activities sub-tab of Tickets, Contacts and Accounts. [doc] S15
3. API: deleteSpam and emptySpam per module, and /activities/emptySpam. [doc] S25

---

## 3. Views, lists and mass actions

### 3.1 Predefined Activities views (combined, 16) [doc] S11, S2
1. All Activities  2. All Canceled Activities  3. All Completed Activities  4. All Missed Calls  5. All Open Activities  6. My Activities  7. My Canceled Activities  8. My Completed Activities  9. My Missed Calls  10. My Open Activities  11. My Overdue Activities  12. My Team Activities  13. Overdue Activities  14. Spam Activities  15. Today + Overdue  16. Today's Activities
- On first access the module shows "All Activities". After that it remembers the last view used. [doc] S2

### 3.2 Predefined Task views (14) [doc] S12
All Tasks, Canceled Tasks, Completed Tasks, My Open Tasks, My Overdue Tasks, My Tasks, My Team Tasks, Next 7 Days + Overdue, Open Tasks, Overdue Tasks, Spam Tasks, Today + Overdue, Today's Tasks, Tomorrow's Tasks

### 3.3 Predefined Call views (16) [doc] S13
All Calls, All Missed Calls, Canceled Calls, Completed Calls, My Open Calls, My Overdue Calls, My Calls, My Missed Calls, My Team Calls, Next 7 Days + Overdue, Open Calls, Overdue Calls, Spam Calls, Today + Overdue, Today's Calls, Tomorrow's Calls

### 3.4 Predefined Event views (14) [doc] S14
All Events, Canceled Events, Completed Events, My Open Events, My Overdue Events, My Events, My Team Events, Next 7 Days + Overdue, Open Events, Overdue Events, Spam Events, Today + Overdue, Today's Events, Tomorrow's Events

### 3.5 Custom views
1. Create one with the **+** icon next to Activities, Tasks, Calls or Events in the left panel. Enter a View Name, filter criteria and visibility, then click **Create**. [doc] S11–S14
2. Visibility options: **Only me / All agents / Specific (Selected) agents**. Sharing a view needs admin rights or the profile permission. [doc] S12, S20, S25 (Profile)
3. Criteria fields include owner, status, priority, category, due date and created time, combined with AND/OR. **Age in Days** works on date fields (for example created in the last 7 days, or overdue in the last 30). [doc] S2, S3, S11
4. Custom view actions: Edit, Delete, **Clone**, **Open in new tab** (also by right-click), **Star**. Custom views can also be archived ("Archiving Custom Views" article). [doc] S2, S12
5. Predefined views cannot be edited or deleted. [doc] S11, S12
6. Custom views are listed after the standard ones in the left panel. [doc] S11

### 3.6 Filter, sort and paging
1. Filter icon: **Agent** and **Due Date / Start Time**. Standard and custom field values can also be used. [doc] S11, S12
2. Full task filter field list: Task Owner, Ticket, Category, Status, Priority, Remind At, Created By, Modified By, Created Time, Modified Time, Team, Contact Name, Layout, Due Date. [doc] S3
3. Sort (More … menu): Subject, Category, Due Date / Start Time, Status, Priority, Created Time, Modified Time, ascending or descending. [doc] S11–S14
4. Page size: **10 by default, 50 maximum**. The choice is remembered. [doc] S11, S12

### 3.7 List layouts
1. **Classic View**: subject, status, contact, priority, assignee, scheduled time. [doc] S12
2. **Compact View**: subject, start time, contact name, status. [doc] S12
3. **Table View**: you choose the columns with the **Select Columns** icon (show, hide, reorder). Task Subject is mandatory. **Column changes apply to every user with access.** Blank values show as "-". Multi-line and text-area fields cannot be added. [doc] S12, S3
4. **No calendar view or kanban** is documented for native activities. The Zoho Calendar extension is a separate add-on. [inferred] (absent from S11–S14)

### 3.8 Mass actions
1. **Update** (choose a field, then a new value) for tasks, calls and events. [doc] S12–S14
2. **Delete** (to the Recycle Bin). [doc] S11–S14
3. **Assign To** an agent or team, with search. [doc] S11–S14
4. **Export to CSV** (tasks). [doc] S12
5. Import from XLS/CSV (tasks, calls). [doc] S5, S9
6. API updateMany `{ids (max 50), fieldName, fieldValue, isCustomField}`. [doc] S25

### 3.9 Search
1. A module-level record search exists ("Searching Records in Modules"). [doc] https://help.zoho.com/portal/en/kb/desk/activities/articles/searching-records-in-modules

---

## 4. Relationship with tickets

1. Activities linked to a ticket appear on the ticket's **Activity** tab (sub-tab) **and** in the Activities module. [doc] S1, S17
2. You can add a Task, Call or Event from the ticket ("Add Activity"). The ticket is pre-mapped. [doc] S4, S10
3. Close an activity from the ticket's Activity tab with the checkbox icon. [doc] S17
4. The Activity tab has filters, including spam calls, tasks and events. [doc] S15
5. Ticket API `GET /tickets/{id}/activities`: sortBy activityTime or createdTime (prefix "-" for descending), isCompleted, isSpam, include (contacts, tickets, assignee, teams), limit up to 100. There are also /tickets/{id}/tasks, /calls and /events. [doc] S25
6. **Activity count on the ticket**: the Ticket API returns **`taskCount`** ("Number of tasks associated with the ticket"). No call or event count field was found. [doc] S25 (Ticket.json)
7. **Is ticket closure blocked by open activities?** The mobile doc says tasks are "a ticket's to-do list. Agents must complete them before the ticket can be closed". No web doc says Desk enforces this. Treat it as guidance, not enforcement, and verify on live Zoho. [doc] S22 / [inferred]
8. **Ticket history / timeline**: the FAQ says ticket history logs agent, customer and automated actions, but it doesn't say whether task create or complete events appear. [inferred]: verify live. S17
9. "Call Ended" links a call to the current ticket and adds its notes as a **ticket conversation**. [doc] S9
10. Restoring a call from the Recycle Bin restores its linked ticket and contact. [doc] S9
11. Activities on spam tickets or contacts become spam automatically. [doc] S15
12. Ticket workflow **Task action**: if "Assign ticket owner as task owner" is set, the ticket owner gets the task only when the ticket is unassigned at that moment. Otherwise the task goes to the assignee you specified. [doc] S18, S19

---

## 5. Permissions

1. Each user needs the module permission in their profile: **Tasks**, **Calls** or **Events**. [doc] S4, S9, S10
2. Profile permission keys per activity module (tasksPermissionJson, also used for calls and events): **view, create, edit, delete, import, export, manageOwnCustomViews, shareOwnCustomViews, editSharedCustomViews, deleteSharedCustomViews, reshareSharedCustomViews**. [doc] S25 (Profile.json)
3. The Activities aggregate permission covers custom view rights only (manage, share, edit, delete and reshare shared views). [doc] S25
4. General profile items: "Update/Delete All Records" (otherwise only your own), and Import Records / Export Records under Administrative permissions. [doc] S20
5. Status, due date and priority: admins can change them by default. Agents need Tasks permissions. Only admins grant profile permissions. [doc] S6
6. Assigning a task owner: only support admins and authorised agents. [doc] S8
7. Reopening a task: an admin or the task owner. [doc] S7
8. **Light agents** can view tasks and add private notes, but cannot change task or ticket information. [doc] S17
9. Department scoping: the modules are department-specific, Department is a mandatory field, and the owner list is limited to that department's agents. [doc] S16, S4, S24
10. Own vs team: the "My …" and "My Team …" views exist. The data-sharing rules API covers tasks, calls and events, so visibility can be Private or Public per module. The Desk help docs don't spell out the options. [doc] API scope list (search snippet of S24) / [inferred] for the exact Private/Public options
11. API OAuth scopes: Desk.tasks.READ/CREATE/UPDATE/DELETE/ALL (also `Desk.activities.tasks.*`), Desk.calls.*, Desk.events.*. [doc] S25

---

## 6. Automation and notifications

1. Workflow rules work on Tasks, Calls and Events with **Alerts (email) and Custom Functions only**. The Task and Field Update actions are **Tickets-only**. [doc] S18, S19
2. Execute-on options: Create, Edit and Field Update (Field Update is **Enterprise only**). Delete is Tickets-only. There is **no delay or time-based trigger** in workflow rules. [doc] S18, S19
3. Documented examples: Calls: notify when missed, or auto-create a follow-up task (custom function). Events: remind 1 hour before (alert), or update status after completion (custom function). Tasks: email the agent 30 minutes before, or set the call status after it ends. [doc] S19
4. Ticket workflow **Task action**: Subject, Status, Priority, Assignee, Due Date, etc. Up to **10 tasks per rule**. Example: a follow-up call in 2 days. [doc] S18, S19
5. Limits: 25 criteria per rule. Rules per module per department: 5 (Standard), 15 (Professional), 30 (Enterprise). Express allows 1 per module, Tickets only. Free has none. [doc] S18, S27
6. Macros can create and assign tasks. [doc] S4, S8
7. **Notifications**: agents assigned an activity are notified **by email**. Reminders go by pop-up, email or SMS. [doc] S17, S5
8. **Webhooks**: Task_Add, Task_Update, Task_Delete, Call_Add, Call_Update, Call_Delete, Event_Add, Event_Update, Event_Delete. Add and Update events support `departmentIds` and `criteria` filters. Update events support `includePrevState` (default false) and return `prevState`. Delete events take no filters (pass null) and send only the `id`. Maximum 20 webhooks configured. Enabled limits: Free 0, Standard 0, Professional 5, Enterprise 10, Ultimate 20. Creating webhooks needs the Webhook profile permission. [doc] S26
9. SLAs, Blueprint, Supervise rules and Zia for activities: **not documented**. Blueprint and SLA are ticket-only. [inferred]
10. Deluge tasks (`zoho.desk.create(orgId,"tasks",…)`) work in custom functions. [inferred] from the Deluge integration docs

---

## 7. Customisation

1. Tasks, Calls and Events have standard fields (section 1) and support **custom fields** (`cf`), **layouts** (layoutId) and **layout rules and validation rules**. The API's fields, layouts, layout-rules and validation-rules endpoints list tasks, calls and events among the allowed modules. [doc] S25, S24 (module list) / S23
2. Custom field limits are grouped as "Tickets, Contacts, Accounts, Products & Activities". Enterprise: 100 string, 30 multi-select/multi-line, and 20 each of integer, decimal, date, date-time and checkbox. Per-module totals by edition (pricing): Express 10, Standard 50, Professional 150, Enterprise 230. [doc] S23, S27
3. Field types: Single Line, Picklist, Email, Phone, URL, Multi-Select, Multi-Line, Integer, Decimal, Percentage, Currency, Date, Date/Time, Checkbox. [doc] S23
4. Standard fields cannot be moved to Unused Fields. A field can be made mandatory only when every profile has Read/Write on it. [doc] S23
5. Whether standard picklists (Status, Priority, Category) can be edited is not documented. Category is clearly a configurable picklist. Status is system-defined, since only the system "Completed" closes an activity. [inferred] S5, S16
6. Layout rules and validation rules are **Enterprise only** (50 per department). Multiple layouts: 20 per department on Enterprise. [doc] S27 (partly unreadable, marked inferred in the table) / [inferred]
7. Department-specific layouts exist. Whether activity layouts are per department is not stated. [inferred]

---

## 8. Reports and dashboards

1. One predefined Activities report: **"Today's Call Count"**. It shows daily call volume, assigned, pending and completed tasks, calls made in a day, and calls attended per team member. [doc] S21
2. Custom reports in Analytics can use Calls and Events (and Tasks) as modules. [doc] S21 (search snippet)
3. Logging calls lets you track calls received and made, average call time, and calls per agent. [doc] S9
4. Custom reports: Standard 50, Professional and Enterprise unlimited. Dashboards: Standard 10. Free has none. [doc] S27
5. The Radar mobile app has an **Activities widget** and card that brings Tasks, Calls and Events together. It is a profile permission (`activities` in the Radar settings). [doc] S25 (Profile.json), search snippet

---

## 9. API (v1, base `https://desk.zoho.com/api/v1`, headers `orgId` and `Authorization`)

### 9.1 Tasks [doc] S25 Task.json
1. GET /tasks: params `departmentId`, `departmentIds`, `viewId`, `filterId`, `assignee` (comma-separated IDs), `dueDate` = Overdue | Today | Tomorrow | CurrentWeek | CurrentMonth (comma-separated), `isCompleted`, `from`, `limit` (≤100), `sortBy` = category | subject | dueDate | status | createdTime | modifiedTime | priority ("-" for descending), `fields` (≤30), `filters`, `include` = contacts, tickets, assignee, teams, projects
2. GET /tasks/{id} (include adds `creator`), POST /tasks (required: departmentId, subject), PATCH /tasks/{id}
3. POST /tasks/moveToTrash `{entityIds}`, POST /tasks/updateMany `{ids, fieldName, fieldValue, isCustomField}` (ids ≤50)
4. GET /tasks/count: `viewId`, `departmentId`, `dueDate`, `assignee`, `filterId`, returns `{count}`
5. GET /tickets/{ticketId}/tasks: isCompleted, isSpam, sortBy, include
6. POST /tasks/deleteSpam `{taskIds}`, POST /tasks/emptySpam `{departmentId}`
7. Sub-resources: /tasks/{id}/comments (GET, POST, PUT, with mentions), /attachments (GET, POST, DELETE, content), /timeEntry (+ timeEntrySummation, billStatus), task timer

### 9.2 Calls [doc] S25 Call.json
1. GET /calls: `startTime` = Overdue | Today | Tomorrow | CurrentWeek | CurrentMonth, `sortBy` = startTime | createdTime, plus viewId, assignee, departmentId(s), isCompleted, fields, filters, filterId, include (contacts, tickets, assignee, teams, livecalls)
2. GET, POST, PATCH /calls/{id}. POST requires contactId, departmentId, startTime, status, subject. Status enum: Completed, Scheduled, Missed, Canceled, In Progress. direction: inbound or outbound. duration is in seconds.
3. moveToTrash, updateMany, deleteSpam `{callIds}`, emptySpam, POST /calls/{id}/clearLiveCall, GET /tickets/{id}/calls

### 9.3 Events [doc] S25 Event.json
1. GET /events: `startTime` filter (same values), sortBy startTime | createdTime, plus the same params as calls
2. GET, POST, PATCH /events/{id}. POST requires contactId, departmentId, startTime, subject. Fields: category, duration (seconds), status, priority, teamId, reminder, cf
3. moveToTrash, updateMany, deleteSpam `{eventIds}`, emptySpam, GET /tickets/{id}/events

### 9.4 Activities, recycle bin and modules [doc] S25
1. GET /tickets/{ticketId}/activities: sortBy activityTime | createdTime, isCompleted, isSpam, include. Each item carries `activityType` = Tasks | Calls | Events.
2. POST /activities/emptySpam `{departmentId}`
3. GET /recycleBin?module=tasks|calls|events, POST /recycleBin/restore `{ids, isChildNeedToBeRestored}`, /restoreAll, /delete, /deleteAll (scope Desk.settings)
4. GET /organizationModules and /myAccessibleModules return tasks, calls, events and activities
5. Pagination: `from` (default 1), `limit` (default 10, maximum 50 for most endpoints, 100 for activity lists)

### 9.5 Webhook events: see 6.8. [doc] S26

---

## 10. Mobile, editions and limits

1. Mobile (Android and iOS): create, edit and delete tasks, events and calls. Calls can be recorded and scheduled but not placed. A reminder pop-up appears when it is time to dial. Detail sub-tabs: comments, attachments, time entries. Views can be starred and reordered. [doc] S22
2. Radar app: Activities card and widget. [doc] S25 / search snippet
3. Editions: Activities (Tasks, Events, Calls) rows appear in the pricing comparison, but the cells couldn't be read on this network. Free has 3 users with limited features, no workflow rules and no webhooks. Workflow rules on activity modules need Standard or higher. Field-Update triggers, layout rules and validation rules are Enterprise only. [doc] S18, S26, S27 / [inferred] where cells were unreadable
4. Import batch sizes: Express 1,000, Standard 10,000, Professional 20,000, Enterprise 30,000. Import history is kept for 60 days. [doc] S27
5. Field length limits: Subject 50 characters in the UI (300 in the API), Description 32,000 (65,535 in the API), Category 120. [doc] S16, S25
6. List page size 10 by default, 50 maximum. API `limit` up to 100 on activity lists. updateMany and delete take at most 50 IDs. [doc] S11, S25

---

## Open questions to settle on live Zoho (read-only)
1. Can a ticket be closed while it has open tasks? (S22 says no; the web docs are silent.)
2. Do the ticket History or timeline entries include "Task added / completed"?
3. What are the default Priority and Status for a new Task and Event? (Call priority defaults to High.)
4. Does the Event status list match the Task status list?
5. Does cancelling a call set "Canceled" or "Completed"? (S9 contradicts itself.)
6. Can calls and events have their owner set at creation? (S2 and S9 conflict.)
7. Can the Status and Priority picklists be edited in Layouts & Fields for the activity modules?
8. Do the data-sharing defaults (Private, Public Read Only, Public Read/Write) apply to Tasks, Calls and Events, and where are they set?
