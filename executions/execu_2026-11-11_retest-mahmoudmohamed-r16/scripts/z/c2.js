async (page) => { await page.mouse.click(1555, 80); await page.waitForTimeout(1500);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-task-more.png'});
 return await page.$$eval('li, [role=menuitem]', es => es.filter(e => e.offsetParent).map(e => e.innerText.trim()).filter(x => x && x.length < 30)); }
