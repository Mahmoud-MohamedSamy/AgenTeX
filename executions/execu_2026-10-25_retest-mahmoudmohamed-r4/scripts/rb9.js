const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + '/settings/data/recycle-bin', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 60; k++) { await sleep(1000); if (/\d+ items/.test(await txt().catch(() => ''))) break; } await sleep(1500);
await page.getByRole('button', { name: 'Filters', exact: true }).click(); await sleep(800);
await page.getByPlaceholder('Starts with…').fill('QA RT 1603'); await page.getByRole('button', { name: 'Search', exact: true }).click(); await sleep(3000);
const row = page.locator('tbody tr').filter({ hasText: 'QA RT 1603 B' }).first(); await row.locator('input[type=checkbox]').check({ force: true }); await sleep(600);
const resp = []; const fr = async r => { const q = r.request(); if (/recycle-bin\/restore/.test(q.url())) resp.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 400)); }; page.on('response', fr);
await page.getByRole('button', { name: /^Restore \(/ }).first().click(); await sleep(1200);
const c = page.getByRole('button', { name: /^Restore$/ }).last(); if (await c.count()) { await c.click(); }
await sleep(4000); page.off('response', fr);
const msg = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast], [role=alert], [role=alertdialog], [role=dialog]')].map(t => t.innerText.trim()).filter(Boolean));
await shot('1603-01-restore-conflict');
const leads = []; for (let p = 1; p < 3; p++) { for (const x of arr((await api('GET', `/modules/${L}/records?page=${p}&per_page=200&sort=created_at&order=desc`)).j?.data)) { const d = Object.fromEntries((x.data || []).map(e => [e.field, e.value?.value])); if (d.qa_rt_uniq === 'QA-RT-U1') leads.push(d.first_name); } }
return done({ resp, msg, liveWithValue: leads });
