eval(fs.readFileSync('sla/lib.js','utf8'));
const u=Math.random().toString(36).slice(2,6),tag='R19SLA2833'+u;const R={tag};
const p=ok(await api('POST','/desk/sla/policies',{department_id:D,name:'QA RT19 SLA 2833 '+u,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:true,resolution_from_created:false,targets:[{name:'t '+tag,criteria:{conditions:[{field_key:'description',operator:'contains',value:tag}],pattern:null},response:{value:60,unit:'minutes'},resolution:{value:3,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]}),'policy').j.data.id;led(`SLA policy "QA RT19 SLA 2833 ${u}" ${p} active, account-only, dept SLA Dept`);
const acc=ok(await api('POST','/modules/'+ACC+'/records',{data:[f('account_name','QA RT19 SLA Account 2833 '+u)]}),'account').j.data.id;led(`account "QA RT19 SLA Account 2833 ${u}" ${acc}`);
const acc2=ok(await api('POST','/modules/'+ACC+'/records',{data:[f('account_name','QA RT19 SLA Account 2833 nocontract '+u)]}),'account2').j.data.id;led(`account "QA RT19 SLA Account 2833 nocontract ${u}" ${acc2}`);
const plan=ok(await api('POST','/desk/sla/support-plans',{department_id:D,name:'QA RT19 SLA Plan 2833 '+u,description:null,policy_id:p,type:'allowance',allowance:1,cycle:'monthly'}),'plan').j.data.id;led(`support plan "QA RT19 SLA Plan 2833 ${u}" ${plan} (1/month)`);
const today=new Date().toISOString().slice(0,10),later=new Date(Date.now()+90*86400000).toISOString().slice(0,10);
const c=ok(await api('POST','/modules/'+CON+'/records',{data:[f('contract_name','QA RT19 SLA Contract 2833 '+u),f('department',D),f('account_id',acc),f('support_plan',plan),f('start_date',today),f('end_date',later)]}),'contract').j.data.id;led(`contract "QA RT19 SLA Contract 2833 ${u}" ${c}`);
R.attach=(await api('PUT','/desk/sla/contracts/'+c+'/plan',{plan_id:plan})).s;
const x0=await tk('2833 x0 no account '+tag);await sleep(6000);
const x1=await tk('2833 x1 first '+tag,[f('account_id',acc)]);await sleep(10000);
const x2=await tk('2833 x2 second '+tag,[f('account_id',acc)]);await sleep(10000);
const x3=await tk('2833 x3 third '+tag,[f('account_id',acc)]);
const x4=await tk('2833 x4 other account no contract '+tag,[f('account_id',acc2)]);await sleep(12000);
for(const [k,x] of Object.entries({x0,x1,x2,x3,x4})){const g=(await api('GET','/modules/'+T+'/records/'+x.id)).j?.data;x.num=(g?.data||[]).find(z=>z.field==='ticket_number')?.value?.value;R[k]={num:x.num,id:x.id,sla:await sla(x.id)};}
R.usage=(await api('GET','/desk/sla/support-plans/'+plan+'/usage')).t.slice(0,400);
R.coverage=(await api('GET','/desk/sla/contracts/'+c+'/coverage')).t.slice(0,400);
R.ids={p,acc,acc2,plan,c};setCfg({a33:R});return R;
