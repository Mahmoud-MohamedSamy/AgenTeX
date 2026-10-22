await go('/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', 6000);
await go('/settings/pipelines', 12000);
for (let i = 0; i < 20 && !(await page.getByRole('button', { name: 'New Pipeline' }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: 'New Pipeline' }).click(); await sleep(2000);
const d = page.locator('[role=dialog]').last();
return done({ t: await d.innerText(), inputs: await d.locator('input,select').evaluateAll(es => es.map(e => e.tagName + ' ' + e.type + ' ' + (e.placeholder||'') + ' ' + (e.value||''))), shot: await shot('1325-01-new-pipeline') });
