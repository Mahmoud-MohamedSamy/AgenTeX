async (page) => { await page.mouse.click(1566,74); await page.waitForTimeout(4000); await page.screenshot({path:'z/t15.png'}); return 'ok'; }
