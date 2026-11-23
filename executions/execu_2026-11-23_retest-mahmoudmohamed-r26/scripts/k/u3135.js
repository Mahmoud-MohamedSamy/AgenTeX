const fs=require('fs');const X=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/3135.json','utf8'));const id=X.ids[0];const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/(desk|modules)/.test(u)&&!/heartbeat|summaries|read$/.test(u)&&r.request().method()!=='GET')R.reqs.push(new Date().toISOString().slice(11,19)+' '+r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status());});
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText('#7134').first().waitFor({timeout:120000});await sleep(7000);
await shot('3135-ui-before.png');
const lab=page.getByText('Status',{exact:true}).first();const bb=await lab.boundingBox();R.bb=bb;
await page.mouse.click(bb.x+20,bb.y+30);await sleep(1500);await shot('3135-ui-menu.png');
await page.getByRole('option',{name:/QA NDC Pending/}).first().click().catch(async()=>{await page.getByText('QA NDC Pending',{exact:true}).last().click();});
await sleep(3000);const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');R.toast=(t.match(/.{0,30}(updated|saved|changed|error|failed).{0,80}/i)||[])[0];await shot('3135-ui-after.png');
return R;
