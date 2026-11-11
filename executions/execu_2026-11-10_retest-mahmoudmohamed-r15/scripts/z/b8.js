async (page) => { await page.mouse.click(1360,190); await page.keyboard.type('QA Escalate'); await page.mouse.click(1204,844); await page.waitForTimeout(4000);
 await page.screenshot({path:'z/b8.png'}); return 'ok'; }
