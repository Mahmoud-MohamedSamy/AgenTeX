async (page) => { await page.keyboard.press('Escape'); await page.mouse.click(1290,844); await page.waitForTimeout(2500);
 await page.screenshot({path:'z/b14a.png'}); await page.mouse.click(1552,444); await page.waitForTimeout(4000);
 await page.screenshot({path:'../screenshots/raw/zoho-2729-task-new.png'}); return 'ok'; }
