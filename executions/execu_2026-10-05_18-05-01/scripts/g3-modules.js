// Group 3 — C (create/delete custom module) + D (rename) + B5, F9. Writes only "QA MF" objects; every extra module is deleted.
const created = [];
const listMods = async () => arr((await api('GET', '/modules')).j.data);
const byName = async n => (await listMods()).filter(m => m.pluralForm === n);
let captured = null;
const onReq2 = r => { if (r.method() === 'POST' && /\/teamspaces\/[^/]+\/modules$/.test(r.url())) captured = { url: r.url().replace(API, ''), body: r.postData() }; };
page.on('request', onReq2);
const dialogs = []; page.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => { }); });

// C2 — required names (UI)
await step('C2', async () => {
  await go('/settings/modules-and-fields');
  await page.getByRole('button', { name: /Create New Module/ }).click(); await sleep(1200);
  await page.getByRole('button', { name: /^Create$/ }).last().click(); await sleep(1000);
  const a = (await txt()).includes('Enter the plural module name.');
  await page.getByPlaceholder('e.g. Tickets').fill('QA MF Only Plural'); await page.getByRole('button', { name: /^Create$/ }).last().click(); await sleep(1000);
  const b = (await txt()).includes('Enter the singular module name.');
  rec('C2', a && b && !captured ? 'PASS' : 'FAIL', `empty submit shows "Enter the plural module name."=${a}; plural only shows "Enter the singular module name."=${b}; request sent=${!!captured} (messages appear one at a time)`, a && b && !captured ? {} : { shot: await shot('C2-required') });
});
// C1 — create via UI
let QA = null;
await step('C1', async () => {
  await go('/settings/modules-and-fields'); await page.getByRole('button', { name: /Create New Module/ }).click(); await sleep(1200);
  await page.getByPlaceholder('e.g. Tickets').fill('QA MF Assets'); await page.getByPlaceholder('e.g. Ticket', { exact: true }).fill('QA MF Asset');
  const ta = page.locator('[role=dialog] textarea'); if (await ta.count()) await ta.first().fill('QA MF test module — safe to delete');
  for (const p of ['Desk Administrator', 'Desk Agent']) { const c = page.locator('[role=dialog]').getByText(p, { exact: true }).first(); if (await c.count()) await c.click(); }
  await page.getByRole('button', { name: /^Create$/ }).last().click(); await sleep(4000);
  const t = await txt(); const toast = /Module QA MF Asset(s)? created/.test(t);
  const m = (await byName('QA MF Assets'))[0]; QA = m;
  if (m) created.push(m.id);
  rec('C1', m && m.storageScope === 'organization' && m.appKey === 'desk' ? 'PASS' : 'FAIL', `toast shown=${toast}; GET: id=${m && m.id}, apiName=${m && m.apiName}, moduleKey=${m && m.moduleKey}, storageScope=${m && m.storageScope}, appKey=${m && m.appKey}, recordVisibility=${m && m.recordVisibility}; request ${captured && captured.url} body ${captured && captured.body && captured.body.slice(0, 300)}`, { qaModuleId: m && m.id });
});
if (!QA) { page.off('request', onReq2); return done(); }
const tsPath = captured.url; const body0 = JSON.parse(captured.body);
const mk = async (over) => api('POST', tsPath, { ...body0, ...over });
const kill = async id => { const r = await api('DELETE', `/modules/${id}?cascade=true`); return r.s; };

// C3 — name data classes (API), each created module deleted
await step('C3', async () => {
  const cases = [['D2 spaces', '   ', '   '], ['D3 one char', 'Q', 'Q'], ['D4 25', 'QA MF ' + 'x'.repeat(19), 'QA MF ' + 'y'.repeat(19)], ['D5 26', 'QA MF ' + 'x'.repeat(20), 'QA MF ' + 'y'.repeat(20)], ['long 120', 'QA MF ' + 'z'.repeat(114), 'QA MF ' + 'w'.repeat(114)], ['D6 trim', '  QA MF Trim  ', '  QA MF Trim1  '], ['D8 Arabic', 'QA MF أصول', 'QA MF أصل'], ['D10 emoji', 'QA MF 📦 Boxes', 'QA MF 📦 Box'], ['D11 html', 'QA MF <img src=x onerror=alert(1)>', 'QA MF <b>x</b>'], ['D14 zero-width', 'QA MF​ZW', 'QA MF​ZW1']];
  const out = [];
  for (const [n, pl, si] of cases) {
    const r = await mk({ pluralForm: pl, singularForm: si, labels: { en: pl }, plural_form: pl, singular_form: si, name: pl });
    const id = r.j && r.j.data && (r.j.data.id || (r.j.data.module && r.j.data.module.id));
    let stored = '';
    if (id) { created.push(id); const g = await api('GET', `/modules/${id}`); stored = g.j && g.j.data ? JSON.stringify(g.j.data.pluralForm) : ''; }
    out.push(`${n}: ${r.s}${id ? ' stored ' + stored : ' ' + ((r.j && r.j.error && r.j.error.message) || '').slice(0, 70)}`);
    if (n === 'D11 html' && id) { await go('/settings/modules-and-fields', 5000); const imgs = await page.locator('img[src="x"]').count(); out.push(`D11 rendered in list as text: ${imgs === 0}; alert dialogs: ${dialogs.length}`); }
    if (id) { await kill(id); }
  }
  const bad = out.some(o => /^D2 spaces: 20|^D5 26: 20|alert dialogs: [1-9]|as text: false/.test(o));
  rec('C3', bad ? 'FAIL' : 'PASS', out.join(' ; '));
});
// C6 — duplicates
await step('C6', async () => {
  const out = [];
  for (const [n, pl, si] of [['same name', 'QA MF Assets', 'QA MF Asset'], ['case variant', 'qa mf assets', 'qa mf asset'], ['standard name', 'Tickets', 'Ticket']]) {
    const r = await mk({ pluralForm: pl, singularForm: si, labels: { en: pl } });
    const id = r.j && r.j.data && r.j.data.id; if (id) { created.push(id); await kill(id); }
    out.push(`${n}: ${r.s} ${id ? 'CREATED (deleted again)' : ((r.j && r.j.error && r.j.error.message) || '').slice(0, 80)}`);
  }
  rec('C6', out.some(o => /CREATED/.test(o)) ? 'FAIL' : 'PASS', out.join(' ; '));
});
// C8 — default content
await step('C8', async () => {
  const f = arr((await api('GET', `/modules/${QA.id}/fields`)).j.data); const l = arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
  rec('C8', l.length === 1 && l[0].isDefault && f.some(x => x.fieldName === 'name') ? 'PASS' : 'FAIL', `layouts: ${l.map(x => x.name + (x.isDefault ? '(default)' : '')).join(', ')}; fields: ${f.map(x => x.labels.en + (x.required ? '*' : '')).join(', ')}`, { qaLayoutId: l[0] && l[0].id });
});
// C10 — double submit (UI)
await step('C10', async () => {
  await go('/settings/modules-and-fields'); await page.getByRole('button', { name: /Create New Module/ }).click(); await sleep(1000);
  await page.getByPlaceholder('e.g. Tickets').fill('QA MF Double'); await page.getByPlaceholder('e.g. Ticket', { exact: true }).fill('QA MF Double1');
  const b = page.getByRole('button', { name: /^Create$/ }).last(); await Promise.all([b.click().catch(() => { }), b.click({ delay: 10 }).catch(() => { })]); await sleep(4000);
  const d = await byName('QA MF Double'); for (const m of d) { created.push(m.id); await kill(m.id); }
  rec('C10', d.length === 1 ? 'PASS' : 'FAIL', `double click on Create made ${d.length} module(s) (all deleted again)`);
});
// C11 — where the new module appears
await step('C11', async () => {
  const out = [];
  await go('/hq', 6000); out.push(`top bar text has it: ${(await txt()).includes('QA MF Assets')}`);
  const more = page.getByRole('button', { name: /More modules/ }); if (await more.count()) { await more.first().click(); await sleep(800); out.push(`More modules: ${(await txt()).includes('QA MF Assets')}`); await page.keyboard.press('Escape'); }
  const cr = page.getByRole('button', { name: /Create in another module/ }); if (await cr.count()) { await cr.first().click(); await sleep(800); out.push(`Create menu: ${/QA MF Asset/.test(await txt())}`); await page.keyboard.press('Escape'); }
  await go('/settings/organize-tabs', 5000); out.push(`Organize Tabs: ${(await txt()).includes('QA MF Assets')}`);
  await go(`/modules/${QA.id}`, 6000); const rt = await txt(); out.push(`records page /modules/{id}: ${/QA MF Assets/.test(rt) && !/not found|Something went wrong/i.test(rt)}`);
  const s = await shot('C11-qa-module-records-page');
  rec('C11', 'INFO', out.join(' ; '), { shot: s });
});
// F9 + C12 + C13 on a throwaway module
await step('F9', async () => {
  const r = await mk({ pluralForm: 'QA MF Temp', singularForm: 'QA MF Temp1', labels: { en: 'QA MF Temp' } }); if (!(r.j && r.j.data && r.j.data.id)) throw new Error('temp module create → ' + r.s + ' ' + r.t.slice(0, 200)); const id = r.j.data.id; created.push(id);
  const noName = await api('POST', `/modules/${id}/records`, { data: [] });
  const withName = await api('POST', `/modules/${id}/records`, { data: [{ field: 'name', value: { kind: 'string', value: 'QA MF rec 1' } }] });
  const rid = withName.j && withName.j.data && withName.j.data.id;
  rec('F9', noName.s >= 400 && rid ? 'PASS' : 'FAIL', `record without required Name → ${noName.s} ${(noName.j && noName.j.error && noName.j.error.message || '').slice(0, 80)}; with Name → ${withName.s} id=${rid}`);
  // C12 delete with records
  const d1 = await api('DELETE', `/modules/${id}?cascade=true`);
  rec('C12', d1.s >= 400 && /record/i.test(d1.t) ? 'PASS' : 'FAIL', `DELETE module with 1 record → ${d1.s} ${(d1.j && d1.j.error && d1.j.error.message || '').slice(0, 120)}`);
  // C13 delete record, then module
  const dr = await api('DELETE', `/modules/${id}/records/${rid}`);
  const d2 = await api('DELETE', `/modules/${id}?cascade=true`);
  const rb = await api('GET', '/audit/recycle-bin/items?page_size=50'); const left = (rb.t || '').includes(id) || /QA MF rec 1/.test(rb.t || '');
  const gone = !(await listMods()).some(m => m.id === id);
  rec('C13', gone ? (left ? 'FAIL' : 'PASS') : 'FAIL', `DELETE record → ${dr.s}; DELETE module → ${d2.s} ${d2.s >= 400 ? d2.t.slice(0, 120) : ''}; module gone=${gone}; its record still listed in Recycle Bin=${left} (NDC-1637)`);
});
// B5 — disable / enable QA module
await step('B5', async () => {
  await go('/settings/modules-and-fields', 5000);
  const row = page.locator('tr', { hasText: 'QA MF Assets' }).first(); const sw = row.getByRole('switch').first();
  const n = await sw.count(); if (!n) throw new Error('status switch not found');
  await sw.click(); await sleep(2500); const st1 = (await api('GET', `/modules/${QA.id}`)).j.data.status;
  await go('/hq', 5000); const inBar = (await txt()).includes('QA MF Assets');
  const rc = await api('POST', `/modules/${QA.id}/records`, { data: [{ field: 'name', value: { kind: 'string', value: 'QA MF while disabled' } }] });
  const rcid = rc.j && rc.j.data && rc.j.data.id; if (rcid) await api('DELETE', `/modules/${QA.id}/records/${rcid}`);
  await go(`/modules/${QA.id}`, 5000); const pageOk = !/disabled|not available|not found/i.test(await txt());
  await go('/settings/modules-and-fields', 5000); await page.locator('tr', { hasText: 'QA MF Assets' }).first().getByRole('switch').first().click(); await sleep(2500);
  const st2 = (await api('GET', `/modules/${QA.id}`)).j.data.status;
  rec('B5', st1 !== 'active' && !inBar && !rcid && st2 === 'active' ? 'PASS' : 'FAIL', `after switch off: status=${st1}; still in top bar=${inBar}; API record create while disabled → ${rc.s}${rcid ? ' (CREATED — deleted again)' : ''}; records page still usable=${pageOk}; switched back on: status=${st2} (NDC-1864)`);
});
// C14 — Team Module button
await step('C14', async () => {
  await go('/settings/modules-and-fields', 5000); await page.getByText('Team Module', { exact: true }).first().click(); await sleep(1500);
  const dlg = await page.locator('[role=dialog]').last().innerText().catch(() => ''); const s = await shot('C14-team-module');
  rec('C14', 'INFO', `Team Module opens: "${dlg.replace(/\s+/g, ' ').slice(0, 200)}" (cancelled, nothing created)`, { shot: s });
});
// D1 — rename QA module (row menu → Rename)
await step('D1', async () => {
  await go('/settings/modules-and-fields', 5000);
  const row = page.locator('tr', { hasText: 'QA MF Assets' }).first(); await row.hover(); await row.locator('button.mf-row-menu-btn, button[aria-label^="Open menu for"]').first().click(); await sleep(600);
  await page.getByText('Rename', { exact: true }).last().click(); await sleep(1200);
  const inp = page.locator('[role=dialog] input'); await inp.nth(0).fill('QA MF Devices'); await inp.nth(1).fill('QA MF Device');
  await page.locator('[role=dialog]').getByRole('button', { name: /Save/ }).first().click(); await sleep(3000);
  const m = (await api('GET', `/modules/${QA.id}`)).j.data;
  await go('/hq', 5000); const bar = await txt(); await go(`/modules/${QA.id}`, 5000); const rp = await txt();
  rec('D1', m.pluralForm === 'QA MF Devices' && m.singularForm === 'QA MF Device' ? 'PASS' : 'FAIL', `GET plural=${m.pluralForm}, singular=${m.singularForm}, apiName=${m.apiName}; records page shows new name=${rp.includes('QA MF Devices')}; top bar/More shows it=${bar.includes('QA MF Devices')}`);
});
// D4–D7 via API
await step('D5', async () => {
  const cur = (await api('GET', `/modules/${QA.id}`)).j.data; const out = [];
  for (const [n, pl] of [['D1 empty', ''], ['D5 26 chars', 'QA MF ' + 'x'.repeat(20)], ['D8 Arabic', 'QA MF أجهزة'], ['D11 html', 'QA MF <img src=x onerror=alert(2)>'], ['D19 other module', 'Tickets']]) {
    const c = (await api('GET', `/modules/${QA.id}`)).j.data;
    const r = await api('PUT', `/modules/${QA.id}`, { pluralForm: pl, singularForm: c.singularForm, labels: { en: pl }, rowVersion: c.rowVersion });
    const after = (await api('GET', `/modules/${QA.id}`)).j.data.pluralForm; out.push(`${n}: ${r.s} → stored "${after}"`);
  }
  const back = (await api('GET', `/modules/${QA.id}`)).j.data; await api('PUT', `/modules/${QA.id}`, { pluralForm: 'QA MF Devices', singularForm: 'QA MF Device', labels: { en: 'QA MF Devices' }, rowVersion: back.rowVersion });
  const bad = out.some(o => /^D1 empty: 2\d\d|^D19 other module: 2\d\d → stored "Tickets"/.test(o));
  rec('D5', bad ? 'FAIL' : 'PASS', out.join(' ; '));
});
await step('D4', async () => {
  const c = (await api('GET', `/modules/${QA.id}`)).j.data;
  const r = await api('PUT', `/modules/${QA.id}`, { pluralForm: c.pluralForm, singularForm: c.singularForm, apiName: 'QA_MF_Devices2', rowVersion: c.rowVersion });
  const a = (await api('GET', `/modules/${QA.id}`)).j.data.apiName;
  rec('D4', 'INFO', `PUT apiName QA_MF_Devices2 → ${r.s}; stored apiName "${a}" (was "${c.apiName}"). The warning text exists in the builder's Rename Module modal, which crashes (D9)`);
});
await step('D6', async () => {
  const c = (await api('GET', `/modules/${QA.id}`)).j.data;
  const r = await api('PUT', `/modules/${QA.id}`, { pluralForm: c.pluralForm, singularForm: c.singularForm, description: 'QA MF description <b>x</b>', icon: 'Package', rowVersion: c.rowVersion });
  const a = (await api('GET', `/modules/${QA.id}`)).j.data;
  await go(`/settings/modules-and-fields/${QA.id}`, 5000); await page.getByRole('tab', { name: 'Summary' }).first().click(); await sleep(2000);
  const t = await txt(); const bold = await page.locator('main b', { hasText: 'x' }).count();
  rec('D6', a.description === 'QA MF description <b>x</b>' && a.icon === 'Package' && bold === 0 ? 'PASS' : 'FAIL', `PUT → ${r.s}; stored description="${a.description}", icon=${a.icon}; summary shows description as text=${t.includes('QA MF description <b>x</b>')}, html rendered=${bold > 0}`);
});
await step('D7', async () => {
  const c = (await api('GET', `/modules/${QA.id}`)).j.data;
  const r1 = await api('PUT', `/modules/${QA.id}`, { pluralForm: c.pluralForm, singularForm: c.singularForm, description: 'tab one', rowVersion: c.rowVersion });
  const r2 = await api('PUT', `/modules/${QA.id}`, { pluralForm: c.pluralForm, singularForm: c.singularForm, description: 'tab two (stale)', rowVersion: c.rowVersion });
  const a = (await api('GET', `/modules/${QA.id}`)).j.data.description;
  rec('D7', r1.s < 300 && r2.s === 409 ? 'PASS' : 'FAIL', `first save with rowVersion ${c.rowVersion} → ${r1.s}; second save with the same (stale) rowVersion → ${r2.s} ${(r2.j && r2.j.error && r2.j.error.code) || ''}; stored "${a}"`);
});
await step('D9', async () => {
  const L = arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data)[0];
  await go(`/settings/modules-and-fields/${QA.id}/layouts/${L.id}`, 9000);
  await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(700);
  await page.getByText('Rename Module', { exact: true }).first().click(); await sleep(2500);
  const t = await txt(); const crash = /Something went wrong|Cannot read properties/.test(t); const s = await shot('D9-rename-module-builder');
  rec('D9', crash ? 'FAIL' : 'PASS', crash ? `crash again on QA module: "${(t.match(/Cannot read[^\n]*/) || [''])[0]}"` : 'Rename Module modal opens', { shot: s, severity: 'Medium' });
});
await step('D2', async () => rec('D2', 'NOT RUN', 'renaming a standard module is outside the allowed writes'));
await step('D3', async () => rec('D3', 'NOT RUN', 'renaming a standard module is outside the allowed writes; tab label for a renamed custom module is covered in C11/D1'));
await step('C4', async () => rec('C4', 'INCONCLUSIVE', 'tenant has 0 departments (GET /desk/departments = [])'));
await step('C5', async () => {
  const c = (await api('GET', `/modules/${QA.id}`)).j.data;
  const r = await api('PUT', `/modules/${QA.id}`, { pluralForm: c.pluralForm, singularForm: c.singularForm, storageScope: 'department', rowVersion: c.rowVersion });
  const a = (await api('GET', `/modules/${QA.id}`)).j.data.storageScope;
  rec('C5', a === 'organization' ? 'PASS' : 'FAIL', `PUT storageScope=department → ${r.s}; stored storageScope=${a} (must stay organization)`);
});
await step('C7', async () => {
  const r = await mk({ pluralForm: 'QA MF NoPerm', singularForm: 'QA MF NoPerm1', labels: { en: 'QA MF NoPerm' }, profileIds: [], profile_ids: [], permissions: [] });
  const id = r.j && r.j.data && r.j.data.id; let acc = '';
  if (id) { created.push(id); const g = (await api('GET', `/modules/${id}`)).j.data; acc = `recordVisibility=${g.recordVisibility}`; await kill(id); }
  rec('C7', 'INFO', `create with no profile ticked → ${r.s}; ${acc} (deleted again). Who can open it could not be judged without a clean agent account`);
});
await step('C9', async () => rec('C9', 'INCONCLUSIVE', 'no tenant without a teamspace available'));
page.off('request', onReq2);
const leftovers = (await listMods()).filter(m => /^QA MF|^Q$|^\s+$|^qa mf/i.test(m.pluralForm) && m.id !== QA.id);
for (const m of leftovers) await kill(m.id);
rec('C.cleanup', 'INFO', `throwaway modules deleted: ${created.filter(i => i !== QA.id).length}; leftovers found and deleted now: ${leftovers.map(m => m.pluralForm).join(', ') || 'none'}; kept for later groups: ${QA.id} (QA MF Devices)`);
return done();
