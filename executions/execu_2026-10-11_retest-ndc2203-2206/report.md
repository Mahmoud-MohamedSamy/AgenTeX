# Retest NDC-2203 / 2204 / 2205 / 2206 on desk.anyware.software — 11 Oct 2026

Account: ndc-staging-owner (same credentials as staging). Browser: Chromium via playwright-cli, 1600×900.
Tenant notes: a fresh tenant with no departments, so no Desk tags can exist. Field Update actions were used as the observable in place of Add Tags.

| Ticket | Verdict | Evidence |
|---|---|---|
| NDC-2204 Owner Assignment › Roles shows CRM profiles | **Still fails** | The Roles list shows CRM Admin, Manager, Supervisor, test, User, loaded from `GET /iam/profiles?app_key=crm`. Desk Roles (Settings › Roles, `/iam/org-units?app_key=desk`) = CEO, Manager. `NDC-2204-roles-list.png`, `NDC-2204-desk-roles-page.png` |
| NDC-2205 On Edit / Field Changed fire on create | **Still fails** | Ticket #4 was created via the UI with Priority high. Right after create it had Description="Workflow Completed" (On Create), Phone=1111111111 (On Edit rule) and Email=field.changed@qa.test (Field Changed/Subject rule; the typed email was overwritten). Executions show the On Edit rule running as RecordUpdated. `NDC-2205-ticket-after-create.png` |
| NDC-2206 Date-Time rule can't be saved | **Still fails** | Due Date, 1 day before, elapsed, Recurring, Priority = urgent, plus a Field Update action → `POST /workflow/rules` returns 500 INTERNAL_ERROR with the toast "An unexpected error occurred". Not tied to tags. Record-action rules save with 201. `NDC-2206-after-save.png` |
| NDC-2203 Workflow missings | **Still open** | Triggers: Create, Edit, Create or Edit, Delete, Field Changed, Date-Time (all 5 missing triggers still absent). Actions: Field Update, Owner Assignment, Webhook, Email, Task, Create Record, Add/Remove Tags, Send happiness email (all 14 missing still absent). Partial: Watch Field is single-select. Owner Assignment = Users / Roles (round-robin) / User Fields, with no teams or load balancing. Email now has a recipient picker (users, roles, user fields) and an email template, but no teams and no contact/free-text recipients. `NDC-2203-*.png` |

Test data left on the tenant: rules "QA 2205 On Create", "QA 2205 On Edit", "QA 2205 On Field Changed Subject" (all **deactivated**), and ticket #4 "QA retest NDC-2205".
Side observation: after choosing "Discard" on the Discard-draft prompt, the editor still offered "Resume your draft?" on the next visit (draft key `workflow-rule-draft-<moduleId>` in localStorage was kept). Not verified further.
