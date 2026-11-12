async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; const sel=page.locator('select').first(); if(await sel.count()){const opts=await sel.locator('option').allInnerTexts(); out.opts=opts.slice(0,6); await sel.selectOption({label:'Leads'}).catch(async()=>{});} else {await page.getByText('Select a module').first().click(); await page.waitForTimeout(800); await page.locator('[role=option]').filter({hasText:/^Leads$/}).first().click();}
 await page.waitForTimeout(800); await page.getByRole('textbox').first().fill('QA SR1112 G9 ui'); await page.getByRole('button',{name:/^Next$/}).click(); await page.waitForTimeout(3000);
 const b=(await page.innerText('body')).replace(/\s+/g,' '); out.step2=b.slice(b.indexOf('Create New Rule'),b.indexOf('Create New Rule')+500);
 const sv=page.getByText(/Score value/).first(); out.hasScore=await sv.count(); if(out.hasScore){await sv.click(); await page.waitForTimeout(1500);}
 const picker=page.getByTestId('score-trigger-picker'); out.picker=await picker.count();
 if(out.picker){out.pickerText=(await picker.innerText()).replace(/\s+/g,' '); await picker.getByTestId('score-threshold-toggle').check(); await page.waitForTimeout(500);
  const inp=picker.getByLabel(/Score threshold/); out.default=await inp.inputValue(); const res=[];
  for(const v of ['','abc','12.5','-20','999999999999999999']){await inp.fill(v); await inp.blur(); await page.waitForTimeout(500); res.push(JSON.stringify(v)+'=>'+JSON.stringify(await inp.inputValue())+' invalid='+(await inp.getAttribute('aria-invalid'))+' msg='+(((await page.innerText('body')).match(/[^.\n]{0,40}(whole number|valid number|Enter a number)[^.\n]{0,40}/i)||[''])[0]));}
  out.inputs=res; out.summary=((await page.innerText('body')).match(/This rule will be executed when the score[^.]*\./)||[''])[0]; await page.screenshot({path:EV+'ug9-threshold.png'});}
 return out; }
