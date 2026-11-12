async (page) => { const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 await f.locator('text=--Select field--').first().click(); await page.waitForTimeout(1500);
 const s = f.locator('input[placeholder*="Search"]:visible').first(); if (await s.count()) await s.fill('Subject'); await page.waitForTimeout(1000);
 await f.locator('li:visible', { hasText: /^Subject$/ }).first().click().catch(e=>null); await page.waitForTimeout(1500);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-rr4.png' }); return 'ok'; }
