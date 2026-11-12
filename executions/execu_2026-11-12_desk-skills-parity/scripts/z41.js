async (page) => { const S='C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/';
 await page.mouse.click(605, 225); await page.waitForTimeout(1200); await page.mouse.click(600, 261); await page.keyboard.type('3'); await page.waitForTimeout(1000);
 await page.screenshot({ path: S + 'z-pref-b.png' }); return 'ok'; }
