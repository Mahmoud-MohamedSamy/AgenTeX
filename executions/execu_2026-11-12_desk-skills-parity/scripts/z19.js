async (page) => { const shot = n => page.screenshot({ path: `C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/${n}.png` });
 await page.mouse.click(255, 73); await page.waitForTimeout(4000); await page.mouse.click(1528, 74); await page.waitForTimeout(1500); await shot('z-rr8');
 const f = page.frames().find(x => /ShowHomePage/.test(x.url())); const t = await f.innerText('body'); const i = t.indexOf('Round Robin Rules'); return t.slice(i, i+800); }
