const st={kanban:[]};
for(let k=0;k<3;k++){ await page.goto(H+'/modules/'+T.LEADS,{waitUntil:'commit',timeout:120000}); for(let i=0;i<100;i++){ await sleep(2000); const t=await text(); if(/Full Name/.test(t)&&/records/.test(t)&&!/Loading/.test(t)) break; } await sleep(1500);
 const t0=Date.now(); await page.mouse.click(1463,165); let ok=false; for(let i=0;i<240;i++){ await sleep(500); const t=await text(); if(/Unaccounted/i.test(t) && /No Answer/.test(t) && !/Loading/.test(t) && /(No Leads found|QA RT)/.test(t)) { ok=true; break; } } st.kanban.push(ok?Date.now()-t0:'>120s'); await shot('2137-kanban-'+k+'.png'); await page.mouse.click(1430,165); await sleep(3000); }
return st;
