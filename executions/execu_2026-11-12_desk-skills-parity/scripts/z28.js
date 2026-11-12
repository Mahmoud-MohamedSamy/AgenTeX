async (page) => { await page.mouse.click(339, 157); await page.waitForTimeout(10000);
 const f = page.frames().find(x => /ShowHomePage/.test(x.url())) || page.mainFrame(); const t = await f.innerText('body').catch(()=>'');
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-layout-editor.png' });
 const i=t.indexOf('Skills'); return { i, around: i>=0? t.slice(Math.max(0,i-600), i+300): t.slice(0,1500) }; }
