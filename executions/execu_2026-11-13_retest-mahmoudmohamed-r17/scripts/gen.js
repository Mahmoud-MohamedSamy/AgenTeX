// Builds API cards + annotated evidence for round 17. node gen.js [ticket...]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname; const only = process.argv.slice(2);
const CRM = 'staging-crm.taviportal.com', DESK = 'staging-desk.taviportal.com', WHO = 'ndc-staging-owner', DATE = '13 Nov 2026';
const card = (out, title, rows, host = CRM) => {
  const f = path.join(D, 'cards', out.replace('.png', '.json')); fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify({ out, title, host, who: WHO, date: DATE, rows }, null, 1));
  const o = execFileSync('node', [path.join(D, 'apicard.js'), f]).toString().trim(); return JSON.parse(o.slice(o.indexOf('[')));
};
// panel from an API card: boxes on chosen rows (1-based) with kinds
const cardPanel = (out, title, rows, kinds, caption, host) => {
  const bx = card(out, title, rows, host); const last = bx[bx.length - 1];
  return { img: out, caption, full: true, crop: [0, 0, 1600, Math.min(900, last[3] + 24)], boxes: kinds.map((k, i) => k ? { b: bx[i], n: i + 1, kind: k } : null).filter(Boolean) };
};
const T = {};
const ENVC = 'NDC-Staging · staging-crm · ndc-staging-owner · Edge headless + API';
const ENVD = 'NDC-Staging · staging-desk · ndc-staging-owner · Edge headless + API';

T['NDC-2806'] = { priority: 'urgent', verdict: 'PASS', title: 'CRM Global Sets — full feature regression after the fixes (create, convert, clone, values, Replace, safeguards, permissions, audit)', env: ENVC + ' · QA RT17 sets/fields/records',
  panels: [cardPanel('2806-api-card.png', 'NDC-2806 Global Sets regression (API)', [
    ['Create + negatives', 'POST /global-sets (empty name / duplicate name / duplicate value)', '201 · 422 "needs a name" · 409 NAME_TAKEN · 422 "\'A\' appears more than once"', 'ok'],
    ['Convert / associate', 'POST /global-sets/{id}/associate {mappings:{Copper:"Gold"}} · POST /global-sets/from-field', '200, record Copper → Gold · 201 set from local field, field linked', 'ok'],
    ['Field on two sets / unlink', 'associate to 2nd set · POST /disassociate', '409 GLOBAL_SET_FIELD_ALREADY_LINKED · 200, field local, record keeps Gold', 'ok'],
    ['Clone', 'POST /global-sets/{id}/clone', '201 "QA RT17 GS Tier_Cloned", same values', 'ok'],
    ['Values follow', 'PUT add Platinum (colour) · reorder', 'Linked field: Gold,Bronze,Platinum · order Platinum,Bronze,Gold = set', 'ok'],
    ['Unused / restore', 'POST /values/remove Platinum · new record Platinum · /values/restore', '200 · 422 (unused value refused) · 200', 'ok'],
    ['Locked / wrong type', 'associate lead_status, first_name', '422 GLOBAL_SET_FIELD_DATATYPE (status / single_line)', 'ok'],
    ['> 15 fields', '16 linked fields (Leads 9 + Customers 7): replace, delete', '409 GLOBAL_SET_TOO_MANY_FIELDS for both', 'ok'],
    ['Delete', 'DELETE unused set · DELETE set used by ≤15 fields', '204 then 404 · 204, fields become local and keep values (same as Zoho)', 'ok'],
    ['Permissions + audit', 'GET /iam/permissions · GET /audit/events?entity_type=global_set', 'crm:global_set:view + manage · 32 events today', 'ok']],
    ['PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS', 'PASS'], 'Every function of the feature exercised on QA RT17 data'),
  { img: '2867-ui-3-done.png', caption: 'Replace in the set editor now reports what it changed: records, custom views, blueprints, dependency maps, workflow rules', crop: [464, 400, 672, 400], boxes: [{ b: [488, 517, 1112, 603], n: 11, kind: 'PASS' }] }],
  rows: [[1, 'Create / negatives', 'Unique name, no duplicate values', '201; empty name 422, duplicate 409, duplicate value 422', 'PASS'],
    [2, 'Convert existing pick list (mapping, from-field)', 'Linked; unmatched values mapped', 'Copper → Gold mapped; from-field 201', 'PASS'],
    [3, 'Clone / values / unused / restore', 'Field follows the set', 'All follow; unused value refused on records', 'PASS'],
    [4, 'Safeguards (locked fields, > 15 fields)', 'Refused', '422 / 409 TOO_MANY_FIELDS', 'PASS'],
    [5, 'Replace propagates (records, views, rules, reports, dependency, blueprints)', 'NDC-2806 scope', 'All propagate — see NDC-2866/2867/2917/2918/2919', 'PASS'],
    [6, 'Permissions + audit', 'Seeded; actions logged', 'view/manage seeded; 32 audit events', 'PASS'],
    [7, 'Report shows renamed label', 'New label', 'Still stored value — tracked in NDC-2917', 'INFO']] };

T['NDC-2729'] = { priority: 'urgent', verdict: 'FAIL', title: 'Blueprint create-record actions — CRM part fixed; Desk blueprint After actions unchanged', env: 'NDC-Staging · CRM AEX-01 (Transactions) + Desk "Tickets from Mail" · ndc-staging-owner · nothing saved',
  panels: [{ img: '2729-crm-task-defaults.png', caption: 'CRM AEX-01 › NeedsAnalysisToProposal › After › Create task: one ASSIGN TO, no module picker, Reminder starts at None', crop: [1160, 340, 440, 470], boxes: [{ b: [1176, 345, 1584, 525], n: 1, kind: 'PASS' }, { b: [1188, 690, 1572, 750], n: 2, kind: 'PASS' }] },
    { img: '2729-desk-newCT-dept.png', caption: 'Desk "Tickets from Mail" › Escalate Ticket › After › Create task: Department* and Team are still plain text boxes', crop: [1168, 590, 432, 260], boxes: [{ b: [1196, 712, 1572, 845], n: 3, kind: 'FAIL' }] }],
  rows: [[1, 'CRM Create task owner / module', 'One owner setting, no module dropdown', 'ASSIGN TO only; no module picker, no Task Owner', 'PASS'],
    [2, 'CRM pick list defaults', 'First option', 'Reminder None, Status Not Started, Priority first', 'PASS'],
    [3, 'Desk Create task Department / Team', 'Zoho: no Department/Team boxes; Assign to picker', 'Department* and Team plain text inputs', 'FAIL'],
    [4, 'Desk Field update value (pick list)', 'Zoho: starts at -None-', 'Starts at "Value" (Value, Open, On Hold…)', 'FAIL'],
    [5, 'Desk Field update fields offered', 'Zoho: no Status/Team/Department/Skills', 'Status, Department, Team, Skills offered; Department/Team plain text "Value"', 'FAIL']] };

T['NDC-2174'] = { priority: 'urgent', verdict: 'PASS', title: 'Desk Modules and Fields — last open item: a department layout\'s default status is now applied', env: ENVD + ' · throwaway dept "QA RT17 2174 Dept" + layout',
  panels: [{ img: '2174-new-ticket-status-opts.png', caption: 'New ticket, department QA RT17 2174 Dept → Status starts on Escalated (the layout default); only Open / Escalated / Closed offered', crop: [420, 420, 500, 340], boxes: [{ b: [603, 436, 906, 468], n: 1, kind: 'INFO' }, { b: [603, 575, 906, 685], n: 2, kind: 'PASS' }, { b: [603, 692, 906, 736], n: 3, kind: 'PASS' }] },
    cardPanel('2174-api-card.png', 'NDC-2174 default status (API)', [
      ['Layout statuses', 'PUT /modules/{Tickets}/layouts/{id}/ticket-statuses {Open,Escalated,Closed; default Escalated}', '200', 'info'],
      ['Create without status', 'POST /modules/{Tickets}/records {subject, department}', '201 → status Escalated (9 Nov: 422 "Status is required.")', 'ok'],
      ['Create with Open', 'POST … status Open', '201 → Open', 'ok'],
      ['Status not on layout', 'POST … status On Hold', '422 "\'On Hold\' is not one of this layout\'s statuses: Open, Escalated, Closed."', 'ok']], [null, 'PASS', 'PASS', 'PASS'], 'API', DESK)],
  rows: [[1, 'Pick department on New Ticket', 'Status = layout default (Escalated)', 'Status shows Escalated', 'PASS'],
    [2, 'Statuses offered', 'Only the layout\'s statuses', 'Open, Escalated, Closed', 'PASS'],
    [3, 'API create without status', 'Default applied', '201, status Escalated', 'PASS'],
    [4, 'Other items (1–9, 11, 12)', 'Built', 'Passed 3 and 9 Nov; not changed', 'INFO']] };

T['NDC-2866'] = { priority: 'high', verdict: 'PASS', title: 'Global Sets | Replace now updates workflow rule criteria and field updates', env: ENVC + ' · set "QA RT17 GS Tier", rule "QA RT17 2866 Bronze rule" (inactive)',
  panels: [cardPanel('2866-api-card.png', 'NDC-2866 Replace vs workflow rules (API)', [
    ['Setup', 'POST /workflow/rules  criteria Tier = Bronze, action Field update Tier = Silver', '201; Used In lists the rule', 'info'],
    ['Replace Bronze → Gold', 'POST /global-sets/{id}/values/replace {Bronze:"Gold"}', '200; rule criteria now "Gold"; record Bronze → Gold', 'ok'],
    ['Replace Silver → Gold', 'POST …/replace {Silver:"Gold"}', '200; rule field update now "Gold"', 'ok'],
    ['Remove a value a rule uses', 'POST …/values/remove {values:["Silver"]} (rule action = Silver)', '409 "\\"Silver\\" is used by workflow rules or processes. Change or remove it there first, or use Replace."', 'ok'],
    ['Replace Silver → Bronze', 'POST …/replace {Silver:"Bronze"}', '200; rule action now "Bronze"', 'ok'],
    ['Rule run', 'switch rule on, create lead Tier = Gold', 'No execution recorded for the rule in 40 s (not observed)', 'info']], [null, 'PASS', 'PASS', 'PASS', 'PASS', 'INFO'], 'Rule definition read back after each Replace')],
  rows: [[1, 'Replace value used in rule criteria', 'Criteria follow the new value (Zoho)', 'Bronze → Gold: criteria Gold', 'PASS'],
    [2, 'Replace value used in a field update', 'Action follows the new value', 'Silver → Gold, Silver → Bronze: action follows', 'PASS'],
    [3, 'Remove a value a rule uses', 'Warned / refused', '409 GLOBAL_SET_VALUE_IN_USE with guidance', 'PASS'],
    [4, 'Rule runs after Replace', 'Writes a used value', 'Not observed (no execution in 40 s)', 'INFO']] };

T['NDC-2917'] = { priority: 'high', verdict: 'PARTIAL', title: 'Global Sets | Replace now updates the report filter; a renamed value still shows its old stored value in the report', env: ENVC + ' · set "QA RT17 GS 2917", report "QA RT17 2917 Gold report B"',
  panels: [cardPanel('2917-api-card.png', 'NDC-2917 Replace vs reports (API)', [
    ['Report', 'POST /reporting/reports filter qa_rt17_rep eq "Gold"', '201', 'info'],
    ['Replace Gold → Silver', 'POST /global-sets/{id}/values/replace {Gold:"Silver"}', '200; report filter now eq "Silver"', 'ok'],
    ['Run report', 'POST /reporting/reports/{id}/query', 'after 3 s: 1 row; after 25 s: 3 rows, all Silver (11 Nov: stale 2 rows > 70 s, then 0)', 'ok'],
    ['Rename label', 'PUT set: Silver label → "Silver Star"', '200; report rows still "Silver" (stored value)', 'bad']], [null, 'PASS', 'PASS', 'FAIL'], 'Report definition and results read back'),
  { img: '2917-report-ui.png', caption: 'Report screen after Replace + rename: 3 rows, value shown as "Silver", not the label "Silver Star"', crop: [276, 60, 1310, 230], boxes: [{ b: [293, 170, 1566, 268], n: 5, kind: 'FAIL' }] }],
  rows: [[1, 'Replace Gold → Silver', 'Report filter follows (Zoho: "IS Silver")', 'Filter now eq Silver', 'PASS'],
    [2, 'Report results after Replace', 'All records under the new value', '3 rows Silver (after ~25 s)', 'PASS'],
    [3, 'After an edit', 'Still correct', '3 rows', 'PASS'],
    [4, 'Rename a value', 'Report shows the new label', 'Still "Silver" (stored value), not "Silver Star"', 'FAIL']] };

T['NDC-2918'] = { priority: 'high', verdict: 'PASS', title: 'Global Sets | Replace now updates field dependency maps', env: ENVC + ' · set "QA RT17 GS 2918", 2 dependency maps on Leads',
  panels: [cardPanel('2918-api-card.png', 'NDC-2918 Replace vs field dependency (API)', [
    ['Maps', 'POST /modules/{Leads}/dependency-maps  set field parent {Gold:[X],Silver:[Y]} · child {P:[Gold,Silver],Q:[Bronze]}', '201, 201; Gold+X 201, Gold+Y 422, P+Gold 201, Q+Gold 422', 'info'],
    ['Used In', 'GET /global-sets/{id}/used-in', 'dependency_maps: "QA RT17 DP → QA RT17 DC", "QA RT17 PP → QA RT17 DC2"', 'ok'],
    ['Replace Gold → Bronze', 'POST …/values/replace {Gold:"Bronze"}', '200', 'info'],
    ['Maps after', 'GET /modules/{Leads}/dependency-maps', '{Bronze:[X],Silver:[Y]} · {P:[Bronze,Silver],Q:[Bronze]} (no Gold left)', 'ok'],
    ['Records after', 'existing leads edited; new Bronze+X / +Y / +Z', 'old leads Bronze+X, P+Bronze, edits 200; new 201 / 422 / 422', 'ok']], [null, 'PASS', null, 'PASS', 'PASS'], 'Maps and records read back after Replace')],
  rows: [[1, 'Used In lists dependency maps', 'Admin is warned', 'Both maps listed', 'PASS'],
    [2, 'Map with set field as parent', 'Follows new value (Zoho)', 'Gold → X became Bronze → X', 'PASS'],
    [3, 'Map with set field as child', 'Follows new value', 'P: Gold,Silver → Bronze,Silver', 'PASS'],
    [4, 'Records stay valid; rules still enforced', 'Valid, wrong combos refused', 'Edits 200; Bronze+Y/Z 422', 'PASS']] };

T['NDC-2919'] = { priority: 'low', verdict: 'PASS', title: 'Global Sets | A value used by an inactive blueprint can no longer be removed', env: ENVC + ' · set "QA RT17 GS 2919", inactive blueprint "QA RT17 2919 BP" (QA-only entry criteria)',
  panels: [cardPanel('2919-api-card.png', 'NDC-2919 inactive blueprint (API)', [
    ['Setup', 'POST /modules/{Leads}/blueprints isActive:false, states Open/Working/Done on the set field', '201; Used In blueprints: ["QA RT17 2919 BP"]', 'ok'],
    ['Remove Done', 'POST /global-sets/{id}/values/remove {values:["Done"]}', '409 "\\"Done\\" is a state of a blueprint. Remove the state from the blueprint first." (was 200)', 'ok'],
    ['Replace Working → Spare', 'POST …/values/replace', '200; blueprint states Open, Spare, Done; transitions follow', 'ok'],
    ['Switch on', 'PUT blueprint isActive:true, then off', '200 / 200 (was: "State \'Done\' is not an allowed value")', 'ok']], [null, 'PASS', 'PASS', 'PASS'], 'Blueprint read back')],
  rows: [[1, 'Remove a state value of an inactive blueprint', 'Refused / warned', '409 with guidance', 'PASS'],
    [2, 'Used In lists blueprints', 'Listed', 'QA RT17 2919 BP', 'PASS'],
    [3, 'Blueprint can still be switched on', 'Works', '200', 'PASS']] };

T['NDC-2868'] = { priority: 'low', verdict: 'PASS', title: 'Global Sets | A save without the version number is now refused', env: ENVC + ' · set "QA RT17 GS 2868"',
  panels: [cardPanel('2868-api-card.png', 'NDC-2868 row_version (API)', [
    ['Normal save', 'PUT /global-sets/{id} {description:"edit one", row_version:1}', '200 → row_version 2', 'ok'],
    ['Save without version', 'PUT /global-sets/{id} {description:"no version save"} (no row_version)', '400 GLOBAL_SET_VERSION_REQUIRED "row_version is required. Reload the global set…" (was 200)', 'ok'],
    ['Stale save', 'PUT … row_version:1', '409 GLOBAL_SET_VERSION_CONFLICT', 'ok'],
    ['Stored', 'GET /global-sets/{id}', 'description still "edit one"', 'ok']], [null, 'PASS', 'PASS', 'PASS'], 'Nothing overwritten')],
  rows: [[1, 'PUT without row_version', 'Refused or required', '400 GLOBAL_SET_VERSION_REQUIRED', 'PASS'],
    [2, 'PUT with old row_version', '409', '409 VERSION_CONFLICT', 'PASS'],
    [3, 'Stored set', 'Not overwritten', '"edit one" kept', 'PASS']] };

T['NDC-2869'] = { priority: 'low', verdict: 'PASS', title: 'Global Sets | The set editor is fully translated in Arabic', env: ENVC + ' · language العربية (switched back to English afterwards)',
  panels: [{ img: '2869-ar-editor-unused.png', caption: 'Arabic set editor: "القيم (2)" and "نقل 0 إلى القيم المستخدمة" are now translated', crop: [464, 340, 672, 440], boxes: [{ b: [1040, 356, 1116, 382], n: 1, kind: 'PASS' }, { b: [488, 742, 648, 776], n: 2, kind: 'PASS' }, { b: [990, 674, 1116, 698], n: 3, kind: 'PASS' }] }],
  rows: [[1, '"VALUES (2)"', 'Arabic', 'القيم (2)', 'PASS'], [2, '"Move 0 to used values"', 'Arabic', 'نقل 0 إلى القيم المستخدمة', 'PASS'], [3, 'Rest of the editor', 'Arabic, RTL', 'No English UI text found in the editor', 'PASS']] };

T['NDC-2916'] = { priority: 'low', verdict: 'PASS', title: 'Global Sets | "+ New Global Set" is now on one line', env: ENVC + ' · 1280×984 and 1600×900',
  panels: [{ img: '2916-globalsets-1280.png', caption: 'Settings › Modules and Fields › Global Sets at 1280 px: "+ New Global Set" on one row', crop: [880, 110, 400, 70], boxes: [{ b: [1108, 122, 1266, 160], n: 1, kind: 'PASS' }] }],
  rows: [[1, 'Button at 1280 px', 'Icon and label inline, one row', 'One row, 36 px high, white-space nowrap, inline-flex row', 'PASS'], [2, 'Button at 1600 px', 'Same', 'Same', 'PASS']] };

T['NDC-2867'] = { priority: 'medium', verdict: 'PASS', title: 'Global Sets | Replace now works when a custom view filters on the value (the view follows)', env: ENVC + ' · set "QA RT17 GS 2867", private view "QA RT17 2867 Gold view"',
  panels: [{ img: '2867-ui-3-done.png', caption: 'Edit Global Set › Replace Silver → Bronze: done, "1 custom view updated" (was 409 "used by custom view filters")', crop: [464, 400, 672, 400], boxes: [{ b: [488, 517, 1112, 603], n: 1, kind: 'PASS' }] },
    { img: '2867-view-list.png', caption: 'The view still lists its 2 leads after Replace (criteria now the new value)', crop: [260, 140, 1000, 300], boxes: [{ b: [262, 280, 1250, 388], n: 2, kind: 'PASS' }] }],
  rows: [[1, 'Replace a value a view filters on (API, Gold → Silver)', 'Runs (Zoho)', '200; view criteria Silver; records Silver', 'PASS'],
    [2, 'Replace on screen (Silver → Bronze)', 'Runs, view follows', '200, "1 custom view updated"; criteria Bronze', 'PASS'],
    [3, 'View after Replace', 'Still shows the records', '2 rows', 'PASS']] };

T['NDC-2807'] = { priority: 'high', verdict: 'PARTIAL', title: 'Bulk operations — survive in-app navigation; mass update and bin delete still stop on a full page navigation', env: ENVC + ' · 200 leads "QA RT17 2807 0001–0200", private view',
  panels: [{ img: '2807-5b-home.png', caption: 'In-app Home link during a mass update: progress panel keeps running ("30 of 200 done") → 200/200 updated', crop: [0, 780, 700, 120], boxes: [{ b: [24, 803, 284, 875], n: 1, kind: 'PASS' }] },
    { img: '2807-9-second-open.png', caption: 'Second Mass Update while one runs: "A mass update is already running for this module." Update disabled', crop: [512, 270, 576, 360], boxes: [{ b: [537, 365, 1063, 395], n: 2, kind: 'PASS' }] },
    cardPanel('2807-api-card.png', 'NDC-2807 counts after leaving (API)', [
      ['Mass update + full navigation', 'Lead Source = referral on 200, then page.goto("/") 1 s later', '10 / 200 changed after 45 s (client sends 10 ids per call)', 'bad'],
      ['Mass update + in-app link', 'Lead Source = Chat on 200, close dialog, Home link', '200 / 200 changed', 'ok'],
      ['Mass delete + full navigation', 'Mass Delete, criteria Last Name starts "2807 ", 200 records', 'POST …/mass-delete: matched 200, deleted 200, failed 0', 'ok'],
      ['Recycle Bin delete + full navigation', 'Batch view, Delete (50), leave 2.6 s after request', '0 / 50 removed (200 still in bin)', 'bad']], ['FAIL', 'PASS', 'PASS', 'FAIL'], 'Record / bin counts read by API')],
  rows: [[1, 'Leave via in-app navigation during mass update', 'Keeps running, progress shown', 'Progress panel; 200/200', 'PASS'],
    [2, 'Start a second run on the same records', 'Blocked', '"already running… Wait until it finishes"', 'PASS'],
    [3, 'Mass delete then leave', 'Finishes', '200 deleted, 0 failed (server side)', 'PASS'],
    [4, 'Mass update then reload / leave the app', 'Keeps running (Zoho: background job)', '10 of 200 done; stops', 'FAIL'],
    [5, 'Recycle Bin delete then reload / leave', 'Keeps running', '0 of 50 removed', 'FAIL'],
    [6, 'Empty whole bin', '—', 'Not run (bin holds other people\'s items)', 'INFO']] };

T['NDC-2630'] = { priority: 'high', verdict: 'PARTIAL', title: 'Email — failed sends are honest and Compose is blocked; the message still carries a "Sent" chip', env: ENVC + ' · leads "QA RT17 2630 send" / "send real"',
  panels: [{ img: '2630-compose.png', caption: 'Compose Email for a sender the provider refuses: warning with the reason; Send disabled (was open with Send enabled)', crop: [352, 45, 896, 810], boxes: [{ b: [376, 126, 1224, 219], n: 1, kind: 'PASS' }, { b: [372, 807, 460, 843], n: 2, kind: 'PASS' }] },
    { img: '2630-record-emails-refused.png', caption: 'Record › Emails: "Not sent: No Zoho account found…", Failed + Retry', crop: [306, 532, 700, 62], boxes: [{ b: [310, 538, 1000, 590], n: 3, kind: 'PASS' }] },
    { img: '2630-email-detail.png', caption: 'Message dialog: blue "Sent" chip beside the red status chip', crop: [480, 330, 640, 60], boxes: [{ b: [792, 342, 824, 362], n: 4, kind: 'FAIL' }] }],
  rows: [[1, 'Compose when the sender can\'t send', 'Blocked with a reason (Zoho)', 'Warning + reason; Send disabled', 'PASS'],
    [2, 'Send (API) as refused sender', 'Failed with reason', '422 MAIL_SEND_FAILED; Emails tab Failed + Retry', 'PASS'],
    [3, 'Timeline', 'No "email sent"', 'RecordCreated only', 'PASS'],
    [4, 'Message dialog of a failed mail', 'Only the failed status', 'Blue "Sent" chip next to red Failed / Bounced', 'FAIL'],
    [5, 'Hard bounce (reserved domain)', 'Shown as failed', '"Bounced" with reason in API; no Retry', 'INFO']] };

T['NDC-2860'] = { priority: 'medium', verdict: 'PASS', title: 'Record Form | Dropdowns no longer cover the header or Save when the form is scrolled', env: ENVD + ' · Create Ticket · 1272×866 · nothing saved',
  panels: [{ img: '2860-owner-start300.png', w: 1272, h: 866, caption: 'Ticket Owner list stays under its field while scrolling, below the action bar; Save stays clickable', crop: [700, 100, 572, 440], boxes: [{ b: [1197, 109, 1248, 141], n: 1, kind: 'PASS' }, { b: [938, 193, 1264, 521], n: 2, kind: 'PASS' }] },
    { img: '2860-TicketOwner-2-scrolled.png', w: 1272, h: 866, caption: 'Observation: a list that opened upward is pushed down over its own field after scrolling', crop: [700, 100, 572, 440], boxes: [{ b: [938, 162, 1264, 492], n: 3, kind: 'INFO' }] }],
  rows: [[1, 'Save / header while a list is open', 'Never covered', 'Not covered; hit-test at Save = Save', 'PASS'],
    [2, 'Department list, scroll 400 px', 'Follows or closes', 'Closes', 'PASS'],
    [3, 'Ticket Owner list while field visible', 'Stays attached', 'Directly under the field', 'PASS'],
    [4, 'Field leaves the view', 'List closes', 'Closes', 'PASS'],
    [5, 'List opened upward, then scroll', 'Obvious which field', 'Pushed down over its own field', 'INFO']] };

T['NDC-2810'] = { priority: 'high', verdict: 'PASS', title: 'CRM ⇄ Desk sync — deletions are unlinked in both directions; a full sync ends with no failures', env: 'NDC-Staging · staging-crm + staging-desk · ndc-staging-owner · Desk contacts "QA RT17 2810 A/B"',
  panels: [cardPanel('2810-api-card.png', 'NDC-2810 sync (API)', [
    ['Setup', 'POST Desk contacts A, B → wait 45 s', 'Both synced to CRM (links synced)', 'info'],
    ['Delete in CRM', 'DELETE CRM contact B', '204 → link "unlinked", no failure; Desk B stays (11 Nov: Needs attention "The CRM record was deleted.")', 'ok'],
    ['Delete in Desk', 'DELETE Desk contact A', '204 → link "unlinked", no failure', 'ok'],
    ['Sync all customers', 'POST /desk/integrations/crm/imports/customers → run 00d4c4ab', 'requested 118, added 0, updated 10, ignored 108 (deleted in Desk 94, unchanged 14), failed 0, needs attention 0', 'ok'],
    ['Failure log', 'GET /desk/integrations/crm/failures', 'nothing new since the run; "B04" no longer listed', 'ok']], [null, 'PASS', 'PASS', 'PASS', 'PASS'], 'Run summary and links read back', DESK)],
  rows: [[1, 'Record deleted in CRM', 'Unlinked, not a failure', 'Unlinked, no failure', 'PASS'],
    [2, 'Record deleted in Desk', 'Unlinked, not a failure', 'Unlinked, no failure', 'PASS'],
    [3, 'Sync all customers', 'No failures with nothing new', 'failed 0, needs attention 0', 'PASS'],
    [4, 'Older Failure Log entries', '—', '138 entries from earlier days still listed (history)', 'INFO']] };

T['NDC-2794'] = { priority: 'high', verdict: 'FAIL', title: 'Workflow Rules | Team + agent: the ticket gets the agent, but the team is still cleared', env: ENVD + ' · team "QA RT17 2794 team", rule "QA RT17 2794 team+agent" (deactivated after)',
  panels: [{ img: '2794-history.png', caption: 'Ticket #3478 History: Team set, then "Team was updated: QA RT17 2794 team → blank"; owner Test User 1', crop: [664, 240, 600, 420], boxes: [{ b: [690, 392, 1000, 470], n: 1, kind: 'FAIL' }, { b: [690, 290, 1000, 368], n: 2, kind: 'PASS' }] }],
  rows: [[1, 'Rule with team + agent of that team', 'Saved', '201', 'PASS'], [2, 'Agent outside the team', 'Refused', '400 "the agent is not a member of the team"', 'PASS'],
    [3, 'Ticket matching the rule', 'Owner = agent, team kept (Zoho)', 'Owner = Test User 1; team null at 5/15/30 s', 'FAIL']] };

T['NDC-2823'] = { priority: 'medium', verdict: 'PARTIAL', title: 'Tickets | "Select all N in this view" is built; bulk Close on the whole view fails', env: ENVD + ' · 60 tickets "QA RT17 2823 01–60" + private view',
  panels: [{ img: '2823-2-selectall.png', caption: 'Select all → "50 of 557 selected · Select all 557 in this view" (same on the 60-ticket view)', crop: [270, 62, 700, 46], boxes: [{ b: [396, 72, 676, 96], n: 1, kind: 'PASS' }] },
    { img: '2823-5-after-close.png', caption: 'Bulk Close on all 60: toast "0 updated, 60 failed." — while 10 did close', crop: [1100, 800, 500, 100], boxes: [{ b: [1297, 820, 1575, 875], n: 3, kind: 'FAIL' }] },
    cardPanel('2823-api-card.png', 'NDC-2823 bulk actions on the whole view', [
      ['Bulk Update (Priority)', '61 selected (whole view) › Update › Priority = Medium', '7 × POST mass-update 200 → 61/61 Medium', 'ok'],
      ['Bulk Close run 1', 'Close 60 tickets', 'toast "0 updated, 60 failed."; API: 10 closed', 'bad'],
      ['Bulk Close run 2 / 3', 'Close 61 tickets', '39 × 500 + 12 × 409 / 14 × 500 + 37 × 409 — 500 INTERNAL "An unexpected error occurred."', 'bad'],
      ['Same tickets by API', 'POST /desk/tickets/{id}/close one by one (and 10 in parallel)', '200 for every ticket', 'info']], ['PASS', 'FAIL', 'FAIL', null], 'Statuses / priorities read back', DESK)],
  rows: [[1, 'Select every ticket of the view in one action', 'Like Zoho "Select all tickets in this view"', '"Select all 60 in this view" → whole view selected', 'PASS'],
    [2, 'Bulk Update on the whole view', 'Applies to all', '61/61', 'PASS'],
    [3, 'Bulk Close on the whole view', 'Applies to all', 'Many 500 INTERNAL; toast "0 updated, 60 failed" while some closed', 'FAIL']] };

T['NDC-2635'] = { priority: 'medium', verdict: 'PARTIAL', title: 'Activity Life Cycle — Delete on the activity page and the activity count are built; global activities API still missing', env: ENVD + ' · ticket "QA RT17 2635 ticket" #3540 with tasks A/B/C + call',
  panels: [{ img: '2635-task-delete-confirm.png', caption: 'Task page › Delete: "will be moved to the Recycle Bin" → deleted (204)', crop: [608, 362, 384, 178], boxes: [{ b: [620, 380, 980, 525], n: 1, kind: 'PASS' }] },
    { img: '2635-ticket-tabs-after.png', caption: 'Ticket tabs: "1 ACTIVITY" (count shown; 2 before the delete)', crop: [664, 150, 860, 45], boxes: [{ b: [1248, 160, 1324, 184], n: 2, kind: 'PASS' }] },
    cardPanel('2635-api-card.png', 'NDC-2635 activities API', [
      ['Ticket counts', 'GET /desk/tickets/{id}', 'counts.activities 3 → 2 → 1', 'ok'],
      ['Ticket activities', 'GET /desk/tickets/{id}/activities (?due=overdue) · /activities/count', '200 list (overdue 0) · 200 {total, open, overdue, tasks, calls, events}', 'ok'],
      ['Global endpoints', 'GET /desk/activities, /stats, /reports, /count, /desk/tasks/count', '404 (Zoho: /tasks/count, activities across tickets)', 'bad']], ['PASS', 'PASS', 'FAIL'], 'API', DESK)],
  rows: [[2, 'Delete on task / call page', 'Delete to Recycle Bin (Zoho)', 'Delete button on task and call pages; works', 'PASS'],
    [4, 'Activity count on the ticket', '"N ACTIVITY"', '"2 ACTIVITY" → "1 ACTIVITY"', 'PASS'],
    [5, 'Ticket activities API + filters', 'Endpoint and due filters', '/desk/tickets/{id}/activities + /count', 'PASS'],
    [5, 'Global activities / tasks count API', 'As Zoho', '404', 'FAIL'],
    [1, 'Department / bulk delete (items 1, 3)', '—', 'Passed 11 Nov', 'INFO']] };

T['NDC-2137'] = { priority: 'low', verdict: 'FAIL', title: 'Custom Views | Kanban headers are fast now, but cards never load (every column request returns 500)', env: ENVC + ' · Transactions Kanban (Standard pipeline), 8 timed loads',
  panels: [{ img: '2137-kanban.png', caption: 'Transactions Kanban: columns show "Could not load these records" + "An unexpected error occurred."', crop: [276, 260, 1324, 640], boxes: [{ b: [578, 360, 862, 425], n: 1, kind: 'FAIL' }, { b: [1172, 820, 1574, 875], n: 2, kind: 'FAIL' }, { b: [280, 268, 562, 336], n: 3, kind: 'PASS' }] }],
  rows: [[1, 'Kanban first cards', 'Load (target p95 2 s)', 'Never load; 140/140 column requests 500', 'FAIL'], [2, 'records?skip_total=true', '200', '500 on Transactions, Leads, Tasks (200 without)', 'FAIL'],
    [3, 'Kanban headers', 'p95 ≤ 2 s', 'p50 1.15 s, p95 1.59 s (11 Nov: 19.11 s)', 'PASS']] };

T['NDC-2136'] = { priority: 'low', verdict: 'FAIL', title: 'Custom Views | Leads list first page is much faster, but still above the 1.5 s target', env: ENVC + ' · All Leads (1,202 records), 10 timed loads after warm-up',
  panels: [cardPanel('2136-api-card.png', 'NDC-2136 Leads list first page (navigation → first real row)', [
    ['Loads (s)', '10 navigations to Leads, list mode', '1.86, 1.50, 2.29, 2.56, 2.64, 2.53, 2.23, 4.03, 1.97, 2.54', 'info'],
    ['p50 / p95', 'target p95 ≤ 1.5 s', 'p50 2.29 s, p95 4.03 s', 'bad'],
    ['11 Nov', 'same method', 'p50 4.28 s, p95 13.53 s (Zoho median 7.46 s)', 'info']], [null, 'FAIL', null], 'Timed in Edge headless')],
  rows: [[1, 'Leads first page p95', '≤ 1.5 s', '4.03 s (was 13.53 s)', 'FAIL'], [2, 'Leads first page p50', '—', '2.29 s (was 4.28 s)', 'INFO'], [3, 'Transactions', '—', 'Not re-measured (would change its Kanban mode)', 'INFO']] };

for (const [k, t] of Object.entries(T)) {
  if (only.length && !only.includes(k)) continue;
  const spec = { out: `${k}-retest-${t.verdict}.png`, ticket: k, priority: t.priority, title: t.title, verdict: t.verdict, env: t.env, date: DATE, panels: t.panels, rows: t.rows };
  const f = path.join(D, 'specs', k + '.json'); fs.writeFileSync(f, JSON.stringify(spec, null, 1));
  console.log(execFileSync('node', [path.join(D, 'annotate.js'), f]).toString().trim());
}
