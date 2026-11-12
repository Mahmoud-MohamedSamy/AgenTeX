async (page) => { const S='C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/';
 await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 await page.locator('text=/^Assignment Rules$/').first().click(); await page.waitForTimeout(1500);
 await page.locator('text=/^Round Robin$/').first().click(); await page.waitForTimeout(7000);
 const f = page.frames().find(x => /ShowHomePage/.test(x.url())); const row = f.locator('text=QA SK12 RR skill').first(); await row.hover(); await page.waitForTimeout(1500);
 await page.screenshot({ path: S + 'z-rr-del1.png' }); return 'ok'; }
