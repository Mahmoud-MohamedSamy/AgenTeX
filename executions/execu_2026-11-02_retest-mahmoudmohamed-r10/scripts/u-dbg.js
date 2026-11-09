const out={len:[]}; const errs=[]; page.on('pageerror',e=>errs.push(String(e).slice(0,200))); page.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,200)); });
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
for(let i=0;i<9;i++){ await sleep(10000); out.len.push(await page.evaluate(()=>document.body.innerText.length).catch(e=>'ERR')); }
out.errs=errs.slice(0,8); out.url=page.url(); return out;
