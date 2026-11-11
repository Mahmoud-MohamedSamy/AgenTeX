// EM-04 check (#2495) + E18-04 run on #1 (only if the customer reply arrived). Restores everything in finally, null-safe.
module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const DB=IDS.DB;const MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794';const RAW=OUT+'/../screenshots/raw/cl-';const PW=ms=>pg.waitForTimeout(ms);
 const ORIG_CLOSED='2026-10-12T12:43:13.2306828+00:00';const BASE={assign_to_offline_agents:false,department_threshold_enabled:false,department_threshold:40,agent_threshold_enabled:false,agent_thresholds:[],assign_backlogs:false,backlog_limit:10,backlog_order:'created_time',assign_on_closure:false,incoming_mode:'immediate'};
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const safe=async(k,fn)=>{try{return await fn();}catch(e){R['err_'+k]=String(e.message).slice(0,200);return null;}};
 const reps=async id=>((((await api('GET','/desk/tickets/'+id+'/replies')).j||{}).data)||[]).map(x=>({dir:x.direction,at:String(x.created_at||'').slice(0,19),from:m(JSON.stringify(x.from||x.from_address||'')).slice(0,60),subject:x.subject}));
 const act=async(id,since)=>{const a=((await api('GET','/desk/tickets/'+id+'/activity')).j||{}).data;return (Array.isArray(a)?a:[]).filter(x=>x.occurred_at>since).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,200));};
 const st=async id=>{const r=await api('GET','/modules/'+T+'/records/'+id);const o=r.j&&r.j.data?fl(r.j.data):{};const d=((await api('GET','/desk/tickets/'+id)).j||{}).data||{};const ow=o.owner?(o.owner.id||o.owner):null;return {owner:ow===IDS.A1?'Test User 1':ow===IDS.O?'ndc-staging-owner':ow?String(ow).slice(0,8):'Unassigned',status:d.status,dept:d.department_id===DB?'QA AS6 Dept B':d.department_name,in_backlog:d.in_backlog};};
 const shot=async(id,name,hist)=>safe('shot_'+name,async()=>{await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await PW(5000);if(hist){const h=pg.getByText(/^HISTORY$/i).first();if(await h.count()){await h.click();await PW(5000);}}await pg.screenshot({path:RAW+name+'.png'});});
 const r=await api('GET','/modules/'+T+'/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc');const g=arr(r.j&&r.j.data).map(fl).find(o=>String(o.ticket_number)==='2495');
 const t0=Date.now();while(Date.now()-t0<180000){const a=g?await reps(g.id):[];const b=await reps(T1);R.em04=a;R.t1replies=b;if(a.some(x=>x.dir==='inbound'&&x.at>'2026-11-10T12:04')&&b.some(x=>x.dir==='inbound'))break;await W(20000);}
 R.em04Act=g?await act(g.id,'2026-11-10T12:04'):null;R.t1Act=await act(T1,'2026-11-10T12:05');
 if(g)await shot(g.id,'em04-2495',false);await shot(T1,'e1804-1-reply-in',false);
 const t1in=(R.t1replies||[]).filter(x=>x.dir==='inbound');if(!t1in.length){R.e1804='skipped: no customer reply on #1 yet';}
 const prefUrl='/desk/departments/'+DB+'/round-robin-preferences';let rule=null;
 try{ if(t1in.length){
  R.prefsBefore=(await api('GET',prefUrl)).j.data;
  const rb={type:'round_robin',department_id:DB,name:'QA E18 manual',description:'QA checklist 10 Nov E18-04, safe to delete',is_active:true,execute_on:['create','update'],targets:[{criteria:{conditions:[{field_key:'subject',operator:'contains',value:'Check-in'}],pattern:null},method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1],team_id:null,excluded_user_ids:[]}}]};
  const rr=await api('POST','/desk/assignment-rules',rb);rule=rr.j&&rr.j.data&&(rr.j.data.id||(rr.j.data.rule&&rr.j.data.rule.id));if(!rule)throw new Error('rule '+rr.s);LED('CL E18-04 rule "QA E18 manual" '+rule);
  await api('PUT',prefUrl,{...BASE,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:1});LED('CL E18-04 Dept B prefs: offline on, threshold 1');
  const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:DB,team_id:null,owner_id:null});R.moveIn=mv.s;R.tMove=new Date().toISOString();LED('CL E18-04 #1 moved to Dept B unassigned');
  await W(30000);R.waiting=await st(T1);await shot(T1,'e1804-2-waiting',false);
  await api('PUT',prefUrl,{...BASE,assign_to_offline_agents:true,assign_backlogs:true});R.tRelease=new Date().toISOString().slice(11,19);LED('CL E18-04 Dept B: threshold off, backlogs on');
  const t2=Date.now();const poll=[];while(Date.now()-t2<300000){await W(30000);const s=await st(T1);poll.push(Math.round((Date.now()-t2)/1000)+'s '+s.owner+(s.in_backlog?' (backlog)':''));if(s.owner!=='Unassigned')break;}
  R.poll=poll;R.final=await st(T1);R.hist=await act(T1,R.tMove);await shot(T1,'e1804-3-after',false);await shot(T1,'e1804-3-history',true);
 }}catch(e){R.err=String(e.message).slice(0,300);}
 finally{const cl={};
  cl.move=await safe('mv',async()=>(await api('POST','/desk/tickets/'+T1+'/move',{department_id:MK,team_id:null,owner_id:IDS.O})).s);
  cl.close=await safe('cl',async()=>(await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Closed'}))).s);await W(5000);
  cl.ct=await safe('ct',async()=>(await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:ORIG_CLOSED}))).s);
  if(rule)cl.rule=await safe('rd',async()=>(await api('DELETE','/desk/assignment-rules/'+rule)).s);
  if(R.prefsBefore)cl.prefs=await safe('pr',async()=>{await api('PUT',prefUrl,BASE);const a=(await api('GET',prefUrl)).j.data;return JSON.stringify(a)===JSON.stringify(BASE)?'baseline':'DIFF '+JSON.stringify(a);});
  await W(30000);cl.t1=await safe('t1',async()=>{const o=fl((await api('GET','/modules/'+T+'/records/'+T1)).j.data);return {status:o.status,closed_time:o.closed_time,mk:o.department===MK,ownerO:(o.owner&&(o.owner.id||o.owner))===IDS.O};});
  R.cleanup=cl;LED('CL E18-04 restore '+JSON.stringify(cl));}
 return R;};
