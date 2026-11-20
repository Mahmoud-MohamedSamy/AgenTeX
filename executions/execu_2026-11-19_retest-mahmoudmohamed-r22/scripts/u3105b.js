const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
const reqs=[];page.on('request',q=>{const u=q.url();if(/workflow\/executions/.test(u))reqs.push(u.replace(/^https:\/\/[^/]+/,''));});
await page.goto(H+'/settings/workflow-executions',{waitUntil:'commit'});await page.getByText('Any outcome').first().waitFor({timeout:90000});await sleep(3000);
await page.getByText('Any outcome').first().click();await sleep(1500);R.options=(await page.locator('[role=option],[role=menuitem],li').allInnerTexts()).map(s=>s.trim()).filter(s=>s&&s.length<40).slice(0,15);
await shot('3105-r1-b-outcome-options.png',{timeout:90000});
await page.getByText(/Failed only/i).first().click();await sleep(7000);const t=await bt();R.url=page.url().replace(H,'');const i=t.indexOf('When Rule');R.rows=t.slice(i,i+900);R.reqs=reqs.slice(-3);
await shot('3105-r1-c-failed-only.png',{timeout:90000});
const first=page.locator('table tbody tr').first();if(await first.count()){await first.click();await sleep(6000);const u=await bt();const k=u.indexOf('Execution');R.run=u.slice(k,k+900);R.runUrl=page.url().replace(H,'');await shot('3105-r1-d-failed-run.png',{timeout:90000});
 const back=page.getByText('Back to history').first();if(await back.count()){await back.click();await sleep(5000);R.backUrl=page.url().replace(H,'');R.backOutcome=(await bt()).match(/Failed only|Any outcome/)?.[0];}}
return R;
