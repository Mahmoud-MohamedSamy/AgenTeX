module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794';const RAW=OUT+'/../screenshots/raw/';const PW=ms=>pg.waitForTimeout(ms);
 const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:{kind:'string',value:v}}))});
 const rs=(await api('GET','/desk/tickets/'+T1+'/replies')).j.data||[];R.repliesBefore=rs.map(x=>x.direction+':'+(x.status||'')+':'+String(x.created_at||'').slice(11,19));R.at=new Date().toISOString().slice(11,19);
 await pg.setViewportSize({width:1600,height:1000});
 await pg.goto(H+'/views/all/tickets/'+T1,{waitUntil:'commit',timeout:120000});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).catch(()=>{});await PW(6000);await pg.screenshot({path:RAW+'mail-1-t1-conversation.png'});
 await pg.goto(H+'/settings/channels/email',{waitUntil:'commit',timeout:120000});await pg.waitForFunction(()=>/help-staging/.test(document.body.innerText),null,{timeout:60000}).catch(()=>{});await PW(4000);await pg.screenshot({path:RAW+'mail-2-email-settings.png',fullPage:false});
 R.settingsText=(await pg.innerText('main').catch(()=>'')).replace(/\s+/g,' ').replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@/g,'$1***@').slice(0,900);
 const ca=pg.getByText(/customer-support@help-staging/).first();if(await ca.count()){await ca.click().catch(()=>{});await PW(4000);await pg.screenshot({path:RAW+'mail-3-cs-address.png'});R.addrText=(await pg.innerText('body')).replace(/\s+/g,' ').replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@/g,'$1***@').match(/.{0,200}(Receiv|receiv|Verified|verified|Forward|forward).{0,300}/)?.[0];}
 // restore #1
 const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:MK,team_id:null,owner_id:IDS.O});const cl=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Closed'}));const ct=await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:'2026-10-12T12:43:13.2306828+00:00'}));
 const a=fl((await api('GET','/modules/'+T+'/records/'+T1)).j.data);R.restore={steps:mv.s+'/'+cl.s+'/'+ct.s,status:a.status,marketing:a.department===MK,ownerO:(a.owner&&(a.owner.id||a.owner))===IDS.O,closed_time:a.closed_time};LED('E18c ticket #1 restored '+JSON.stringify(R.restore));
 return R;};
