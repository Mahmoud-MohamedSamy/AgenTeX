// Evidence for the new bug "a custom field may take the system api name 'pipeline' and then validates every deal's pipeline" (27 Oct 2026).
// Usage: node spec-pipeline-bug.js  → screenshots/raw/NDC-pipeline-bug-api.png + screenshots/annotated/NDC-new-pipeline-field-BUG.png
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const run = (s, f) => execFileSync('node', [path.join(__dirname, s), f], { encoding: 'utf8' }).trim();
const card = { out: 'NDC-pipeline-bug-api.png', host: 'staging-crm.taviportal.com', who: 'mahmoud.mahamed1515 (CRM Admin)', date: '26–27 Oct 2026',
  title: 'Deals: the custom field "pipeline" replaces the validation of the real pipeline', rows: [
    ['custom field', 'GET /api/v1/modules/{Deals}/fields → apiName "pipeline"', 'id 6b44c7c9…, datatype pick_list, isCustomField true, isSystemField false, allowed_values ["Standard (Standard)"], created 24 Oct 15:54 UTC by ndc-staging-owner, placed only on layout "Wonder Travel"', 'bad'],
    ['real pipelines', 'GET /modules/{Deals}/pipelines?layout_id={Standard}', 'Standard 5170500c… (default), "1" 640e03a4…', 'info'],
    ['create on "1"', 'POST /modules/{Deals}/records layout Standard, pipeline = 640e03a4…', '422 "Invalid value for: Pipeline." (UI: "Pipeline: \'640e03a4-…\' is not one of the allowed values (Standard (Standard)).")', 'bad'],
    ['default only', 'POST without pipeline / with "Standard (Standard)"', '201, stored on Standard 5170500c… — no deal can be put on another pipeline (create, change pipeline, Mass Update, API)', 'bad'],
    ['proof', 'Custom list widened temporarily to [..., 640e03a4…, 5170500c…]', 'create on "1" → 201, stored on "1"; PATCH a Standard deal → moved to "1"; stage not in "1" → 422 (pipeline logic itself works)', 'ok'],
    ['restored', 'PUT the field back', '200, allowed_values ["Standard (Standard)"] again (nothing left changed)', 'info']] };
const cf = path.join(__dirname, 'cards', 'NDC-pipeline-bug-api.json'); fs.mkdirSync(path.dirname(cf), { recursive: true }); fs.writeFileSync(cf, JSON.stringify(card, null, 1));
const bx = JSON.parse(run('apicard.js', cf).replace(/^\S+\s+/, ''));
const P = (img, caption, crop, boxes, w = 1280, h = 720) => ({ img, caption, crop, w, h, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const CB = (r, n, kind) => [[272, bx[r[0]][1] - 4, 1570, bx[r[r.length - 1]][3] + 4], n, kind];
const spec = { out: 'NDC-new-pipeline-field-BUG.png', ticket: 'NEW BUG', label: 'NEW BUG', verdict: 'FAIL',
  title: 'Deals | A custom field named "pipeline" overrides the real pipeline: every deal is refused on any pipeline but the default',
  date: '26–27 Oct 2026', env: 'staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless) + API · mahmoud.mahamed1515 (CRM Admin)',
  panels: [
    P('pipe-01-field-list.png', 'Settings › Modules and Fields › Transactions (Deals) › Fields: "Pipeline", API name pipeline, Pick list, Custom Field ✓, only on layout Wonder Travel.', [292, 300, 964, 160], [[[300, 405, 1250, 452], 1, 'FAIL']]),
    P('pipe-02-ui-error-25oct.png', 'Create Transactions on the STANDARD layout, Pipeline "1" → refused with the custom field\'s allowed values (25 Oct; same on 26–27 Oct by API).', [300, 100, 940, 420], [[[318, 436, 1225, 500], 2, 'FAIL'], [[450, 110, 595, 142], 3, 'INFO']]),
    P('NDC-pipeline-bug-api.png', 'API: the custom field\'s pick list validates the real pipeline on every layout; with it widened, pipelines work.', [0, 0, 1600, Math.min(900, bx[bx.length - 1][3] + 16)], [CB([0], 4, 'FAIL'), CB([2, 3], 5, 'FAIL'), CB([4], 6, 'PASS'), CB([5], 7, 'INFO')], 1600, 900)],
  rows: [
    ['1', 'Custom field api name', 'A custom field cannot take a built-in field\'s api name (Zoho: system api names are reserved; custom fields get their own name)', 'Custom pick list saved with api name "pipeline" (24 Oct, ndc-staging-owner)', 'FAIL'],
    ['2–3', 'Create a deal on pipeline "1" (Standard layout)', 'Deal saved on "1"', '422 "Pipeline: \'640e03a4-…\' is not one of the allowed values (Standard (Standard))."', 'FAIL'],
    ['4–5', 'Any write that sends a pipeline (create, change pipeline, Mass Update, API)', 'Validated against the module\'s pipelines', 'Validated against the custom field\'s list on every layout → only "Standard (Standard)" passes, deal lands on the default', 'FAIL'],
    ['6', 'Control: custom list widened for the test', '—', 'Create on "1" stored on "1"; edit moves the deal; stage check still works → the custom field is the cause', 'PASS'],
    ['7', 'Data left as found', '—', 'Field restored to ["Standard (Standard)"]', 'INFO'],
    ['—', 'Impact', '—', 'Blocked NDC-1302 / 1312 / 1316 / 1324 in round 4 (moved to Bug for this reason)', 'INFO']] };
const sf = path.join(__dirname, 'specs-r6', 'NDC-new-pipeline-field.json'); fs.writeFileSync(sf, JSON.stringify(spec, null, 1));
console.log(run('annotate.js', sf));
