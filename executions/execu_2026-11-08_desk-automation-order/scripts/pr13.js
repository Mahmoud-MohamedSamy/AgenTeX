// OR-13 repro for the bug filing: SLA policy (create) + RR rule whose condition is SLA name = that policy; new ticket. Kept for screenshots; pb-clean.js removes it.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const c=(f,op,v)=>({field_key:f,operator:op,value:v});
const pname='QA AO OR13 SLA '+U;
const p=await api('POST','/desk/sla/policies',{department_id:DA,name:pname,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,
 targets:[{name:'t',criteria:{conditions:[c('description','contains','PR13'+U)],pattern:null},response:{value:60,unit:'minutes'},resolution:{value:600,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]});
if(!p.j?.data?.id)throw new Error('pol '+E(p));pbm.sla.push(p.j.data.id);pbSave();
const k='PR13'+U;
const rr=await prule('round_robin','OR13 RR on SLA name',[rrT(k,'sequential',[A1,A2,A3],[c('sla_name','equals',pname)])],{on:['create','update']});
const id=await ptk(k);await sleep(20000);const o=await rec(id);
const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;
const out={id,num:o.ticket_number,owner:nm(o.owner),sla_name:o.sla_name,policy:s?.policy_name,obl:(s?.obligations||[]).map(q=>q.kind+':'+q.state),feed:await feedS(id),rr:rr.id,policyId:p.j.data.id,pname};
fs.writeFileSync('../pr13.json',JSON.stringify(out,null,1));return out;
