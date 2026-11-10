const r=await api('GET','/settings/hub?app=desk');const t=JSON.stringify(r.j);
const hits=[...t.matchAll(/.{0,160}approv.{0,160}/gi)].map(x=>x[0]);
const reqs=[];page.on('request',q=>{const u=q.url();if(u.includes('/api/v1/')&&!u.includes('/iam/auth'))reqs.push(q.method()+' '+u.split('/api/v1')[1].slice(0,160));});
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/settings/customization/skills',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.screenshot({path:'../ndc-2805/evidence/raw/skills-page.png'});
const txt=(await page.locator('body').innerText()).slice(0,1500);
return {hits:hits.slice(0,5),url:page.url(),txt,reqs:[...new Set(reqs)].filter(x=>!/notifications|presence|me\/|tab-settings|sandboxes/.test(x))};
