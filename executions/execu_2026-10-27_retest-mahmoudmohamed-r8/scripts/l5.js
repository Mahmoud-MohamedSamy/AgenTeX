const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.getByText('ADVANCED', { exact: true }).last().click({ force: true }); await sleep(1000);
const sel = page.locator('select').filter({ hasText: 'Select a module' }); if (await sel.count()) await sel.first().selectOption({ label: 'Customers' }); else { await page.getByText('Select a module…').last().click({ force: true }); await sleep(600); await page.getByRole('option', { name: 'Customers' }).first().click({ force: true }); }
await sleep(800); await page.getByRole('button', { name: 'Apply', exact: true }).last().click(); await sleep(1500);
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/modules/')) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' → ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 200) : '')); }; page.on('response', f);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3000);
const sa = page.getByRole('button', { name: /Save anyway/i }); if (await sa.count()) { await sa.click(); }
await sleep(15000); page.off('response', f);
await shot('1873-04-saved');
const toasts = (await txt()).split('\n').filter(l => /saved|error|already used|not saved|success/i.test(l)).slice(0, 5);
const fl = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(x => /lookup_contacts/.test(x.apiName || '')).map(x => x.apiName + ' ' + x.labels?.en + ' ' + x.id);
return done({ resp, toasts, fl });
