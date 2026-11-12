async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 await page.getByRole('button',{name:'Open filter sidebar'}).first().click(); await page.waitForTimeout(1500);
 const side=page.locator('aside, [role=complementary], [role=dialog]').filter({hasText:/Filter/i}).last(); const st=await side.innerText(); out.hasScore=/\bScore\b/.test(st);
 const search=side.locator('input').first(); if(await search.count()){await search.fill('Score'); await page.waitForTimeout(1000);} out.after=(await side.innerText()).replace(/\s+/g,' ').slice(0,300);
 const cb=side.getByText(/^Score$/).first(); if(await cb.count()){await cb.click(); await page.waitForTimeout(1200); out.panel=(await side.innerText()).replace(/\s+/g,' ').slice(0,500);}
 await page.screenshot({path:EV+'uf5-filter.png'}); return out; }
