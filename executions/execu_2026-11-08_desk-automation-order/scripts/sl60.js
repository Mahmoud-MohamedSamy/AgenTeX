// SL-60 evidence: QA AO Dept A contract + QA AO Dept B support plan attached. Kept for the screenshot; ids → ../sl60.json.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',B='4853562a-0b4d-45cb-ba34-9f2118fcd32c',ACC='784400e1-4a2a-42c2-b4f3-7ca56e79828a',CON='0924eb24-e42a-4eab-8efd-e3428f19e882';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6);const R={u};
const ok=(r,w)=>{if(r.s>=300)throw new Error(w+' '+r.s+' '+r.t.slice(0,200));return r.j.data.id;};
const pol=ok(await api('POST','/desk/sla/policies',{department_id:B,name:'QA AO SL60 Dept B policy '+u,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,targets:[{name:'t',criteria:{conditions:[{field_key:'description',operator:'contains',value:'SL60never'+u}],pattern:null},response:{value:60,unit:'minutes'},resolution:{value:3,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]}),'policy');
const plan=ok(await api('POST','/desk/sla/support-plans',{department_id:B,name:'QA AO SL60 Dept B plan '+u,description:null,policy_id:pol,type:'unlimited'}),'plan');
const acc=ok(await api('POST','/modules/'+ACC+'/records',{data:[f('account_name','QA AO SL60 Account '+u)]}),'account');
const today=new Date().toISOString().slice(0,10),later=new Date(Date.now()+90*86400000).toISOString().slice(0,10);
const con=ok(await api('POST','/modules/'+CON+'/records',{data:[f('contract_name','QA AO SL60 Dept A contract '+u),f('department',A),f('account_id',acc),f('start_date',today),f('end_date',later),f('support_plan',plan)]}),'contract');R.contractCreatedWithDeptBPlan=true;
const at=await api('PUT','/desk/sla/contracts/'+con+'/plan',{plan_id:plan});R.attach=at.s+' '+at.t.slice(0,200);
R.coverage=(await api('GET','/desk/sla/contracts/'+con+'/coverage')).t.slice(0,400);
fs.writeFileSync('../sl60.json',JSON.stringify({pol,plan,acc,con,u}));fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' SL-60 evidence: policy '+pol+', plan '+plan+' (Dept B), account '+acc+', contract '+con+' (Dept A) — delete after the image.\n');
return R;
