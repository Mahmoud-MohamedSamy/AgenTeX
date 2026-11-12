async (page) => { await page.goto('https://staging-desk.taviportal.com/settings/customization/skills', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-skills.png' });
 return { url: page.url(), text: (await page.innerText('main').catch(()=>page.innerText('body'))).slice(0, 1500) }; }
