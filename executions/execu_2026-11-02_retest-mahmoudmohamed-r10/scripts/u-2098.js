const st={}; const L=T.LEADS;
const go=async q=>{ await page.goto(H+'/modules/'+L+q,{waitUntil:'commit',timeout:120000}); for(let i=0;i<60;i++){ await sleep(3000); const t=await text(); if(/Total Records|records?\b/i.test(t) && !/Loading\.\.\./.test(t) && /Leads/.test(t)) break; } await sleep(5000); };
const cur=async()=>{ const t=await text(); return { url:decodeURIComponent(page.url()).replace(H,''), toast:(t.match(/That view[^\n]*/)||[])[0], viewName:(await page.locator('[aria-label*="view" i], button:has-text("QA RT r10 2098"), button:has-text("All Leads")').first().innerText().catch(()=>'' )).trim().slice(0,60), allLeads:/All Leads/.test(t.slice(0,2500)), lastShown:/QA RT r10 2098 last/.test(t.slice(0,2500)), total:(t.match(/Total Records\s*(\d+)/)||[])[1] }; };
await go('?view=3b1f892f-43ea-4bdd-b91e-a8478db842a3'); st.own=await cur(); await shot('2098-1-own.png');
await go('?view=e1f676d0-24cf-4876-a094-d37e417f4504'); st.deleted=await cur(); await shot('2098-2-deleted.png');
await go('?view=3b1f892f-43ea-4bdd-b91e-a8478db842a3'); 
await go('?view=8709f4b3-5298-4c5f-a449-4267d54fef6f'); st.foreign=await cur(); st.foreignLeak=/u2 private/.test(await text()); await shot('2098-3-foreign.png');
return st;
