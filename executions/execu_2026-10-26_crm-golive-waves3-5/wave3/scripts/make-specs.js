// Writes one annotation spec per Wave 3 retested ticket into specs/ (TAVI left, Zoho right, same box number per row).
const fs = require('fs'), path = require('path');
const env = 'staging-crm.taviportal.com (CRM Admin A / Supervisor, API) vs Zoho CRM org943261092 (read-only)', date = '26 Oct 2026';
const L = i => [40, 96 + 46 * i, 1560, 96 + 46 * (i + 1)];          // one API-card line
const LL = (a, b) => [40, 96 + 46 * a, 1560, 96 + 46 * (b + 1)];      // card lines a..b
const card = (img, h, caption, boxes) => ({ img, w: 1600, h, crop: [0, 0, 1600, h], caption, boxes });
const shot = (img, caption, crop, boxes) => ({ img, w: 1600, h: 950, crop, caption, boxes });
const G = '#16a34a';
const specs = {
  'NDC-2510': {
    verdict: 'FAIL', label: 'STILL FAILS', title: 'Workflow Rules | A Task action with an invalid status is logged as Fired but creates no task and shows no error',
    panels: [card('api-2510.png', 431, 'TAVI: rule saved with taskStatus "Task Closed"; the run is logged Fired and no task exists (automated test W3RetestTest.r2510).', [{ b: LL(0, 1), n: 1 }, { b: LL(4, 5), n: 2 }]),
      shot('z-audit-log.png', 'Zoho: the Audit Log names every workflow action that ran ("Workflow Rule Rule A Added a Tag…", "…Updated a Lead…").', [256, 260, 1344, 640], [{ b: [360, 335, 1000, 390], n: 2, color: G }])],
    rows: [['1', 'Saving a Task action with a status the Tasks module does not have', 'Not checked live (the Zoho Task action form was not opened)', 'Saved with 201 and the value kept as entered', 'FAIL'],
      ['2', 'What the run reports when the action cannot work', 'Each action that ran is listed in the Audit Log by rule name', 'Execution outcome "Fired", no error; 0 tasks created', 'FAIL']]
  },
  'NDC-2511': {
    verdict: 'FAIL', label: 'STILL FAILS', title: 'Workflow Rules | Rules that run on a date field leave no entry in the Audit Log when they run',
    panels: [card('api-2511.png', 385, 'TAVI: the Due Date rule ran on time (reminder task created) but no audit entry names the run (W3RetestTest.r2511).', [{ b: L(2), n: 1 }, { b: LL(3, 4), n: 2 }]),
      shot('z-audit-log.png', 'Zoho: the Audit Log lists rule runs by rule name ("Workflow Rule Rule A Updated a Lead…").', [256, 260, 1344, 640], [{ b: [360, 335, 1000, 390], n: 2, color: G }])],
    rows: [['1', 'The date-based rule runs at the due time', 'Not re-run live in Zoho today', 'Ran on time: the reminder task was created', 'PASS'],
      ['2', 'The run is recorded in the Audit Log', 'Rule runs appear with the rule name and the record', 'No entry for the run after the due time (only the rule\'s own create / activate entries before it)', 'FAIL']]
  },
  'NDC-2421': {
    verdict: 'PASS', label: 'PASSES', title: 'Workflow Rules | Field Update on records saved at the same moment (regression of a Done ticket)',
    panels: [card('api-2421.png', 338, 'TAVI: 12 leads created at the same moment all received the Field Update (W3RetestTest.r2421).', [{ b: LL(1, 3), n: 1 }]),
      shot('z-rule-a.png', 'Zoho: a rule with a Field Update instant action ("Rule A"), shown read-only.', [0, 60, 1000, 760], [{ b: [190, 540, 565, 760], n: 1, color: G }])],
    rows: [['1', 'Field Update reaches every record when many are saved at once', 'Field Update is an instant action applied to each matching record (not load-tested in Zoho)', '12 of 12 updated; none lost', 'PASS']]
  },
  'NDC-2420': {
    verdict: 'PASS', label: 'PASSES', title: 'Blueprint | Workflow rules run after a transition with required fields (regression of a Done ticket)',
    panels: [card('api-2420.png', 385, 'TAVI: transition chat to web with the required Email filled; the Lead Source rule then ran (W3RetestTest.r2420).', [{ b: L(3), n: 1 }, { b: L(4), n: 2 }]),
      shot('z-blueprint.png', 'Zoho: Blueprint page (read-only). Zoho\'s help says workflow rules do not run after blueprint transitions; not re-tested live.', [0, 0, 1600, 950], [])],
    rows: [['1', 'Transition with a required During field, filled', 'Required fields are asked for during the transition', '200, Lead Source moved to web', 'PASS'],
      ['2', 'Workflow rule on the changed field after the transition', 'Per Zoho help, workflow rules do not run after blueprint transitions (not seen live)', 'Ran (Fired), as for other transitions: consistent, which is what the ticket asked', 'PASS']]
  },
  'NDC-2294': {
    verdict: 'FAIL', label: 'GAPS STILL OPEN', title: 'Automation Execution Order: features missing from TAVI CRM (gap list recheck)',
    panels: [shot('t-wf-actions.png', 'TAVI: workflow designer with 9 instant actions and one condition; scheduled actions only Webhook, Email, Task, Create Record, portal access.', [230, 230, 1150, 720], [{ b: [380, 620, 855, 890], n: 1 }, { b: [880, 540, 1375, 700], n: 2 }, { b: [236, 395, 1376, 490], n: 3 }]),
      shot('z-rule-actions-menu.png', 'Zoho: the same designer offers Activities, Create Connected Record, Convert, Function, "+ Add another condition" and scheduled actions.', [0, 190, 1150, 720], [{ b: [190, 400, 405, 700], n: 1, color: G }, { b: [625, 545, 1000, 595], n: 2, color: G }, { b: [25, 540, 135, 580], n: 3, color: G }])],
    rows: [['1', 'Instant actions (gap item 4)', 'Field Update, Assign Owner, Tags, Email, Activities (Task / Meeting / Call), Create Record, Create Connected Record, Convert, Webhook, Function', 'Field Update, Owner Assignment, Webhook, Email, Task, Create Record, Add / Remove Tags, portal access; API refuses Meeting, Call, CustomFunction, CreateConnectedRecord (400)', 'GAP'],
      ['2', 'Scheduled actions (gap item 11)', 'All action types can be scheduled', 'Only Webhook, Email, Task, Create Record, portal access', 'GAP'],
      ['3', 'Several conditions in one rule (gap item 12)', '"+ Add another condition", first match wins', 'One condition per rule', 'GAP'],
      ['4', 'Record Score / Notes triggers (gap item 3)', 'Offered (NDC-2294 image 02)', 'API: "Unknown trigger kind" for RecordScoreChanged and NoteAdded', 'GAP'],
      ['5', 'API "trigger": [] skips automation (gap item 13)', 'Record created without running workflows', 'Accepted but ignored: the QA rule still ran', 'GAP']]
  },
  'NDC-2030': {
    verdict: 'FAIL', label: 'STILL MISSING', title: 'CRM scoring rules',
    panels: [card('api-2294.png', 419, 'TAVI: /workflow/scoring-rules and /scoring-rules answer 404; no Scoring Rules page in Settings › Automation.', [{ b: L(5), n: 1 }]),
      shot('z-scoring.png', 'Zoho: Setup › Automation › Scoring Rules with "New Scoring Rule".', [0, 60, 1600, 540], [{ b: [10, 328, 230, 358], n: 1, color: G }])],
    rows: [['1', 'Scoring rules', 'Setup › Automation › Scoring Rules, created from "New Scoring Rule"', 'Not built: API 404, no screen', 'GAP']]
  },
  'NDC-1486': {
    verdict: 'FAIL', label: 'STILL MISSING', title: 'Connected Flow',
    panels: [card('api-2294.png', 419, 'TAVI: /workflow/connected-flows answers 404; no Connected Workflow page in Settings.', [{ b: L(5), n: 1 }]),
      shot('z-connected-workflow.png', 'Zoho: Setup › Process Management › Connected Workflow with "Create New Connected Workflow".', [0, 60, 1600, 540], [{ b: [10, 522, 230, 553], n: 1, color: G }])],
    rows: [['1', 'Connected workflows across modules', 'Available under Process Management', 'Not built: API 404, no screen', 'GAP']]
  }
};
fs.mkdirSync(path.join(__dirname, 'specs'), { recursive: true });
for (const [t, s] of Object.entries(specs)) fs.writeFileSync(path.join(__dirname, 'specs', t + '.json'), JSON.stringify({ out: t + '-retest.png', ticket: t, env, date, ...s }, null, 1));
console.log(Object.keys(specs).join(' '));
