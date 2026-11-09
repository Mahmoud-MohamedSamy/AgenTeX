// Inspect the language switcher (read-only) and the current language.
await page.goto(H + '/hq', { waitUntil: 'domcontentloaded', timeout: 150000 }); await sleep(10000);
const btns = await page.$$eval('button', b => b.map(x => (x.innerText || x.getAttribute('aria-label') || '').trim()).filter(t => /^(AR|EN)$|lang|لغة|language/i.test(t)));
await page.locator('button', { hasText: /^AR$/ }).first().click().catch(e => btns.push('click err')); await sleep(1500); await shot('lang-menu.png');
const opts = await page.$$eval('[role=menuitem], [role=option], [role=menuitemradio], [role=menu] button, [role=listbox] *', o => o.map(x => x.innerText.trim()).filter(Boolean).slice(0, 10));
return { lang: await page.evaluate(() => document.documentElement.lang), btns, opts };
