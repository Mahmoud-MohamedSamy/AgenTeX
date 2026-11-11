async (page) => { await page.mouse.click(1463,73); await page.waitForTimeout(12000); await page.screenshot({path:'z/t5.png'}); return 'ok'; }
