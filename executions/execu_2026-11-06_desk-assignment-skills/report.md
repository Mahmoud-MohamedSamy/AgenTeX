# Desk Assignment Rules + Skills — full test, 6–7 Nov 2026

| | |
|---|---|
| Tenant | NDC-Staging (staging-desk.taviportal.com), owner ndc-staging-owner |
| Tickets | NDC-2275 (requirements v2, state Bug), NDC-2752 (Skills, Done), NDC-1978 (Ready For Test) |
| Spec | `docs/desk-assignment-rules/spec-v2-assignment-rules-skills.md` |
| Test data | Depts QA AS6 Dept A / Dept B, team QA AS6 Team A, agents A1 Test User 1, A2 Mahmoud Samy, A3 Dev Team 2; every object in `ledger.md` (still live for review) |
| Method | API scripts (`scripts/g*.js`) + browser checks (`scripts/ui*.js`); agent presence held by `scripts/keepalive.js` |
| Plane | 7 Nov, after your approval: B-2..B-5 filed as NDC-2811..NDC-2814 (state Bug, module Desk, Sprint 15, image attached, related to NDC-2275 and NDC-1978). Comments on NDC-2275 / NDC-2752 / NDC-1978 drafted, not posted |

## Summary

Most of the feature works as specified. On 7 Nov a new build fixed B-1 (round robin on Ticket Create): E-08, D-07, F-10 and H-12 now pass. 4 open bugs: B-2 and B-3 (re-checked 7 Nov, still there), B-4, new on 7 Nov (the New Ticket form shows an owner it does not save; it looks like a side effect of the B-1 fix), and B-5, new on 7 Nov (holiday criteria ignore a holiday list that is not linked to business hours). The audit-log conversion report (J-03) was found and passes. E-05, F-14, G-06 and J-04 were run later on 7 Nov: E-05, F-14 and G-06 pass, J-04 passes in part (owners kept; no old history entries name a rule, so that half cannot be checked). The remaining open cases and the three E2E journeys were run on 7 Nov and pass. Cases still not run are listed in each group with the reason.

## Bugs

| Id | Severity | Bug | Cases | Status |
|---|---|---|---|---|
| B-1 | ~~High~~ Fixed 7 Nov | ~~**Round robin never runs on Ticket Create.**~~ Retest 7 Nov: owner is no longer set to the creator; RR assigns on create (tickets "QA AS6 SEQ B1 create no owner" → A3, "… owner null" → A1); with all agents offline the ticket waits unassigned (backlog). Original text: A ticket created by API (owner omitted or `owner: null`) or the New Ticket form always gets the creator as owner, so the round-robin rule sees an owned ticket and does nothing. Direct rules on create do work. Same as the 5 Nov retest. | E-08, D-07, F-10, H-12 — all PASS 7 Nov | NDC-2275 (state Bug) — can be retested |
| B-2 | High | **Round robin ignores the Email channel.** An agent who is signed in but has the Email channel off (`online: true`, `channels.email: false`) still gets tickets and is not marked SKIPPED; with all three agents on Email off the ticket is still assigned. Zoho assigns only to agents online in the mail channel. A full sign-out is skipped correctly. Re-checked 7 Nov with A2 online (heartbeat, Chat + Phone on, Email off): A2 still got its turn, no SKIPPED; all three Email off → ticket still assigned to A1. Image (approved): `screenshots/annotated/B2-email-channel-off-vs-zoho.png` | RR-10, E-12, E-16 | Filed NDC-2811 (7 Nov) |
| B-3 | Medium | **Team Assignment off does not stop manual team assignment.** With Dept A Team Assignment off, `POST /desk/tickets/{id}/assign {team_id}` returns 200 and the ticket gets the team (7 Nov: ticket #1189 shows Owner "QA AS6 Team A"). New rules with a team target are refused correctly (`team_assignment_off`). The ticket screen is correct: with Team Assignment off its owner picker shows only AGENTS, with it on AGENTS + TEAMS. TAVI's own help text says "Off: only agents can be chosen." So the gap is the API only. Image: `screenshots/annotated/B3-team-assignment-off-api-vs-zoho.png` | F-12 | Filed NDC-2812 (7 Nov) |
| B-4 | Medium | **New Ticket form shows an owner it does not save.** The form opens with Ticket Owner = the signed-in user (ndc-staging-owner). Saving without touching it sends no owner (the POST has no `owner` field) and the ticket is saved **Unassigned** (#1200, Dept B, no rules). In a department with a round-robin create rule the ticket then goes to the next agent (#1199 → Dev Team 2) although the form showed ndc-staging-owner. Zoho (7 Nov, seen): the Add Ticket form also pre-fills Ticket Owner with the signed-in agent; Zoho was not submitted, so what it saves was not seen. Image: `screenshots/annotated/B4-new-ticket-owner-not-saved-vs-zoho.png` | D-14 | Filed NDC-2813 (7 Nov) |
| B-5 | Medium | **"On a holiday" ignores a holiday list that is not linked to business hours.** Holiday lists can be saved without business hours (Setup → Holidays, business hours switch off = "detached"), and the rule criteria picker offers them. Rule "QA AS6 B08 holiday" with list "QA AS6 HOL today" (one holiday: 7 Nov 2026): on 7 Nov, *on a holiday of* did **not** match (#1229 stayed unassigned) and *not a holiday of* **did** match (#1230 → A2), so today is treated as a working day. After linking the same list to a business-hours profile ("QA AS6 BH", not the default), the same rule worked: #1233 → A1, #1234 unassigned. A detached list with 25 Dec behaves correctly (#1231 no match, #1232 → A3). The criterion is "on a holiday of a **list**" (GEN-5c), so either the list should count without business hours, or the picker should not offer detached lists. Re-run for the image: list detached again → #1252 Unassigned, #1254 → A2. Zoho (seen): a holiday list can also be saved with Business Hours off; Zoho runtime with such a list not checked. Image: `screenshots/annotated/B5-holiday-list-not-attached-vs-zoho.png` | B-08 | Filed NDC-2814 (7 Nov) |

### Minor / info (not bugs yet)
- I-1 A Desk Agent without "Manage assignment rules" can still **read** Round Robin Preferences (`GET …/round-robin-preferences` 200); everything else is 403.
- I-2 API accepts "Agent level threshold" on with no agent rows; the UI blocks it ("Pick an agent.").
- I-3 Deleting a skill type that skills still use now returns 409 (on 1 Nov it left the skills untyped). Zoho behaviour not checked.
- I-4 The Assignment Rules page took 35 s to show its content (settings pages were 10–25 s before).
- I-5 A ticket that becomes a backlog ticket gets no history entry (only the later assignment is logged).
- I-6 ~~Execute skill-based assignment for one ticket not found~~ — 7 Nov: ticket ⋯ menu has **Recalculate Skills** and **Assign by Skills** (`POST /desk/tickets/{id}/skills/assign`); H-09 PASS.
- I-9 (7 Nov) **Assign by Skills** on a ticket that already has an owner reassigns it (A1 → A2) with no warning. Zoho behaviour not checked.
- I-7 "Assign backlogs" ran about once a minute (first backlog ticket assigned after 77 s, the next 61 s later).
- I-8 Criteria fields: 17 contact fields (Zoho 26). 7 Nov: Created Time, Modified Time and Closed Time are now in the list (`created_time`, `modified_time`, `closed_time`); Is Escalated still not found.
- I-10 ~~Holiday operators not runnable~~ — 7 Nov: NDC-Staging had no holiday list, so I created two QA lists and one QA business-hours profile (ledger) and ran it: see B-08 and B-5.
- I-12 (7 Nov) The agent threshold counts the agent's open + On Hold tickets in **every** department, not only the department of the round-robin rule (A1: Dept A 60 + Dept B 6 → 66 counted). TAVI's help text says "Maximum number of open tickets an agent in the department can handle". Zoho behaviour not checked. Decide whether this is wanted.
- I-11 (7 Nov) Conversion report readability: in the Audit Log each converted rule shows as "updated X's ID from f2d1… to f2d1…" and "type from round_robin to round_robin", which reads as if nothing changed, and the old method / agents are not shown. The precedence change shows raw rule ids ("runs before round robin rules from blank value to 2f18…,6f38…,ecab…"). The "Assignment conversion report" actor is not in the Audit Log users filter list (facets API), so it cannot be filtered on.

## Results by group

### A — Page, lists, rule form
| Id | Result | Note |
|---|---|---|
| A-01 | PASS | Rules / Team Assignment / Notifications tabs; Direct Assignment and Round Robin sections with own list, New Rule, master switch (I-4 load time) |
| A-02 | PASS | Active and Ticket Create ticked by default |
| A-03 | PASS | "Enter a name for the Assignment Rule." |
| A-04 | PASS | Counters 0/120, 0/1000; API 121 / 1001 → too_long |
| A-05 | PASS | API `execute_on: []` → required |
| A-06 | PASS | API 6 targets → too_many; UI (7 Nov): Add Target disabled after 5, hint "A rule can have up to 5 targets." |
| A-07 | PASS | "Add at least one target." |
| A-08 | PASS | Reorder saved, other rule acts after reorder, order restored |
| A-09 / A-10 | PASS | Inactive rule and master switch off → no action; rules and targets kept |
| A-11 | PASS | Edit keeps values; delete (7 Nov) asks "Delete this rule? Tickets it already assigned keep their owner.", toast "Rule deleted.", the ticket keeps its owner |
| A-12 | PASS | 7 Nov: "Rule saved." |
| A-13 | PASS | Stale save → 409 "This rule was changed by someone else. Reload to see the latest version." |
| A-14 | PASS | Audit: assignment_rule created/updated, skill / skill_type entries |
| A-15 | PASS | Desk Agent: page "You can't manage assignment", API 403 (I-1) |

### B — Criteria
| Id | Result | Note |
|---|---|---|
| B-02 | PASS | `1 and (2 or 3)`: High ✓, Urgent ✓, Low ✗, other subject ✗ |
| B-03 | PASS | Empty value → invalid_value |
| B-04 | PASS | `1 and (2`, `1 xor 2`, `(1 or 2))` → syntax; `1 and 4` → unknown_condition |
| B-05 | PASS | 25 saved, 26 → too_many |
| B-06 | PARTIAL | 138 ticket / 17 contact / 15 account fields (I-8) |
| B-07 | PASS | Dates: is, isn't, after/before (Current Time), between, not between, empty; numbers: =, ≠, <, >, between |
| B-08 | PASS / FAIL | 7 Nov runtime: during business hours (Default, 24/7) → matched; outside → no match. Holiday: list linked to business hours → on a holiday ✓ (#1233), not a holiday ✗ (#1234); list not linked (detached) → today treated as working day (B-5); 25 Dec list → correct both ways |
| B-01 | PASS | 7 Nov: target with no criteria assigns any ticket of the department |
| B-09 | PASS | 7 Nov: contact.last_name → A2, account.account_name → A3, ticket without contact untouched |

### C — Direct Assignment form
| Id | Result | Note |
|---|---|---|
| C-01..C-03, C-06 | PASS | Ticket coming to / Move Ticket to ("Select Department") / Assign Ticket to with Agents, Teams, Mark as Unassigned |
| C-04 | PASS | Agent not in destination dept → not_a_member |
| C-05 | PASS | Any Department without Move + agent → needs_department |
| C-07 | PASS | Agent + team sent → stored as agent only |
| C-08 | PASS | Team target with Team Assignment off → team_assignment_off |

### D — Direct Assignment runtime and execution order
| Id | Result | Note |
|---|---|---|
| D-01 | PASS | Owner A1 in < 1.4 s; history "Direct Assignment", rule name, trigger |
| D-02, D-03 | PASS | No match → untouched; preset owner A2 kept |
| D-05 | PASS | Team A, no owner; A2 + A3 one team notification, A1 none |
| D-06 | PASS | Any Department → moved to Dept B, owner A1 |
| D-07 | PASS (7 Nov) | Moved to Dept A unassigned → Dept A RR assigned in the same event (trigger "moved"); FAIL on 6 Nov (B-1) |
| D-04 | PASS | 7 Nov: A1 signed out and over threshold 1 → direct rule still assigns A1 |
| D-08 | PASS | Unassigned target stops the next direct rule |
| D-09 / D-10 | PASS | Update rule assigns unowned ticket; owned ticket kept; second update → no second assignment |
| D-11, D-12 | PASS | Order / inactive / master switch |
| D-13 | PASS | Agent removed from dept → rule shows ineligible (not_a_member), never assigns; team RR skips the agent |
| EO-2 | PASS | Workflow "Owner is A1" ran in the same create event |
| EO-3 | PASS | Workflow owner kept, RR did not override |
| EO-4 / EO-5 | PASS | Direct A1 → workflow A2; history A1 then A2; only A2 notified |
| D-14 | PASS / FAIL | API create PASS; New Ticket form with owner cleared PASS (RR → A2); form with default owner → B-4. Email / web form / import not run (no mail channel) |

### E — Round Robin
| Id | Result | Note |
|---|---|---|
| E-01, E-06, E-07 | PASS | Dept picker; both Zoho notes on the form; no backlog option, no Backlog tab, no capacity field |
| E-02, E-04 | PASS | No method → required; empty pool → required |
| E-05 | PASS | 7 Nov: rule "QA AS6 RR team" (pool QA AS6 Team A = A2 + A3) with "Exclude agents" = A2, saved and read back; 4 tickets → A3, A3, A3, A3, none to A2. Rule restored (no exclusion, update only) |
| E-08 | PASS (7 Nov) | RR on create assigns; all agents offline → backlog, owner not the creator |
| E-09 | PASS | A1, A2, A3, A1, A2, A3 |
| E-10 | PASS | Team pool alphabetical: Dev Team 2, Mahmoud Samy, … |
| E-11 | PASS | Pool change restarts at the first agent |
| E-12 | FAIL / PASS | Email off → not skipped (B-2); signed out → SKIPPED in history |
| E-13 | PASS | Load based picks fewest (counts not visible) |
| E-14 | PASS | Skill sk2 → A2; no skills → any dept agent; skills nobody holds → unassigned |
| E-15 | PASS | Second matching RR rule never used |
| E-16 | FAIL / PASS | Email off → still assigned (B-2); all signed out → backlog |
| E-17 | PASS | Master off → no RR, backlog not processed; on → assigned |
| E-19 | PASS | History: rule type, rule, method, trigger, skipped agents |
| E-03 | PASS | 7 Nov: the three method texts match Zoho word for word |
| E-18 (30-day rule) | Not run | Data cannot be aged |

### F — Round Robin Preferences + Team Assignment
| Id | Result | Note |
|---|---|---|
| F-01 | PASS | Offline allowed → signed-out agent gets the ticket |
| F-02 | PASS | 0 / 201 / 1.5 / backlog 0, 51 / dup agent / non-member refused (I-2) |
| F-03 | PASS | Threshold 1 → backlog |
| F-04 | PASS | UI: "Pick an agent.", "Enter a whole number from 1 to 200." |
| F-05 / F-06 | PASS | A1 = 200 overrides dept threshold in sequential and load rules; switch off keeps the row, not used |
| F-07 | PASS | Assign backlogs, 1 per agent per run (I-7) |
| F-08 | PASS | A3 closes a ticket → backlog ticket to A3 in 5 s (trigger backlog) |
| F-09 | PASS | Both off → stays unassigned |
| F-10 | PASS (7 Nov) | Backlog first: unassigned at create, assigned by the backlog run after ~50 s (trigger backlog) |
| F-11 | PASS | Team Assignment = one switch per dept, Zoho help text, no modes |
| F-12 | FAIL (API only) | B-3; UI pickers correct |
| F-13 | PASS | Team ticket waits in team queue |
| F-14 | PASS (I-12) | 7 Nov, rule "QA AS6 F14 threshold" (pool A1 only), A1 agent threshold, offline allowed. A1 open tickets per the workload API: Dept A 60, all departments 66. Threshold 66 → backlog, 67 → assigned, so the count is **all departments**, not only Dept A. With one A1 ticket On Hold, threshold = count incl. that ticket → backlog, so **On Hold counts**. After closing one A1 ticket, threshold = count before closing → assigned, so **Closed does not count**. Control threshold 200 → assigned. Preferences restored and checked |

### G — Notifications
| Id | Result | Note |
|---|---|---|
| G-01..G-03 | PASS | One "assigned" to owner; team members once; self pick-up none |
| G-06 | PASS | 7 Nov: direct rule on create + update → A1. Ticket #1272: create → A1 got 1 "Ticket #1272 assigned to you"; priority change and status change re-ran the rule with the same owner → no more notifications, no new history entry |
| G-04 | PASS | Per-department notification rules with in-app / email and template |
| G-05 | PASS | 7 Nov: Dept A "new ticket" alert on → A1, A2, A3 each got "New ticket #1212 …", creator none; switched back off |

### H — Skills
| Id | Result | Note |
|---|---|---|
| H-01 | PASS | Skills, preferences and order per department |
| H-02 | PASS | Name required, type required, 100 max, duplicate refused |
| H-03 | PASS | Inactive skill never added |
| H-04 | PASS | Agents on the skill form = Agent Skills tab |
| H-05 | PASS | Search, type / agent / status filters, Skill Types tab |
| H-06 | PASS | Ticket skills follow list order; reorder changes it |
| H-07 | PASS | Auto-add on create and on update |
| H-08 | PASS | Per-ticket recalculate removes stale skill |
| H-09 | PASS | 7 Nov: Assign by Skills → A2 (history "manual skills"); no skills → "The ticket has no active skills of its department."; nobody online → "No agent who holds these skills is online."; owned ticket → I-9 |
| H-10 | PASS | Usage lists RR rule, workflow, agents, open tickets |
| H-11 | PASS | 10 per ticket; 30 active per dept ("Active skills: 30 of 30") |
| H-12 | PASS (7 Nov) | Skill added on create → skill RR assigned A2 in the same event |
| H-13 | INFO | I-3 |
| H-14 | PASS | `<img onerror>` skill name shown as text, no script |

### I — Non-functional
| Id | Result | Note |
|---|---|---|
| I-01 | PASS | Arabic: page, tabs, lists, form RTL |
| I-02 | PASS | Every icon button named (Drag / Edit / Delete / Rule … active); keyboard order follows the list |
| I-03 | PASS | 20 tickets updated at once → 10 / 10, no ticket assigned twice; threshold held under concurrency |
| I-04 | PASS | Direct on create < 1.4 s; RR on update < 4 s |
| I-05 | PASS | XSS text escaped |

### J — Refactor
| Id | Result | Note |
|---|---|---|
| J-01 | PASS | Pre-existing rules show as Direct (Coming to Customer Support) and Round Robin with Load / Skill / Sequential |
| J-02 | PASS | All 36 depts: thresholds off, backlog switches off, Team Assignment on |
| J-03 | PASS (I-11) | Found 7 Nov (it is older than the 400 events searched on 6 Nov): actor "Assignment conversion report", 4 Nov 2026 17:50 (Cairo). 15 rule entries, one per converted rule, each with old id → new id and old kind → new type (9 team/agent → direct, 6 round_robin → round_robin), department name in the details; one rule also notes "precedence_changed" (a direct rule now runs before 3 RR rules). 1 department entry (Customer Support): old rule capacities 1 and 1, old Team Assignment mode "sequence" and capacity 10, all cleared. Shown in Setup → Audit Log (custom range 4 Nov). Backlog counts per department (MIG-5) not seen — I cannot tell whether any department had backlog tickets on 4 Nov. Raw entries: `out/conversion-report.json` |
| J-04 | PASS (part) | 7 Nov: 56 live tickets were created before the conversion (Customer Support 55, Marketing 1; all with an owner, none in a team). None has any owner, team or department change at or after 4 Nov 15:50 UTC, so owners were kept. None has a history entry that names an old rule (the only old owner change, #73 on 12 Oct, is logged as "system" with no rule name), so "old history still shows the old rule name" cannot be checked here. No ticket was waiting in a team. |

## E2E (7 Nov)
| Id | Result | Note |
|---|---|---|
| E2E-1 | PASS | 6 tickets in Dept B → direct rule moves them to Dept A unassigned → Dept A sequential RR: A2, A3, A1, A2, A3, A1; each agent got exactly its 2 "assigned" notifications |
| E2E-2 | PASS | Skill ticket → A2 on create; backlog ticket waits (all signed out); A2 closes the skill ticket → backlog ticket to A2 in 5 s |
| E2E-3 | PASS | A1 signed out → tickets to A2, A3; all out → backlog; A1 back → Assign backlogs gives it to A1 in ~10 s |

## Changes made on NDC-Staging (all in `ledger.md`)
- Created: 2 departments, 1 team, ~40 assignment rules, 4 workflows, 3 skill types, ~32 skills, ~200 QA tickets.
- Changed and restored: Direct / RR master switches (back ON), Dept A Team Assignment (back ON), A3 department membership (restored), direct rule order (restored), Dept A RR preferences (back to defaults).
- 7 Nov: every temporary change (RR rule triggers, Dept A preferences, Team Assignment, department alert) restored and checked; new QA AS6 tickets, 1 account, 1 contact and rules B09 / B08 added (ledger).
- Still to clean after your review: everything above prefixed **QA AS6** (kept for evidence).
- 7 Nov holiday test: holiday lists "QA AS6 HOL today" (linked to "QA AS6 BH") and "QA AS6 HOL xmas" (detached), business-hours profile "QA AS6 BH" (not default; the Default profile was not touched), rule "QA AS6 B08 holiday" (now inactive), tickets #1229–#1234 and #1252, #1254 (image re-run; "QA AS6 HOL today" is detached again).
- 7 Nov later: E-05 tickets "QA AS6 TEAMRR E05 1–4"; F-14 tickets "QA AS6 F14 …" (unassigned probes given to A2), rule "QA AS6 F14 threshold" (inactive); G-06 rule "QA AS6 G06 same owner" (inactive), ticket #1272. RR_TEAM and Dept A preferences restored and checked.
- **Zoho (7 Nov, by mistake):** while capturing the B-3 Zoho panel I clicked the "Team Assignment" switch on Zoho Setup → Teams (org techsolutionsegypt, department Haytham Mohamed). Zoho Audit Log: "Departments UPDATE" 07 Nov 01:44:36. Turned back ON on 7 Nov with your approval (PATCH departments 200; reads "Click to disallow ticket and activity assignment to teams" after reload).
