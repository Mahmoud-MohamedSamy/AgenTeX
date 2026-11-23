# Draft — not filed

**Title:** CRM Automation | Workflow rules, assignment rules, actions, approval and review processes show a module ID instead of the module name

**Jam:** https://jam.dev/c/fb154ab6-264f-4e6f-bb56-09f7636a6d51

## Description
On five Setup pages, the Module column shows a long ID (`a26a20be-8b90-49cc-9af4-99dde65a4a54`) instead of a module name. All five items were created in August 2026. Their module no longer exists in the CRM: every current module was created on 29 Oct 2026, and opening this module ID returns "not found". The rules still show as Active.

| # | Page | Item | Where the ID shows | Jam time |
|---|---|---|---|---|
| 1 | Automation › Workflow Rules | Send Email to Manager | list Module column; rule page header and the "When" sentence | 0:03 |
| 2 | Automation › Assignment Rules | Assign New Lead | list Module column; rule page header | 0:15, 0:18 |
| 3 | Automation › Actions | Send Mail | list Module column; action page | 0:24 |
| 4 | Process Management › Approval Processes | Add New Company | list Module column; process page header | 0:55, 0:56 |
| 5 | Process Management › Review Processes | Review Leads Info | list Module column; process page header | 1:04 |

## Steps to reproduce
1. Sign in to TAVI CRM as the owner (org NDC-Staging).
2. Open Setup › Automation › Workflow Rules.
3. Look at the Module column for "Send Email to Manager".
4. Open the rule.
5. Repeat on Assignment Rules, Actions, Approval Processes and Review Processes.

## Expected result
- Each item shows the name of a module that exists, as Zoho CRM does (Zoho's Workflow Rules list shows "Deals").
- When an item's module was removed, the page says so clearly (for example "Deleted module"). The item can then be moved to another module or deleted.

## Actual result
- The Module column and the item pages show the raw ID `a26a20be-8b90-49cc-9af4-99dde65a4a54`.
- The workflow rule page reads "This rule will be executed when a record in a26a20be-8b90-49cc-9af4-99dde65a4a54 is created or edited."
- The items still show as Active even though their module is gone.

## Notes
- Opening the module (`/api/v1/modules/a26a20be-…`) returns 404. Its fields and layouts return an empty list, so the item pages open with empty field pickers.
- The current modules' fields, layouts, views, layout rules, validation rules, blueprints and tags were checked; none of them points to a missing module.
- Zoho behaviour when a module that rules depend on is deleted: not checked (read-only).

## Environment
- TAVI CRM web, ndc-crm.anyware.software, org NDC-Staging, owner account
- Edge 158 on Windows 10 (Jam); rechecked live on 22 Nov 2026

## Evidence
- `evidence/annotated/1-workflow-rules-vs-zoho.png`
- `evidence/annotated/2-assignment-rules-vs-zoho.png` (Zoho side: module picker in the create dialog; this Zoho org has no assignment rule)
- `evidence/annotated/3-actions-vs-zoho.png`
- `evidence/annotated/4-approval-processes-vs-zoho.png` (this Zoho org has no approval process; only the Module column is seen)
- `evidence/annotated/5-review-processes-vs-zoho.png` (Zoho side: module picker in the New Review Process form; this Zoho org has no review process)

## Fields to set
Assignee, state, priority, module, cycle: your choice.
