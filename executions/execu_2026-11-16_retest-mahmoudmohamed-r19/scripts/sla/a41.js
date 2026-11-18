eval(fs.readFileSync('sla/lib.js','utf8'));
const u=Math.random().toString(36).slice(2,6);const R={u};
const pol=async(dept,n)=>{const id=ok(await api('POST','/desk/sla/policies',{department_id:dept,name:'QA RT19 SLA 2841 '+n+' '+u,description:null,is_active:false,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:true,resolution_from_created:false,targets:[{name:'t',criteria:{conditions:[{field_key:'description',operator:'contains',value:'R19SLA2841'+u}],pattern:null},response:{value:60,unit:'minutes'},resolution:{value:3,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]}),'pol').j.data.id;led(`SLA policy "QA RT19 SLA 2841 ${n} ${u}" ${id} inactive`);return id;};
const pA=await pol(D,'A'),pB=await pol(DB,'B');
const plan=async(dept,p,n)=>{const id=ok(await api('POST','/desk/sla/support-plans',{department_id:dept,name:'QA RT19 SLA Plan 2841 '+n+' '+u,description:null,policy_id:p,type:'unlimited'}),'plan').j.data.id;led(`support plan "QA RT19 SLA Plan 2841 ${n} ${u}" ${id}`);return id;};
const planA=await plan(D,pA,'A'),planB=await plan(DB,pB,'B');
const acc=ok(await api('POST','/modules/'+ACC+'/records',{data:[f('account_name','QA RT19 SLA Account 2841 '+u)]}),'acc').j.data.id;led(`account ${acc} 2841`);
const today=new Date().toISOString().slice(0,10),later=new Date(Date.now()+90*86400000).toISOString().slice(0,10);
const con=async(n,planId)=>{const r=await api('POST','/modules/'+CON+'/records',{data:[f('contract_name','QA RT19 SLA Contract 2841 '+n+' '+u),f('department',D),f('account_id',acc),...(planId?[f('support_plan',planId)]:[]),f('start_date',today),f('end_date',later)]});if(r.j?.data?.id)led(`contract "QA RT19 SLA Contract 2841 ${n} ${u}" ${r.j.data.id}`);return r;};
const c1=await con('own plan',planA);R.c1=c1.s;const c1id=c1.j.data.id;
let at=await api('PUT','/desk/sla/contracts/'+c1id+'/plan',{plan_id:planA});R.attach_own=at.s;
at=await api('PUT','/desk/sla/contracts/'+c1id+'/plan',{plan_id:planB});R.attach_other=at.s+' '+JSON.stringify(at.j?.error||at.t).slice(0,400);
R.c1_cov_after=(await api('GET','/desk/sla/contracts/'+c1id+'/coverage')).j?.data?.plan?.name;
const c2=await con('created with B plan',planB);R.c2_create=c2.s+' '+(c2.s>=300?c2.t.slice(0,300):'');
if(c2.j?.data?.id){const c2id=c2.j.data.id;R.c2_cov=JSON.stringify((await api('GET','/desk/sla/contracts/'+c2id+'/coverage')).j?.data).slice(0,400);const g=(await api('GET','/modules/'+CON+'/records/'+c2id)).j?.data;R.c2_field=(g?.data||[]).find(z=>z.field==='support_plan')?.value?.value;R.c2id=c2id;}
// plans list per dept (picker source)
for(const [k,d] of [['A',D],['B',DB]]){const l=await api('GET','/desk/sla/support-plans?department_id='+d);R['plans_'+k]=arr(l.j?.data).map(x=>x.name+' c='+(x.contract_count??x.contracts??''));}
R.ids={pA,pB,planA,planB,acc,c1id};setCfg({a41:R});return R;
