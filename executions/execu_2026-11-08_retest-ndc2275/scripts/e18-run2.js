const fs=require('fs');
module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const DB=IDS.DB;const RAW=OUT+'/../screenshots/raw/';const PW=ms=>pg.waitForTimeout(ms);
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const rec=async id=>fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);
 const st=async id=>{const o=await rec(id);const d=(await api('GET','/desk/tickets/'+id)).j.data;const ow=o.owner?(o.owner.id||o.owner):null;return {no:o.ticket_number,owner:ow===IDS.A1?'A1':ow?String(ow).slice(0,8):'-',status:d.status,dept:d.department_id===DB?'DB':String(d.department_id).slice(0,8),in_backlog:d.in_backlog,replies:d.counts&&d.counts.replies,created:String(d.created_at).slice(0,10)};};
 const act=async id=>{const a=(await api('GET','/desk/tickets/'+id+'/activity')).j.data;return (Array.isArray(a)?a:[]).filter(x=>x.occurred_at>R.t0).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,160));};
 const shot=async(id,name,hist)=>{await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:120000});await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).catch(()=>{});await PW(4000);
  if(hist){const h=pg.getByText(/^HISTORY$/i).first();if(await h.count()){await h.click();await PW(4000);}}await pg.screenshot({path:RAW+name+'.png'});};
 const prefUrl='/desk/departments/'+DB+'/round-robin-preferences';const p0=(await api('GET',prefUrl)).j.data;R.prefsBefore=p0;
 const t1o=await rec(T1);const orig={status:t1o.status,department:t1o.department,owner:t1o.owner?(t1o.owner.id||t1o.owner):null,closed_time:t1o.closed_time};R.t1orig=orig;
 if(orig.status!=='Closed'||!String(t1o.subject).startsWith('Check-in'))return{STOP:'ticket 1 not as expected',orig};
 R.t0=new Date().toISOString();await shot(T1,'e18b-0-t1-before',false);R.t1before=await st(T1);
 let rule=null,ctl=null;
 try{
  await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,incoming_mode:'immediate'});LED('E18b Dept B prefs: offline on, threshold 1');
  const rb={type:'round_robin',department_id:DB,name:'QA RT15 2275 E18 30-day',description:'QA retest E-18, safe to delete',is_active:true,execute_on:['create','update'],targets:[{criteria:{conditions:[{field_key:'subject',operator:'contains',value:'Check-in'}],pattern:null},method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1],team_id:null,excluded_user_ids:[]}}]};
  const r=await api('POST','/desk/assignment-rules',rb);rule=r.j&&r.j.data&&(r.j.data.id||(r.j.data.rule&&r.j.data.rule.id));if(!rule)throw new Error('rule '+r.s+' '+r.t);LED('E18b rule '+rule);
  const c=await api('POST','/modules/'+T+'/records',body({subject:'QA RT15 2275 E18 Check-in control (created today)',department:DB,status:'Open',priority:'Medium',email:'qa.rt15@example.com',owner:null}));ctl=c.j&&c.j.data&&(c.j.data.id||(c.j.data.record&&c.j.data.record.id));if(!ctl)throw new Error('ctl '+c.s);LED('E18b ticket control '+ctl);
  const u=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Open'}));const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:DB,team_id:null,owner_id:null});R.t1move=u.s+'/'+mv.s;LED('E18b ticket #1 reopened+moved to Dept B unassigned');
  await W(8000);R.waiting={ctl:await st(ctl),t1:await st(T1)};await shot(T1,'e18b-1-t1-waiting',false);await shot(ctl,'e18b-1-ctl-waiting',false);
  await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:true,backlog_limit:10,backlog_order:'created_time',assign_on_closure:false,incoming_mode:'immediate'});R.tBacklogOn=new Date().toISOString().slice(11,19);LED('E18b Dept B: threshold off, assign backlogs on');
  const t0=Date.now();const poll=[];while(Date.now()-t0<600000){await W(30000);const a=await st(ctl),b=await st(T1);poll.push(Math.round((Date.now()-t0)/1000)+'s ctl='+a.owner+' t1='+b.owner+(b.in_backlog?'(backlog)':''));if(b.owner!=='-')break;}
  R.poll=poll;R.final={ctl:await st(ctl),t1:await st(T1)};R.actCtl=await act(ctl);R.actT1=await act(T1);
  await shot(T1,'e18b-2-t1-after-10min',false);await shot(T1,'e18b-2-t1-history',true);await shot(ctl,'e18b-2-ctl-after',false);await shot(ctl,'e18b-2-ctl-history',true);
 }finally{
  const mvb=await api('POST','/desk/tickets/'+T1+'/move',{department_id:orig.department,team_id:null,owner_id:orig.owner});const cl=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Closed'}));const ct=await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:orig.closed_time}));
  const a=await rec(T1);R.t1after={status:a.status,department:a.department===orig.department,owner:(a.owner&&(a.owner.id||a.owner))===orig.owner,closed_time:a.closed_time,steps:mvb.s+'/'+cl.s+'/'+ct.s};LED('E18b ticket #1 restored '+JSON.stringify(R.t1after));
  if(rule){R.ruleDel=(await api('DELETE','/desk/assignment-rules/'+rule)).s;LED('E18b rule deleted '+R.ruleDel);}
  if(ctl){R.ctlDel=(await api('DELETE','/modules/'+T+'/records/'+ctl)).s;LED('E18b control deleted '+R.ctlDel);}
  const pb=await api('PUT',prefUrl,p0);R.prefsSame=JSON.stringify((await api('GET',prefUrl)).j.data)===JSON.stringify(p0);LED('E18b Dept B prefs restored '+pb.s);
  if(ctl){await W(3000);let cur='',items=[];for(let i=0;i<10;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j.data))if(x.record_id===ctl)items.push(x.id);cur=r.j.meta&&r.j.meta.next_cursor;if(!cur||items.length)break;}if(items.length)R.bin=(await api('POST','/audit/recycle-bin/delete',{ids:items})).s;}
 }
 return R;};
