# Zoho Desk — Workflow Rules seen live (11 Oct 2026)

Org "anywaresoftwaredesk" (Enterprise trial), department "Anyware Software", account "CEO" (Support Administrator), headless Edge. Read only — nothing was opened for editing and nothing was saved (only Zoho's own background calls `getbadge.acs` / `getresource.acs` ran).

## Setup menu (AUTOMATION)
- Assignment Rules · **Workflows → Rules · Alerts · Tasks · Field Updates · Custom Functions** · Blueprint · Macros · Service Level Agreement (SLA) · Supervisor Rules · Support Plans · Schedules.
- DEVELOPER SPACE: APIs · Connections · **Functions** · **Webhooks** · Mobile · Extensions. PRIVACY AND SECURITY: **Audit Log**.
- The Workflows URL contains the department id: `#setup/automation/<departmentId>/workflows/rules`.

## Workflow Rules list
- Title "Workflow Rules" with a **department picker** ("Anyware Software ▾") and **Create Rule**.
- Tabs **ACTIVE** / **INACTIVE**.
- One existing rule, "test workflow" (created before this check, not by QA). Its row shows counts per action type: **Alerts: 1 · Tasks: 0 · Field Update: 0 · Skills: 0 · Change Layout: 0 · Custom Functions: 0 · Other Actions: 0 · Execute on: Agent Response**.

## Not reached
- The rule builder did not open in the headless session (the rule list sits in the `ShowHomePage.do` iframe and the click did not open the rule). The builder steps, Execute On options, criteria and action menus therefore come from Zoho's help docs (`zoho-docs-inventory.md`) and from the teammate's live check recorded in NDC-2203.
- From the Assignment Rules check on 6 Oct 2026 (same criteria engine): condition fields are grouped as TICKETS (38), CONTACTS (26) and ACCOUNTS (14), and include **Execution Time** (during / outside business hours of, on / not a holiday of). See `../../desk-assignment-rules/reference/zoho-live-notes.md`.
