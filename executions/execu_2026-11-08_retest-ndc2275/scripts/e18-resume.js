const fs=require('fs');
module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504',CTL='86c1ae73-d57c-47f5-ba1a-79d0d69b8368',RULE='f598b64e-2fb7-4f13-908e-d2ea37a7a936';const DB=IDS.DB;
 const orig={status:'Closed',department:'2a73bbc0-efb3-4250-bf9b-2fdc98236794',owner:'97be04b6-0a08-4883-aa51-e1650b11cab7',closed_time:'2026-10-12T12:43:13.2306828+00:00',team:null};
 const p0={assign_to_offline_agents:false,department_threshold_enabled:false,department_threshold:40,agent_threshold_enabled:false,agent_thresholds:[],assign_backlogs:false,backlog_limit:10,backlog_order:'created_time',assign_on_closure:false,incoming_mode:'immediate'};
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const rec=async id=>fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);
 const st=async id=>{const o=await rec(id);const d=(await api('GET','/desk/tickets/'+id)).j.data;const ow=o.owner?(o.owner.id||o.owner):null;return {owner:ow===IDS.A1?'A1':ow?String(ow).slice(0,8):'-',status:d.status,dept:d.department_id===DB?'DB':String(d.department_id).slice(0,8),in_backlog:d.in_backlog};};
 const act=async id=>{const a=(await api('GET','/desk/tickets/'+id+'/activity')).j.data;return (Array.isArray(a)?a:[]).filter(x=>x.occurred_at>'2026-11-09T10:59').map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,180));};
 R.now=new Date().toISOString().slice(11,19);R.ctl=await st(CTL);R.t1=await st(T1);R.actCtl=await act(CTL);R.actT1=await act(T1);R.prefsNow=(await api('GET','/desk/departments/'+DB+'/round-robin-preferences')).j.data;
 // restore
 const cur=await rec(T1);const mv=await api('POST','/desk/tickets/'+T1+'/move',{department_id:orig.department,team_id:null,owner_id:orig.owner});R.mvBack=mv.s+' '+(mv.s>=300?mv.t.slice(0,160):'');
 const cl=await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Closed'}));R.close=cl.s+' '+(cl.s>=300?cl.t.slice(0,160):'');
 const ct=await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:orig.closed_time}));R.closedTime=ct.s+' '+(ct.s>=300?ct.t.slice(0,160):'');
 const a=await rec(T1);R.t1after={status:a.status,department:a.department,owner:a.owner?(a.owner.id||a.owner):null,closed_time:a.closed_time};LED('ticket #1 restored '+JSON.stringify(R.t1after));
 R.ruleDel=(await api('DELETE','/desk/assignment-rules/'+RULE)).s;LED('rule deleted '+RULE+' '+R.ruleDel);
 R.ctlDel=(await api('DELETE','/modules/'+T+'/records/'+CTL)).s;LED('ticket deleted '+CTL+' '+R.ctlDel);
 const pb=await api('PUT','/desk/departments/'+DB+'/round-robin-preferences',p0);R.prefsBack=pb.s;R.prefsSame=JSON.stringify((await api('GET','/desk/departments/'+DB+'/round-robin-preferences')).j.data)===JSON.stringify(p0);LED('Dept B prefs restored '+pb.s);
 return R;};
