const id='45d3cf65-da66-4ddb-acc8-138dd7cf6f47'; const st={};
const load=async()=>{ for(let i=0;i<40;i++){ await sleep(3000); const t=await text(); if(t.includes('QA RT r10 2730') && !/Loading\.\.\./.test(t)) break; } await sleep(3000); };
await page.goto(H+'/modules/'+T.LEADS+'/records/'+id,{waitUntil:'commit',timeout:120000}); await load();
await page.getByText('Respond',{exact:true}).first().click(); await sleep(4000); await shot('2730-4-respond.png');
await page.getByRole('menuitem',{name:'Approve'}).click().catch(()=>page.getByText('Approve',{exact:true}).last().click()); await sleep(3000); await shot('2730-4b-approve-dialog.png');
st.dlg=(await page.getByRole('dialog').allInnerTexts().catch(()=>[])).join(' ').slice(0,400).replace(/s+/g,' ');
const c=page.getByRole('dialog').getByRole('button',{name:/^(Approve|Confirm|Submit)/}); st.c=await c.count(); if(st.c){ await c.last().click(); }
for(let i=0;i<10;i++){ await sleep(3000); if(/ChatToWeb|ChatToOther/.test(await text())) { st.bpAppearedAfterSec=(i+1)*3; break; } }
await shot('2730-5-after-approval-noreload.png');
const t=await text(); st.noReload={bp:/ChatToWeb|ChatToOther/.test(t), status:(t.match(/(Approved|Pending approval|Waiting for your response)/)||['-'])[0]};
return st;
