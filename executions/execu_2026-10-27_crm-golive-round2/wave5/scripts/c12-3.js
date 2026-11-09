const res = {};
await page.keyboard.press('Control+A'); await page.keyboard.type('QA F1'); await page.keyboard.press('Enter'); await sleep(800);
await page.locator('main button', { hasText: /^Add Modules$/ }).click(); await sleep(1500);
await shot('c12-add-modules');
res.dlg = (await page.innerText('body')).replace(/\s+/g, ' ').match(/(Add Modules|Select modules).{0,900}/)?.[0];
return res;
