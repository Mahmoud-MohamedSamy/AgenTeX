async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/settings/automation/workflow-rules/new',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 out.url=page.url(); const t=(await page.innerText('body')).replace(/\s+/g,' '); out.start=t.slice(0,300);
 const sv=page.getByText(/^Score value$/).first(); out.hasScore=await sv.count(); if(out.hasScore){await sv.click(); await page.waitForTimeout(1500);}
 const picker=page.getByTestId('score-trigger-picker'); out.picker=await picker.count();
 if(out.picker){out.pickerText=(await picker.innerText()).replace(/\s+/g,' '); await picker.getByTestId('score-threshold-toggle').check(); await page.waitForTimeout(500);
  const inp=picker.getByLabel(/Score threshold/); out.default=await inp.inputValue(); const res=[];
  for(const v of ['','abc','12.5','-20','999999999999']){await inp.fill(v); await inp.blur(); await page.waitForTimeout(500); res.push(JSON.stringify(v)+'=>'+(await inp.inputValue())+' invalid='+(await inp.getAttribute('aria-invalid'))+' '+((await picker.innerText()).match(/[A-Z][a-z][^.]{0,60}(number|whole)[^.]*\./)||[''])[0]);}
  out.inputs=res; await page.screenshot({path:EV+'ug9-threshold.png'});}
 return out; }
