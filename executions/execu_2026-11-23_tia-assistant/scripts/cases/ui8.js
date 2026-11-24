await go('/'); await page.waitForTimeout(3000);
const b = page.locator('header button, nav button', { hasText: /^AR$/ }).first(); log('ar btn', await b.count());
await b.click(); await page.waitForTimeout(1000); await shot('M-restore-menu');
const opts = await page.locator('[role=menuitem], [role=option], [role=menuitemradio]').allInnerTexts(); log('opts', opts.join(' | '));
await page.locator('[role=menuitem], [role=option], [role=menuitemradio]', { hasText: /English|الإنجليزية|EN/ }).first().click(); await page.waitForTimeout(3500);
log('dir', await page.evaluate(() => document.documentElement.dir), 'btn', (await page.locator('header button, nav button', { hasText: /^(AR|EN)$/ }).first().innerText()));
return 'ok';
