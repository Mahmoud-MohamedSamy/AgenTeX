const R={reqs:[]};const t0=Date.now();page.on('request',q=>{const u=q.url();if(/mass|bulk|job/i.test(u))R.reqs.push('+'+(Date.now()-t0)+'ms '+q.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' ids='+(((q.postData()||'').match(/[0-9a-f]{8}-[0-9a-f-]{27}/g)||[]).length));});
page.on('requestfailed',q=>{if(/mass|bulk/i.test(q.url()))R.reqs.push('FAILED +'+(Date.now()-t0)+'ms '+(q.failure()&&q.failure().errorText));});
const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records',{waitUntil:'commit'});await sleep(9000);
const s=page.getByPlaceholder(/search/i).first();await s.fill('QA RT22 2807');await page.keyboard.press('Enter');await sleep(5000);
await shot('crm-2807-a-list.png',{timeout:90000});R.head=(await bt()).slice(0,300);
const all=page.locator('thead input[type=checkbox], [role=columnheader] input[type=checkbox]').first();R.hasAll=await all.count();if(R.hasAll){await all.check().catch(()=>all.click());await sleep(1500);}
R.sel=(await bt()).match(/\d+ selected[^.]{0,80}/)?.[0];await shot('crm-2807-b-selected.png',{timeout:90000});
const more=page.getByRole('button',{name:/Mass Update|More|⋯|Actions/}).first();R.btns=(await page.locator('button:visible').allInnerTexts()).map(x=>x.trim()).filter(x=>x&&x.length<30).slice(0,40);
return R;
