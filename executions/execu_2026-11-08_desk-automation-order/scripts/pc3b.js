// E2E-3b: same move, Dept B policy runs on create AND update. Does the moved ticket get Dept B's SLA?
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));const R={};const c=(f,op,v)=>({field_key:f,operator:op,value:v});
const pol=async(name,dept,k,resp,trig)=>{const r=await api('POST','/desk/sla/policies',{department_id:dept,name:'QA AO PC '+name+' '+U,description:null,is_active:true,triggers:{create:true,update:trig,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,targets:[{name:'t',criteria:{conditions:[c('description','contains',k)],pattern:null},response:{value:resp,unit:'minutes'},resolution:{value:resp*10,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]});if(r.j?.data?.id){pbm.sla.push(r.j.data.id);pbSave();}return r.s;};
const sla=async id=>{const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return {policy:s?.policy_name,obl:(s?.obligations||[]).map(o=>o.kind+':'+o.state+' due '+(o.due_at||'').slice(11,19))};};
const k='PCE3b'+U;R.pA=await pol('E2E3b A',DA,k,60,false);R.pB=await pol('E2E3b B',DB,k,15,true);
const id=await ptk(k);await sleep(8000);R.before=await sla(id);const mv=await api('POST','/desk/tickets/'+id+'/move',{department_id:DB});await sleep(15000);R.move=E(mv);R.after=await sla(id);
R.history=(await feed(id)).reverse().map(e=>(e.occurred_at||'').slice(11,19)+' '+e.action);
const dm=(await api('GET','/desk/departments/'+DB+'/members')).j?.data;R.dbMembers=JSON.stringify(dm).slice(0,300);
fs.writeFileSync('../pc3b-result.json',JSON.stringify(R,null,1));return R;
