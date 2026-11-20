const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
const reqs=[];page.on('request',q=>{const u=q.url();if(/workflow\/executions/.test(u))reqs.push(u.replace(/^https:\/\/[^/]+/,''));});
await page.goto(H+'/settings/workflow-executions',{waitUntil:'commit'});await sleep(10000);let t=await bt();R.list=t.slice(t.indexOf('Execution'),t.indexOf('Execution')+700);await shot('3105-r1-a-list.png',{timeout:90000});
R.selects=await page.locator('select, [role=combobox], button').evaluateAll(els=>els.map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()).filter(x=>x&&x.length<40)).catch(()=>[]);
R.reqs=reqs.slice(-5);return R;
