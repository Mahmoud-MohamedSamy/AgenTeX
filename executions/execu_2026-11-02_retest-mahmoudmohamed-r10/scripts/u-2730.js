const id='45d3cf65-da66-4ddb-acc8-138dd7cf6f47'; const st={};
const load=async()=>{ for(let i=0;i<40;i++){ await sleep(3000); const t=await text(); if(t.includes('QA RT r10 2730') && !/Loading\.\.\./.test(t)) break; } await sleep(3000); };
await page.goto(H+'/modules/'+T.LEADS+'/records/'+id,{waitUntil:'commit',timeout:120000}); await load();
await shot('2730-1-pending.png'); st.btns=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(x=>x&&x.length<40).slice(-40);
const t=await text(); st.review=(t.match(/(review|Review).{0,300}/s)||['-'])[0].replace(/\s+/g,' ');
return st;
