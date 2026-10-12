# Workflow Rules — what Zoho Desk has that TAVI Desk is missing

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging), bundle `index-B6ABKo1E.js` |
| Reference | Zoho Desk, checked live on 11 Oct 2026 (org "anywaresoftwaredesk", Enterprise trial, read only), plus Zoho's help and API docs |
| Scope | Setup → Automation → Workflow Rules, the saved actions library, execution history, and how rules show up on tickets |
| Already in Plane | **NDC-2203** "Workflow Missings" (5 triggers, 14 actions, 2 partial). Feature items: **NDC-1986** (ticket triggers, Phase 2), **NDC-1987** (macros and workflow actions, Phase 3), **NDC-1989** (custom scripts), parent **NDC-1954**. Bugs: NDC-2205, NDC-2204, NDC-2173. NDC-1251 "Workflow Rules" is an empty holder; no PRD text |
| Evidence | [`evidence/evidence-report.md`](evidence/evidence-report.md) — 6 annotated images, one per group (TAVI left, Zoho right) |
| Test spec | [`spec-desk-workflow-rules.md`](spec-desk-workflow-rules.md) (Group Z rows Z1–Z28 = items 1–28) |
| Status | **Draft for review. Nothing filed in Plane, nothing changed on the tenant** |

How each side was checked:
- **TAVI Desk:** read from the build's code and strings, the live API (GET only) and the pages, as the owner.
  - The editor of an existing rule was opened. The trigger panel, condition field list and action picker were opened and closed.
  - The New Action form was opened with the module set to Tickets, and "Create action" was not clicked.
  - No rule or action was saved, activated or tested.
- **Zoho Desk:** the Workflow Rules list and the **New Workflow** builder were opened live.
  - The builder steps were Basic Information, Execute on, Criteria and the Actions "+" menu.
  - A throwaway name was typed so that Next would work, and the form was closed without saving.
  - The Active list was checked afterwards: only the existing "test workflow" is there.

Words used in each item:
- **Seen** means it was on screen.
- **Docs** means it comes from Zoho's help pages only.
- **Code** means it comes from TAVI's bundle, strings or API, not the screen.

Reference files are in `reference/`:
- `tavi-build-map.md`
- `zoho-docs-inventory.md` (every item has a source URL)
- `zoho-live-notes.md`
- `tavi-baseline-2026-10-11.json` (the 4 existing rules and the empty action library, used later to prove nothing changed)

---

## Already done in TAVI Desk

- Workflow Rules page:
  - Search, a module filter, and columns Name, Module, Trigger, Mode, Actions, Status, Updated.
  - Row menu: Edit, Activate / Deactivate, Test rule, Delete.
  - Bulk delete. Deleted rules go to the Recycle Bin and their scheduled actions are cancelled.
- Rules on 8 modules: Tickets, Contacts, Accounts, Products, Calls, Events, Tasks, Contracts. A rule can be limited to one layout.
  - Zoho offers Tickets, Accounts, Calls, Contacts, Events, Products, Tasks and Time Entry.
- Triggers: Create, Edit, Create or Edit, Delete, and Field Changed (one field).
- Conditions:
  - Up to 25 conditions, with AND / OR and a criteria pattern like `(1 and 2) or 3`.
  - An "All tickets" option for rules with no conditions.
  - A "changed" operator.
- Actions: Field Update, Owner Assignment (a user, a user field, or round robin over a role), Email (from a template), Task, Add Tags, Remove Tags and Send happiness email.
- Saved actions library (Setup → Automation → Actions) with a "Used by" column. A rule can use a saved action instead of configuring one inline. Zoho has the same idea with its separate Alerts, Tasks, Field Updates and Custom Functions pages.
- Limits close to Zoho's: 10 actions and 25 conditions per rule. Zoho Enterprise allows 30 rules per module per department; TAVI allows 50 per module.
- Audit Log entries for workflow rules and saved actions. Separate permissions to view rules, manage rules, run a test, manage actions and view execution history.
- Workflow changes show up in the ticket's History (as "by System"; see item 28).
- **TAVI has more than Zoho:**
  - **Date-Time trigger:** run N minutes, hours or days before or after a date field, counting elapsed time or business hours. Zoho workflow rules run instantly only. Zoho does timed work with Supervisor Rules or Schedules.
  - **Scheduled actions** with a delay, cancelled if the ticket stops matching.
  - **Rule mode:** Recurring or One time (at most once per record).
  - **Webhook action** with POST / PUT / PATCH, headers, a body template, a timeout and retries. In Zoho, webhooks are separate subscriptions (POST only, no headers) and are not a workflow action.
  - **Create Record action** in any module, with a target layout.
  - **All action types on every module.** In Zoho, Contacts, Accounts, Calls, Events, Tasks and Products only get alerts and custom functions.
  - **Test rule:** a dry run on a sample record that saves nothing.
  - **Execution History page:** every run, its outcome and each action's status, attempts and last error. Zoho has no such page.
  - **Edit protection:** "This rule was changed since you opened it" when two admins edit the same rule, and an unsaved draft can be resumed.

---

## Missing — triggers  ·  evidence: [01](evidence/01-workflow-triggers-vs-zoho.png)

1. **Customer Reply trigger.** Needed to reopen a closed ticket when the customer replies. *(Already in NDC-2203; NDC-1986 Phase 2.)*
   - **Zoho (seen):** "Customer Reply — Execute the rule when customers respond to Tickets".
   - **TAVI today (seen):** the trigger list is Create, Edit, Create or Edit, Delete, Field Changed and Date-Time only.
2. **Agent Response trigger.** *(NDC-2203; NDC-1986 Phase 2.)*
   - **Zoho (seen):** "Agent Response — Execute the rule when agents respond to Tickets". The existing Zoho rule "test workflow" runs on it.
   - **TAVI today:** none.
3. **Private Thread trigger.** *(NDC-2203; NDC-1986 Phase 2.)*
   - **Zoho (seen):** Private Thread with "Incoming Responses" and "Outgoing Responses".
   - **TAVI today:** none.
4. **Happiness Rating trigger.** *(NDC-2203; NDC-1986 Phase 2.)*
   - **Zoho (seen):** All Ratings, Good, Okay, Bad, or "Okay (or) Bad".
   - **TAVI today:** TAVI sends the rating email with the "Send happiness email" action, but no rule can react when a rating comes in.
5. **Comment trigger.** *(NDC-2203.)*
   - **Zoho (seen):** "Comment — Execute when a comment is added".
   - **TAVI today:** none.
6. **Field Update trigger on several fields, with Any / All.** *(New.)*
   - **Zoho (seen):** up to 3 field pickers, and "Execute when Any / All of the above field is updated".
   - **TAVI today (seen):** "Field Changed" with one WATCH FIELD only.
7. **One rule that runs on several events.** *(New.)*
   - **Zoho (seen):** Create, Customer Reply, Agent Response, Comment, Private Thread, Happiness Rating and Delete are tick boxes, so one rule can run on several of them. Edit and Field Update are a choice of one.
   - **TAVI today (seen):** one trigger per rule (Create, Edit, Create or Edit, Delete or Field Changed). Today the same actions must be copied into several rules.

## Missing — where a rule applies  ·  evidence: [02](evidence/02-department-scope-and-status-tabs-vs-zoho.png)

8. **Rules per department.** *(New.)*
   - **Zoho (seen):** the rules list has a department picker, and each rule belongs to one department. The page address carries the department id.
   - **TAVI today (seen):**
     - A rule has no department, and the list has no department picker.
     - A Tickets rule runs on tickets of every department.
     - The only way to limit a rule to one department is a "Department is …" condition, which is offered.
9. **Active / Inactive tabs on the rules list.** *(New, small.)*
   - **Zoho (seen):** ACTIVE and INACTIVE tabs.
   - **TAVI today (seen):** a Status column, but no status filter on the page. The API does take `isActive`.

## Missing — conditions  ·  evidence: [03](evidence/03-conditions-vs-zoho.png)

10. **Conditions on the ticket's contact and account.** *(New.)*
    - **Zoho (seen on 6 Oct, same condition builder):** the field list is grouped TICKETS, CONTACTS and ACCOUNTS.
    - **TAVI today (seen):** ticket fields only. Searching "Contact" finds only the ticket's own Contact field. For example, there is no "Contact type is VIP" or "Account country is Egypt".
11. **Business hours and holiday conditions.** *(New.)*
    - **Zoho (seen):** "Execution Time" is the first ticket field, with during / outside business hours of, and on / not a holiday of.
    - **TAVI today:** no such condition. The Date-Time trigger can count business hours, but a rule cannot ask "is it outside business hours now?".
12. **Many ticket fields cannot be used in conditions.** *(New.)*
    - **TAVI today (seen):** the condition list offers 21 fields:
      - Subject, Contact, Account, Status, Priority, Channel, Classification, Due Date, Ticket Owner, Product, Email, Phone
      - Description, Resolution, Department, Skills, Language, CRM Deal, Contract, Approval Status, Tags
    - **Left out:** 20 of the Tickets module's 40 fields:
      - Name, Ticket Number, Team, Created Time, Created By, Modified Time, Modified By, Closed Time
      - Response Due Date, First Response Time, Happiness Rating, Happiness Link Status
      - Spam, Customer Responded, Pending Review, Archived, Shared Departments
      - SLA Name, SLA Violated, SLA Escalated
    - Searching "Happiness" gives "No results found".
    - **Zoho (seen):** ticket conditions include Recent Comment, Recent Comment Type, Happiness Rating, Team, Created and Closed Time, Is Overdue, Is Escalated, Number of Threads and Comments, and To Address.
13. **Some operators are missing from the picker.** *(New.)*
    - Text has no "doesn't contain".
    - Dates have no "between" / "not between" and no "current time" value.
    - The TAVI engine and strings already have NotContains and Between; only the picker leaves them out (code).
    - Zoho has these operators (seen on 6 Oct).

## Missing — actions  ·  evidence: [04](evidence/04-missing-action-types-vs-zoho.png), [05](evidence/05-email-recipients-assign-team-one-per-type-vs-zoho.png)

Zoho's Actions "+" menu (seen) lists:
- **Actions:** Alerts, Field Updates, Assign Ticket, Add Comment, Send Email Reply, Reply via Instant Messaging, Notify via Instant Messaging, Add Tags, Remove Tags, Add Followers, Mark Ticket as spam, Share Ticket, Add Skills, Remove Skills, Recalculate Skills, Reassign ticket based on Skills, Change Layout, Tasks, Custom Functions.
- **External actions:** Send Cliq Notification.

TAVI offers Field Update, Owner Assignment, Webhook, Email, Task, Create Record, Add Tags, Remove Tags and Send happiness email.

14. **Add Comment** (public or private). *(NDC-2203; NDC-1986 Phase 2.)*
15. **Send Email Reply** to the customer, recorded in the ticket conversation, with a From address. *(NDC-2203; NDC-1986 Phase 2.)*
16. **Email alert to the contact and to outside addresses.** *(NDC-2203 "partial"; NDC-1986 Phase 2.)*
    - **Zoho (docs):** alert recipients include agents, teams, roles, roles and subordinates, record owner, record creator, Notify Contact and Additional Recipients.
    - **TAVI today (seen):** "Recipients are internal principals only — users, roles, or a user field on the record. Free-text addresses aren't allowed." There are no teams as recipients and no contact.
17. **Assign to a team, or to an agent in a team.** *(NDC-2203 "partial".)*
    - **Zoho:** "Assign Ticket" is in the menu (seen), with Agent, Team or Agent in a Team (docs).
    - **TAVI today (seen):** "Assign owner to" offers Users, Roles or User Fields only.
    - Related bug: NDC-2204, where the Roles list shows CRM profiles.
18. **More than one action of the same type in a rule.** *(New.)*
    - **Zoho (docs):** up to 10 alerts, 10 tasks and 10 field updates per rule.
    - **TAVI today (code):** "Every action type is already added — a rule can use each action once." For example, a rule cannot send two different emails or create two tasks.
19. **Add Followers.** *(NDC-2203.)*
20. **Mark Ticket as Spam**, with the option to also mark the contact as spam. *(NDC-2203.)*
21. **Share Ticket** with another department (Full, Restricted or Read-only access). *(NDC-2203.)*
22. **Change Layout.** *(NDC-2203.)* Zoho's rule list also counts "Change Layout" per rule (seen).
23. **Custom Functions.** *(NDC-2203; NDC-1989.)*
    - **TAVI today (code):** the action is built but switched off: "Custom functions land in Phase 4". The action library has no Custom Functions tab.
24. **Chat notifications.**
    - **Zoho:** "Send Cliq Notification" is in the menu (seen). Slack, Microsoft Teams and Google Chat appear only after the app is connected (docs, not seen on the trial org).
    - *(NDC-2203 lists Cliq only; Slack, Teams and Google Chat are new.)*
25. **Reply via instant messaging and Notify via instant messaging** (WhatsApp, Telegram and others). *(NDC-2203.)*
26. **Skills actions:** Add Skills, Remove Skills, Recalculate Skills and Reassign ticket based on skills. *(NDC-2203.)*
    - NDC-2203 says these are blocked because Desk has no skills feature. That is no longer true: Desk now has Agent Skills (Assignment Rules → Agent Skills) and a Skills field on tickets. So these actions can be built now.
27. **AI (Zia) actions:** field extraction, field prediction, generate content and auto email reply. *(New; low priority, Zoho Enterprise only.)*
    - Docs only. Zia actions are not switched on in the trial org, so they were not seen.

## Missing — history on the ticket  ·  evidence: [06](evidence/06-ticket-history-shows-rule-vs-zoho.png)

28. **The ticket's history says which workflow rule changed it, and why an action failed.** *(New.)*
    - **Zoho (docs):** Ticket History shows the rule name, action name, status and reason. The API filters it with `eventFilter=WorkflowHistory`.
    - **TAVI today (seen):** ticket #62's History shows "Tags changed — Added tags Recently Edited — by System", with no rule name and no action. The run can only be traced on the Execution History page, by pasting the record id.

---

## Could not be checked

- **Slack, Microsoft Teams, Google Chat and Zia actions on Zoho** (items 24 and 27). They appear only after an integration or Zia is switched on, which would change the Zoho org. Please connect one chat app, or switch on Zia actions, on the Zoho trial if you want them shown live.
- **The Zoho alert form** (item 16) was not opened. The recipient options come from Zoho's help pages. Please let us open Workflows → Alerts → New (Cancel only) if you want a screenshot.
- **Whether workflow rules run on tickets created by API, import, bulk edit or macros.** Neither Zoho's docs nor TAVI's code says. This will be tested in the functional run (needs test tickets in a QA department).

## Additional notes

- **Not gaps:**
  - Cloning a rule and ordering rules: Zoho documents neither. All matching Zoho rules run.
  - "Changed from / changed to" operators: Zoho has none.
  - Task reminders: not documented by Zoho, and switched off in TAVI Desk.
  - Webhook subscriptions, Supervisor Rules and Schedules: separate Zoho features, not part of Workflow Rules. All three return 404 in TAVI today.
  - Rule-count API (`automationFeatureCount`): low value.
  - Time Entry module: Zoho allows only custom functions on it.
- **Possible bug to check separately:** Execution History shows every rule twice for the same ticket in the same minute. One of the two entries has 0 actions run.
- **Possible bug to check separately:** Execution History logs the "Field Changed" rule with trigger "On Create". This matches NDC-2205.
- **Possible bug to check separately:** Execution History has no link in the Setup menu, the rules list or the editor. It can only be opened by typing `/settings/workflow-executions`.
- **Possible bug to check separately:** the "Add action" picker still offers Add Tags, Task and Create Record on a rule that already has all three, although a rule "can use each action once". Only Field Update is hidden.
- **Possible bug to check separately:** the saved-action library cannot create a "Send happiness email" action, although rules can use that action inline.
- **Possible bug to check separately:** Ticket History shows "Department changed — Old blank, New 7e1ac409-…", the raw department id instead of the department name.
- **Tenant data:** the tenant already has 4 active Tickets rules made by a teammate. They were not touched. Their exact state is saved in `reference/tavi-baseline-2026-10-11.json`.
- **Nothing was changed** on the TAVI tenant or in Zoho.
  - The only side effect: opening ticket #62 made the app mark it as read for the owner account (the app's own call).
  - In Zoho, a rule form was filled with the name "QA probe - not saved" and closed. The rule list was checked afterwards and no rule was created.

## Environment

`staging-desk.taviportal.com`, Chromium and Edge (headless), 11 October 2026, owner account. Zoho Desk org "anywaresoftwaredesk", Edge (headless), CEO account.
