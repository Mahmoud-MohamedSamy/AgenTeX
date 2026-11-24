# FILED as NDC-3230 on 23 Nov 2026 (Medium, Bug, Sprint 17, Desk, relates to NDC-2999)

# API-01 — ticket draft (not filed)

| Field | Value |
|---|---|
| Project | NDC |
| Title | Workflow Rules \| A rule update that leaves out the conditions clears them, so the rule runs on every ticket (Zoho keeps them) |
| Priority | Medium (suggested: low chance today, high damage when it happens) |
| Labels | Workflow Rules |
| Assignees | MahmoudMohamed, mfathy, Hegazy |
| State / module / cycle | Bug · Desk · Sprint 17 |
| Related | NDC-2999 (Done) |

---

## Summary

When a workflow rule is updated and the request does not include the rule's conditions, TAVI clears them. The rule then runs on every ticket of its trigger in its departments, with no warning. Zoho Desk keeps the conditions in that case and clears them only when they are sent explicitly as empty. The TAVI editor relies on the current behaviour, so the fix needs a matching editor change.

## Steps to Reproduce

1. Create an active On Create rule on Tickets with the condition **Subject starts with "QA"** and any action (e.g. Add Tags).
2. Update the rule through the API with only its actions:
   `PATCH /api/v1/workflow/rules/{id}` with body `{ "actions": [ … ] }`
3. Open the rule in the editor (or read it with `GET /api/v1/workflow/rules`).
4. Create a ticket whose subject does not start with "QA".

## Expected Result

- The conditions are kept (Subject starts with "QA"); only the actions change.
- The new ticket does not match, so the rule does not run.
- Conditions are cleared only when the request says so explicitly (`"criteria": null`).

## Actual Result

- The update is accepted (200) and the conditions are gone (`criteria: null`). The editor shows "No conditions — actions run on every event of this trigger".
- The rule runs on every new ticket. In the test it fired on 6 unrelated tickets at once.

## Impact

- **Who can trigger it:** any caller of the workflow API that sends a partial update: an integration, a script, an admin tool, or a future TAVI feature that edits rules (bulk edit, import, copy). People using the TAVI editor are not affected today (see below).
- **What happens:** one call silently turns a rule into "every ticket". If the rule is active, all its actions run on every matching event across its departments:
  - fields, owners or status changed on all tickets;
  - emails sent to customers or agents;
  - webhooks fired to outside systems;
  - tags, tasks or comments added everywhere.
- **Detection and recovery:** there is no warning. The only signs are "No conditions" in the editor and a burst of runs in Execution History. Field changes and sent emails cannot be rolled back.
- **Parity:** an integration written against Zoho's behaviour (conditions kept on partial update) will hit this.

## What the TAVI editor does today (captured 23 Nov)

- **Change only an action and save:** the editor sends the whole rule, conditions included. The conditions are kept.
- **Remove all conditions and save:** the editor sends the rule with **no conditions field at all**. The API stores `criteria: null`.

So the editor relies on "conditions left out = no conditions".

## Zoho Desk (checked live 23 Nov)

Tested with Zoho assignment rules, which use the same conditions format; Zoho workflow rules cannot be created through its API.

| Update sent | Zoho result |
|---|---|
| Rename only, no conditions in the request | Conditions kept |
| Change the assigned agent only, no conditions in the request | Conditions kept |
| `criteria: null` sent explicitly | Conditions cleared |

## Note: the fix needs both parts

1. **API:** when the conditions are left out of an update, keep the stored conditions. Clear them only on an explicit `criteria: null`.
2. **Editor:** when the user removes all conditions, send `criteria: null`. Without this, removing conditions in the editor stops working once part 1 ships.

## Environment

- App: Anyware Desk (staging), staging-desk.taviportal.com (NDC-Staging), owner account
- API and Microsoft Edge on Windows 10; Zoho Desk test portal for the comparison
- Dates: 22–23 Nov 2026

## Evidence

- **Regression case API-01:**
  - run 1 (22 Nov): rule fired on 6 unrelated tickets;
  - re-checked on the 23 Nov build: `criteria` null after the partial update;
  - editor save requests captured 23 Nov.
- **Zoho comparison:** live, 23 Nov (test data deleted).
