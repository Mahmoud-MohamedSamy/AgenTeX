// Writes the evidence configs for items 2–12 (run: node items-02-12.js). Coordinates are original-image pixels.
const fs = require('fs'); const path = require('path');
const T = f => `../originals/tavi/${f}`, Z = f => `../originals/zoho/${f}`;
const B = (n, x, y, w, h) => ({ n, x, y, w, h });
const DATE = '5 Oct 2026';
const items = {
  '02-rename-any-tab': {
    id: 'Item 2 (Z9)', title: 'Rename any tab', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Setup → Modules and Fields (only record modules listed)', img: T('44-modules-list.png'), boxes: [B(1, 296, 230, 1116, 500)] },
      { side: 'TAVI', caption: 'Layout builder → Layout settings → Rename Module → page crash', img: T('31b-rename-module-modal-loaded.png'), boxes: [B(3, 560, 428, 380, 116)] },
      { side: 'Zoho', caption: 'Setup → Modules and Tabs → Rename Tabs', img: Z('07-rename-tabs.png'), boxes: [B(1, 14, 636, 196, 26), B(2, 930, 128, 300, 54), B(2, 284, 475, 920, 54), B(2, 284, 706, 920, 54)] }
    ],
    rows: [
      { n: '1', b: 'A page to rename tabs', zoho: 'Rename Tabs page with display names for 19 tabs (seen)', tavi: 'No Rename Tabs page; the module list holds only the 9 record modules', match: 'Gap' },
      { n: '2', b: 'Rename tabs that are not record modules (Knowledge Base, Reports, Dashboards, Analytics, Customers, Activities, Community, Social, Chat)', zoho: 'Each has a Display Name on the page (seen: Solutions → "Knowledge Base", Reports, Dashboards, Community, Social, Chat)', tavi: 'Not possible anywhere in Setup', match: 'Gap' },
      { n: '3', b: 'Rename a record module (singular / plural)', zoho: 'Manage Modules → edit form (seen)', tavi: 'In the code ("Rename" and "Rename Module"); opening it from the layout builder crashed the page twice: "Cannot read properties of undefined (reading \'trim\')"', match: 'Differs' }
    ],
    notes: ['Row 3 is a possible bug to check separately: Tickets layout builder → gear (Layout settings) → Rename Module → "Something went wrong". Reproduced 2 of 2 times as the second admin, 5 Oct 2026, the second time after the builder had fully loaded. Nothing was saved.',
      'Originals: originals/tavi/44-modules-list.png, 30b-builder-layout-settings-menu-loaded.png, 31b-rename-module-modal-loaded.png; originals/zoho/07-rename-tabs.png.']
  },
  '03-search-fields': {
    id: 'Item 3 (Z10)', title: 'Search Fields setting per module', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Setup → Modules and Fields → Tickets (module page tabs)', img: T('45-tickets-field-listing.png'), boxes: [B(1, 288, 140, 360, 42), B(2, 66, 826, 192, 60)] },
      { side: 'Zoho', caption: 'Setup → Layouts and Fields → Search Fields → Tickets', img: Z('17-search-fields.png'), boxes: [B(1, 14, 764, 196, 26), B(2, 276, 124, 226, 28), B(3, 276, 164, 1146, 308)] }
    ],
    rows: [
      { n: '1', b: 'Where the setting lives', zoho: 'Layouts and Fields → Search Fields (seen)', tavi: 'Module page has only Layouts, Fields, Workflow Rules, Summary; no search setting anywhere in Customization', match: 'Gap' },
      { n: '2', b: 'Search all fields or specific fields', zoho: 'All Fields / Specific Fields (seen)', tavi: 'Not available', match: 'Gap' },
      { n: '3', b: 'Pick the searchable fields', zoho: '27 ticket fields with tick boxes (seen). Docs: up to 10 per module, 6 for Contracts, Products, Activities', tavi: 'Not available', match: 'Gap' }
    ],
    notes: ['Originals: originals/tavi/45-tickets-field-listing.png; originals/zoho/17-search-fields.png.']
  },
  '04-standard-fields-protected': {
    id: 'Item 4 (Z11)', title: 'Standard fields are protected', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Tickets → Fields → Field Listing', img: T('45-tickets-field-listing.png'), boxes: [B(1, 936, 690, 80, 210)] },
      { side: 'TAVI', caption: 'Calls layout builder → Subject → field menu', img: T('41-calls-subject-field-menu.png'), boxes: [B(3, 644, 280, 202, 28), B(4, 644, 522, 202, 28)] },
      { side: 'Zoho', caption: 'Tickets layout editor', img: Z('11-tickets-layout-editor.png'), boxes: [B(2, 52, 262, 372, 56), B(2, 52, 578, 372, 56)] },
      { side: 'Zoho', caption: 'Tickets layout editor → Contact Name → Field Settings', img: Z('09b-field-settings-menu-1483686000000000391.png'), boxes: [B(3, 236, 314, 206, 28), B(4, 236, 402, 206, 28)] }
    ],
    rows: [
      { n: '1', b: 'Standard fields marked as custom', zoho: 'All standard fields are System fields; none is marked custom (Fields List, API)', tavi: 'Field Listing ticks "Custom Field" on Subject, Contact, Account, Status (seen)', match: 'Gap' },
      { n: '2', b: 'Core fields labelled as protected', zoho: '"Non-removable standard field" under Contact Name, Department, Email, Subject, Description, Status, Ticket Owner (seen)', tavi: 'No such label or lock', match: 'Gap' },
      { n: '3', b: 'Make a system-mandatory field optional', zoho: 'Contact Name: "Mark as required" ticked and disabled (seen)', tavi: 'Calls Subject: "Unmark as Required" is enabled (seen)', match: 'Gap' },
      { n: '4', b: 'Remove a core field from the layout', zoho: 'Contact Name: "Remove Field" disabled (seen)', tavi: '"Remove from Layout" is disabled only while the field is required. API flags say Contact, Department, Email, Description, Due Date, Priority, Channel, Ticket Owner, Resolution can be removed (flags read, not clicked)', match: 'Gap' },
      { n: '5', b: 'Delete a standard field permanently', zoho: 'Not offered; standard fields only go to Unused Fields (docs + editor)', tavi: 'API: isDeletable / canPermanentlyDelete = true on Calls, Events, Tasks Subject, Product Name, Contract Name (API, not clicked)', match: 'Gap' }
    ],
    notes: ['Rows 4 and 5 for TAVI come from the API permission flags of each field (GET /modules/{id}/fields); nothing was removed or deleted.',
      'Originals: originals/tavi/45-tickets-field-listing.png, 41-calls-subject-field-menu.png; originals/zoho/11-tickets-layout-editor.png, 09b-field-settings-menu-1483686000000000391.png.']
  },
  '05-department-layouts': {
    id: 'Item 5 (Z12)', title: 'Department-specific layouts and the Department field', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Tickets → Layouts', img: T('32-tickets-layouts-tab.png'), boxes: [B(1, 288, 194, 760, 24), B(2, 292, 300, 1124, 96)] },
      { side: 'TAVI', caption: 'Tasks layout builder (Unused Fields open)', img: T('46-tasks-builder-unused-fields.png'), boxes: [B(3, 74, 408, 250, 22)] },
      { side: 'Zoho', caption: 'Layouts and Fields → Layouts → Tickets', img: Z('08-layouts-and-fields.png'), boxes: [B(1, 428, 60, 134, 26), B(2, 276, 140, 1000, 40)] },
      { side: 'Zoho', caption: 'Tasks layout editor (department Anyware Software)', img: Z('11-tasks-layout-editor.png'), boxes: [B(1, 160, 62, 180, 24), B(3, 52, 262, 372, 56)] }
    ],
    rows: [
      { n: '1', b: 'Layout scope', zoho: 'Per department: department picker on Layouts and in the editor header (seen). API: the Sales department has its own ticket layout', tavi: 'One list per module; layouts are given to profiles ("Shared To", "assign them … based on permission profiles"); no department', match: 'Gap' },
      { n: '2', b: 'Layout list columns', zoho: 'Name, Profiles, Display in Help Center, Active', tavi: 'Name, Shared To, Last Modified, Status', match: 'Differs' },
      { n: '3', b: 'Department on Tasks (also Calls, Events, Contracts)', zoho: 'Mandatory, "Non-removable standard field" (seen on Tasks)', tavi: 'Department sits in Unused Fields on Tasks and is optional (seen); same for Calls and Events (API)', match: 'Gap' }
    ],
    notes: ['TAVI department storage could not be tested: the tenant shows 0 departments (GET /desk/departments = []). Please add one department.',
      'Originals: originals/tavi/32-tickets-layouts-tab.png, 46-tasks-builder-unused-fields.png; originals/zoho/08-layouts-and-fields.png, 11-tasks-layout-editor.png.']
  },
  '06-standard-fields-missing': {
    id: 'Item 6 (Z13)', title: 'Missing or different standard fields', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Tickets layout builder — Unused Fields (21)', img: T('35-tickets-builder-unused-fields.png'), boxes: [B(1, 72, 200, 258, 650)] },
      { side: 'TAVI', caption: 'Accounts layout builder — Unused Fields (9)', img: T('47-accounts-builder-unused-fields.png'), boxes: [B(3, 72, 344, 258, 120), B(2, 360, 345, 1056, 280)] },
      { side: 'Zoho', caption: 'Layouts and Fields → Fields List → Tickets', img: Z('14-fields-list.png'), boxes: [B(1, 240, 314, 1360, 32), B(1, 240, 952, 1360, 22)] },
      { side: 'Zoho', caption: 'Accounts layout editor — Unused Fields (8)', img: Z('25-accounts-layout-unused-expanded.png'), boxes: [B(2, 1226, 356, 348, 38), B(3, 1226, 254, 348, 90), B(4, 1226, 406, 348, 194)] }
    ],
    rows: [
      { n: '1', b: 'Tickets: Category and Sub Category', zoho: 'Both exist (Fields List, seen); a Category → Sub Category dependency exists', tavi: 'Not in the field list or in Unused Fields (seen)', match: 'Gap' },
      { n: '2', b: 'Accounts: Annual Revenue', zoho: 'Currency field in Unused Fields (seen)', tavi: 'Does not exist', match: 'Gap' },
      { n: '3', b: 'Accounts: Industry, Fax, Description', zoho: 'In Unused Fields, can be added back (seen)', tavi: 'In Unused Fields (seen); the API shows them soft-deleted on 14 Sep 2026', match: 'Same as Zoho' },
      { n: '4', b: 'Accounts address', zoho: 'Separate Street, City, State, Code (seen)', tavi: 'One compound "Address" field (Unused) plus a Country text field', match: 'Differs' },
      { n: '5', b: 'Other modules (not in these screenshots)', zoho: 'Products: mandatory Department, Manufacturer pick list. Tasks: Remind At; Calls/Events: Remind me. Contact Name mandatory on Calls/Events; Call Status mandatory. Contracts: Account Name, Start Date, Support Plan mandatory (live editors, see reference/zoho-desk-live-inventory.md)', tavi: 'Products: no Department, Manufacturer single line. No Remind fields. Those fields optional (API)', match: 'Gap' }
    ],
    notes: ['Zoho keeps several of these standard fields in Unused Fields by default — the gap is that TAVI does not have them at all (Category, Sub Category, Annual Revenue) or models them differently.',
      'Originals: originals/tavi/35-tickets-builder-unused-fields.png, 47-accounts-builder-unused-fields.png; originals/zoho/14-fields-list.png, 25-accounts-layout-unused-expanded.png.']
  },
  '07-picklist-tools': {
    id: 'Item 7 (Z14)', title: 'Picklist tools (bulk add, sort, Replace Values)', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Tickets builder → Priority → field menu', img: T('36-tickets-priority-field-menu.png'), boxes: [B(1, 1168, 546, 206, 278)] },
      { side: 'TAVI', caption: 'Priority → Field Properties → ADVANCED', img: T('37-tickets-priority-properties-advanced.png'), boxes: [B(2, 998, 166, 424, 176), B(3, 998, 350, 424, 40)] },
      { side: 'Zoho', caption: 'Tickets editor → Priority → Field Settings', img: Z('28-tickets-priority-field-settings-menu.png'), boxes: [B(1, 758, 686, 210, 28)] },
      { side: 'Zoho', caption: 'Priority → Edit Field', img: Z('09d-edit-properties-priority.png'), boxes: [B(2, 812, 280, 760, 200), B(3, 1450, 516, 134, 28), B(4, 1468, 226, 104, 26)] }
    ],
    rows: [
      { n: '1', b: 'Replace Values (change a value on existing records)', zoho: '"Replace Values" in the Field Settings menu (seen). Docs: updates existing records', tavi: 'Not in the field menu; replacement is offered only when an option still in use is removed', match: 'Gap' },
      { n: '2', b: 'Value list', zoho: '-None- (Default), High, Medium, Low', tavi: 'low, medium, high, urgent — stored keys shown as labels', match: 'Differs' },
      { n: '3', b: 'Add many values at once', zoho: '"Add Values in Bulk ▾" (seen)', tavi: 'One at a time: "New option label…" + Add', match: 'Gap' },
      { n: '4', b: 'Import / clear / sort / expand', zoho: 'Four icons above the list (seen; their menus were not opened)', tavi: 'Drag to reorder only', match: 'Gap' }
    ],
    notes: ['Row 2: ticket Priority values are an editable list, so the value difference is not a gap by itself; showing keys like "low" instead of labels is listed as a possible bug.',
      'Originals: originals/tavi/36-tickets-priority-field-menu.png, 37-tickets-priority-properties-advanced.png; originals/zoho/28-tickets-priority-field-settings-menu.png, 09d-edit-properties-priority.png.']
  },
  '08-rounding-options': {
    id: 'Item 8 (Z15)', title: 'Rounding options for Decimal and Currency fields', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Products builder → Unit Price (Currency) → ADVANCED', img: T('43-products-unit-price-advanced.png'), boxes: [B(1, 998, 136, 424, 224)] },
      { side: 'TAVI', caption: 'Unit Price → GENERAL', img: T('42-products-unit-price-general.png'), boxes: [B(2, 998, 136, 424, 250)] },
      { side: 'Zoho', caption: 'Zoho help — Working with Custom Fields; API fields', text: [
        'Decimal, Percent and Currency fields have Decimal Places and a Rounding Option: Normal, Round Off, Round Down, Round Up.',
        'API (POST /fields): decimalPlaces, roundingPrecision, roundingOption (roundOff / roundDown / roundUp).',
        'Not seen live: the Zoho Add Field palette is drag-only and nothing was dragged in the reference org.'],
        sources: ['https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/working-with-custom-fields', 'https://desk.zoho.com/DeskAPIDocument#Fields'] }
    ],
    rows: [
      { n: '1', b: 'Rounding option', zoho: 'Normal / Round Off / Round Down / Round Up (docs)', tavi: 'Not on the field (ADVANCED shows Currency Symbol and Auto-fill only)', match: 'Gap' },
      { n: '2', b: 'Decimal places', zoho: 'Set per field (docs)', tavi: 'Not on GENERAL (label, API name) or ADVANCED (currency symbol, auto-fill) (seen); VALIDATION tab not opened; the data type catalogue has precision and scale 0–4 for currency (API)', match: 'Not checked' }
    ],
    notes: ['Zoho side is from the docs only. Originals: originals/tavi/42-products-unit-price-general.png, 43-products-unit-price-advanced.png.']
  },
  '09-lookup-options': {
    id: 'Item 9 (Z16)', title: 'Lookup options (filter, search, display, auto-fill)', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Tickets builder → Contact (Lookup) → ADVANCED', img: T('38-tickets-contact-lookup-advanced.png'), boxes: [B(1, 998, 138, 424, 56), B(2, 998, 208, 424, 244)] },
      { side: 'Zoho', caption: 'Zoho help — Custom Lookup Fields', text: [
        'Filter lookup records: up to 5 criteria.',
        '"Lookup records can be searched by": up to 6 fields.',
        'Sort lookup records by created time, name or modified time.',
        'Display fields in the lookup pop-up: up to 6.',
        'Autofill layout fields from the chosen record: up to 5 mappings.',
        'Related module + sub-tab name; relationship is one-to-many and creates a sub-tab on the parent record.',
        'Not seen live: no custom lookup exists in the reference org and the palette is drag-only.'],
        sources: ['https://help.zoho.com/portal/en/kb/desk/customization/layouts-and-fields/articles/creating-custom-lookup-fields-in-zoho-desk'] }
    ],
    rows: [
      { n: '1', b: 'Related module and sub-tab / related list name', zoho: 'Yes (docs)', tavi: 'Lookup Module + Related List Title (seen)', match: 'Same as Zoho' },
      { n: '2', b: 'Choose the module at record creation', zoho: 'Not documented', tavi: '"Let users choose the related module at record creation" (seen)', match: 'TAVI extra' },
      { n: '3', b: 'Filter which records can be picked', zoho: 'Up to 5 criteria (docs)', tavi: 'Not available', match: 'Gap' },
      { n: '4', b: 'Search and display fields in the pop-up', zoho: 'Search by up to 6 fields; show up to 6 fields (docs)', tavi: 'One Display Field only', match: 'Gap' },
      { n: '5', b: 'Fill fields from the chosen record', zoho: 'Up to 5 mappings (docs)', tavi: 'Not available (TAVI auto-fill only copies from the current user, a setting or a field on the same form)', match: 'Gap' }
    ],
    notes: ['Zoho side is from the docs only. Original: originals/tavi/38-tickets-contact-lookup-advanced.png.']
  },
  '10-layout-help-center': {
    id: 'Item 10 (Z17)', title: 'Help Center settings on a layout', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Tickets → Layouts', img: T('32-tickets-layouts-tab.png'), boxes: [B(1, 292, 298, 1124, 36)] },
      { side: 'TAVI', caption: 'Create New Layout → opens an empty builder named "New Layout"', img: T('33-create-new-layout-dialog.png'), boxes: [B(2, 76, 62, 236, 40)] },
      { side: 'Zoho', caption: 'Layouts and Fields → Layouts → Tickets', img: Z('08-layouts-and-fields.png'), boxes: [B(1, 928, 102, 180, 70)] }
    ],
    rows: [
      { n: '1', b: 'Show a ticket layout in the Help Center', zoho: '"Display in Help Center" column, ticked for the default layout (seen)', tavi: 'No such column or option', match: 'Gap' },
      { n: '2', b: 'New layout form', zoho: 'Docs: Name, Display Name in Help Center, Description, Layout Permissions, "Allow non-department agents", "Display in Help Center", then Save and Configure (Add Layout not opened live)', tavi: 'Create New Layout opens an unsaved builder called "New Layout" with no description or Help Center options (seen; nothing saved)', match: 'Gap' }
    ],
    notes: ['Per-field Help Center access is a separate, already-filed gap (NDC-1879 item 4).',
      'Originals: originals/tavi/32-tickets-layouts-tab.png, 33-create-new-layout-dialog.png; originals/zoho/08-layouts-and-fields.png.']
  },
  '11-ticket-status': {
    id: 'Item 11 (Z18)', title: 'Ticket Status page with status types', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Tickets builder → Status → Field Properties → ADVANCED', img: T('40-tickets-status-properties-advanced.png'), boxes: [B(1, 998, 166, 424, 176)] },
      { side: 'Zoho', caption: 'Layouts and Fields → Ticket Status (department Anyware Software)', img: Z('18-ticket-status.png'), boxes: [B(1, 14, 795, 196, 26), B(2, 278, 100, 762, 236), B(3, 396, 62, 124, 24), B(4, 1086, 84, 274, 66)] }
    ],
    rows: [
      { n: '1', b: 'A page to manage ticket statuses', zoho: 'Ticket Status page with "Add Status" (seen)', tavi: 'Statuses are just the options of the Status field', match: 'Gap' },
      { n: '2', b: 'Status type for each status', zoho: 'STATUS TYPE column: Open → OPEN, On Hold → ON HOLD, Escalated → OPEN, Closed → CLOSED (seen)', tavi: 'No type; only names (Open, On Hold, Escalated, Closed)', match: 'Gap' },
      { n: '3', b: 'Per department', zoho: 'Department picker on the page (seen)', tavi: 'One list per layout', match: 'Gap' },
      { n: '4', b: 'On Hold pauses the SLA clock', zoho: '"Pause the SLA clock with the new On Hold State" (seen, promo panel)', tavi: 'Not checked', match: 'Not checked' }
    ],
    notes: ['Check first whether a Tickets or SLA gap item already covers status types before filing.',
      'Originals: originals/tavi/40-tickets-status-properties-advanced.png; originals/zoho/18-ticket-status.png.']
  },
  '12-agents-module': {
    id: 'Item 12 (Z19)', title: 'Agents as a customisable module', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Setup → Modules and Fields', img: T('44-modules-list.png'), boxes: [B(1, 296, 230, 1116, 500)] },
      { side: 'Zoho', caption: 'Modules and Tabs → Manage Modules', img: Z('03-modules-and-tabs.png'), boxes: [B(1, 244, 630, 1356, 34)] },
      { side: 'Zoho', caption: 'Layouts and Fields → Agents layout editor', img: Z('11-agents-layout-editor.png'), boxes: [B(2, 22, 130, 1050, 470), B(3, 1226, 150, 346, 370), B(4, 1226, 850, 346, 32)] }
    ],
    rows: [
      { n: '1', b: 'Agents listed as a module', zoho: 'Agents, Organization-level (seen)', tavi: 'Not in the module list (9 modules, no Agents)', match: 'Gap' },
      { n: '2', b: 'Agent layout', zoho: 'Sections "Agent Information" and "Agent Additional Information"; Last Name, Email, Department, Role and Permission are non-removable (seen)', tavi: 'No agent layout', match: 'Gap' },
      { n: '3', b: 'Custom fields on agents', zoho: '15 field types in the palette (seen)', tavi: 'Not available', match: 'Gap' },
      { n: '4', b: 'Limit', zoho: 'Custom Fields Left (240) (seen)', tavi: '—', match: 'Gap' }
    ],
    notes: ['Check NDC-1878 (Agents gaps) before filing.',
      'Originals: originals/tavi/44-modules-list.png; originals/zoho/03-modules-and-tabs.png, 11-agents-layout-editor.png.']
  }
};
for (const [key, c] of Object.entries(items)) {
  fs.writeFileSync(path.join(__dirname, key + '.json'), JSON.stringify({ out: `../${key}-vs-zoho.png`, date: DATE, ...c }, null, 2));
  console.log('wrote', key);
}
