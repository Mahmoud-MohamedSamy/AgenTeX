await page.mouse.click(1242, 418); await sleep(1500);
const panel = (await txt()).split('Field Properties')[1]?.slice(0, 900);
await shot('1230-03-cv-on');
const cf = page.locator('button[aria-haspopup=listbox], select').filter({ hasText: /Select field|field/i }).last();
let opts = null, tag = null;
if (await cf.count()) { tag = await cf.evaluate(e => e.tagName); if (tag === 'SELECT') opts = await cf.evaluate(s => [...s.options].map(o => o.text)); else { await cf.click(); await sleep(1200); opts = await page.locator('[role=listbox] [role=option]').allInnerTexts(); } }
await shot('1230-04-controlling-field-list');
return done({ panel, tag, opts });
