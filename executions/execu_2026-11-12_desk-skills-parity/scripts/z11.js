async (page) => { await page.reload({ waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 await page.locator('text=/^Assignment Rules$/').first().click(); await page.waitForTimeout(1500);
 const subs = await page.$$eval('a, li, span', es => es.filter(e => /round robin|direct assignment/i.test(e.textContent) && e.textContent.length < 40).map(e => e.textContent.trim()));
 await page.locator('text=/^Round Robin/').first().click().catch(()=>{}); await page.waitForTimeout(6000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-rr.png' });
 return { subs: [...new Set(subs)], url: page.url() }; }
