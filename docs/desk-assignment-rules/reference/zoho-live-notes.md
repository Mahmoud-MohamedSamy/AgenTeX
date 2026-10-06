# Zoho Desk — what was seen live (6 Oct 2026)

Org "anywaresoftwaredesk" (Enterprise trial), admin "CEO", headless Edge. Departments: Anyware Software, Sales. One sample ticket (#100).
Nothing was saved: two rule forms were opened and closed with Cancel. Direct Assignment, Round Robin and Skills lists were still empty at the end.

## Setup → Automation → Assignment Rules
- Sub-pages **Direct Assignment** and **Round Robin**. Both lists start with a master toggle ("Direct Assignment Rules", "Round Robin Rules") and show "There are no … Rules created yet!".
- Round Robin list has a department picker and a **⋯ → Preferences** menu.

### New Direct Assignment
- Rule Name (required), Description, **Active** (ticked by default).
- **Execute Rule on**: Ticket Create (ticked by default) — "Execute the rule immediately after the ticket is created." · Ticket Update — "Execute the rule after the ticket undergoes a field update."
- **Add target** (needs a rule name first, alert "Enter a name for the Assignment Rule."). Target panel: **Ticket coming to** (Any Department / Anyware Software / Sales) · **Criteria** · **Move Ticket to** (Select Department / Anyware Software / Sales) · **Assign Ticket to** (Unassigned; picker with Agents and Teams tabs and "Mark as Unassigned").

### Criteria field list (Direct Assignment target)
- **TICKETS (38):** Execution Time, Recent Comment Type, Recent Comment, Contact Name, Email, Phone, Subject, Description, Status, Product Name, Ticket Owner, Created By, Modified By, Created Time, Modified Time, Ticket Id, isSpam, Resolution, To Address, Number of Threads, Account Name, Due Date, Priority, Channel, Ticket Closed Time, Is Overdue, Is Escalated, Classifications, Happiness Rating, Number of Comments, Time to Respond, Team, Tags, Ticket On Hold Time, Layout, Skills, Language, Is Response Overdue.
- **CONTACTS (26):** First Name, Last Name, Email, Phone, Mobile, Title, Contact Owner, Type, Created By, Modified By, Created Time, Modified Time, isPortalUser, Secondary Email, CRM Contact Type, Total Revenue To Get, Closing Date, Total Revenue Received, Customer Since, Layout, Is Crm Contact, Number of Accounts Associated, Number of Good / Bad / Average Rating Given, Language.
- **ACCOUNTS (14):** Account Owner, Phone, Email, Website, Created By, Modified By, Created Time, Modified Time, Country, Layout, Number of Good / Bad / Average Rating Given, Is Crm Account.
- The field dropdown has a search box.
- **Execution Time** operators: during business hours of · outside business hours of · on a holiday of · not a holiday of.
- **Due Date** operators: is · isn't · is after · is before · between · not between · is empty · is not empty; value can be "Current Time".

### New Round Robin Assignment
- Rule Name, Description, **Execute Rule on** Ticket Create / Ticket Update.
- Notes on the form: "The rule will not re-assign tickets that were assigned via other automations." · "The rule will not assign more tickets than the number specified under threshold."
- Target panel: Criteria · **Round Robin Type**: Load Based Assignment ("Assign Tickets to agents based on their load until everyone receives the set threshold.") / Sequential Assignment ("Assign Tickets equally among agents, in a sequential manner, in round-robin fashion.") / Skill Based Assignment ("Assign Tickets to agents according to their designated skills. View Skills") · **Assign Ticket to**: Agents / Team.
- The trial org has no team, so the "Exclude agents" option for a team could not be opened.

### Round Robin Preferences (department Anyware Software)
- **Assign tickets to offline agents** (off) — "Round robin, by default, assigns tickets only to the agents who are online in the mail channel. When this option is enabled, it will assign tickets to offline agents as well."
- **Department wise threshold** (on, value 40) — "Maximum number of open tickets an agent in the department can handle at any given time."
- **Agent level threshold** (off) — "…The agent level threshold will override the department wise threshold."
- **Assign tickets on closure** (off) — "When the agent closes a ticket, the next available unassigned ticket will be automatically assigned to them."
- **Assign backlogs** (off) — "Will assign tickets that were created when agents were offline or when their thresholds were full."

## Setup → Customization → Skills
- Tabs **Skills** / **Skill Types**; filters Name, All Skill Types, Agents, All Status. Empty: "No skills yet".
- **Add Skill**: Skill Name (required), Skill Type (required, "Add Skill Type"), Description, **Criteria** ("Specify the criteria to be met for associating this skill to tickets."), **Agents** ("Associate agents with this skill to ensure that only tickets matching the skill are assigned to them.").

## Setup → Customization → Notifications → Notification Rules
- Department picker at the top. Two channel columns (email, mobile/SMS) with a toggle per rule.
- Agent Notifications include **Assigning a ticket**; Team Notifications include **Assigning a ticket**; Department Notifications: Receiving a moved ticket, **Creating a new ticket**, Receiving a shared ticket. All toggles were off in this org.

## Tickets list (manual assignment)
- Each row has an owner avatar. Clicking it opens a picker with **TEAMS** and **AGENTS** tabs, the department's agents with e-mail, a tick on the current owner and **Mark as Unassigned**. Nothing was changed.

## Setup menu (for reference)
- AUTOMATION: Assignment Rules (Direct Assignment, Round Robin), Workflows (Rules, Alerts, Tasks, Field Updates, Custom Functions), Blueprint, Macros, Service Level Agreement (SLA), Supervisor Rules, Support Plans, Schedules.
- ZIA: Intelligence, Anomaly, **Field Predictions**, Answer Bot, Generative AI.
