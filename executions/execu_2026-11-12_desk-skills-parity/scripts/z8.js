async (page) => { const out = []; for (const f of page.frames()) { const t = await f.innerText('body').catch(()=>''); if (/skill/i.test(t) && f !== page.mainFrame()) out.push({ u: f.url().slice(0,100), t: t.slice(0, 3000) }); } 
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/z-skills.png' }); return out; }
