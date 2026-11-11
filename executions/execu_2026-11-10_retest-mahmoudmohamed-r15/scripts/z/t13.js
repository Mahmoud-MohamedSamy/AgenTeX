async (page) => { await page.mouse.click(802,679); await page.waitForTimeout(1500); await page.screenshot({path:'../screenshots/raw/zoho-2794-rule-target.png'});
 await page.mouse.click(830,264); await page.waitForTimeout(1200); await page.keyboard.type('Subject'); await page.waitForTimeout(1000); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
 await page.mouse.click(1043,264); await page.waitForTimeout(1500); await page.screenshot({path:'z/t13.png'}); return 'ok'; }
