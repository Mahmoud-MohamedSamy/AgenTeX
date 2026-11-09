const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(/realtime|heartbeat|resolved-batch|records\/query|\/search|\/query/.test(u)&&m==='POST')return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
const C='6f553963-01d6-4b68-9fb3-143d23044c41',CID='0d050737-eb64-4394-80c2-d2b500386669';
await go(H+'/modules/'+C+'/records/'+CID,6000);out.contactUrl=page.url();
await page.screenshot({path:D+'d05-contact-page.png'});
out.contactText=(await page.locator('body').innerText()).split('\n').filter(l=>/CRM|Info|Potentials|Linked|Owner|Email|Phone|Title|Account/.test(l)).slice(0,40);
// click the CRM tab/pane if present
const crm=page.getByText(/CRM Contact Info|^CRM$/).first();if(await crm.count()){await crm.click().catch(()=>{});await page.waitForTimeout(4000);await page.screenshot({path:D+'d06-crm-pane.png'});out.pane=(await page.locator('body').innerText()).split('\n').slice(0,0);}
return out;
