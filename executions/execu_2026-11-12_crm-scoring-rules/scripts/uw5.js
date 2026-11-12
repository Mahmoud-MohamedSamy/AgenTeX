async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; for(const name of ['Lead Source','Industry','Email']){
  const card=page.locator('div').filter({has:page.getByText(new RegExp('^'+name+'$'))}).filter({has:page.locator('button')}); const n=await card.count();
  const c=card.last(); await c.scrollIntoViewIfNeeded().catch(()=>{}); const b=c.locator('button').last(); await b.click().catch(e=>out['err '+name]=e.message.slice(0,80)); await page.waitForTimeout(800); out[name]=n;}
 await page.waitForTimeout(1000); const prev=(await page.innerText('body')).replace(/\s+/g,' '); const i=prev.indexOf('PREVIEW'); out.preview=prev.slice(i,i+400);
 await page.screenshot({path:EV+'uw5-build.png'}); return out; }
