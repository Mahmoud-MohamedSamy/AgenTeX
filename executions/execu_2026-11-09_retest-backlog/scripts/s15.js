const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});const calls=[];
page.on('request',r=>{const u=r.url();if(/api\/v1/.test(u)&&/43004ce2|lookup/.test(u))calls.push(r.method()+' '+u.replace(/.*api\/v1/,'').slice(0,200)+' '+(r.postData()||'').slice(0,300));});
await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('Case Information',{exact:true}).or(page.getByText('Ticket Information',{exact:true})).first().waitFor({timeout:240000});await sleep(3000);
await page.getByText('Select department…').first().click({timeout:20000});await sleep(1500);
await page.keyboard.type('QA RT9 2174');await sleep(3000);await page.getByText('QA RT9 2174 Dept').last().click({timeout:20000});await sleep(6000);
const lk=page.locator('xpath=(//*[normalize-space(text())="QA RT9 Contact"])[1]/following::*[self::input or self::button][1]');await lk.scrollIntoViewIfNeeded();await lk.click();await sleep(5000);
o.opts=await page.locator('[role=option]').allInnerTexts();
if(!o.opts.length)o.dlg=(await page.locator('[role=dialog],[role=listbox]').last().innerText().catch(()=>'')).slice(0,1500);
await page.screenshot({path:SS+'2174-08c-lookup-picker.png'});
// pick list options on form
await page.keyboard.press('Escape');await sleep(1000);
const pk=page.locator('xpath=(//*[normalize-space(text())="QA RT9 Pick"])[1]/following::button[1]');await pk.scrollIntoViewIfNeeded();await pk.click();await sleep(2000);
o.pickOpts=await page.locator('[role=option]').allInnerTexts();await page.keyboard.press('Escape');
o.calls=calls.slice(0,6);return o;
