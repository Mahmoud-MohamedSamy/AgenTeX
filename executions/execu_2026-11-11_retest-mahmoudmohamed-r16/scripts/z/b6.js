async (page) => { await page.mouse.click(1522, 200); await page.waitForTimeout(2000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-add-menu.png'});
 const t = await page.innerText('body'); const i = t.indexOf('Add Activity'); return t.slice(i, i + 300); }
