const out = {}; const sel = page.locator('select').filter({ has: page.locator('option', { hasText: 'QA AEO Layout SE' }) }).first();
await sel.focus(); for (let k = 0; k < 2; k++) { await page.keyboard.press('ArrowDown'); await sleep(300); } await page.keyboard.press('Enter'); await sleep(1500);
out.selVal = await sel.evaluate(e => e.options[e.selectedIndex].text);
await sel.evaluate(e => { const o = [...e.options].find(x => x.text === 'Standard'); e.value = o.value; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); });
for (let j = 0; j < 40 && !(await txt()).includes('QA RT r8 deal'); j++) await sleep(2000); await sleep(2000); await shot('v9-deals-standard');
out.after = await sel.evaluate(e => e.options[e.selectedIndex].text).catch(() => '?'); out.found = (await txt()).includes('QA RT r8 deal'); out.url = page.url();
return done(out);
