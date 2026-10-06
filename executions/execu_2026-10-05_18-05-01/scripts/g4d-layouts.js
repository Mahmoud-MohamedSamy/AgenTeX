// G16 (section name EN/AR) probe + G19 move up, on the default QA layout; G6 switch detail.
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const lays = async () => arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
const DEF = (await lays()).find(x => x.isDefault);
const saved = async () => (await api('GET', `/modules/${QA.id}/layouts/${DEF.id}`)).j.data.views.CREATE.layout.sections;
await go(`/settings/modules-and-fields/${QA.id}/layouts/${DEF.id}`, 10000);
await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(900);
const n = await page.getByRole('button', { name: 'Section settings' }).count();
await page.getByRole('button', { name: 'Section settings' }).nth(n - 1).click(); await sleep(700);
await page.locator('button,li,[role=menuitem]', { hasText: 'Edit Name' }).last().click(); await sleep(1500);
const s1 = await shot('G16-edit-name-opened');
const inputs = await page.evaluate(() => [...document.querySelectorAll('input,textarea')].filter(i => i.getBoundingClientRect().width && i.getBoundingClientRect().y > 100).map(i => `${i.placeholder || ''}|${i.value}|${i === document.activeElement ? 'focused' : ''}`));
let g16 = '';
const drawer = page.locator('aside, [role=dialog]').filter({ hasText: 'Section Settings' }).last();
const arDefault = await drawer.locator('button', { hasText: /^Arabic$/ }).first().evaluate(e => /primary|blue|bg-/.test(e.className) && getComputedStyle(e).color === 'rgb(255, 255, 255)').catch(() => null);
await drawer.locator('button', { hasText: /^English$/ }).first().click(); await sleep(300);
await page.getByPlaceholder('Section name in English').fill('QA MF Section');
await drawer.locator('button', { hasText: /^Arabic$/ }).first().click(); await sleep(300);
await page.getByPlaceholder('Section name in Arabic').fill('قسم QA MF');
await drawer.locator('button', { hasText: /^Apply$/ }).first().click(); await sleep(800);
g16 = 'drawer opened with the Arabic tab pre-selected=' + arDefault;
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
let sx = await saved();
const ns = sx.find(s => /QA MF Section/.test(JSON.stringify(s.label)));
rec('G16', ns && /قسم/.test(JSON.stringify(ns.label)) ? 'PASS' : (ns ? 'FAIL' : 'FAIL'), `Edit Name opens: inputs [${inputs.join(' ; ')}]; ${g16}; saved labels ${sx.map(s => JSON.stringify(s.label)).join(', ')}`, { shot: s1 });
// G19 move the new section up
await go(`/settings/modules-and-fields/${QA.id}/layouts/${DEF.id}`, 10000);
const m = await page.getByRole('button', { name: 'Section settings' }).count();
await page.getByRole('button', { name: 'Section settings' }).nth(m - 1).click(); await sleep(600);
const mu = page.locator('button,li,[role=menuitem]', { hasText: 'Move Up' }).last(); const dis = await mu.isDisabled().catch(() => null); await mu.click().catch(() => { }); await sleep(800);
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
sx = await saved(); const idx = sx.findIndex(s => /QA MF Section|New Section/.test(JSON.stringify(s.label)));
rec('G19', idx === 0 ? 'PASS' : 'FAIL', `Move Up disabled=${dis}; new section saved at index ${idx} of ${sx.length}`);
// tidy: remove the extra section again via the menu
await go(`/settings/modules-and-fields/${QA.id}/layouts/${DEF.id}`, 10000);
const k = await page.getByRole('button', { name: 'Section settings' }).count();
for (let i = 0; i < k; i++) { await page.getByRole('button', { name: 'Section settings' }).nth(i).click(); await sleep(500); const del = page.locator('button,li,[role=menuitem]', { hasText: 'Delete Section' }).last(); if (!(await del.isDisabled().catch(() => true))) { await del.click(); await sleep(700); await page.getByRole('button', { name: /Yes, Delete/ }).click().catch(() => { }); await sleep(700); break; } await page.keyboard.press('Escape'); await sleep(300); }
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(4000);
// G6 detail: what the switch on a non-default layout does
const OTH = (await lays()).find(x => !x.isDefault);
const use = await api('GET', `/modules/${QA.id}/layouts/${OTH.id}/record-usage`);
await go(`/settings/modules-and-fields/${QA.id}`, 6000);
const b = page.locator(`button[aria-label="Toggle ${OTH.name} status"]`).first(); const st0 = await b.getAttribute('aria-checked'); await b.click(); await sleep(1500);
const after = (await txt()).replace(/\s+/g, ' '); const dlg = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const s2 = await shot('G6-switch-off-layout');
await page.keyboard.press('Escape');
const st = (await lays()).find(x => x.id === OTH.id).status;
rec('G6.detail', 'INFO', `"${OTH.name}" record-usage → ${use.s} ${use.t.slice(0, 120)}; switch aria-checked before=${st0}; after click dialog "${dlg.slice(0, 160)}"; toast/text has "Create another layout"=${/Create another layout/.test(after)}; status now ${st}`, { shot: s2 });
return done();
