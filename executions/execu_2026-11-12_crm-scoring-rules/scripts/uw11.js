async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const btns=(await page.getByRole('button').allInnerTexts()).map(s=>s.trim()).filter(s=>s&&s.length<30).slice(-12);
 const lab=page.locator('label').filter({hasText:/Allow hosted link/i}).first(); const cb=lab.locator('input[type=checkbox]'); const st=await cb.count()?await cb.isChecked():null;
 await page.screenshot({path:EV+'uw11-settings-bottom.png'}); return {btns, hosted:st}; }
