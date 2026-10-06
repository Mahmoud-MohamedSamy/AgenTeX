// Group 4c — G6, G7, G8, G16–G21 with explicit state.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const lays = async () => arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
const byN = async n => (await lays()).find(x => x.name === n);
let DEF = (await lays()).find(x => x.isDefault); let OTH = (await lays()).find(x => !x.isDefault);
rec('G.state', 'INFO', `default "${DEF.name}", other "${OTH && OTH.name}"`);
const listPage = async () => { await go(`/settings/modules-and-fields/${QA.id}`, 6000); };
const popText = async () => (await page.evaluate(() => { const b = [...document.querySelectorAll('div,ul')].filter(e => { const s = getComputedStyle(e); return (s.position === 'absolute' || s.position === 'fixed') && e.getBoundingClientRect().width > 120 && e.innerText.trim().length > 0 && e.innerText.length < 600; }); return b.map(e => e.innerText).slice(-1)[0] || ''; })).replace(/\n/g, ' | ');
const openRowMenu = async name => { await listPage(); const row = page.locator('tr', { hasText: name }).first(); await row.hover(); await sleep(300); await page.locator(`button[aria-label="Open menu for ${name}"]`).first().click(); await sleep(800); return popText(); };
const dlg = async () => (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');

await step('G6', async () => {
  await listPage(); const b = page.locator(`button[aria-label="Toggle ${OTH.name} status"]`).first(); await b.click(); await sleep(2500);
  const st = (await byN(OTH.name)).status;
  const sd = await api('POST', `/modules/${QA.id}/layouts/${OTH.id}/set-default`); const d = (await byN(OTH.name)).isDefault;
  const menu = await openRowMenu(OTH.name); await page.keyboard.press('Escape');
  await listPage(); await page.locator(`button[aria-label="Toggle ${OTH.name} status"]`).first().click(); await sleep(2500);
  const back = (await byN(OTH.name)).status;
  rec('G6', st !== 'active' && sd.s >= 400 && !d && back === 'active' ? 'PASS' : 'FAIL', `"${OTH.name}" switched off → ${st}; set-default while inactive → ${sd.s} ${((sd.j && sd.j.error && sd.j.error.message) || '').slice(0, 90)}; became default=${d}; row menu while off: [${menu.slice(0, 120)}]; switched on again → ${back}`);
  if (d) { await api('POST', `/modules/${QA.id}/layouts/${DEF.id}/set-default`); }
});
await step('G7', async () => {
  DEF = (await lays()).find(x => x.isDefault);
  const menu = await openRowMenu(DEF.name);
  const del = page.locator('button,[role=menuitem]', { hasText: /^Delete$/ }).last(); let msg = '';
  if (await del.count()) { await del.click({ force: true }); await sleep(1500); msg = (await txt()).replace(/\s+/g, ' ').match(/[^.]*cannot be deleted[^.]*\.[^.]*\./) || ''; msg = msg[0] || (await dlg()).slice(0, 160); }
  await page.keyboard.press('Escape'); await sleep(500);
  const a = await api('DELETE', `/modules/${QA.id}/layouts/${DEF.id}`); const still = (await lays()).some(x => x.id === DEF.id);
  rec('G7', still && a.s >= 400 ? 'PASS' : 'FAIL', `default "${DEF.name}" menu: [${menu.slice(0, 140)}]; UI Delete → "${String(msg).slice(0, 160)}"; API DELETE default → ${a.s} ${((a.j && a.j.error && a.j.error.message) || '').slice(0, 100)}; still exists=${still}`);
});
await step('G8', async () => {
  OTH = (await lays()).find(x => !x.isDefault); DEF = (await lays()).find(x => x.isDefault);
  const ids = []; for (const n of ['QA MF on L a', 'QA MF on L b']) { const r = await api('POST', `/modules/${QA.id}/records`, { data: [{ field: 'name', value: { kind: 'string', value: n } }], layout_id: OTH.id }); ids.push(r.j && r.j.data && r.j.data.id); }
  await openRowMenu(OTH.name);
  await page.locator('button,[role=menuitem]', { hasText: /^Delete$/ }).last().click({ force: true }); await sleep(1500);
  const d = await dlg(); const s = await shot('G8-delete-layout-with-records');
  let res = 'no move dialog';
  if (/Move records/.test(d)) {
    const sel = page.locator('[role=dialog] select').first(); if (await sel.count()) await sel.selectOption({ label: DEF.name }).catch(() => { });
    await page.locator('[role=dialog] button').filter({ hasText: /Move|Delete/ }).last().click({ force: true }); await sleep(3500);
    const gone = !(await lays()).some(x => x.id === OTH.id); const lay = [];
    for (const id of ids) { const g = await api('GET', `/modules/${QA.id}/records/${id}`); const lid = g.j && g.j.data && (g.j.data.layout_id || g.j.data.layoutId); lay.push(lid === DEF.id ? 'moved' : `layout ${String(lid).slice(0, 8)}`); }
    res = `layout deleted=${gone}; records: ${lay.join(', ')}`;
  } else await page.keyboard.press('Escape');
  rec('G8', /deleted=true/.test(res) && !/layout [0-9a-f]/.test(res) ? 'PASS' : 'FAIL', `dialog: "${d.slice(0, 220)}"; ${res}`, { shot: s });
});
// sections on the default layout builder (saved changes reverted at the end)
const B = async () => { DEF = (await lays()).find(x => x.isDefault); await go(`/settings/modules-and-fields/${QA.id}/layouts/${DEF.id}`, 10000); };
const gearOf = i => page.getByRole('button', { name: 'Section settings' }).nth(i);
const item = t => page.locator('button,[role=menuitem],li', { hasText: t }).last();
const saved = async () => (await api('GET', `/modules/${QA.id}/layouts/${(await lays()).find(x => x.isDefault).id}`)).j.data.views.CREATE.layout.sections;
await step('G16', async () => {
  await B(); const before = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(900);
  const n = await page.getByRole('button', { name: 'Section settings' }).count();
  await gearOf(n - 1).click(); await sleep(700); await item('Edit Name').click(); await sleep(1000);
  const en = page.getByPlaceholder('Section name in English'), ar = page.getByPlaceholder('Section name in Arabic');
  const has = await en.count();
  if (has) { await en.fill('QA MF Section'); if (await ar.count()) await ar.fill('قسم QA MF'); else { const t = page.getByText('Arabic', { exact: true }).last(); if (await t.count()) { await t.click(); await sleep(300); await page.getByPlaceholder('Section name in Arabic').fill('قسم QA MF').catch(() => { }); } } }
  const apply = page.locator('[role=dialog] button, aside button').filter({ hasText: /Apply|Save|Done/ }).last(); if (await apply.count()) await apply.click(); else await page.keyboard.press('Escape');
  await sleep(800); await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
  const sx = await saved(); const ns = sx.find(s => /QA MF Section/.test(JSON.stringify(s.label)));
  rec('G16', n === before + 1 && ns && /قسم/.test(JSON.stringify(ns.label)) ? 'PASS' : 'FAIL', `sections ${before}→${n}; name drawer found=${has > 0}; saved labels: ${sx.map(s => JSON.stringify(s.label)).join(', ')}`);
});
await step('G17', async () => {
  await B(); const n = await page.getByRole('button', { name: 'Section settings' }).count();
  await gearOf(n - 1).click(); await sleep(600); await item('Single Column').click(); await sleep(700);
  await gearOf(n - 1).click(); await sleep(600); await item('Top to Bottom').click(); await sleep(700);
  await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
  const sx = await saved(); const s = sx[sx.length - 1];
  rec('G17', (s.columns || []).length === 1 ? 'PASS' : 'FAIL', `after Single Column: saved columns ${(s.columns || []).length} (label ${JSON.stringify(s.label)})`);
  const to = JSON.stringify(s).match(/"(tab_?[oO]rder|tabOrder|tab_order)":"?[^,}]+/);
  rec('G18', to ? 'PASS' : 'FAIL', `after Top to Bottom: saved tab order ${to ? to[0] : 'not stored in the section JSON'} (NDC-492: Tab Order options do not work)`);
});
await step('G19', async () => {
  await B(); const n = await page.getByRole('button', { name: 'Section settings' }).count();
  await gearOf(n - 1).click(); await sleep(600); const mu = item('Move Up'); const dis = await mu.isDisabled().catch(() => null); await mu.click().catch(() => { }); await sleep(800);
  await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
  const sx = await saved(); const idx = sx.findIndex(s => /QA MF Section|New Section/.test(JSON.stringify(s.label)));
  rec('G19', idx === 0 ? 'PASS' : 'FAIL', `Move Up disabled=${dis}; new section saved at index ${idx} of ${sx.length}`);
});
await step('G21', async () => {
  await B(); const n = await page.getByRole('button', { name: 'Section settings' }).count(); let found = '';
  for (let i = 0; i < n; i++) { await gearOf(i).click(); await sleep(500); const d = item('Delete Section'); const dis = await d.isDisabled().catch(() => false); const tt = await d.evaluate(e => e.title || (e.closest('[title]') || {}).title || '').catch(() => ''); await page.keyboard.press('Escape'); await sleep(300); if (dis) { found = `section #${i}: Delete Section disabled, title "${tt}"`; break; } }
  rec('G21', found ? 'PASS' : 'FAIL', found || 'no section had a disabled Delete Section');
});
await step('G20', async () => {
  await B(); const n = await page.getByRole('button', { name: 'Section settings' }).count(); let d = '';
  for (let i = 0; i < n; i++) { await gearOf(i).click(); await sleep(500); const del = item('Delete Section'); if (!(await del.isDisabled().catch(() => true))) { await del.click(); await sleep(900); d = await dlg(); await page.getByRole('button', { name: /Yes, Delete/ }).click().catch(() => { }); await sleep(900); break; } await page.keyboard.press('Escape'); await sleep(300); }
  await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
  const sx = await saved();
  rec('G20', /All fields inside will be moved to Unused Fields/.test(d) && sx.length === 1 ? 'PASS' : 'FAIL', `dialog "${d.slice(0, 130)}"; sections after save: ${sx.map(s => JSON.stringify(s.label)).join(', ')}`);
});
return done();
