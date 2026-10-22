// Writes the annotation specs for the import-group tickets (21 Oct 2026). Usage: node specs-import.js
const fs = require('fs'); const path = require('path');
const ENV = { env: 'staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless) · account mahmoud.mahamed1515 (CRM Admin)', date: '21 Oct 2026' };
const P = (img, caption, crop, boxes) => ({ img, w: 1280, h: 720, caption, crop, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const S = {
  1517: { title: 'Import | CSV files are rejected — the import wizard accepts only .xlsx and .xls', verdict: 'PASS',
    panels: [P('1517-02-csv-uploaded.png', 'Leads › Import: step "Upload", hint names Excel and CSV; QA-RT-leads.csv accepted (2 rows).', [60, 0, 1160, 500], [[[84, 22, 170, 50], 1, 'PASS'], [[302, 128, 826, 154], 2, 'PASS'], [[304, 428, 976, 488], 3, 'PASS']])],
    rows: [['1', 'Step label names every format', 'Not "Upload Excel file"', 'Step is "Upload"', 'PASS'],
      ['2', 'Dropzone / hint text', 'Excel and CSV named', '"Choose an Excel (.xlsx, .xls) or CSV (.csv) file"; "Excel (.xlsx, .xls) or CSV (.csv) · up to 25 MB"', 'PASS'],
      ['3', '.csv accepted and imported', 'Mapping → review → submit', '2 rows, 0 errors, Import complete 2 added; quoted value "QA RT csv 2, quoted" kept whole', 'PASS'],
      ['—', 'Record source label', '—', 'CSV-imported records show source "Excel Import" (minor)', 'INFO']] },
  1518: { title: 'Import | "Update existing only" does not offer a Target layout, unlike the other two operations', verdict: 'PASS',
    panels: [P('1518-leads-Update-existing-only.png', 'Leads import, Update existing only: Target layout shown (update-specific hint) with Match records on below.', [300, 96, 680, 564], [[[304, 192, 976, 342], 1, 'PASS'], [[538, 440, 742, 546], 2, 'INFO']])],
    rows: [['1', 'Target layout for Update existing only', 'Offered like the other two', 'Shown, with hint "Matched records keep the layout they were created with…"', 'PASS'],
      ['—', 'Add new records / Add and update', 'Target layout offered', 'Shown for both (Leads and Deals)', 'PASS'],
      ['—', 'Consistency', 'Same settings except where not applicable', 'Duplicate handling for Add; Match records on for Update / Add and update', 'PASS']] },
  1519: { title: 'Import | "Match records on" appears above Target layout, and its warning names the module, not the layout', verdict: 'PASS',
    panels: [P('1519-leads-fieldpermissions.png', "Target layout now comes first; changing it to FieldPermissions offers that layout's unique field (Name) in Match records on.", [300, 96, 680, 564], [[[304, 192, 976, 342], 1, 'PASS'], [[304, 584, 976, 660], 2, 'PASS']])],
    rows: [['1', 'Target layout before Match records on', 'Layout chosen first', 'Target layout is the first panel', 'PASS'],
      ['2', 'Match field follows the layout', 'Unique fields of the selected layout', 'FieldPermissions → Unique field: Name; Standard / Test → warning', 'PASS'],
      ['—', 'Warning names the layout', 'Not "This module…"', 'The "Standard" layout has no unique field… / The "Test" layout…', 'PASS'],
      ['—', '"Default layout" option', '—', 'The pseudo-option is quoted as if it were a layout: The "Default layout" layout has no unique field (minor)', 'INFO']] },
  1589: { title: 'Import History | "Download error rows" is not available for an import that finished with errors', verdict: 'PASS',
    panels: [P('1589-03-view-details.png', 'Import History › row menu (View details · Download error rows · Undo import) › View details: 3 errors with reasons and a download button.', [304, 60, 672, 600], [[[324, 336, 956, 580], 1, 'PASS'], [[690, 612, 882, 648], 2, 'PASS']])],
    rows: [['1', 'View details', 'Offered in the row menu', '"View details" opens Import details with the error rows and reasons', 'PASS'],
      ['2', 'Download error rows after the wizard closed', 'Works from history', 'QA-RT-leads-imp-errors.xlsx: the 3 failed rows + a reason column (header shows the raw name "__error_reason" — minor)', 'PASS'],
      ['—', 'Menu', 'Download + view', 'View details · Download error rows · Undo import', 'PASS']] },
  1590: { title: 'Import | A percent field accepts values above 100 % on import', verdict: 'PASS',
    panels: [P('1590-imp-4-review.png', 'Review: 8 rows, 5 will import, 3 with errors (p150, p-5 and the unknown multi-select option).', [256, 260, 768, 364], [[[280, 548, 1000, 604], 1, 'PASS']]), P('1590-02-review-after-clear.png', 'Review › All errors: the table stays empty (No errors match your filters, even after Clear) while it counts 1–3 of 3.', [256, 200, 768, 380], [[[258, 340, 1022, 536], 2, 'FAIL']]),
      P('1589-03-view-details.png', 'After import, Import details names the allowed range for rows 4 (150) and 5 (-5).', [304, 330, 672, 260], [[[326, 408, 956, 520], 3, 'PASS']])],
    rows: [['1', 'Percent 150 / -5 rejected at validation', 'Error rows, no record', 'Review: 5 will import, 3 errors; p150 and p-5 not created; p50 and p100 imported', 'PASS'],
      ['3', 'Reason names the allowed range', 'between 0 and 100', 'Import details and error file: "Percent value must be between 0 and 100"', 'PASS'],
      ['—', 'Review breakdown wording', '—', 'Breakdown type says "Invalid format" for 150', 'INFO'],
      ['2', 'Review "All errors" table', 'Lists the error rows', 'Empty with "No errors match your filters" even after Clear — new UI defect (the validate API returns all 3 issues)', 'FAIL']] },
  1592: { title: "Import | Multi-select values separated by ',' or ';' are not accepted", verdict: 'PASS',
    panels: [P('1589-03-view-details.png', "Unknown option row: the error names the option ('9').", [304, 330, 672, 260], [[[326, 522, 956, 576], 1, 'PASS']])],
    rows: [['—', 'Comma separated 1,2', 'Imported as two options', 'Stored [1, 2]', 'PASS'],
      ['—', 'Semicolon separated 1;2', 'Imported as two options', 'Stored [1, 2]', 'PASS'],
      ['—', 'Comma + space 1, 2', 'Imported as two options', 'Stored [1, 2]', 'PASS'],
      ['1', 'Unknown option 1,9', 'Error names the option', "'9' is not one of the allowed multi-select values; row not created", 'PASS']] },
  1587: { title: "Import + Recycle Bin | Undo Import doesn't move the undone records to the Recycle Bin", verdict: 'PASS',
    panels: [P('1587-04-recycle-bin.png', 'After Undo import (POST …/undo → 204, history status Undone): the 5 imported leads are in the Recycle Bin, 60-day expiry.', [268, 60, 1012, 460], [[[300, 238, 1250, 514], 1, 'PASS']])],
    rows: [['1', 'Undone records in the Recycle Bin', 'As the dialog promises', 'All 5 (QA RT imp …) listed, deleted 21/10/2026 14:10 by mahmoud.mahamed1515', 'PASS'],
      ['—', 'Retention', '60 days', 'Expires in 60 days (20 Dec 2026)', 'PASS'],
      ['—', 'Restorable', 'Can be restored', 'Restore on QA RT imp p50 → record live again (GET 200)', 'PASS'],
      ['—', 'Grouped per import', 'Ideally one group', 'One row per record (same deletion time) — no group row', 'INFO']] },
};
for (const [n, s] of Object.entries(S)) {
  const spec = { out: `NDC-${n}-retest-${s.verdict}.png`, ticket: `NDC-${n}`, title: s.title, verdict: s.verdict, ...ENV, panels: s.panels, rows: s.rows };
  fs.writeFileSync(path.join(__dirname, 'specs', `NDC-${n}.json`), JSON.stringify(spec, null, 1));
}
console.log('wrote', Object.keys(S).join(', '));
