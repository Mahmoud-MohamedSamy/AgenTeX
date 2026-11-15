// Part C: E2E-2 (SLA breach → escalation reassigns → blueprint continues with the new owner), E2E-3 (move department mid-way), E2E-4 (rule broken mid-chain, admin fixes, reapply).
// PHASE=setup creates and saves ids to ../pc3.json; PHASE=check reads results after the waits.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const PH=process.env.PHASE;const F='../pc3.json';const M=fs.existsSync(F)?JSON.parse(fs.readFileSync(F,'utf8')):{};const save=()=>fs.writeFileSync(F,JSON.stringify(M,null,1));
const R={};const c=(f,op,v)=>({field_key:f,operator:op,value:v});
const pol=async(name,dept,conds,resp,res,esc)=>{const r=await api('POST','/desk/sla/policies',{department_id:dept,name:'QA AO PC '+name+' '+U,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,
 targets:[{name:'t',criteria:{conditions:conds,pattern:conds.length>1?conds.map((_,i)=>i+1).join(' and '):null},response:{value:resp,unit:'minutes'},resolution:{value:res,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:esc||[],resolution:[]}}]});if(r.j?.data?.id){pbm.sla.push(r.j.data.id);pbSave();return r.j.data.id;}throw new Error('policy '+E(r));};
const bp=async(tag,entry,trans,dept=DA)=>{const r=await api('POST','/modules/'+T+'/blueprints',{definition:{name:'QA AO PC '+tag+' '+U,description:'QA',moduleKey:'desk_tickets',targetField:'status',departmentId:dept,entryCriteria:entry,states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar'},{id:'On Hold',name:'On Hold',position:{x:300,y:0},slaClock:'calendar'},{id:'Closed',name:'Closed',position:{x:600,y:0},slaClock:'calendar',isTerminal:true}],transitions:trans},isActive:true});if(r.j?.data?.id){pbm.bp.push(r.j.data.id);pbSave();return r.j.data.id;}throw new Error('bp '+E(r));};
const tr=(id,a,b,before={})=>({id,name:'QA '+id,fromStateId:a,toStateId:b,before,during:{},after:{actions:[]}});
const sla=async id=>{const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return {policy:s?.policy_name,obl:(s?.obligations||[]).map(o=>o.kind+':'+o.state+' due '+(o.due_at||'').slice(11,19))};};
const bst=async id=>{const s=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];return s?s.blueprintName+' › '+s.activeStates:null;};
const hist=async id=>(await feed(id)).reverse().map(e=>(e.occurred_at||'').slice(11,19)+' '+e.action+(e.summary?.trigger?'('+e.summary.trigger+')':'')+(e.summary?.owner_id?'→'+nm(e.summary.owner_id):'')+(e.summary?.new_value&&e.action==='ticket.owner_changed'?'→'+nm(e.summary.new_value):''));
const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
if(PH==='setup'){
 await cs(R,'E2E-2 setup',async()=>{const k='PCE2'+U;M.k2=k;
  await pol('E2E2',DA,[c('description','contains',k)],1,120,[{timing:'at',offset:null,recipients:[{kind:'agent',id:A3}],template_ref:null,actions:{assign_owner:A3,assign_team:null,set_priority:null}}]);
  await bp('E2E2',{op:'contains',field:'description',value:k},[tr('next','Open','On Hold',{allowOwner:true}),tr('end','On Hold','Closed',{allowOwner:true})]);
  const id=await ptk(k,{owner:A2});M.t2=id;save();await sleep(5000);return {owner:await own(id),sla:await sla(id),bp:await bst(id)};});
 await cs(R,'E2E-3 setup + move',async()=>{const k='PCE3'+U;M.k3=k;
  await pol('E2E3 A',DA,[c('description','contains',k)],60,600);await pol('E2E3 B',DB,[c('description','contains',k)],15,120);
  const rrA=await prule('round_robin','PC E3 rr A',[rrT(k,'sequential',[A1])],{on:['create','update']});
  const rrB=await api('POST','/desk/assignment-rules',{type:'round_robin',department_id:DB,name:'QA AO PC E3 rr B '+U,description:'QA',is_active:true,execute_on:['create','update'],targets:[{criteria:crit(k),method:'sequential',pool:{kind:'agents',user_ids:[A3],team_id:null,excluded_user_ids:[]}}]});if(rrB.j?.data?.id){pbm.rules.push(rrB.j.data.id);pbSave();}
  await bp('E2E3',{op:'contains',field:'description',value:k},[tr('next','Open','On Hold'),tr('end','On Hold','Closed')]);
  const id=await ptk(k);M.t3=id;save();await waitRec(id,x=>x.owner);await sleep(6000);const before={owner:await own(id),sla:await sla(id),bp:await bst(id)};
  const mv=await api('POST','/desk/tickets/'+id+'/move',{department_id:DB});await sleep(15000);const o=await rec(id);
  const out={before,move:E(mv),rrB:E(rrB),after:{dept:nm(o.department),owner:nm(o.owner),status:o.status,sla:await sla(id),bp:await bst(id)},history:await hist(id)};await off(rrA.id);if(rrB.j?.data?.id)await off(rrB.j.data.id);return out;});
 await cs(R,'E2E-4 broken rule, fix, reapply',async()=>{const k='PCE4'+U;
  const rr=await prule('round_robin','PC E4 rr',[rrT(k,'sequential',[A1])],{on:['create','update'],active:false});
  await bp('E2E4',{op:'and',children:[{op:'contains',field:'description',value:k},{op:'eq',field:'owner',value:A1}]},[tr('next','Open','On Hold',{allowOwner:true}),tr('end','On Hold','Closed')]);
  const id=await ptk(k);await sleep(12000);const broken={owner:await own(id),bp:await bst(id)};
  const fix=await setA(rr.id,true);await sleep(3000);const p=await patch(id,{priority:'medium'});const o=await waitRec(id,x=>x.owner,24);await sleep(5000);
  const out={broken,fix,reapplyEdit:E(p),after:{owner:nm(o.owner),bp:await bst(id)},history:await hist(id)};await off(rr.id);return out;});
 fs.writeFileSync('../pc3-setup-result.json',JSON.stringify(R,null,1));return R;}
if(PH==='check'){const id=M.t2;const o=await rec(id);R.E2E2={num:o.ticket_number,owner:nm(o.owner),sla:await sla(id),bp:await bst(id),history:await hist(id)};fs.writeFileSync('../pc3-check-result.json',JSON.stringify(R,null,1));return R;}
