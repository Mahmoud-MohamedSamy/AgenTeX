# Round 12 part 2 tickets (5 Nov 2026)


---
## NDC-2275 · urgent · Desk
**Assignment Rules: Direct Assignment and Round Robin (requirements)**

About this item
Requirements for TAVI Desk Assignment Rules, compared with Zoho Desk → Setup → Automation → Assignment Rules. Reviewed and agreed on 14 Oct 2026.

Guiding rule: match Zoho Desk's behaviour everywhere. Where Zoho's help pages are silent, the item says so and states the behaviour we chose.

Each requirement has an id (for example DA-7), one rule in plain words, the Zoho behaviour it follows, what TAVI does today (Built, Partly built, Missing or Not checked) and its phase.

"Zoho (seen)" means it was seen on Zoho Desk's screen. "Zoho (docs)" means it comes from Zoho's help pages only.

Related items: NDC-1978 (Assignment rules and skills), NDC-1976 (agent online / offline status), NDC-1975 and NDC-1910 (working teams), NDC-1211 (CRM automation execution order bug), NDC-1980 (reassign on leave), NDC-1585 (CRM import assignment rule).

QA files (missing list with annotated evidence, Zoho notes, TAVI build map) are in the QA repository under docs/desk-assignment-rules.

1. Summary
Assignment rules decide who gets a ticket automatically, so tickets do not wait in the unassigned pool.
There are two different rule types. They have different settings, different behaviour and a different place in the automation execution order:
Direct Assignment rule — sends a matching unassigned ticket to one named agent or one team, and can move it to another department. It works across the whole organisation. It does not look at availability, thresholds or a backlog. It runs early, before workflows.

Round Robin rule — shares matching unassigned tickets across a pool of agents, with exactly one method per target: sequential, load based or skill based. It respects agent availability and thresholds, and uses a backlog. It works inside one department. It runs later, after workflows and SLAs.

Today TAVI has one list of rules per department. Each rule picks "An agent", "A team" or "Round robin" as its action, has its own "Capacity per agent", and runs only when a ticket arrives with no owner and no team. The existing feature is refactored to match Zoho: two rule types, each with its own list, settings and execution position, and thresholds set only in the department's Round Robin Preferences. Rules already saved are converted (section 11).
2. Goals
An admin can route tickets to a fixed agent or team by criteria (Direct Assignment).

An admin can spread tickets fairly across agents, by turn, by load or by skill (Round Robin).

Both rule types run in Zoho's execution order with the other automations, so results are predictable.

No ticket is lost: when nobody can take a round-robin ticket, it stays unassigned as a backlog ticket and, when the department allows it, is assigned later.

Every automatic assignment can be traced: the ticket history says which rule assigned it.

Rules saved before the refactor keep working after it.

3. Non-goals (for this document)
Manual assignment (owner field, Pick up, bulk Assign To, Move, Share). It already works and has its own bugs (NDC-1897, NDC-1898). It is only mentioned where rules depend on it.

Workflow rules, SLA, Macros, Blueprint and Supervisor rules as features. They are only covered for their position in the execution order and their effect on assignment.

AI owner prediction (Zia Field Predictions) — listed as a later phase idea only (QA missing list item 13).

Chat / IM routing (Omnichannel has its own routing).

Zoho Automation Studio (one Zoho page lists it after Notification rules; TAVI has no such feature).

4. Definitions
Unassigned ticket: a ticket with no owner and no team.

Event: one create or one update of a ticket. The whole order in EO-1 runs once per event.

Target: one "if these criteria match → do this" entry inside a rule. A rule holds 1 to 5 targets, and the first target that matches is used.

Method: how a round-robin target chooses an agent: Sequential, Load based or Skill based.

Pool: the agents a round-robin target can choose from (chosen agents, or a team's members).

Threshold: the most open tickets an agent may hold before round robin skips them. Set only in the department's Round Robin Preferences: one department wise number, and optional per-agent numbers that override it. It applies to all round-robin rules of the department. "Open" means any status that is not closed (open or on hold).

Backlog ticket: a ticket that matched a round-robin rule but found no eligible agent (all offline or at their threshold). It stays unassigned in its department. It is assigned later only by "Assign backlogs" (RR-15) or "Assign tickets on closure" (RR-16). As in Zoho, there is no separate backlog option on rules and no backlog page.

Online: the agent is available on the Email channel, according to the agent availability feature (NDC-1976).

5. Automation execution order
EO-1 — Zoho's order. When a ticket is created or updated, Desk runs the automations in exactly Zoho's order:
Skills based assignment — skills whose criteria match are added to the ticket (used by skill-based round robin, RR-18).

Direct Assignment rules

Workflow rules

SLA

Round Robin rules (sequential > load balancing > skill based — see EO-6)

Blueprint (not built in TAVI today; the step is kept for when it is)

Notifications

Two automations are not part of one event. Supervise (supervisor rules) runs on a timer, once an hour. Macros run only when an agent applies them. Zoho lists them after Blueprint in the same order. When one of them changes a ticket, that change is a new event.
Zoho (docs), assignment article: "Direct assignment > Workflow > SLA > Round robin (sequential > load balancing > skill based) > Blueprint > Notifications."

Zoho (docs), Automation FAQ: "Skills based assignment rule > Direct assignment rule > Workflow rules > SLA > Round robin assignment rule > Blueprint > Supervise > Macros", and "Supervise is triggered periodically and Macros are manually triggered by the user". The list above combines both pages.

TAVI today: Not checked. There is only one rule type, and its position relative to workflows and SLA is not documented in the app. See NDC-1211 for an earlier order bug.

Agreed in review: match Zoho exactly. Phase 1.

EO-2 — Each step sees the result of the steps before it. For example, a workflow whose criteria say "Ticket Owner is empty" must see the owner set by a Direct Assignment rule.
Zoho (docs): assignment rules can change the owner before a workflow's "Record Owner" alert is evaluated.

TAVI today: Not checked. Phase 1.

EO-3 — Round robin never overrides an owner set earlier. If a Direct Assignment rule, a workflow, a macro, an agent or the ticket's creator has already set an owner or a team, round robin leaves the ticket alone.
Zoho (seen): "The rule will not re-assign tickets that were assigned via other automations."

TAVI today: Partly built. TAVI rules run only on tickets "with no owner and no team"; the relation to workflows is not checked. Phase 1.

EO-4 — Later steps may change an owner set by a direct rule. A workflow (step 3) or an SLA escalation may change the owner that a direct rule set in step 2. The last change wins, and every change is in the ticket history.
TAVI today: Not checked. Phase 1.

EO-5 — The assignment notification goes to the final owner of the event.
Why this matters. In one event, more than one step can set the owner. Example: a direct rule sets owner A in step 2, then a workflow changes the owner to B in step 3. Without this rule, A would get "A ticket was assigned to you" for a ticket that is no longer theirs.

The rule. In Zoho, Notifications is the last step (step 7). So the assignee and team notifications (NOT-1, NOT-2) are worked out once, after all assignment steps, from the ticket as it is at the end of the event:
Only the final owner gets the assignee notification. In the example, B is notified and A is not.

If the event ends with a team and no owner, only that team's members get the team notification.

If the final owner is the agent who made the change themselves (for example, they picked the ticket up), nobody is notified (NOT-1).

If nobody changed the owner in the event, no assignment notification is sent.

The ticket history still shows every change, A and then B (GEN-10).

Workflow email alerts are different. A workflow alert such as "email the ticket owner" is an action of step 3. It goes to the owner at the moment the workflow runs (A in the example), because the workflow sees the result of step 2 (EO-2). This is Zoho's documented "Record Owner" behaviour, not a notification rule.

Later changes are new events. If an SLA escalation, a supervisor rule or the backlog later assigns the ticket, that is a new event and the new owner is notified then.

Zoho (docs): the order puts Notifications last. Zoho does not describe the two-owner case in words; this rule follows from the order.

TAVI today: Not checked.

Agreed in review: the notification goes to the latest assigned agent. Phase 1.

EO-6 — One method per round-robin target, list 

### Comments (2)
- 2026-11-03T23:26 9529016b-e67d-42b9-815c-263f673b8252: Progress, 3 Nov 2026. Every unit of this item is built and open as a pull request. Nothing is merged or deployed yet. The ticket state is unchanged.

Pull requests. Desk, in merge order: #214 (U1, Round Robin Preferences, Team Assignment switch, master switches), #215 (U2, two rule types, up to 5 targets, conversion of saved rules), #216 (U3, sequential order, SKIPPED agents, load and skill methods), #217 (U4, skills and direct rules run inside the save, before workflow rules), #218 (U6, criteria fields and operators), #219 (Phase 3, incoming backlog-first, 30-day rule, skill recalculation) and #220 (Phase 3, per-department email and mobile switches, unassigned-ticket alert). Client-engine: #770 (setup screen), #771, #772, #773 and #774. Metadata-engine: #204. Deploy repo grants: #142 and #143.

Deploy to staging. These ship as one batch: grants first, then desk #214 to #220, then client-engine #770 to #774, then metadata-engine #204. The old settings screen does not work with the new desk API, and the new screen does not work with the old one.

Verified. Each unit's test suites passed locally. The rule conversion and the new tables were tested on a real Postgres 16. Each unit had 10 to 30 mutation checks, and all were caught. The two largest units (U2 and U4) each had two independent code reviews, which led to 13 and 16 fixes. The screens were checked in English and Arabic, light and dark, at 1280 and 1440 wide, against mock data.

Not verified yet. Nothing ran on staging, and there was no end-to-end run with the real services together. The first checks after deploy:

- A workflow "Ticket Owner is A" fires on a ticket that a direct rule assigned to A.

- A direct rule sets A and a workflow sets B in the same save. Only B is notified.

- Saved rules appear in the two new lists in their old order.

- A sequential pool with one agent offline lists that agent as SKIPPED in History.

Decisions to confirm.

- Date conditions compare by UTC day, the same as workflow rules
- 2026-11-05T14:20 00a20184-a95d-4ad8-a9d9-6273a8ba704f: Live on tavi, checked on NDC Staging on 5 Nov. Moving to Ready For Test.
Where to test: Setup → Automation → Assignment Rules.

- The page tabs are Rules, Team Assignment and Notifications. Inside Rules, a switch picks Direct Assignment or Round Robin. Round Robin can be linked directly with ?view=round-robin and keeps its department selector and Preferences.

- Rules are reordered by dragging the grip at the start of each row, with the mouse or with Space and the arrow keys. A drop shows "Order saved.". This replaces the up and down buttons.

- A rule's criteria look like the workflow builder's: numbered conditions with AND / OR between them, "Criteria pattern ( 1 and 2 ) Edit Pattern", and "Tickets matching certain conditions / All Tickets". The same editor is used for SLA targets and skills.
Checked live: the tabs and the switch, a drag that saved and survived a reload (then put back), and the criteria layout with one and with two conditions (closed without saving). Nothing was left changed.

---
## NDC-2630 · high · CRM
**Email | A failed email send is shown as sent**

Summary
When an email sent from a record fails, the app tells the user it was sent. The screen shows "Sent" and the timeline logs "EmailSent", but the email never left: its status in the API is "failed". The record's Mails tab shows "No emails yet" and no notification follows, so the user has no way to know.
Steps to Reproduce
Open a QA lead that has an email address.

Click Send Email, pick the taviportal.com Zoho Mail connection, write a subject and body, and send.

Look at the toast, the Timeline tab and the Mails tab.

Read the email's status through the API.

Expected Result
When sending fails, the screen says it failed and why, the timeline does not log a sent email, and the email shows as failed on the record so the user can retry. Zoho shows failed emails with a reason on the record.

Actual Result
Toast "Sent"; the timeline logs "EmailSent".

Mails tab: "No emails yet". No notification.

API status "failed": "No Zoho account found for sender 'ndc-staging-owner@taviportal.com' … set the 'zoid' org id on the connection".

The connection itself still reports health "ok" and can_send = true.

Environment
Tenant: NDC-Staging — staging-crm.taviportal.com

Account: ndc-staging-owner (Owner)

Observed: 26 Oct 2026, CRM go-live Wave 4 (case M02). The test email to mahmoud.mmohamedsamy@gmail.com was not received.

Related: NDC-2496, NDC-1479 (the connection's missing Zoho org id is the reason this send failed).

Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (1)
- 2026-10-28T09:36 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 27–28 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, NDC-Staging, Edge (headless) + API; accounts: CRM Admin, test user 1, owner account through the automation
Sent as the owner (taviportal.com sender, Zoho connection without zoid): the send now answers 422 MAIL_SEND_FAILED with the reason, and the Mails list shows the email as "failed" with the error.
Checked:

- pre-check → can_send true, provider zoho — the sender is let through [FAIL]

- send → 422 MAIL_SEND_FAILED "No Zoho account found for sender 'ndc-staging-owner@…'" — no longer "Sent" [PASS]

- record Mails → status "failed", last_error with the reason [PASS]

- timeline → EmailSent, RecordCreated — the failed email is logged as sent [FAIL]

- own account (Gmail) → Compose says "You can't send email yet: no provider is connected for gmail.com…" [INFO]
Still failing:

- The timeline still logs "EmailSent" for the failed email.

- GET /emails/sendability still answers can_send true for this sender, so the screen lets the user try.
Evidence: NDC-2630-retest-PARTIAL.png (attached)

---
## NDC-2801 · high · Desk
**Tickets | Create Ticket offers every layout instead of only the layouts of the selected department**

Summary
Each Tickets layout is assigned to one or more departments in its Layout Properties. On Create Ticket, the layout dropdown ignores this and lists every layout, whichever Department is selected. An agent can create an HR ticket using a layout meant only for QA NDC Accounting.
Steps to reproduce
Go to Desk › Settings › Modules and Fields › Tickets › Layouts.

Open Layout Properties for "QA NDC Accounting". Under Departments, only QA NDC Accounting is ticked.

Go to Tickets and click + to create a ticket.

In Department, choose a different department, for example HR.

Open the layout dropdown next to Create Ticket and look at the layouts offered.

Choose "QA NDC Accounting".

Expected result
The layout dropdown lists only the layouts assigned to the selected department, plus layouts shared with all departments, such as Standard.

Changing the Department updates the list.

A layout meant only for QA NDC Accounting can't be chosen for an HR ticket.

Actual result
The dropdown lists every Tickets layout, whichever department is selected.

With Department set to HR, "QA NDC Accounting" can be chosen, and its form loads for the HR ticket.

Environment
staging-desk.taviportal.com › Tickets › Create Ticket; Settings › Modules and Fields › Tickets › Layouts

Edge 156.0.8078.48; Windows 10; 1272×866

Reporter Mahmoud Mohamed; captured 4 Nov 2026, 1:28 PM (Cairo)

Attachment
Attachment

### Comments (0)


---
## NDC-2803 · high · Desk
**Ticket Templates | Templates aren't tied to a layout: no department filter on the list and no Layout choice when creating a template**

Summary
In Zoho Desk, a ticket template belongs to a layout within a department. The Ticket Templates page is filtered by department, and creating a template asks for one of that department's layouts, whose fields the template then fills in. In TAVI Desk, templates belong only to a department, or to "All departments". The page lists every template with no department filter, the New template form has no Layout field, and it always offers the same fixed set of fields.
Steps to reproduce
Go to Desk › Settings › Ticket Templates.

Look at the top of the page for a department filter.

Click New template.

Look at the Department field and the options it offers.

Look for a Layout field, then scroll through Field values.

Expected result
The Ticket Templates page has a department dropdown at the top, and the list shows only that department's templates.

New template creates the template in the selected department and requires choosing a Layout from that department's layouts.

Field values shows the fields of the chosen layout.

On Create Ticket, Use template… offers only the templates of the selected department and layout.

Actual result
The page lists all templates together, with no department filter. Department is only a column.

New template asks for a Department, including "All departments = offered everywhere", but has no Layout field.

Field values shows the same generic fields whichever department is chosen. Department-specific fields, such as "QA NDC Number of assigned requests" and "QA NDC Transaction Type", appear for every template.

Environment
staging-desk.taviportal.com › Settings › Ticket Templates

Compared with Zoho Desk › Setup › Customization › Ticket Templates

Edge 156.0.8078.48; Windows 10; 1272×866

Reporter Mahmoud Mohamed; captured 4 Nov 2026, 1:20 PM (Cairo)

Attachment
Attachment

### Comments (0)


---
## NDC-2791 · high · Desk
**Layouts | "Mark as Required" on one layout makes the field required on every layout that has it**

Summary
In the ticket layout editor, "Mark as Required" on a field changes the field itself, not only the layout being edited. Every other layout that contains the field then shows it as required too. So a field cannot be mandatory on one department's form and optional on another's. NDC needs exactly that: in NDC's Zoho Desk, Agent id is mandatory on the Manual Invoice form and optional on Client Complaints. In total 12 NDC fields are like this, for example Description, Agency code, TKT number and IATA Source.
Steps to Reproduce
Go to Setup → Layouts and Fields → Tickets. Open layout "QA NDC Manual Invoice" in Edit Page Layout.

On field "QA NDC Agent id", choose Mark as Required. Save.

Open layout "QA NDC Client Complaints" in Edit Page Layout. This layout also has QA NDC Agent id and was never edited.

Expected Result
Agent id is required only on the Manual Invoice layout. On Client Complaints it stays optional until it is marked there, as in Zoho Desk, where each layout has its own mandatory setting (in NDC's Zoho, TKT number is optional on Client Complaints and mandatory on FLY-WT Refund).

Actual Result
On the Client Complaints layout, QA NDC Agent id is shown as required (red bar and asterisk), although it was only marked on Manual Invoice. The Client Complaints create form also shows it with an asterisk.

The field's own setting is now required = true for the whole module.

Saving is not consistent: a Manual Invoice ticket without Agent id is refused ("QA NDC Agent id is required."). A Client Complaints ticket without it is still saved, because that layout's stored copy was not refreshed. Any later save of the Client Complaints layout makes it required there too.

Environment
staging-desk.taviportal.com, NDC-Staging (company "Wonder Travel"), owner account, 3 Nov 2026. Checked on screen and through the API.

Zoho side: NDC's Zoho Desk (portal wondertravel), viewed read-only.

Found while rebuilding NDC's Zoho Desk setup on TAVI (related: NDC-2787).

Attachment
A-6-vs-zoho.png: TAVI layout editors (Manual Invoice and Client Complaints) next to NDC's Zoho Add Ticket forms.

### Comments (1)
- 2026-11-04T11:44 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 04 Nov 2026
Environment: staging-desk.taviportal.com, NDC-Staging (Wonder Travel), Edge; account: owner. Method: manual browser + API.
Note: this ticket was put in Ready For Test by mistake when it was filed (3 Nov); it had no fix comment. Retested anyway.
Checked:

- QA NDC Client Complaints (never edited) still shows QA NDC Agent id as required, in the layout editor and on the create form.

- Fresh repro: marked QA NDC TKT number required on the QA NDC FLY-WT Refund layout only → the field became required for the whole module (field config required = true).
Still failing — worse than on 3 Nov:

- A Client Complaints ticket without TKT number is now refused: 422 "QA NDC TKT number is required." (on 3 Nov it saved).

- A Customer Support ticket on the Standard layout, which does not contain the field, is refused: 422 "QA NDC Agent id is required." Marking a field required on one layout blocks ticket creation in every department. On NDC-Staging this blocked all ticket creation until QA cleared the flags (4 Nov ~11:00).
Expected: required applies only to the layout where it is marked.
Evidence: NDC-2791-retest-FAIL.png

---
## NDC-2794 · high · Desk
**Workflow Rules | Can't assign a ticket to a team and an agent of that team in one rule**

What is missing
A rule's Owner Assignment action takes users or teams, not both. With Teams the editor says "The ticket goes to the team and loses its owner." Owner Assignment can be added only once per rule ("A rule can have only one OwnerAssignment action"), and the Add action list doesn't offer it again.
Tested 3 Nov on NDC-Staging: one rule with Field Update Team = QA NDC Accounting team, plus Owner Assignment to a user. The ticket ended with the team set and no owner.
How NDC uses it (NDC's Zoho Desk)
Zoho's workflow action "Assign Ticket" with Assignee = Team with Agent puts the ticket in a team and gives it to a named agent of that team in one step. 19 NDC rules use it, e.g. Accounting → "ADM Assignment Airline OPS": when Status is Dep Manager and Responsible area is Airline OPS, it assigns the team and the agent and shares the ticket. This keeps the team queue right and also has one agent accountable.
Expected

- One rule can set both the team and an agent of that team. For example, Owner Assignment gets a "Team with agent" option, and the ticket keeps both values.
Environment
staging-desk.taviportal.com, NDC-Staging (Wonder Travel), owner, 3 Nov 2026. NDC's Zoho Desk viewed read-only. Part of NDC-2787 (item A-2).
Attachment
A-2-vs-zoho.png

### Comments (1)
- 2026-11-04T11:44 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 04 Nov 2026
Environment: staging-desk.taviportal.com, NDC-Staging (Wonder Travel), Edge; accounts: owner + a team member agent. Method: manual browser + API.
Checked:

- Owner Assignment → Teams now has "Also assign an agent of this team"; it saves as ownerTargetKind TeamWithAgent with the agent id.

- Picking an agent who is not in the team is refused: "Team with agent: the agent is not a member of the team." (The picker still lists every agent, not only the team's members.)
Still failing:

- The rule fired on ticket #929 (QA NDC Quality Assurance, team QA NDC Quality assurance, agent mahmoud.mahamed1515). The ticket got owner = the agent but team = empty.
Expected (also the editor's own text): "The ticket keeps the team and goes to this agent."
Evidence: NDC-2794-retest-FAIL.png

---
## NDC-2796 · high · Desk
**Layouts | A department can use only one ticket layout (agent can't pick the form)**

What is missing
A department can use only one layout of a module. In Layout properties of QA NDC ADM, ticking department QA NDC Accounting is refused: "A department can use only one layout of a module; 1 of these departments already use 'QA NDC Accounting'." So the second form of a department can't be used.
How NDC uses it (NDC's Zoho Desk)

- Accounting has two active layouts: "Accounting" (18 fields, normal requests) and "ADM" (42 fields, ADM disputes: IATA Source, ADM Number, Airline Code, ADM Reason, Amount, Issue/Billing Date…).

- NDC Finance has "NDC Finance" (17 fields) and "NDC Finance TKT" (31 fields, top-up requests).

- On Add Ticket in Accounting there is a Layout picker (Accounting / ADM, with ADM as the default). The form then shows that layout's fields and mandatory fields.
Expected (as in NDC's Zoho)

- A department can have several layouts.

- When creating a ticket in that department, the agent picks the layout, with the department's default already selected.

- The ticket keeps the chosen layout, with its fields, mandatory fields and layout rules.

- The layout can be changed on the ticket later.
Environment
staging-desk.taviportal.com, NDC-Staging (Wonder Travel), owner, 3 Nov 2026. The assignment was refused, so nothing changed. NDC's Zoho Desk viewed read-only. Part of NDC-2787 (item M-17).
Attachment
M-17-vs-zoho.png

### Comments (1)
- 2026-11-04T11:44 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 04 Nov 2026
Environment: staging-desk.taviportal.com, NDC-Staging (Wonder Travel), Edge; account: owner. Method: manual browser + API.
Works:

- QA NDC ADM and QA NDC Accounting both assigned to department QA NDC Accounting; ADM ticked as the department default (defaultDepartmentIds saved).

- Tickets keep their layout (the ADM ticket shows IATA Source, ADM Number, Airline Code, ADM Reason). A ticket created by API without a layout gets the default (ADM).

- Ticket ⋮ → Change Layout works and keeps the values.
Still failing:

- Create Ticket: picking department QA NDC Accounting leaves the layout on "Standard"; the department's default (ADM) is not pre-selected.

- The layout picker on the create form and in Change Layout lists all 11 layouts, not only the department's (Accounting, ADM). An Accounting ticket could be switched to the FLY-WT Refund layout, which is not assigned to that department.
Expected (as in NDC's Zoho): the department's default layout is pre-selected and only that department's layouts are offered.
Evidence: NDC-2796-retest-PARTIAL.png

---
## NDC-2774 · high · Desk
**Business Hours | With business hours set to Mon–Fri, blueprint state and SLA due times still count Saturday**

Summary
When the tenant's business hours are set to work only Monday to Friday, due times counted on business hours still count Saturday as a working day. This affects both blueprint state time limits on the "Business hours" clock and department SLA targets on business hours. The Business Hours page says "SLA policies, blueprints and supervise rules count time in them", so admins expect weekends to be skipped.
Steps to Reproduce
Setup → Business Hours: set the Default business hours to 24 hours, Monday to Friday (Saturday and Sunday off).

In department QA WF Dept R, have an active blueprint whose first state has a 5-day (120-hour) time limit on the "Business hours" clock.

Have a department SLA policy for the same tickets on business hours with resolution 120 hours.

On Monday 2 Nov 11:57, create a ticket that enters both.

Wait about 30 seconds, then open the ticket and look at the Steps card and the SLA card.

Expected Result
120 working hours from Monday 11:57 with Saturday and Sunday off ends on the next Monday, 9 Nov 11:57, for both the blueprint state and the SLA resolution.

Actual Result
Steps card: "Due Sat 11:57", "Warning Fri 11:57". That is exactly 5 calendar days. It is the final value: the API first returns a provisional time and recalculates it after about 25 seconds to the same Saturday.

SLA card, resolution: "Due 07/11/2026 11:57" — also Saturday — while the same card says "4 days 11 hours of business time left". Only about 108 working hours exist before that time.

A holiday on the default holiday list is skipped correctly. Only the non-working weekend days are counted.

In Zoho Desk, business hours define the working days, and time outside them is not counted by SLAs or blueprint state SLAs.

Environment
staging-desk.taviportal.com (org Anyware), department QA WF Dept R, ticket #1107

Owner account, 2 Nov 2026. Found in the Blueprint functional run (spec rows G6, K8).

Business hours were changed for a few minutes with approval and restored to 24×7, checked field by field. The QA blueprint, SLA policy and ticket were deleted.

Attachment — BP-BH-weekend-vs-zoho.png

### Comments (3)
- 2026-11-03T10:40 9529016b-e67d-42b9-815c-263f673b8252: Cause. The weekend counting itself is correct. The audit log shows the business hours were saved at 11:57:22 and the ticket was created under a second later. Desk kept the previous 24×7 hours in a one-minute cache, so the ticket was timed on them (holidays are read fresh, which is why they were skipped).
Fixed. Desk now drops its cached business hours the moment they change, so a ticket created right after a change counts on the new hours. Due times already worked out are not recalculated.
desk #207, deployed to staging on 3 Nov. Covered by unit tests; the live re-check is pending (two-factor sign-in on the test account).
- 2026-11-03T21:53 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 3 Nov 2026 → moved to Bug
Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge (headless) + API; account: ndc-staging-owner (Owner)
Method: API and screen
Weekend counting works once the new hours are picked up, but a ticket created in the first seconds after the business hours change is still timed on the old 24×7 hours (blueprint for 6–17 s, SLA for at least 17 s). Same timing as the original report, same wrong Sunday due date.
Checked:

- run 1 → blueprint due Sun 08 Nov 15:59; SLA first response Sun 08 Nov [FAIL]

- run 3, +0.6 s → blueprint and SLA due Sun 08 Nov 16:03 [FAIL]

- run 3, +6.1 s → blueprint and SLA due Sun 08 Nov 16:03 [FAIL]

- run 3, +16.8 s → blueprint Tue 10 Nov 16:08 (right); SLA still Sun 08 Nov [FAIL]

- run 2 → blueprint and SLA Tue 10 Nov 16:05–16:06 [PASS]

- restore → compared field by field: equal ×3 [INFO]
Still failing:

- run 1: expected Tue 10 Nov (weekend skipped), actual blueprint due Sun 08 Nov 15:59; SLA first response Sun 08 Nov

- run 3, +0.6 s: expected Tue 10 Nov, actual blueprint and SLA due Sun 08 Nov 16:03

- run 3, +6.1 s: expected Tue 10 Nov, actual blueprint and SLA due Sun 08 Nov 16:03

- run 3, +16.8 s: expected Both Tue 10 Nov, actual blueprint Tue 10 Nov 16:08 (right); SLA still Sun 08 Nov
Evidence: NDC-2774-retest-FAIL.png (attached)
- 2026-11-04T12:58 9529016b-e67d-42b9-815c-263f673b8252: Cause of the retest failure. The 3 Nov fix cleared Desk's saved business hours only when IAM's "business hours changed" message reached Desk. On staging that message arrives later than the window you tested. Until it arrived, Desk used the hours it had saved, up to a minute old. That is why tickets created in the first seconds after the change were timed on 24×7.
Fixed. Desk no longer keeps business hours from one request to the next. Every ticket's SLA and blueprint state due times are now worked out on the hours IAM holds at that moment. desk #227, deployed to staging on 4 Nov.
Please retest your runs 1 and 3. Change the default business hours to Monday to Friday, create a ticket at once (+0.6 s and +6 s), and check that both the Steps card and the SLA card skip the weekend.

---
## NDC-2754 · high · Desk
**Blueprint (with SLA tie-in): features Zoho Desk has that Desk is missing**

Summary
We compared Desk's new Blueprint feature, and how its step time limits work next to the SLA, with Zoho Desk (Enterprise trial, checked live). This ticket lists what Zoho has and Desk does not have yet. The feature spec is NDC-1974; it has only two lines and no requirements, so no item can be given a phase yet. SLA gaps already in NDC-2266 are not repeated here.
Already done in Desk
Blueprints page grouped by department, with layout, number of states, Draft badge and tickets in progress.

Activate, deactivate, include tickets, revoke tickets and delete (delete is refused while tickets are inside).

Drag to set the order; a ticket enters the first blueprint that matches.

One department and one layout per blueprint, with entry criteria or all tickets.

States are ticket statuses; Add State creates a new status. Up to 16 connections per state, same as Zoho.

Common transitions and continuous blueprints.

Save Draft, Save and Publish, and a list of problems to fix before publishing.

Before: owners can be agents, teams, the ticket owner, or another department with Full, Read only or Restricted access. Criteria decide when the button shows.

During: reply, comment, attachment, resolution, required fields, checklist and message, each required or optional, in the order you set.

After: field update, notification, task, webhook, Desk email and custom action.

Time limit per state with a warning, business or calendar clock, actions when it runs out, and an automatic move when it runs out.

A transition can run on its own when the customer replies or rates.

Ticket page: blueprint pill, progress bar, Steps card with due and overdue times. Status is locked and a reply does not close the ticket.

Revoke one ticket, a list of tickets, or all tickets. Ticket history shows every blueprint event.

Desk also has things Zoho does not have: include existing tickets at a chosen state, version history with restore, parallel steps, webhook and notification after-actions, actions at the warning time.

Missing — blueprint settings
Strict Mode: agents can act on the ticket and edit fields only through transitions (lock all, lock selected, or lock all except selected). Today only Status is locked.

Change transition owners from inside a ticket (Zoho "Dynamic Transition Owner Assignment"). Today owners are fixed in the blueprint.

Order of the transition buttons for each state (Zoho: drag and drop in the state settings). No order setting in the Desk designer.

Missing — during a transition
Field check with your own error message, for example "Amount must be more than 0". Today a field can only be required. The CRM designer has "validations", but Desk turns it off and fieldValidations is always empty in the API.

Submit for approval as a step in the transition.

Share the ticket with another department as a step the agent fills in. Today sharing only happens automatically for owners in another department.

Widgets (extensions) inside the transition form.

Save a half-done transition as a draft and finish it later. Today closing the form loses what was typed ("The reply and notes were not saved. Leave without saving them?").

Different required items for different agent groups (Zoho "Custom Mandatory").

Missing — automatic transitions
Run only on certain ratings (Good or Bad) or certain replies. Today "When the customer rates / replies, run" fires on any rating or reply.

Missing — state time limits (SLA tie-in)
Several escalation levels per state, each before, on or after the due time, with its own people and email template. Today a state has one warning and one set of actions when the limit runs out.

Choose which business-hours set (and holidays) a state counts in. Today only "Business hours" or "Calendar time", although Desk can have several business-hours sets.

Missing — where agents see results
Blueprint views in the ticket list: Active Blueprint Tickets, All Transitions, My Transitions, My Team Transitions, Unassigned Transitions. Today none, and no blueprint or state column or filter.

Blueprint dashboard: active and completed tickets, tickets and states over their time limit, met vs missed, average time per blueprint and per state, how often each transition runs. Today no blueprint report; /modules/{tickets}/blueprints/reports, /blueprints/{id}/stats, /desk/blueprints/dashboard and /desk/blueprints/reports return 404.

Missing — permissions
A separate "Revoke Blueprint" profile permission. Today one permission, desk:blueprints:manage, covers designing, including and revoking.

Could not be checked
The tenant's only business-hours set is 24×7 and both holiday lists are empty, so business and calendar time give the same due times. Please add a QA business-hours set (for example Sun–Thu 09:00–17:00 with one holiday), or allow us to add one, so we can test state time limits, warnings and automatic moves in business hours.

Whether a state on an On Hold status pauses the department SLA and the state's own timer. It needs transitions run on QA tickets. Please approve the functional run so we can test it.

Transitions on instant-messaging tickets. We could not see an IM channel. Please tell us if WhatsApp or Telegram is connected to a department so we can test a transition with a required reply on an IM ticket.

Additional notes
Not gaps: clone a blueprint, roles as transition owners and changing department as an action (Zoho has none of these); Zoho edition limits.

Same engine as CRM: NDC-2540, NDC-2420 and NDC-2730 will be re-checked on Desk in the functional run.

Possible bug to check separately: the On Hold state of "Demo · Refund approval" closes tickets after 3 days (the canvas shows "3d"), but the state panel shows "No limit", so saving the state may drop the auto-close.

Possible bug to check separately: the time-limit example always says "Monday to Friday, 9 to 5", although this tenant's business hours are 24×7.

Possible bug to check separately: the status "Reopened" has the type Closed, so a "Reopened" state may end the blueprint.

Possible bug to check separately: ticket #805 is inside a blueprint and still shows the "Close ticket" button.

Please add acceptance criteria to NDC-1974 so these items can be given phases.

Screenshots: TAVI vs Zoho side by side for every item are attached; the full report is docs/desk-blueprint/desk-blueprint-missing-list.html in the QA repository.

Test spec: docs/desk-blueprint/spec-desk-blueprint.md in the QA repository (Group Z rows Z1–Z15 = items 1–15).

Nothing was changed on the Desk tenant.

Environment
staging-desk.taviportal.com (org Anyware), Edge, 1 November 2026, owner account. Zoho Desk Enterprise trial, admin account.

### Comments (2)
- 2026-11-01T18:20 e1364b0b-d3cd-4167-8261-6194577a480a: The possible bugs in Additional notes are now filed separately: NDC-2755 (On Hold auto-close not shown in the state panel), NDC-2756 (time-limit example always uses a Monday to Friday, 9 to 5 week) and NDC-2757 ("Close ticket" shown on a ticket inside a blueprint). The "Reopened has the type Closed" note is no longer valid: the Reopened status was changed to the Open type on 1 Nov 2026.
- 2026-11-03T19:40 9529016b-e67d-42b9-815c-263f673b8252: Ten items are on staging-desk for retest. Items 1, 2, 5 and 6 went live on 2 Nov, after this ticket was filed; the rest went live on 3 Nov. The items not built (7, 8, 9, 11, 12, 13, 14) moved to NDC-2799.
Built earlier, fixed today

- Item 1, Strict Mode (Create Blueprint, Advanced): all, selected, or all except selected. On a strict ticket, agents also can no longer add or remove tags, delete a comment, or merge another ticket into it.

- Item 2, owners from inside the ticket: turn on dynamic owners in the blueprint, then "Assign owners" on the ticket (support administrators). A ticket in parallel steps offers every branch.

- Item 5, Submit for approval: a During item. Later transitions can check the ticket's approval status. Withdrawing the newest request clears that status.

- Item 6, Share: a During item with a default department and access. A share that adds or raises nothing is refused.
New

- Item 3, button order: open a state in the designer and reorder its transitions (drag or the arrows). Common transitions are listed too; moving one moves it on every state.

- Item 4, field check with your own message: in a transition's During list, "Add a check" under a field, for example Amount greater than 0 with "Amount must be more than 0".

- Item 10, ratings: under "When the customer rates", tick Good, Okay or Bad. For "certain replies", put criteria on the on-reply transition (any ticket field).

- Item 15, revoke permission: it is "Revoke tickets from their blueprint" (desk:ticket:blueprint_revoke), held by Supervisor and Administrator. It is now needed for every revoke, Setup's "Revoke tickets" included.

---
## NDC-2800 · medium · Desk
**Desk | Agents list: Departments column makes rows very tall, and Status, Role and Profile text breaks mid-word**

Summary
In Desk › Settings › Agents, the table is hard to read. The Departments column lists every department an agent belongs to in full, so an agent in many departments gets a row hundreds of pixels tall. The Status, Role and Profile columns are so narrow that their text breaks in the middle of words. With 10 agents, the list runs to about two screens and the pager sits at the very bottom.
Steps to reproduce

- Go to Desk › Settings › User Management › Agents.

- Look at the Active Agents list, including agents who belong to many departments, for example "Customer Experience Specialists 1" or "Dev Team 2".

- Look at the Status, Role and Profile columns.

- Scroll to the bottom of the list to reach the pager.
Expected result

- The Departments column shows a short summary, for example the first two departments plus "+38 more", with the full list in a tooltip or on the agent's page. Every row stays a similar, compact height.

- Status shows "Active" on one line.

- Role and Profile show whole words ("Manager", "Desk Administrator", "Desk Supervisor"), wrapping only at spaces or cut short with "…" and a tooltip.

- The pager can be reached without scrolling through about two screens.
Actual result

- The Departments column lists all of an agent's departments. "Customer Experience Specialists 1" and "Dev Team 2" each have about 40, which makes their rows about 470px tall.

- The Status pill breaks into "acti / ve".

- Role breaks into "Man / ager".

- Profile breaks into "Desk Admini / strator" and "Desk Superv / isor".

- Showing 10 of 11 agents takes about two screens, and the pager ("Rows per page", "Page 1 of 2") is at the very bottom.
Environment

- staging-desk.taviportal.com › Settings › User Management › Agents

- Edge 156.0; Windows 10

- Reporter Mahmoud Mohamed; captured 4 Nov 2026, 12:45 PM (Cairo)
Attachment
Annotated screenshot attached to this work item (NDC-agents-list-uiux-review.png).

### Comments (0)


---
## NDC-2799 · medium · Desk
**Blueprint: Zoho Desk features still missing after NDC-2754**

Summary
NDC-2754 listed 15 Blueprint features that Zoho Desk has and Desk did not. Items 1 to 6, 10, 3, 4 and 15 are built and are in NDC-2754 for retest. The items below are not built yet. The numbers are the ones in NDC-2754.
Not built
Item 8: save a half-done transition as a draft and finish it later. Today closing the form loses what was typed.

Item 9: different required items for different agent groups (Zoho "Custom Mandatory").

Item 12: choose which business-hours set (and holidays) a state counts in. Today only "Business hours" or "Calendar time".

Need a product decision first
Item 11: several escalation levels per state, each before, on or after the due time, with its own people and email template. Overlaps NDC-2266.

Item 13: blueprint views in the ticket list (Active Blueprint Tickets, All, My, My Team and Unassigned Transitions) and a blueprint or state column and filter.

Item 14: blueprint dashboard: active and completed tickets, over time limit, met vs missed, average time per blueprint and state, how often each transition runs.

Blocked
Item 7: widgets (extensions) inside the transition form. Desk has no extension platform yet (spec S-29).

Additional notes
"Run only on certain replies" (part of item 10) is covered through the on-reply transition's criteria, which can test any ticket field. A rule on the reply's own text or channel is not built; add it here if QA needs it.

NDC-1974 still has no acceptance criteria, so these items have no phase yet.

### Comments (1)
- 2026-11-04T12:31 9529016b-e67d-42b9-815c-263f673b8252: Items 8, 9, 11, 12, 13 and 14 are built and live on staging-desk.taviportal.com. Item 7 (widgets) stays blocked: Desk has no extension platform yet. Please retest:

- Item 8, drafts: open a transition, type a reply and tick a checklist item, click Save draft and close. The transition button shows "Draft". Reopen it: what you typed is back. Close a typed form: you get Save draft, Discard or Keep editing. Move the ticket to another state and back: the draft is gone and the form says so. Run the transition: the draft is gone.

- Item 9, Custom Mandatory: in the designer, on a required field, checklist item or Desk item, choose "Required for some agents and teams" and pick an agent. That agent cannot run the transition without it; another owner can.

- Item 11, escalation levels: on a state with a time limit, add up to 4 levels (before, at or after the limit, with an offset), each with agents, teams, the ticket owner or the transition owners, and an SLA escalation email. Each person gets the email and a bell at that time. Leaving the state in time sends nothing more.

- Item 12, business-hours set: on a state that counts business hours, pick a business-hours set. The worked example and the due time follow that set and its holidays. This needs the QA business-hours set asked for in NDC-2754.

- Item 13, views: the ticket list has Active Blueprint Tickets, All Transitions, My Transitions, My Team Transitions and Unassigned Transitions. Manage Columns has a Blueprint column, and the filters have Blueprint (with None).

- Item 14, dashboard: Analytics, Dashboards, Blueprints. Range, blueprint and department filters; active and completed tickets, over limit now, met and missed, average time per blueprint and state, and runs per transition.

Known limits: the Blueprint column cannot be sorted yet; the dashboard does not time each parallel branch separately.

---
## NDC-2752 · medium · Desk
**Desk Skills: missing functions vs Zoho Desk**

Goal
Make Desk Skills work like Zoho Desk. An admin defines skills with a type, criteria and agents, and Desk adds the matching skills to each ticket. Skill-based round robin then sends the ticket to an agent who holds them. This ticket lists only the skills setup that is still missing. Routing rules are in NDC-2275 (RR-9, RR-18).
Already in TAVI Desk (checked 1 Nov 2026)
Setup → Assignment Rules → Skills tab with Preferences: "Add skills to tickets by their criteria" (off by default), and where added skills go (top, bottom, or the order of the list).

Skill types: add, rename and delete. Deleting a type keeps its skills and leaves them untyped.

Each skill has a type, a description and criteria (AND / OR). A skill removed from the field shows "Removed from the field", with Clear.

Skills are the options of the Tickets "Skills" field, added and renamed in Modules & Fields.

Agent Skills tab: tick the skills each agent holds.

Skill-based round robin: only agents who hold every skill on the ticket are eligible, and offline agents are skipped.

Workflow actions: Add skills, Remove skills (1–25), Recalculate skills, Reassign ticket based on skills.

Missing compared with Zoho Desk
Skills per department. Zoho sets skills, the skill preference and the skill order per department (up to 30 active skills per department), and maps agents to skills per department. TAVI has one list and one set of preferences for the whole company.

Active / Inactive status. In Zoho, an inactive skill is not added to tickets and is not used for assignment. TAVI has no status; the only way to stop a skill is to delete the field option.

Add Skill on the Skills page, with a required type. Zoho's Add Skill asks for Skill Name and Skill Type (both required), Description, Criteria and Agents, and a type can be added inline. TAVI has no Add Skill button: the name comes from Modules & Fields and the type is optional.

Agents on the skill form. Zoho: "Associate agents with this skill…". TAVI: agents can only be picked one agent at a time on the Agent Skills tab.

Search and filters. Zoho has separate Skills and Skill Types tabs, with filters for Name, Skill Type, Agents and Status. TAVI shows a plain list with no search or filters.

Reorder skills. Zoho reorders skills per department, and its "order in settings" placement follows that order. TAVI offers the "list order" option but has no way to reorder.

Recalculate and assign one ticket. Zoho can run Recalculate Skills and skill-based assignment on a single ticket. TAVI has these only as workflow actions.

Show where a skill is used. Zoho lists the rules that use a skill. TAVI gives no warning about the workflows or rules that still use a deleted skill.

Limits. Zoho allows at most 10 skills on a ticket, with the first having the highest priority. TAVI has no limit on the field, and the workflow action allows 25.

Evidence
01-skills-list-vs-zoho.png: Skills page, TAVI vs Zoho (Add Skill, Skill Types tab, filters and status, department, preferences).

02-skill-form-vs-zoho.png: skill form, TAVI vs Zoho (name, required type, description, criteria, agents).

tavi-01-skills-tab.png, tavi-02-agent-skills-tab.png, tavi-03-skill-editor.png: TAVI screens, 1 Nov 2026.

### Comments (2)
- 2026-11-04T17:08 00a20184-a95d-4ad8-a9d9-6273a8ba704f: All nine items are built and in review. Nothing is merged or deployed yet.
PRs, in deploy order:

- anware-deploy #146 (DB grants)

- metadata-engine #209: desk owns the Skills options, a ticket holds at most 10 skills, and Modules & Fields shows the skills read-only

- desk #229 + #230 (merge together): skills per department, a backfill that copies today's skills into every department, Active/Inactive, the 30-active cap, reorder, agents saved in one step, the delete warning, Recalculate and Assign by Skills on one ticket, and the 10-skill trim

- api-gateway #61, workflow #132 (where-used, action limit 10), client-engine #783
As in Zoho, Skills is now its own Setup page (Setup > Customization > Skills), with Skills, Skill Types and Agent Skills tabs. Assignment Rules keeps only the skill-based method.
Verified by scoped test suites, mutation checks, Postgres tests of the backfill, and screens checked in mock mode (light, dark, Arabic). Not yet tried on tavi.
- 2026-11-05T10:40 00a20184-a95d-4ad8-a9d9-6273a8ba704f: Live on tavi since 4 Nov and checked on NDC Staging (Customer Support) on 5 Nov. Every check passed, and the test data was removed afterwards. Moving to Ready For Test.
Where to test: Setup → Customization → Skills (its own page now, as in Zoho). It has Skills, Skill Types and Agent Skills tabs and a department selector. Each department starts with the skills the company had before, typed "General", with the same agents.
Notes for testers and the release note:

- A ticket holds at most 10 skills. A ticket that already has more keeps them until a skill change touches it.

- A workflow rule whose Add Skills or Remove Skills action lists more than 10 skills must be trimmed before it can be saved again.

- The Skills options in Modules & Fields are read-only now. Add, rename and delete skills on the Skills page.

- Recalculate Skills and Assign by Skills are in the ticket's More menu.

---
## NDC-2137 · low · CRM
**Custom Views | Kanban headers + first cards p95 5.1 s (target 2 s)**

Summary
Kanban headers + first cards p95 5.1 s (target 2 s).
Found by test case CVS-L09 - Kanban column headers and first cards render within 2 s at p95.
Steps to Reproduce
Before you start:
Logged in as the Owner (Tenant Owner).

Deals Kanban view 'QA CV perf-board' by Stage with Amount aggregate exists.

Open 'QA CV perf-board' and reload it 20 times.

For each load, record the time until every column header (count and sum) and the first cards are shown.

Compute the p95.

Test data:
Loads: 20

Target: p95 ≤ 2 s

Expected Results
The 95th-percentile time to headers and first cards is within 2 seconds.
Actual Results
Deals Kanban 'QA CV deals-by-stage' (Stage, Amount; 12 columns), 20 reloads until all column headers with Amount totals and at least one card are shown: p95 5100 ms, median 2290, min 1261, max 26045.

Target 2 s p95 missed.

Environment
staging-crm.taviportal.com, tenant NDC-Staging (time zone Africa/Cairo), Chromium, 5 October 2026. Accounts: CRM Admin (in place of the Owner role), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views). Test case CVS-L09, run execu_2026-10-05_11-20-40.
Attachments
L09-vs-zoho.png: annotated screenshot (TAVI on the left, with the comparison table).

L08-L09-timings.png: original TAVI screenshot (20 reloads).

### Comments (4)
- 2026-10-14T03:08 e1364b0b-d3cd-4167-8261-6194577a480a: <p><b>Triage (code review, 2026-10-14): one demonstrable over-fetch, but the spread needs measuring.</b></p><p>Confirmed from the code: opening a board issues one summary request plus one request per column, each asking for 100 records — so a 12-column board makes 13 calls and fetches up to 1,200 rows to paint first cards. That is a fair thing to cut (a smaller first page per column, with the existing infinite scroll filling in).</p><p>What I cannot conclude from code is the reported spread: a 2.3 s median against a 26 s maximum looks like server or contention variance, not a fixed client cost.</p><p><b>Please attach:</b> (1) per-request timing for the summary and the column calls (HAR), (2) the same board with <code>per_page=25</code> versus <code>100</code> for server-side comparison, and (3) whether the 26 s case coincided with other load. I will then reduce the first-page size and, if the time is server-side, hand the query plan to metadata-engine.</p>
- 2026-10-26T13:20 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
Transactions kanban, three reloads: column headers after 2.4, 2.4 and 3.4 seconds, first cards after 3.0, 4.5 and 4.2 seconds. The target is 2 seconds (it was 5.1), so it is better but not there yet.
Also seen on 26 Oct, not part of this ticket: every kanban column says "This value is no longer an option of the field", columns show keys such as Closed_won, and cards show "Resolving owner…".
Environment: staging-crm.taviportal.com, owner account; timings from the manual run on 25 Oct (case KB-04).
Annotated TAVI-vs-Zoho image attached: NDC-2137-retest.png
- 2026-11-02T15:36 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 2 Nov 2026 (not fully testable today — state unchanged)
Environment: staging-crm.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test users (CRM User profile)
Method: API and screen
Could not time the board with real data: switching list → Kanban took 0.65–0.71 s, but the board was filtered to 0 cards; full reloads took 28–90 s on staging today.
Checked:

- switch to Kanban → 0.65 / 0.65 / 0.71 s (board filtered to 0 cards) [INFO]

- reload → 28–90 s per page [INFO]
Evidence: NDC-2137-retest-BLOCKED.png (attached)
- 2026-11-03T21:54 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 3 Nov 2026 → moved to Bug
Environment: staging-crm.taviportal.com, tenant NDC-Staging, Edge (headless) + API; account: ndc-staging-owner (Owner)
Method: API and screen
Deals (Transactions) Kanban, 20 reloads: column headers with Amount and first cards appear at p50 6.2 s, p95 12.5 s (min 3.1, max 13.5). The app frame is up in about 1 s, so the board itself takes p95 10.2 s. Target p95 2 s.
Checked:

- p95 headers + cards → 12.5 s (p50 6.2 s, min 3.1 s, max 13.5 s) [FAIL]

- board after app frame → p95 10.2 s, p50 5.3 s [FAIL]

- app frame → 0.7–4.8 s [INFO]

- history → slower today [INFO]
Still failing:

- p95 headers + cards: expected p95 ≤ 2 s, actual 12.5 s (p50 6.2 s, min 3.1 s, max 13.5 s)

- board after app frame: expected ≤ 2 s, actual p95 10.2 s, p50 5.3 s
Evidence: NDC-2137-retest-FAIL.png (attached)

---
## NDC-2643 · low · Desk
**Activities | Add Task / Call / Event drawer fields and reminder options have no accessible names**

Summary
In the Add Task / Add Call / Add Event drawer the visible labels are not linked to their controls, so a screen reader announces nothing useful: Subject, Due Date and Description have no name, Ticket and Contact are both "Choose a record…", and Priority and Status are both "Select". The reminder options (on the due date / before / at a time) are unlabelled radio buttons.
Steps to Reproduce
Open Activities › Add Activity › Task.

Inspect the controls (or Tab through them with a screen reader).

Open a task and click Set Reminder; inspect the timing radios.

Expected Result
Every control is named after its label (Subject, Ticket, Due Date, Task Owner, Contact Name, Team, Priority, Status, Description; reminder timing options).

Actual Result
input "Subject": no name, placeholder only; Due Date and Description: no name.

Ticket and Contact Name: both "Choose a record…"; Priority and Status: both "Select".

Reminder radios: values at / before / custom, no label.

Environment
Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

Account: Desk Agent fedelav803

Observed: 26 Oct 2026, case ACT-O3

Reference: Zoho Desk Add Task form (live): every field has a visible label; its screen-reader names were not checked

Evidence: annotated image attached (drawer + DOM dump).

### Comments (1)
- 2026-11-03T13:54 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 2 Nov 2026 → moved to Bug
Environment: staging-desk.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test user 3 as Desk Agent
Method: API and screen
Most Add Task fields now have accessible names, but three dropdowns (Task Owner, Priority, Status) still have none.
Checked:

- Subject / Department / Due Date → named [PASS]

- Team / Description / Set Reminder → named [PASS]

- Task Owner / Priority / Status → no accessible name [FAIL]

- Ticket / Contact Name → not exposed as named controls [FAIL]

- reminder options → not checked [INFO]
Still failing:

- Task Owner / Priority / Status: expected Named after their labels, actual no accessible name

- Ticket / Contact Name: expected Named, actual not exposed as named controls
Evidence: NDC-2643-retest-PARTIAL.png (attached)

---
## NDC-2776 · low · Desk
**Company profile | A long phone number gives "An unexpected error occurred", and the phone has no length limit**

Summary
The Phone field on the company profile has no length limit. A very long number makes the save fail with a server error, and a 40-digit number is saved as if it were valid. Zoho Desk limits the field to 20 characters.
Steps to reproduce

- Open Setup › General › Company and press Edit.

- Type a 300-digit number in Phone and press Save.

- Type a 40-digit number in Phone and press Save.
Expected result
The phone field accepts only a real phone number (Zoho stops typing at 20 characters). An invalid value shows a clear message under the field, and the page never shows a server error.
Actual result
The 300-digit number shows "An unexpected error occurred." and nothing is saved (HTTP 500 INTERNAL_ERROR, twice). The 40-digit number is saved without any message.
Additional notes

- Zoho Desk (checked live, then set back): the Phone field stops at 20 characters and saves normally.

- Website: the screen correctly says "Enter a valid website URL", but the API saves "not a url" with 200. Zoho also saves "not a url" as a website, so this part is only a note.

- The values were set back after the test. The image shows TAVI on the left and Zoho on the right.

- Found in the Desk go-live retest, Wave 1 (W1-B1). Also reproduced on the Anyware tenant through the API on 1 November.

Environment
staging-desk.taviportal.com, NDC-Staging tenant (Wonder Travel), Edge, 2 November 2026, owner account.

### Comments (0)


---
## NDC-2399 · low · Desk
**CRM - Desk Integration | No notice to the admin when the initial sync finishes**

Summary
After Connect, the initial customer and contract imports run and finish, but the admin gets no bell entry or email saying the sync is complete.
Steps to reproduce
Desk → Settings → CRM ⇄ Desk Integration → Disconnect, then Connect.

Wait for the initial imports to finish (Sync History or GET /api/v1/desk/integrations/crm/runs).

Check the admin's notifications.

Expected result
The admin is told when the initial sync is done (NDC-1669 §4). Zoho sends an email with added / updated / ignored counts and the skip reasons.
Actual result
Runs initial_customers and initial_contracts finished within seconds; no notification since the connect.
Evidence
Annotated image CD-07 (executions/execu_2026-10-20_crm-desk-integration/evidence/CD-07-no-initial-sync-notice-vs-zoho.png) is attached or will be attached to this ticket.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), Edge + API, 20 and 21 October 2026 (two approved reconnects), owner account.
Additional notes
Spec row B11; the Zoho report is also listed as a missing feature in NDC-2392; PRD NDC-1669.

Full bug report: executions/execu_2026-10-20_crm-desk-integration/bug-report.html (CD-07) in the QA repository.

### Comments (3)
- 2026-10-26T09:16 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: —
Needs Disconnect + Connect of the shared staging integration to see the initial-sync notice; not run without explicit OK.
Checked:

- Disconnect + Connect, wait for the initial imports → Not run — needs approval to reconnect the shared integration (approval covered pause/resume/settings only) [BLOCKED]

- Next step → Ask at Gate 2; run once approved [INFO]
Still failing:

- Not run — needs approval to disconnect/reconnect the integration.
Not run: needs Disconnect + Connect of the shared staging CRM ⇄ Desk integration; the test agent safety check refused it. State left in Ready For Test.
Evidence: NDC-2399-retest-BLOCKED.png
- 2026-10-26T10:14 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 26 Oct 2026 (second retest; the first was not run)
Environment: staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) · account mahmoud.mahamed1515 (Desk Administrator)
Method: Manual browser (Desk › Settings › CRM ⇄ Desk Integration › Disconnect, then Connect) + API
Checked:

- Admin told when initial sync is done → 2 bell notices ("CRM customer/contract sync finished: …") within seconds of the runs [PASS]

- Counts → "0 added, 0 updated, 5 could not sync" — 14 skipped (ignored) customers missing [FAIL]

- Skip / failure reasons → Notice says "The Failure Log lists the records that could not sync" — none of the 7 are there; no reasons anywhere [FAIL]

- Bell title → Truncated to "…finished: 0 added, …" in the list [INFO]

- Email → Not checked — no access to the admin mailbox [INFO]

- Settings after reconnect → Config identical to the backup except import timestamps [PASS]
Still failing:

- Step 3: expected added / updated / ignored counts, actual "0 added, 0 updated, 5 could not sync" — the 14 skipped customers of the run (requested 19, skipped 14, needs_attention 5) are not mentioned.

- Step 3: expected skip reasons, actual the notice says "The Failure Log lists the records that could not sync", but the Failure Log has none of the 7 records from this run (still 19 entries, newest 07:30 UTC, before the reconnect at 08:05 UTC).
Evidence: NDC-2399-retest-PARTIAL.png (attached)
- 2026-11-03T14:42 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 3 Nov 2026 → moved to Bug
Environment: staging-crm / staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · admin mahmoud.mahamed1515, agent fedelav803, owner ndc-staging-owner
Method: API and screen
After Disconnect (done by the user) and Connect, the admin now gets a bell notice per initial sync with added / updated / ignored / could-not-sync counts and the reasons. But the Failure Log does not match the notices: it shows 25 "could not sync" (none from this run) while the notices report 42, and its Skipped filter shows only the contract sync (0 skipped), not the customer sync's 21 ignored records.
Checked:

- reconnect → connected, not paused, contacts / accounts / deals mapped [INFO]

- runs → both finished (partially_completed) within ~35 s [INFO]

- customer notice → "CRM customer sync finished: 11 added, 1 updated, 21 ignored, 40 could not sync" + reasons (27 required field empty, 9 linked record in recycle bin, 4 already linked) [PASS]

- contract notice → "CRM contract sync finished: 0 added, 0 updated, 0 ignored, 2 could not sync" + reason (missing required values) [PASS]

- Failure Log → 25 listed, newest 13:49 local (before the 14:29 connect); the 42 from this run not listed [FAIL]

- Skipped filter → only "Contract sync · 0 skipped"; the customer sync's 21 ignored not shown [FAIL]

- email → not checked (no access) [INFO]
Still failing:

- Failure Log: expected Lists the records that could not sync, actual 25 listed, newest 13:49 local (before the 14:29 connect); the 42 from this run not listed

- Skipped filter: expected Lists the ignored records, actual only "Contract sync · 0 skipped"; the customer sync's 21 ignored not shown
Evidence: NDC-2399-retest-PARTIAL.png (attached)