async (page) => { await page.mouse.click(965, 28); await page.waitForTimeout(5000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-newticket.png' });
 const t = await page.innerText('body'); const i = t.indexOf('Skills'); return { url: page.url(), i, around: i>=0 ? t.slice(Math.max(0,i-500), i+200) : t.slice(0,900) }; }
