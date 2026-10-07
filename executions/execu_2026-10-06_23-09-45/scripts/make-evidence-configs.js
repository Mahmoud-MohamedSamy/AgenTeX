// Writes the annotated-evidence configs for run 2 failures (TAVI left, Zoho right). Render with docs/desk-modules-fields/evidence/make-evidence.js.
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '../bugs/screenshots/annotated/configs/'); fs.mkdirSync(D, { recursive: true });
const R = '../../../../browser-sessions/'; const Z = '../../../../../../docs/desk-modules-fields/evidence/originals/zoho/';
const date = '7 Oct 2026';
const C = [
 { f: 'I27', title: 'Conditional visibility rule is not applied on the record form', verdict: 'Bug',
   panels: [{ side: 'TAVI', caption: 'QA MF Deps form: ctrl = Z, but "QA MF dep" (show only when ctrl = x) is shown and required', img: R + 'mfadminb-230945-b20f/screenshots/I47-form-Z-save.png', boxes: [{ n: 1, x: 946, y: 358, w: 277, h: 44 }, { n: 2, x: 366, y: 416, w: 382, h: 60 }] },
            { side: 'Zoho', caption: 'Layout Rules: show/hide fields from a condition', img: Z + '12-layout-rules.png' }],
   rows: [{ b: 'Field set to show only when the controller = "x"', zoho: 'Hidden until the condition is met', tavi: 'Shown with ctrl = Z (1, 2)', match: 'Differs' }, { b: 'Required only while shown', zoho: 'Not required while hidden', tavi: '"This field is required" with ctrl = Z (2)', match: 'Differs' }],
   notes: ['Rule stored on the layout: visibilityRule {dependsOn: qa_ctrl, equalsAny: ["x"]}.'] },
 { f: 'I47-E2E-2', title: 'Field dependency rules (SHOW / REQUIRE) are saved but not applied', verdict: 'Bug',
   panels: [{ side: 'TAVI', caption: 'Agent saved a Hardware record with no serial: "Record saved successfully"', img: R + 'mfagent-230945-b20f/screenshots/E2E-2-agent-L-Agent.png', boxes: [{ n: 1, x: 330, y: 495, w: 140, h: 40 }, { n: 2, x: 778, y: 495, w: 160, h: 40 }, { n: 3, x: 970, y: 640, w: 285, h: 54 }] },
            { side: 'Zoho', caption: 'Field Dependencies: rules drive the form', img: Z + '15-field-dependencies.png' }],
   rows: [{ b: 'When kind = Hardware → SHOW serial', zoho: 'Serial appears only for Hardware', tavi: 'Serial visible before Hardware is chosen', match: 'Differs' }, { b: 'When kind = Hardware → REQUIRE serial', zoho: 'Save blocked until serial is filled', tavi: 'Saved with serial empty (1, 2, 3); API also 201', match: 'Differs' }],
   notes: ['Same on QA MF Deps (I47): rules SHOW qa_b / REQUIRE qa_c when ctrl = Z are stored (2 rules) but the form and the record API ignore them.', 'I48: deleting the rules in the Field Dependency panel shows "No dependency rules yet", but after Save both rules are still stored.'] },
 { f: 'C4', title: 'Department storage has no effect on records', verdict: 'Bug',
   panels: [{ side: 'TAVI', caption: 'Agent (member of QA MF Dept) sees every record of a Department-storage module', img: R + 'mfagent-230945-b20f/screenshots/C4-agent-dept-module.png', boxes: [{ n: 1, x: 300, y: 70, w: 210, h: 30 }, { n: 2, x: 268, y: 112, w: 980, h: 288 }] },
            { side: 'Zoho', caption: 'New module form: department accessibility', img: Z + '05-new-module-form.png' }],
   rows: [{ b: 'Module created with storage = Department', zoho: 'Records belong to a department', tavi: 'storageScope "department" saved, but records carry no department', match: 'Differs' }, { b: 'Who sees the records', zoho: 'Users of that department', tavi: 'Everyone sees all records (1, 2); department header ignored', match: 'Differs' }],
   notes: ['API: records created with no department, with x-department-id and with department_id all return 201; the list is identical with or without a department.'] },
 { f: 'I23', title: 'Radio and Status fields accept values that are not in their list', verdict: 'Bug',
   panels: [{ side: 'TAVI', caption: 'QA MF Types list: status "Nope" stored and shown (options New, Doing, Done)', img: R + 'mfowner-230945-b20f/screenshots/w3-types-list.png', boxes: [{ n: 1, x: 1128, y: 636, w: 76, h: 32 }] },
            { side: 'Zoho', caption: 'Pick list properties: only listed values', img: Z + '09d-edit-properties-priority.png' }],
   rows: [{ b: 'Record API with radio "R9" and status "Nope"', zoho: 'Refused: not one of the values', tavi: '201, stored and shown (1)', match: 'Differs' }],
   notes: ['Same family as MF-08 (pick list).'] },
 { f: 'H10', title: 'Profiles chosen in the Create Module dialog are not applied', verdict: 'Bug',
   panels: [{ side: 'TAVI', caption: 'Desk Agent opens "QA MF Closed" (created for Desk Administrator only)', img: R + 'mfagent-230945-b20f/screenshots/H10-agent-closed-module.png' },
            { side: 'Zoho', caption: 'New module form: profile/department access', img: Z + '05-new-module-form.png' }],
   rows: [{ b: 'Module Permission = Desk Administrator only', zoho: 'Other profiles cannot open the module', tavi: 'PUT /modules/{id}/permissions → 404; agent lists, reads and creates records', match: 'Differs' }], notes: [] },
 { f: 'H4', title: 'A required field can be set to "Don\'t Show"', verdict: 'Bug',
   panels: [{ side: 'TAVI', caption: 'Field Permissions: Desk Agent, required Name set to Don\'t Show', img: R + 'mfowner-230945-b20f/screenshots/S3-field-permissions-agent.png' },
            { side: 'Zoho', caption: 'Field Permissions', img: Z + '16-field-permissions.png' }],
   rows: [{ b: 'Hide a mandatory field from a profile', zoho: 'Not allowed for mandatory fields', tavi: 'Saved; agents then get 422 "not writable" on every create', match: 'Differs' }], notes: [] },
 { f: 'MF-11-picker', title: 'Access Control picker lists CRM users and profiles', verdict: 'Bug',
   panels: [{ side: 'TAVI', caption: 'Layout Permissions → Select principals (users come from app_key=crm)', img: R + 'mfowner-230945-b20f/screenshots/G10-picker-L-Admin.png', boxes: [{ n: 1, x: 148, y: 338, w: 470, h: 90 }] },
            { side: 'Zoho', caption: 'Layout permissions (docs)', text: ['A layout is assigned to Zoho Desk profiles (for example Agent, Light Agent, Administrator), so each profile sees only its layouts.'], sources: ['help.zoho.com/portal/en/kb/desk/customize-zoho-desk/layouts-and-fields'] }],
   rows: [{ b: 'Profiles offered', zoho: 'Desk profiles', tavi: 'CRM Admin, Manager, Supervisor, test, User; no Desk profile', match: 'Differs' }, { b: 'Users offered', zoho: 'Desk agents', tavi: 'Desk agent mahmoud.mohamed1 not found', match: 'Differs' }], notes: [] },
];
for (const c of C) fs.writeFileSync(D + c.f + '.json', JSON.stringify({ out: '../' + c.f + '-vs-zoho.png', date, id: c.f, title: c.title, verdict: c.verdict, panels: c.panels, rows: c.rows, notes: c.notes }, null, 1));
console.log(C.map(c => c.f).join(' '));
