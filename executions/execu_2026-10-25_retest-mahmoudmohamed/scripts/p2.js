// NDC-2122: fill two criteria rows, then find the pattern box.
const pickField = async (i, name) => { await page.getByRole('button', { name: 'Criteria field' }).nth(i).click(); await sleep(800); const s = page.getByPlaceholder(/search/i).last(); if (await s.count()) await s.fill(name); await sleep(500); await page.getByRole('option', { name, exact: true }).first().click(); await sleep(800); };
await pickField(0, 'Full Name'); await sleep(500);
const opts1 = await page.locator('#main-content input[type=text], #main-content input:not([type])').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.placeholder || '?')));
await page.getByRole('button', { name: 'Add criteria row' }).click(); await sleep(1200);
await pickField(1, 'Company'); await sleep(500);
await shot('2122-01-two-rows');
const ctrls = await page.evaluate(() => [...document.querySelectorAll('#main-content button, #main-content input, #main-content [role=combobox]')].map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.getAttribute('placeholder') || '') + ' | ' + (e.value || e.innerText || '').trim()).slice(0, 80)).slice(0, 14));
return done({ opts1, ctrls, text: ((await txt()).split('Specify criteria')[1] || '').slice(0, 700) });
