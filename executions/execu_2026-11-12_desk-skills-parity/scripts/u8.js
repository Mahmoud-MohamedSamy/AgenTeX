async (page) => { await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(9000);
 await page.mouse.click(342, 128); await page.waitForTimeout(3500);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-ticket-skillstab.png' });
 const panel = await page.locator('aside, [role=complementary]').allInnerTexts().catch(()=>[]); return panel.map(x=>x.slice(0,600)); }
