// NDC-2122: Edit Pattern, type upper case, check lower-casing; save and read the stored pattern; API upper-case POST.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.getByLabel('Value for Full Name').fill('QA'); await page.getByLabel('Value for Company').fill('QA');
await page.getByRole('button', { name: 'Edit Pattern' }).click(); await sleep(800);
const box = page.locator('#main-content input, #main-content textarea').filter({ hasNot: page.locator('xx') }).last();
const pat = (await page.getByLabel(/pattern/i).count()) ? page.getByLabel(/pattern/i).first() : box;
const out = { patLabel: await pat.getAttribute('aria-label') };
await pat.fill(''); await pat.click(); await page.keyboard.type('(1 OR 2)', { delay: 60 }); await sleep(600);
out.typed = await pat.inputValue();
await shot('2122-02-typed-upper');
await pat.fill('(1 AND 2)'); await sleep(500); out.filled = await pat.inputValue();
await page.keyboard.press('Tab'); await sleep(500);
out.textAfter = ((await txt()).split('Criteria Pattern')[1] || '').slice(0, 120);
await page.getByLabel('Custom view name').fill('QA RT 2122 pattern');
const resp = []; const f = async r => { const q = r.request(); if (q.method() === 'POST' && /\/views$/.test(q.url())) resp.push({ s: r.status(), req: q.postData()?.match(/"pattern":"[^"]*"/)?.[0], id: (await r.json().catch(() => ({})))?.data?.id }); }; page.on('response', f);
await page.getByRole('button', { name: /^Save$/ }).last().click();
for (let k = 0; k < 30 && !resp.length; k++) await sleep(1000);
page.off('response', f); out.save = resp;
if (resp[0]?.id) { const g = await api('GET', `/modules/${L}/views/${resp[0].id}`); out.stored = g.j.data.settings?.criteria?.pattern; }
const r = await api('POST', `/modules/${L}/views`, { name: 'QA RT 2122 api upper', kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'first_name', operator: 'contains', value: 'QA' }, { field: 'company', operator: 'contains', value: 'QA' }], pattern: '(1 AND 2) OR 1' } } });
out.apiUpper = r.s + ' ' + (r.j?.data?.id ? r.j.data.id + ' stored=' + r.j.data.settings?.criteria?.pattern : r.t.slice(0, 250));
const r2 = await api('POST', `/modules/${L}/views`, { name: 'QA RT 2122 api mixed', kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'first_name', operator: 'contains', value: 'QA' }, { field: 'company', operator: 'contains', value: 'QA' }], pattern: '1 And 2' } } });
out.apiMixed = r2.s + ' ' + (r2.j?.data?.id ? r2.j.data.id + ' stored=' + r2.j.data.settings?.criteria?.pattern : r2.t.slice(0, 250));
await sleep(2000); await shot('2122-03-saved');
return done(out);
