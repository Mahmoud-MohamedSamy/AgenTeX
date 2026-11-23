const R={muts:[]};page.on('request',q=>{const u=q.url();if(/\/api\/v1\/desk\//.test(u)&&!['GET'].includes(q.method())&&!/heartbeat/.test(u))R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+(q.postData()||'').slice(0,300));});
await page.goto(H+'/settings/customization/skills',{waitUntil:'commit'});await page.getByText('tier_1_support').first().waitFor({timeout:90000});await sleep(2000);
await page.getByText('Agent Skills',{exact:true}).first().click();await sleep(5000);
const pen=()=>page.locator('div:has(span:text-is("ndc-staging-owner")) > button').last();
for(const k of [1,2]){await pen().click({timeout:15000}).catch(async()=>{await page.locator('div:has(> div > span:text-is("ndc-staging-owner")) button').last().click();});await sleep(2000);
 const cb=page.getByText('QA RT21 SK 3116 ok',{exact:true}).last();await cb.click();await sleep(600);await page.getByRole('button',{name:'Save',exact:true}).last().click();await sleep(4000);}
return R;
