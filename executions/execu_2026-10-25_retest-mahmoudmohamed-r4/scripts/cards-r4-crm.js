// Writes the API/log evidence cards for round 4 CRM tickets (25–26 Oct 2026). Usage: node cards-r4-crm.js → cards/*.json, then apicard.js each.
const fs = require('fs'); const path = require('path');
const D = '/api/v1/modules/{Deals}';
const DATE = '25–26 Oct 2026';
const C = {
  'NDC-pipeline-blocker.png': { title: 'Staging blocker · Deals Pipeline field only allows "Standard (Standard)" — every pipeline write is refused (NDC-1302 / 1312 / 1316 / 1324)', rows: [
    ['field definition', `GET ${D}/fields → pipeline`, 'datatypeKey pick_list · datatypeOptions {"allowed_values":["Standard (Standard)"]} · lastModified 2026-10-24T15:54:43Z by ndc-staging-owner', 'info'],
    ['create on "1" / test-01', `POST ${D}/records {pipeline:"640e03a4…" (pipeline "1"), stage:"test-01"}`, '422 PICKLIST_VALUE_INVALID "Pipeline: \'640e03a4-…\' is not one of the allowed values (Standard (Standard))."', 'bad'],
    ['move existing deal to "1"', `PATCH ${D}/records/{id} {pipeline:"640e03a4…", stage:"test-01"}`, '422 — same message; deal stays on Standard', 'bad'],
    ['mass update 2 deals → "1"', `POST ${D}/records/mass-update {2 ids, pipeline:"640e03a4…", stage:"test-02"}`, '422 — same message; dialog stays open with no message or toast; both deals still Standard / qualification', 'bad'],
    ['create on default Standard (id)', `POST ${D}/records {pipeline:"5170500c…" (Standard)}`, '422 "…\'5170500c-…\' is not one of the allowed values (Standard (Standard))"', 'bad'],
    ['create with "Standard" text', `POST ${D}/records {pipeline:"Standard"}`, '422 — refused as well', 'bad'],
    ['UI create, default Standard', 'Create Transactions → Pipeline Standard (Default) → Save', 'POST 422 — same message under the Pipeline field (deal-ui-default-save.png)', 'bad'],
    ['create without pipeline', `POST ${D}/records (no pipeline key)`, 'only way a deal can be created now — pipeline fixes cannot be judged until the field is repaired', 'info']] },
  'NDC-1337-api.png': { title: 'NDC-1337 · field permissions — automation run + restricted-user write checks', rows: [
    ['automation -Dtags=NDC-1337', 'FieldPermissionTest (25 Oct ~23:45)', 'PASS hiddenFieldNotReturned · hiddenFieldNotWritable · listHidesHiddenField · readOnlyFieldNotWritable', 'ok'],
    ['automation', 'FieldPermissionTest.transactionsFieldPermissions', 'FAIL — creating its test deal hits the Pipeline-field 422 (staging blocker), not a permission defect', 'info'],
    ['automation', 'RestrictedUserUiTest', '2 SKIP + 2 config failures — credentials CSV missing (environment)', 'info'],
    ['layout-builder route', 'Leads layout "test" → QA RT FP → Set Permission → profile "test" Read cleared → Apply → Save', 'field-permissions: profile 64d4aae0 ("test") hidden for qa_rt_fp', 'ok'],
    ['test user 2: hidden write', 'POST /modules/{Leads}/records {…, qa_rt_fp:"x"}', '422 FIELD_PERMISSION_DENIED "Field \'qa_rt_fp\' is hidden for your profile and cannot be written."', 'ok'],
    ['test user 2: control', 'POST /modules/{Leads}/records (without qa_rt_fp)', '201 — lead "QA RT 1337 u2 plain" created', 'ok']] },
  'NDC-1335-api.png': { title: 'NDC-1335 · layout save requests (Leads)', rows: [
    ['existing layout "test"', 'Module Image off → Save', 'PUT /fields/… ×5 → 200 · PUT /layouts/6261fa51 → 200 · toasts "Field updated successfully", "Layout updated successfully" · no Subform error (save took 46 s)', 'ok'],
    ['after save', 'Cancel', 'no unsaved-changes prompt · moduleImageEnabled false stored', 'ok'],
    ['new layout (predefined only)', 'Create New Layout → Basic Information (Name, Created By, Modified By) → Save', 'PUT /fields/5dd25be0 ("Subform", 0 subfields, only on layout "فاتورة") → 422 DATATYPE_SUBFORM_NO_SUBFIELDS · layout not created', 'bad'],
    ['observation', 'Save before the builder finished loading "test"', 'created a NEW layout "Standard Layout" dff47b4e instead of updating "test" (deleted in cleanup)', 'info']] },
  'NDC-1693-api.png': { title: 'NDC-1693 · Create New Module requests', rows: [
    ['CRM Teamspace', 'POST /teamspaces/5ea90671/modules {label:"QA RT Module 1693", key:"qa_rt_module_1693"}', '201 — dialog closes, module listed', 'ok'],
    ['New Teamspace', 'POST /teamspaces/{New Teamspace}/modules {label:"QA RT Module 1693 b"}', '201', 'ok'],
    ['duplicate key', 'POST …/modules {key:"qa_rt_module_1693"} again', '409 MODULE_ALREADY_EXISTS "Module key already exists in this organization." — no 500', 'ok'],
    ['cleanup', 'DELETE modules ef70c152, c56f2e10', 'removed', 'info']] },
  'NDC-1344-api.png': { title: 'NDC-1344 · Audit Log "All Entities" filter — full list review (58 options)', rows: [
    ['duplicates', 'Workflow rule / Rule, Approval process / Process, Blueprint ×3, Profile ×2 (21 Oct)', 'none left — each entity once; module block not repeated', 'ok'],
    ['new modules', 'QA RT Module 1693, QA RT Module 1693 b', 'listed by key "qa_rt_module_1693", "qa_rt_module_1693_b" — other modules show labels', 'bad'],
    ['foreign entries', 'GET /modules (this CRM)', '"23c1a6s8d46a" and "Test" listed among module records but are not modules of this CRM', 'bad'],
    ['internal names', 'entity list', '"Mail agent signature row", "Module view pin" still internal-style', 'bad'],
    ['feed label', 'delete + restore lead "QA RT 1337 u2 plain"', '"mahmoud.mahamed1515 restored a Lead named QA RT 1337 u2 plain" — raw key audit.entity.leads gone', 'ok'],
    ['automation', '-Dtags=NDC-1344', 'tag only in AuditLogTest javadoc — no @Test group; checked by hand', 'info']] },
  'NDC-1593-api.png': { title: 'NDC-1593 · import as restricted user (test user 2, profile "test") — mapping list and server checks', who: 'test user 2 (profile "test" 64d4aae0)', rows: [
    ['permissions set', 'qa_rt_fp hidden (layout builder) · qa_rt_ro (d65bacbf) read_only (POST /field-permissions 200)', 'profile "test" restricted on both fields', 'info'],
    ['hidden field in mapping', 'Import Leads → imp1593.xlsx → layout "test" → Map fields → Field list', '"QA RT FP" not offered in any column\'s list', 'ok'],
    ['read-only in mapping', 'same list', '"QA RT RO (read-only for your profile)" listed but disabled — cannot be chosen', 'ok'],
    ['server: hidden write', 'POST /modules/{Leads}/records {qa_rt_fp:…} as test user 2', '422 FIELD_PERMISSION_DENIED "Field \'qa_rt_fp\' is hidden for your profile and cannot be written."', 'ok'],
    ['not done', 'Submit import', 'wizard left at mapping (restricted fields cannot be mapped, nothing to submit)', 'info']] },
  'NDC-1599-api.png': { title: 'NDC-1599 · read-only ("Read") field as an import target — test user 2', who: 'test user 2 (profile "test" 64d4aae0)', rows: [
    ['permission', 'POST /field-permissions {field: qa_rt_ro, profile: test, read_only}', '200 — field read-only for test user 2', 'info'],
    ['mapping list', 'Import Leads → Map fields → column "QA RT RO" → Field list', '"QA RT RO (read-only for your profile)" shown disabled — cannot be selected', 'ok'],
    ['other columns', 'same list for every column', 'read-only field disabled in every list; hidden field absent', 'ok']] },
  'NDC-1554-api.png': { title: 'NDC-1554 · imp1554.xlsx — tag delimiter results (admin import, layout "test")', rows: [
    ['row 2 comma', 'Tags "qart1,qart2"', 'imported — lead f65046ac has 2 tags', 'ok'],
    ['row 3 semicolon', 'Tags "qart3;qart4"', 'imported — lead 2c183532 has 2 tags', 'ok'],
    ['row 4 mixed', 'Tags "qart5,qart6;qart7"', 'Review: "1 of 3 rows have errors" · Tags · Invalid format · "Row 4: qart5,qart6;qart7" (row and field named) — not imported', 'ok'],
    ['submit', 'Submit', 'Import complete — Added 2 · Errors 1', 'ok'],
    ['observation', 'Result › "All errors 1"', 'error table says "No errors match your filters" (empty) — same as NDC-2385', 'info']] },
  'NDC-1694-api.png': { title: 'NDC-1694 · empty teamspace — UI vs API', rows: [
    ['UI', 'Create New Teamspace "QA RT TS" with no modules', 'Save disabled · "Add at least one module to save this teamspace."', 'ok'],
    ['API', 'POST /teamspaces {name:"QA RT TS empty", modules:[]}', '201 — empty teamspace created (list: 0 modules)', 'bad'],
    ['switcher', 'sidebar teamspace switcher', '"QA RT TS empty" (0 modules) is offered — ticket: if allowed, must not be offered there', 'bad'],
    ['cleanup', 'DELETE teamspace a1a9bba3', 'removed; switcher back to CRM Teamspace', 'info']] },
};
fs.mkdirSync(path.join(__dirname, 'cards'), { recursive: true });
for (const [out, s] of Object.entries(C)) fs.writeFileSync(path.join(__dirname, 'cards', out.replace('.png', '.json')), JSON.stringify({ out, date: DATE, ...s }, null, 1));
console.log('wrote', Object.keys(C).join(', '));
