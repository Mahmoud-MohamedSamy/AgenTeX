async (page) => { await page.mouse.click(325, 838); await page.waitForTimeout(2000);
 await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/1475109000000570221', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(12000);
 const t = await page.innerText('body'); const i = t.indexOf('Skills');
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-ticket181.png' });
 return { i, around: i>=0 ? t.slice(Math.max(0,i-400), i+300) : t.slice(0,800) }; }
