// SL-38 redesign: policy runs only for tickets whose account has a contract (execute_only_with_account); plan allowance = 1 per month.
// x0 = no account (control: no SLA), x1 = first ticket (SLA), x2 = second ticket (allowance used up). Cleans up everything.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',ACC='784400e1-4a2a-42c2-b4f3-7ca56e79828a',CON='0924eb24-e42a-4eab-8efd-e3428f19e882';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6),tag='SL38r'+u;const R={tag};const made=[];
const ok=(r,w)=>{if(!r||r.s>=300)throw new Error(w+' '+(r&&r.s)+' '+(r&&r.t.slice(0,300)));return r;};
const sla=async id=>{const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return {state:s?.state,policy:s?.policy?.name||s?.execution?.policy_name,cov:s?.coverage?.reason||s?.coverage,obl:(s?.obligations||[]).map(o=>o.kind+':'+o.state)};};
const tk=async(n,extra=[])=>{const r=ok(await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag+n),f('description','QA AO '+tag+n),f('department',A),f('status','Open'),f('priority','high'),...extra]}),'ticket');made.push(['ticket',r.j.data.id]);return r.j.data.id;};
try{
 const p=ok(await api('POST','/desk/sla/policies',{department_id:A,name:'QA AO '+tag,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:true,resolution_from_created:false,targets:[{name:'t '+tag,criteria:{conditions:[{field_key:'description',operator:'contains',value:tag}],pattern:null},response:{value:60,unit:'minutes'},resolution:{value:3,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]}),'policy');made.push(['policy',p.j.data.id]);
 const acc=ok(await api('POST','/modules/'+ACC+'/records',{data:[f('account_name','QA AO Account '+tag)]}),'account').j.data.id;made.push(['account',acc]);
 const plan=ok(await api('POST','/desk/sla/support-plans',{department_id:A,name:'QA AO Plan '+tag,description:null,policy_id:p.j.data.id,type:'allowance',allowance:1,cycle:'monthly'}),'plan').j.data.id;made.push(['plan',plan]);
 const today=new Date().toISOString().slice(0,10),later=new Date(Date.now()+90*86400000).toISOString().slice(0,10);
 const c=ok(await api('POST','/modules/'+CON+'/records',{data:[f('contract_name','QA AO Contract '+tag),f('department',A),f('account_id',acc),f('support_plan',plan),f('start_date',today),f('end_date',later)]}),'contract').j.data.id;made.push(['contract',c]);
 R.attach=(await api('PUT','/desk/sla/contracts/'+c+'/plan',{plan_id:plan})).s;
 const x0=await tk('x0');await sleep(8000);const x1=await tk('x1',[f('account_id',acc)]);await sleep(10000);const x2=await tk('x2',[f('account_id',acc)]);await sleep(10000);
 R.x0_noAccount=await sla(x0);R.x1_first=await sla(x1);R.x2_second=await sla(x2);
 R.usage=(await api('GET','/desk/sla/support-plans/'+plan+'/usage')).t.slice(0,300);
 R.coverage=(await api('GET','/desk/sla/contracts/'+c+'/coverage')).t.slice(0,300);
 R.x2feed=(JSON.stringify((await api('GET','/desk/tickets/'+x2+'/activity')).j).match(/"action":"sla\.[^"]+"[^}]{0,200}/g)||[]).slice(0,4);
}catch(e){R.error=e.message;}
R.cleanup=[];const P={ticket:i=>'/modules/'+M+'/records/'+i,contract:i=>'/modules/'+CON+'/records/'+i,plan:i=>'/desk/sla/support-plans/'+i,policy:i=>'/desk/sla/policies/'+i,account:i=>'/modules/'+ACC+'/records/'+i};
for(const k of ['ticket','contract','plan','policy','account'])for(const [kind,i] of made.filter(x=>x[0]===k)){const d=await api('DELETE',P[kind](i));R.cleanup.push(kind+' '+d.s);}
return R;
