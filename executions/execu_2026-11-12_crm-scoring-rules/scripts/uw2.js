async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const btn=page.getByRole('button',{name:/New (advanced )?form|New web form|Create/i}).first(); const names=await page.getByRole('button').allInnerTexts(); 
 await btn.click(); await page.waitForTimeout(4000); await page.screenshot({path:EV+'uw2-new.png'});
 const b=(await page.innerText('body')).replace(/\s+/g,' '); return {buttons:names.filter(s=>/form|new/i.test(s)).slice(0,8), url:page.url(), text:b.slice(b.lastIndexOf('Web Forms'), b.lastIndexOf('Web Forms')+900)}; }
