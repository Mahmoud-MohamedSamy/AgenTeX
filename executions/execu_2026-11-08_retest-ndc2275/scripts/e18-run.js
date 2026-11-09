const fs=require('fs');
module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const DB=IDS.DB;
 const enc=v=>v===null?{kind:'null'}:typeof v==='number'?{kind:'number',value:v}:typeof v==='boolean'?{kind:'boolean',value:v}:Array.isArray(v)?{kind:'array',items:v.map(enc)}:{kind:'string',value:v};
 const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const rec=async id=>fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);
 const desk=async id=>{const d=(await api('GET','/desk/tickets/'+id)).j.data;return {status:d.status,dept:d.department_id===DB?'DB':String(d.department_id).slice(0,8),in_backlog:d.in_backlog};};
 const own=async id=>{const o=await rec(id);return o.owner?(o.owner.id||o.owner)===IDS.A1?'A1':String(o.owner.id||o.owner).slice(0,8):'-';};
 const act=async id=>{const a=(await api('GET','/desk/tickets/'+id+'/activity')).j.data;return (Array.isArray(a)?a:[]).filter(x=>/assign|backlog|skip|round|owner/i.test(x.action)).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,200));};
 const prefUrl='/desk/departments/'+DB+'/round-robin-preferences';const p0=(await api('GET',prefUrl)).j.data;R.prefsBefore=p0;
 const t1o=await rec(T1);const orig={status:t1o.status,department:t1o.department,owner:t1o.owner?(t1o.owner.id||t1o.owner):null,closed_time:t1o.closed_time,team:t1o.team||null};R.t1orig=orig;fs.writeFileSync(OUT+'/e18-t1-orig.json',JSON.stringify(orig));
 if(orig.status!=='Closed'||!String(t1o.subject).startsWith('Check-in')) return {STOP:'ticket 1 not as expected',orig};
 let ruleId=null,ctl=null;
 try{
  const wl=(await api('GET','/desk/agents/'+IDS.A1+'/workload')).j.data;const dd=(await api('GET','/desk/departments/'+DB)).j.data;R.dbAgents=JSON.stringify(dd).includes(IDS.A1)?'A1 member':'A1 NOT member';if(R.dbAgents!=='A1 member')throw new Error('A1 not in Dept B');R.a1open=(wl.departments||[]).reduce((n,x)=>n+x.open_tickets,0);
  await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,incoming_mode:'immediate'});LED('Dept B prefs temporarily: offline on, threshold 1');
  const rb={type:'round_robin',department_id:DB,name:'QA RT15 2275 E18 30-day',description:'QA retest E-18, safe to delete',is_active:true,execute_on:['create','update'],targets:[{criteria:{conditions:[{field_key:'subject',operator:'contains',value:'Check-in'}],pattern:null},method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1],team_id:null,excluded_user_ids:[]}}]};
  const r=await api('POST','/desk/assignment-rules',rb);ruleId=r.j&&r.j.data&&(r.j.data.id||(r.j.data.rule&&r.j.data.rule.id));R.rule=r.s;if(!ruleId)throw new Error('rule '+r.s+' '+r.t);LED('rule round_robin "QA RT15 2275 E18 30-day" '+ruleId);
  const c=await api('POST','/modules/'+T+'/records',body({subject:'QA RT15 2275 E18 Check-in control',department:DB,status:'Open',priority:'Medium',email:'qa.rt15@example.com',owner:null}));ctl=c.j&&c.j.data&&(c.j.data.id||(c.j.data.record&&c.j.data.record.id));if(!ctl)throw new Error('ctl '+c.s+' '+c.t);LED('ticket "QA RT15 2275 E18 Check-in control" '+ctl);
  const u=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Open'}));const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:DB,team_id:null,owner_id:null});R.t1patch=u.s+' '+(u.s>=300?u.t.slice(0,200):'')+' | move '+mv.s+' '+(mv.s>=300?mv.t.slice(0,200):'');LED('ticket #1 '+T1+' reopened + moved to Dept B unassigned (restore: '+JSON.stringify(orig)+')');
  await W(8000);
  R.waiting={ctl:{owner:await own(ctl),...(await desk(ctl))},t1:{owner:await own(T1),...(await desk(T1))}};
  await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:true,backlog_limit:10,backlog_order:'created_time',assign_on_closure:false,incoming_mode:'immediate'});LED('Dept B: threshold off, assign backlogs on');
  const t0=Date.now();const poll=[];while(Date.now()-t0<150000){await W(10000);const a=await own(ctl),b=await own(T1);poll.push(Math.round((Date.now()-t0)/1000)+'s ctl='+a+' t1='+b);if(a!=='-'&&Date.now()-t0>90000)break;}
  R.poll=poll;R.final={ctl:{owner:await own(ctl),...(await desk(ctl))},t1:{owner:await own(T1),...(await desk(T1))}};R.actCtl=await act(ctl);R.actT1=await act(T1);
  R.replies=(await api('GET','/desk/tickets/'+T1+'/replies')).j.data.length;
 }finally{
  const cur=await rec(T1);let mvb={s:'skip'};if(cur.department!==orig.department||String(cur.owner&&(cur.owner.id||cur.owner))!==String(orig.owner)){mvb=await api('POST','/desk/tickets/'+T1+'/move',{department_id:orig.department,team_id:orig.team||null,owner_id:orig.owner});}const b1=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Closed'}));R.restoreT1='move '+mvb.s+' '+(mvb.s>=300?mvb.t.slice(0,150):'')+' | close '+b1.s+' '+(b1.s>=300?b1.t.slice(0,150):'');
  if(orig.closed_time){const b2=await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:orig.closed_time}));R.restoreClosed=b2.s+' '+(b2.s>=300?b2.t.slice(0,150):'');}
  const after=await rec(T1);R.t1after={status:after.status,department:after.department,owner:after.owner?(after.owner.id||after.owner):null,closed_time:after.closed_time};LED('ticket #1 restored '+JSON.stringify(R.t1after));
  if(ruleId){R.ruleDel=(await api('DELETE','/desk/assignment-rules/'+ruleId)).s;LED('rule deleted '+ruleId+' '+R.ruleDel);}
  if(ctl){R.ctlDel=(await api('DELETE','/modules/'+T+'/records/'+ctl)).s;LED('ticket deleted '+ctl+' '+R.ctlDel);}
  const pb=await api('PUT',prefUrl,p0);R.prefsBack=pb.s;R.prefsSame=JSON.stringify((await api('GET',prefUrl)).j.data)===JSON.stringify(p0);LED('Dept B prefs restored '+pb.s);
 }
 return R;};
