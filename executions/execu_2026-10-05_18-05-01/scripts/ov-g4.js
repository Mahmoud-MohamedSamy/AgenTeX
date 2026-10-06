const fs = require('fs'); const f = __dirname + '/overrides.json'; const o = JSON.parse(fs.readFileSync(f));
Object.assign(o, {
  G4: { verdict: 'FAIL', severity: 'Low', note: 'Layout name in the builder: empty → "Name is required" and the box keeps only 40 characters (OK); typing the name of another existing layout ("Default") gives no "A layout with this name already exists" warning in the builder. The server does refuse it on save: PUT → 409 "A layout named … already exists" (G4b).' },
  G4b: { verdict: 'PASS' },
  G5: { verdict: 'PASS', note: 'set-default → 200 and isDefault=true; the default layout\'s status switch is disabled, so it cannot be switched off; layout stays active' },
  G6: { verdict: 'FAIL', severity: 'Medium', note: 'POST /modules/{id}/layouts/{layoutId}/set-default on an active, non-default layout that holds 6 records → 500 "An unexpected error occurred" on 2 of 2 attempts (trace ids 0cb41259-d069-4ef0-8aff-80670c7c5c8e, 6bf735ec-b2c4-4f7c-88b6-5a4dd621adbe); the same call on a layout without records returned 200. Switching a layout with records off correctly opens "Move records before this layout is disabled".' },
  G7: { verdict: 'PASS', note: 'Default layout row menu has no "Set as default"; API DELETE on the default → 409 "This is the module\'s default layout and cannot be deleted while it holds that role"; layout kept' },
  G8: { verdict: 'PASS', note: 'Delete on a layout with 6 records: "Delete …?" confirm, then "Move records before this layout is deleted — Move records to [QA MF L1x]"; after Move records the layout is gone and all 6 records have created_with_layout_id = QA MF L1x', shot: 'screenshots/G8-move-records-dialog.png' },
  G11: { verdict: 'PASS', note: 'Create QA MF Device page shows a layout dropdown next to the title with the default layout preselected', shot: 'screenshots/G11-new-record-layout-choice.png' },
  G12: { verdict: 'INFO', note: '25 extra layouts were accepted on one module with no limit (Zoho: 20 active layouts per department); all deleted again' },
  G16: { verdict: 'PASS', note: 'NEW SECTION adds a section; Section settings → Edit Name opens the "Section Settings" drawer with English/Arabic tabs and Column Layout; saved label {"en":"QA MF Section","ar":"قسم QA MF"}. Minor: the drawer opens on the Arabic tab, not English.' },
  G18: { verdict: 'PASS', note: 'Tab Order "Top to Bottom" is saved (tab_order: top_to_bottom). Whether the record form follows it was not checked — NDC-492 says it does not.' },
  G25: { verdict: 'PASS', note: 'Ctrl+S twice saves once. Note: layout rowVersion stays 1 after saves (never increases) — see G26.' },
  G26: { verdict: 'FAIL', severity: 'Medium', note: 'No lost-update protection on layouts: two PUT /modules/{id}/layouts/{layoutId} with the same rowVersion both return 200 and the second (stale) one overwrites the first; rowVersion never increases on save.' },
  G28: { verdict: 'INFO', note: 'No integration banner on the Contacts layout builder (CRM ⇄ Desk integration probably not configured on this tenant); save-time dialog not tried because it needs a field change on a standard module' },
  G29: { verdict: 'PASS' }
});
fs.writeFileSync(f, JSON.stringify(o, null, 1));
