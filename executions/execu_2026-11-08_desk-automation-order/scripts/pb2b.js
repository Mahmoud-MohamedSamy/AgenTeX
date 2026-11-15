// OR-13 diagnosis (RR on sla_name: create vs later update), OR-14b (policy without update trigger: does resolution count from assignment?), OR-29 with borrowed sk2.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const tgt=(name,conds,resp,res)=>({name,criteria:{conditions:conds,pattern:conds.length>1?conds.map((_,i)=>i+1).join(' and '):null},response:{value:resp,unit:'minutes'},resolution:{value:res,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}});
const pol=async(name,targets,o={})=>{const r=await api('POST','/desk/sla/policies',{department_id:DA,name:'QA AO PB '+name+' '+U,description:null,is_active:true,triggers:{create:true,update:o.update??true,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:o.fromCreated??true,targets});const id=r.j?.data?.id;if(id){pbm.sla.push(id);pbSave();return {id,name:'QA AO PB '+name+' '+U};}throw new Error('policy '+r.s+' '+r.t.slice(0,250));};
const sla=async id=>{const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return {policy:s?.policy_name,target:s?.target_name,obl:(s?.obligations||[]).map(o=>o.kind+':'+o.state+' start '+(o.started_at||'').slice(11,19)+' due '+(o.due_at||'').slice(5,19))};};
const c=(f,op,v)=>({field_key:f,operator:op,value:v});
const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);const S2=SL.find(s=>s.name==='QA AS6 sk2');const SO=JSON.parse(fs.readFileSync('../pb-skill-orig.json','utf8'));
try{
await cs(R,'OR-13b RR on sla_name: create, then update',async()=>{const k='PB13b'+U;const p=await pol('OR13b',[tgt('t',[c('description','contains',k)],60,600)],{update:false});
 const rr=await prule('round_robin','PB13b rr',[rrT(k,'sequential',[A1,A2,A3],[c('sla_name','equals',p.name)])],{on:['create','update']});
 const rr2=await prule('round_robin','PB13b ctl',[rrT(k+'X','sequential',[A1,A2,A3])],{on:['create','update']});
 const id=await ptk(k);await sleep(15000);const afterCreate=await own(id);await patch(id,{priority:'medium'});const o=await waitRec(id,x=>x.owner,20);
 const out={afterCreate,afterUpdate:nm(o.owner),slaName:o.sla_name,sla:await sla(id),feed:await feedS(id)};await off(rr.id,rr2.id);return out;});
await cs(R,'OR-14b resolution from assignment, no update trigger',async()=>{const k='PB14b'+U;const p=await pol('OR14b',[tgt('t',[c('description','contains',k)],60,120)],{fromCreated:false,update:false});
 const rr=await prule('round_robin','PB14b rr',[rrT(k,'sequential',[A1,A2,A3],[c('priority','equals','low')])],{on:['update']});
 const t0=new Date().toISOString();const id=await ptk(k);await sleep(70000);const before=await sla(id);const t1=new Date().toISOString();await patch(id,{priority:'low'});const o=await waitRec(id,x=>x.owner,24);await sleep(5000);
 const out={created:t0.slice(11,19),patchAt:t1.slice(11,19),owner:nm(o.owner),before,after:await sla(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-29 skill › SLA criteria',async()=>{const k='PB29'+U;await api('PUT','/desk/skills/'+S2.id+'?department_id='+DA,{name:S2.name,type_id:S2.type_id,description:S2.description,is_active:true,criteria:{conditions:[c('description','contains',k)],pattern:null},agent_ids:S2.agent_ids});
 const p=await pol('OR29',[tgt('skill 20',[c('description','contains',k),c('skills','contains',S2.name)],20,200),tgt('fallback 400',[c('description','contains',k)],400,900)]);
 const id=await ptk(k);await sleep(20000);return {skills:await skillsOf(id),sla:await sla(id)};});
}finally{const o=[];for(const x of SO)o.push((await api('PUT','/desk/skills/'+x.id+'?department_id='+DA,{name:x.name,type_id:x.type_id,description:x.description,is_active:x.is_active,criteria:x.criteria,agent_ids:x.agent_ids})).s);R.skillRestore=o;}
fs.writeFileSync('../pb2b-result.json',JSON.stringify(R,null,1));return R;
