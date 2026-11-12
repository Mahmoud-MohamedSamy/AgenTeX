async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.reload(); await page.waitForTimeout(8000); await page.getByRole('button',{name:'Manage columns'}).first().click(); await page.waitForTimeout(1500);
 const pane=page.locator('[role=dialog]').last(); await pane.locator('input').first().fill('Score'); await page.waitForTimeout(800);
 const row=pane.getByText(/^Score$/).first().locator('xpath=ancestor::*[.//button][1]'); await row.getByRole('button',{name:/Show/}).first().click(); await page.waitForTimeout(600);
 await pane.getByRole('button',{name:/^Apply$/}).click(); await page.waitForTimeout(3000);
 out.headers=(await page.locator('th, [role=columnheader]').allInnerTexts()).map(s=>s.trim()).filter(Boolean).join('|');
 const sb=page.getByRole('button',{name:'Sort by Score'}); if(await sb.count()){await sb.click(); await page.waitForTimeout(3000); out.sorted1=(await page.locator('tbody tr').allInnerTexts()).slice(0,4).map(s=>s.replace(/\s+/g,' ').slice(0,90)); await sb.click(); await page.waitForTimeout(3000); out.sorted2=(await page.locator('tbody tr').allInnerTexts()).slice(0,4).map(s=>s.replace(/\s+/g,' ').slice(0,90));}
 await page.screenshot({path:EV+'uf4-score-column.png'}); return out; }
