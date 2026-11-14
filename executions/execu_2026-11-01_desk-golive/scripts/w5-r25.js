await go('/settings/personal/account-information', 14000);
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('Account'); out.txt = t.slice(-1500);
out.has = { tz: /time ?zone/i.test(t), date: /date format/i.test(t), lang: /language/i.test(t), country: /country/i.test(t) };
await shot('w5/W5-71-defaults');
return fin({ out });
