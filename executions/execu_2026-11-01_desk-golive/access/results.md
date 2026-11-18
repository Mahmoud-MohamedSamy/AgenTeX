# Ticket access run — results (17 Nov 2026, rechecked the same afternoon)

TAVI: staging-desk.taviportal.com, NDC-Staging. Accounts: O owner, B (Desk Administrator, Manager; Marketing/Sales/HR), C (Desk Agent, CEO; Customer Support), D Test User 1 (Manager; switched Desk Agent → custom profiles → Light Agent → restored Supervisor), E Mahmoud TAVIPortal (Supervisor, Manager). Zoho Desk live: org techegysolutions, admin + agent 2 (agent 2 temporarily TechEgySolutions only). Raw output `access/raw/`, scripts `scripts/ac-*.js`, `scripts/zac-*.js`.

Totals (after recheck 17 Nov afternoon): 48 cases · 39 PASS · 4 GAP · 1 DECISION · 2 INFO · 2 BLOCKED. Plus one gap found outside the plan (AC-G5) and 1 small TAVI bug (AC-B1). AC-G4 (shared notification) withdrawn: the rule exists and works.

| # | Id | Result | TAVI (seen) | Zoho (live unless "docs") |
|---|---|---|---|---|
| 1 | AC-01 | PASS | C lists only Customer Support + shared tickets (UI and API) | agent 2: Tech list 403 |
| 2 | AC-02 | PASS | Marketing ticket by URL: "This ticket is not available" + "Permission denied"; record 403; ticket, comments, attachments, history, shares, followers, time entries, activities 404 | 403 on ticket and comments |
| 3 | AC-03 | PASS (same as Zoho) | create form lists every department; API create in Marketing 201 (C then owns it) | form lists Tech for agent 2 (not a member); API create in Tech 200 (#133) |
| 4 | AC-04 | PASS | B (admin) sees exactly Marketing, Sales, HR | — |
| 5 | AC-05 | PASS | owner sees all departments | — |
| 6 | AC-06 | PASS | C (CEO) sees D's and E's (Manager); D sees neither C's nor E's | — |
| 7 | AC-07 | PASS | unassigned Customer Support ticket visible to C, D, E | — |
| 8 | AC-08 | DECISION | peers on Manager: D/E read each other's tickets, edit 403, private comment 201 (TAVI help text: "read — not edit") | live (both agents Custom/Manager, tickets Private): peers off → 403; peers on → view 200, edit 200 (priority changed), comment 200 |
| 9 | AC-09 | PASS | team-owned ticket: member D sees it, C (not member) does not | — |
| 10 | AC-10 | PASS (note) | Public Read Only: D/E see all Customer Support tickets, edit 403, private comment 201; first minute after the switch the ticket endpoints still answered 404 | Zoho API accepts only private/public for tickets |
| 11 | AC-11 | PASS | Public: D edits E's ticket 200, delete 403 (Desk Agent has no delete) | — |
| 12 | AC-12 | INFO | Whole organization reach: D sees and comments on Marketing/HR/Sales tickets, edit 403 (TAVI extra) | no equivalent |
| 13 | AC-13 | PASS | comments, attachments, history, time entries follow the ticket (404 when ticket hidden) | — |
| 14 | AC-14 | PASS | NDC-3045 holds: C (CEO) cannot open B's (Manager) Marketing ticket | — |
| 15 | AC-15 | PASS | profile without View unassigned: unassigned ticket 403/404, pick-up 404, can_view_unassigned false | — |
| 16 | AC-16 | PASS | Desk Agent assigns an unassigned ticket 200; reassigning someone else's: "Only an agent who may assign any ticket can reassign it." | Agent profile has changeOwner |
| 17 | AC-17 | PASS | custom profile with "Access tickets in every department": all departments open and edit | — |
| 18 | AC-18 | GAP | Light Agent: view + private comment only; reply/edit/pick-up/move 403; cannot be owner. **But a light agent can be added to a team (201) and a ticket assigned to that team (200)** | live: agent 1 made Light Agent → team create with them 422 "/agents invalid"; the same call with a full agent 200 |
| 19 | AC-19 | PASS | D as view-only member of Customer Support: view 200, private comment 201; edit/status 403, pick-up 403, reply/move 403 "You can view this ticket but not change it." (NDC-3059 not reproduced) | — |
| 20 | AC-20 | PASS | C (no Share right) share 403; profile with Move denied: move 403 "Missing required permission 'desk:ticket:move'" | Agent profile shareTickets false |
| 21 | AC-21 | PASS | Full: C edits priority 200, private comment 201, reply 201; status 403 and owner 403 with clear message | Full: priority/comment OK; status/owner PATCH 200 but silently not changed |
| 22 | AC-22 | PASS | recheck: Restricted → internal forward 201 twice, external forward 201, customer reply 403, private comment 201 (the 11:46 refusal did not come back) | live: Restricted ticket shows only "Forward" (Send Private Thread); an outside address is accepted in To |
| 23 | AC-23 | PASS | Read-only: edit/status/owner 403, private comment 201, reply 403 | Read-only: edit 403, comment 200, reply 403 |
| 24 | AC-24 | PASS | C with a Share right still cannot re-share, unshare or change level on a ticket shared into their department | agent 2: re-share PATCH has no effect |
| 25 | AC-25 | PASS | B unshares R1 → C gets 403/404 at once and after 30 s | live: unshare → sharedDepartments [] |
| 26 | AC-26 | PASS | 11 depts 422, own dept 422, bad access 400, unknown dept 422, duplicate 422, 10 OK | own dept 403 |
| 27 | AC-27 | PASS | Shared Tickets view (/views/shared) lists SH1, MK2; bulk bar refuses limited-access tickets | — |
| 28 | AC-28 | PASS | History: "Ticket shared with a department — Customer Support — Full Access"; ticket rows show "Read-only for you" | History: TicketShared |
| 29 | AC-29 | PASS | Department rule "Receiving a shared ticket" exists (off by default in Customer Support). Switched on: C got "Ticket #4859 shared with Customer Support: QA AC2 R2" in the bell; switched off again | live: Department Notifications › Receiving a shared ticket (off by default) |
| 30 | AC-30 | PASS | light agent opens ticket shared Restricted with their department, comments (NDC-2304 holds) | — |
| 31 | AC-31 | PASS (note) | move into the shared department drops the share; move to a third department keeps it | into shared dept: share dropped (third dept not checked, only 2 active depts) |
| 32 | AC-32 | PASS | spam removes the share; comment, reply and re-share refused "Mark it as Not Spam first." (NDC-3073 looks fixed) | live: markSpam → sharedDepartments [] |
| 33 | AC-33 | PASS | move: status → Open, owner cleared unless a target agent picked, number and comments kept, History "Ticket moved…" | same |
| 34 | AC-34 | PASS | C loses access after the ticket leaves Customer Support | agent 2 loses access (403) |
| 35 | AC-35 | PASS (same as Zoho) | C moves own ticket into Marketing (not a member) 200 | agent 2 moves into Tech 200 |
| 36 | AC-36 | BLOCKED | no SLA attaches to Marketing tickets on staging (two QA policies; re-apply for the policy and for the ticket: state "none"), so the SLA reset on move could not be seen | — |
| 37 | AC-37 | GAP | no move from the list (no department label on rows); bulk Move not needed | All Departments list: department label › MOVE DEPARTMENT; mass bar has no Move |
| 38 | AC-38 | GAP | page swaps to "This ticket is not available" — no who/where | prompt "… has moved this ticket from TechEgySolutions to Tech department. Would you like to stay on this ticket?" |
| 39 | AC-39 | INFO | C moves R5 (Standard layout) into QA NDC Manual Invoice (own layout): no layout step; the ticket keeps the shared Standard layout and the department layout is offered under Change Layout; ticket number changed to that department's series (#4862) | not compared (test org has one layout per department) |
| 40 | AC-40 | PASS (note) | same dept 422, unknown dept 422, bad id 400, owner not in target 422 — messages show raw ids | — |
| 41 | AC-41 | PASS | Team Queue shows only Customer Support teams | — |
| 42 | AC-42 | PASS | team member switched D → E: E now sees the team ticket | — |
| 43 | AC-43 | PASS | Team Assignment off in Customer Support: assign to team 422 "Team Assignment is off…"; owner picker lists agents only; switched on again | — |
| 44 | AC-44 | PASS (same as Zoho) | contact page as C: only the Customer Support ticket (1); the contact's Marketing and shared tickets not listed or counted | live: contacts/{id}/tickets for agent 2 lists only TechEgySolutions tickets (shared and Tech left out) |
| 45 | AC-45 | PASS | Agent Queue lists only C's departments' agents | — |
| 46 | AC-46 | GAP | C follows R3; owner moves it to Sales: C keeps the follow and still gets bell items "Ticket #4860 moved to Sales" and "New comment on ticket #4860: QA AC2 R3" (subject + number) though C cannot open it | live: agent 2 followed Y3; after the move to Tech the followers list is empty |
| 47 | AC-47 | BLOCKED | needs a Help Center (customer) login with a mailbox we can sign into | — |
| 48 | AC-48 | PASS | B exports Tickets (Setup › Export): 22 rows = the 22 records B can list; Customer Support ticket R7 not in the file | — |

## Findings outside the plan

- **AC-G5 GAP (Zoho live):** Zoho sets ticket access per agent (agent "Role and Permission": AgentPublic = all department tickets, AgentPersonal = own + unassigned, AgentTeamPersonal = own + team + unassigned). Live: agent 2 switched to AgentPersonal → 403 on agent 1's ticket; back to AgentPublic → 200. TAVI has only the tenant-wide level (Private / Public Read Only / Public) plus roles; one agent cannot be limited to own tickets while others see the whole department.
- **AC-B1 bug (TAVI):** Setup › Agents › agent page "Tickets owned" shows raw keys `records.views.open`, `records.views.onHold`, `records.views.closed`.

- **AC-G4 withdrawn:** TAVI has Department Notifications › "Receiving a shared ticket"; the first read only covered the top of the page.

## Observations (not filed)

- Profile, override and permission changes reach the API only when the agent's session token refreshes (5–10 min). Until then old rights apply: with Move denied by override, D still moved a ticket (200) while /iam/me/permissions already showed move false.
- After changing the data-sharing level, ticket endpoints answered 404 for about a minute.
- Removing a profile from a user: `DELETE /iam/users/{id}/profiles/{profile}` answers PROFILE_NOT_ASSIGNED even for the profile just added; only `replace: true` works. The agent page "Manage" dialog has no profile field.
- Move/assign/share error messages show raw ids ("The ticket is already in department 2a73…").

## Cleanup

TAVI: 17 QA AC tickets deleted (incl. a duplicate MV2 from a timed-out run) and 19 Recycle Bin items purged (0 left); teams QA AC Team and QA AC Light Team deleted; profile "QA AC all-depts no-move" deleted; Test User 1 back to Desk Supervisor; Customer Support members back to the original 5 (+1 view-only); no overrides on C or D; ticket access Private / Agent's departments / no peers. Agent sessions closed, their sign-in files deleted. Replies sent to mmohamed@anyware.software from the shared-ticket tests (2–3 mails, "please ignore").
Zoho: agent 2 back to AgentPublic, role CEO, both departments; CEO peers on; tickets data sharing public; tickets #125–#133 and contact QA AC Zoho trashed and purged (Recycle Bin 0, tickets 404). Zoho servers stopped.

Recheck run (afternoon): TAVI 8 QA AC2 tickets + contact deleted and purged (bin 0), 2 QA AC2 SLA policies deleted, D removed from Customer Support (5/1 again), team assignment on, shared-ticket rule off. Zoho: agents 1 and 2 back to AgentPublic/CEO/Agent profile and their departments, Manager peers off, data sharing public, Y tickets + contact purged, control team deleted. Replies/forwards from the recheck went to mmohamed@ and example.com (please ignore).

## Filed in Plane (17 Nov ~14:10, user approved)
AC-G1 → NDC-3095 · AC-G2 → NDC-3096 · AC-G3 → NDC-3097 · AC-G5 → NDC-3098 (Medium) · AC-G6 → NDC-3099 · AC-B1 → NDC-3100. Bug state, Desk module, Sprint 16, annotated image each (scripts/file-ac-bugs.js → access/plane-filed.json). AC-08 (peers read-only) not filed: waiting for the user decision.
