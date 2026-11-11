async (page) => { await page.mouse.click(509,146); await page.waitForTimeout(2500); await page.screenshot({path:'z/r3.png'}); return 'ok'; }
