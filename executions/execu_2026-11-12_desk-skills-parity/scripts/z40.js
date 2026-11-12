async (page) => { const S='C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/';
 await page.mouse.click(644, 402); await page.waitForTimeout(3000);
 const f = page.frames().find(x => /ShowHomePage/.test(x.url())); const n = await f.locator('text=QA SK12 RR skill').count();
 // open preferences (… menu) and set department threshold to 3
 await page.mouse.click(1528, 74); await page.waitForTimeout(2500); await page.screenshot({ path: S + 'z-pref-a.png' });
 return { ruleLeft: n }; }
