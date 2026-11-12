async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.getByRole('button',{name:'Manage columns'}).click(); await page.waitForTimeout(1500);
 const pane=page.locator('[role=dialog], [role=menu], [data-radix-popper-content-wrapper]').last(); const t=await pane.innerText(); out.hasScore=/(^|\n)Score(\n|$)/.test(t); out.around=t.slice(Math.max(0,t.search(/\nScore\n/)-80), t.search(/\nScore\n/)+60).replace(/\s+/g,' ');
 const s=pane.locator('input[type=search], input[placeholder]').first(); if(await s.count()){await s.fill('Score'); await page.waitForTimeout(800); out.search=(await pane.innerText()).replace(/\s+/g,' ').slice(0,300);}
 await page.screenshot({path:EV+'uf3-columns.png'});
 const cb=pane.getByRole('checkbox',{name:/^Score$/}).first(); if(await cb.count()){await cb.check().catch(async()=>await cb.click()); out.checked=true;} else { const lab=pane.getByText(/^Score$/).first(); if(await lab.count()){await lab.click(); out.clickedLabel=true;} }
 await page.keyboard.press('Escape'); await page.waitForTimeout(2500);
 out.headers=(await page.locator('th, [role=columnheader]').allInnerTexts()).map(s=>s.trim()).filter(Boolean).join('|');
 await page.screenshot({path:EV+'uf3-list-with-score.png'}); return out; }
