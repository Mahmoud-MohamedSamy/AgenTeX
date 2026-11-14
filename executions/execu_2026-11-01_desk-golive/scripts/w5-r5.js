await go('/analytics/reports/builder', 9000);
await page.getByLabel('Report Name').fill('QA GL W5 report');
await page.getByRole('button', { name: 'Select Primary Module' }).click(); await sleep(1500);
await page.getByRole('option', { name: /^Tickets/ }).first().click(); await sleep(1000);
await page.getByRole('button', { name: /^Create$/ }).click();
for (let i = 0; i < 20; i++) { await sleep(2000); if (!/Loading fields/.test(await mtxt())) break; }
out.body = (await mtxt()).slice(0, 2500);
out.btns = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(Boolean)).catch(() => []);
out.tabs = await page.getByRole('tab').allInnerTexts().catch(() => []);
await shot('w5/W5-26-builder-loaded');
return fin({ out });
