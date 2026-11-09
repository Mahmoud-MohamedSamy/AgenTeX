// NDC-1863: Delete Permanently, then Save (and Save anyway if asked).
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = '212d0ec2-9ca9-4f39-b524-30275f5fd713';
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/modules/')) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' → ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 220) : '')); }; page.on('response', f);
await page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: 'Delete Permanently' }).click(); await sleep(2000);
const d2 = await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '');
const c2 = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /Delete|Confirm/i }).last(); if (d2 && /permanent|delete/i.test(d2) && await c2.count()) { await c2.click(); await sleep(2000); }
await shot('1863-03-deleted');
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(2000);
const d3 = await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '');
const sa = page.getByRole('button', { name: /Save anyway/i }); if (await sa.count()) { await sa.click(); }
await sleep(10000); page.off('response', f);
const toasts = await page.locator('[data-sonner-toast]').allInnerTexts().catch(() => []); await shot('1863-04-after-save');
const fieldGone = !arr((await api('GET', `/modules/${L}/fields`)).j?.data).some(x => x.apiName === 'lookup_contacts');
const lay = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).find(l => l.id === Q);
return done({ d2: d2.slice(0, 300), d3: d3.slice(0, 300), resp, toasts, fieldGone, layoutStillPlacesIt: JSON.stringify(lay?.views || {}).includes('74e730ba'), layoutModified: lay?.lastModifiedAt });
