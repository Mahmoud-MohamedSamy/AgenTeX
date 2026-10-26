const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', ID = '5712b381-59ee-4cb4-b025-b7a834d74d86';
await page.locator('[role=option],[role=menuitem]').filter({ hasText: /^1$/ }).first().click(); await sleep(1500);
const dlg = await page.evaluate(() => document.querySelector('[role=dialog], [role=alertdialog]')?.innerText.slice(0, 600) || null);
await shot('1312-03-stage-question');
const resp = []; const f = async r => { const q = r.request(); if (/records\/|pipeline/.test(q.url()) && q.method() !== 'GET') resp.push(q.method() + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 260)); }; page.on('response', f);
const ok = page.getByRole('dialog').getByRole('button', { name: /Change|Move|Confirm|Save|Apply/ }).last();
if (await ok.count()) { await ok.click(); await sleep(4000); }
page.off('response', f);
const toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim()));
const stored = Object.fromEntries(((await api('GET', `/modules/${D}/records/${ID}`)).j?.data?.data || []).filter(x => /^(pipeline|stage)$/.test(x.field)).map(x => [x.field, x.value.value]));
await shot('1312-04-after-confirm');
return done({ dlg, resp, toasts, stored });
