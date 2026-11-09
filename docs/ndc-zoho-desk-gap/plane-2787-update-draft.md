# Draft (not posted): update to NDC-2787

**3 Nov, later:** the items below are now filed as their own work items (Backlog, Desk, Sprint 14, related to NDC-2787, each with a TAVI vs NDC Zoho image): M-18 NDC-2792 (Urgent; remove the limit per module+department or make it configurable per tenant in the control plane), A-3 NDC-2793, A-2 NDC-2794, A-1 NDC-2795, M-17 NDC-2796, A-9 NDC-2797, M-21 NDC-2798. **M-20 dropped:** re-tested 3 Nov, Owner Assignment → Teams clears the owner ("The ticket goes to the team and loses its owner"), so a workflow can send a ticket back to the team queue. If 2787 is updated, it should only link these tickets.

**Where it goes:** a new section appended to the NDC-2787 description (everything already there stays), plus a short comment.
**Fields:** unchanged (Backlog, High, same assignees, Desk, Sprint 14).
**Left out on purpose (user, 3 Nov):** assignment-rule items (direct and round robin will be rebuilt), the blueprint start-state note,
and the workflow-status-in-blueprint behaviour (already NDC-2764). Per-layout mandatory fields are filed separately as bug NDC-2791 (A-6).

---

## Section to append to the description

### Rebuild of NDC's setup on TAVI (3 Nov 2026)
We rebuilt NDC's core Zoho Desk setup on NDC-Staging (all objects prefixed "QA NDC", kept as the NDC reference setup): 8 core departments
(Manual Invoice, NDC Finance, Financial approval, Accounting, Quality Assurance, Client Complaints, Clients' Financial Investigations,
FLY-WT Refund) + the 23 branch departments their workflows share into, 32 teams, 41 statuses, 94 custom fields, 10 layouts, 7 layout
rules, 1 validation rule, 6 blueprints (81 transitions), 42 of 80 workflows, 9 SLA policies, 240 notification settings. Then smoke tickets.

**Works like NDC:** custom statuses with types, large pick lists (up to 188 values), decimal / currency / date fields, a layout assigned to a
department, layout rules (show fields / sections, require fields — enforced on save), the "Reject needs a reason" validation rule,
blueprints with team / ticket-owner transitions, required fields and after-actions, share-ticket workflow (QA ticket shared to its branch),
SLA policies with NDC targets and escalations, per-department notification rules.

### Missing: Workflow rules
- **M-18 Workflow rule limit (P0).** NDC has 92 workflow rules, 90 active, all but 2 changed in 2024–2026 (80 active in the 8 core
  departments alone). TAVI stops at 50 rules per module for the whole tenant; the 51st is refused ("Module has reached the limit of 50
  rules") and nothing on the Workflow Rules page shows the limit or how many are used. 38 of NDC's core rules could not be created.
  *Expected:* the limit is shown on the Workflow Rules page with the number used, and it can be configured per tenant (at least NDC's 92).
- **M-20 Clear the ticket owner from a workflow.** NDC Finance's rules "Ticket owner -1", "Ticket owner -2", "R1", "R2" use a Field
  Update that sets Team = a team (e.g. Top-up Managers) and Ticket Owner = Unassigned, so the ticket goes back to the team queue for any
  member to pick up. TAVI's workflow Field Update refuses the owner field and no other action clears it, so the ticket stays with the
  previous agent. *Expected:* a workflow can set Ticket Owner to Unassigned (alone or together with a team).
- **A-3 Trigger "on create, or when these fields change".** In Zoho a rule can run when the ticket is created and later only when chosen
  fields change (e.g. QA "GDS B2B" runs on create and when Related Branch or Status changes). 38 of NDC's core rules use it. TAVI offers
  on create / on any edit / on create or any edit / when fields change (edits only): "when fields change" misses the creation (Manual
  Invoice "Close Ticket" did not fire on a new ticket), and "create or any edit" fires on every edit. *Expected:* an "also run on create"
  option on the field-change trigger.
- **A-2 Assign to a team and an agent in one rule.** Zoho's workflow action "Assign Ticket → Team with Agent" puts the ticket in a team and
  gives it to an agent of that team in one step (19 NDC rules, e.g. Accounting "ADM Assignment Airline Ops"). TAVI allows only one
  assignment action per rule ("A rule can have only one OwnerAssignment action"), so it is team or agent, not both. *Expected:* one rule can
  set the team and the agent.
- **A-1 Same rule name in different departments.** NDC reuses rule names ("GDS B2B", "GDS B2C", "Airline Ops", "LCC", "KSA"…) in up to 4
  departments; Zoho keeps names unique per department. TAVI requires names unique per module ("A rule named … already exists"). Low
  priority — renaming works around it. *Expected:* names unique per department.

### Missing: Layouts and statuses
- **M-17 More than one layout per department.** In NDC's Zoho one department can have several ticket forms and the agent chooses the form
  when creating a ticket: Accounting has "Accounting" (18 fields, normal requests) and "ADM" (42 fields, ADM disputes); NDC Finance has
  "NDC Finance" (17 fields) and "NDC Finance TKT" (31 fields, top-up requests). TAVI allows one layout per department; adding a second is
  refused ("A department can use only one layout of a module"), so the ADM and top-up forms cannot be used by their departments.
  *Expected (as in NDC's Zoho):* a department can have several layouts; when creating a ticket in that department the agent picks the
  layout (the department's default layout is pre-selected); the ticket keeps the chosen layout, its fields, mandatory fields and layout
  rules; the layout can be changed on the ticket later.
- **A-9 Ticket statuses per department.** In NDC's Zoho, Setup → Ticket Status is chosen by department first, then by that
  department's layout (e.g. Accounting → Accounting / ADM). So each department, and each of its forms, has its own status list:
  Manual Invoice 8, Accounting → ADM 10 (Open, On Hold, Escalated, Closed, System Admin, Dep Manager, Finance team after Validation,
  Distributor, Governance, HR Escalation), NDC Finance → NDC Finance TKT 6, Financial approval 13, Clients' Financial Investigations 13,
  FLY-WT Refund 8; Client Complaints, Accounting (Accounting form) and NDC Finance only Open / On Hold / Escalated / Closed. Each status
  also has a fall-back-to-default setting. TAVI has one tenant-wide list of 41 statuses for every department: Setup has no department
  (or layout) picker for statuses. A per-layout list can be saved on the layout through the API, but a ticket with a status outside it is
  still accepted. *Expected (as in NDC's Zoho):* statuses are set per department (and per layout within it); a ticket is offered and
  accepts only its department's or layout's statuses.

### Missing: Notifications
- **M-21 Team notification when a comment is edited.** NDC's Quality Assurance department has "Team Notification → Editing a comment"
  switched on. TAVI's notification rules have team notifications for assigning, replies, adding a comment and mentions, but not for an
  edited comment. *Expected:* a team notification rule for an edited comment. Low priority.

**Not tested yet:** email delivery, SLA escalation timing and notification delivery. Layouts were also checked on screen on 3 Nov
(this found NDC-2791).

Full report: docs/ndc-zoho-desk-gap/ndc-on-tavi-mimic-report.md (QA repo).

---

## Comment to post
Rebuilt NDC's core Zoho Desk setup on NDC-Staging ("QA NDC" prefix, kept as the reference setup) and smoke-tested it. Added the missing
items found: workflow rules (50-rule limit — P0, clearing the owner, "on create or field change" trigger, team + agent assignment, rule
names per department), more than one layout per department, per-department ticket statuses, and the team notification for edited
comments. Per-layout mandatory fields: filed separately as bug NDC-2791.
