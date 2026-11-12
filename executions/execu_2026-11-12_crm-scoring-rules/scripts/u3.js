async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.getByRole('button',{name:/New Scoring Rule/}).click(); await page.waitForTimeout(2500);
 const d=page.getByTestId('scoring-rule-drawer'); out.drawer=(await d.innerText()).replace(/\s+/g,' ').slice(0,900);
 await page.screenshot({path:EV+'u3-drawer.png'});
 const f=d.locator('[aria-label="Field of entry 1"]'); out.fcount=await f.count(); await f.first().click(); await page.waitForTimeout(1500);
 const opts=await page.locator('[role=option]').allInnerTexts(); out.nFields=opts.length; out.fields=opts.join('|').slice(0,3000);
 await page.keyboard.press('Escape'); return out; }
