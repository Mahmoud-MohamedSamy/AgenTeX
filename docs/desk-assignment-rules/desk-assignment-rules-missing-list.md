# Assignment rules — what Zoho Desk has that TAVI Desk is missing

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging), bundle `index-Co3RWIzd.js` |
| Reference | Zoho Desk, checked live on 6 Oct 2026 (org "anywaresoftwaredesk", Enterprise trial, admin "CEO", headless Edge), plus Zoho's help and API docs |
| Scope | The three Zoho articles: assign tickets manually, assignment rules (direct and round robin), and automatic triaging (skills, availability, AI) |
| Already in Plane | **NDC-1978** "Assignment rules and skills" (6 details) — items 1, 2, 3, 4, 7 and 11 below. Related: NDC-1976 (agent online / offline status), NDC-1980 (reassign on leave), NDC-1780 (bulk actions), NDC-1897 / NDC-1898 (owner picker bugs) |
| Test spec | `docs/desk-assignment-rules/spec-desk-assignment-rules.md` (Group Z: Z1–Z15 = items 1–15) |
| Status | **Draft for review. Nothing filed in Plane** |

How each side was checked:
- **Zoho Desk:** opened Direct Assignment, Round Robin (list, new rule, target panel, Preferences), Skills (list, Add Skill), Notification Rules and the ticket list's assign picker. Two rule forms were filled with a name only and closed with Cancel. Nothing was saved, so the one allowed QA rule was not needed.
- **TAVI Desk:** read from the build's code and strings, the live API (GET only) and the pages, as the owner and the second admin. The rule editor was opened and closed with Cancel; no assignment request was sent.
- **Tenant change:** the tenant had 0 departments, so the Assignment Rules page showed only "Create a department first". At your request, 5 departments were created on 6 Oct 2026: **Customer Support** (default), **Sales**, **Marketing**, **HR**, **Tech**. Each has the 4 agents and the default settings. They were not removed, because the default department cannot be deleted.

"Seen" means it was on screen. "Docs" means it comes from Zoho's help pages only. "Code" means it comes from TAVI's bundle or strings, not the screen.

**Evidence.** To see all images inline, open [`evidence/evidence-report.md`](evidence/evidence-report.md). There is one annotated image per item in `evidence/`. Each has TAVI on the left and Zoho Desk on the right, with numbered boxes and a "Behaviour | Zoho | TAVI | Match" table.

---

## Already done in TAVI Desk

- Assignment Rules page with five tabs: Rules, Team Assignment, Agent Skills, Backlog, Notifications.
- Rules per department, run in order; the first active rule that matches wins. Move up / down, Active switch, edit, delete with a clear confirm message.
- Rule criteria with AND / OR and brackets (a "criteria pattern" like `1 and (2 or 3)`), on 23 ticket fields.
- Assign to one agent, to a team, or round robin over chosen agents or a team's members.
- Round robin in three ways, as in Zoho: Sequence, Load-based and Skill-based.
- A ticket limit per agent ("Capacity per agent", 1–1000) on each round-robin rule.
- Team Assignment per department: Off, Round robin or Load-based inside the team.
- Skills per agent, used by skill-based round robin.
- Assignment notifications to the agent and to the team.
- Manual assignment: Ticket Owner and Teams fields, Unassign, bulk Assign To (agents or teams), Move ticket with "Assign to", Share ticket. Only the ticket's department agents and teams are offered when moving.
- Unassigned Open Tickets view, Unassigned filter and HQ Unassigned widget. Separate permissions to assign, to assign unassigned tickets, to view unassigned tickets and to pick up.
- Other automation can set the owner: Macros, SLA escalation, and the workflow action "Owner Assignment".
- Agent availability: online / offline in the queues, and "Mark idle agents offline" after 1–120 minutes.
- **TAVI has more than Zoho:**
  - **Pick up** ("Assign this ticket to yourself"), with "Someone else picked up this ticket first." when two agents race. Zoho's docs describe no such button.
  - A **Backlog** page that lists waiting tickets with the department, team, rule, reason ("Everyone at capacity" / "No eligible agent"), time queued and attempts, plus **Process now**.
  - A limit and a backlog switch on each rule, and also inside Team Assignment.
  - Round robin over a role in the workflow "Owner Assignment" action.

---

## Missing — rule settings

1. **Run a rule when a ticket is updated, not only when it arrives.** *(Already in NDC-1978, detail 1.)*
   - **Zoho (seen):** Direct and round-robin rules have "Execute Rule on": Ticket Create (default) and Ticket Update.
   - **TAVI today (seen):** "Rules run in order when a ticket arrives with no owner and no team." The rule editor has no trigger option.
   - Evidence: `evidence/01-run-on-ticket-update-vs-zoho.png` · Z1
2. **"Move Ticket to" another department as a rule action.** *(Already in NDC-1978, detail 2.)*
   - **Zoho (seen):** Each target has "Ticket coming to" (any department or one), Criteria, **Move Ticket to** a department, and Assign Ticket to.
   - **TAVI today (seen):** Assign to an agent, a team or round robin only. A rule belongs to one department. Single-ticket Move exists, but rules cannot use it.
   - Evidence: `evidence/02-move-ticket-to-vs-zoho.png` · Z2
3. **Criteria on business hours and holidays.** *(Already in NDC-1978, detail 3.)*
   - **Zoho (seen):** "Execution Time" criterion with: during business hours of, outside business hours of, on a holiday of, not a holiday of.
   - **TAVI today (seen):** No such criterion. TAVI has Business Hours and Holidays pages, but the rules cannot use them.
   - Evidence: `evidence/03-business-hours-criteria-vs-zoho.png` · Z3
4. **Date fields and date / number operators in criteria.** *(Already in NDC-1978, detail 4.)*
   - **Zoho (seen):** Date fields such as Due Date, Created Time and Closed Time, with is, isn't, is after, is before, between, not between, is empty, is not empty. The value can be "Current Time".
   - **TAVI today (seen + code):** No date field is offered. Number fields only have is, isn't, is empty and is not empty.
   - Evidence: `evidence/04-date-number-operators-vs-zoho.png` · Z4
5. **Criteria on contact and account fields, and on ticket owner, team, tags and lookups.** *(New.)*
   - **Zoho (seen):** 38 ticket fields (including Ticket Owner, Team, Tags, Contact Name, Account Name, Product Name, Is Overdue, Number of Threads), plus 26 contact fields and 14 account fields in the same list.
   - **TAVI today (seen):** 23 ticket fields. Owner, team and department are left out on purpose, and lookups, users and dates are not offered.
   - Evidence: `evidence/05-criteria-fields-vs-zoho.png` · Z5
6. **One switch to turn all direct rules, or all round-robin rules, on or off.** *(New, small.)*
   - **Zoho (seen):** A "Direct Assignment Rules" toggle and a "Round Robin Rules" toggle (per department) at the top of each list.
   - **TAVI today (seen + code):** Only an Active switch on each rule.
   - Evidence: `evidence/06-master-switch-vs-zoho.png` · Z6

## Missing — round robin

7. **Exclude chosen agents when round robin uses a team's members.** *(Already in NDC-1978, detail 5.)*
   - **Zoho (docs):** "Exclude agents from this assignment" when the round robin targets a team. Not seen live, because the trial org has no team.
   - **TAVI today (seen):** Pool "A team's members" offers only "Select a team".
   - Evidence: `evidence/07-exclude-agents-vs-zoho.png` · Z7
8. **Round robin only to online agents, with a switch to include offline agents.** *(New. Related to NDC-1976.)*
   - **Zoho (seen):** "Round robin, by default, assigns tickets only to the agents who are online in the mail channel." The preference "Assign tickets to offline agents" turns this off.
   - **TAVI today (seen):** The round-robin options do not mention availability, and there is no such switch. Whether the server skips offline agents could not be checked (see "Could not be checked").
   - Evidence: `evidence/08-online-agents-only-vs-zoho.png` · Z8
9. **A ticket limit for the whole department, and a separate limit per agent.** *(New.)*
   - **Zoho (seen):** "Department wise threshold" (on, 40 in this org; docs give a range of 1–200), and "Agent level threshold", which overrides it for chosen agents.
   - **TAVI today (seen):** "Capacity per agent" is set on each rule and in Team Assignment. It is the same number for every agent in the pool. There is no department value and no per-agent value.
   - Evidence: `evidence/09-thresholds-vs-zoho.png` · Z9
10. **Backlog options: switch per department, how many tickets per run, and in which order.** *(New, small.)*
    - **Zoho (seen + docs):** "Assign backlogs" once per department (seen). Docs add a limit of 1–50 per run, ordered by Due Date or Created Time.
    - **TAVI today (seen):** The backlog is switched on per rule and per Team Assignment. Tickets are always taken first come, first served, every minute.
    - Evidence: `evidence/10-backlog-options-vs-zoho.png` · Z10
11. **Skills management: skill types, skills with criteria stamped on tickets, and agents per skill.** *(Already in NDC-1978, detail 6.)*
    - **Zoho (seen):** Skills and Skill Types tabs. Each skill has a required type, criteria that add the skill to matching tickets, and its agents. Docs add a recalculate action and Skill Preferences.
    - **TAVI today (seen):** Skills are the options of the Tickets "Skills" picklist, ticked per agent. On the ticket, the agent picks skills by hand.
    - Evidence: `evidence/11-skills-vs-zoho.png` · Z11

## Missing — other automation

12. **Workflow action that assigns a ticket to a team, or to an agent inside a team.** *(New.)*
    - **Zoho (docs):** The workflow assign action targets an Agent, a Team, or an Agent in a Team.
    - **TAVI today (code):** "Owner Assignment" targets a specific user, a user field, a role, or round robin over a role. There is no team target.
    - Evidence: `evidence/12-workflow-assign-team-vs-zoho.png` · Z12
13. **AI suggestion of the ticket owner.** *(New. Check whether AI triage is in scope.)*
    - **Zoho (docs; menu seen):** Zia Field Predictions can predict the Ticket Owner, with an accuracy score. It can fill the field or wait for an agent to confirm.
    - **TAVI today (seen menu + strings):** AI Tagging only; no owner prediction.
    - Evidence: `evidence/13-ai-owner-prediction-vs-zoho.png` · Z13

## Missing — notifications

14. **Assignment notifications per department, per channel, with editable templates, plus a department alert for new unassigned tickets.** *(New.)*
    - **Zoho (seen):** Notification Rules per department, with email and mobile switches for "Assigning a ticket" (agent and team) and for Department Notifications "Creating a new ticket". Docs add an editable email template per rule.
    - **TAVI today (seen):** Two switches for the whole organisation. Channels "follow your organization's notification policy and each user's own notification settings". There are no templates and no department alert.
    - Evidence: `evidence/14-notification-rules-vs-zoho.png` · Z14

## Missing — API

15. **API for one rule, round-robin preferences, skill types, availability and ticket counts.** *(New. Follows from items 8, 9 and 11.)*
    - **Zoho (docs):** Endpoints for direct rules (get, reorder, on/off), routing preferences, skills and skill types, online / offline agents, and ticket count per agent.
    - **TAVI today (API):** `GET /desk/assignment-rules/{id}` returns 405. `/desk/routing-preferences`, `/desk/skills`, `/desk/skill-types`, `/desk/agents/online`, `/desk/agents/availability` and `/desk/agents/tickets-count` return 404.
    - Evidence: `evidence/15-api-vs-zoho.png` · Z15

---

## Not gaps

- **Several targets in one rule.** A Zoho direct rule can hold up to 5 targets, each with its own department. TAVI makes one rule per action, inside one department. You get the same result with more rules.
- **Online status in the assign picker.** Zoho's own picker does not show it either (only a Marketplace extension does).
- **"Assign to me".** Zoho has no such button; TAVI's Pick up is extra.
- **Assign tickets on closure.** TAVI's backlog is assigned "whenever an agent frees up", which covers backlog tickets. Zoho also hands over other unassigned tickets; check it in Z10.
- **Rule limits per plan** (Zoho Enterprise: 30 direct rules). TAVI shows no limit; this is not needed for parity.
- **Supervisor rules, Schedules and Blueprint owners** are separate Zoho features, outside these three articles.

## Could not be checked

- **Real assignment results.** The tenant has no tickets and no email channel, and the departments are new. So these were not seen: rules firing, round-robin order, capacity, the backlog filling and emptying, the history entry naming the rule, and notifications arriving. Please allow test tickets in Customer Support (created by the QA run and deleted after), or set up an email channel, so we can run the spec's functional groups.
- **Whether round robin skips offline agents** (item 8). This is decided on the server. Please confirm the intended behaviour, or allow the test in group E.
- **Zoho "Exclude agents" for a team** (item 7). The Zoho trial org has no team. Please allow one team to be created in Zoho (and removed after) if a live screenshot is needed.
- **The TAVI workflow builder past its first dialog** (item 12). "Next" may save a draft rule, so the TAVI side comes from the code. Please allow one draft rule (deleted after) to confirm it on screen.

## Additional notes

- Possible bug to check separately: the Department form has its own **Routing** setting (Round robin / Least busy / Skill match). The Assignment Rules page does not mention it, and it is not clear which one decides. All 5 departments were saved with `round_robin`.
- Possible bug to check separately: the build has a second assignment-rule engine (module rules with "Applies to" channels; "Only Import and API assign records today"). This is the engine behind NDC-1585. It is not clear whether it also appears for Desk Tickets under Modules and Fields.
- Possible bug to check separately: the TAVI session ended about every 20–30 minutes during this check (`POST /iam/auth/refresh` → 401), for both the owner and the second admin.
- Already filed: the New Ticket owner picker lists every company user before a department is chosen (NDC-1897, NDC-1898).
- Nothing else was changed on either side. In TAVI, the only change is the 5 departments above. In Zoho, nothing was saved.

## Environment

staging-desk.taviportal.com, Chromium (headless), 6 October 2026, owner and second admin accounts. Zoho Desk in headless Edge, admin account.
