// Writes the evidence configs (one per gap group) into configs/. Run: node make-configs.js, then node make-evidence.js configs/<file>.json
const fs = require('fs');
const path = require('path');
const D = '18 Oct 2026';
const T = (img, caption, boxes) => ({ side: 'TAVI', caption, img: '../originals/tavi/' + img, boxes });
const Z = (img, caption, boxes) => ({ side: 'Zoho', caption, img: '../originals/zoho/' + img, boxes });
const TT = (caption, text, flag) => ({ side: 'TAVI', caption, text, flag });
const ZT = (caption, text, sources) => ({ side: 'Zoho', caption, text, sources, flag: 'DOCS ONLY — not seen on screen' });

const cfgs = {
  '01-import-automation': {
    id: 'Items 1–2', title: 'Import: which automations an import can start', verdict: 'Gap',
    panels: [
      TT('Import wizard → step "Assign & approve" (text from the build)', [
        'Automation — [ ] Trigger workflow rules',
        '"Run your workflow rules on the imported records. Off by default — a bulk import is a pure data load. Owner assignment from the chosen rule runs regardless."',
        'Manual Record Approval — [ ] Enable manual approval — "Coming soon"'],
        'TEXT FROM THE BUILD — the wizard was not opened, because opening it starts an import session on the tenant'),
      ZT('Import → "Trigger automation and process management" (official help)', [
        'One checkbox, "Trigger automation and process management for imported records", runs Workflow rules, Approval process, Review process, Blueprint and CommandCenter on created or updated records (files under 10,000 rows).',
        '"Enable Manual Lead Approval": imported records wait in Approve Leads; owner assignment and rules run after approval.'],
        ['https://help.zoho.com/portal/en/community/topic/execute-automation-and-other-processes-during-import',
         'https://help.zoho.com/portal/en/kb/crm/data-administration/import-data/articles/import-data-into-a-crm-module'])],
    rows: [
      { n: '1', b: 'What an import can trigger (item 1)', zoho: 'Workflow + Approval + Review + Blueprint + CommandCenter (docs)', tavi: 'Only "Trigger workflow rules" (build text). Whether approval or blueprint also start on import is tested in the spec (Z1)', match: 'Gap' },
      { n: '2', b: 'Manual approval of imported records (item 2)', zoho: 'Enable Manual Lead Approval (docs)', tavi: '"Coming soon" (build text)', match: 'Gap' }],
    notes: ['Assignment rule on import: both offer one rule for new records — same as Zoho.'],
  },
  '02-workflow-triggers': {
    id: 'Item 3', title: 'Workflow rules: what can start a rule', verdict: 'Gap',
    panels: [
      T('tavi-wf-trigger.png', 'Workflow rule AEX-01 → WHEN opened (not saved)', [{ n: 1, x: 389, y: 281, w: 854, h: 153 }]),
      Z('z-wf-trigger.png', 'Workflow Rules → Create Rule → "Execute this workflow rule based on" (not saved)', [{ n: 1, x: 439, y: 259, w: 211, h: 62 }, { n: 2, x: 439, y: 324, w: 211, h: 58 }])],
    rows: [
      { n: '1', b: 'Record action / Date-time', zoho: 'Record action, Date/Time field (seen)', tavi: 'A Record Action (Create, Edit, Create or Edit, Delete, Field Changed), A Date-Time field (seen)', match: 'Same as Zoho' },
      { n: '2', b: 'Score and Notes triggers (item 3)', zoho: 'Record Score, Record Notes (seen)', tavi: 'Not offered (seen). A score trigger exists in the code but is not shown', match: 'Gap' }],
  },
  '03-workflow-actions': {
    id: 'Item 4', title: 'Workflow rules: instant action types', verdict: 'Gap',
    panels: [
      T('tavi-wf-add-action.png', 'Workflow rule AEX-01 → Add action menu (not saved)', [{ n: 0, x: 381, y: 592, w: 472, h: 322 }]),
      Z('z-wf-actions.png', 'Workflow rule (Leads) → Instant Actions → Activities (not saved)', [{ n: 1, x: 396, y: 696, w: 154, h: 58 }, { n: 2, x: 180, y: 778, w: 222, h: 28 }, { n: 3, x: 180, y: 720, w: 222, h: 28 }])],
    rows: [
      { n: '0', b: 'Actions TAVI offers', zoho: '—', tavi: 'Owner Assignment, Webhook, Email, Task, Create Record, Add Tags, Remove Tags, Send portal access (seen)', match: 'Not comparable' },
      { n: '1', b: 'Add Meeting / Schedule a Call', zoho: 'Under Activities (seen)', tavi: 'Not offered (seen)', match: 'Gap' },
      { n: '2', b: 'Function', zoho: 'Function (seen)', tavi: 'Not in the menu (seen). The code has a "Custom Function" type that is never offered', match: 'Gap' },
      { n: '3', b: 'Create Connected Record', zoho: 'Offered (seen)', tavi: 'Not offered (seen)', match: 'Gap' }],
    notes: ['Field Update does not show in this menu on AEX-01, which already has one field update, while Email and Task (also already used) still show. Spec case C-14 checks the per-rule action limits.'],
  },
  '04-owner-assignment': {
    id: 'Item 5', title: 'Workflow "Assign Owner" action — link to assignment rules', verdict: 'Gap',
    panels: [
      T('tavi-wf-owner-assignment-open.png', 'Workflow rule AEX-01 → Add action → Owner Assignment (not saved)', [{ n: 1, x: 394, y: 876, w: 280, h: 52 }]),
      Z('z-wf-assignowner.png', 'Workflow rule (Leads) → Instant Actions → Assign Owner (not saved)', [{ n: 1, x: 463, y: 240, w: 166, h: 22 }, { n: 2, x: 463, y: 318, w: 526, h: 22 }, { n: 3, x: 463, y: 384, w: 596, h: 102 }])],
    rows: [
      { n: '1', b: 'Assign by an assignment rule', zoho: '"Assignment Rules" option (seen)', tavi: 'Only Users, Org Units, Profiles, User Fields (seen)', match: 'Gap' },
      { n: '2', b: 'Online users only / email the new owner', zoho: 'Both check boxes (seen)', tavi: 'Not offered (seen)', match: 'Gap' },
      { n: '3', b: 'Transfer related records to the new owner', zoho: 'Choose items (seen)', tavi: 'Not offered (seen)', match: 'Gap' }],
    notes: ['This is how Zoho re-runs assignment after create: assignment rules themselves only run on create (import, web form, API).'],
  },
  '05-review-functions': {
    id: 'Item 6', title: 'Review process: actions on submit / review / reject', verdict: 'Gap',
    panels: [
      T('tavi-rp-actions.png', 'Review process RVW-019 → ACTIONS (not saved)', [{ n: 1, x: 502, y: 733, w: 896, h: 280 }]),
      Z('z-rp-actions.png', 'Review Processes → New → ACTIONS (not saved)', [{ n: 1, x: 189, y: 556, w: 326, h: 140 }, { n: 2, x: 189, y: 700, w: 166, h: 52 }])],
    rows: [
      { n: '1', b: 'Notifications and SLA escalation', zoho: 'On submission, on completion, on rejection, SLA escalation (seen)', tavi: 'On submission, on completion (rejection is always sent), SLA escalation, purge after 30–365 days (seen)', match: 'Same as Zoho' },
      { n: '2', b: 'Functions on review events (item 6)', zoho: '"Functions — + Add Function" (seen)', tavi: 'Not offered (seen). The API object has a webhookUrl field with no screen', match: 'Gap' }],
  },
  '06-approval-anyone-everyone': {
    id: 'Item 7', title: 'Approval process: Role / Group approvers — Anyone or Everyone', verdict: 'Gap',
    panels: [
      T('tavi-ap-level2.png', 'Approval process AP → Who should approve → Add level (not saved)', [{ n: 1, x: 322, y: 499, w: 266, h: 32 }]),
      Z('z-ap-role.png', 'Create Approval Process → Add Approval Stage → Role (not saved)', [{ n: 1, x: 297, y: 500, w: 538, h: 32 }])],
    rows: [
      { n: '1', b: 'Who in the role or group must approve', zoho: 'Approver type + value + "Anyone" / "Everyone" (seen); Everyone can be sequential or parallel (docs)', tavi: 'Approver type + value only (seen). No Anyone / Everyone, no sequential / parallel', match: 'Gap' }],
    notes: ['Approver types match Zoho: Users, Role, Group(s), Levels, Manager, Record Owner, User Lookup Field. Rejection actions match Zoho too (Update fields, Email, Webhooks, Functions).'],
  },
  '07-approval-functions': {
    id: 'Item 8', title: 'Approval process: "Call Functions" does nothing', verdict: 'Gap',
    panels: [
      TT('Approval process → Action(s) upon Approval / Rejection → Call Functions (text from the build)', [
        '"Call Function is saved for parity and runs as a no-op in this version."'],
        'TEXT FROM THE BUILD — the note shows inside the Call Functions form'),
      Z('z-ap-scroll1.png', 'Create Approval Process → Final Actions (not saved)', [{ n: 1, x: 290, y: 834, w: 416, h: 32 }, { n: 2, x: 823, y: 794, w: 416, h: 32 }])],
    rows: [
      { n: '1', b: 'Function on final approval', zoho: 'Functions (seen)', tavi: 'Can be added, but runs as a no-op (build text)', match: 'Gap' },
      { n: '2', b: 'Function on rejection', zoho: 'Functions (seen)', tavi: 'Can be added, but runs as a no-op (build text)', match: 'Gap' }],
  },
  '08-blueprint-after': {
    id: 'Item 9', title: 'Blueprint: actions after a transition', verdict: 'Gap',
    panels: [
      T('tavi-bp-After.png', 'Blueprint RVW-008 → transition → After (not saved)', [{ n: 0, x: 1177, y: 533, w: 407, h: 160 }]),
      Z('z-bp-after.png', 'Blueprint "Lead nurturing process" → transition → AFTER (not saved)', [{ n: 1, x: 1130, y: 612, w: 106, h: 28 }, { n: 2, x: 1130, y: 741, w: 161, h: 28 }, { n: 3, x: 1130, y: 784, w: 78, h: 28 }, { n: 4, x: 1130, y: 655, w: 171, h: 28 }])],
    rows: [
      { n: '0', b: 'Actions TAVI offers', zoho: '—', tavi: 'Field update, Send email, Notification, Create task, Meeting, Call, Webhook (seen)', match: 'Not comparable' },
      { n: '1', b: 'Convert (Leads)', zoho: 'CONVERT (seen)', tavi: 'Not offered (seen)', match: 'Gap' },
      { n: '2', b: 'Custom actions / functions', zoho: 'CUSTOM ACTIONS (seen)', tavi: 'Not offered (seen)', match: 'Gap' },
      { n: '3', b: 'Tags', zoho: 'TAGS (seen)', tavi: 'Not offered after a transition (seen); offered During', match: 'Gap' },
      { n: '4', b: 'Create record', zoho: 'CREATE RECORD (seen)', tavi: 'Not in this list (seen), although the build has a "Create record" after-action', match: 'Differs' }],
  },
};

const dir = path.join(__dirname, 'configs');
for (const [k, c] of Object.entries(cfgs)) {
  c.out = '../' + k + '-vs-zoho.png';
  c.date = D;
  fs.writeFileSync(path.join(dir, k + '.json'), JSON.stringify(c, null, 1));
}
console.log(Object.keys(cfgs).length, 'configs');
