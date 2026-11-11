// Agent replies for EM-04 (#2495, to the user's Gmail) and E18-04 (#1, to mmohamed@; #1 reopened + moved to Customer Support, owner kept).
module.exports=async()=>{const R={};const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const PW=ms=>pg.waitForTimeout(ms);
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const find=async no=>{const r=await api('GET','/modules/'+T+'/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc');return arr(r.j&&r.j.data).map(fl).find(o=>String(o.ticket_number)===String(no));};
 const reply=async(id,tag,text)=>{const X={};await pg.setViewportSize({width:1600,height:1000});
  for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await PW(5000);
  const rb=pg.getByRole('button',{name:/^Reply( All)?$/}).first();if(!(await rb.count()))return{stop:'no Reply button'};await rb.click();await PW(5000);
  const ed=pg.locator('[contenteditable=true]').last();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type(text);await PW(2000);
  const txt=(await pg.innerText('body')).replace(/\s+/g,' ');X.from=m((txt.match(/From .{0,90}/)||[''])[0]).slice(0,110);X.subject=(txt.match(/Subject (Re: .{0,70}?) (Small|Normal|B )/)||[])[1];
  await pg.screenshot({path:OUT+'/../screenshots/raw/cl-'+tag+'-compose.png'});
  let send=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const b=c.nth(i);if(await b.isVisible().catch(()=>false)&&!(await b.isDisabled().catch(()=>true)))send=b;}
  if(!send)return{...X,stop:'Send disabled'};X.sentAt=new Date().toISOString().slice(11,19);await send.click();await PW(10000);
  const rs=((await api('GET','/desk/tickets/'+id+'/replies')).j||{}).data||[];X.replies=rs.map(x=>x.direction+':'+(x.status||'')+':'+String(x.created_at||'').slice(11,19)+':'+(x.subject||''));return X;};
 // EM-04
 const g=await find(2495);if(!g)R.em04={stop:'#2495 not found'};else{R.em04=await reply(g.id,'em04','QA EM-04 agent reply. Please reply to this email from Gmail.');LED('CL EM-04 agent reply on #2495 to the user Gmail');}
 // E18-04 prep
 const o=fl((await api('GET','/modules/'+T+'/records/'+T1)).j.data);R.t1before={status:o.status,closed_time:o.closed_time,dept:o.department};
 const u=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Open'}));const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:CS,team_id:null,owner_id:IDS.O});R.t1prep=u.s+'/'+mv.s;LED('CL E18-04 ticket #1 reopened + moved to Customer Support, owner kept (restore: Marketing, owner O, Closed, closed_time 2026-10-12T12:43:13.2306828+00:00)');
 R.e1804=await reply(T1,'e1804','QA E18-04 agent reply. Please reply to this email so the ticket gets a customer reply today.');LED('CL E18-04 agent reply on #1 to mmohamed@anyware.software');
 return R;};
