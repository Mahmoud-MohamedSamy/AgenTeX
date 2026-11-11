async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/directassignment',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(35000);
 await page.mouse.move(700,170); await page.waitForTimeout(1500); await page.screenshot({path:'z/r1.png'}); return 'ok'; }
