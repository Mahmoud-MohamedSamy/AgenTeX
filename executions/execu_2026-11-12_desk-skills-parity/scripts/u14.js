async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/';
 await page.goto('https://staging-desk.taviportal.com/settings/automation/assignment-rules', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 const t = await page.innerText('main').catch(()=>''); await page.screenshot({ path: E + 'tavi-ar-page.png' }); return t.slice(0, 900); }
