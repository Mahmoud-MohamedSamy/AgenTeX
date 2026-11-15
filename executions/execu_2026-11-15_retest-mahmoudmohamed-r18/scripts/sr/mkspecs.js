const fs = require('fs'); const D = __dirname + '/../specs/';
const ENV = (acc, rest) => 'NDC-Staging · staging-crm · ' + acc + ' · ' + rest;
const S = [];
S.push({ out: 'NDC-2934-retest-PARTIAL.png', ticket: 'NDC-2934', priority: 'medium', title: 'Scoring Rules gap list | 3 of 15 items built (Clone, 30 conditions, search + status filter); 12 still missing', verdict: 'PARTIAL', env: ENV('ndc-staging-owner', 'Leads › Scoring Rules · QA RT18 SR rules · API + screen'),
 panels: [
  { img: '2934-2-row-menu.png', caption: 'Rules list: search box + status filter (All / Active / Inactive) and row menu Edit · Clone · Delete', crop: [280, 190, 1300, 710], boxes: [{ b: [292, 228, 732, 262], n: 3, kind: 'PASS' }, { b: [1362, 728, 1556, 798], n: 1, kind: 'PASS' }] },
  { img: '2934-6-clone-saved.png', caption: 'Clone opens "Clone Scoring Rule" with "Copy of QA RT18 SR K1"; Create → 201, new rule in the list', crop: [292, 280, 1290, 600], boxes: [{ b: [296, 330, 1570, 378], n: 1, kind: 'PASS' }] },
  { img: '2934-api-card.png', caption: 'API probes of the remaining gap items', crop: [0, 90, 1600, 450], boxes: [{ b: [36, 99, 1564, 157], n: 4, kind: 'FAIL' }, { b: [36, 167, 1564, 204], n: 6, kind: 'FAIL' }, { b: [36, 214, 1564, 272], n: 7, kind: 'FAIL' }, { b: [36, 282, 1564, 319], n: 8, kind: 'FAIL' }, { b: [36, 329, 1564, 366], n: 2, kind: 'PASS' }, { b: [36, 376, 1564, 413], n: 9, kind: 'FAIL' }, { b: [36, 423, 1564, 460], n: 11, kind: 'FAIL' }, { b: [36, 470, 1564, 528], n: 14, kind: 'FAIL' }] },
  { img: '2934-8-record-page.png', caption: 'Lead with Score 9 (API): the record page shows no score and no Scoring Rules section', crop: [1210, 350, 390, 500], boxes: [{ b: [1220, 356, 1568, 830], n: 13, kind: 'FAIL' }] },
  { img: '2938-3-create.png', caption: 'Workflow "Score value" trigger: no All / Selective Scoring Rules choice', crop: [576, 440, 448, 260], boxes: [{ b: [596, 510, 1004, 590], n: 15, kind: 'FAIL' }] }],
 rows: [
  [1, 'Clone a rule', 'Clone in the row menu (Zoho)', 'Row menu Edit · Clone · Delete; Clone pre-fills "Copy of …", Create 201', 'PASS'],
  [2, 'Up to 30 conditions per rule', '30 (Zoho Enterprise)', '30 entries 201; 31 → 422 "at most 30 entries"', 'PASS'],
  [3, 'Search + status filter on the list', 'Search box and Status filter', '"Search by name or description" (K2 → 2 rows) + All / Active / Inactive (Inactive → only F9 audit)', 'PASS'],
  [4, 'Rule per layout', 'Layout picker (one / All Layouts)', 'No layout in the editor; API layout_id accepted but not stored', 'FAIL'],
  [5, 'Which records a rule scores (criteria)', 'Add Criteria', 'No criteria in the editor; API criteria ignored', 'FAIL'],
  [6, 'Several conditions in one line + pattern', 'AND/OR + editable pattern', 'Still one condition per line; conditions[] → 422', 'FAIL'],
  [7, 'between / relative dates / pick list contains', 'Offered', '422 "\'between\' is not a known operator"; today/currentMonth/inLastDays unknown; pick list contains/startsWith refused', 'FAIL'],
  [8, 'Touch point (channel) scoring', 'Emails, calls, campaigns…', '422 "activity (touch point) scoring is not available"', 'FAIL'],
  [9, 'Update old records / Run Scoring Rules', 'Rescore existing records', 'No prompt on save; old lead not rescored (score 1, rule +6 not applied); no run action', 'FAIL'],
  [10, 'Score per rule, positive/negative, score fields per rule', 'Kept per rule', 'Record still has one "score" field only', 'FAIL'],
  [11, 'Switch a rule off keeps its scores', 'Points kept', 'Off + save: 8 → 1 (points dropped)', 'FAIL'],
  [12, 'Delete a rule removes its scores at once', 'Removed without editing records', 'Deleted rule (+7): lead still 8 until saved', 'FAIL'],
  [13, 'Scoring Rules section on the record page', 'Row per rule with Score', 'No score anywhere on the lead page', 'FAIL'],
  [14, 'API: clone, run, per-rule scores, activate/deactivate', 'Available', 'clone/duplicate/run/recalculate/stats/export/activate/deactivate/records/{id}/scores → 404/405', 'FAIL'],
  [15, 'Score workflow for selected scoring rules only', 'All / Selective Scoring Rules', 'Trigger offers Increases / Decreases / Either + threshold only', 'FAIL']] });
S.push({ out: 'NDC-2935-retest-PASS.png', ticket: 'NDC-2935', priority: 'medium', title: 'Scoring Rules | A field used by a scoring rule can no longer be deleted (API 422, screen lists the rules)', verdict: 'PASS', env: ENV('ndc-staging-owner', 'Leads · field qa_rt18sr_num · rules QA RT18 SR K1 + Copy of K1'),
 panels: [
  { img: '2935-4-confirm.png', caption: 'Layout editor › Unused Fields › delete QA RT18SR NUM: "This field is in use and cannot be deleted" with the scoring rules listed; Delete Permanently disabled', crop: [560, 270, 480, 360], boxes: [{ b: [600, 396, 1000, 542], n: 3, kind: 'PASS' }, { b: [869, 562, 1000, 594], n: 3, kind: 'PASS' }] },
  { img: '2935-api-card.png', caption: 'API: the delete is refused and the rule is untouched', crop: [0, 90, 1600, 215], boxes: [{ b: [36, 99, 1564, 157], n: 1, kind: 'PASS' }, { b: [36, 167, 1564, 246], n: 2, kind: 'PASS' }, { b: [36, 256, 1564, 293], n: 4, kind: 'PASS' }] }],
 rows: [
  [1, 'Rule "QA RT18SR NUM ≥ 5 → +9", lead with 6', 'Score 9', 'Score 9', 'PASS'],
  [2, 'DELETE the field (API)', 'Refused while used (Zoho: "already used in other places")', '422 FIELD_IN_USE_BY_RULE naming "QA RT18 SR K1"', 'PASS'],
  [3, 'Delete in the screen', 'Warn the admin', 'Dialog "This field is in use and cannot be deleted" › Scoring rules: Copy of QA RT18 SR K1, QA RT18 SR K1; Delete Permanently disabled', 'PASS'],
  [4, 'Rule and records after', 'Rule not broken', 'Field kept; rule 1 entry +9, active; no "needs attention"', 'PASS']] });
S.push({ out: 'NDC-2936-retest-PASS.png', ticket: 'NDC-2936', priority: 'low', title: 'Scoring Rules | Removing a pick list value used by a rule now warns, and the rule keeps the value marked "Needs attention"', verdict: 'PASS', env: ENV('ndc-staging-owner', 'Leads · QA RT18 SR Layout · pick lists qa_rt18sr_pl2/pl3 · rules QA RT18 SR K2b / K2 ui'),
 panels: [
  { img: '2936-5-warning.png', caption: 'Edit Properties › remove Alpha › Apply: "Scoring rules use these values" lists QA RT18 SR K2 ui — Alpha (Keep the values / Remove anyway)', crop: [560, 330, 480, 240], boxes: [{ b: [576, 343, 1024, 557], n: 1, kind: 'PASS' }] },
  { img: '2936-3-rule-editor.png', caption: 'Rule editor after the value was removed: banner + "Alpha (removed…)" value', crop: [960, 80, 640, 460], boxes: [{ b: [982, 92, 1580, 174], n: 3, kind: 'PASS' }, { b: [1272, 481, 1418, 512], n: 4, kind: 'PASS' }] },
  { img: '2936-5b-replace-dialog.png', caption: 'Remove anyway → "Replace removed options" (Leave empty / Beta) for the 1 record holding Alpha', crop: [560, 330, 480, 240], boxes: [{ b: [576, 341, 1024, 560], n: 6, kind: 'INFO' }] }],
 rows: [
  [1, 'Remove a value a rule uses (screen)', 'Admin is warned', 'Pop-up "Scoring rules use these values" naming the rule and value', 'PASS'],
  [2, 'Remove it through the API', '—', 'PUT field 200 with no warning in the answer; rule gets stale_entries option_retired', 'INFO'],
  [3, 'Rule state after removal', 'Rule keeps its condition (Zoho: value "unused")', 'List shows "Needs attention (1)"; editor banner "Entry 1 tests a value that was removed…"', 'PASS'],
  [4, 'Rule value', 'Kept', 'Stored value still "Alpha"; editor shows "Alpha (removed from the field)"', 'PASS'],
  [5, 'Record holding Alpha saved again', 'Keeps its points (was 4 → 0)', 'K2b lead keeps Alpha, score 4 after save', 'PASS'],
  [6, 'Screen path: Leave empty for that record', '—', 'Value cleared, but score stayed 6 until the record was saved again (then 2)', 'INFO']] });
S.push({ out: 'NDC-2937-retest-PASS.png', ticket: 'NDC-2937', priority: 'low', title: 'Scoring Rules | A CRM User now gets a no-access page with no New button; API still 403', verdict: 'PASS', env: ENV('Mahmoud Samy (CRM User profile)', 'Settings › Automation › Scoring Rules › Leads'),
 panels: [
  { img: '2937-2-direct-url.png', caption: 'CRM User opens Scoring Rules: "You can\'t manage scoring rules", no rules, no New Scoring Rule button', crop: [280, 60, 1320, 560], boxes: [{ b: [292, 80, 1576, 184], n: 2, kind: 'PASS' }, { b: [710, 368, 1158, 582], n: 1, kind: 'PASS' }] }],
 rows: [
  [1, 'Open the page', 'No menu item, or a no-access page', 'No-access state "You can\'t manage scoring rules — need the Modules and Fields manage permission…"', 'PASS'],
  [2, 'New Scoring Rule / editor', 'Not offered', 'No New Scoring Rule button, so no editor or field list', 'PASS'],
  [3, 'API as the same user', 'Refused', 'list, get, create, active, delete → 403 PERMISSION_DENIED', 'PASS'],
  [4, 'Settings menu', '—', 'Menu item "Scoring Rules" still listed (leads to the no-access page)', 'INFO']] });
S.push({ out: 'NDC-2938-retest-PASS.png', ticket: 'NDC-2938', priority: 'low', title: 'Workflow Rules | Score threshold now says "Enter a whole number…" and Create stays disabled', verdict: 'PASS', env: ENV('ndc-staging-owner', 'Workflow Rules › New Rule › Leads › Score value (not saved)'),
 panels: [
  { img: '2938-3-create.png', caption: '"Only when it reaches" = abc: red box, message under it, Create disabled', crop: [576, 440, 448, 320], boxes: [{ b: [596, 560, 1004, 612], n: 1, kind: 'PASS' }, { b: [931, 706, 1004, 742], n: 4, kind: 'PASS' }] }],
 rows: [
  [1, 'Type abc', 'Clear message', '"Enter a whole number from -1,000,000,000 to 1,000,000,000." (aria-describedby on the box)', 'PASS'],
  [2, 'Empty, 12.5, 999999999999999999', 'Same check', 'All marked invalid with the same message', 'PASS'],
  [3, 'Type -20', 'Accepted', 'Accepted, no message', 'PASS'],
  [4, 'Create with an invalid value', 'Blocked', 'Create disabled; dialog stays; nothing saved', 'PASS']] });
const card = (n, prio, title, acc, rows, boxes, extra = []) => ({ out: 'NDC-' + n + '-retest-PASS.png', ticket: 'NDC-' + n, priority: prio, title, verdict: 'PASS', env: ENV('ndc-staging-owner', acc), panels: [{ img: n + '-api-card.png', caption: 'API calls and answers', crop: [0, 90, 1600, boxes[boxes.length - 1][3] - 80], boxes: boxes.map((b, i) => ({ b, n: i + 1, kind: 'PASS' })) }, ...extra], rows });
S.push(card(2939, 'low', 'Scoring Rules | A save without row_version is now refused (400) and the rule is not overwritten', 'API · rule QA RT18 SR H2 (deleted later in the run)', [
  [1, 'PUT with the current row_version', '200', '200, version 2, points 5', 'PASS'],
  [2, 'PUT with no row_version', 'Refused', '400 SCORING_RULE_VERSION_REQUIRED; points stay 5', 'PASS'],
  [3, 'PUT with a stale row_version', '409', '409 SCORING_RULE_VERSION_CONFLICT; points stay 5', 'PASS']], [[36, 99, 1564, 136], [36, 146, 1564, 225], [36, 235, 1564, 293]]));
S.push(card(2940, 'low', 'Scoring Rules | Parallel creates with the same name: one 201, the others 422 duplicate', 'API · Leads · QA RT18 SR dbl / dbl3', [
  [1, '2 POST at the same moment', 'One 201, other refused', '201 / 422 "This module already has a scoring rule named \'QA RT18 SR dbl\'."', 'PASS'],
  [2, 'List the rules', 'One rule', '1 rule "QA RT18 SR dbl"', 'PASS'],
  [3, '3 POST at the same moment', 'One 201', '201 / 422 / 422; 1 rule saved', 'PASS'],
  [4, 'Later single create', '422', '422 duplicate', 'PASS']], [[36, 99, 1564, 157], [36, 167, 1564, 204], [36, 214, 1564, 251], [36, 261, 1564, 298]]));
S.push(card(2941, 'low', 'Scoring Rules | The same condition twice in one rule is now refused', 'API · Leads · QA RT18 SR C19 (not created)', [
  [1, 'Two identical lines (Lead Source is chat +3 ×2)', 'Refused (Zoho ALREADY_USED)', '422 "This condition is already given in entry 1 of this rule."', 'PASS'],
  [2, 'Same condition, different points', '—', '422 same message', 'PASS'],
  [3, 'Lead with Lead Source = chat', 'No double points', 'No such rule saved; lead score 0', 'PASS']], [[36, 99, 1564, 157], [36, 167, 1564, 204], [36, 214, 1564, 251]]));
S.push(card(2942, 'low', 'Scoring Rules | API now accepts only the conditions the editor offers per field type', 'API · Leads · QA RT18 SR I6 rules', [
  [1, 'regexMatches on Company', 'Refused', '422 operator_unsupported, lists eq…isNotNull', 'PASS'],
  [2, 'lengthEq on Company', 'Refused', '422 operator_unsupported', 'PASS'],
  [3, 'isEmpty on Company', 'Only editor conditions', '201, stored as isNull (the editor\'s "is empty")', 'PASS'],
  [4, 'User / Lead Owner "is x"', 'Refused (only is empty / is not empty)', '422 "use one of: isNull, isNotNull"', 'PASS'],
  [5, 'Conditions the editor offers', 'Accepted', 'contains, isNull, user isNotNull → 201', 'PASS']], [[36, 99, 1564, 178], [36, 188, 1564, 225], [36, 235, 1564, 272], [36, 282, 1564, 340], [36, 350, 1564, 387]]));
S.push(card(2943, 'low', 'Scoring Rules | Unknown rule / module ids now answer 404, and the page says "This module no longer exists."', 'API + screen · Leads', [
  [1, 'DELETE unknown rule id', '404 SCORING_RULE_NOT_FOUND', '404 SCORING_RULE_NOT_FOUND', 'PASS'],
  [2, 'Delete the same rule twice', '2nd → 404', '204, then 404', 'PASS'],
  [3, 'List for unknown module', '404 MODULE_NOT_FOUND', '404 MODULE_NOT_FOUND', 'PASS'],
  [4, 'Create for unknown module', '—', '404 MODULE_NOT_FOUND', 'PASS'],
  [5, 'Page ?module=<unknown>', '"This module no longer exists."', '"This module no longer exists." + hint; no New Scoring Rule button', 'PASS']], [[36, 99, 1564, 136], [36, 146, 1564, 183], [36, 193, 1564, 251], [36, 261, 1564, 298]],
  [{ img: '2943-1-unknown-module.png', caption: 'Scoring Rules with an unknown module id in the link', crop: [290, 80, 1290, 300], boxes: [{ b: [640, 250, 1230, 345], n: 5, kind: 'PASS' }] }]));
S.push({ out: 'NDC-2944-retest-PASS.png', ticket: 'NDC-2944', priority: 'low', title: 'Scoring Rules | After a failed Create, focus now moves to Rule name', verdict: 'PASS', env: ENV('ndc-staging-owner', 'Leads › New Scoring Rule (not saved)'),
 panels: [{ img: '2944-1-after-create.png', caption: 'Empty form › Create: Rule name has the focus ring; Required. under the empty parts', crop: [960, 0, 640, 600], boxes: [{ b: [980, 110, 1580, 142], n: 1, kind: 'PASS' }, { b: [990, 400, 1530, 460], n: 2, kind: 'PASS' }] }],
 rows: [
  [1, 'Create with name and field rule empty (keyboard Enter and mouse click)', 'Focus on the first field with an error (Rule name)', 'document.activeElement = Rule name input both times', 'PASS'],
  [2, 'Errors shown', 'Marked', '3 "Required." messages, 3 controls aria-invalid', 'PASS']] });
S.push({ out: 'NDC-2945-retest-PASS.png', ticket: 'NDC-2945', priority: 'low', title: 'Audit Log | Scoring rule edits now read "Scoring lines from 1 › points: 15 to 1 › points: 20"', verdict: 'PASS', env: ENV('ndc-staging-owner', 'Audit Log › Scoring Rule · rule QA RT18 SR F9 audit'),
 panels: [{ img: '2945-3-audit-detail.png', caption: 'Audit Log filtered on Scoring Rule', crop: [410, 440, 1050, 240], boxes: [{ b: [546, 515, 1162, 556], n: 1, kind: 'PASS' }, { b: [546, 458, 1000, 500], n: 2, kind: 'PASS' }, { b: [546, 572, 980, 612], n: 3, kind: 'PASS' }] }],
 rows: [
  [1, 'Change one line\'s points 15 → 20', 'Old and new line, or at least points 15 → 20', '"updated QA RT18 SR F9 audit\'s Scoring lines from 1 › points: 15 to 1 › points: 20" (API: EntriesJson "1 › points: 15" → "1 › points: 20")', 'PASS'],
  [2, 'Switch the rule off', 'Readable', '"Active from yes to no"', 'PASS'],
  [3, 'Created / deleted entries', 'Still logged', '"added a Scoring Rule named …", "deleted a Scoring Rule named QA RT18 SR H2"', 'PASS'],
  [4, 'Line detail', '—', 'Line shown by number only (field / condition not named)', 'INFO']] });
for (const s of S) fs.writeFileSync(D + s.ticket + '.json', JSON.stringify(s, null, 1));
console.log(S.map(s => s.ticket + ' ' + s.verdict).join('\n'));
