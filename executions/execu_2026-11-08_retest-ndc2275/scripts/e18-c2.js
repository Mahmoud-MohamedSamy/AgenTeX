// Item 6: does deleting a contact delete its tickets? Create contact + 2 tickets, delete contact in the UI, check tickets + bin, restore contact, check again.
module.exports=async()=>{const R={log:[]};const L=s=>{R.log.push(new Date().toISOString().slice(11,19)+' '+s);console.log(s);};const PW=ms=>pg.waitForTimeout(ms);const RAW=OUT+'/../screenshots/raw/cl-c6-';
 const CMID='43004ce2-577f-4eda-b00a-0750fe40c3d4',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';const ST=Date.now().toString(36).slice(-5);const NAME='QA CL6 contact '+ST,EM='qa.cl6.'+ST+'@example.com';
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const c=await api('POST','/modules/'+CMID+'/records',body({last_name:NAME,email:EM}));const cid=c.j&&c.j.data&&c.j.data.id;if(!cid){R.stop='contact '+c.s+' '+String(c.t).slice(0,300);return R;}R.contact=cid;LED('CL C6 contact "'+NAME+'" '+cid);
 const tks=[];for(const n of [1,2]){const t=await api('POST','/modules/'+T+'/records',body({subject:'QA CL6 ticket '+n+' '+ST,department:CS,status:'Open',priority:'Medium',contact_id:cid,owner:IDS.O}));const id=t.j&&t.j.data&&t.j.data.id;if(!id){R.stop='ticket '+t.s+' '+String(t.t).slice(0,300);return R;}tks.push(id);LED('CL C6 ticket '+n+' '+id);}
 R.tickets=tks;const tstate=async()=>{const o=[];for(const id of tks){const r=await api('GET','/modules/'+T+'/records/'+id);const f=r.j&&r.j.data?fl(r.j.data):{};o.push({s:r.s,deleted:r.j&&r.j.data&&r.j.data.is_deleted,contact_id:f.contact_id===cid?'this contact':f.contact_id,no:f.ticket_number});}return o;};
 R.ticketsBefore=await tstate();L('before '+JSON.stringify(R.ticketsBefore));
 // UI delete
 await pg.setViewportSize({width:1600,height:1000});let ui='';
 for(const u of ['/views/all/contacts/'+cid,'/contacts/'+cid]){try{await pg.goto(H+u,{waitUntil:'commit',timeout:60000});}catch(e){continue;}await PW(12000);const tx=await pg.innerText('body').catch(()=>'');if(tx.includes(NAME)){ui=u;break;}}
 R.contactUrl=ui;await pg.screenshot({path:RAW+'1-contact.png'});
 if(ui){const tx=(await pg.innerText('body')).replace(/\s+/g,' ');R.pageMentionsTickets=(tx.match(/.{0,40}QA CL6 ticket.{0,40}/g)||[]).slice(0,3);
  let del=pg.getByRole('button',{name:/^Delete$/}).first();
  if(!(await del.count())){const more=pg.locator('button[aria-label*="more" i],button[aria-label*="action" i],button:has-text("⋮"),button:has-text("...")').first();if(await more.count()){await more.click().catch(()=>{});await PW(1500);}del=pg.getByRole('menuitem',{name:/Delete/}).first();if(!(await del.count()))del=pg.getByText(/^Delete$/).first();}
  if(await del.count()){await del.click();await PW(2500);R.dialog=(await pg.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,400);await pg.screenshot({path:RAW+'2-delete-dialog.png'});
   const ok=pg.locator('[role=dialog] button,[role=alertdialog] button').filter({hasText:/^(Delete|Confirm|Yes|Move to Recycle Bin)/i}).last();if(await ok.count()){await ok.click();await PW(6000);R.uiDeleted=true;LED('CL C6 contact deleted in UI');}}
 }
 if(!R.uiDeleted){const d=await api('DELETE','/modules/'+CMID+'/records/'+cid);R.apiDelete=d.s;LED('CL C6 contact deleted by API '+d.s);}
 await W(10000);R.contactAfter=(await api('GET','/modules/'+CMID+'/records/'+cid)).s;R.ticketsAfterDelete=await tstate();L('after delete '+JSON.stringify(R.ticketsAfterDelete));
 const bin=async()=>{const f=[];let cur='';for(let i=0;i<15;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j&&r.j.data))if([cid,...tks].includes(x.record_id))f.push({bin:x.id,rec:x.record_id===cid?'contact':'ticket',label:x.record_label});cur=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}return f;};
 R.binAfterDelete=await bin();L('bin '+JSON.stringify(R.binAfterDelete));
 await pg.goto(H+'/views/all/tickets/'+tks[0],{waitUntil:'commit',timeout:60000}).catch(()=>{});await PW(12000);await pg.screenshot({path:RAW+'3-ticket-after-delete.png'});R.ticketPage=(await pg.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,200);
 // restore contact
 const cb=R.binAfterDelete.find(x=>x.rec==='contact');if(cb){for(const p of ['/audit/recycle-bin/restore','/audit/recycle-bin/items/restore']){const r=await api('POST',p,{ids:[cb.bin]});R['restore '+p]=r.s+' '+String(r.t).slice(0,150);if(r.s<300){LED('CL C6 contact restored '+r.s);break;}}
  await W(10000);R.contactAfterRestore=(await api('GET','/modules/'+CMID+'/records/'+cid)).s;R.ticketsAfterRestore=await tstate();R.binAfterRestore=await bin();L('after restore '+JSON.stringify(R.ticketsAfterRestore));}
 // cleanup
 const cl={};for(const id of tks)cl['t'+id.slice(0,6)]=(await api('DELETE','/modules/'+T+'/records/'+id)).s;cl.c=(await api('DELETE','/modules/'+CMID+'/records/'+cid)).s;await W(5000);
 const left=await bin();if(left.length)cl.purge=(await api('POST','/audit/recycle-bin/delete',{ids:left.map(x=>x.bin)})).s;cl.purged=left.length;await W(3000);cl.binLeft=(await bin()).length;R.cleanup=cl;LED('CL C6 cleanup '+JSON.stringify(cl));
 return R;};
