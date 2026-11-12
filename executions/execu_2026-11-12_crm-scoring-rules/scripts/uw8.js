async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 await page.getByRole('button',{name:/^Continue$/}).click(); await page.waitForTimeout(4000);
 await page.screenshot({path:EV+'uw8-settings.png',fullPage:true}); const b=(await page.innerText('body')).replace(/\s+/g,' '); const i=b.indexOf('3 Settings'); 
 const sw=await page.getByRole('switch').evaluateAll(e=>e.map(x=>(x.getAttribute('aria-label')||x.closest('label,div')?.innerText||'').trim().slice(0,60)+':'+x.getAttribute('aria-checked')));
 return {text:b.slice(i,i+1800), switches:sw}; }
