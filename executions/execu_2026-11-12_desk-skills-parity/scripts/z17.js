async (page) => { const shot = n => page.screenshot({ path: `C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/${n}.png` });
 await page.mouse.click(999, 400); await page.waitForTimeout(800);
 await page.mouse.click(1280, 204); await page.keyboard.type('QASK12RR'); await page.waitForTimeout(500);
 await page.mouse.click(1310, 323); await page.waitForTimeout(1200);
 await page.mouse.click(729, 518); await page.waitForTimeout(1500); await shot('z-rr6'); return 'ok'; }
