async (page) => { const E = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
 const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 await f.evaluate(() => { const l = [...document.querySelectorAll('li')].find(l => l.innerText.trim() === 'test'); l.scrollIntoView({ block: 'end' }); });
 await page.waitForTimeout(800); await page.screenshot({path: E + 'zoho-wf-picker-end.png'}); return 'ok'; }
