const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/prefs-test/evidence/raw/';
const out={};const body=()=>page.locator('body').innerText().catch(()=>'');
const wt=async(re,ms=90000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await body();if(re.test(t))return t;await page.waitForTimeout(1500);}return null;};
await page.setViewportSize({width:1280,height:900});
await page.goto(H+'/settings/integrations/crm',{waitUntil:'commit',timeout:120000});await wt(/Parked/);
await page.getByText('Failure Log',{exact:true}).first().click().catch(()=>{});await page.waitForTimeout(6000);
out.failure=(await body()).split('\n').filter(l=>/could not sync|records/i.test(l)).slice(0,6);
await page.getByText('Configuration Details',{exact:true}).first().click();await wt(/Preferences/);await page.waitForTimeout(2500);
const h=page.getByText('Preferences',{exact:true}).first();await h.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
await page.screenshot({path:D+'p1-preferences-original.png'});
const labels=['On deleting a CRM account','On deleting a CRM contact','On deleting a Desk account','On deleting a Desk contact'];
out.opts={};
for(const L of labels){const lab=page.getByText(L,{exact:true}).first();
 const box=lab.locator('xpath=following::*[self::select or @role="combobox" or self::button][1]');
 const o={tag:await box.evaluate(e=>e.tagName+' '+(e.getAttribute('role')||'')).catch(e=>'?'),cur:(await box.innerText().catch(()=>'')).slice(0,80)};
 if(o.tag.startsWith('SELECT')){o.options=await box.evaluate(e=>[...e.options].map(x=>x.value+' = '+x.text));}
 else {await box.click().catch(()=>{});await page.waitForTimeout(1200);o.options=(await page.locator('[role=listbox],[role=menu]').last().innerText().catch(()=>'')).split('\n');await page.keyboard.press('Escape');await page.waitForTimeout(500);}
 out.opts[L]=o;}
return out;
