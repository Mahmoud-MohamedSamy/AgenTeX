const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const CON='0924eb24-e42a-4eab-8efd-e3428f19e882',D='6edaf8a3-7e99-4213-bd90-451802d63be6',DB='09b9df1d-2345-44c5-9e4e-6778e219fd7e';
const old=JSON.parse(fs.readFileSync(RUN+'/scripts/bs/2841.json','utf8')).ids;const planA=old.planA,planB=old.planB,acc=old.acc;
const led=t=>fs.appendFileSync(RUN+'/ledger.md',`- ${new Date().toISOString().slice(0,19)}Z X41 (18 Nov 2841 retest): ${t}\n`);
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const E=r=>r.s+(r.s>=300?' '+JSON.stringify(r.j?.error||r.t).slice(0,450):'');
const u=Math.random().toString(36).slice(2,6);const R={u};
const today=new Date().toISOString().slice(0,10),later=new Date(Date.now()+90*86400000).toISOString().slice(0,10);
const con=async(n,planId,dept=D)=>{const r=await api('POST','/modules/'+CON+'/records',{data:[f('contract_name','QA RT20 X41 Contract 2841 '+n+' '+u),...(dept?[f('department',dept)]:[]),f('account_id',acc),...(planId?[f('support_plan',planId)]:[]),f('start_date',today),f('end_date',later)]});if(r.j?.data?.id)led(`contract "QA RT20 X41 Contract 2841 ${n} ${u}" ${r.j.data.id}`);return r;};
const rec=async id=>{const d=(await api('GET','/modules/'+CON+'/records/'+id)).j?.data?.data||[];const v=k=>d.find(z=>z.field===k)?.value?.value;return {dept:v('department')===D?'A':v('department')===DB?'B':String(v('department')),plan:v('support_plan')===planA?'planA':v('support_plan')===planB?'planB':String(v('support_plan')??'none'),name:v('contract_name')};};
const cov=async id=>(await api('GET','/desk/sla/contracts/'+id+'/coverage')).j?.data?.plan?.name||'none';
const P=(id,data)=>api('PATCH','/modules/'+CON+'/records/'+id,{data});
R.plans=[(await api('GET','/desk/sla/support-plans/'+planA)).s,(await api('GET','/desk/sla/support-plans/'+planB)).s];
// 1 dev's step: department-only change on a contract with Dept A plan, 3 tries
const c1=await con('dept only',planA);const c1id=c1.j?.data?.id;R.c1=E(c1);R.c1_before=await rec(c1id);R.c1_cov_before=await cov(c1id);
R.dept_only=[];for(let i=0;i<3;i++)R.dept_only.push(E(await P(c1id,[f('department',DB)])));R.c1_after=await rec(c1id);R.c1_cov_after=await cov(c1id);
// 2 department change sending the old plan back
R.dept_oldplan=E(await P(c1id,[f('department',DB),f('support_plan',planA)]));R.c1_after2=await rec(c1id);
// 3 move together with Dept B plan (allowed)
const c2=await con('move with B',planA);const c2id=c2.j?.data?.id;R.move_with_B=E(await P(c2id,[f('department',DB),f('support_plan',planB)]));R.c2_after=await rec(c2id);R.c2_cov=await cov(c2id);
// 4 contract without plan: department-only move (allowed)
const c3=await con('no plan move',null);const c3id=c3.j?.data?.id;R.c3=E(c3);R.noplan_move=E(await P(c3id,[f('department',DB)]));R.c3_after=await rec(c3id);
// 5 save without changing department (rename; and resend same dept+plan)
R.rename=E(await P(c1id,[f('contract_name','QA RT20 X41 Contract 2841 dept only renamed '+u)]));R.same_dept_plan=E(await P(c1id,[f('department',D),f('support_plan',planA)]));R.c1_after3=await rec(c1id);
// 6 department change while clearing the plan in the same change
const c4=await con('move clear plan',planA);const c4id=c4.j?.data?.id;R.move_clear_plan=E(await P(c4id,[f('department',DB),{field:'support_plan',value:null}]));R.c4_after=await rec(c4id);R.c4_cov=await cov(c4id);
// 7 earlier fixes still hold
R.create_other=E(await con('A with B plan',planB));
R.patch_plan_B=E(await P(c2id,[f('support_plan',planA)]));R.c2_after_patch=await rec(c2id);
R.attach_other=E(await api('PUT','/desk/sla/contracts/'+c3id+'/plan',{plan_id:planA}));
R.no_dept=E(await con('no dept',planA,null));
// 8 yesterday's dept-only contract (c3 from 17 Nov, already moved)
R.yday_c3=await rec(old.c3id);
R.ids={c1id,c2id,c3id,c4id};fs.writeFileSync(RUN+'/scripts/x41/r1.json',JSON.stringify(R,null,1));return R;
