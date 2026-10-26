const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', F = '44241857-b00c-42aa-b3fe-9404c5b920f2';
const row = page.locator('tr, [role=row], div').filter({ has: page.getByText('test', { exact: true }) }).filter({ has: page.locator('input[type=checkbox]') }).last();
await row.scrollIntoViewIfNeeded(); const boxes = row.locator('input[type=checkbox]'); const nb = await boxes.count();
const before = []; for (let i = 0; i < nb; i++) before.push(await boxes.nth(i).isChecked());
await boxes.first().click({ force: true }); await sleep(600);
const after = []; for (let i = 0; i < nb; i++) after.push(await boxes.nth(i).isChecked());
await shot('1337-02-test-profile-unchecked');
await page.getByRole('button', { name: 'Apply', exact: true }).click(); await sleep(1500);
const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /modules|field|layout/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 95) + ' ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 160) : '')); }; page.on('response', fr);
const t0 = Date.now(); await page.getByRole('button', { name: 'Save', exact: true }).click();
for (let k = 0; k < 40; k++) { await sleep(1000); const t = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast], [role=alert]')].map(x => x.innerText.trim()).join(' | ')); if (/saved|success|fail|error/i.test(t) && k > 2) break; }
page.off('response', fr);
const toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast], [role=alert]')].map(x => x.innerText.trim()).filter(Boolean));
await shot('1337-03-layout-saved');
const fp = arr((await api('GET', `/modules/${L}/field-permissions`)).j?.data).filter(x => x.fieldId === F).map(x => x.profileName + '/' + x.profileId.slice(0, 8) + ' ' + x.permission);
return done({ nb, before, after, secs: Math.round((Date.now() - t0) / 1000), resp, toasts, fp });
