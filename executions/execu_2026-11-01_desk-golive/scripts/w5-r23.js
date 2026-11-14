await go('/profile', 10000);
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.prof = t.slice(t.indexOf('Owner'), t.indexOf('Owner') + 2500);
out.has = { tz: /time ?zone/i.test(t), date: /date format/i.test(t), sig: /signature/i.test(t) };
// W5-70 change text size to 115% then back
const before = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
await page.getByText('Aa 115%').first().click().catch(async () => await page.getByText('Large', { exact: true }).first().click()); await sleep(2000);
const mid = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize); await shot('w5/W5-70-large');
await page.getByText('Aa 100%').first().click().catch(async () => await page.getByText('Default', { exact: true }).first().click()); await sleep(2000);
const after = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize); out.font = [before, mid, after];
return fin({ out });
