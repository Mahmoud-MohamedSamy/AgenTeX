// Part B batch 4: notifications (OR-20, 32, 33, 35, G-06) + later events (OR-21) + a step fails (OR-25) + loops (OR-26). Ticket numbers saved for the bell check (pb4-bell.js as each agent).
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();R.notifSettings=orig;const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const NUM={};const num=async(tag,id)=>{const n=(await rec(id)).ticket_number;NUM[tag]=n;fs.writeFileSync('../pb4-nums.json',JSON.stringify(NUM,null,1));return n;};
const or05=JSON.parse(fs.readFileSync('../pb-or05.json','utf8'));NUM['OR-19/D-16 (A1 then A2)']=or05.num;
const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
const tm=(await api('GET','/desk/teams/'+TEAM)).j?.data;R.team=(tm?.name||'')+' members='+((tm?.member_ids||tm?.members||[]).map(m=>nm(m.user_id||m.id||m))).join(',');
try{
await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});R.presence=await presence();
await cs(R,'OR-32 only a direct rule assigns',async()=>{const k='PB32'+U;const d=await prule('direct','PB32 d',[daT(k,ag(A3))]);const id=await ptk(k);const o=await waitRec(id,x=>x.owner);await off(d.id);return {owner:nm(o.owner),num:await num('OR-32 direct → A3',id),feed:await feedS(id)};});
await cs(R,'OR-20 team target, no owner',async()=>{const k='PB20'+U;const d=await prule('direct','PB20 d',[daT(k,{kind:'team',user_id:null,team_id:TEAM})]);const id=await ptk(k);await sleep(12000);const o=await rec(id);await off(d.id);return {owner:nm(o.owner),team:nm(o.team),num:await num('OR-20 team only',id),feed:await feedS(id)};});
await cs(R,'OR-33 workflow sets owner',async()=>{const k='PB33'+U;await wrule('OR33',{kind:'RecordCreated'},wcon(k),[{type:'OwnerAssignment',ownerTargetKind:'SpecificUser',ownerValue:A3}]);const id=await ptk(k);const o=await waitRec(id,x=>x.owner);return {owner:nm(o.owner),num:await num('OR-33 workflow → A3',id),feed:await feedS(id)};});
await cs(R,'OR-35 RR assigns + blueprint entry in the same event; G-06 later edit',async()=>{const k='PB35'+U;
 const b=await api('POST','/modules/'+T+'/blueprints',{definition:{name:'QA AO PB OR35 '+U,description:'QA',moduleKey:'desk_tickets',targetField:'status',departmentId:DA,entryCriteria:{op:'contains',field:'description',value:k},states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar'},{id:'On Hold',name:'On Hold',position:{x:300,y:0},slaClock:'calendar'}],transitions:[{id:'hold',name:'QA hold',fromStateId:'Open',toStateId:'On Hold',before:{},during:{},after:{actions:[{type:'field_update',field:'owner',value:A2}]}}]},isActive:true});if(b.j?.data?.id){pbm.bp.push(b.j.data.id);pbSave();}
 const rr=await prule('round_robin','PB35 rr',[rrT(k,'sequential',[A1])],{on:['create','update']});
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner);await sleep(5000);const n=await num('OR-35 RR → A1 + blueprint',id);
 await patch(id,{priority:'medium'});await sleep(8000);await off(rr.id);
 // OR-21 part: blueprint transition after-action changes the owner
 const run=await api('POST','/desk/tickets/'+id+'/blueprint-transitions/hold',{run_id:uuid(),expected_state_id:'Open',fields:{}});await sleep(8000);const o2=await rec(id);
 return {bp:b.s+' '+(b.j?.error?.message||''),owner:nm(o.owner),run:E(run),ownerAfterTransition:nm(o2.owner),num:n,feed:await feedS(id)};});
await cs(R,'OR-21 SLA escalation reassigns',async()=>{const k='PB21'+U;
 const p=await api('POST','/desk/sla/policies',{department_id:DA,name:'QA AO PB OR21 '+U,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,
  targets:[{name:'t',criteria:{conditions:[{field_key:'description',operator:'contains',value:k}],pattern:null},response:{value:1,unit:'minutes'},resolution:{value:60,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,
   escalations:{response:[{timing:'at',offset:null,recipients:[{kind:'agent',id:A1}],template_ref:null,actions:{assign_owner:A3,assign_team:null,set_priority:null}}],resolution:[]}}]});
 if(p.j?.data?.id){pbm.sla.push(p.j.data.id);pbSave();}if(p.s>=300)return 'policy '+E(p);
 const saved=JSON.stringify((await api('GET','/desk/sla/policies/'+p.j.data.id)).j?.data?.targets?.[0]?.escalations).slice(0,400);
 const id=await ptk(k,{owner:A2});await num('OR-21 SLA escalation reassign → A3',id);fs.writeFileSync('../pb-or21.json',JSON.stringify({id,saved}));return {saved,owner0:await own(id)};});
await cs(R,'OR-25 a step fails (webhook fails, RR and SLA still run)',async()=>{const k='PB25'+U;
 await wrule('OR25',{kind:'RecordCreated'},wcon(k),[{type:'Webhook',method:'POST',url:'https://127.0.0.1/qa-fail',bodyTemplate:'{}',headers:{},timeoutSeconds:10},{type:'AddTicketComment',commentBody:'QA OR-25 second action',commentIsPublic:false}]).catch(e=>'wf '+e.message);
 const w2=await api('POST','/workflow/rules',{moduleId:T,departmentIds:[DA],name:'QA AO PB OR25b '+U,isActive:true,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:wcon(k),actions:[{order:0,delaySeconds:0,type:'Webhook',method:'POST',url:'https://httpstat.us/500',bodyTemplate:'{}',headers:{},timeoutSeconds:10},{order:1,delaySeconds:0,type:'AddTicketComment',commentBody:'QA OR-25 after 500',commentIsPublic:false}]});if(w2.j?.data?.id){pbm.wf.push(w2.j.data.id);pbSave();}
 const rr=await prule('round_robin','PB25 rr',[rrT(k,'sequential')],{on:['create','update']});
 const pi=await api('POST','/desk/sla/policies',{department_id:DA,name:'QA AO PB OR25 inactive '+U,description:null,is_active:false,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,targets:[{name:'t',criteria:{conditions:[{field_key:'description',operator:'contains',value:k}],pattern:null},response:{value:60,unit:'minutes'},resolution:{value:600,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]});if(pi.j?.data?.id){pbm.sla.push(pi.j.data.id);pbSave();}
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner);await sleep(25000);const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;
 const out={wf2:w2.s+' '+(w2.j?.error?.message||''),owner:nm(o.owner),sla:s?.policy_name||s?.state||'none',execs:await execsOf(id),feed:await feedS(id)};await off(rr.id);return out;});
await cs(R,'OR-26 two workflow rules that re-trigger each other',async()=>{const k='PB26'+U;
 await wrule('OR26 a',{kind:'RecordUpdated'},wand(wcon(k),{kind:'Membership',field:'priority',negate:false,values:[{kind:'string',stringValue:'low'}]}),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'high'}}}]);
 await wrule('OR26 b',{kind:'RecordUpdated'},wand(wcon(k),{kind:'Membership',field:'priority',negate:false,values:[{kind:'string',stringValue:'high'}]}),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}}]);
 const id=await ptk(k,{priority:'medium'});await sleep(3000);await patch(id,{priority:'low'});await sleep(30000);const e1=await execsOf(id);await sleep(20000);const e2=await execsOf(id);
 return {priority:(await rec(id)).priority,execsAt30s:e1.length,execsAt50s:e2.length,execs:e2.slice(0,8),feed:(await feedS(id)).slice(0,600)};});
}finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchNow=(await notif()).direct_rules_enabled;}
R.nums=NUM;fs.writeFileSync('../pb4-result.json',JSON.stringify(R,null,1));return R;
