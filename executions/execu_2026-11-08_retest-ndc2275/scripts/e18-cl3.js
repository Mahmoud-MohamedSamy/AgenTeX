// Checklist 10 Nov: E18 setup, E18-01..03 + cleanup (restores everything in finally). Keeps EM-03 ticket #2382 for the user's EM-04/05 reply.
module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const DB=IDS.DB;const RAW=OUT+'/../screenshots/raw/cl-e18-';const PW=ms=>pg.waitForTimeout(ms);
 const EM03='c8590aab-2f4d-46a5-81b8-bb096c8736fc',DUP='fe83f126-9176-40ce-9376-11145a3271f5';
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const rec=async id=>fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);
 const st=async id=>{const o=await rec(id);const d=(await api('GET','/desk/tickets/'+id)).j.data;const ow=o.owner?(o.owner.id||o.owner):null;return {no:o.ticket_number,owner:ow===IDS.A1?'Test User 1':ow?String(ow).slice(0,8):'Unassigned',status:d.status,dept:d.department_id===DB?'QA AS6 Dept B':String(d.department_id).slice(0,8),in_backlog:d.in_backlog,created:String(d.created_at).slice(0,10)};};
 const act=async id=>{const a=(await api('GET','/desk/tickets/'+id+'/activity')).j.data;return (Array.isArray(a)?a:[]).filter(x=>x.occurred_at>R.t0).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,180));};
 const shot=async(id,name,hist)=>{try{await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}const ok=await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false);if(ok)break;}await PW(4000);
  if(hist){const h=pg.getByText(/^HISTORY$/i).first();if(await h.count()){await h.click();await PW(5000);}}await pg.screenshot({path:RAW+name+'.png'});}catch(e){R['shotErr_'+name]=String(e.message).slice(0,80);}};
 const prefUrl='/desk/departments/'+DB+'/round-robin-preferences';const p0=(await api('GET',prefUrl)).j.data;R.prefsBefore=p0;
 R.prefsAsExpected=!p0.assign_to_offline_agents&&!p0.department_threshold_enabled&&p0.department_threshold===40&&!p0.assign_backlogs&&!p0.assign_on_closure&&p0.incoming_mode==='immediate';
 const t1o=await rec(T1);const orig={status:t1o.status,department:t1o.department,owner:t1o.owner?(t1o.owner.id||t1o.owner):null,closed_time:t1o.closed_time,created:t1o.created_at,subject:t1o.subject};R.t1orig=orig;
 if(orig.status!=='Closed'||!String(t1o.subject).startsWith('Check-in'))return{STOP:'ticket 1 not as expected',orig};
 const dd=(await api('GET','/desk/departments/'+DB)).j.data;R.a1InDeptB=JSON.stringify(dd).includes(IDS.A1);if(!R.a1InDeptB)return{STOP:'Test User 1 not in Dept B'};
 const wl=(await api('GET','/desk/agents/'+IDS.A1+'/workload')).j.data;R.a1open={total:(wl.departments||[]).reduce((n,x)=>n+x.open_tickets,0),deptB:((wl.departments||[]).find(x=>x.department_id===DB)||{}).open_tickets};
 R.t1replies=((await api('GET','/desk/tickets/'+T1+'/replies')).j.data||[]).map(x=>x.direction+':'+String(x.created_at||'').slice(0,10));
 R.t0=new Date().toISOString();let rule=null,ctl=null;
 try{
  // E18 setup
  const rb={type:'round_robin',department_id:DB,name:'QA E18 manual',description:'QA checklist 10 Nov, safe to delete',is_active:true,execute_on:['create','update'],targets:[{criteria:{conditions:[{field_key:'subject',operator:'contains',value:'Check-in'}],pattern:null},method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1],team_id:null,excluded_user_ids:[]}}]};
  const r=await api('POST','/desk/assignment-rules',rb);rule=r.j&&r.j.data&&(r.j.data.id||(r.j.data.rule&&r.j.data.rule.id));R.ruleCreate=r.s;if(!rule)throw new Error('rule '+r.s+' '+r.t);LED('CL rule round_robin "QA E18 manual" '+rule);
  const pu=await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,incoming_mode:'immediate'});R.prefsSetup=pu.s;LED('CL Dept B prefs: offline on, threshold 1, backlogs off');
  // E18-01
  const c=await api('POST','/modules/'+T+'/records',body({subject:'QA E18 Check-in control',department:DB,status:'Open',priority:'Medium',email:'qa.e18@example.com',owner:null}));ctl=c.j&&c.j.data&&(c.j.data.id||(c.j.data.record&&c.j.data.record.id));if(!ctl)throw new Error('ctl '+c.s+' '+c.t);LED('CL ticket "QA E18 Check-in control" '+ctl);
  await W(30000);R.e18_01=await st(ctl);await shot(ctl,'01-control-waiting',false);
  // E18-02
  const u=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Open'}));const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:DB,team_id:null,owner_id:null});R.e18_02_calls=u.s+'/'+mv.s;LED('CL ticket #1 reopened + moved to Dept B unassigned (restore to Marketing, owner O, Closed, closed_time '+orig.closed_time+')');
  await W(30000);R.e18_02={t1:await st(T1),ctl:await st(ctl)};await shot(T1,'02-t1-waiting',false);
  // E18-03
  const pb=await api('PUT',prefUrl,{...p0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:true,backlog_limit:10,backlog_order:'created_time',assign_on_closure:false,incoming_mode:'immediate'});R.tRelease=new Date().toISOString().slice(11,19)+' UTC';R.prefsRelease=pb.s;LED('CL Dept B: threshold off, assign backlogs on');
  const t0=Date.now();const poll=[];let ctlAt=null;while(Date.now()-t0<600000){await W(60000);const a=await st(ctl),b=await st(T1);const sec=Math.round((Date.now()-t0)/1000);if(!ctlAt&&a.owner!=='Unassigned')ctlAt=sec;poll.push(sec+'s control='+a.owner+' #1='+b.owner+(b.in_backlog?' (backlog)':''));}
  R.poll=poll;R.ctlAssignedAfterSec=ctlAt;R.e18_03={ctl:await st(ctl),t1:await st(T1)};R.histCtl=await act(ctl);R.histT1=await act(T1);
  await shot(T1,'03-t1-after-10min',false);await shot(T1,'03-t1-history',true);await shot(ctl,'03-control-assigned',false);await shot(ctl,'03-control-history',true);
 }catch(e){R.err=String(e.message).slice(0,300);}
 finally{
  const cl={};
  const mvb=await api('POST','/desk/tickets/'+T1+'/move',{department_id:orig.department,team_id:null,owner_id:orig.owner});const c1=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Closed'}));const c2=await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:orig.closed_time}));
  const a=await rec(T1);cl.t1={calls:mvb.s+'/'+c1.s+'/'+c2.s,status:a.status,deptBack:a.department===orig.department,ownerBack:(a.owner&&(a.owner.id||a.owner))===orig.owner,closed_time:a.closed_time,closedTimeBack:a.closed_time===orig.closed_time};LED('CL ticket #1 restored '+JSON.stringify(cl.t1));
  if(rule){cl.ruleDel=(await api('DELETE','/desk/assignment-rules/'+rule)).s;LED('CL rule deleted '+cl.ruleDel);}
  const delIds=[ctl,DUP].filter(Boolean);cl.ticketDel={};for(const id of delIds){cl.ticketDel[id.slice(0,8)]=(await api('DELETE','/modules/'+T+'/records/'+id)).s;LED('CL ticket deleted '+id+' '+cl.ticketDel[id.slice(0,8)]);}
  const pr=await api('PUT',prefUrl,p0);cl.prefsSame=JSON.stringify((await api('GET',prefUrl)).j.data)===JSON.stringify(p0);LED('CL Dept B prefs restored '+pr.s+' same='+cl.prefsSame);
  await W(4000);let cur='',items=[];for(let i=0;i<15;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j.data))if(delIds.includes(x.record_id))items.push(x.id);cur=r.j.meta&&r.j.meta.next_cursor;if(!cur||items.length>=delIds.length)break;}
  cl.binFound=items.length;if(items.length){cl.binPurge=(await api('POST','/audit/recycle-bin/delete',{ids:items})).s;LED('CL recycle bin purged '+items.length+' '+cl.binPurge);}
  R.cleanup=cl;
 }
 const rs=(await api('GET','/desk/tickets/'+EM03+'/replies')).j.data||[];R.em03replies=rs.map(x=>x.direction+':'+(x.status||'')+':'+String(x.created_at||'').slice(11,19));await shot(EM03,'em03-sent',false);
 return R;};
