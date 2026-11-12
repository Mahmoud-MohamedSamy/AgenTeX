async (page) => { await page.locator('text=/^Layouts$/').first().click(); await page.waitForTimeout(7000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-layouts.png' }); return 'ok'; }
