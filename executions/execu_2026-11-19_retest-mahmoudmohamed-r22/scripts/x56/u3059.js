const T=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/out/3059.json','utf8'));const R={};
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
for(const [n,id,num] of [['3059-r1-a-open',T.id,'#'+T.n],['3059-r1-b-closed',T.id2,'#'+T.n2]]){await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText(num).first().waitFor({timeout:90000}).catch(()=>{});await sleep(7000);
 const t=await bt();R[n]={readOnlyBanner:(t.match(/[^.]{0,60}(view only|read-only|can view this ticket|cannot (reply|edit))[^.]{0,80}/i)||[])[0],replyAll:await page.getByRole('button',{name:/Reply All/}).count(),replyDisabled:await page.getByRole('button',{name:/Reply All/}).first().isDisabled().catch(()=>null),close:await page.getByRole('button',{name:/Close ticket/}).count(),edit:await page.getByRole('button',{name:/^Edit$/}).count(),editDisabled:await page.getByRole('button',{name:/^Edit$/}).first().isDisabled().catch(()=>null)};
 await shot(n+'.png',{timeout:90000});}
await page.getByText('RESOLUTION',{exact:true}).first().click().catch(()=>{});await sleep(3000);R.resolution=(await bt()).match(/RESOLUTION.{0,300}/)?.[0]?.slice(0,300);await shot('3059-r1-c-resolution.png',{timeout:90000});
return R;
