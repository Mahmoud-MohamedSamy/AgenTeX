async (page) => { await page.getByText('Associate Skills').first().click(); await page.waitForTimeout(2500);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-associate.png' });
 const all = await page.evaluate(() => [...document.querySelectorAll('button, span, label, li, [role=option], div')].filter(e=>e.children.length===0).map(e=>e.textContent.trim()));
 const has = n => all.includes(n);
 const r = { inactive: has('QA SK12 Inact'), otherDept: has('QA AS6 sk1'), custSupport: has('tier_1_support'), own: has('QA SK12 Lim01') };
 await page.keyboard.press('Escape'); return r; }
