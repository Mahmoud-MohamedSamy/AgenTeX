async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 await page.getByRole('button',{name:/^Create form$/}).click(); await page.waitForTimeout(6000);
 await page.screenshot({path:EV+'uw12-created.png'}); const b=(await page.innerText('body')).replace(/\s+/g,' ');
 const links=[...new Set((b.match(/https?:\/\/[^\s"]*\/f\/[A-Za-z0-9_%-]+/g)||[]))]; const inputs=await page.locator('input,textarea').evaluateAll(e=>e.filter(x=>x.offsetParent&&/http/.test(x.value||'')).map(x=>x.value.slice(0,200)));
 const i=b.indexOf('4 Publish'); return {url:page.url(), links, inputs, text:b.slice(i,i+900)}; }
