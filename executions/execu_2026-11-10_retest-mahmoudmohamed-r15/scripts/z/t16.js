async (page) => { await page.mouse.click(1570,73); await page.waitForTimeout(2000); await page.mouse.click(830,285); await page.waitForTimeout(2000); await page.screenshot({path:'z/t16.png'});
 const inputs = await page.$$eval('input', a=>a.filter(i=>i.offsetParent).map(i=>({ph:i.placeholder, v:i.value, r:i.getBoundingClientRect().toJSON()}))); return inputs.slice(0,15); }
