async (page) => { await page.waitForTimeout(10000); await page.screenshot({path:'z/t14.png'}); return page.url(); }
