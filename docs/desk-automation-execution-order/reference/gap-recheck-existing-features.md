# Gap re-check against today's bundle (offline)

Checked 8 Nov 2026. Bundle downloaded 8 Nov (`index-CJUeskGi.js` + chunks), locale `desk.json` and `settings.json`, snapshot `tavi-baseline-2026-11-08.json`. No login, no network, no tests run.

## How to read this

- **Now built** means the screen strings and the API path are both in the bundle. It does not mean the feature works. A bundle cannot show runtime behaviour.
- **Partly** means part of the gap is found and the rest is not.
- **Still missing** means searched and nothing found. An absent string is weak evidence, so confirm these on screen.
- **Needs live check** means the bundle cannot settle it.
- Evidence labels:
  - `index` = `index-CJUeskGi.js`, `wf` = `pages-KARTBnnk.js` (workflow pages), `designer` = `DeskBlueprintDesignerPage-Cwe1bDw-.js`.
  - `desk:NNN` = line in `locales/desk.json`, `settings:NNN` = line in `locales/settings.json`.
  - `baseline` = the live read-only snapshot taken today.
  - `run 6-7 Nov` = `executions/execu_2026-11-06_desk-assignment-skills/report.md`. That is an earlier observation on an earlier build, not today's.
- **Workflow strings:** the workflow screens use the `crm-workflow` locale, which was not downloaded (the local `workflow.json` is an HTML fallback). So workflow evidence is translation keys and action or trigger names in code, not English text.
- **Ticket page strings** are also not in the two locale files, so ticket-page wording could not be read.

## Verdict counts

| Feature | Gaps | Now built | Partly | Still missing | Needs live check |
|---|---|---|---|---|---|
| Direct assignment | 9 | 6 | 2 | 1 | 0 |
| Round robin | 5 | 5 | 0 | 0 | 0 |
| Skills | 11 | 9 | 2 | 0 | 0 |
| Workflow | 28 | 21 | 4 | 1 | 2 |
| Blueprint | 15 | 11 | 2 | 1 | 1 |
| SLA | 4 | 2 | 0 | 0 | 2 |
| Notifications | 1 | 1 | 0 | 0 | 0 |
| Macros | 0 | 0 | 0 | 0 | 0 |
| **Total** | **73** | **55** | **10** | **3** | **5** |

The 15 assignment items are split across Direct assignment (9), Round robin (4), Skills (1) and Notifications (1).

**Input problem:** `desk-missing-and-partly.md` has **no SLA, notification or macro rows**. Its parent inventory lists all three as Built (U-07, U-12, T-35).
- SLA rows below come from the NDC-2266 summary in the blueprint list, plus O-03.
- The full text of NDC-2266 and NDC-2389 is not in the repo, and Plane was out of scope for this check, so those two tickets may hold more gaps than are listed here.
- The Round robin and Skills tables also include inventory rows U-02 and U-03.

## Direct assignment

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| A1 | Run a rule on ticket update | Now built | desk:5416-5423 `executeOn`; `AssignmentRulesPage-XfT6Vfl0.js`; `/desk/assignment-rules` | Run 6-7 Nov D-09/10 exercised it |
| A2 | "Move Ticket to" as a rule action | Now built | desk:5441 "Move Ticket to"; `/desk/assignment-rules` | Direct rules now span departments (desk:5243) |
| A3 | Business hours and holiday criteria | Now built | desk:5398-5401 operators, desk:5364 group "Execution time"; `/desk/assignment-rules/criteria-fields` | Run 6-7 Nov bug B-5: holiday list not linked to business hours is ignored; re-check |
| A4 | Date fields and date / number operators | Now built | desk:5373-5374, desk:5392-5397, desk:5371 "Current Time"; `criteria-fields` | |
| A5 | Contact, account, owner, team, tag and lookup criteria | Partly | desk:5362-5363 groups Contact / Account, desk:5378 Tags; `criteria-fields` | The field list comes from the server. Run 6-7 Nov I-8: 17 contact fields (Zoho 26), Is Escalated not found. Owner and team as criteria not confirmed |
| A6 | Master switch for each list | Now built | desk:5244, 5252, 5235; `/desk/assignment/notification-settings`; baseline `direct_rules_enabled`, `round_robin_rules_enabled` | The switch is saved through the notification-settings path |
| A12 | Workflow assign to a team or agent in a team | Now built | wf `Team`, `TeamWithAgent`, `owner.teamWithAgent`; `/workflow/rules` | Same as Z17 |
| A13 | AI suggestion of ticket owner | Still missing | Searched `predict`, `zia`, owner suggestion in chunks and desk.json: nothing; `AiTaggingPage` only | Absence only; confirm whether in scope |
| A15 | API: one rule, preferences, skill types, availability, ticket counts | Partly | `index`: `/desk/assignment-rules/${id}`, `/desk/departments/${id}/round-robin-preferences`, `/desk/skill-types`, `/desk/agents/presence/query`, `/desk/teams/${id}/workload` | `tickets-count` not found. Earlier 404s on `/desk/routing-preferences`, `/desk/agents/online` are explained by different paths (inferred). GET one rule not confirmed |

## Round robin

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| A7 | Exclude agents when pool is a team | Now built | desk:5488-5489, desk:5283; `/desk/assignment-rules` | Run 6-7 Nov E-05 exercised it |
| A8 | Online agents only, with a switch for offline | Now built | desk:5709-5712; `/desk/departments/${id}/round-robin-preferences` | Run 6-7 Nov bug B-2: Email channel is ignored. Re-check at runtime |
| A9 | Department and per-agent ticket limits | Now built | desk:5713-5727; same API | Run 6-7 Nov I-12: count crosses departments |
| A10 | Backlog switch, per-run limit, order | Now built | desk:5728-5736; same API | Backlog tab is gone: tabs are Rules, Team Assignment, Notifications (desk:5214-5219) |
| U-02 | Round-robin preferences (inventory row) | Now built | As A8-A10, plus desk:5753-5767 "Incoming tickets", desk:5738 "Assign tickets on closure" | Inventory still says Partly |

## Skills

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| A11 | Skill types, criteria, agents per skill | Now built | desk:5538-5584; `SkillsPage-Dn_sr2GW.js`; `/desk/skills`, `/desk/skill-types` | Own Skills page (desk:5771-5785) |
| S1 | Skills per department | Now built | desk:5785, 5522, 5580; `/desk/skill-types?department_id=`; baseline `department_id` on skills | |
| S2 | Active / Inactive | Now built | desk:5545-5546, 5576; `/desk/skills/${id}`; baseline `is_active` | |
| S3 | Add Skill on the page, type required | Now built | desk:5543, 5571-5581 `typeRequired`; `/desk/skills` | |
| S4 | Agents on the skill form | Now built | desk:5566-5570; `/desk/skills/${id}/agents` | |
| S5 | Search and filters | Now built | desk:5617-5631; `/desk/skills` | Filtering may be client side (not checked) |
| S6 | Reorder skills | Now built | desk:5550, 5555; `/desk/skills/order` | |
| S7 | Recalculate / assign for one ticket | Now built | `index` `recalculateSkills` -> `skills/recalculate`, `assignBySkills` -> `skills/assign`; desk:5596-5608 (bulk run), `/desk/skills/recalculations` | Ticket-menu text is in another locale. Run 6-7 Nov H-08, H-09 saw it |
| S8 | Show where a skill is used | Now built | desk:5633-5657; `/desk/skills/${id}/usage` | |
| S9 | Limits | Partly | desk:5544, 5610 active limit per department | Per-ticket limit not found in bundle. Run 6-7 Nov H-11 saw 10 per ticket |
| U-03 | Skills and routing (inventory row) | Partly | As above | Follows S9; inventory wording is out of date |

## Workflow

All API evidence is `/workflow/rules` and `/workflow/actions` in `index` unless stated. Action availability comes from the Desk `extraActionTypes` list and the `available:!0` table in `index`.

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| Z1 | Customer Reply trigger | Now built | `index` `[customer_reply, agent_response, private_thread, comment, rating]`; wf `TicketEvent`, `ticketEvents.*` | Baseline: 0 of 50 live rules use it |
| Z2 | Agent Response trigger | Now built | Same list | |
| Z3 | Private Thread trigger | Now built | Same; wf `[any, incoming, outgoing]`, `ticketEvents.privateThreadsLabel` | |
| Z4 | Happiness Rating trigger | Now built | Same; `index` `[good, okay, bad]`, wf `ticketEvents.ratingsLabel` | |
| Z5 | Comment trigger | Now built | Same; wf `[any, public, private]`, `ticketEvents.commentsLabel` | |
| Z6 | Several watch fields, Any / All | Now built | wf `recordAction.addWatchField`, `matchAll`, `matchAny` | Limit not read |
| Z7 | One rule on several events | Partly | wf `ticketEvents.events` is a list | Ticket events combine with each other. Create / Edit are a separate trigger kind, so Create + Customer Reply in one rule is not shown |
| Z8 | Rules per department | Now built | wf `rule-department-scope`, `departments.*`, `caps.rulesPerDepartment`; baseline `departmentIds` on rules | |
| Z9 | Active / Inactive filter | Now built | wf `list.status.all`, `.active`, `.inactive` | Filter, not tabs |
| Z10 | Contact and account conditions | Now built | `index` `relatedFields:{moduleKey:desk_tickets, lookups:[contact_id, account_id]}`; wf `withRelatedFields` | Field list comes from the server |
| Z11 | Business hours and holiday conditions | Now built | `index` `executionTime` options `business_hours`, `outside_business_hours`, `holiday` | Which business-hours set is used: live check |
| Z12 | More ticket fields in conditions | Partly | `index` `conditionFieldKeys` has 19 of the 20 left-out fields; `ruleFacts` adds thread and comment counts, overdue | 10 are in `valueOnlyFieldKeys` (meaning unknown). Name and To Address not found |
| Z13 | Missing operators | Now built | `index` `not-contains`, `between`, `not-between`, `currentTimeCondition:!0` | |
| Z14 | Add Comment | Now built | `AddTicketComment`; wf `ticketActions.comment.*` | |
| Z15 | Send Email Reply | Now built | `SendTicketReply`; wf `ticketActions.reply.*` | Baseline: used 9 times on live rules |
| Z16 | Alert to contact and outside addresses | Partly | wf `principal.kind.contact`, `.team`, `.emailField` | Contact and team found. Typed outside addresses not found |
| Z17 | Assign to team / agent in team | Now built | wf `TeamWithAgent`, `owner.teamWithAgent`, `owner.teamHint` | |
| Z18 | Same action type more than once | Now built | wf `editor.validate.duplicateAction` rejects only identical actions | Old "each action once" text cannot be checked (locale) |
| Z19 | Add Followers | Now built | `AddTicketFollowers`; wf `ticketActions.followers.*` | |
| Z20 | Mark as Spam, with contact | Now built | `MarkTicketSpam`; wf `ticketActions.spam.contact` | |
| Z21 | Share Ticket | Now built | `ShareTicket`; wf `ticketActions.share.*` with `read_only`, `restricted`, `full` | Baseline: used 35 times on live rules |
| Z22 | Change Layout | Now built | `ChangeTicketLayout`; wf `ticketActions.layout.*` | |
| Z23 | Custom Functions | Now built | `RunCustomAction`; `/workflow/custom-actions`; wf `customActionRule.*` | Offered only if a custom action exists (`index`) |
| Z24 | Chat notifications | Partly | `SendSlackNotification`, `SendTeamsNotification`, `SendGoogleChatNotification`; wf `chatActions.slack.*` | Cliq: 0 hits. Offered only with a connection |
| Z25 | Reply / notify via instant messaging | Needs live check | `ReplyViaIm`, `NotifyViaIm`; wf `imActions.*`; `/desk/im-options` | Offered only with a connected brand. Inventory N-14 says IM is not in Desk |
| Z26 | Skills actions | Now built | `AddTicketSkills`, `RemoveTicketSkills`, `RecalculateTicketSkills`, `ReassignTicketBySkills` | Baseline: one live rule uses Reassign |
| Z27 | AI actions | Still missing | Searched `zia`, `predict`, `generate content`, field extraction: nothing | Absence only |
| Z28 | Ticket history names the rule and failure | Needs live check | No rule-name field found in searched ticket chunks; ticket locale not downloaded | Run 6-7 Nov D-01 saw the rule name for a direct rule. Workflow rules not seen |

## Blueprint

Strings are in `settings.json`. API is `/modules/${t}/blueprints` (`blueprint-api.client-nH6zKqjG.js`) unless stated.

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| 1 | Strict Mode | Now built | settings:153-181 (three scopes, six actions); `strict-mode-BX4Bs2WG.js` | Enforcement on tickets: live check |
| 2 | Change transition owners inside a ticket | Now built | settings:182-183; `/modules/${t}/records/${n}/blueprint/owners/${r}` | |
| 3 | Order of transition buttons | Now built | settings:411-413 | |
| 4 | Field check with own message | Now built | settings:330-336, 249 `fieldValidationIncomplete` | Saved inside the definition |
| 5 | Submit for approval | Now built | settings:312, 321, 418-419, 248; `/workflow/approvals` | `index` flag `approvalProcess: available:!1` is in a shared table; live check |
| 6 | Share as a step | Now built | settings:313, 322, 427-429 | |
| 7 | Widgets in the transition form | Still missing | "widget" absent from settings.json and designer | Absence only |
| 8 | Save a half-done transition | Needs live check | `ticket-blueprints.client-DlBShEXw.js` `saveTransitionDraft`, `/blueprint-transitions/${id}/draft`, `/drafts` | API found; no screen string readable (ticket locale) |
| 9 | Required items per agent group | Now built | settings:420-425 `requiredFor*` | |
| 10 | Certain ratings or replies only | Partly | settings:404-410 `ratingValues` Good / Okay / Bad | Ratings found. Public / private reply choice not found (`onReplyTransitionId` only) |
| 11 | Several escalation levels per state | Now built | settings:435-458 | |
| 12 | Choose business-hours set for a state | Now built | settings:430-434 `businessHoursSet` | No separate holiday-list picker found |
| 13 | Blueprint views, column, filter | Now built | `index` `active-blueprint`, `all-transitions`, `my-transitions`, `team-transitions`, `unassigned-transitions`; `useQueueColumns-DaqkyfSn.js` `blueprint_name`; `filter-fields-CcASFjzh.js` `Blueprint` | |
| 14 | Blueprint dashboard | Partly | `BlueprintDashboardPage-DZhugsW_.js`; `/desk/blueprints/dashboard`; desk:10480-10527 | Date range and blueprint filters, met / missed, average, transitions run found. Agent filter not found |
| 15 | Separate revoke permission | Now built | `permissions-CiupNE8J.js` `desk:ticket:blueprint_revoke`; `BlueprintMembershipDialogs-DuE-9GLg.js` checks it | Spec run status also records it |

## SLA

The inventory has no SLA gap rows (see "Input problem"). Blueprint items 11 and 12 are the SLA tie-in and are counted under Blueprint.

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| NDC-2266 a | Roles and contacts as escalation recipients | Now built | desk:6452-6458; `/desk/sla/meta`; baseline `recipient_kinds` | Contact only at or after due time (desk:6536) |
| NDC-2266 b | Email template per level | Now built | desk:6461-6470; `/desk/sla/escalation-templates` (baseline 200) | |
| NDC-2266 c | Countdown view | Needs live check | `queue-columns-D40DeVaS.js`, `RecordsWorkspace-B5mw89mO.js` `countdown` | A ticket board card field; whether it shows SLA time is not clear |
| O-03 | Business-hours block past midnight | Needs live check | No `midnight` or `overnight` string in desk.json or the business-hours chunks | The refusal came from the server on 1 Nov |

## Notifications

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| A14 | Per department, per channel, templates, new-ticket alert | Now built | desk:5678-5697, desk:7886-8088 (`department_ticket_created` at 8044); `NotificationRulesPage-BMVlxUmC.js`, `NotificationTemplateField-BGyWC5eC.js`; `/desk/notification-rules/departments/${id}/rules/${rule}` | Baseline `notifRules` 404 is the bare path, not the path the app uses. It is not evidence of absence |

## Macros

No gap row exists in any input. T-35 is listed as Built; NDC-1987 is in state Bug per `plane-desk-items.md`. For reference, the bundle has 9 action kinds (desk:5813-5823), "Who can use this macro" (desk:5932-5943) and `/desk/macros`.

## Other inventory automation rows (not counted above)

| Id | Gap | Verdict | Evidence | Note |
|---|---|---|---|---|
| U-10 | Supervisor rules | Still missing | 0 hits for `supervisor-rules`, `supervisorRules`; baseline `probe_supervisor` 404 | Probe path may be wrong |
| U-11 | Schedules | Needs live check | Baseline `probe_schedules` 404; `/schedules` strings in `pages-J2UCuvkc.js` not traced | |
| U-14 | Webhooks list, API keys | Still missing | 0 hits for `/webhooks`, `/api-keys` | Webhook as a workflow action exists |
| U-16 | General auto-close | Partly | `TicketArchivingPage-BrxCpy5X.js` `autoClose`, `auto_close` | Inventory says archiving only; not read further |

## In the bundle, not in the gap lists or specs

Mention counts were taken with a text search over the 8 gap lists and specs, plus the v2 requirements file. Paths or names with no hit are listed below. Some sit in code shared with CRM, so a hit does not prove the screen is offered in Desk.

**Screens**
- `SupportPlansPage` at `automation/support-plans`, with `/desk/sla/support-plans` and `/desk/sla/contracts/${id}/plan`.
- `MassActionsPage`, with `/desk/tickets/mass`.
- `ScheduledRepliesPage`, with `/desk/scheduled-replies`.
- Automation route `/settings/automation/ai-tagging` (the name "AI Tagging" appears once in the lists; the path does not).

**Workflow triggers and actions**
- Triggers: `RecordScoreChanged`, `NoteAdded`.
- Actions: `UpdateRelatedRecord`, `SendPortalAccess`, `CreateConnectedRecord`, `CreateMeeting`, `ScheduleCall`.

**API paths**
- `/workflow/review-processes`, `/workflow/review-rejection-reasons`, `/workflow/my-requests`, `/workflow/rules/limits`.
- `/workflow/custom-actions/sources`, `/variables`, `/runs`, `/bulk-runs` (custom actions are mentioned in the lists; these paths are not).
- `/workflow/approval-processes` (the phrase "approval process" appears once; the path does not).
- `/desk/agent-presence/settings`, `/desk/agents/presence/query`, `/desk/agents/me/presence` and `/heartbeat`, `/desk/queues/agents`, `/desk/queues/teams`, `/desk/teams/${id}/workload`.
- `/desk/skill-preferences`, `/desk/skills/recalculations`, `/desk/skills/order`.
- `/desk/sla/meta`, `/desk/sla/escalation-templates`.
- `/notifications/admin/policy` and the "Allow SMS for Desk" switch (desk:8089-8105).
- `/modules/${t}/records/${n}/blueprint/owners/${r}`, `/blueprint-transitions/drafts`.
