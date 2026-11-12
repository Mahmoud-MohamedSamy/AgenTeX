async (page) => { const shot = n => page.screenshot({ path: `C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/${n}.png` });
 await page.mouse.click(1528, 74); await page.waitForTimeout(2000); await page.mouse.click(605, 225); await page.waitForTimeout(1200); await shot('z-rr9'); return 'ok'; }
