async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.getByRole('button',{name:/New Scoring Rule/}).click(); await page.waitForTimeout(2000); const d=page.getByTestId('scoring-rule-drawer'); out.drawerOpens=await d.count();
 if(out.drawerOpens){out.fields=await d.locator('[aria-label="Field of entry 1"]').count(); await d.getByLabel(/Rule name/).fill('QA SR1112 lowpriv UI'); await d.getByRole('button',{name:/^Create$/}).click(); await page.waitForTimeout(2000); out.afterCreate=(await d.innerText().catch(()=>'')).match(/permission[^.]*\.|Required\./g); await page.screenshot({path:EV+'ul2-lowpriv-create.png'}); await page.keyboard.press('Escape');}
 return out; }
