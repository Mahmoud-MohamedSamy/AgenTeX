async (page) => { const S = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/';
 await page.mouse.click(1061, 647); await page.waitForTimeout(3000);
 await page.screenshot({path: S + 'ze7.png'}); return 'ok'; }
