// Item 6 UI: delete a contact with 1 ticket from the Customers page; capture any warning. Cleanup after.
module.exports=async()=>{const R={};const PW=ms=>pg.waitForTimeout(ms);const RAW=OUT+'/../screenshots/raw/cl-c6-';
 const CMID='43004ce2-577f-4eda-b00a-0750fe40c3d4',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';const ST=Date.now().toString(36).slice(-5);const NAME='QA CL6 contact '+ST;
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const cid=(await api('POST','/modules/'+CMID+'/records',body({last_name:NAME,email:'qa.cl6.'+ST+'@example.com'}))).j.data.id;LED('CL C6b contact '+cid);
 const tid=(await api('POST','/modules/'+T+'/records',body({subject:'QA CL6 ticket UI '+ST,department:CS,status:'Open',priority:'Medium',contact_id:cid,owner:IDS.O}))).j.data.id;LED('CL C6b ticket '+tid);
 try{await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/hq',{waitUntil:'commit',timeout:60000});await PW(10000);
  await pg.getByText(/^Customers$/).first().click();await PW(8000);R.listUrl=pg.url();
  const s=pg.locator('input[type=search],input[placeholder*="Search" i]').first();if(await s.count()){await s.fill(NAME);await PW(5000);}
  await pg.getByText(NAME).first().click({timeout:20000});await PW(8000);R.contactUrl=pg.url();await pg.screenshot({path:RAW+'1-contact.png'});
  R.buttons=(await pg.$$eval('button',bs=>bs.map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(Boolean))).slice(0,40);
  let del=pg.getByRole('button',{name:/^Delete$/}).first();
  if(!(await del.count())){const cands=pg.locator('button[aria-label*="more" i],button[aria-label*="action" i],button[aria-haspopup=menu]');for(let i=0;i<await cands.count()&&!(await del.count());i++){await cands.nth(i).click().catch(()=>{});await PW(1500);del=pg.getByRole('menuitem',{name:/Delete/}).first();if(!(await del.count())){await pg.keyboard.press('Escape');}}}
  if(await del.count()){await del.click();await PW(2500);R.dialog=(await pg.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,500);await pg.screenshot({path:RAW+'2-delete-dialog.png'});
   const ok=pg.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/Delete|Confirm|Yes|Move/i}).last();if(await ok.count()){await ok.click();await PW(8000);R.uiDeleted=true;await pg.screenshot({path:RAW+'3-after-delete.png'});}}
  else R.noDelete=true;
 }catch(e){R.err=String(e.message).slice(0,200);await pg.screenshot({path:RAW+'x-err.png'}).catch(()=>{});}
 await W(8000);R.contactAfter=(await api('GET','/modules/'+CMID+'/records/'+cid)).s;R.ticketAfter=(await api('GET','/modules/'+T+'/records/'+tid)).s;
 const cl={t:(await api('DELETE','/modules/'+T+'/records/'+tid)).s,c:(await api('DELETE','/modules/'+CMID+'/records/'+cid)).s};await W(4000);
 const f=[];let cur='';for(let i=0;i<15;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j&&r.j.data))if([cid,tid].includes(x.record_id))f.push(x.id);cur=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}
 if(f.length)cl.purge=(await api('POST','/audit/recycle-bin/delete',{ids:f})).s;cl.purged=f.length;R.cleanup=cl;LED('CL C6b cleanup '+JSON.stringify(cl));return R;};
