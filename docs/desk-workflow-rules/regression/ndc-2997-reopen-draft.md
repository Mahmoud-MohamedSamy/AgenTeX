# WITHDRAWN 23 Nov 2026 — do not post

The cause below was wrong: role membership was read from the CRM roles, not the Desk roles. With Desk roles, role round robin works (AC-07 PASS). NDC-2997 stays Done.

---

# NDC-2997 — reopen draft (not posted)

**Action:** reopen NDC-2997 (Done → Bug), replace the description with the one below, and post the comment at the end.
**Title:** Workflow Rules | Owner Assignment "Round robin among a role" assigns from the roles above the chosen role, not its own members
**Priority:** High · **Labels:** Workflow Rules, Automation Execution Order (as today) · **Assignees:** MahmoudMohamed, mfathy, Hegazy (as today) · **State:** Bug · **Module / cycle:** Desk, current sprint

---

## Summary

A workflow rule whose Owner Assignment uses **Round robin among a role** does not use the members of the chosen role. It takes agents from the roles **above** it in the role tree:

- If you pick the role that holds the department's agents, nobody is assigned.
- If you pick a lower role, even one with no members, the tickets go to the members of the role above.

## Role tree used (NDC-Staging, Desk roles)

| Role | Level | Members |
|---|---|---|
| CEO | top | 7: Test User 1, Dev Team 2, Customer Experience Specialists 1 and 2, and others |
| Manager | under CEO | none |
| Supervisor | under Manager | none |

QA AO Dept B agents: Test User 1, Dev Team 2, owner (all CEO members).

## Steps to Reproduce

1. Open **Setup → Automation → Workflow Rules → New Rule** on Tickets. Set the trigger to On Create and the department to QA AO Dept B.
2. Add the action **Owner Assignment → Roles → CEO**, save, and make the rule active.
3. Create 3 tickets in QA AO Dept B, then open the rule's **Execution History** and each ticket's owner.
4. Edit the rule: change the role to **Manager**, which has no members. Save.
5. Create 3 more tickets in QA AO Dept B and check them the same way.

## Expected Result

- **Role CEO:** the tickets are shared in turn among CEO members who are agents of QA AO Dept B (Test User 1, Dev Team 2, …).
- **Role Manager:** no owner is set because the role has no members, and the action shows Skipped with that reason.

## Actual Result

- **Role CEO:** all 3 tickets are left without an owner. Execution History shows Fired, and Owner Assignment shows **Skipped**: "Not assigned: nobody in the org unit can own a ticket of this department."
- **Role Manager:** all 3 tickets get an owner from the role above, CEO: Dev Team 2, Test User 1, Dev Team 2, with the action marked Succeeded.
- **Same pattern in Customer Support:** a rule on the empty role **Supervisor** (Priority = High) assigned tickets #7171–#7174 to CEO members Customer Experience Specialists 1 and 2, alternating.
- Owner Assignment to a specific user, a team, or a profile round robin works (control).

## Note

- Reopened after the 22 Nov regression. That pass counted the Manager role assigning Dev Team 2 / Test User 1 as correct. It is the same wrong behaviour, and the CEO-role skips seen then are this bug, not a setup change.
- Same as October B-9 and workflow regression case AC-07.
- The API saves this as owner type `OrgUnitRoundRobin` with the role's id.

## API reproduction (for the developer)

Send `POST /api/v1/workflow/rules` with this action:

```json
{ "type": "OwnerAssignment", "ownerTargetKind": "OrgUnitRoundRobin", "ownerValue": "<role id>" }
```

| Role | Role id | Result |
|---|---|---|
| CEO | 7972984b-b5cc-034a-bd96-6de61e3937d0 | Skipped |
| Manager | d46e0424-fd6f-914e-b4cf-f1597f7cbdcd | CEO members assigned |

Rule settings: trigger RecordCreated, departmentIds [4853562a-0b4d-45cb-ba34-9f2118fcd32c]. Then create tickets in that department and read `GET /workflow/executions?ruleId=<id>`.

## Evidence

- Jam https://jam.dev/c/f7e8d0dd-5c7d-40f7-9c99-794a6ee8fecf: the Supervisor rule assigning CEO members.
- Execution History rows for runs #7171–#7174 on rule 88639ae2.
- Regression report: https://claude.ai/artifact/3WW2VwvWmusr3FGnFZUKa2 (AC-07 details).
- Jam 1ff094b0 is not evidence. Its web-form tickets had no priority, so the rule never ran.

## Environment

- staging-desk.taviportal.com (NDC-Staging), owner account.
- API and Microsoft Edge, Windows 10.
- 22–23 Nov 2026.

---

## Comment to post when reopening

**Reopened — FAILED (23 Nov 2026, NDC-Staging)**

Round robin by role picks agents from the roles above the chosen role, not from the role itself.

- **Role CEO** (holds the QA AO Dept B agents): 3/3 tickets Skipped, "nobody in the org unit can own a ticket of this department".
- **Role Manager** (no members, under CEO): 3/3 tickets assigned to CEO members (Dev Team 2, Test User 1, Dev Team 2).
- **Role Supervisor** (no members): Customer Support tickets #7171–#7174 went to CEO members CES 1 and CES 2 (Jam f7e8d0dd).

My 22 Nov regression pass was wrong. It counted the Manager-role assignment as correct, but that is the same bug. The description is updated with steps and the role tree.
