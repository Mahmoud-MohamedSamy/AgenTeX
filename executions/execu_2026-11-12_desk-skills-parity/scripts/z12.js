async (page) => { const fr = page.frames(); const res = [];
 for (const f of fr) { const n = await f.locator('text=New Round Robin Assignment').count().catch(()=>0); res.push([f.url().slice(0,60), n]); if (n) { await f.locator('text=New Round Robin Assignment').first().click(); await page.waitForTimeout(5000); break; } }
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-rr2.png' }); return res; }
