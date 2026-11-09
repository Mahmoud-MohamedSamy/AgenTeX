const out={len:[]}; const errs=[]; page.on('pageerror',e=>errs.push(String(e).slice(0,200))); page.on('response',r=>{ if(r.status()>=400 && /api\/v1/.test(r.url())) errs.push(r.status()+' '+r.url().replace(/^.*api\/v1/,'').slice(0,100)); });
await page.goto(H+'/modules/0a2f56b2-681d-41c1-b504-d2140eecb1e8',{waitUntil:'commit',timeout:120000});
for(let i=0;i<10;i++){ await sleep(8000); out.len.push(await page.evaluate(()=>document.body.innerText.length).catch(()=> 'E')); }
out.url=page.url(); out.errs=errs.slice(0,10); out.t=(await text()).slice(0,300); return out;
