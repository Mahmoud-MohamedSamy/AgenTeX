eval(require('fs').readFileSync('lib.js','utf8'));
const fs2=require('fs'); const OUT='../out/';
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||x.slice(0,8)):'-';
const pres=async(m)=>{fs2.writeFileSync(OUT+'presence-ctl.json',JSON.stringify(m));await W(12000);};
const P0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
const setP=async(patch)=>{const r=await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...P0,...patch});LED('Dept A RR prefs '+JSON.stringify(patch));return {s:r.s,e:E(r)};};
const rrU=async(sub)=>{const t=await mkTicket(sub,IDS.DA);await unassign(t.id);await W(2500);await patchT(t.id,{priority:'Low'});await W(4000);const o=await own(t.id);return {id:t.id,owner:nm(o.owner)};};
await pres({a1:'on',a2:'on',a3:'on'});
await cs('RR-17 backlog first',async()=>{const s=await setP({incoming_mode:'backlog_first'});const t=await rrU('QA AS6 SEQ backlogfirst');const s2=await setP({incoming_mode:'backlog_first',assign_backlogs:true,backlog_limit:5});let o=null;const t0=Date.now();for(let i=0;i<9;i++){await W(10000);o=await own(t.id);if(o.owner)break;}const s3=await setP({});return {set:s,immediately:t.owner,withAssignBacklogs:nm(o.owner),secs:Math.round((Date.now()-t0)/1000),restore:s3.s};});
await cs('E-17b master off: backlog not processed',async()=>{await pres({a1:'out',a2:'out',a3:'out'});const t=await rrU('QA AS6 SEQ bl master');const ns=(await api('GET','/desk/assignment/notification-settings')).j.data;const m=sh(await api('PUT','/desk/assignment/notification-settings',{...ns,round_robin_rules_enabled:false}));LED('RR master OFF');
 await setP({assign_backlogs:true,backlog_limit:5});await pres({a1:'on',a2:'on',a3:'on'});await W(75000);const off=await own(t.id);
 const m2=sh(await api('PUT','/desk/assignment/notification-settings',{...ns,round_robin_rules_enabled:true}));LED('RR master restored ON');let on=null;for(let i=0;i<10;i++){await W(10000);on=await own(t.id);if(on.owner)break;}await setP({});return {backlog:t.owner,master:m.s,whileOff:nm(off.owner),after:nm(on.owner),restore:m2.s};});
await cs('NF-3 20 concurrent updates, pool A1/A2',async()=>{const r=await mkRule({type:'round_robin',department_id:IDS.DA,name:'QA AS6 RR conc',is_active:true,execute_on:['update'],targets:[{criteria:C('QA AS6 CONC'),method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1,IDS.A2],team_id:null,excluded_user_ids:[]}}]});IDS.RR_CONC=r.id;
 const ids=[];for(let i=1;i<=20;i++){const t=await mkTicket('QA AS6 CONC '+i,IDS.DA);ids.push(t.id);}for(const id of ids)await unassign(id);await W(3000);
 const t0=Date.now();await Promise.all(ids.map(id=>patchT(id,{priority:'Low'})));const ms=Date.now()-t0;await W(8000);
 const c={};let dbl=0;const times=[];for(const id of ids){const o=await own(id);c[nm(o.owner)]=(c[nm(o.owner)]||0)+1;const a=await act(id);const n=Array.isArray(a)?a.filter(x=>x.action==='ticket.auto_assigned').length:0;if(n>1)dbl++;}
 return {rule:r.s,patchAllMs:ms,counts:c,ticketsWithTwoAssignments:dbl};});
await cs('NF-3b threshold race: dept threshold, 20 concurrent',async()=>{
 // A1 agent-level threshold = A1 current open count + 3 is unknown; use agent thresholds relative: set A2 to 1 (A2 full), A1 200 → all must go to A1, none to A2
 const s=await setP({department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:true,agent_thresholds:[{user_id:IDS.A1,threshold:200}]});
 const ids=[];for(let i=1;i<=10;i++){const t=await mkTicket('QA AS6 CONC thr '+i,IDS.DA);ids.push(t.id);}for(const id of ids)await unassign(id);await W(3000);await Promise.all(ids.map(id=>patchT(id,{priority:'Low'})));await W(8000);
 const c={};for(const id of ids){const o=await own(id);c[nm(o.owner)]=(c[nm(o.owner)]||0)+1;}await setP({});return {s,counts:c};});
saveIds(); return RES;
