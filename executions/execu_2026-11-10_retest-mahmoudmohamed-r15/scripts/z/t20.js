async (page, frame) => { await page.mouse.click(1002,446); await page.waitForTimeout(1000); await page.mouse.click(1290,285); await page.waitForTimeout(800);
 const fe = await frame().evaluate(()=>document.activeElement?.tagName); if (fe !== 'INPUT' && fe !== 'TEXTAREA') return 'no focus '+fe;
 await page.keyboard.type('QA RT15 2794'); await page.waitForTimeout(800); await page.screenshot({path:'../screenshots/raw/zoho-2794-rule-target-filled.png'});
 await page.mouse.click(730,845); await page.waitForTimeout(5000); await page.screenshot({path:'z/t20.png'}); return 'ok'; }
