const R={muts:[]};page.on('request',q=>{const u=q.url();if(/\/api\/v1\//.test(u)&&!['GET'].includes(q.method())&&!/heartbeat|presence|summaries|telemetry/.test(u))R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+(q.postData()||'').slice(0,400));});
const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/users-control/ticket-access',{waitUntil:'commit'});await page.getByText('Data sharing for tickets').first().waitFor({timeout:120000});await sleep(2000);
R.radios=await page.locator('input[type=radio]').evaluateAll(a=>a.map(x=>(x.closest('label')||x.parentElement).innerText.trim().slice(0,40)+'|'+x.checked));await page.locator('text=Agents see and edit the tickets they own').first().click({timeout:15000});await sleep(1500);
const btns=(await page.locator('main button:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean);R.btns=btns.slice(-10);
const save=page.getByRole('button',{name:/^Save/}).first();if(await save.count()){await save.click();await sleep(3500);}
const t=await bt();R.after=(t.match(/Data sharing for tickets.{0,400}/)||[])[0];await shot('3098-r1-e-private-restored.png',{timeout:90000});return R;
