async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
 out.headers=(await page.locator('th, [role=columnheader]').allInnerTexts()).map(s=>s.trim()).filter(Boolean).slice(0,30).join('|');
 const btns=await page.locator('button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText||'').trim()).filter(Boolean)); out.buttons=btns.filter(s=>/column|field|filter|view|customi|sort/i.test(s)).slice(0,20);
 await page.screenshot({path:EV+'uf2-list.png'}); return out; }
