# TAVI Desk — manual test plan for untested and partly tested features

**Written:** 4 Nov 2026 · **For:** one manual QA tester · **Environment:** staging-desk.taviportal.com, tenant **NDC-Staging** (company "Wonder Travel") · **Test-data prefix:** `QA MAN `

Sources: `matrix-data.js` (131 features), `spec-desk-go-live.md`, `desk-missing-and-partly.md`, `executions/execu_2026-11-01_desk-golive/PROGRESS.md`, Wave 2 case list `wave2/cases-ndc.md` (reused here), the earlier feature specs under `docs/desk-*` and `docs/crm-desk-integration`, and the NDC usage study `docs/ndc-zoho-desk-gap`.

**Scope:** every feature in Waves 2, 3, 4 and 5, plus Q-04 (My profile, only partly checked in Wave 1). Wave 1 is done and left out. Wave 0 and "Missing" features have nothing to test yet; they are listed in Appendix A.

---

## 1. How the priority was set

1. **Start from the inventory priority** (P0–P2 in `matrix-data.js`).
2. **P0 = go-live blockers.** These are the ticket daily-work core (create, detail, reply/forward, comments, assign, status/close/reopen, list views, notifications bell), the email channel in and out (N-01..N-04), SLA, assignment and workflow runtime, blueprints, Help Center and KB, contacts and accounts, import and export, dashboards, CRM sync, Arabic and performance.
3. **Move up** when NDC really uses the feature: finance departments, workflows, blueprints, SLA, share ticket, phone and chat tickets typed by agents, Desk dashboards (Overview, Request, SLA, TOPUP), and CRM sync of accounts, contacts and products. So Q-03 bell (P1 → P0), N-02 spam/blocked (P1 → P0, part of email in), O-06 products (P2 → P1) and T-38 AI on ticket (P2 → P1) went up.
4. **Move down** when NDC does not use the feature, but keep it in the plan. NDC does not use tags, approvals, time entries, macros, custom functions, webhooks, contracts or Slack. So T-22, T-26, T-27, T-35, U-08, U-13, U-14 and C-04 went down one step (P1 → P2). U-15, X-06, G-02, G-03 and D-05 went from P2 to P3. T-20 spam went from P0 to P1 (NDC has 0 spam use).
5. **Inside one priority, features are grouped by area** (Organisation, Access, Tickets, Automation, Channels, Customers, Insight, Data, Customization, Integrations, Cross-cutting).

Each feature lists "Partly covered before" when earlier feature testing touched it. Those cases focus on what was **not** covered.

## 2. Summary

**Features and test cases (features / test cases) by priority and wave**

| Priority | Wave 1 | Wave 2 | Wave 3 | Wave 4 | Wave 5 | Total |
|---|---|---|---|---|---|---|
| **P0** | — | 18 / 149 | 8 / 70 | 7 / 51 | 14 / 108 | **47 / 378** |
| **P1** | 1 / 7 | 13 / 87 | 2 / 11 | 4 / 25 | 9 / 61 | **29 / 191** |
| **P2** | — | 8 / 52 | 2 / 12 | 1 / 7 | 6 / 39 | **17 / 110** |
| **P3** | — | — | 1 / 6 | — | 4 / 26 | **5 / 32** |
| **Total** | 1 / 7 | 39 / 288 | 13 / 99 | 12 / 83 | 33 / 234 | **98 / 711** |

**Test cases by type:** functional 214 · edge 106 · negative 102 · persistence 99 · UI-RTL 98 · permission 77 · integration 15.

Every feature has at least one happy-path, negative, edge, persistence and Arabic/RTL case. Permission cases are included wherever a role matters.

## 3. Suggested execution order (one tester)

About 40–50 cases a day, because email, timers and SLA cases need waiting time. Log bugs at the end of each day. Each day builds on the data of the day before.

| Day | What | Cases |
|---|---|---|
| 1 | Setup (section 4) + T-04 Create, T-05 Detail, T-06 Reply/forward, T-07 Comments | 39 |
| 2 | T-12 Assign, T-13 Status/close, Q-03 Bell, T-01 Views, T-02 View modes, T-03 Queues | 49 |
| 3 | T-14 Move, T-15 Share, T-16 Merge, T-10 Snippets, T-21 Delete/restore, T-24 Attachments | 46 |
| 4 | T-25 Collision, T-31 Bulk, N-01 Email, N-02 Spam/blocked, N-03 Providers, N-04 Email templates, U-12 Notification rules | 50 |
| 5 | U-01 Assignment rules, U-02 Round-robin prefs, U-07 SLA, U-04 Workflow rules (start timers early) | 39 |
| 6 | U-05 Actions, U-06 Reply triggers, U-09 Blueprints, N-05 Web forms, N-06 Help Center | 39 |
| 7 | N-08 KB, C-01 Contacts, C-02 Accounts, G-01 CRM ⇄ Desk, D-01 Import | 41 |
| 8 | D-02 Export, D-07 Recycle Bin, X-01 Modules, X-02 Layouts/fields, X-03 Layout/validation rules, I-01 HQ | 43 |
| 9 | I-02 Reports, I-03 Dashboards, Q-01 Arabic sweep, Q-05 Performance (quiet hour) — **P0 done** | 32 |
| 10 | P1 tickets: T-08, T-09, T-11, T-17, T-19, T-20, T-23, T-29 | 54 |
| 11 | T-33, T-34, T-36, T-38, T-40, U-03 Skills, U-16 Auto-close | 44 |
| 12 | N-10 Happiness, T-37 Rating on ticket, N-07 Community, N-09 KB translations, C-03 Customer 360, C-05 Activities, O-06 Products, A-12 Retention | 53 |
| 13 | D-03 Backup, D-04 Migration, D-06 Bulk log, X-05 Languages, G-06 Analytics, Q-04 My profile — **P1 done** | 40 |
| 14 | P2 tickets: T-18, T-22, T-26, T-27, T-28, T-30, T-32, T-35 | 52 |
| 15 | U-08, U-13, U-14, C-04, C-06, I-04, D-08, Q-02, O-08 — **P2 done** | 58 |
| 16 | P3: U-15, X-06, G-02, G-03, D-05 + full cleanup (section 7) | 32 |

Dependencies: T-11 needs the KB article from N-08 (day 7). T-36 needs the SLA from U-07 (day 5). U-06-05 needs the happiness link; if it is off, run U-06-05 on day 12 with N-10. C-04 runs right after U-08.

## 4. Before you start (setup, about 2 hours on day 1)

**Accounts (no passwords in this file; use the team credentials sheet):**

| Short name | Role | Departments |
|---|---|---|
| Owner | Tenant owner, all rights | all |
| Admin B | Desk Administrator | Marketing (+ Sales for move/share tests) |
| Agent C | Desk Agent profile | Customer Support only |
| Supervisor S | Desk Supervisor | Tech |

Sign each account in once per session, in its own browser or profile (a new sign-in can end the old session). Use two browsers for collision and "two users at once" cases.

**Departments:** Marketing for plain ticket work (no SLA, no blueprint, no assignment rule). Sales as move/share target. Customer Support for Agent C. One "QA NDC …" department for every rule, SLA, blueprint, notification and numbering test. Never change Standard layouts or settings of real departments.

**Mailboxes:** M1 = a test mailbox you control (used as the main contact). M2 = a second test mailbox (CC, forward, portal sign-up, blocked sender). Send mail only to these two.

**Data to make first:**
- Contact "QA MAN Contact 1" (email M1) and account "QA MAN Account".
- 5 tickets in Marketing: "QA MAN phone 01", "QA MAN reply 01", "QA MAN assign 01", "QA MAN status 01", "QA MAN share 01". Create them with **no priority and channel Phone**. The tenant has workflow rules for all departments that add tasks, tags and call records when priority is High/Urgent or the channel is Web. Keep priority edits to Low/Medium unless a case says otherwise.
- Files: small .txt, 2 MB .jpg, 5 MB .pdf, 45 MB .zip, a renamed .exe, a file with an Arabic name.
- CSV "qa-man-contacts.csv" (5 rows: 1 bad email, 1 Arabic name, 1 duplicate) and a 3-row ticket CSV.
- A safe test endpoint (for example a webhook.site inbox) for webhook and custom action cases.

**Write down before changing:** take a screenshot of each tenant setting you will touch (numbering, notification rules, business hours, SLA list, portal branding, email channel, retention, archiving). Change them only in a QA department or set them back the same day.

**Live data from the paused Wave 2 run:** "QA GL W2" tickets #781–#794, a macro, template, snippet, tag, view, 2 pending approvals and 2 pending review drafts are still on the tenant. Do not use them; they are in the cleanup list.

## 5. How to record results

Fill the **Result** column with one of: **Pass**, **Fail** (+ short note and bug id when filed), **Blocked** (+ what blocks it), **Not built** (feature not on screen). "Known" Plane ids in each feature are open items: if the case still fails the same way, write the id instead of a new bug. Take a screenshot only for failed cases.

## 6. Test cases

### 6.1 P0 — go-live blockers

#### P0 · Tickets (daily work core)

##### T-04 · Create ticket (layout per department, templates, quick create)
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Every ticket starts here. NDC agents type phone and chat tickets by hand (54 % + 33 % of their volume).  
**Preconditions / data:** Signed in as Owner. Department Marketing (no SLA, no rule). Contact "QA MAN Contact 1" (create it in Contacts first, email = QA mailbox M1). Known: NDC-2661 (screen create said "Permission denied").

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-04-01 | Create a phone ticket from the screen | functional | 1) Click "+" in the header › Ticket. 2) Department = Marketing. 3) Subject "QA MAN phone 01", Contact = QA MAN Contact 1, Channel = Phone, no priority. 4) Description "Caller asks about refund". 5) Click Save. | Success message (not "Permission denied"). Ticket page opens with a new ticket number. Channel shows Phone. Status is the default open status. | |
| T-04-02 | Create a chat ticket typed by an agent | functional | 1) Sign in as Agent C. 2) "+" › Ticket, department Customer Support. 3) Subject "QA MAN chat 01", Channel = Chat, contact QA MAN Contact 1. 4) Save. | Ticket created in Customer Support, owner rules as configured, channel Chat. Agent C can open it. | |
| T-04-03 | Required fields are enforced | negative | 1) "+" › Ticket. 2) Leave Subject empty. 3) Click Save. 4) Then clear Department (if possible) and Save. | Save is blocked. Each missing field shows an inline message. No ticket is created (check All Tickets). | |
| T-04-04 | Very long and special-character subject | edge | 1) Create a ticket with a 255-character subject that starts "QA MAN long" and contains Arabic, emoji and `<b>x</b>`. 2) Save. 3) Then try a 1,000-character subject. | 255 chars saves and shows as plain text (no bold, no script). 1,000 chars is refused with a clear limit message, or saved in full — record which. No "unexpected error". | |
| T-04-05 | Layout follows the department | functional | 1) "+" › Ticket. 2) Pick Marketing, note the fields. 3) Switch department to Tech (or a QA NDC department with its own layout). | The form changes to that department's layout. Values already typed in shared fields stay. | |
| T-04-06 | Create from a ticket template | functional | 1) Create template "QA MAN template" in Settings › Tickets › Templates (subject + priority Low). 2) "+" › Ticket › template picker › pick it. 3) Save. | Fields are pre-filled from the template. Ticket saves with those values. | |
| T-04-07 | Ticket survives reload and sign-in | persistence | 1) Open "QA MAN phone 01". 2) Reload the page. 3) Sign out, sign in again, search the ticket number. | All values are the same as saved. | |
| T-04-08 | Agent cannot create in a department he is not in | permission | 1) Sign in as Agent C (Customer Support only). 2) "+" › Ticket. 3) Open the Department list. | Only his departments are offered. He cannot save a ticket into Marketing. | |
| T-04-09 | Create form in Arabic | UI-RTL | 1) Switch the header language to Arabic. 2) "+" › Ticket. 3) Fill and save "QA MAN AR 01". | Labels and buttons in Arabic, form right-to-left, no raw keys like `desk.tickets.x`, success message in Arabic. | |
| T-04-10 | Tenant workflow side effects | integration | 1) After T-04-01, open the ticket's Activity / History. 2) Check Activities and Tags for new items. | Note any task, tag or call that a tenant-wide workflow rule added. With no priority and channel Phone, none should appear. Record and clean any. | |

##### T-05 · Ticket detail: properties, conversation, history, tabs, pins
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Agents live on this page all day.  
**Preconditions / data:** Ticket "QA MAN phone 01". Known: NDC-2660 (history raw ids); candidate "Followers was updated" shows raw user ids.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-05-01 | Page parts load | functional | 1) Open the ticket. 2) Click each tab: Conversation, Resolution, Time, Attachment, Parent-Child, Activity, Approval, History. | Header (subject, status, Reply, Comment, Close) and properties panel show. Every tab opens without error or raw keys. | |
| T-05-02 | Edit properties inline | functional | 1) Change Subject to "QA MAN phone 01 edited". 2) Set Due date to tomorrow 17:00. 3) Set priority Low. | Each change saves on its own. A success toast shows. | |
| T-05-03 | History records each change with names | functional | 1) Open History. | Create, subject, due date and priority changes are listed with the user's name and old → new values. No raw ids or arrays. | |
| T-05-04 | Due date in the past | negative | 1) Set Due date to yesterday. | Refused with a message, or saved and the ticket marked overdue — record which. No crash. | |
| T-05-05 | Unknown ticket link | edge | 1) Copy the ticket URL. 2) Change the last 4 characters of the id. 3) Open it. | "Not found" page. No data from another ticket. | |
| T-05-06 | Two people edit at once | edge | 1) Open the ticket in two browsers (Owner and Admin B). 2) B changes priority to Medium. 3) Owner, without reload, changes priority to Low. | The second save is refused with a "changed by someone else" message, or the last one wins and History shows both. Record which. | |
| T-05-07 | Values kept after reload | persistence | 1) Reload. 2) Sign in again. | Edited subject, due date, priority are still there. | |
| T-05-08 | Agent outside the department | permission | 1) Sign in as Agent C. 2) Paste the Marketing ticket URL. | Access refused / not found. No properties or conversation shown. | |
| T-05-09 | Detail page in Arabic | UI-RTL | 1) Switch to Arabic. 2) Open the ticket. 3) Tab through the header buttons with the keyboard. | Labels in Arabic, layout mirrored, dates readable, focus order follows the visual order. | |

##### T-06 · Reply, reply all, forward, CC/BCC, signatures, send as email
**Priority:** P0 · **Wave:** 2 · **Status:** Built · **Partly covered before:** Ticket replies run 26 Oct (docs/desk-ticket-replies). Focus here on NDC-Staging, CC/BCC, signature, real delivery.  
**Why this priority:** The customer only sees what goes out by email.  
**Preconditions / data:** Ticket "QA MAN reply 01" on contact QA MAN Contact 1 (mailbox M1). Second mailbox M2 for CC/forward. Signature set in My profile. Known: NDC-2636, NDC-2377.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-06-01 | Reply reaches the customer | functional | 1) Open the ticket › Reply. 2) Type "QA MAN reply body 01". 3) Send. 4) Check mailbox M1. | Reply shows in the thread as outgoing. Email arrives in M1 from the support address, subject has the ticket number. | |
| T-06-02 | Reply all with CC and BCC | functional | 1) Reply all. 2) Add CC = M2, BCC = M2 alias (or a 3rd mailbox). 3) Send. | M1 gets it, CC gets it, BCC gets it but is not visible to others. Thread shows CC. | |
| T-06-03 | Forward | functional | 1) Forward the first message to M2 with a note. 2) Send. | M2 receives the forward with the original text. Thread marks it as a forward. | |
| T-06-04 | Invalid address and empty body | negative | 1) Reply with To = "not-an-email". 2) Send. 3) Reply with an empty body. 4) Send. | Both refused with a clear message. Nothing is saved as "sent". | |
| T-06-05 | Signature is added | functional | 1) Set a signature in My profile. 2) Open a reply. | Signature is inserted once, under the text. Arabic signature keeps RTL. | |
| T-06-06 | Long reply with paste from Word | edge | 1) Paste a 3-page text with a table and an image. 2) Send. | Sent. Formatting is kept or cleanly simplified. Email in M1 is readable. | |
| T-06-07 | Customer replies back | integration | 1) From M1, answer the email. 2) Wait 2 minutes. 3) Reload the ticket. | Customer reply is threaded on the same ticket (not a new ticket). Status follows the rule (for example back to Open). | |
| T-06-08 | Sent reply kept after reload | persistence | 1) Reload. 2) Sign in again. | Replies, CC and forward stay in the thread, in time order. | |
| T-06-09 | Agent without reply right | permission | 1) Share a Marketing ticket read-only with Customer Support. 2) Sign in as Agent C. 3) Open it. | Reply and Forward are hidden or refused. | |
| T-06-10 | Arabic reply | UI-RTL | 1) Write the reply in Arabic. 2) Send. | Composer is RTL for Arabic text. Email in M1 shows Arabic correctly (no "????"). | |

##### T-07 · Private comments, mentions, comment visibility
**Priority:** P0 · **Wave:** 2 · **Status:** Built · **Partly covered before:** comments in the 26 Oct replies run.  
**Why this priority:** Internal handover between NDC teams runs on comments and mentions.  
**Preconditions / data:** Ticket "QA MAN reply 01". Admin B in Marketing.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-07-01 | Private comment | functional | 1) Click Comment. 2) Type "QA MAN private note". 3) Keep visibility Private. 4) Save. | Comment shows with a private mark. Customer does not get an email. | |
| T-07-02 | Edit and delete own comment | functional | 1) Edit the comment text. 2) Save. 3) Delete it. | Edit shows "edited". Delete removes it after a confirm. | |
| T-07-03 | Mention an agent | integration | 1) Comment "@" + Admin B name. 2) Save. 3) Sign in as B. | Mention chip shows. B gets a bell notification that opens the ticket. | |
| T-07-04 | Empty comment and script text | negative | 1) Save an empty comment. 2) Save `<script>alert(1)</script><b>x</b>`. | Empty refused. Script does not run; text is shown safely. | |
| T-07-05 | Public comment visibility | edge | 1) Add a comment with visibility Public (if offered). 2) Open the ticket on the Help Center as the contact. | Public comment visible to the customer; private ones never. | |
| T-07-06 | Pin a comment | functional | 1) Pin the comment for everyone. 2) Reload. 3) Unpin. | Pinned block shows on top after reload; gone after unpin. | |
| T-07-07 | Another agent cannot edit my comment | permission | 1) Sign in as Admin B. 2) Try to edit the Owner's comment. | Edit/delete hidden or refused (unless B's profile allows). | |
| T-07-08 | Draft does not leak into comment | edge | 1) Start a reply draft. 2) Press Shift+C or the comment icon. | Comment editor opens empty (candidate bug: draft pre-fills it). | |
| T-07-09 | Comment in Arabic | UI-RTL | 1) Add an Arabic comment with a mention. | RTL text, mention chip placed right, no broken order. | |
| T-07-10 | Comment kept after reload | persistence | 1) Add a private comment. 2) Reload. 3) Sign in again. | Comment, visibility and pin state unchanged. | |

##### T-12 · Assign / reassign owner and team, pick up
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** NDC routes every ticket to an agent or team; wrong owner = lost ticket.  
**Preconditions / data:** Unassigned ticket "QA MAN assign 01" in Marketing. Team in Marketing (or use Dev/QA team). Known: NDC-2355 (unassign 500).

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-12-01 | Assign to an agent | functional | 1) Open the ticket. 2) Owner field › pick Admin B. | Owner = B. History row. B gets "assigned to you" notification. | |
| T-12-02 | Assign to a team | functional | 1) Team field › pick a team. 2) Leave owner empty. | Ticket shows under Team Queue for that team. | |
| T-12-03 | Pick up | functional | 1) Sign in as Admin B. 2) Open an unassigned ticket. 3) Click Pick up. | Owner = B at once. Button disappears. | |
| T-12-04 | Unassign | negative | 1) Clear the owner. 2) Save. | Saved as unassigned (no 500 error). | |
| T-12-05 | Assign to an agent not in the department | negative | 1) Open Owner list. 2) Search Agent C (Customer Support only). | C is not offered, or saving is refused with a message. | |
| T-12-06 | Two agents pick up at the same time | edge | 1) Owner and B open the same unassigned ticket. 2) Both click Pick up within 2 seconds. | Only one becomes owner. The other gets a clear message. | |
| T-12-07 | Owner kept after reload | persistence | 1) Reload. 2) Sign in again. | Owner and team unchanged. | |
| T-12-08 | Agent cannot reassign without right | permission | 1) Sign in as Agent C on a Customer Support ticket owned by another agent. 2) Try to change owner. | Allowed or hidden exactly as the Desk Agent profile says (check the profile first). | |
| T-12-09 | Owner picker in Arabic | UI-RTL | 1) Switch to Arabic. 2) Open Owner picker and search an Arabic name. | Search works, list RTL. | |

##### T-13 · Status, priority, due date, on hold, close / reopen
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** NDC has 41 statuses that drive approvals and reports.  
**Preconditions / data:** Ticket "QA MAN status 01" in Marketing.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-13-01 | Full status flow | functional | 1) Open → On Hold. 2) On Hold → Closed (close dialog). 3) Reopen. | Each change saved. Closed badge shows. Reopen sets an open status. History lists all. | |
| T-13-02 | Close dialog options | functional | 1) Click Close. 2) Fill resolution if asked. 3) Tick/untick "notify customer". | Ticket closed. Customer email only when ticked. | |
| T-13-03 | Priority Low/Medium change | functional | 1) Change priority None → Low → Medium. | Saved. List shows the new priority. | |
| T-13-04 | Close a ticket that needs a mandatory field | negative | 1) Make a field mandatory on close (layout or blueprint, if configured). 2) Close without it. | Close blocked with a message naming the field. | |
| T-13-05 | Customer reply on a closed ticket | edge | 1) Close the ticket. 2) Reply from M1 to the last email. | Ticket reopens, or a new ticket is made — as the department setting says. Record which. | |
| T-13-06 | Status after reload | persistence | 1) Reload. 2) Open All Tickets with a Closed filter. | Ticket shows in the right view. | |
| T-13-07 | Agent close permission | permission | 1) Sign in as Agent C on his own Customer Support ticket. 2) Close it. 3) Reopen. | Allowed or hidden per profile. No silent failure. | |
| T-13-08 | Status names in Arabic | UI-RTL | 1) Switch to Arabic. 2) Open the status list. | Status names translated or shown as entered; close dialog RTL. | |

##### T-01 · List views: system, custom, starred, sort, filters
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Agents find their work through views.  
**Preconditions / data:** At least 5 "QA MAN" tickets with different status, priority and created time.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-01-01 | System views show the right tickets | functional | 1) Open Tickets › All Views. 2) Open All, My Open, On Hold, Closed, Unassigned. | Each view lists only matching tickets. Counts match the rows. | |
| T-01-02 | Create a custom view | functional | 1) New view "QA MAN view", criteria Subject contains "QA MAN" and Department = Marketing. 2) Save. | View lists only QA MAN Marketing tickets. | |
| T-01-03 | Sort really orders rows | functional | 1) Sort by Created time ascending, then descending. 2) Sort by Priority. | Rows change order correctly (check first and last row). | |
| T-01-04 | Filter with no result | negative | 1) Filter Subject contains "zzzz-no-match". | Empty state message, no error. | |
| T-01-05 | Star, clone and delete a view | edge | 1) Star "QA MAN view". 2) Clone it. 3) Delete the clone. | Starred list shows it. Clone works. Deleted clone is gone. | |
| T-01-06 | View, sort and star kept | persistence | 1) Sign out and in. | Starred view, last sort and columns kept. | |
| T-01-07 | Agent sees only his departments | permission | 1) Sign in as Agent C. 2) Open All Tickets. 3) Search "QA MAN". | No Marketing tickets listed or found. | |
| T-01-08 | Agent cannot edit a shared admin view | permission | 1) Owner shares "QA MAN view" with all. 2) Agent C opens it and tries edit/delete. | View usable; edit/delete hidden or refused. | |
| T-01-09 | Views in Arabic | UI-RTL | 1) Switch to Arabic. 2) Open views list and a filter. | Labels Arabic, columns mirrored, sort arrows correct. | |

##### T-02 · View modes: table, compact/classic, kanban board, peek
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Part of the list every agent uses.  
**Preconditions / data:** "QA MAN view" with 5+ tickets.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-02-01 | Switch modes | functional | 1) Switch Table › Classic › Board › back. | Each mode shows the same tickets. | |
| T-02-02 | Board drag changes status | functional | 1) Board mode, lanes by status. 2) Drag a QA MAN ticket from Open to On Hold. | Status changes and History records it. | |
| T-02-03 | Drag to a status that needs a field | negative | 1) Drag to Closed when a close field is required. | Drop refused or dialog asks for the field. No silent change. | |
| T-02-04 | Peek panel | functional | 1) Click the peek icon on a row. 2) Change priority in peek. | Side panel opens without leaving the list; change saved. | |
| T-02-05 | Board with many tickets | edge | 1) Board on All Tickets (hundreds of rows). | Lanes load and scroll; no freeze over 10 s. | |
| T-02-06 | Mode remembered | persistence | 1) Choose Board. 2) Reload, sign in again. | Board mode kept. | |
| T-02-07 | Board in Arabic | UI-RTL | 1) Switch to Arabic. 2) Board mode. | Lanes right-to-left, drag still works. | |

##### T-03 · Agent Queue / Team Queue / Tags tabs
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Supervisors balance load from the queues.  
**Preconditions / data:** QA MAN tickets owned by Owner and Admin B; one with a team.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-03-01 | Agent Queue counts | functional | 1) Open Agent Queue. 2) Compare each agent's count with "Owner = agent" filter in All Tickets. | Counts match. | |
| T-03-02 | Team Queue lanes | functional | 1) Open Team Queue. | Team lanes show the team's tickets. | |
| T-03-03 | Move a ticket between agents in the queue | functional | 1) In Agent Queue, drag a ticket from Owner to B (if drag is offered). | Owner changes; History records it. | |
| T-03-04 | Empty team | edge | 1) Open a team with no tickets. | Clear empty state. | |
| T-03-05 | Agent sees only allowed queues | permission | 1) Sign in as Agent C. 2) Open Agent Queue. | Only his departments' agents/tickets. | |
| T-03-06 | Queues in Arabic | UI-RTL | 1) Switch to Arabic. 2) Open both queues. | RTL, names correct. | |
| T-03-07 | Drop on an agent outside the department | negative | 1) In Agent Queue drag a Marketing ticket onto an agent not in Marketing (if shown). | Refused with a message; owner unchanged. | |
| T-03-08 | Queue view kept | persistence | 1) Filter Agent Queue to Marketing. 2) Reload. | Filter and counts the same. | |

##### T-14 · Move ticket to another department (layout mapping)
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** NDC moves tickets between branches and finance teams.  
**Preconditions / data:** "QA MAN move 01" in Marketing with an owner. Target Sales. Candidate bug: moving to Sales cleared the owner.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-14-01 | Move to Sales | functional | 1) More › Move. 2) Pick Sales. 3) Confirm. | Department = Sales. History row. | |
| T-14-02 | Layout mapping | functional | 1) Move to a department with a different layout. | Mapping dialog asks where values go; values kept as mapped. | |
| T-14-03 | Owner after move | edge | 1) Check owner after the move. | Owner kept if he is in Sales, cleared with a notice if not. Record. | |
| T-14-04 | Move to the same department | negative | 1) Move to Marketing while in Marketing. | Not offered or refused. | |
| T-14-05 | Move survives reload | persistence | 1) Reload; open Sales views. | Ticket listed in Sales, not Marketing. | |
| T-14-06 | Agent loses access after move out | permission | 1) Move a Customer Support ticket of Agent C to Sales. 2) Agent C reloads it. | C can no longer open it. | |
| T-14-07 | Move dialog in Arabic | UI-RTL | 1) Arabic; open Move dialog. | RTL, department names right. | |

##### T-15 · Share ticket with departments (full / read-only / restricted)
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** 75 of NDC's 92 workflows share tickets across branches; Quality and Finance work depends on it.  
**Preconditions / data:** "QA MAN share 01" in Marketing. Agent C in Customer Support. Known: NDC-2303 (Done), NDC-2376.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-15-01 | Share read-only | functional | 1) More › Share. 2) Customer Support, Read only. 3) Save. | Share listed; banner on ticket. | |
| T-15-02 | Read-only agent cannot change | permission | 1) Agent C opens the ticket. 2) Try reply, comment, edit field, close. | C can read. All edits hidden or refused. | |
| T-15-03 | Change to Full access | functional | 1) Owner changes share to Full. 2) Agent C reloads and replies. | C can now reply and edit. | |
| T-15-04 | Restricted share | edge | 1) Change to Restricted (if offered). 2) Agent C opens. | Only the allowed parts are visible, as the dialog text says. | |
| T-15-05 | Unshare | functional | 1) Remove the share. 2) Agent C reloads. | C gets not found / no access. | |
| T-15-06 | Share with own department | negative | 1) Try to share with Marketing. | Not offered or refused. | |
| T-15-07 | Shared view lists it | integration | 1) Agent C opens the "Shared" system view. | Shared ticket listed while shared, gone after unshare. | |
| T-15-08 | Share kept after reload | persistence | 1) Share again; sign out/in. | Share and level unchanged. | |
| T-15-09 | Share dialog in Arabic | UI-RTL | 1) Arabic; open Share. | RTL, levels translated. | |

##### T-16 · Merge tickets
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Duplicates from phone + email must be merged; NDC has a "Closed Duplicated" status.  
**Preconditions / data:** Two tickets "QA MAN merge A" and "QA MAN merge B", same contact, each with one reply.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-16-01 | Merge two tickets | functional | 1) Select both in the list › Merge. 2) Pick A as master. 3) Confirm. | B closed and points to A. A's thread holds B's messages. | |
| T-16-02 | Unmerge | functional | 1) On A, unmerge B. | B back as its own ticket with its thread. | |
| T-16-03 | Merge one ticket only | negative | 1) Select one ticket › Merge. | Button disabled or message. | |
| T-16-04 | Merge tickets of different departments/contacts | edge | 1) Merge a Marketing and a Sales ticket. | Allowed with a warning or refused — record. Data not lost. | |
| T-16-05 | Merge kept after reload | persistence | 1) Reload both. | State unchanged. | |
| T-16-06 | Agent merge right | permission | 1) Agent C tries to merge two Customer Support tickets. | Allowed or hidden per profile. | |
| T-16-07 | Merge dialog in Arabic | UI-RTL | 1) Arabic; open Merge. | RTL, text clear. | |

##### T-10 · Snippets / canned responses and email templates in composer
**Priority:** P0 · **Wave:** 2 · **Status:** Built · **Partly covered before:** placeholders in the 26 Oct replies run.  
**Why this priority:** Fast, consistent replies; NDC uses templates in every department.  
**Preconditions / data:** Ticket "QA MAN reply 01".

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-10-01 | Create and insert a snippet | functional | 1) Create snippet "QA MAN snippet" with text "Dear ${contact name}, ticket ${ticket number}". 2) In Reply, insert it. | Placeholders filled with the real contact name and number. | |
| T-10-02 | Insert an email template | functional | 1) In Reply, open Templates. 2) Pick a Desk template. | Template text inserted, placeholders filled. | |
| T-10-03 | Unknown placeholder | negative | 1) Snippet with `${not_a_field}`. 2) Insert. | Left as text or blank with no error; reply still sends. | |
| T-10-04 | Search snippets | edge | 1) Type part of the name in the snippet search, also in Arabic. | Matching snippets only. | |
| T-10-05 | Snippet kept | persistence | 1) Sign out/in. 2) Open snippets. | Snippet still listed. | |
| T-10-06 | Personal vs shared snippet | permission | 1) Owner makes a personal snippet. 2) Agent C opens his snippet list. | Personal one not visible to C; shared one visible. | |
| T-10-07 | Arabic snippet | UI-RTL | 1) Snippet in Arabic; insert. | Text RTL in composer and email. | |

##### T-21 · Delete / restore (Recycle Bin)
**Priority:** P0 · **Wave:** 2 · **Status:** Partly  
**Why this priority:** A wrong delete must be recoverable.  
**Preconditions / data:** "QA MAN delete 01". Known: NDC-2248 (delete forever), NDC-2516, NDC-2517.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-21-01 | Delete and restore | functional | 1) More › Delete › confirm. 2) Settings › Data › Recycle Bin. 3) Restore it. | Ticket gone from lists, in the bin, then back with thread and fields. | |
| T-21-02 | Delete forever | functional | 1) Delete again. 2) In the bin, Delete forever. | Removed from the bin. (Known fail NDC-2248 — record.) | |
| T-21-03 | Cancel the confirm | negative | 1) Delete › Cancel. | Nothing deleted. | |
| T-21-04 | Open a deleted ticket link | edge | 1) Open the URL of a deleted ticket. | "Deleted" or not found; no edit possible. | |
| T-21-05 | Agent cannot delete | permission | 1) Agent C opens his own ticket. | Delete hidden/refused (Desk Agent cannot delete). | |
| T-21-06 | Bin in Arabic | UI-RTL | 1) Arabic; open Recycle Bin. | Names readable (not ids), RTL. | |
| T-21-07 | Restored ticket complete after sign-in | persistence | 1) After restore, sign out and in. 2) Open the ticket. | Thread, attachments, owner and history all present. | |

##### T-24 · Attachments (upload, preview, size limits)
**Priority:** P0 · **Wave:** 2 · **Status:** Partly  
**Why this priority:** NDC finance tickets carry invoices and bank slips (40 MB / 40 files limit in Zoho).  
**Preconditions / data:** Files: small .txt, 2 MB .jpg, 5 MB .pdf, 45 MB .zip, a renamed .exe, an Arabic file name. Known: NDC-2753 (no annotator, blueprint transition with file fails).

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-24-01 | Upload and preview | functional | 1) Attachment tab › upload .jpg and .pdf. 2) Click each. | Listed with name and size; preview opens. | |
| T-24-02 | Attach to a reply | integration | 1) Reply with the .pdf attached. 2) Check M1. | Email arrives with the attachment, opens fine. | |
| T-24-03 | Over-size file | negative | 1) Upload the 45 MB .zip. | Refused with the size limit in the message. | |
| T-24-04 | Blocked type | negative | 1) Upload the .exe. | Refused, or accepted — record (security note). | |
| T-24-05 | Arabic file name and 10 files at once | edge | 1) Select 10 files incl. the Arabic name. | All upload; names kept. | |
| T-24-06 | Delete attachment | functional | 1) Delete one file. 2) Reload. | Gone after reload. | |
| T-24-07 | Read-only agent cannot delete | permission | 1) Share read-only with Customer Support. 2) Agent C tries to delete a file. | Refused; download allowed. | |
| T-24-08 | Attachment panel in Arabic | UI-RTL | 1) Arabic; open the tab. | RTL, sizes readable. | |
| T-24-09 | Files kept after sign-in | persistence | 1) Sign out and in. 2) Open Attachment tab. | Same files, same sizes; downloads open. | |

##### T-25 · Collision detection (others viewing / replying)
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Two agents answering the same caller is a real NDC risk.  
**Preconditions / data:** Two browsers: Owner and Admin B. Known: NDC-1965.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-25-01 | Viewing indicator | functional | 1) Owner and B open the same ticket. | Each sees "X is also viewing". | |
| T-25-02 | Replying indicator | functional | 1) B starts typing a reply. | Owner sees "B is replying". | |
| T-25-03 | Reply after the other sent | edge | 1) B sends. 2) Owner, with an old page, sends. | Owner warned that a new reply was added before sending. | |
| T-25-04 | Indicator clears | negative | 1) B closes the tab. 2) Wait 1 minute. | Indicator disappears. | |
| T-25-05 | Indicator in Arabic | UI-RTL | 1) Arabic; repeat T-25-01. | Message in Arabic, RTL. | |
| T-25-06 | Reply not lost after the warning | persistence | 1) Owner gets the "new reply added" warning while typing. 2) Reload. | Owner's unsent text is kept as a draft, or the warning said it would be lost. | |

##### T-31 · Bulk actions (assign, status, mass update, mass delete, export)
**Priority:** P0 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Supervisors fix many tickets at once (for example after a routing error).  
**Preconditions / data:** 3 QA MAN tickets in Marketing.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-31-01 | Bulk assign | functional | 1) Tick 3 tickets › Assign › Admin B. | All 3 owned by B. | |
| T-31-02 | Mass update priority | functional | 1) Tick 3 › Mass update › Priority Low. | All 3 updated; Settings › Data › Bulk actions log shows a row. | |
| T-31-03 | Bulk close | functional | 1) Tick 3 › Close. | All closed. | |
| T-31-04 | Bulk export | integration | 1) Tick 3 › Export CSV. 2) Open the file. | 3 rows, right columns, Arabic readable (UTF-8). | |
| T-31-05 | Nothing selected | negative | 1) Click a bulk action with nothing ticked. | Disabled or message. | |
| T-31-06 | Select all pages | edge | 1) Select all on a large view. | Count shown; action applies to the stated count only. Do not run a real mass change on non-QA tickets. | |
| T-31-07 | Agent bulk rights | permission | 1) Agent C ticks 2 of his tickets. | Only allowed actions shown (no mass delete). | |
| T-31-08 | Bulk bar in Arabic | UI-RTL | 1) Arabic; tick tickets. | Bar RTL, counts readable. | |
| T-31-09 | Bulk changes kept | persistence | 1) After T-31-01..03 reload the view. | All 3 tickets show the new owner, priority and status. | |


#### P0 · Automation (runtime)

> All rules below go in a "QA NDC …" department and use the guard condition **Subject starts with "QA MAN"**, so no real ticket is touched. Write down every rule you create; delete it at the end (see Cleanup).

##### U-01 · Assignment rules: direct + round robin, criteria, order
**Priority:** P0 · **Wave:** 3 · **Status:** Built · **Partly covered before:** assignment-rules intake (6 Oct, spec + requirements NDC-2275); the runtime was never run on NDC-Staging. Focus on rules really firing.  
**Why this priority:** NDC has 30 direct and 24 round-robin rules; routing is the first thing a new ticket needs.  
**Preconditions / data:** Department "QA NDC Routing" (or any QA NDC dept) with Owner, Admin B and one more agent; a team. Settings › Automation › Assignment Rules.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-01-01 | Direct rule assigns to an agent | functional | 1) New direct rule "QA MAN direct", dept QA NDC Routing, criteria Subject starts with "QA MAN dir", target Admin B. 2) Activate. 3) Create ticket "QA MAN dir 01" there. | Ticket owner = B within a minute. History says the rule assigned it. | |
| U-01-02 | Direct rule to a team | functional | 1) Edit target to the team. 2) Create "QA MAN dir 02". | Team set, owner empty (or as rule says). | |
| U-01-03 | Round robin spreads tickets | functional | 1) Round-robin rule "QA MAN rr" on Subject starts with "QA MAN rr", agents Owner + B. 2) Create 4 tickets "QA MAN rr 01..04". | Owners alternate (2 each). | |
| U-01-04 | Rule order decides | functional | 1) Two rules both match "QA MAN ord". 2) Put rule X first. 3) Create a ticket. 4) Swap order, create another. | First matching rule in the list wins each time. | |
| U-01-05 | Criteria do not match | negative | 1) Create "QA MAN nomatch" (no rule matches). | Ticket stays unassigned; no error. | |
| U-01-06 | Inactive rule does nothing | negative | 1) Deactivate "QA MAN direct". 2) Create "QA MAN dir 03". | Not assigned by that rule. | |
| U-01-07 | Ticket already owned | edge | 1) Create "QA MAN dir 04" with owner = Owner set on the form. | Direct rule does not overwrite the chosen owner (Zoho rule, NDC-2275). | |
| U-01-08 | Target agent deactivated | edge | 1) Rule target an agent who is later removed from the department. 2) Create a ticket. | Ticket not assigned to the removed agent; clear history note. | |
| U-01-09 | Rule kept after reload | persistence | 1) Reload rules page; sign in again. | Rules, order and active state unchanged. | |
| U-01-10 | Agent cannot manage rules | permission | 1) Sign in as Agent C. 2) Open Settings › Assignment Rules (URL). | No access. | |
| U-01-11 | Rules page in Arabic | UI-RTL | 1) Arabic; open and edit a rule. | RTL, criteria builder readable. | |

##### U-02 · Round-robin preferences (thresholds, online-only, backlog)
**Priority:** P0 · **Wave:** 3 · **Status:** Partly  
**Why this priority:** Load balancing to online agents is how NDC spreads 2.5 M tickets; requirements in NDC-2275.  
**Preconditions / data:** "QA MAN rr" rule from U-01. Two agents who can go online/offline.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-02-01 | Online-only | functional | 1) Turn on "online agents only". 2) Set B offline. 3) Create 2 "QA MAN rr" tickets. | Both go to the online agent only. | |
| U-02-02 | Threshold per agent | functional | 1) Set max open tickets = 1. 2) Each agent already owns 1 open QA ticket. 3) Create a new one. | New ticket not assigned (goes to backlog). | |
| U-02-03 | Backlog drains | functional | 1) Close one agent's ticket. | Backlog ticket is assigned to that agent. | |
| U-02-04 | Threshold 0 or negative | negative | 1) Type 0, then -1 as threshold. 2) Save. | Refused with a message. | |
| U-02-05 | All agents offline | edge | 1) All offline. 2) Create a ticket. | Stays in backlog; assigned when someone comes online. | |
| U-02-06 | Preferences kept | persistence | 1) Reload. | Values unchanged. | |
| U-02-07 | Preferences in Arabic | UI-RTL | 1) Arabic; open preferences. | RTL, help texts Arabic. | |

##### U-04 · Workflow rules (triggers, criteria, instant + time-based actions)
**Priority:** P0 · **Wave:** 3 · **Status:** Built · **Partly covered before:** workflow-rules run 12–14 Oct (82 pass, bugs B-1..B-9) and NDC-2203 retest 26 Oct. Focus on NDC patterns: field-change triggers, share ticket, assign, status set, (1 and 2) criteria, time-based.  
**Why this priority:** NDC runs 90 active workflows; most share tickets or move them between teams.  
**Preconditions / data:** QA NDC department; Settings › Automation › Workflow Rules. Known: NDC-2731 (Actions count), NDC-2764 (workflow sets Status → ticket leaves blueprint), D1 (team assignment ignored by Create rules).

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-04-01 | On create → share ticket | functional | 1) Rule "QA MAN wf share": on Create, Subject starts with "QA MAN wf", action Share with Sales (read only). 2) Create "QA MAN wf 01". | Ticket shared with Sales automatically. | |
| U-04-02 | On field change | functional | 1) Rule on Edit when a custom field (e.g. "Related Branch" or Priority) changes to a value → field update Status = On Hold. 2) Change that field. | Status becomes On Hold only when that field changes. | |
| U-04-03 | Criteria pattern (1 and 2) or 3 | functional | 1) Rule with 3 conditions and pattern "(1 and 2) or 3". 2) Make tickets that match 1+2, only 3, only 1. | Fires on the first two; not on "only 1". | |
| U-04-04 | Time-based action | functional | 1) Rule with action "5 minutes after create → add comment". 2) Create a ticket; wait 6 minutes. | Comment added once after about 5 minutes. | |
| U-04-05 | Rule does not fire on non-matching | negative | 1) Create "Other subject" in the QA dept. | No action runs. | |
| U-04-06 | Loop guard | edge | 1) Two rules: A sets field X on edit, B sets field Y when X changes, A runs when Y changes. 2) Edit a ticket. | No endless loop; ticket stays usable; executions stop. | |
| U-04-07 | Cancel scheduled action | edge | 1) Create a ticket that schedules an action. 2) Close it before it runs (rule says "cancel on close" or criteria no longer true). | Scheduled action does not run. | |
| U-04-08 | Execution history | integration | 1) Open the rule's Execution History. | Each run listed with ticket, time, result. | |
| U-04-09 | Rule kept after reload | persistence | 1) Reload; reopen the rule. | Triggers, criteria, actions unchanged; Actions count right (NDC-2731). | |
| U-04-10 | Agent cannot edit rules | permission | 1) Agent C opens the rules URL. | No access. | |
| U-04-11 | Rule editor in Arabic | UI-RTL | 1) Arabic; build a rule. | RTL, operators readable. | |

##### U-05 · Workflow action library (email, task, field update, webhook, custom function)
**Priority:** P0 · **Wave:** 3 · **Status:** Built · **Partly covered before:** 12–14 Oct run (email, field update, webhook, custom action). Focus on actions NDC uses: Send email reply, Assign ticket (team + agent), field update that clears owner.  
**Why this priority:** The actions are what really changes the ticket.  
**Preconditions / data:** Settings › Automation › Actions. Mailbox M1.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-05-01 | Send email reply action | functional | 1) Action "QA MAN email reply" to contact + CC M2. 2) Use it in an on-create rule. 3) Create a ticket for QA MAN Contact 1. | M1 and M2 get the email; it shows in the ticket thread. | |
| U-05-02 | Assign ticket to team + agent | functional | 1) Action Assign: team + agent. 2) Rule on create. | Both set. | |
| U-05-03 | Field update clears owner | functional | 1) Field update: Owner = empty, Team = X (NDC "Waiting Top-Up Manager" pattern). | Owner cleared, team set. | |
| U-05-04 | Create task action | functional | 1) Action Create task due +1 day. | Task linked to the ticket, right due date. | |
| U-05-05 | Field update with wrong type | negative | 1) Try to set a date field to text in the action editor. | Not allowed. | |
| U-05-06 | Action used by a rule is deleted | edge | 1) Try deleting an action used by an active rule. | Blocked with a list of rules, or rule shows a clear broken action. | |
| U-05-07 | Action kept after reload | persistence | 1) Reload library. | Saved values unchanged. | |
| U-05-08 | Library in Arabic | UI-RTL | 1) Arabic; open an action. | RTL. | |

##### U-06 · Workflow triggers on customer reply / agent reply / rating
**Priority:** P0 · **Wave:** 3 · **Status:** Built · **Partly covered before:** NDC-1986 is Ready For Test.  
**Why this priority:** "Customer replied → reopen / notify" is daily NDC behaviour.  
**Preconditions / data:** QA dept, ticket from mailbox M1.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-06-01 | On customer reply | functional | 1) Rule: on customer reply → Status Open + comment. 2) Put a ticket On Hold. 3) Reply from M1. | Status Open, comment added. | |
| U-06-02 | On agent reply | functional | 1) Rule: on agent reply → Status "Waiting customer" (or On Hold). 2) Agent replies. | Status changes. | |
| U-06-03 | On comment / private thread | functional | 1) Rule on comment added → tag/field. 2) Add a comment. | Fires once. | |
| U-06-04 | Agent reply does not fire customer trigger | negative | 1) With U-06-01 active, agent replies. | U-06-01 rule does not run. | |
| U-06-05 | On happiness rating Bad | edge | 1) Rule on rating = Bad → assign to supervisor. 2) Rate Bad from the email link. | Rule runs. | |
| U-06-06 | Trigger kept | persistence | 1) Reload rule. | Event selection unchanged. | |
| U-06-07 | Trigger list in Arabic | UI-RTL | 1) Arabic; open the rule "When" options. | Event names Arabic, RTL. | |

##### U-07 · SLA policies (targets per priority, business hours, escalation)
**Priority:** P0 · **Wave:** 3 · **Status:** Built · **Partly covered before:** department SLA timing inside the blueprint runs 1–3 Nov (NDC-2774 Saturday counted, NDC-2788 warning actions never run). Focus on plain SLA without blueprint.  
**Why this priority:** NDC has 200 SLA records and an SLA dashboard.  
**Preconditions / data:** QA dept, a QA business-hours set (24x7 and Sun–Thu 9–17). Settings › Automation › SLA. Use minutes for targets.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-07-01 | SLA applies on create | functional | 1) Policy "QA MAN SLA": High = first response 10 min, resolution 30 min, 24x7, criteria Subject starts with "QA MAN sla". 2) Create a High ticket. | SLA panel shows policy and due times = created + 10/30 min. | |
| U-07-02 | First response met | functional | 1) Reply within 10 min. | Response target "met". | |
| U-07-03 | Violation and escalation | functional | 1) Escalation level 1 → notify Admin B. 2) Let the resolution target pass. | "Violated" shown; B gets the escalation notice. | |
| U-07-04 | Business hours count | edge | 1) Switch the policy to Sun–Thu 9–17. 2) Create a ticket Thursday 16:55 with 30 min target. | Due falls on Sunday 9:25, not Friday/Saturday. | |
| U-07-05 | Pause on On Hold | edge | 1) Put the ticket On Hold for 10 min. 2) Back to Open. | Due time moves later by the paused time (if "pause on hold" is on). | |
| U-07-06 | Priority change recalculates | functional | 1) Change High → Low. | Due times recalculate to the Low targets. | |
| U-07-07 | Invalid target | negative | 1) Target 0 or negative minutes. | Refused. | |
| U-07-08 | Policy kept | persistence | 1) Reload. | Targets, hours, escalation unchanged. | |
| U-07-09 | Agent cannot edit SLA | permission | 1) Agent C opens the SLA settings URL. | No access. | |
| U-07-10 | SLA panel in Arabic | UI-RTL | 1) Arabic; open the ticket SLA panel. | Times and labels readable, RTL. | |

##### U-09 · Blueprints (states, transitions, before/during/after, SLA per state)
**Priority:** P0 · **Wave:** 3 · **Status:** Built · **Partly covered before:** Blueprint Phases 1–6 (1–3 Nov) covered designer rules, timers, webhook, custom action, emails, chat ticket. Not covered: agent-side transition rights (transition owner = team / ticket owner), NDC-style long approval chain end to end, Arabic.  
**Why this priority:** NDC approval chains (ADM, Financial approvals, refunds) are blueprints.  
**Preconditions / data:** QA dept; blueprint "QA MAN BP" with states New → Validation → Finance → Approved/Rejected; criteria Subject starts with "QA MAN bp". Known: NDC-2755..2758, 2761..2764, 2774, 2775, 2780, 2782, 2788.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-09-01 | Ticket enters the blueprint | functional | 1) Publish "QA MAN BP". 2) Create "QA MAN bp 01". | Ticket shows the blueprint strip at state New with its transitions. | |
| U-09-02 | Transition owner = team | permission | 1) Transition "Send to Finance" owner = a team without Agent C. 2) C opens the ticket (shared). 3) Owner/team member opens it. | C does not see the button; the team member does. | |
| U-09-03 | Mandatory field during transition | functional | 1) "Reject" asks for "Rejection reason" (required). 2) Click Reject, leave it empty. 3) Fill and save. | Blocked when empty; saved when filled; state = Rejected. | |
| U-09-04 | After-transition field update + email | functional | 1) After "Approve": Status = Approved, email to contact. 2) Run Approve. | Field updated, M1 gets the email. | |
| U-09-05 | Status edited outside the blueprint | negative | 1) Edit the Status field directly on a ticket in the blueprint. | Refused, or the ticket leaves the blueprint (NDC-2764) — record. | |
| U-09-06 | Full chain end to end | integration | 1) Run New → Validation → Finance → Approved with 3 different users. | Each step by the right user; History shows every transition with user and time. | |
| U-09-07 | Blueprint kept after reload | persistence | 1) Reload the ticket mid-chain. | Same state, same buttons. | |
| U-09-08 | Strip in Arabic | UI-RTL | 1) Arabic; open the ticket. | Strip RTL, state names right. | |
| U-09-09 | Two users run the same transition | edge | 1) Two transition owners open the ticket. 2) Both click "Send to Finance" within 2 seconds. | Runs once; the second user gets "state changed" and sees the new state. | |

##### U-12 · Notification rules per department (customer / agent emails)
**Priority:** P0 · **Wave:** 3 · **Status:** Built  
**Why this priority:** NDC uses assignment, comment, new/closed ticket and moved/shared notices per department.  
**Preconditions / data:** Settings › Customization › Notifications, QA dept. Mailbox M1 for customer, an agent mailbox you can read. Known: NDC-2389.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-12-01 | Customer "new ticket" acknowledgement | functional | 1) Turn on for the QA dept. 2) Email a new ticket from M1. | M1 gets the acknowledgement with the ticket number. | |
| U-12-02 | Agent "assigned to you" email | functional | 1) Turn on. 2) Assign a QA ticket to an agent with a readable mailbox. | Email arrives with a working link. | |
| U-12-03 | Turned off sends nothing | negative | 1) Turn off "ticket closed" for customer. 2) Close a ticket. | No email to M1. | |
| U-12-04 | Per department only | edge | 1) Rule on in QA dept, off in Marketing. 2) Same event in both. | Email only for the QA dept ticket. | |
| U-12-05 | Shared / moved notice | functional | 1) Turn on "ticket shared" for the target dept. 2) Share a QA ticket. | Target dept agents notified. | |
| U-12-06 | Setting kept | persistence | 1) Reload. | Toggles unchanged. | |
| U-12-07 | Page in Arabic | UI-RTL | 1) Arabic; open the page. | RTL, names Arabic. | |

#### P0 · Channels

##### N-01 · Email: support addresses, forwarding, domains, outgoing addresses
**Priority:** P0 · **Wave:** 4 · **Status:** Built  
**Why this priority:** Email in/out must work on day one (NDC: 25 support addresses).  
**Preconditions / data:** Settings › Channels › Email (1 address, "Mail is arriving"). Mailbox M1. Ask the admin before adding a new address.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-01-01 | Email creates a ticket | functional | 1) From M1 send "QA MAN mail 01" to the support address. 2) Wait 2 min. | New ticket in the mapped department, contact = M1, channel Email. | |
| N-01-02 | From address on replies | functional | 1) Reply from the ticket. 2) Check From in M1. | The department's support address, not a system address. | |
| N-01-03 | Add a support address | functional | 1) Add "qa-man" alias (if allowed), map to QA dept. 2) Verify. 3) Send a mail to it. | Verified; ticket goes to the QA dept. | |
| N-01-04 | Invalid address | negative | 1) Add "abc@" as support address. | Refused. | |
| N-01-05 | Mail with Arabic subject and 5 attachments | edge | 1) Send it from M1. | Subject correct, all attachments on the ticket. | |
| N-01-06 | Reply-to in an old thread | edge | 1) Reply from M1 to a 2-day-old ticket email. | Threads on the same ticket. | |
| N-01-07 | Settings kept | persistence | 1) Reload. | Address, mapping unchanged. | |
| N-01-08 | Agent cannot edit channels | permission | 1) Agent C opens the URL. | No access. | |
| N-01-09 | Email settings in Arabic | UI-RTL | 1) Arabic; open the page. | RTL. | |

##### N-02 · Email: spam filter, blocked addresses, suppressions
**Priority:** P0 (inventory P1, raised) · **Wave:** 4 · **Status:** Built  
**Why this priority:** Raised because it is part of email in (user rule N-01..N-04). A wrong block loses customer mail.  
**Preconditions / data:** Mailboxes M1 and M2.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-02-01 | Block an address | functional | 1) Add M2 to blocked. 2) Send a mail from M2. | No ticket created (or goes to spam). | |
| N-02-02 | Unblock | functional | 1) Remove M2. 2) Send again. | Ticket created. | |
| N-02-03 | Mark spam from a ticket | functional | 1) Mark a QA ticket spam. 2) Open Spam view. 3) Not spam. | Listed in Spam, then back. | |
| N-02-04 | Block an invalid value | negative | 1) Add "@@" to blocked. | Refused. | |
| N-02-05 | Suppression list | edge | 1) Open Suppressions. 2) Check a bounced address (if any). | Listed with reason; remove works. | |
| N-02-06 | Lists kept | persistence | 1) Reload. | Entries unchanged. | |
| N-02-07 | Page in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### N-03 · Email providers (Gmail / Microsoft / SMTP connect)
**Priority:** P0 · **Wave:** 4 · **Status:** Built  
**Why this priority:** NDC may send through its own mail server.  
**Preconditions / data:** Settings › Integrations › Email Providers. A test Gmail or SMTP account you control. Do not disconnect the live provider.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-03-01 | Connect SMTP | functional | 1) Add SMTP with host, port, user, password of the test account. 2) Test. | "Connected" / test mail arrives. | |
| N-03-02 | Wrong password | negative | 1) Enter a wrong password. 2) Test. | Clear error; not saved as connected. | |
| N-03-03 | Send through the provider | integration | 1) Map the QA address to the provider. 2) Reply from a QA ticket. | Mail sent via the provider (check headers in M1). | |
| N-03-04 | Provider stops working | edge | 1) Change the test account password outside TAVI. 2) Send a reply. | Reply shows failed with a reason; nothing marked sent. | |
| N-03-05 | Kept after reload | persistence | 1) Reload. | Provider listed; password not shown in clear. | |
| N-03-06 | Page in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### N-04 · Email templates (placeholders, per department, languages)
**Priority:** P0 · **Wave:** 4 · **Status:** Built  
**Why this priority:** All customer and agent notices use these (NDC ~65 per department).  
**Preconditions / data:** Settings › Organization › Email Templates. Known: NDC-2389, NDC-1984.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-04-01 | Create a template | functional | 1) New "QA MAN template EN" for QA dept, subject "Ticket ${ticket number}", body with contact name. 2) Save. | Listed. | |
| N-04-02 | Placeholders filled | integration | 1) Use it in a notification or reply. 2) Check M1. | Real values, no `${...}` left. | |
| N-04-03 | Arabic template | UI-RTL | 1) Arabic body. 2) Send. | M1 shows Arabic RTL. | |
| N-04-04 | Empty subject | negative | 1) Save with empty subject. | Refused. | |
| N-04-05 | Template used by a rule is deleted | edge | 1) Delete a template used in a notification. | Blocked or rule shows a clear warning. | |
| N-04-06 | Kept after reload | persistence | 1) Reload. | Content unchanged. | |

##### N-05 · Web forms + feedback widget (embed code, hosted link)
**Priority:** P0 · **Wave:** 4 · **Status:** Partly · **Partly covered before:** NDC-2732 iframe retest (1 Nov). Focus on the full submit → ticket flow.  
**Why this priority:** NDC customers submit via web forms and feedback widgets.  
**Preconditions / data:** Settings › Channels › Web Forms. A signed-out browser window. Known: NDC-2751 (script embed CORS), NDC-1488 (hosted link 404).

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-05-01 | Create a form | functional | 1) New form "QA MAN form", fields name/email/subject/description, dept QA. 2) Save. | Listed with embed code. | |
| N-05-02 | Submit via hosted link | functional | 1) Open the hosted link signed out. 2) Submit "QA MAN form 01" with M1. | Thank-you message; ticket in QA dept with channel Web. | |
| N-05-03 | Submit via iframe | functional | 1) "Test your form" (iframe). 2) Submit. | Ticket created. | |
| N-05-04 | Required field empty | negative | 1) Submit without email. | Blocked with a message. | |
| N-05-05 | Script embed on another site | edge | 1) Paste the script code in a local HTML file. 2) Open it. | Form loads and submits (known CORS fail NDC-2751 — record). | |
| N-05-06 | Form kept | persistence | 1) Reload settings. | Fields and dept unchanged. | |
| N-05-07 | Arabic form | UI-RTL | 1) Set form language Arabic (if offered). 2) Open hosted link. | Labels Arabic, RTL; Arabic input saved. | |

##### N-06 · Help Center (portal, sign-up, ticket submit, my tickets, KB, branding)
**Priority:** P0 · **Wave:** 4 · **Status:** Built  
**Why this priority:** NDC customers use a help center (Arabic configured).  
**Preconditions / data:** Help Center URL from Settings › Channels › Help Center. A new email for sign-up (M2). Known: NDC-1990 (RFT), NDC-2263..2265.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-06-01 | Sign up and sign in | functional | 1) Open the portal signed out. 2) Sign up with M2. 3) Confirm the email. 4) Sign in. | Account works; name shows. | |
| N-06-02 | Submit a ticket | functional | 1) Signed in, Submit ticket "QA MAN portal 01". | Ticket in Desk with contact M2, channel Web/Portal. | |
| N-06-03 | My tickets and reply | integration | 1) Agent replies in Desk. 2) Customer opens My tickets. 3) Customer replies in the portal. | Agent reply visible; customer reply threads in Desk. | |
| N-06-04 | Customer sees only own tickets | permission | 1) Sign in as M1 contact. 2) Try the URL of M2's ticket. | No access. | |
| N-06-05 | Wrong password / unconfirmed email | negative | 1) Sign in with a wrong password. | Clear error, no detail leak. | |
| N-06-06 | Private comment hidden | edge | 1) Agent adds a private comment. 2) Customer reloads. | Not visible. | |
| N-06-07 | Branding kept | persistence | 1) Change portal title/colour. 2) Reload portal. | New look shown. Set back after. | |
| N-06-08 | Portal in Arabic | UI-RTL | 1) Switch the portal to Arabic. | Full RTL, menus Arabic. | |

##### N-08 · Knowledge base (articles, categories, drafts, review, expiry, templates)
**Priority:** P0 · **Wave:** 4 · **Status:** Built  
**Why this priority:** NDC has 190 articles in ~50 categories; customers read them in the portal.  
**Preconditions / data:** /knowledge-base. Known: NDC-2651.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-08-01 | Create and publish an article | functional | 1) New category "QA MAN cat". 2) New article "QA MAN article", body with image. 3) Publish. | Visible in KB and in the portal. | |
| N-08-02 | Draft not public | functional | 1) Save another article as draft. 2) Search it in the portal. | Not found in the portal. | |
| N-08-03 | Review flow | functional | 1) Send an article for review to Admin B. 2) B approves. | Published after approval. | |
| N-08-04 | Expiry date | edge | 1) Set expiry to 5 minutes from now. 2) Wait. | Article unpublished/marked expired. | |
| N-08-05 | Empty title | negative | 1) Publish without title. | Refused. | |
| N-08-06 | Internal article | permission | 1) Set visibility Agents only. 2) Open in the portal. | Not visible to customers. | |
| N-08-07 | Kept after reload | persistence | 1) Reload. | Body, images, category unchanged. | |
| N-08-08 | Arabic article | UI-RTL | 1) Write an Arabic article; publish. 2) View in the portal (Arabic). | RTL, search finds Arabic words. | |

#### P0 · Customers

##### C-01 · Contacts (CRUD, views, find duplicates, merge, portal access)
**Priority:** P0 · **Wave:** 5 · **Status:** Built  
**Why this priority:** Every ticket hangs on a contact; NDC syncs contacts from CRM.  
**Preconditions / data:** /modules/contacts.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| C-01-01 | Create, edit, delete | functional | 1) New contact "QA MAN Contact 2", email, Arabic name, phone. 2) Edit phone. 3) Delete. | Each step saved; deleted goes to the bin. | |
| C-01-02 | Find duplicates and merge | functional | 1) Create "QA MAN Dup" twice with the same email. 2) Find duplicates. 3) Merge. | One contact left with both tickets. | |
| C-01-03 | Invalid email / duplicate email | negative | 1) Save email "abc". 2) Save a second contact with an existing email. | First refused; second refused or warned. | |
| C-01-04 | Give portal access | integration | 1) Enable portal access. 2) Check the invite mail. | Invite arrives; contact can sign in. | |
| C-01-05 | Very long name and special characters | edge | 1) 200-char name with emoji. | Saved or limit message; list shows it cleanly. | |
| C-01-06 | Kept after reload | persistence | 1) Reload; search. | Values unchanged. | |
| C-01-07 | Agent rights | permission | 1) Agent C tries to delete a contact. | Allowed/refused per profile. | |
| C-01-08 | Contacts in Arabic | UI-RTL | 1) Arabic; list and form. | RTL. | |

##### C-02 · Accounts (CRUD, contacts under account, hierarchy)
**Priority:** P0 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC agencies are accounts synced from CRM.  
**Preconditions / data:** /modules/accounts.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| C-02-01 | Create account and link contacts | functional | 1) New "QA MAN Account". 2) Link QA MAN Contact 1. | Contact listed under the account; ticket shows the account. | |
| C-02-02 | Parent account | functional | 1) Set "QA MAN Account" as parent of "QA MAN Sub". | Hierarchy shown. | |
| C-02-03 | Self as parent | negative | 1) Set an account as its own parent. | Refused. | |
| C-02-04 | Delete account with contacts | edge | 1) Delete "QA MAN Account". | Warned; contacts stay (unlinked) or as stated. | |
| C-02-05 | Kept after reload | persistence | 1) Reload. | Values unchanged. | |
| C-02-06 | Agent rights | permission | 1) Agent C edits an account. | Per profile. | |
| C-02-07 | Accounts in Arabic | UI-RTL | 1) Arabic. | RTL. | |

#### P0 · Insight

##### I-01 · Headquarters dashboard (components, trends, unassigned)
**Priority:** P0 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC managers open the Overview dashboard daily.  
**Preconditions / data:** /hq. Known: NDC-2346, NDC-2351, NDC-2352.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| I-01-01 | Numbers match the list | functional | 1) Note "Unassigned" and "Open" counts. 2) Compare with All Tickets filters. | Same numbers. | |
| I-01-02 | Number moves with a new ticket | functional | 1) Create an unassigned QA ticket. 2) Refresh HQ. | Unassigned +1. | |
| I-01-03 | Department filter | functional | 1) Filter to Marketing. | Only Marketing numbers. | |
| I-01-04 | No data period | edge | 1) Pick a date range with no tickets. | Zero / empty, no error. | |
| I-01-05 | Agent sees own scope | permission | 1) Agent C opens HQ. | Only Customer Support data. | |
| I-01-06 | HQ in Arabic | UI-RTL | 1) Arabic. | Charts and labels RTL. | |
| I-01-07 | End date before start date | negative | 1) Pick a custom range with end before start. | Refused or swapped; no error screen. | |
| I-01-08 | Filter kept | persistence | 1) Set Marketing filter. 2) Reload. | Filter kept (or reset by design — record). | |

##### I-02 · Reports (standard, custom, scheduled, export)
**Priority:** P0 · **Wave:** 5 · **Status:** Not confirmed  
**Why this priority:** NDC uses Request, SLA and TOPUP dashboards and 4 custom reports.  
**Preconditions / data:** /analytics, /reports. Known: NDC-2364 ("Loading your departments…"), NDC-2068. If the page does not load, mark all cases Blocked.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| I-02-01 | Page loads | functional | 1) Open Analytics / Reports. | Department list and reports load within 10 s. | |
| I-02-02 | Standard report numbers | functional | 1) Open "Tickets by status". 2) Compare with list counts. | Match. | |
| I-02-03 | Custom report "Tickets by department" | functional | 1) New report grouped by department, last 30 days. 2) Save. | Saved; numbers right. | |
| I-02-04 | SLA report | integration | 1) Open the SLA report after U-07. | QA SLA tickets show met / violated correctly. | |
| I-02-05 | Export | functional | 1) Export to CSV/PDF. | File matches the screen. | |
| I-02-06 | Schedule a report | edge | 1) Schedule daily to M1. | Mail arrives next run. | |
| I-02-07 | Agent scope | permission | 1) Agent C opens reports. | Only allowed data. | |
| I-02-08 | Reports in Arabic | UI-RTL | 1) Arabic. | RTL. | |
| I-02-09 | Report with no grouping | negative | 1) Save a custom report with no columns or grouping. | Refused with a message. | |
| I-02-10 | Custom report kept | persistence | 1) Reload; sign in again. | "Tickets by department" report still listed with the same settings. | |

##### I-03 · Dashboards (standard + custom)
**Priority:** P0 · **Wave:** 5 · **Status:** Not confirmed  
**Why this priority:** NDC dashboards Overview, Request, SLA, TOPUP must be rebuildable.  
**Preconditions / data:** /dashboards (now redirects to /hq, NDC-2364). If no dashboard page, mark Blocked.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| I-03-01 | Open dashboards library | functional | 1) Open /dashboards. | Library page, not HQ. | |
| I-03-02 | Build "QA MAN TOPUP" dashboard | functional | 1) New dashboard, add a chart "tickets by status for department X". | Chart shows right numbers. | |
| I-03-03 | Empty dashboard name | negative | 1) Save without name. | Refused. | |
| I-03-04 | Kept after reload | persistence | 1) Reload. | Dashboard and charts kept. | |
| I-03-05 | Share with agents | permission | 1) Share to a role; Agent C opens. | Visible only if shared. | |
| I-03-06 | Dashboard in Arabic | UI-RTL | 1) Arabic. | RTL. | |
| I-03-07 | Dashboard with 10 charts | edge | 1) Add 10 charts to "QA MAN TOPUP". 2) Reload. | All charts load within 10 s. | |

#### P0 · Data

##### D-01 · Import (CSV/Excel, mapping, validation, undo, history)
**Priority:** P0 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC data must be loaded before go-live.  
**Preconditions / data:** CSV "qa-man-contacts.csv": 5 rows (names start "QA MAN Imp", 1 bad email, 1 Arabic name, 1 duplicate). Known: NDC-2512, 2513, 2515.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-01-01 | Import contacts | functional | 1) Settings › Data › Import › Contacts. 2) Upload CSV, map fields. 3) Run. | 3–4 good rows imported; summary counts right. | |
| D-01-02 | Bad rows reported | negative | 1) Open the result. | Bad email row skipped with a reason file. | |
| D-01-03 | Duplicate handling | edge | 1) Choose "skip" then "update" for duplicates (two runs). | Behaviour matches the choice. | |
| D-01-04 | Import tickets | functional | 1) Import 3 tickets "QA MAN Imp T" to QA dept. | Tickets created with right fields and contact. | |
| D-01-05 | Undo import | functional | 1) Undo the contact import. | Imported rows removed. | |
| D-01-06 | Wrong file type | negative | 1) Upload a .pdf. | Refused. | |
| D-01-07 | History kept | persistence | 1) Reload Import history. | Runs listed. | |
| D-01-08 | Agent cannot import | permission | 1) Agent C opens Import. | No access. | |
| D-01-09 | Arabic file | UI-RTL | 1) Arabic UI; CSV with Arabic headers/values. | Arabic text not broken. | |

##### D-02 · Export (module, view, fields, 7-day download)
**Priority:** P0 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC needs reports and backups out of Desk. Known: NDC-2494.  
**Preconditions / data:** QA MAN tickets.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-02-01 | Export tickets with chosen fields | functional | 1) Settings › Data › Export › Tickets, view "QA MAN view", 5 fields. 2) Download. | File has only those rows and fields. | |
| D-02-02 | Arabic in export | UI-RTL | 1) Open in Excel. | Arabic readable (UTF-8). | |
| D-02-03 | No fields chosen | negative | 1) Export with no fields. | Refused. | |
| D-02-04 | Large export | edge | 1) Export All Tickets. | Finishes; link valid; row count matches. | |
| D-02-05 | Link kept | persistence | 1) Reload next day. | Download still listed (7 days). | |
| D-02-06 | Agent cannot export | permission | 1) Agent C. | No access. | |

##### D-07 · Recycle Bin (restore, delete forever, empty)
**Priority:** P0 · **Wave:** 5 · **Status:** Partly  
**Why this priority:** Safety net for every module. Known: NDC-2248, 2516, 2517 (Empty Bin deletes all after one confirm — do not click Empty Bin).  
**Preconditions / data:** A deleted QA MAN contact and ticket.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-07-01 | Restore a contact | functional | 1) Restore "QA MAN Contact 2". | Back with its data. | |
| D-07-02 | Filter by module | functional | 1) Filter Tickets / Contacts. | Only that module. | |
| D-07-03 | Delete forever one item | functional | 1) Delete forever a QA item. | Gone (NDC-2248). | |
| D-07-04 | Restore when the parent is gone | edge | 1) Delete an account, then its contact; restore the contact only. | Restored without broken link. | |
| D-07-05 | Agent sees only own deletes | permission | 1) Agent C opens the bin. | Only allowed items. | |
| D-07-06 | Bin in Arabic | UI-RTL | 1) Arabic. | Names not ids; RTL. | |
| D-07-07 | Restore twice from two tabs | negative | 1) Open the bin in two tabs. 2) Restore the same item in both. | Second gets a clear "already restored" message; no duplicate record. | |
| D-07-08 | Restored item kept | persistence | 1) Reload and sign in again. | Restored contact is still in Contacts and not in the bin. | |

#### P0 · Customization

##### X-01 · Modules and tabs (custom modules, web tabs, organize tabs)
**Priority:** P0 · **Wave:** 5 · **Status:** Built · **Partly covered before:** Modules & Fields runs 5–6 Oct (117 pass, 44 bugs NDC-2219..2262). Focus on what NDC needs: custom module with lookup from tickets, tab order per profile.  
**Why this priority:** NDC has custom modules (Airline-IATA Data, Training) linked from tickets.  
**Preconditions / data:** Settings › Modules and Fields.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| X-01-01 | Custom module with lookup from tickets | functional | 1) New module "QA MAN Airline". 2) Add 2 records. 3) Add a lookup field on a QA layout of Tickets. 4) Pick a record on a ticket. | Lookup works; record shows the related ticket. | |
| X-01-02 | Organize tabs | functional | 1) Reorder tabs; hide one. | Order kept for users. | |
| X-01-03 | Duplicate module name | negative | 1) Create "QA MAN Airline" again. | Refused. | |
| X-01-04 | Delete module with records | edge | 1) Delete "QA MAN Airline". | Warning; lookup field handled. | |
| X-01-05 | Kept after reload | persistence | 1) Reload. | Module and tabs unchanged. | |
| X-01-06 | Profile without module access | permission | 1) Agent C opens the module URL. | Hidden / refused unless granted. | |
| X-01-07 | Module in Arabic | UI-RTL | 1) Arabic name and labels. | RTL. | |

##### X-02 · Layouts and fields (per-dept layouts, field types, picklists)
**Priority:** P0 · **Wave:** 5 · **Status:** Built · **Partly covered before:** 5–6 Oct runs. Focus on NDC sizes: big picklists, multiselect, currency, per-department layout.  
**Why this priority:** NDC ticket has 183 fields and 80 layouts. Never edit the Standard layout; use "QA MAN Layout".  
**Preconditions / data:** QA layout on the QA dept.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| X-02-01 | Picklist with 200 values | functional | 1) Add picklist "QA MAN Airline code" with 200 values (paste list). 2) Use on a ticket; search a value. | Saved; search finds values fast. | |
| X-02-02 | Field types | functional | 1) Add multiselect, currency, decimal, date-time, email fields. 2) Fill on a ticket. | Each saves and shows in the right format. | |
| X-02-03 | Wrong value type | negative | 1) Type text in currency, bad email. | Refused with field messages. | |
| X-02-04 | Mandatory field | edge | 1) Make a field mandatory. 2) Create a ticket without it. | Blocked. | |
| X-02-05 | Kept after reload | persistence | 1) Reload. | Layout, fields unchanged. | |
| X-02-06 | Field hidden by profile | permission | 1) Hide a field for Desk Agent profile. 2) Agent C opens a ticket. | Field not shown. | |
| X-02-07 | Layout in Arabic | UI-RTL | 1) Arabic labels. | RTL. | |

##### X-03 · Layout rules, validation rules, dependent picklists
**Priority:** P0 · **Wave:** 5 · **Status:** Partly  
**Why this priority:** NDC has 10 layout rules and the validation "Status = Reject needs a reason". Known: NDC-2230, 2231 (saved, not applied), NDC-2535, NDC-1988.  
**Preconditions / data:** QA layout.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| X-03-01 | Layout rule shows a field | functional | 1) Rule: if Type = "Refund" show "Refund amount" and make it mandatory. 2) On a ticket choose Refund. | Field appears and is required. | |
| X-03-02 | Validation rule | functional | 1) Rule: Status = Reject needs "Rejection reason". 2) Set Reject without reason. | Save blocked with the rule message. | |
| X-03-03 | Dependent picklist | functional | 1) Country → City dependency. 2) Pick a country. | Only its cities offered. | |
| X-03-04 | Rule with no condition | negative | 1) Save a rule with no condition. | Refused. | |
| X-03-05 | Value from API / import bypass | edge | 1) Import a ticket with Status Reject and no reason. | Validation applied or record — note. | |
| X-03-06 | Kept after reload | persistence | 1) Reload. | Rules unchanged and still applied. | |
| X-03-07 | Rules in Arabic | UI-RTL | 1) Arabic. | Messages Arabic. | |

#### P0 · Integrations

##### G-01 · CRM ⇄ Desk integration
**Priority:** P0 · **Wave:** 5 · **Status:** Built · **Partly covered before:** full spec 18–22 Oct (18 bugs NDC-2393..2410). Focus on NDC flows: accounts, contacts and products from CRM; tickets in CRM related lists; retest open bugs only if Ready For Test.  
**Why this priority:** NDC syncs accounts, contacts and products from CRM. Read-only on the connection: do not disconnect.  
**Preconditions / data:** Settings › Integrations › CRM (connected). CRM access as Owner.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| G-01-01 | CRM contact appears in Desk | functional | 1) In CRM create contact "QA MAN CRM Contact". 2) Wait for sync. 3) Search in Desk. | Contact in Desk with the mapped fields; "Linked to CRM". | |
| G-01-02 | CRM account update flows | functional | 1) Change the account phone in CRM. 2) Update from CRM in Desk. | New value in Desk. | |
| G-01-03 | Product sync | functional | 1) Create product "QA MAN Product" in CRM (if CRM has products). 2) Check Desk Products. | Listed (or record "CRM has no Products module"). | |
| G-01-04 | Desk ticket in CRM related list | integration | 1) Create a ticket for the synced contact. 2) Open the contact in CRM. | Ticket shows in the Desk Tickets related list. | |
| G-01-05 | Sync failure shown | negative | 1) In CRM create a contact missing a field Desk requires. | Shows in Failure Log with a readable reason; Retry works. | |
| G-01-06 | Unlinked contact | edge | 1) Open a ticket of a Desk-only contact. | "Not linked to a CRM record" with search hint. | |
| G-01-07 | Settings kept | persistence | 1) Reload settings. | Mapping unchanged. | |
| G-01-08 | Agent CRM pane rights | permission | 1) Agent C opens a linked ticket. | CRM pane per profile (no access message, not endless loading). | |
| G-01-09 | Pane in Arabic | UI-RTL | 1) Arabic. | Labels Arabic, no raw `synced` keys. | |

#### P0 · Cross-cutting

##### Q-03 · Notifications bell (in-app) and desktop notifications
**Priority:** P0 (inventory P1, raised) · **Wave:** 2 · **Status:** Built  
**Why this priority:** Raised: agents learn about new assignments and mentions only from the bell.  
**Preconditions / data:** Owner and Admin B.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| Q-03-01 | Assignment notification | functional | 1) Owner assigns a ticket to B. 2) B looks at the bell. | Unread count +1; item names the ticket; click opens it. | |
| Q-03-02 | Mention notification | functional | 1) Owner mentions B in a comment. | B gets a bell item. | |
| Q-03-03 | Mark all read | functional | 1) B clicks Mark all read. | Count goes to 0. | |
| Q-03-04 | No self-notification | negative | 1) Owner assigns a ticket to himself. | Owner gets no bell item (or as the setting says). | |
| Q-03-05 | Many notifications | edge | 1) Make 25 events for B. 2) Open the bell, scroll. | List pages/loads more; count right. | |
| Q-03-06 | Read state kept | persistence | 1) Reload; sign in again. | Read items stay read. | |
| Q-03-07 | Desktop notification | functional | 1) Allow browser notifications. 2) Assign a ticket to B while B's tab is in the background. | Desktop pop-up shows (or the setting explains it is off). | |
| Q-03-08 | Bell in Arabic | UI-RTL | 1) Arabic; open the bell. | Text Arabic, no raw keys, times readable. | |

##### Q-01 · Arabic UI and RTL on every Desk screen
**Priority:** P0 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC is in Egypt; Arabic agents and customers. Each feature above has its own RTL case; this one sweeps the screens no feature covers. Known: NDC-2488, NDC-2487.  
**Preconditions / data:** Admin B with UI language Arabic.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| Q-01-01 | Switch language | functional | 1) Header › EN/AR switch › Arabic. | Whole app turns Arabic and RTL without reload errors. | |
| Q-01-02 | Sweep left menu and settings hub | UI-RTL | 1) Open every left-menu item and every Settings hub tile once. | No raw keys, no English leftovers in labels, icons mirrored where needed. Note each screen with problems. | |
| Q-01-03 | Mixed text | edge | 1) Ticket subject "QA MAN طلب 123 refund". | Number and English parts in the right order. | |
| Q-01-04 | Dates and numbers | edge | 1) Check dates, times and counts in lists in Arabic. | Readable, consistent format. | |
| Q-01-05 | Language kept | persistence | 1) Sign out and in. | Arabic kept for that user only; Owner still English. | |
| Q-01-06 | Unsupported language value | negative | 1) Change the URL/setting to an unsupported locale (if exposed). | Falls back to English, no blank screen. | |

##### Q-05 · Performance: list/detail under load targets
**Priority:** P0 · **Wave:** 5 · **Status:** Not confirmed  
**Why this priority:** NDC will have millions of tickets and 478 agents; staging pages took > 5 s on 1 Nov. Manual timing only (stopwatch / browser DevTools Network tab). Run at a quiet hour.  
**Preconditions / data:** Owner; All Tickets view.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| Q-05-01 | List page load | functional | 1) Open All Tickets 3 times; time until rows show. | Median under 3 s (record numbers). | |
| Q-05-02 | Ticket detail load | functional | 1) Open 3 different tickets; time. | Under 3 s each. | |
| Q-05-03 | Search time | functional | 1) Ctrl K search "QA MAN"; time. | Results under 2 s. | |
| Q-05-04 | Owner picker with many agents | edge | 1) Open the Owner picker in a large department; scroll to the end. | All agents reachable (not stopped at 200). | |
| Q-05-05 | Slow network | edge | 1) DevTools › Network › Slow 3G. 2) Open a ticket and reply. | Loading states shown; no double send. | |
| Q-05-06 | Agent session | permission | 1) Repeat Q-05-01 as Agent C. | Similar times. | |
| Q-05-07 | Rapid double click on Send | negative | 1) Click Send on a reply 5 times fast. | Only one reply is sent and saved. | |
| Q-05-08 | Cold start after sign-in | persistence | 1) Sign out, clear cache, sign in. 2) Time All Tickets. | Record the time; under 5 s. | |
| Q-05-09 | Arabic list timing | UI-RTL | 1) Arabic UI; repeat Q-05-01. | Similar times; layout RTL. | |

### 6.2 P1 — needed for NDC's daily process

#### P1 · Organisation

##### O-06 · Products (catalogue, per department, link to tickets)
**Priority:** P1 (inventory P2, raised) · **Wave:** 5 · **Status:** Built  
**Why this priority:** Raised: NDC syncs products from CRM and links them on tickets.  
**Preconditions / data:** Settings › Organization › Products.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| O-06-01 | Create product and link to a ticket | functional | 1) New product "QA MAN Product" for Marketing. 2) On a Marketing ticket pick it. | Saved; ticket shows the product. | |
| O-06-02 | Product limited to department | edge | 1) Open a Sales ticket's product list. | "QA MAN Product" not offered. | |
| O-06-03 | Duplicate / empty name | negative | 1) Save with empty name; then the same name again. | Both refused (or duplicate warned). | |
| O-06-04 | Kept after reload | persistence | 1) Reload. | Unchanged. | |
| O-06-05 | Agent cannot edit catalogue | permission | 1) Agent C opens the URL. | No access. | |
| O-06-06 | Arabic product name | UI-RTL | 1) Arabic name; view on a ticket. | RTL, readable. | |

#### P1 · Access

##### A-12 · Data retention and legal hold
**Priority:** P1 · **Wave:** 5 · **Status:** TAVI-only  
**Why this priority:** A wrong retention rule can delete real data. Test only with a QA-only scope; never save a rule that matches real tickets.  
**Preconditions / data:** Settings › Data › Retention.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| A-12-01 | Create a retention rule (QA scope) | functional | 1) New rule for closed tickets in QA dept older than 1 day. 2) Save, keep inactive. | Saved inactive; preview count shows only QA tickets. | |
| A-12-02 | Legal hold on a ticket | functional | 1) Put "QA MAN status 01" on legal hold. 2) Try to delete it. | Delete refused while on hold. | |
| A-12-03 | Invalid period | negative | 1) Period 0 or negative. | Refused. | |
| A-12-04 | Remove hold | edge | 1) Remove hold; delete. | Delete allowed. | |
| A-12-05 | Kept after reload | persistence | 1) Reload. | Rule and hold state unchanged. | |
| A-12-06 | Agent cannot see retention | permission | 1) Agent C opens the URL. | No access. | |
| A-12-07 | Page in Arabic | UI-RTL | 1) Arabic. | RTL. | |

#### P1 · Tickets

##### T-08 · Reply drafts saved on the server
**Priority:** P1 · **Wave:** 2 · **Status:** Partly  
**Why this priority:** Agents switch PCs on shifts; lost drafts mean re-typing. Known: NDC-2644.  
**Preconditions / data:** Ticket "QA MAN reply 01".

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-08-01 | Draft survives reload | persistence | 1) Type a reply, do not send. 2) Reload. | Draft restored. | |
| T-08-02 | Draft on another browser | persistence | 1) Open the same ticket in a second browser as the same user. | Draft shown (Zoho does; TAVI stores in browser only — record). | |
| T-08-03 | Discard draft | functional | 1) Discard. 2) Reload. | Draft gone. | |
| T-08-04 | Draft of another agent | permission | 1) Admin B opens the ticket. | Owner's draft not visible to B. | |
| T-08-05 | Very long draft | edge | 1) Paste 20,000 characters; reload. | Restored fully or a clear limit. | |
| T-08-06 | Draft label in Arabic | UI-RTL | 1) Arabic; draft notice. | Arabic text. | |
| T-08-07 | Draft with only spaces | negative | 1) Type only spaces in Reply. 2) Reload. | No draft saved. | |

##### T-09 · Scheduled replies (schedule, list, cancel, clear to draft)
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** NDC uses scheduled replies. Known: NDC-2184.  
**Preconditions / data:** Ticket "QA MAN reply 01", mailbox M1.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-09-01 | Schedule a reply in 5 minutes | functional | 1) Reply › Schedule › now + 5 min. 2) Wait. | Sent at the time; M1 receives it. | |
| T-09-02 | List and cancel | functional | 1) Schedule +1 day. 2) Open Scheduled Replies. 3) Cancel. | Listed; after cancel not sent. | |
| T-09-03 | Clear to draft | functional | 1) Schedule, then "move to draft". | Becomes a draft; not sent. | |
| T-09-04 | Time in the past | negative | 1) Schedule for yesterday. | Refused. | |
| T-09-05 | Ticket closed before send | edge | 1) Schedule +5 min. 2) Close the ticket. | Sent or cancelled per rule — record. | |
| T-09-06 | Kept after reload | persistence | 1) Reload list. | Still scheduled. | |
| T-09-07 | Schedule picker in Arabic | UI-RTL | 1) Arabic. | Date picker RTL. | |

##### T-11 · KB article suggestions in composer
**Priority:** P1 · **Wave:** 2 · **Status:** Partly  
**Why this priority:** Agents answer faster with articles; panel showed "could not be loaded" (NDC-2636).  
**Preconditions / data:** Published "QA MAN article" (N-08). Ticket subject with a word from it.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-11-01 | Suggestions load | functional | 1) Open Reply › Articles panel. | Matching articles listed (not "could not be loaded"). | |
| T-11-02 | Insert article | functional | 1) Insert a suggested article. | Link or content inserted. | |
| T-11-03 | No match | negative | 1) Ticket with a nonsense subject. | "No article matches". | |
| T-11-04 | Draft article not suggested | edge | 1) Check the draft article. | Not suggested. | |
| T-11-05 | Agent-only article to customer | permission | 1) Insert an agents-only article. | Warned or link not public. | |
| T-11-06 | Arabic search | UI-RTL | 1) Arabic subject. | Arabic articles found. | |
| T-11-07 | Inserted article kept in the sent reply | persistence | 1) Send a reply with an inserted article. 2) Reload. | Link/content still in the sent reply; link opens the portal article. | |

##### T-17 · Split ticket from a thread
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Customers raise two issues in one email.  
**Preconditions / data:** Ticket with 2 customer messages.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-17-01 | Split a customer message | functional | 1) On the 2nd customer message › Split. | New ticket with that message; link to the original. | |
| T-17-02 | Split an agent reply | negative | 1) Try Split on an agent reply. | Not offered. | |
| T-17-03 | Split with attachment | edge | 1) Split a message with a file. | File copied to the new ticket. | |
| T-17-04 | Kept after reload | persistence | 1) Reload both. | Link kept. | |
| T-17-05 | Read-only agent | permission | 1) Agent C on a read-only share. | Split hidden. | |
| T-17-06 | Dialog in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-19 · Parent / child tickets
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Used to group related cases (for example one PNR, many refunds).  
**Preconditions / data:** 3 QA MAN tickets.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-19-01 | Link children | functional | 1) On ticket P › Parent-Child tab › add 2 children. | Listed; each child shows P. | |
| T-19-02 | Unlink | functional | 1) Unlink one. | Removed both sides. | |
| T-19-03 | Ticket as its own child / loop | negative | 1) Add P as child of itself, or of its child. | Refused. | |
| T-19-04 | Close parent with open children | edge | 1) Close P. | Warned or allowed — record. | |
| T-19-05 | Kept after reload | persistence | 1) Reload. | Links kept. | |
| T-19-06 | Child in another dept | permission | 1) Agent C opens P whose child is in Marketing. | C sees no data of the hidden child. | |
| T-19-07 | Tab in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-20 · Mark spam / spam view, blocked senders
**Priority:** P1 (inventory P0, lowered) · **Wave:** 2 · **Status:** Built  
**Why this priority:** Lowered: NDC's Zoho has 0 spam use; still needed for email hygiene. Overlaps N-02.  
**Preconditions / data:** QA MAN ticket from M2.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-20-01 | Mark spam and block sender | functional | 1) More › Mark spam, tick block sender. 2) Send new mail from M2. | Ticket in Spam view; new mail goes to spam / blocked. | |
| T-20-02 | Not spam | functional | 1) Spam view › Not spam. | Back in normal views; sender unblocked if chosen. | |
| T-20-03 | Mark spam without permission | permission | 1) Agent C on his ticket. | Allowed/hidden per profile. | |
| T-20-04 | Spam ticket in reports | edge | 1) Check HQ counts. | Spam not counted as open. | |
| T-20-05 | Kept after reload | persistence | 1) Reload. | State kept. | |
| T-20-06 | Spam dialog in Arabic | UI-RTL | 1) Arabic. | RTL. | |
| T-20-07 | Spam action on a spam ticket | negative | 1) Open a ticket already in Spam. | "Mark spam" not offered; only "Not spam". | |

##### T-23 · Follow ticket / followers
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Managers follow escalations. Candidate bug: History shows raw user ids for followers.  
**Preconditions / data:** QA MAN ticket.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-23-01 | Follow and get updates | functional | 1) Admin B clicks Follow. 2) Owner replies. | B gets a notification. | |
| T-23-02 | Unfollow | functional | 1) B unfollows. 2) Owner replies. | No notification. | |
| T-23-03 | History text | edge | 1) Open History. | "Followers updated" shows names, not ids. | |
| T-23-04 | Follow a ticket you cannot see | negative | 1) Agent C tries a Marketing ticket follow link. | Refused. | |
| T-23-05 | Kept after reload | persistence | 1) Reload. | Follow state kept. | |
| T-23-06 | Follow button in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-29 · Resolution field and resolution history
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Closure reason for audits.  
**Preconditions / data:** QA MAN ticket.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-29-01 | Save resolution | functional | 1) Resolution tab › text › save without notify. | Saved and shown. | |
| T-29-02 | Edit, history | functional | 1) Edit it. | History of versions shown. | |
| T-29-03 | Empty resolution | negative | 1) Save empty. | "Resolution content is required." | |
| T-29-04 | Notify customer | edge | 1) Save with notify. | M1 gets it. | |
| T-29-05 | Kept after reload | persistence | 1) Reload. | Same text. | |
| T-29-06 | Read-only agent | permission | 1) Agent C read-only share. | Cannot edit. | |
| T-29-07 | Arabic resolution | UI-RTL | 1) Arabic text. | RTL. | |

##### T-33 · Ticket number format (prefix/suffix per department)
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** NDC teams quote ticket numbers by phone. Tenant-wide: change only on a QA dept and set back.  
**Preconditions / data:** Settings › Tickets › Numbering.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-33-01 | Department prefix | functional | 1) QA dept series prefix "QAM-", start 1000. 2) Create a ticket there. | Number "QAM-1000". | |
| T-33-02 | Other departments unchanged | edge | 1) Create in Marketing. | Default series continues. | |
| T-33-03 | Invalid prefix | negative | 1) Prefix with spaces/emoji or start < current. | Refused. | |
| T-33-04 | Kept after reload | persistence | 1) Reload. | Unchanged. | |
| T-33-05 | Agent cannot edit | permission | 1) Agent C opens the URL. | No access. | |
| T-33-06 | Page in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-34 · Ticket templates
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Speeds up phone-ticket entry.  
**Preconditions / data:** Settings › Tickets › Templates.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-34-01 | Create and use | functional | 1) "QA MAN tpl phone" with Channel Phone, dept QA. 2) Use it in create. | Prefilled. | |
| T-34-02 | Template per department | edge | 1) Open the picker in Sales. | QA template not offered. | |
| T-34-03 | Empty name | negative | 1) Save with no name. | Refused. | |
| T-34-04 | Kept after reload | persistence | 1) Reload. | Unchanged. | |
| T-34-05 | Agent use only | permission | 1) Agent C uses but cannot edit. | As profile says. | |
| T-34-06 | Arabic template | UI-RTL | 1) Arabic subject. | RTL. | |

##### T-36 · Contract / SLA panel on ticket
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Agents see SLA due times here; NDC uses SLA heavily.  
**Preconditions / data:** A ticket under "QA MAN SLA" (U-07).

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-36-01 | Panel shows SLA | functional | 1) Open the ticket's SLA panel. | Policy name, response and resolution due, status. | |
| T-36-02 | No SLA | negative | 1) Ticket in Marketing (no SLA). | "No SLA" text, no error. | |
| T-36-03 | Overdue display | edge | 1) Let a target pass. | Red/overdue label and time. | |
| T-36-04 | Kept after reload | persistence | 1) Reload. | Same times. | |
| T-36-05 | Agent view | permission | 1) Agent C on a CS ticket with SLA. | Panel visible, not editable. | |
| T-36-06 | Panel in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-37 · Customer happiness rating on ticket
**Priority:** P1 · **Wave:** 4 · **Status:** Built  
**Why this priority:** NDC routes "Bad" ratings to supervisors.  
**Preconditions / data:** Happiness on for QA dept (N-10). Mailbox M1.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-37-01 | Rating shows on ticket | functional | 1) Rate Good from the email link. 2) Open the ticket. | Rating and comment shown. | |
| T-37-02 | Change rating | edge | 1) Rate again Bad. | Latest rating shown. | |
| T-37-03 | Rating link of another ticket | negative | 1) Edit the link id. | Refused. | |
| T-37-04 | Kept after reload | persistence | 1) Reload. | Rating kept. | |
| T-37-05 | Agent view | permission | 1) Agent C. | Read only. | |
| T-37-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-38 · AI on ticket: summary, sentiment, reply suggestion
**Priority:** P1 (inventory P2, raised) · **Wave:** 2 · **Status:** Partly  
**Why this priority:** Raised: NDC uses Zia summary, sentiment and reply help. On 2 Nov every AI call returned 404.  
**Preconditions / data:** Ticket with 3+ messages.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-38-01 | Summary | functional | 1) AI panel › Summary. | Summary of the thread, or clear "AI not set up" message. | |
| T-38-02 | Sentiment / triage | functional | 1) Run triage. | Sentiment and intent shown. | |
| T-38-03 | Reply suggestion | functional | 1) Suggest reply; insert. | Text inserted in composer. | |
| T-38-04 | Empty ticket | negative | 1) Summary on a ticket with only a subject. | Clear message, no "Something went wrong". | |
| T-38-05 | Arabic thread | UI-RTL | 1) Summary of an Arabic thread. | Summary in Arabic or as set. | |
| T-38-06 | Agent access | permission | 1) Agent C. | AI per profile. | |
| T-38-07 | Very long thread | edge | 1) Summary on a 50-message ticket. | Summary returned or a clear size message. | |
| T-38-08 | Result after reload | persistence | 1) Reload after a summary. | Summary kept or a "regenerate" option — record. | |

##### T-40 · Keyboard shortcuts and global search (Ctrl K)
**Priority:** P1 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Agents find tickets by number from phone calls.  
**Preconditions / data:** QA MAN tickets.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-40-01 | Search by number | functional | 1) Ctrl K › type a ticket number. | Ticket first in results; opens. | |
| T-40-02 | Search by contact email / phone | functional | 1) Search M1 / phone. | Contact and tickets. | |
| T-40-03 | No result | negative | 1) Search "zzzz". | Empty state. | |
| T-40-04 | Shortcut Shift+C / R | edge | 1) On a ticket press Shift+C. | Comment editor opens empty. | |
| T-40-05 | Search scope | permission | 1) Agent C searches "QA MAN" Marketing subject. | Not found. | |
| T-40-06 | Arabic search | UI-RTL | 1) Search an Arabic subject. | Found. | |
| T-40-07 | Recent items kept | persistence | 1) Open 3 tickets. 2) Reload. 3) Press Ctrl K. | Recent items listed (if the feature shows recents). | |

#### P1 · Automation

##### U-03 · Skills and skill-based routing
**Priority:** P1 · **Wave:** 3 · **Status:** Partly  
**Why this priority:** NDC has one skill-based round robin. Gaps in NDC-2752.  
**Preconditions / data:** Assignment Rules › Skills tab; QA dept.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-03-01 | Skill on ticket by criteria | functional | 1) Skill "QA MAN Arabic", criteria Subject contains "QA MAN skill". 2) Create a ticket. | Skill added to the ticket. | |
| U-03-02 | Route to agent with skill | functional | 1) Give the skill to Admin B only. 2) Skill-based RR rule. 3) Create a ticket. | Assigned to B. | |
| U-03-03 | No agent has the skill | negative | 1) Remove skill from B; create. | Not assigned (backlog). | |
| U-03-04 | More than 10 skills on a ticket | edge | 1) Add 11 skills. | Limit message or record. | |
| U-03-05 | Kept after reload | persistence | 1) Reload. | Skills unchanged. | |
| U-03-06 | Tab in Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### U-16 · Auto-close / time-based ticket rules
**Priority:** P1 · **Wave:** 3 · **Status:** Partly  
**Why this priority:** Waiting-for-customer tickets must close by time. Only blueprint state limits and archiving exist (NDC-1973).  
**Preconditions / data:** Blueprint state with time limit (U-09), QA dept.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-16-01 | Auto-close by blueprint state limit | functional | 1) State "Waiting customer" with 5-min limit → auto move to Closed. 2) Put a ticket there; wait. | Closed by the system; History says why. | |
| U-16-02 | Customer replies before limit | edge | 1) Reply from M1 within the limit. | Not closed. | |
| U-16-03 | Ticket outside blueprint | negative | 1) Open ticket in Marketing for 1 hour. | Not auto-closed (no general rule). Record as gap. | |
| U-16-04 | Kept after reload | persistence | 1) Reload settings. | Limit unchanged. | |
| U-16-05 | Message in Arabic | UI-RTL | 1) Arabic History text. | Arabic. | |

#### P1 · Channels

##### N-07 · Community (forums, topics, moderation, categories)
**Priority:** P1 · **Wave:** 4 · **Status:** Built  
**Why this priority:** NDC has community topics.  
**Preconditions / data:** /community; portal user M2.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-07-01 | Customer posts a topic | functional | 1) M2 in portal posts "QA MAN topic". | Topic in moderation or live per setting. | |
| N-07-02 | Moderate | functional | 1) Agent approves. 2) Agent replies. | Live; reply visible. | |
| N-07-03 | Empty topic | negative | 1) Post with empty title. | Refused. | |
| N-07-04 | Convert topic to ticket | edge | 1) Convert (if offered). | Ticket with the topic text. | |
| N-07-05 | Kept after reload | persistence | 1) Reload. | Topic kept. | |
| N-07-06 | Signed-out user cannot post | permission | 1) Signed out, try to post. | Asked to sign in. | |
| N-07-07 | Arabic topic | UI-RTL | 1) Arabic post. | RTL. | |

##### N-09 · KB translations and article versions
**Priority:** P1 · **Wave:** 4 · **Status:** Not confirmed  
**Why this priority:** NDC's help center is Arabic + English. First confirm it exists.  
**Preconditions / data:** "QA MAN article".

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-09-01 | Add Arabic translation | functional | 1) Article › Translations › Add Arabic. 2) Publish. | Portal in Arabic shows the Arabic version. | |
| N-09-02 | Versions | functional | 1) Edit and publish twice. 2) Open versions. | Older versions listed; restore works. | |
| N-09-03 | Translation without title | negative | 1) Save empty title. | Refused. | |
| N-09-04 | Missing translation | edge | 1) Portal in Arabic, article without Arabic. | Falls back to English or hidden — record. | |
| N-09-05 | Kept after reload | persistence | 1) Reload. | Both languages kept. | |
| N-09-06 | Editor in Arabic UI | UI-RTL | 1) Arabic UI. | RTL editor. | |

##### N-10 · Customer happiness ratings (settings, email link, public page)
**Priority:** P1 · **Wave:** 4 · **Status:** Built  
**Why this priority:** NDC uses rating links and routes "Bad" ratings. Known: NDC-1997, NDC-2170.  
**Preconditions / data:** Settings › Organization › Customer Happiness; QA dept.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| N-10-01 | Rating link in reply | functional | 1) Turn on rating link in replies for QA dept. 2) Reply. 3) Click Good in M1. | Public page thanks; rating on ticket. | |
| N-10-02 | Rating on close | functional | 1) Turn on "send on close". 2) Close. | M1 gets the rating mail. | |
| N-10-03 | Invalid link | negative | 1) Open the link with a changed token. | Error page, no rating saved. | |
| N-10-04 | Comment with Bad rating | edge | 1) Rate Bad with a long Arabic comment. | Saved fully. | |
| N-10-05 | Settings kept | persistence | 1) Reload. | Unchanged. | |
| N-10-06 | Public page in Arabic | UI-RTL | 1) Open the link with Arabic. | RTL. | |

#### P1 · Customers

##### C-03 · Customer 360: tickets, happiness, activities on the contact page
**Priority:** P1 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC installed "Customer Ticket History"; agents need past tickets on a call.  
**Preconditions / data:** QA MAN Contact 1 with tickets, rating, task.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| C-03-01 | Contact page shows all | functional | 1) Open the contact. | Tickets, ratings, activities listed and correct. | |
| C-03-02 | New ticket appears | functional | 1) Create a ticket; refresh. | Listed. | |
| C-03-03 | Contact with nothing | negative | 1) New contact. | Empty states. | |
| C-03-04 | Tickets in hidden depts | permission | 1) Agent C opens the contact. | Only tickets he may see. | |
| C-03-05 | Kept after reload | persistence | 1) Reload. | Same. | |
| C-03-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |
| C-03-07 | Contact with 100+ tickets | edge | 1) Open a contact with many tickets. | List pages; counts right; loads under 5 s. | |

##### C-05 · Tasks, calls, events (CRUD, reminders, overdue, complete)
**Priority:** P1 · **Wave:** 5 · **Status:** Built · **Partly covered before:** Activity life cycle run 26 Oct (bugs NDC-2637..2643). Focus: retest open bugs, reminders, ticket link on NDC-Staging.  
**Why this priority:** Follow-up calls to customers.  
**Preconditions / data:** /activities.

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| C-05-01 | Task on a ticket | functional | 1) From a ticket add task "QA MAN task" due in 10 min, reminder 5 min. | Linked; reminder fires. | |
| C-05-02 | Call log | functional | 1) Log a completed call 5 min. | Saved; on ticket and contact. | |
| C-05-03 | Event with invitee | functional | 1) Event with Admin B. | B sees it on calendar. | |
| C-05-04 | End before start | negative | 1) Event end < start. | Refused. | |
| C-05-05 | Overdue | edge | 1) Task due passes. | In Overdue view. | |
| C-05-06 | Kept after reload | persistence | 1) Reload. | Same. | |
| C-05-07 | Agent sees others' tasks | permission | 1) Agent C opens Activities. | Only allowed ones. | |
| C-05-08 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

#### P1 · Data

##### D-03 · Data backup (ZIP of CSV, password)
**Priority:** P1 · **Wave:** 5 · **Status:** Built  
**Why this priority:** Safety copy before go-live. Known: NDC-2494.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-03-01 | Create backup | functional | 1) Settings › Data › Backup › run with password. 2) Download. | ZIP opens only with the password; CSVs per module. | |
| D-03-02 | Weak/empty password | negative | 1) Empty password. | Refused. | |
| D-03-03 | Second backup same day | edge | 1) Run again. | Allowed or clear limit message. | |
| D-03-04 | Listed after reload | persistence | 1) Reload. | Backup listed. | |
| D-03-05 | Agent cannot back up | permission | 1) Agent C. | No access. | |
| D-03-06 | Arabic data in CSV | UI-RTL | 1) Open a CSV. | Arabic readable. | |

##### D-04 · Migration from another help desk (Zwitch)
**Priority:** P1 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC's history comes from Zoho. Do not run a real import into NDC-Staging without the admin's OK; stop before the final step if no test source.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-04-01 | Sources offered | functional | 1) Settings › Data › Migration. | Source list incl. Zoho Desk (record if missing). | |
| D-04-02 | Wrong credentials | negative | 1) Enter fake API key. | Clear error. | |
| D-04-03 | Field mapping screen | functional | 1) With a test source, open mapping. | Fields mappable. | |
| D-04-04 | Partial / cancel | edge | 1) Cancel mid-way. | No half data, or clean rollback. | |
| D-04-05 | History kept | persistence | 1) Reload. | Runs listed. | |
| D-04-06 | Agent no access | permission | 1) Agent C. | No access. | |
| D-04-07 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### D-06 · Bulk actions log
**Priority:** P1 · **Wave:** 5 · **Status:** Built  
**Why this priority:** Audit for mass changes.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-06-01 | Log row after mass update | functional | 1) After T-31-02 open Bulk actions log. | Row with user, count, time. | |
| D-06-02 | Details | functional | 1) Open the row. | Affected records listed. | |
| D-06-03 | Failed rows shown | negative | 1) Mass update including a record you cannot edit. | Failure count and reason. | |
| D-06-04 | Filter by date | edge | 1) Filter to yesterday. | Correct rows. | |
| D-06-05 | Kept | persistence | 1) Reload. | Same. | |
| D-06-06 | Agent no access | permission | 1) Agent C. | No access. | |
| D-06-07 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

#### P1 · Customization

##### X-05 · Languages (portal + agent UI, RTL)
**Priority:** P1 · **Wave:** 5 · **Status:** Partly  
**Why this priority:** NDC needs Arabic customer emails and portal; no Languages setup exists. Known: NDC-2488, 2487.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| X-05-01 | Contact language drives email | functional | 1) Set QA MAN Contact 1 language Arabic. 2) Trigger an acknowledgement. | Arabic template used (or record gap). | |
| X-05-02 | Portal default language | functional | 1) Set portal default Arabic (if offered). | Portal opens in Arabic. | |
| X-05-03 | Missing translation | negative | 1) Language with no template. | Falls back to default. | |
| X-05-04 | Agent personal language | edge | 1) B Arabic, Owner English at the same time. | Each sees his own. | |
| X-05-05 | Kept | persistence | 1) Reload. | Kept. | |
| X-05-06 | RTL sweep of settings | UI-RTL | 1) Arabic; open Settings pages used in this plan. | No broken layout. | |

#### P1 · Integrations

##### G-06 · Analytics app (Tavi Analytics for Desk)
**Priority:** P1 · **Wave:** 5 · **Status:** Partly  
**Why this priority:** NDC has Zoho Analytics on. Overlaps I-02; run after it. Known: NDC-2068, NDC-2364.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| G-06-01 | Analytics tab loads | functional | 1) Open Analytics. | Departments load (not stuck). | |
| G-06-02 | Data matches Desk | functional | 1) Compare a ticket count. | Same. | |
| G-06-03 | Data freshness | edge | 1) Create a ticket; time until it shows. | Record delay. | |
| G-06-04 | Invalid filter | negative | 1) Future date range. | Empty, no error. | |
| G-06-05 | Agent scope | permission | 1) Agent C. | Allowed data only. | |
| G-06-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |
| G-06-07 | Saved filter kept | persistence | 1) Set a filter in Analytics. 2) Reload. | Filter kept or reset by design — record. | |

#### P1 · Cross-cutting

##### Q-04 · My profile, signatures, personal time zone/date format
**Priority:** P1 · **Wave:** 1 (only partly checked) · **Status:** Partly  
**Why this priority:** Agents in Egypt, UAE, KSA need their own time zone. Wave 1 found no personal time zone (NDC-1970); /settings/my-profile redirected to /hq.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| Q-04-01 | Open My profile | functional | 1) Avatar › My profile. | Profile page opens (not HQ). | |
| Q-04-02 | Signature per department | functional | 1) Add signature for Marketing and another for Sales. 2) Reply in each. | Right signature each time. | |
| Q-04-03 | Personal time zone | edge | 1) Set time zone Asia/Dubai (if offered). 2) Check ticket times. | Times shift by 2 h vs Cairo; record gap if missing. | |
| Q-04-04 | Empty name / huge photo | negative | 1) Save empty name; upload a 20 MB photo. | Refused with messages. | |
| Q-04-05 | Kept after sign-in | persistence | 1) Sign out/in. | Values kept. | |
| Q-04-06 | Cannot edit another user | permission | 1) Agent C edits own profile only. | No way to edit others. | |
| Q-04-07 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

### 6.3 P2 — useful, lower risk or not used by NDC

#### P2 · Organisation

##### O-08 · Multi-brand / custom portal domain
**Priority:** P2 · **Wave:** 4 · **Status:** Partly  
**Why this priority:** One help center is enough for go-live; multi-brand is being built (NDC-1992).  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| O-08-01 | Portal URL works | functional | 1) Open the help center URL from settings. | Loads signed out. | |
| O-08-02 | Add a second brand | functional | 1) Try to add brand "QA MAN Brand". | Saved or "not available" — record. | |
| O-08-03 | Invalid custom domain | negative | 1) Domain "abc". | Refused. | |
| O-08-04 | Kept | persistence | 1) Reload. | Unchanged. | |
| O-08-05 | Agent no access | permission | 1) Agent C. | No access. | |
| O-08-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |
| O-08-07 | Unknown portal page | edge | 1) Open the portal URL with "/xyz" added. | Portal "page not found", not a raw nginx 404. | |

#### P2 · Tickets

##### T-18 · Clone ticket
**Priority:** P2 · **Wave:** 2 · **Status:** Not confirmed  
**Why this priority:** Nice to have; first confirm it exists (no clone string found).  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-18-01 | Find Clone | functional | 1) Ticket › More menu. | "Clone" present (if not: mark Not built, skip the rest). | |
| T-18-02 | Clone copies fields | functional | 1) Clone. | New ticket "… (Clone)" with the same fields, new number, no thread. | |
| T-18-03 | Clone in a dept without rights | permission | 1) Agent C clones a read-only shared ticket. | Refused. | |
| T-18-04 | Clone of a closed ticket | edge | 1) Clone a closed ticket. | New one is open. | |
| T-18-05 | Kept | persistence | 1) Reload clone. | Saved. | |
| T-18-06 | Arabic | UI-RTL | 1) Arabic. | Menu item Arabic. | |
| T-18-07 | Clone a deleted ticket | negative | 1) Open a ticket in the Recycle Bin. | Clone not offered. | |

##### T-22 · Tags (add/remove, tag page, AI tagging)
**Priority:** P2 (inventory P1, lowered) · **Wave:** 2 · **Status:** Built  
**Why this priority:** Lowered: NDC does not use tags.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-22-01 | Add and remove a tag | functional | 1) Add "qa-man-tag". 2) Remove it. | Shows on ticket and Tags page; then gone. | |
| T-22-02 | Filter by tag | functional | 1) Tags page › click tag. | Only tagged tickets. | |
| T-22-03 | Empty / 200-char tag | negative | 1) Add empty, then 200 chars. | Refused or limit. | |
| T-22-04 | Arabic tag | UI-RTL | 1) Arabic tag. | Saved, RTL. | |
| T-22-05 | Kept | persistence | 1) Reload. | Tag kept. | |
| T-22-06 | Agent rights | permission | 1) Agent C on read-only share. | Cannot tag. | |
| T-22-07 | Same tag, different case | edge | 1) Add "QA-MAN-TAG" when "qa-man-tag" exists. | Same tag reused, not a duplicate. | |

##### T-26 · Time entries and timer
**Priority:** P2 (inventory P1, lowered) · **Wave:** 2 · **Status:** Built  
**Why this priority:** Lowered: user confirmed NDC does not use time entries.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-26-01 | Timer | functional | 1) Start, pause, resume, stop. | Entry with right duration. | |
| T-26-02 | Manual entry | functional | 1) Add 0:30, edit 0:45, delete. | Total updates. | |
| T-26-03 | Negative or > 24 h | negative | 1) Enter -1 h, 25 h. | Refused. | |
| T-26-04 | Close with timer running | edge | 1) Close while timer runs. | Prompt to stop/save. | |
| T-26-05 | Kept | persistence | 1) Reload. | Entries kept. | |
| T-26-06 | Edit others' entries | permission | 1) Agent C edits Owner's entry. | Refused. | |
| T-26-07 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-27 · Approvals on a ticket
**Priority:** P2 (inventory P1, lowered) · **Wave:** 2 · **Status:** Built  
**Why this priority:** Lowered: NDC runs approvals as blueprints, not ticket approvals. Candidate bug: approver outside the department can be chosen.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-27-01 | Request and approve | functional | 1) Request approval from Admin B. 2) B approves. | Status Approved on ticket. | |
| T-27-02 | Reject | functional | 1) B rejects another request with a reason. | Rejected with reason. | |
| T-27-03 | Approver outside department | negative | 1) Pick Agent C (not in Marketing). | Not offered / refused. | |
| T-27-04 | Cancel pending | edge | 1) Cancel before decision. | Removed; B can no longer act. | |
| T-27-05 | Kept | persistence | 1) Reload. | Decision kept. | |
| T-27-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-28 · Review (send reply for review before sending)
**Priority:** P2 · **Wave:** 2 · **Status:** TAVI-only  
**Why this priority:** Useful for new agents; not a Zoho blocker.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-28-01 | Send for review, approve | functional | 1) Agent sends reply for review to Admin B. 2) B approves. | Reply sent to M1 only after approval. | |
| T-28-02 | Reject review | functional | 1) B rejects. | Returned to the agent; nothing sent. | |
| T-28-03 | Withdraw | edge | 1) Withdraw before decision. | Nothing sent. | |
| T-28-04 | Reviewer cannot see ticket | permission | 1) Pick a reviewer outside dept. | Not offered. | |
| T-28-05 | Empty review body | negative | 1) Send empty. | Refused. | |
| T-28-06 | Kept | persistence | 1) Reload. | Pending state kept. | |
| T-28-07 | Review banner in Arabic | UI-RTL | 1) Arabic; ticket with a pending review. | Banner Arabic, RTL. | |

##### T-30 · Print / export ticket
**Priority:** P2 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Occasional use.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-30-01 | Print preview | functional | 1) More › Print. | Properties and conversation; options work. | |
| T-30-02 | Without private comments | edge | 1) Untick comments. | Not printed. | |
| T-30-03 | Arabic print | UI-RTL | 1) Arabic ticket. | RTL in preview/PDF. | |
| T-30-04 | Read-only agent print | permission | 1) Agent C. | Allowed for what he can see. | |
| T-30-05 | Very long thread | negative | 1) Print a 50-message ticket. | Preview loads; no cut text. | |
| T-30-06 | Print options remembered | persistence | 1) Untick comments; print. 2) Reload; print again. | Options remembered or reset by design — record. | |

##### T-32 · Ticket archiving (rules, archived view, restore)
**Priority:** P2 · **Wave:** 2 · **Status:** Built  
**Why this priority:** Matters later at volume. Candidate bug: an Open ticket can be archived and drops out of All Tickets.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-32-01 | Archive a closed ticket | functional | 1) More › Archive. 2) Archived view. | Listed there; unarchive returns it. | |
| T-32-02 | Archive an open ticket | negative | 1) Try on an Open ticket. | Refused (candidate bug if allowed). | |
| T-32-03 | Archiving rule (QA scope) | edge | 1) Rule: closed > 1 day in QA dept; keep inactive; preview. | Preview only QA tickets. | |
| T-32-04 | Kept | persistence | 1) Reload. | State kept. | |
| T-32-05 | Agent rights | permission | 1) Agent C. | Per profile. | |
| T-32-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### T-35 · Macros (one-click updates)
**Priority:** P2 (inventory P1, lowered) · **Wave:** 2 · **Status:** Built  
**Why this priority:** Lowered: NDC has 0 macros. Known: NDC-1987.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| T-35-01 | Create and run | functional | 1) Macro "QA MAN macro": Status On Hold + comment. 2) Run on a ticket. | Both applied. | |
| T-35-02 | Macro with no actions | negative | 1) Save empty. | Refused. | |
| T-35-03 | Run on 3 tickets | edge | 1) Bulk run. | All updated. | |
| T-35-04 | Kept | persistence | 1) Reload. | Kept. | |
| T-35-05 | Personal macro | permission | 1) Agent C list. | Owner's personal macro hidden. | |
| T-35-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

#### P2 · Automation

##### U-08 · Support plans and contracts (entitlements)
**Priority:** P2 (inventory P1, lowered) · **Wave:** 3 · **Status:** Built  
**Why this priority:** Lowered: NDC uses 0 contracts.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-08-01 | Plan with SLA | functional | 1) Plan "QA MAN Gold" with an SLA. 2) Contract for QA MAN Account. 3) Ticket for its contact. | Contract SLA applied. | |
| U-08-02 | Expired contract | edge | 1) End date yesterday. | Not applied; warning on ticket. | |
| U-08-03 | End before start | negative | 1) Save. | Refused. | |
| U-08-04 | Kept | persistence | 1) Reload. | Kept. | |
| U-08-05 | Agent no edit | permission | 1) Agent C. | No access. | |
| U-08-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### U-13 · Custom functions and custom actions
**Priority:** P2 (inventory P1, lowered) · **Wave:** 3 · **Status:** TAVI-only · **Partly covered before:** blueprint F7 custom action passed 3 Nov.  
**Why this priority:** Lowered: NDC uses 0 custom functions.  
**Preconditions / data:** A safe test endpoint (webhook.site or similar).

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-13-01 | Create a custom action | functional | 1) Source with base URL of the test endpoint. 2) Action "QA MAN action". 3) Use in a workflow; create a ticket. | Endpoint gets the call with ticket data. | |
| U-13-02 | Endpoint down | negative | 1) Point to a dead URL. | Failure logged; ticket unaffected. | |
| U-13-03 | Slow endpoint | edge | 1) Endpoint delays 30 s. | Timeout handled. | |
| U-13-04 | Kept | persistence | 1) Reload. | Kept. | |
| U-13-05 | Agent no access | permission | 1) Agent C. | No access. | |
| U-13-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### U-14 · Webhooks (outgoing) and public API keys
**Priority:** P2 (inventory P1, lowered) · **Wave:** 5 · **Status:** Partly  
**Why this priority:** Lowered: NDC uses 0 webhooks. Webhook exists only as a workflow action (NDC-2009).  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-14-01 | Webhook action fires | functional | 1) Workflow action Webhook to the test endpoint. 2) Create a QA ticket. | Payload received with ticket fields. | |
| U-14-02 | Invalid URL | negative | 1) URL "abc". | Refused. | |
| U-14-03 | Arabic data in payload | UI-RTL | 1) Arabic subject. | UTF-8 correct in payload. | |
| U-14-04 | API keys page | edge | 1) Look for an API keys page. | Record gap if missing. | |
| U-14-05 | Kept | persistence | 1) Reload. | Kept. | |
| U-14-06 | Agent no access | permission | 1) Agent C. | No access. | |

#### P2 · Customers

##### C-04 · Contracts (with support plan, validity)
**Priority:** P2 (inventory P1, lowered) · **Wave:** 5 · **Status:** Built  
**Why this priority:** Lowered: NDC uses 0 contracts. Run with U-08.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| C-04-01 | Create contract | functional | 1) For QA MAN Account with plan QA MAN Gold. | Listed on account. | |
| C-04-02 | Missing account | negative | 1) Save without account. | Refused. | |
| C-04-03 | Renew | edge | 1) Extend end date. | Updated. | |
| C-04-04 | Kept | persistence | 1) Reload. | Kept. | |
| C-04-05 | Agent rights | permission | 1) Agent C. | Per profile. | |
| C-04-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |

##### C-06 · Calendar (month / week / day, all users)
**Priority:** P2 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC uses a calendar extension; low risk.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| C-06-01 | Views | functional | 1) Month, week, day. | QA MAN events in the right slots. | |
| C-06-02 | Drag to reschedule | functional | 1) Drag an event. | Time updated. | |
| C-06-03 | Drag a completed call | negative | 1) Try. | Refused. | |
| C-06-04 | All users view | permission | 1) Agent C. | Only allowed users. | |
| C-06-05 | Kept | persistence | 1) Reload. | Kept. | |
| C-06-06 | Arabic | UI-RTL | 1) Arabic. | Week starts right, RTL. | |
| C-06-07 | Event over midnight | edge | 1) Event 23:00–01:00. | Shows on both days correctly. | |

#### P2 · Insight

##### I-04 · Team feeds (department feed, mentions, direct messages)
**Priority:** P2 · **Wave:** 5 · **Status:** Built  
**Why this priority:** NDC uses Cliq for chat; feeds are extra.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| I-04-01 | Post in department feed | functional | 1) Post "QA MAN feed". | Members see it. | |
| I-04-02 | Mention / DM | functional | 1) Mention B; DM B. | B notified. | |
| I-04-03 | Empty post | negative | 1) Post empty. | Refused. | |
| I-04-04 | Non-member | permission | 1) Agent C opens Marketing feed. | Not visible. | |
| I-04-05 | Kept | persistence | 1) Reload. | Kept. | |
| I-04-06 | Arabic | UI-RTL | 1) Arabic post. | RTL. | |
| I-04-07 | Long post with link and image | edge | 1) Post 2,000 characters with a link and an image. | Shown in full; link clickable. | |

#### P2 · Data

##### D-08 · Data archive
**Priority:** P2 · **Wave:** 5 · **Status:** TAVI-only  
**Why this priority:** Later, at volume.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-08-01 | Page loads | functional | 1) Settings › Data › Archive. | Loads; lists archived data. | |
| D-08-02 | Restore one item | functional | 1) Restore a QA archived ticket. | Back in lists. | |
| D-08-03 | Search archive | edge | 1) Search "QA MAN". | Found. | |
| D-08-04 | Invalid action | negative | 1) Restore an already restored item (second tab). | Clear message. | |
| D-08-05 | Agent no access | permission | 1) Agent C. | No access. | |
| D-08-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |
| D-08-07 | Restored item kept | persistence | 1) After D-08-02 reload. | Ticket stays in normal lists. | |

#### P2 · Cross-cutting

##### Q-02 · Accessibility settings (font size, contrast, motion)
**Priority:** P2 · **Wave:** 5 · **Status:** Built  
**Why this priority:** Comfort, not a blocker.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| Q-02-01 | Font size | functional | 1) Set large font. | All screens bigger, nothing cut. | |
| Q-02-02 | High contrast | functional | 1) Turn on. | Text readable. | |
| Q-02-03 | Reduced motion | edge | 1) Turn on. | No animations. | |
| Q-02-04 | Kept | persistence | 1) Sign in again. | Kept per user. | |
| Q-02-05 | Keyboard only | negative | 1) Use Tab only on a ticket page. | Every action reachable, focus visible. | |
| Q-02-06 | Arabic | UI-RTL | 1) Arabic + large font. | No overlap. | |

### 6.4 P3 — lowest

#### P3 · Automation

##### U-15 · AI tagging
**Priority:** P3 (inventory P2, lowered) · **Wave:** 3 · **Status:** Built  
**Why this priority:** Lowered: NDC does not use tags. Known: NDC-2003.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| U-15-01 | AI tag on new ticket | functional | 1) Enable for QA dept. 2) Create a ticket about refunds. | Tag suggested/added, or clear "AI not set up". | |
| U-15-02 | Turned off | negative | 1) Disable; create. | No tag. | |
| U-15-03 | Arabic ticket | UI-RTL | 1) Arabic text. | Tag or clear message. | |
| U-15-04 | Kept | persistence | 1) Reload. | Setting kept. | |
| U-15-05 | Agent no access | permission | 1) Agent C. | No access. | |
| U-15-06 | Ticket about two topics | edge | 1) Ticket text about refund and baggage. | Two tags or the best one — record. | |

#### P3 · Customization

##### X-06 · Data types and capabilities catalogue
**Priority:** P3 (inventory P2, lowered) · **Wave:** 5 · **Status:** TAVI-only  
**Why this priority:** Lowered: admin reference pages; no NDC process uses them.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| X-06-01 | Pages load | functional | 1) Open /settings/data-types and /settings/capabilities. | Load with content. | |
| X-06-02 | Search | edge | 1) Search "date". | Matching rows. | |
| X-06-03 | Agent no access | permission | 1) Agent C. | No access. | |
| X-06-04 | Unknown item URL | negative | 1) Edit URL id. | Not found page. | |
| X-06-05 | Arabic | UI-RTL | 1) Arabic. | RTL. | |
| X-06-06 | Same after sign-in | persistence | 1) Sign in again; open both pages. | Same content. | |

#### P3 · Integrations

##### G-02 · Collaboration tools (Slack / Teams)
**Priority:** P3 (inventory P2, lowered) · **Wave:** 5 · **Status:** Built  
**Why this priority:** Lowered: NDC uses Zoho Cliq, which TAVI does not offer. Needs a test Slack/Teams workspace; skip if none.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| G-02-01 | Connect Slack | functional | 1) Connect a test workspace. | Connected. | |
| G-02-02 | Notify channel from workflow | integration | 1) Workflow action Slack message on QA ticket create. | Message arrives. | |
| G-02-03 | Revoked token | negative | 1) Revoke in Slack; trigger. | Failure logged. | |
| G-02-04 | Kept | persistence | 1) Reload. | Connected. | |
| G-02-05 | Agent no access | permission | 1) Agent C. | No access. | |
| G-02-06 | Arabic | UI-RTL | 1) Arabic text in message. | Readable. | |
| G-02-07 | Long Arabic message with link | edge | 1) Trigger a message with 1,000 Arabic characters and a ticket link. | Arrives in full; link opens the ticket. | |

##### G-03 · API integration config page
**Priority:** P3 (inventory P2, lowered) · **Wave:** 5 · **Status:** Partly  
**Why this priority:** Lowered: link opens HQ; only confirm state.  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| G-03-01 | Link opens a page | functional | 1) Settings › API Integration. | Real page (not HQ) — record. | |
| G-03-02 | Direct URL | edge | 1) Open /settings/integration-config. | Same result. | |
| G-03-03 | Agent no access | permission | 1) Agent C. | No access. | |
| G-03-04 | Arabic | UI-RTL | 1) Arabic. | Label Arabic. | |
| G-03-05 | Unknown sub-path | negative | 1) Open /settings/integration-config/xyz. | Not found page, no blank screen. | |
| G-03-06 | Same after sign-in | persistence | 1) Sign in again; click the link. | Same behaviour as G-03-01. | |

#### P3 · Data

##### D-05 · Sandbox
**Priority:** P3 (inventory P2, lowered) · **Wave:** 5 · **Status:** Partly  
**Why this priority:** Lowered: not needed for go-live; create never finishes (NDC-2514).  

| TC | Title | Type | Steps | Expected | Result |
|---|---|---|---|---|---|
| D-05-01 | Page loads | functional | 1) Settings › Data › Sandboxes. | No ERROR. | |
| D-05-02 | Create sandbox | functional | 1) Create "QA MAN sandbox". | Finishes within 30 min (NDC-2514). | |
| D-05-03 | Empty name | negative | 1) Save empty. | Refused. | |
| D-05-04 | Kept | persistence | 1) Reload. | Listed. | |
| D-05-05 | Agent no access | permission | 1) Agent C. | No access. | |
| D-05-06 | Arabic | UI-RTL | 1) Arabic. | RTL. | |
| D-05-07 | Two sandboxes at once | edge | 1) Start a second sandbox while one is pending. | Refused with a clear message, or both finish. | |

---

## Appendix A — Not testable yet

Wave 0 (Missing / In development / no setup behind it) and features marked Missing in other waves. Nothing to run; check only that they are still absent when a build note says they arrived.

| Id | Feature | Status | Wave | Plane |
|---|---|---|---|---|
| A-08 | Agent sign-in security: SSO/SAML, 2FA, allowed IPs, session policy | Missing | 1 | NDC-1977, NDC-2760 |
| A-10 | Zia Agents / AI agent seats | TAVI-only (built-in AI Agent profile, Omnichannel) | 0 | NDC-2702 |
| A-11 | Privacy: data subject requests, attachment controls | Missing | 5 | NDC-2760 |
| O-07 | Gamescope (agent gamification) | Missing | 0 | NDC-2760 |
| T-39 | Ticket translation | Missing | 0 | NDC-2005, NDC-2760 |
| T-41 | Telephony panel on ticket (click to call) | Partly (no phone setup behind it) | 0 | NDC-2008 |
| T-42 | Read receipts for replies | Missing | 0 | NDC-2636, NDC-2760 |
| U-10 | Supervisor rules | Missing | 3 | NDC-1973, NDC-2760 |
| U-11 | Schedules (custom function on a schedule) | Missing | 0 | NDC-1989, NDC-2760 |
| N-11 | Live chat | In development | 0 | NDC-2000 |
| N-12 | Social channels | In development | 0 | NDC-1667, NDC-2000 |
| N-13 | Phone / telephony channel | Missing | 0 | NDC-2760 |
| N-14 | Instant messaging (WhatsApp / Telegram / LINE) | Missing | 0 | NDC-2000, NDC-2760 |
| N-15 | Guided conversations | Missing | 0 | NDC-1994, NDC-2760 |
| N-16 | ASAP help widget / mobile SDK | Missing | 0 | NDC-1995, NDC-2760 |
| N-17 | Help Center SSO | Missing | 0 | NDC-2264, NDC-2760 |
| I-05 | Radar / agent mobile app | Missing | 0 | NDC-1998 |
| X-04 | Custom buttons on ticket | Missing | 0 | NDC-2760 |
| G-04 | Marketplace / extensions | Missing | 0 | NDC-2013 |
| G-05 | Developer space | Missing | 0 | NDC-2009, NDC-2760 |

Wave 1 features already passed (O-01..O-05, A-01..A-07, A-09) are not repeated here.

---

## 7. Cleanup checklist (end of day 16, or after each day for heavy items)

Search every module for "QA MAN" before you finish. Tick each line.

**Tickets and ticket items**
- [ ] Delete all "QA MAN" tickets (search "QA MAN" in All Tickets, incl. Closed, Spam, Archived and Shared views). Unmerge or unlink parents/children first.
- [ ] Remove shares, followers, legal holds and scheduled replies left on QA tickets.
- [ ] Delete QA MAN views, snippets, ticket templates, macros, tags, signatures added for tests.
- [ ] Recycle Bin: "Delete forever" each QA MAN item one by one. **Do not click Empty Bin** (it deletes everything after one confirm, NDC-2517). If delete forever fails (NDC-2248), list what stays.

**Automation**
- [ ] Deactivate, then delete: assignment rules "QA MAN …", round-robin preferences set back, skills "QA MAN …", workflow rules and saved actions "QA MAN …", SLA "QA MAN SLA", blueprint "QA MAN BP" (move tickets out first), support plan "QA MAN Gold", custom action and source, webhook action, AI tagging setting.
- [ ] Notification rules of the QA department set back to the screenshot.
- [ ] Ticket numbering series of the QA department removed or set back.
- [ ] QA business-hours set removed if you made one.

**Channels and self service**
- [ ] Support address alias "qa-man" removed (if added); test SMTP provider removed; live provider untouched.
- [ ] M2 removed from blocked list; suppressions untouched.
- [ ] Email template "QA MAN template EN/AR" deleted.
- [ ] Web form "QA MAN form" deleted.
- [ ] Help Center: branding set back; portal user M2 deactivated/deleted; community topic "QA MAN topic" deleted.
- [ ] KB: "QA MAN article" (and translations, versions), draft article and "QA MAN cat" deleted.
- [ ] Customer happiness settings of the QA department set back.

**Customers, data, customization**
- [ ] Contacts "QA MAN Contact 1/2", "QA MAN Dup", "QA MAN Imp …" and accounts "QA MAN Account/Sub" deleted (undo the import first).
- [ ] Contract, activities (tasks, calls, events "QA MAN …"), team feed posts deleted.
- [ ] Product "QA MAN Product" deleted (Desk and CRM).
- [ ] Custom module "QA MAN Airline", lookup field, "QA MAN Layout", test fields, layout/validation rules and dependent picklist deleted. Standard layout checked unchanged.
- [ ] Export files, backup ZIP and any sandbox "QA MAN sandbox" removed; retention rule deleted; archiving rule deleted.
- [ ] Dashboards "QA MAN TOPUP" and custom/scheduled reports deleted.

**Integrations and users**
- [ ] CRM: "QA MAN CRM Contact", account change and product set back or deleted in CRM; failure-log rows retried or discarded. Connection still connected.
- [ ] Slack/Teams test workspace disconnected.
- [ ] Admin B language set back; accessibility settings set back; My profile signatures and time zone set back for all test accounts.

**Old data from the paused Wave 2 run**
- [ ] "QA GL W2" tickets #781–#794, its macro, template, snippet, tag, view; cancel the 2 pending approvals and 2 pending review drafts.

**Final check**
- [ ] Compare each tenant setting with the screenshot taken before. Note any difference that was not made by you.
