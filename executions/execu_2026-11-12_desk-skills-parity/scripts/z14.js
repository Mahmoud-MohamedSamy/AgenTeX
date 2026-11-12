async (page) => { const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 await f.fill('#ruleName', 'QA SK12 RR skill'); await f.locator('text=Ticket Update').first().click(); await page.waitForTimeout(500);
 await f.locator('text=Add target').first().click(); await page.waitForTimeout(4000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-rr3.png' }); return 'ok'; }
