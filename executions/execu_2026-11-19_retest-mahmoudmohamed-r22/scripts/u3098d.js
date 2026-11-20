const R={muts:[]};page.on('request',q=>{const u=q.url();if(/\/api\/v1\//.test(u)&&!['GET'].includes(q.method())&&!/heartbeat|presence|summaries|telemetry/.test(u))R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+(q.postData()||'').slice(0,300));});
const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
const CH=process.env.CH||'Own and unassigned tickets';
await page.goto(H+'/settings/users-control/agents/9d182dfa-05f3-4af7-9685-8615a2fbe537',{waitUntil:'commit'});await page.getByText('Ticket access',{exact:true}).first().waitFor({timeout:120000});await sleep(2000);
await page.getByText(CH,{exact:true}).first().scrollIntoViewIfNeeded();await page.getByText(CH,{exact:true}).first().click({timeout:15000});await sleep(1000);await page.getByRole('button',{name:'Save',exact:true}).first().click({timeout:15000});await sleep(3500);
const t=await bt();R.after=(t.match(/Ticket access.{0,600}/)||[])[0];await shot('3098-r1-d-agent-'+CH.split(' ')[0].toLowerCase()+'.png',{timeout:90000});return R;
