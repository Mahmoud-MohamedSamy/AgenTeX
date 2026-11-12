async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=6f553963-01d6-4b68-9fb3-143d23044c41',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 const b=(await page.innerText('body')).replace(/\s+/g,' '); out.banner=(b.match(/This module has 50 scoring rules[^.]*\.[^.]*\./)||['(no banner)'])[0]; out.rows=await page.locator('tbody tr').count();
 const nb=page.getByRole('button',{name:/New Scoring Rule/}).first(); out.newDisabled=await nb.isDisabled(); await page.screenshot({path:EV+'ub12-limit.png'});
 // K3 label in drawer
 await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
 const row=page.getByRole('row').filter({hasText:'QA SR1112 K3'}); await row.getByRole('button',{name:/Actions for/}).click(); await page.getByRole('menuitem',{name:'Edit'}).click(); await page.waitForTimeout(2500);
 out.k3=(await page.getByTestId('scoring-rule-drawer').innerText()).replace(/\s+/g,' ').match(/QA K3 \w+[^A-Z]{0,30}/); await page.keyboard.press('Escape');
 // F8 kanban + phone width
 await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 await page.getByRole('button',{name:'Kanban view'}).first().click(); await page.waitForTimeout(5000); const kb=(await page.innerText('body')).replace(/\s+/g,' '); out.kanbanHasScore=/Score/.test(kb); out.kanbanSample=kb.slice(kb.indexOf('QA SR1112'),kb.indexOf('QA SR1112')+160); await page.screenshot({path:EV+'uf8-kanban.png'});
 await page.getByRole('button',{name:'List view'}).first().click(); await page.waitForTimeout(3000);
 await page.setViewportSize({width:400,height:850}); await page.waitForTimeout(3000); out.phoneScroll=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2); const pb=(await page.innerText('body')).replace(/\s+/g,' '); out.phoneHasScore=/Score/.test(pb); await page.screenshot({path:EV+'uf8-phone.png'});
 await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3'); await page.waitForTimeout(6000); out.phoneRulesScroll=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2); await page.screenshot({path:EV+'uf8-phone-rules.png'});
 await page.getByRole('button',{name:/New Scoring Rule/}).first().click(); await page.waitForTimeout(2000); await page.screenshot({path:EV+'uf8-phone-drawer.png'}); await page.keyboard.press('Escape');
 await page.setViewportSize({width:1600,height:900}); return out; }
