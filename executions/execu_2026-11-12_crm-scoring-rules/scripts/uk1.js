async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3'); await page.waitForTimeout(7000);
 out.rows=(await page.locator('tbody tr').allInnerTexts()).map(s=>s.replace(/\s+/g,' ').slice(0,70));
 const row=page.getByRole('row').filter({hasText:'QA SR1112 K1'}); await row.getByRole('button',{name:/Actions for/}).click(); await page.getByRole('menuitem',{name:'Edit'}).click(); await page.waitForTimeout(2500);
 const d=page.getByTestId('scoring-rule-drawer'); out.k1=(await d.innerText()).replace(/\s+/g,' ').slice(0,500); await page.screenshot({path:EV+'uk1-deleted-field-rule.png'});
 await d.getByRole('button',{name:/^Save$/}).click(); await page.waitForTimeout(1500); out.k1save=((await d.innerText().catch(()=>'')).match(/This field[^.]*\.|Required\.|Some entries[^.]*\./g)||[]).join('|'); await page.keyboard.press('Escape'); await page.waitForTimeout(800);
 const r2=page.getByRole('row').filter({hasText:'QA SR1112 K2'}); await r2.getByRole('button',{name:/Actions for/}).click(); await page.getByRole('menuitem',{name:'Edit'}).click(); await page.waitForTimeout(2500);
 out.k2=(await d.innerText()).replace(/\s+/g,' ').slice(0,500); await page.screenshot({path:EV+'uk2-removed-value-rule.png'}); await page.keyboard.press('Escape');
 return out; }
