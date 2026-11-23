# FILED as NDC-3186 on 23 Nov 2026 (High, Bug, Sprint 17, Desk, relates to NDC-2205, Jam link attached)

# TC-01 ticket draft

| Field | Value |
|---|---|
| Project | NDC |
| Title | Workflow Rules \| "Field changed" condition matches when a ticket is created, so Create or Edit rules run on every new ticket |
| Priority | High (suggested; NDC-2205, the trigger version of this, was Urgent) |
| Labels | Workflow Rules |
| Assignees | MahmoudMohamed, mfathy, Hegazy (same as NDC-2205) |
| State / module / cycle | Bug · Desk · current sprint |
| Relation | relates to NDC-2205 |

---

## Summary

A workflow rule with the trigger **Create or Edit** and a condition like **Priority changed** runs on every new ticket, as soon as it is created. On a new ticket nothing has changed yet, but the condition is treated as true for any field and any value, including a priority left at its default. So actions meant only for a later change (tags, alerts, assignments, emails) also happen on every new ticket.

## Steps to Reproduce

1. In Desk, go to **Settings → Automation → Workflow Rules** and create a rule on Tickets:
   - Trigger: **Create or Edit**
   - Department: Customer Support
   - Condition: **Priority → changed**
   - Action: **Add Tags** (any tag, e.g. "Priority changed")

   Save it and make it active.
2. Create a new ticket in Customer Support and leave Priority at its default (Medium).
3. Open the ticket and look at its tags. Open the rule's **Execution History**.
4. Edit the ticket: change Priority from Medium to High and save. Check the tags and Execution History again.

## Expected Result

- Creating the ticket does **not** run the rule: nothing has changed yet. Execution History shows no run, or "No match", for the create.
- The rule runs **once**, on the edit in step 4 that changes Priority, and adds the tag then.

## Actual Result

- The rule runs as soon as the ticket is created. Execution History shows **Fired** on the create, with Add Tags **Succeeded**, and the tag is on the brand-new ticket.
- It then runs again on the Priority edit (that run is correct).
- It happens with any field and any value:
  - priority left at the default Medium, set to Urgent, High or Low;
  - "Subject changed" behaves the same way.
- Seen on Customer Support tickets **#7197, #7208, #7209, #7210** (rule "test", Jam below) and on 7 QA tickets in QA AO Dept B.
- **On Edit** rules with "changed" behave correctly:
  - they run when Priority is changed;
  - they don't run when another field is edited.

## Note

- Related to **NDC-2205** (Done). That ticket fixed On Edit / On Field Changed *triggers* firing on new tickets, and the triggers are fixed. This bug is the **"changed" condition** inside a Create or Edit rule, which still matches on the create.
- The editor hides "changed" on On Create rules but offers it on On Edit and Create or Edit rules, so users reach this through **Create or Edit**. Through the API, an On Create rule with "changed" also fires on every new ticket.

## Environment

- App: Anyware Desk (staging) — staging-desk.taviportal.com (NDC-Staging)
- Browser: Microsoft Edge 158 on Windows 10 (Jam); API checks with the owner account
- Dates: 22–23 Nov 2026

## Attachment

- Jam: https://jam.dev/c/40183b6e-c9ff-427e-861b-e50079cfe7b5

## API reproduction (optional section for the developer)

1. Create the rule:

   ```http
   POST /api/v1/workflow/rules
   {
     "moduleId": "88e8ea44-1658-4df3-9930-d0902b91073d",
     "name": "…",
     "isActive": true,
     "mode": "Recurring",
     "trigger": { "kind": "RecordCreatedOrUpdated" },
     "criteria": { "kind": "Changed", "field": "priority" },
     "actions": [ … ],
     "departmentIds": [ "<dept>" ]
   }
   ```

2. Create a ticket in that department.
3. Call `GET /api/v1/workflow/executions?ruleId=<id>`. It returns a row with `triggerKind: "RecordCreated"` and `outcome: "Fired"`.
