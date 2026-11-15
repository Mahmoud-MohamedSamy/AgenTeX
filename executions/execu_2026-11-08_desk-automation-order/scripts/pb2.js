// Part B batch 2: SLA pairs (OR-07, 08, 09, 13, 14, 18, 29). Policies in QA AS6 Dept A, guarded by a key in the description.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();if(!fs.existsSync('../pb-switch-orig.json'))fs.writeFileSync('../pb-switch-orig.json',JSON.stringify(orig));
const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const tgt=(name,conds,resp,res,extra={})=>({name,criteria:{conditions:conds,pattern:conds.length>1?conds.map((_,i)=>i+1).join(' and '):null},response:{value:resp,unit:'minutes'},resolution:{value:res,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]},...extra});
const pol=async(name,targets,o={})=>{const r=await api('POST','/desk/sla/policies',{department_id:o.dept||DA,name:'QA AO PB '+name+' '+U,description:null,is_active:true,triggers:{create:true,update:o.update??true,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:o.fromCreated??true,targets});const id=r.j?.data?.id;if(id){pbm.sla.push(id);pbSave();return {id,name:'QA AO PB '+name+' '+U};}throw new Error('policy '+r.s+' '+r.t.slice(0,250));};
const sla=async id=>{const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return {policy:s?.policy_name||s?.policy?.name,target:s?.target_name||s?.target?.name,state:s?.state,obl:(s?.obligations||[]).map(o=>o.kind+':'+o.state+' start '+(o.started_at||o.start_at||'').slice(11,19)+' due '+(o.due_at||'').slice(11,19))};};
const c=(f,op,v)=>({field_key:f,operator:op,value:v});
try{
await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});
await cs(R,'OR-07 workflow raises priority, SLA per-priority target',async()=>{const k='PB07'+U;const p=await pol('OR07',[tgt('urgent 30',[c('description','contains',k),c('priority','equals','urgent')],30,120),tgt('other 480',[c('description','contains',k)],480,960)]);
 await wrule('OR07',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'urgent'}}}]);
 const t0=new Date().toISOString();const id=await ptk(k);await sleep(20000);const o=await rec(id);return {created:t0.slice(11,19),priority:o.priority,sla:await sla(id),execs:await execsOf(id)};});
await cs(R,'OR-08 workflow makes ticket match another policy',async()=>{const k='PB08'+U;const p1=await pol('OR08 high',[tgt('high 60',[c('description','contains',k),c('priority','equals','high')],60,600)]);const p2=await pol('OR08 low',[tgt('low 240',[c('description','contains',k),c('priority','equals','low')],240,1440)]);
 await wrule('OR08',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const id=await ptk(k);await sleep(20000);const o=await rec(id);return {priority:o.priority,sla:await sla(id),policies:[p1.name,p2.name]};});
await cs(R,'OR-09 direct moves dept, SLA uses final values',async()=>{const k='PB09'+U;const p=await pol('OR09 in A',[tgt('A 45',[c('description','contains',k)],45,300)]);
 const d=await prule('direct','PB09 d',[daT(k,{kind:'unassigned',user_id:null,team_id:null},{coming:DB,move:DA})]);
 const id=await ptk(k,{},DB);await sleep(20000);const o=await rec(id);const out={dept:nm(o.department),sla:await sla(id),feed:await feedS(id)};await off(d.id);return out;});
await cs(R,'OR-13 SLA › RR (RR criteria on sla_name)',async()=>{const k='PB13'+U;const p=await pol('OR13',[tgt('t',[c('description','contains',k)],60,600)]);
 const rr=await prule('round_robin','PB13 rr',[rrT(k,'sequential',[A1,A2,A3],[c('sla_name','equals',p.name)])],{on:['create','update']});
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner,24);const out={owner:nm(o.owner),sla:await sla(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-14 resolution timer from assignment (RR on update)',async()=>{const k='PB14'+U;const p=await pol('OR14',[tgt('t',[c('description','contains',k)],60,120)],{fromCreated:false});
 const rr=await prule('round_robin','PB14 rr',[rrT(k,'sequential',[A1,A2,A3],[c('priority','equals','low')])],{on:['update']});
 const t0=new Date().toISOString();const id=await ptk(k);await sleep(70000);const before=await sla(id);const t1=new Date().toISOString();await patch(id,{priority:'low'});const o=await waitRec(id,x=>x.owner,24);await sleep(5000);
 const out={created:t0.slice(11,19),assignedAround:t1.slice(11,19),owner:nm(o.owner),before,after:await sla(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-18 SLA policy + blueprint state timer',async()=>{const k='PB18'+U;const p=await pol('OR18',[tgt('t',[c('description','contains',k)],60,600)]);
 const d={name:'QA AO PB OR18 '+U,description:'QA - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:DA,entryCriteria:{op:'contains',field:'description',value:k},states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar',slaMinutes:30},{id:'Closed',name:'Closed',position:{x:300,y:0},slaClock:'calendar',isTerminal:true}],transitions:[{id:'end',name:'QA end',fromStateId:'Open',toStateId:'Closed',before:{},during:{},after:{actions:[]}}]};
 const b=await api('POST','/modules/'+T+'/blueprints',{definition:d,isActive:true});const bid=b.j?.data?.id;if(bid){pbm.bp.push(bid);pbSave();}
 const id=await ptk(k);await sleep(20000);const bs=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];
 return {bp:b.s,sla:await sla(id),blueprint:bs?{state:bs.activeStates,due:bs.slaDueAt}:null};});
await cs(R,'OR-29 skill › SLA criteria',async()=>{const k='PB29'+U;const sk=await pskill('s29',k,[A2]);const p=await pol('OR29',[tgt('skill',[c('description','contains',k),c('skills','contains',sk.name)],20,200),tgt('fallback',[c('description','contains',k)],400,900)]);
 const id=await ptk(k);await sleep(20000);return {skills:await skillsOf(id),sla:await sla(id)};});
}finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchNow=(await notif()).direct_rules_enabled;}
fs.writeFileSync('../pb2-result.json',JSON.stringify(R,null,1));return R;
