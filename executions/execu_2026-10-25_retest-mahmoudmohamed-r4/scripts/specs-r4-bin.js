// Writes the annotation specs for round 4, Recycle Bin group (26 Oct 2026, 7 CRM tickets). Usage: node specs-r4-bin.js
// Cards (NDC-*.png) come from cards-r4-bin.js + apicard.js.
const fs = require('fs'); const path = require('path');
const ENV = { env: 'staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless) · account mahmoud.mahamed1515 (CRM Admin)', date: '26 Oct 2026' };
const DIM = n => /^NDC-/.test(n) ? [1600, 900] : [1280, 866];
const P = (img, caption, crop, boxes) => ({ img, caption, crop, w: DIM(img)[0], h: DIM(img)[1], boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const BIN = [270, 60, 1000, 806];
const S = {
  1597: { title: 'Recycle Bin | The module filter is incomplete and does not cover all system modules', verdict: 'PARTIAL',
    panels: [P('1597-01-module-dropdown.png', 'Filters › Module: formatted labels with counts; Approval Process and Blueprint now offered. Odd first entry "23c1a6s8d46a (1)".', [270, 60, 1000, 540], [[[520, 418, 700, 480], 1, 'PASS'], [[520, 322, 700, 352], 2, 'INFO']]),
      P('NDC-1597-search.png', 'Searches for Pipeline, Review Process, Assignment Rule and Action return "No results found".', [0, 80, 1600, 345], [[[36, 99, 1564, 178], 3, 'PASS'], [[36, 188, 1564, 366], 4, 'FAIL']])],
    rows: [['1, 3', 'Module list', 'All system modules, formatted names', '40 modules with counts, no raw lowercase names; Workflow Rule, Saved View, Org Unit, Profile, Approval Process, Blueprint offered', 'PASS'],
      ['4', 'Search "pipeline" / "review" / "assignment" / "action"', 'Pipeline, Review Process, Assignment Rule, Action offered', '"No results found" for all four', 'FAIL'],
      ['2', 'Entry "23c1a6s8d46a (1)"', 'A module name', 'Id-like label shown as a module', 'INFO']] },
  1600: { title: 'Recycle Bin | The Deleted by filter only lists users who currently have items in the bin, so most of the tenant\'s users cannot be selected', verdict: 'PASS',
    panels: [P('1600-01-deleted-by.png', 'Filters › Deleted by: users with no items in the bin are listed with (0).', [270, 60, 1000, 540], [[[613, 288, 867, 572], 1, 'PASS'], [[620, 322, 860, 350], 2, 'PASS']]),
      P('NDC-1600-users.png', 'Full list: all 16 tenant users, each with a count.', [0, 80, 1600, 170], [[[36, 99, 1564, 230], 3, 'PASS']])],
    rows: [['1, 3', 'Users offered', 'Every tenant user', 'All 16 users listed with counts', 'PASS'],
      ['2', 'Users with no items in the bin', 'Selectable', 'Listed with (0), e.g. Ahmed Hegazy NDC, Dev Team 2, Mahmoud Samy, test user 2', 'PASS'],
      ['—', 'Users with items', 'Correct count', 'ndc-staging-owner (34), test user 1 (1)', 'PASS']] },
  1601: { title: 'Recycle Bin | Selecting a Module or Deleted by option removes other options from the same dropdown, so the filter cannot be changed without clearing it first', verdict: 'PASS',
    panels: [P('1601-01-after-select-leads.png', 'After selecting Leads (7) and reopening the Module dropdown, every other module is still offered (Deals, Email Template, File, Meetings, Org Unit …).', BIN, [[[509, 196, 604, 228], 1, 'PASS'], [[512, 413, 763, 443], 2, 'PASS'], [[512, 286, 763, 410], 3, 'PASS'], [[512, 446, 763, 570], 3, 'PASS'], [[1017, 77, 1077, 100], 4, 'PASS']])],
    rows: [['1, 4', 'Select Module = Leads', 'Filter applied', 'Chip "Leads (7)", list shows 7 items', 'PASS'],
      ['2–3', 'Reopen the Module dropdown', 'All options still there, current one ticked', 'Leads ticked; all 41 options still listed', 'PASS']] },
  1795: { title: 'Recycle Bin | Mass deleting records doesn\'t fetch the next list of records automatically and require the user to load them manually by clicking on Load More.', verdict: 'PASS',
    panels: [P('1795-01-selected.png', 'Before: filter "QA RT 1795" → 60 items, all 50 on the page selected → Delete (50).', BIN, [[[818, 77, 885, 100], 1, 'PASS'], [[992, 72, 1077, 104], 2, 'PASS'], [[305, 265, 345, 860], 3, 'PASS']]),
      P('1795-02-after-delete-forever.png', 'After Delete forever: list re-fetched by itself — remaining 10 (bulk 10 … 01) shown, no Load More, no page refresh.', BIN, [[[1010, 77, 1077, 100], 4, 'PASS'], [[300, 305, 1255, 860], 5, 'PASS']])],
    rows: [['1–3', 'Select all on page → Delete (50) → Delete forever', 'Confirm and delete', '"Permanently delete 50 records? This can\'t be undone." → POST /recycle-bin/delete 200', 'PASS'],
      ['4–5', 'List after the delete', 'Next records loaded automatically', 'GET items ×2 fired by the page; remaining 10 shown without Load More or refresh', 'PASS']] },
  1797: { title: 'Recycle Bin | Some records can\'t be deleted forever in a bulk delete and stay in the Recycle Bin.', verdict: 'PASS',
    panels: [P('1795-02-after-delete-forever.png', 'After bulk Delete forever of 50: only the 10 unselected records (bulk 10 … 01) remain.', BIN, [[[1010, 77, 1077, 100], 1, 'PASS'], [[300, 305, 1255, 860], 2, 'PASS']]),
      P('NDC-1797-api.png', 'POST /recycle-bin/delete with 50 ids: all succeeded; 60 → 10 items.', [0, 80, 1600, 300], [[[36, 214, 1564, 251], 3, 'PASS'], [[36, 261, 1564, 366], 4, 'PASS']])],
    rows: [['3', 'Bulk Delete forever (50 ids)', 'All 50 deleted', 'POST /recycle-bin/delete 200 — all 50 succeeded', 'PASS'],
      ['1, 2, 4', 'Bin after the delete', 'None of the 50 left behind', '60 → 10 items; the 10 left are the unselected bulk 01–10', 'PASS']] },
  1603: { title: 'Recycle Bin | Restoring a record with duplicate data to a unique field is accepted without validation.', verdict: 'PASS',
    panels: [P('1603-01-restore-conflict.png', 'Restore "QA RT 1603 B" refused: toast names the unique field; B stays in the bin.', BIN, [[[837, 777, 1255, 840], 1, 'PASS'], [[300, 305, 1255, 355], 2, 'PASS']]),
      P('NDC-1603-api.png', 'Restore response: succeeded [], failed [name_conflict].', [0, 80, 1600, 390], [[[36, 167, 1564, 204], 3, 'PASS'], [[36, 261, 1564, 319], 4, 'PASS'], [[36, 397, 1564, 455], 5, 'INFO']])],
    rows: [['3', 'Duplicate unique value while the record is live', 'Refused', '422 "QA RT Uniq is already in use by another record."', 'PASS'],
      ['4', 'Restore B after A took the value', 'Refused with the reason', 'POST /recycle-bin/restore 200 · succeeded [] · failed [reason_key recyclebin.error.name_conflict]', 'PASS'],
      ['1–2', 'UI after restore', 'Error shown, no duplicate', 'Toast "QA RT 1603 B: QA RT Uniq is already in use by another record."; B stays in bin; only A holds QA-RT-U1', 'PASS'],
      ['5', 'Rename on restore', '—', 'Not offered; conflicting record is skipped', 'INFO']] },
  1602: { title: 'Recycle Bin | Empty Bin returns 504 Gateway Timeout.', verdict: 'BLOCKED',
    panels: [P('NDC-1602-blocked.png', 'Bin filled to 244 items, but Empty Bin was not clicked: the agent\'s safety check refused the irreversible action. Needs the user.', [0, 0, 1600, 340], [[[36, 99, 1564, 136], 1, 'INFO'], [[36, 146, 1564, 251], 2, 'BLOCKED'], [[36, 261, 1564, 319], 3, 'INFO']])],
    rows: [['1', 'Large bin', 'Bin with many items', '244 items (200 "QA RT 1602 fill" leads + others)', 'INFO'],
      ['2', 'Empty Bin › confirm', 'Completes without 504', 'Not run — click refused by the agent\'s safety check (irreversible)', 'BLOCKED'],
      ['3', 'Next step', '—', 'User to run Empty Bin (or allow it); 200 QA RT fill items stay in the bin until then', 'INFO']] },
};
fs.mkdirSync(path.join(__dirname, 'specs'), { recursive: true });
for (const [n, s] of Object.entries(S)) {
  const spec = { out: `NDC-${n}-retest-${s.verdict}.png`, ticket: `NDC-${n}`, title: s.title, verdict: s.verdict, ...ENV, panels: s.panels, rows: s.rows };
  fs.writeFileSync(path.join(__dirname, 'specs', `NDC-${n}.json`), JSON.stringify(spec, null, 1));
}
console.log('wrote', Object.keys(S).join(', '));
