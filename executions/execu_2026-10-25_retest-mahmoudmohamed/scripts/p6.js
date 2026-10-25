const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', UI = '6f41abfa-3d8b-42fb-ab86-6fbf30f5bbf0', APIV = 'c60d7685-61a8-4f94-98cc-75ccbe0cdef0';
const out = {};
for (const [k, id] of [['ui', UI], ['api', APIV]]) { const r = await api('GET', `/modules/${L}/records?page=1&per_page=1&view=${id}`); const r2 = await api('GET', `/modules/${L}/records?page=1&per_page=1&view_id=${id}`); out[k + 'Count'] = [r.j?.meta?.total_count, r2.j?.meta?.total_count]; }
await go(`/modules/${L}/views/${APIV}/edit`, 500);
for (let k = 0; k < 90; k++) { await sleep(1000); if (await page.locator('input[maxlength="120"]').count()) break; }
await sleep(2000); out.url = page.url().replace(/.*\/modules\/[^/?]+/, '');
out.shown = ((await txt()).split('Criteria Pattern')[1] || '').split('\n').slice(0, 3).join(' | ');
await shot('2122-04-api-mixed-opened');
const ep = page.getByRole('button', { name: 'Edit Pattern' }); if (await ep.count()) { await ep.click(); await sleep(800); out.editBox = await page.getByLabel('Criteria pattern').inputValue(); await shot('2122-05-api-mixed-editbox'); }
return done(out);
