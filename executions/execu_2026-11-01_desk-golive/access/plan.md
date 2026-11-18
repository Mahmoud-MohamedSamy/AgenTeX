# Ticket access run — plan (17 Nov 2026)

Scope (user): ticket access between teams and departments, sharing with other departments, moving between departments, and every other part of "who can see which ticket". Plan vs Zoho Desk, list what is missing, run, report.

## What TAVI ships (read live 17 Nov, owner, NDC-Staging, read-only)

- **Setup › Ticket Access**: data sharing for tickets = **Private** (also Public Read Only, Public Read/Write/Delete); public access scope = **Agent's departments** (or Whole organization); Share data with peers per role (CEO, Manager; none ticked). The page lists 8 ways an agent reaches a ticket: own, team's (unowned), unassigned (needs "View unassigned"), subordinates', peers (read only), shared with their department ("read only"), public level, "Access tickets in every department".
- **Setup › Data Sharing**: Tickets Private; other modules Public Read/Write/Delete.
- **Roles**: CEO › Manager. Agent C has role **CEO**; B and most QA users have Manager.
- **Profiles** (ticket permissions): Administrator has share, move, assign, delete, view_unassigned, all actions. Agent has move, merge, assign_unassigned, view_unassigned, reply, close; **no share, no assign (all), no delete**. Light Agent: view, comment, view_unassigned. Reviewer: view, view_unassigned. Supervisor: as Agent plus assign and blueprint revoke. **No profile has "Access tickets in every department"** (desk:ticket:all_departments).
- **Share dialog**: up to 10 departments, access level per department (Full Access seen), "Only its own department can change its status or owner".
- **Move dialog**: department, then "Assign to" (only the target department's agents and teams); arrives as a new ticket, status Open, unassigned unless picked.

## Zoho Desk reference (help docs, reference/zoho-desk-inventory.md; each case is also run live in the Zoho test org techegysolutions)

ZT-08/21 Shared views and "shared" view criterion · ZT-31 move from the list's department label · ZT-80 move = new ticket, Open, SLA/automations reset, needs Move Tickets · ZT-81/82 share up to 10 depts, Full / Restricted / Read-only, shared users never change status or owner, receiving dept cannot re-share · ZT-83 only the source unshares; detail shows source dept and level · ZT-84 "Receiving a shared ticket" notification · ZT-85 after a move the agent loses access · ZT-92 collision prompt when another agent moves the ticket · ZT-117/127 bulk Move; no mass actions in Shared views · ZT-166/167 Private: unassigned visible to all, role hierarchy, team tickets to team members only · ZG-25..29 light agents · ZG-72 Change Ownership (all / only unassigned / none), View Unassigned · ZG-75 multi-department permissions (Access data across departments, Move, Share) · ZG-84..86 role hierarchy, Share Data with Peers · ZG-91..94 Private / Public RO / Public RWD, admin sees all in dept, child data follows the ticket.

## Accounts and data

| Short | Account | Profile / role | Departments |
|---|---|---|---|
| O | NDC-Staging owner | Owner (account admin) | all |
| B | agent B (gmail) | Desk Administrator / Manager | Marketing, Sales (+ others — checked at start) |
| C | agent C (meinvr) | Desk Agent / CEO | Customer Support |
| D | Test User 1 (meinvr) | today Desk Supervisor / Manager → **switched to Desk Agent, then Light Agent, restored after** | Customer Support (added if missing, removed after) |

Data: tickets "QA AC …" in Marketing, Sales, Customer Support, HR (no SLA/blueprint/rule depts where possible), one team "QA AC Team" in Customer Support, one custom profile "QA AC all-depts" (clone of Desk Agent + Access tickets in every department). Each sign-in once per account. Everything deleted and purged at the end; tenant settings restored to: Private / Agent's departments / no peers.

Zoho: admin MA, agent 1, agent 2 (each signed in once); tickets "QA AC …" in TechEgySolutions and Tech; data sharing, peer sharing, a team and agent 2's profile changed for the test and set back; tickets purged.

## Cases (48)

Lens: V = visibility · E = edit rights · S = share · M = move · P = permission · T = teams · L = leak across screens/API. Z = run the same case live in Zoho.

| # | Id | Lens | Account | Check | Pass bar (Zoho) | Known |
|---|---|---|---|---|---|---|
| 1 | AC-01 | V Z | C | All Tickets, views, search, global search | only Customer Support + shared tickets | |
| 2 | AC-02 | V L Z | C | open a Marketing ticket by URL and API: ticket, comments, threads, attachments, history, activities | refused (403/404), nothing leaks | NDC-1887, 2830 |
| 3 | AC-03 | P Z | C | new ticket: department list; API create in Marketing | only own departments; API refused | |
| 4 | AC-04 | V Z | B | admin in Marketing+Sales: sees both, not HR | admin sees all tickets of own departments only | |
| 5 | AC-05 | V | O | owner sees every department | all | |
| 6 | AC-06 | V Z | C, D | Private: ticket owned by D in Customer Support | C (CEO) sees it (hierarchy); D does not see C's | ZG-84 |
| 7 | AC-07 | V Z | C, D | unassigned ticket in Customer Support | visible with View unassigned | ZT-166 |
| 8 | AC-08 | V E Z | D + 2nd Manager | Share data with peers on Manager | peers read each other's tickets (TAVI: read only) | NDC-2300 |
| 9 | AC-09 | V T Z | C, D | ticket owned by team only | team members see it; non-members don't | ZT-166 |
| 10 | AC-10 | V E Z | D | Public Read Only | sees all dept tickets, cannot edit others' | |
| 11 | AC-11 | V E Z | D | Public Read/Write/Delete | edits others'; profile still blocks delete | NDC-2301 |
| 12 | AC-12 | V | D | public scope = Whole organization | public reach crosses departments (TAVI extra, record only) | |
| 13 | AC-13 | L Z | C | child data follows ticket (comments, attachments, time) | visible only if ticket visible | ZG-94 |
| 14 | AC-14 | V | C | NDC-3045 retest: lower-role agent's ticket in a dept C is not in | refused | NDC-3045 (Done) |
| 15 | AC-15 | P Z | D (custom) | View unassigned off | unassigned tickets hidden | ZG-72 |
| 16 | AC-16 | P Z | C, D | assign all vs only unassigned | Agent: only unassigned; Supervisor: all | ZG-72 |
| 17 | AC-17 | P Z | D (custom) | "Access tickets in every department" | sees and opens all departments | ZG-75 |
| 18 | AC-18 | P Z | D (Light) | light agent: view + private comment only; not assignable, not a team member | as Zoho | NDC-1981 |
| 19 | AC-19 | P | C | view-only department membership | record only (NDC-3059 In Progress) | NDC-3059 |
| 20 | AC-20 | P Z | C | Share as Agent (no share right); Move with move right removed | hidden and API 403 | |
| 21 | AC-21 | S Z | B → C | share Marketing ticket with Customer Support, Full | C opens, replies, comments, edits fields; not status/owner | ZT-82 |
| 22 | AC-22 | S Z | B → C | Restricted | private comment + internal forward only | ZT-82, NDC-2303 |
| 23 | AC-23 | S Z | B → C | Read-only | view + private comment only | ZT-82, NDC-2303 |
| 24 | AC-24 | S Z | C | receiving dept re-shares / unshares / changes level | refused | ZT-81/83 |
| 25 | AC-25 | S Z | B, C | change level, then unshare | C's rights follow at once; after unshare refused | NDC-2376 |
| 26 | AC-26 | S Z | B | 11th department, own department, disabled department, unknown id | refused with message | |
| 27 | AC-27 | S Z | C | Shared Tickets / Shared Open views; "shared" in custom view; bulk actions in Shared view | listed; no mass actions there | ZT-08/21/127 |
| 28 | AC-28 | S Z | C, B | detail shows source dept + level; History logs share/unshare | as Zoho | ZT-83 |
| 29 | AC-29 | S Z | C | "ticket shared with your department" notification | sent to receiving dept | ZT-84 |
| 30 | AC-30 | S | D (Light/Reviewer) | shared ticket opens for light agent | opens read-only | NDC-2304 |
| 31 | AC-31 | S M Z | B | move a shared ticket (to the shared dept and to a third) | shares handled as Zoho | |
| 32 | AC-32 | S | B | spam revokes shares | already filed NDC-3073 — not repeated | NDC-3073 |
| 33 | AC-33 | M Z | B | move Marketing → Sales: status, owner, Assign to list, number, thread, attachments | Open, owner per pick, history kept | ZT-80 |
| 34 | AC-34 | M Z | C | ticket moved out of C's dept (C owned it) | C loses access | ZT-85 |
| 35 | AC-35 | M Z | C | move to a department C is not in | as Zoho (live) | |
| 36 | AC-36 | M Z | B | SLA, workflow, blueprint on move | reset / blueprint handled | ZT-80/95 |
| 37 | AC-37 | M Z | B | move from list (department label) and bulk Move | as Zoho | ZT-31/117 |
| 38 | AC-38 | M Z | B + C | C has the ticket open while B moves it | prompt to follow or leave | ZT-92 |
| 39 | AC-39 | M Z | B | move to a dept with another layout | layout mapping | |
| 40 | AC-40 | M | B | same dept, disabled dept, unknown dept id, archived ticket | refused with message | |
| 41 | AC-41 | T Z | C | Team Queue: only own departments' teams | as Zoho | |
| 42 | AC-42 | T Z | D | removed from team → loses team-owned tickets | refused | |
| 43 | AC-43 | T | B | team assignment off in dept | Teams tab hidden | NDC-2812 (Done) |
| 44 | AC-44 | L Z | C | contact / account page "tickets" list | only accessible tickets | |
| 45 | AC-45 | L | C | Agent Queue, Team Queue, counts, dashboards | no other-dept numbers | |
| 46 | AC-46 | L | C | follower / bell after losing access | no further content | |
| 47 | AC-47 | L | C | Help Center: contact sees own tickets incl. moved ones | as Zoho | ZT-75 |
| 48 | AC-48 | L | C | export / report of tickets | only accessible tickets | |

## Candidate gaps vs Zoho (to confirm in the run; filed only after your review)

1. Move from the list's department label (ZT-31).
2. Bulk Move from the list (ZT-117).
3. "Receiving a shared ticket" department notification (ZT-84).
4. Collision prompt when another agent moves the ticket you have open (ZT-92).
5. "Shared" criterion in custom views (ZT-21).
6. Light agent can be made ticket owner or team member (ZG-28).
7. Ticket Access help text says shared tickets are "read only", but sharing offers Full / Restricted / Read-only — check which one is true.

Not gaps (TAVI extras, record only): public scope "Whole organization"; peer sharing on the Ticket Access page instead of the role editor.
