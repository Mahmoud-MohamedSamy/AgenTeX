// Writes the annotation specs for the Wave 2 retest images (<ticket>-retest.png): TAVI left, Zoho right,
// the same box number per row on both sides. Usage: node make-retest-specs.js [ticket ...]  (no args = all)
const fs = require('fs'); const G = '#16a34a';
const env = 'staging-crm.taviportal.com (owner) vs Zoho CRM org943261092 (read-only)', date = '26 Oct 2026';
const NC = 'Not checked live';
const PASS = { verdict: 'PASS', label: 'RETEST PASS' }, FAIL = { verdict: 'FAIL', label: 'STILL FAILS' };
const card = (img, h, caption, boxes) => ({ img, w: 1600, h, caption, crop: [0, 0, 1600, h], boxes });
const zo = (img, caption, boxes, crop) => ({ img, w: 1600, h: 950, caption, crop: crop || [0, 0, 1600, 950], boxes: boxes.map(b => ({ ...b, color: G })) });
const line = i => 117 + 46.1 * i;   // centre of card line i (apicard.js layout)
const rows = (a, b) => [20, Math.round(line(a) - 23), 1580, Math.round(line(b) + 23)];

const specs = {
  'NDC-1832': { ...PASS, title: 'Editing a record keeps its owner',
    panels: [card('api-1832-owner-kept.png', 892, 'TAVI — automated test (26 Oct 2026): a QA record in each of the 15 modules is renamed by the owner and read back; the owner field is the same before and after.', [{ b: rows(1, 15), n: 1 }, { b: rows(16, 16), n: 2 }]),
      zo('z-deal-overview.png', 'Zoho — deal "Benton": Deal Owner is its own field on the record. Editing was not tried (it would save in Zoho).', [{ b: [500, 352, 900, 382], n: 1 }])],
    rows: [['1', 'Edit another field of a record', 'Deal Owner is a separate field; ' + NC + ' that an edit keeps it (editing would save in Zoho)', 'PATCH of the name answers 200; the owner is unchanged in every module (Calls: call_owner). The screen edit on 25 Oct also kept the owner', 'PASS'],
      ['2', 'All 15 modules', '—', '15 of 15 modules keep the owner', 'PASS']] },
  'NDC-1193': { ...FAIL, title: 'A record with no fields is still accepted in Customers',
    panels: [card('api-1193-blank-record.png', 880, 'TAVI — automated test (26 Oct 2026): POST a record with no fields to each of the 15 modules. Customers (module key contacts) answers 201 and creates an empty record (the test deleted it again).', [{ b: rows(1, 1), n: 1 }, { b: rows(2, 14), n: 2 }]),
      zo('z-contact-create.png', 'Zoho — Create Contact: Last Name is marked mandatory (red edge); the form was not submitted.', [{ b: [1150, 364, 1545, 402], n: 1 }])],
    rows: [['1', 'Create a Customer (contact) with no fields', 'Last Name is mandatory on the form; not checked live whether an empty contact is refused', 'POST {data: []} answers 201 and an empty Customer is created', 'FAIL'],
      ['2', 'Same blank create in the other 14 modules', NC + ' (only the Contacts form was opened)', '422 RECORD_VALIDATION_FAILED in all 14 modules', 'PASS']] },

  // ---------------- recycle bin ----------------
  'NDC-1597': { ...PASS, title: 'Recycle Bin: the Module filter lists every module, system ones too',
    panels: [{ img: 'rt-bin-module-filter.png', caption: 'TAVI — Recycle Bin › Filters › Module (26 Oct 2026): every module with its item count, incl. system ones (Approval Process, Blueprint) and a deleted module (23c1a6s8d46a).', crop: [0, 0, 1600, 900], boxes: [{ b: [510, 288, 764, 572], n: 1 }] },
      zo('z-recyclebin.png', 'Zoho — Setup › Recycle Bin: a filter (funnel) on the list and a Type column naming the module.', [{ b: [1520, 370, 1554, 402], n: 1 }, { b: [756, 370, 880, 402], n: 1 }])],
    rows: [['1', 'Filter the bin by module', 'Filter on the list; the Type column names each item\'s module', 'Module filter lists 34 modules with counts (automated test), system modules included', 'PASS']] },
  'NDC-1600': { ...PASS, title: 'Recycle Bin: the Deleted by filter lists the users',
    panels: [{ img: 'rt-bin-deletedby-filter.png', caption: 'TAVI — Recycle Bin › Filters › Deleted by (26 Oct 2026): the users with how many items each deleted.', crop: [0, 0, 1600, 900], boxes: [{ b: [606, 288, 860, 572], n: 1 }] },
      zo('z-recyclebin.png', 'Zoho — Setup › Recycle Bin: "Deleted By" column, filtered with the funnel.', [{ b: [890, 370, 1160, 402], n: 1 }, { b: [1520, 370, 1554, 402], n: 1 }])],
    rows: [['1', 'Filter the bin by who deleted', 'Deleted By column with a list filter', 'Deleted by lists the users with counts (e.g. Mahmoud Mohamed (8)); the facet API returns them too', 'PASS']] },
  'NDC-1601': { ...PASS, title: 'Recycle Bin: choosing a module keeps the other filter options',
    panels: [{ img: 'rt-bin-module-filter.png', caption: 'TAVI — Recycle Bin › Filters › Module (26 Oct 2026). After choosing Leads the list still offers every other module (automated test: 34 modules before and after; manual 25 Oct: all other 40 options stay).', crop: [0, 0, 1600, 900], boxes: [{ b: [510, 288, 764, 572], n: 1 }] },
      zo('z-recyclebin.png', 'Zoho — Setup › Recycle Bin filter (funnel). Choosing a module there was not tried.', [{ b: [1520, 370, 1554, 402], n: 1 }])],
    rows: [['1', 'Choose Leads, then open the Module filter again', NC, 'All other modules are still offered (34 before and after choosing Leads)', 'PASS']] },
  'NDC-1795': { ...PASS, title: 'Recycle Bin: the list refills after deleting items forever',
    panels: [card('api-1795-bin-refill.png', 246, 'TAVI — manual run 25 Oct 2026: 120 QA items deleted forever 50 at a time; the list refilled by itself each time.', [{ b: rows(1, 2), n: 1 }]),
      zo('z-recyclebin.png', 'Zoho — Setup › Recycle Bin: select items, then Delete.', [{ b: [376, 292, 450, 326], n: 1 }])],
    rows: [['1', 'Delete a page of items forever', 'Delete on the selected items; ' + NC + ' how the list refills (it would delete Zoho data)', '"50 items permanently deleted"; the next 50 appear without Load More; 50 + 50 + 20 → 0', 'PASS']] },
  'NDC-1603': { ...PASS, title: 'Restore is refused when the unique name is already taken',
    panels: [card('api-1603-restore-conflict.png', 292, 'TAVI — automated test 26 Oct 2026: restoring an account whose name is now used by another account.', [{ b: rows(1, 3), n: 1 }]),
      zo('z-recyclebin.png', 'Zoho — Setup › Recycle Bin rules shown on the page. A name conflict on restore was not tried.', [{ b: [287, 160, 1360, 262], n: 1 }])],
    rows: [['1', 'Restore a record whose unique value is taken', NC, 'Refused: "Account name is already in use by another record." (recyclebin.error.name_conflict); the record stays deleted', 'PASS']] },
  'NDC-1602': { ...PASS, title: 'Empty Bin no longer times out',
    panels: [card('api-1602-empty-bin.png', 292, 'TAVI — manual run 25 Oct 2026, Empty Bin on the user\'s order.', [{ b: rows(0, 1), n: 1 }]),
      zo('z-recyclebin.png', 'Zoho — Setup › Recycle Bin: "Empty Recycle Bin" button (not clicked).', [{ b: [1394, 292, 1545, 326], n: 1 }])],
    rows: [['1', 'Empty the whole bin', '"Empty Recycle Bin" button; ' + NC + ' (it would delete Zoho data)', 'Finished in about 248 s with no 504; 3,080 → 1,217 items (Desk items are outside the CRM screen). Not repeated on 26 Oct', 'PASS']] },
  'NDC-1797': { ...FAIL, title: 'Bin items of deleted modules can\'t be deleted or restored',
    panels: [card('api-1797-orphans.png', 338, 'TAVI — automated test 26 Oct 2026 and manual run 25 Oct: 16 bin items of deleted modules.', [{ b: rows(1, 2), n: 1 }, { b: rows(3, 3), n: 2 }]),
      zo('z-recyclebin.png', 'Zoho — Setup › Recycle Bin: Restore and Delete on selected items.', [{ b: [288, 292, 450, 326], n: 1 }, { b: [1394, 292, 1545, 326], n: 2 }])],
    rows: [['1', 'Delete forever or restore an item of a deleted module', NC + ' (no such item in Zoho)', 'Both refused for the Owner: recyclebin.error.forbidden (16 items: 23c1a6s8d46a, test, partners, testmodule)', 'FAIL'],
      ['2', 'Empty Bin', '"Empty Recycle Bin" (not clicked)', 'Leaves the 16 items; they can only expire after 60 days', 'FAIL']] },

  // ---------------- records ----------------
  'NDC-1484': { ...PASS, title: 'The 15 modules: create, read, edit, delete and restore',
    panels: [card('api-1484-15-modules.png', 846, 'TAVI — automated test (26 Oct 2026): one QA record per module through the whole cycle.', [{ b: rows(0, 14), n: 1 }, { b: rows(15, 15), n: 2 }]),
      zo('z-deal-overview.png', 'Zoho — a deal record (Edit, more actions). The cycle was not repeated in Zoho (read-only).', [{ b: [1480, 70, 1580, 102], n: 1 }])],
    rows: [['1', 'Create → read → edit → delete → bin → restore in each module', NC + ' (Zoho is read-only)', 'Every step passes in each of the 15 modules: create 201, edit 200, delete 204, read 404, in the bin, restore 200, read 200', 'PASS'],
      ['2', 'All 15 modules', '—', '15 of 15', 'PASS']] },
  'NDC-1197': { ...PASS, title: 'Leads list actions menu: every entry works or says "Coming soon"',
    panels: [{ img: 'rt-leads-actions.png', caption: 'TAVI — Leads › actions menu (26 Oct 2026): 16 entries; the ones that need selected records are greyed until a record is selected.', crop: [0, 0, 1600, 900], boxes: [{ b: [1219, 120, 1437, 712], n: 1 }, { b: [1226, 198, 1430, 230], n: 2 }] },
      zo('z-leads-actions.png', 'Zoho — Leads › … menu: Mass Delete, Mass Update, Mass Convert, Manage Tags, Drafts, Mass Email, Approve Leads, Deduplicate Leads, Add to Campaigns, Create Client Script, Export Leads, Zoho Sheet View, Print View.', [{ b: [1388, 132, 1580, 580], n: 1 }])],
    rows: [['1', 'The list actions menu', 'Mass Delete, Mass Update, Mass Convert, Manage Tags, Drafts, Mass Email, Approve Leads, Deduplicate, Add to Campaigns, Client Script, Export, Sheet View, Print View', 'Same entries plus Import Leads and Import History. On 25 Oct each one acted or said "Coming soon" (Drafts, Approve Leads, Deduplicate, Client Script, Sheet View, Print View); Export Leads opens the export dialog', 'PASS'],
      ['2', 'Entries that need selected records', NC, 'Delete Selected, Mass Update, Mass Convert, Mass Email and Add to Campaigns are greyed with "Select at least one record"', 'PASS']] },
  'NDC-1216': { ...PASS, title: 'Mass delete by criteria',
    panels: [card('api-1216-mass-delete.png', 338, 'TAVI — Leads › Mass Delete by criteria (manual run, 25 Oct 2026): 120 matching QA leads.', [{ b: rows(1, 3), n: 1 }, { b: rows(4, 4), n: 2 }]),
      zo('z-leads-actions.png', 'Zoho — Leads › … › Mass Delete (opened from the same menu; not run).', [{ b: [1396, 140, 1572, 170], n: 1 }])],
    rows: [['1', 'Mass delete the records matching criteria', 'Mass Delete is in the list menu; ' + NC + ' (it would delete Zoho data)', 'Preview "Total Records: 120", confirm with DELETE → "120 Leads deleted"; matched 120, deleted 120, failed 0', 'PASS'],
      ['2', 'Nothing else deleted', NC, 'Only the 120 QA leads; all found in the bin and purged afterwards', 'PASS']] },
  'NDC-1302': { ...PASS, title: 'Changing a deal\'s stage keeps its pipeline',
    panels: [card('api-1302-stage-keeps-pipeline.png', 292, 'TAVI — automated test 26 Oct 2026 and screen check 25 Oct.', [{ b: rows(1, 2), n: 1 }, { b: rows(3, 3), n: 2 }]),
      zo('z-deal-overview.png', 'Zoho — deal "Benton": stage bar. Changing the stage was not tried (it would save).', [{ b: [512, 256, 1440, 284], n: 1 }])],
    rows: [['1', 'Change only the stage', NC, 'PATCH stage → 200; pipeline unchanged (5170500c…, "Standard")', 'PASS'],
      ['2', 'Stage history', NC, 'Stage History shows "qualification → needs_analysis"', 'PASS']] },

  // ---------------- import ----------------
  'NDC-1593': { ...PASS, title: 'Import respects read-only fields',
    panels: [card('api-1599-import-fp.png', 385, 'TAVI — test user 1 on a QA profile with Company read-only (and Email hidden): automated test 26 Oct and manual run 25 Oct.', [{ b: rows(1, 1), n: 1 }, { b: rows(2, 4), n: 2 }]),
      zo('z-leads-import-menu.png', 'Zoho — Leads › Create menu › Import Leads. Field permissions on import were not tried.', [{ b: [1340, 172, 1520, 204], n: 1 }])],
    rows: [['1', 'Mapping screen for a read-only field', NC, 'Company is shown as "Company (read-only for your profile)" and can\'t be picked', 'PASS'],
      ['2', 'Import a value into it through the API', NC, 'Validate: "This field is read-only / hidden for your profile, so you cannot import values into it"; 0 records created', 'PASS']] },
  'NDC-1599': { ...PASS, title: 'Import respects hidden fields',
    panels: [card('api-1599-import-fp.png', 385, 'TAVI — test user 1 on a QA profile with Email hidden (and Company read-only): automated test 26 Oct and manual run 25 Oct.', [{ b: rows(1, 1), n: 1 }, { b: rows(2, 4), n: 2 }]),
      zo('z-leads-import-menu.png', 'Zoho — Leads › Create menu › Import Leads. Field permissions on import were not tried.', [{ b: [1340, 172, 1520, 204], n: 1 }])],
    rows: [['1', 'Mapping screen for a hidden field', NC, 'Email is not offered in the mapping', 'PASS'],
      ['2', 'Import a value into it through the API', NC, 'Refused at validate; 0 records created; the lead has no email', 'PASS']] },
  'NDC-1554': { ...PASS, title: 'Import: the tag delimiter is helper text, not a picklist',
    panels: [card('api-1554-tag-delimiter.png', 246, 'TAVI — Leads import mapping step (manual run, 25 Oct 2026).', [{ b: rows(1, 1), n: 1 }]),
      zo('z-leads-import-menu.png', 'Zoho — Leads › Create menu › Import Leads. The mapping step was not opened (it needs a file upload).', [{ b: [1340, 172, 1520, 204], n: 1 }])],
    rows: [['1', 'Tag delimiter on the mapping step', NC, 'Shown as static helper text ", ;" — no picklist', 'PASS']] },

  // ---------------- views ----------------
  'NDC-2122': { ...FAIL, title: 'Custom view criteria: upper-case "AND" is still accepted',
    panels: [card('api-2122-upper-and.png', 246, 'TAVI — automated test 26 Oct 2026: three patterns sent to the view API.', [{ b: rows(0, 1), n: 2 }, { b: rows(2, 2), n: 1 }]),
      zo('z-view-create.png', 'Zoho — New Custom View: conditions are joined by an AND / OR connector chosen on the screen.', [{ b: [300, 270, 345, 296], n: 1 }, { b: [287, 147, 1315, 260], n: 2 }])],
    rows: [['1', 'Pattern "1 AND 2" (upper case)', 'Connector chosen on screen; ' + NC + ' for a typed upper-case pattern', 'Accepted (201)', 'FAIL'],
      ['2', 'Pattern naming a missing condition', NC, '"1 and 3" → 422 INVALID_VIEW; "1 and 2" → 201', 'PASS']] },
  'NDC-2098': { ...FAIL, title: 'A deleted view id in the URL opens the last-used view',
    panels: [card('api-2098-deleted-view-url.png', 292, 'TAVI — manual run 25 Oct 2026. The automated screen test could not run on 26 Oct.', [{ b: rows(1, 1), n: 1 }]),
      zo('z-leads-list.png', 'Zoho — Leads list, All Leads view. Opening a deleted view id was not tried.', [{ b: [252, 58, 328, 84], n: 1 }])],
    rows: [['1', 'Open ?view=<id of a deleted view>', NC, 'Opens the last-used view ("QA W2 CV main renamed", 2 records) instead of All Leads', 'FAIL']] },
  'NDC-2280': { ...FAIL, title: 'A long view name overlaps the other columns',
    panels: [{ img: 'rt-views-manage.png', caption: 'TAVI — Leads › Manage custom views (26 Oct 2026): "Custom View Shared with Tenant Owner => Email Not Empty" runs into its pin icon. On 25 Oct a 120-character name overlapped Shared To / Created By / Last Modified By.', crop: [0, 0, 1600, 900], boxes: [{ b: [296, 734, 708, 766], n: 1 }] },
      zo('z-views-manage.png', 'Zoho — Leads › Manage Custom View: names sit in their own column.', [{ b: [340, 195, 800, 870], n: 1 }])],
    rows: [['1', 'A long view name in the list', 'Names stay in their column (no long name in this org to compare)', 'Not cut off: the text runs into the pin icon and, for longer names, over the next columns', 'FAIL']] },

  // ---------------- list and kanban speed ----------------
  'NDC-2136': { ...FAIL, title: 'Leads list takes 12–16 s to show rows',
    panels: [card('api-2136-list-speed.png', 246, 'TAVI — automated screen test RecordScreensUiTest.leadsListSpeed (26 Oct 2026).', [{ b: rows(1, 2), n: 1 }]),
      zo('z-leads-list.png', 'Zoho — Leads list (14 records). Not timed.', [{ b: [468, 153, 1585, 905], n: 1 }])],
    rows: [['1', 'Time to the first rows of the Leads list', NC + ' (not timed)', '15.5 / 11.8 / 16.2 s (target 1.5 s); 13.4–25.5 s on 25 Oct', 'FAIL']] },
  'NDC-2137': { ...FAIL, title: 'Transactions kanban takes 3–4.5 s to show cards',
    panels: [{ img: 'rt-deals-kanban.png', caption: 'TAVI — Transactions kanban, Standard pipeline (26 Oct 2026). Timings from the manual run on 25 Oct: first cards after 3.0 / 4.5 / 4.2 s.', crop: [0, 0, 1600, 900], boxes: [{ b: [276, 262, 1600, 352], n: 1 }, { b: [296, 296, 560, 332], n: 2 }] },
      zo('z-deals-stageview.png', 'Zoho — Deals stage view: columns with labels, counts and totals. Not timed.', [{ b: [467, 184, 1585, 250], n: 1 }])],
    rows: [['1', 'Time to the first cards', NC + ' (not timed)', 'Headers 2.4 / 2.4 / 3.4 s; first cards 3.0 / 4.5 / 4.2 s (target 2 s; was 5.1 s)', 'FAIL'],
      ['2', 'Column headers (seen today, not part of this ticket)', 'Stage labels (Qualification, Needs Analysis…)', 'Every column says "This value is no longer an option of the field"; keys like Closed_won; cards show "Resolving owner…"', 'INFO']] },

  // ---------------- work queue ----------------
  'NDC-1819': { ...FAIL, title: 'Work Queue: Zoho\'s filter panel, column Pin / Hide and row Add Note are still missing',
    panels: [{ img: 'wq-NDC-1819-inline-filter.png', caption: 'TAVI — Work Queue › Tasks (25 Oct 2026): the filter is an inline criteria row; the column menus offer only sort.', crop: [0, 0, 1600, 900], boxes: [{ b: [573, 170, 1576, 290], n: 1 }, { b: [700, 352, 1560, 382], n: 2 }, { b: [585, 400, 680, 436], n: 3 }] },
      zo('z-workqueue.png', 'Zoho — Workqueue › Tasks: Filter button and column settings on the list.', [{ b: [1462, 80, 1532, 110], n: 1 }, { b: [1548, 118, 1582, 150], n: 2 }])],
    rows: [['1', 'Filter', 'Filter button on the list (the panel itself was not opened)', 'Inline criteria row, not a panel with System Defined / Fields / Related Modules', 'FAIL'],
      ['2', 'Column options', 'Column settings icon (' + NC.toLowerCase() + ' for Pin / Hide)', 'Column menu has only Sort ascending / descending; Manage Columns has no pin', 'FAIL'],
      ['3', 'Add Note on a row', NC, 'No Add Note icon on the row (Edit / Reschedule / Delete only)', 'FAIL']] },

  // ---------------- pipelines ----------------
  'NDC-1324': { ...FAIL, title: 'Inline Pipeline editor offers only "Standard (Standard)"',
    panels: [{ img: 'pl07-inline-pipeline-raw-id.png', caption: 'TAVI — Transactions list (25 Oct 2026): the Pipeline cells show the id 5170500c-…; the inline editor offers only "Standard (Standard)".', crop: [0, 0, 1600, 900], boxes: [{ b: [890, 240, 1240, 830], n: 1 }] },
      zo('z-deal-overview.png', 'Zoho — deal "Benton". This org has only the default pipeline, so there is no Pipeline field to compare.', [{ b: [500, 352, 900, 560], n: 1 }])],
    rows: [['1', 'Pick another pipeline inline', NC + ' (no second pipeline in this org)', 'Only "Standard (Standard)" is offered — pipeline "1" of the same layout is missing; the field\'s allowed values are ["Standard (Standard)"] (automated test 26 Oct)', 'FAIL']] },
  'NDC-1316': { ...FAIL, title: 'Mass Update of Pipeline is offered but fails',
    panels: [{ img: 'pl08-mass-update-pipeline-fails.png', caption: 'TAVI — Transactions › Mass Update (25 Oct 2026): Pipeline "1" with "Stage in the new pipeline". Update records → 422; the dialog stays open with no message.', crop: [0, 0, 1600, 900], boxes: [{ b: [538, 316, 1062, 520], n: 1 }, { b: [934, 632, 1063, 668], n: 2 }] },
      zo('z-leads-actions.png', 'Zoho — list … menu with Mass Update (not run).', [{ b: [1396, 172, 1572, 202], n: 1 }])],
    rows: [['1', 'Pipeline offered in Mass Update', 'Mass Update in the list menu', 'Offered, with "New pipeline" and "Stage in the new pipeline"', 'PASS'],
      ['2', 'Apply it', NC, '422 "Invalid value for: Pipeline" (API, 26 Oct) / "\'640e03a4…\' is not one of the allowed values (Standard (Standard))" (screen, 25 Oct); no message on screen', 'FAIL']] },
  'NDC-1312': { ...FAIL, title: 'Change pipeline asks for the stage, but saving fails',
    panels: [{ img: 'pl06-change-pipeline-dialog.png', caption: 'TAVI — deal "QA W2 PL Standard" (25 Oct 2026): "Change pipeline?" asks for the stage in pipeline "1". Change pipeline → 422, no message, deal not moved.', crop: [0, 0, 1600, 900], boxes: [{ b: [544, 380, 1056, 530], n: 1 }, { b: [896, 558, 1031, 594], n: 2 }] },
      zo('z-deal-overview.png', 'Zoho — deal "Benton" stage bar. This org has only the default pipeline.', [{ b: [512, 256, 1440, 284], n: 1 }])],
    rows: [['1', 'Ask for the stage in the new pipeline', NC + ' (no second pipeline in this org)', 'The dialog asks for the stage and keeps the current one if the new pipeline has it', 'PASS'],
      ['2', 'Save the change', NC, 'PATCH → 422 "Invalid value for: Pipeline" (also by API on 26 Oct); no message; the deal stays in "Standard"', 'FAIL']] },
};

const want = process.argv.slice(2);
for (const [t, s] of Object.entries(specs)) {
  if (want.length && !want.includes(t)) continue;
  fs.writeFileSync(`spec-${t}-retest.json`, JSON.stringify({ out: `${t}-retest.png`, ticket: t, env, date, ...s }, null, 1));
  console.log('spec', t);
}
module.exports = specs;
