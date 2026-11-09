const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(u.includes('/iam/auth/'))return r.continue();if(m==='POST'&&/realtime|heartbeat|resolved-batch|query|search|classify|mentionable|summaries|lookups\/resolve/.test(u))return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
await go(H+'/views/all/tickets/d00e653a-b67c-4c91-822f-addab07481b2',8000);
await page.screenshot({path:D+'d11-ticket.png'});
out.rail=await page.locator('button[aria-label],button[title],[role=tab]').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')||e.getAttribute('title')||e.innerText).filter(Boolean)).then(a=>[...new Set(a)].slice(0,80));
// CRM pane icon
const crmBtn=page.locator('[aria-label="CRM Contact Info"],[title="CRM Contact Info"]').first();
if(await crmBtn.count()){await crmBtn.click().catch(e=>out.e1=e.message);await page.waitForTimeout(6000);await page.screenshot({path:D+'d12-crm-pane.png'});out.pane=(await page.locator('body').innerText()).split('\n').slice(0,0);}
// comment composer
const cbtn=page.locator('button[aria-label*="comment" i],button[title*="comment" i]').first();
if(await cbtn.count()){await cbtn.click().catch(e=>out.e2=e.message);await page.waitForTimeout(3000);
 const ed=page.locator('[contenteditable=true]').last();await ed.click().catch(e=>out.e3=e.message);await page.keyboard.type('@crm',{delay:150});await page.waitForTimeout(4000);
 await page.screenshot({path:D+'d13-mention-crm.png'});out.mention=(await page.locator('[role=listbox],[role=menu],[data-mention-list],.mention-list').allInnerTexts().catch(()=>[])).join(' | ').slice(0,800);
 await page.keyboard.press('Escape');}
return out;
