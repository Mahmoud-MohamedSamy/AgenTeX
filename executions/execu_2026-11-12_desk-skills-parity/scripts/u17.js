async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/';
 await page.mouse.click(1494, 438); await page.waitForTimeout(4000);
 await page.screenshot({ path: E + 'tavi-rr-rule-edit.png' });
 const t = await page.innerText('body'); const i = t.indexOf('Test User 1'); return [page.url(), i, i>=0 ? t.slice(i-400, i+100) : t.slice(0,300)]; }
