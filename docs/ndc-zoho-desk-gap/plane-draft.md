# Plane: filed as NDC-2787 on 2 Nov 2026 (this file is the source text)

**Project:** NDC · **Type:** Task (gap list) · **State:** Backlog · **Priority:** High
**Assignees:** MahmoudMohamed, mfathy, Hegazy, eahmed · **Module:** Desk · **Cycle:** Sprint 14 · **Start:** 2 Nov 2026
**Related:** NDC-2760 (general Desk missing list), NDC-2000, NDC-2004, NDC-2005, NDC-2364, NDC-2068, NDC-2754, NDC-2275, NDC-2752, NDC-2753, NDC-2013, NDC-2230, NDC-2231, NDC-2535, NDC-1988

---

## Summary
We read NDC's live Zoho Desk (portal wondertravel) read-only on 2 Nov 2026 and compared it with TAVI Desk. NDC runs about 2.5 M tickets: phone 54 % (typed in by agents), chat 33 %, email 4 %. It has 74 departments, 478 active agents, 183 ticket fields, 41 statuses, 92 workflows and 5 approval blueprints.
Six gaps block NDC go-live and nine more affect daily work. Each is described below with how and why NDC uses it.
"Why" comes from NDC's own setup and ticket data; where it is our reading of the data and not confirmed by NDC, it says "likely".

---

## NDC flow in Zoho Desk
1. **Request comes in.** Agents log most requests themselves as Phone tickets (finance top-ups, manual invoices). Customers also open them by live chat on the website, WhatsApp, the FlyWT web widget, email (25 department mailboxes) and the help center.
2. **Ticket lands in a department with its own form.** Each of the 53 active departments has its own layout (80 in total) with travel and finance fields: PNR, airline (208 values), ADM number, refund amount, GL, bank deposit. Layout rules show extra fields by Transaction Type or Status.
3. **Routing.** 30 direct-assignment rules send the new ticket to a team or agent (by Status, Created By, Layout or Staff Action). 24 round-robin rules then spread it across agents or teams by load. Overdue, escalated and badly rated tickets go to senior agents.
4. **Workflows move work between departments.** 75 workflows share the ticket into the branch named in "Related Branch" (QA, Financial approval, Client Complaints, Financial Investigations). NDC Finance workflows move tickets to the top-up team and clear the owner. Others close the ticket when "no need to issue invoice", reopen it on reply, or send a "Formal Complaint" email to the customer with a manager in copy.
5. **Approval chain (blueprint on Status).** Finance, refund and dispute tickets walk through a fixed chain: Open → Supervisor check / AR Team / Dep Manager → Refund approved or rejected → Closed. Each step is owned by the ticket owner or a team, asks for mandatory fields, and updates fields and alerts people after the step.
6. **Validation.** Status "Reject" cannot be saved without a rejection reason.
7. **SLA.** Priority-based and custom SLAs (Airline services, Manual invoice, seasons requests) set due times; violated tickets get their own views.
8. **Quality audit.** QA re-checks tickets with a scoring sheet (knowledge, ownership, soft skills, process) and ends them as Pass Audit / Rejected Audit. 965 K tickets are "Pass Audit".
9. **Close and notify.** Only a few notifications are on (assignment, new ticket, closing, shared or moved ticket). Customers can get a happiness rating link.
10. **Manage.** Managers watch the Overview, Request, SLA and TOPUP dashboards and four custom reports. Zia AI summarises tickets, detects sentiment and helps write replies.

---

## Missing features — P0 (blocks NDC go-live)

### M-01 Live chat channel
- **What it is:** a chat widget on NDC's websites; each chat becomes a ticket, and unanswered chats show in a "Missed Chats" view.
- **How NDC uses it:** 842 K chat tickets (33 % of all). 46 of the last 50 came in as real online chats, mainly into Manual Invoice, Manual Invoice MAC, Airline Operations, Emergency and FLY-WT Refund. NDC also has a custom "live chat" dashboard.
- **Why NDC uses it:** it is NDC's second-largest channel. Customers and agencies (likely) use it for quick invoice, refund and emergency travel requests.
- **TAVI today:** in development (NDC-2000).

### M-02 WhatsApp and web chat widget (instant messaging)
- **What it is:** WhatsApp Business and a web messaging widget connected to Desk, so messages become tickets and agents reply from the ticket.
- **How NDC uses it:** 3 channels are active: "NDC Portal outbound" (WhatsApp, Reissue-Ref department), "FlyWT" (Zoho IM Talk web widget, Wonder travel, about 17 K tickets) and a WhatsApp test number. Telegram and other WhatsApp numbers are switched off.
- **Why NDC uses it:** the outbound WhatsApp number lets the reissue/refund team contact customers first. The FlyWT widget (likely on the Fly WT consumer site) handles B2C customer support.
- **TAVI today:** missing. TAVI's workflow engine already has "reply via IM" and "notify via IM" actions, but there is no channel setup (NDC-2000, NDC-2760).

### M-04 AI on tickets
- **What it is:** AI summary, sentiment, writing assistant, reply suggestions, an AI step in workflows, and prediction of ticket owner and priority.
- **How NDC uses it:** Zia generative AI is active for sentiment, writing assistant, reply assistance, summary and the Zia workflow action. Field prediction (owner, priority) is active, and a ChatGPT extension is installed.
- **Why NDC uses it:** to read long finance threads faster and write replies in a consistent tone across 478 agents (likely).
- **TAVI today:** every AI call returns 404 on NDC-Staging and the panel shows "Something went wrong". No AI workflow action and no field prediction (NDC-2004, NDC-2005).

### M-05 Agent scale
- **What it is:** agent lists, owner pickers, approver pickers and team members that work with hundreds of agents, each in many departments.
- **How NDC uses it:** 886 agents (478 active). Each active agent belongs to 9.3 departments on average, up to 57. 428 use the Agent profile; roles are Staff (422), CEO (39), Manager (14).
- **Why NDC uses it:** one operations workforce serves every branch and finance team, so agents work across many departments.
- **TAVI today:** the user list stops at 200 rows and ignores paging, so pickers cannot reach all of NDC's agents. Multi-department membership at this depth is untested. Bug not filed yet.

### M-06 Dashboards and reports
- **What it is:** dashboards and reports in Desk for ticket volume, SLA, agent performance and custom views.
- **How NDC uses it:** 12 dashboards. Overview was opened on 2 Nov and Request Dashboards on 1 Nov; SLA, a custom TOPUP and a live chat dashboard also exist. There are 4 custom summary reports (Agent Performance, Help Desk, tickets overall, Tickets by departments) plus the standard ones.
- **Why NDC uses it:** managers follow daily volume, SLA breaches and top-up approvals across 53 departments.
- **TAVI today:** reports and dashboards are not confirmed; both pages redirect to Headquarters (NDC-2364, NDC-2068).

### M-07 Blueprint behaviour for approval chains
- **What it is:** a guided process on the Status field: allowed transitions only, an owner per transition, mandatory fields during a step, field updates and alerts after it, and escalation per state.
- **How NDC uses it:** 5 active blueprints with 81 transitions: ADM (Accounting, 18 transitions), 2nd check (Manual Invoice), Financial approvals (11 states), Clients' Financial Investigations (24 transitions), flywt-refund. 74 transitions are owned by the ticket owner and 11 by a team. 63 field updates and 32 alerts run after transitions, and 10 transitions ask for mandatory fields.
- **Why NDC uses it:** refunds, ADM disputes and invoices move money, so each step must be done by the right team, in order, with the right data.
- **TAVI today:** built, with open defects from the 1 Nov blueprint run (NDC-2754..2758, NDC-2761..2764, NDC-2774, NDC-2775).

---

## Missing features — P1 (daily process)

### M-08 Round-robin variants
- **What it is:** automatic assignment that balances load across agents or teams, in order, or by skill, with special targets and online-only rules.
- **How NDC uses it:** 24 rules: 12 load-balance to agents, 14 load-balance to teams, 1 sequential, 1 skill-based. Separate targets catch overdue, escalated, response-overdue and "Bad"-rated tickets. Agents idle 20 minutes count as offline.
- **Why NDC uses it:** to spread a high ticket volume evenly and send problem tickets to senior agents.
- **TAVI today:** partly built (NDC-2275, NDC-2752); idle-to-offline not verified.

### M-09 Layout rules and validation rule
- **What it is:** form rules that show or require fields based on other values, and save-time checks.
- **How NDC uses it:** 10 layout rules on Mistake category, Status, Ticket Type, Number of Traveling Tickets, Transaction Type and Responsible Dep for investigation. One validation rule: Status = Reject needs a rejection reason.
- **Why NDC uses it:** finance and airline forms are long; rules keep each form short and make sure rejections are explained.
- **TAVI today:** partly built (NDC-2230, NDC-2231, NDC-2535, NDC-1988).

### M-10 Attachment limits
- **What it is:** admin limits on attachment size and count, separately for agents and end users.
- **How NDC uses it:** 40 MB per file and 40 files per ticket for agents, with separate end-user rules.
- **Why NDC uses it:** to stop oversized uploads of ticket scans and bank documents (likely).
- **TAVI today:** no admin setting; a 200 MB upload was accepted on 2 Nov (NDC-2753).

### M-11 Extension functions NDC installed
- **What it is:** add-ons from the Zoho marketplace.
- **How NDC uses it:** 9 installed: Related Tickets by Custom Fields, Customer Ticket History, Ticket Insights, Customer Insights, Agent Attendance Tracker, Ticket Assignment, Geolocation, ChatGPT, Zoho Calendar.
- **Why NDC uses it:** to find other tickets with the same PNR or ticket number, see a customer's history, and track agent attendance (likely; to confirm with NDC).
- **TAVI today:** no marketplace. Customer history and calendar exist; related tickets by a custom field, attendance tracking and geolocation are missing (NDC-2013).

### M-12 Help Center auto-translation and Arabic content
- **What it is:** automatic translation of help-center content and tickets.
- **How NDC uses it:** help-center translation is set to automatic (Google); Arabic (ar-EG) is configured.
- **Why NDC uses it:** NDC serves Arabic- and English-speaking customers in Egypt, KSA and UAE.
- **TAVI today:** ticket translation missing; KB translations not confirmed (NDC-2005, NDC-2760).

### M-13 Gamescope
- **What it is:** points and trophies for agents.
- **How NDC uses it:** 4 trophies: Quick Responder (first response within 20 min), SLA Saver, Smile Reaper (good ratings), Rapid Resolver.
- **Why NDC uses it:** to motivate fast first responses and SLA compliance (likely).
- **TAVI today:** missing (NDC-2760).

### M-14 Remote support
- **What it is:** screen sharing or remote control from a ticket.
- **How NDC uses it:** Zoho Assist and Zoho Lens are enabled.
- **Why NDC uses it:** likely for technical support on agency booking systems (to confirm with NDC).
- **TAVI today:** no equivalent.

### M-15 Zoho Cliq notifications
- **What it is:** ticket alerts in a team chat tool.
- **How NDC uses it:** the Zoho Cliq integration is enabled.
- **Why NDC uses it:** NDC is on Zoho One, so Cliq is its internal chat (likely).
- **TAVI today:** Slack, Teams and Google Chat exist; Cliq is missing.

### M-16 Privacy: anonymised contacts
- **What it is:** data subject requests that anonymise a customer's data.
- **How NDC uses it:** anonymised "Anonymous" contacts exist in NDC's data.
- **Why NDC uses it:** to meet customer deletion requests (likely).
- **TAVI today:** missing (NDC-2760).

---

## Verify on TAVI (built, not proven at NDC's settings)
41 statuses with types · 183 fields with 185–208-value picklists · custom modules and lookups · 80 layouts · workflows with Share Ticket (75 rules), Assign Ticket, Send Email Reply, team-and-unassign field updates · 30 direct-assignment rules · SLAs · notifications (mostly off at NDC) · 25 support addresses · CRM sync with NDC's CRM modules (Transactions, Agency Services, Customers, Leads, Agency Code) · customer happiness · manual phone logging at volume.

## Not used by NDC (lower priority for NDC)
Telephony, Telegram, macros, supervisor rules, schedules, custom functions, webhooks, custom buttons, tags, ticket approvals, time entries, products, contracts, social (Facebook / X / Instagram).

## Open questions for NDC
1. Phone: confirm no call recording / CTI is expected (agents log phone tickets by hand).
2. Chat: which websites embed the widget; bots or offline forms?
3. WhatsApp: provider for "NDC Portal outbound"; does the FlyWT widget stay?
4. Reports: is Zoho Analytics used beyond the Desk dashboards?
5. Extensions: which of the 9 are still used?
6. Migration: how much of the 2.5 M tickets and 886 agents must move?

## Links
- Report (HTML): https://claude.ai/artifact/MomAMfoRYUPEoUhDiTurZW — share it with the team first
- Report (doc): https://claude.ai/artifact/7ofDeX6Caq9eAi8MNcarWH
- Repo: docs/ndc-zoho-desk-gap/ndc-zoho-vs-tavi-missing.md and spec-ndc-usage-on-tavi.md

Access note: read-only, signed in as ahegazy@ndceg.com twice on 2 Nov; no setting, ticket or rule was changed (details in the report).
