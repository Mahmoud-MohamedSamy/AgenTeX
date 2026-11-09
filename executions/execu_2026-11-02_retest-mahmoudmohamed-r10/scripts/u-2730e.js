const id='6765b2a8-4384-42f1-815a-3aa2de0e243e'; const st={};
const load=async()=>{ for(let i=0;i<40;i++){ await sleep(3000); const t=await text(); if(t.includes('QA RT r10 2730') && !/Loading\.\.\./.test(t)) break; } await sleep(3000); };
await page.goto(H+'/modules/'+T.LEADS+'/records/'+id,{waitUntil:'commit',timeout:120000}); await load();
await page.getByText('ChatToOther',{exact:true}).first().click(); await sleep(4000);
const d=page.getByRole('dialog'); st.dlg=(await d.innerText().catch(()=>'')).slice(0,500).replace(/\s+/g,' ');
const ex=d.getByRole('button',{name:/Execute/}); st.executeDisabled=await ex.isDisabled(); await shot('2730-13-chattoother-dialog.png');
st.invalidShown=/Invalid Phone Number/.test(st.dlg);
if(!st.executeDisabled){ await ex.click(); await sleep(8000); }
const t=await text(); st.source=(t.match(/LEAD SOURCE\s*\n\s*(\w+)/)||[])[1]; await shot('2730-14-after-chattoother.png');
return st;
