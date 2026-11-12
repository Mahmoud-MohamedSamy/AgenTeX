async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; const side=page.locator('aside, [role=complementary], [role=dialog]').filter({hasText:/Filter/i}).last();
 await side.locator('select').filter({has:page.locator('option[value=greater_than_or_equal_to]')}).first().selectOption('greater_than_or_equal_to'); await page.waitForTimeout(800);
 const inp=side.locator('input[type=number], input[inputmode=numeric], input').last(); await inp.fill('1000'); await page.waitForTimeout(500);
 const apply=side.getByRole('button',{name:/Apply|Search|Filter/}).last(); if(await apply.count()) await apply.click(); else await page.keyboard.press('Enter');
 await page.waitForTimeout(4000); out.rows=(await page.locator('tbody tr').allInnerTexts()).map(s=>s.replace(/\s+/g,' ').slice(0,110)); await page.screenshot({path:EV+'uf6-filter-score.png'}); return out; }
