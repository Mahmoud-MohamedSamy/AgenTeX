// Part B batch 3: blueprint pairs OR-16/L1, OR-17/L2, OR-30, OR-31 and Group L3, L4, L6, L7 (L5 macro not run: macros skipped by the user).
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();if(!fs.existsSync('../pb-switch-orig.json'))fs.writeFileSync('../pb-switch-orig.json',JSON.stringify(orig));
const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const bp=async(tag,entry,o={})=>{const d={name:'QA AO PB '+tag+' '+U,description:'QA - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:o.dept||DA,entryCriteria:entry,
 states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar'},{id:'Closed',name:'Closed',position:{x:300,y:0},slaClock:'calendar',isTerminal:true}],
 transitions:[{id:'end',name:'QA end',fromStateId:'Open',toStateId:'Closed',before:o.before||{},during:{},after:{actions:[]}}]};
 const r=await api('POST','/modules/'+T+'/blueprints',{definition:d,isActive:true});const id=r.j?.data?.id;if(id){pbm.bp.push(id);pbSave();return id;}throw new Error('bp '+r.s+' '+r.t.slice(0,250));};
const bstate=async id=>{const s=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];return s?{bp:s.blueprintName,state:s.activeStates}:null;};
const waitBp=async(id,s=24)=>{for(let i=0;i<s/2;i++){const b=await bstate(id);if(b)return b;await sleep(2000);}return null;};
const dc=k=>({op:'contains',field:'description',value:k});
const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);const S2=SL.find(s=>s.name==='QA AS6 sk2');const SO=JSON.parse(fs.readFileSync('../pb-skill-orig.json','utf8'));
try{
await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});R.presence=await presence();
await cs(R,'OR-16/L1 workflow update makes ticket match blueprint',async()=>{const k='PB16'+U;await bp('OR16',{op:'contains',field:'subject',value:k+'E'});
 await wrule('OR16',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{subject:{kind:'string',stringValue:'QA AO PB '+k+'E set by workflow'}}}]);
 const id=await ptk(k);const b=await waitBp(id);const o=await rec(id);return {subject:o.subject,blueprint:b,execs:await execsOf(id),feed:await feedS(id)};});
await cs(R,'OR-17/L2 round robin owner › blueprint entry on owner',async()=>{const k='PB17'+U;const bid=await bp('OR17',{op:'and',children:[dc(k),{op:'eq',field:'owner',value:A1}]},{before:{allowOwner:true}});
 const rr=await prule('round_robin','PB17 rr',[rrT(k,'sequential',[A1])],{on:['create','update']});
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner);const b=await waitBp(id,16);
 const run=await api('POST','/desk/tickets/'+id+'/blueprint-transitions/end',{run_id:require('crypto').randomUUID(),expected_state_id:'Open',fields:{}});
 const out={owner:nm(o.owner),blueprint:b,adminRun:run.s+' '+(run.j?.error?.code||''),feed:await feedS(id)};await off(rr.id);fs.writeFileSync('../pb-or17.json',JSON.stringify({id,bid}));return out;});
await cs(R,'OR-30 skill › blueprint entry on skills',async()=>{const k='PB30'+U;await api('PUT','/desk/skills/'+S2.id+'?department_id='+DA,{name:S2.name,type_id:S2.type_id,description:S2.description,is_active:true,criteria:{conditions:[{field_key:'description',operator:'contains',value:k}],pattern:null},agent_ids:S2.agent_ids});
 await bp('OR30',{op:'and',children:[dc(k),{op:'contains',field:'skills',value:S2.name}]});
 const id=await ptk(k);const b=await waitBp(id,20);return {skills:await skillsOf(id),blueprint:b};});
await cs(R,'OR-31 direct moves + assigns › blueprint entry',async()=>{const k='PB31'+U;await bp('OR31',{op:'and',children:[dc(k),{op:'eq',field:'owner',value:A2}]});
 const d=await prule('direct','PB31 d',[daT(k,ag(A2),{coming:DB,move:DA})]);
 const id=await ptk(k,{},DB);const o=await waitRec(id,x=>x.owner);const b=await waitBp(id,16);const out={dept:nm(o.department),owner:nm(o.owner),blueprint:b,feed:await feedS(id)};await off(d.id);return out;});
await cs(R,'L3 workflow sets Status on a ticket in a blueprint',async()=>{const k='PBL3'+U;await bp('L3',dc(k));
 await wrule('L3',{kind:'RecordUpdated'},wand(wcon(k),{kind:'Membership',field:'priority',negate:false,values:[{kind:'string',stringValue:'low'}]}),[{type:'FieldUpdate',fieldUpdates:{status:{kind:'string',stringValue:'Closed'}}}]);
 const id=await ptk(k);const b0=await waitBp(id);await patch(id,{priority:'low'});await sleep(15000);const o=await rec(id);
 return {before:b0,status:o.status,priority:o.priority,after:await bstate(id),execs:await execsOf(id),feed:await feedS(id)};});
await cs(R,'L4 API sets Status on a ticket in a blueprint',async()=>{const k='PBL4'+U;await bp('L4',dc(k));const id=await ptk(k);const b0=await waitBp(id);
 const p=await patch(id,{status:'Closed'});await sleep(3000);return {before:b0,patch:E(p),status:(await rec(id)).status,after:await bstate(id)};});
await cs(R,'L6 time-based (delayed) workflow action sets Status',async()=>{const k='PBL6'+U;await bp('L6',dc(k));
 const w=await api('POST','/workflow/rules',{moduleId:T,departmentIds:[DA],name:'QA AO PB L6 '+U,isActive:true,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:wcon(k),actions:[{order:0,delaySeconds:60,type:'FieldUpdate',fieldUpdates:{status:{kind:'string',stringValue:'Closed'}}}]});if(w.j?.data?.id){pbm.wf.push(w.j.data.id);pbSave();}
 const id=await ptk(k);const b0=await waitBp(id);await sleep(100000);const o=await rec(id);return {rule:w.s+' '+(w.j?.error?.message||''),before:b0,status:o.status,after:await bstate(id),execs:await execsOf(id)};});
await cs(R,'L7 department change on a ticket in a blueprint',async()=>{const k='PBL7'+U;await bp('L7',dc(k));const id=await ptk(k);const b0=await waitBp(id);
 const p=await patch(id,{department:DB});await sleep(6000);const o=await rec(id);return {before:b0,patch:E(p),dept:nm(o.department),status:o.status,after:await bstate(id),feed:await feedS(id)};});
}finally{const o=[];for(const x of SO)o.push((await api('PUT','/desk/skills/'+x.id+'?department_id='+DA,{name:x.name,type_id:x.type_id,description:x.description,is_active:x.is_active,criteria:x.criteria,agent_ids:x.agent_ids})).s);R.skillRestore=o;
 R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchNow=(await notif()).direct_rules_enabled;}
fs.writeFileSync('../pb3-result.json',JSON.stringify(R,null,1));return R;
