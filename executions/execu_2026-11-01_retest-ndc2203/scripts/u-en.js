// Restore the admin's language to English (header language switcher).
await page.goto(H + '/hq', { waitUntil: 'domcontentloaded', timeout: 150000 }); await sleep(9000);
await page.getByRole('button', { name: /^AR$/ }).first().click(); await sleep(1200);
await page.locator('[role=menuitem], [role=option], button', { hasText: /^(English|الإنجليزية|EN)$/ }).first().click(); await sleep(4000);
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(8000);
return { lang: await page.evaluate(() => document.documentElement.lang + ' ' + document.documentElement.dir), header: (await text()).slice(0, 80).replace(/\s+/g, ' ') };
