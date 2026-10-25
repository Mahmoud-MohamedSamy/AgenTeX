const s = page.locator('input[aria-label="Search fields"]'); const n = await s.count();
await s.first().click(); await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await sleep(900);
const id = await page.getByRole('button', { name: 'Criteria field' }).first().getAttribute('aria-controls');
const read = () => page.evaluate(id => document.getElementById(id)?.innerText.split('\n').map(x => x.trim()).filter(Boolean) || [], id);
const all = await read();
await page.keyboard.type('Look', { delay: 40 }); await sleep(900); const look = await read();
await shot('2101-00-picker');
return done({ n, cnt: all.length, all: all.slice(0, 160), look });
