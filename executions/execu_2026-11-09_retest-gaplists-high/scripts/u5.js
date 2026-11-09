const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(m==='POST'&&/realtime|heartbeat|resolved-batch|query|search|classify|mentionable|summaries|lookups\/resolve/.test(u))return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
await go(H+'/views/all/tickets',5000);
await page.getByRole('button',{name:/Classic View/}).click().catch(e=>out.e1=e.message);await page.waitForTimeout(2000);
out.modes=(await page.locator('[role=menu],[role=listbox]').allInnerTexts().catch(()=>[])).join(' | ');
await page.screenshot({path:D+'d09-view-modes.png'});
const hs=page.getByText(/Handshake/).first();if(await hs.count()){await hs.click().catch(e=>out.e2=e.message);await page.waitForTimeout(8000);await page.screenshot({path:D+'d10-handshake.png'});out.board=(await page.locator('main').innerText().catch(()=>'')).slice(0,1500);}
// ticket #1798 (requester Mahmoud)
await page.goto(H+'/views/all/tickets',{waitUntil:'load'}).catch(()=>{});
return out;
