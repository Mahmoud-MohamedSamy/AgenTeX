await page.getByText('Create Validation Rule', { exact: true }).last().click(); await sleep(2500);
const d = page.locator('[role=dialog]').last();
const t1 = await d.innerText();
const sw = d.getByText(/Conditional visibility/i).first();
let t2 = null, opts = null;
if (await sw.count()) { const tg = sw.locator('xpath=ancestor::*[.//button[@role="switch"] or .//input[@type="checkbox"]][1]').locator('button[role=switch], input[type=checkbox]').first(); await tg.click(); await sleep(1200); t2 = await d.innerText();
  const cf = d.locator('button[aria-haspopup=listbox], select').filter({ hasText: /Select field/ }).first();
  if (await cf.count()) { const tag = await cf.evaluate(e => e.tagName); if (tag === 'SELECT') opts = await cf.evaluate(s => [...s.options].map(o => o.text)); else { await cf.click(); await sleep(1200); opts = await page.locator('[role=listbox] [role=option]').allInnerTexts(); } } }
await shot('1230-03-controlling-field');
return done({ t1: t1.slice(0, 900), t2: t2 && t2.slice(0, 600), opts });
