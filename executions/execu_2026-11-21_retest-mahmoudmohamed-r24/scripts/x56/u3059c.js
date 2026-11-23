const T=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/out/3059.json','utf8'));const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/desk\/tickets\//.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,200));});
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/'+T.id,{waitUntil:'commit'});await page.getByText('#'+T.n).first().waitFor({timeout:90000});await sleep(6000);
await page.getByRole('button',{name:/Reply All/}).first().click();await sleep(3000);
await page.getByPlaceholder(/recipient/i).first().click({timeout:15000});await page.keyboard.type('qa.rt22.probe@mailinator.com');await page.keyboard.press('Enter');await sleep(800);
await page.locator('[contenteditable=true]').first().click();await page.keyboard.type(' QA RT22 3059 view-only reply attempt');
await page.getByRole('button',{name:/Send for review/}).first().click();await sleep(5000);const t=await bt();R.toast=(t.match(/.{0,40}(not change|forbidden|can view|denied|review|sent|submitted|error).{0,140}/i)||[])[0];
await shot('3059-r1-g-send-for-review.png',{timeout:90000});return R;
