const reqs=[]; page.on('request',r=>{ if(r.url().includes('/api/v1/')) reqs.push(r.method()+' '+r.url().split('/api/v1')[1].slice(0,140)); });
const out={};
for (const u of ['/settings/customization/notifications','/settings/channels/email','/knowledge-base/gallery']) {
  reqs.length=0; await page.goto(H+u,{waitUntil:'domcontentloaded'}); await sleep(12000);
  out[u]={reqs:[...new Set(reqs)].slice(0,40), text:(await text()).replace(/\s+/g,' ').slice(0,1500)};
}
return out;
