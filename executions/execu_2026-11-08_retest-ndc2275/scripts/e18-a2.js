// EM-04/EM-09 route A: TAVI to TAVI. Tech ticket (contact = customer-support@) -> reply -> CS gets new ticket -> CS replies -> lands on Tech -> Tech replies -> must land on the CS ticket.
module.exports=async()=>{const R={log:[]};const L=s=>{R.log.push(new Date().toISOString().slice(11,19)+' '+s);console.log(s);};const PW=ms=>pg.waitForTimeout(ms);
 const TECH='19510fdc-91f3-4a7a-8888-153f1318b765',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',CSA='customer-support@help-staging.anyware.software';
 const STAMP=new Date().toISOString().slice(11,16).replace(':','');const SUBJ='QA EM04 TAVI2TAVI '+STAMP;R.subject=SUBJ;
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const q=async s=>arr(((await api('GET','/modules/'+T+'/records?q='+encodeURIComponent(s)+'&per_page=50')).j||{}).data).map(fl).filter(o=>String(o.subject||'').includes(s)).map(o=>({id:o.id,no:o.ticket_number,subject:o.subject,dept:o.department===TECH?'Tech':o.department===CS?'CS':String(o.department).slice(0,8)}));
 const reps=async id=>((((await api('GET','/desk/tickets/'+id+'/replies')).j||{}).data)||[]).map(x=>({dir:x.direction,status:x.status,at:String(x.created_at||'').slice(11,19),subject:x.subject,from:JSON.stringify(x.from||x.from_address||'').slice(0,70)}));
 const act=async id=>{const a=((await api('GET','/desk/tickets/'+id+'/activity')).j||{}).data;return (Array.isArray(a)?a:[]).filter(x=>/message|reply/.test(x.action)).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,160));};
 const open=async id=>{await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await PW(5000);};
 const shot=async(id,n)=>{try{await open(id);await pg.screenshot({path:OUT+'/../screenshots/raw/cl-a2-'+n+'.png'});}catch(e){L('shot fail '+n);}};
 const reply=async(id,tag,text)=>{const X={};await open(id);
  const rb=pg.getByRole('button',{name:/^Reply( All)?$/}).first();if(!(await rb.count()))return{stop:'no Reply button'};await rb.click();await PW(5000);
  const ed=pg.locator('[contenteditable=true]').last();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type(text);await PW(2000);
  const txt=(await pg.innerText('body')).replace(/\s+/g,' ');X.from=(txt.match(/From .{0,90}/)||[''])[0].slice(0,110);X.to=(txt.match(/To .{0,80}/)||[''])[0].slice(0,90);
  await pg.screenshot({path:OUT+'/../screenshots/raw/cl-a2-'+tag+'-compose.png'});
  let send=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const b=c.nth(i);if(await b.isVisible().catch(()=>false)&&!(await b.isDisabled().catch(()=>true)))send=b;}
  if(!send)return{...X,stop:'Send disabled'};X.sentAt=new Date().toISOString().slice(11,19);await send.click();await PW(10000);X.replies=await reps(id);return X;};
 const waitFor=async(fn,ms,label)=>{const t0=Date.now();while(Date.now()-t0<ms){const v=await fn();if(v)return v;await W(20000);}L('timeout '+label);return null;};
 // 1 Tech ticket
 const cr=await api('POST','/modules/'+T+'/records',body({subject:SUBJ,department:TECH,status:'Open',priority:'Medium',email:CSA,owner:IDS.O}));
 const techId=cr.j&&cr.j.data&&(cr.j.data.id||(fl(cr.j.data)||{}).id);if(!techId){R.stop='create '+cr.s+' '+String(cr.t).slice(0,300);return R;}
 R.techId=techId;LED('CL A2 Tech ticket "'+SUBJ+'" '+techId+' contact '+CSA);L('tech ticket '+techId);
 // 2 Tech -> CS
 R.hop1=await reply(techId,'1-tech','QA EM04 hop 1: Tech writes to Customer Support.');LED('CL A2 hop1 Tech reply to '+CSA);L('hop1 '+JSON.stringify(R.hop1).slice(0,300));if(R.hop1.stop)return R;
 const cs=await waitFor(async()=>(await q(SUBJ)).find(o=>o.id!==techId),360000,'CS ticket');R.allAfterHop1=await q(SUBJ);R.techAfterHop1=await reps(techId);R.techActHop1=await act(techId);
 if(!cs){R.verdict='hop1: no new CS ticket in 6 min';return R;}
 R.csTicket=cs;LED('CL A2 CS ticket created by mail #'+cs.no+' '+cs.id);L('cs ticket '+JSON.stringify(cs));R.csAct1=await act(cs.id);R.csReps1=await reps(cs.id);
 // 3 CS -> Tech
 R.hop2=await reply(cs.id,'2-cs','QA EM04 hop 2: Customer Support answers Tech.');LED('CL A2 hop2 CS reply to tech@');L('hop2 '+JSON.stringify(R.hop2).slice(0,300));if(R.hop2.stop)return R;
 R.hop2Land=await waitFor(async()=>{const a=(await reps(techId)).filter(x=>x.dir==='inbound');return a.length?a:null;},360000,'hop2 on Tech');R.allAfterHop2=await q(SUBJ);R.techActHop2=await act(techId);
 if(!R.hop2Land){R.verdict='hop2: CS reply did not land on Tech ticket';return R;}
 // 4 Tech -> CS: EM-04
 const before=(await reps(cs.id)).filter(x=>x.dir==='inbound').length;R.csInboundBefore=before;
 R.hop3=await reply(techId,'3-tech','QA EM04 hop 3: customer reply to the agent answer, must land on the same Customer Support ticket.');LED('CL A2 hop3 Tech reply to '+CSA);L('hop3 '+JSON.stringify(R.hop3).slice(0,300));if(R.hop3.stop)return R;
 R.hop3Land=await waitFor(async()=>{const a=(await reps(cs.id)).filter(x=>x.dir==='inbound');return a.length>before?a:null;},360000,'hop3 on CS');
 R.allFinal=await q(SUBJ);R.csActFinal=await act(cs.id);R.csRepsFinal=await reps(cs.id);R.techRepsFinal=await reps(techId);
 R.verdict=R.hop3Land&&R.allFinal.length===2?'EM-04 PASS: reply landed on CS ticket, no new ticket':'EM-04 check: see data';
 await W(60000);R.loopCheck=await q(SUBJ);await shot(cs.id,'4-cs-final');await shot(techId,'5-tech-final');
 R.supp=(((await api('GET','/desk/channels/suppressions')).j||{}).data||[]).length;R.bounce=(await q('Undeliverable')).concat(await q('Delivery Status')).concat(await q('failure'));
 return R;};
