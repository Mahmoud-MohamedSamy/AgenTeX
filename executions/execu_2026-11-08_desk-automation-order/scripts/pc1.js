// Part C: OR-22 (whole chain on create) and OR-23 (same chain from an update; create-only rules must not run).
// Chain: ticket made in Dept B → direct rule moves it to Dept A (unassigned) → skill sk2 stamped → workflow (needs Dept A) sets Urgent
// → SLA target needs Urgent → skill round robin needs Urgent + skill → A2 → blueprint needs owner A2 → notification to A2.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();if(!fs.existsSync('../pb-switch-orig.json'))fs.writeFileSync('../pb-switch-orig.json',JSON.stringify(orig));
const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);const S2=SL.find(s=>s.name==='QA AS6 sk2');const SO=JSON.parse(fs.readFileSync('../pb-skill-orig.json','utf8'));
const c=(f,op,v)=>({field_key:f,operator:op,value:v});
const tgt=(name,conds,resp,res)=>({name,criteria:{conditions:conds,pattern:conds.length>1?conds.map((_,i)=>i+1).join(' and '):null},response:{value:resp,unit:'minutes'},resolution:{value:res,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}});
const pol=async(name,targets,trig)=>{const r=await api('POST','/desk/sla/policies',{department_id:DA,name:'QA AO PC '+name+' '+U,description:null,is_active:true,triggers:{create:trig.create,update:trig.update,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,targets});if(r.j?.data?.id){pbm.sla.push(r.j.data.id);pbSave();return r.j.data.id;}throw new Error('policy '+E(r));};
const bp=async(tag,k,owner)=>{const r=await api('POST','/modules/'+T+'/blueprints',{definition:{name:'QA AO PC '+tag+' '+U,description:'QA',moduleKey:'desk_tickets',targetField:'status',departmentId:DA,entryCriteria:{op:'and',children:[{op:'contains',field:'description',value:k},{op:'eq',field:'owner',value:owner}]},states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar'},{id:'Closed',name:'Closed',position:{x:300,y:0},slaClock:'calendar',isTerminal:true}],transitions:[{id:'end',name:'QA end',fromStateId:'Open',toStateId:'Closed',before:{allowOwner:true},during:{},after:{actions:[]}}]},isActive:true});if(r.j?.data?.id){pbm.bp.push(r.j.data.id);pbSave();return r.j.data.id;}throw new Error('bp '+E(r));};
const sla=async id=>{const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return {policy:s?.policy_name,target:s?.target_name,obl:(s?.obligations||[]).map(o=>o.kind+' due '+(o.due_at||'').slice(11,19))};};
const bst=async id=>{const s=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];return s?s.blueprintName+' '+s.activeStates:null;};
const fullFeed=async id=>(await feed(id)).reverse().map(e=>(e.created_at||e.at||'').slice(11,23)+' '+e.action+(e.summary?.trigger?'('+e.summary.trigger+')':'')+(e.summary?.to_owner_id||e.summary?.owner_id?'→'+nm(e.summary.to_owner_id||e.summary.owner_id):''));
const chain=async(tag,k,mode)=>{const on=mode==='create'?['create']:['update'];
 await api('PUT','/desk/skills/'+S2.id+'?department_id='+DA,{name:S2.name,type_id:S2.type_id,description:S2.description,is_active:true,criteria:{conditions:[c('description','contains',k)],pattern:null},agent_ids:S2.agent_ids});
 const d=await prule('direct','PC '+tag+' d',[daT(k,{kind:'unassigned',user_id:null,team_id:null},{coming:DB,move:DA})],{on});
 await wrule('PC '+tag,{kind:mode==='create'?'RecordCreated':'RecordUpdated'},wand(wcon(k),{kind:'Membership',field:'department',negate:false,values:[{kind:'string',stringValue:DA}]}),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'urgent'}}}],{dept:DA});
 await pol(tag,[tgt('urgent 30',[c('description','contains',k),c('priority','equals','urgent')],30,240),tgt('other 300',[c('description','contains',k)],300,900)],{create:mode==='create',update:mode!=='create'});
 const rr=await prule('round_robin','PC '+tag+' rr',[{criteria:crit(k,[c('priority','equals','urgent')]),method:'skill',pool:{kind:'agents',user_ids:[A1,A2,A3],team_id:null,excluded_user_ids:[]}}],{on:mode==='create'?['create']:['update']});
 await bp(tag,k,A2);return [d.id,rr.id];};
try{
await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});R.presence=await presence();
await cs(R,'OR-22 whole chain on create',async()=>{const k='PC22'+U;const ids=await chain('OR22',k,'create');
 const t0=new Date().toISOString();const id=await ptk(k,{},DB);const o=await waitRec(id,x=>x.owner,30);await sleep(12000);const r=await rec(id);
 const out={created:t0.slice(11,23),num:r.ticket_number,dept:nm(r.department),skills:await skillsOf(id),priority:r.priority,sla:await sla(id),owner:nm(r.owner),blueprint:await bst(id),execs:await execsOf(id),history:await fullFeed(id)};
 await off(...ids);fs.writeFileSync('../pc-or22.json',JSON.stringify({id,num:r.ticket_number}));return out;});
await cs(R,'OR-23 whole chain from an update (+ create-only control rules)',async()=>{const k='PC23'+U;const ids=await chain('OR23',k,'update');
 const ctl=await prule('round_robin','PC23 create-only ctl',[rrT(k,'sequential',[A3])],{on:['create']});
 await wrule('PC23 create-only ctl',{kind:'RecordCreated'},wcon(k),[{type:'AddTicketComment',commentBody:'QA OR-23 create-only rule ran (should not)',commentIsPublic:false}],{dept:DA});
 const id=await ptk('PC23blank'+U,{},DB);await sleep(10000);const before=await rec(id);
 await patch(id,{description:'QA AO PB '+k+' now matches'});const o=await waitRec(id,x=>x.owner,30);await sleep(12000);const r=await rec(id);
 const out={before:{dept:nm(before.department),owner:nm(before.owner),priority:before.priority},num:r.ticket_number,dept:nm(r.department),skills:await skillsOf(id),priority:r.priority,sla:await sla(id),owner:nm(r.owner),blueprint:await bst(id),execs:await execsOf(id),history:await fullFeed(id)};
 await off(...ids,ctl.id);fs.writeFileSync('../pc-or23.json',JSON.stringify({id,num:r.ticket_number}));return out;});
}finally{const o=[];for(const x of SO)o.push((await api('PUT','/desk/skills/'+x.id+'?department_id='+DA,{name:x.name,type_id:x.type_id,description:x.description,is_active:x.is_active,criteria:x.criteria,agent_ids:x.agent_ids})).s);R.skillRestore=o;
 R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchNow=(await notif()).direct_rules_enabled;}
fs.writeFileSync('../pc1-result.json',JSON.stringify(R,null,1));return R;
