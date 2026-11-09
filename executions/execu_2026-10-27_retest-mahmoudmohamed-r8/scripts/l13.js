// NDC-1863: Delete Permanently the QA field lookup_contacts from the layout, then Save.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = '212d0ec2-9ca9-4f39-b524-30275f5fd713';
const fo = page.getByRole('button', { name: 'Field options' }).filter({ has: page.locator('xpath=.') });
const rb = await page.getByText('Lookup Contacts', { exact: true }).first().boundingBox();
const b = page.locator('button[aria-label="Field options"]:visible'); let idx = -1; const n = await b.count();
for (let i = 0; i < n; i++) { const bb = await b.nth(i).boundingBox(); if (bb && Math.abs(bb.y - rb.y) < 30) { idx = i; break; } }
await b.nth(idx).click({ force: true }); await sleep(1000); const menu = await page.locator('[role=menu], [role=menuitem]').allInnerTexts(); await shot('1863-01-menu');
await page.getByRole('menuitem', { name: /Delete Permanently/i }).click({ force: true }); await sleep(1500);
const dlg1 = await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => ''); await shot('1863-02-confirm');
const conf = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /Delete|Confirm|Yes/i }).last(); if (await conf.count()) { await conf.click(); await sleep(2500); }
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/modules/')) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' → ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 220) : '')); }; page.on('response', f);
await page.getByRole('button', { name: 'Save', exact: true }).click({ force: true }); await sleep(2000);
const dlg2 = await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '');
const sa = page.getByRole('button', { name: /Save anyway/i }); if (await sa.count()) await sa.click();
await sleep(10000); page.off('response', f);
const toasts = await page.locator('[data-sonner-toast]').allInnerTexts().catch(() => []); await shot('1863-03-after-save');
const fieldGone = !arr((await api('GET', `/modules/${L}/fields`)).j?.data).some(x => x.apiName === 'lookup_contacts');
const lay = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).find(l => l.id === Q);
return done({ menu: menu.slice(0, 12), dlg1: dlg1.slice(0, 300), dlg2: dlg2.slice(0, 300), resp, toasts, fieldGone, layoutHasIt: JSON.stringify(lay?.views || {}).includes('74e730ba'), layoutModified: lay?.lastModifiedAt });
