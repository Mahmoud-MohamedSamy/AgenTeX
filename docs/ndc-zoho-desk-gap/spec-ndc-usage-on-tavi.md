# Test spec: NDC's Zoho Desk usage replayed on TAVI Desk

**Date:** 2 Nov 2026 (updated after the second read-only pass) · **Purpose:** prove that TAVI Desk can run what NDC does today in Zoho Desk. Every case below copies a real NDC setting or process found in NDC's Zoho (two read-only passes, 2 Nov 2026). Gap ids (M-xx, V-xx) refer to `ndc-zoho-vs-tavi-missing.md`.
**Type:** manual test spec (no automation in this deliverable).

## 0. Environment and rules
- **TAVI:** https://staging-desk.taviportal.com, tenant **NDC-Staging ("Wonder Travel")**. Owner ndc-staging-owner@anyware.software; Desk admins/agents from `docs/Credentials/TAVI Desk Credentials.csv` (A = owner, B = mahmoud.mahamed1515@gmail.com, C = fedelav803@meinvr.com, D = pacox68754@meinvr.com Desk Supervisor, E = pobit51574@meinvr.com).
- **Reference:** NDC Zoho Desk (portal wondertravel), **read-only**: look, never save. Use it to compare behaviour and screens; take Zoho screenshots for every failed case (TAVI vs Zoho side by side).
- **Test data:** prefix `QA NDC `; create the NDC-like departments below, delete or disable everything at the end; restore any setting changed. Mail only to mmohamed@anyware.software and mahmoud.mmohamedsamy@gmail.com.
- **Priorities:** P0 = NDC cannot go live without it · P1 = daily process · P2 = setting parity.
- **Verdicts:** Pass / Fail / Blocked (feature missing) / Inconclusive. A Blocked case is reported against its M-gap, not filed as a new bug.

## 1. Preconditions: NDC-like setup on TAVI (build once, reused by all groups)
| Step | Build on TAVI | Copied from NDC |
|---|---|---|
| P-1 | Departments `QA NDC Manual Invoice`, `QA NDC Financial approval`, `QA NDC Accounting`, `QA NDC Quality Assurance`, `QA NDC Tahrir Branch`, `QA NDC GDS B2B` | NDC departments with the most tickets and automation |
| P-2 | Agents: B, C in Manual Invoice; D, E in Financial approval; team `QA NDC AR Team` (D, E) and `QA NDC Manual Invoice team` (B, C) | NDC teams per department (57 teams) |
| P-3 | Ticket statuses (with type): Supervisor check (On Hold), Reject (Closed), Closed Duplicated (Closed), Dep Manager (On Hold), Finance team after Validation (On Hold), Distributor (Open), AR Team (On Hold), Refund approved (Closed), Refund rejected (Closed), Pass Audit (Closed), Rejected Audit (Open), Review Audit Manager (Open) | 12 of NDC's 41 statuses |
| P-4 | Custom ticket fields: Related Branch (picklist, 29 values), Feedback (picklist: Pass / Fail / Need review), Transaction Type (picklist, 11), Need to issue invoice (picklist Yes/No), Airline Names (picklist, **185 values**), ADM Number (number), ADM Reason (picklist, 17), Amount (currency), Refund Amount (decimal), Responsible (multiselect, 8), Booking Number / PNR (text), Rejection Reasons (multi-line), Monitoring date/time (date-time), Agent Email (email), Season request (boolean) | NDC ticket fields (183 in total) |
| P-5 | Custom module `QA NDC Airline-IATA Data` (Airline name, IATA code, email) + ticket lookup field "Airline / Iata lookup" | NDC custom module + lookup |
| P-6 | Layout `QA NDC MAC Invoice` (second layout in Manual Invoice) | NDC has 2 layouts in Manual Invoice |
| P-7 | Contact custom fields: Air Line Name, Air Line Code, Mail Box - To, Mail Box - CC | NDC contact fields |

## 2. Test cases

### Group A: Channels and intake (M-01, M-02, V-09, V-13)
NDC facts behind this group (pass 2): phone tickets are typed in by agents (no call threads, the phone system is not connected to Desk), mostly NDC Finance top-ups and Manual Invoice; chat tickets come from real online chat; only 3 IM channels are active ("NDC Portal outbound" WhatsApp on Reissue-Ref, the "FlyWT" IM Talk web widget, a WhatsApp sandbox); Telegram is off.
| Id | P | Case | Steps | Expected (as NDC works in Zoho) |
|---|---|---|---|---|
| A-01 | P0 | Phone ticket logged by agent | B creates a ticket in QA NDC Manual Invoice with Channel = Phone, contact, PNR, Transaction Type | Saved; channel Phone; appears in list filters and reports by channel (V-13) |
| A-02 | P0 | Phone volume list performance | Open All Tickets and a "Channel = Phone" view on a tenant seeded with ≥ 50 K tickets (or the largest available) | List < 3 s, counts shown, paging works (NDC: 1.36 M phone tickets) |
| A-03 | P0 | Fast manual logging | Log 10 phone tickets in a row with "Save and New" and a ticket template; time each one | Each < 30 s from blank form to saved; template prefills department, layout and status; no forced reload between tickets |
| A-04 | P0 | Live chat → ticket | Customer starts a chat on the widget; agent answers; chat ends | Chat thread becomes a ticket with channel Chat in the right department; "Missed Chats" view lists unanswered chats. Blocked if missing (M-01) |
| A-05 | P0 | WhatsApp outbound | Agent sends an outbound WhatsApp from a Reissue-Ref ticket (as "NDC Portal outbound") | Customer receives it; the thread shows delivery status (M-02) |
| A-06 | P0 | WhatsApp reply in | Customer answers the outbound message | Reply lands on the same ticket, channel = the IM channel name |
| A-07 | P1 | Web chat widget (IM Talk equivalent) | Visitor writes in the "FlyWT" style web widget on a test page | Ticket in Wonder travel with the conversation; agent reply reaches the widget (NDC: about 17 K tickets) |
| A-08 | P1 | Support email per department | Configure `qa-ndc-mi@…` for QA NDC Manual Invoice; send an email to it | Ticket in Manual Invoice, channel Email; reply goes out from that address (NDC: 25 addresses, one per department) |
| A-09 | P1 | Help center ticket | Submit a ticket on the help-center portal in Arabic | Ticket created, channel Web, Arabic text intact |
| A-10 | P2 | Feedback widget per department | Create a feedback widget for QA NDC Tahrir Branch, submit it | Ticket lands in that department (NDC: Moussa Tech, Religious Tourism widgets) |
| A-11 | P1 | Secondary contacts (CC) | Add a CC contact on the ticket; reply | CC receives the reply; CC sees the ticket in the help center |
| A-12 | P1 | Send as Email | Agent sends an outbound email to a new contact | Ticket created; contact gets no "new ticket" acknowledgement |
| A-13 | P1 | Scheduled reply | Schedule a reply on an email ticket for +1 day, then cancel | Listed in Scheduled Replies; cancel leaves nothing sent |

### Group B: Ticket data model (V-01 … V-04, M-09)
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| B-01 | P0 | 41 statuses with types | Add all 41 NDC statuses (list in report §1) with their types | All saved; status picker shows them; "Open / On Hold / Closed" views and SLA timers follow the type |
| B-02 | P0 | Status type behaviour | Move a ticket to "Pass Audit" (Closed type) and to "AR Team" (On Hold type) | Pass Audit counts as closed (closed time set, leaves open views); AR Team pauses SLA like On Hold |
| B-03 | P1 | Large picklists | Create Airline Names with 185 values and Language with 191; pick values on create, edit, filter, bulk update | Picker searchable, all values saved, filter works |
| B-04 | P1 | Field types | Save a ticket with currency, decimal, multiselect, date-time, email and boolean custom fields | Values stored and shown in the locale format; invalid email refused |
| B-05 | P1 | 165 custom fields on one module | Add custom fields until the module has ≥ 165 | No limit hit; create form and detail page still load < 3 s |
| B-06 | P1 | Lookup to custom module | Pick an airline from `QA NDC Airline-IATA Data` on a ticket | Lookup saved; the airline record lists the ticket |
| B-07 | P1 | Several layouts per department | Create a ticket with layout "QA NDC MAC Invoice" in Manual Invoice | That layout's fields shown; switching layout keeps shared values |
| B-08 | P1 | Layout rule | Rule: Transaction Type = "Ancillary" → show and require Ancillary Type | Field appears and is required only for Ancillary (NDC layout rule on Transaction Type) |
| B-09 | P1 | Layout rule on Status | Rule: Status = Reject → show Rejection Reasons | Shown only when Status = Reject |
| B-10 | P0 | Validation rule | Rule: Status = Reject → alert "Please add a clear rejection reason" | Saving Reject without a reason shows the alert and blocks the save (NDC's only validation rule) |
| B-11 | P2 | Contact custom fields | Fill Air Line Name/Code and Mail Box To/CC on a contact | Saved and shown on the contact and in the ticket's contact panel |

### Group C: Routing and assignment (V-06, M-08)
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| C-01 | P0 | Direct assignment to team | Rule in QA NDC Manual Invoice: on Create, Status is Open → team "QA NDC Manual Invoice team" | New ticket gets that team |
| C-02 | P0 | Direct assignment by Created By | Rule target: Created By = B → owner = C | Ticket created by B is owned by C (NDC "Complaints" rule) |
| C-03 | P1 | Direct assignment by layout | Rule: Layout = QA NDC MAC Invoice → agent B | Only MAC-layout tickets go to B |
| C-04 | P1 | Assignment moves department | Rule target in another department | Ticket moved and assigned there (2 NDC rules move tickets) |
| C-05 | P0 | Round robin load balance to agents | RR in Financial approval: Status = Open → load balance D, E | Tickets alternate by open load; nobody exceeds the other by > 1 |
| C-06 | P0 | Round robin load balance to teams | RR target = team QA NDC AR Team | Team set, then a member by load |
| C-07 | P1 | Sequential to team | RR sequential target | Members get tickets in fixed order |
| C-08 | P1 | Special targets | RR targets for Is Overdue / Is Escalated / Response Overdue / Happiness = Bad | Matching tickets go to the senior agents listed |
| C-09 | P1 | Skill-based assignment | Skill "GDS" on D only; ticket with skill GDS | Assigned to D |
| C-10 | P1 | Idle agent offline | Agent idle 20 min (NDC setting "treat idle agents as offline") | RR skips the idle agent |
| C-11 | P0 | Agent pickers at scale | Owner / approver / team pickers on a tenant with > 200 agents | All agents searchable, not cut at 200 (NDC 478 active, M-05) |
| C-12 | P1 | Agent in many departments | One agent member of 10+ departments (NDC average 9.3, max 57) | Department switcher, queues and pickers work; only those departments' tickets visible |

### Group D: Workflows (V-05)
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| D-01 | P0 | Share by branch on create | QA NDC Quality Assurance workflow "GDS B2B": on Create, Related Branch is "GDS B2B" AND Feedback isn't "Pass" → Share Ticket to QA NDC GDS B2B | Ticket shared to GDS B2B; agents there see it under shared tickets; pattern (1 and 2) respected |
| D-02 | P0 | Share not triggered | Same rule, Feedback = Pass | Not shared |
| D-03 | P0 | Share on field change | On Edit when Related Branch or Status changes → share | Changing Related Branch shares to the new branch; editing another field does nothing |
| D-04 | P1 | 22 sibling rules | Create the branch rules for 5 branches in one department (NDC has 22 per department) | Each ticket shared only to its branch; rule list order kept |
| D-05 | P0 | Assign Ticket action (team + agent) | Client Complaints style: on Create → Assign Ticket to team "QA NDC AR Team" and agent D | Team and owner both set by the workflow |
| D-06 | P1 | Send Email Reply action | Client Complaints style: on Create → send a "Formal Complaint" reply to the contact and CC a manager address (mahmoud.mmohamedsamy@gmail.com) | Contact and manager get the letter; the thread shows it as sent from the department address |
| D-07 | P0 | Field update: move to team and unassign | NDC Finance "Ticket owner -1" / "Waiting Top-Up Manager": on Status change → set Team = QA NDC AR Team, Owner = unassigned | Team changes, owner cleared, ticket appears in the team queue |
| D-07b | P1 | Field update: close when no invoice | Manual Invoice "No need to issue invoice": Need to issue invoice = No → Status = Closed | Ticket closed by the rule, closed time set |
| D-07c | P1 | Email alert | Workflow on Edit → email alert to a named agent (NDC Tahrir "Ticket Closure") | One alert per run |
| D-08 | P1 | Triggers on conversation events | Workflow on customer reply / agent response / comment added / happiness rating | Fires once per event |
| D-09 | P2 | Skill-based assignment action | Workflow action "execute skill based assignment" | Ticket re-assigned by skills |
| D-10 | P1 | Reopen workflow | Airline Operations "reopen": on customer reply to a Closed ticket → Status Open | Ticket reopened |

### Group E: Blueprints (approval chains, M-07)
Build each blueprint on **Status** in its department and run every transition.
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| E-01 | P0 | "2nd check" (Manual Invoice) | States Open → Supervisor check → Closed / Reject / Escalated / On Hold / Closed Duplicated (11 transitions) | Only allowed transitions shown; owner = ticket owner |
| E-02 | P0 | "Financial approvals" (11 states) | Open → AR Team → KSA accounting team / BSP / UAE Accounting Team → Refund amount request → Refund approved / Refund rejected → Closed | Each step owned by the right team; Status follows the state |
| E-03 | P0 | "ADM" (Accounting, 18 transitions) | System Admin → Finance team after Validation → Distributor → Governance → Dep Manager → Closed, with Escalated and HR Escalation | Transitions named like NDC (e.g. "Human Mistake", "Supplier Mistake dispute") appear only in their from-state |
| E-04 | P0 | Transition owner = team | A transition owned by QA NDC AR Team | Only team members see the button; others see "waiting for AR Team" |
| E-05 | P0 | Mandatory "during" fields | Transition "Refund approved" requires Refund Amount + Refund Method | Cannot complete without them |
| E-06 | P0 | After-transition field update + alert | After "Supervisor check → Closed": set Staff Action = Done and email the owner | Both happen once |
| E-07 | P1 | Escalation in a state | State SLA 2 h, escalate to supervisor | Escalation fires and notifies |
| E-08 | P1 | Clients' Financial Investigations (24 transitions) | Run the longest path end to end | No dead end; history lists each transition |
| E-09 | P1 | Blueprint + sharing | A ticket shared into another department while in a blueprint | Shared department can see it; only owners can transition |

### Group F: SLA, notifications, templates (V-07, V-08)
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| F-01 | P1 | Priority-based SLA | Department SLA: High 1 h / Medium 3 h resolution | Due times set; violated view lists late tickets |
| F-02 | P1 | Custom SLA by criteria | "Manual invoice SLA" for Transaction Type = Manual invoice; "seasons requests" for Season request = true | Right SLA chosen per ticket |
| F-03 | P1 | SLA pauses on On Hold statuses | Move to "AR Team" (On Hold) for 30 min | Due time pushed by 30 min |
| F-04 | P1 | Notification rules as NDC sets them | In QA NDC Manual Invoice turn ON only: assigning a ticket (agent + team), contact "new ticket" and "closing", department "new / moved / shared ticket", secondary-contact "reply"; leave the rest OFF | Exactly those send one email/bell each; nothing else is sent (NDC switches most notifications off; no SMS) |
| F-05 | P2 | Signature templates | Create "Airline ops signature EG" and "UAE.KSA" reply templates in QA NDC Airline Operations; insert one in a reply | Signature text inserted; only that department lists them (NDC's only 2 custom templates) |
| F-06 | P2 | Customer happiness as NDC sets it | Rating link on every reply and on close; survey on for one department; reopen on Bad rating | Link in the email; Bad rating reopens the ticket; rating shown on the ticket (V-15) |

### Group G: Daily agent work (V-10)
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| G-01 | P0 | Share ticket manually | Share with QA NDC Accounting read-only, then full | Accounting agents see it with the right rights |
| G-02 | P1 | Move ticket keeps layout data | Move from Manual Invoice to Financial approval | Layout mapping dialog; values kept; owner rule as in Zoho |
| G-03 | P1 | Time tracking (manual timer) | Start/stop the timer; add a manual entry | Time entry saved; ticket total updates |
| G-04 | P1 | Related tickets by PNR | Two tickets with the same Booking Number / PNR | Agent can see the related ticket (NDC extension "Related Tickets by Custom Fields", M-11) |
| G-05 | P1 | Customer ticket history | Open a ticket; check the contact's other tickets | Previous tickets listed (NDC extension "Customer Ticket History") |
| G-06 | P1 | Quality audit sheet | QA ticket with Knowledge / Ownership / Soft skills / Product picklists + comments, set Status = Pass Audit | All saved; Pass Audit treated as closed |
| G-07 | P1 | Bulk update at volume | Bulk-change Status on 200 tickets | All updated; bulk log row |
| G-08 | P2 | Arabic subjects and RTL | Ticket with an Arabic subject (e.g. "إلغاء وتعديل") in an Arabic-named department | Shown correctly in list, detail and search |
| G-09 | P1 | CRM sync of customers | Account, contact and product created in TAVI CRM appear in Desk; edit in CRM, check Desk | Synced both ways as configured (NDC: accounts, contacts, products from Zoho CRM) (V-14) |
| G-10 | P1 | Tickets in CRM related lists | Open a CRM record in modules like NDC's Transactions, Agency Services, Customers, Leads, Agency Code | Its Desk tickets are listed there (V-14) |

### Group H: Users, access, data (V-12, M-05, M-10, M-16)
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| H-01 | P1 | Role hierarchy | Roles CEO → Manager → Staff; Staff sees only own + subordinates' tickets where sharing is private | Visibility follows the hierarchy |
| H-02 | P1 | Custom profiles | Profiles Newbie Agent, Supervisor, Support Manager with different rights | Hidden buttons and API refusals follow the profile |
| H-03 | P1 | Light agents | Light agent can view and comment, not reply | Matches Zoho light agent |
| H-04 | P0 | 478 active agents | Agents list, search and export with > 200 users | Everyone listed (M-05) |
| H-05 | P1 | Attachment limits | Admin sets 40 MB / 40 files for agents; upload 41 MB and a 41st file | Both refused with a clear message (M-10) |
| H-06 | P2 | Data sharing public for custom modules | Airline-IATA module set to public | All agents can read records |
| H-07 | P2 | Anonymise a contact | Data subject request: anonymise a contact | Name/email replaced; tickets kept (M-16) |

### Group I: AI, reporting, extensions (M-04, M-06, M-11 … M-15)
| Id | P | Case | Steps | Expected |
|---|---|---|---|---|
| I-01 | P0 | Ticket summary | AI assist → Summarize ticket | Summary shown (NDC: Zia summary ACTIVE). Today: 404 |
| I-02 | P0 | Sentiment | Open a ticket with an angry customer reply | Sentiment shown |
| I-03 | P1 | Writing assistant / reply assistance | Draft assist "make formal", reply suggestions | Suggestions returned |
| I-04 | P1 | AI workflow action | Workflow uses an AI action (e.g. classify) | Runs and sets the field |
| I-05 | P1 | Field prediction | New ticket gets a predicted owner / priority | Prediction offered |
| I-06 | P0 | NDC's dashboards | Build the equivalents of NDC's Overview, Request, SLA, TOPUP and live chat dashboards | Each loads < 5 s; counts match the list views (NDC opened Overview on 2 Nov, Request on 1 Nov) |
| I-07 | P1 | NDC's custom reports | Agent Performance, Help Desk, tickets overall, Tickets by departments (summary reports); export | Figures match the list views; export downloads |
| I-08 | P2 | Gamescope | Trophy "Quick Responder" (first response < 20 min) | Points awarded (M-13) |
| I-09 | P2 | Agent attendance | Agent check-in / check-out | Recorded (M-11) |
| I-10 | P2 | Cliq / remote support | Notify a Cliq channel; start a remote session | Blocked unless built (M-14, M-15) |

### Group J: End-to-end NDC journeys (run last)
| Id | P | Journey |
|---|---|---|
| J-01 | P0 | **Manual invoice:** agent logs a phone ticket in Manual Invoice → direct assignment to team → round robin to agent → "2nd check" blueprint → Supervisor check → Closed (or "No need to issue invoice" closes it) → SLA met → dashboard shows it. |
| J-02 | P0 | **Refund approval:** live-chat request → ticket in Financial approval → Status validation (Reject needs reason) → "Financial approvals" blueprint through AR Team → Refund approved (mandatory Refund Amount) → alert to owner → closed. |
| J-06 | P0 | **Top-up (NDC Finance):** agent logs a phone ticket → workflow moves it to the top-up team and clears the owner → status Waiting Top-Up Manager → Approved / Not Approved E-Top-Up Manager → closed. |
| J-03 | P0 | **Quality audit + sharing:** QA ticket with Related Branch = GDS B2B and Feedback = Fail → workflow shares to GDS B2B → branch agent replies → QA sets Pass Audit → closed. |
| J-04 | P1 | **ADM dispute:** Accounting ticket with ADM Number/Reason/Amount → ADM blueprint "Human Mistake" path → HR Escalation → closed after HR investigation. |
| J-05 | P1 | **Chat to ticket:** live chat → missed chat → ticket → agent follow-up by email. |

## 3. Coverage map
| Gap | Cases |
|---|---|
| M-01 Live chat | A-04, J-02, J-05 |
| M-02 IM (WhatsApp outbound, web widget) | A-05, A-06, A-07 |
| V-13 Phone logged by hand (was M-03) | A-01, A-02, A-03, J-01, J-06 |
| V-14 CRM sync and related lists | G-09, G-10 |
| V-15 Customer happiness | F-06 |
| M-04 AI | I-01 … I-05 |
| M-05 Agent scale | C-11, C-12, H-04 |
| M-06 Reporting | I-06, I-07 |
| M-07 Blueprints | E-01 … E-09, J-01 … J-04 |
| M-08 Round robin | C-05 … C-10 |
| M-09 Layout/validation rules | B-08, B-09, B-10 |
| M-10 Attachment limits | H-05 |
| M-11 Extensions | G-04, G-05, I-09 |
| M-12 Translation | A-09, G-08 |
| M-13 Gamescope | I-08 |
| M-14/M-15 Assist/Lens/Cliq | I-10 |
| M-16 Privacy | H-07 |
| V-01 … V-12 | Groups A, B, C, D, F, G, H |

Dropped after pass 2 (NDC does not use them): telephony / click-to-call, Telegram, tags, ticket approvals, time-entry reporting. Keep them for the general Desk go-live waves, not for NDC.

## 4. Reporting
Per group: verdict table, evidence (TAVI screenshot + NDC Zoho screenshot for every Fail), and a list of Blocked cases per gap. Bugs go to Plane only after review (assignees, Bug state, Desk module, current sprint). Gaps already in NDC-2760 are referenced, not re-filed.
