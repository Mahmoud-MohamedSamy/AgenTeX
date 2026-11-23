// Builds the Desk Workflow Rules go-live regression case list (cases.json) from the
// live-build inventory read on 22 Nov 2026 (bundle index-DR1HOa4j.js, pages-zE5Y0qhw.js,
// locale crm-workflow 1,074 strings). Run: node build-cases.js
const fs = require('fs');
const path = require('path');

const cases = [];
let n = {};
function add(g, title, expected, o = {}) {
  n[g] = (n[g] || 0) + 1;
  cases.push({
    id: `${g}-${String(n[g]).padStart(2, '0')}`,
    group: g,
    title,
    expected,
    pri: o.pri || 'P1',
    type: o.type || 'Functional',
    needs: o.needs || '',
    zoho: o.zoho || '',
    bug: o.bug || '',
  });
}

// ---------------------------------------------------------------- inventory
const TRIGGERS = [
  // [key, label, family]
  ['C', 'On Create', 'record'],
  ['E', 'On Edit', 'record'],
  ['CE', 'On Create or Edit', 'record'],
  ['D', 'On Delete', 'delete'],
  ['FC', 'Field Changed', 'record'],
  ['DT', 'Date-Time field', 'date'],
  ['CR', 'Customer Reply', 'event'],
  ['AR', 'Agent Response', 'event'],
  ['PT', 'Private Thread', 'event'],
  ['CM', 'Comment', 'event'],
  ['HR', 'Happiness Rating', 'event'],
];
// timing / host flags from the bundle action registry (dK)
const ACTIONS = [
  ['FieldUpdate', 'Field Update', 'sync'],
  ['OwnerAssignment', 'Owner Assignment', 'sync'],
  ['AddTags', 'Add Tags', 'sync'],
  ['RemoveTags', 'Remove Tags', 'sync'],
  ['Email', 'Email', 'async'],
  ['Task', 'Task', 'async'],
  ['Webhook', 'Webhook', 'async'],
  ['CreateRecord', 'Create Record', 'async'],
  ['SendHappinessEmail', 'Send happiness email', 'host'],
  ['UpdateRelatedRecord', 'Update related record', 'host'],
  ['AddTicketComment', 'Add comment', 'ticket'],
  ['SendTicketReply', 'Send email reply', 'ticket'],
  ['AddTicketFollowers', 'Add followers', 'ticket'],
  ['MarkTicketSpam', 'Mark as spam', 'ticket'],
  ['ShareTicket', 'Share ticket', 'ticket'],
  ['AddTicketSkills', 'Add skills', 'ticket'],
  ['RemoveTicketSkills', 'Remove skills', 'ticket'],
  ['RecalculateTicketSkills', 'Recalculate skills', 'ticket'],
  ['ReassignTicketBySkills', 'Reassign based on skills', 'ticket'],
  ['ChangeTicketLayout', 'Change layout', 'ticket'],
  ['SendSlackNotification', 'Slack notification', 'chat'],
  ['SendTeamsNotification', 'Microsoft Teams notification', 'chat'],
  ['SendGoogleChatNotification', 'Google Chat notification', 'chat'],
  ['ReplyViaIm', 'Reply via IM', 'im'],
  ['NotifyViaIm', 'Notify via IM', 'im'],
  ['RunCustomAction', 'Function (custom action)', 'fn'],
];
// barredOnDelete = true for sync + host + ticket + chat + im; false for Email, Task, Webhook, CreateRecord, RunCustomAction
const ALLOWED_ON_DELETE_OR_DATE = new Set(['Email', 'Task', 'Webhook', 'CreateRecord', 'RunCustomAction']);
const ONCE_PER_SECTION = new Set(['OwnerAssignment', 'RemoveTags', 'SendHappinessEmail']);

// ---------------------------------------------------------------- L  Rule list + New Rule wizard
const L = 'L';
add(L, 'Rules list opens from Setup › Automation › Workflow Rules; columns Name · Module · Departments · Trigger · Mode · Actions · Status · Updated', 'Page and every column render; the 4+ teammate rules list correctly', { pri: 'P0', type: 'UI' });
add(L, 'Search rules by part of a name, by a name in another case, and by a string with no match', 'Matching rows only; "No matching rules" empty state', { type: 'UI' });
add(L, 'Module filter (All modules / Tickets / other Desk modules) and Department filter', 'List narrows correctly; counts match the API', { type: 'UI' });
add(L, 'Active / Inactive tabs (status filter) and their counts', 'Each tab shows only rules in that state', { type: 'UI', zoho: 'Zoho has Active / Inactive tabs' });
add(L, 'Trigger column text for every trigger kind (On Create … Happiness Rating: Good, Date-Field Relative with offset and "· business hours")', 'Summary text names the trigger and its options', { type: 'UI' });
add(L, 'Actions column counts instant + scheduled actions of every rule', 'Count = total actions of the rule', { type: 'UI', bug: 'NDC-2731 (CRM variant)' });
add(L, 'Row menu: Edit · Activate/Deactivate · Test rule · Delete', 'Each item works; Deactivate stops runs at once', { pri: 'P0' });
add(L, 'Bulk select + Delete (n) with the confirm text about the Recycle Bin and scheduled actions', 'Rules move to the Recycle Bin; their pending scheduled actions are cancelled', { type: 'Functional' });
add(L, 'Reorder rules (drag) and reload', 'Order persists (PUT /workflow/rules/reorder); execution follows the order', { pri: 'P1' });
add(L, 'Rule-limit display: "n of max rules used in this department" and New Rule disabled at the cap', 'Cap message from caps.rules; New Rule disabled', { type: 'Negative', needs: 'API-created filler rules in a QA department' });
add(L, 'New Rule wizard: Module, Rule Name, Description, Layout (All / one), Departments (All / selected), "When should this rule be executed?" then Next', 'Wizard opens the editor with the chosen values', { pri: 'P0' });
add(L, 'Wizard validation: no module, no name, name 255+ chars, name with only spaces', 'Inline messages; nothing saved', { type: 'Negative' });
add(L, 'Wizard: choose Ticket Event then switch module to a non-ticket module', 'Ticket Event resets to Record Action (only Tickets offer ticket events)', { type: 'Negative' });
add(L, 'Wizard trigger offer for non-ticket Desk modules (Contacts, Accounts, Tasks…)', 'Only Record Action and Date-Time; no Ticket Event, no Record Note, no Score', { type: 'Negative' });
add(L, 'Workflow settings page: sender name and sender email; default hint; invalid email; braces/line breaks; conflict reload', 'Saved sender is used by workflow emails within a minute; validation messages match', { needs: 'Mailbox to see the From line' });
add(L, 'Rule limits panel in Workflow settings (rules per module+department, actions per rule, conditions per rule)', 'Shows provider limits; matches the real caps hit in M group', { type: 'UI' });

// ---------------------------------------------------------------- TR  Record-action triggers
const TR = 'TR';
add(TR, 'On Create fires for a ticket created from the agent UI', 'Action runs once; execution history "Fired"', { pri: 'P0' });
add(TR, 'On Create fires for each ticket source: API, email-in, Help Center portal, web form, import, CRM integration', 'Fires once per new ticket from every source', { pri: 'P0', needs: 'Gmail / portal account / web form' });
add(TR, 'On Create does NOT fire on edit, comment, reply or delete', 'No execution row for those events', { pri: 'P0', type: 'Negative' });
add(TR, 'On Edit fires on field edit from ticket detail, list inline edit, bulk edit, macro, API PATCH', 'Fires once per save', { pri: 'P0' });
add(TR, 'On Edit does NOT fire on create (old NDC-2205)', 'No run on create', { pri: 'P0', type: 'Negative', bug: 'NDC-2205' });
add(TR, 'On Edit with a save that changes nothing (same value)', 'Rule does not fire, or fires per Zoho behaviour (record which)', { type: 'Negative', zoho: 'Check Zoho' });
add(TR, 'On Create or Edit fires on both and only once per save', 'One run on create, one per edit', { pri: 'P0' });
add(TR, 'On Delete fires when a ticket is deleted (single, bulk, API)', 'Allowed async action runs with the deleted ticket values', { pri: 'P0' });
add(TR, 'On Delete does NOT fire on restore from Recycle Bin, on spam, on merge', 'No run (record Zoho for merge)', { type: 'Negative', zoho: 'Check Zoho merge' });
add(TR, 'Edits made by the workflow itself (Field Update) do not re-fire On Edit rules in an endless loop', 'Loop guard stops; history shows a finite chain', { pri: 'P0', type: 'Negative' });
add(TR, 'Status change to Closed / reopen counts as Edit', 'Edit rules fire on close and on reopen', {});
add(TR, 'Blueprint transition, SLA escalation and assignment-rule owner change: do they fire Edit rules?', 'Behaviour recorded and compared with Zoho', { zoho: 'Check Zoho', bug: 'NDC-2730 (WF resets field after transition)' });

// ---------------------------------------------------------------- TF  Field Changed
const TF = 'TF';
add(TF, 'Field Changed, one watch field (Subject): fires only when Subject changes', 'Fires on Subject edit; not on other edits', { pri: 'P0' });
add(TF, 'Field Changed on each field data type: text, picklist (Status, Priority), user (Owner), lookup (Contact), date, number, checkbox, multi-select, Department, Team', 'Fires on change of that field only', { pri: 'P0' });
add(TF, '"+ Add a field": 2 and 3 watch fields with "Any of these fields changes"', 'Fires when any one of them changes', { pri: 'P0' });
add(TF, '"All of these fields change in the same save" with 2 fields', 'Fires only when both change in one save; not when one changes', { pri: 'P0' });
add(TF, 'Maximum number of watch fields; the same field cannot be picked twice', 'Picker hides fields already chosen; cap respected', { type: 'Negative' });
add(TF, '"Also run when a record is created" on / off', 'On: fires on every new ticket matching criteria, later only on field change. Off: never on create', { pri: 'P0' });
add(TF, 'Field Changed does not fire on create when "Also run on create" is off (old NDC-2205)', 'No run on create', { type: 'Negative', bug: 'NDC-2205' });
add(TF, 'Field Changed + condition "changed from X" / "changed to Y" (API ChangedFrom/ChangedTo)', 'Fires only for that transition', {});
add(TF, 'Field cleared (value → empty) and set (empty → value)', 'Both count as a change', {});
add(TF, 'Watch field later deleted from Modules & Fields', 'Editor shows "(unknown field)"; rule does not crash runs', { type: 'Negative', needs: 'QA custom field on QA layout' });

// ---------------------------------------------------------------- TD  Date-Time trigger
const TD = 'TD';
add(TD, 'Date field picker lists every date / date-time ticket field (Due date, custom date, custom date-time)', 'All date fields offered; non-date fields not offered', { pri: 'P0' });
add(TD, 'Run N minutes before the date (elapsed time)', 'Action runs at date − N min (±1 min)', { pri: 'P0' });
add(TD, 'Run N minutes after the date', 'Runs at date + N min', { pri: 'P0' });
add(TD, 'Hours and Days units, before and after', 'Offset converts correctly (seconds stored)', {});
add(TD, 'Offset 0 (at the date)', 'Runs at the date, or the UI blocks 0 (record)', { type: 'Negative' });
add(TD, 'Counting = Business hours (units only Minutes / Hours)', 'Offset counts only open hours; Days not offered', { needs: 'Business hours set (shared setting — ask first)' });
add(TD, 'Business-hours counting with no business hours set', 'Falls back to elapsed time (as the hint says)', {});
add(TD, 'Date moved later / earlier after the schedule was made', 'Schedule moves with the date', { pri: 'P0' });
add(TD, 'Date cleared before the run time', 'Scheduled run is cancelled', { pri: 'P0' });
add(TD, 'Ticket stops matching the conditions before the run time', 'Run cancelled / no match at fire time', { pri: 'P0' });
add(TD, 'Date already in the past when the ticket is saved', 'Runs at once or never (record; compare Zoho)', { zoho: 'Check Zoho' });
add(TD, 'Ticket deleted before the run time', 'Schedule cancelled, nothing dispatched', {});
add(TD, 'Date-Time rule offers only async actions (Email, Task, Webhook, Create Record, Function)', 'Other actions hidden or blocked with "can\'t run on a rule triggered … by a date"', { pri: 'P0', type: 'Negative' });
add(TD, 'Module without date fields', '"This module has no date fields, so it cannot use a date trigger."', { type: 'Negative' });

// ---------------------------------------------------------------- TE  Ticket events
const TE = 'TE';
add(TE, 'Customer Reply: customer email reply on an existing ticket', 'Fires once; not on the first email that creates the ticket', { pri: 'P0', needs: 'Gmail (anyware.software replies do not fire)' });
add(TE, 'Customer Reply via Help Center portal reply', 'Fires once', { pri: 'P0', needs: 'Portal account' });
add(TE, 'Agent Response: public reply sent by an agent', 'Fires once; not on draft save, not on comment', { pri: 'P0' });
add(TE, 'Agent Response from a workflow "Send email reply" action', 'Fires or not (record; must not loop)', { type: 'Negative' });
add(TE, 'Private Thread — Incoming and outgoing / Incoming / Outgoing', 'Each option fires only for its direction (forward sent = outgoing, forward answer = incoming)', { pri: 'P0', bug: 'NDC-2203 A4' });
add(TE, 'Comment — Any / Public only / Private only', 'Each option fires only for its comment kind', { pri: 'P0' });
add(TE, 'Happiness Rating — none ticked (every rating), Good, Okay, Bad, and two ticked', 'Fires only for the chosen ratings', { pri: 'P0', needs: 'Customer Happiness on (ask before switching)' });
add(TE, 'Several events in one rule (Customer Reply + Comment + Rating)', 'Fires for each chosen event; summary lists them', { pri: 'P0' });
add(TE, 'No event ticked', '"Pick at least one ticket event." — cannot save', { type: 'Negative' });
add(TE, 'Ticket events do not fire on create / edit', 'No run', { type: 'Negative' });
add(TE, 'Ticket event on a closed ticket (customer replies → ticket reopens)', 'Rule fires; order with reopen recorded', {});
add(TE, 'Ticket event on a spam / archived ticket', 'Does not fire (record Zoho)', { type: 'Negative', zoho: 'Check Zoho' });

// ---------------------------------------------------------------- RM  Rule mode + scope
const RM = 'RM';
add(RM, 'Recurring: fires every time a save matches', 'Fires on 3 matching edits = 3 runs', { pri: 'P0' });
add(RM, 'One time: fires at most once per ticket even if it matches again', '1 run after 3 matching edits', { pri: 'P0' });
add(RM, 'One time per trigger family: Create or Edit, Field Changed, Ticket Event, Date-Time', 'Once per ticket in every family', {});
add(RM, 'One time after the rule is edited / deactivated and reactivated', 'Record whether the "already ran" memory resets (compare Zoho)', { zoho: 'Check Zoho' });
add(RM, 'Layout scope = one layout: ticket on that layout fires, ticket on another layout does not', 'Only the chosen layout fires', { pri: 'P0', needs: 'QA WF Layout (user rule: never touch Standard)' });
add(RM, 'Layout scope + "Change layout" action moving the ticket out of the scope', 'Later runs follow the new layout', {});
add(RM, 'Department scope = All departments', 'Fires for tickets of every department', { pri: 'P0' });
add(RM, 'Department scope = selected (1 and 2 departments)', 'Fires only for tickets in those departments', { pri: 'P0' });
add(RM, 'Ticket moved to another department after create', 'Edit rules of the new department fire; old department rules stop', { pri: 'P0' });
add(RM, 'Inactive department and deleted department in the scope list', '"(inactive)" / "Deleted department" shown; rule still saves', { type: 'Negative' });
add(RM, 'Active vs inactive rule', 'Inactive never fires; activation takes effect at once', { pri: 'P0' });

// ---------------------------------------------------------------- CL  Condition structure
const CL = 'CL';
add(CL, '"All Tickets" (no conditions)', 'Every event of the trigger runs the actions; "No conditions" hint shown', { pri: 'P0' });
add(CL, 'One condition, AND of 3, OR of 3', 'Truth table checked with matching and non-matching tickets', { pri: 'P0' });
add(CL, 'Mixed connectors (1 AND 2 OR 3) toggled per connector', 'Evaluated in the shown order; summary correct', { pri: 'P0' });
add(CL, 'Criteria Pattern: (1 and 2) or 3, 1 and (2 or 3), nested brackets', 'Pattern overrides connectors; evaluates as written', { pri: 'P0' });
add(CL, 'Invalid pattern: missing number, unbalanced bracket, unknown number 9, words other than and/or', 'Apply refused with a message', { type: 'Negative' });
add(CL, 'Remove a condition that the pattern uses', 'Pattern updates or warns', { type: 'Negative' });
add(CL, '25 conditions (max) and the 26th', '"Limit reached — a rule can have at most 25 conditions."', { type: 'Negative' });
add(CL, 'Incomplete condition (no field / no operator / no value)', '"Complete the incomplete conditions." — cannot save; row highlighted', { type: 'Negative' });
add(CL, 'Membership with zero values; empty text value', 'Blocked: "Membership checks must contain at least one value." / "Every condition must have a value"', { type: 'Negative' });
add(CL, 'Condition values shown after reopening the rule (labels, not ids)', 'Picklist/user/lookup/tag/department values show names', { pri: 'P0', type: 'UI', bug: 'NDC-3057' });
add(CL, 'Field list offered in conditions = ticket fields + Tags + related Contact/Account fields + facts; system fields (Ticket Number, Closed Time, SLA name/violated/escalated, Created/Modified by/at…) value-only', 'Every field from GET /modules/{tickets}/fields is offered with the right operators', { pri: 'P0' });
add(CL, 'Whole-address condition', 'Message "A condition on a whole address does not work. Pick one part…"', { type: 'Negative' });
add(CL, 'Picklist field with no options configured', '"This field has no options configured, so a value must be typed."', { type: 'Negative' });

// ---------------------------------------------------------------- CO  Operators by data type (generated)
const CO = 'CO';
const OPS = {
  'Text (Subject, Description, custom single-line, email, phone)': ['equals', 'does not equal', 'contains', "doesn't contain", 'starts with', 'ends with', 'is one of', 'is not one of', 'is empty', 'is not empty', 'changed'],
  'Number (custom number, Number of Threads)': ['=', '≠', '>', '≥', '<', '≤', 'between', 'not between', 'is empty', 'is not empty', 'changed'],
  'Checkbox (Is Spam, Customer Responded, custom checkbox)': ['is True', 'is False', 'is empty', 'is not empty', 'changed'],
  'Date (custom date)': ['on', 'after', 'on or after', 'before', 'on or before', 'between', 'not between', 'is empty', 'is not empty', 'changed'],
  'Date-time (Due date, Created Time, Response Due, custom date-time)': ['on', 'after', 'on or after', 'before', 'on or before', 'between', 'not between', 'is empty', 'is not empty', 'changed'],
  'Pick list (Status, Priority, Channel, Classification, Language, Happiness Rating)': ['is', 'is not', 'is one of', 'is not one of', 'is empty', 'is not empty', 'changed'],
  'Department / Team / Shared departments': ['is', 'is not', 'is one of', 'is not one of', 'is empty', 'is not empty', 'changed'],
  'Multi-select (custom multi-select)': ['contains any of', 'contains none of', 'is empty', 'is not empty', 'changed'],
  'Tags': ['contains any of', 'contains all of', 'contains none of', 'is empty', 'is not empty'],
  'Lookup (Contact, Account, Product)': ['is', 'is not', 'is one of', 'is not one of', 'is empty', 'is not empty', 'changed'],
  'User (Owner, Created By, Modified By)': ['is', 'is not', 'is one of', 'is not one of', 'is empty', 'is not empty', 'changed'],
};
for (const [dt, ops] of Object.entries(OPS)) {
  for (const op of ops) {
    const trig = op === 'changed' ? 'On Edit' : 'On Create';
    add(CO, `${dt} — "${op}"`, `${trig} rule: matching ticket runs the action, non-matching ticket does not (both checked)`, {
      pri: ['equals', 'is', 'contains any of', 'is one of', '=', 'on', 'is True'].includes(op) ? 'P0' : 'P1',
      type: 'Functional',
    });
  }
}
add(CO, 'Text operators are case-insensitive or not (Subject "QA" vs "qa")', 'Behaviour recorded and compared with Zoho', { zoho: 'Check Zoho' });
add(CO, 'Text with Arabic, emoji, leading/trailing spaces, 2,000+ chars', 'Matches as typed; no 500', { type: 'Edge' });
add(CO, 'Number boundaries for ≥ / ≤ / between (equal to the bound), negative and decimal values', 'Bounds inclusive as the label says', { type: 'Edge' });
add(CO, 'Date-time "Current Time" as the compare value (after / before / on or after / on or before)', 'Compared with the run time', { pri: 'P0' });
add(CO, 'Date "between" with From later than To', 'Blocked or never matches (record)', { type: 'Negative' });
add(CO, 'Date / date-time conditions in the tenant time zone (ticket near midnight)', '"on" uses the tenant time zone', { type: 'Edge' });
add(CO, 'Tags from All departments vs one department; deleted tag in a saved condition', '"Deleted tag" label; rule still runs', { type: 'Edge' });
add(CO, 'Pattern / length operators (matches pattern, length is…) — offered in Desk?', 'If offered: regex works, invalid regex warns "will never match"; if not: TAVI CRM-only', { type: 'Functional' });

// ---------------------------------------------------------------- CF  Related fields + facts
const CF = 'CF';
add(CF, 'Contact fields (contact_id.*): text, email, picklist, checkbox', 'Condition reads the linked contact', { pri: 'P0' });
add(CF, 'Account fields (account_id.*)', 'Condition reads the linked account', { pri: 'P0' });
add(CF, 'Related field when the ticket has no contact / no account', 'Treated as empty; no failure', { type: 'Negative' });
add(CF, 'Contact edited after ticket create, then ticket edited', 'Edit rule sees the new contact value', {});
add(CF, 'Number of Threads (=, >, between) on Edit and Ticket Event rules', 'Counts threads correctly', { pri: 'P0' });
add(CF, 'Number of Comments', 'Counts comments correctly', { pri: 'P0' });
add(CF, 'Recent Comment (text operators) and Recent Comment Type (Public / Private)', 'Uses the latest comment', { pri: 'P0' });
add(CF, 'On-create notes for the facts: threads/comments "same answer for every new ticket" warning; Is Overdue info note', 'Notes show on On Create rules only', { type: 'UI' });
add(CF, 'Is Overdue true / false (due date passed)', 'Matches tickets past due', { pri: 'P0' });
add(CF, 'Execution Time = During business hours / Outside business hours / On a holiday', 'Matches the run moment against business hours and holidays', { pri: 'P0', needs: 'Business hours + a holiday (shared — ask first)' });
add(CF, 'SLA fields: SLA name, SLA violated, SLA escalated, Response due, First response at', 'Values match the ticket SLA state', { needs: 'QA SLA on a QA department' });
add(CF, 'Happiness Rating + Happiness link status as conditions', 'Match the ticket rating state', {});

// ---------------------------------------------------------------- AC  Core actions (full options)
const AC = 'AC';
add(AC, 'Field Update: one field of each data type (text, picklist, number, date, date-time, checkbox, multi-select, user, lookup, address part)', 'Each value saved on the ticket', { pri: 'P0' });
add(AC, 'Field Update: several fields in one action; merge field ${subject} / ${recordId} in a text value', 'All set; placeholders filled', { pri: 'P0' });
add(AC, 'Field Update: read-only / system / formula / auto-number fields not offered (Created By old B-2)', 'Not in the picker; API refuses', { type: 'Negative', bug: 'Oct B-2' });
add(AC, 'Field Update: clear a field (empty value)', 'Field emptied, or blocked (record)', { type: 'Edge' });
add(AC, 'Field Update: Status to Closed (closing side effects: closed time, happiness mail, SLA stop)', 'Same side effects as a manual close', { pri: 'P0' });
add(AC, 'Owner Assignment → a user', 'Owner set; owner notified in-app', { pri: 'P0' });
add(AC, 'Owner Assignment → role (round robin over members) — 3 tickets', 'Members take turns', { pri: 'P0', bug: 'Oct B-9' });
add(AC, 'Owner Assignment → profile; → user field (e.g. Created By)', 'Owner = a member / the field user', {});
add(AC, 'Owner Assignment → team; team + "Also assign an agent of this team"', 'Team set, owner cleared / team + agent set', { pri: 'P0', bug: 'NDC-2203 D1 (team ignored on create)' });
add(AC, 'Owner Assignment → An assignment rule (active / inactive / deleted rule)', 'Rule entries + fallback pick the owner; inactive/deleted labelled', { pri: 'P0' });
add(AC, 'Owner Assignment options: Only online users (none online → keeps owner), Email the new owner, Transfer related records', 'Each option works', {});
add(AC, 'Owner Assignment to an agent without department access / suspended agent', 'Skipped or refused with a clear history line', { type: 'Negative', needs: 'Suspend a QA agent (ask first)' });
add(AC, 'Add Tags: append vs replace; tags from the ticket department; inline create off', 'Tags set as chosen', { pri: 'P0' });
add(AC, 'Remove Tags: tag present / not present', 'Removed / no error', {});
add(AC, 'Email: Desk template to agents, teams, roles (+ subordinates), user field, ticket contact', 'Each recipient gets the email with filled placeholders', { pri: 'P0', needs: 'Gmail inbox' });
add(AC, 'Email: template for agents never sent to the contact; no template; no recipient', 'Agent template skips the contact; validation for empty template / recipients', { type: 'Negative' });
add(AC, 'Email: free-text address not allowed', '"Free-text addresses aren\'t allowed."', { type: 'Negative' });
add(AC, 'Task: title, description, due (specific date / trigger date + N days), status, priority, assignee (default owner), Notify assignee', 'Task created in Desk Tasks with every value and linked to the ticket', { pri: 'P0' });
add(AC, 'Webhook: POST / PUT / PATCH, headers, body template with ${field}, timeout', 'Receiver gets method, headers and filled body', { pri: 'P0', needs: 'webhook.site' });
add(AC, 'Webhook: receiver 5xx (retry), 404, timeout, bad URL', 'Retries on 5xx; failure shown as Failed (old B-4 404 shown as cancelled)', { type: 'Negative', bug: 'Oct B-4' });
add(AC, 'Create Record: Tickets, Tasks, Contacts, Accounts with layout and values; required fields', 'Record created; required fields enforced (old B-8)', { pri: 'P0', bug: 'Oct B-8' });
add(AC, 'Create Record: "Fill in every field" validation', 'editor.validate.createRequired message', { type: 'Negative' });
add(AC, 'Send happiness email on a closed ticket / open ticket', 'Rating link mail sent to the contact', { needs: 'Customer Happiness on (ask first)' });
add(AC, 'Update related record: Contact and Account fields with ${field} values', 'Linked contact/account updated', { pri: 'P0' });
add(AC, 'Update related record when the ticket has no contact', 'Skipped with a history line', { type: 'Negative' });
add(AC, 'CRM-only actions (Meeting, Schedule a Call, Create Connected Record, Send portal access) are not offered in Desk', 'Not in the picker; API refuses for Desk', { type: 'Negative' });

// ---------------------------------------------------------------- AT  Ticket actions
const AT = 'AT';
add(AT, 'Add comment — Private', 'Private comment by the system on the ticket', { pri: 'P0' });
add(AT, 'Add comment — Public (contact gets it by email)', 'Public comment + email to contact', { pri: 'P0', needs: 'Gmail' });
add(AT, 'Add comment with ${field} placeholders and long / Arabic text', 'Filled and shown correctly', { type: 'Edge' });
add(AT, 'Send email reply: to ticket contact, "Also send to" addresses, subject empty (keeps ticket subject) / custom subject', 'Reply in the thread from the channel address', { pri: 'P0', needs: 'Gmail' });
add(AT, 'Send email reply without the contact (only extra addresses)', 'Goes as a private thread (as the hint says)', {});
add(AT, 'Add followers: agents with and without department access', 'Agents without access skipped', { pri: 'P0' });
add(AT, 'Mark as spam (ticket only) and + "Also mark the contact as spam"', 'Ticket to spam; contact blocked when ticked', { pri: 'P0', type: 'Functional' });
add(AT, 'Share ticket with another department — Read only / Restricted / Full; with its own department', 'Agents of that department see it with that access; own department no-op', { pri: 'P0' });
add(AT, 'Add skills (1..max); skill already on ticket skipped', 'Skills added', {});
add(AT, 'Remove skills (incl. a skill no longer offered)', 'Skills removed', {});
add(AT, 'Recalculate skills (criteria match / no longer match / no criteria)', 'Adds matching, removes non-matching, leaves no-criteria skills', {});
add(AT, 'Reassign based on skills (agent with skill + fewest open tickets; no one qualifies)', 'Owner set to that agent / nothing changes', { pri: 'P0', needs: 'Online skilled QA agent' });
add(AT, 'Change layout (to QA WF Layout; ticket already in it; layout unavailable)', 'Ticket moves; no-op; unavailable label', { needs: 'QA WF Layout' });

// ---------------------------------------------------------------- AX  Chat, IM, function
const AX = 'AX';
add(AX, 'Slack notification: workspace, 1..max channels, header / sub heading / body with placeholders', 'Message in each channel', { needs: 'Authorized Slack connection (none in Oct)' });
add(AX, 'Microsoft Teams notification (department webhook)', 'Message posted', { needs: 'Teams webhook on the department' });
add(AX, 'Google Chat notification (department webhook)', 'Message posted', { needs: 'Google Chat webhook' });
add(AX, 'Reply via IM: brand, text; 24-hour window closed → WhatsApp template fallback', 'Reply in the IM chat / template sent', { needs: 'WhatsApp brand (none in Oct)' });
add(AX, 'Notify via IM', 'Notification sent', { needs: 'WhatsApp brand' });
add(AX, 'Chat / IM actions with no connection: picker state, saved rule with a removed connection', '"Unavailable" labels; validation "Finish the action"', { type: 'Negative' });
add(AX, 'Function (custom action): published desk custom action; inputs from record fields / filled by action / no input', 'Runs with record values; run shows in automation history', { pri: 'P0', needs: 'QA custom action (publish)' });
add(AX, 'Function: unpublished / deleted custom action; CRM-only custom action', 'Not offered / "(unavailable)"; legacy name warning', { type: 'Negative' });

// ---------------------------------------------------------------- AM  Action mechanics
const AM = 'AM';
add(AM, 'Instant actions run in the listed order', 'Order visible in execution detail', { pri: 'P0' });
add(AM, 'Scheduled action for every action type (default delay 1 day; set minutes / hours / days)', 'Runs after the delay; every type can be scheduled', { pri: 'P0' });
add(AM, 'Scheduled action cancelled when the ticket stops matching before the delay', 'Cancelled; history row (old B-7 no dispatch row)', { pri: 'P0', bug: 'Oct B-7' });
add(AM, 'Scheduled action when the rule is deactivated / deleted before the delay', 'Cancelled', { pri: 'P0' });
add(AM, 'Rule with 10 actions (max) and the 11th', '"Limit reached — a rule can have at most 10 actions."', { type: 'Negative' });
add(AM, 'Same action type twice (Field Update ×2, Webhook ×2) allowed; Owner Assignment / Remove Tags / Send happiness email only once per section', 'Repeats allowed except the 3 once-only types', { pri: 'P0' });
add(AM, 'Two identical actions', '"Two actions are identical — remove or change the duplicate."', { type: 'Negative' });
add(AM, 'Action that fails (webhook 500) does not stop the other actions', 'Others still run; outcome shows partial failure', { pri: 'P0' });
add(AM, 'Two Field Updates on the same field in one rule', 'Last one wins (record)', { type: 'Edge' });
add(AM, '"Use a saved action" slot with no pick', '"Pick a saved action for each slot."', { type: 'Negative' });
add(AM, 'Remove an action; change an action type after setup', 'Removed cleanly; draft re-validates', { type: 'UI' });

// ---------------------------------------------------------------- MX  Trigger × action save matrix (generated)
const MX = 'MX';
for (const [tk, tl, fam] of TRIGGERS) {
  const barred = ACTIONS.filter(([k]) => (fam === 'delete' || fam === 'date') && !ALLOWED_ON_DELETE_OR_DATE.has(k)).map(a => a[1]);
  const allowed = ACTIONS.filter(([k]) => !((fam === 'delete' || fam === 'date') && !ALLOWED_ON_DELETE_OR_DATE.has(k))).map(a => a[1]);
  add(MX, `${tl}: action picker + save for all 26 actions (instant and scheduled)`, barred.length
    ? `Allowed (${allowed.length}): ${allowed.join(', ')}. Barred (${barred.length}) in UI and API: ${barred.join(', ')}`
    : `All 26 offered and save (UI + POST /workflow/rules)`, { pri: 'P0', type: 'Matrix' });
}

// ---------------------------------------------------------------- RC  Runtime combinations (trigger family × every action)
const RC = 'RC';
const FAMILIES = [
  ['Record action (On Create)', 'record'],
  ['Record action (On Edit / Field Changed)', 'record'],
  ['Ticket event (Comment / Agent Response)', 'event'],
  ['Date-Time', 'date'],
  ['On Delete', 'delete'],
];
for (const [fl, fam] of FAMILIES) {
  const acts = ACTIONS.filter(([k, , t]) => (fam === 'delete' || fam === 'date') ? ALLOWED_ON_DELETE_OR_DATE.has(k) : !['chat', 'im'].includes(t));
  add(RC, `${fl} runs each allowed action for real (${acts.length} actions, packed up to 10 per rule)`, `Every action leaves its result on the ticket / receiver: ${acts.map(a => a[1]).join(', ')}`, { pri: 'P0', type: 'Matrix' });
}
add(RC, 'Chat + IM actions on Create, Edit and a Ticket event', 'Message sent each time', { type: 'Matrix', needs: 'Slack / Teams / Google Chat / WhatsApp connections' });
add(RC, 'Each action as a scheduled action under a record trigger and a ticket-event trigger', 'Runs after delay with values at run time', { pri: 'P0', type: 'Matrix' });

// ---------------------------------------------------------------- TC  Trigger × condition combos
const TC = 'TC';
add(TC, '"changed" operator on On Create (nothing changed yet)', 'Never matches on create, or the UI hides it (record)', { type: 'Negative' });
add(TC, '"changed" on On Edit and on Field Changed', 'Matches only when that field changed in the save', { pri: 'P0' });
add(TC, 'On Delete with conditions on the deleted ticket values', 'Conditions see values before delete', { pri: 'P0' });
add(TC, 'Date-Time with conditions: checked at schedule time and again at fire time', 'Not matching at fire time = no run', { pri: 'P0' });
add(TC, 'Ticket event + ticket field condition (Customer Reply where Priority is High)', 'Fires only on high tickets', { pri: 'P0' });
add(TC, 'Ticket event + facts (Comment where Recent Comment Type = Private, Number of Threads > 2)', 'Facts reflect the event that fired', { pri: 'P0' });
add(TC, 'Create or Edit + related Contact condition', 'Works on both', {});
add(TC, 'Execution Time condition on each trigger family', 'Uses the run moment (date rules: fire moment)', {});
add(TC, 'One time + Field Changed + condition', 'Once per ticket only after the condition matches', {});

// ---------------------------------------------------------------- MR  Multiple rules, order, chains
const MR = 'MR';
add(MR, 'Two rules on the same trigger both match', 'Both run, in list order', { pri: 'P0' });
add(MR, 'Two rules set the same field to different values', 'Order decides the final value (last wins?) — record and compare Zoho', { pri: 'P0', zoho: 'Check Zoho' });
add(MR, 'Rule A (On Create) Field Update fires Rule B (On Edit / Field Changed)', 'Chain behaviour recorded; Zoho does not run rules from workflow updates', { pri: 'P0', zoho: 'Check Zoho' });
add(MR, 'Rule that edits the field it watches (self-trigger)', 'No endless loop', { pri: 'P0', type: 'Negative' });
add(MR, 'Reorder after the run order matters', 'New order used on the next event', {});
add(MR, '30 active QA rules on one trigger, one ticket', 'All run; no timeout; history complete', { type: 'Performance' });
add(MR, 'Rule edited while a ticket is being processed / while a scheduled action is pending', 'Pending action uses the old or new version (record)', { type: 'Edge' });

// ---------------------------------------------------------------- OB  Test rule, history, audit
const OB = 'OB';
add(OB, 'Test rule on a saved rule: sample ticket id, trigger kind, field values JSON', '"Criteria matched / Did not match" + actions that would run; nothing saved', { pri: 'P0' });
add(OB, 'Test rule on a draft (evaluate) and with invalid JSON', 'Works / clear error', { type: 'Negative' });
add(OB, 'Execution History: menu link, filters (rule, record id, assignment rule, failed only), columns, outcomes Pending/Fired/No match/Failed', 'Rows correct for all runs of this regression', { pri: 'P0', bug: 'Oct B-6 (no menu link)' });
add(OB, 'Execution detail: each action with status, attempts, HTTP code, last error', 'Matches what really happened', { pri: 'P0' });
add(OB, 'Each rule logged once per event (old: twice, one with 0 actions)', 'One row per event', { type: 'Negative' });
add(OB, 'Ticket History names the rule for every change it made (field, owner, tags, comment, share, spam, layout, skills)', 'History line "by workflow <name>"', { pri: 'P0', bug: 'NDC-2203 F4' });
add(OB, 'Audit Log entries for rule create / edit / activate / delete and saved action changes, with links', 'Entries and links correct', {});

// ---------------------------------------------------------------- SA  Saved actions library
const SA = 'SA';
add(SA, 'Actions page: type tabs (All + each library type), module and status filters, columns Name · Type · Module · Used by · Status · Updated', 'Lists and filters work', { pri: 'P0', type: 'UI' });
add(SA, 'New Action for each library type (all 26 have library: true) incl. ticket, chat, IM, function types', 'Saved; type cannot change later', { pri: 'P0' });
add(SA, 'Use a saved action in 2 rules; edit the saved action', 'Both rules use the new values; Used by = 2', { pri: 'P0' });
add(SA, 'Deactivate / delete a saved action in use', 'Usage warning; rules show the state; runs skip it (record)', { type: 'Negative' });
add(SA, 'Saved action of another module is not offered (or "other modules" hint)', 'Only same-module actions', { type: 'Negative' });
add(SA, 'Duplicate saved action name for the same type', 'Refused or allowed (record)', { type: 'Negative' });

// ---------------------------------------------------------------- PS  Permissions, editor state, recycle bin
const PS = 'PS';
add(PS, 'Profile without workflow:rule:view', '"You don\'t have permission to view workflow rules" page', { pri: 'P0', type: 'Security', needs: 'QA profile + QA agent' });
add(PS, 'View-only profile (no manage): no New Rule / Save / Delete / Activate', 'Controls hidden or disabled; API 403', { pri: 'P0', type: 'Security' });
add(PS, 'No workflow:rule:execute → no Test rule', 'Test rule hidden; API 403', { type: 'Security' });
add(PS, 'Action view/manage and execution view permissions', 'Actions page and history follow the permission', { type: 'Security' });
add(PS, 'Department-scoped admin sees / edits only rules of departments they manage', 'Other departments\' rules hidden or read-only', { type: 'Security' });
add(PS, 'Draft resume ("Resume your draft?") and Start fresh', 'Draft restored / cleared', { type: 'UI' });
add(PS, 'Concurrent edit: two tabs save the same rule', 'Conflict dialog "This rule was changed since you opened it. Reload…"', { pri: 'P0', type: 'Negative' });
add(PS, 'Leave the editor with unsaved changes', 'Warns before leaving', { type: 'UI' });
add(PS, 'Deleted rule in Recycle Bin: restore and purge', 'Restored rule keeps config, comes back inactive or active (record)', {});

// ---------------------------------------------------------------- UX  UI, i18n, visual
const UX = 'UX';
add(UX, 'Canvas When → Condition → Action: summaries, expand/collapse, validation list "Fix these before saving:"', 'Clear, no overlaps, text not clipped', { pri: 'P0', type: 'UI' });
add(UX, 'Every action form: labels, hints, placeholders, empty states match the locale strings', 'No raw keys, no missing strings', { type: 'UI' });
add(UX, 'Arabic UI + RTL: list, editor, pickers, summaries', 'Translated and mirrored correctly', { type: 'i18n' });
add(UX, 'Keyboard only: build and save a rule; focus visible; screen-reader names on icon buttons', 'Doable without mouse', { type: 'a11y' });
add(UX, 'Narrow window (1024 px) and long names / many conditions', 'Layout holds; scroll inside panels', { type: 'UI' });
add(UX, 'Toasts and messages after save / activate / delete / errors', 'Correct wording; no duplicate toasts', { type: 'UI' });

// ---------------------------------------------------------------- API  Contract + security
const API = 'API';
add(API, 'CRUD /workflow/rules: create, read list (paging cap 50 trap), patch, delete, activate twice (409)', 'Status codes and bodies as expected', { pri: 'P0', type: 'API' });
add(API, 'Server-side validation mirrors the UI: barred actions on Delete / Date, >10 actions, >25 conditions, missing trigger options', '400 with clear messages', { pri: 'P0', type: 'API' });
add(API, 'Value objects with "kind" not first (old B-1 → 500)', 'Accepted or 400, never 500', { type: 'API', bug: 'Oct B-1' });
add(API, 'Rule names / comment / webhook body with <script>, ${...} injection, SQL-like text', 'Stored and shown as text; no script runs', { type: 'Security' });
add(API, 'Webhook to internal addresses (localhost, 169.254.169.254, private ranges)', 'Refused (SSRF)', { type: 'Security' });
add(API, 'Another tenant\'s rule / action id', '404 / 403', { type: 'Security' });

// ---------------------------------------------------------------- PF  Performance
const PF = 'PF';
add(PF, 'Instant action delay: create 20 tickets, time from save to Field Update visible', 'p95 within the agreed limit (≤5 s target)', { type: 'Performance' });
add(PF, 'Burst: 50 tickets in 1 minute with 5 active rules', 'All runs complete, none lost, no duplicates', { type: 'Performance' });
add(PF, 'Rules list and editor load time with 200 rules', 'Loads in an acceptable time', { type: 'Performance' });

// ---------------------------------------------------------------- IN  Other automation
const IN = 'IN';
add(IN, 'Workflow owner vs assignment rule on create', 'Workflow owner wins (as Oct I10) — compare Zoho order', { pri: 'P0' });
add(IN, 'Workflow + SLA: Field Update of Priority changes the SLA', 'SLA recalculated', {});
add(IN, 'Workflow + Blueprint: workflow edits after a transition (NDC-2730)', 'No field reset', { pri: 'P0', bug: 'NDC-2730' });
add(IN, 'Workflow + Macro: macro edit fires Edit rules', 'Fires once', {});
add(IN, 'Workflow + Skills assignment + Reassign by skills', 'Consistent owner', {});

// ---------------------------------------------------------------- RG  Known bugs
const RG = 'RG';
for (const [b, t] of [
  ['NDC-2203', 'All 33 "Workflow Missings" items (A4 Private Thread direction, D1 team on create were failing)'],
  ['NDC-2204', 'Owner Assignment roles are Desk roles, profiles tab'],
  ['NDC-2205', 'On Edit / Field Changed do not fire on create'],
  ['NDC-2206', 'Date-Time rule saves'],
  ['NDC-2173', 'Name column width'],
  ['NDC-3057', 'Condition shows stored value instead of label'],
  ['Oct B-1..B-9', 'kind order 500, Created By update, happiness template, 404 shown cancelled, used types in picker, no history link, cancelled scheduled no row, Create Record required, role round robin'],
]) add(RG, `${b}: ${t}`, 'Still fixed / still failing — record', { pri: 'P0', type: 'Regression', bug: b });

// ---------------------------------------------------------------- E2E journeys
const E2E = 'E2E';
add(E2E, 'Escalation journey: high-priority email ticket → rule tags + assigns team + private comment; customer replies → rule raises priority; 2 h before due → email to manager', 'Every step runs once; history and execution log tell the story', { pri: 'P0', type: 'E2E', needs: 'Gmail' });
add(E2E, 'Spam journey: subject contains "unsubscribe" → mark spam (+ contact) → later email blocked', 'Ticket in spam; new mail blocked', { type: 'E2E' });
add(E2E, 'Feedback journey: ticket closed → happiness email → Bad rating → rule shares to QA dept + task to manager', 'All steps run', { type: 'E2E', needs: 'Customer Happiness on' });
add(E2E, 'Department journey: ticket moved Dept A → Dept B; only B\'s rules fire; share back to A read-only', 'Scope respected', { pri: 'P0', type: 'E2E' });
add(E2E, 'Integration journey: create ticket → webhook to receiver → receiver PATCHes ticket via API → Edit rule fires once', 'No loop', { type: 'E2E', needs: 'webhook.site' });

// ---------------------------------------------------------------- output
const groups = {
  L: 'Rules list, wizard and settings', TR: 'Trigger · record actions', TF: 'Trigger · Field Changed', TD: 'Trigger · Date-Time field',
  TE: 'Trigger · ticket events', RM: 'Rule mode, layout and department scope', CL: 'Conditions · structure and logic',
  CO: 'Conditions · every operator by data type', CF: 'Conditions · related fields and ticket facts', AC: 'Actions · core',
  AT: 'Actions · ticket actions', AX: 'Actions · chat, IM and function', AM: 'Actions · mechanics (instant, scheduled, limits)',
  MX: 'Combination · trigger × action save matrix', RC: 'Combination · trigger × action runtime', TC: 'Combination · trigger × condition',
  MR: 'Several rules, order and chains', OB: 'Test rule, execution history, ticket history, audit', SA: 'Saved actions library',
  PS: 'Permissions, editor state, Recycle Bin', UX: 'UI, i18n, accessibility', API: 'API contract and security', PF: 'Performance',
  IN: 'With other automation', RG: 'Known bugs', E2E: 'End-to-end journeys',
};
const out = { built: '2026-11-22', source: 'staging-desk.taviportal.com bundle index-DR1HOa4j.js / pages-zE5Y0qhw.js, locale crm-workflow (1,074 strings)', groups, triggers: TRIGGERS, actions: ACTIONS, allowedOnDeleteOrDate: [...ALLOWED_ON_DELETE_OR_DATE], oncePerSection: [...ONCE_PER_SECTION], ops: OPS, cases };
fs.writeFileSync(path.join(__dirname, 'cases.json'), JSON.stringify(out, null, 1));
const byG = {}; cases.forEach(c => byG[c.group] = (byG[c.group] || 0) + 1);
const byP = {}; cases.forEach(c => byP[c.pri] = (byP[c.pri] || 0) + 1);
console.log('cases', cases.length, JSON.stringify(byG), JSON.stringify(byP), 'needs', cases.filter(c => c.needs).length);
