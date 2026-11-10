const reqs=[];page.on('request',q=>{const u=q.url();if(u.includes('/api/v1/')&&!u.includes('/iam/auth'))reqs.push(q.method()+' '+u.split('/api/v1')[1].slice(0,180));});
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/settings/customization/skills',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.getByText('escalation_handling',{exact:true}).first().click();await page.waitForTimeout(4000);
const b1=await page.locator('button:visible').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.innerText.trim()).slice(0,30)).filter(Boolean));
await page.screenshot({path:'../ndc-2805/evidence/raw/skill-editor.png'});
const del=page.getByRole('button',{name:/^delete/i});let dlg=null;
if(await del.count()){await del.last().click();await page.waitForTimeout(5000);dlg=await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>null);await page.screenshot({path:'../ndc-2805/evidence/raw/skill-delete-dialog.png'});}
return {b1:b1.slice(-25),dlg,reqs:[...new Set(reqs)].filter(x=>!/notifications|presence|me\/|tab-settings|sandboxes|modules$|resolved|hub|crm\/status|send-as-email/.test(x))};
