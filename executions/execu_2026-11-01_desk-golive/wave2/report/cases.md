# Wave 2 — Ticket daily work: test cases on NDC-Staging (TAVI Desk go-live, rewritten 2 Nov 2026)

Host https://staging-desk.taviportal.com, tenant **NDC-Staging ("Wonder Travel")**, owner ndc-staging-owner@anyware.software (A). Reference: Zoho Desk Enterprise (reference/zoho-desk-inventory.md sections 1 ZT, 2 ZR) and the live Zoho org techsolutionsegypt (read only).
Replaces the Anyware draft (cases.md, kept for history). Same ids, so earlier notes still map.

**Accounts (one sign-in each per run):** A owner; **B** mahmoud.mahamed1515@gmail.com (B, Desk Admin in Marketing); **C** fedelav803@meinvr.com (C, Desk Agent, Customer Support only). B and C replace every "Inconclusive — needs a second agent" case from the Anyware draft.
**Test data:** prefix `QA GL W2 `, department **Marketing** (2a73bbc0…; no blueprint, no SLA, no assignment rule; agents A, B, mahmoud.mmohamedsamy@gmail.com, mahmoud.mohamed1@taviportal.com). Move/share target **Sales** (ef8dc91f…), share-to-C target **Customer Support** (7e1ac409…). Tickets module 88e8ea44…, contacts 43004ce2…; contact **mmohamed@anyware.software** (183dc191…). Mail only to mmohamed@anyware.software and mahmoud.mmohamedsamy@gmail.com (CC/forward). Created ids → `after/created-ndc.jsonl`.
**Tenant-wide workflow rules (all departments, layout Standard) — avoid triggering them:** on create with priority Low/Medium → task; High/Urgent → tag + field update + task + Calls record; on edit with High/Urgent → tag; on edit with channel web → create record ("test"), channel other → tag. So QA tickets are created **with no priority and channel Phone**; priority edits go to Low/Medium only; the screen-created ticket (W2-11) is not edited afterwards. W2-84 checks nothing slipped through.
**Before / after:** baseline (macros, snippets, templates, tags, views, statuses, recycle bin, SLA, rules count) → `ndc-baseline/`; end with `after/diff-ndc.txt` and full cleanup (delete QA tickets, views, templates, snippets, macros, tags; restore any setting).
**Settle this wave:** T-18 Clone (W2-41), T-11 KB suggestions (W2-29), T-38 AI panel (W2-67..69).
Lens: UI · API · NEG · PERM · I18N · A11Y · CONC · SEC · PERF · AGENT (B or C signed in).

| Id | Row | Screen / API | Steps | Expected (TAVI spec + Zoho behaviour) | Lens | Plane |
|---|---|---|---|---|---|---|
| W2-01 | T-01 | Ticket views | Open /views/all/tickets | Starred + all system views (All, My, Open, On Hold, Escalated, Closed, Spam, Shared…) with counts; Zoho: system views + custom views | UI | NDC-2211 (Done) |
| W2-02 | T-01 | Custom view | Create "QA GL W2 view" (criteria Department = Marketing), clone, delete | Created, listed, clone works, deleted | API+UI | |
| W2-03 | T-01 | Star / pin view | Pin then unpin the QA view | Shows under Starred, then not | API | |
| W2-04 | T-01 | Filters and sort | Filter list by subject contains "QA GL W2", sort by created | Only QA tickets; order correct | API | |
| W2-05 | T-02 | View modes | Switch table / classic / board (kanban) / peek | Each mode renders the QA ticket; board lanes by status | UI | |
| W2-06 | T-03 | Agent Queue | Open Agent Queue | Agents with open counts; owner listed | UI+API | |
| W2-07 | T-03 | Team Queue | Open Team Queue | Teams with lanes | UI | |
| W2-08 | T-03 | Tags page | Open Tags tab | Tag list with counts, trends | UI+API | |
| W2-09 | T-04 | Create via API | POST record subject/status/priority/department/contact | 201; ticket number assigned; defaults set | API | |
| W2-10 | T-04 | Create — required | No subject; no status; bad priority value | 4xx with field errors, nothing created | NEG | |
| W2-11 | T-04 | Create via screen | "+" › Ticket, fill, Save | Ticket created; success message (not "Permission denied") | UI | NDC-2661 |
| W2-12 | T-33 | Ticket number | Check number of new QA ticket vs number format (no dept series for QA dept → default series) | Next default number used, no prefix | API | |
| W2-13 | T-34 | Ticket templates | Create "QA GL W2 template", use it in create picker, delete | Picker lists it; fields prefilled | API+UI | |
| W2-14 | T-04 | Subject with HTML | Subject `QA GL W2 <img src=x onerror=alert(1)>` | Stored as text, shown as text, no script | SEC | |
| W2-15 | T-05 | Detail page | Open the QA ticket | Header (subject, status, reply/comment/close), properties panel, tabs Conversation/Resolution/Time/Attachment/Parent-Child/Activity/Approval/History, no raw keys | UI | |
| W2-16 | T-05 | Edit subject / properties | Change subject, priority, due date | Saved; history rows added | API+UI | |
| W2-17 | T-05 | History tab | Read history | Create + each change listed with names, not raw ids | UI+API | NDC-2660 |
| W2-18 | T-06 | Reply | Reply to contact (mmohamed@) | Sent; thread shows outgoing reply with delivery state | API+UI | NDC-2636 |
| W2-19 | T-06 | Reply all + CC | Reply with CC mahmoud.mmohamedsamy@gmail.com | CC kept on the reply; ticket CC list updated | API | |
| W2-20 | T-06 | Forward | Forward to mahmoud.mmohamedsamy@gmail.com | Sent as forward; thread shows it | API | |
| W2-21 | T-06 | Reply validation | Reply with invalid To address; empty body | 4xx; no saved "sent" reply | NEG | NDC-2377 |
| W2-22 | T-07 | Private comment | Add comment, edit, delete | Shown as private; edit/delete work | API+UI | |
| W2-23 | T-07 | Mention in comment | Mention an agent | Mention chip saved | API | |
| W2-24 | T-07 | Pin comment | Pin for everyone, unpin | Pinned block shows, then gone | API | |
| W2-25 | T-08 | Draft | Save a reply draft, reload | Draft restored (Zoho: server draft) | API+UI | NDC-2644 |
| W2-26 | T-09 | Scheduled reply | Schedule a reply +1 day, list, cancel | Listed in Scheduled Replies; cancel clears it; nothing sent | API+UI | NDC-2184 |
| W2-27 | T-10 | Snippets | Create "QA GL W2 snippet" with placeholder, resolve on ticket, delete | Placeholder filled from the ticket | API | |
| W2-28 | T-10 | Email template in composer | List Desk email templates for the ticket | Templates listed | API | |
| W2-29 | T-11 | KB suggestions | Open Articles panel / suggestions for subject | Suggestions load (or "No article matches") — not "could not be loaded" | UI+API | NDC-2636 |
| W2-30 | T-06 | Signature | Reply shows owner's signature if set | Signature appended per settings | API | |
| W2-31 | T-12 | Assign owner | Assign to agent B (mahmoud.mahamed1515@gmail.com), then back; unassign with owner only | Owner changes; unassign works (no 500) | API | NDC-2355 |
| W2-32 | T-12 | Pick up | Unassigned QA ticket › pick up | Owner = me | API | |
| W2-33 | T-13 | Status flow | Open → On Hold → Closed (close dialog) → Reopen | Each change saved; closed badge; reopened | API+UI | |
| W2-34 | T-13 | Status negative | Status "Bogus" | 4xx | NEG | |
| W2-35 | T-14 | Move department | Move QA ticket to Sales and back | Department changes; layout mapping dialog if layouts differ | API+UI | |
| W2-36 | T-15 | Share | Share with Sales (read only), change to full, unshare | Shares listed; banner text; removed | API | |
| W2-37 | T-15 | Shared department view | Share the Marketing ticket with Customer Support (read only); agent C opens it, tries reply/edit | C can read, cannot edit or reply; after unshare C gets 403/404 | AGENT | NDC-2303, NDC-2376 |
| W2-38 | T-16 | Merge | Merge 2 QA tickets (master + child) | Child closed and points to master; thread combined | API+UI | |
| W2-39 | T-16 | Unmerge | Unmerge the child | Child back as own ticket | API | |
| W2-40 | T-17 | Split | Split a customer message into a new ticket | New ticket created from the message; only customer messages splittable | API+UI | |
| W2-41 | T-18 | Clone | More › Clone on QA ticket | New ticket "… (Clone)" with same fields | UI | |
| W2-42 | T-19 | Parent / child | Link 2 QA tickets as children of a parent, unlink | Parent tab lists children; unlink works | API+UI | |
| W2-43 | T-20 | Spam | Mark spam, list Spam view, Not spam | Spam banner; back to normal | API+UI | |
| W2-44 | T-21 | Delete / restore | Delete QA ticket → Recycle Bin → restore | Gone from list; restored intact | API | |
| W2-45 | T-21 | Delete forever | Delete forever from Recycle Bin | Removed (known failing) | API | NDC-2248 |
| W2-46 | T-22 | Tags | Add "qa-gl-w2" tag, remove | Tag on ticket and Tags page; removed | API+UI | |
| W2-47 | T-23 | Follow | Follow / unfollow; followers list | Following indicator toggles | API+UI | |
| W2-48 | T-24 | Attachment | Upload small text file to ticket, list, delete | Listed with size; deleted | API | |
| W2-49 | T-24 | Attachment limits | Upload over size limit / blocked type | Refused with message | NEG | |
| W2-50 | T-25 | Viewers heartbeat | Send viewer heartbeat as owner, read viewers | Self registered, no error | API | NDC-1965 |
| W2-51 | T-25 | Collision warning | Owner and agent B open the same ticket; B starts a reply | "X is also viewing / replying" | AGENT | NDC-1965 |
| W2-52 | T-26 | Timer | Start → pause → resume → stop | Time entry added with duration | API+UI | |
| W2-53 | T-26 | Manual time entry | Add 0h30, edit to 0h45, delete | Saved; total updates; billable default from settings | API | |
| W2-54 | T-26 | Time entry negative | Negative / >24h duration | 4xx | NEG | |
| W2-55 | T-27 | Approval request | Request approval (approver = agent B), cancel | Request listed; cancel works | API+UI | |
| W2-56 | T-27 | Approval decided | Agent B approves one request and rejects a second | Decision shown | AGENT | |
| W2-57 | T-28 | Review before send | Send reply for review, withdraw | Awaiting review, then withdrawn; nothing sent | API | |
| W2-58 | T-28 | Review decided | Agent B approves one review (sent to mmohamed@ only) and rejects one | Sent or returned | AGENT | |
| W2-59 | T-29 | Resolution | Save resolution (no notify), edit, delete; empty → error | Saved and shown; "Resolution content is required." | API+UI | |
| W2-60 | T-30 | Print | More › Print | Print preview with properties, conversation, options | UI | |
| W2-61 | T-31 | Bulk update | Mass update priority on 2 QA tickets | Both updated; bulk log row | API | |
| W2-62 | T-31 | Bulk assign / close | Bulk assign + close 2 QA tickets | Both changed | API+UI | |
| W2-63 | T-32 | Archive | Archive / unarchive a closed QA ticket | Archived chip; back | API | |
| W2-64 | T-33 | Number format page | Open Ticket Number page | Default and per-dept series shown | UI | |
| W2-65 | T-35 | Macro | Create "QA GL W2 macro" (status On Hold + comment), apply on ticket, delete | Ticket updated + comment added | API+UI | NDC-1987 |
| W2-66 | T-36 | SLA panel | SLA section on ticket | Policy name / due shown or "no SLA" | UI+API | |
| W2-67 | T-38 | AI summary | Run summary | Summary or a clear AI error (not set up / no credits) | API+UI | NDC-2004 |
| W2-68 | T-38 | AI triage | Run triage | Sentiment / intent / language or clear error | API | |
| W2-69 | T-38 | AI reply suggestions / draft assist | Run suggestions, draft assist | Suggestions or clear error | API | |
| W2-70 | T-39 | Translate message | Translate the opening message | Translation or clear error | API | NDC-2005 |
| W2-71 | T-40 | Global search | Search "QA GL W2" and the ticket number | QA ticket found under Desk / Tickets | API+UI | |
| W2-72 | T-40 | Keyboard shortcuts | Shift+C on ticket page opens comment | Comment editor opens | UI | |
| W2-73 | Q-03 | Notifications bell | Unread count, list, mark all read | Works, no raw keys | API+UI | |
| W2-74 | T-07 | Mention notification | Agent B, mentioned by the owner, gets a bell notification | Notification received | AGENT | |
| W2-75 | T-12 | Assigned-to-you notification | Agent B, made ticket owner, gets notification | Notification received | AGENT | |
| W2-76 | T-01 | Dept-scoped agent visibility | Agent C (Customer Support only) cannot read QA ticket or comments | 403/404 | AGENT | NDC-2196 |
| W2-77 | T-31 | Permission-hidden actions | Agent C (Desk Agent profile) on a Customer Support QA ticket sees no button; API 403 | Hidden + refused | AGENT | |
| W2-78 | T-05 | Arabic / RTL | Ticket page in Arabic | Labels Arabic, layout RTL, no raw keys | I18N | |
| W2-79 | T-05 | Keyboard / focus | Tab through ticket header actions | Logical order, focus ring | A11Y | |
| W2-80 | T-07 | Comment with HTML | Comment `<script>alert(1)</script><b>x</b>` | Script not run; safe rendering | SEC | |
| W2-81 | T-05 | Unknown ticket id | GET /desk/tickets/{random uuid} | 404, no data | SEC | |
| W2-82 | T-05 | Lost update | Two stale PATCHes on the same ticket | Second refused (row_version) or risk recorded | CONC | |
| W2-83 | T-02 | List performance | Time list API and page for All tickets | API < 1 s, page < 3 s (staging note) | PERF | |
| W2-84 | T-04 | Rule side effects | After each create/edit, list new tasks, tags and Calls records made by the tenant-wide workflow rules | None for QA tickets (no priority, channel phone); any found is recorded and cleaned | API | |
| W2-85 | T-01 | Agent list scope | Agent C opens All Tickets and searches "QA GL W2" | Marketing QA tickets not listed / not found | AGENT | NDC-2196 |
