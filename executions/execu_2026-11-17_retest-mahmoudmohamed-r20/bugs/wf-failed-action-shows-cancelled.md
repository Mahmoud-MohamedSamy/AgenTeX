# Workflow Rules | A failed action shows "Cancelled", the run shows "Fired", and failed runs cannot be filtered

**Summary**
When a workflow action fails for good (for example Create Record refused because a required field is empty, HTTP 422), Execution History shows the action as "Cancelled" and the whole run as "Fired". The reason is cut off in the row, and there is no filter to list failed runs. An admin has no easy way to see that a rule is failing. Found while retesting NDC-3052; the developer says every action that fails for good shows this way, not only Create Record.

**Steps to Reproduce**
1. Create a Desk workflow rule On Create with Create Record into Calls, Contact Name = the ticket's Contact.
2. Create a ticket that matches the rule and has no contact (e.g. #4978).
3. Open Setup > Workflow Rules > Execution History and find the run (Record ID filter).
4. Look at the run's Outcome in the list, then open the run and look at the action's Status and Details.
5. Try to list only failed runs with the filters.

**Expected Result**
- The action shows "Failed" (clearly marked), not "Cancelled".
- The run in the list shows that an action failed (e.g. "Failed" or "Partly failed").
- The reason ("Not created: Calls needs Contact Name.") is readable in the row.
- A filter lets the admin list failed runs.

**Actual Result**
- Action Status "Cancelled" (the column also wraps it as "Can cell ed").
- Run Outcome "Fired", the same as successful runs.
- Details cut short; the full reason shows only on hover.
- Filters: Workflow rule, Record ID, Assignment rule only.

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, Edge + API, 17 Nov 2026. Tickets #4978, #4980, #4986, #4989; rules "QA RT20 CR 3052 …" (inactive).

**Suggested priority**: Medium (failing rules stay unnoticed)

**Related**: NDC-3052

**Evidence**: BUG-wf-failed-action-shows-cancelled-FAIL.png
