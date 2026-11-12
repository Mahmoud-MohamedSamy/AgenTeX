async (page) => { await page.mouse.move(900, 600); await page.mouse.wheel(0, 380); await page.waitForTimeout(1000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-newticket-skills2.png' });
 const chips = await page.evaluate(() => { const all=[...document.querySelectorAll('button, span, label')].map(e=>e.textContent.trim()); return ['QA SK12 Inact','QA SK12 LimInact','QA AS6 sk3','tier_1_support','QA SK12 S1'].map(n=>[n, all.includes(n)]); });
 return chips; }
