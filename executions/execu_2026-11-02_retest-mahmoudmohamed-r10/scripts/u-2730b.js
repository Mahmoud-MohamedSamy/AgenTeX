const id='45d3cf65-da66-4ddb-acc8-138dd7cf6f47'; const st={};
const load=async()=>{ for(let i=0;i<40;i++){ await sleep(3000); const t=await text(); if(t.includes('QA RT r10 2730') && !/Loading\.\.\./.test(t)) break; } await sleep(3000); };
await page.goto(H+'/modules/'+T.LEADS+'/records/'+id,{waitUntil:'commit',timeout:120000}); await load();
for(let k=0;k<2;k++){ const a=page.getByRole('button',{name:'Approve',exact:true}); if(await a.count()){ await a.first().click(); await sleep(4000); const c=page.getByRole('dialog').getByRole('button',{name:/Approve|Confirm/}); if(await c.count()){ await c.first().click(); await sleep(4000);} } }
await sleep(15000); await shot('2730-2-after-approve-noreload.png');
const t1=await text(); st.noReload={blueprintShown:/ChatToWeb|ChatToOther|Blueprint/i.test(t1), status:(t1.match(/(Pending for Review|Approved|Review complete).{0,60}/)||['-'])[0]};
st.btnsNoReload=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(x=>/Chat|Web|Other|Referral/.test(x));
await page.reload({waitUntil:'commit'}); await load(); await shot('2730-3-after-reload.png');
const t2=await text(); st.reload={blueprintShown:/ChatToWeb|ChatToOther/i.test(t2)}; st.btnsReload=(await page.getByRole('button').allInnerTexts()).map(x=>x.trim()).filter(x=>/Chat|Web|Other|Referral/.test(x));
return st;
