# Zoho Desk – Ticket Assignment: Capability Inventory (from official docs)

- **Compiled:** 6 Oct 2026
- **Purpose:** reference list for the TAVI Desk parity / gap analysis of ticket assignment.
- **Method:** research only. I read the public Zoho help-center articles through the help center's public article API, the full single-page API reference at desk.zoho.com/DeskAPIDocument, and the public pricing-comparison page. I did not sign in to any Zoho account.
- **Conventions:** option names appear **in bold** exactly as Zoho words them. "(inferred)" marks anything I deduced rather than read. A tag such as [S4] points to a source in the list below, and every tag is a link.
- **Caveat on editions:** the pricing-comparison page was served in Arabic because of geo-IP, and every attempt to get the English version failed. I translated the row labels back into English. The plan columns (Free / Express / Standard / Professional / Enterprise) and the cell values are as served. The English row labels are my translations and may differ from Zoho's English wording.

## Sources

| Key | Title | Last modified (per Zoho) |
|---|---|---|
| [S1] | Assign Tickets Manually | 2024-12-09 |
| [S2] | Assigning Tickets using Workflow and Assignment Rules | 2026-08-06 |
| [S3] | Automatic Triaging and Assignment of Tickets | 2025-08-28 |
| [S4] | FAQs: Assignment Rules | 2026-08-14 |
| [S5] | Managing Notification Rules/Triggers | 2026-08-06 |
| [S6] | Creating and Managing User Profiles | 2026-09-17 |
| [S7] | FAQs: Working on Tickets | – |
| [S8] | Performing Bulk Updates | 2026-02-20 |
| [S9] | Actions in the Ticket Detail Page | 2026-08-12 |
| [S10] | Adding and Managing Teams | 2026-08-13 |
| [S11] | Using Teams in Help Desk Automations | 2026-03-05 |
| [S12] | Understanding ticket accessibility | 2024-11-29 |
| [S13] | Adding and Managing Agents | 2026-08-28 |
| [S14] | Sharing Tickets Across Departments | 2026-08-06 |
| [S15] | Creating Workflow Rules | 2026-08-12 |
| [S16] | Working With Custom Actions Gallery | 2026-08-06 |
| [S17] | FAQs: Workflow Rules | – |
| [S18] | FAQs: Automation | 2026-04-11 |
| [S19] | SLAs – Scope, Purpose, Understanding, and Setting up | 2026-08-06 |
| [S20] | FAQs: SLA | 2026-08-14 |
| [S21] | Creating Supervisor Rules or Time-based Automations | 2026-08-06 |
| [S22] | FAQs: Supervisor Rules | 2026-08-21 |
| [S23] | Predict Picklist Field Values Using Field Predictions (Zia) | 2026-10-01 |
| [S24] | FAQs: Field Predictions | 2026-09-07 |
| [S25] | Configuring idle timeout for agents | 2026-08-06 |
| [S26] | Headquarters Dashboard | 2026-08-13 |
| [S27] | Ticket Assignment for Zoho Desk (Marketplace extension) | 2024-12-09 |
| [S28] | Chat Routing in Instant Messaging | 2026-02-24 |
| [S29] | Setting up Agents for Zoho Desk's IM | 2026-06-24 |
| [S30] | Creating a Blueprint / Blueprint – An Overview | 2026-09-18 |
| [S31] | Ticket Views – Custom, List, Detail, Blueprint, Archived | 2026-08-12 |
| [S32] | Events Supported in the Get Ticket History API | 2026-04-08 |
| [S33] | Get Ticket History API – Explained in Detail | 2023-10-17 |
| [S34] | Monitoring Audit Log | 2026-09-07 |
| [S35] | Monitoring Ticket Transition With Lifecycle Reports | 2026-08-11 |
| [S36] | Understanding Agent Availability Report | 2026-08-06 |
| [S37] | Creating and Managing Schedules | 2026-04-28 |
| [S38] | Digital Agents in Desk (Support Specialist / Resolution Expert) and FAQs: Zia agents | 2026-08-12 / 2026-04-30 |
| [S39] | Allowing Agents To View and Customize Feed Notification | 2026-04-03 |
| [S40] | Dynamic Ticket Categorization with Work Modes | 2026-08-13 |
| [S41] | Standard Dashboards | 2025-04-25 |
| [S42] | On Hold state – Use cases and Behavior | 2024-11-29 |
| [S43] | Mobile: Adding tickets and assigning agents (Android); Quick actions (iOS) | 2026-01 / 2026-04 |
| [S44] | Automation Studio – An Overview | 2026-08-12 |
| [S45] | Creating and Using Macros | 2026-08-06 |
| [S46] | AI-powered Workflow Automation with Zia Actions | 2026-09-30 |
| [A] | Zoho Desk REST API reference (DeskAPIDocument); each endpoint is linked by its anchor | live |
| [P] | Zoho Desk pricing comparison (served in Arabic, labels translated) | live |

---

## 1. Manual assignment

- **Default owner of new tickets.** A new ticket stays **unassigned** unless an assignment rule or round-robin rule applies. Support managers and administrators assign it. [S1]
  - Exception: when an **agent creates** a ticket, the creator becomes the ticket owner by default. [S9]
  - Mobile (Android): an agent is normally set while creating a ticket. **Mark as unassigned** lets you create the ticket without an owner. [S43]
- **Assign from the list view.** Path: Tickets module, then a list view from the left menu. Click the **Avatar image** next to the unassigned ticket and pick an agent or a team from the drop-down. The picker has a search bar for agents and teams. [S1][S4]
- **Assign from the detail view.** Click the **Avatar image** in the left menu, then pick an agent or a team. To pick a specific agent inside a team, click the icon next to the team name. [S1][S4]
- **What the picker shows.**
  - Agents who belong to several teams have their team list shown next to their name.
  - The agent's email address appears under the name and can be used for lookup, which helps tell apart agents with similar names. [S9]
  - Online/offline status in the native picker: not documented (see Open questions). The Marketplace **Ticket Assignment** extension does show it: online agents are listed first, marked with a solid green circle, followed by offline agents. [S27]
- **Team vs agent.**
  - You cannot assign a ticket to a team and an agent at the same time.
  - A ticket assigned to a team is visible to every member, but stays unassigned at agent level until an agent picks it up or someone assigns it. [S4]
  - Teams are department-specific. The picker only lists teams of the ticket's department. [S4]
  - The **Teams** tab appears in the picker only when **Team Assignment** is on for the department. [S10]
- **Reassign / change owner.** "Ticket owner can be changed at any time." Reassign the same way, by clicking the Avatar image in the list view or the detail view. [S1][S4]
- **Unassign.**
  - On the web, setting the owner back to unassigned is implied but not described step by step (inferred).
  - Mobile has **Mark as unassigned** at create time. [S43]
  - Deleting an agent offers to mark that agent's tickets **unassigned**. [S13]
  - Digital agents **un-assign** themselves. [S38]
- **Self-assign / "pick up".**
  - There is no documented **Assign to me / Claim / Take** button.
  - Agents whose profile has **View Unassigned** can see unassigned tickets and "pick" them themselves. [S1][S4]
  - The ticket-history API example shows a direct assignment rule *named* "Assign It to me". That is a rule name, not a UI action. [S32]
- **Bulk assign (list view).**
  - Steps: select tickets with the checkboxes, click **Assign to**, then pick an agent. **Assign to > Team** assigns to a team. [S4][S7]
  - **Mass action** covers up to 50 selected records. **Bulk action** covers more than 50. **Assign To Agents or Team** is supported in both. [S8]
  - Work Modes (kanban-style) also allow assigning up to 50 selected records. [S40]
- **Mobile.** On iOS, long-press a ticket and choose **Assign** to assign an unassigned ticket or reassign. [S43]
- **Permissions (profile, Setup > User Management > Profiles > Ticket Permissions).**
  - **Change Ownership** has three settings: change ownership of *all tickets*, *only unassigned tickets*, or *none*. [S6] It is required for bulk assign. [S7]
  - **View Unassigned**: "agents can view all the unassigned tickets and their own tickets". [S6] Only administrators can edit profile permissions. [S1]
  - API names for these permissions: `changeOwner` ("Tickets assigned to agents and that of others"), `unassignedChangeOwner` ("Unassigned Tickets") and `handleUnassigned` ("view and assign ownership for unassigned Tickets"). [A: Profiles]
  - **Light Agent** profile: cannot edit fields, cannot reply, and "cannot assign the ticket to any other agent". [S13]
- **Ticket access by agent type** (set when adding an agent).
  - The options are **Access all tickets**, **Their tickets and unassigned tickets** and **Access own, team, and unassigned tickets**. [S13]
  - Visibility matrix for "own + unassigned" agents:
    - Unassigned tickets: visible.
    - Self-assigned tickets: visible.
    - Other agents' tickets: not accessible.
    - Unassigned tickets in own team: visible.
    - Other agents' tickets in own team: not accessible.
    - Unassigned tickets in other teams: not accessible. [S12]
  - With data sharing set to **Private**, only the owner, the owner's superiors and admins can see a ticket. Team tickets are visible only to team members. [S12]
- **Assigning across departments.**
  - The direct-assignment API requires the agent to belong to the target department ("Must belong to the toDepartmentId"). [A: DirectAssignmentRule]
  - Manually assigning to an agent outside the ticket's department is not documented. The only documented routes are moving the ticket or sharing it (inferred).
- **Move to another department.**
  - The moved ticket is treated as new in the receiving department and its status is set to **Open**.
  - "All automations and SLAs from the previous department will be erased." [S9]
  - API: `POST /api/v1/tickets/{ticket_id}/move`. [A]
- **Share tickets (vs assign).**
  - Share levels: **Full Access**, **Restricted Access** and **Read-only Access**. Full Access is the default.
  - Agents a ticket is shared with "CANNOT modify the Ticket status and Assignee details irrespective of the level of permission". [S14]
  - Edition: Professional and Enterprise. [P]
- **Blueprint restrictions.**
  - Transition owners: each transition can have designated owners (agent or team), and only they can perform it.
  - **Dynamic Transition Owner Assignment**: owners are chosen per record.
  - Transition owners can come from another department; the ticket is then auto-shared. [S30]
  - Related views: **All Transitions**, **My Transitions**, **Unassigned Transitions**. [S31]
  - This restricts transitions, not the ticket owner field. A blueprint is not documented as blocking an owner change (inferred).
- **Reply restriction tied to ownership.** "When a ticket is assigned to one support representative, other agents may be restricted from replying to that ticket." The exact setting is not named. [S4]
- **Agent collision.** A presence monitor shows active and recent viewers and alerts on concurrent edits. Not an assignment feature, but related. Edition: Professional+. [P]
- **Notification on manual assign.** The assignee gets an email. A team assignment notifies every team member. [S1][S4] (Details in §4.)
- **Unassigned views and widgets.**
  - **Unassigned Open Tickets** (system view) and **My Teams Open Tickets**. [S31]
  - In the list, tickets "without a profile picture are considered to be unassigned". [S4]
  - Headquarters dashboard **Unassigned** component, split into On hold / Open / Due in one hour / Overdue. [S26]
  - Standard dashboards: **Unassigned Due in 1 hour** and **Unassigned Ticket**. [S41]
  - Pricing page rows: **Agent queue** (Express+) and **Team queue** (Professional+). [P]
- **Agent deactivation / deletion.**
  - The admin picks, per department, which agents take over the open tickets and activities, or leaves them unassigned.
  - The "assign to" field in round-robin and direct rules, the ticket-owner field updates in workflows, macros and supervise rules, the notify-agent fields, the SLA escalation fields and workflow task assignees are all updated to the replacement. [S13]
  - API: `POST /api/v1/agents/{agent_id}/reassignment`. [A]
- **Team deletion.** You must reassign the team's open tickets and activities first (**Reassign and Delete**). [S10] API: `POST /api/v1/teams/{team_id}/deleteTeam` with `ticketNewTeam` / `ticketNewAgent` (null means leave unassigned). [A]

## 2. Assignment rules (Setup > Automation > Assignment Rules)

Assignment rules come in two families: **Direct Assignment** and **Round-robin** (Round-robin has the sub-methods Load based, Sequential and Skill based). Workflows can also assign (§2.4). Permission: **Help Desk Automation** in the profile. [S2][S4]

### 2.1 Direct Assignment

- **Path / entry point.** Setup > Automation > Assignment Rules > **Direct Assignment** > **New Direct Assignment**. [S2]
- **Rule fields.**
  - **Rule name** and **Description**.
  - **Execute Rule on**: **Ticket Create** and/or **Ticket Update**. The FAQ calls these "Ticket Creation or Ticket Updation or both". The API uses `executeOptions: CREATE, EDIT`. [S2][S4][A]
  - Active state: the API exposes `status: ACTIVE | INACTIVE`. The UI uses the **Active** checkbox on the Rule Details page. [S4][A]
- **Targets.** **Add Target**, with "up to five targets for each direct assignment rule". [S2] Each target has:
  - **Tickets coming to**: "any department or a specific department". Defaults to the current department. [S2]
  - **Criteria**: up to 25 conditions with AND/OR. [S4] The API stores `fieldConditions` plus a `pattern`, e.g. "(1)". [A]
  - **Move Ticket To**: an optional destination department. [S2]
  - **Assign To**: an agent, or leave the ticket unassigned. [S2] The API also accepts a `teamId`, which "Requires Team Assignment to be enabled". [A] One agent **or** one team per target, not several. [S4]
- **Scope.** The FAQ calls Direct Assignment "organization-specific", i.e. it works regardless of department, while round robin is department-specific. [S4]
- **Rule order.** The first matching rule wins and later rules are not evaluated. [S4] The API supports reordering: `POST api/v1/directAssignmentRules/reorder` with `ruleIds`. Each rule has an `orderId`. [A]
- **Activate / deactivate.** Uncheck **Active** on a rule. A master toggle deactivates **all** Direct Assignment rules at once. [S4] API: `GET/PUT /api/v1/directAssignmentRules/executionStatus` (ACTIVE / INACTIVE). [A]
- **Delete.** "you can deactivate or delete an assignment rule". [S4] No delete endpoint is listed in the API (see Open questions).
- **Clone.** Not documented for assignment rules (see Open questions).
- **Edition limits (rule count).** Free –, Express 2, Standard 5, Professional 15, Enterprise 30. No "per department" suffix on this row, unlike round robin. [P]
- **Reopen / escalation use cases.**
  - Reopened tickets: **Execute On = Ticket Update** with criteria Status is Reopened.
  - Escalated tickets: criteria Is Escalated is ✓. [S4]
- **Time-based criteria.** Fields Execution time / Created time / Modified time / Ticket closed time.
  - Execution time operators: **During business hours of**, **Outside business hours of**, **On a holiday of**, **Not a holiday of**.
  - Date operators: is, isn't, is after, is before, between, not between.
  - Use case given: shift-based assignment by time zone. [S4]
- **Criteria fields available.**
  - System fields (ticket properties, contact info, key information, time and date), custom fields (operators "=" and ">") and keywords, e.g. "Keyword contains payment, refund, invoice". [S4]
  - Tags with is / isn't. [S18]
  - Allowed predefined values: `${EMPTY}`, `${NOTEMPTY}`, `${OPEN}`, `${CLOSED}`, `${CURRENTTIME}`. [A: Get Direct Assignment Rule Criteria Fields]
  - On Hold tickets are excluded from Is overdue / Is Response Overdue criteria in automations, assignment rules included. [S42]

### 2.2 Round-robin rules

- **Path.** Setup > Automation > Assignment Rules > **Round-robin** > **New Round Robin Assignment**. You first select the **department**, because round-robin rules are department-specific. [S2][S4]
- **Rule fields.** **Rule name**, **Description**, and execution on **Ticket Create**, **Ticket Update** or both. [S2]
- **Targets.** "up to five targets per round-robin rule". [S2] Each target has:
  - **Criteria**: up to 25 conditions with AND/OR. [S4]
  - **Round-robin method**: **Load balancing**, **Sequential** or **Skill-based**. The FAQ lists **Assignment Method** as "Round Robin assignment and Skill Based assignment". [S2][S4]
  - **Assign To**: agents or teams. The skill-based variant offers **Agents** (pick assignees) or **Team** (adds all of the team's agents). [S2][S4]
  - **Exclude agents from this assignment**: a checkbox, then pick the agents to exclude (for teams). [S2][S4]
- **Number of agents.** No limit on agents per round-robin rule. [S4]
- **Load based (Load balancing) mechanics.**
  - The least-loaded agent is served first until loads are equal, then tickets rotate. [S2]
  - FAQ example: A has 5 tickets, B 9, C 3. C gets tickets until reaching 5, then A and C share until 9, and B gets none until then. [S4]
  - "every agent has tickets within the threshold limit at any point… remaining tickets are added to the backlog". [S2]
- **Sequential mechanics.**
  - Tickets follow the order in which agents were added to the rule, e.g. John, Ben, Amy.
  - When **all agents** or **a team** is chosen, the order is alphabetical. [S2]
  - The FAQ says: alphabetical in general, but "for the first time" the order agents were added. [S4]
  - Identical names are told apart by system user ID; the earliest-added agent goes first, then alphabetical. [S2]
  - Adding or removing agents in **Assign Tickets To** resets the sequence to the first agent. This does not apply to team targets. [S2][S4]
  - Agents who go offline, or who hit the threshold while the admin has chosen to exclude such agents, are marked **"SKIPPED"** and moved to the end of the queue. [S2]
- **Skill based.** See §3.2.
- **When round robin does NOT act.**
  - It does not reassign tickets whose owner was already set by a workflow, a direct assignment or a macro. [S2][S4]
  - It never assigns more than the threshold. [S4]
- **Online requirement (default).** Tickets go only to agents **online in the email channel** unless **Assign tickets to offline agents** is on. [S2][S4]
- **30-day rule.** Unassigned or backlog tickets are assigned in round-robin only if the ticket received a customer response within the last 30 days. [S2][S4]
- **Rule and target order.** The system checks rules and targets in list order. The default order is chronological (first created on top). A ticket enters the first rule entry it matches. [S2]
  - To reorder: hover a rule, click the **Reorder** icon, drag and drop, then click **Save order**. [S2]
- **Activate / deactivate.**
  - Per rule: the **Deactivate** icon. Inactive rules go to the **Inactive** list and keep their targets when reactivated with the **Activate** icon.
  - All rules: the **Round Robin Rules** toggle in the top panel. [S2]
- **Clone / delete.** Not described for round-robin rules (see Open questions).
- **Edition.**
  - Load-balanced round robin: Professional 10 per department, Enterprise 15 per department.
  - Sequential round robin: Professional and Enterprise.
  - Agent-level round-robin threshold: Professional and Enterprise, marked **Early Access**.
  - Skill-based: Enterprise only. [P]

### 2.3 Round Robin Preferences (per department)

Path: Setup > Automation > Assignment Rules > Round Robin > **More** icon (top-right) > **Round Robin Preferences** > **Apply**. [S2] API: `GET` and `PATCH /api/v1/routingPreferences?departmentId=` (scope Desk.automations). [A: RoutingPreference]

- **Assign tickets to offline agents.** A toggle, off by default, so only agents online on the email channel receive tickets. API field: `assignToOfflineAgents`. [S2][A]
- **Department-wise threshold.**
  - A toggle plus a value from a drop-down: the maximum number of open tickets per agent in the department.
  - API fields: `isThresholdEnabled` and `thresholdLimit`.
  - Range: the FAQ says 1–200, while the API says 1–500 (conflict; see Open questions). [S2][S4][A]
- **Agent Level Threshold.**
  - A toggle, then rows of *agent names + ticket count*; **+** adds rows.
  - It overrides the department threshold for those agents.
  - Up to **1500 agents** can have agent-level thresholds.
  - API fields: `isCustomThresholdEnabled` (default false) and `customThresholdVsAgents[{customThreshold, agents[]}]`. [S2][A]
- **Assign Tickets on closure** (immediate assignment). **Enterprise only.** [S2]
  - When an agent closes a ticket, the next backlog ticket is assigned to them at once, but only if they are online and below their threshold.
  - It is paused briefly while the backlog scheduler runs.
  - It applies only to tickets created or updated after the setting was enabled.
  - Agents in several rules or targets receive tickets by created time.
  - "If agent A is the ticket owner and agent B closed the ticket, agent A will be assigned a ticket." [S2]
- **Assign Backlogs.**
  - A toggle plus **Backlog Limit**: the maximum number of backlog tickets assigned to one agent in bulk. The FAQ gives 1–50; the API gives `backLogLimit` 1–50.
  - Plus **Assign Based on**: **Due Date** or **Created Time** (API `assignBacklogsBy: DUEDATE | CREATEDTIME`).
  - Backlog assignment respects the threshold. [S2][S4][A]
- **Incoming ticket assignment.** New tickets are either assigned to agents until they reach the threshold or "pushed into the backlog" first. API: `freshTicketAssignMode: IMMEDIATE | MOVE_TO_BACKLOG`. [S2][S4][A]
- **Backlog behaviour.**
  - Tickets are held in the backlog when agents are offline or at their threshold.
  - Backlog tickets are assigned "as and when they resolve" tickets, periodically by the backlog scheduler. Closure-triggered assignment is available on Enterprise. [S2][S4]
  - The scheduler interval is not documented.

### 2.4 Workflow rules that assign

- **Path.** Setup > Automation > **Workflow Rules** > **Create Rule**. Choose **Module** (Tickets), **Rule Name**, **Active** and **Description**. [S2][S15]
- **Execute On.**
  - **Create**, **Edit**, **Field Update** (Enterprise only, with All/Any of the selected fields), **Customer Reply**, **Agent Response**, **Private Thread**, **Happiness Ratings** and **Delete**.
  - [S2] lists Create / Edit / Customer Reply for assignment. [S15]
- **Criteria.** Up to 25 conditions with AND/OR. Criteria are optional. [S15]
- **Action: Assign Ticket** (Custom Actions Gallery). Fill **Name**, then **Assignee**: **Agent**, **Team** or **Agent in a Team**, then the assignee or team name. The Record ID is auto-filled. [S2][S16]
  - [S2] also says workflows can assign to a "role, etc." This is not reflected in the action options (inferred to be imprecise).
  - Custom Actions Gallery limits: Tickets module only, at most 5 custom actions per rule. Edition: Professional+. [S16][P]
- **Other assignment-related workflow actions.**
  - **Add Skills**, **Remove Skills**, **Recalculate Skills**, and **Reassign Ticket Based on** (skills).
  - Field Update can change the status after assignment.
  - **Assign ticket owner as task owner**, which only applies when the ticket is unassigned. [S17][S15]
- **Edition limits.**
  - Free none; Express 1 per module (Tickets only); Standard 5 per module; Professional 15 per department per module; Enterprise 30 per department per module. [P][S15]
  - Up to 10 alerts, 10 tasks and 10 field updates per rule. [S15]
- **Difference from assignment rules.** Workflows do multiple actions but "do not support round-robin distribution". [S4]

### 2.5 Order of evaluation across automations (Zoho's docs disagree)

- **Order given in [S2] and [S19]:** Direct assignment > Workflow > SLA > Round robin (sequential > load balancing > skill based) > Blueprint > Notifications.
- **Order given in [S20]:** Direct Assignment Rules > Workflow Rules > SLAs > Round Robin Assignment > Blueprints > Notification Rules > Automation Studio.
- **Order given in [S18]:** Skills based assignment rule > Direct assignment rule > Workflow rules > SLA > Round robin assignment rule > Blueprint > Supervise > Macros. Supervise runs periodically and macros run manually.
  - "Skills based" here plausibly means skill stamping on the ticket (inferred).
- **Order given in [S17]:** Assignment Rules → Workflow Rules → SLAs → Round Robin → Blueprint. [S17] also notes that assignment rules may change the owner before a workflow's "Record Owner" alert is evaluated.
- **Automation Studio** rules run asynchronously and in parallel. [S44]

### 2.6 Other automations that can set or change the owner

- **SLA escalation.** **Actions on Escalation** can set a new **Ticket Owner** (an agent) and change the priority. [S19]
  - Up to 2 response and 4 resolution escalation levels.
  - Up to 10 SLA targets on Standard, Professional and Enterprise.
- **Supervisor (time-based) rules.**
  - Conditions include **Hours since assigned** and **Hours since first assigned**. [S21]
  - Use cases given: "Notify Queue Managers when tickets remain unassigned for x hours", "Notify and assign re-opened tickets after x hours", "Notify Support Managers when agents reassign their tickets". [S21][S22]
  - Mechanics: runs hourly; only checks tickets with a customer response in the last 30 days; counts business hours; actions are alerts, tasks and field updates; Tickets module only. [S20][S22]
  - Limits: 5 / 15 / 30 rules per department on Standard / Professional / Enterprise. [S21]
  - A field update can set the ticket owner (inferred from [S13], which lists "ticket owner fields" in supervise field updates).
  - There is **no** built-in "reassign if not responded" option on round robin. You would build it from a supervisor rule (inferred).
- **Macros.** Can assign as part of a macro (example: "Assign ticket to Security Team"). Round robin does not override macro assignment. [S45][S2]
- **Schedules** (Enterprise, custom functions).
  - Example uses: "Automatically assign unassigned tickets to specific agents at the end of the day", "Notify agents when the number of tickets assigned to them reaches a predefined limit", "Periodically reassign tickets from offline agents to agents who are currently available or online".
  - Limits: 10 per department, 250 per account. [S37][P]
- **Automation Studio.** An **Assign ticket** action block, e.g. assign to the L1/L2/L3 team by due date. [S44]
- **Zia Actions** (Enterprise). AI-filled fields, then auto-triage and assignment. [S46][P]

## 3. Automatic triaging, skills, availability, Zia

### 3.1 Triaging concepts (no separate settings screen)

- **Manual triaging.** Make classification fields mandatory on the form. [S3]
- **Automatic triaging.** Done through workflows or assignment rules, with reclassification on edit (e.g. severity L1 → L3 triggers reassignment). [S3][S4]
- **Best-practice categories** (guidance only, not product options): Priority ticketing, Status based grouping, Channel-level classification, Agent's expertise, Role based. [S3]
- **The three ways to automate assignment:** Workflow rule, Assignment rule, AI-based assignment (Zia). [S3]

### 3.2 Skills and skill-based assignment (Enterprise)

- **Path.** Setup > Customization > **Skills**. [S2]
- **Skill Types.** The **Skill Types** tab, then **Add Skill Type** and **Save**. A skill type groups skills (e.g. "Country"). [S2][A: SkillTypes]
- **Skill fields.**
  - **Skill name**, **Skill Type**, **Description** (optional).
  - **Criteria**: the fields that identify the skill on a ticket.
  - **Agents**: the agents mapped to the skill.
  - API status: `status ACTIVE | INACTIVE`. [S2][A: Skills]
- **Skill stamping.** The system matches a skill's criteria against incoming tickets and attaches the skill. Skills can also be added manually or by a workflow. [S2]
- **Skill Preference** (icon on the Skills page).
  - **Auto-add skills to tickets** (on create / edit). When it is off, skills are added manually or by a workflow.
  - **Position**: **Top of the list**, **Bottom of the list**, or **Order in which they are added during settings**.
  - API (`/api/v1/skillConfiguration`, per department): `autoSkillStamping ACTIVE | INACTIVE` and `attachSkillsOption AT_FIRST | AT_THE_END | BY_SKILL_ORDER`. [S2][S4][A]
- **Skill priority.**
  - Skills are reordered per department: `POST /api/v1/skills/order`.
  - On a ticket, `entitySkills` holds at most 10 skill IDs, and "The order of skillIds (first = highest priority) determines the skill-based assignment". [A]
- **Skill-based routing rule.** A round-robin rule with **Skill Based Assignment** as the method and Agents or Team as assignees (with Exclude Agents). "Tickets will then be assigned only to agents who match the defined skill criteria." [S4]
- **Manual and API triggers.**
  - `POST /api/v1/tickets/{id}/executeSkillbasedAssignment` assigns "based on skills and routing configuration".
  - `POST /api/v1/tickets/{id}/recalculateSkills`. [A]
- **Agent–skill mapping API.** `POST /api/v1/agents/{agentId}/mapSkills` (department + skill IDs) and `GET /api/v1/agents/{agentId}/skills` (at most 10 departments). [A]
- **Where a skill is used.** `GET /api/v1/skills/{id}/relatedRules` lists the automation rules that use the skill. [A]
- **Edition.**
  - Active skills: Enterprise, 30 per department.
  - Skill-based ticket assignment: Enterprise. [P]
  - The pricing tooltip says skill routing is "based on their proficiency **and availability**". [P]

### 3.3 Agent status / availability

- **Channel Status.**
  - Set from the profile photo menu, per channel, **Online** or **Offline**. The channels are Email, Phone, Chat and IM. [S7][S34]
  - API values: mail ONLINE/OFFLINE; phone ONLINE/OFFLINE/BUSY/ONCALL (with phoneMode WEB/PHONE); chat ONLINE/OFFLINE; im ONLINE/OFFLINE; plus an overall `isOnline` and a `presenceStatus`. [A: AgentChannelPreference / agentAvailability]
  - An admin can set availability for up to 10 agents at once: `POST /api/v1/agentChannelPreferences/markAll`. [A]
- **Statuses.** Only Online and Offline are documented for ticket routing. "Away" is not documented for Desk tickets. Phone has BUSY and ONCALL. [S7][A]
- **Effect on round robin.** Offline agents (email channel) get no round-robin tickets unless **Assign tickets to offline agents** is on.
  - Tickets that are already assigned stay with an unavailable agent: "no automatic reassignment occurs". [S4]
- **Idle Timeout.**
  - Path: Setup > Customization > General Settings > **Idle Timeout**. Pick the number of idle minutes; the default is 5.
  - It applies to the whole organization. After the timeout the agent is marked Offline and receives no tickets until active again.
  - API: `treatIdleAgentsAsOffline` and `agentIdleTime` 1–540. [S25][A]
  - Edition: Professional+. [P]
- **Coming back online.** Backlog tickets are assigned when agents become available and have capacity (backlog scheduler, or closure-triggered assignment on Enterprise). [S2]
- **Going offline.** No documented auto-reassignment of existing tickets. Workarounds:
  - The Headquarters dashboard, to manually reassign tickets from offline agents to online ones. [S26]
  - The Ticket Assignment extension. [S27]
  - A Schedule ("Periodically reassign tickets from offline agents"). [S37]
- **Business hours / shift awareness.**
  - Not a round-robin preference.
  - Achieved with time-based criteria (**During business hours of** … [S4]), supervisor rules counting business hours [S22], and IM chat routing that respects business hours [S28].
- **Availability APIs.**
  - `GET api/v1/agentAvailability` (department, include, at most 50 per page).
  - `GET api/v1/onlineAgents` and `GET api/v1/offlineAgents` (limit up to 6000).
  - `GET/POST /api/v1/agentAvailabilityConfig`.
  - `GET /api/v1/myChannelPreferences` and `POST /api/v1/myChannelPreferences/markAll`. [A]
- **Agent load visibility.**
  - `GET api/v1/agentsTicketsCount` (per department or `allDepartment`; 50 credits).
  - `GET api/v1/ticketQueueView/count?viewId&departmentId&agentId`. [A]

### 3.4 Zia / AI-based assignment

- **Field Predictions.**
  - Zia can predict picklist fields **and the ticket owner**. When the prediction meets the **accuracy score**, the predicted value is auto-updated and the matching workflow or assignment rule assigns the ticket. [S23][S24]
  - Path: Setup > Zia > **Field Predictions** > **Create New Field Prediction**. [S23]
  - Options:
    - Field to predict and the values Zia should predict (at most 50; at least 10 tickets each to retrain).
    - Training criteria: train on all tickets or on specific tickets.
    - **Execute on**: Ticket creation, Customer reply, or both.
    - **Field update mode**: **Auto-update predicted value** or **Let me confirm predicted value manually**.
    - Accuracy score: 70 or higher recommended.
  - At most 20 field predictions per department.
  - Permission: Zia access. Edition: Professional+. [S23][P]
- **Zia Agents (Digital Agents).**
  - The **Support Specialist** and **Resolution Expert** appear as assignees in assignment rules and workflows.
  - If the Support Specialist finds no knowledge-base article, it adds a private comment and **un-assigns itself**, and the ticket "re-enters the routing cycle".
  - A workflow can assign closed tickets to the Resolution Expert. [S38]
  - Edition: prebuilt AI agents on Enterprise; Zia Agent Studio on Professional+. [P]

### 3.5 Teams in assignment

- **Team Assignment toggle.**
  - Path: Setup > User Management > Teams, toggle in the upper right. It is per department and **enabled by default**.
  - When it is off, the Teams tab is hidden during assignment, auto-assignment included, and only agents are listed. [S10]
  - API: Department `isAssignToTeamEnabled`. [A]
- **Limits.** A team holds at most 100 agents (who can belong to 50 sub-teams or 20 roles). At most 60 teams per department. [S10]
- **Edition.** **Team ownership**: Professional and Enterprise. [P]
  - On a downgrade, new tickets and activities are no longer assigned to teams and the Teams tab disappears from auto-assignment; existing tickets keep the team name. [S10]
- **Team use cases in automation.** Assign by channel or keyword. Notify managers when team tickets are not picked up after x hours. Move tickets to a different team x hours before they go overdue. [S11]

### 3.6 Other channels

- **Instant Messaging (IM) chat routing.**
  - Path: Setup > Channels > Instant Messaging > Preferences > **Automation** > **Chat Routing** toggle per channel (WhatsApp, Business Messaging, Telegram, Instagram, Messenger, WeChat, Line).
  - **Sequential Assignment only**, to agents marked Online for IM and linked to the channel.
  - Outside business hours, or when nobody is available, chats queue and are assigned when business hours start.
  - Agent-to-agent direct transfer is not subject to routing.
  - With routing off, chats stay unassigned until a supervisor assigns them. [S28]
  - Edition: round-robin chat assignment on Professional+; chat transfer on Standard+. [P]
- **"Desk chat routing".** [S28] states that Desk (non-IM) chat routing supports Load-Based, Sequential and Skill-Based assignment.
- **IM manual assign.** Path: IM > All Conversations / My Conversations / Unassigned, then assign or reassign to an agent or bot. The agent must be associated with the channel and have the permission. [S29]
- **Telephony.** **Call routing (sequential and simultaneous)**: Professional+. Not ticket assignment. [P]

## 4. Notifications related to assignment

- **Agent Notifications > "Assigning a ticket".** "Notifies the agent who has been assigned to a ticket of the new assignment." [S5]
- **Team Notifications > "Assigning a ticket".** "Notifies the team members when a ticket is assigned to their team." There are further team notifications for responses and comments on team tickets and for team mentions. [S5][S10]
- **Department Notifications.**
  - **Creating a new ticket**: "Notifies all agents when a ticket is created that has not been automatically assigned".
  - **Receiving a moved ticket**.
  - **Receiving a shared ticket**. [S5]
- **"Assigning a blueprint transition".** Notifies the agent assigned to perform a transition. [S5]
- **Same pattern for activities.** Assigning a call / task / event, at agent and team level. [S5]
- **Channels.** Email and SMS. SMS needs Screen Magic or Clickatell credits. [S5] Edition: SMS add-on, Standard+ ("notify agents of new ticket assignments via SMS"). [P]
- **In-app.** The Notification Center / Feeds shows "New ticket assignment". Agents can tune the feed per department. [S39][S10]
- **Defaults and configuration.**
  - "By default, the notification rules are disabled in your help desk."
  - Enable them per department: Setup > Customization > Notifications > Notification Rules > choose department > toggle. [S5]
  - The FAQ says "Disable assigning a ticket under Agent Notifications" to stop assignment emails. [S4]
  - Permission: Support Administrator. [S5]
  - Edition: notification rules on all editions. [P]
- **Templates.** Each rule has a predefined template, customizable for Email and SMS. Use the **Edit Template** icon; **Preview** is available for email only. [S5]
  - Prebuilt team notifications cannot be edited. Use a workflow to build a custom one. [S11]
- **Custom assignment notifications.**
  - Workflow **Alerts** go to Groups, Roles, Roles and Subordinates or Agents, plus **Record Owner**, **Record Creator** and **Notify Contact**. [S15]
  - Supervisor rule alerts work the same way. [S21]
- **Notification evidence in history.** A history event `NotificationSent` whose actor is a NotificationRule named e.g. "Notify agent when a ticket is assigned". [S32]

## 5. Reporting and audit

- **Ticket History (detail view History tab and API).**
  - Owner changes are recorded as `TicketUpdated` with property **"Case Owner"** (previous → updated agent) and **"Team"** (previous → updated team).
  - The actor shows *who* made the change. Actor types: `Agent`, `Contact`, `DirectAssignment`, `RoundRobinAssignment`, `NotificationRule`, `SLA`, `Workflow`, `Macro`, `Supervise`, `Blueprint` and `System`. The actor name is the rule name (e.g. "New Round robin rule"). This is how "assigned by rule X" is visible.
  - A direct assignment that also moves the ticket shows a "Department" transition in the same event. [S32][S33]
- **Ticket History API.** `GET api/v1/tickets/{ticket_Id}/History` with `eventFilter=AssignmentRuleHistory` (also NotificationRuleHistory, WorkflowHistory, SLAHistory, …), `agentId` and `fieldName`; `limit` 1–50. [S33]
- **FAQ on history contents.** The history includes "changing ownership" and "applying an assignment rule". [S7]
- **Audit Log** (Setup > Privacy and Security > Audit Log).
  - Logged entities include **Direct Assignment Rule**, **Round Robin Rule**, **Skills**, Workflow, Escalate (SLA), Supervisor Rules, Schedules and Notification Rules.
  - Actions: Add / Update / Delete, plus **Online** / **Offline** availability changes per channel.
  - Each entry records time, user, IP and department. Logs are retained for at least 2 years. [S34]
- **Lifecycle Reports.** Agent and team lifecycle: time with each owner or team, and the reassignment trail. Filters include "owner updated from/to" and "team updated from/to". Edition: Professional+. [S35][P]
- **Agent Availability Report** (static report).
  - Login and logout times, sessions and hours worked, in Summary and Session views. The idle timeout counts as logout.
  - Edition: Professional+. API: `GET /api/v1/reports/staticReports/agentAvailability`. [S36][P][A]
- **Headquarters dashboard.** The Unassigned component and the Online/Offline agents per channel, with overdue and due-in-1-hour counts. Edition: Standard+. [S26][P]
- **Standard dashboards.** The **Unassigned Ticket** and **Unassigned Due in 1 hour** widgets. [S41]
- **Agent performance.** Reassignment-related insights are not documented beyond the lifecycle reports (see Open questions).

## 6. API (desk.zoho.com/DeskAPIDocument)

| Area | Endpoint | Key fields / notes |
|---|---|---|
| Ticket owner/team | `POST /api/v1/tickets`, `PATCH /api/v1/tickets/{id}` | `assigneeId` (long), `teamId` (long), `entitySkills` (≤10 skill IDs, order = priority) |
| List tickets | `GET /api/v1/tickets` | `assignee=Unassigned|{id}` (comma list), `teamIds=Unassigned|{id}`, `include=assignee,team,…`; response has `assigneeId`, `teamId`, `assignee{}` |
| Bulk field update | `POST /api/v1/tickets/updateMany` | `ids` (≤50), `fieldName`, `fieldValue`, `isCustomField` — can target the owner field (inferred) |
| Move ticket | `POST /api/v1/tickets/{id}/move` | `departmentId` |
| Skill-based run | `POST /api/v1/tickets/{id}/executeSkillbasedAssignment` | Desk.tickets.UPDATE |
| Recalculate skills | `POST /api/v1/tickets/{id}/recalculateSkills` | |
| Direct Assignment rules | `GET/POST api/v1/directAssignmentRules`, `GET/PATCH …/{ruleId}` | `name`, `description`, `status` ACTIVE/INACTIVE, `executeOptions` [CREATE, EDIT], `targets[]`, `orderId`; list filters `status`, `departmentId`, `limit` 1–50 |
| DA targets | `POST …/{ruleId}/targets`, `GET/PATCH …/targets/{targetId}` | `criteria{fieldConditions[{fieldName,condition,value,fieldModule}],pattern}`, `fromDepartmentId`, `toDepartmentId`, `agentId` (must belong to toDepartment), `teamId` (needs Team Assignment) |
| DA order / master switch | `POST api/v1/directAssignmentRules/reorder` (`ruleIds`); `GET/PUT /api/v1/directAssignmentRules/executionStatus` | |
| DA criteria fields | `GET` Direct Assignment Rule Criteria Fields | predefined `${EMPTY}`, `${NOTEMPTY}`, `${OPEN}`, `${CLOSED}`, `${CURRENTTIME}` |
| Round-robin prefs | `GET/PATCH /api/v1/routingPreferences?departmentId=` | `assignToOfflineAgents`, `isThresholdEnabled`, `thresholdLimit` (1–500), `isCustomThresholdEnabled`, `customThresholdVsAgents`, `assignBacklog`, `backLogLimit` (1–50), `assignBacklogsBy` DUEDATE/CREATEDTIME, `freshTicketAssignMode` IMMEDIATE/MOVE_TO_BACKLOG |
| Round-robin rules CRUD | **not found** in the API reference | only referenced as a `featureType=RoundRobin` value in "criteria references" |
| Skill types | `GET/POST /api/v1/skillTypes`, `GET/PATCH/DELETE /api/v1/skillTypes/{id}` | list limit 1–100 |
| Skills | `GET/POST /api/v1/skills`, `GET/PATCH/DELETE /api/v1/skills/{id}`, `POST /api/v1/skills/order`, `GET /api/v1/skills/criteriaFields`, `GET /api/v1/skills/{id}/relatedRules` | `name`, `description`, `status`, `skillTypeId`, `criteria`, `agentIds` |
| Agent ↔ skills | `POST /api/v1/agents/{agentId}/mapSkills`, `GET /api/v1/agents/{agentId}/skills` | per department |
| Skill configuration | `GET/PATCH /api/v1/skillConfiguration` | `autoSkillStamping`, `attachSkillsOption` |
| Availability | `GET api/v1/agentAvailability`, `GET api/v1/onlineAgents`, `GET api/v1/offlineAgents`, `GET/POST /api/v1/agentAvailabilityConfig` | statuses per channel, `presenceStatus`; idle config 1–540 min |
| Channel prefs | `GET /api/v1/myChannelPreferences`, `POST …/markAll`, `GET /api/v1/agentChannelPreferences?agentIds=` (≤50), `POST /api/v1/agentChannelPreferences/markAll` (≤10 agents) | |
| Load | `GET api/v1/agentsTicketsCount`, `GET api/v1/ticketQueueView/count` | |
| Reassign on deactivate | `POST /api/v1/agents/{agent_id}/reassignment` | `ticketNewOwner`, `taskNewOwner`, org/dept-wide automation reassignments |
| Team delete | `POST /api/v1/teams/{team_id}/deleteTeam` | `ticketNewTeam`, `ticketNewAgent`, `taskNewTeam`, `taskNewAgent` |
| Department | Department object | `isAssignToTeamEnabled` |
| Profiles | Profile permissions | `changeOwner`, `unassignedChangeOwner`, `handleUnassigned`, `shareTickets` |
| History | `GET api/v1/tickets/{id}/History` | `eventFilter=AssignmentRuleHistory`, actor types DirectAssignment / RoundRobinAssignment |
| Feature counts | `GET /api/v1/automationFeatureCount` | values include Skills, SkillType, workflows, blueprints (not assignment rules) |
| Article feedback → ticket | Convert Article Feedback to Ticket | `assigneeId` falls back to the KB category preference, otherwise the ticket stays unassigned |

All endpoints: [A]

## 7. Edition availability and limits (pricing page [P], plus doc notes)

| Capability | Free | Express | Standard | Professional | Enterprise | Source |
|---|---|---|---|---|---|---|
| Direct assignment to agents and teams (rules) | – | 2 | 5 | 15 | 30 | [P] |
| Load-balanced round-robin rules | – | – | – | 10 / dept | 15 / dept | [P] |
| Sequential round robin | – | – | – | ✓ | ✓ | [P] |
| Agent-level round-robin threshold | – | – | – | Early Access | Early Access | [P] |
| Assign tickets on closure (immediate) | – | – | – | – | ✓ | [S2] |
| Active skills | – | – | – | – | 30 / dept | [P] |
| Skill-based ticket assignment | – | – | – | – | ✓ | [P] |
| Team ownership (assign to teams) | – | – | – | ✓ | ✓ | [P] |
| Agent queue / Team queue | – / – | ✓ / – | ✓ / – | ✓ / ✓ | ✓ / ✓ | [P] |
| Ticket sharing | – | – | – | ✓ | ✓ | [P] |
| Agent idle timeout | – | – | – | ✓ | ✓ | [P] |
| Workflow rules | – | 1 / module (tickets) | 5 / module | 15 / dept / module | 30 / dept / module | [P][S15] |
| Workflow Field Update trigger | – | – | – | – | ✓ | [S15] |
| Custom Actions Gallery (Assign Ticket action) | – | – | – | ✓ | ✓ | [P] |
| Supervisor (time-based) rules | – | – | 5 | 15 / dept | 30 / dept | [P][S21] |
| Macros | 2 | 2 | 5 | 15 / dept | 30 / dept | [P] |
| Schedules | – | – | – | – | 10 / dept | [P][S37] |
| Zia field predictions (incl. ticket owner) | – | – | – | ✓ | ✓ | [P] |
| Zia Actions | – | – | – | – | ✓ | [P] |
| Prebuilt AI agents (Support Specialist, etc.) | – | – | – | – | ✓ | [P] |
| Blueprints (active) / dynamic transition owner | – | – | – | 1 / dept, ✓ | 20 / dept, ✓ | [P] |
| SLAs | Default | Default | 4 | 10 / dept | 20 / dept | [P] |
| Notification rules | ✓ | ✓ | ✓ | ✓ | ✓ | [P] |
| SMS add-on (assignment SMS) | – | – | ✓ | ✓ | ✓ | [P] |
| IM round-robin chat assignment | – | – | – | ✓ | ✓ | [P] |
| Headquarters dashboard | – | – | ✓ | ✓ | ✓ | [P] |
| Lifecycle reports / Agent availability report | – | – | – | ✓ | ✓ | [P] |
| Light agents (cannot assign) | – | – | add-on | add-on | 50 free + add-on | [P][S13] |
| Data sharing (private tickets) | – | – | – | – | ✓ | [P] |
| Multiple departments | – | – | – | 10 | 50 | [P] |

Other documented limits:

- Up to 5 targets per direct or round-robin rule. [S2]
- Up to 25 criteria per rule. [S4]
- Up to 1500 agents with agent-level thresholds. [S2]
- Round-robin threshold 1–200 per the FAQ, 1–500 per the API. [S4][A]
- Backlog limit 1–50. [S4][A]
- No limit on agents in a round-robin rule. [S4]
- Up to 100 agents per team and 60 teams per department. [S10]
- Idle timeout default 5 minutes, API range 1–540. [S25][A]
- Mass action up to 50 records; bulk action more than 50. [S8]
- Workflow rules are disabled on downgrade or expiry and must be re-enabled manually. [S15]

## 8. Open questions / could not confirm

1. **Native assignee picker and availability.** The docs never say whether the built-in owner picker shows online/offline status or ticket load. Only the Marketplace extension [S27] and the Headquarters dashboard [S26] show status. Confirm in the live UI.
2. **"Assign to me" / claim.** No documented one-click self-assign. Self-pickup is described only as a permission ("View Unassigned"). A keyboard shortcut for assigning is not documented in text. Confirm in the UI.
3. **Unassign from the web UI.** Not described step by step. Confirm whether the picker has an "Unassigned" entry.
4. **Execution order.** Zoho gives four different sequences ([S2]/[S19], [S20], [S18], [S17]). In particular, it is unclear whether skill stamping or skill-based assignment runs first, and where Supervise, Macros and Automation Studio sit.
5. **Threshold range.** 1–200 [S4] vs 1–500 [A]. The UI drop-down values are not documented.
6. **Round-robin method names.** [S2] says Load balancing / Sequential / Skill-based. [S4] says Round Robin assignment / Skill Based assignment. The exact UI labels need a check.
7. **Direct assignment target.** [S2] and [S4 Q18] say "Assign To an Agent / leave unassigned". The API also accepts `teamId`. [S4 Q19] says one agent or one team. It is unclear whether "Move Ticket To" combined with "leave unassigned" leaves the ticket unassigned in the new department or lets that department's round robin pick it up.
8. **Direct assignment scope.** It is called "organization-specific" [S4] but configured per "Tickets coming to" department. The rule-count limit (2/5/15/30) does not say whether it is per department or per org.
9. **Clone and delete of assignment rules.** Delete is mentioned for direct rules [S4], but there is no API delete endpoint. Clone is not documented for direct or round-robin rules. Delete is not documented for round-robin rules.
10. **No public API for round-robin rule CRUD.** Only the preferences endpoint exists. Rule management may be UI-only.
11. **"Reassign if not responded" / SLA-based reassignment.** There is no round-robin option. Possible only through SLA escalation **Actions on Escalation** (new Ticket Owner) or a Supervisor rule field update. Whether a supervisor field update can set the Ticket Owner is inferred from [S13].
12. **Reassignment when an agent goes offline.** Explicitly *not* automatic [S4]. Only Schedules (custom functions) [S37] or the extension [S27] do it.
13. **"Away" status.** Not documented for Desk ticket routing (only Online/Offline; phone has BUSY/ONCALL). The meaning of `presenceStatus` versus channel status for round robin is undocumented. The doc says round robin uses "online in the email channel".
14. **Backlog scheduler interval.** The "periodic assignment cycle" is mentioned [S2] but its frequency is not documented.
15. **Assignment email trigger.** The FAQ [S18] says enable Department Notifications > "Creating a new ticket" to notify on assignment. That conflicts with [S5], where that rule notifies *all* agents about tickets that were not auto-assigned, and the assignment email is Agent Notifications > "Assigning a ticket". It is also unconfirmed whether rule-based and bulk assignments fire the same notification.
16. **Reply restriction for non-owners.** "Other agents may be restricted from replying" [S4], but the governing setting is not named.
17. **Manual assignment to agents outside the department.** Not documented. The API requires direct-assignment agents to be in the target department.
18. **Editions.** I translated the pricing labels from the Arabic page. The English labels and the "Early Access" status of agent-level thresholds should be re-checked on the English page from a non-MENA location. "Assign tickets on closure" being Enterprise-only comes from the help doc, not the pricing table.
19. **Workflow assignment to a "role".** [S2] mentions assigning to a "role, etc.", but the action only offers Agent / Team / Agent in a Team.
20. **Rule-based reassignment on reopen.** Possible with an Update-triggered rule (Status is Reopened) [S4]. Whether round-robin "Ticket Update" re-fires on every field edit or only on criteria-relevant changes is not documented.

[S1]: https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assign-tickets-manually
[S2]: https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-using-workflows-assignment-rule
[S3]: https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/automatic-triaging-and-assignment-of-tickets
[S4]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-assignment-rules
[S5]: https://help.zoho.com/portal/en/kb/desk/customization/notifications/articles/managing-notification-rules-triggers-in-zoho-desk
[S6]: https://help.zoho.com/portal/en/kb/desk/user-management-and-security/roles-and-profiles/articles/managing-user-profiles
[S7]: https://help.zoho.com/portal/en/kb/desk/faqs/tickets/articles/faqs-working-on-tickets
[S8]: https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/performing-bulk-updates
[S9]: https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/user-actions-in-the-ticket-detail-page
[S10]: https://help.zoho.com/portal/en/kb/desk/user-management-and-security/agents-and-teams/articles/adding-and-managing-teams
[S11]: https://help.zoho.com/portal/en/kb/desk/automation/actions/articles/using-teams-in-automation
[S12]: https://help.zoho.com/portal/en/kb/desk/ticket-management/linking-tickets/articles/understanding-ticket-accessibility
[S13]: https://help.zoho.com/portal/en/kb/desk/user-management-and-security/agents-and-teams/articles/add-manage-desk-agents
[S14]: https://help.zoho.com/portal/en/kb/desk/ticket-management/actions-in-tickets/articles/sharing-tickets-other-departments
[S15]: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/workflow-automations
[S16]: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/custom-actions-gallery
[S17]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-workflow-rules
[S18]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-automation
[S19]: https://help.zoho.com/portal/en/kb/desk/automation/escalate-sla/articles/understanding-and-working-with-slas
[S20]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-sla-service-level-agreement
[S21]: https://help.zoho.com/portal/en/kb/desk/automation/skills-supervise/articles/creating-supervisor-rules-or-time-based-automations
[S22]: https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-supervisor-rules-or-time-based-automations
[S23]: https://help.zoho.com/portal/en/kb/desk/zia/prediction/articles/zia-field-predictions
[S24]: https://help.zoho.com/portal/en/kb/desk/faqs/zia/articles/faqs-predict-picklist-field-values-using-field-predictions
[S25]: https://help.zoho.com/portal/en/kb/desk/customization/general-settings/articles/configuring-idle-timeout-for-agents
[S26]: https://help.zoho.com/portal/en/kb/desk/ticket-management/views-and-filters/articles/headquarters-dashboard
[S27]: https://help.zoho.com/portal/en/kb/desk/integrations-and-marketplace/agent-productivity/articles/ticket-assignment-for-zoho-desk
[S28]: https://help.zoho.com/portal/en/kb/desk/support-channels/instant-messaging/preferences/articles/chat-routing-in-instant-messaging
[S29]: https://help.zoho.com/portal/en/kb/desk/support-channels/instant-messaging/general/articles/setting-up-agents-for-zoho-desk-s-im-user-gudie
[S30]: https://help.zoho.com/portal/en/kb/desk/automation/blueprint/articles/creating-a-blueprint-in-zoho-desk
[S31]: https://help.zoho.com/portal/en/kb/desk/ticket-management/views-and-filters/articles/ticket-views-custom-list-archived-views
[S32]: https://help.zoho.com/portal/en/kb/desk/developer-space/rest-apis/articles/events-supported-in-get-ticket-history-api
[S33]: https://help.zoho.com/portal/en/kb/desk/developer-space/rest-apis/articles/get-ticket-history-api-explained-in-detail
[S34]: https://help.zoho.com/portal/en/kb/desk/data-administration/audit-log/articles/monitoring-audit-log-in-zoho-desk
[S35]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/reports/articles/monitoring-ticket-transition-with-lifecycle-reports
[S36]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/reports/articles/understanding-agent-availability-report
[S37]: https://help.zoho.com/portal/en/kb/desk/automation/support-contract-schedules/articles/creating-and-managing-schedules
[S38]: https://help.zoho.com/portal/en/kb/desk/agentic-ai/articles/agentic-ai-in-desk-support-specialist-and-resolution-expert
[S39]: https://help.zoho.com/portal/en/kb/desk/productivity/feeds/articles/managing-notification-by-agents
[S40]: https://help.zoho.com/portal/en/kb/desk/ticket-management/work-modes/articles/ticket-work-modes
[S41]: https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/dashboards/articles/standard-dashboards-in-desk
[S42]: https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-status/articles/on-hold-state-use-cases-and-behavior
[S43]: https://help.zoho.com/portal/en/kb/desk/mobile-apps/ios/ticket-management/articles/quick-actions-in-tickets-module-in-ios
[S44]: https://help.zoho.com/portal/en/kb/desk/automation/automation-studio/articles/automation-studio-an-overview
[S45]: https://help.zoho.com/portal/en/kb/desk/automation/macros/articles/creating-and-using-macros-to-update-tickets
[S46]: https://help.zoho.com/portal/en/kb/desk/automation/workflows/articles/ai-powered-workflow-automation-with-zia-actions
[A]: https://desk.zoho.com/DeskAPIDocument
[A: DirectAssignmentRule]: https://desk.zoho.com/DeskAPIDocument#DirectAssignmentRule_CreateDirectAssignmentRule
[A: RoutingPreference]: https://desk.zoho.com/DeskAPIDocument#RoutingPreference_UpdateRoutingPreferences
[A: Skills]: https://desk.zoho.com/DeskAPIDocument#Skills_CreateSkill
[A: SkillTypes]: https://desk.zoho.com/DeskAPIDocument#SkillTypes_CreateSkillType
[A: Profiles]: https://desk.zoho.com/DeskAPIDocument#Profiles_Getprofile
[A: AgentChannelPreference / agentAvailability]: https://desk.zoho.com/DeskAPIDocument#agentAvailability_GetCurrentAvailability
[A: Get Direct Assignment Rule Criteria Fields]: https://desk.zoho.com/DeskAPIDocument#DirectAssignmentRule_GetDirectAssignmentRuleCriteriaFields
[P]: https://www.zoho.com/desk/pricing-comparison.html
