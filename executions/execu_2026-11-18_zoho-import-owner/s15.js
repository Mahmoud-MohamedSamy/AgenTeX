const opts = async () => (await page.locator('li:visible').allInnerTexts()).map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
out.vals = await page.$$eval('input', es => es.filter(e=>e.offsetParent && (e.getAttribute('data-id')||'').indexOf('dest_') === 0).map(e => e.value));
await page.locator('input[data-id="dest_None_textBox"]:visible').first().click(); await page.waitForTimeout(1500);
const typ = async s => { await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.keyboard.type(s); await page.waitForTimeout(1500); };
await typ('Department'); out.dep = await opts();
await typ('Contact'); out.con = await opts();
await typ('Owner'); out.own = await opts();
await page.keyboard.press('Escape');
