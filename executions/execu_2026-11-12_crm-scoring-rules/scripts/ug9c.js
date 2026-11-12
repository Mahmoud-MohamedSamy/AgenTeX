async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; const picker=page.getByTestId('score-trigger-picker'); const inp=picker.getByLabel(/Score threshold/); await inp.fill('abc'); await inp.blur();
 const cr=page.getByRole('button',{name:/^Create$/}).last(); out.disabled=await cr.isDisabled(); await cr.click().catch(e=>out.clickErr=e.message.slice(0,80)); await page.waitForTimeout(3000);
 out.url=page.url(); out.after=((await page.innerText('body')).match(/[^.\n]{0,60}(threshold|score)[^.\n]{0,80}/gi)||[]).slice(0,4); await page.screenshot({path:EV+'ug9-create-invalid.png'}); return out; }
