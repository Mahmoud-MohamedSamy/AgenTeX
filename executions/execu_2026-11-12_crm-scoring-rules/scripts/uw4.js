async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 await page.mouse.click(580,321); await page.keyboard.press('Control+A'); await page.keyboard.type('QA SR1112 Lead form');
 await page.getByRole('button',{name:/^Continue$/}).click(); await page.waitForTimeout(4000);
 await page.screenshot({path:EV+'uw4-build.png'}); const b=(await page.innerText('body')).replace(/\s+/g,' '); const i=b.indexOf('1 Setup'); return b.slice(i,i+1800); }
