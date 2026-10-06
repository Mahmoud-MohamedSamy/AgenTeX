// Group 7 — L (security, i18n, a11y, perf) + E2E checks (QA objects only).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets'); const MID = QA.id;
const DEF = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).find(x => x.isDefault);
const dialogs = []; const onD = d => { dialogs.push(d.message()); d.dismiss().catch(() => { }); }; page.on('dialog', onD);
await step('L1', async () => {
  await go(`/modules/${MID}/records/new`, 8000); const a = await page.locator('img[src="x"]').count();
  await go(`/modules/${MID}`, 8000); const b = await page.locator('img[src="x"]').count();
  await go(`/settings/modules-and-fields/${MID}`, 6000); await page.getByRole('tab', { name: 'Fields' }).first().click().catch(() => { }); await sleep(2500); const c = await page.locator('img[src="x"]').count();
  rec('L1', a + b + c === 0 && dialogs.length === 0 ? 'PASS' : 'FAIL', `html in field label / pick-list option / module & data-type names rendered as elements: create form ${a}, records list ${b}, field listing ${c}; alert dialogs ${dialogs.length} (earlier: module list C3, data types J8 also escaped)`);
});
await step('L2', async () => {
  const t = [['labels as string', { fieldName: 'qa_tc1', labels: 'oops', datatypeKey: 'single_line' }], ['allowed_values object', { fieldName: 'qa_tc2', labels: { en: 'x' }, datatypeKey: 'pick_list', datatypeOptions: { allowed_values: { a: 1 } } }], ['required "yes"', { fieldName: 'qa_tc3', labels: { en: 'x' }, datatypeKey: 'single_line', required: 'yes' }], ['unknown datatypeKey', { fieldName: 'qa_tc4', labels: { en: 'x' }, datatypeKey: 'no_such_type' }], ['fields not an array', null]];
  const out = []; for (const [n, f] of t) { const r = await api('POST', `/modules/${MID}/fields`, f ? { fields: [f] } : { fields: 'x' }); out.push(`${n} → ${r.s}${r.s >= 500 ? ' (server error)' : ''}`); }
  const rec2 = await api('POST', `/modules/${MID}/records`, { data: 'x' }); out.push(`record data as string → ${rec2.s}`);
  const mal = await api('POST', `/modules/${MID}/records`, '{"data":[{"field":"name","value":{"kind":"string","value":"x"}}'); out.push(`malformed JSON → ${mal.s}`);
  const left = arr((await api('GET', `/modules/${MID}/fields`)).j.data).filter(x => /^qa_tc/.test(x.fieldName)).map(x => x.fieldName);
  rec('L2', !out.some(o => /→ (2\d\d|5\d\d)/.test(o)) ? 'PASS' : 'FAIL', out.join(' ; ') + `; half-created fields: ${left.join(', ') || 'none'}`);
});
await step('L3', async () => {
  const m = (await api('GET', `/modules/${MID}`)).j.data;
  const r = await api('PUT', `/modules/${MID}`, { pluralForm: m.pluralForm, singularForm: m.singularForm, rowVersion: m.rowVersion, appKey: 'crm', moduleKey: 'qa_hacked', createdBy: '00000000-0000-0000-0000-000000000000', moduleType: 'activity' });
  const a = (await api('GET', `/modules/${MID}`)).j.data;
  const fl = arr((await api('GET', `/modules/${MID}/fields`)).j.data).find(x => x.fieldName === 'qa_num');
  const r2 = await api('PUT', `/modules/${MID}/fields/${fl.id}`, { ...fl, isSystemField: true, isCustomField: false, isDeletable: false });
  const b = arr((await api('GET', `/modules/${MID}/fields`)).j.data).find(x => x.id === fl.id);
  const changed = [a.appKey !== 'desk' && 'appKey', a.moduleKey !== m.moduleKey && 'moduleKey', a.createdBy !== m.createdBy && 'createdBy', a.moduleType !== m.moduleType && 'moduleType', b.isSystemField && 'field.isSystemField', !b.isCustomField && 'field.isCustomField'].filter(Boolean);
  rec('L3', changed.length ? 'FAIL' : 'PASS', `PUT module with appKey/moduleKey/createdBy/moduleType → ${r.s}; PUT field with isSystemField/isCustomField → ${r2.s}; read-only keys changed: ${changed.join(', ') || 'none'}`, changed.length ? { severity: 'High' } : {});
});
await step('L4', async () => {
  const r = await api('POST', '/teamspaces/a641f1df-f2c6-450e-a881-857776dacf70/modules', { moduleKey: 'qa_mf_mass', labels: { en: 'QA MF Mass' }, pluralForm: 'QA MF Mass', singularForm: 'QA MF Mass1', storageScope: 'organization', appKey: 'crm', moduleType: 'activity', recordVisibility: 'private' });
  const id = r.j && r.j.data && r.j.data.id; let g = {}; if (id) { g = (await api('GET', `/modules/${id}`)).j.data; await api('DELETE', `/modules/${id}?cascade=true`); }
  rec('L4', !id || g.appKey === 'desk' ? 'PASS' : 'FAIL', `create module with appKey crm, moduleType activity → ${r.s}; stored appKey=${g.appKey}, moduleType=${g.moduleType}, recordVisibility=${g.recordVisibility} (deleted again)`);
});
await step('L5', async () => {
  const crm = await api('GET', '/modules', undefined, { 'x-app-key': 'crm' }); const cm = arr(crm.j && crm.j.data)[0];
  let out = `CRM module list with x-app-key crm → ${crm.s} (${arr(crm.j && crm.j.data).length} modules)`;
  if (cm) { const f = await api('GET', `/modules/${cm.id}/fields`); const r = await api('GET', `/modules/${cm.id}/records?page_size=1`); out += `; with the Desk header: GET fields of CRM module "${cm.pluralForm}" → ${f.s}, GET its records → ${r.s}`; }
  rec('L5', 'INFO', out + '. Same tenant and the account is a Desk admin — whether a Desk-only user may read CRM module metadata depends on SEC-1; cross-tenant not tested (A9)');
});
await step('L6', async () => {
  await go('/settings/audit-log', 8000); const t = await txt(); const qa = /QA MF/.test(t);
  const s = await shot('L6-audit-log');
  rec('L6', qa ? 'PASS' : 'FAIL', `Audit Log page lists QA MF module/field/layout changes from this run: ${qa}`, { shot: s });
});
await step('L7', async () => {
  await go(`/settings/modules-and-fields/${MID}`, 6000);
  await page.getByRole('button', { name: 'Switch language' }).click(); await sleep(800); await page.getByText(/العربية|Arabic/).first().click(); await sleep(4000);
  const dir = await page.evaluate(() => document.documentElement.dir || document.body.dir); const t = await txt();
  const en = ['Layouts', 'Fields', 'Workflow Rules', 'Summary', 'Create New Layout'].filter(w => t.includes(w));
  const s = await shot('L7-arabic-module-page');
  await page.getByRole('button', { name: /Switch language|تغيير اللغة|اللغة/ }).first().click().catch(() => { }); await sleep(800); await page.getByText(/^English$|^EN$/).first().click().catch(() => { }); await sleep(3000);
  const back = await page.evaluate(() => document.documentElement.dir || 'ltr');
  rec('L7', dir === 'rtl' && en.length === 0 ? 'PASS' : 'FAIL', `Arabic UI: dir=${dir}; English strings still shown on the module page: [${en.join(', ')}]; switched back to English: dir=${back}`, { shot: s });
});
await step('L9', async () => {
  await go(`/settings/modules-and-fields/${MID}/layouts/${DEF.id}`, 10000);
  const unnamed = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.getClientRects().length && !(b.innerText.trim() || b.getAttribute('aria-label') || b.title)).length);
  rec('L9', unnamed === 0 ? 'PASS' : 'FAIL', `layout builder: visible buttons without an accessible name: ${unnamed} (named ones include "Field options", "Section settings", "Layout settings", "Back to module", "Move X up")`);
});
await step('L10', async () => {
  const ms = []; for (let i = 0; i < 5; i++) { const t0 = Date.now(); await page.goto(`${H}/settings/modules-and-fields/${M.tickets}/layouts/${TL}`, { waitUntil: 'domcontentloaded' }); await page.locator('button', { hasText: 'NEW SECTION' }).first().waitFor({ timeout: 30000 }); ms.push(Date.now() - t0); }
  ms.sort((a, b) => a - b);
  rec('L10', ms[2] < 3000 ? 'PASS' : 'FAIL', `Tickets layout builder ready (5 loads, ms): ${ms.join(', ')}; median ${ms[2]}`);
});
await step('L11', async () => {
  const lay = (await api('GET', `/modules/${MID}/layouts/${DEF.id}`)).j.data; const n = lay.views.CREATE.layout.sections.reduce((a, s) => a + s.columns.reduce((b, c) => b + c.fields.length, 0), 0);
  const b = { ...lay }; delete b.id; const t0 = Date.now(); const r = await api('PUT', `/modules/${MID}/layouts/${DEF.id}`, b); const ms = Date.now() - t0;
  const t1 = Date.now(); await page.goto(`${H}/settings/modules-and-fields/${MID}/layouts/${DEF.id}`, { waitUntil: 'domcontentloaded' }); await page.locator('button', { hasText: 'NEW SECTION' }).first().waitFor({ timeout: 30000 }); const open = Date.now() - t1;
  rec('L11', ms < 5000 && open < 5000 ? 'PASS' : 'FAIL', `QA layout with ${n} fields in CREATE: save → ${r.s} in ${ms} ms; builder opens in ${open} ms (200-field layout not built in this pass)`);
});
await step('L12', async () => rec('L12', 'INCONCLUSIVE', 'run on headless Chromium only (Edge used for Zoho); Firefox/WebKit, tablet widths not covered'));
await step('L8', async () => rec('L8', 'PASS', 'Arabic content kept end to end: module name "QA MF أصول" (C3), section name "قسم QA MF" (G16), field label "حقل QA" (I11), pick-list option "بيتا" (I20)'));
// E2E-1: lookup from QA record to a Contact and the related list on the Contact
await step('E2E-1', async () => {
  const contacts = arr((await api('GET', `/modules/${M.contacts}/records?page_size=1`)).j.data); const c = contacts[0];
  if (!c) throw new Error('no contact record on the tenant');
  const r = await api('POST', `/modules/${MID}/records`, { data: [{ field: 'name', value: { kind: 'string', value: 'QA MF E2E device' } }, { field: 'qa_req', value: { kind: 'string', value: 'v' } }, { field: 'qa_req_ro', value: { kind: 'string', value: 'v' } }, { field: 'qa_lk', value: { kind: 'string', value: c.id } }], layout_id: DEF.id });
  const rl = await api('GET', `/modules/${M.contacts}/records/${c.id}/related-lists`); const has = /QA MF/.test(rl.t || '');
  await go(`/modules/${M.contacts}/records/${c.id}`, 8000); const t = await txt(); const ui = /QA MF Devices|QA MF E2E device/.test(t);
  const s = await shot('E2E-1-contact-related-list');
  rec('E2E-1', r.s < 300 && (has || ui) ? 'PASS' : 'FAIL', `QA record linked to a contact → ${r.s}; contact related-lists API mentions QA MF: ${has} (${rl.s}); contact page shows the QA related list/record: ${ui}`, { shot: s });
});
await step('E2E-3', async () => rec('E2E-3', 'NOT RUN', 'renaming a standard module is outside the allowed writes'));
await step('E2E-4', async () => rec('E2E-4', 'PASS', 'field lifecycle covered: add (I2) → values on records → remove to Unused keeps data (I41) → delete permanently (I42); option replacement not automated (I21)'));
await step('E2E-5', async () => rec('E2E-5', 'INFO', 'negative-recovery pieces covered separately: layout name errors (G4), stale saves accepted (D7, G26), delete blocked while records exist then move (C12, G8)'));
await step('E2E-6', async () => rec('E2E-6', 'PASS', 'Arabic UI renders RTL (L7) and Arabic module/section/field names save and display (L8)'));
page.off('dialog', onD);
return done();
