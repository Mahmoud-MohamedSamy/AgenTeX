// Writes one evidence config per gap into configs/. Run: node make-configs.js, then node make-evidence.js configs/<file>.json for each.
const fs = require('fs'), path = require('path');
const T = '../originals/tavi/', Z = '../originals/zoho/', date = '18 Oct 2026';
const items = [
  { f: '01-products-sync', id: 'Item 1', title: 'Products sync (department scope, customer associations, field mapping)', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'CRM → Settings → CRM ⇄ Desk Integration → Configuration Details', img: T + 't01-crm-config.png', boxes: [{ n: 1, x: 383, y: 265, w: 1102, h: 250 }] },
      { side: 'Zoho', caption: 'Desk → Setup → Zoho → Zoho CRM → Configuration Details', img: Z + '04-desk-configuration-details.png', boxes: [{ n: 1, x: 281, y: 478, w: 1260, h: 48 }] },
      { side: 'Zoho', caption: 'Products → Configure (opened, cancelled)', img: Z + '06-desk-products-configure.png', boxes: [{ n: 2, x: 281, y: 262, w: 675, h: 78 }, { n: 3, x: 281, y: 362, w: 470, h: 28 }, { n: 4, x: 281, y: 440, w: 670, h: 412 }] }],
    rows: [
      { b: '1. Products in the sync table', zoho: 'Products row with Configure', tavi: 'Only Contacts, Accounts, Contracts↔Deals, Calls', match: 'Gap' },
      { b: '2. Choose departments whose products sync', zoho: 'Yes (multi-select)', tavi: 'No', match: 'Gap' },
      { b: '3. Also sync product–contact/account links', zoho: 'Checkbox (needs two-way on both)', tavi: 'No', match: 'Gap' },
      { b: '4. Product field mapping, two-way or CRM → Desk', zoho: 'Yes', tavi: 'No', match: 'Gap' }],
    notes: ['NDC-1669 §3 Products sync (P0, Phase 4).', 'No /products route under /desk/integrations/crm (404).'] },
  { f: '02-crm-list-view-scope', id: 'Item 2', title: 'Limit the sync to chosen CRM list views (custom views)', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Configuration Details → Contacts → Edit', img: T + 't02-crm-contacts-edit.png', boxes: [{ n: 1, x: 415, y: 378, w: 1040, h: 120 }] },
      { side: 'Zoho', caption: 'Configure Accounts and Contacts Sync — CRM view picker (opened)', img: Z + '03-desk-crm-list-view-picker.png', boxes: [{ n: 1, x: 612, y: 418, w: 100, h: 26 }, { n: 1, x: 1170, y: 450, w: 222, h: 300 }] }],
    rows: [{ b: '1. Pick which CRM Accounts / Contacts views sync', zoho: 'All Accounts ▾ / All Contacts ▾ (any CRM view)', tavi: 'Direction and field mapping only — every record syncs', match: 'Gap' }],
    notes: ['NDC-1669 §2 List-view scoping (P0, Phase 1).'] },
  { f: '03-secondary-email-match', id: 'Item 3', title: 'Match contacts on the secondary email', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Configuration Details → Contacts → Edit', img: T + 't02-crm-contacts-edit.png', boxes: [{ n: 1, x: 415, y: 378, w: 830, h: 80 }, { n: 2, x: 416, y: 878, w: 1035, h: 36 }] },
      { side: 'Zoho', caption: 'Configure Accounts and Contacts Sync', img: Z + '02-desk-configure-accounts-contacts.png', boxes: [{ n: 1, x: 281, y: 258, w: 330, h: 58 }] }],
    rows: [
      { b: '1. Choose the matching key (Email primary / Secondary)', zoho: 'Two tick boxes', tavi: 'No choice — always primary email', match: 'Gap' },
      { b: '2. Secondary email as a field', zoho: 'Auto-mapped when chosen as key', tavi: 'Mapped as a normal field only', match: 'Differs' },
      { b: 'Overwrite warning when secondary email is the key', zoho: 'Shown (docs)', tavi: 'Not applicable', match: 'Gap' }],
    notes: ['NDC-1669 §2 Secondary email option with overwrite warning (P0, Phase 1).'] },
  { f: '04-delete-if-no-associates', id: 'Item 4', title: 'Delete preference: delete the Desk contact/account only if it has no linked records', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Configuration Details → Preferences', img: T + 't01-crm-config.png', boxes: [{ n: 1, x: 403, y: 660, w: 485, h: 160 }] },
      { side: 'Zoho', caption: 'Preferences → On deleting a CRM contact (opened, not changed)', img: Z + '05-desk-delete-pref-crm-contact-options.png', boxes: [{ n: 1, x: 316, y: 842, w: 340, h: 68 }] }],
    rows: [
      { b: '1. Options when a CRM contact/account is deleted', zoho: 'Always delete · Delete if there are no associates · Never delete', tavi: 'Keep and flag · Keep and unlink · Delete', match: 'Differs' },
      { b: 'Delete only when no tickets/contacts/contracts are linked', zoho: 'Yes', tavi: 'No', match: 'Gap' }],
    notes: ['NDC-1669 §5 lists the three options (P0, Phase 2).', 'TAVI "Keep and flag for review" is extra (not in Zoho).'] },
  { f: '05-crm-pane-fields', id: 'Item 5', title: 'CRM pane on a ticket shows only a fixed set of fields', verdict: 'Differs',
    panels: [
      { side: 'TAVI', caption: 'Desk → ticket #298 → CRM Contact Info', img: T + 't08-desk-ticket-crm-pane.png', boxes: [{ n: 1, x: 370, y: 285, w: 287, h: 410 }] },
      { side: 'Zoho', caption: 'Desk → ticket #101 → CRM Contact Info', img: Z + '14-desk-ticket-crm-info.png', boxes: [{ n: 1, x: 331, y: 200, w: 320, h: 720 }] }],
    rows: [
      { b: '1. Fields shown in the Info tab', zoho: 'All CRM fields of the record, custom fields included (Lead Source, Created/Modified By, Locked, Record Id…)', tavi: '8 fixed fields (name, email, phone, mobile, title, account, owner)', match: 'Differs' },
      { b: 'Admin can choose the fields', zoho: 'Follows the CRM layout', tavi: 'Stored in config (panel.info_fields) but no screen to change it', match: 'Gap' }],
    notes: ['NDC-1669 §7 (P0, Phase 3) asks for the CRM profile in the ticket; the field set is not specified.'] },
  { f: '06-crm-ticket-filters', id: 'Item 6', title: 'Ticket filters on the CRM record: Escalated, Overdue, High priority', verdict: 'Differs',
    panels: [
      { side: 'TAVI', caption: 'CRM → Contact → Desk Tickets (statistics shown)', img: T + 't07-crm-contact-desk-stats.png', boxes: [{ n: 1, x: 316, y: 690, w: 240, h: 34 }] },
      { side: 'Zoho', caption: 'CRM → Contact → Zoho Desk related list → filter (opened)', img: Z + '17-crm-desk-ticket-filters.png', boxes: [{ n: 1, x: 494, y: 655, w: 192, h: 217 }] }],
    rows: [{ b: '1. Filters', zoho: 'All · Open · On Hold · Escalated · Closed · Overdue · High Priority', tavi: 'All · Open · On hold · Closed', match: 'Differs' }],
    notes: ['Not in NDC-1669 (tickets in CRM is a separate CRM-side build).', 'Statistics, New ticket, link to deal, close, update field, delete: built.'] },
  { f: '07-mutual-users-invite', id: 'Item 7', title: 'Mutual users list and "Invite users to Desk" from CRM', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'CRM → Settings → CRM ⇄ Desk Integration → Permissions', img: T + 't03-crm-user-permission.png', boxes: [{ n: 1, x: 383, y: 203, w: 1102, h: 215 }] },
      { side: 'Zoho', caption: 'CRM → Setup → Marketplace → Zoho → Zoho Desk → User & Permission', img: Z + '11-crm-desk-user-permission.png', boxes: [{ n: 1, x: 287, y: 225, w: 210, h: 112 }] }],
    rows: [
      { b: '1. List of users who are in both CRM and Desk', zoho: 'Mutual Users (count + cards)', tavi: 'No', match: 'Gap' },
      { b: 'Invite CRM users to Desk as Agent / Light Agent / Admin', zoho: 'Invite Users (docs)', tavi: 'No', match: 'Gap' },
      { b: 'Ticket visibility setting', zoho: 'Two options', tavi: 'Same two options', match: 'Same as Zoho' }],
    notes: ['NDC-1669 §9 adds CRM users as Light Agents automatically (Phase 4); an invite flow is not mentioned.', 'Invite button not seen live: this Zoho org has only one CRM user.'] },
  { f: '08-crm-contact-type-criteria', id: 'Item 8', title: '"CRM Contact Type" as a condition in SLA and assignment rules', verdict: 'Gap',
    panels: [
      { side: 'TAVI', caption: 'Build check (Desk bundle, 18 Oct 2026)', flag: 'BUILD CHECK — code, not a screen',
        text: ['The CRM classification (won customer / open prospect / contact or lead / not in CRM) is used only by Handshake Mode columns.', 'No rule criteria field for it in SLA, Direct Assignment or Round Robin rules.'] },
      { side: 'Zoho', caption: 'Zoho Desk API — criteriaFields',
        text: ['"CRM Contact Type" is a criteria field (is / is not Customer, Potential, Contact, Lead) for SLA, Direct Assignment and Round Robin rules.'],
        sources: ['https://desk.zoho.com/DeskAPIDocument (sla/criteriaFields, directAssignmentRules/criteriaFields, roundRobinRules/criteriaFields)'] }],
    rows: [{ b: 'Route or set SLA by CRM customer type', zoho: 'Yes', tavi: 'No', match: 'Gap' }],
    notes: ['Not in NDC-1669. Not seen on a Zoho screen — from the API docs.'] },
  { f: '09-permission-defaults', id: 'Item 9', title: 'CRM data permissions: default access and level names', verdict: 'Differs',
    panels: [
      { side: 'TAVI', caption: 'Desk → Settings → CRM ⇄ Desk Integration → Permissions (as connected)', img: T + 't10-desk-permissions.png', boxes: [{ n: 1, x: 395, y: 322, w: 1085, h: 288 }, { n: 2, x: 383, y: 618, w: 745, h: 22 }] },
      { side: 'Zoho', caption: 'Desk → Setup → Zoho CRM → Permissions (as integrated, defaults)', img: Z + '07-desk-permissions.png', boxes: [{ n: 1, x: 296, y: 478, w: 1240, h: 330 }] }],
    rows: [
      { b: '1. Profiles allowed to see CRM data right after connecting', zoho: 'Only the Administrator profile; every other profile unticked (no access)', tavi: 'Every profile ticked with Full Access', match: 'Differs' },
      { b: '2. Profiles not listed / not changed', zoho: 'No access until the admin ticks the profile', tavi: '"Every profile has full access until you change one"', match: 'Differs' },
      { b: 'Name of the middle access level', zoho: 'Restricted Access', tavi: 'Custom Access', match: 'Differs' },
      { b: 'Accounts and Contacts set separately; Information, Potentials, Notes, Activities (pick types)', zoho: 'Yes', tavi: 'Yes', match: 'Same as Zoho' }],
    notes: ['User decision 19 Oct 2026: match how Zoho handles permissions.', 'NDC-1669 §6 (P0, Phase 3) does not state the default.'] },
];
for (const it of items) {
  const c = { out: '../' + it.f + '-vs-zoho.png', date, id: it.id, title: it.title, verdict: it.verdict, panels: it.panels, rows: it.rows, notes: it.notes };
  fs.writeFileSync(path.join(__dirname, 'configs', it.f + '.json'), JSON.stringify(c, null, 1));
}
console.log('configs', items.length);
