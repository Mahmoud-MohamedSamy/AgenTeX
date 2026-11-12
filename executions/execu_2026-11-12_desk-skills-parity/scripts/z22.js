async (page) => { const shot = n => page.screenshot({ path: `C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/${n}.png` });
 await page.mouse.click(600, 261); await page.keyboard.type('10'); await page.waitForTimeout(1000); await shot('z-rr10'); return 'ok'; }
