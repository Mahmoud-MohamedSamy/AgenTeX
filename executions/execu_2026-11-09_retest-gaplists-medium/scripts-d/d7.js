const reqs=[];page.on('request',q=>{const u=q.url();if(u.includes('/api/v1/')&&!u.includes('/iam/auth'))reqs.push(q.method()+' '+u.split('/api/v1')[1].slice(0,180));});
const resp={};page.on('response',async r=>{const u=r.url();if(/usage|where|reference|depend|impact/i.test(u)){try{resp[u.split('/api/v1')[1]]=(await r.text()).slice(0,1500)}catch(e){}}});
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/settings/customization/skills',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.getByRole('button',{name:'Actions for escalation_handling'}).click();await page.waitForTimeout(1500);
const menu=await page.locator('[role=menuitem]').allInnerTexts();
let dlg=null;const d=page.getByRole('menuitem',{name:/delete/i});
if(await d.count()){await d.first().click();await page.waitForTimeout(6000);dlg=await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>null);await page.screenshot({path:'../ndc-2805/evidence/raw/skill-delete-dialog.png'});}
return {menu,dlg,resp,reqs:[...new Set(reqs)].filter(x=>!/notifications|presence|me\/|tab-settings|sandboxes|modules$|resolved|hub|crm\/status|send-as-email|iam\/me/.test(x))};
