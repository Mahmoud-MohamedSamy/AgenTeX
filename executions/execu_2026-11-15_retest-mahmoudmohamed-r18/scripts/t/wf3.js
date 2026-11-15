const fs=require('fs'); const I=JSON.parse(fs.readFileSync('../out/ids-crm9.json','utf8'));
const b=ctx.browser(); const c2=await b.newContext({viewport:{width:1600,height:900}}); const p=await c2.newPage();
const net=[]; p.on('response',r=>{ if(/web-forms\/public|embed\/feedback\/f\//.test(r.url())) net.push(r.request().method()+' '+r.url().replace(/(public|f)\/[^/?]+/,'$1/<k>').replace(/^https:\/\/[^/]+/,'')+' '+r.status()); });
// CRM form hosted link
const r1=await p.goto(I.wfShare,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(6000);
log('crm hosted', r1.status(), (await p.innerText('body')).slice(0,300).replace(/\s+/g,' '));
await p.screenshot({path:'../screenshots/raw/2959-1-crm-hosted.png'});
const inp=p.locator('input:visible').first(); await inp.fill('QA RT18 2959 hosted').catch(e=>log('fill',String(e).slice(0,80)));
await p.waitForTimeout(500);
await p.getByRole('button',{name:/submit|send/i}).first().click().catch(e=>log('submit',String(e).slice(0,80)));
await p.waitForTimeout(5000); log('after', (await p.innerText('body')).slice(0,300).replace(/\s+/g,' '));
await p.screenshot({path:'../screenshots/raw/2959-2-crm-submitted.png'});
// Desk Tech Webform hosted link
const p2=await c2.newPage(); p2.on('response',r=>{ if(/web-forms\/public|embed\/feedback\/f\//.test(r.url())) net.push('D '+r.request().method()+' '+r.url().replace(/(public|f)\/[^/?]+/,'$1/<k>').replace(/^https:\/\/[^/]+/,'')+' '+r.status()); });
const r2=await p2.goto(I.deskShare,{waitUntil:'domcontentloaded'}); await p2.waitForTimeout(6000);
log('desk hosted', r2.status(), (await p2.innerText('body')).slice(0,300).replace(/\s+/g,' '));
await p2.screenshot({path:'../screenshots/raw/2959-3-desk-hosted.png'});
await c2.close(); return net;
