async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/new', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(12000);
 const t = await page.innerText('body'); const i = t.indexOf('Skills');
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-newticket.png', fullPage: false });
 return { url: page.url().slice(0,100), i, around: i>=0 ? t.slice(i-300, i+200) : t.slice(0, 600) }; }
