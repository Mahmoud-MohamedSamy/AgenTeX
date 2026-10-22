const d = page.locator('[role=dialog]').last();
const ctrls = await d.locator('select, button[aria-haspopup], input, textarea').evaluateAll(es => es.map(e => e.tagName + ' ' + (e.type||'') + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' = ' + (e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('|') : (e.innerText || e.value || ''))));
const pick = d.locator('button[aria-haspopup], select').filter({ hasText: 'Select' }).first();
let opts = null;
if (await pick.count()) { const tag = await pick.evaluate(e => e.tagName); if (tag === 'SELECT') opts = await pick.evaluate(s => [...s.options].map(o => o.text)); else { await pick.click(); await sleep(1000); opts = await page.locator('[role=listbox] [role=option], [role=menu] [role=menuitem]').allInnerTexts(); } }
await shot('1311-03-reason-options');
// try typing free text into the picker
await page.keyboard.type('test'); await sleep(800);
const afterType = await page.locator('[role=listbox] [role=option]').allInnerTexts();
await shot('1311-04-typed-test');
return done({ ctrls, opts, afterType });
