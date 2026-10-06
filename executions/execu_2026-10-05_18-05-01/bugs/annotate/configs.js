// Annotated failure evidence (TAVI left, live Zoho right). Run: node configs.js → writes one JSON per failure, then make-evidence.js renders them.
const fs = require('fs'); const path = require('path');
const T = f => `../../browser-sessions/mfadmin-180501-9c45/screenshots/${f}`;
const Z = f => `../../../../docs/desk-modules-fields/evidence/originals/zoho/${f}`;
const B = (n, x, y, w, h) => ({ n, x, y, w, h });
const C = {
  B2: { title: 'Module list "Last Modified" shows "UN" instead of a person', verdict: 'Differs', panels: [
    { side: 'TAVI', caption: 'Setup → Modules and Fields', img: T('B2-last-modified-UN.png'), boxes: [B(1, 895, 238, 130, 480)] },
    { side: 'Zoho', caption: 'Modules and Tabs → Manage Modules', img: Z('03-modules-and-tabs.png'), boxes: [B(1, 915, 236, 440, 430)] }],
    rows: [{ n: '1', b: 'Who last changed a seeded module', zoho: 'LAST MODIFIED BY / TIME shown as "-" for untouched standard modules', tavi: 'Orange "UN" (unknown) avatar on all 9 rows; API lastModifiedByName is empty (seeded by a system user)', match: 'Differs' }],
    notes: ['Severity Low. Same cause shows "Created By —" on the module Summary (E2).'] },
  B7: { title: 'Web Tabs placeholder in Desk says "inside the CRM"', verdict: 'Differs', panels: [
    { side: 'TAVI', caption: 'Setup → Modules and Fields → Web Tabs', img: T('B7-web-tabs-says-CRM.png'), boxes: [B(1, 600, 316, 350, 40), B(2, 712, 380, 125, 32)] },
    { side: 'Zoho', caption: 'Setup landing — Customization', img: Z('02-setup-landing.png'), boxes: [B(3, 25, 560, 268, 405)] }],
    rows: [{ n: '1', b: 'Wording on a Desk page', zoho: 'n/a', tavi: '"Embed external URLs as tabs inside the CRM…" — Desk page reuses CRM text', match: 'Differs' },
      { n: '2', b: 'Web Tabs / Global Sets', zoho: 'Not in Zoho Desk Customization (Buttons, Modules and Tabs, Layouts and Fields, …)', tavi: '"In Development" placeholders', match: 'TAVI extra' },
      { n: '3', b: 'Customization menu', zoho: 'No Web Tabs or Global Sets entries (seen)', tavi: 'Two placeholder tabs on the module list', match: 'Not comparable' }],
    notes: ['Severity Low. Same family as B10 "Set up your CRM".'] },
  B8: { title: 'Standard modules offer Delete; five row-menu items do nothing', verdict: 'Differs', panels: [
    { side: 'TAVI', caption: 'Modules and Fields → Tickets row menu → Delete', img: T('B8-Delete.png'), boxes: [B(1, 417, 258, 447, 205)] },
    { side: 'Zoho', caption: 'Modules and Tabs → Manage Modules (no row actions)', img: Z('03-modules-and-tabs.png'), boxes: [B(1, 240, 268, 1360, 400)] }],
    rows: [{ n: '1', b: 'Delete a standard module', zoho: 'No delete action; clicking a module opens its edit form (seen). Docs: even custom modules cannot be deleted', tavi: 'Row menu "Delete" opens "Delete \\"Tickets\\"? … Delete module"; only the has-records rule stops it (cancelled with Escape)', match: 'Differs' },
      { n: '—', b: 'Set Validation Rules, Map Dependency Fields, Button, Links, Assignment Rules (row menu)', zoho: 'Validation Rules / Field Dependencies are real pages under Layouts and Fields', tavi: 'Only add ?tab=… to the URL; page stays on Layouts because Desk hides those tabs', match: 'Differs' }],
    notes: ['Severity Medium. No module was changed: Tickets still active, rowVersion 1.'] },
  B10: { title: 'Desk Setup sidebar says "Set up your CRM"', verdict: 'Differs', panels: [
    { side: 'TAVI', caption: 'Setup sidebar', img: T('B10-setup-your-crm.png'), boxes: [B(1, 70, 150, 187, 34)] },
    { side: 'Zoho', caption: 'Setup landing', img: Z('02-setup-landing.png'), boxes: [B(1, 25, 60, 110, 30)] }],
    rows: [{ n: '1', b: 'Product wording in Setup', zoho: '"Setup" — Desk wording only (seen)', tavi: '"Set up your CRM" shortcut in the Desk Setup sidebar', match: 'Differs' }],
    notes: ['Severity Low.'] },
  D9: { title: 'Layout builder → Rename Module crashes the page', verdict: 'Differs', panels: [
    { side: 'TAVI', caption: 'QA MF Devices layout builder → gear → Rename Module', img: T('D9-rename-module-builder.png'), boxes: [B(1, 470, 330, 420, 120)] },
    { side: 'Zoho', caption: 'Manage Modules → Edit Tickets (rename form)', img: Z('04-module-tickets-detail.png'), boxes: [B(1, 230, 50, 1360, 560)] }],
    rows: [{ n: '1', b: 'Rename a module', zoho: 'Edit form with Module Name (Plural)*, (Singular)*, Description, Save (seen; not saved)', tavi: '"Something went wrong — Cannot read properties of undefined (reading \'trim\')"; reproduced on Tickets 2/2 and on the QA module', match: 'Differs' }],
    notes: ['Severity Medium. The module-list row menu → Rename works (D1); only the builder entry point crashes.'] },
  L7: { title: 'Arabic UI leaves English text on the module page', verdict: 'Differs', panels: [
    { side: 'TAVI', caption: 'Arabic UI — Setup → Modules and Fields → QA MF Devices', img: T('L7-arabic-module-page.png'), boxes: [B(1, 232, 194, 760, 24), B(2, 36, 242, 186, 40)] },
    { side: 'Zoho', caption: 'not captured', text: ['Zoho Desk in Arabic was not opened in this run, so the Zoho side is not checked.', 'Expected (spec L7): every string on the page translated and mirrored for RTL.'] }],
    rows: [{ n: '1', b: 'Page description', zoho: 'Not checked', tavi: '"Design your own layouts to fit your business processes…" stays English', match: 'Not checked' },
      { n: '2', b: 'Primary button', zoho: 'Not checked', tavi: '"Create New Layout" stays English (tabs, table headers and sidebar are Arabic)', match: 'Not checked' }],
    notes: ['Severity Low. Hard-coded strings in the module-builder bundle; language set back to English after the check.'] }
};
let i = 0;
for (const [id, c] of Object.entries(C)) { i++; fs.writeFileSync(path.join(__dirname, id + '.json'), JSON.stringify({ out: `../screenshots/annotated/${id}-vs-zoho.png`, id: `${id} (FAIL)`, date: '5–6 Oct 2026', ...c, noShot: {} }, null, 1)); }
console.log('configs', i);
