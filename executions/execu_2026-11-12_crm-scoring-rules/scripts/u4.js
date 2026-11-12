async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; const d=page.getByTestId('scoring-rule-drawer');
 // empty submit
 await d.getByRole('button',{name:/^Create$/}).click(); await page.waitForTimeout(1200); out.emptyErrors=(await d.innerText()).match(/Required\.|Add at least one field rule\.|[A-Z][^.]{0,60}\./g)?.slice(0,8);
 await page.screenshot({path:EV+'u4-empty-submit.png'});
 await d.getByLabel(/Rule name/).fill('QA SR1112 UI Web');
 const pickOpt=async(label,text)=>{await d.locator(`[aria-label="${label}"]`).first().click(); await page.waitForTimeout(800); await page.keyboard.type(text); await page.waitForTimeout(800); const o=page.locator('[role=option]').filter({hasText:new RegExp('^'+text+'$')}).first(); if(await o.count()) await o.click(); else {await page.keyboard.press('Enter');} await page.waitForTimeout(800);};
 await pickOpt('Field of entry 1','Lead Source');
 await d.locator('[aria-label="Condition of entry 1"]').first().click(); await page.waitForTimeout(800); out.ops=(await page.locator('[role=option]').allInnerTexts()).join('|'); await page.locator('[role=option]').filter({hasText:/^is$/}).first().click(); await page.waitForTimeout(600);
 await d.locator('[aria-label="Value of entry 1"]').first().click(); await page.waitForTimeout(800); out.vals=(await page.locator('[role=option]').allInnerTexts()).join('|'); await page.locator('[role=option]').filter({hasText:/web/i}).first().click(); await page.waitForTimeout(600);
 const pts=d.locator('[aria-label="Points of entry 1"]');
 const msgs=[]; for(const v of ['0','1.5','abc','10001']){await pts.fill(v); await d.getByRole('button',{name:/^Create$/}).click(); await page.waitForTimeout(800); msgs.push(v+'=>'+((await d.innerText()).match(/A whole number[^.]*\./)||['(no msg)'])[0]);}
 out.points=msgs; await pts.fill('10'); await page.screenshot({path:EV+'u4-filled.png'});
 await d.getByRole('button',{name:/^Create$/}).click(); await page.waitForTimeout(2500);
 out.toast=(await page.locator('[role=status], [role=alert], .toast').allInnerTexts().catch(()=>[])).join('|').slice(0,300);
 out.list=(await page.locator('main').innerText()).replace(/\s+/g,' ').slice(-400); await page.screenshot({path:EV+'u4-created.png'}); return out; }
