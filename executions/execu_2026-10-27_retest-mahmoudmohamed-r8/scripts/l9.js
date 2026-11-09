const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = '212d0ec2-9ca9-4f39-b524-30275f5fd713';
const S = () => page.locator('select:visible');
await S().filter({ hasText: 'Select the relation' }).first().selectOption({ label: 'Connected To' }); await sleep(2000);
const fieldSel = S().filter({ hasText: 'None — count records only' }).first(); const fopts = await fieldSel.locator('option').allInnerTexts();
const amt = fopts.find(o => /^Amount/.test(o)); if (amt) await fieldSel.selectOption({ label: amt }); await sleep(1200);
const fnSel = S().filter({ hasText: 'Select a function' }).first(); const fnopts = await fnSel.locator('option').allInnerTexts(); await fnSel.selectOption({ label: fnopts.find(o => /^Sum/.test(o)) || fnopts[1] }); await sleep(800);
await page.getByText('GENERAL', { exact: true }).last().click({ force: true }); await sleep(800); await page.getByPlaceholder('Label in English').fill('QA RT rollup r6'); await sleep(500);
await page.getByRole('button', { name: 'Apply', exact: true }).last().click(); await sleep(1500);
const resp = []; const t0 = Date.now(); const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/modules/')) resp.push(q.method() + ' ' + q.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' → ' + r.status() + ' after ' + Math.round((Date.now() - t0) / 1000) + 's'); }; page.on('response', f);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(2000);
const sa = page.getByRole('button', { name: /Save anyway/i }); if (await sa.count()) await sa.click();
let busy = []; for (let i = 0; i < 12; i++) { await sleep(5000); busy.push((await page.getByRole('button', { name: /Sav(e|ing)/ }).first().innerText().catch(() => '?')) + '@' + (i + 1) * 5); if (resp.some(r => /layouts/.test(r))) break; }
await sleep(3000); page.off('response', f);
const toasts = await page.locator('[data-sonner-toast]').allInnerTexts().catch(() => []);
await shot('2383-01-after-save');
const lay = (await api('GET', `/modules/${L}/layouts`)).j?.data?.find?.(l => l.id === Q) || arr((await api('GET', `/modules/${L}/layouts`)).j?.data).find(l => l.id === Q);
const fl = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(x => /rollup/.test(x.datatypeKey) && /QA RT rollup r6/.test(x.labels?.en || ''));
const onLayout = fl.length ? JSON.stringify(lay?.views || {}).includes(fl[0].id) : false;
return done({ fopts: fopts.slice(0, 12), resp, busy, toasts, fields: fl.map(x => x.id + ' ' + x.apiName), onLayout, layoutModified: lay?.lastModifiedAt || lay?.updatedAt });
