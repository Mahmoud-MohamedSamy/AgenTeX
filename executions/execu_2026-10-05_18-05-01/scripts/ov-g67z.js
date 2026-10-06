const fs = require('fs'); const f = __dirname + '/overrides.json'; const o = JSON.parse(fs.readFileSync(f));
Object.assign(o, {
  J4: { verdict: 'INCONCLUSIVE', note: 'A field could not be created from the custom data type through the field API (POST /modules/{id}/fields with datatypeKey "qa_mf_code" → 400), so "delete a data type that is in use" could not be set up. The unused custom type deleted fine (204). Check whether the builder can add a field of a custom type.' },
  K7: { verdict: 'PASS', note: 'Admin hid Social; the agent\'s own setting stays {"order":[],"hidden":[]} (resolved_from Default) and Social stays in the agent\'s bar — the arrangement is per user (setting general.user.desk.nav_tabs, scope User). Zoho lets the admin set it for everyone: gap Z8.' },
  K10: { id: 'K10', verdict: 'NOT RUN', note: 'two-browser-tab tab ordering not automated' },
  L7: { verdict: 'FAIL', severity: 'Low', note: 'Arabic UI switches to RTL and most labels are translated, but on Setup → Modules and Fields → module page "Create New Layout" and "Design your own layouts to fit your business processes…" stay in English (hard-coded strings). Language set back to English afterwards (verified ltr after reload).', shot: 'screenshots/L7-arabic-module-page.png' },
  L9: { verdict: 'FAIL', severity: 'Low', note: 'Layout builder has 2 visible buttons with no accessible name: the Module Image on/off switch (role=switch, no aria-label) and an icon-only button (svg only). Other controls are named (Field options, Section settings, Layout settings, Back to module, Move X up).' },
  'E2E-1': { verdict: 'FAIL', severity: 'Medium', note: 'A lookup from QA MF Devices to Contacts (qa_lk, related-list title "QA MF Devices") is created, but GET /modules/{Contacts}/related-modules does not list QA MF Devices (Tickets, Calls, Events… are listed), so the related list would not appear on contacts. Created through the same field API the builder uses; linking a real contact was not done (no contact records; Contacts sync with CRM).' },
  'E2E-2': { verdict: 'INCONCLUSIVE', note: 'needs a Desk-only agent account (see SEC-1)' }
});
const Z = {
  Z1: 'Layout rules — Desk module page shows only Layouts, Fields, Workflow Rules, Summary (E1); the row-menu "Set Validation Rules"/"Map Dependency Fields" items do nothing (B8); builder "Create Layout Rule" exists but greyed for single line', Z2: 'Validation rules — no tab; row-menu item dead (B8); only per-field regex exists and it is not enforced server-side (I25)',
  Z3: 'Picklist values per layout — values are stored on the field (datatypeOptions.allowed_values), shared by every layout', Z4: 'Help Center access per field — Field Properties has GENERAL / VALIDATION / PERMISSIONS / ADVANCED only, no Help Center setting',
  Z5: 'Nested and colour-coded picklists — pick-list ADVANCED tab has Options + Quick-create triggers only (screenshot 37)', Z6: 'Field encryption / ePHI — no such property',
  Z7: 'Ticket number format — Ticket Number is a read-only single line (not an auto-number field)', Z8: 'Admin-set tab bar — Organize Tabs is per user (K7, setting scope User)',
  Z9: 'Rename any tab — no Rename Tabs page; module list holds only record modules', Z10: 'Search Fields — no setting anywhere in Customization',
  Z11: 'Standard fields protected — seeded fields marked custom (F3) and flagged deletable', Z12: 'Department-specific layouts — layouts are per profile only; tenant has 0 departments',
  Z13: 'Missing standard fields — Category, Sub Category, Annual Revenue, Products Department, Remind fields absent (F4–F6)', Z14: 'Picklist tools — no bulk add, sort, Replace Values in the field menu (screenshots 36, 37)',
  Z15: 'Rounding options — currency field ADVANCED has Currency Symbol and Auto-fill only (screenshot 43)', Z16: 'Lookup options — Lookup Module, Display Field, Related List Title, multi-module only (screenshot 38)',
  Z17: 'Layout Help Center settings — layout list columns Name/Shared To/Last Modified/Status; new layout has no description or Help Center options', Z18: 'Ticket Status page — statuses are plain options of the Status field (screenshot 40)',
  Z19: 'Agents module — not in Modules and Fields (9 modules, no Agents)'
};
for (const [id, note] of Object.entries(Z)) o[id] = { id, verdict: 'MISSING', gap: id, note: 'Retest when built. Today: ' + note + '.' };
fs.writeFileSync(f, JSON.stringify(o, null, 1));
