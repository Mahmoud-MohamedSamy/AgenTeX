async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/roundrobin', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(10000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-rr.png' });
 return page.url(); }
