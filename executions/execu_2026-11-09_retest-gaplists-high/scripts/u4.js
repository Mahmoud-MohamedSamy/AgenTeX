const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(m==='POST'&&/realtime|heartbeat|resolved-batch|query|search|classify|mentionable/.test(u))return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
// Agents page: light agent counts
await go(H+'/settings/agents',5000);await page.screenshot({path:D+'d07-agents.png'});
out.agents=(await page.locator('body').innerText()).split('\n').filter(l=>/agent/i.test(l)).slice(0,12);
// Ticket list + view modes
await go(H+'/views/all/tickets',6000);await page.screenshot({path:D+'d08-tickets.png'});
const btns=await page.locator('button[aria-label],button[title]').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.getAttribute('title'))).filter(Boolean));out.btns=[...new Set(btns)].slice(0,60);
return out;
