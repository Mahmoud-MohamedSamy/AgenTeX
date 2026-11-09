// Round 2 Wave 5: writes API fact cards (cards/card-*.json) and annotated-image specs (specs/spec-*.json), then renders all.
// node make-evidence.js [only-substring]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname; fs.mkdirSync(path.join(D, 'cards'), { recursive: true }); fs.mkdirSync(path.join(D, 'specs'), { recursive: true });
const ENV = 'staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), CRM Admin A vs Zoho CRM org943261092 (read-only; captures of 26 and 28 Oct)';
const DATE = '28 Oct 2026';
const cards = [], specs = [];
const card = (out, title, lines) => cards.push({ out, title, lines });
const spec = o => specs.push(Object.assign({ env: ENV, date: DATE }, o));
const P = (img, caption, boxes, crop) => ({ img, w: 1600, h: 950, caption, crop: crop || [0, 0, 1600, 950], boxes: boxes || [] });
const C = (img, h, caption, boxes) => ({ img, w: 1600, h, caption, crop: [0, 0, 1600, h], boxes: boxes || [] });
const b = (n, x1, y1, x2, y2) => ({ b: [x1, y1, x2, y2], n });
const CARDH = {};   // filled after the cards are rendered (height of each card image)

// ---------------- API cards ----------------
card('api-2646.png', 'NDC-2646 — validation rules on the QA module (API, CRM Admin A, 28 Oct 2026)', [
  ['Rule "QA number must be 10 or less" = criteria {op: gt, field: qa_num, value: 10}, active', 'info'],
  ['Create with QA Number 5   -> 201 (control)', 'ok'],
  ['Create with QA Number 50  -> 422 RECORD_VALIDATION_FAILED / VALIDATION_RULE_FAILED "QA number must be 10 or less"', 'ok'],
  ['Edit 3 -> 999             -> 422, stored value stays 3', 'ok'],
  ['Rule with condition "garbage ((( not an expression" -> 422 VALIDATION_RULE_INVALID', 'ok'],
  ['Pick-list rule {eq qa_pick Blue}: create with Blue -> 422 "Blue is not allowed" (NDC-2536 item 2)', 'ok'],
  ['Same rule through the ingest API (mobile client): QA Number 50 -> 201 "valid"   (candidate R2W5-C1)', 'bad'],
]);
card('api-2648-1694.png', 'NDC-2648 / NDC-1694 — teamspaces (API, CRM Admin A, 28 Oct 2026)', [
  ['POST /teamspaces/{QA}/folders "QA R2W5 Folder" twice -> 409 FOLDER_ALREADY_EXISTS', 'ok'],
  ['   "A folder named \'QA R2W5 Folder\' already exists in this teamspace. Choose a different name."', 'ok'],
  ['POST /teamspaces same name twice -> 409 (control)', 'ok'],
  ['POST /teamspaces with no modules           -> 400 TEAMSPACE_MODULES_REQUIRED "Add at least one module to save this teamspace."', 'ok'],
  ['POST /teamspaces with module_ids []        -> 400 TEAMSPACE_MODULES_REQUIRED', 'ok'],
  ['Screen: Create New Teamspace keeps Save disabled with "Add at least one module to save this teamspace."', 'ok'],
]);
card('api-2649.png', 'NDC-2649 — Map Dependency (API, CRM Admin A, 28 Oct 2026)', [
  ['POST /modules/{QA}/dependency-maps {}  -> 422 DEPENDENCY_MAP_INVALID "The parent (controlling) field is required."', 'ok'],
  ['Map QA Pick -> QA Sub pick: Red allows A, B (saved from the screen, 201)', 'info'],
  ['Create Red + C   -> 422 DEPENDENCY_VALUE_NOT_ALLOWED "\'C\' is not allowed in \'QA Sub pick\' when \'QA Pick\' is \'Red\'. Allowed: A, B."', 'ok'],
  ['Create Red + A   -> 201;  Green + C -> 201 (unmapped parent value: child not restricted)', 'ok'],
  ['Edit Red + A -> C -> 422', 'ok'],
  ['Screen: the child list still offers A, B and C after Red is picked (refused only on Save)', 'bad'],
  ['Ingest API (mobile client): Red + C -> 201 "valid"   (candidate R2W5-C1)', 'bad'],
]);
card('api-2650.png', 'NDC-2650 — layout access through the API (CRM Admin A, 28 Oct 2026)', [
  ['PUT /modules/{QA}/layouts/{B} {accessMode: selected, assignedProfiles: [User, CRM Admin]} -> 200', 'ok'],
  ['GET the layout back -> accessMode "selected", assignedProfiles [User, CRM Admin]   (was ignored on 26 Oct)', 'ok'],
  ['GET  /modules/{QA}/layouts/assignments -> 200 (was 405)', 'ok'],
  ['POST /modules/{QA}/layouts/assignments -> 201 (was 500)', 'ok'],
  ['Note: PATCH /layouts/{id}/access-mode (listed in the round 1 feature map) now answers 404', 'info'],
]);
card('api-1193.png', 'NDC-1193 — blank record through the API (CRM Admin A, 28 Oct 2026)', [
  ['POST /modules/{Customers}/records {layout_id: Standard, data: []} -> 201 Created   (Name is required on Customers)', 'bad'],
  ['Same blank body on the QA module (required pick list) -> 422 (control)', 'ok'],
  ['Ingest API {} on the QA module -> 201, compliance_state "incomplete" (required Name and Email missing)', 'bad'],
  ['The blank Customers records were deleted and purged from the recycle bin at once', 'info'],
]);
card('api-2536.png', 'NDC-2536 — the three Wonder Travel settings (CRM Admin A, 28 Oct 2026)', [
  ['1. More than one currency: GET /currencies -> home EGP, currencies [] ; Company Details now shows "Add currency"', 'info'],
  ['   Adding a currency is tenant-wide: not tried in this lane (Phase 4 serial window)', 'info'],
  ['2. Validation rule on a pick list {eq qa_pick Blue}: create with Blue -> 422 "Blue is not allowed"   (26 Oct: saved)', 'ok'],
  ['3. Formula with SUM: expression "sum(qa_num, 5)" -> 201; record with QA Number 4 -> 9   (26 Oct: "Unknown function \'sum\'")', 'ok'],
]);
card('api-2537.png', 'NDC-2537 — webhook addresses (inactive QA rules on the QA module, deleted at once; 28 Oct 2026)', [
  ['Workflow webhook http://169.254.169.254/latest/meta-data/ -> 400 "Webhook Url must be a public http(s) endpoint…"', 'ok'],
  ['Workflow webhook http://10.0.0.5/ and http://localhost/      -> 400', 'ok'],
  ['Review process webhookUrl http://169.254.169.254/…            -> 400 (was accepted)', 'ok'],
  ['Workflow webhook http://169.254.169.254.nip.io/ -> 201 at save; ACTIVE rule + QA record: dispatch Cancelled', 'ok'],
  ['   lastError "[custom-actions-egress-blocked] \'169.254.169.254.nip.io\' resolves only to addresses blocked by the outbound egress policy."', 'ok'],
  ['Blueprint After webhook to an internal address: not checked in this lane', 'info'],
]);
card('api-1603-1693.png', 'NDC-1693 / NDC-1603 — module create and unique restore (API, CRM Admin A, 28 Oct 2026)', [
  ['POST /teamspaces/{CRM}/modules "QA R2W5 Auto …" -> 201; same name again -> 409 MODULE_NAME_TAKEN', 'ok'],
  ['Unique QA Email: same e-mail in another case -> 422', 'ok'],
  ['Delete record, create another with the same e-mail, restore the first from the bin ->', 'info'],
  ['   failed: recyclebin.error.name_conflict "QA Email is already in use by another record." (record stays deleted)', 'ok'],
  ['Automated: SetupApiTest#moduleCreateAndDuplicate and #recordRules pass (2 runs)', 'ok'],
]);
card('api-c1-ingest.png', 'R2W5-C1 — ingest API (mobile app client) on the QA module, 28 Oct 2026', [
  ['Client "QA R2W5 Client" (allowed module qa_r2w5_mod), token client_credentials -> 200, scope metadata.records.ingest', 'info'],
  ['Normal create of QA Number 50 (rule: must be 10 or less)  -> 422 VALIDATION_RULE_FAILED', 'ok'],
  ['POST /ingress/modules/qa_r2w5_mod/records {qa_num: 50}        -> 201 created, compliance_state "valid"', 'bad'],
  ['Normal create of Red + C (map: Red allows A, B)               -> 422 DEPENDENCY_VALUE_NOT_ALLOWED', 'ok'],
  ['POST /ingress/… {qa_pick: Red, qa_sub: C}                     -> 201 created, compliance_state "valid"', 'bad'],
  ['Record read back: QA Number = 50 stored', 'bad'],
  ['Also seen: "name" is dropped (dropped_fields [name]) although Name is on the layout; {} -> 201 "incomplete"', 'bad'],
  ['Repeated from scratch by Java R2W5SetupTest#ingestAppliesRules (fresh module, rule and map): same result', 'bad'],
]);

// ---------------- specs (TAVI left, Zoho right) ----------------
const ZVR = P('z-leads-validation-rules.png', 'Zoho — Leads › Validation Rules (read-only, 26 Oct)', [b(1, 494, 140, 605, 178), b(2, 1340, 255, 1545, 288)], [268, 66, 1332, 420]);
spec({ out: 'NDC-2646-retest.png', ticket: 'NDC-2646', verdict: 'PASS', title: 'Validation Rules | rules are applied on create and edit; an unreadable condition is refused',
  panels: [P('rec-save-refused.png', 'TAVI — QA module record form: QA Number 50 refused with the rule message (rule made on the Validation Rules tab)', [b(1, 1095, 540, 1410, 610), b(2, 1095, 618, 1410, 705)], [418, 100, 1030, 720]), ZVR],
  rows: [['1', 'A record that breaks an active rule', 'Validation rules check the record before saving (tab present; saving a Zoho rule not done)', 'Save refused with "QA R2W5: number must be 10 or less" under the field; API create 50 and edit 3→999 both 422', 'PASS'],
    ['2', 'Rule editor and condition check', 'Create New Validation Rule on the module', 'New Rule dialog builds a criteria (field, operator, value); a text condition is refused 422 VALIDATION_RULE_INVALID', 'PASS']] });
spec({ out: 'NDC-2649-retest.png', ticket: 'NDC-2649', verdict: 'PASS', title: 'Map Dependency | an empty map is refused and the dependency is checked on save',
  panels: [P('rec-save-refused.png', 'TAVI — QA module form with QA Pick = Red and QA Sub pick = C: refused on Save', [b(1, 1095, 618, 1410, 705), b(2, 600, 712, 910, 760)], [418, 100, 1030, 720]),
    P('z-leads-map-dependency.png', 'Zoho — Leads › Map Dependency Fields (read-only, 26 Oct)', [b(1, 932, 140, 1100, 175), b(2, 1360, 232, 1552, 265)], [268, 66, 1332, 420])],
  rows: [['1', 'A child value its parent does not allow', 'Dependent pick list (saving a Zoho map not done)', 'Save refused: "\'C\' is not allowed in \'QA Sub pick\' when \'QA Pick\' is \'Red\'. Allowed: A, B." Same on API create and edit (422); empty map {} refused 422', 'PASS'],
    ['2', 'Child list on the form after the parent is chosen', 'Zoho shows only the mapped child values (documented behaviour; not checked live)', 'Still offers A, B and C after Red; refused only at Save (minor gap)', 'GAP']] });
spec({ out: 'NDC-2647-retest.png', ticket: 'NDC-2647', verdict: 'PASS', title: 'Reports | rollup summary values show in reports',
  panels: [P('s02-matrix-view.png', 'TAVI — QA report (matrix by QA Pick × QA Sub pick): Sum of QA Rollup 12 for the parent; tabular run, CSV export and joined report also show 12', [b(1, 1100, 285, 1390, 312), b(2, 900, 72, 1560, 105)], [268, 56, 1332, 400]),
    P('z-reports.png', 'Zoho — Reports list (read-only, 26 Oct)', [b(1, 252, 110, 1588, 145), b(2, 1433, 63, 1552, 96)], [240, 50, 1360, 420])],
  rows: [['1', 'Rollup column in a report', 'Not checked live (would need a saved Zoho report)', 'Record holds 12; tabular, summary, matrix, joined report and CSV export all show 12 (26 Oct: always empty)', 'PASS'],
    ['2', 'Report actions', 'Create Report, folders, export and schedule (Zoho)', 'Filter, Format, Themes, More, Export (Excel/PDF/CSV/HTML), Share, Email; scheduled reports with a 5-step wizard', 'PASS']] });
spec({ out: 'NDC-2648-retest.png', ticket: 'NDC-2648', verdict: 'PASS', title: 'Teamspaces | a folder name used twice gets a clear 409',
  panels: [C('api-2648-1694.png', 0, 'TAVI — API facts', [b(1, 0, 96, 1600, 188)]), P('z-teamspace.png', 'Zoho — Setup › Teamspace (read-only, 26 Oct)', [b(1, 296, 184, 634, 503)], [256, 66, 1328, 520])],
  rows: [['1', 'Second folder with the same name', 'Not checked live (would need a save)', '409 FOLDER_ALREADY_EXISTS with a readable message (26 Oct: 500)', 'PASS']] });
spec({ out: 'NDC-1694-retest.png', ticket: 'NDC-1694', verdict: 'PASS', title: 'Teamspace | a teamspace without modules can\'t be saved',
  panels: [P('c12-folder.png', 'TAVI — Create New Teamspace with no module: Save disabled, reason shown', [b(1, 292, 680, 720, 718), b(2, 313, 325, 520, 357)], [268, 56, 1060, 740]), P('z-teamspace.png', 'Zoho — Setup › Teamspace (read-only)', [b(1, 1395, 94, 1545, 126), b(2, 296, 184, 634, 503)], [256, 66, 1328, 520])],
  rows: [['1', 'Saving with no module', 'Not checked live (Create Teamspace not opened to save)', 'Save disabled with "Add at least one module to save this teamspace."; API 400 TEAMSPACE_MODULES_REQUIRED', 'PASS'],
    ['2', 'Adding modules', 'Teamspace holds modules and folders', 'Add Modules / Create Folder present', 'PASS']] });
spec({ out: 'NDC-2650-retest.png', ticket: 'NDC-2650', verdict: 'PASS', title: 'Layouts | layout access saved through the API is stored',
  panels: [C('api-2650.png', 0, 'TAVI — API facts', [b(1, 0, 96, 1600, 188), b(2, 0, 188, 1600, 280)]), P('z-leads-layouts.png', 'Zoho — Leads › Layouts: "Shared To" per profile (read-only)', [b(1, 709, 335, 1050, 370), b(2, 298, 296, 1552, 372)], [268, 66, 1332, 420])],
  rows: [['1', 'Access mode / profiles on a layout', 'Layouts are shared to profiles', 'PUT stores accessMode "selected" with the profiles; read back the same', 'PASS'],
    ['2', 'Layout assignments endpoint', 'n/a (Zoho UI)', 'GET 200, POST 201 (was 405 / 500)', 'PASS']] });
spec({ out: 'NDC-1335-retest.png', ticket: 'NDC-1335', verdict: 'PASS', title: 'Modules and Fields | a layout without a subform saves',
  panels: [P('lb-after-drag.png', 'TAVI — QA module layout builder: 8 fields placed; Save → "Layout saved successfully" in 3.6 s (PUT 200), no Subform error', [b(1, 975, 505, 1567, 930), b(2, 1535, 66, 1585, 98)]),
    P('z-layout-editor.png', 'Zoho — Leads layout editor (read-only; a product tour covers part of it)', [b(1, 380, 400, 1355, 920), b(2, 1520, 8, 1580, 40)])],
  rows: [['1', 'Fields dragged onto the layout', 'Drag fields into sections', 'Dragging from Unused Fields works', 'PASS'],
    ['2', 'Save a layout that has no subform', 'Saves', 'Saved (PUT 200) and the fields are stored on the layout; no "Failed to update options for Subform"', 'PASS']] });
spec({ out: 'NDC-2423-retest.png', ticket: 'NDC-2423', verdict: 'PASS', title: 'Modules and Fields | regex, unique and required set in the builder are kept after Save',
  panels: [P('c01-2423-validation.png', 'TAVI — QA Text › Field Properties › Validation (screenshot just before the regex ^QA[0-9]+$ was typed); QA Email marked Unique + Required; then Save and reload', [b(1, 1140, 60, 1600, 400)]),
    P('z-layout-editor.png', 'Zoho — layout editor field menu (read-only)', [b(1, 1290, 450, 1350, 900)])],
  rows: [['1', 'Field settings after Save and reload', 'Set in the field properties', 'Reloaded: regex_pattern ^QA[0-9]+$ stored; QA Email unique + required; records: "hello" refused (pattern), duplicate e-mail and missing e-mail refused', 'PASS']] });
spec({ out: 'NDC-2383-retest.png', ticket: 'NDC-2383', verdict: 'PASS', title: 'Modules and Fields | a layout save with a new Rollup Summary is kept',
  panels: [P('c01-2383-saved.png', 'TAVI — new Rollup Summary "QA R2W5 Rollup UI" (QA R2W5 Child, relation QA Parent, Sum of QA Amount) saved in 3.7 s: POST field 201, PUT layout 200', [b(1, 365, 505, 958, 552), b(2, 688, 884, 912, 928)]),
    P('z-layout-editor.png', 'Zoho — New Fields include Rollup Summary; Save at the top right (read-only)', [b(1, 155, 490, 300, 520), b(2, 1520, 8, 1580, 40)])],
  rows: [['1', 'Rollup Summary added', 'Rollup Summary field type', 'On the layout, still there after reload (26 Oct test B: the save was lost)', 'PASS'], ['2', 'Save result', 'Saves', '"Layout saved successfully."', 'PASS']] });
spec({ out: 'NDC-1444-retest.png', ticket: 'NDC-1444', verdict: 'PASS', title: 'Modules and Fields | Rollup Summary offers the lookup that points at the module',
  panels: [P('c01-1444-adv.png', 'TAVI — Rollup Summary › Advanced: related module list; with QA R2W5 Child the relation "QA Parent" is offered', [b(1, 1140, 120, 1600, 520)]),
    P('z-layout-editor.png', 'Zoho — Rollup Summary in New Fields (read-only)', [b(1, 155, 490, 300, 520)])],
  rows: [['1', 'Related List (lookup field) choices', 'Lookups on the related module that point back are offered', 'QA Parent offered; field QA Amount; functions Sum/Average/Minimum/Maximum/Count. Leads ↔ Transactions "Connected To" case not repeated (live module)', 'PASS']] });
spec({ out: 'NDC-1863-retest.png', ticket: 'NDC-1863', verdict: 'PASS', title: 'Modules and Fields | a field deleted in the builder, then Save, works',
  panels: [P('lb-after-delete-save.png', 'TAVI — "Lookup Contacts R2W5" removed with Delete Permanently, Save: DELETE field 204, PUT layout 200, field gone', [b(1, 365, 395, 960, 610), b(2, 688, 884, 912, 928)]),
    P('z-layout-editor.png', 'Zoho — layout editor (read-only)', [b(1, 380, 400, 1355, 920), b(2, 1520, 8, 1580, 40)])],
  rows: [['1', 'Field deleted permanently', 'Field removed from the layout', 'Gone from the layout and the module (DELETE field 204)', 'PASS'], ['2', 'Save after the delete', 'Layout saved', '"Layout saved successfully" (PUT 200); no 400 "places fields that do not exist"', 'PASS']] });
spec({ out: 'NDC-1873-retest.png', ticket: 'NDC-1873', verdict: 'PASS', title: 'Modules and Fields | renaming a new field updates its API name',
  panels: [P('c01-1873-general.png', 'TAVI — new Lookup renamed "Lookup Contacts R2W5": API name becomes lookup_contacts_r2w5 (read-only field)', [b(1, 1140, 120, 1600, 420)]),
    P('z-layout-editor.png', 'Zoho — layout editor (read-only)', [b(1, 15, 100, 300, 560)])],
  rows: [['1', 'API name of a new, unsaved field', 'Generated from the label', '"lookup" → "lookup_contacts_r2w5"; note: "fixed once the layout is saved"', 'PASS']] });
spec({ out: 'NDC-1586-retest.png', ticket: 'NDC-1586', verdict: 'PASS', title: 'Modules and Fields | formula "Insert a field" lists the module fields',
  panels: [P('c01-1586-formula.png', 'TAVI — QA Formula › Advanced: Insert a field lists name, created_by, …, qa_text, qa_num, qa_email, qa_sub, qa_pick; functions include sum()', [b(1, 1140, 120, 1600, 700)]),
    P('z-layout-editor.png', 'Zoho — Formula field type (read-only)', [b(1, 155, 412, 300, 442)])],
  rows: [['1', 'Insert a field list', 'Lists the module\'s fields', 'Lists the fields (by API name)', 'PASS']] });
spec({ out: 'NDC-1230-retest.png', ticket: 'NDC-1230', verdict: 'PASS', title: 'Field Properties | Controlling Field lists the layout\'s fields',
  panels: [P('c01-1230-controlling.png', 'TAVI — QA Text › Validation › Conditional visibility: the layout\'s fields, not QA Text itself', [b(1, 1140, 120, 1600, 760)]),
    P('z-layout-editor.png', 'Zoho — layout editor (read-only)', [b(1, 380, 400, 1355, 920)])],
  rows: [['1', 'Controlling field choices', 'Fields of the layout', 'Name, Created By, QA R2W5 Rollup UI, …, QA Email, QA Sub pick, QA Pick (QA Text excluded)', 'PASS']] });
spec({ out: 'NDC-1231-retest.png', ticket: 'NDC-1231', verdict: 'PASS', title: 'Field Properties | Auto-fill "Another field on this form" keeps its value',
  panels: [P('c01-1231-autofill.png', 'TAVI — QA Text › Advanced › Auto-fill: "Another field on this form" stays selected and a SOURCE FIELD picker appears', [b(1, 1140, 120, 1600, 700)]),
    P('z-layout-editor.png', 'Zoho — layout editor (read-only)', [b(1, 380, 400, 1355, 920)])],
  rows: [['1', 'Fill from another field', 'n/a in Zoho (TAVI option)', 'Value kept; source field list shown', 'PASS']] });
spec({ out: 'NDC-1588-retest.png', ticket: 'NDC-1588', verdict: 'PASS', title: 'Modules and Fields | the default layout is marked and can be changed',
  panels: [P('c02-1588-row-menu.png', 'TAVI — QA module layouts: "Default" badge, default toggle locked; row menu has Set as default (greyed while the layout is inactive)', [b(1, 300, 395, 430, 430), b(2, 10, 640, 580, 680)]),
    P('z-leads-layouts.png', 'Zoho — Leads › Layouts (read-only)', [b(1, 300, 335, 700, 370), b(2, 1392, 244, 1544, 276)], [268, 66, 1332, 420])],
  rows: [['1', 'Default layout marked', 'Zoho lists the layout(s)', 'Badge "Default"; its status toggle is locked', 'PASS'],
    ['2', 'Set another layout as default', 'Layout menu', '"Set as default" in the row menu (enabled when the layout is active; API set-default 200)', 'PASS']] });
spec({ out: 'NDC-140-retest.png', ticket: 'NDC-140', verdict: 'PASS', title: 'Layouts | a disabled layout leaves the accessible list',
  panels: [P('c02-140-disabled.png', 'TAVI — QA module layouts: Layout B switched off from its status toggle', [b(1, 1500, 455, 1570, 485)]),
    P('z-leads-layouts.png', 'Zoho — Leads › Layouts status toggle (read-only)', [b(1, 1400, 335, 1450, 370)], [268, 66, 1332, 420])],
  rows: [['1', 'Accessible layouts after disabling', 'Inactive layouts can\'t be used', 'GET /layouts/accessible → only "Default"; the record list offers only Default', 'PASS']] });
spec({ out: 'NDC-2384-retest.png', ticket: 'NDC-2384', verdict: 'PASS', title: 'Modules and Fields | the Create module dialog creates a module',
  panels: [P('c01-2384-dialog.png', 'TAVI — Create module: plural, singular and key filled from the display name; Create → 201', [b(1, 629, 117, 1075, 833)]),
    P('z-modules.png', 'Zoho — Modules list with Create New Module (read-only)', [b(1, 1397, 140, 1554, 172)])],
  rows: [['1', 'Create a module from the dialog', 'Create New Module', 'POST 201 "QA R2W5 Dialog" (module key qa_r2w5_dialog); no "plural form is required" error', 'PASS']] });
spec({ out: 'NDC-1864-retest.png', ticket: 'NDC-1864', verdict: 'PASS', title: 'Modules and Fields | a disabled module is hidden and blocked',
  panels: [P('c01-1864-direct.png', 'TAVI — direct link to the disabled QA module: "QA R2W5 Dialog is disabled …"', [b(1, 270, 60, 1600, 500)]),
    P('z-modules.png', 'Zoho — module status toggles (read-only)', [b(1, 1400, 240, 1470, 870)])],
  rows: [['1', 'Disabled module', 'Status off hides the module', 'Not in the side menu; page explains it is disabled; API create and list 403 MODULE_DISABLED', 'PASS']] });
spec({ out: 'NDC-1693-1603-retest.png', ticket: 'NDC-1693 / NDC-1603', verdict: 'PASS', title: 'Module create by API, and restore of a record whose unique value is taken',
  panels: [C('api-1603-1693.png', 0, 'TAVI — API facts', [b(1, 0, 96, 1600, 142), b(2, 0, 142, 1600, 280)]), P('z-recyclebin.png', 'Zoho — Recycle Bin (read-only, 26 Oct)', [b(2, 250, 60, 1590, 500)])],
  rows: [['1', 'Module create and duplicate name', 'n/a (API)', '201, then 409 MODULE_NAME_TAKEN', 'PASS'],
    ['2', 'Restore with a taken unique value', 'Not checked live (would need records)', 'Refused: name_conflict "QA Email is already in use by another record."', 'PASS']] });
spec({ out: 'NDC-1598-1232-retest.png', ticket: 'NDC-1598 / NDC-1232', verdict: 'PASS', title: 'Field Listing layout filter; Data Types sticky header',
  panels: [P('c16-ar-datatypes.png', 'TAVI — Data Types (sticky header, compact columns; shown in Arabic UI). Field Listing filter: All Layouts / Default / Not on any layout (SetupScreensUiTest)', [b(1, 25, 142, 1307, 198)]),
    P('z-leads-fields.png', 'Zoho — Leads › Fields (read-only, 26 Oct)', [b(2, 268, 130, 1600, 260)])],
  rows: [['1', 'Data Types header stays visible', 'n/a (TAVI-only page)', 'position sticky, top 186 after scrolling (automated)', 'PASS'],
    ['2', 'Field Listing layout filter', 'Layout dropdown', 'All Layouts, Default, Not on any layout (automated)', 'PASS']] });
spec({ out: 'NDC-2130-2131-retest.png', ticket: 'NDC-2130 / NDC-2131', verdict: 'PASS', title: 'Arabic UI | record count and sort label translated',
  panels: [P('leads-ar-3.png', 'TAVI — Leads list in Arabic: "١٬١٦٨ سجلاً", sort "ترتيب: تاريخ الإنشاء تنازلي"; Transactions layout picker aria-label "التخطيط"', [b(1, 1255, 100, 1320, 120), b(2, 965, 150, 1140, 182)]),
    P('z-home.png', 'Zoho — Arabic UI not checked live (switching Zoho\'s language saves a preference)', [])],
  rows: [['1', 'Record count', 'Not checked live', 'Arabic digits and plural', 'PASS'], ['2', 'Sort label', 'Not checked live', 'Field label and direction in Arabic', 'PASS']] });
spec({ out: 'NDC-2386-retest.png', ticket: 'NDC-2386', verdict: 'PASS', title: 'Pipelines | Settings › Pipelines loads on a direct link and after reload',
  panels: [P('c11-pipelines.png', 'TAVI — /settings/pipelines opened directly (6.4 s) and reloaded (5.3 s): board shown (read only)', [b(1, 270, 60, 1600, 600)]),
    P('z-modules.png', 'Zoho — Setup › Pipelines in the menu (read-only)', [b(1, 40, 525, 110, 548)])],
  rows: [['1', 'Direct load / reload', 'Pipelines page opens', 'Loads (no "Loading board…"); slower than the 2 s target', 'PASS']] });
spec({ out: 'NDC-1678-retest.png', ticket: 'NDC-1678', verdict: 'PASS', title: 'Teamspace | icon and admin can be changed',
  panels: [P('c12-1678-admin.png', 'TAVI — Create teamspace: "Change teamspace icon" (colour / initials) and "Select the teamspace admin" dialog', [b(1, 312, 140, 370, 200), b(2, 288, 176, 1312, 774)]),
    P('z-teamspace.png', 'Zoho — teamspace card with icon and Admin (read-only)', [b(1, 438, 253, 492, 307), b(2, 303, 450, 627, 497)], [256, 66, 1328, 520])],
  rows: [['1', 'Teamspace icon', 'Icon tile', 'Icon menu: Color, Use initials (no image upload)', 'PASS'], ['2', 'Admin picker', 'Admin shown on the card', 'Opens a user picker', 'PASS']] });
spec({ out: 'NDC-1691-1698-retest.png', ticket: 'NDC-1691 / NDC-1698 / NDC-1692', verdict: 'PASS', title: 'Teamspace | drag a module into a folder; delete icon on folder modules; side menu shows only saved state',
  panels: [P('c12-1698-row.png', 'TAVI — qa_r2w5_child dragged into folder "QA F1"; the row has the remove (×) icon; side menu unchanged before Save', [b(1, 313, 373, 990, 455), b(2, 935, 422, 960, 446)]),
    P('z-teamspace.png', 'Zoho — teamspace (read-only)', [b(1, 296, 184, 634, 503)], [256, 66, 1328, 520])],
  rows: [['1', 'Drag into a folder', 'Folders hold modules', 'Moved; saved (POST 201)', 'PASS'], ['2', 'Remove a module inside a folder', 'n/a', '× icon present', 'PASS']] });
spec({ out: 'NDC-1695-1700-1689-retest.png', ticket: 'NDC-1695 / NDC-1700 / NDC-1689', verdict: 'PASS', title: 'Teamspace | folder rename kept; admin shown is the stored one; no dead delete icon',
  panels: [P('c12-1695-reloaded.png', 'TAVI — after Save and reload the folder reads "QA F1 renamed"; Admin shows the creator; trash icon top right of the card', [b(1, 313, 373, 990, 415), b(2, 313, 540, 640, 620), b(3, 950, 140, 990, 180)]),
    P('z-teamspace.png', 'Zoho — teamspace card with its Admin (read-only)', [b(2, 303, 450, 627, 497)], [256, 66, 1328, 520])],
  rows: [['1', 'Folder rename', 'n/a', 'PUT 200; name kept after reload', 'PASS'], ['3', 'Delete icon on the edit page', 'Not checked live', 'Answers: "Can\x27t delete QA R2W5 TS — This teamspace still contains 1 module. Delete or move it …" (does something, clear reason)', 'PASS'], ['2', 'Admin field', 'Shows the stored admin', 'QA teamspace: Mahmoud Mohamed (creator); CRM Teamspace: "—" (none stored), not the viewer', 'PASS']] });
spec({ out: 'NDC-2537-retest.png', ticket: 'NDC-2537', verdict: 'PASS', label: 'RETEST PASS (PARTLY CHECKED)', title: 'Webhooks | internal addresses refused at save; host names that resolve inside are blocked at run time',
  panels: [C('api-2537.png', 0, 'TAVI — API facts', [b(1, 0, 96, 1600, 234), b(2, 0, 234, 1600, 326)]), P('z-modules.png', 'Zoho — Setup › Automation › Actions (webhooks) in the menu; not checked live', [b(1, 40, 850, 110, 875)])],
  rows: [['1', 'Internal address at save', 'Not checked live', 'Workflow and review refuse loopback, private and link-local addresses (400)', 'PASS'],
    ['2', 'Name that resolves to 169.254.x at run time', 'Not checked live', 'Dispatch Cancelled by the egress policy; blueprint webhook not checked', 'PASS']] });
spec({ out: 'NDC-2536-retest.png', ticket: 'NDC-2536', verdict: 'PARTIAL', title: 'Wonder Travel settings | pick-list rule and SUM fixed; second currency not tried',
  panels: [P('g01-company.png', 'TAVI — Company Details now has a Currencies card with "Add currency" (home EGP, no other currency)', [b(1, 270, 600, 1600, 900)]), P('z-currencies.png', 'Zoho — Company Settings › Currencies (read-only)', [b(1, 944, 70, 1024, 108)])],
  rows: [['1', 'More than one currency', 'Currencies tab', '"Add currency" present; adding one is tenant-wide → not tried (Phase 4)', 'PARTIAL'],
    ['2', 'Validation rule on a pick list', 'Applies', 'Applied: Blue refused 422', 'PASS'], ['3', 'SUM in formulas', 'Available', 'sum(qa_num, 5) = 9', 'PASS']] });
spec({ out: 'NDC-1193-retest.png', ticket: 'NDC-1193', verdict: 'FAIL', title: 'Records API | a blank record is still accepted in Customers',
  panels: [C('api-1193.png', 0, 'TAVI — API facts', [b(1, 0, 96, 1600, 142), b(2, 0, 188, 1600, 234)]), P('z-contact-create.png', 'Zoho — Contacts create form: Last Name is mandatory (read-only, 26 Oct)', [b(1, 268, 120, 1600, 600)])],
  rows: [['1', 'Blank create in Customers', 'Mandatory fields are enforced', '201 Created with data []; the QA module (required pick list) refuses with 422', 'FAIL'], ['2', 'Blank create through the ingest API', 'Not checked live', '201 "incomplete"', 'FAIL']] });
spec({ out: 'NDC-2704-retest.png', ticket: 'NDC-2704', verdict: 'PARTIAL', title: 'Home | raw column keys still flash on load',
  panels: [P('c17-home-rawkeys.png', 'TAVI — Home 1.2 s after opening: headers subject / due_date / status / priority / related_to and title / from_time / to_time, "No open tasks"; labels and tasks appear after 2–5 s (2 of 3 loads)', [b(1, 285, 182, 1575, 226), b(2, 285, 412, 920, 456)]), P('z-home.png', 'Zoho — Home (read-only, 26 Oct)', [b(1, 355, 174, 880, 673), b(2, 795, 255, 1487, 798)])],
  rows: [['1', 'My Tasks headers', 'Readable names in Zoho home components', 'Raw keys for the first 2–5 s, then labels; "No open tasks" shown before the tasks load', 'PARTIAL'], ['2', 'My Meetings Today headers', 'Readable names', 'title / from_time / to_time, then Title / From / To', 'PARTIAL']] });
spec({ out: 'NDC-163-2027-retest.png', ticket: 'NDC-163 / NDC-2027', verdict: 'PARTIAL', title: 'Home | greeting and components',
  panels: [P('c17-home-views.png', 'TAVI — "Welcome Mahmoud Mohamed"; views: Classic View, Mahmoud Mohamed\'s Home; Pipeline by Stage "Connects to reporting in an upcoming update"', [b(1, 280, 80, 700, 118), b(2, 1370, 120, 1580, 200), b(2, 939, 850, 1580, 950)]),
    P('z-home.png', 'Zoho — Home "Hello Mahmoud Samy" (read-only)', [b(1, 540, 230, 730, 290), b(2, 850, 300, 1150, 740)])],
  rows: [['1', 'Greeting', 'Hello + name', '"Welcome" + full name; no time of day or date', 'PARTIAL'], ['2', 'Views and components', 'Home components', 'No My Company View; pipeline component not built', 'PARTIAL']] });
spec({ out: 'NDC-1487-retest.png', ticket: 'NDC-1487', verdict: 'PASS', title: 'Storage | used storage is shown',
  panels: [P('t2-usage-overview.png', 'TAVI — Storage: 14 MB of 10 GB used, by type, per user, buckets, requests', [b(1, 270, 60, 1600, 500)]), P('z-storage.png', 'Zoho — Data Administration › Storage (read-only)', [b(1, 287, 185, 868, 353)])],
  rows: [['1', 'Storage used', 'Records and file storage', 'Usage overview with quotas', 'PASS']] });
// ---- new candidates and gaps ----
spec({ out: 'R2W5-C1-ingest-bypass-vs-zoho.png', ticket: 'R2W5-C1', verdict: 'FAIL', label: 'NEW CANDIDATE', title: 'API Integration | records sent through the ingest API skip validation rules and field dependencies',
  panels: [C('api-c1-ingest.png', 0, 'TAVI — API facts', [b(1, 0, 142, 1600, 234), b(2, 0, 234, 1600, 326)]), P('z-leads-validation-rules.png', 'Zoho — Validation Rules (read-only). Whether Zoho applies them to API inserts was not checked live', [b(1, 494, 140, 605, 178)], [268, 66, 1332, 420])],
  rows: [['1', 'Record breaking an active validation rule', 'Not checked live', 'Normal API 422; ingest API 201 "valid", value 50 stored', 'FAIL'], ['2', 'Child value not allowed by the dependency', 'Not checked live', 'Normal API 422; ingest API 201 "valid"', 'FAIL']] });
spec({ out: 'R2W5-C2-dashboard-drilldown-vs-zoho.png', ticket: 'R2W5-C2', verdict: 'FAIL', label: 'NEW CANDIDATE', title: 'Dashboards | clicking a chart does nothing (no drill-down); share, export and e-mail are gone',
  panels: [P('s03-view-drill.png', 'TAVI — QA dashboard: clicking the Green bar (sum 12) opens nothing; toolbar: Only Me, Refresh all, Details, Fullscreen, Edit', [b(1, 444, 277, 492, 557), b(2, 1140, 70, 1590, 105)]),
    P('z-analytics.png', 'Zoho — Analytics dashboard (read-only; a product tour covers it, so the chart click was not tried)', [b(2, 1170, 62, 1565, 96)])],
  rows: [['1', 'Click a chart value', 'Not checked live (the tour would have to be dismissed, which saves a preference)', 'Nothing happens, no request; report Share dialog still lists "Drill Down" as a permission', 'FAIL'],
    ['2', 'Dashboard actions', 'Zoho has more actions (…) next to Create Dashboard', 'Visibility only (Only Me / All Users / Custom); no public link, export, e-mail or schedule (removed in this build)', 'GAP']] });
spec({ out: 'R2W5-C3-arabic-setup-vs-zoho.png', ticket: 'R2W5-C3', verdict: 'FAIL', label: 'NEW CANDIDATE', title: 'Arabic UI | Data Types, API Integration and Storage pages stay in English',
  panels: [P('c16-ar-datatypes.png', 'TAVI — Arabic UI: Data Types title, description, column headers, categories (Basic/Advanced/System) and the "Pipelines" menu item in English', [b(1, 660, 70, 1310, 110), b(2, 25, 142, 1307, 198), b(3, 1440, 815, 1530, 840)]),
    P('z-home.png', 'Zoho — Arabic UI not checked live', [])],
  rows: [['1', 'Page title and description', 'Not checked live', 'English', 'FAIL'], ['2', 'Column headers and categories', 'Not checked live', 'English', 'FAIL'], ['3', 'Setup menu', 'Not checked live', '"Pipelines", "Web Forms", "Google Sheet" in English', 'FAIL']] });
spec({ out: 'R2W5-GAP-buttons-links-vs-zoho.png', ticket: 'R2W5-GAP-1', verdict: 'FAIL', label: 'GAP', title: 'Modules | Layout Rules, Record Locking, Links and Buttons still "In Development"; buttons and links never show on the record',
  panels: [P('c01-tab-buttons.png', 'TAVI — QA module › Buttons: "In Development" (also Layout Rules, Record Locking, Links). Validation Rules and Map Dependency are now built', [b(1, 290, 130, 1520, 220), b(2, 618, 270, 1215, 590)]),
    P('z-leads-buttons.png', 'Zoho — Leads › Buttons (read-only, 26 Oct)', [b(1, 268, 130, 1600, 180), b(2, 268, 180, 1600, 450)])],
  rows: [['1', 'Module tabs', 'All tabs working', '4 tabs still "In Development" (was 6)', 'GAP'], ['2', 'Button / link made through the API', 'Shown on the record page', 'Saved (201) but not shown on the record page; the API also stores an empty label when "labels" is sent instead of "label"', 'GAP']] });
spec({ out: 'R2W5-GAP-teamspace-keys-vs-zoho.png', ticket: 'R2W5-OBS-1', verdict: 'FAIL', label: 'OBSERVATION', title: 'Teamspace | Add Modules lists module keys instead of names',
  panels: [P('c12-add-modules.png', 'TAVI — Add Modules: leads, contacts, deals, daily_move, qa_r2w5_child …; the module row also shows the key', [b(1, 290, 120, 1100, 900)]),
    P('z-modules.png', 'Zoho — modules are shown by name (read-only)', [b(1, 288, 230, 1555, 870)])],
  rows: [['1', 'Module names in the teamspace editor', 'Display names', 'Keys (contacts for Customers, deals for Transactions)', 'FAIL']] });

const only = process.argv[2];
for (const c of cards) { if (only && !c.out.includes(only)) continue; const f = path.join(D, 'cards', 'card-' + c.out.replace('.png', '') + '.json'); fs.writeFileSync(f, JSON.stringify(c, null, 1)); execFileSync('node', [path.join(D, 'apicard.js'), f], { stdio: 'pipe' }); }
const pngH = f => { const b2 = fs.readFileSync(f); return b2.readUInt32BE(20); };
for (const s of specs) {
  if (only && !s.out.includes(only) && !s.ticket.includes(only)) continue;
  for (const p of s.panels) if (p.h === 0) { p.h = pngH(path.join(D, '../evidence/raw', p.img)); p.crop = [0, 0, 1600, p.h]; }
  const f = path.join(D, 'specs', 'spec-' + s.out.replace('.png', '') + '.json'); fs.writeFileSync(f, JSON.stringify(s, null, 1));
  console.log(execFileSync('node', [path.join(D, 'annotate-vs-zoho.js'), f]).toString().trim());
}
