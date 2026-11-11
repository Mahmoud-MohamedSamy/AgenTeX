async (page) => { await page.mouse.click(1173, 576); await page.waitForTimeout(1200);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-add-menu.png'});
 return await page.$$eval('li, [role=menuitem], [role=option]', es => es.filter(e => e.offsetParent).map(e => e.innerText.trim()).filter(x => x && x.length < 30).slice(0, 30)); }
