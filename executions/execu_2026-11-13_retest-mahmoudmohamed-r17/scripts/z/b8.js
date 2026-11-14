async (page) => { await page.locator('li:visible', { hasText: /^Task$/ }).first().click(); await page.waitForTimeout(6000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-task-form.png'});
 const t = await page.innerText('body'); const i = t.search(/Subject/); return t.slice(Math.max(0, i - 150), i + 900); }
