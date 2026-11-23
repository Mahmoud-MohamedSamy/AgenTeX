const fs=require('fs');const X=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/3135.json','utf8'));const id=X.ids[0];const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/(desk|modules)/.test(u)&&!/heartbeat|summaries|read$/.test(u)&&r.request().method()!=='GET')R.reqs.push(new Date().toISOString().slice(11,19)+' '+r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status());});
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText('#7134').first().waitFor({timeout:120000});await sleep(8000);
const lab=page.getByText('Status',{exact:true}).first();const bb=await lab.boundingBox();
await page.mouse.click(bb.x+30,bb.y+36);await sleep(1500);await shot('3135-ui2-menu.png');
await page.getByPlaceholder('Search Status').fill('QA NDC Pending');await sleep(1000);
await page.locator('[role=option], li, div').filter({hasText:/^QA NDC Pending$/}).last().click();
await sleep(4000);R.chip=await page.getByText('Status',{exact:true}).first().locator('xpath=..').innerText().catch(()=>'');await shot('3135-ui2-after.png');
return R;
