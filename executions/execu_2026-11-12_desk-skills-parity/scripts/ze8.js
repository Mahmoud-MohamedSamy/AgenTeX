async (page) => { const E = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
 await page.mouse.click(600, 160); await page.waitForTimeout(2500);
 await page.screenshot({path: E + 'zoho-wf-picker-clean.png'});
 const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 return await f.evaluate(() => [...document.querySelectorAll('li')].filter(l => l.offsetParent || l.closest('ul')?.offsetParent).map(l => l.innerText.trim()).filter(t => t && t.length < 40)); }
