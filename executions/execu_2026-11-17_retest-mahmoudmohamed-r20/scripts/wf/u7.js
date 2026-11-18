const urls=[];page.on('response',r=>{if(/\.js(\?|$)/.test(r.url()))urls.push(r.url());});
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(3000);
const found=new Set();
for(const u of urls){try{const t=await (await page.request.get(u)).text();for(const m of t.matchAll(/.{100}RoleRoundRobin.{160}/g))found.add(m[0]);for(const m of t.matchAll(/.{80}OrgUnitRoundRobin.{80}/g))found.add(m[0]);}catch(e){}}
log(JSON.stringify([...found].slice(0,12)));
return {};
