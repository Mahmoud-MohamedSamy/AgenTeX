// Second round of annotated images, now with live Zoho panels (12 Nov late): G9, I3-B10, J6, F9 and the new gap G13.
const { execFileSync } = require('child_process'); const fs = require('fs'); const path = require('path');
const S = __dirname; const R = 'executions/execu_2026-11-12_crm-scoring-rules/evidence/';
const DATE = '12 Nov 2026';
const card = (out, title, rows, zoho, who) => { const f = path.join(S, 'specs', 'card-' + out + '.json');
  fs.writeFileSync(f, JSON.stringify({ out: out + '.png', title, host: zoho ? 'crm.zoho.com · test org org944965048 · API v8' : 'staging-crm.taviportal.com', who: who || (zoho ? 'admin account' : 'owner account'), date: DATE, rows }));
  const o = execFileSync('node', [path.join(S, 'apicard.js'), f], { encoding: 'utf8' });
  const h = +(o.match(/size 780x(\d+)/) || [])[1]; const boxes = JSON.parse(o.trim().split('\n').pop().replace(/^\S+\.png /, ''));
  return { img: R + 'raw/' + out + '.png', w: 780, h, crop: [0, 0, 780, h], boxes }; };
const P = (side, c, caption, marks) => ({ side, img: c.img, w: c.w, h: c.h, crop: c.crop, caption, boxes: marks.map(([i, n, kind]) => ({ b: c.boxes[i], n, kind })) });
const S2 = (side, img, caption, crop, boxes) => ({ side, img: R + img, caption, crop, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const build = spec => { const f = path.join(S, 'specs', spec.out.replace('.png', '.json')); fs.writeFileSync(f, JSON.stringify(spec, null, 1)); console.log(execFileSync('node', [path.join(S, 'annotate-vs-zoho.js'), f], { encoding: 'utf8' }).trim().split('\n').pop().replace(/.*annotated./, '')); };
const base = (out, title, env, panels, rows, label = 'BUG') => ({ out, ticket: 'Scoring Rules', title, verdict: label === 'GAP' ? 'GAP' : 'FAIL', label, date: DATE, env, leftHead: 'TAVI CRM (left)', rightHead: 'Zoho CRM (right)', panels, rows });

// G9 — threshold input
build(base('G9-threshold-input-vs-zoho-live.png', 'Workflow Rules: the score threshold accepts text or decimals with no message and keeps the last valid number (TAVI vs Zoho CRM, live)',
  'TAVI NDC-Staging · Workflow Rules › New › Leads › Score value (draft cancelled) · Zoho CRM test org · Workflow Rules › New › Leads › Record Score › condition (cancelled, nothing saved)',
  [S2('tavi', 'raw/ug9-threshold.png', 'TAVI · "Only when it reaches" with 999999999999: red box, no message', [576, 500, 448, 240], [[[733, 572, 832, 600], 1, 'FAIL'], [[930, 695, 1004, 731], 2, 'FAIL']]),
   S2('tavi', 'raw/ug9-create-invalid.png', 'TAVI · with "abc" in the box, Create goes on and keeps -20', [230, 240, 1100, 90], [[[368, 268, 1263, 322], 2, 'FAIL']]),
   S2('zoho', 'raw/z-wf-score-trigger.png', 'Zoho · Record Score trigger: Increased, applied for All Scoring Rules — no threshold box', [190, 185, 520, 265], [[[450, 214, 654, 302], 3, 'INFO']]),
   S2('zoho', 'raw/z-wf-number-invalid.png', 'Zoho · threshold as a condition: letters are not taken, 12.5 is refused with "Please enter a valid No. of Employees."', [193, 0, 1012, 535], [[[560, 10, 1040, 64], 2, 'PASS'], [[628, 418, 1100, 454], 1, 'PASS']])],
  [[1, 'Type letters, a decimal or a huge number', 'Letters are not taken; a decimal is refused with "Please enter a valid …"', 'Box turns red but no message says what is wrong', 'DIFFERS'],
   [2, 'Continue with an invalid value', 'Done is refused until the value is valid', 'Create goes on and the rule keeps the last valid number ("rises to -20 or more")', 'DIFFERS'],
   [3, 'Where the threshold lives', 'In a condition (Score >= N) after the trigger', 'In the trigger itself ("Only when it reaches N") — a TAVI extra, fine as long as it is validated', 'INFO']]));

// I3 + B10 — unknown ids
let t = card('I3-tavi-2', 'TAVI CRM — unknown rule and module ids', [
  ['DELETE unknown rule', 'DELETE /scoring-rules/00000000-…-0002', '204 (and 204 again for a rule already deleted)', 'bad'],
  ['List for unknown module', 'GET /scoring-rules?module_id=00000000-…-0009', '200 []', 'bad'],
  ['GET / PUT / PATCH unknown rule', '/scoring-rules/00000000-…-0001', '404 (correct)', 'ok']]);
let z = card('I3-zoho', 'Zoho CRM — unknown scoring rule and module', [
  ['DELETE unknown rule', 'DELETE /crm/v8/settings/automation/scoring_rules/7687862000000999999', '400 INVALID_DATA · "The id given seems to be invalid"', 'ok'],
  ['List for unknown module', 'GET /crm/v8/settings/automation/scoring_rules?module=NoSuchModule', '400 INVALID_DATA · "Please check whether the input values are correct" (param module)', 'ok']], true);
build(base('I3-B10-unknown-ids-vs-zoho-live.png', 'Unknown scoring rule or module ids are answered as success (TAVI vs Zoho CRM, live)',
  'TAVI NDC-Staging · owner · API and Scoring Rules page · Zoho CRM test org · API v8',
  [P('tavi', t, 'TAVI · DELETE and list answer success for ids that do not exist', [[0, 1, 'FAIL'], [1, 2, 'FAIL']]),
   S2('tavi', 'raw/ub10-bad-module.png', 'TAVI · ?module=<unknown id>: "No scoring rules for  yet", New Scoring Rule enabled', [292, 80, 1284, 410], [[[316, 142, 540, 176], 3, 'FAIL'], [[840, 340, 1030, 368], 3, 'FAIL']]),
   P('zoho', z, 'Zoho · both requests are refused with INVALID_DATA', [[0, 1, 'PASS'], [1, 2, 'PASS']])],
  [[1, 'Delete a rule that does not exist', '400 INVALID_DATA "The id given seems to be invalid"', '204 (success)', 'DIFFERS'],
   [2, 'List rules of a module that does not exist', '400 INVALID_DATA (param module)', '200 with an empty list', 'DIFFERS'],
   [3, 'Open the page for an unknown module', 'Not checked live', '"Choose a module", "No scoring rules for  yet", New stays enabled', 'BUG']]));

// J6 — error focus
build(base('J6-error-focus-vs-zoho-live.png', 'After a failed Create, focus stays on the button instead of the first error (TAVI vs Zoho CRM, live)',
  'TAVI NDC-Staging · Scoring Rules › New Scoring Rule · Zoho CRM test org · Scoring Rules › New Scoring Rule (cancelled)',
  [S2('tavi', 'raw/u9-c10.png', 'TAVI · Create with empty values: fields marked, focus stays on Create', [960, 360, 640, 540], [[[1268, 380, 1530, 440], 1, 'INFO'], [[1505, 848, 1582, 888], 2, 'FAIL']]),
   S2('zoho', 'raw/z-scoring-next-disabled.png', 'Zoho · empty form: required fields in red, cursor in Name, Next disabled', [522, 0, 556, 422], [[[655, 78, 1046, 114], 2, 'PASS'], [[988, 368, 1048, 402], 1, 'PASS']])],
  [[1, 'Errors on an incomplete rule', 'Required fields outlined red; Next stays disabled until they are filled', '"Required." under each empty part after pressing Create', 'SAME'],
   [2, 'Where the cursor is', 'In the first field (Name)', 'Stays on the Create button', 'DIFFERS']]));

// F9 — audit log
t = card('F9-tavi-2', 'TAVI CRM — Audit Log entry for a scoring rule edit (points 15 → 20)', [
  ['Audit event', 'GET /audit/events?entity_type=scoring_rule', 'updated · EntriesJson "value: 1 item" → "value: 1 item" · RowVersion 4 → 5 · UpdatedAt', 'bad']]);
build(base('F9-audit-unreadable-vs-zoho-live.png', 'Audit Log shows scoring rule edits as "EntriesJson: 1 item → 1 item" (TAVI vs Zoho CRM, live)',
  'TAVI NDC-Staging · owner · Zoho CRM test org · Setup › Audit Log after editing rule "QA SR1112 audit" (points 15 → 20)',
  [P('tavi', t, 'TAVI · the change line says nothing about what changed', [[0, 1, 'FAIL']]),
   S2('zoho', 'raw/z-audit-scoring.png', 'Zoho · "Scoring Rule QA SR1112 audit for Leads was updated by …" — no change detail either', [256, 60, 1344, 420], [[[256, 60, 1600, 480], 1, 'INFO']])],
  [[1, 'Audit entry for an edited scoring rule', 'One line: "Scoring Rule … was updated by …" — no field-level detail', 'Field-level line, but meaningless: "EntriesJson: value: 1 item → value: 1 item"', 'DIFFERS']]));

// G13 — new gap: score trigger limited to selected scoring rules
build(base('G4-score-trigger-selective-rules-vs-zoho.png', 'Scoring Rules gap: Zoho can run a score workflow only for selected scoring rules; TAVI cannot',
  'TAVI NDC-Staging · Workflow Rules › New › Leads › Score value · Zoho CRM test org · Workflow Rules › New › Leads › Record Score (cancelled)',
  [S2('tavi', 'raw/ug9-threshold.png', 'TAVI · "Score value": Increases / Decreases / Increases or decreases, optional threshold — no choice of scoring rules', [576, 450, 448, 240], [[[596, 545, 1004, 600], 1, 'GAP']]),
   S2('zoho', 'raw/z-wf-score-trigger.png', 'Zoho · Record Score: Increased / Decreased / Updated, and "This rule should be applied for: All Scoring Rules / Selective Scoring Rules"', [190, 185, 520, 265], [[[200, 318, 690, 360], 1, 'SAME']])],
  [[1, 'Which scoring rules start the workflow', '"All Scoring Rules" or "Selective Scoring Rules"', 'Always all rules of the module (one combined score)', 'GAP']], 'GAP'));
