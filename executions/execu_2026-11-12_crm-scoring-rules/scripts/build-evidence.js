// Builds every annotated evidence image for the Plane filing (bugs B02–B11 and gaps G1–G3).
const { execFileSync } = require('child_process'); const fs = require('fs'); const path = require('path');
const S = __dirname; const R = 'executions/execu_2026-11-12_crm-scoring-rules/evidence/';
const DATE = '12 Nov 2026'; const HOST = 'staging-crm.taviportal.com';
const ZHOST = 'crm.zoho.com · test org org944965048 · API v8';
const card = (out, title, rows, zoho, who) => { const f = path.join(S, 'specs', 'card-' + out + '.json');
  fs.writeFileSync(f, JSON.stringify({ out: out + '.png', title, host: zoho ? ZHOST : HOST, who: who || (zoho ? 'admin account' : 'owner account'), date: DATE, rows }));
  const o = execFileSync('node', [path.join(S, 'apicard.js'), f], { encoding: 'utf8' });
  const h = +(o.match(/size 780x(\d+)/) || [])[1]; const boxes = JSON.parse(o.trim().split('\n').pop().replace(/^\S+\.png /, ''));
  return { img: R + 'raw/' + out + '.png', w: 780, h, crop: [0, 0, 780, h], boxes }; };
const P = (side, c, caption, marks) => ({ side, img: c.img, w: c.w, h: c.h, crop: c.crop, caption, boxes: marks.map(([i, n, kind]) => ({ b: c.boxes[i], n, kind })) });
const S2 = (side, img, caption, crop, boxes) => ({ side, img: R + img, caption, crop, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const build = spec => { const f = path.join(S, 'specs', spec.out.replace('.png', '.json')); fs.writeFileSync(f, JSON.stringify(spec, null, 1)); console.log(execFileSync('node', [path.join(S, 'annotate-vs-zoho.js'), f], { encoding: 'utf8' }).trim().split('\n').pop()); };
const base = (out, title, env, panels, rows, label = 'BUG') => ({ out, ticket: 'Scoring Rules', title, verdict: label === 'GAP' ? 'GAP' : 'FAIL', label, date: DATE, env, leftHead: 'TAVI CRM (left)', rightHead: 'Zoho CRM (right)', panels, rows });
for (const f of ['uk2-removed-value-rule.png', 'ug9-threshold.png', 'ug9-create-invalid.png', 'ub10-bad-module.png', 'u9-c10.png', 'ul1-lowpriv-direct.png', 'ul2-lowpriv-create.png', 'uf1-record.png', 'u4-filled.png', 'u3-drawer.png'])
  if (fs.existsSync(path.join(S, '../evidence', f))) fs.copyFileSync(path.join(S, '../evidence', f), path.join(S, '../evidence/raw', f));
for (const f of ['z-update-old-records.png', 'z-record-scoring-section.png', 'z-criteria-and-pattern.png'])
  fs.copyFileSync(path.join(S, '../evidence/zoho-intake', f), path.join(S, '../evidence/raw', f));

// B02 K2
let t = card('K2-tavi', 'TAVI CRM — remove a pick list value that a scoring rule uses (rule "QA SR1112 K2": QA SR1112 PL is Alpha → +4)', [
  ['Set-up', 'POST /scoring-rules {qa_sr1112_pl eq Alpha → 4}', '201 · lead with PL = Alpha scores 4', 'info'],
  ['Remove Alpha from the field', 'PUT /modules/{leads}/fields/{qa_sr1112_pl} {allowed_values:[Beta, Gamma]}', '200 · value removed, no warning', 'bad'],
  ['Rule after the change', 'GET /scoring-rules/{K2}', '200 · entry still "Alpha"; editor shows the value empty', 'bad'],
  ['Lead saved again', 'PATCH /modules/{leads}/records/{lead}', '200 · Score 4 → 0, no message', 'bad']]);
let z = card('K2-zoho', 'Zoho CRM — remove a pick list value that a scoring rule uses (rule "QA SR1112 K2": QA SR1112 PL is Alpha → +4)', [
  ['Set-up', 'POST settings/fields (QA SR1112 PL: Alpha, Beta) + scoring rule (PL equal Alpha → 4)', '201 · field and rule created', 'info'],
  ['Remove Alpha', 'PATCH /crm/v8/settings/fields/{id}?module=Leads {pick_list_values:[{Alpha, _delete}]}', '200 · field updated', 'info'],
  ['Values after', 'GET /crm/v8/settings/fields/{id}', '-None- (used), Beta (used), Alpha (unused) · Alpha is kept as unused', 'ok'],
  ['Rule after', 'GET /crm/v8/settings/automation/scoring_rules', 'criteria still "Alpha", a value the field still knows', 'ok']], true);
build(base('K2-removed-value-rule-vs-zoho.png', 'Removing a pick list value used by a scoring rule gives no warning, and records lose their points (TAVI vs Zoho CRM)',
  'TAVI NDC-Staging · Leads · rule "QA SR1112 K2" · owner · Zoho CRM test org org944965048 · same field and rule, API v8 · all test data deleted',
  [P('tavi', t, 'TAVI · Alpha removed with no warning; the lead drops 4 → 0', [[1, 1, 'FAIL'], [2, 2, 'FAIL'], [3, 3, 'FAIL']]),
   S2('tavi', 'raw/uk2-removed-value-rule.png', 'TAVI · Edit Scoring Rule: "QA SR1112 PL is" with an empty value', [960, 300, 640, 180], [[[1268, 380, 1420, 418], 2, 'FAIL']]),
   P('zoho', z, 'Zoho · the removed value moves to unused and the rule keeps it', [[2, 1, 'PASS'], [3, 2, 'PASS']])],
  [[1, 'Remove a value that a scoring rule uses', 'Value moves to "unused"; the field still knows it', 'Value removed outright, no warning', 'DIFFERS'],
   [2, 'The rule after the change', 'Criteria still "Alpha"', 'Entry still stores "Alpha"; the editor shows the value empty', 'DIFFERS'],
   [3, 'Scores of records holding the value', 'Not checked live (value kept, so the rule can still match)', 'Lead with Alpha drops from 4 to 0 on its next save', 'BUG']]));

// B03 A2
t = card('A2-tavi', 'TAVI CRM — CRM User (Mahmoud Samy) and the Scoring Rules API', [
  ['List rules', 'GET /scoring-rules?module_id={leads}', '403 PERMISSION_DENIED', 'ok'],
  ['Create / edit / switch / delete', 'POST, PUT, PATCH /active, DELETE /scoring-rules/{id}', '403 on every call · owner rule unchanged', 'ok'],
  ['Page guard', 'Route /settings/automation/scoring-rules', 'guarded by metadata.modules.manage (Modules and Fields) — a different check from the API', 'bad']], false, 'CRM User account (Mahmoud Samy)');
build(base('A2-no-permission-screen-vs-zoho.png', 'Users without permission see the Scoring Rules page, the New button and the editor, then every call is refused',
  'TAVI NDC-Staging · account Mahmoud Samy (CRM User profile) · Zoho side not checked live (no low-privilege user in the Zoho test org)',
  [S2('tavi', 'raw/ul1-lowpriv-direct.png', 'TAVI · menu item and page open; "You don\'t have permission…" with New Scoring Rule enabled', [268, 60, 1332, 380], [[[548, 140, 716, 176], 1, 'FAIL'], [[700, 295, 1170, 350], 2, 'INFO']]),
   S2('tavi', 'raw/ul2-lowpriv-create.png', 'TAVI · the editor opens with the full field list', [960, 0, 640, 460], [[[980, 370, 1580, 448], 1, 'FAIL']]),
   P('tavi', t, 'TAVI · the API refuses the same user (403); the page uses another permission', [[0, 2, 'PASS'], [1, 2, 'PASS'], [2, 3, 'FAIL']])],
  [[1, 'A user who may not manage scoring rules opens the page', 'Needs the Manage Automation permission (Zoho help; not checked live)', 'Menu, page, New Scoring Rule and the editor are all available', 'DIFFERS'],
   [2, 'What the API allows that user', 'Not checked live', 'Every call refused with 403 PERMISSION_DENIED (no data leaks)', 'INFO'],
   [3, 'Which permission guards the page', 'One permission (Manage Automation)', 'Page: metadata.modules.manage; API: a different check; no scoring permission in Profiles', 'DIFFERS']]));

// B04 G9
build(base('G9-threshold-input-vs-zoho.png', 'Workflow Rules: the score threshold accepts text or decimals with no message and keeps the last valid number',
  'TAVI NDC-Staging · Workflow Rules › New › Leads › Score value (draft cancelled, nothing saved) · Zoho score trigger not checked live',
  [S2('tavi', 'raw/ug9-threshold.png', 'TAVI · "Only when it reaches" with 999999999999: red box, no message', [576, 500, 448, 240], [[[733, 572, 832, 600], 1, 'FAIL'], [[930, 695, 1004, 731], 2, 'FAIL']]),
   S2('tavi', 'raw/ug9-create-invalid.png', 'TAVI · with "abc" in the box, Create goes on and keeps -20', [230, 240, 1100, 90], [[[368, 268, 1263, 322], 2, 'FAIL']])],
  [[1, 'Type abc, 12.5, empty or a huge number', 'Not checked live', 'Box turns red (aria-invalid) but no message says what is wrong', 'BUG'],
   [2, 'Press Create with an invalid value', 'Not checked live', 'Create goes on; the rule keeps the last valid number ("rises to -20 or more")', 'BUG']]));

// B05 H2
t = card('H2-tavi', 'TAVI CRM — save a scoring rule without row_version', [
  ['Save with the current version', 'PUT /scoring-rules/{id} {points 5, row_version 1}', '200 · now version 2', 'ok'],
  ['Save with an old version', 'PUT /scoring-rules/{id} {points 9, row_version 1}', '409 SCORING_RULE_VERSION_CONFLICT (correct)', 'ok'],
  ['Save with no version', 'PUT /scoring-rules/{id} {points 3}', '200 · points now 3 — no version check at all', 'bad']]);
build(base('H2-no-version-overwrite.png', 'A scoring rule save without a version overwrites the rule with no conflict check (same problem as NDC-2868)',
  'TAVI NDC-Staging · owner · API · Zoho\'s update API has no version field (not comparable)',
  [P('tavi', t, 'TAVI · a missing row_version is not checked', [[1, 1, 'PASS'], [2, 2, 'FAIL']])],
  [[1, 'Save with an old version', 'Not comparable', 'Refused with 409, as it should be', 'SAME'],
   [2, 'Save with no version', 'Not comparable', 'Accepted (200) and overwrites another admin\'s change', 'DIFFERS']]));

// B06 H4
t = card('H4-tavi', 'TAVI CRM — two creates with the same name at the same moment', [
  ['Create one by one', 'POST /scoring-rules twice, same name', '201, then 422 "already has a scoring rule named …" (correct)', 'ok'],
  ['Create at the same moment', 'two POST /scoring-rules in parallel, name "QA SR1112 dbl"', '201 and 201', 'bad'],
  ['List', 'GET /scoring-rules?module_id={leads}', 'two rules named "QA SR1112 dbl"', 'bad']]);
z = card('H4-zoho', 'Zoho CRM — create a scoring rule with a name that exists', [
  ['Create a second "QA SR1112 Web"', 'POST /crm/v8/settings/automation/scoring_rules', '400 DUPLICATE_DATA "A Scoring Rule with the same name already exists"', 'ok']], true);
build(base('H4-duplicate-names-vs-zoho.png', 'Two creates at the same moment make two scoring rules with the same name',
  'TAVI NDC-Staging · owner · API · Zoho test org org944965048 · API v8 (sequential duplicate only; a parallel create was not tried in Zoho)',
  [P('tavi', t, 'TAVI · the duplicate check misses parallel requests', [[0, 1, 'PASS'], [1, 2, 'FAIL'], [2, 2, 'FAIL']]), P('zoho', z, 'Zoho · duplicate names are refused', [[0, 1, 'PASS']])],
  [[1, 'Create a rule with a name that exists', 'Refused: DUPLICATE_DATA', 'Refused: "already has a scoring rule named …"', 'SAME'],
   [2, 'Two creates with the same name at the same moment', 'Not checked live', 'Both succeed; two rules share the name', 'BUG']]));

// B07 C19
t = card('C19-tavi', 'TAVI CRM — the same line twice in one scoring rule', [
  ['Create', 'POST /scoring-rules {lead_source eq chat → 3, lead_source eq chat → 3}', '201 · rule saved', 'bad'],
  ['Lead with Lead Source = chat', 'POST /modules/{leads}/records', 'Score 6 (counted twice)', 'bad']]);
z = card('C19-zoho', 'Zoho CRM — the same criteria twice in one scoring rule', [
  ['Create', 'POST /crm/v8/settings/automation/scoring_rules {Lead_Source equal Chat → 5, twice}', '400 ALREADY_USED "The criteria is already given in the same rule under different index"', 'ok']], true);
build(base('C19-identical-conditions-vs-zoho.png', 'The same condition twice in one scoring rule is accepted and counted twice',
  'TAVI NDC-Staging · owner · API · Zoho test org org944965048 · API v8 · all test data deleted',
  [P('tavi', t, 'TAVI · saved, and the lead scores 6 instead of 3', [[0, 1, 'FAIL'], [1, 2, 'FAIL']]), P('zoho', z, 'Zoho · refused', [[0, 1, 'PASS']])],
  [[1, 'Save a rule with the same line twice', 'Refused: ALREADY_USED', 'Saved (201)', 'DIFFERS'],
   [2, 'Score of a matching record', 'Not reachable (rule refused)', 'Points counted twice: 6 instead of 3', 'DIFFERS']]));

// B08 I6 + D15
t = card('I6-tavi', 'TAVI CRM — conditions sent by API that the editor does not offer', [
  ['regexMatches on Company', 'POST /scoring-rules {company regexMatches "Acme.*" → 1}', '201 · lead "Acme Ltd" scores 1', 'bad'],
  ['lengthEq / isEmpty', 'POST /scoring-rules {company lengthEq 8} · {company isEmpty}', '201 · 201', 'bad'],
  ['"is x" on a User field', 'POST /scoring-rules {user eq "x" → 1}', '201 · "x" is not a user; the editor offers only empty / not empty', 'bad'],
  ['Editor list for text', 'Scoring Rules › Condition', 'is, is not, contains, doesn\'t contain, starts with, ends with, is empty, is not empty', 'info']]);
build(base('I6-api-conditions.png', 'The scoring-rules API saves conditions the screen cannot show (regex, length, any value on User fields)',
  'TAVI NDC-Staging · owner · API · Zoho: comparators per field type seen in its editor (numbers, dates, pick lists); regex not offered there',
  [P('tavi', t, 'TAVI · accepted by the API, not shown by the editor', [[0, 1, 'FAIL'], [1, 1, 'FAIL'], [2, 2, 'FAIL']])],
  [[1, 'Condition types the API accepts', 'Editor lists only standard comparators (no regex) — API not tried', 'regexMatches, lengthEq, isEmpty saved and scoring', 'DIFFERS'],
   [2, 'Value checked against the field', 'Not checked live', 'User field accepts "x"', 'BUG']]));

// B09 I3 + B10
t = card('I3-tavi', 'TAVI CRM — unknown rule and module ids', [
  ['GET / PUT / PATCH unknown rule', '/scoring-rules/00000000-…-0001', '404 (correct)', 'ok'],
  ['DELETE unknown rule', 'DELETE /scoring-rules/00000000-…-0002', '204', 'bad'],
  ['Delete the same rule twice', 'DELETE /scoring-rules/{id} ×2', '204 · 204', 'bad'],
  ['List for unknown module', 'GET /scoring-rules?module_id=00000000-…-0009', '200 []', 'bad']]);
build(base('I3-B10-unknown-ids.png', 'Unknown scoring rule or module ids are answered as success; the page shows a blank module name',
  'TAVI NDC-Staging · owner · Zoho not checked live',
  [P('tavi', t, 'TAVI · DELETE and list answer success for ids that do not exist', [[1, 1, 'FAIL'], [2, 1, 'FAIL'], [3, 2, 'FAIL']]),
   S2('tavi', 'raw/ub10-bad-module.png', 'TAVI · ?module=<unknown id>: "No scoring rules for  yet", New Scoring Rule enabled', [292, 80, 1284, 410], [[[316, 142, 540, 176], 3, 'FAIL'], [[840, 340, 1030, 368], 3, 'FAIL']])],
  [[1, 'Delete a rule that does not exist', 'Not checked live', '204 instead of 404 SCORING_RULE_NOT_FOUND', 'BUG'],
   [2, 'List rules of a module that does not exist', 'Not checked live', '200 [] instead of 404 MODULE_NOT_FOUND', 'BUG'],
   [3, 'Open the page for an unknown module', 'Not checked live', '"Choose a module", "No scoring rules for  yet", New stays enabled', 'BUG']]));

// B10 J6
build(base('J6-error-focus.png', 'After a failed Create, focus stays on the Create button instead of the first error',
  'TAVI NDC-Staging · Scoring Rules › New Scoring Rule · owner · Zoho not checked live',
  [S2('tavi', 'raw/u9-c10.png', 'TAVI · Create with empty values: 4 fields marked, focus stays on Create', [960, 360, 640, 540], [[[1268, 380, 1530, 440], 1, 'INFO'], [[1505, 848, 1582, 888], 2, 'FAIL']])],
  [[1, 'Errors after Create', 'Not checked live', '"Required." under each empty part; 4 controls get aria-invalid', 'SAME'],
   [2, 'Where focus goes', 'Not checked live', 'Stays on Create; keyboard and screen-reader users are not taken to the first error', 'BUG']]));

// B11 F9
t = card('F9-tavi', 'TAVI CRM — Audit Log entry for a scoring rule edit (points 15 → 20)', [
  ['Edit the rule', 'PUT /scoring-rules/{id} {points 20}', '200', 'ok'],
  ['Audit event', 'GET /audit/events?entity_type=scoring_rule', 'action: updated · EntriesJson "value: 1 item" → "value: 1 item" · RowVersion 4 → 5 · UpdatedAt', 'bad'],
  ['Created / deleted', 'same feed', 'created 15 · deleted 29 · logged correctly', 'ok']]);
build(base('F9-audit-unreadable.png', 'Audit Log shows scoring rule edits as "EntriesJson: 1 item → 1 item", so the change cannot be seen',
  'TAVI NDC-Staging · owner · Zoho not checked live',
  [P('tavi', t, 'TAVI · the edit is logged, but not what changed', [[1, 1, 'FAIL']])],
  [[1, 'Audit entry for a changed line', 'Not checked live', '"EntriesJson: value: 1 item → value: 1 item"; points 15 → 20 not visible', 'BUG']]));

// Gap images
build(base('G1-update-old-records-vs-zoho.png', 'Scoring Rules gap: Zoho can rescore old records when a rule is saved; TAVI scores only on each record\'s next save',
  'TAVI NDC-Staging · New Scoring Rule · Zoho CRM test org org944965048 · New Scoring Rule › Save',
  [S2('tavi', 'raw/u3-drawer.png', 'TAVI · "a new or changed rule scores a record on its next save"', [960, 470, 640, 120], [[[978, 490, 1580, 530], 1, 'GAP']]),
   S2('zoho', 'raw/z-update-old-records.png', 'Zoho · "Update old records?" — Update old records / Continue without updating', [550, 0, 500, 220], [[[580, 20, 1020, 200], 1, 'SAME']])],
  [[1, 'Old records when a rule is saved', '"Update old records?" rescoring records active in the last 6 months', 'No option; old records keep their score until saved again', 'GAP']], 'GAP'));
build(base('G2-record-scoring-section-vs-zoho.png', 'Scoring Rules gap: Zoho shows each rule\'s scores on the record; TAVI shows no score on the record page',
  'TAVI NDC-Staging · lead with Score 30 · Zoho CRM test org · lead "QA SR1112 z1"',
  [S2('tavi', 'raw/uf1-record.png', 'TAVI · lead page: no Score anywhere (only the Timeline mentions it)', [288, 80, 1270, 760], [[[1206, 356, 1556, 830], 1, 'GAP']]),
   S2('zoho', 'raw/z-record-scoring-section.png', 'Zoho · "Scoring Rules" section: one row per rule with Positive, Negative, touch points and Score', [460, 170, 1140, 240], [[[472, 180, 1588, 400], 1, 'SAME']])],
  [[1, 'Scores on the record page', 'Scoring Rules section, one row per rule (Positive, Negative, touch points, Score)', 'Nothing: Score is in no layout by default; one combined number only', 'GAP']], 'GAP'));
build(base('G3-conditions-and-pattern-vs-zoho.png', 'Scoring Rules gap: Zoho lets one scoring line hold several conditions with AND/OR; TAVI has one condition per line',
  'TAVI NDC-Staging · New Scoring Rule · Zoho CRM test org · New Scoring Rule › Add Criteria',
  [S2('tavi', 'raw/u4-filled.png', 'TAVI · one line = one field, one condition, one value, points', [960, 300, 640, 200], [[[980, 370, 1580, 440], 1, 'GAP']]),
   S2('zoho', 'raw/z-criteria-and-pattern.png', 'Zoho · conditions 1 AND 2 with "Criteria Pattern (1 and 2) Edit Pattern", then Add/Subtract points', [376, 0, 850, 365], [[[400, 90, 1200, 280], 1, 'SAME']])],
  [[1, 'Conditions in one scoring line', 'Several conditions joined with AND/OR, editable pattern', 'One condition per line', 'GAP']], 'GAP'));
