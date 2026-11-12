async (page) => { const S='C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/';
 await page.mouse.click(460, 292); await page.waitForTimeout(700); await page.mouse.click(454, 740); await page.waitForTimeout(3000);
 await page.mouse.click(1528, 74); await page.waitForTimeout(2500); await page.screenshot({ path: S + 'z-pref-c.png' });
 await page.mouse.click(556, 740); await page.waitForTimeout(800); return 'ok'; }
