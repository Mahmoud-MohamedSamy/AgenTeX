const P = '#live-field-0363c341-66a7-4dd2-8036-19405fea46e7', S = '#live-field-429bcc3f-3594-470d-9081-124ea4485cbc', N = '#live-field-fb4a9dcd-edce-4ceb-9202-5880a035447a';
const res = {};
res.pickHtml = (await page.locator(P).innerHTML()).slice(0, 500);
const sel = page.locator(P + ' select');
if (await sel.count()) { await sel.selectOption('Red'); } else { await page.locator(P + ' button, ' + P + ' [role=combobox]').first().click(); await sleep(700); await page.locator('[role=option]', { hasText: /^Red$/ }).first().click(); }
await sleep(1000);
const ssel = page.locator(S + ' select');
if (await ssel.count()) res.childOptions = await ssel.evaluate(s => [...s.options].map(o => o.text));
else { await page.locator(S + ' button, ' + S + ' [role=combobox]').first().click(); await sleep(800); res.childOptions = await page.$$eval('[role=option]', os => os.map(o => o.innerText.trim())); await shot('rec-child-options'); await page.keyboard.press('Escape'); }
return res;
