# Zoho Desk Workflow Rules: Inventory from Official Docs

Compiled 11 Oct 2026 from official Zoho sources only (help.zoho.com Desk KB and FAQs, the desk.zoho.com API and webhook docs, the zoho.com/desk pricing comparison, the zoho.com/desk extensions guide, and a Zoho Desk User Education community post). No login was used.

**Conventions**
- **(inferred)** means a conclusion drawn from the absence of documentation or from a neighbouring feature. Zoho does not state it.
- **NOT DOCUMENTED** means no official source covers it.
- **CONFLICT** means official sources disagree.

## Source key

| Key | URL |
|---|---|
| WR | https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/workflow-automations ("Creating Workflow Rules") |
| WR-OLD | https://help.zoho.com/portal/en/kb/desk/for-administrators/help-desk-automation/articles/workflow-automations (older copy, same content) |
| FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-workflow-rules |
| CAG | https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/custom-actions-gallery |
| CAG-FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/custom-actions-gallery-faqs |
| CF-FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-custom-function |
| CHAT | https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/configure-workflow-notification-for-cliq-slack-ms-teams-and-chat |
| CHAT-FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-workflow-notification-for-zoho-cliq-slack-ms-teams-and-google-chat |
| ZIA | https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/ai-powered-workflow-automation-with-zia-actions |
| HR | https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/configuring-automation-rules-for-happiness-ratings |
| WH-FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faq-webhooks |
| WH-DOC | https://desk.zoho.com/support/WebhookDocument.do |
| SUP-FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-supervisor-rules-or-time-based-automations |
| AUTO-FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-automation |
| AS-FAQ | https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-automation-studio |
| ASSIGN | https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-using-workflows-assignment-rule |
| AUDIT | https://help.zoho.com/portal/en/kb/desk/data-administration/audit-log/articles/monitoring-audit-log-in-zoho-desk |
| AUDIT-POST | https://help.zoho.com/portal/en/community/topic/audit-log-detailed-view-and-export-for-better-tracking (posted by Zoho Desk User Education) |
| API | https://desk.zoho.com/DeskAPIDocument (section names given per item) |
| PRICE | https://www.zoho.com/desk/pricing-comparison.html (served in Arabic on this network; columns are Free / Express / Standard / Professional / Enterprise) |
| EXT | https://www.zoho.com/desk/extensions/guide/use-custom-actions.html |
| KB-LIST | https://help.zoho.com/portal/en/kb/desk/automation/workflows and https://help.zoho.com/portal/en/kb/desk/faqs/automation |

---

## 1. Rule basics

- **Components:** Workflow Rules, Workflow Alerts, Workflow Tasks and Workflow Field Updates. Custom Functions and Custom Actions are additional action types. — WR
- **Setup path:**
  - WR gives Setup > Automation > Workflows, then **Create Rule**.
  - CHAT gives "Setup > Automation > Workflow Rules > Rules".
  - FAQ #37 gives "Setup > Automations > Workflows > Rules".
  - ZIA calls the button **Create New Rule**.
  - Sources: WR, CHAT, FAQ, ZIA
- **Modules a rule can be written on:**
  - FAQ #3 lists Tickets, Calls, Products, Accounts, Contacts, Events, Tasks, Time Entry and Custom Modules.
  - The `automationFeatureCount` API accepts module values `tickets, contacts, contracts, accounts, tasks, products, timeEntry` for workflows. Its generic module list also includes `events, calls, customModule`. This means **Contracts** is also a workflow module.
  - Sources: FAQ, API (AutomationFeatureCount > Get Automation Feature Count)
- **Actions available per module:**
  - Tickets get every action type.
  - Calls, Products, Accounts, Contacts, Events and Tasks get Alerts and Custom Functions only.
  - Time Entry gets Custom Functions only.
  - Custom Modules get Alerts, Field Updates (the "Update Record" action) and Custom Functions.
  - Sources: FAQ #3, FAQ #9
- **Tasks and Field Updates are Tickets-only:** "Workflow tasks and field updates work only for Tickets. Other modules support only alerts and custom functions." — FAQ #9, WR
- **Department scope:**
  - Rules are created per module **per department**.
  - To apply the same rule in several departments, you create it separately in each one.
  - The rule limits apply independently to each department.
  - There is no "all departments" rule. — FAQ #8
  - The API count call requires `departmentId` and `module` for workflows. — API (Get Automation Feature Count)
- **Basic Information fields:**
  - **Module** (dropdown)
  - **Rule Name**
  - **Active** (checkbox)
  - **Description**
  - Then **Next**.
  - Sources: WR, CAG-FAQ
- **Active/Inactive:**
  - Unchecking Active keeps the configuration and allows reactivation. — FAQ #36
  - A deactivated rule stops applying to existing and new tickets, including later updates. Actions already performed are not reverted (example: an email already sent stays sent). — FAQ #23
- **Deactivate and activate from the list:**
  - Hover over the rule, click the **Deactivate** icon, and the rule moves out of Active Workflows immediately.
  - It is reactivated from the **Inactive Rules List** (FAQ: "Inactive tab") with the **Activate** icon.
  - Sources: WR, FAQ #37
- **Delete:**
  - Hover over the rule, click the **Delete** icon, then **OK**.
  - Deletion is permanent and cannot be undone. — WR, FAQ #37
- **Counts:**
  - The `automationFeatureCount` API returns `maxTotalCount`, `maxActiveCount`, `usedTotalCount` and `usedActiveCount`.
  - The sample shows workflows with max total 40 and max active 20.
  - So there are separate caps for total rules and active rules (inferred from the API sample; the help article only gives one "per module per department" number).
  - Source: API (AutomationFeatureCount)
- **Cloning a rule:** NOT DOCUMENTED. No clone option is mentioned in WR or FAQ.
- **Rule ordering:**
  - NOT DOCUMENTED for workflows. No reorder feature is mentioned.
  - All matching rules for the same module, department and event run, and evaluation "does not stop at the first match" — FAQ #34.
  - The order in which matching workflow rules run relative to each other is NOT DOCUMENTED. Contrast: Direct Assignment rules have a `reorder` API and first-match behaviour — API (`POST api/v1/directAssignmentRules/reorder`), ASSIGN.
- **Rule list page:**
  - Documented elements: Active and Inactive lists or tabs, plus Edit, Deactivate/Activate and Delete icons shown on hover. — WR, FAQ #37
  - Columns, filters, search and the per-module dropdown on the list page are NOT DOCUMENTED. A department selector is implied by "choose a department, Create Rule" — FAQ #28.
- **Editing an existing rule:** Use the Edit icon on the rule, which opens the Edit Workflow page. Disabled actions show an alert there. — WR, CAG
- **Downgrade or expiry:** If the subscription is downgraded or expires, rules are disabled and must be re-enabled manually after renewal. — WR

## 2. Triggers ("Execute On")

These are the exact labels used in WR and WR-OLD. A rule selects **one** Execute On event.

- **Create:** "when records are created". — WR
- **Edit:**
  - "when existing records are modified".
  - Fires on any change to any field. — WR, FAQ #12
- **Field Update:**
  - "when values of specified fields change".
  - You pick fields, then use the **All/Any** link to require that all or any of the selected fields changed.
  - **Enterprise edition only.** — WR, FAQ #12
- **Customer Reply:** "when a new customer reply is received". Tickets only. — WR
- **Agent Response:** "when agents send a new reply to tickets". Tickets only. — WR
- **Private Thread:**
  - Fires on sent and received private email threads.
  - Options: incoming, outgoing, or both. Tickets only.
  - Sources: WR, FAQ #13
- **Happiness Ratings:**
  - Options: **All Ratings** or a specific rating.
  - Rating values seen in the API criteria are Good, Bad and Okay.
  - Tickets only.
  - Sources: WR, FAQ #14, HR, API (Get Criteria Fields for Skill: Happiness Rating values)
- **Delete:**
  - "when existing records are deleted".
  - CONFLICT: the WR intro says "deleting tickets", but the Tickets-only note in Part 2 omits Delete. — WR, FAQ #24
- **"Create or Edit" / "created/edited":**
  - The WR intro mentions "created/edited", but it is not a separate listed option. — WR-OLD
  - The ASSIGN example says "on create or update" — ASSIGN, FAQ #27. Treat as wording only (inferred).
- **Time-based triggers (date field, before/after offsets, recurrence):**
  - NOT available in workflow rules. "Do rules execute immediately? Yes. There is no built-in delay or scheduling." — FAQ #35
  - Time-based behaviour comes from three other features:
    - **Supervisor Rules:** hourly, with "Hours since/to …" criteria. — SUP-FAQ
    - **Schedules:** custom functions run on a recurrence. — CF-FAQ
    - **Automation Studio:** Delay block. — AS-FAQ
  - CONFLICT: the zoho.com/desk/workflows.html marketing page describes "time-based ticketing workflows". That refers to Supervise rules (inferred).
- **Other ticket events (comment added, attachment added, status change as a distinct event):**
  - NOT documented as Execute On options.
  - These events exist only as **webhook** events (Ticket_Comment_Add, Ticket_Attachment_Add and others) — WH-DOC — and as Automation Studio events ("Comment Added") — AS-FAQ.
- **"Execute only once" / "repeat on every update" options:** NOT DOCUMENTED for Desk. That option is a CRM concept; nothing equivalent appears in the Desk docs.
- **"Evaluate on" options:** NOT DOCUMENTED.
- **Triggers usable for ticket assignment through a workflow:** Create, Edit or Customer Reply. — ASSIGN

## 3. Criteria

- **Criteria are optional.** Without criteria, the rule fires for every record matching the Execute On event (for example, acknowledging every new ticket). — WR, FAQ #15
- **Maximum 25 criteria per rule.** — WR, FAQ #16
- **AND/OR combination:**
  - Mixed AND/OR with grouping is supported. FAQ examples:
    - `(Department = "Billing" AND Priority = "High") OR (Department = "Technical" AND Category = "Bug")`
    - `category is "Refund" AND (region is "EU" OR amount > $500)`
  - Sources: FAQ #16, FAQ #17
  - Pattern-editing UI (numbered pattern like `(1and2)`) is NOT DOCUMENTED for the workflow UI. The API uses `pattern: "(1)"` and `criteriaPattern` with numbered positions in direct assignment and webhook criteria (inferred to be the same engine). — API (Direct Assignment), WH-DOC
- **Tags as criteria:**
  - Operators: **is** and **isn't**.
  - Up to 20 comma-separated tags per condition.
  - Each tag must be 3–50 characters, with no special characters.
  - Multiple spaces collapse to one, matching is case-insensitive, and duplicates are removed.
  - "Automation cannot add tags to tickets". CONFLICT with the CAG **Add Tags** action. That statement probably predates the gallery (inferred).
  - Source: AUTO-FAQ #6
- **Operators per data type:**
  - The workflow docs do not list operators. Other Desk rule APIs on the same criteria engine (inferred) give:
    - **text, picklist and lookup:** is, isn't, starts with, contains, doesn't contain, ends with, is empty, is not empty
    - **date:** is, isn't, is after, is before, is empty, is not empty
    - **dateTime:** the date operators plus between and not between
    - **integer and currency:** =, <>, <, <=, >, >=, is empty, is not empty
    - **boolean:** is
  - Source: API (Layout Rules / Validation Rules "condition" description)
- **Additional operators seen in the Desk criteria-field APIs (inferred to apply in workflows):**
  - **Multi-select:** contain all of, contain any of, contain none of
  - **Happiness Rating:** is / isn't (Good, Bad, Okay), is received, is not received, link provided, link not provided
  - **Status class:** is OPEN, is ON HOLD, is CLOSED
  - **Recent Comment:** contains one of the following words, contains none of the following words, contains the string, does not contain the string, has @ mentions of
  - **Recent Comment Type:** is Public / Private
  - **Team:** has agents
  - Source: API (Get Criteria Fields for Skill in a Department; Direct Assignment criteriaFields)
- **Business hours and holiday criteria:**
  - The API exposes an **"Execution Time"** criteria field (type `businesshour`) with operators **during business hours of**, **outside business hours of**, **on a holiday of** and **not a holiday of**.
  - It is documented on the Skills criteria API. Availability in the workflow criteria UI is inferred.
  - Source: API (Get Criteria Fields for Skill in a Department)
- **Sample Ticket criteria fields (Skills criteria API, Tickets):**
  - Account Name, Contact Name, Email, Phone, Subject, Description, Status
  - Case Owner, Created By, Modified By
  - Created Time, Case On Hold Time, Case Closed Time, Modified Time
  - Request Id, To Address, Thread Count, Comment Count, Happiness Rating, Team, Due Date, Tags, Priority, Mode
  - Is Overdue, Is Escalated, Is Response Overdue
  - Resolution, Time to Respond, Skill/Skills, Execution Time, Recent Comment Type, Recent Comment
  - Related modules exposed: Contacts and Accounts (criteria sections). Workflow-specific field lists are inferred.
  - Source: API (Get Criteria Fields for Skill in a Department; Direct Assignment criteriaFields shows a "Contacts" section)
- **"is changed" / "changed from" / "changed to" operators:**
  - NOT DOCUMENTED.
  - Change detection is done only through the **Field Update** trigger with All/Any fields. — FAQ #12
- **Custom field criteria references:** `GET /api/v1/organizationFields/{field_id}/criteriaReferences?featureType=WorkFlow` lists the workflow rules that use a custom field as criteria. Useful for "field in use" checks. — API (Fields > Get organization custom fields criteria references)

## 4. Actions

### 4.1 General

- **Action types:**
  - Alerts, Tasks, Field Updates, Custom Functions
  - Custom Actions Gallery actions
  - Chat notifications (Slack, Teams, Google Chat, Cliq)
  - Zia Actions
  - Update Record (custom modules)
  - Skills actions (Add Skills, Remove Skills, Recalculate Skills, Reassign Ticket Based on skills)
  - Change Layout
  - Sources: WR, FAQ #3, CAG, CHAT, ZIA, EXT
- **Timing:**
  - All workflow actions are **instant**, and run immediately when the rule executes.
  - There are **no time-based or scheduled actions** in workflow rules.
  - Sources: WR, FAQ #35, SUP-FAQ
- **Limits per rule:**
  - 10 alerts, 10 tasks and 10 field updates.
  - Custom functions have "no stated limit".
  - Up to **5 custom actions** (gallery).
  - Zia: one of each Zia action type.
  - Update Record: 1 per rule.
  - Sources: WR, FAQ #6, CAG, ZIA
- **Actions are reusable library entities:**
  - Under Actions, **Add > New** creates an action. **Add > Existing** associates an existing alert, task, field update or custom function with another rule.
  - One custom function can be attached to many rules.
  - Sources: WR, FAQ #33, CF-FAQ #5, #10
- **Separate library tabs:**
  - The audit log lists separate entities: Workflow, Workflow Alerts, Field Updates, Tasks and Custom Functions. — AUDIT
  - The API count call supports `automationAlerts`, `fieldUpdates`, `automationTasks` and `customFunctions` features. — API (Get Automation Feature Count)
  - The exact tab names in Setup are NOT DOCUMENTED.
- **Association count and delete-in-use behaviour:**
  - NOT DOCUMENTED for alerts, tasks, field updates and functions.
  - For gallery actions, deleting an action whose output feeds another action shows a dependency alert that must be resolved first. — CAG-FAQ
- **Removing an action from a rule:** Use the Remove icon, then confirm with **Delete**. — CAG-FAQ
- **Failed actions do not block** other actions in the same rule. — CAG-FAQ

### 4.2 Email alerts (Workflow Alerts)

- **Fields:**
  - **Name**
  - **Email Template** (dropdown)
  - Recipients picked by **Groups**, **Roles**, **Roles and Subordinates** or **Agents**
  - Checkboxes: **Record Owner**, **Record Creator**, **Notify Contact** (Tickets and Contacts only; notifies the requestor)
  - **Additional Recipients** (comma-separated emails)
  - Then **Save**.
  - Sources: WR, SUP-FAQ (same alert form, where the team option is called "team")
- **From address for alerts:** NOT DOCUMENTED. Use the gallery's **Send Email Reply** to choose a From Address. — CAG
- **Deleted template:** If an alert's email template is deleted, the alert **fails silently**, with no admin notification by default. — FAQ #38
- **Happiness rating link:** The placeholder `${Cases.Customer Happiness Rating}` must be in the template to send the rating link. — HR

### 4.3 Workflow Tasks (Tickets only)

- **Fields:** **Subject**, **Status**, **Priority**, **Assignee** (owner), **Due Date** "and others". — WR, FAQ #20
- **"Assign ticket owner as task owner":**
  - The task goes to the ticket owner. If the ticket is unassigned when the rule fires, the explicit assignee is used.
  - Source: FAQ #20. The WR wording is ambiguous.
- **Supervisor-rule task form (comparable):**
  - Fields: subject, status, priority, owner, a due date calculated from the trigger time, and description.
  - The ticket-owner option needs a fallback agent.
  - Source: SUP-FAQ
- **Reminder and due-date offset units:** NOT DOCUMENTED for workflow tasks.

### 4.4 Workflow Field Updates (Tickets only, plus custom modules)

- **Dialog:** "**Create Assignment Value**".
  - Fields: **Name**, **Description** (optional), **Assignment Values** (the field to update), and the new value.
  - Sources: WR, FAQ #21
- **Custom fields can be updated.** — FAQ #29
- **Clearing a value (empty) and the list of eligible fields:** NOT DOCUMENTED.
- **Update Record** (custom modules, **Enterprise only**):
  - Execute On must be Create, Edit or Field Update.
  - **Record ID** comes from placeholders and must be in the same module.
  - **Module** is the related custom module.
  - **Assignment Value** is the field and value.
  - Only one-to-one mapped related modules can be updated. Default modules (Tickets, Tasks, Calls, Contacts…) cannot.
  - **One action per rule.**
  - Static and dynamic values can be joined with "_".
  - Changes are logged in **Custom Module History**.
  - Source: WR

### 4.5 Custom Functions (Deluge)

- **Where created:**
  - **Setup > Developer Space > Functions > New Function**.
  - **Basic Information:** Name, Description, Module. Functions are module-specific.
  - **Argument Mapping:** Method Name, plus arguments added with **+**. Each argument has a name and a mapped value from the record's fields.
  - Then the Deluge Script Editor, and **Save** or **Save & Execute Script**.
  - Source: CF-FAQ #2, #3
- **Attaching to a rule:** Actions > **Add +** > **Custom Function**, then choose an existing function or create one. — CF-FAQ #5
- **Arguments:**
  - Values reach the script only through mapping. "Without mapping, the function cannot access record context."
  - The argument count limit and data types are NOT DOCUMENTED.
  - Source: CF-FAQ #3
- **Zia Deluge Assistant Bot:**
  - Generates scripts inside the editor.
  - Enable it at Setup > Zia > Generative AI > Feature Preferences.
  - **Enterprise only** per PRICE.
  - Sources: CF-FAQ #4, PRICE
- **Other uses of functions:**
  - Custom Buttons: Setup > Customization > Buttons; Tickets detail page only.
  - **Schedules:** Setup > Automation > Schedules; repeat options Never, Every Hour, Every Day, Every Week, Every Month, Every Year, or Custom.
  - Source: CF-FAQ #6, #7
- **Schedule limits:**
  - Start date within one year.
  - 10,000 lines of execution and 5 minutes runtime per run.
  - 250 active schedules per account, 10 per department.
  - **Run Now** twice per day per schedule.
  - Source: CF-FAQ #7
- **Workflow function runtime, statement and API limits:** NOT DOCUMENTED for Desk. CRM and Deluge pages give other numbers; do not reuse them.
- **External calls:** Custom functions can "call external APIs" (Deluge `invokeurl`). Desk-specific connection docs were NOT FOUND. — FAQ #5
- **Failures:**
  - Logged in **Ticket History** with rule name, action name, status and reason.
  - Causes: deleted or deactivated agent or team, insufficient permission of the function's creator, or a deleted placeholder field (which disables the function).
  - Source: CF-FAQ #9
- **Delayed actions:** FAQ #35 suggests custom functions "with time logic" as a workaround. — FAQ

### 4.6 Webhooks

- **Webhooks are NOT a workflow action in Desk:**
  - They are standalone event subscriptions at **Setup > Developer Space > Webhooks**. WH-FAQ #15 also mentions Setup > Automation > Webhooks.
  - They "run in parallel with workflow rules and neither overrides the other."
  - Source: WH-FAQ #2, #20
- **Webhook fields:**
  - **Name**
  - **URL to Notify**
  - **Description**
  - **Source ID** (a UUID, used as ignoreSourceId)
  - **Choose Event** (module, event, department); **+** adds more events
  - **Test Run**, then Save
  - **Method is always POST.** Custom headers, query parameters, body templates and auth (basic, OAuth, API key) are **not supported**.
  - Source: WH-FAQ
- **Ways to call HTTP from a workflow:**
  - A Custom Function (Deluge `invokeurl`)
  - **Send Cliq Notification** (Cliq incoming webhook URL)
  - **Extension Custom Actions** (Sigma)
  - Sources: CF-FAQ, CAG, EXT
- **Webhook API events:**
  - Ticket_Add, Ticket_Update (with `fields` up to 20 and `includePrevState`), Ticket_Delete, Ticket_Thread_Add (direction in/out), Ticket_Comment_Add/Update, Ticket_Attachment_Add/Update, Ticket_Approval_Add/Update
  - Contact, Account, Task, Call, Event and TimeEntry Add/Update/Delete; Agent; Department; IM; Article and KB events
  - **`includeEventsFrom: ["AUTOMATION"]`** includes events generated by Supervise Rules (time-based actions), Tickets only.
  - Source: WH-DOC
- **Delivery:**
  - The endpoint must return 200 within **5 seconds**, otherwise the delivery counts as failed.
  - **410** removes the subscription.
  - JWT is sent in the `X-ZDesk-JWT` header, signed RSA-SHA256.
  - Retry policy is NOT DOCUMENTED.
  - Source: WH-DOC

### 4.7 Custom Actions Gallery (Tickets only)

- **Permission:** Support Administrator.
- **Placeholders:** Click `{}` to open the "Select Placeholders" pane. Record ID is auto-mapped to the ticket ID. One action's output can feed later actions (for example `${trigger_mail.content}`).
- Sources: CAG, CAG-FAQ
- **Assign Ticket:**
  - Fields: Name; Assignee = **Agent**, **Team** or **Agent in a Team**; then the agent or team name.
  - Skipped if the assignee placeholder is null. — CAG
- **Add Comment:**
  - Fields: Name, Module, **Make Comment Public** toggle, Comment.
  - Runs with empty values if a placeholder is null. — CAG
- **Send Email Reply:**
  - Fields: Name, **From Address**, **To Address**, **Ticket Reply**.
  - Do not use the department support address as To, to avoid loops. — CAG
- **Add Tags / Remove Tags:**
  - Tags are alphanumeric only.
  - Null values are stripped, and the action is skipped if the list ends up empty. — CAG
- **Add Followers:** Skipped if empty after nulls are removed. — CAG
- **Mark Ticket as Spam:** Optional checkbox "**Mark associated contact as spam**". — CAG
- **Share Ticket:**
  - Fields: **Department Name** and **Permission Level** (**Full Access**, **Restricted Access**, **Read-only Access**).
  - Each action shares with one department; up to 5 Share Ticket actions per rule.
  - Sources: CAG, CAG-FAQ
- **Send Cliq Notification:** Fields are **Incoming Webhook URL** and **Notification Message**; Cliq receives plain text. — CAG
- **Reply via Instant Messaging / Notify via Instant Messaging:**
  - Fields: **IM Account**, **Template** (from Setup > Channels > Instant Messaging > Canned Messages).
  - Channels: WhatsApp, Telegram, LINE, WeChat.
  - Sources: CAG, CAG-FAQ
- **Extension Custom Actions:**
  - Built in Sigma and shown in the gallery after the extension is installed.
  - Results appear in the ticket's History tab.
  - Sources: CAG, EXT
- **Other ticket actions named in FAQ #3:**
  - Add Skills, Remove Skills, Recalculate Skills, Reassign Ticket Based on (skills)
  - **Change Layout** (example in FAQ #26)
  - Source: FAQ #3, #26
- **Failure and disabled states:**
  - **Deleted or deactivated assignee or follower:** the action fails.
  - **Creator lacks permission:** affects **all actions in the rule**.
  - **Deleted custom-field placeholder** in Send Email Reply or Add Comment: the action is **disabled**, with an alert on the Edit Workflow page and in Ticket History. Re-enable it by removing the placeholder and saving.
  - Sources: CAG, CAG-FAQ

### 4.8 Chat notifications (Slack / Microsoft Teams / Google Chat / Zoho Cliq)

- **"Send notification via"** appears only after the chat app is integrated with Desk. — CHAT
- **Modules:**
  - Tickets, Tasks, Events, Calls, Accounts, Contacts and Products have auto-filled body templates.
  - Custom modules start with an empty body.
  - Source: CHAT
- **Fields by app:**
  - **Slack:** Workspace, Slack Channels, Notification Header, Notification Sub Heading, Notification Body.
  - **Teams and Google Chat:** the department's channel or space is prefilled.
  - **Cliq:** a "Send Notification to Cliq" tab with channel selection.
  - Placeholders use the form `${tickets.$subject}`, with a space required before each placeholder.
  - Source: CHAT
- **Null placeholder:** The message is still sent, with a blank in place of the value. — CHAT-FAQ #7

### 4.9 Zia Actions (Enterprise, Tickets only)

- **Action types:** Field extraction (max 5 fields), Field prediction, Generate content, Auto email reply.
- **Per rule:** one of each type.
- **Daily cap:** **1,000 executions per org per day** in total.
- **Language and data centres:** English only; US, CA, EU, IN and AU data centres.
- **Prerequisite:** Setup > Zia > Generative AI > Zia Actions.
- **Auto email reply:** Create trigger only, Email channel only.
- Source: ZIA

## 5. Execution mechanics and limits

- **Execution order:** three official sources disagree (CONFLICT).
  - **FAQ #19:** Assignment Rules → Workflow Rules → SLAs → Round Robin → Blueprint.
  - **ASSIGN:** Direct assignment → Workflows → SLA → Round robin (sequential, load balancing, skill-based) → Blueprints → Notifications.
  - **AUTO-FAQ #7:** Skills-based assignment → Direct assignment → Workflow rules → SLA → Round-robin → Blueprint → Supervise (periodic) → Macros (manual).
  - **AS-FAQ:** Direct Assignment → Workflows → SLAs → Round Robin → Blueprints → Notification Rules → **Automation Studio last** (asynchronous; can override earlier changes).
  - Sources: FAQ, ASSIGN, AUTO-FAQ, AS-FAQ
- **Practical consequences:**
  - An assignment rule may change the owner before a workflow alert's "Record Owner" is evaluated.
  - Workflow field updates can affect SLA calculation.
  - Blueprint is evaluated after workflow changes.
  - If a workflow has already set the owner, round robin will not reassign the ticket.
  - Sources: FAQ #19, ASSIGN
- **Multiple matching rules:** All rules matching the same module, department and event run; there is no first-match stop. — FAQ #34
- **Loops and recursion:**
  - "Possibly." Edit or Field Update rules can re-trigger themselves when an action changes a field the rule watches.
  - No built-in loop guard is documented. The advice is to test in a sandbox.
  - Source: FAQ #18
- **Firing on API updates, imports, bulk edits or macros:**
  - NOT DOCUMENTED.
  - The Desk REST API exposes no `trigger` or skip-workflow parameter (inferred from a search of the API doc).
  - For webhooks, an `ignoreSourceId` and `sourceId` header pair stops your own API calls from triggering the webhook. — WH-DOC
- **Time-based actions queue:**
  - Not applicable to workflow rules.
  - Supervisor rules run **once every hour** and only on tickets with a **customer response in the past 30 days**.
  - They accept whole-number hours only and use Business hours or Calendar hours.
  - At most 1 alert, 1 task and 1 field update per supervisor rule, with no custom functions.
  - Tickets only.
  - Sources: SUP-FAQ, AUTO-FAQ #4
- **Record no longer matches before a scheduled action runs:** Not applicable (no scheduled workflow actions). NOT DOCUMENTED.
- **Per-day limits:**
  - Email alert, custom function and webhook per-day limits are NOT DOCUMENTED.
  - Known numeric caps: Zia actions 1,000 per day; audit log exports 50 per day; Schedules Run Now 2 per day.
  - API credits per edition (PRICE): Free 5000; Express 25000 + users×100; Standard 50000 + users×250; Professional 75000 + users×500; Enterprise 100000 + users×1000.
  - Sources: ZIA, AUDIT, CF-FAQ, PRICE
- **Deactivated agents:** An API schedules reassignment of "tickets, tasks, and automations" owned by a deleted or deactivated agent. — API (Agents > reassignment, 500 credits/call)

## 6. Audit and history

- **Ticket History:**
  - Workflow and custom-action failures are logged with **Rule Name, Action Name, Status and Reason**.
  - Disabled actions are also flagged there.
  - Sources: CAG, CF-FAQ #9
- **Ticket History API filter:**
  - `GET api/v1/tickets/{ticket_id}/History?eventFilter=WorkflowHistory`.
  - Other filter values include SuperviseHistory, MacroHistory, AssignmentRuleHistory, NotificationRuleHistory, SLAHistory and BlueprintHistory.
  - Up to 50 events per page, 3 credits per call.
  - Exact UI wording such as "Updated by Workflow …" is NOT DOCUMENTED.
  - Source: API (Tickets > Get Ticket History)
- **Custom-module Update Record changes** go to Custom Module History. — WR
- **Extension actions:** Results appear in the ticket's **History** tab. — EXT
- **Audit Log:**
  - Path: Setup > Privacy and Security > Audit Log.
  - Workflow-related entities: **Workflow, Workflow Alerts, Field Updates, Tasks, Custom Functions, Supervisor Rules, Schedules, ActionMapping**.
  - Columns: date and time, details, user, IP address, department, entity, type of action (added, edited, deleted), action name, sub-action.
  - The detail view shows old and new values for modules and rules.
  - Filters: date (Today, last 7 days, custom), user, department, entity, action.
  - Retention: at least 2 years.
  - CSV export: maximum 60-day range, 50 exports per day, one at a time, with an email when finished.
  - Admin profiles only.
  - Sources: AUDIT, AUDIT-POST
- **Failure notifications to admins:** None by default. The deleted-template case fails silently. — FAQ #38
- **Execution logs, usage report or per-rule run counts:** NOT DOCUMENTED.

## 7. Permissions

- **Profile permission:**
  - Called "Helpdesk Automation" in WR and "Help Desk Automation" in ASSIGN, CHAT-FAQ and SUP-FAQ.
  - The API profile attribute is `automation`: "Permission to manage the automation features (like Workflows, Macros etc.) under setup."
  - Sources: WR, ASSIGN, API (Profiles > permissions)
- **Custom Actions Gallery and Happiness-rating automations:** Require the **Support Administrator** permission. — CAG, HR
- **Insufficient permission of the action creator** makes the rule's actions fail. — CAG
- **Webhooks:** Need the profile **Webhook** permission (API attribute `webhooks`), set at Setup > Users and Control > Permissions > Profiles. — WH-DOC, API
- **Custom buttons:** Need the **Button permission** under Administrative Permissions for non-admin profiles. — CF-FAQ #6
- **Department-level permission scoping:** NOT DOCUMENTED. Rules are department-scoped (§1).
- **Automation Studio:** Administrators only. — AS-FAQ

## 8. API

- **Public workflow-rule CRUD endpoints:**
  - None in DeskAPIDocument (inferred from a full-text search: there is no `/workflows` or `/workflowRules` endpoint).
  - Contrast: `directAssignmentRules`, `layoutRules` and `validationRules` do have CRUD endpoints. — API
- **`GET /api/v1/automationFeatureCount`:**
  - Query parameters: `feature` (businesshours, holidaylist, Skills, SkillType, workflows, blueprints, automationAlerts, fieldUpdates, automationTasks, customFunctions), `module` and `departmentId`. Module and department are mandatory for workflows.
  - Returns maxTotalCount, maxActiveCount, usedTotalCount and usedActiveCount.
  - Scope: `Desk.automations.READ` and `Desk.basic.READ`. Cost: 50 credits per call.
  - Source: API
- **`POST /api/v1/actions/{id}/execute`:**
  - Runs an action with `entityIds`, `moduleId`, `executionType` (SYNC or ASYNC) and `actionParamMappings`.
  - The response includes `skippedFieldUpdates`.
  - Scope: `Desk.settings.CREATE`. Cost: 1 credit per record.
  - Source: API (Actions > Execute Action)
- **`GET /api/v1/organizationFields/{field_id}/criteriaReferences?featureType=WorkFlow`:** Lists the rules that reference a field. Scope: `Desk.fields.READ`. — API
- **`GET api/v1/tickets/{ticket_id}/History?eventFilter=WorkflowHistory`:** Scope: `Desk.tickets.READ`. — API
- **`GET /api/v1/businessHours/{id}/relatedRules` and `GET /api/v1/skills/{id}/relatedRules`:** Return rules with `ruleType` (SUPERVISE, SLA, BLUEPRINT…). Scope: `Desk.automations.READ`. — API
- **Webhooks:**
  - `GET/POST /api/v1/webhooks`
  - `GET/PATCH/DELETE /api/v1/webhooks/{id}`
  - Scopes: `Desk.webhooks.READ`, `.CREATE`, `.UPDATE`, `.DELETE`.
  - Source: WH-DOC
- **Automation OAuth scopes:** `Desk.automations.CREATE`, `.READ`, `.UPDATE`, `.DELETE`. — API

## 9. Edition availability

| Item | Free | Express | Standard | Professional | Enterprise | Source |
|---|---|---|---|---|---|---|
| Workflow rules | – | 1 per module (Tickets only) | 5 per module | 15 per dept per module | 30 per dept per module | PRICE (help WR: Std 5 / Pro 15 / Ent 30 per module per dept; not on Free) |
| Execute On "Field Update" | – | – | – | – | Yes | WR |
| Update Record (custom modules) | – | – | – | – | Yes | WR |
| Custom modules | – | – | – | – | 10 | PRICE |
| Custom functions in workflows | – | – | – | – | Yes | PRICE (an unanswered community question confirms they are not on Pro) |
| Deluge (custom function) / Deluge Assistant Bot | – | – | – | – | Yes | PRICE |
| Custom actions gallery in workflows | – | – | – | Yes | Yes | PRICE ("availability of actions varies by edition") |
| Extension custom actions | – | – | – | Yes | Yes | PRICE |
| Zia actions | – | – | – | – | Yes | PRICE, ZIA |
| Webhooks (enabled) | 0 | – | 0 | 5 active | 10 active | WH-DOC (Ultimate 20; max 20 configured), PRICE |
| Supervise (time-based) rules | – | – | 5 | 15 per dept | 30 per dept | PRICE |
| Schedules | – | – | – | – | 10 per dept | PRICE, CF-FAQ (250 per account) |
| Macros | 2 | 2 | 5 | 15 per dept | 30 per dept | PRICE |
| Custom email templates | default only | default only | Yes | Yes | Yes | PRICE |
| Business hours / holiday lists | – | 1 / 1 | 1 / 1 | 1 / 1 | 100 / 100 | PRICE |

Notes on the table:
- **Per-rule caps (all editions):** 10 alerts, 10 tasks, 10 field updates, 25 criteria, 5 custom actions. — WR, CAG
- **Total vs active rule counts:** The API sample shows 40 total / 20 active for workflows. — API
- **CONFLICT:** The help article does not mention the Express edition; PRICE does.

## 10. UI/UX

- **Builder steps:** **Basic Information → Execute On → Rule Criteria → Actions**, with **Next** between steps and **Save** at the end. — WR, FAQ #4, CAG-FAQ
- **Page names:** "New Workflow" when creating; "Edit Workflow" when editing (shows alerts for disabled actions). — CAG-FAQ, CAG
- **Action add menu:**
  - The **Add (+)** dropdown beside each action type offers **New** or **Existing**.
  - Gallery, extension and chat actions are in the same "+" dropdown.
  - Sources: WR, EXT
- **Field Update trigger:** Field picker with an **All/Any** link. — WR
- **Happiness Ratings trigger:** **All Ratings** or a specific rating selector. — WR
- **Private Thread trigger:** incoming, outgoing or both. — WR
- **Placeholder picker:** `{}` icon opens the "Select Placeholders" right pane. — CAG
- **Confirmation dialogs:**
  - Delete rule: **OK**. — WR
  - Remove action: **Delete**. — CAG-FAQ
  - Dependency alert when deleting an action whose output is used by another action. — CAG-FAQ
- **Validation messages and empty states** (for example, the first-rule empty state): NOT DOCUMENTED. Webhooks have an "Add your First Webhook" empty-state button. — WH-FAQ
- **Prerequisite gating:** The "Send notification via" option is hidden until a chat app is integrated. — CHAT
- **Related builder (not workflow rules):** Automation Studio has Action, If, Fork (max 5 branches) and Delay blocks, max 50 blocks per rule, multiple events per rule, and a **Save Rule** button. — AS-FAQ

## Gaps: NOT DOCUMENTED in any official source found

- Cloning a rule.
- Rule reordering, and execution order among workflow rules.
- List-page columns, search and filters.
- "Execute only once" or repeat options; "Evaluate on".
- "is changed" operators.
- Time-based workflow actions (they do not exist; use Supervise, Schedules or Automation Studio).
- Whether workflows fire on import, API or bulk updates.
- Per-day email, function and webhook quotas.
- Workflow execution log or usage report.
- Delete-in-use behaviour for alerts, tasks, field updates and functions.
- Task reminder fields.
- The From address for alerts.
- Custom-function argument limits and runtime limits.
- Validation and error message texts.
- Webhook as a native workflow action (it is not one).
