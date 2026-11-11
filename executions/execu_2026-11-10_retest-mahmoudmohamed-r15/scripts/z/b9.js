async (page) => { await page.mouse.click(1315,229); await page.waitForTimeout(2500);
 await page.screenshot({path:'z/b9.png'}); return 'ok'; }
