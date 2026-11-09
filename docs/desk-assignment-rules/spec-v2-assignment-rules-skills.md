# Spec v2 — Desk Assignment Rules (Direct + Round Robin) and Skills

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com`, tenant **NDC-Staging** (owner ndc-staging-owner) |
| Source | Requirements v2 = **NDC-2275** (`requirements-desk-assignment-rules.md`, §5–11), Skills = **NDC-2752** (`docs/desk-skills/plane-draft-desk-skills.md`), **NDC-1978** (details 1–6) |
| Replaces | `spec-desk-assignment-rules.md` (6 Oct, pre-v2 build) |
| Written | 6 Nov 2026 |
| Data | Every record created is prefixed **`QA AS6 `** and logged in the run ledger; settings changed are backed up first and restored at the end |
| Plane | Nothing is published until the user reviews the report (user, 6 Nov 2026) |
| Evidence | Screenshots only for failed cases, each next to live Zoho Desk (read-only) |

## Setup (S)

| Id | Setup |
|---|---|
| S-1 | Department **QA AS6 Dept A** with owner O + 3 agents A1, A2, A3 that can sign in (online / offline controlled by their presence heartbeat); department **QA AS6 Dept B** with O + A1 only |
| S-2 | Team **QA AS6 Team A** (A2, A3) in Dept A |
| S-3 | Agent profile without `desk:assignment:manage` (for GEN-12) |
| S-4 | Backup of: rules list, Round Robin Preferences, Team Assignment, notification settings, skill preferences, skill types, skills of Dept A/B |
| S-5 | Rules from other testers / real NDC rules are switched off only if they would match QA tickets — otherwise QA criteria use subject "QA AS6 &lt;case&gt;" so they never match real tickets |

## A — Page, lists, rule form (GEN-1..8, MSG-1, MSG-6)

| Id | Req | Case | Expected |
|---|---|---|---|
| A-01 | GEN-1 | Open Setup → Automation → Assignment Rules | Two sections Direct Assignment / Round Robin, each with its own list, New button, empty text "There are no … Rules created yet!" |
| A-02 | GEN-2 | New rule: defaults | Active ticked, name required, description optional |
| A-03 | GEN-2, MSG-1 | Name empty → Add Target / Save | "Enter a name for the Assignment Rule."; not saved |
| A-04 | GEN-2, MSG-1 | Name 121 chars, description 1001 chars (UI + API) | Field stops at 120 / 1000, counter; API rejects longer |
| A-05 | GEN-3 | Execute on: defaults and both unticked | Ticket Create ticked by default; both unticked → message, not saved (UI + API) |
| A-06 | GEN-4, MSG-1 | Add 5 targets, try a 6th (UI + API) | Add Target disabled + hint; API 6 targets → 4xx |
| A-07 | MSG-1 | Save with no target | "Add at least one target."; not saved |
| A-08 | GEN-6, MSG-6 | Create 2 rules → order; reorder (drag / move) → Save order; reload | New rules at bottom; order persists; "Order saved." |
| A-09 | GEN-7 | Deactivate / activate a rule | Targets kept; inactive rule never acts (see D-/E-) |
| A-10 | GEN-7 | Master switch per list off → on | Rules stay listed unchanged; no rule of that type acts while off |
| A-11 | GEN-8, MSG-6 | Edit rule → all values kept; Delete → confirmation text; tickets it assigned keep owner | as stated |
| A-12 | MSG-6 | Save messages | "Rule saved." |
| A-13 | NF-5, MSG-6 | Two sessions open same rule, first saves, second saves (API with stale version + UI) | Second gets "changed by someone else" (409), nothing lost |
| A-14 | GEN-11 | Create, edit, reorder, activate, deactivate, delete rules; save RR Preferences | One Audit Log entry each, with who and when |
| A-15 | GEN-12 | Profile without the permission: page + API GET/POST | No page (or blocked), API 403 |

## B — Criteria (GEN-5, GEN-5a–c, MSG-2)

| Id | Req | Case | Expected |
|---|---|---|---|
| B-01 | GEN-5 | Target with no criteria | Matches every ticket |
| B-02 | GEN-5 | Pattern `1 and (2 or 3)` — 4 tickets covering truth table | Matches only when 1 and (2 or 3) |
| B-03 | MSG-2 | Condition without field / without value | "Pick a field." / "Enter a value." |
| B-04 | MSG-2 | Pattern with unknown number / unbalanced brackets | Pattern message; not saved (UI + API) |
| B-05 | GEN-5, MSG-2 | 25 conditions then 26th (UI + API) | 26th blocked with hint / 4xx |
| B-06 | GEN-5a | Field list: ticket fields (38, incl. Owner, Team, Tags, Skills, Contact, Account, Product, Due Date, Created/Modified/Closed Time, Is Overdue, Is Escalated, Threads/Comments), 26 contact fields, 14 account fields, search box | Count vs Zoho |
| B-07 | GEN-5b | Date operators (is, isn't, after, before, between, not between, empty, not empty, Current Time) and number operators (=, ≠, <, >, between) — list + one runtime check each type | Present and evaluated correctly |
| B-08 | GEN-5c | Execution Time: during / outside business hours, holiday / not holiday | Present; runtime check with current BH |
| B-09 | GEN-5 | Criteria on a contact field and an account field at runtime | Ticket of that contact/account matches |

## C — Direct Assignment form (DA-1..4, MSG-3, TA-1 tabs)

| Id | Req | Case | Expected |
|---|---|---|---|
| C-01 | DA-1/2 | Target pick lists "Ticket coming to" (Any Department + depts, default = page dept) and "Move Ticket to" ("Select Department" + depts) | Present |
| C-02 | DA-2 | Coming to Dept A, no move → Assign to list | Dept A agents (+ Teams tab if TA on) + "Mark as Unassigned" |
| C-03 | DA-2 | Coming to Dept B, Move to Dept A | List shows Dept A agents/teams |
| C-04 | DA-2, MSG-3 | Pick A2 (Dept A only) then change Move to Dept B | A2 cleared / message "Pick an agent or team from …" ; API with agent outside destination → 400 |
| C-05 | DA-2 | Coming to Any Department, no move | Assign to list disabled; saves as Unassigned |
| C-06 | DA-3 | Agent picked then Mark as Unassigned | Agent cleared, saves Unassigned |
| C-07 | DA-3 | API: both agent and team | 400 |
| C-08 | DA-4, TA-1 | Team Assignment off for Dept A → Teams tab in target picker | Hidden; API team target → refused |

## D — Direct Assignment runtime (DA-4..8, EO-1..5, GEN-9, GEN-10, GEN-13)

| Id | Req | Case | Expected |
|---|---|---|---|
| D-01 | DA | Rule "subject contains QA AS6 D01 → A1", ticket created no owner | Owner A1 at once; history entry: Direct Assignment, rule name, old → new owner |
| D-02 | DA | Same rule, ticket not matching | Untouched by this rule |
| D-03 | DA-7 | Matching ticket created with owner A2 | Stays A2 |
| D-04 | DA-5 | A1 offline and over dept threshold | Still A1, no backlog |
| D-05 | DA-4, NOT-2 | Target Team A | Team A, no owner, team queue; team members notified once, others not |
| D-06 | DA-2 | Any Department + subject → Move to Dept B, assign A1 | Ticket in Dept B, owner A1, one history entry with dept change |
| D-07 | DA-2, EO | Move to Dept A + Unassigned, Dept A RR rule matches | Same event: moved, then RR assigns |
| D-08 | DA-2, GEN-6 | Unassigned target first, second direct rule also matches | Second rule does not act |
| D-09 | GEN-3, DA-7 | Rule Execute on Update "Status is Reopened → A1": reopen unowned ticket / reopen ticket owned by A2 | A1 / stays A2 |
| D-10 | DA-8 | Update rule whose own change would re-match | One assignment only, no loop |
| D-11 | GEN-6 | Two matching direct rules; reorder | Higher acts; after reorder the other |
| D-12 | GEN-7 | Inactive rule; master off | Nothing |
| D-13 | GEN-9 | Rule → A3; A3 removed from Dept A (or deactivated) | Rule shows "an unknown agent"; never assigns to A3; restore |
| D-14 | GEN-13 | Same rule via API, New Ticket form (owner cleared), web form / email if available, import with rules on | Each assigned by the rule |
| D-15 | EO-2 | Workflow "Owner is A1 → add tag" + direct rule → A1 | Workflow fires same event |
| D-16 | EO-4, EO-5, NOT-1 | Direct → A1, workflow then sets A2 | Final A2; history A1 then A2; only A2 notified |
| D-17 | EO-3 | Workflow sets owner A2, RR rule matches too | RR does nothing |

## E — Round Robin rule form + runtime (RR-1..9, RR-14, RR-19, EO-6)

| Id | Req | Case | Expected |
|---|---|---|---|
| E-01 | RR-1 | Department picker on Round Robin list; rule belongs to one dept | Present |
| E-02 | RR-2, MSG-4 | Target without method (UI + API) | "Choose a round robin type."; not saved |
| E-03 | RR-2 | Method help texts | Zoho's three texts |
| E-04 | RR-3, MSG-4 | No agents + no team | "Pick at least one agent, or a team." |
| E-05 | RR-3 | Team pool + Exclude agents | Excluded never get tickets |
| E-06 | RR-4 | Form notes "will not re-assign…" / "will not assign more … threshold" | Present |
| E-07 | RR-14, MIG-5 | No backlog option on rule, no Backlog tab, no capacity field on rule or Team Assignment | Absent |
| E-08 | RR on **create** | Ticket created unowned (API + New Ticket form) in Dept A, RR rule matches | Assigned by RR (r12 FAIL — recheck first) |
| E-09 | RR-5 | Sequential A1,A2,A3 × 6 tickets | A1,A2,A3,A1,A2,A3 |
| E-10 | RR-5 | Team pool sequential | Alphabetical order |
| E-11 | RR-6 | Add/remove agent in pool mid-sequence | Restarts at first agent |
| E-12 | RR-7, RR-10 | A2 offline | A1,A3,…; history marks A2 SKIPPED |
| E-13 | RR-8 | Load based with unequal loads | Fewest first, then share |
| E-14 | RR-9 | Skill based: ticket skills X → only agents with every skill; ticket without skills → any eligible dept agent | as stated |
| E-15 | EO-6 | Two RR rules match | First in list assigns, second nothing |
| E-16 | RR-14 | All offline / all at threshold | Unassigned backlog ticket |
| E-17 | GEN-7 | RR master off | No RR, backlog not processed |
| E-18 | RR-19 | Backlog ticket with last customer reply > 30 days | Not assigned (only if data can be aged — else Not run) |
| E-19 | GEN-10 | History entry for RR | Rule type, name, method, old/new owner, skipped agents |

## F — Round Robin Preferences + Team Assignment (RR-10..17, TA-1, MSG-5)

| Id | Req | Case | Expected |
|---|---|---|---|
| F-01 | RR-11 | "Assign tickets to offline agents" default off, help text; on → offline agents get tickets | as stated |
| F-02 | RR-12, MSG-5 | Department threshold 1–200: 0, 201, 1.5, blank (UI + API) | Message "Enter a whole number from 1 to 200."; valid saves "Preferences saved." |
| F-03 | RR-12 | Threshold 2, all agents at 2 → backlog | Backlog |
| F-04 | RR-13 | Agent level threshold: row = agent + number; second row does not offer chosen agent; row without agent / number; switch on with no rows | Messages MSG-5 |
| F-05 | RR-13 | A1 = 5, dept = 2 | A1 to 5, others 2; across every RR rule of dept |
| F-06 | RR-13 | Switch unticked again | A1 back to 2; row kept |
| F-07 | RR-15 | Assign backlogs on, limit N (1–50, 0/51 invalid), order Due Date / Created Time | Backlog assigned within 1 min when agent frees; N per agent per run; order respected |
| F-08 | RR-16 | Assign on closure on/off | On: closing agent gets next backlog at once; off: nothing |
| F-09 | RR-14 | Both off | Backlog stays unassigned |
| F-10 | RR-17 | Incoming mode immediate / backlog first | Phase 3 — present or not |
| F-11 | TA-1 | Team Assignment = one on/off switch per department, default on, no mode/capacity | as stated |
| F-12 | TA-1 | Off → no Teams tab in manual owner picker, bulk assign, rule targets; API team assign refused | as stated |
| F-13 | TA-1 | Team ticket with no RR rule | Stays in team queue, no owner |
| F-14 | RR-12 | Threshold counts open + on hold, not closed; only this dept? | Record behaviour (r12: counts across all depts) |

## G — Notifications (NOT-1..4, EO-5)

| Id | Req | Case | Expected |
|---|---|---|---|
| G-01 | NOT-1 | Rule assigns to A1 | A1 one notification |
| G-02 | NOT-1 | A1 picks up ticket himself | None |
| G-03 | NOT-2 | Team target | Team members once, others none |
| G-04 | NOT-3 | Per-department notification rules, email/mobile, template | Present (Phase 3) / works |
| G-05 | NOT-4 | Unassigned new ticket alert to department | Present (Phase 3) / works |
| G-06 | EO-5 | No owner change in event | No assignment notification |

## H — Skills (RR-18, NDC-2752 items 1–9)

| Id | Req | Case | Expected |
|---|---|---|---|
| H-01 | 2752-1 | Skills per department: list, preferences and order switch with department | Per department |
| H-02 | 2752-3 | Add Skill: name required, type required, inline Add Skill Type, description, criteria, agents | as Zoho |
| H-03 | 2752-2 | Inactive skill | Never added, never used for assignment |
| H-04 | 2752-4 | Agents on skill form ↔ Agent Skills tab | Same data both ways |
| H-05 | 2752-5 | Search + filters (Name, Type, Agents, Status), Skill Types tab | Work |
| H-06 | 2752-6 | Reorder skills; placement "order of list" | Ticket skills follow list order |
| H-07 | RR-18 | Auto-add by criteria on create and on update; preference off → not added | as stated |
| H-08 | RR-18, 2752-7 | Recalculate (workflow + single ticket) | Re-applies criteria, removes stale |
| H-09 | 2752-7 | Execute skill-based assignment on one ticket | Assigns to matching agent |
| H-10 | 2752-8 | Related rules / usage; delete dialog | Lists rules, agents, open tickets; Make inactive |
| H-11 | 2752-9 | Limits: 10 skills per ticket, 30 active per department, workflow action 1–25 | Enforced |
| H-12 | EO-1 | Skill added by criteria then skill-based RR in same event | Assigned to agent with skill |
| H-13 | — | Skill type rename / delete (skills keep, untyped) | as stated |
| H-14 | — | Skill name validation: blank, duplicate, 100+ chars, HTML/script | Refused / escaped |

## I — Non-functional

| Id | Req | Case | Expected |
|---|---|---|---|
| I-01 | NF-1 | Arabic: page, dialogs, messages, RTL | All translated, RTL |
| I-02 | NF-2 | Keyboard + names on switches / move buttons / pick lists; errors announced | Accessible |
| I-03 | NF-3 | 20 tickets at once, pool 2, threshold 5 | 5 + 5 + 10 backlog, no double assignment |
| I-04 | NF-4 | Time from create to owner (20 tickets) | ≤ 5 s for 95% |
| I-05 | — | XSS in rule name / description / skill name | Escaped |

## J — Refactor (MIG-1..8)

| Id | Req | Case | Expected |
|---|---|---|---|
| J-01 | MIG-1/2/3 | NDC's pre-existing rules (if any) after release | Converted to right type, same order, same active state |
| J-02 | MIG-4/5/8 | Dept thresholds, backlog switches start off; Team Assignment on | as stated |
| J-03 | MIG-7 | Audit Log conversion report | Present |
| J-04 | MIG-6 | Old assigned tickets unchanged | as stated |

## E2E

| Id | Journey |
|---|---|
| E2E-1 | Admin builds Direct rule (move to Dept A, Unassigned) + Dept A sequential RR + thresholds → 6 tickets → correct owners, history, notifications |
| E2E-2 | Skill with criteria + skill-based RR → ticket created → skill added → assigned to the skilled agent → agent closes ticket → next backlog ticket goes to that agent |
| E2E-3 | Agent goes offline mid-run → skipped → comes back → Assign backlogs picks up backlog |
