async (page) => { await page.mouse.click(1555, 80); await page.waitForTimeout(1500); await page.locator('li:visible', { hasText: /^Delete$/ }).first().click(); await page.waitForTimeout(2000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-task-delete-confirm.png'});
 const t1 = await page.innerText('body'); const i = t1.search(/delete|recycle/i);
 const btn = page.locator('button:visible', { hasText: /^(Delete|Move to Recycle Bin|Yes)$/ }).last(); const n = await btn.count(); if (n) await btn.click(); await page.waitForTimeout(6000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-after-delete.png'});
 const t = await page.innerText('body'); return { confirm: t1.slice(Math.max(0, i - 100), i + 200), clicked: n, after: (t.match(/\d* ?ACTIVITY[\s\S]{0,200}/) || [''])[0] }; }
