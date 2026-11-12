async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
 // B9 switch modules via URL-driven picker (click combobox by aria-label Module)
 const pk=page.locator('[aria-label="Module"]').first(); out.pk=await pk.count();
 if(out.pk){await pk.click(); await page.waitForTimeout(800); await page.locator('[role=option]').filter({hasText:/^Customers$/}).first().click(); await page.waitForTimeout(3000); out.b9a=page.url().split('module=')[1]; out.b9list=(await page.locator('main').innerText()).replace(/\s+/g,' ').slice(-160);}
 await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3'); await page.waitForTimeout(6000);
 // C10 / C14 / J4 keyboard
 await page.getByRole('button',{name:/New Scoring Rule/}).first().click(); await page.waitForTimeout(2000); const d=page.getByTestId('scoring-rule-drawer');
 const focus=[]; for(let i=0;i<8;i++){await page.keyboard.press('Tab'); focus.push(await page.evaluate(()=>{const a=document.activeElement;return (a.getAttribute('aria-label')||a.getAttribute('placeholder')||a.innerText||a.tagName).trim().slice(0,30);}));} out.tabOrder=focus;
 out.aria=await d.locator('[aria-label]').evaluateAll(e=>e.map(x=>x.getAttribute('aria-label')).slice(0,14));
 await d.getByLabel(/Rule name/).fill('QA SR1112 C10');
 const add=d.getByRole('button',{name:/Add field rule/}); await add.click(); await add.click(); out.entries=await d.locator('[data-testid^=scoring-entry-]').count();
 const pick=async(n,label,text)=>{await d.locator(`[aria-label="${label} of entry ${n}"]`).first().click(); await page.waitForTimeout(600); await page.keyboard.type(text); await page.waitForTimeout(600); const o=page.locator('[role=option]').filter({hasText:new RegExp('^'+text+'$')}).first(); if(await o.count()) await o.click(); else await page.keyboard.press('Enter'); await page.waitForTimeout(500);};
 await pick(1,'Field','Lead Source'); await pick(2,'Field','No. of Employees'); await pick(3,'Field','Company');
 // C14: change entry 2 from number to text field resets condition
 await d.locator('[aria-label="Condition of entry 2"]').first().click(); await page.waitForTimeout(500); await page.locator('[role=option]').filter({hasText:/^is greater than$/}).first().click(); await d.locator('[aria-label="Value of entry 2"]').first().fill('5');
 await pick(2,'Field','Title'); out.c14cond=(await d.locator('[data-testid=scoring-entry-1]').innerText()).replace(/\s+/g,' ').slice(0,120); out.c14val=await d.locator('[aria-label="Value of entry 2"]').first().inputValue().catch(()=>'n/a');
 await d.getByRole('button',{name:/Remove entry 2/}).click(); await page.waitForTimeout(500); out.afterRemove=await d.locator('[data-testid^=scoring-entry-]').count();
 // J6 errors focus
 await d.getByRole('button',{name:/^Create$/}).click(); await page.waitForTimeout(1000); out.focusAfterError=await page.evaluate(()=>{const a=document.activeElement;return (a.getAttribute('aria-label')||a.innerText||a.tagName).slice(0,40);}); out.invalid=await d.locator('[aria-invalid=true]').count();
 await page.screenshot({path:EV+'u9-c10.png'}); await page.keyboard.press('Escape'); return out; }
