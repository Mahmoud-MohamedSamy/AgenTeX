const st={};
await page.goto(H+'/settings/modules-and-fields',{waitUntil:'commit',timeout:120000}); for(let i=0;i<80;i++){ await sleep(3000); const t=await text(); if(/Modules and Fields|permission|Create New Module/i.test(t) && !/Loading\.\.\./.test(t)) break; } await sleep(4000);
await shot('2219-desk-agent-modules.png'); const t=await text(); st.url=page.url(); st.noPerm=/don't have permission|not have permission|Access denied/i.test(t); st.createBtn=/Create New Module/.test(t); st.snip=t.replace(/\s+/g,' ').slice(0,400);
return st;
