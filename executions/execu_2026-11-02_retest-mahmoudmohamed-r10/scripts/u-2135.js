const st={errs:[]}; page.on('console',m=>{ if(m.type()==='error') st.errs.push(m.text().slice(0,200)); }); page.on('pageerror',e=>st.errs.push('PAGEERROR '+String(e).slice(0,200)));
st.ua=await page.evaluate(()=>navigator.userAgent);
await page.goto(H+'/modules/'+T.LEADS+'?view=f24a7fd3-e04d-4f56-ad87-a587920396b2',{waitUntil:'commit',timeout:120000});
for(let i=0;i<100;i++){ await sleep(3000); const t=await text(); if(/records/.test(t) && !/Loading\.\.\./.test(t)) break; } await sleep(5000);
await page.mouse.click(1463,165); for(let i=0;i<30;i++){ await sleep(2000); if(/Unaccounted/i.test(await text())) break; } await sleep(4000); await shot('2135-ff-kanban.png');
st.kanban=/Unaccounted/i.test(await text());
await page.mouse.click(1430,165); await sleep(8000); await shot('2135-ff-list.png'); st.list=/Full Name/.test(await text());
return st;
