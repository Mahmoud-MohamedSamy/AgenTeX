# TAVI Desk — what the build ships for assignment (6 Oct 2026)

Host `https://staging-desk.taviportal.com`, bundle `index-Co3RWIzd.js`. Read from the code (chunks `AssignmentRulesPage-DZu1-MER.js`, `assignment-api.client-C2iBNVJR.js`, `CriteriaBuilder-DwLgmCen.js`, `useTicketOwnership-Cuo9U1nu.js`, `department-routing-JV9apaIA.js`, `pages-Bi1kJs7C.js`), the `desk`, `desk-tickets` and `crm-workflow` locales, the live API (GET only) and the pages, as the owner and the second admin.

## Pages
- **Setup → Automation → Assignment Rules** — `/settings/automation/assignment-rules`. Tabs **Rules · Team Assignment · Agent Skills · Backlog · Notifications**. Permission `desk:assignment:manage`; without it: "You can't manage assignment".
- With no department: "Create a department first — assignment rules and team assignment belong to a department." (tenant state until 6 Oct 2026).
- Departments: `/settings/organization/departments` (form has its own **Routing**: Round robin / Least busy / Skill match, saved as `routing_strategy`).
- Agent availability: Setup → Ticket Access → "Agent availability" (Mark idle agents offline, 1–120 minutes). Queues show Availability per channel.

## Rules tab
- Department picker. Intro: "Rules run in order when a ticket arrives with no owner and no team. The first active rule whose criteria match assigns it; the rules after it are skipped."
- Empty: "No assignment rules yet" / "Tickets in this department stay unassigned until an agent picks them up. Add a rule to assign them automatically."
- Row: position "Rule {{n}}", Move up / Move down ("Order saved."), Active switch ("Rule activated." / "Rule deactivated."), Edit, Delete ("Delete this rule?" — "“{{name}}” stops assigning tickets. Tickets it already assigned keep their owner." → "Delete rule"). Summary: "Every ticket" or "{{count}} condition(s)"; "Assign to {{name}}", "Assign to team {{name}}", "Round robin · {{strategy}} · {{pool}}", "an unknown agent", "an unknown team".
- **Editor** ("New assignment rule" / "Edit assignment rule", "Department: {{department}}"):
  - Rule name * (max 120, "Enter a rule name." / "Keep the name under 120 characters."), Description (max 1000), Active (default on, "An inactive rule is skipped when tickets arrive.").
  - Criteria: "No conditions: the rule matches every new ticket of the department." Add condition / Remove condition {{n}}; Field · Operator · Value(s). Criteria pattern ("e.g. 1 and (2 or 3)"; errors syntax / unknown_condition / missing_condition / ambiguous).
  - Fields offered (23, live): Name, Subject, Status, Priority, Channel, Classification, Email, Phone, Description, Resolution, Skills, Language, Ticket Number, CRM Deal, Spam, Customer Responded, Happiness Rating, Happiness Link Status, Pending Review, Archived, SLA Name, SLA Violated, SLA Escalated. Left out by code: system-managed fields and owner, team, department, shared_departments; any datatype not in the map (dates, lookups, users…).
  - Operators by kind: text = is, isn't, contains, doesn't contain, starts with, ends with, is empty, is not empty · option = is, isn't, is any of, is empty, is not empty · multi option = contains, doesn't contain, is any of, is empty, is not empty · number = is, isn't, is empty, is not empty · boolean = is.
  - Assign to: **An agent** ("Every matching ticket goes to one agent of this department.") · **A team** ("The ticket goes to a team's queue; the department's Team Assignment decides whether a member is picked.") · **Round robin** ("Tickets rotate over a pool of agents.").
  - Round robin: Pool = Selected agents / A team's members; Strategy = Sequence / Load-based / Skill-based; **Capacity per agent** 1–1000 or empty ("An agent with this many active (open or on hold) tickets is skipped until one closes."); **Keep excess tickets in backlog** (default on).
  - Errors: "Pick an agent." "Pick a team." "Pick at least one agent, or a team." "Enter a whole number from 1 to 1000, or leave it empty." "Fix the highlighted fields to save the rule." "The rule could not be saved." Empty agent list: "This department has no agents yet. Add agents to it under Departments."
  - Toasts: "Rule created." "Rule saved." "Rule deleted."

## Team Assignment tab (per department)
- Mode Off / Round robin / Load-based; Capacity per agent and Keep excess tickets in backlog when a mode is on; "Team assignment saved." API body `{mode, capacity_limit, use_backlog}`; baseline for all 5 departments: `{"mode":"off","capacity_limit":null,"use_backlog":true}`.

## Agent Skills tab
- "Skill-based round robin assigns a ticket only to agents holding every skill in the ticket's Skills field." Search agents, per-agent edit ("Skills of {{name}}"), "Skills saved." Skills = options of the Tickets **Skills** picklist (tier_1_support, tier_2_support, escalation_handling, billing, account_management, product_expertise). Empty field: "The Skills field of Tickets has no options yet. Add them under Modules & Fields…".

## Backlog tab
- "Tickets that no eligible agent could take yet — everyone at capacity, or nobody eligible. They are assigned first come, first served every minute and whenever an agent frees up."
- Department filter, Refresh, **Process now** ("{{assigned}} assigned, {{remaining}} still waiting."), columns Ticket · Department · Team · Rule · Reason (Everyone at capacity / No eligible agent) · Queued · Attempts, "Open ticket".

## Notifications tab (organisation-wide)
- "Notify the agent when a ticket is assigned to them" (not when they assign themselves) · "Notify team members when a ticket is assigned to their team" (lands in the team queue with no owner). Both on in the baseline. "The channels (in-app, email, SMS) follow your organization's notification policy and each user's own notification settings."

## Manual assignment
- Ticket Owner field (Shift + A), Teams field, **Unassign**, **Pick up** ("Assign this ticket to yourself"), list/queue card **Assign**, bulk **Assign To** (Agents / Teams tabs), Move ticket dialog with "Assign to" (department's agents/teams only), Share ticket (shared departments cannot change status or owner).
- Messages: "Someone else picked up this ticket first." · "You can pick up only unassigned tickets you can see and tickets of your teams." · "This ticket belongs to another agent. Only a supervisor can reassign it." · "A ticket goes to an agent or a team, not both." · "This agent can't own tickets in this ticket's department." · "That team doesn't serve this ticket's department." · "A ticket's owner and team can only be changed with Assign."
- Views: Unassigned Open Tickets, My Team's Open; filters Unassigned / No team; HQ Unassigned widget.
- Permissions: `desk:ticket:assign`, `desk:ticket:assign_unassigned`, `desk:ticket:view_unassigned`, `desk:ticket:pick_up`, `desk:ticket:bulk`, `desk:ticket:move`, `desk:ticket:share`, `desk:ticket:macro`.
- Other automation that sets the owner: Macros (Assign agent / team / Unassign), SLA escalation (Keep the owner / Assign to an agent / Assign to a team), Workflow action **Owner Assignment** (SpecificUser, UserField, Role, RoleRoundRobin — no team).

## API (all under `/api/v1`, `Authorization: Bearer …`, `x-app-key: desk`)
| Method | Path | Notes |
|---|---|---|
| GET | /desk/assignment-rules?department_id= | `{rules:[…]}` sorted by sort_order then name |
| POST | /desk/assignment-rules | create |
| PUT | /desk/assignment-rules/{id} | update |
| DELETE | /desk/assignment-rules/{id} | delete |
| PUT | /desk/assignment-rules/order | `{department_id, rule_ids}` |
| GET | /desk/assignment-rules/{id} | **405** |
| GET/PUT | /desk/departments/{id}/team-assignment | `{mode, capacity_limit, use_backlog}` |
| GET | /desk/agent-skills | `{skills, skill_options, agents:[{user_id,name,skills}]}` |
| PUT | /desk/agents/{id}/skills | `{skills:[…]}` |
| GET | /desk/assignment-backlog?department_id=&team_id= | list |
| POST | /desk/assignment-backlog/process | `{}` |
| GET/PUT | /desk/assignment/notification-settings | `{notify_agent_on_assignment, notify_team_on_assignment}` |
| POST | /desk/tickets/{id}/assign | `{owner_id, team_id}` |
| POST | /desk/tickets/{id}/pick-up | |
| POST | /desk/tickets/bulk/assign · /bulk/pick-up | |
| POST | /desk/tickets/{id}/move | |
| GET/PUT | /desk/agents/me/presence (+ /heartbeat, /sign-out) | availability |

404 on 6 Oct 2026: /desk/routing-preferences, /desk/round-robin, /desk/skills, /desk/skill-types, /desk/agents/online, /desk/agents/availability, /desk/agents/tickets-count, /desk/assignment/settings.

## Second, generic assignment-rule engine (CRM side)
- The `crm-workflow` locale also has `assignment.*` strings: module-level rules with "Applies to" channels ("Only Import and API assign records today"), rule entries, fallback (Leave unassigned / Default user / Users matching conditions), availability (Online status / Shift timing) and a follow-up task. This is the engine behind NDC-1585 (CRM import). Whether it is reachable for Desk Tickets was not checked.
