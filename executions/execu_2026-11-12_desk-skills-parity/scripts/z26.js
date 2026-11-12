async (page) => { await page.locator('text=/^Fields List$/').first().click(); await page.waitForTimeout(8000);
 const f = page.frames().find(x => /ShowHomePage/.test(x.url())) || page.mainFrame(); let t = await f.innerText('body').catch(()=>''); if (!/Skills/.test(t)) t = await page.innerText('body');
 const i = t.indexOf('Skills');
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-fields.png' });
 return { i, around: i>=0 ? t.slice(Math.max(0,i-500), i+300) : t.slice(0,1500) }; }
