// Writes the annotated-evidence specs for lane C (Wave 5) into scripts/specs/. Run: node make-specs.js
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'specs'); fs.mkdirSync(DIR, { recursive: true });
const L = i => [20, 89 + 46 * i, 1580, 135 + 46 * i];   // line i of an API card
const env = 'staging-crm.taviportal.com (owner) vs Zoho CRM org943261092 (read-only)', date = '26 Oct 2026';
const T = (img, w, h, caption, boxes, crop) => ({ img, w, h, caption, crop: crop || [0, 0, w, h], boxes });
const Z = (img, caption, boxes, crop) => T(img, 1600, 950, caption, boxes.map(b => ({ ...b, color: '#16a34a' })), crop);
const S = {};
S['NDC-1693'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Modules and Fields | Creating a new module (was 500 Internal Server Error)', panels: [
  T('api-1693.png', 1600, 338, 'TAVI — module created through the same call the screen uses: 201 in 2.6 s, then one field of every data type.', [{ b: L(1), n: 1 }, { b: L(2), n: 2 }, { b: L(3), n: 3 }]),
  Z('z-modules.png', 'Zoho — Setup › Modules and Fields: Create New Module.', [{ b: [1397, 141, 1553, 173], n: 1 }, { b: [288, 228, 1552, 340], n: 3 }])],
  rows: [['1', 'Create a custom module', 'Create New Module builds the module at once', '201 Created in 2.6 s with a Default layout (no 500 any more)', 'PASS'],
    ['2', 'Same module name twice', 'Name must be unique', '409 MODULE_NAME_TAKEN with a clear message', 'PASS'],
    ['3', 'Add fields of every type', 'All field types can be added', '36 of 37 types created; pipeline is system-only. The screen dialog itself is NDC-2384 (In Progress, not retested)', 'PASS']] };
S['NDC-1598'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Modules and Fields | Field Listing has a layout filter', panels: [
  T('ndc1598-filter-not-on-layout.png', 1280, 720, 'TAVI — QA W5 Module › Fields › Field Listing: filter set to "Not on any layout" (options All Layouts / Default / Not on any layout).', [{ b: [884, 306, 1034, 345], n: 1 }, { b: [292, 360, 1255, 715], n: 2 }]),
  Z('z-leads-fields.png', 'Zoho — Leads › Fields › Field Listing (this org has one layout per module, so no layout filter is shown).', [{ b: [298, 262, 560, 298], n: 1 }, { b: [298, 318, 1552, 905], n: 2 }])],
  rows: [['1', 'Filter the field list by layout', 'Search box; layout picker only when a module has several layouts', 'Layout filter with All Layouts, each layout and "Not on any layout"', 'PASS'],
    ['2', 'List follows the filter', 'Fields of the chosen layout', '"Default" shows only that layout\'s fields; "Not on any layout" lists the 42 unplaced fields', 'PASS']] };
S['NDC-1335'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Modules and Fields | Saving a layout without a subform (was "Failed to update options for Subform")', panels: [
  T('ndc1335-save.png', 1280, 720, 'TAVI — Layout Builder of QA W5 No plural (no subform): a field dragged in, Save. No error; the API shows the field on the layout. A second save took 7.4 s.', [{ b: [1170, 58, 1268, 96], n: 1 }, { b: [810, 448, 1250, 500], n: 2 }]),
  Z('z-layout-editor.png', 'Zoho — Leads › Standard layout editor (opened read-only, nothing saved).', [{ b: [1518, 6, 1584, 44], n: 1 }, { b: [380, 380, 1360, 900], n: 2 }])],
  rows: [['1', 'Save a layout that has no subform', 'Saves', 'Saves with no "Failed to update options for Subform" message (2 saves, 7.4 s)', 'PASS'],
    ['2', 'The change is kept', 'Field stays where it was dropped', 'QA W5 Amount is on the layout after reload and in GET layout', 'PASS']] };
S['NDC-1193'] = { verdict: 'FAIL', label: 'STILL FAILS', title: 'Records API | A blank record is accepted although a field is required', panels: [
  T('api-1193.png', 1600, 385, 'TAVI — POST a record with no fields in four modules (owner).', [{ b: L(1), n: 1 }, { b: L(4), n: 2 }]),
  Z('z-contact-create.png', 'Zoho — Create Contact: Last Name is mandatory (red bar); the API refuses a contact without it.', [{ b: [252, 60, 1588, 96], n: 1 }, { b: [1153, 366, 1543, 400], n: 2 }])],
  rows: [['1', 'Blank record where fields are required', 'Refused', 'Refused (422) in Leads and both QA modules', 'PASS'],
    ['2', 'Blank record in Customers (Name required)', 'Refused — Last Name is mandatory', '201 Created: the blank Customer is accepted (deleted again at once)', 'FAIL']] };
S['NDC-2536'] = { verdict: 'FAIL', label: 'STILL FAILS', title: 'Settings Wonder Travel uses that our CRM cannot hold (currencies, picklist validation, subform sum)', panels: [
  T('api-2536.png', 1600, 373, 'TAVI — the three items checked on QA W5 Module.', [{ b: L(0), n: 1 }, { b: [20, 135, 1580, 227], n: 2 }, { b: [20, 227, 1580, 365], n: 3 }]),
  Z('z-currencies.png', 'Zoho — Company Settings › Currencies: home currency plus other currencies with exchange rates.', [{ b: [287, 239, 1553, 376], n: 1 }])],
  rows: [['1', 'More than one currency', 'Home currency + other currencies with rates', 'No currency list (404); one company currency EGP', 'FAIL'],
    ['2', 'Validation rule on a pick list', 'Rules on picklists are applied on save', 'Rule can now be created (201) but is never applied — a "Blue" record is saved (see W5-B1)', 'FAIL'],
    ['3', 'Formula that sums subform rows', 'Sub Total / Grand Total formulas', 'No sum function ("Unknown function \'sum\'")', 'FAIL']] };
S['NDC-1603'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Recycle Bin | Restoring a record whose unique value is now taken', panels: [
  T('api-1603.png', 1600, 292, 'TAVI — unique email on QA W5 Module; restore refused with a clear reason.', [{ b: L(2), n: 1 }, { b: L(4), n: 2 }]),
  Z('z-recyclebin.png', 'Zoho — Recycle Bin (restoring a duplicate needs a save in Zoho, so Zoho\'s exact message was not checked).', [{ b: [258, 110, 1584, 600], n: 1 }])],
  rows: [['1', 'Restore while the unique value is used by another record', 'Not checked live (would change Zoho data)', 'Refused: "QA W5 Email is already in use by another record."; the record stays deleted', 'PASS'],
    ['2', 'Unique check is case-insensitive', 'Not checked', 'QA.W5.R1@ refused when qa.w5.r1@ exists', 'PASS']] };
S['NDC-1232'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Data Types | Header row and column widths', panels: [
  T('ndc1232-scrolled.png', 1272, 866, 'TAVI — Settings › Data Types after scrolling down (1272 × 866): header still on screen, names on one line, compact rows, fade at the right edge.', [{ b: [292, 186, 1248, 245], n: 1 }, { b: [292, 245, 720, 735], n: 2 }, { b: [1196, 186, 1250, 735], n: 3 }]),
  Z('z-leads-fields.png', 'Zoho — has no data-type catalogue page; its field list is the nearest screen (one line per row).', [{ b: [298, 318, 1552, 352], n: 1 }, { b: [298, 352, 1552, 905], n: 2 }])],
  rows: [['1', 'Header row stays while scrolling', 'Not comparable (no such page)', 'Sticky header stays visible', 'PASS'],
    ['2', 'Names fit on one line, compact rows', 'Not comparable', 'Label + key on two short lines, 44 px rows; Category / Source no longer wrap', 'PASS'],
    ['3', 'More columns to the right are visible as such', 'Not comparable', 'Fade at the right edge; the table scrolls inside its box', 'PASS']] };
S['NDC-2130'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Custom Views | Arabic: record count and sort label translated', panels: [
  T('ndc2130-leads-ar.png', 1272, 866, 'TAVI — Leads list in Arabic (language switched in this browser only).', [{ b: [930, 98, 994, 122], n: 1 }, { b: [638, 148, 814, 182], n: 2 }]),
  Z('z-modules.png', 'Zoho — the language is a saved user setting, so Zoho was not switched to Arabic (not checked).', [{ b: [258, 66, 1584, 110], n: 1 }])],
  rows: [['1', '"records" in the record count', 'Not checked', '"١٧٣ سجلاً" (was "٥٠ records")', 'PASS'],
    ['2', 'Sort label field and direction', 'Not checked', '"ترتيب: تاريخ الإنشاء تنازلي" (was "created_at desc")', 'PASS']] };
S['NDC-2131'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Custom Views | Arabic: layout picker name and record count on the Deals board', panels: [
  T('ndc2131-deals-ar.png', 1272, 866, 'TAVI — Transactions board in Arabic. Header layout picker accessible name is "التخطيط".', [{ b: [286, 78, 512, 116], n: 1 }, { b: [930, 98, 994, 122], n: 2 }, { b: [690, 202, 760, 236], n: 3 }]),
  Z('z-modules.png', 'Zoho — not switched to Arabic (a saved user setting); not checked.', [{ b: [258, 66, 1584, 110], n: 1 }])],
  rows: [['1', 'Header layout picker accessible name', 'Not checked', '"التخطيط" (was "Layout")', 'PASS'],
    ['2', 'Record count', 'Not checked', '"٥٢ سجلاً"', 'PASS'],
    ['3', 'Pipeline and Probability labels', 'Not checked', '"المسار" and "الاحتمالية %10" shown in Arabic (field names like Amount are tenant data)', 'PASS']] };
S['NDC-492'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Layout editor | Tab Order options in the section menu', panels: [
  T('ndc492-after-reload.png', 1272, 866, 'TAVI — section menu after choosing "Top to Bottom", saving and reloading the builder.', [{ b: [1034, 548, 1238, 602], n: 1 }, { b: [1040, 576, 1238, 602], n: 2 }]),
  Z('z-layout-editor.png', 'Zoho — layout editor; a product tour covers the section menu and closing it saves a preference, so the menu was not opened (not checked).', [{ b: [1300, 400, 1360, 440], n: 1 }])],
  rows: [['1', 'Choosing a Tab Order option', 'Not checked (tour popup)', 'The tick moves to the chosen option and Save becomes active', 'PASS'],
    ['2', 'Choice kept after save and reload', 'Not checked', 'Still "Top to Bottom"; layout stores tab_order = top_to_bottom', 'PASS']] };
S['NDC-1487'] = { verdict: 'PASS', label: 'RETEST PASS', title: 'Storage Used is shown to the client', panels: [
  T('tour2-settings_storage.png', 1280, 720, 'TAVI — Settings › Storage › Usage Overview.', [{ b: [292, 80, 1255, 300], n: 1 }, { b: [292, 300, 1255, 715], n: 2 }]),
  Z('z-storage.png', 'Zoho — Setup › Storage: records available and usage per module.', [{ b: [287, 185, 869, 353], n: 1 }, { b: [287, 423, 869, 720], n: 2 }])],
  rows: [['1', 'Total storage used vs available', 'Records available of the plan limit', '"14 MB of 10 GB used", split by type', 'PASS'],
    ['2', 'Usage broken down', 'Per module', 'Per type and per user, with quotas, buckets and storage requests', 'PASS']] };
const home = (t, rows) => ({ verdict: 'PARTIAL', label: 'PARTLY DONE', title: t, panels: [
  T('home-1.png', 1272, 866, 'TAVI — Home for the owner.', [{ b: [280, 84, 560, 116], n: 1 }, { b: [1132, 80, 1250, 116], n: 2 }]),
  Z('z-home.png', 'Zoho — Home for a new user: greeting with the first name and set-up shortcuts.', [{ b: [540, 228, 735, 292], n: 1 }, { b: [850, 410, 1150, 735], n: 2 }])], rows });
S['NDC-163'] = home('Home Page Views & Navigation', [['1', 'Greeting "Good morning / afternoon / evening, First Name" with today\'s date', 'Greets the user by first name', '"Welcome ndc-staging-owner" — no time of day, no first name, no date', 'FAIL'],
  ['2', 'View toggle My Company View / Personal View / Classic View', 'Home views per role / user', 'Classic View and "ndc-staging-owner\'s Home" only; no My Company View', 'PARTIAL']]);
S['NDC-2027'] = home('CRM home page — key numbers and shortcuts', [['1', 'Start page greets the user', 'Greeting and shortcuts', '"Welcome ndc-staging-owner"', 'PARTIAL'],
  ['2', 'Key numbers and components', 'Set-up shortcuts, dashboard components', 'My Tasks, My Meetings Today; "Pipeline by Stage — Connects to reporting in an upcoming update"', 'PARTIAL']]);
S['W5-B1'] = { verdict: 'FAIL', label: 'BUG', title: 'Validation rules are saved but never applied, and any text is accepted as a condition', panels: [
  T('api-b1.png', 1600, 385, 'TAVI API on QA W5 Module (the Validation Rules tab only says "In Development").', [{ b: L(0), n: 1 }, { b: L(2), n: 2 }, { b: [20, 227, 1580, 319], n: 3 }]),
  Z('z-leads-validation-rules.png', 'Zoho — Leads › Validation Rules: rules are built on a screen and checked before every save.', [{ b: [268, 140, 1584, 180], n: 1 }, { b: [268, 180, 1584, 420], n: 3 }])],
  rows: [['1', 'Screen to build validation rules', 'Validation Rules tab with Create New Validation Rule', '"In Development" placeholder', 'GAP'],
    ['2', 'Condition is checked when the rule is saved', 'Built from fields and operators', 'Any text accepted, even "garbage ((( not an expression"', 'FAIL'],
    ['3', 'Rule blocks a save that breaks it', 'Record is not saved; the message is shown', 'Number 50 with rule "> 10" saved (201); edit to 999 saved (200)', 'FAIL']] };
S['W5-B2'] = { verdict: 'FAIL', label: 'BUG', title: 'Reports show rollup summary fields empty', panels: [
  T('s02-run.png', 1272, 866, 'TAVI — report "QA W5 Report": QA W5 Rollup sum is "—" for every row, including QA W5 R1 (12 on the record).', [{ b: [1104, 285, 1238, 668], n: 1 }, { b: [700, 444, 1238, 476], n: 2 }]),
  T('api-b2.png', 1600, 292, 'TAVI API — record value vs report value (Zoho report not opened: rollup reporting not checked live).', [{ b: L(0), n: 2 }, { b: L(2), n: 1 }])],
  rows: [['1', 'Rollup summary column in a report', 'Not checked live', 'Always empty (null), checked 3 times over ~40 min', 'FAIL'],
    ['2', 'Same record through the API', '—', 'qa_w5_rollup_sum = 12, count = 2', 'INFO']] };
S['W5-B3'] = { verdict: 'FAIL', label: 'BUG', title: 'Teamspace | A folder name used twice answers 500', panels: [
  T('api-b3.png', 1600, 246, 'TAVI API — two QA teamspaces, three tries.', [{ b: L(1), n: 1 }, { b: L(2), n: 2 }]),
  Z('z-teamspace.png', 'Zoho — Setup › Teamspace (a duplicate name was not tried in Zoho: it would save).', [{ b: [258, 66, 1584, 400], n: 1 }])],
  rows: [['1', 'Create a folder with a name that already exists', 'Not checked live', '500 INTERNAL_ERROR "An unexpected error occurred" (3 of 3)', 'FAIL'],
    ['2', 'Same case for a teamspace name', 'Not checked live', '409 TEAMSPACE_ALREADY_EXISTS — clear', 'PASS']] };
S['W5-B4'] = { verdict: 'FAIL', label: 'BUG', title: 'Map Dependency | An empty dependency map is saved; the dependency is not checked on save', panels: [
  T('api-b4.png', 1600, 292, 'TAVI API on QA W5 Module (the Map Dependency Fields tab says "In Development").', [{ b: [20, 135, 1580, 227], n: 1 }, { b: L(3), n: 2 }, { b: L(0), n: 3 }]),
  Z('z-leads-map-dependency.png', 'Zoho — Leads › Map Dependency Fields: parent and child fields are chosen on a screen.', [{ b: [268, 180, 1584, 400], n: 1 }, { b: [268, 140, 1584, 180], n: 3 }])],
  rows: [['1', 'Save a dependency with no fields', 'Parent and child must be chosen', '{} -> 201, saved with all-zero field ids', 'FAIL'],
    ['2', 'Child value outside the map', 'Only mapped values are offered (API behaviour not checked)', 'Red + C accepted (201)', 'INFO'],
    ['3', 'Screen for dependencies', 'Map Dependency Fields tab', '"In Development" placeholder', 'GAP']] };
S['W5-B5'] = { verdict: 'FAIL', label: 'BUG', title: 'Layouts | Layout access through the API is ignored or fails (500 / 405)', panels: [
  T('c02-layout-permissions-chosen.png', 1280, 720, 'TAVI — Layout settings › Layout Permissions › Selected Users works on screen.', [{ b: [416, 225, 864, 495], n: 1 }]),
  T('api-b5.png', 1600, 292, 'TAVI API — the older calls (Zoho: layouts are shared per profile, "Shared To: Administrator and Standard").', [{ b: L(0), n: 1 }, { b: L(1), n: 2 }, { b: [20, 181, 1580, 273], n: 3 }])],
  rows: [['1', 'Restrict a layout to chosen users / profiles', 'Layouts are shared per profile', 'Works on screen (users), stored', 'PASS'],
    ['2', 'PUT layout with accessMode / assignedProfiles', '—', '200, but nothing changes (silently ignored)', 'FAIL'],
    ['3', 'layouts/assignments API', '—', 'POST 500 INTERNAL_ERROR, GET 405', 'FAIL']] };
S['W5-GAP-module-tabs'] = { verdict: 'FAIL', label: 'GAP', title: 'Modules and Fields | Six module tabs are "In Development" (APIs exist, no screen)', panels: [
  T('qa-module-validation.png', 1280, 720, 'TAVI — QA W5 Module: Layout Rules, Validation Rules, Record Locking Configuration, Map Dependency Fields, Links and Buttons all show "In Development".', [{ b: [370, 140, 586, 172], n: 1 }, { b: [292, 190, 590, 220], n: 2 }]),
  Z('z-leads-buttons.png', 'Zoho — the same tabs are working screens (Buttons shown; Validation Rules, Map Dependency and Links captured too).', [{ b: [370, 140, 1140, 172], n: 1 }, { b: [1120, 140, 1250, 172], n: 2 }])],
  rows: [['1', 'Layout Rules, Validation Rules, Record Locking', 'Working tabs with Create buttons', '"In Development"', 'GAP'],
    ['2', 'Map Dependency Fields, Links, Buttons', 'Working tabs with Create buttons', '"In Development" (APIs answer, see W5-B1 / W5-B4)', 'GAP']] };
for (const [k, v] of Object.entries(S)) fs.writeFileSync(path.join(DIR, k + '.json'), JSON.stringify({ out: k + (k.startsWith('W5') ? '-vs-zoho.png' : '-retest.png'), ticket: k, env, date, ...v }, null, 1));
console.log(Object.keys(S).length + ' specs');
