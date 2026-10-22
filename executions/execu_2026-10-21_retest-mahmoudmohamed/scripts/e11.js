const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '') + ' ' + (q.postData()||'').slice(0, 400) + ' → ' + r.status() + ' ' + (await r.text().catch(()=>'')).slice(0, 300)); }; page.on('response', f);
const d = page.locator('[role=dialog]').last();
const name = d.locator('input').first(); if (!(await name.inputValue())) await name.fill('QA RT 1325 pipeline');
for (const s of ['qualification', 'closed_won', 'closed_lost']) { await d.getByText(s, { exact: true }).first().click({ force: true }); await sleep(400); }
await shot('1325-03-picked');
const t1 = await d.innerText();
await d.locator('input[type=checkbox]').evaluate(e => e.checked).then(async c => { if (c) await d.locator('input[type=checkbox]').uncheck({ force: true }); });
await d.getByRole('button', { name: 'Save' }).click({ force: true }); await sleep(4000);
page.off('response', f);
await shot('1325-04-created');
return done({ t1: t1.slice(0, 600), resp, toasts: await page.locator('[data-sonner-toast]').allInnerTexts() });
