await page.goto(H + '/dashboards', { waitUntil: 'domcontentloaded' }); await sleep(5000);
await page.locator('button', { hasText: /^New dashboard$/ }).first().click(); await sleep(4000);
await shot('s03-new');
const t = (await page.innerText('body')).replace(/\s+/g, ' ');
const dlg = await page.locator('[role=dialog]').count();
return { url: page.url().replace(H, ''), dlg, text: dlg ? (await page.locator('[role=dialog]').first().innerText()).replace(/\s+/g, ' ').slice(0, 1500) : t.slice(t.indexOf('Meetings') + 8, t.indexOf('Meetings') + 1500) };
