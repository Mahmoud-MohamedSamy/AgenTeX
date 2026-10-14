# Requirements — Desk Assignment Rules (Direct Assignment and Round Robin)

**Status:** Draft v2 for review — review decisions of 14 Oct 2026 applied, not published in Plane yet
**Written:** 13 Oct 2026, updated 14 Oct 2026. Based on the Zoho Desk intake of 6 Oct 2026 (live Zoho org and help docs) and the current TAVI Desk build
**App:** TAVI Desk
**Reference product:** Zoho Desk → Setup → Automation → Assignment Rules
**Guiding rule:** match Zoho Desk's behaviour everywhere. Where Zoho's docs are silent, this file says so and states the behaviour we chose.
**Related Plane items:** NDC-1978 (Assignment rules and skills), NDC-1976 (agent online / offline status), NDC-1975 and NDC-1910 (working teams), NDC-1211 (automation execution order bug — not re-read, Plane was offline), NDC-1980 (reassign on leave), NDC-1585 (CRM import assignment rule)
**Supporting files:** `desk-assignment-rules-missing-list.md` (15 gaps with evidence), `reference/zoho-docs-inventory.md`, `reference/zoho-live-notes.md`, `reference/tavi-build-map.md`

How to read this file:
- Each requirement has an id, one rule in plain words, the Zoho behaviour it follows, the **TAVI status today** (Built / Partly built / Missing / Not checked) and a **proposed phase**.
- "Zoho (seen)" means it was on screen in Zoho Desk. "Zoho (docs)" means it is from Zoho's help pages only.
- "Decided 14 Oct" marks an answer from the review. All review questions are answered; section 14 lists the answers.
- The API is designed by the developers and is not part of this file.

---

## 1. Summary

Assignment rules decide who gets a ticket automatically, so tickets do not wait in the unassigned pool.

There are **two different rule types**. They have different settings, different behaviour and a **different place in the automation execution order**:
- **Direct Assignment rule** — sends a matching **unassigned** ticket to **one named agent or one team**, and can move it to another department. It works across the whole organisation. It does not look at availability, thresholds or a backlog. It runs **early**, before workflows.
- **Round Robin rule** — shares matching unassigned tickets across a **pool of agents**, with exactly one method per target: sequential, load based or skill based. It respects agent availability and thresholds, and uses a backlog. It works inside one department. It runs **later**, after workflows and SLAs.

Today TAVI has **one list of rules per department**. Each rule picks "An agent", "A team" or "Round robin" as its action, has its own "Capacity per agent", and runs only when a ticket arrives with no owner and no team. **The existing feature is refactored to match Zoho**: two rule types, each with its own list, settings and execution position, and thresholds set only in the department's Round Robin Preferences. Rules already saved are converted (section 11).

## 2. Goals

- An admin can route tickets to a fixed agent or team by criteria (Direct Assignment).
- An admin can spread tickets fairly across agents, by turn, by load or by skill (Round Robin).
- Both rule types run in Zoho's execution order with the other automations, so results are predictable.
- No ticket is lost: when nobody can take a round-robin ticket, it stays unassigned as a backlog ticket and, when the department allows it, is assigned later.
- Every automatic assignment can be traced: the ticket history says which rule assigned it.
- Rules saved before the refactor keep working after it.

## 3. Non-goals (for this document)

- Manual assignment (owner field, Pick up, bulk Assign To, Move, Share). It already works and has its own bugs (NDC-1897, NDC-1898). It is only mentioned where rules depend on it.
- Workflow rules, SLA, Macros, Blueprint and Supervisor rules as features. They are only covered for their **position in the execution order** and their effect on assignment.
- AI owner prediction (Zia Field Predictions) — listed as a later phase idea only (missing list item 13).
- Chat / IM routing (Omnichannel has its own routing).
- Zoho Automation Studio (one Zoho page lists it after Notification rules; TAVI has no such feature).

## 4. Definitions

- **Unassigned ticket:** a ticket with no owner and no team.
- **Event:** one create or one update of a ticket. The whole order in EO-1 runs once per event.
- **Target:** one "if these criteria match → do this" entry inside a rule. A rule holds 1 to 5 targets, and the first target that matches is used.
- **Method:** how a round-robin target chooses an agent: Sequential, Load based or Skill based.
- **Pool:** the agents a round-robin target can choose from (chosen agents, or a team's members).
- **Threshold:** the most open tickets an agent may hold before round robin skips them. Set only in the department's Round Robin Preferences: one department wise number, and optional per-agent numbers that override it. It applies to all round-robin rules of the department. "Open" means any status that is not closed (open or on hold).
- **Backlog ticket:** a ticket that matched a round-robin rule but found no eligible agent (all offline or at their threshold). It stays **unassigned** in its department. It is assigned later only by "Assign backlogs" (RR-15) or "Assign tickets on closure" (RR-16). As in Zoho, there is no separate backlog option on rules and no backlog page.
- **Online:** the agent is available on the Email channel, according to the agent availability feature (NDC-1976).

---

## 5. Automation execution order

### Requirements

- **EO-1 — Zoho's order.** When a ticket is created or updated, Desk runs the automations in exactly Zoho's order:
  1. **Skills based assignment** — skills whose criteria match are added to the ticket (used by skill-based round robin, RR-18).
  2. **Direct Assignment rules**
  3. **Workflow rules**
  4. **SLA**
  5. **Round Robin rules** (sequential > load balancing > skill based — see EO-6)
  6. **Blueprint** (not built in TAVI today; the step is kept for when it is)
  7. **Notifications**

  Two automations are not part of one event. **Supervise** (supervisor rules) runs on a timer, once an hour. **Macros** run only when an agent applies them. Zoho lists them after Blueprint in the same order. When one of them changes a ticket, that change is a new event.
  - Zoho (docs), assignment article: "Direct assignment > Workflow > SLA > Round robin (sequential > load balancing > skill based) > Blueprint > Notifications."
  - Zoho (docs), Automation FAQ: "Skills based assignment rule > Direct assignment rule > Workflow rules > SLA > Round robin assignment rule > Blueprint > Supervise > Macros", and "Supervise is triggered periodically and Macros are manually triggered by the user". The list above combines both pages.
  - TAVI today: **Not checked.** There is only one rule type, and its position relative to workflows and SLA is not documented in the app. See NDC-1211 for an earlier order bug.
  - Decided 14 Oct: match Zoho exactly. Phase 1.
- **EO-2 — Each step sees the result of the steps before it.** For example, a workflow whose criteria say "Ticket Owner is empty" must see the owner set by a Direct Assignment rule.
  - Zoho (docs): assignment rules can change the owner before a workflow's "Record Owner" alert is evaluated.
  - TAVI today: Not checked. Phase 1.
- **EO-3 — Round robin never overrides an owner set earlier.** If a Direct Assignment rule, a workflow, a macro, an agent or the ticket's creator has already set an owner or a team, round robin leaves the ticket alone.
  - Zoho (seen): "The rule will not re-assign tickets that were assigned via other automations."
  - TAVI today: **Partly built.** TAVI rules run only on tickets "with no owner and no team"; the relation to workflows is not checked. Phase 1.
- **EO-4 — Later steps may change an owner set by a direct rule.** A workflow (step 3) or an SLA escalation may change the owner that a direct rule set in step 2. The last change wins, and every change is in the ticket history.
  - TAVI today: Not checked. Phase 1.
- **EO-5 — The assignment notification goes to the final owner of the event.**
  - **Why this matters.** In one event, more than one step can set the owner. Example: a direct rule sets owner A in step 2, then a workflow changes the owner to B in step 3. Without this rule, A would get "A ticket was assigned to you" for a ticket that is no longer theirs.
  - **The rule.** In Zoho, Notifications is the **last** step (step 7). So the assignee and team notifications (NOT-1, NOT-2) are worked out **once**, after all assignment steps, from the ticket as it is at the end of the event:
    - Only the final owner gets the assignee notification. In the example, B is notified and A is not.
    - If the event ends with a team and no owner, only that team's members get the team notification.
    - If the final owner is the agent who made the change themselves (for example, they picked the ticket up), nobody is notified (NOT-1).
    - If nobody changed the owner in the event, no assignment notification is sent.
    - The ticket history still shows every change, A and then B (GEN-10).
  - **Workflow email alerts are different.** A workflow alert such as "email the ticket owner" is an action of step 3. It goes to the owner at the moment the workflow runs (A in the example), because the workflow sees the result of step 2 (EO-2). This is Zoho's documented "Record Owner" behaviour, not a notification rule.
  - **Later changes are new events.** If an SLA escalation, a supervisor rule or the backlog later assigns the ticket, that is a new event and the new owner is notified then.
  - Zoho (docs): the order puts Notifications last. Zoho does not describe the two-owner case in words; this rule follows from the order.
  - TAVI today: **Not checked.**
  - Decided 14 Oct: the notification goes to the latest assigned agent. Phase 1.
- **EO-6 — One method per round-robin target, list order between rules.**
  - Every round-robin target must have **exactly one** method: Sequential, Load based or Skill based. A target without a method cannot be saved (RR-2).
  - Inside step 5, round-robin rules and their targets are checked **in list order**. The ticket goes to the first active target it matches, and that target's method chooses the agent. A ticket is never handled by two methods.
  - Zoho's text "Round robin (sequential > load balancing > skill based)" names the three methods inside the round-robin step. Because each target has one method and the first match wins, the method used is the method of the matching target.
  - Zoho (docs): "The system checks rules and targets in list order… A ticket enters the first rule entry it matches."
  - TAVI today: **Partly built.** The method is chosen per rule (Sequence / Load-based / Skill-based); the order between several matching rules is not checked.
  - Decided 14 Oct: one method must be selected. Phase 1.

### Acceptance criteria
- A ticket matching a Direct Assignment rule (→ Agent A) and a Round Robin rule (pool B, C) ends with owner A. The history shows only the direct rule.
- A ticket matching no direct rule, and a workflow that sets owner D, ends with owner D. Round robin does not touch it.
- A ticket matching no direct rule and no workflow goes through round robin.
- A workflow with criteria "Ticket Owner is A" fires on a ticket that a direct rule assigned to A in the same event.
- A direct rule sets A and a workflow then sets B in the same event → only B gets the assignee notification; the history shows A, then B.
- A skill is added by its criteria and a skill-based round-robin rule then uses it, in the same event (step 1 before step 5).
- Two round-robin rules both match: the first one in the list assigns the ticket, the second does nothing.

---

## 6. Common requirements (both rule types)

- **GEN-1 — Two separate lists.** Setup → Automation → Assignment Rules has two sections: **Direct Assignment** and **Round Robin**, each with its own list, "New" button and empty state ("There are no … Rules created yet!").
  - Zoho (seen): two sub-pages, "Direct Assignment" and "Round Robin".
  - TAVI today: **Missing.** There is one list; the type is chosen inside the rule. Phase 1.
- **GEN-2 — Rule details.** Rule name (required, up to 120 characters), Description (up to 1000), Active (ticked by default).
  - Zoho (seen): Rule Name (required), Description, Active ticked by default.
  - TAVI today: **Built** (same limits). Phase 1.
- **GEN-3 — When the rule runs.** "Execute Rule on": **Ticket Create** ("Execute the rule immediately after the ticket is created", ticked by default) and/or **Ticket Update** ("Execute the rule after the ticket undergoes a field update"). At least one must be ticked.
  - Zoho (seen) on both rule types.
  - TAVI today: **Missing.** Rules run only when a ticket arrives (NDC-1978 detail 1, missing list item 1). Phase 2.
- **GEN-4 — Up to 5 targets per rule.** A rule holds **1 to 5 targets**, checked top to bottom; the first matching target is used. "Add Target" needs a rule name first ("Enter a name for the Assignment Rule.").
  - Zoho (docs): "up to five targets for each direct assignment rule" and "up to five targets per round-robin rule".
  - TAVI today: **Missing.** One action per rule; you need several rules for the same result.
  - Decided 14 Oct: match Zoho. Phase 2.
- **GEN-5 — Criteria.** Each target has optional criteria: up to 25 conditions, joined with AND / OR and brackets by number (e.g. `1 and (2 or 3)`). No criteria means every ticket matches.
  - TAVI today: **Built** (criteria pattern), except the fields and operators in GEN-5a–5c.
  - **GEN-5a — Fields.** The same fields as Zoho: 38 ticket fields (including Ticket Owner, Team, Tags, Skills, Contact Name, Account Name, Product Name, Due Date, Created / Modified / Closed Time, Is Overdue, Is Escalated, Number of Threads / Comments), 26 **contact fields** and 14 **account fields**, with a search box in the field list. TAVI offers 23 ticket fields only (missing list item 5). Phase 2.
  - **GEN-5b — Operators.** Dates: is, isn't, is after, is before, between, not between, is empty, is not empty, with the value "Current Time". Numbers: =, ≠, <, >, between. TAVI numbers have only is / isn't / empty, and there are no dates (NDC-1978 detail 4). Phase 2.
  - **GEN-5c — Execution Time.** During / outside business hours of a set, on a holiday / not a holiday of a list (NDC-1978 detail 3). Phase 2.
- **GEN-6 — Order.** Rules run in list order; the first active rule with a matching target wins and the rest are skipped. New rules go to the bottom (Zoho's default order is the order of creation). Admins can reorder and save the order.
  - Zoho (docs): Reorder icon, drag and drop, then **Save order**.
  - TAVI today: **Built** (Move up / down, "Order saved."). Phase 1.
- **GEN-7 — Activate / deactivate.** Each rule can be deactivated and activated again without losing its targets. Each list also has a **master switch** ("Direct Assignment Rules", "Round Robin Rules") that turns all rules of that type on or off without losing them.
  - Zoho (seen): the two master toggles at the top of each list.
  - TAVI today: **Partly built.** The per-rule switch is built; the master switch is missing (missing list item 6). Phase 2.
- **GEN-8 — Edit and delete.** Editing keeps all values. Deleting asks for confirmation, and tickets already assigned keep their owner.
  - TAVI today: **Built** ("Tickets it already assigned keep their owner."). Phase 1.
- **GEN-9 — Only valid assignees.** A rule can name only active agents and teams that can own tickets in the target department. If an agent or team is later removed, the rule shows it clearly (e.g. "an unknown agent") and never assigns to them.
  - TAVI today: **Partly built** (labels exist; behaviour not checked). Phase 1.
- **GEN-10 — History.** Every automatic assignment writes a ticket history entry with the rule type, the rule name, the old owner and the new owner. When a direct rule also moves the ticket, the department change is in the same entry.
  - Zoho (docs): history shows the actor type (Direct Assignment / Round Robin Assignment) and the rule name.
  - TAVI today: **Not checked** (no tickets on the tenant). Phase 1.
- **GEN-11 — Audit log.** Creating, editing, reordering, activating, deactivating and deleting rules, and changing Round Robin Preferences, appear in the Audit Log with who and when.
  - Zoho (docs): the audit log lists Direct Assignment Rule and Round Robin Rule entities.
  - TAVI today: **Partly built** (the audit entity `assignment_rule` exists; not checked). Phase 1.
- **GEN-12 — Permission.** Only profiles with "Manage assignment rules" (`desk:assignment:manage`) can see or change the page and its API.
  - TAVI today: **Built** (403 for an agent without it). Phase 1.
- **GEN-13 — All ticket sources.** Rules run for tickets from every source: email, web form, API, the New Ticket form when no owner is set, and import (when the import asks for rules).
  - TAVI today: **Not checked** (see NDC-1585 for the CRM import case). Phase 1.

### Screen messages

Each message shows next to the field it is about, and the rule or dialog is not saved until it is fixed. The source says where the wording comes from: **Zoho** (seen on Zoho's screen), **TAVI** (already in TAVI's texts) or **new** (written for this file; the team may reword it).

- **MSG-1 — Rule form.**
  - Rule name empty, on "Add Target" or on Save: "Enter a name for the Assignment Rule." (Zoho)
  - Rule name longer than 120 characters, or description longer than 1000: the field stops accepting text at the limit, and a counter shows "120 / 120". (new)
  - Neither "Ticket Create" nor "Ticket Update" ticked: "Choose when the rule runs: Ticket Create, Ticket Update or both." (new)
  - No target added: "Add at least one target." (new)
  - Five targets added: "Add Target" is disabled, with the hint "A rule can have up to 5 targets." (new)
  - TAVI today: **Partly built** (TAVI has "Enter a rule name."; the rest is new). Phase 1.
- **MSG-2 — Criteria.**
  - Condition without a field: "Pick a field." Condition without a value (for operators that need one): "Enter a value." (TAVI)
  - 25 conditions added: "Add condition" is disabled, with the hint "A target can have up to 25 conditions." (new)
  - Criteria pattern that does not match the conditions (unknown number, unbalanced brackets): "Check the criteria pattern. Use the condition numbers with AND, OR and brackets, for example 1 and (2 or 3)." (new)
  - TAVI today: **Partly built** ("Pick a field." and "Enter a value." exist). Phase 1 for the messages, Phase 2 for the 25-condition limit.
- **MSG-3 — Direct Assignment target.**
  - The chosen agent or team is not in the department the ticket ends up in (DA-2): "Pick an agent or team from {department}." (new)
  - TAVI today: **Missing.** Phase 2 for the Move parts, Phase 1 for the rest.
- **MSG-4 — Round Robin target.**
  - No round robin type chosen: "Choose a round robin type." (new)
  - No agents and no team: "Pick at least one agent, or a team." (TAVI)
  - TAVI today: **Partly built** ("Pick at least one agent, or a team." exists). Phase 1.
- **MSG-5 — Round Robin Preferences.**
  - Agent level threshold row without an agent: "Pick an agent." (TAVI)
  - Agent level threshold row with no number, or a number outside 1–200: "Enter a whole number from 1 to 200." (new, same pattern as TAVI's capacity message)
  - Agent level threshold switched on with no rows: "Add at least one agent, or turn off Agent level threshold." (new)
  - Backlog limit outside 1–50: "Enter a whole number from 1 to 50." (new)
  - TAVI today: **Missing.** Phase 1 for the department threshold, Phase 2 for agent rows and the backlog limit.
- **MSG-6 — Saving and lists.**
  - Rule saved: "Rule saved." Order saved: "Order saved." Preferences saved: "Preferences saved." (TAVI for the first two, new for the third)
  - Empty list: "There are no Direct Assignment Rules created yet!" and "There are no Round Robin Rules created yet!" (Zoho)
  - Delete confirmation: "Delete this rule? Tickets it already assigned keep their owner." (TAVI)
  - A removed agent or team inside a rule: "an unknown agent" / "an unknown team" (TAVI)
  - Someone else changed the rule or the order since it was opened (NF-5): "This rule was changed by someone else. Reload to see the latest version." (new)
  - TAVI today: **Partly built** (the TAVI messages exist; the others are new). Phase 1.

### Acceptance criteria
- The Assignment Rules page shows two sections, Direct Assignment and Round Robin, each with its own list, New button and empty message (GEN-1).
- A new rule has Active ticked and "Ticket Create" ticked by default; it cannot be saved with both "Execute Rule on" boxes unticked (GEN-2, GEN-3).
- A rule with 5 targets cannot get a sixth; with two matching targets, the first one is used (GEN-4).
- A target with no criteria matches every ticket; a target with criteria `1 and (2 or 3)` matches only when condition 1 and one of 2 or 3 are true (GEN-5).
- Two active rules both match: the higher one in the list acts, the lower one does nothing. After moving the lower rule up and saving the order, the other one acts (GEN-6).
- A deactivated rule never acts; activating it again keeps its targets. With the master switch off, no rule of that type acts and the rules stay listed (GEN-7).
- Deleting a rule asks first; tickets it already assigned keep their owner (GEN-8).
- An agent who is deactivated after being named in a rule shows as "an unknown agent", and the rule never assigns to them (GEN-9).
- Every automatic assignment adds one ticket history entry with the rule type, rule name, old owner and new owner (GEN-10).
- Creating, editing, reordering, switching and deleting rules, and saving Round Robin Preferences, each add an Audit Log entry with who and when (GEN-11).
- A profile without "Manage assignment rules" gets no page and a 403 from the API (GEN-12).
- A ticket created by email, web form, API, the New Ticket form (no owner) and import (rules on) is assigned by the same matching rule in each case (GEN-13).
- Each message in MSG-1 to MSG-6 appears in the case described, in English and Arabic.

---

## 7. Direct Assignment rules

Purpose: always send a matching unassigned ticket to the same agent or team. Optionally, move it to the right department first.

- **DA-1 — Scope: the whole organisation.** A direct rule is not tied to one department. Each target says which tickets it looks at: "**Ticket coming to**" = Any Department, or one department.
  - Zoho (seen): "Ticket coming to" with Any Department or a department. Zoho (docs): "organization-specific".
  - TAVI today: **Missing.** Rules belong to one department. Phase 2.
- **DA-2 — Ticket coming to, Move Ticket to, and the agents offered.** Each target has two department pick lists:
  - **Ticket coming to** — which tickets the target looks at: **Any Department** or one department. It defaults to the department open on the page.
  - **Move Ticket to** — optional. "Select Department" means no move. When a department is chosen, a matching ticket is moved there before it is assigned.
  - **Assign Ticket to** offers the agents and teams of the department the ticket **ends up in**:
    - With a Move Ticket to department → that department's agents and teams. Example: Ticket coming to = Sales, Move Ticket to = Support → the list shows Support's agents.
    - Without a move, and Ticket coming to is one department → the agents and teams of that department.
    - Without a move, and Ticket coming to is **Any Department** → the Assign Ticket to list is **disabled** and the ticket is left **Unassigned**. The ticket stays in the department it came to, and that department's Round Robin rules can still assign it in step 5.
    - The Teams tab shows only when that department's Team Assignment is on (TA-1).
    - Whenever the list is enabled, it also has **"Mark as Unassigned"**. So a target can leave the ticket unassigned even when Ticket coming to and Move Ticket to both have a department (for example: move to Support and leave it for Support's round robin). "Unassigned" is also what the list shows before anyone is picked.
  - Changing either pick list clears an agent or team who is not in the new department (MSG-3).
  - When the target moves the ticket and leaves it **Unassigned**, the ticket arrives in the new department with no owner. The new department's Round Robin rules can then assign it in step 5 of the same event (EO-1, EO-2).
  - An Unassigned target is valid: it stops the later Direct Assignment rules from acting on the ticket (first match wins, GEN-6), and leaves the ticket to Round Robin.
  - Zoho (seen): "Ticket coming to" (Any Department or a department), "Move Ticket to" ("Select Department" or a department), "Assign Ticket to" with Agents and Teams tabs. Zoho (docs): the agent "must belong to" the destination department.
  - TAVI today: **Missing** (NDC-1978 detail 2, missing list item 2). TAVI's single-ticket Move exists and could be reused.
  - Decided 14 Oct. Phase 2.
- **DA-3 — Assign Ticket to.** One agent, **or** one team, **or** "Unassigned" (chosen with "Mark as Unassigned", with or without a move), never both an agent and a team. The picker has Agents and Teams tabs and "Mark as Unassigned".
  - Zoho (seen): Agents / Teams tabs, "Mark as Unassigned".
  - TAVI today: **Built** for agent or team (as an action of the single rule type). Phase 1.
- **DA-4 — Team target.** When the target is a team, the ticket gets the team and no owner, and waits in the team queue (TA-1). Teams can be chosen only when Team Assignment is on for the department.
  - Zoho (docs): team targets need Team Assignment to be on.
  - TAVI today: **Built.** Phase 1.
- **DA-5 — No availability, threshold or backlog.** A direct rule always assigns to the named agent or team. It does not check whether the agent is online, does not count their open tickets, and has no backlog. The Round Robin Preferences (offline agents, thresholds, backlog) do not apply to direct rules.
  - Zoho (seen): the Direct Assignment form has no availability, threshold or backlog setting. These settings exist only in Round Robin Preferences, on the Round Robin page.
  - Zoho (docs), "Direct Assignment vs Round Robin" comparison: Direct Assignment "Routes an unassigned ticket to a specific agent or specific team every time the rule conditions match". Its table says "Assignment frequency: Always assigned to the same agent or team", "Supports capacity limits: No" and "Supports backlog management: No".
  - Zoho (docs), one unclear row: the same table says "Includes offline agents in assignment: No" for Direct Assignment. This most likely means it has no "assign to offline agents" option, because it has no availability logic at all. No Zoho page says what happens when the named agent is offline.
  - TAVI today: **Not checked.**
  - Decided 14 Oct: direct rules ignore availability. Phase 1.
- **DA-6 — Runs before workflows.** Direct Assignment runs at step 2 of EO-1, after skills and before workflows.
  - TAVI today: **Not checked.** Phase 1.
- **DA-7 — Unassigned tickets only.** A direct rule acts only on tickets that have **no owner**, on Ticket Create and on Ticket Update alike. It never reassigns a ticket that already has an owner.
  - Zoho (docs): "Routes an **unassigned** ticket to a specific agent or specific team".
  - Example: the rule "Execute on Ticket Update, Status is Reopened → Agent B" assigns a reopened ticket to B only if the ticket has no owner at that moment.
  - TAVI today: **Partly built.** Today's rules act only on tickets with no owner and no team, and only on create.
  - Decided 14 Oct. Phase 1 for create, Phase 2 for update (needs GEN-3).
- **DA-8 — Loops are not possible.** A rule that runs on update must not fire again because of its own change (owner or department). One event = at most one direct-rule assignment.
  - TAVI today: **Missing** (needs GEN-3 first). Phase 2.

### Acceptance criteria
- Rule "Priority is Urgent → Agent A", ticket created as Urgent with no owner → owner A, history names the rule.
- Same rule, ticket created as Low → no change by this rule; round robin may still act later (EO-1).
- Same rule, ticket created as Urgent with owner C already set → the owner stays C.
- Same rule, Agent A is offline and already holds more open tickets than the department threshold → the owner is still A, and the ticket does not go to the backlog.
- Target "Ticket coming to: Any Department, Subject contains invoice → Move to Billing, assign Team Billing" → ticket is in Billing, team Billing, no owner, waiting in the Billing team queue.
- Target "Ticket coming to: Sales, Move Ticket to: Support" → the Assign Ticket to list shows only Support's agents and teams. Changing Move Ticket to Billing clears a Support agent already picked.
- Target "Ticket coming to: Any Department, Move Ticket to: Select Department" → the Assign Ticket to list is disabled; a matching ticket stays unassigned in its own department, and no later direct rule acts on it.
- Target "Ticket coming to: Sales, Move Ticket to: Support", agent picked, then "Mark as Unassigned" → the agent is cleared and the target saves as Unassigned.
- Target "Move Ticket to: Support, Unassigned" and a Support round-robin rule that matches → in the same event the ticket moves to Support and the round-robin rule assigns it.
- Rule with Execute on Ticket Update, "Status is Reopened → Agent B": a reopened ticket with no owner gets owner B; a reopened ticket that still has owner C keeps C.
- Deactivating the Direct Assignment master switch → no direct rule runs; the rules are still listed, unchanged.

---

## 8. Round Robin rules

Purpose: share tickets fairly across a pool of agents, respecting availability and thresholds.

### 8.1 Rule and targets
- **RR-1 — Scope: one department.** Each round-robin rule belongs to one department, picked at the top of the Round Robin list.
  - Zoho (seen): department picker on the Round Robin list.
  - TAVI today: **Built.** Phase 1.
- **RR-2 — One method per target (required).** **Sequential**, **Load based** or **Skill based**, with Zoho's help text under each. See EO-6.
  - Zoho (seen): "Load Based Assignment — Assign Tickets to agents based on their load until everyone receives the set threshold." · "Sequential Assignment — Assign Tickets equally among agents, in a sequential manner, in round-robin fashion." · "Skill Based Assignment — Assign Tickets to agents according to their designated skills."
  - TAVI today: **Built** (Sequence / Load-based / Skill-based, one per rule). Phase 1.
- **RR-3 — Pool.** Chosen **agents**, or a **team** (all its members), with "**Exclude agents from this assignment**" to leave chosen team members out. There is no limit on the number of agents.
  - TAVI today: **Partly built.** Agents or a team: built. Exclude agents: missing (NDC-1978 detail 5, missing list item 7). Phase 2.
- **RR-4 — Unassigned tickets only.** See EO-3. Round robin runs at step 5 of EO-1. The form shows Zoho's two notes: "The rule will not re-assign tickets that were assigned via other automations." and "The rule will not assign more tickets than the number specified under threshold."
  - TAVI today: **Partly built.** Phase 1.

### 8.2 How each method chooses
- **RR-5 — Sequential.** Agents take turns in the order they were added to the target. When the pool is a team (or all agents), the order is alphabetical; same names are ordered by who was added first.
  - Zoho (docs).
  - TAVI today: **Built** ("Agents take turns in a fixed order"); the exact order is not checked. Phase 1.
- **RR-6 — Sequence reset.** Adding or removing an agent in the pool restarts the turn from the first agent. This does not apply to team pools.
  - Zoho (docs). TAVI today: Not checked. Phase 1.
- **RR-7 — Skipped agents.** An agent who is offline (RR-10) or at their threshold (RR-12, RR-13) when it is their turn is **skipped**: they are marked "SKIPPED" and moved to the end of the turn order. The ticket goes to the next eligible agent.
  - The ticket history entry of that assignment lists the skipped agents with "SKIPPED".
  - Zoho (docs): agents who go offline or reach their threshold "are marked SKIPPED and moved to the end of the queue". Zoho does not say on which screen the label shows; the ticket history is where TAVI shows it.
  - TAVI today: Not checked.
  - Decided 14 Oct: match Zoho. Phase 1.
- **RR-8 — Load based.** The agent with the fewest open tickets gets the next one, until loads are equal; then they take turns.
  - Example (Zoho FAQ): A has 5, B 9, C 3. C gets tickets until 5, then A and C share until 9, and B gets none until then.
  - TAVI today: **Built** ("fewest active tickets"). Phase 1.
- **RR-9 — Skill based.** Only agents who hold **every** skill on the ticket are eligible, and they take turns. If the ticket has **no skills**, every agent of the department the ticket is in is eligible. Online status (RR-10) and thresholds (RR-12) still apply.
  - Zoho (docs): silent on tickets with no skills.
  - TAVI today: **Built** for "every skill"; the empty-skills case is not checked.
  - Decided 14 Oct. Phase 1.

### 8.3 Round Robin Preferences (per department)

One **Round Robin Preferences** dialog per department, opened from the Round Robin list (⋯ → Preferences), with Save and Cancel. It holds every availability, threshold and backlog setting for that department.
- The settings apply to **all round-robin rules** of the department together. They are never set for one rule.
- **Thresholds are set only here.** No other place in the Assignment Rules feature has an agent threshold or capacity: not a round-robin rule, not a Direct Assignment rule, not Team Assignment (TA-1).

- **RR-10 — Online agents only, by default.** Round robin assigns only to agents who are online on the Email channel.
  - Zoho (seen): "Round robin, by default, assigns tickets only to the agents who are online in the mail channel."
  - TAVI today: **Not checked.** There is no option, and the editor does not mention availability (missing list item 8). Needs NDC-1976. Phase 2.
- **RR-11 — Assign tickets to offline agents.** A switch, off by default. Help text: "Round robin, by default, assigns tickets only to the agents who are online in the mail channel. When this option is enabled, it will assign tickets to offline agents as well."
  - TAVI today: **Missing.** Phase 2.
- **RR-12 — Department wise threshold.** A switch plus a drop-down number. Help text: "Maximum number of open tickets an agent in the department can handle at any given time." It applies to every round-robin rule of the department. TAVI's per-rule "Capacity per agent" is removed, and its values are not carried over (MIG-4).
  - Zoho (seen): "Department wise threshold", switched on with 40 in the test org (screenshot of 14 Oct 2026). Zoho (docs) gives two different ranges, and the drop-down's values are not documented:
    - Help page [FAQs: Assignment Rules](https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-assignment-rules), question 23 "What are the different types of round-robin assignment rules?": "The threshold can be set from 1 to 200."
    - [Zoho Desk API](https://desk.zoho.com/DeskAPIDocument#RoutingPreference_UpdateRoutingPreferences), Routing Preferences (`GET` / `PATCH /api/v1/routingPreferences`): `thresholdLimit` "Threshold limit per agent for round-robin assignment. Range: 1-500." The API example uses 40.
    - The two pages disagree. TAVI uses the help page's range.
  - TAVI today: **Partly built.** "Capacity per agent" (1–1000) is set on each rule instead (missing list item 9).
  - **Range: 1 to 200**, whole numbers only.
  - Decided 14 Oct: manage thresholds as in Zoho's Round Robin Preferences, range 1–200. Phase 1 (needed by the refactor).
- **RR-13 — Agent level threshold.** A switch in Round Robin Preferences, off by default. Help text: "Maximum number of open tickets a specific agent can handle at any given time. The agent level threshold will override the department wise threshold."
  - When the switch is **ticked**, a row appears with an **agent pick list** and, next to it, a **whole-number field** for that agent's threshold.
  - **One agent per row.** Each agent's threshold is set on its own row. More rows can be added for more agents, and a row can be removed.
  - The pick list offers the department's agents. An agent who already has a row is not offered again.
  - The number uses the same range as the department wise threshold: 1 to 200 (RR-12).
  - The agent's own number **replaces** the department wise threshold for that agent in every round-robin rule of the department. Agents without a row use the department wise threshold.
  - When the switch is **unticked**, the rows are hidden and not used, and every agent uses the department wise threshold.
  - Up to 1500 agents can have their own threshold (Zoho docs).
  - Zoho (seen): the "Agent level threshold" switch in Round Robin Preferences (screenshot of 14 Oct 2026). The behaviour of the rows was described in the review of 14 Oct.
  - TAVI today: **Missing.** Phase 2.
- **RR-14 — Backlog tickets, as in Zoho.** When no agent in the pool is eligible (all offline or at their threshold), the ticket stays unassigned and becomes a backlog ticket. Nothing on the rule turns this on or off.
  - A backlog ticket is assigned later only when "Assign backlogs" (RR-15) or "Assign tickets on closure" (RR-16) is on. With both off, it stays unassigned until an agent takes it.
  - Zoho (docs): "every agent has tickets within the threshold limit at any point… remaining tickets are added to the backlog".
  - TAVI today: **Partly built.** TAVI has a per-rule "Keep excess tickets in backlog" option (on by default), and a Backlog tab with reason, attempts and "Process now". Neither is in Zoho: both are removed (MIG-5).
  - Decided 14 Oct. Phase 1.
- **RR-15 — Assign backlogs.** A switch. Help text: "Will assign tickets that were created when agents were offline or when their thresholds were full." When it is on, backlog tickets are assigned as agents come online or drop below their threshold, up to **N per agent per run (1–50)**, in **Due Date** or **Created Time** order.
  - TAVI today: **Partly built.** Assigned first come, first served every minute and when an agent frees up; there is no switch, limit or order setting (missing list item 10). Phase 2.
- **RR-16 — Assign tickets on closure.** A switch. Help text: "When the agent closes a ticket, the next available unassigned ticket will be automatically assigned to them." Only if the agent is online and under their threshold.
  - TAVI today: **Partly built** ("whenever an agent frees up", always on). Phase 2.
- **RR-17 — Incoming tickets: immediate or backlog first.** Option "assign new tickets immediately" (default) or "push new tickets into the backlog first".
  - Zoho (docs): `freshTicketAssignMode: IMMEDIATE | MOVE_TO_BACKLOG`.
  - TAVI today: **Missing.** Phase 3.
- **RR-18 — Skills setup.** Skills have a **type**. Each skill has **criteria** that add it to matching tickets automatically (step 1 of EO-1) and a list of agents. A **recalculate** action re-applies the criteria.
  - Zoho (seen): Skills / Skill Types, Add Skill with type, criteria and agents.
  - TAVI today: **Partly built.** Skills are a picklist on tickets, ticked per agent; tickets get skills by hand (NDC-1978 detail 6, missing list item 11). Phase 3.
- **RR-19 — 30-day rule.** Unassigned and backlog tickets are assigned by round robin only if the customer replied to the ticket within the last 30 days. Older tickets stay where they are.
  - Zoho (docs): "Unassigned or Backlog tickets will only be assigned in a round-robin manner if the ticket has received a customer response within 30 days."
  - TAVI today: Not checked.
  - Decided 14 Oct: adopt. Phase 3.

### 8.4 Team Assignment (per department)
- **TA-1 — Team Assignment, exactly as in Zoho.** Team Assignment is one **on / off switch per department**, on by default. It is set with the department's teams (Zoho: Setup → User Management → Teams, switch in the upper right).
  - **On:** tickets can be assigned to a team, by an agent or by any automation. Every assignment picker, rule targets included, shows a **Teams** tab.
  - **Off:** the Teams tab is hidden in every assignment picker, rule targets included, and only agents can be chosen.
  - A ticket assigned to a team gets the team and no owner. It waits in the **team queue** until a team member picks it up, or until a round-robin rule whose pool is that team assigns it.
  - There is **no** distribution mode, capacity or backlog for teams. Spreading team tickets across members is done with a round-robin rule (RR-3), and thresholds come only from Round Robin Preferences.
  - Zoho (docs): "When it is off, the Teams tab is hidden during assignment, auto-assignment included". API: department `isAssignToTeamEnabled`.
  - TAVI today: **Partly built.** TAVI's Team Assignment tab on the Assignment Rules page has modes Off / Round robin / Load based, with its own "Capacity per agent" and backlog. The modes, the capacity and the team backlog are removed, and the tab is replaced by the on / off switch (MIG-8). Testing is blocked by NDC-1910 (teams cannot be saved).
  - Decided 14 Oct: match Zoho's exact behaviour. Phase 1.

### Acceptance criteria
- Pool A, B, C, Sequential, 6 unassigned tickets → A, B, C, A, B, C.
- Same, B offline → A, C, A, C…; each of these tickets' history shows B as "SKIPPED", and B goes to the end of the turn order.
- Load based with A = 5, B = 9, C = 3 open tickets → the next 2 go to C, then A and C share.
- Department threshold 2 and every agent holds 2 open tickets → a new ticket stays unassigned as a backlog ticket.
  - With "Assign backlogs" on → it is assigned when an agent drops below 2.
  - With "Assign tickets on closure" on → it is assigned at once to the agent who closes a ticket.
  - With both off → it stays unassigned.
- The round-robin rule form has no backlog option, and the Assignment Rules page has no Backlog tab.
- Department threshold 2, agent-level threshold 5 for A → A gets tickets until 5; the others stop at 2. This holds in every round-robin rule of the department.
- Agent-level threshold switch ticked → one row with an agent pick list and a number field; adding a second row does not offer the agent already chosen.
- Agent-level threshold switch unticked again → A stops at 2 like everyone else; A's row is kept but not used.
- The round-robin rule form and the Team Assignment setting have no capacity or threshold field.
- Team Assignment off for a department → no picker in that department (manual or rule target) shows a Teams tab.
- A ticket assigned to a team with no round-robin rule for that team stays in the team queue with no owner.
- Skill-based target, ticket with no skills → any online agent of the department under their threshold can get it.
- Ticket already assigned by a workflow → round robin does not change it.
- A round-robin target cannot be saved without a method.
- Round Robin master switch off → no round-robin rule runs; the backlog is not processed.

---

## 9. Notifications

- **NOT-1 — Assignee notification.** The new owner is told when a rule assigns a ticket to them, but not when they assign it to themselves. Sent once per event, to the final owner (EO-5).
  - TAVI today: **Built** (organisation-wide switch). Phase 1.
- **NOT-2 — Team notification.** All team members are told when a ticket lands in their team queue with no owner. Sent once per event (EO-5).
  - TAVI today: **Built.** Phase 1.
- **NOT-3 — Per department and per channel.** Notification rules are set per department, with email and mobile switches, and an editable email template.
  - TAVI today: **Missing** (missing list item 14). Phase 3.
- **NOT-4 — Department alert for unassigned tickets.** "Creating a new ticket": tell the department's agents when a ticket is created and no rule assigned it.
  - TAVI today: **Missing.** Phase 3.

### Acceptance criteria
- A rule assigns a ticket to A → A gets one "assigned to you" notification. An agent who picks a ticket up themselves gets none (NOT-1).
- A rule assigns a ticket to Team T with no owner → every member of T gets one notification; nobody outside T does (NOT-2).
- A direct rule sets A and a workflow sets B in the same event → only B is notified (EO-5).
- Notification rules switched off for a department → no assignment emails for that department; other departments still get them (NOT-3).
- A ticket created with no rule matching → the department's agents get the "new ticket" alert; a ticket assigned by a rule does not trigger it (NOT-4).

## 10. Non-functional

- **NF-1 — Arabic and RTL.** Every label and message is translated, and the page works right to left. TAVI today: **Built** (all 179 strings present in `ar`).
- **NF-2 — Accessibility.** Keyboard reachable; switches and move buttons have names; errors are announced. TAVI today: **Not checked.**
- **NF-3 — Concurrency.** Two tickets arriving at the same moment never go to the same agent beyond their threshold, and one ticket is never assigned twice. TAVI today: **Not checked.**
- **NF-4 — Speed.** How soon a rule assigns a ticket, in three cases:
  - **New or updated ticket:** the rules run as part of the ticket event (EO-1), so the owner is already set when the ticket first appears in lists and on the ticket page. Nobody sees it unassigned first. Target: within **5 seconds** of the save, for 95 of 100 tickets.
  - **Assign tickets on closure (RR-16):** the next backlog ticket goes to the agent as part of the close event, as in Zoho ("the next available unassigned ticket will be automatically assigned to them").
  - **Assign backlogs (RR-15):** backlog tickets are assigned by a regular background run. Zoho does not publish how often. TAVI runs it **every minute** today ("every minute and whenever an agent frees up"), and keeps that.
  - The 5 seconds and the 1 minute are not Zoho numbers (Zoho publishes none). They are targets for the team to agree, so that tests have a clear pass or fail.
  - TAVI today: **Not checked.**
- **NF-5 — Safe editing.** Two admins editing the same rule or the order at once do not lose a rule silently; the second save gets a clear message (MSG-6). TAVI today: **Not checked.**

### Acceptance criteria
- With Arabic selected, every label and message on the page and in the dialogs is in Arabic and the layout is right to left (NF-1).
- Every control can be reached and used with the keyboard; screen readers read a name for every switch, move button and pick list, and read each error message (NF-2).
- 20 tickets created at the same moment for a pool of 2 agents with threshold 5 → each agent ends with exactly 5; the other 10 are backlog tickets; no ticket has two assignment entries (NF-3).
- A ticket created by API that matches a rule shows its owner in the create response or within 5 seconds (NF-4).
- With "Assign backlogs" on, a backlog ticket is assigned within 1 minute of an agent dropping below their threshold (NF-4).
- Two admins open the same rule; the first saves; the second's save shows the message in MSG-6 and changes nothing (NF-5).

---

## 11. Refactoring existing rules

Rules saved before this change are converted to the new model once, when the change is released. Nobody has to rebuild them by hand.

- **MIG-1 — Agent and team rules become Direct Assignment rules.** A rule whose action is "An agent" or "A team" becomes a Direct Assignment rule: same name, description and active state; Execute on Ticket Create; one target with "Ticket coming to" = the rule's old department, the same criteria, no Move, and the same agent or team.
  - TAVI today: **Missing.** Phase 1.
- **MIG-2 — Round-robin rules become Round Robin rules.** A rule whose action is "Round robin" becomes a Round Robin rule in the same department: same name, description and active state; Execute on Ticket Create; one target with the same criteria, the same method (Sequence → Sequential, Load-based → Load based, Skill-based → Skill based) and the same agents or team.
  - TAVI today: **Missing.** Phase 1.
- **MIG-3 — Order is kept.** In each new list, converted rules keep their old relative order. Direct rules from different departments are listed department by department, in the old list order inside each department.
  - TAVI today: **Missing.** Phase 1.
- **MIG-4 — Per-rule capacity is removed, not converted.** Thresholds belong to the department's Round Robin Preferences and apply to all its round-robin rules together (RR-12, RR-13), so a rule's own capacity has no place in the new model.
  - The "Capacity per agent" of every existing round-robin rule is removed. Its value is not copied into the department or agent thresholds.
  - The Department wise threshold and the Agent level threshold start **off** in every department. An admin switches them on and sets the numbers (1–200) in Round Robin Preferences.
  - The conversion report (MIG-7) lists each department whose rules had a capacity, with the old values, so admins know which departments to set up.
  - Decided 14 Oct. TAVI today: **Missing.** Phase 1.
- **MIG-5 — TAVI's backlog extras are removed.** The per-rule "Keep excess tickets in backlog" option and the Backlog tab are removed, because Zoho has neither. Nothing is carried over from them.
  - "Assign backlogs" and "Assign tickets on closure" start **off** in every department, as in Zoho (RR-15, RR-16). An admin switches them on in Round Robin Preferences.
  - Tickets in TAVI's backlog list at the time of the change stay unassigned in their department and become backlog tickets (RR-14).
  - The conversion report (MIG-7) lists each department that had tickets in the backlog, with their number.
  - TAVI today: **Missing.** Phase 1.

- **MIG-6 — Nothing changes for tickets.** Tickets already assigned keep their owner and team. Ticket history entries written before the change still show the old rule name.
  - TAVI today: **Missing.** Phase 1.
- **MIG-7 — Conversion report.** After the conversion, the Audit Log has one entry per converted rule (old id → new rule), and one per department listing what was removed (old rule capacities, old Team Assignment mode and capacity), so admins can check the result and set up Round Robin Preferences.
  - TAVI today: **Missing.** Phase 1.
- **MIG-8 — Team Assignment becomes the Zoho switch.** Each department's Team Assignment tab is replaced by the on / off switch (TA-1). Every department starts with the switch **on** (Zoho's default), whatever its old mode. The old mode (Off / Round robin / Load based), "Capacity per agent" and backlog setting are removed and not carried over.
  - Tickets that wait in a team today keep their team and stay in the team queue.
  - Tickets waiting in the old team backlog keep their team, leave that backlog and wait in the team queue.
  - The conversion report lists each department whose old mode was Round robin or Load based, so admins can add a round-robin rule for those teams.
  - TAVI today: **Missing.** On staging all 5 departments have mode Off and no capacity. Phase 1.

### Acceptance criteria
- A department with rules "VIP → Agent A" (agent), "Billing → Team Billing" (team) and "All → round robin, load based, capacity 10" ends with two Direct Assignment rules and one Round Robin rule, in the same order, all active as before.
- Round-robin rules in one department with capacities 10 and 15 → both capacities are gone; the department and agent thresholds are off; the conversion report lists the department with 10 and 15.
- A department with 3 tickets in TAVI's backlog → after the change the 3 tickets are unassigned in that department, "Assign backlogs" is off, and the report lists the department with 3.
- A department whose Team Assignment mode was Load based → Team Assignment switch on, no mode or capacity; the report lists the department.
- A ticket that matched an old rule before the release is assigned the same way by the converted rule after it.

---

## 12. Phases

- **Phase 1 — Refactor to Zoho's model and make it correct.** Two rule types and two lists (GEN-1); conversion of existing rules (MIG-1 to MIG-8); Zoho's execution order (EO-1 to EO-6); history and audit (GEN-10, GEN-11); Round Robin Preferences with the department threshold (RR-12); round-robin behaviour as defined (RR-4 to RR-9, RR-14); direct-rule basics (DA-3 to DA-7 on create); notifications NOT-1 and NOT-2.
- **Phase 2 — Zoho's remaining rule settings.** Execute on update (GEN-3, DA-7 on update, DA-8); up to 5 targets (GEN-4); more criteria (GEN-5a–5c); master switches (GEN-7); organisation-wide direct rules with Move Ticket to (DA-1, DA-2); exclude agents (RR-3); availability and agent thresholds (RR-10, RR-11, RR-13); backlog options (RR-15, RR-16).
- **Phase 3 — Triaging and extras.** Skills setup (RR-18); incoming mode (RR-17); 30-day rule (RR-19); notification rules (NOT-3, NOT-4); AI owner prediction (later).

NDC-1978 currently marks assignment rules and skills as Phase 3, needing agent online / offline status and business-hours sets first. The phase split above was agreed in review.

## 13. Dependencies

- **Agent online / offline status** (NDC-1976) — for RR-7, RR-10, RR-11, RR-16.
- **Working teams** (NDC-1975, bug NDC-1910) — for DA-3, DA-4, RR-3, TA-1.
- **Business hours and holidays** (already in Desk) — for GEN-5c.
- **Workflow rules and SLA** — for the order in EO-1 to EO-5.
- **Ticket history and Audit Log** — for GEN-10, GEN-11 and MIG-7.

## 14. Decisions

### Decided in the review of 14 Oct 2026
1. **Overall:** match Zoho Desk for everything.
2. **EO-1:** Zoho's order exactly: Skills based assignment → Direct Assignment → Workflows → SLA → Round Robin → Blueprint → Notifications; Supervise on a timer, Macros by hand.
3. **EO-5:** the assignment notification goes to the latest assigned agent of the event (Notifications is the last step).
4. **EO-6 (was EO-7):** every round-robin target must have exactly one method (Sequential, Load based or Skill based).
5. **GEN-4:** up to 5 targets per rule, as in Zoho.
6. **DA-5:** direct rules ignore availability, thresholds and backlog. Zoho's docs agree (see DA-5 for the one unclear table row).
7. **DA-7:** a direct rule never reassigns a ticket that already has an owner.
8. **RR-9:** a ticket with no skills can go to every agent of its department.
9. **RR-12, RR-13:** thresholds live only in Round Robin Preferences per department (department wise, and agent level with one agent and one number per row), for all round-robin rules of the department. No threshold anywhere else (not on rules, not on Team Assignment); the per-rule capacity is removed.
10. **RR-19:** adopt Zoho's 30-day rule.
11. **Existing rules:** refactored to match Zoho (section 11).
    - **MIG-4:** per-rule capacities are removed, not converted, because thresholds are set for the whole department in Round Robin Preferences, not per rule.
12. **Phases:** the split in section 12 is agreed.
13. **TA-1:** Team Assignment works exactly as in Zoho: an on / off switch per department; no team modes, capacity or backlog.
14. **Threshold range:** 1–200, as in Zoho's help page.
15. **RR-7:** skipped agents are marked "SKIPPED" and moved to the end, as in Zoho.
16. **DA-2:** the Assign Ticket to list shows the agents of the Move Ticket to department, or of the Ticket coming to department when there is no move. With Any Department and no move, the list is disabled and the ticket is left unassigned.
17. **Backlog:** keep only Zoho's backlog behaviour. TAVI's per-rule backlog option and Backlog tab are removed and not carried over (RR-14, MIG-5).

### Still open
None.

## 15. Sources

- Zoho Desk help: [Assigning tickets using workflows and assignment rules](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-using-workflows-assignment-rule) (execution order, five targets, scope, 30-day rule) · [FAQs: Automation](https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-automation) (order with skills first, Supervise, Macros) · [Direct Assignment vs Round Robin](https://help.zoho.com/portal/en/community/topic/direct-assignment-vs-round-robin-choosing-the-right-routing-method-in-zoho-desk) (capacity, backlog, offline, "routes an unassigned ticket") · [Assign tickets manually](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assign-tickets-manually) · [Automatic triaging and assignment](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/automatic-triaging-and-assignment-of-tickets).
- Live Zoho Desk org, 6 Oct 2026: `reference/zoho-live-notes.md`. Round Robin Preferences screenshot, 14 Oct 2026: `docs/WhatsApp Image 2026-10-14 at 12.20.30 PM.jpeg`.
- TAVI Desk build, 6 Oct 2026: `reference/tavi-build-map.md`.
