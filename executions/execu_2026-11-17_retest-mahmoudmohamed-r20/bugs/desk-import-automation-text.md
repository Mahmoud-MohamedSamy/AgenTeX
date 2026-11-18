# Import | Desk import "Trigger automation and process management" says it runs review and approval processes, which Desk does not have

**Summary**
In the Desk import wizard, step 4 "Assign" has the checkbox "Trigger automation and process management". Its description says it runs "workflow rules, review and approval processes and blueprints". Desk has no Review Process or Approval Process, so the text promises something that does not exist in Desk, and it leaves out Desk automations that do run (skills, assignment rules, SLA, round robin, notifications). The step heading "Assign & approve" and its subtitle "…and whether they need approval" have the same problem: the step has no approval option.

**Steps to Reproduce**
1. Open Desk > Settings > Data > Import (staging-desk.taviportal.com/settings/data/import).
2. Upload a file, choose the operation and map the fields.
3. On step 4 "Assign", read the heading and the description under "Trigger automation and process management".

**Expected Result**
- The description lists all Desk automations that run on imported records, in their execution order: Skills › Direct assignment (assignment rules) › Workflow rules › SLA › Round robin › Blueprint › Notifications.
- It does not mention review or approval processes.
- The step heading and subtitle do not mention approval when there is nothing to approve.

**Actual Result**
- Description: "Run workflow rules, review and approval processes and blueprints on the imported records. Off by default, so a bulk import only loads data. A row with no owner is assigned to you."
- Heading: "Assign & approve". Subtitle: "Choose how imported records get an owner and whether they need approval." The step has only the automation checkbox.

**Environment**
staging-desk.taviportal.com (NDC-Staging), Settings > Data > Import, step 4 Assign, Edge, 18 Nov 2026.

**Suggested priority**: Low

**Evidence**: BUG-desk-import-automation-text-UI.png
