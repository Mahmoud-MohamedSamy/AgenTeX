async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
 const sb=page.locator('input[placeholder*="Search" i]').first(); if(await sb.count()){await sb.fill('QA SR1112 X1'); await page.keyboard.press('Enter'); await page.waitForTimeout(4000);}
 out.allRows=(await page.locator('tbody tr').allInnerTexts()).filter(s=>/X1/.test(s)).length;
 await page.getByRole('button',{name:'Open filter sidebar'}).first().click(); await page.waitForTimeout(1500);
 const side=page.locator('aside, [role=complementary], [role=dialog]').filter({hasText:/Filter/i}).last(); await side.locator('input').first().fill('Score'); await page.waitForTimeout(1000);
 await side.getByText(/^Score$/).first().click(); await page.waitForTimeout(1000);
 await side.locator('select').filter({has:page.locator('option[value=greater_than_or_equal_to]')}).first().selectOption('greater_than_or_equal_to');
 await side.locator('input').last().fill('15'); const ap=side.getByRole('button',{name:/Apply|Search|Filter/}).last(); if(await ap.count()) await ap.click(); else await page.keyboard.press('Enter'); await page.waitForTimeout(5000);
 const rows=(await page.locator('tbody tr').allInnerTexts()).map(s=>s.replace(/\s+/g,' ')); out.hotRows=rows.filter(s=>/X1/.test(s)).map(s=>(s.match(/X1 [A-H]/)||[''])[0]); out.otherRows=rows.filter(s=>!/X1/.test(s)).length;
 await page.screenshot({path:EV+'ux1-hot-leads.png'}); return out; }
