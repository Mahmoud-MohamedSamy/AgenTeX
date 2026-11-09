const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(u.includes('/iam/auth/'))return r.continue();if(m==='POST'&&/realtime|heartbeat|resolved-batch|query|search|classify|mentionable|summaries|lookups\/resolve/.test(u))return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
await go(H+'/views/all/tickets',5000);
await page.getByRole('button',{name:/View$/}).first().click().catch(e=>out.e1=e.message);await page.waitForTimeout(1500);
await page.getByText('Handshake Mode').first().click().catch(e=>out.e2=e.message);
for(let i=0;i<30;i++){await page.waitForTimeout(2000);const t=await page.locator('main').innerText().catch(()=>'');if(/#\d{3,}|No tickets/.test(t))break;}
await page.waitForTimeout(3000);await page.screenshot({path:D+'d10-handshake.png'});
out.board=(await page.locator('main').innerText().catch(()=>'')).split('\n').filter(l=>/Customers|Potentials|Contacts|New|No tickets|Queue/.test(l)).slice(0,20);
// switch back to Classic (local only)
await page.getByRole('button',{name:/Handshake Mode/}).first().click().catch(()=>{});await page.waitForTimeout(1000);await page.getByText('Classic View').first().click().catch(()=>{});await page.waitForTimeout(2000);
// ticket #1798
const t=page.getByText('#1798').first();await t.click().catch(e=>out.e3=e.message);await page.waitForTimeout(8000);
out.ticketUrl=page.url();await page.screenshot({path:D+'d11-ticket.png'});
out.rail=await page.locator('button[aria-label],button[title]').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')||e.getAttribute('title')).filter(Boolean)).then(a=>[...new Set(a)].filter(x=>!/^Actions for|^Peek/.test(x)).slice(0,60));
return out;
