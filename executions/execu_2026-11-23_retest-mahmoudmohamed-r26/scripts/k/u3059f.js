const fs=require('fs');const V=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/scripts/k/vo.json','utf8'));const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\//.test(u)&&!/heartbeat|summaries|read$|resolved-batch|realtime|lookups/.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300));});
await page.goto(H+'/views/all/tickets/'+V.t1,{waitUntil:'commit'});await page.getByText('#7132').first().waitFor({timeout:120000});await sleep(7000);
await page.getByRole('button',{name:/^Actions/}).first().click();await sleep(1500);await page.mouse.click(1440,140);await sleep(3000);
const d=page.locator('[role=dialog]:visible').last();const ins=d.locator('input:visible, textarea:visible');R.n=await ins.count();
if(R.n){await ins.nth(0).fill('QA RT26 3059');}
await shot('3059-f-dialog.png');
await d.getByRole('button',{name:/^Run$/}).click();await sleep(6000);
R.body=(await page.locator('body').innerText()).replace(/\s+/g,' ').match(/.{0,80}(echo|can view|not change|failed|network|forbidden|ran|queued).{0,160}/gi)?.slice(0,5);await shot('3059-f-run.png');
return R;
