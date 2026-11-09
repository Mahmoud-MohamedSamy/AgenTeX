const st={leads:[],kanban:[]};
for(let k=0;k<3;k++){ const t0=Date.now(); await page.goto(H+'/modules/'+T.LEADS+'?view=48d880b4-1dcd-4665-9e96-69dd01e390ab',{waitUntil:'commit',timeout:120000}); try{ await page.locator('table tbody tr td').nth(2).waitFor({timeout:120000}); st.leads.push(Date.now()-t0);}catch(e){st.leads.push('timeout');} }
await shot('2136-leads-list.png');
for(let k=0;k<3;k++){ const t0=Date.now(); await page.goto(H+'/modules/'+T.LEADS+'?view=f24a7fd3-e04d-4f56-ad87-a587920396b2',{waitUntil:'commit',timeout:120000}); try{ await page.getByText(/^Unaccounted$/i).first().waitFor({timeout:120000}); await page.getByText('QA RT r10 2113 A',{exact:false}).first().waitFor({timeout:60000}); st.kanban.push(Date.now()-t0);}catch(e){st.kanban.push('timeout');} }
await shot('2137-kanban.png');
const api0=Date.now(); await page.evaluate(async()=>1); return st;
