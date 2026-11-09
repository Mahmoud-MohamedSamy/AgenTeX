# Zoho Desk SLA, Notifications and Macros: reference inventory for QA parity

Compiled 8 Nov 2026 from public Zoho pages only, with no sign-in. It is reference material for comparing TAVI Desk with Zoho Desk.

**Conventions**
- Each item has an ID: `S-nnn` for SLA, `N-nnn` for Notifications, `M-nnn` for Macros.
- Every bracketed tag is a link to the source URL. The URLs are listed under "Sources" at the end.
- **inferred** means my reading, not something Zoho states.
- "Not documented" means I searched for it and found nothing. These cases are also listed under "Could not confirm".
- Conflicts are numbered `C-n` and listed under "Conflicts".

**How the pages were read**
- Help articles: I downloaded the text of the 467 Desk help articles that matched 55 search terms, using the help center's public read-only article endpoint. I read the articles central to these features in full, and read the relevant passages of others. I checked the remainder by keyword sweep only, so a fact worded unusually could have been missed. 5 more articles failed to download; all 5 are about Help Center login or SDK topics, so they are out of scope. Citations use the normal article URLs.
- API: I downloaded the full `desk.zoho.com/DeskAPIDocument` page, read the SLA, contract and support plan sections, and searched the rest by keyword.
- Plans: the pricing page was served in Arabic on this network, and the English URL could not be reached. Columns are Free / Express / Standard / Professional / Enterprise. I read each row and its tick marks from the page HTML, and the row labels are my translations.
- Official community posts are used only where marked.

**Not repeated here because it is already recorded**

| Topic | Where it is recorded |
|---|---|
| SLA scope, path, trigger names, target fields, 10-target cap, 2 response and 4 resolution levels, recipients, precedence order summary, business-hour types, holiday list basics, department-move summary, dashboard summary, IM behaviour | `docs/desk-blueprint/reference/zoho-docs-inventory.md` §5, §9, §11, §12 |
| Blueprint state SLA and escalations | same file, §4 and "Uncertain" |
| Execution-order conflict across Zoho pages | `docs/desk-workflow-rules/reference/zoho-docs-inventory.md` §5; `docs/desk-assignment-rules/reference/zoho-docs-inventory.md` §2.5 |
| Workflow alert form, supervisor rule limits, ticket history `eventFilter` values, audit log columns | `docs/desk-workflow-rules/reference/zoho-docs-inventory.md` §4.2, §5, §6 |
| Assignment-related notifications, agent deactivation updating SLA, macro and notify fields, macro count per plan, round robin not overriding a macro owner | `docs/desk-assignment-rules/reference/zoho-docs-inventory.md` §1, §2.2, §2.6, §4, §7 |

---

## 1. SLA

### 1.1 Creating an SLA: screen flow and settings

- **S-001 Wizard order.** Choose the department first, then New SLA. Enter SLA Name and Description, answer "When do you want to execute the SLA?", set the two toggles, click Next, click Add Targets, then Save. [SLA]
- **S-002 Customer Reply sub-option.** Choosing Customer Reply asks for **Incoming** or **Outgoing Responses**. [SLA] See C-1.
- **S-003 Comment sub-option.** Choosing Comment asks for **Agent comment (Private/Public)** or **Customer Comment**. [SLA]
- **S-004 Field update meaning.** It fires when a particular field, such as priority, status or category, "is updated to the defined value". [SLA] See C-2.
- **S-005 API required fields for an SLA.** `name`, `executeOn`, `status`, `departmentId` and `targets` are required. `description`, `executeOnlyWithAccount` and `dueDateCalculatedFrom` are optional. `status` has a 100-character limit. [API-SLA-CREATE]
- **S-006 API trigger shape.** `executeOn.events[]`, and `executeOn.triggerFieldInfo {type, fieldIds[]}`. The example values are `CREATE`, `EDIT`, `REPLY`, and type `ANY`. [API-SLA-CREATE] The full event enum is not published (see Could not confirm).
- **S-007 Execute-only-with-account use case.** During an outage, the SLA applies only to tickets linked to an account, and another team handles the rest. [SLA]
- **S-008 Created-time toggle.** It uses the ticket's created time "instead of its modified time" to compute response and resolution. [SLA]
- **S-009 Target conditions.** Under "Select conditions for this Target", pick fields and values. The **+** icon adds conditions. The API stores `fieldConditions[]` and a `pattern` such as `(1or2)`. [SLA] [API-SLA-CREATE]
- **S-010 Criteria fields from the API.** Ticket section: Account Name, Contact Name, Email, Phone, Subject, Description, Status, Product Name, Case Owner, Created By, Modified By, Created Time, Case On Hold Time, Case Closed Time, Modified Time, Request Id, To Address, Thread Count, Comment Count, Happiness Rating, Team, Due Date, Priority, Mode, Is Overdue, Is Escalated, Classification, Resolution, Time to Respond, Is Response Overdue. Contact section (grouping inferred): First Name, Last Name, Email, Secondary Email, Phone, Mobile, Type, Title, CRM Contact Type. Account section (grouping inferred): Total Revenue To Get, Closing Date, Customer Since, Total Revenue Recieved, Phone, Email, Country. [API-SLA-CRIT]
- **S-011 Criteria operators in the same response.** `<`, `<=`, `<>`, `=`, `>`, `>=`, between, not between, contains, doesn't contain, starts with, ends with, is, isn't, is after, is before, is empty, is not empty, is OPEN, is ON HOLD, is CLOSED, is Less Than, is Greater Than, is received, is not received, link provided, link not provided, has agents. [API-SLA-CRIT]
- **S-012 Filters excluded from SLA criteria.** "Hours since On Hold" and "Ticket On Hold Time" are not available in SLA or Round Robin rules. [ONHOLD] See C-3.
- **S-013 Response target units.** Respond and Resolve within take Minutes, Hours or Days. The API uses `responseTimeUnit` and `resolutionTimeUnit` with `HOUR` in its examples. [SLA] [API-SLA-CREATE]
- **S-014 Operational hours picker.** Calendar Hours or Business Hour. The drop-down lists all business hours created in the account. [SLA]
- **S-015 Default when no business hours are linked.** The timer uses calendar hours and runs through weekends and after hours. Zoho warns this causes false violations and unnecessary alerts. [SLA-FAQ]
- **S-016 Deactivate or delete.** In the SLA list, hover over the row, click the Deactivate or Delete icon, then click **Ok**. [SLA]
- **S-017 Target API.** Targets can be added, updated and deleted on their own. A target response carries `slaGroupId`. [API-SLA-TARGET]
- **S-018 List API.** `departmentId` is required, `limit` is 1–100, `status` filters ACTIVE or INACTIVE, and the call costs 3 credits. [API-SLA-LIST]
- **S-019 Reorder API.** `POST /api/v1/sla/reorder` takes `departmentId` and an ordered `ids` list, at 1 credit per 2 records. [API-SLA-REORDER] Whether the UI offers reordering is not documented.

### 1.2 Escalation levels

- **S-020 Level form, step by step.** Toggle Response Escalation, then in Level 1 set When to escalate (**On time, Before, After**), Whom to escalate, Agent Notification Template, and Actions on Escalation. **Add Level 2 escalation** repeats the form. Resolution Escalation works the same way. [SLA]
- **S-021 Whom to escalate.** "Listed roles/ticket owner/contacts/etc.", with more than one user allowed. [SLA]
- **S-022 Recipient API.** `escalationRecipients {agentIds, lightAgentIds, roleIds, roleAndSubOrdinateIds, teamIds, otherRecipients}`. `otherRecipients` shows `PRIMARY_CONTACT` in examples. [API-SLA-CREATE]
- **S-023 Timing API.** `whenToEscalate` is signed with `escalationTimeUnit`: `-30` means 30 before due, `0` on time, `30` after. Whether negative means "before" is inferred from the examples. [API-SLA-CREATE]
- **S-024 Template API.** Each level has `agentNotificationTemplateId` and `contactNotificationTemplateId`. The contact template can be null. [API-SLA-CREATE]
- **S-025 Escalation action API.** `escalationFieldUpdate {agentId, teamId, priority}`. The response adds `level` and `id` per escalation. [API-SLA-CREATE] [API-SLA-GET] See C-4 and C-5.
- **S-026 Separate actions per level.** "Each level of escalation can have its set of actions." [SLA]
- **S-027 Trigger wording.** An email goes to the selected users "when the SLA is violated", chosen from "Escalation email templates". [SLA] Before-due levels also exist, so the wording is loose (inferred).
- **S-028 Department switch for escalations.** `POST` and `GET /api/v1/sla/escalationStatus` take `departmentId` and `status` (ACTIVE or INACTIVE). [API-SLA-ESC] No UI toggle is described.
- **S-029 Escalated status.** It is one of the 4 default statuses, grouped as Open. A ticket "can be" Escalated when not closed in time, commonly via SLA triggers, and agents can also set it by hand. [STATUS] Whether an SLA escalation always sets the status is not stated (see Could not confirm).
- **S-030 Sticky Escalated.** Unchecking Fall-back to default stops a customer reply from returning an Escalated ticket to Open. [STATUS]
- **S-031 Escalation history event.** `TicketEscalated`, actor type `SLA`, has `EscalationInfo {EscalationType: Response, EscalationLevel, EscalationTiming: OnTime, EscalationDuration, EscalatedTo[]}` plus `TicketFieldUpdates` (for example Case Owner). [HIST]
- **S-032 Blueprint variant.** A separate event, "Ticket escalated by a Blueprint", exists. [HIST]
- **S-033 Overdue history event.** `OvershotDueTime` with `OvershotType` (example: Resolution). Its actor is null. [HIST]
- **S-034 Team use.** Teams can receive escalation emails. [TEAMS-AUTO]

### 1.3 Precedence: contract, account, global

- **S-035 Stop rule.** A valid Contract SLA whose criteria match is applied and "regardless of execution success, the process stops there". The same holds for an Account SLA. The Global SLA applies only if neither exists and its criteria match. [SLA]
- **S-036 Standalone vs associated.** Standalone SLAs apply to all accounts; others are tied to specific accounts or to contracts via support plans. [SLA]
- **S-037 Direct account association (UI).** Customers > Accounts tab > account > **SLA & Contract** floating icon > **New SLA/Contract** > pick the SLA > Save. [SLA]
- **S-038 Indirect association.** Creating a contract for an account automatically associates the support plan and the SLA mapped to it. [SLA]
- **S-039 Account SLA API.** `GET /api/v1/accounts/{id}/sla` has optional `departmentId` and `status`, and `limit` 1–100. Without a department it returns all permitted departments. It returns `slaName`, `isActive`, `department`. [API-ACC-SLA]
- **S-040 Associate or dissociate API.** `POST /api/v1/accounts/{id}/sla/{sla_id}` with `associate` true or false returns 204. [API-ACC-SLA-SET]
- **S-041 Selection among several contracts.** The system "associates it with the relevant contract and support plan", "based on criteria such as product type or account association". [SP-FAQ] [SLA-FAQ] The tie-break is not documented.

### 1.4 Support plans

- **S-042 Path and permission.** Setup > Automation > Support Plan > New Support Plan. Needs **Manage Automation**. [SP] See C-6.
- **S-043 Fields.** Plan Name, Plan type, Credit Cycle and Credit Limit (Ticket-based only), SLA. [SP]
- **S-044 Plan types.** **Unlimited** and **Ticket-based**. Existing active contracts default to Unlimited. [SP] See C-7.
- **S-045 Credit cycle options.** Weekly, monthly, quarterly, yearly. [SP] See C-8.
- **S-046 SLA picker.** Lists only active SLAs in the department. [SP] [SC-FAQ]
- **S-047 Over-limit behaviour.** Tickets are still created and visible, but the SLA does not apply until the cycle renews. The organization may charge for them. [SC-FAQ] [SP-FAQ]
- **S-048 Credits renew.** The count resets on cycle renewal. [SC-FAQ]
- **S-049 Locks.** Plan type, credit cycle and SLA cannot change after association with a contract. Credit limit is not in the lock list. [SP] [SC-FAQ]
- **S-050 Delete vs discontinue.** An associated plan cannot be deleted, but can be discontinued. No new contracts can use it and existing ones continue. [SP] [SC-FAQ]
- **S-051 Plan-to-contract cardinality.** One plan can link to many contracts. One contract has one plan. Every plan must have an SLA. [SP]
- **S-052 Plan API.** `POST`, `GET`, `PATCH` and `DELETE /api/v1/supportPlans`. `status` is ACTIVE or DISCONTINUED. List needs `departmentId`, `limit` 1–50, default 50. Scopes `Desk.automations.*`. [API-SP]
- **S-053 Credit API fields.** `creditDetails {creditCycle, creditLimit, isCarryForwardAllowed, isAdditionalUsageAllowed}`. Carry-forward and additional usage have no UI step in the articles. [API-SP] [SLA]
- **S-054 Customer visibility claim.** The credit limit mechanism gives customers real-time visibility of tickets raised and remaining. [SP-FAQ] The surface is not named (see Could not confirm).

### 1.5 Contracts

- **S-055 Module.** Contracts is a standard module on the top bar. It shows only if enabled for the department under Setup > Customization > Modules & Tabs > Organize Module. [SC-FAQ] [CONTRACT]
- **S-056 Permission.** "Manage Help Desk Automation". [CONTRACT] See C-6.
- **S-057 Fields.** Department, Contract owner (defaults to creator), Contract name, Contract number, Product name, Account name, Start date, End date, Support plan, Description, and Contract Expiration Notification. [SP] [CONTRACT]
- **S-058 Create entry points.** Top-bar **+**, or the account's SLA and Contract icon. [CONTRACT]
- **S-059 Validity labels.** A future start date marks the contract "Future". Expired and active contracts also show labels. API `contractStatus`: ACTIVE, EXPIRED, FUTURE. [CONTRACT] [API-CONTRACT]
- **S-060 Overlap rule.** Contracts sharing one SLA must not overlap in time. Different SLAs may overlap on one account. [CONTRACT]
- **S-061 Association timing.** An account can be associated with a contract only during its creation or edit. [CONTRACT]
- **S-062 Terminate.** Contract > More > Terminate > confirm. It cannot be reverted. [CONTRACT]
- **S-063 Delete.** Deleting a contract does not delete the SLA. [CONTRACT]
- **S-064 List view.** Sort by Account Name, Contract Name, End or Start Date, Created or Modified Time, newest or oldest first. Filter by Department and Agents. Default views are all, expired and my contracts. Favourites are allowed. Custom views and mass actions are **not** allowed. [CONTRACT]
- **S-065 Expiry alert.** Whom to Notify plus days before expiry. API `notificationAgentIds`, `notifyBefore`, read-only example `notifyOn`. [SP] [API-CONTRACT]
- **S-066 Contract API required fields.** `accountId`, `departmentId`, `startDate`, `ownerId`, `contractName`. Limits: `contractName` 80, `contractNumber` 50, `description` 65535 characters. `associatedSLAId`, `accountId` and `productId` are flagged deprecated. [API-CONTRACT-CREATE]
- **S-067 Contract API operations.** Get, list (`limit` 1–100, up to 10 `departmentIds` and `ownerIds`, `contractName` starts-with, sort by accountName, contractName, contractEndDate, contractStartDate, createdTime, modifiedTime), create, update, `updateMany`, `moveToTrash`, comments CRUD, and per-account list. Scopes `Desk.contracts.*`. [API-CONTRACT]
- **S-068 Ticket link in API.** The ticket example shows `contractId`. [API-TICKET]
- **S-069 Ticket surface.** Contract icon in the ticket's left panel shows validity, support plan and account credit balance, **only if the plan's SLA was applied to that ticket**. [SP] [SC-FAQ]
- **S-070 Account surface.** The SLA and contracts icon lists each contract with plan, SLA and validity. [SP]
- **S-071 Contract surface.** Contract and support plan appear as separate icons on the detail view. [SP]
- **S-072 History link.** "Ticket updated by an SLA" has `actorInfo` `ContractName`. [HIST]

### 1.6 Business hours and holidays: details beyond the existing summary

- **S-073 Business hour form.** Name, Time Zone, Holiday List, Operational Hours (**Always**, **Specific Working Hours**, **Custom**). Drag a time block to resize; **X** removes hours for a day. [BH]
- **S-074 Delete guard.** Dissociate SLAs and Time-based rules before deleting a business hour. [BH]
- **S-075 Deactivate.** Toggle off; the entry moves to the Inactive list. [BH]
- **S-076 Hour-based rule.** A 50-hour SLA from Monday 10:00 (Mon–Fri 9–18, Sat 9–13) is due the next Monday 11:00. [BH] [SLA-FAQ]
- **S-077 Day-based rule cases.** Same schedule, 1 day: Mon 10:00 is due Tue 10:00; Mon 22:00 due Tue 18:00; Fri 22:00 due Sat 13:00; Sat or Sun after hours due Mon 18:00. Saturday counts as a business day though it is short. [BH]
- **S-078 Friday rollover.** 4 business hours from Friday 16:00 with an 18:00 close are due Monday 11:00. [SLA-FAQ]
- **S-079 Holiday types.** **Recurring Holiday** or **Year-Specific Holiday** (current or next two years). Pick dates, ranges allowed, name each, Add. [BH]
- **S-080 Delete one holiday.** Click it on the calendar, then Delete and Save. [BH]
- **S-081 Deactivated list.** Associated business hours no longer pause on those holidays. [BH] [SLA-FAQ]
- **S-082 Dates locked.** Once the type is chosen and the list is created and associated, dates cannot be modified. [BH] See C-9.
- **S-083 Holidays also apply to** Blueprint workflows and time-based rules. [GLOSS]

### 1.7 On Hold: pause and resume mechanics

- **S-084 On hold effects.** Timers freeze, due times are hidden, no due emails go out, no escalation actions run, and the ticket leaves rules, custom views and reports using Response or Resolution due as criteria. [ONHOLD] [ONHOLD-CONCEPT]
- **S-085 Resume formula.** New due = old due + held time, respecting the SLA's business hours. Escalations reschedule. [ONHOLD]
- **S-086 Manual due date changes the rule.** After a manual Resolution Due change, recalculation uses calendar hours regardless of SLA configuration. Response Due always follows the SLA's hours. [ONHOLD]
- **S-087 Four resume paths.** Manual status change; automation such as Workflow; customer reply (falls back to default status); customer rating, if reopen-on-rating is on. [ONHOLD]
- **S-088 Close from hold.** Old response and resolution due times are restored. [ONHOLD]
- **S-089 Spam.** Spam tickets also have due times recalculated. [ONHOLD]
- **S-090 Rule overwrite.** Resolution times set by automation on ticket update overwrite the recalculated due time. [ONHOLD]
- **S-091 Already-overdue tickets.** Once on hold they are no longer overdue, and moving back to Open does **not** recalculate due times. [ONHOLD] See C-10.
- **S-092 Status constraints.** An On Hold status cannot be the default status, and its Fall-back to default cannot be deselected. Custom statuses can map to the On Hold type. [ONHOLD]
- **S-093 State mapping is org-wide.** A status cannot be Open in one department and Closed in another. [STATUS]
- **S-094 Worked example.** 12h resolution, 4h used, on hold for 2 days, then a customer reply: 8h remain from then. [ONHOLD-CONCEPT]
- **S-095 Reported time vs timer.** Overall response and resolution time include hold time. Agent response and resolution time exclude it. [RESP-CASES] [RESO-CASES] See C-11.

### 1.8 Reset and reapply

- **S-096 Reset on apply.** Applying an SLA resets response and resolution regardless of prior SLA activity. Any response after that counts as the first response. [SLA]
- **S-097 Multiple triggers.** Each selected trigger can reset the SLA. Ticket Update is a generic option that resets often. [SLA]
- **S-098 Manual reapply.** No UI action or API call to reapply an SLA is documented. Reapply happens through a trigger firing (inferred). [SLA] [API-SLA]
- **S-099 Manual due date.** Agents can set the due date with a date-time picker. [TKT-FAQ]
- **S-100 Reopen.** A customer reply returns a closed ticket to the default status. [STATUS] Whether due dates are recomputed on reopen depends on triggers (inferred). Reported resolution time accumulates over open/close cycles and updates at each close. [RESO-CASES]

### 1.9 Moving between departments

- **S-101 Receiving side.** The moved ticket is treated as new, status is set to Open, "all automations and SLAs from the previous department will be erased", and it follows the new department's processes. [DETAIL] See C-12.
- **S-102 Reported times.** Response and resolution stay measured from original creation. Agent times run from assignment in the new department. [RESP-CASES] [RESO-CASES] [SLA-FAQ]
- **S-103 Blueprint guard.** The docs tell agents to revoke the blueprint before moving a misdirected ticket. [DETAIL] [BULK]
- **S-104 Bulk move.** Bulk only, with more than one department and more than 50 records. [BULK] See C-13.
- **S-105 Move API.** `POST /api/v1/tickets/{id}/move` with optional `departmentId` or `forumId`. [API-MOVE] No SLA parameter exists.
- **S-106 Move notification.** Department Notifications > "Receiving a moved ticket". See N-R34. [NOTIF]

### 1.10 Merge, split and special cases

- **S-107 Merge.** The earliest ticket is the reference point. Open/close cycle times are added together. Different owners reset assigned time to merge time. [SLA-FAQ]
- **S-108 Split.** If ownership passes from Ticket A to new Ticket B, the assignment time carries over. [RESP-CASES]
- **S-109 Closed outside hours, no business hours between.** Resolution and response are 1 minute. [SLA-FAQ] [RESP-CASES]
- **S-110 Closed outside hours, created inside.** A ticket closed at 19:00 counts as closed at the next opening. [RESO-CASES]
- **S-111 Multiple customer emails.** Measured from the first email. [SLA-FAQ]
- **S-112 Multiple agent replies.** Only the first reply counts. [SLA-FAQ]
- **S-113 Reply sent for review.** Agent response time runs to when the final response was sent. [RESP-CASES]
- **S-114 Non-owner closes.** Resolution time is credited to the owner unless the closer reassigns first. [RESO-CASES]

### 1.11 Where SLA data surfaces

**Ticket fields and views**

- **S-115 Ticket API fields.** `dueDate`, `responseDueDate`, `isOverDue`, `isEscalated`, `onholdTime`, `customerResponseTime`. [API-TICKET]
- **S-116 Predefined views.** Overdue Tickets, My Overdue Tickets, Response Overdue Tickets, My Response Overdue Tickets, SLA Violated Tickets, On Hold Tickets, My On Hold Tickets. Overdue views exclude On Hold tickets. [VIEWS] [ONHOLD]
- **S-117 On Hold view sort.** Default sort is Customer Response Time. [ONHOLD]
- **S-118 Custom views.** "Age in Days" can find tickets that breached SLA in the last 30 days. Is overdue and Is Response Overdue ignore On Hold tickets in custom views, reports, advanced search and automation. [VIEWS] [ONHOLD]
- **S-119 Table view.** Can show response due date as a column. [VIEWS]
- **S-120 Work modes.** Countdown mode has undeletable Overdue Tickets and No Due Date columns, custom intervals such as "Due in 30 minutes", up to 7 columns, and an On Hold column. [MODES] [ONHOLD]
- **S-121 Agent Queue and Team Queue.** Both show On Hold tickets. [ONHOLD]
- **S-122 Headquarters.** Unassigned Overdue and due-in-one-hour counts, and agents ranked by most overdue tickets. [HQ]
- **S-123 Help Center.** Customers can have My Overdue Requests/Tickets. "Escalated" is explained as an SLA-breach signal. [HC-FAQ]

**Reports and dashboards**

- **S-124 SLA dashboard permission.** Reports and Dashboards. [SLA-DASH]
- **S-125 Metric definitions.** SLA violated tickets; SLA violations (instances: 2 in one ticket + 1 in another = 3); Average residual time; Average violation time. [SLA-DASH]
- **S-126 Filters.** SLA Name, Violation type (first response, response, resolution), Teams, Agents, Duration: Last 24 Hours, Today, Yesterday, Last 7 days, Last 30 days, Current week, Last week, Current month, Last month, Custom. [SLA-DASH] See C-14.
- **S-127 Components.** SLA violated tickets; Adherence vs violated tickets; Adherence vs violated instances; Violations by SLA and Agents; by time; by status; by channel. [SLA-DASH]
- **S-128 Standard dashboard.** It cannot be deleted. [STD-DASH]
- **S-129 SLA Tickets static report.** Lists SLAs violated, violation type and time to respond after lapse. Listed for Admin. [STATIC]
- **S-130 Static report API.** `GET /api/v1/reports/staticReports/slaReports`. `duration` is required. `violationType` default ALL_VIOLATION; values FIRST_RESPONSE_, RESPONSE_, RESOLUTION_ with VIOLATION or SUCCESS, plus ALL, ALL_VIOLATION, ALL_SUCCESS. `slaId` up to 25. `limit` 1–2000, default 100. `groupBy` date, channel, agent, case, sla, currentValue, previousValue. Also `departmentId`, `agentId`, `teamId`, `channel`, `ticketNumber`, `viewDetailedReport` (default true). Custom dates use dd-MM-yyyy. Headers include TICKET ID, SUBJECT, TICKET OWNER, CONTACT NAME, SLA NAME, VIOLATED TIME. [API-SLA-REPORT]
- **S-131 Predefined reports.** Tickets By SLA, Tickets By SLA Violated, Open-Overdue Tickets. [PREDEF]
- **S-132 Agent Performance SLA metrics.** First Response, Response and Resolution, each with Violation and Success. [AGENT-PERF]
- **S-133 Report formulas.** Response violation = reply time − response due. Resolution violation = closed time − due. Response SLA success = response due − reply time. [FORMULAS]
- **S-134 Ticket metrics API.** `GET /tickets/{id}/metrics` returns firstResponseTime, totalResponseTime, resolutionTime, reassignCount, agentsHandled, stagingData and others. 3 credits. [API-METRICS]
- **S-135 Radar app.** SLA dashboard filterable by SLAs, violation type, agents, time frame. [RADAR-STATIC]
- **S-136 Counts API.** `GET /ticketsCountByFieldValues` with `field=overDue,escalated,…`. [API-COUNTS]
- **S-137 List API.** `GET /tickets` `sortBy` responseDueDate, customerResponseTime, createdTime. [API-TICKET]
- **S-138 Filter by due.** Product and account ticket lists accept `dueDate` overdue, tomorrow, currentWeek, currentMonth, today. [API]

### 1.12 Automation hooks

- **S-139 Email placeholders.** `${Cases.Is Escalated}`, `${Cases.Escalation Level}`, `${Cases.Blueprint State Escalation Level}`. [TEMPLATES]
- **S-140 Template render source.** `POST /templates/{id}/render` has `source` values TICKET_REPLY, NOTIFICATIONS, AUTOMATION_ALERTS, SLA. [API-RENDER]
- **S-141 Automation Studio.** If-block time comparators evaluate time to due date. Example: within 2 hours and unresolved, escalate and email the team. [AS-BLOCKS]
- **S-142 Automation Studio on status.** An event can match status changed from Open to Escalated. [AS-BLOCKS]
- **S-143 Sandbox.** Sandbox changeset entity types include `SLA`, `Notification Rules`, `Feed Preferences` and `Macro`. Support plans and contracts are not in that list. [API]
- **S-144 Webhooks.** The webhook document has no SLA or escalation event. Ticket payloads carry `dueDate`, `responseDueDate`, `isOverDue`, `isResponseOverdue` and `isEscalated`, so `Ticket_Update` is the likely route (inferred). [WEBHOOK]
- **S-145 Replacement on deactivation.** Recorded in the assignment inventory; the source also covers SLA "whom to escalate" and ticket owner fields. [AGENTS]
- **S-146 Zoho Cliq.** Channel and direct notifications include escalations. [CLIQ]

### 1.13 Plan availability

Rows read from [PRICE] (columns Free / Express / Standard / Professional / Enterprise). Counts already recorded are not repeated.

| ID | Row | Free | Express | Standard | Professional | Enterprise |
|---|---|---|---|---|---|---|
| S-147 | SLA dashboards | – | – | – | Yes | Yes |
| S-148 | Contracts and support plans | – | – | – | – | Yes |
| S-149 | Management in SLA (support contracts) | – | – | – | – | Yes |
| S-150 | Field monitoring (see C-15) | – | – | – | Yes | Yes |

- **S-151 Free plan article.** "Priority based SLAs with single level escalation". [PLAN-FREE]
- **S-152 Enterprise plan article.** "20 SLAs", plus contracts stored for agents to view. [PLAN-ENT]

---

## 2. Notifications

### 2.1 Notification rules: full list

Every rule is per department, **off by default**, delivered by email or SMS, with a customizable template (see C-16 for team rules). Source for all rows: [NOTIF]. The FAQ at [NOTIF-FAQ] restates them.

| ID | Group | Rule name | Recipient and event |
|---|---|---|---|
| N-R01 | Contact | Receiving a new ticket | Requester: ticket received |
| N-R02 | Contact | Acknowledging a ticket reply | Requester: their response received |
| N-R03 | Contact | Closing a ticket | Requester: ticket closed |
| N-R04 | Contact | Adding a public comment | Requester |
| N-R05 | Contact | Editing a public comment | Requester |
| N-R06 | Contact | Deleting a public comment | Requester |
| N-R07 | Contact | Receiving a reply (needs CC feature) | Requester: new reply on their ticket |
| N-R08 | Contact | CC'd users on receiving a ticket (needs CC feature) | CC'd users: ticket received |
| N-R09 | CC | Receiving a new ticket | CC'd users |
| N-R10 | CC | Receiving a reply | CC'd users |
| N-R11 | CC | Acknowledging a ticket reply | CC'd user |
| N-R12 | CC | Closing a ticket | CC'd users |
| N-R13 | CC | Adding a public comment | CC'd users |
| N-R14 | CC | Editing a public comment | CC'd users |
| N-R15 | CC | Deleting a public comment | CC'd users |
| N-R16 | CC | Adding CCs to an existing ticket | User added as CC |
| N-R17 | Agent | Assigning a ticket | Assigned agent |
| N-R18 | Agent | Receiving a ticket reply | Agent: their ticket got a response |
| N-R19 | Agent | Receiving ticket for review | Reviewer or approver |
| N-R20 | Agent | Adding a comment | Agent: on their ticket |
| N-R21 | Agent | Editing a comment | Agent |
| N-R22 | Agent | Deleting a comment | Agent |
| N-R23 | Agent | Mentioning in a ticket | Mentioned agent |
| N-R24 | Agent | Assigning a call | Assigned agent |
| N-R25 | Agent | Completing a call | Agent: call on their ticket done |
| N-R26 | Agent | Mentioning in a call | Mentioned agent |
| N-R27 | Agent | Assigning a task | Assigned agent |
| N-R28 | Agent | Completing a task | Agent |
| N-R29 | Agent | Mentioning in a task | Mentioned agent |
| N-R30 | Agent | Assigning an event | Assigned agent |
| N-R31 | Agent | Completing an event | Agent |
| N-R32 | Agent | Mentioning in an event | Mentioned agent |
| N-R33 | Agent | Assigning a blueprint transition | Agent assigned the transition |
| N-R34 | Department | Receiving a moved ticket | All agents in the department |
| N-R35 | Department | Creating a new ticket | All agents: ticket not auto-assigned |
| N-R36 | Department | Receiving a shared ticket | All agents in the department |
| N-R37 | Team | Assigning a ticket | Team members |
| N-R38 | Team | Receiving a ticket reply | Team members |
| N-R39 | Team | Adding a comment | Team members |
| N-R40 | Team | Editing a comment | Team members |
| N-R41 | Team | Deleting a comment | Team members |
| N-R42 | Team | Mentioning in a ticket | Team members, when the team is mentioned |
| N-R43 | Team | Assigning a call | Team members |
| N-R44 | Team | Completing a call | Team members |
| N-R45 | Team | Mentioning in a call | Team members |
| N-R46 | Team | Assigning a task | Team members |
| N-R47 | Team | Completing a task | Team members |
| N-R48 | Team | Mentioning in a task | Team members |
| N-R49 | Team | Assigning an event | Team members |
| N-R50 | Team | Completing an event | Team members |
| N-R51 | Team | Mentioning in an event | Team members |

### 2.2 Rule mechanics

- **N-001 Instant effect.** Toggling a rule takes effect instantly. [NOTIF]
- **N-002 CC dependency.** CC Notifications and the two marked Contact rules need **Allow CCs on tickets** at Setup > General Settings > Tickets. [NOTIF]
- **N-003 No custom rules.** The list is a "standard set", with activate or deactivate only. Custom notifications are built with workflows. [NOTIF] [TEAMS-AUTO]
- **N-004 Bulk close.** Notification rules are not triggered when tickets are closed using bulk actions. [BULK] See C-17.
- **N-005 Close without notice (API).** `disableClosureNotification=true` on Update Ticket skips the contact's closure notification. [API-UPDATE]
- **N-006 Private thread.** No notification goes to the contact. [THREADS]
- **N-007 Resolution notice.** Filling Resolution with **Notify Contact** shares it; the history event is "Resolution Contact Notification". [TKT-FAQ] [HIST]
- **N-008 Activity assignment.** Agents are emailed when an activity is assigned. [TKT-FAQ] On Cliq, notifications go only when record owner and creator differ. [CLIQ] Whether email follows the same rule is not documented.
- **N-009 Mass or bulk result.** The initiator and the admin get a status email on completion. [BULK]
- **N-010 Email block.** A high bounce rate can block sending; the block applies to email notifications, not ticket responses. [EMAIL-SETUP]
- **N-011 Order in the chain.** Runs after Blueprint in the documented sequences. [SLA] [SLA-FAQ]
- **N-012 Evidence.** `NotificationSent`, actor type `NotificationRule`, with `NotificationType: EmailNotification` and `Recipients`. Workflow, supervise, macro and blueprint alerts use the same event with their own actor and `AlertName`. [HIST]
- **N-013 Configuration audit.** Entity names `Notification Rules` and `Feed Preferences` are valid in changeset filters. [API] Audit Log also lists Notification Rules. [AUDIT]
- **N-014 No rules API.** No public endpoint lists or toggles notification rules (inferred from a full-text search of the API page). [API]
- **N-015 Design guidance.** Zoho warns that department-wide rules can create high alert volume and overlapping rules create redundant alerts. [NOTIF-FAQ]

### 2.3 Templates

- **N-016 Edit path.** Setup > Customization > Notifications > department > hover the rule > Edit Template icon > Edit Email/SMS Template > Preview (email only) > Save. [NOTIF]
- **N-017 Predefined requestor templates.** Acknowledge on receiving their ticket; Acknowledge Cc'd users; Acknowledge on receipt of a new response; Comment added, deleted, modified; Resolution is added; Acknowledge on closing. [TEMPLATES]
- **N-018 Predefined agent templates.** Receiving a new ticket; Requestor responding; Ticket assigned; Blueprint transition assigned; Task, Call or Event assigned; Remind about tasks, calls, events; Task, Call or Event completed; Comment added, deleted, modified; Receiving a happiness rating; Article feedback, review, published, about to expire, expired; Receiving a ticket for review; Ticket is escalated; Blueprint state is escalated; A ticket is moved to their department. [TEMPLATES]
- **N-019 Predefined team templates.** Ticket assigned; Requestor responding; Comment added, deleted, modified; Task, Call, Event assigned; Task, Call, Event completed. [TEMPLATES]
- **N-020 Folders.** API examples show default folders Agent Notification(s), Contact Notification, Secondary Contacts Notification, Team Notification, with `category: DEFAULT_FOLDER` and `templatesCount` per module. [API-FOLDERS]
- **N-021 Folder access.** Accessible by all agents, only you, or specified agents. [TEMPLATES] API `folderAccessDetails.type` shows `allAgents`, with teams, roles, rolesAndSubordinates, agents. [API-FOLDERS]
- **N-022 Permission to edit templates.** Profile permission for managing Email and Ticket Templates. [TEMPLATES]
- **N-023 Plan restriction.** Free users cannot create or modify templates. Unverified users on Standard, Professional and Enterprise are also restricted. [TEMPLATES] See C-18.
- **N-024 Placeholders.** Insert Placeholders by Agent, Organization or specific module category; also allowed in Subject. [TEMPLATES] API: `GET /templates/placeHolders`. [API-TEMPLATES]
- **N-025 Template API.** Templates CRUD, list, render, cloneAttachments, placeHolders; folders CRUD. Scope `Desk.templates.*`. [API-TEMPLATES]
- **N-026 Separate from reply templates.** Notification templates serve automated events. [TPL-FAQ]
- **N-027 Cross-department copy.** Only through the Broadcast Email Template extension; no built-in method confirmed. [TPL-FAQ]

### 2.4 SMS channel

- **N-028 Prerequisite.** Standard, Professional or Enterprise, with credits from SMS-Magic or Clickatell. [SMS] [PRICE]
- **N-029 Configure.** Setup > Integrations > Others > SMS Add-on > Configure SMS Settings. [SMS]
- **N-030 Vendor fields.** SMS-Magic: Username, Account ID, API Key, Sender ID. Clickatell: Username, Password, API ID, Sender ID. [SMS]
- **N-031 Recipient number mapping.** Customers: Phone, Mobile, or the ticket's phone. Agents: Phone or Mobile. [SMS]
- **N-032 Limits.** One gateway at a time; template up to **500 characters**; international format recommended. [SMS]
- **N-033 SMS history.** Monthly Sent, Delivered, Failed; drill down to sent time, recipient, gateway and vendor response. [SMS]
- **N-034 Credits.** **Show Available SMS Credits**. [SMS]

### 2.5 Feed preferences (admin, per department)

- **N-035 Path.** Setup > Customization > Notifications > Feed preference > department > toggle. [FEEDS]
- **N-036 Ticket events.** Create, Time based actions (Supervisor rules), Picked, Update, Closed, Reopened. "ONLY" these show as feed notifications. [FEEDS]
- **N-037 Task events.** Create, Update, Complete, Reopen. [FEEDS]
- **N-038 Default and master switch.** Feed preference is on by default. Turning it off disables feeds for all departments. If all feeds are off for a department, the Team feeds tab disappears. [FEEDS]
- **N-039 Effect.** Controls both the Team feeds tab and the Notification Center. [FEEDS]
- **N-040 Team level.** Not offered as a preference; department and portal are the documented levels. [ORG-FAQ]

### 2.6 Notification Center (in-app)

- **N-041 Location.** Bell icon top right. It glows for new items, and the window slides open. [NC] [ORG-FAQ]
- **N-042 Content.** Customer replies, status changes, new assignments, new tickets from followed accounts, comments, mentions, followed tickets, contacts and accounts. [NC] [FOLLOW-TKT] [FOLLOW-CUST]
- **N-043 Filters.** All (default), Unread, @Mentions ("My & My Team Mentions" example), Flagged. [NC] [FEEDS]
- **N-044 Mark all as read.** Available. [NC]
- **N-045 Flag.** Bookmark an item for later. [NC]
- **N-046 Scope.** User-specific, across all departments the user belongs to. [NC] [FEEDS]
- **N-047 Agent per-department switch.** Agents can disable notifications from a department. This does **not** affect email rules. [NC] See C-19.
- **N-048 Agent preference API.** `GET` and `PATCH /api/v1/myEntityPreferences` with `entityType: department`, `entityId`, `propName: isNotificationEnabled`, `propValue: ENABLED|DISABLED`. Scope `Desk.basic.*`. [API-ENTITY-PREF]
- **N-049 Filter preference API.** `feedNotificationFilterPreference` in `myPreferences`. Its values are not listed. [API-MYPREF]
- **N-050 Email failure alerts.** Listed in the panel, with resend for failed replies. [NC] [TKT-FAQ]
- **N-051 Automation alert.** Triggered automation "will send an alert to the Notifications panel". [TKT-FAQ]
- **N-052 Draft notice.** "<agent> Saved a draft of the ticket". [ORG-FAQ]
- **N-053 Export finished.** View export completion arrives as an in-app notification. [VIEWS]
- **N-054 Zia alerts.** When an anomaly or alert is triggered, a red icon appears in a notification panel that this source places at the bottom of the screen. [ZIA-FAQ]
- **N-055 Toast UI preferences.** `a11y_notificationView` stack or list; `a11y_isSuccessNotificationAutoClose` and `a11y_isErrorNotificationAutoClose` ENABLED or DISABLED; auto-close time 01, 03, 05, 10, 15 or 20. [API-MYPREF] That the time unit is seconds is inferred.
- **N-056 Volume and IM setting.** `notificationVolume` 0–100, returned only with cookie authentication; `imNotification` ENABLED in agent channel preferences. [API-CHANNEL]
- **N-057 Agent collision alerts.** Separate in-ticket notice of other viewers and recent actions. Professional and Enterprise. [COLLISION] [PRICE]
- **N-058 Pop-up notifications row.** "Brief action-related notifications": all plans. [PRICE]
- **N-059 Activity reminders.** By email, SMS or **browser pop-up**, needing a due date (tasks) or start time (calls, events). [TKT-FAQ]
- **N-060 Log retention hint.** Support asks for a missed example within 7 days because logs are retained for a limited time. [APP-FIX]
- **N-061 Known issue workaround.** Missing app alerts: an admin edits and reverts the agent's profile to refresh the feed. [APP-FIX]

### 2.7 Mobile

- **N-062 Android settings.** On or off, sounds per notification, pop-up type, categories. [ANDROID]
- **N-063 Android per department.** Choose departments for ticket notifications and Task Reminder notifications. Applies to new tickets only. [ANDROID]
- **N-064 Android view.** Bell icon; tap the count to see the messages in a notification. [ANDROID]
- **N-065 iOS.** Enable or disable push; delivered through Apple's servers when the app is closed. [IOS-SET]
- **N-066 iOS view.** View only, tap the count, tap to open the ticket. Rules cannot be set in the app. [IOS-NOTIF]
- **N-067 Feed mobile claim.** "Instant mobile notification of actions that are related to the agent". [FEEDS]
- **N-068 Radar.** Exception alerts and daily toasts need push enabled. Open, overdue and unassigned counts on demand. [RADAR-ALERT]

### 2.8 Other recipients and related notifications

- **N-069 Followers.** Followers get notified of ticket developments. [ANDROID-ACTIONS]
- **N-070 Contract expiry.** See S-065. [API-CONTRACT]
- **N-071 API credit alert.** Threshold percentage alert. All plans except Free. [API-CREDIT] [PRICE]
- **N-072 Help Center.** Deactivated users are emailed by default, and a toggle stops it. [HC-ACCESS]
- **N-073 In-product call notifications.** Professional and Enterprise. [PRICE]
- **N-074 Chat notifications row.** Standard, Professional, Enterprise. [PRICE]
- **N-075 Workflow chat notifications.** Recorded in the workflow inventory §4.8. [WF-CHAT]

### 2.9 Plan availability

| ID | Row | Free | Express | Standard | Professional | Enterprise | Source |
|---|---|---|---|---|---|---|---|
| N-076 | Notification rules | Yes | Yes | Yes | Yes | Yes | [PRICE] |
| N-077 | Custom email templates | Default only | Default only | Yes | Yes | Yes | [PRICE] |
| N-078 | SMS add-on | – | – | Yes | Yes | Yes | [PRICE] |

---

## 3. Macros

### 3.1 Scope

- **M-001 Definition.** A predefined set of actions performed on a ticket in one click, triggered manually. [MACRO]
- **M-002 Department.** Macros are department-specific and must be recreated for other departments. [MACRO] [MACRO-USE]
- **M-003 Module.** Tickets only. [MACRO]
- **M-004 No conditions.** "Conditions cannot be defined in macro rules." [MACRO] See C-20.
- **M-005 Availability.** **All agents** or **Specific agents**; the latter picks agents, teams, roles, or roles and subordinates. [MACRO]
- **M-006 No personal macros.** No agent-owned or private macro type is documented. Agents do not create them from the ticket; creation is under Setup (inferred). [MACRO]

### 3.2 Creating and managing

- **M-007 Path.** Setup > Automation > Macros > **Create Rule**. [MACRO]
- **M-008 Steps.** Basic information (name, description, Active checkbox) > Next > availability > Next > actions > Save. [MACRO]
- **M-009 Manage rules.** Edit, delete or deactivate at any point. [MACRO]
- **M-010 Reusable actions.** Actions are listed under Automation > Macros, can be created there, and can be selected as existing when building a rule. [MACRO]
- **M-011 Delete guard.** An action associated with a macro must be dissociated before deletion. [MACRO]
- **M-012 Deactivated agent.** Field updates in macros that set the owner move to the replacement. [AGENTS]

### 3.3 Actions

- **M-013 Alerts.** Name, email template, and users, teams or record owners to notify. Key elements also list contact. Maximum 10. [MACRO]
- **M-014 Tasks.** Subject, description, status, priority; checkbox for request owner as task owner, otherwise a user or team; due date. Maximum 10. [MACRO]
- **M-015 Field updates.** Assignment value name, description, fields and values (status, priority, type, custom fields). Maximum 10. [MACRO]
- **M-016 Custom functions.** Name, description, method name, script. No per-macro cap stated. [MACRO]
- **M-017 Move department.** Department and layout. One per macro. Executes **last**. [MACRO]
- **M-018 Inactive department.** A prompt appears when adding the action, asking for another department. [MACRO]
- **M-019 Inactive or deleted layout.** A prompt appears on edit. Layout is optional; saving without it moves to the default layout. [MACRO]
- **M-020 Assigning through a macro.** Examples assign to a team; round robin will not override. [MACRO] [ASSIGN]
- **M-021 Status.** Macros can set any status. [STATUS]
- **M-022 Not listed as actions.** Reply, comment, tags, and SLA change are not listed. Comment via macro needs a custom function (inferred). [MACRO]
- **M-023 Execution order within a macro.** Only "move last" is stated. [MACRO]

### 3.4 Applying

- **M-024 Single ticket.** Open the ticket, **Apply Macro** at the bottom of the detail page, pick, **Apply**. [MACRO-USE]
- **M-025 Multiple tickets.** Select tickets in a view, click **Macro** in mass actions, pick one. [MACRO-USE] [BULK]
- **M-026 Limit.** At most 50 tickets. [MACRO] Macro is Mass only; Bulk is X. [BULK]
- **M-027 Cross-department.** Not possible in one action. [MACRO-FAQ]
- **M-028 Work modes.** Apply macro is available with up to 50 selected records. [MODES]
- **M-029 Mobile.** Android and iOS can apply macros, not create them. [ANDROID-ACTIONS] [IOS-ACTIONS]
- **M-030 Mass rules.** One mass or bulk action per view at a time. Not in Spam Tickets, Shared Open Tickets, Shared Tickets, Archived Views. [BULK]
- **M-031 Queue.** Tickets are queued and processed in sequence. [MACRO-FAQ] [BULK]
- **M-032 Parent and child.** Applying to children never changes the parent, before or after the parent is resolved. [MACRO-FAQ] [PARENT-CHILD]
- **M-033 Log.** Setup > Data Administration > Bulk Actions Log. Failure reasons: disabled back-end schedulers, modified list views, internal server errors. A running bulk action cannot be discarded. [MACRO-FAQ] [BULK]
- **M-034 Completion email.** Initiator and admin. [BULK]

### 3.5 Permissions

- **M-035 Manage.** Administrator profile and Helpdesk Automation permission. [MACRO]
- **M-036 Profile API.** `automation`: "Permission to manage the automation features (like Workflows, Macros etc.)". [API-PROFILES]
- **M-037 Apply.** No separate apply permission is in the Profile API (inferred); availability setting controls who sees a macro (inferred). [API-PROFILES] [MACRO]

### 3.6 Where results surface

- **M-038 History tab.** Actions triggered appear in History. [MACRO-USE]
- **M-039 Field update event.** `TicketUpdated`, actor `{name, type: Macro}`, with value transitions. [HIST]
- **M-040 Alert event.** `NotificationSent`, actor type Macro, `AlertName`, `MacroTriggerer` (the agent). [HIST]
- **M-041 Blueprint revoked by macro.** `BlueprintRevoked`, actor Macro, with Blueprint and FromState. [HIST]
- **M-042 State moved by macro.** `BlueprintStateMoved`, actor Macro, FromState, ToState, `FieldUpdateName`. A status field update appears to move the state (inferred). [HIST]
- **M-043 API usage.** Custom functions from macros count under Automation on the API dashboard. [API-DASH]
- **M-044 Sandbox entity.** `Macro`. [API]
- **M-045 History filter.** `MacroHistory`. Recorded in workflow inventory §6. [API-HISTORY]

### 3.7 API

- **M-046 No macro endpoints.** "Macro" occurs in the API page only in the sandbox entity list, profile description and history filter (inferred: no CRUD or apply API). [API]
- **M-047 Counts.** `automationFeatureCount` has no macro value. [API-COUNTFEAT]

### 3.8 Usage guidance from Zoho

- **M-048 Macro vs workflow.** Agent-triggered after review, against system-triggered. Official community series. [COMM-MACRO]
- **M-049 Best practice.** Team-specific macros, clear names, remove unused ones. [COMM-MACRO]

### 3.9 Plan availability

- **M-050 Count.** Recorded: 2 / 2 / 5 / 15 per department / 30 per department. [PRICE]
- **M-051 Free.** "Two macros". [PLAN-FREE]
- **M-052 Custom function action on lower plans.** Not stated. Custom functions in workflows are Enterprise per the workflow inventory, so likely the same (inferred). [PRICE]

---

## Conflicts

- **C-1 Customer Reply options.** [SLA] offers Customer Reply with "Incoming or Outgoing Responses", while also listing Agent response separately.
- **C-2 Field update trigger.** [SLA] says updated "to the defined value". [SLA] steps and [API-SLA-CREATE] show a field list with match type `ANY` and no value.
- **C-3 Status conditions in SLA.** [ONHOLD] excludes on-hold time filters from SLA rules, and [API-SLA-CRIT] returns Case On Hold Time as an SLA criteria field. That these two names mean the same field is inferred.
- **C-4 Escalation target.** [SLA] says select "an Agent". [API-SLA-CREATE] also accepts `teamId`.
- **C-5 Priority values.** [SLA] says high, medium, low. [API-SLA-CREATE] shows High and Medium, and [TKT-FAQ] lists High, Medium, Low, None; the Priority criteria example also uses Critical.
- **C-6 Permission names.** SLA: Support Administrator [SLA]. Support plan: Manage Automation [SP]. Contract: Manage Help Desk Automation [CONTRACT].
- **C-7 Plan types.** [SP] has 2: Unlimited, Ticket-based. [API-SP] has 4: UNLIMITED_SUPPORT, HOURS, TICKETS, PRICE.
- **C-8 Credit cycles.** [SP] has 4. [API-SP] has 6, adding HALF_YEARLY and CONTRACT_DURATION.
- **C-9 Holiday details.** The holiday list form allows "up to two business hours", while the same article and [SLA-FAQ] say "more than one". Also, recurring holidays occur every year but "must be updated each year", and dates "cannot be modified" after association while single holidays can be deleted. All in [BH]. The Setup path varies between Organization and General.
- **C-10 Resume recalculation.** [ONHOLD] says due times are recalculated on return to Open, and also that On Hold overdue tickets returned to Open are not.
- **C-11 Does hold count?** Timer freezes [ONHOLD], while "overall" time includes hold [SLA-FAQ]. These are probably different measures (due time vs reported time; inferred), but no page says so.
- **C-12 Move: erased vs preserved.** [DETAIL] says SLAs are erased and the ticket is new. [SLA-FAQ] and [RESO-CASES] keep measuring from original creation. Probably timer vs report (inferred).
- **C-13 Move in bulk.** [BULK]'s table says Move is bulk only, and the same article describes "mass move".
- **C-14 Dashboard names and filters.** [SLA-DASH] has Teams and "Adherence". [SLA-FAQ] has no Teams and says "Achieved". [SLA-DASH] says "seven" components while [STD-DASH] lists more items.
- **C-15 Field monitoring plan.** [PRICE] ticks Professional, while [WF] says Field Update is Enterprise only. The pricing row may mean something else (inferred).
- **C-16 Team templates.** [TEAMS-AUTO] says prebuilt team notifications cannot be edited. [NOTIF] says rule templates can be customized, with no team exception.
- **C-17 Bulk close.** [BULK] notes rules do not fire on "bulk" close, yet its table says Close is mass only. Whether mass close fires rules is unclear.
- **C-18 Template plans.** [TEMPLATES] says paid plans can customize. [PRICE] gives Express (paid) default templates only.
- **C-19 Agent control.** [ORG-FAQ] says controlling the center per user is not possible. [NC], [FEEDS] and [API-ENTITY-PREF] give a per-department agent switch. [NC]'s title promises customization.
- **C-20 Conditions.** [MACRO] says no conditions. [TEAMS-AUTO] says "use teams as a criterion while creating a macro".
- **C-21 Macro mass vs bulk.** [MACRO-FAQ] refers to macro "as a mass or bulk action". [BULK]'s table and [MACRO] cap at 50.
- **C-22 Macro log.** [MACRO-FAQ] says verify macros in action logs. The Mass Action log is described as "mass replies, comments, and IMs", with no macro mention.
- **C-23 Email reply vs alert.** [MACRO-FAQ] says macros send "an email reply" or "standardized response". [MACRO] says Alerts use an email template and lists no reply action.
- **C-24 Macro actions list.** [MACRO-USE] and mobile pages list email, tasks, field updates. [MACRO] adds custom functions and move department.
- **C-25 Macro count wording.** [PLAN-ENT] says "per department per module", while [MACRO] says Tickets only.
- **C-26 Assignment email.** Already recorded in the assignment inventory (Open question 15): [AUTO-FAQ] points to Department "Creating a new ticket", and [NOTIF] uses Agent "Assigning a ticket".
- **C-27 Team FAQ list.** [NOTIF-FAQ] lists 4 team events, and [NOTIF] lists 15.
- **C-28 SMS vendor name.** "Screen Magic" in [NOTIF], "SMS-Magic" in [SMS].
- **C-29 Workflow escalation claim.** [WF-FAQ] says workflows can "escalate based on response or resolution time thresholds", while workflows have no time-based trigger (workflow inventory §2).

## Could not confirm

**SLA**
1. Full `executeOn.events` enum, and how Private Thread, Comment and Agent Response map to it.
2. Default state of "first response only" and the created-time toggle in the UI.
3. Whether an escalation always sets Status to Escalated and `isEscalated` true, and what clears them.
4. Exact multi-contract tie-break, and how a ticket's SLA is shown when no target criteria match.
5. Which target wins inside one SLA when several match (first in order is inferred), and how global SLA order is used on the UI.
6. Whether a moved ticket fires the new department's "Ticket creation" SLA trigger or only update triggers.
7. Behaviour of running escalations and existing due dates when an SLA is edited, deactivated or deleted.
8. Manual reapply or "remove SLA" from a ticket: none found in UI docs or API.
9. Customer-facing credit balance screen (S-054); carry-forward and additional-usage UI.
10. Whether contract expiry or termination removes the SLA from open tickets.
11. Maximum holidays per list, and whether SLA target values have min and max.
12. The English wording of pricing rows.

**Notifications**
13. OS-level desktop or browser push for tickets: only "browser pop-up" reminders for activities and the "Pop-up notifications" pricing row were found. No settings article exists.
14. An agent-level screen for the department switch: the [NC] article's steps stop at opening the center, and the path to "Notification Preferences" is not given.
15. Agent per-event opt-out of email rule notifications: not documented; email rules appear admin-only (inferred).
16. Whether the actor receives their own notification (for example, self-assignment).
17. SMS on/off per rule vs email on/off: [SMS] has a blank placeholder where the section name should be.
18. Whether rules fire on API, import or macro changes; only bulk close is addressed.
19. Default template text for each rule, and whether rule templates may be shared between rules.
20. Daily limits on notification emails.
21. Values of `feedNotificationFilterPreference`.
22. iOS per-department settings.

**Macros**
23. Whether macros trigger workflows, SLA triggers, assignment or notification rules.
24. Whether a macro can be re-applied to the same ticket, and any undo.
25. Whether a macro appears for agents outside the availability list via mass action.
26. Action order except "move last", and partial-failure behaviour on a single ticket.
27. Blueprint strict-mode effect on macros. History events show macros revoking a blueprint or moving a state, but no setting is described.
28. Macro search, folders, favourites, reorder, clone, or keyboard shortcut.
29. Plan availability of the Move Department and Custom Function actions.
30. Macro use from the Help Center or Automation Studio.

## Sources

Article pages show Zoho's last-modified date in the article record. Key ones: [SLA] 2026-08-06, [SLA-FAQ] 2026-08-14, [NOTIF] 2026-08-06, [NOTIF-FAQ] 2026-10-23, [MACRO] 2026-08-06, [MACRO-FAQ] 2026-08-21, [SP] and [CONTRACT] 2026-10-18, [FEEDS] 2026-10-19.

[SLA]: https://help.zoho.com/portal/en/kb/desk/automation/escalate-sla/articles/understanding-and-working-with-slas
[SLA-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-sla-service-level-agreement
[SLA-DASH]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/dashboards/articles/sla-dashboard
[SP]: https://help.zoho.com/portal/en/kb/desk/automation/support-plans/articles/understanding-and-working-with-support-plans
[SP-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-support-plans
[SC-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-support-contract
[CONTRACT]: https://help.zoho.com/portal/en/kb/desk/automation/support-contract-schedules/articles/managing-support-contracts
[BH]: https://help.zoho.com/portal/en/kb/desk/organization-settings/company-settings/articles/setting-business-hours-and-holidays
[GLOSS]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/response-and-resolution-times/articles/response-and-resolution-times-glossary
[ONHOLD]: https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-status/articles/on-hold-state-use-cases-and-behavior
[ONHOLD-CONCEPT]: https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-status/articles/understanding-the-onhold-ticket-state
[STATUS]: https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-status/articles/customizing-ticket-statuses
[RESP-CASES]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/response-and-resolution-times/articles/response-time-cases-example-and-important-notes
[RESO-CASES]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/response-and-resolution-times/articles/resolution-time-cases-example-and-important-notes
[DETAIL]: https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/user-actions-in-the-ticket-detail-page
[BULK]: https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/performing-bulk-updates
[TKT-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/tickets/articles/faqs-working-on-tickets
[VIEWS]: https://help.zoho.com/portal/en/kb/desk/ticket-management/views-and-filters/articles/ticket-views-custom-list-archived-views
[MODES]: https://help.zoho.com/portal/en/kb/desk/ticket-management/work-modes/articles/ticket-work-modes
[HQ]: https://help.zoho.com/portal/en/kb/desk/ticket-management/views-and-filters/articles/headquarters-dashboard
[HC-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/help-center/articles/faqs-tickets-dashboard-in-help-center
[HC-ACCESS]: https://help.zoho.com/portal/en/kb/desk/support-channels/help-center/articles/managing-help-center-access-settings-and-permissions
[STD-DASH]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/dashboards/articles/standard-dashboards-in-desk
[STATIC]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/reports/articles/understanding-the-types-of-static-reports
[PREDEF]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/reports/articles/using-predefined-reports-in-zoho-desk
[AGENT-PERF]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/reports/articles/understanding-the-agent-performance-report
[FORMULAS]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/reports/articles/reporting-formulas
[RADAR-STATIC]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/radar/general/articles/static
[RADAR-ALERT]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/radar/general/articles/setting-up-exception-alerts-in-radar
[HIST]: https://help.zoho.com/portal/en/kb/desk/developer-space/rest-apis/articles/events-supported-in-get-ticket-history-api
[TEMPLATES]: https://help.zoho.com/portal/en/kb/desk/customization/templates/articles/creating-and-managing-email-templates
[TPL-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/customization/articles/faqs-email-template
[AS-BLOCKS]: https://help.zoho.com/portal/en/kb/desk/automation/automation-studio/articles/building-blocks-using-automation-studio
[WEBHOOK]: https://desk.zoho.com/support/WebhookDocument.do
[TEAMS-AUTO]: https://help.zoho.com/portal/en/kb/desk/automation/actions/articles/using-teams-in-automation
[AGENTS]: https://help.zoho.com/portal/en/kb/desk/user-management-and-security/agents-and-teams/articles/add-manage-desk-agents
[CLIQ]: https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/collaboration/articles/zoho-cliq-integration
[NOTIF]: https://help.zoho.com/portal/en/kb/desk/customization/notifications/articles/managing-notification-rules-triggers-in-zoho-desk
[NOTIF-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/customization/articles/faqs-notification-rules-and-triggers
[NC]: https://help.zoho.com/portal/en/kb/desk/productivity/feeds/articles/managing-notification-by-agents
[FEEDS]: https://help.zoho.com/portal/en/kb/desk/productivity/feeds/articles/feeds-the-new-way-to-collaborate
[ORG-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/organization-settings/articles/faqs-organization-setting
[SMS]: https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/agent-productivity/articles/configure-and-send-sms-text-notifications
[THREADS]: https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-replies/articles/public-and-private-threads-in-tickets
[EMAIL-SETUP]: https://help.zoho.com/portal/en/kb/desk/support-channels/email/articles/setting-up-your-email-channel
[AUDIT]: https://help.zoho.com/portal/en/kb/desk/data-administration/audit-log/articles/monitoring-audit-log-in-zoho-desk
[FOLLOW-TKT]: https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/following-commenting-and-viewing-original-email-headers-in-tickets
[FOLLOW-CUST]: https://help.zoho.com/portal/en/kb/desk/contacts-and-accounts/articles/following-customer-activities
[COLLISION]: https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/avoiding-agent-collision-over-tickets-in-zoho-desk
[ZIA-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/zia/articles/faqs-zia-s-capabilities
[APP-FIX]: https://help.zoho.com/portal/en/kb/desk/troubleshooting-tips/articles/fix-missing-zoho-desk-app-notifications
[ANDROID]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/android/setting-up-your-account/articles/enabling-notifications-in-android
[ANDROID-ACTIONS]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/android/ticket-management/articles/ticket-actions
[IOS-ACTIONS]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/ios/ticket-management/articles/ticket-actions-in-ios
[IOS-SET]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/ios/account-setup/articles/personalizing-desk-account-in-ios
[IOS-NOTIF]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/ios/ticket-management/articles/checking-your-notifications
[MACRO]: https://help.zoho.com/portal/en/kb/desk/automation/macros/articles/creating-and-using-macros-to-update-tickets
[MACRO-USE]: https://help.zoho.com/portal/en/kb/desk/automation/macros/articles/using-macros-in-tickets
[MACRO-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-macros-multiple-tickets
[PARENT-CHILD]: https://help.zoho.com/portal/en/kb/desk/ticket-management/linking-tickets/articles/understanding-parent-child-ticketing-system
[ASSIGN]: https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-using-workflows-assignment-rule
[API-DASH]: https://help.zoho.com/portal/en/kb/desk/developer-space/apidashboard/articles/working-with-api-dashboard
[COMM-MACRO]: https://help.zoho.com/portal/en/community/topic/automation-series-3-macro-vs-workflow-in-zoho-desk-1
[AUTO-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-automation
[WF]: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/workflow-automations
[WF-CHAT]: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/configure-workflow-notification-for-cliq-slack-ms-teams-and-chat
[WF-FAQ]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-workflow-rules
[PLAN-FREE]: https://help.zoho.com/portal/en/kb/desk/billing-and-subscriptions/articles/which-is-my-ideal-zoho-desk-plan-free-professional-or-enterprise
[PLAN-ENT]: https://help.zoho.com/portal/en/kb/desk/billing-and-subscriptions/articles/is-the-enterprise-plan-in-zoho-desk-ideal-for-us
[PRICE]: https://www.zoho.com/desk/pricing-comparison.html
[API]: https://desk.zoho.com/DeskAPIDocument
[API-SLA]: https://desk.zoho.com/DeskAPIDocument#SLA
[API-SLA-CREATE]: https://desk.zoho.com/DeskAPIDocument#SLA_CreateSLA
[API-SLA-GET]: https://desk.zoho.com/DeskAPIDocument#SLA_GetSLA
[API-SLA-CRIT]: https://desk.zoho.com/DeskAPIDocument#SLA_GetSLACriteriaFields
[API-SLA-TARGET]: https://desk.zoho.com/DeskAPIDocument#SLA_CreateSLATarget
[API-SLA-LIST]: https://desk.zoho.com/DeskAPIDocument#SLA_GetSLAs
[API-SLA-REORDER]: https://desk.zoho.com/DeskAPIDocument#SLA_ReorderSLAs
[API-SLA-ESC]: https://desk.zoho.com/DeskAPIDocument#SLA_UpdateSLAEscalationStatus
[API-SLA-REPORT]: https://desk.zoho.com/DeskAPIDocument#StaticReports_GetSLAStaticReport
[API-ACC-SLA]: https://desk.zoho.com/DeskAPIDocument#Accounts_ListaccountSLAs
[API-ACC-SLA-SET]: https://desk.zoho.com/DeskAPIDocument#Accounts_AssociateordissociateSLAfromaccount
[API-SP]: https://desk.zoho.com/DeskAPIDocument#SupportPlan
[API-CONTRACT]: https://desk.zoho.com/DeskAPIDocument#Contracts
[API-CONTRACT-CREATE]: https://desk.zoho.com/DeskAPIDocument#Contracts_CreateContract
[API-TICKET]: https://desk.zoho.com/DeskAPIDocument#Tickets
[API-UPDATE]: https://desk.zoho.com/DeskAPIDocument#Tickets_UpdateTicket
[API-MOVE]: https://desk.zoho.com/DeskAPIDocument#Tickets_MoveTicket
[API-METRICS]: https://desk.zoho.com/DeskAPIDocument#Tickets_GetTicketMetrics
[API-HISTORY]: https://desk.zoho.com/DeskAPIDocument#Tickets_GetTicketHistory
[API-COUNTS]: https://desk.zoho.com/DeskAPIDocument#Tickets
[API-COUNTFEAT]: https://desk.zoho.com/DeskAPIDocument#AutomationFeatureCount_GetAutomationFeatureCount
[API-RENDER]: https://desk.zoho.com/DeskAPIDocument#EmailTemplates_RenderTemplate
[API-TEMPLATES]: https://desk.zoho.com/DeskAPIDocument#EmailTemplates
[API-FOLDERS]: https://desk.zoho.com/DeskAPIDocument#TemplateFolders
[API-ENTITY-PREF]: https://desk.zoho.com/DeskAPIDocument#Agents_GetMyEntityPreferences
[API-MYPREF]: https://desk.zoho.com/DeskAPIDocument#Agents_GetMyPreferences
[API-CHANNEL]: https://desk.zoho.com/DeskAPIDocument#AgentChannelPreference_Getmailphoneandchatpreferenceofcurrentagent
[API-CREDIT]: https://desk.zoho.com/DeskAPIDocument#CreditAlert
[API-PROFILES]: https://desk.zoho.com/DeskAPIDocument#Profiles_Getprofile
