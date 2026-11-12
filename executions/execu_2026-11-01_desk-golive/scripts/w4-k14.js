const ART = '0f683d99-2d89-4846-ae0a-ed741692cc83';
await go('/knowledge-base/articles/' + ART, 12000);
await page.locator('main button').filter({ hasText: /^Translations$/ }).first().click(); await sleep(2500);
await page.locator('main button').filter({ hasText: /^French/ }).first().click(); await sleep(3500);
const body = page.locator('[aria-label=Body]').first();
await body.click(); await page.keyboard.type('abc def 123'); await sleep(800); out.frTyped = await body.innerText();
await body.click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Delete');
await body.click(); await page.keyboard.insertText('xyz uvw'); await sleep(500); out.frInsert = await body.innerText();
await shot('w4/W4-69-typing');
// main editor Arabic typing (not saved)
const main = page.locator('[aria-label="Article content"]').first();
await main.click(); await page.keyboard.press('End'); await page.keyboard.type(' عربي١٢'); await sleep(800); out.mainTyped = (await main.innerText()).slice(-40);
return fin({ out });
