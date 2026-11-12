async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; let alerted=false; page.on('dialog',async dl=>{alerted=true; await dl.dismiss();});
 await page.reload(); await page.waitForTimeout(6000);
 const row=page.getByRole('row').filter({hasText:'onerror'}); out.rowText=(await row.innerText()).replace(/\s+/g,' ').slice(0,120);
 await row.getByRole('button',{name:/Actions for/}).click(); await page.getByRole('menuitem',{name:'Delete'}).click(); await page.waitForTimeout(1200);
 const dlg=page.locator('[role=alertdialog], [role=dialog]').last(); out.dialog=(await dlg.innerText()).replace(/\s+/g,' ').slice(0,300); await page.screenshot({path:EV+'u6-delete-dialog-xss.png'});
 await dlg.getByRole('button',{name:/^Cancel$/}).click(); await page.waitForTimeout(800); out.stillThere=await page.getByRole('row').filter({hasText:'onerror'}).count();
 await page.getByRole('row').filter({hasText:'onerror'}).getByRole('button',{name:/Actions for/}).click(); await page.getByRole('menuitem',{name:'Delete'}).click(); await page.waitForTimeout(800);
 await page.locator('[role=alertdialog], [role=dialog]').last().getByRole('button',{name:/^Delete$/}).click(); await page.waitForTimeout(2000);
 out.toast=(await page.locator('[role=status], [role=alert]').allInnerTexts()).join('|').slice(-150); out.gone=await page.getByRole('row').filter({hasText:'onerror'}).count(); out.alerted=alerted; return out; }
