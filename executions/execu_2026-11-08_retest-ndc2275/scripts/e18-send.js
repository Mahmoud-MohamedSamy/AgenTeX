module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';const O=IDS.O;const RAW=OUT+'/../screenshots/raw/';const PW=ms=>pg.waitForTimeout(ms);
 const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:{kind:'string',value:v}}))});
 const u=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Open'}));const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:CS,team_id:null,owner_id:O});R.prep=u.s+'/'+mv.s+' '+(mv.s>=300?mv.t.slice(0,200):'');LED('E18c ticket #1 reopened + moved to Customer Support, owner kept (restore later to Marketing 2a73bbc0, Closed)');
 if(mv.s>=300)return R;
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets/'+T1,{waitUntil:'commit',timeout:120000});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).catch(()=>{});await PW(5000);
 const rb=pg.getByRole('button',{name:/^Reply( All)?$/}).first();await rb.click();await PW(4000);await pg.screenshot({path:RAW+'e18c-0-compose-open.png'});
 const txt=(await pg.innerText('body')).replace(/\s+/g,' ');const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@/g,'$1***@');
 R.composeTo=m((txt.match(/To .{0,80}/)||[''])[0]);R.composeFrom=m((txt.match(/From .{0,80}/)||[''])[0]);R.hasTarget=/mmohamed@anyware\.software/.test(txt);R.hasCS=/customer-support@help-staging/.test(txt);
 if(!R.hasTarget){R.stop='To is not mmohamed@anyware.software';return R;}
 const ed=pg.locator('[contenteditable=true]').last();await ed.click();await pg.keyboard.type('QA test for NDC-2275 (round robin 30-day rule), 9 Nov 2026. Please reply to this email with any short text, for example "customer reply test". Thank you.');await PW(1500);
 await pg.screenshot({path:RAW+'e18c-1-compose-filled.png'});
 const send=pg.getByRole('button',{name:/^Send$/}).last();R.sendEnabled=!(await send.isDisabled().catch(()=>true));if(!R.sendEnabled){R.stop='Send disabled';R.banner=m(((await pg.innerText('body')).match(/.{0,80}(can't send|cannot send|not sent|Sending).{0,120}/i)||[''])[0]);return R;}
 await send.click();await PW(8000);await pg.screenshot({path:RAW+'e18c-2-after-send.png'});
 const rs=(await api('GET','/desk/tickets/'+T1+'/replies')).j.data||[];R.replies=rs.map(x=>({dir:x.direction,status:x.status||x.delivery_status,to:m(JSON.stringify(x.to||x.to_addresses||'')).slice(0,60),from:m(String(x.from||x.from_address||'')).slice(0,60)}));LED('E18c agent reply sent on #1 to mmohamed@anyware.software');
 return R;};
