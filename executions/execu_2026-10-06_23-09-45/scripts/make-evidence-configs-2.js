// Annotated evidence for the 5 bugs that only had plain screenshots: MF-01 (run 1), MF-02, MF-10, MF-11, MF-41 (run 2).
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const Z = path.join(ROOT, 'docs/desk-modules-fields/evidence/originals/zoho/');
const date = '7 Oct 2026';
const write = (dir, f, cfg) => { fs.mkdirSync(dir, { recursive: true }); const p = path.join(dir, f + '.json'); const rel = x => path.relative(dir, x).split(path.sep).join('/');
  cfg.panels = cfg.panels.map(pn => pn.img ? { ...pn, img: rel(pn.img) } : pn); fs.writeFileSync(p, JSON.stringify({ out: '../' + f + '-vs-zoho.png', date, id: f, ...cfg }, null, 1)); return p; };
const R1 = path.join(ROOT, 'executions/execu_2026-10-05_18-05-01'), R2 = path.join(ROOT, 'executions/execu_2026-10-06_23-09-45');
const out = [];
out.push(write(path.join(R1, 'bugs/screenshots/annotated/configs'), 'SEC-1', { title: 'MF-01 A CRM Admin profile gives module and field administration inside Desk', verdict: 'Bug',
  panels: [{ side: 'TAVI', caption: 'Desk Agent (+ CRM Admin in CRM) opens Setup → Modules and Fields', img: path.join(R1, 'browser-sessions/mfadmin-180501-9c45/screenshots/A2-agent-modules-and-fields.png'), boxes: [{ n: 1, x: 1220, y: 8, w: 46, h: 42 }, { n: 2, x: 292, y: 185, w: 963, h: 535 }, { n: 3, x: 1073, y: 135, w: 168, h: 36 }] },
    { side: 'Zoho', caption: 'Agent profile (docs)', text: ['Only users whose profile has the "Customize" / Setup permission can open Modules and Tabs or Layouts and Fields. An Agent profile cannot.'], sources: ['help.zoho.com/portal/en/kb/desk/user-management-and-security/profiles'] }],
  rows: [{ b: 'Signed-in user (1)', zoho: 'Agent profile', tavi: 'Desk Agent in Desk, CRM Admin in CRM', match: 'Not comparable' }, { b: 'Modules and Fields page (2)', zoho: 'Not available to agents', tavi: 'Full module table shown', match: 'Differs' }, { b: 'Create New Module (3)', zoho: 'Not available to agents', tavi: 'Button shown and usable', match: 'Differs' }],
  notes: ['GET /api/v1/iam/me/permissions (x-app-key desk) returns CRM Admin metadata permissions such as metadata.modules.manage.'] }));
out.push(write(path.join(R2, 'bugs/screenshots/annotated/configs'), 'H10', { title: 'MF-02 Profiles chosen in the Create Module dialog are not applied', verdict: 'Bug',
  panels: [{ side: 'TAVI', caption: 'Desk Agent inside "QA MF Closed" (created for Desk Administrator only)', img: path.join(R2, 'browser-sessions/mfagent-230945-b20f/screenshots/H10-agent-closed-module.png'), boxes: [{ n: 1, x: 10, y: 72, w: 240, h: 44 }, { n: 2, x: 268, y: 116, w: 980, h: 64 }, { n: 3, x: 1218, y: 8, w: 48, h: 42 }] },
    { side: 'Zoho', caption: 'New module form: who can use the module', img: Z + '05-new-module-form.png' }],
  rows: [{ b: 'Module Permission = Desk Administrator only', zoho: 'Other profiles cannot open it', tavi: 'Agent (3) sees the module (1)', match: 'Differs' }, { b: 'Agent creates a record', zoho: 'Not possible', tavi: '"QA MF agent in closed" created (2)', match: 'Differs' }],
  notes: ['The dialog sends PUT /api/v1/modules/{id}/permissions, which returns 404; no error is shown.'] }));
out.push(write(path.join(R2, 'bugs/screenshots/annotated/configs'), 'H4', { title: 'MF-10 A required field can be set to "Don\'t Show"', verdict: 'Bug',
  panels: [{ side: 'TAVI', caption: 'Field Permissions: Desk Agent, required field Name set to Don\'t Show', img: path.join(R2, 'browser-sessions/mfowner-230945-b20f/screenshots/S3-field-permissions-agent.png'), boxes: [{ n: 1, x: 307, y: 259, w: 159, h: 34 }, { n: 2, x: 293, y: 346, w: 962, h: 57 }, { n: 3, x: 963, y: 640, w: 292, h: 54 }] },
    { side: 'Zoho', caption: 'Field Permissions', img: Z + '16-field-permissions.png' }],
  rows: [{ b: 'Profile (1)', zoho: 'Agent', tavi: 'Desk Agent', match: 'Same as Zoho' }, { b: 'Mandatory field set to hidden (2)', zoho: 'Not allowed for mandatory fields', tavi: 'Allowed', match: 'Differs' }, { b: 'Save (3)', zoho: '—', tavi: '"3 field permissions updated"; agents then get 422 on every create', match: 'Differs' }], notes: [] }));
out.push(write(path.join(R2, 'bugs/screenshots/annotated/configs'), 'MF-11-picker', { title: 'MF-11 Access Control picker lists CRM users and profiles', verdict: 'Bug',
  panels: [{ side: 'TAVI', caption: 'Access Control → Select principals (list loaded from /iam/users?app_key=crm)', img: path.join(R2, 'browser-sessions/mfowner-230945-b20f/screenshots/A8-selected-users.png'), boxes: [{ n: 1, x: 148, y: 178, w: 82, h: 34 }, { n: 2, x: 148, y: 220, w: 470, h: 380 }, { n: 3, x: 660, y: 178, w: 472, h: 76 }] },
    { side: 'Zoho', caption: 'Layout permissions (docs)', text: ['A layout is assigned to Zoho Desk profiles (for example Agent, Light Agent, Administrator), so each profile sees only its layouts.'], sources: ['help.zoho.com/portal/en/kb/desk/customize-zoho-desk/layouts-and-fields'] }],
  rows: [{ b: 'Principal kind (1)', zoho: 'Desk profiles', tavi: 'Users / Profiles / Org units', match: 'Differs' }, { b: 'Available list (2)', zoho: 'Desk agents and Desk profiles', tavi: 'CRM users; Profiles = CRM Admin, Manager, Supervisor, test, User; Desk agent not found', match: 'Differs' }, { b: 'Selected (3)', zoho: '—', tavi: 'Only the owner could be chosen', match: 'Not comparable' }], notes: [] }));
out.push(write(path.join(R2, 'bugs/screenshots/annotated/configs'), 'I3', { title: 'MF-41 The 512-fields-per-layout limit is not enforced by the API', verdict: 'Bug',
  panels: [{ side: 'TAVI', caption: 'Builder of QA MF Limit after the API saved 550 fields on its layout', img: path.join(R2, 'browser-sessions/mfowner-230945-b20f/screenshots/I3-limit-builder.png'), boxes: [{ n: 1, x: 470, y: 656, w: 340, h: 40 }, { n: 2, x: 814, y: 504, w: 433, h: 216 }] },
    { side: 'Zoho', caption: 'Field limits (docs)', text: ['Zoho Desk allows up to 230 custom fields per module; the limit is enforced when adding fields.'], sources: ['help.zoho.com/portal/en/kb/desk/customize-zoho-desk/layouts-and-fields'] }],
  rows: [{ b: 'Builder limit (1)', zoho: 'Limit enforced', tavi: '"Maximum of 512 fields per layout reached."', match: 'Same as Zoho' }, { b: 'API layout save with 550 fields (2)', zoho: 'Refused', tavi: '200 — 550 fields on one layout', match: 'Differs' }], notes: [] }));
console.log(out.map(p => path.relative(ROOT, p)).join('\n'));
