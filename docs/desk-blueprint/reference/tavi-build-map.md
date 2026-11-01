# TAVI Desk — what the build ships for Blueprints (1 Nov 2026)

Host `https://staging-desk.taviportal.com`, org **Anyware** (owner `anyware-staging-owner@…`; the account also opens a Sandbox org, not used). Bundle `index-Dhp544pg.js`. Read from the code (`BlueprintsSetupPage-8Vb3t2vh.js`, `DeskBlueprintDesignerPage-C-r_r5Qa.js`, `BlueprintMembershipDialogs-fCQEfTAl.js`, `blueprint-api.client-CCTWQSGf.js`, `ticket-blueprints.client-BLMqu4zR.js`, `desk-transition-rules-DEcjkBZM.js`, `useRecordStatusChange-*.js`, `TicketBulkDialogs-*.js`), the locales `settings` (blueprints.*, ~330 strings) and `desk-tickets` (ticket.blueprint.*, history.*, ~100 strings), the live API (GET only) and the pages, as the owner.

Nothing was saved. The designer of two existing blueprints was opened and one state and one transition were selected (panels closed without Save). `/new` was opened and left. Two tickets inside a blueprint were opened; no transition button was pressed.

## Pages
- **Setup → Automation → Blueprints** — `/settings/automation/blueprints`. Subtitle "Set the steps a department's tickets follow, who runs each step and what it asks for."
  - Grouped by department; "Blueprints without a department" group ("Saved before blueprints had departments. It governs no ticket until you choose one.").
  - Row: mini diagram, name, layout ("Any layout"), states count, Draft badge, "{{n}} tickets in progress", Active/Inactive.
  - Row menu: Edit · Activate/Deactivate · Include tickets · Revoke tickets · Delete ("It moves to the Recycle Bin"; refused with BLUEPRINT_IN_PROGRESS while tickets are inside).
  - Drag to reorder: "A ticket enters the first matching blueprint in this order." (`PATCH …/blueprints/sort`).
  - Empty / no departments: "Add a department before you create a blueprint." No access: "Ask an admin for the "Manage blueprints" permission."
- **Designer** — `/settings/automation/blueprints/:id` (and `/new`).
  - Header: name, Published/Draft, Version n, department, layout. Undo · Redo · Tidy layout · **Versions** (list, view, restore) · **Save Draft** · **Save and Publish**.
  - Left palette: **Add State** (creates a new ticket Status value: name + type Open / On Hold / Closed), Used states, Other statuses (search).
  - Details panel: Name*, Description, Layout, Criteria ("Tickets that match" / All tickets), Field = "Ticket status" (fixed), **Continuous** ("When a step's only transition asks for nothing, it runs on its own.").
  - Canvas: React Flow; common transitions box; legend Transition / Parallel branch / Ends the blueprint; zoom, fit; "Draw states and connectors on a larger screen" on phones; 16 connections per state.
  - Publish checks (issues list): name, ≥1 state, duplicate states, unnamed transitions, parallel step rules (≥2 steps, not with fork/join), unknown source/target, unreachable state, auto-transition rules (needs ≥1 minute, no mandatory items, no parallel group), customer trigger rules (must start from this state, not on exit states), state no longer a ticket status, warning before limit.
  - **State editor:** Ends the blueprint · Time limit in hours · Warn before, in hours · Clock Business hours / Calendar time (example text "Counted on a Monday to Friday, 9 to 5 week") · When it runs out → Nothing / a transition (auto) · Actions when it runs out · Actions at the warning · Customer triggers: When the customer replies, run … / When the customer rates, run … ("Nothing set, so a customer reply reopens the ticket as it does today") · Remove state (refused while tickets are in it).
  - **Transition editor:** From / To, Common toggle, name, color.
    - *Before*: Who can run this — Agent · Team · Department (another department with Full / Read only / Restricted access, auto-shared while in the state) · Ticket owner; empty = "Any agent in the department who can edit the ticket". Criteria ("The button shows only on tickets that match").
    - *During* (ordered): Reply to the contact · Internal comment · Attachment · Resolution · Field (required on/off) · Checklist (checks, each mandatory or not) · Message. Not offered in Desk (offered in CRM): field **validations**, related fields, tags, note.
    - *After* (ordered): Field update (incl. contact fields via `contact_id`) · Notification (title, body, owner, teams) · Create task (desk_tasks) · Webhook · Send email (Desk template; contact, owner, users, teams, roles; no free addresses) · Run Custom Action (active Desk custom action).
    - Parallel steps (sub-transitions with own owners) and branches (fork/join).
- **Ticket page** (`/views/all/tickets/:id`):
  - Header pill "{{blueprint}} / {{state}}", progress bar of states with "Overdue by …".
  - **Steps** card: states with "Now", "In {{state}} for …", "Due …"/"Overdue by …", "Warning …", Next step buttons; "No transitions you can run".
  - Status field locked ("Set by blueprint …"; error TICKET_IN_BLUEPRINT "This ticket follows blueprint {{name}}. Use its transitions.").
  - Transition form: items in order, required/optional, "Then: {{after actions}}", Run; retry/incomplete states; access-withheld messages; "Leave without saving them?" (no draft).
  - Revoke blueprint (ticket menu): "Take this ticket out of {{name}}? It keeps its status."
  - Reply composer: "Reply sent. The ticket stays open because it follows blueprint {{name}}."
  - History: Entered / Completed / Left / Revoked / "{{actor}} ran {{transition}}" / Moved when the customer replied / rated / automatically / when the time limit passed / share skipped (10 shared departments).
- **Ticket list:** bulk **Revoke Blueprint**; bulk status change skips governed tickets ("These were left as they are…"). No blueprint views, no blueprint/state column or filter found.
- **Include tickets** dialog: pick tickets (search number/subject), choose the entry state; "History names you."

## Permissions
`desk:blueprints:manage` only (no separate revoke or view permission).

## API (under `/api/v1`, `x-app-key: desk`)
| Method | Path | Notes |
|---|---|---|
| GET | /modules/{tickets}/blueprints?includeInactive= | list (4 on this tenant) — fields id, isActive, definition, sortOrder, hasDraft, draftVersion, department_id, in_progress_count |
| GET/POST/PUT/DELETE | /modules/{m}/blueprints[/{id}] | CRUD |
| PATCH | /modules/{m}/blueprints/sort | order |
| PUT | /modules/{m}/blueprints/{id}/draft · POST …/publish | draft / publish |
| GET | …/{id}/versions · …/versions/{v} · POST …/versions/{v}/restore | versions |
| POST | …/{id}/mass-include · …/mass-exclude | membership (CRM style) |
| POST | /desk/blueprints/{id}/include · /desk/blueprints/{id}/revoke `{ticket_ids, after}` | Desk membership |
| GET | /modules/{m}/records/{id}/blueprint-state | states, allTransitions, enteredAt, warning_due_at, escalation_due_at, auto_due_at |
| GET | /modules/{m}/records/{id}/blueprint-transitions | runnable transitions with during/after |
| POST | /modules/{m}/records/{id}/blueprint-transitions/{tid} | run (also /desk/tickets/{id}/blueprint-transitions/{tid}) |
| POST | /desk/tickets/{id}/blueprint/revoke · /desk/tickets/bulk/blueprint-revoke | revoke |

404 on 1 Nov 2026: …/blueprints/{id}/clone, /history, /stats, /tickets, /blueprints/limits, /reports, /desk/blueprints (list), /desk/blueprints/reports, /desk/blueprints/dashboard. 405: /desk/blueprints/states (GET).

Error codes: TICKET_IN_BLUEPRINT, TICKET_NOT_IN_BLUEPRINT, BLUEPRINT_NOT_OWNER, BLUEPRINT_IN_PROGRESS, BLUEPRINT_STATE_OCCUPIED, FIELD_OPTION_IN_BLUEPRINT, BLUEPRINT_STATE_CHANGED, BLUEPRINT_RUN_INCOMPLETE; skip reasons TICKET_DEPARTMENT_MISMATCH, TICKET_MERGED, TICKET_SHARE_ACCESS_DENIED, TICKET_WRITE_FORBIDDEN.

## Definition shape
`{id, name, description, moduleKey, departmentId, layoutId, layoutName, targetField:'status', continuous, entryCriteria, states:[{id, name, position, isTerminal, slaMinutes, slaPreExpiryMinutes, slaClock:business|calendar, slaEscalation:[actions], slaWarning?:[actions], autoTransitionId, autoTransitionAfterMinutes, onReplyTransitionId, onRatingTransitionId}], transitions:[{id, name, color, fromStateId, toStateId, isCommon, before:{allowOwner, allowedUserIds, teamIds, departmentOwners:[{departmentId, access, userIds, teamIds}], criteria}, during:{deskItems:[{kind:reply|comment|attachment|resolution, mandatory}], requiredFields, checklist, messages, instructionalMessage}, after:{actions:[…]}, subTransitions}]}`.

## Tenant (baseline `tavi-baseline-2026-11-01.json`)
- Blueprints: **Demo · Refund approval** (techSupport, active, 2 in progress), **Demo · Hardware RMA** (Call Center, active, 2 in progress), **Demo · Onboarding (inactive)** (DAR Review), **Test Blueprint** (Tech, inactive, continuous, layout set, after-actions of 5 kinds, state escalation notification).
- Departments: techSupport, Call Center, DAR Review, QA WF Dept R, Tech.
- Ticket statuses: Open (open), On Hold (on_hold), Escalated (open), Closed (closed), **Reopened (closed, configured)**.
- Business hours: one Default profile, **24×7**, Africa/Cairo; holiday lists "tert" and "tretre", both empty.
- SLA policies: "Chat icket", "test", "ZZQA desc 501". Ticket #805: policy "test", resolution and first response both breached; blueprint state timers on top.
- Custom actions: 13 (NDC flight actions), all active.
