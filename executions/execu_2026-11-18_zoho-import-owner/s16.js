const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
const typ = async s => { await page.keyboard.press('Control+A'); await page.keyboard.press('Backspace'); await page.keyboard.type(s); await page.waitForTimeout(1500); };
const choose = async (label) => { const ls = await page.locator('li:visible').all(); for (const l of ls) { if ((await l.innerText()).replace(/\s+/g, ' ').trim() === label) { await l.click(); return 1; } } return 0; };
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
// row 2 Department
await page.locator('input[data-id="dest_None_textBox"]:visible').first().click(); await page.waitForTimeout(1500);
await typ('Department'); out.d = await choose('Department :: Department Name'); await page.waitForTimeout(2000);
// row 4 Contact Name (now the only None)
await page.locator('input[data-id="dest_None_textBox"]:visible').first().click(); await page.waitForTimeout(1500);
await typ('Contact'); out.c = await choose('Contact :: Contact Last Name'); await page.waitForTimeout(2000);
out.vals = await page.$$eval('input', es => es.filter(e=>e.offsetParent && (e.getAttribute('data-id')||'').indexOf('dest_') === 0).map(e => e.value));
await page.screenshot({ path: D + 'shots/13-A-mapped.png' });
