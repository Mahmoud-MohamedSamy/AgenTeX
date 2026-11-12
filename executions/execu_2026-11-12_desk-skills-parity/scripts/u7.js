async (page) => { await page.getByRole('button', { name: 'Edit Skills' }).click(); await page.waitForTimeout(2500);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-ticket-editskills.png' });
 const all = await page.evaluate(() => [...document.querySelectorAll('button, span, label, li, [role=option]')].map(e=>e.textContent.trim()));
 const has = n => all.includes(n);
 const r = { inactive: has('QA SK12 Inact'), otherDept: has('QA AS6 sk1'), custSupport: has('tier_1_support'), own: has('QA SK12 Lim01') };
 await page.keyboard.press('Escape'); await page.waitForTimeout(800);
 await page.getByRole('button', { name: 'Skills' }).first().click().catch(()=>{}); await page.waitForTimeout(3000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-ticket-skillstab.png' });
 const t = await page.innerText('body'); const i = t.indexOf('Associate'); r.tab = i>=0 ? t.slice(Math.max(0,i-300), i+400) : t.slice(0,300);
 return r; }
