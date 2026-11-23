await go('/settings/automation/workflow-rules'); await sleep(8000);
await page.getByText('AR', { exact: true }).first().click(); await sleep(1500); await shot('U6-lang-menu-ar');
const opts = await page.$$eval('[role=menuitem],[role=menuitemradio],[role=option]', o => o.map(x => x.innerText.trim()));
const en = page.getByText(/English/).first(); if (await en.count()) { await en.click(); await sleep(8000); }
await shot('U6-back-en');
return { opts, lang: await page.evaluate(() => document.documentElement.lang + ' ' + document.documentElement.dir), title: (await page.locator('main h1, main h2').first().innerText().catch(() => '')) };
