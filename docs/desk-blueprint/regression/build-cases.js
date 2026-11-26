// Builds the Desk Blueprint go-live regression case list (cases.json).
// Inventory read 24 Nov 2026 from the live build on staging-desk.taviportal.com:
// bundle index-DQd-6a2G.js, DeskBlueprintDesignerPage-DX3EARPk.js, locales settings (456 blueprint strings),
// desk-tickets (199 blueprint strings), crm-blueprint (439), analytics.blueprints (dashboard), useBlueprints routes.
// Plane: 60 Blueprint tickets read 24 Nov 2026. Run: node build-cases.js
const fs = require('fs');
const path = require('path');

const cases = [];
const n = {};
function add(g, title, expected, o = {}) {
  n[g] = (n[g] || 0) + 1;
  cases.push({
    id: `${g}-${String(n[g]).padStart(2, '0')}`, group: g, title, expected,
    pri: o.pri || 'P1', type: o.type || 'Functional', needs: o.needs || '', zoho: o.zoho || '', bug: o.bug || '',
  });
}
const P0 = { pri: 'P0' };

// ------------------------------------------------------------ AC  Access and permissions
const AC = 'AC';
add(AC, 'Owner / Desk admin opens Setup → Automation → Blueprints', 'Menu item shown; list loads', { ...P0, type: 'Security' });
add(AC, 'Desk Agent without "Manage blueprints": menu, list URL, designer URL, new URL', 'Menu hidden; "You don\'t have access to Blueprints / Ask an admin for the Manage blueprints permission"; no blueprint data in network responses', { ...P0, type: 'Security' });
add(AC, 'No permission: API reads (list, one, versions, read-only-agents)', '403, no data', { ...P0, type: 'API' });
add(AC, 'No permission: API writes (create, update, delete, sort, draft, publish, restore, include, revoke, mass-include/exclude)', '403 each; nothing changed', { ...P0, type: 'API' });
add(AC, 'Revoke permission alone (desk:ticket:blueprint_revoke) without manage', 'User can revoke a ticket but cannot open the designer', { type: 'Security' });
add(AC, 'Manage permission without revoke permission', 'Ticket menu hides Revoke blueprint; API revoke 403', { type: 'Security' });
add(AC, 'Light Agent / view-only member opens a ticket in a blueprint', 'Steps visible read-only; no Run; API run refused', { ...P0, type: 'Security', bug: 'NDC-3065' });
add(AC, 'Agent of another department (no share) reads blueprint-state / runs a transition by API', '404/403, no data', { ...P0, type: 'Security' });
add(AC, 'Other tenant token: GET, PUT, run transition on this tenant\'s ids', '404/403; nothing changed', { ...P0, type: 'Security', needs: 'Second tenant' });
add(AC, 'No token / expired token on every blueprint route', '401', { type: 'Security' });
add(AC, 'CRM blueprints are not listed or editable through x-app-key desk', 'Only Desk ticket blueprints returned', { type: 'Security' });
add(AC, 'Random / missing blueprint and transition ids', 'Same 404 for missing and forbidden (no enumeration)', { type: 'Security' });

// ------------------------------------------------------------ LS  Blueprints list
const LS = 'LS';
add(LS, 'List renders: title, subtitle, Create Blueprint, department picker, rows', 'Each row: mini diagram, name, layout, states count, draft mark, in-progress count, Active/Inactive; matches API', P0);
add(LS, 'Department picker switches the list; "Blueprints without a department" group', 'Correct blueprints per department; unplaced group with hint', {});
add(LS, 'Empty department', '"No blueprints in {{department}} yet" + body text', { type: 'UI' });
add(LS, 'In-progress count matches the tickets inside; "not counted yet" only while loading', 'Count = tickets in blueprint-state', P0);
add(LS, 'Draft mark (*) on a blueprint with an unpublished draft', 'Mark shown; note "* marks a blueprint with an unpublished draft copy"', { type: 'UI' });
add(LS, 'Activate / deactivate a QA blueprint', 'Status and isActive change; no error toast; new tickets follow the state', P0);
add(LS, 'Reorder by drag and by keyboard; reload', 'Order kept (sortOrder); "Drag to reorder" label for screen readers', P0);
add(LS, 'Delete an empty blueprint', '"Delete {{name}}? It moves to the Recycle Bin." → moved; restore from bin works', P0);
add(LS, 'Delete with tickets inside', 'Refused: "{{count}} tickets are in progress in {{name}}. Revoke them before deleting it."', P0);
add(LS, 'Include tickets dialog: pick state, search, load more, select shown / clear shown', '"N tickets included"; history names the admin; picker needs a state and tickets', P0);
add(LS, 'Include: skipped reasons (other department, merged, share only, cannot edit, already in a blueprint, not found)', 'Each skip listed with its reason text', {});
add(LS, 'Revoke tickets (all) from the list, paged', 'Counts revoked/skipped; "stopped before the end" resume; share-only tickets skipped and listed', P0);
add(LS, 'Long / odd names in rows (Arabic, emoji, 60 chars)', 'Truncate with tooltip; no layout break', { type: 'UI' });
add(LS, 'List / departments load failure', '"Couldn\'t load blueprints." / departments failed + Retry', { type: 'UI' });
add(LS, 'No departments in tenant (code path)', '"Add a department before you create a blueprint."', { type: 'UI' });
add(LS, 'Clone / Manage records (CRM-only actions) not offered in Desk, or work if offered', 'Record what Desk shows; if shown, clone makes "{{name}} (copy)" inactive', { zoho: 'Zoho has no clone' });

// ------------------------------------------------------------ DT  Designer details + advanced
const DT = 'DT';
add(DT, 'New blueprint opens: empty canvas text, details panel', '"Drag a status from the list onto the canvas, or use Add State to create one."', { type: 'UI' });
add(DT, 'Name required; name > 60 chars; special characters; description > 1000', 'nameRequired / nameTooLong / nameSpecialCharacters / descriptionTooLong; same limits as Zoho', { ...P0, bug: 'NDC-2780', zoho: 'Zoho 60 / 1000, no special chars' });
add(DT, 'Name data classes: Arabic, emoji, trailing spaces, XSS text, duplicate name', 'Stored as typed or trimmed; XSS inert; duplicate allowed (same as Zoho)', { type: 'Data' });
add(DT, 'Department required', 'Issue "Choose the department the blueprint belongs to"', P0);
add(DT, 'Layout: Any layout vs one layout', 'layoutId stored; ticket of another layout does not enter', {});
add(DT, 'Field fixed to Ticket status', '"Ticket status", not editable', { type: 'UI' });
add(DT, 'Criteria builder: text, pick list, date, number, lookup, tags, pattern (1 and (2 or 3))', 'Saved in entryCriteria; summary "Tickets that match"', P0);
add(DT, 'Criteria with every operator family on one field per type (equals, not, contains, starts, empty, between, before/after)', 'Entry follows each operator', { type: 'Data' });
add(DT, 'Continuous switch on/off', 'Stored; hint text', {});
add(DT, 'Blueprint-level Transition Owners (agents, teams, ticket owner)', 'Used by every transition without its own owners; summary "{{count}} owners for transitions without their own"', P0);
add(DT, 'Transition owner from a different department (blueprint level) + access level', 'Share note "While this blueprint governs the ticket, Desk shares it with…"; department owner without agent/team → issue', {});
add(DT, 'Advanced configuration: Dynamic Transition Owner Assignment on/off', 'Stored; ticket shows Assign owners only when on', {});
add(DT, 'Advanced configuration summary in details panel', 'Shows strict mode scope / dynamic owners / continuous, or "None"', { type: 'UI' });

// ------------------------------------------------------------ SM  Strict mode
const SM = 'SM';
const STRICT_ACTIONS = ['Edit fields', 'Send replies', 'Add comments', 'Request approvals', 'Add resolutions', 'Upload attachments'];
add(SM, 'Strict mode picker: Restrict All / Restrict Specified / Restrict All Except Specified', 'Each scope saves; hint text per scope; Specified with nothing ticked → "needs an action" issue', P0);
for (const a of STRICT_ACTIONS) add(SM, `Restrict Specified = "${a}": agent tries it on a ticket in the blueprint (UI + API)`, `Refused with "{{name}} allows this only through a transition."; other actions still open; allowed through a transition`, { ...P0, type: 'Functional' });
add(SM, 'Restrict All: every action blocked outside transitions; transition form items still save', 'All 6 blocked; transitions work', P0);
add(SM, 'Restrict All Except Specified (replies allowed): only replies work by hand', 'Only ticked actions allowed', {});
add(SM, 'Edit fields with field list: specified fields locked, others editable (and All Except variant)', 'Field-level lock follows the list; strictNoFields when layout has none', P0);
add(SM, 'Strict mode vs macros, bulk edit, workflow rule, API PATCH', 'Macro skipped "the blueprint allows it only through a transition"; bulk skipped; record what workflow/API do', P0);
add(SM, 'Strict mode off after revoke / completion', 'All actions open again', {});
add(SM, 'Strict mode vs Zoho (Lock all / selected / all except selected)', 'Same scopes and actions as Zoho', { zoho: 'Zoho Strict Mode' });

// ------------------------------------------------------------ CV  Canvas and states
const CV = 'CV';
add(CV, 'Drag statuses from Used / Other lists; search statuses; "On the canvas" mark', 'Nodes placed; search filters; noStatusMatch text', P0);
add(CV, 'Add State: name + type Open / On Hold / Closed', 'New ticket status with that type; on canvas', P0);
add(CV, 'Add State clash ("Open", "open") and partial save', '"“Open” already exists as Open"; addStatePartial message if half saved', { type: 'Data' });
add(CV, 'Add State name data classes (Arabic, emoji, 100 chars, XSS)', 'No broken status; XSS inert', { type: 'Data' });
add(CV, 'Closed-type state ends the blueprint (flag, exitHint)', 'isTerminal; ticket leaves at that state', P0);
add(CV, 'Draw transitions; transition name required (from/to messages)', 'unnamedTransition issues until named', P0);
add(CV, '16 connections per state', '"A state can have up to 16 connections."; "16 of 16 connections"', { type: 'Data' });
add(CV, 'Common transition', 'Listed as common; offered from every non-final state on tickets', P0);
add(CV, 'Parallel steps: 1 step, 2 steps, steps + branches', 'oneSubTransition / groupWithForkJoin issues; 2 steps OK', P0);
add(CV, 'Fork / join branches', 'Branch targets must be on canvas (unknownForkTarget / unknownJoinSource)', {});
add(CV, 'Unreachable state', '"{{state}} cannot be reached from the start"', {});
add(CV, 'Remove a state with tickets inside', '"{{count}} ticket is in {{state}}. Revoke it before removing the state."', P0);
add(CV, 'Status used on canvas deleted in Ticket statuses', 'Refused (FIELD_OPTION_IN_BLUEPRINT) with or without tickets; designer shows "is no longer a ticket status"', { ...P0, bug: 'NDC-2775' });
add(CV, 'Undo / redo / tidy layout; zoom in/out/fit; legend', 'Canvas follows; nothing lost', { type: 'UI' });
add(CV, 'Phone width (390 px)', '"Draw states and connectors on a larger screen"; settings still editable', { type: 'Compatibility' });
add(CV, 'Large blueprint (30 states, 80 transitions)', 'Labels and buttons do not overlap; opens < 10 s in Edge/Chrome/Firefox', { type: 'Performance', bug: 'NDC-3038' });

// ------------------------------------------------------------ TB  Transition · Before
const TB = 'TB';
add(TB, 'No owners → blueprint owners or "Any agent in the department who can edit the ticket"', 'Every edit-capable agent sees it', P0);
add(TB, 'Agent owner', 'Only that agent sees and runs it; others "No transitions you can run" / 403 BLUEPRINT_NOT_OWNER', P0);
add(TB, 'Team owner', 'Team members only', P0);
add(TB, 'Ticket owner', 'Current owner sees it; after owner change the new owner does', P0);
add(TB, 'Owner from another department: Full / Read only / Restricted', 'shareNote; owner runs it; Read only/Restricted + required reply/resolution/approval refused at save (ownerRefused)', P0);
add(TB, 'Suspended owner / only owner deactivated', '"{{name}} (Suspended)"; noActiveOwner issue and fallback "agents with edit access run it"', { bug: 'NDC-3036' });
add(TB, 'Unknown user id as owner (API)', 'Refused "An owner you added is not a user of your organization"', { bug: 'NDC-3037, NDC-3069' });
add(TB, 'Light Agent / view-only member as owner', '"(Read only)" mark; save refused (ownerReadOnlyRefused), including just after role change', { bug: 'NDC-3112' });
add(TB, 'Criteria on the transition (Priority is High)', 'Button only on matching tickets; hint "The button shows only on tickets that match."', P0);
add(TB, 'Run a transition whose criteria are not met (API)', 'Refused "This ticket doesn\'t meet this step\'s conditions yet" (not the owner message)', { ...P0, bug: 'NDC-3117' });
add(TB, 'Criteria use related fields / approval status field', 'Evaluated correctly', {});

// ------------------------------------------------------------ TU  Transition · During
const TU = 'TU';
add(TU, 'No items', '"Nothing to fill in, so the agent runs it in one click."; ticket "Run moves the ticket on."', P0);
add(TU, 'Reply to the contact (required)', 'Reply box "To {{contact}}" + latest contact message; sent to contact and logged', P0);
add(TU, 'Internal comment (required)', 'Private comment "Only agents see this"', P0);
add(TU, 'Attachment (required)', 'Run needs a file; file on ticket', { ...P0, bug: 'NDC-2753' });
add(TU, 'Resolution (required)', 'Ticket resolution set', P0);
const FIELD_TYPES = ['single line', 'multi line', 'number', 'decimal / currency', 'date', 'date-time', 'pick list', 'multi-select', 'checkbox', 'email', 'phone', 'URL', 'lookup (Contact)', 'user', 'address', 'formula (read-only)'];
for (const t of FIELD_TYPES) add(TU, `Field item, type ${t}`, 'Control renders, required check, value saved, history source = blueprint; invalid input refused', { type: 'Data', bug: t.startsWith('lookup') ? 'NDC-3060' : t === 'address' ? 'NDC-3033' : t.startsWith('formula') ? 'NDC-3217' : '' });
add(TU, 'Field checks: condition + message; several checks; complex check kept', 'Run refused with the admin message until it passes; fieldCheckIncomplete issue', P0);
add(TU, 'Field value vs validation rules and layout rules', 'Validation rule and layout-rule mandatory apply in the form', { ...P0, bug: 'NDC-3012, NDC-2977' });
add(TU, 'Checklist: mandatory and optional checks', 'Run needs mandatory ticks', P0);
add(TU, 'Message item', 'Shown read-only to the agent', { type: 'UI' });
add(TU, 'Submit for approval: default approvers (≤ max), approver teams, decide-within hours', 'Approval created; ticket waits "Waiting for approval from…"; approve → move; too many approvers issue; limit range check', P0);
add(TU, 'Approval: team from another department / deleted team', 'Refused (approverTeamRefused otherDepartment / unknown)', {});
add(TU, 'Approval rejected / expired', 'Ticket stays; record what the Steps card shows', P0);
add(TU, 'Share item: default department + access; agent adds more', 'Ticket shared; at cap (10) messages; "Already shared at this level" note', P0);
add(TU, 'Optional items', 'Run works without them', {});
add(TU, 'Required for some agents/teams only', 'Required for those, optional for others; nobody picked → publish blocked', P0);
add(TU, 'Item order (move up/down)', 'Ticket form shows same order', {});
add(TU, 'Access withheld (agent without reply/comment/attachment/resolution/approval/share rights)', 'Optional: "runs without one"; required: "This step needs… Ask an admin"', { needs: 'Restricted agent' });
add(TU, 'Data classes in reply/comment/resolution (Arabic, emoji, XSS, 10k chars)', 'Stored as text; XSS inert', { type: 'Data' });

// ------------------------------------------------------------ TF  Transition · After
const TF = 'TF';
add(TF, 'Update field (ticket field and contact field)', 'Updated after run; History "updated the ticket through blueprint transition…"', { ...P0, bug: 'NDC-3032' });
add(TF, 'Update address field', 'Subfields kept; History readable', { bug: 'NDC-3033' });
add(TF, 'Notify: owner + teams', 'In-app notification to each', { ...P0, bug: 'NDC-3061' });
add(TF, 'Create task: assign to ticket owner / performer / specific agent or team', 'Task linked to ticket, in ticket\'s department, names not ids', P0);
add(TF, 'Webhook to receiver; internal / metadata URLs', 'Request arrives with ticket data; internal URLs refused', { ...P0, bug: 'NDC-2540, NDC-2537', needs: 'Webhook receiver' });
add(TF, 'Send email with template to contact + owner + team', 'Delivered; "Free addresses are not offered"', { ...P0, needs: 'Mailbox' });
add(TF, 'Run custom action (safe Desk action)', 'Runs once with the ticket as context', { needs: 'Safe custom action' });
add(TF, 'Custom action refused reasons (missing, inactive, not for Desk, record-bound, agent variable, run denied)', 'Each shows its reason text', {});
add(TF, 'Action order', 'Run in that order', {});
add(TF, 'Merge tokens {{subject}} etc. in notify / task / webhook / email', 'Replaced with ticket values', {});
add(TF, 'Workflow rule (On Edit) after transitions with and without required items', 'Runs after both', { ...P0, bug: 'NDC-2420' });
add(TF, 'Formula fields after a transition changes their source field', 'Formulas recalculated', { ...P0, bug: 'NDC-3217' });

// ------------------------------------------------------------ ST  State settings (designer)
const ST = 'ST';
add(ST, 'No limit', '"No limit"; no due on tickets', {});
add(ST, 'Time limit + warning in minutes / hours / days', 'Stored correctly per unit; example text', { ...P0, bug: 'NDC-3063' });
add(ST, 'Warning not before limit; warning without limit; negative / 0 / text / huge values (UI + API)', 'warnTooLate / issue; API refuses', { ...P0, bug: 'NDC-2761, NDC-2762' });
add(ST, 'Clock: business hours vs calendar time; example text uses tenant hours', 'Example names the default hours', { bug: 'NDC-2756' });
add(ST, 'Business hours set per state (pick set, default, deleted set)', 'Saved; deleted set falls back with message', P0);
add(ST, 'Actions at the warning / actions when it runs out', 'Saved in each list', P0);
add(ST, 'Escalation levels: add up to max, before / at / after, offset, recipients, template', 'Each level saved; problems: offset < 1 min, before-limit offset ≥ limit, > 365 days, no recipients, no limit, deleted template', P0);
add(ST, 'Moves on by itself: transition + wait, with and without limit', 'Saved; panel shows it (not "No limit")', { ...P0, bug: 'NDC-2755' });
add(ST, 'Auto-move refused cases: no transition, transition of another state, parallel group, mandatory items, wait < 1 min', 'Matching issue each; API refuses too', { ...P0, bug: 'NDC-2763' });
add(ST, 'Customer triggers: reply → transition, for Customer replies / Private thread answers / Both', 'Saved; not allowed on exit states; transition with reply/required items refused', P0);
add(ST, 'Customer triggers: rating → transition, Good / Okay / Bad / none ticked (any)', 'Saved; "None ticked, so any rating runs it."', P0);
add(ST, 'Reopen hint when no reply trigger', '"Nothing set, so a customer reply reopens the ticket as it does today."', { type: 'UI' });
add(ST, 'Order of transitions in a state (incl. common transition note)', 'Ticket shows that order; common moves on every state', P0);
add(ST, 'Exit state with no outgoing transition', 'exitHint; limits still settable', {});

// ------------------------------------------------------------ PI  Publish checks (issue list)
const PI = 'PI';
const ISSUES = [
  ['statesRequired', 'Place at least one state on the canvas'],
  ['duplicateState / stateIdRequired (API)', '{{state}} is on the canvas twice'],
  ['stateNotAllowed', '{{state}} is no longer a ticket status'],
  ['duplicateTransition / transitionIdRequired (API)', 'Two transitions share the id'],
  ['noSource / unknownSource / noTarget / unknownTarget (API)', 'Transition has no / unknown source or target'],
  ['autoMissingTransition', 'runs a transition on its own that no longer exists'],
  ['triggerNotCandidate / triggerMissingTransition / triggerParallelGroup', 'customer trigger names a bad transition'],
  ['approvalTooManyApprovers', 'Submit for approval names more than max default approvers'],
  ['blueprintOwnerNoMembers', 'Each department owner needs an agent or a team'],
  ['issue list UX: count, "N more", click jumps to item, name line clickable, missing department counted', 'Every issue clickable and counted'],
];
for (const [k, v] of ISSUES) add(PI, `Publish blocked: ${k}`, `"${v}"; nothing published`, { bug: k.startsWith('issue list') ? 'NDC-3039' : k.includes('API') ? 'NDC-2758' : '' });
add(PI, 'Unknown entryCriteria shape by API', 'Refused 400, never a catch-all blueprint', { ...P0, type: 'API', bug: 'NDC-2758' });

// ------------------------------------------------------------ VR  Save, draft, versions, conflicts
const VR = 'VR';
add(VR, 'Save Draft on a published blueprint', '"Draft saved. The live blueprint is unchanged until you publish."; tickets keep using live version', P0);
add(VR, 'Publish', 'Version n+1; "Published"; new tickets use it', P0);
add(VR, 'Version history: list, view old version, restore', '"Version restored as the new working draft"; live unchanged until publish', P0);
add(VR, 'Double click Publish', 'One version', { type: 'Concurrency' });
add(VR, 'Two tabs edit and save', 'Second gets "Someone else changed this blueprint" with Reload / Keep my changes', { ...P0, type: 'Concurrency', bug: 'NDC-3030' });
add(VR, 'API save without revision', 'Refused; no silent overwrite', { type: 'API', bug: 'NDC-3070' });
add(VR, 'Local draft: leave unsaved, come back', '"You have unsaved changes from {{time}}" Restore / Discard; movedOn message if saved since', { ...P0, bug: 'NDC-3035' });
add(VR, 'Session expires while editing', 'Changes kept locally; sign-in asked', { bug: 'NDC-3035' });
add(VR, 'Leave designer with unsaved changes (Back)', 'Asked to keep or discard', { type: 'UX' });
add(VR, 'Partial PUT / read-only keys in body', 'Refused or other fields kept; read-only keys ignored', { type: 'API' });
add(VR, 'New version removes a transition a ticket was about to run', 'Steps refresh; old id → clear error (BLUEPRINT_STATE_CHANGED)', P0);
add(VR, 'New version renames / removes a state with no tickets; changes a time limit', 'Tickets keep their status; new limits apply to new entries (record old ones)', P0);
add(VR, 'Audit Log: create, update, publish, restore, activate, delete', 'Readable entries with user and real IP', { ...P0, bug: 'NDC-3029, NDC-3067' });

// ------------------------------------------------------------ EN  Ticket entry and membership
const EN = 'EN';
const SOURCES = ['New Ticket screen', 'API', 'Email', 'Web form', 'Help Center', 'Chat / Omni Channel', 'Import (Trigger automation on)', 'Import (Trigger automation off)', 'Clone ticket', 'Split ticket'];
for (const s of SOURCES) add(EN, `Entry on create from ${s}`, 'Enters at start state; history "Entered blueprint … at Open"', { pri: ['New Ticket screen', 'API', 'Email', 'Chat / Omni Channel'].includes(s) ? 'P0' : 'P1', bug: s.startsWith('Chat') ? 'NDC-3047' : '', needs: s === 'Email' ? 'Mailbox' : '' });
add(EN, 'Criteria not met / other layout / other department', 'No blueprint', P0);
add(EN, 'Edit a ticket to match later', 'Enters on edit (same as Zoho)', {});
add(EN, 'Created in a middle status (e.g. Escalated)', 'Record: TAVI resets to start state; Zoho enters at that status', { zoho: 'Zoho keeps the status (18 Nov live)' });
add(EN, 'Two blueprints match: first in order wins; swap order', 'Follows the order', P0);
add(EN, 'Inactive blueprint', 'New tickets do not enter; tickets inside continue', P0);
add(EN, 'Workflow on create sets the field the criteria use', 'Entry decided after workflow (same as Zoho order)', P0);
add(EN, 'Approval process approves a matching ticket', 'Enters after approval', { bug: 'NDC-2707' });
add(EN, 'Revoke one ticket (ticket menu)', '"Take this ticket out of {{name}}? It keeps its status."; status editable; timers stop; history', P0);
add(EN, 'Bulk revoke from ticket list (2 in, 1 out; none in)', '"Remove 2 tickets from their blueprints?"; "None of the selected tickets is in a blueprint."', P0);
add(EN, 'Complete: reach a Closed-type state', 'History "Completed blueprint"; Steps card gone; status editable', P0);
add(EN, 'Merge a ticket that is in a blueprint', 'Record what happens; merged ticket skipped by include', {});
add(EN, 'Move ticket to another department', 'Leaves blueprint, status reset like Zoho', { ...P0, bug: 'NDC-2782' });
add(EN, 'Spam / delete / restore a ticket in a blueprint', 'Record blueprint state after restore', {});
add(EN, 'Mass include / exclude by condition (CRM routes) on Desk', 'Same rules as Desk include; record', { type: 'API' });

// ------------------------------------------------------------ RN  Running transitions on the ticket
const RN = 'RN';
add(RN, 'Header pill, progress bar and Steps card (Now, time in state, due, warning, next step)', 'Correct path, including Open → On Hold', { ...P0, type: 'UI', bug: 'NDC-3118' });
add(RN, 'Flow view: "View configured actions", steps from state, asks for, you can / can\'t run, runs on its own', 'Agents see the flow and conditions', { ...P0, bug: 'NDC-3056' });
add(RN, 'Run with no items', '"{{transition}} ran. The ticket moved to {{state}}."; history line', P0);
add(RN, 'Run with required items empty → fill → run', '"Fill in the required items to run {{name}}"', P0);
add(RN, 'Status locked: field, list inline, bulk, API PATCH', '"Set by blueprint"; bulk skipped "follows a blueprint"; API TICKET_IN_BLUEPRINT', P0);
add(RN, 'Reply with send-and-close; Close ticket button', 'Reply stays open message; Close ticket refused/hidden "Use its transitions to close it"', { ...P0, bug: 'NDC-2757' });
add(RN, 'Stale form: two agents, A runs first', 'B: "This ticket moved to {{state}} a moment ago." + Reload ticket', { type: 'Concurrency' });
add(RN, 'Double click Run', 'One move, one set of after-actions', { ...P0, type: 'Concurrency' });
add(RN, 'Incomplete run (an item fails after move) → Retry', '"The ticket moved, but its other items were not saved." Retry saves once', {});
add(RN, 'Network loss on Run → Retry', '"We couldn\'t confirm the run." No double move', { type: 'Concurrency' });
add(RN, 'Leave / close the form with text typed', 'Leave / Discard / Stay prompts', { type: 'UX' });
add(RN, 'Transition draft: save draft, reopen, discard; ticket moved meanwhile', 'Draft chip; "Draft saved."; draftMoved / draftDiscarded messages', P0);
add(RN, 'Common transition from a middle state', 'Moves to target', P0);
add(RN, 'Parallel steps', 'Group shows done/total; moves only when all done', P0);
add(RN, 'Continuous blueprint: next no-item step runs by itself', 'Runs automatically', { ...P0, bug: 'NDC-3031' });
add(RN, 'Cross-department owner runs the step on the shared ticket', 'Works at Full access; share ends after leaving state (record)', P0);
add(RN, 'Share limit 10 departments', 'History "Not shared with {{department}}: the ticket has 10 shared departments"', {});
add(RN, 'Blueprint fails to load on ticket', '"Blueprint unavailable. Status is read-only until it loads" + Retry', { type: 'UI' });

// ------------------------------------------------------------ DO  Dynamic owners on the ticket
const DO = 'DO';
add(DO, 'Assign owners of a transition on one ticket (agents, teams)', '"Owners of {{transition}} set."; replaces blueprint owners for this ticket only; history line', P0);
add(DO, 'Add another department + access level', 'Department members picked; empty department problem message', {});
add(DO, 'Clear → reset to blueprint owners', '"Owners of {{transition}} reset to the blueprint\'s owners."; history', {});
add(DO, 'Who may assign (admin vs agent); dynamic owners switch off', 'Only allowed users; hidden when off', { ...P0, type: 'Security' });
add(DO, 'Automatic transition: note, takes no new owners', 'automaticNote shown', { type: 'UI' });
add(DO, 'Load failure of departments/agents/teams', 'loadFailed + Retry', { type: 'UI' });

// ------------------------------------------------------------ TM  Timers, SLA and customer triggers
const TM = 'TM';
add(TM, 'Due on entry = entered + limit (calendar)', 'escalation_due_at correct', P0);
add(TM, 'Warning actions run once at the warning', 'Notify / webhook / custom action / field update run once', { ...P0, bug: 'NDC-2788' });
add(TM, 'Escalation actions run once when it runs out; Steps "Overdue by…"', 'Once; history', P0);
add(TM, 'Escalation levels fire before / at / after the limit', 'Each level emails + notifies its recipients once; people without access skipped', { ...P0, needs: 'Mailbox' });
add(TM, 'Auto-move on timer, with and without a limit', 'Moves at the time; history "Moved by … when the time limit passed" with correct From/To', { ...P0, bug: 'NDC-3066' });
add(TM, 'Business hours Mon–Fri: limit crosses a weekend', 'Working time only', { ...P0, bug: 'NDC-2774', needs: 'Business-hours change (your OK)' });
add(TM, 'Holiday on the default list', 'Not counted', { needs: 'Business-hours change (your OK)' });
add(TM, 'Per-state business hours set (different from default)', 'Due counted on the chosen set', { needs: 'Business-hours change (your OK)' });
add(TM, 'Leaving the state before due', 'Old warning / escalation / auto-move never fire', P0);
add(TM, 'Revoke before due', 'Nothing fires later', P0);
add(TM, 'Customer reply trigger: public reply / private thread answer / both', 'Moves only for the chosen thread; history "when the customer replied"; no reopen', { ...P0, needs: 'Help Center customer' });
add(TM, 'No reply trigger: customer replies', 'Normal reopen behaviour', { needs: 'Help Center customer' });
add(TM, 'Rating trigger: Good / Okay / Bad filters', 'Only ticked ratings move the ticket', { ...P0, needs: 'Customer Happiness ON' });
add(TM, 'Department SLA in an On Hold-type state', 'Department SLA pauses and resumes; state timer keeps running (same as Zoho)', P0);
add(TM, 'Department SLA and state limit both overdue', 'Both shown separately', { type: 'UI' });
add(TM, 'Reapply SLA on a ticket in a blueprint', 'Blueprint state untouched (TAVI extra)', {});
add(TM, 'Close through a blueprint transition', 'Closed email + rating request sent like a normal close; ticket.closed logged', { ...P0, bug: 'NDC-3054, NDC-3053', needs: 'Mailbox' });
add(TM, 'Short limits under load (10 tickets due in the same minute)', 'Each fires once, within 2 min', { type: 'Performance' });

// ------------------------------------------------------------ IN  Other automation
const IN = 'IN';
add(IN, 'Workflow rule Field Update Status on a ticket in a blueprint (instant and delayed)', 'Refused/skipped; execution log does not say Succeeded; blueprint not broken', { ...P0, bug: 'NDC-2764, NDC-2730' });
add(IN, 'Assignment rule / round robin then blueprint with Ticket owner as owner', 'Assigned agent can run it', P0);
add(IN, 'Direct assignment then blueprint', 'Order direct → workflow → SLA → RR → blueprint', {});
add(IN, 'Macro that changes status / fields on a ticket in a blueprint', 'Status part skipped "a blueprint controls the ticket\'s status"', P0);
add(IN, 'Approval process + edit of a ticket in a blueprint', 'Edit does not drop it out', { bug: 'NDC-2334' });
add(IN, 'Global set value used by a blueprint removed', 'Blueprint not broken', { bug: 'NDC-2919' });
add(IN, 'Layout rule hides / requires a field used in the transition form', 'Rule respected', { bug: 'NDC-2977' });
add(IN, 'Ticket status sync after transitions (record vs Desk status)', 'Desk status equals record status after every move', { ...P0, bug: 'NDC-3135' });

// ------------------------------------------------------------ RS  Where results appear
const RS = 'RS';
add(RS, 'Ticket History: entered, transition, field updated, owners set/reset, share skipped, revoked, left, completed', 'Readable lines, correct From/To, no raw names', { ...P0, bug: 'NDC-3034, NDC-3066, NDC-3032' });
add(RS, 'Ticket Activity / timeline events', 'Blueprint events listed', { bug: 'NDC-2321' });
add(RS, 'Help Center reply shown in history', 'Shown as Help Center reply', { bug: 'NDC-3044' });
add(RS, 'Closed / resolution time fields in history', 'Readable', { bug: 'NDC-3068' });
add(RS, 'Ticket list views: Active Blueprint Tickets, All / My / My Team / Unassigned Transitions', 'Correct tickets in each', P0);
add(RS, 'Ticket list Blueprint filter / column', 'Filters correctly', {});
add(RS, 'Blueprint dashboard: blueprint + department filters, range, tiles limit met / missed, met share', 'Numbers match QA tickets', P0);
add(RS, 'Dashboard charts: time in state, transitions manual vs automatic, average time', 'Match the run', {});
add(RS, 'Dashboard empty / no blueprints / failed states', 'Texts and Retry', { type: 'UI' });
add(RS, 'Recycle Bin: restore and purge a blueprint', 'Restore brings it back (inactive?); purge removes', {});
add(RS, 'Approvals page shows blueprint approvals', 'Listed with ticket and step', { bug: 'NDC-2871' });

// ------------------------------------------------------------ UX  UI, i18n, accessibility, compatibility
const UX = 'UX';
add(UX, 'Arabic UI: list, designer, panels, issues, ticket Steps/form, toasts, history, dashboard', 'Every string translated; layout mirrors sensibly', { type: 'i18n' });
add(UX, 'Arabic / mixed names on canvas and ticket', 'Correct direction; no overlap', { type: 'i18n' });
add(UX, 'Keyboard: list reorder, designer panels, item move up/down, ticket form, dialogs (Escape)', 'All reachable; visible focus', { type: 'Accessibility' });
add(UX, 'Screen-reader labels (diagram, drag handles, buttons)', 'Labels present', { type: 'Accessibility' });
add(UX, 'Browsers: Edge, Chrome, Firefox (designer drag and drop, ticket form)', 'Works in each', { type: 'Compatibility' });
add(UX, 'Visual pass: designer panels, Steps card, dialogs at 1366 / 1920 / 390 px', 'No clipped text or overlap', { type: 'UI' });

// ------------------------------------------------------------ API  Contract and security
const API = 'API';
add(API, 'Type confusion: strings for numbers, objects for arrays, unknown kind, huge arrays', '400 with field message, never 500', { ...P0, type: 'API' });
add(API, 'Ids from another tenant (owner, team, department, template, custom action)', 'Refused', { ...P0, type: 'Security', needs: 'Second tenant' });
add(API, 'XSS in blueprint, state, transition, checklist, message, notification, email', 'Shown as text everywhere', { ...P0, type: 'Security' });
add(API, 'Run transition endpoints (/modules/… and /desk/tickets/…) behave the same', 'Same rules and results', { type: 'API' });
add(API, 'read-only-agents endpoint', 'Lists view-only members of the department only', { type: 'API' });
add(API, 'blueprint-history endpoint', 'Matches ticket history', { type: 'API' });
add(API, 'Error codes readable (no parser text)', 'TICKET_IN_BLUEPRINT, BLUEPRINT_NOT_OWNER, BLUEPRINT_CRITERIA_NOT_MET… with messages', { type: 'API', bug: 'NDC-3069' });

// ------------------------------------------------------------ PF  Performance
const PF = 'PF';
add(PF, 'Designer open / publish time on a big blueprint', 'Open < 10 s, publish < 5 s', { type: 'Performance' });
add(PF, 'Include / revoke 500 tickets', 'Paged; counts right; resume works', { type: 'Performance' });
add(PF, 'Ticket page with blueprint: Steps card load time', '< 3 s', { type: 'Performance' });

// ------------------------------------------------------------ RG  Known bugs (Plane, read 24 Nov 2026)
const RG = 'RG';
const BUGS = [
  ['NDC-2537', 'Bug', 'Webhooks accept internal / metadata URLs'],
  ['NDC-3217', 'Bug', 'Formulas not recalculated after a blueprint transition'],
  ['NDC-2420', 'Done', 'Workflow after transitions with required fields'], ['NDC-2540', 'Done', 'Webhook actions never sent'],
  ['NDC-2707', 'Done', 'Approved record does not enter blueprint'], ['NDC-2729', 'Done', 'Create-record after-actions allow other modules'],
  ['NDC-2730', 'Done', 'Workflow changes the locked field'], ['NDC-2753', 'Done', 'Transition with attachment 422'],
  ['NDC-2755', 'Done', 'Auto-close hidden in state panel'], ['NDC-2756', 'Done', 'Example text fixed week'],
  ['NDC-2757', 'Done', 'Close ticket button shown'], ['NDC-2758', 'Done', 'Unknown criteria shape catches all'],
  ['NDC-2761', 'Done', 'Warning ≥ limit saved'], ['NDC-2762', 'Done', 'Negative limit saved'], ['NDC-2763', 'Done', 'Auto-move to other state\'s transition'],
  ['NDC-2764', 'Done', 'Workflow sets Status, ticket leaves'], ['NDC-2774', 'Done', 'Weekend counted'], ['NDC-2775', 'Done', 'Status in use removable'],
  ['NDC-2780', 'Done', 'Name rules'], ['NDC-2782', 'Done', 'Department move keeps status'], ['NDC-2788', 'Done', 'Warning actions never run'],
  ['NDC-2919', 'Done', 'Global set value breaks blueprint'], ['NDC-2977', 'Done', 'Layout rule mandatory ignored'], ['NDC-3012', 'Done', 'Validation rules skipped (Desk)'],
  ['NDC-3029', 'Done', 'No audit entries'], ['NDC-3030', 'Done', 'Silent overwrite'], ['NDC-3031', 'Done', 'Continuous does not run'],
  ['NDC-3032', 'Done', 'Field changes missing in History'], ['NDC-3033', 'Done', 'Address as raw code'], ['NDC-3034', 'Done', 'Raw BlueprintStateChanged'],
  ['NDC-3035', 'Done', 'Unsaved changes lost on expiry'], ['NDC-3036', 'Done', 'Only owner deactivated'], ['NDC-3037', 'Done', 'Unknown owner id'],
  ['NDC-3038', 'Done', 'Large blueprint overlap'], ['NDC-3039', 'Done', 'Issue list'], ['NDC-3044', 'Done', 'Help Center reply as Email'],
  ['NDC-3047', 'Done', 'Chat ticket never enters'], ['NDC-3053', 'Done', 'Closed mail needs Happiness'], ['NDC-3054', 'Done', 'No closed mail on blueprint close'],
  ['NDC-3056', 'Done', 'Agents cannot see flow'], ['NDC-3060', 'Done', 'Contact shows ID'], ['NDC-3061', 'Done', 'Notify never sent'],
  ['NDC-3063', 'Done', 'Hours-only limit'], ['NDC-3065', 'Done', 'Read-only agent runs transition'], ['NDC-3066', 'Done', 'Wrong From/To on auto steps'],
  ['NDC-3067', 'Done', 'Audit shows internal IP'], ['NDC-3068', 'Done', 'Raw closed/resolution time'], ['NDC-3069', 'Done', 'Parser text error'],
  ['NDC-3070', 'Done', 'No-revision save overwrites'], ['NDC-3112', 'Done', 'View-only agent saved as owner'], ['NDC-3117', 'Done', 'Wrong refusal message'],
  ['NDC-3118', 'Done', 'Progress bar loses path'], ['NDC-3135', 'Done', 'Status stuck after move'],
];
for (const [b, s, t] of BUGS) add(RG, `${b} (${s}): ${t}`, s === 'Bug' ? 'Still open: confirm still failing or now fixed' : 'Still fixed (no regression)', { pri: 'P0', type: 'Regression', bug: b });

// ------------------------------------------------------------ ZP  Zoho parity left
const ZP = 'ZP';
add(ZP, 'Widgets in the transition form (Zoho extensions)', 'Still missing → keep on NDC-2799 list', { zoho: 'Zoho has it' });
add(ZP, 'Required reply on an IM / chat ticket', 'Record: TAVI sends email, Zoho replies in IM', { zoho: 'Zoho opens IM reply' });
add(ZP, 'Everything else from NDC-2754 / NDC-2799 (Z1–Z15) re-checked inside its group', 'Built and working', { zoho: 'Zoho parity' });

// ------------------------------------------------------------ E2E journeys
const E2E = 'E2E';
add(E2E, 'Refund: Open → Verify (checklist + comment) → Approve (approval item, owner A) → Pay (field + resolution) → Closed; customer emails in; B cannot approve', 'Every step as designed; closed mail; history complete', { ...P0, type: 'E2E', needs: 'Mailbox' });
add(E2E, 'Waiting for customer: Ask documents (reply) → On Hold with reply trigger + auto-close in minutes; one customer answers, one does not', 'Moves by reply and by timer; SLA paused in On Hold', { ...P0, type: 'E2E', needs: 'Help Center customer' });
add(E2E, 'Escalation: limit + warning + 2 escalation levels + auto-move to Escalated', 'Warning, levels and move each once', { ...P0, type: 'E2E' });
add(E2E, 'Strict mode: Restrict All Except replies; agent tries edits, comment, attachment; finishes by transitions', 'Only allowed actions by hand', { ...P0, type: 'E2E' });
add(E2E, 'Cross-department + dynamic owners: admin assigns Tech team on one ticket; Tech runs it; share ends', 'Owners and shares right', { type: 'E2E' });
add(E2E, 'Chat ticket → blueprint → rating trigger Bad → Escalated', 'Enters and moves', { type: 'E2E', needs: 'Customer Happiness ON' });
add(E2E, 'Change after the fact: deactivate with tickets inside, new version, restore old version, revoke all, delete, restore from bin', 'Old tickets continue; clean delete', { ...P0, type: 'E2E' });
add(E2E, 'Negative recovery: publish with issues, fix, remove state with tickets (refused), revoke, remove, publish', 'Clear messages; tickets never stuck', { type: 'E2E' });

// ------------------------------------------------------------ output
const groups = {
  AC: 'Access and permissions', LS: 'Blueprints list and membership dialogs', DT: 'Designer · details, owners, advanced', SM: 'Strict mode',
  CV: 'Designer · canvas and states', TB: 'Transition · Before (owners, criteria)', TU: 'Transition · During (items)', TF: 'Transition · After (actions)',
  ST: 'State settings (time limits, levels, triggers, order)', PI: 'Publish checks', VR: 'Save, drafts, versions, conflicts, audit',
  EN: 'Ticket entry and membership', RN: 'Running transitions on the ticket', DO: 'Dynamic owners on the ticket', TM: 'Timers, SLA and customer triggers',
  IN: 'With other automation', RS: 'Where results appear (history, views, dashboard)', UX: 'UI, i18n, accessibility, browsers', API: 'API contract and security',
  PF: 'Performance', RG: 'Known bugs (Plane)', ZP: 'Zoho parity left', E2E: 'End-to-end journeys',
};
const out = { built: '2026-11-24', source: 'staging-desk.taviportal.com bundle index-DQd-6a2G.js; locales settings/desk-tickets/crm-blueprint; Plane 60 Blueprint tickets', groups, cases };
fs.writeFileSync(path.join(__dirname, 'cases.json'), JSON.stringify(out, null, 1));
const byG = {}; cases.forEach(c => byG[c.group] = (byG[c.group] || 0) + 1);
const byP = {}; cases.forEach(c => byP[c.pri] = (byP[c.pri] || 0) + 1);
console.log('cases', cases.length, JSON.stringify(byG), JSON.stringify(byP), 'needs', cases.filter(c => c.needs).length, 'bugs', cases.filter(c => c.bug).length);
