await page.locator('[role=option], [role=listbox] li, [role=menuitem]').filter({ hasText: /^Priority$/ }).first().click(); await sleep(1500);
const row = (await txt()).split('Refresh')[1]?.slice(0, 300);
const valBtn = page.getByRole('button', { name: /Value|Select value|Choose/i }).first();
const ctrls = await page.locator('main button, main input').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.placeholder || e.innerText || '').trim().slice(0, 30)).slice(14, 26));
return done({ row, ctrls });
