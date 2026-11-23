const T=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/out/3059.json','utf8'));const R={};
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/'+T.id,{waitUntil:'commit'});await page.getByText('#'+T.n).first().waitFor({timeout:90000});await sleep(6000);
await page.getByRole('button',{name:/Reply All/}).first().click();await sleep(3000);let t=await bt();R.afterClick=(t.match(/.{0,80}(Send|cannot|can't|not change|Private comment|Comment).{0,120}/)||[])[0];await shot('3059-r1-d-reply-click.png',{timeout:90000});
const send=page.getByRole('button',{name:/^Send/}).first();R.send=await send.count();
if(R.send){const ed=page.locator('[contenteditable=true]').first();await ed.click().catch(()=>{});await page.keyboard.type('QA RT22 3059 reply attempt');await send.click().catch(()=>{});await sleep(3000);t=await bt();R.afterSend=(t.match(/.{0,100}(not change|forbidden|can view|denied|error).{0,120}/i)||[])[0];await shot('3059-r1-e-reply-send.png',{timeout:90000});}
await page.keyboard.press('Escape');await page.getByRole('button',{name:/^Actions/}).first().click().catch(()=>{});await sleep(1500);R.actions=(await page.locator('[role=menuitem]').allInnerTexts()).map(s=>s.trim());await shot('3059-r1-f-actions.png',{timeout:90000});
return R;
