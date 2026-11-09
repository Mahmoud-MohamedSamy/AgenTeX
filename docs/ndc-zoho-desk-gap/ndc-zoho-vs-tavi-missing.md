# NDC Zoho Desk vs TAVI Desk: what NDC uses and what TAVI is missing

**Date:** 2 Nov 2026 · **Source:** NDC's live Zoho Desk (portal `wondertravel`, org 745942342, edition Zoho One), signed in as ahegazy@ndceg.com (Support Administrator).
Everything was read-only: the browser blocked every non-GET call to Zoho, nothing was opened, edited or saved. **TAVI side:** go-live inventory (`docs/desk-go-live-feature-inventory`, 131 features), Wave 1 and Wave 2 runs on NDC-Staging (1–2 Nov), and the TAVI bundle of 2 Nov.

Raw capture (local only, git-ignored because it holds staff names): `executions/execu_2026-11-01_desk-golive/ndc-zoho/` (api/ = 1,200 JSON snapshots, setup/ = 65 setup pages with screenshot + text, dept-summary.json).

---

## 1. NDC at a glance

| Item | NDC Zoho Desk |
|---|---|
| Tickets (all time) | **≈ 2.52 million**. NDC Finance 1.05 M, Manual Invoice 946 K, Quality Assurance 77 K, System Admin 75 K, Airline Operations 74 K, Wonder travel 40 K |
| Tickets by channel | **Phone 1.36 M (54 %)**, **Chat 842 K (33 %)**, Email 90 K, FlyWT customer support (WhatsApp) 17 K, Web 12.7 K, other IM ≈ 2 K. Facebook / X / Instagram: 0 |
| Departments | 74 (53 enabled; 21 old branches switched off) |
| Agents | 886 in total, **478 active**, 408 deactivated; licence 520 agents + 570 light agents |
| Roles / profiles | 7 roles (CEO, Manager, Staff, LightAgent, Personal, AgentTeamPersonal, PortalUser) · 8 profiles (3 default + Newbie Agent, Supervisor, Support Manager, New Staff, Help Center) |
| Teams | 57 |
| Ticket fields | **183** (≈ 165 custom): picklists up to **208 values** (airline names/codes), multiselect, currency, decimal, date-time, email, boolean, lookups to custom modules |
| Ticket statuses | **41**, each mapped to Open / On Hold / Closed. Many are workflow stages: Dep Manager, Finance team after Validation, AR Team, BSP Investigation, Refund approved, Pass Audit, Closed Duplicated… |
| Custom modules | Airline-IATA Data (TEST), Airline-IATA Data (OTB), "NEW", Training (courses) |
| Layouts | 80 ticket layouts (one per department + 6 extra: System admin internal requests, MAC Invoice, WFM FORM, Accounting, NDC Finance, System Admin) |
| Automation | 92 workflow rules (90 active) · 6 blueprints (5 active, 81 transitions) · 30 direct-assignment rules · 24 round-robin rules · 10 layout rules · 1 validation rule · 200 SLA records (4 per department + 4 custom) |
| Not used at all | Macros 0 · Supervisor rules 0 · Custom functions 0 · Webhooks 0 · Custom buttons 0 · Products 0 · Contracts 0 · Holiday lists 0 · Spam 0 · Bots 0 |
| Integrations switched on | Zoho CRM, Zoho Analytics, Zoho Cliq, Zoho Assist, Zoho Lens, Zia pipeline + Generative AI |
| Marketplace extensions | Related Tickets by Custom Fields, Customer Ticket History, Ticket Insights, Customer Insights, Agent Attendance Tracker, Ticket Assignment, Geolocation, ChatGPT for Zoho Desk, Zoho Calendar |

### How NDC works (the process the gaps come from)
1. **Tickets come in mostly by phone and chat**, then email, WhatsApp/Telegram ("NDC Portal", "FlyWT customer support"), the help center and web forms.
2. **Routing**: 30 direct-assignment rules (one per branch/department) send new tickets to a team or agent by Status, Created By, Layout or Staff Action. 24 round-robin rules load-balance to agents or teams, with special targets for overdue, escalated, response-overdue and "Bad" happiness tickets.
3. **Cross-department work through ticket sharing**: 75 of the 92 workflows run **"Share Ticket"**. Quality Assurance, Financial approval, Clients' Financial Investigations and Client Complaints share each ticket into the branch named in the custom field **Related Branch** (22 branches each), excluding cases where **Feedback = Pass**.
4. **Approval chains run as blueprints on Status**: ADM (Accounting, 8 states, 18 transitions), 2nd check (Manual Invoice, 7 states), Financial approvals (11 states), Clients' Financial Investigations (11 states, 24 transitions), flywt-refund (7 states). Transition owners are the ticket owner or a team. After each transition a field update and/or an alert runs; 10 transitions ask for mandatory fields.
5. **Quality audit**: QA tickets carry a scoring sheet of custom fields (Knowledge, Ownership, Soft skills, Product, In-house/airline process + comments, Critical/Non-critical, Monitored agent). The status becomes Pass Audit / Rejected Audit / Review Audit Manager (965 K tickets are "Pass Audit").
6. **Finance**: E-Top-Up approval statuses, refund method/amount/status fields, ADM number/reason/amount, GL fields and bank deposit fields. The validation rule blocks status **Reject** without a rejection reason.
7. **Notifications**: per-department notification rules with about 65 email templates each (assignment, reply, review, mention, blueprint transition, moved/shared ticket).
8. **AI**: Zia generative AI is on for sentiment, writing assistant, reply assistance, summary and a Zia workflow action. Zia field prediction (ticket owner, priority) is active, and a ChatGPT extension is installed.

---

## 2. Missing or partly built in TAVI, ranked by NDC impact

Status key: **Missing** = not in TAVI · **Partly** = exists but does not cover NDC's use · **In development** · **Unverified** = TAVI has it, but not proven at NDC's scale or settings.

### P0: blocks NDC go-live

| # | What NDC uses | NDC evidence | TAVI today | Status | Plane |
|---|---|---|---|---|---|
| M-01 | **Live chat channel** (website chat → ticket) | 842 K chat tickets (33 %). Pass 2: 46 of 50 recent chat tickets have an ONLINE_CHAT inbound thread (real live chat), mostly Manual Invoice / Manual Invoice MAC, Airline Operations, Emergency, FLY-WT Refund; custom "live chat" dashboard | N-11 Live chat in development | In development | NDC-2000 |
| M-02 | **Instant messaging**: WhatsApp outbound + Zoho IM Talk widget | Pass 2: only 3 of 10 IM channels are active: "NDC Portal outbound" (WhatsApp, Reissue-Ref department), "FlyWT" (IM Talk web widget, Wonder travel; ≈ 17 K tickets) and a WhatsApp sandbox. Telegram and the other WhatsApp numbers are switched off | N-14 Missing. Bundle already has the workflow actions `ReplyViaIm` / `NotifyViaIm`, but there is no channel setup | Missing | NDC-2000, NDC-2760 |
| M-04 | **AI on tickets**: summary, sentiment, writing assistant, reply assistance, Zia workflow action, field prediction (owner, priority) | Zia GenAI features ACTIVE; prediction pipeline ACTIVE | On NDC-Staging (2 Nov) every AI call returns 404 and the panel says "Something went wrong" (summary, triage, reply suggestions, draft assist, translate). No AI workflow action, no field prediction | Missing on NDC | NDC-2004, NDC-2005 |
| M-05 | **Agent scale**: 886 agents (478 active), 74 departments, 57 teams; each active agent sits in 9.3 departments on average (max 57) | Pass 2: all 886 agent records read (428 active on the Agent profile, 422 on role Staff, 39 on role CEO) | `/iam/users` stops at 200 rows and ignores paging (Wave 1). Agent lists, owner pickers and approver pickers will not reach NDC's 478 active agents; multi-department membership at this depth is untested | Partly (bug) | new: not filed yet |
| M-06 | **Reporting**: Desk's own dashboards and reports (Zoho Analytics also enabled) | Pass 2: 12 dashboards — Overview (opened 2 Nov), Request Dashboards (1 Nov), SLA (Oct), custom TOPUP and live chat; 4 custom summary reports (Agent Performance, Help Desk, tickets overall, Tickets by departments) + 9 standard ones | Reports / dashboards not confirmed: `/reports` and `/dashboards` redirect to `/hq` (I-02, I-03, G-06 partly) | Partly / unverified | NDC-2364, NDC-2068 |
| M-07 | **Blueprint behaviour NDC relies on**: owners = ticket owner or team; after-transition field updates (63) and alerts (32); mandatory "during" fields (10); escalation per state; 81 transitions | 5 active blueprints | Built, but with open defects from the 1 Nov Blueprint run | Partly | NDC-2754, NDC-2755..2758, NDC-2761..2764, NDC-2774, NDC-2775 |

### P1: needed for NDC's daily process

| # | What NDC uses | NDC evidence | TAVI today | Status | Plane |
|---|---|---|---|---|---|
| M-08 | **Round robin variants**: load balance to agents and to teams, sequential to team, skill-based; targets for Is Overdue / Is Escalated / Response Overdue / Happiness = Bad; idle agents treated as offline after 20 min | 24 RR rules (12 agent LB, 14 team LB, 1 sequential, 1 skill-based); agentAvailabilityConfig | U-02 Partly (thresholds, online-only); U-03 skills partly; idle-to-offline not verified | Partly | NDC-2275, NDC-2752 |
| M-09 | **Layout rules + validation rule** (10 layout rules on Mistake category, Status, Ticket Type, Number of Traveling Tickets, Transaction Type, Responsible Dep for investigation; validation "Status = Reject → alert: add a clear rejection reason") | layoutRules / validationRules | X-03 Partly | Partly | NDC-2230, NDC-2231, NDC-2535, NDC-1988 |
| M-10 | **Attachment limits**: 40 MB per file / 40 files, separate rules for agents and end users | attachmentRestrictions | T-24 Partly. On 2 Nov TAVI accepted a 200 MB declared upload; there is no admin setting for size or count | Partly | NDC-2753 |
| M-11 | **Extensions NDC installed**: Related Tickets by Custom Fields, Customer Ticket History, Ticket Insights, Customer Insights, Agent Attendance Tracker, Geolocation, Ticket Assignment | Installed extensions | No marketplace (G-04). Customer history exists (C-03); calendar exists (C-06). Missing: related tickets by a custom field (e.g. same PNR), agent attendance tracking, geolocation | Missing | NDC-2013 |
| M-12 | **Help Center auto-translation** (Google) and Arabic content | helpCenters translateSettings AUTO; ar-EG configured | Ticket translation missing (T-39); KB translations not confirmed (N-09) | Missing / unverified | NDC-2005, NDC-2760 |
| M-13 | **Gamescope** trophies (Quick Responder, SLA Saver, Smile Reaper, Rapid Resolver) | Gamescope page | O-07 Missing | Missing | NDC-2760 |
| M-14 | **Remote support**: Zoho Assist and Zoho Lens enabled | Zoho integrations | No equivalent | Missing | — |
| M-15 | **Zoho Cliq** notifications | Cliq ENABLED | TAVI has Slack / Teams / Google Chat actions; no Cliq | Missing (Cliq only) | — |
| M-16 | **Privacy**: anonymised contacts (data subject requests) | "Anonymous" contacts exist | A-11 Missing | Missing | NDC-2760 |

### P2: TAVI has it; prove it at NDC's settings (test, not build)

| # | What NDC uses | TAVI | Status |
|---|---|---|---|
| V-01 | 41 custom statuses with status types (Open / On Hold / Closed); stage names used as blueprint states | Custom ticket statuses exist (seen on Anyware) | Unverified at 41 |
| V-02 | 183 ticket fields, 165 custom; picklists of 191–208 values; multiselect; currency; decimal; lookups to custom modules | X-02 Built | Unverified at this size |
| V-03 | Custom modules (Airline-IATA Data ×2, Training) with lookups from tickets and contact custom fields (Airline name/code, Mail Box To/CC) | X-01 Built | Unverified |
| V-04 | 80 layouts, several per department (internal requests, MAC invoice, WFM form) | X-02 Built | Unverified |
| V-05 | Workflows: triggers on Create, Edit, a specific field changing (Related Branch, Status, Responsible area, Ticket Owner, Financial Decision), customer reply, agent response, comments, happiness rating, private threads; criteria with "is / isn't" and patterns like (1 and 2); actions **Share Ticket to department** (75), **Assign Ticket** (20), **Send Email Reply** (10), skill-based assignment, field update, alert | U-04 / U-05 / U-06 Built; bundle has `ShareTicket`, `SendTicketReply`, `ReassignTicketBySkills` | Unverified for NDC's patterns |
| V-06 | Direct assignment: 30 rules, targets agent or team, criteria Status / Created By / Layout / Staff Action, two rules move tickets to another department | U-01 Built | Unverified ("Created By" criterion, cross-department target) |
| V-07 | SLAs: Priority-based + Gold / Silver / Bronze per department; custom "Airline services SLA", "Manual invoice SLA", "seasons requests" | U-07 Built | Unverified |
| V-08 | Notification rules per department. Pass 2: most are switched off. On in the most departments: assigning a ticket to agent / team (25 of 49), comments (13–14), contact "new ticket" and "closing" (15), department "new / moved / shared ticket" (10–11), secondary-contact notices (8–9 of 11). No SMS. Only 2 custom email templates ("Airline ops signature" EG and UAE/KSA); the rest are Zoho's defaults | U-12, N-04 Built | Unverified |
| V-09 | 25 support email addresses (`*@wondertravel.zohodesk.com`, one per department; licence 1,000) | N-01 Built | Unverified (needs domain/forwarding plan) |
| V-10 | Secondary contacts (CC), Send as Email, Scheduled reply, manual time tracking, ticket sharing, teams, data sharing "public" for all modules incl. custom modules | Built | Unverified |
| V-11 | KB: 190 articles, about 50 root categories (one per department); community topics; feedback widgets (Moussa Tech, Religious Tourism) | N-08, N-07 Built; N-05 Partly | Unverified |
| V-12 | Roles hierarchy (CEO → Manager → Staff…), 4 custom profiles, light agents | A-02, A-03 Built | Unverified |
| V-13 | **Phone tickets logged by hand at volume** (1.36 M). Pass 2: recent phone tickets have no call thread and were created by agents themselves; they land mostly in NDC Finance (top-ups) and Manual Invoice. The phone system is not connected to Desk | Manual channel = Phone tickets work on TAVI; telephony not needed for go-live (was M-03) | Unverified at volume |
| V-14 | **Zoho CRM integration**: accounts, contacts and products synced from CRM; Desk tickets shown in CRM related lists Transactions, Agency Services, Customers, Leads, Agency Code | G-01 CRM ⇄ Desk built (NDC-2392..2410 filed earlier) | Unverified for NDC's custom CRM modules |
| V-15 | **Customer happiness**: rating link on replies and on close, per-department survey, reopen on rating option. Ratings mostly from 2024 (low use now) | N-10 Built | Unverified |

### TAVI defects already found that hit NDC's process (from Wave 2, 2 Nov, not yet filed)
- An approval can name an approver outside the department (agent C, Customer Support only, on a Marketing ticket).
- History shows "Followers was updated" with a raw user-id array.
- An existing reply draft pre-fills the comment editor (Shift+C / comment icon).
- An Open ticket can be archived and then disappears from All Tickets.
- AI endpoints return 404 (see M-04).

### Features NDC does not use: lower priority for NDC
Macros, supervisor rules (U-10), schedules (U-11), custom functions, webhooks (U-14), custom buttons (X-04), products, contracts, support plans per department, holiday lists, Facebook / X / Instagram tickets (brands configured, zero tickets), Answer Bot, guided conversations, Telegram (channels switched off), telephony (phone tickets are logged by hand). Pass 2 also found: **tags** unused (35 tags, all with 0 tickets); **ticket approvals** unused (no pending approvals, 0 on sampled tickets); **time entries** 0 on sampled tickets although manual timers are on.

### Workflow detail (pass 2), for the test spec
- Field updates: NDC Finance rules "Ticket owner -1/-2", "R1", "R2", "Waiting Top-Up Manager" move the ticket to a team and clear the owner; Manual Invoice "No need to issue invoice" sets Status = Closed; Airline Operations and Involuntary "Reopen" set Status = Open.
- Send Email Reply (10): "Formal Complaint" letters sent to the ticket contact plus a manager address (Client Complaints / QA flows), and a "Dear manager" escalation.
- Assign Ticket (20): team + named agent (TEAM_WITH_AGENT), one rule team only.

---

## 3. What to confirm with NDC before building
1. **Phone (mostly answered):** pass 2 shows agents log phone tickets by hand. Confirm no call recording or CTI is expected in TAVI.
2. **Chat:** which website(s) embed the chat widget, and must chat bots / offline forms move too?
3. **WhatsApp + IM Talk:** the WhatsApp Business provider for "NDC Portal outbound", and whether the FlyWT IM Talk web widget stays.
4. **Reports:** whether managers also use Zoho Analytics (not inspected) beyond the Desk Overview / Request / SLA / TOPUP dashboards.
5. **Extensions:** which of the 9 extensions are still used (Agent Attendance Tracker and "Related Tickets by Custom Fields" look process-critical).
6. **Data migration:** 2.5 M tickets, 886 agents (408 deactivated) and custom-module records. What history must move?

## 4. Limits of this report
Two read-only passes on 2 Nov 2026 (12:20–13:50 and 14:10–14:25). Not readable without risking a change, so not read: phone (telephony) setup, chat settings, Help Center settings, the CRM field mapping beyond the sync summary, and Zoho Analytics. Ticket content was never opened: usage figures come from counts and from metadata of 150 recent tickets. The TAVI side (V-01 to V-15) is from the go-live inventory and the Wave 1/2 runs; the test spec proves it.

## 5. How we accessed NDC's Zoho
- **Account:** ahegazy@ndceg.com (Support Administrator), signed in twice on 2 Nov 2026, about 12:17 and 14:07. Both sign-ins used a OneAuth push approved by our team. Both show in the account's login history; the second session may still be active and count toward the account's limit of 2 sessions. Before the second sign-in, one of the account's sessions had to be ended; we did not do that.
- **Read-only guard:** the browser blocked every write call to Zoho (297 calls, all Zoho's own telemetry and presence pings) and, in the second pass, every GET that looked like an action (20 calls). No ticket was opened, so nothing was marked as read.
- **One exception (first pass):** viewing Setup → Integrations → Others let Zoho's own page send `CtiApiConfig.do?mode=generatePhoneBridgeOauthtoken` (a GET). By its name it may have generated a PhoneBridge token on Zoho's side; no visible setting changed. The second-pass guard blocked this call every time.
- **Allowed on purpose:** 20 small POST calls to Zoho's notification-badge and interface-text endpoints (`getbadge.acs`, `getresource.acs`).
- **Sign-in prompts:** the session-limit warning was dismissed with "Do it later", and the "1 unverified domain" notice with its remind-later option; no domain or session setting was changed.
- **Data kept:** the raw capture (setup, rules, staff names and emails, metadata of 150 recent tickets) stays on the tester's machine and is excluded from git.
- **Suggested follow-up for NDC:** end the extra session under Active Sessions and, if wanted, review the Zoho audit log for 2 Nov.
