# TAVI Desk — what the build ships for Workflow Rules (11 Oct 2026)

Host `https://staging-desk.taviportal.com`, bundle `index-B6ABKo1E.js`. Read from the code (chunks `pages-Cp9_IlRF.js` = rule list, editor, saved actions, execution history; `src-CaDdDRtX.js` = API clients, operator sets, limits, phase flags; `audit-link.registry-DpdvKPPJ.js`), the `crm-workflow` locale (635 strings), the live API (GET only) and the pages, as the owner (`ndc-staging-owner`). The engine is shared with CRM; Desk turns some parts on or off with an app config (`tasksModuleKey: desk_tasks`, `taskReminder: false`, `inlineTagCreate: false`, `extraActionTypes: [SendHappinessEmail]`).

Nothing was saved. The rule editor was opened on an existing rule and the action pickers were opened and closed; the New Rule wizard was opened to the module list and closed; the New Action dialog was opened and closed. The only non-GET calls were the app's own background calls (settings read batch, presence heartbeat, token refresh).

## Pages
- **Setup → Automation → Workflow Rules** — `/settings/automation/workflow-rules`. Subtitle: "Automate field updates, owner assignment, webhooks, emails, tasks, and record creation in response to record events."
  - Search ("Search rules…"), module filter ("All modules"), **New Rule**. Columns: Name · Module · Trigger · Mode · Actions · Status · Updated. Row menu: Edit · Activate/Deactivate · **Test rule** · Delete. Select-all + bulk **Delete (n)** → "The selected rule will be moved to the Recycle Bin and its scheduled actions cancelled."
  - Empty: "No workflow rules yet" / "Create a rule to automate field updates, owner assignment, emails, tasks, and more when records change." Filtered empty: "No matching rules".
  - No status filter in the UI (the API takes `isActive`). No department picker.
  - Limit: "Limit reached — a module can have at most 50 rules." (New Rule disabled).
  - No access: "You don't have permission to view workflow rules" / "Ask a tenant administrator to grant you 'workflow:rule:view'."
- **Create New Rule** wizard (`/workflow-rules/new`): Module * (Tickets, Contacts, Accounts, Products, Calls, Events, Tasks, Contracts — list scrolls), Rule Name, Description, Layout (All layouts / one layout: "This rule applies only to records created with this layout…"), then "When should this rule be executed?" → Next / Create.
- **Rule editor** (`/workflow-rules/:id`, canvas When → Condition → Action):
  - Header: name (editable), Active/Deactivate, module, Layout, Add Description.
  - **Execute based on:** *A Record Action* — Create · Edit · Create or Edit · Delete · Field Changed (one "Watch field") · *A Date-Time field* — date field, Run N Minutes/Hours/Days before/after, Counting = Elapsed time / Business hours · *Score value* (hidden: "Scoring rules land in Phase 5").
  - **Rule Mode:** Recurring ("Fires every time a save matches the criteria.") / One time ("Fires at most once per record…").
  - **Condition:** "All {{module}}" or "{{module}} matching certain conditions"; up to 25 conditions; AND/OR toggle per connector; **Criteria Pattern** ("(1 and 2) or 3"). Fields = the module's own fields + Tags (no related Contact/Account fields).
  - Operators: text = equals, does not equal, contains, starts with, ends with, is one of, is not one of, is empty, is not empty, changed · number = = ≠ > ≥ < ≤, empty, changed · date/datetime = on, after, on or after, before, on or before, empty, changed · pick list = is, is not, is one of, is not one of, empty, changed · multi-select = contains any of, contains none of, empty, changed · user/lookup = is, is not, is one of, is not one of, empty, changed · Tags = contains any of / all of / none of, empty. The data model also has NotContains, Between, ChangedFrom, ChangedTo (no picker entry for them).
  - **Actions:** Instant actions and Scheduled actions ("Run after a delay you set. They are cancelled if the record stops matching the rule's conditions before then."). Max 10 actions per rule; **each action type once per rule** ("Every action type is already added — a rule can use each action once."). Each action: "Configure inline" or "Use a saved action".
  - Action types (Tickets): Field Update · Owner Assignment · Webhook · Email · Task · Create Record · Add Tags · Remove Tags · Send happiness email. Scheduled allows only Webhook, Email, Task, Create Record, Send happiness email. **Custom Function** is coded but off ("Custom functions land in Phase 4").
  - Field Update: fields of the current record, address parts. Owner Assignment: Users / Roles (round robin over a role) / User Fields — no team. Webhook: POST/PUT/PATCH, URL, timeout, headers, body template, async with retry on 5xx. Email: platform email with a template and internal recipients only (users, roles, user fields) — "Free-text addresses aren't allowed." Task: title, description, due (specific date / trigger date + N days), status, priority, assignee (default record owner), Notify Assignee; no reminder in Desk. Create Record: target module + layout + field values. Add Tags (append/replace) / Remove Tags. Send happiness email: Ticket Closed email with the rating link.
  - Merge fields `${field}`, `${recordId}`, `${moduleId}`.
  - Save · Save & Activate · Cancel; validation list "Fix these before saving:"; conflict dialog "This rule was changed since you opened it. Reload the latest version?" (rule `version`); draft resume ("Resume your draft?").
  - **Test Rule** (`?test=1`): sample record id, trigger kind, field values JSON → "Criteria matched / Did not match", what would be dispatched. "Nothing is saved."
- **Setup → Automation → Actions** (`/settings/automation/actions`) — saved-action library: "Reusable actions your Workflow Rules can share — define once, use everywhere." Type tabs All · Email · Task · Field Update · Webhook · Owner · Create Record · Add Tags · Remove Tags; module and status filters; columns Name · Type · Module · Used by · Status · Updated. New Action: 8 types ("Pick a type. You can't change it later") — Send happiness email is not one of them. Empty on this tenant.
- **Execution History** (`/settings/workflow-executions`, detail `/:id`): "Every workflow and assignment-rule evaluation." Filters workflow rule / record ID / assignment rule; columns When · Rule · Module · Record · Trigger · Outcome (Pending/Fired/No match/Failed) · Actions run; detail lists dispatched actions with status, attempts, HTTP, last error. **No menu entry** links to it.
- **Audit Log** links `workflow_rule` and `saved_action` entries back to the pages.

## Permissions
`workflow:rule:view`, `workflow:rule:manage`, `workflow:rule:execute` (Test rule), `workflow:action:view`, `workflow:action:manage`, `workflow:execution:view`.

## API (under `/api/v1`, `Authorization: Bearer …`, `x-app-key: desk`)
| Method | Path | Notes |
|---|---|---|
| GET | /workflow/rules?moduleId=&isActive=&skip=&take= | list (4 rules on this tenant, all Tickets) |
| GET | /workflow/rules/{id} | one rule, with `version` |
| POST | /workflow/rules | "Workflow rule saved successfully" |
| PATCH | /workflow/rules/{id} | "Workflow rule updated successfully" |
| DELETE | /workflow/rules/{id} | to Recycle Bin |
| POST | /workflow/rules/{id}/activate · /deactivate | |
| PUT | /workflow/rules/reorder | `{moduleId, orderedRuleIds}` |
| POST | /workflow/rules/{id}/execute | test run of a saved rule |
| POST | /workflow/rules/evaluate | test run of a draft |
| GET/POST/PATCH/DELETE | /workflow/actions[/{id}] | saved actions (`moduleId`, `type`, `isActive`) |
| GET | /workflow/actions/{id}/usage | rules that use it |
| GET | /workflow/executions?ruleId=&assignmentRuleId=&recordId= · /{id} | execution history |
| GET | /modules/{moduleId}/fields | fields offered in conditions (Tickets: 40) |

404 on 11 Oct 2026: /workflow/rules/{id}/clone, /workflow/rules/{id}/history, /workflow/rules/count, /workflow/limits, /workflow/custom-functions, /workflow/schedules, /desk/supervise-rules, /desk/supervisor-rules, /webhooks, /desk/webhooks, /workflow/webhooks.

## Rule object (shape)
`{id, moduleId, appKey, layoutId, name, description, trigger:{kind, fieldName, dateFieldName, offsetSeconds, offsetMode}, criteria:{kind:Comparison|StringMatch|Membership|Existence|Logical|Changed|ChangedFrom|ChangedTo|…}, mode:Recurring|OneTime, actions:[{id,type,order,delaySeconds,standaloneActionId,…type-specific}], isActive, position, createdAt, updatedAt, createdBy, updatedBy, version}`. There is no `departmentId`.

## Limits (code)
`maxActions: 10`, `maxCriteria: 25`, `maxRulesPerModule: 50`.

## Seen in Execution History (11 Oct 2026, data from a teammate's tests)
- Each rule appears **twice** for the same record in the same minute (one entry with 0 actions run).
- The "Field Change" rule is logged with trigger **On Create** (the NDC-2205 bug).
