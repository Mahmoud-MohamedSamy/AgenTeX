async (page) => { const shot = n => page.screenshot({ path: `C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/${n}.png` });
 await page.mouse.click(808, 570); await page.waitForTimeout(800); await page.mouse.click(1520, 650); await page.waitForTimeout(500);
 await page.mouse.click(730, 846); await page.waitForTimeout(3000); await shot('z-rr7'); return 'ok'; }
