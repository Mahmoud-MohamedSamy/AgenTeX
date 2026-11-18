var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// NDC-3046: SLA policy (Dept A, applies on create, subject key) + RR rule with condition "SLA Name is <policy>".
// MODE=setup: prefs offline on, policy, rule A (create+update) -> API tickets a1,a2; rule B (create only, other key) -> API ticket b1. Leaves rule A active for the screen test; writes as/out/t3046.json.
// MODE=check: reads tickets listed in t3046.json (+ screen ticket by subject), then turns rules off, restores prefs, deactivates policy.
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const F=OUT+'t3046.json';const c=(f,op,v)=>({field_key:f,operator:op,value:v});
const sla=async id=>{const s=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;return {policy:s?.policy_name,obl:(s?.obligations||[]).map(o=>o.kind+':'+o.state)};};
const info=async id=>{const o=await rec(id);const f=await feed(id);const cr=f.find(e=>e.action==='ticket.created');const aa=f.filter(e=>e.action==='ticket.auto_assigned');
 const sl=f.filter(e=>/sla/i.test(e.action));
 return {num:o.ticket_number,owner:nm(o.owner),sla_name:o.sla_name,sla:await sla(id),autoAssigned:aa.map(e=>({t:e.summary?.trigger,rule:e.summary?.rule_name,after_s:cr?((Date.parse(e.occurred_at)-Date.parse(cr.occurred_at))/1000).toFixed(1):null})),slaEvents:sl.map(e=>e.action+' '+e.occurred_at.slice(11,19))};};
if(process.env.MODE!=='check'){
 const R={};const P0=await prefs(DA);R.P0=P0;
 R.prefs=E(await setPrefs({...P0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false}));
 const KA='R19AS46A'+U,KB='R19AS46B'+U;R.KA=KA;R.KB=KB;
 const pname='QA RT19 AS 3046 SLA '+U;R.pname=pname;
 const p=await api('POST','/desk/sla/policies',{department_id:DA,name:pname,description:'QA RT19 AS lane',is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,
  targets:[{name:'t',criteria:{conditions:[c('subject','starts_with',PFX),c('subject','contains','R19AS46')],pattern:'1 and 2'},response:{value:60,unit:'minutes'},resolution:{value:600,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]});
 R.policy=E(p);R.policyId=p.j?.data?.id;if(R.policyId)LED('SLA policy created '+R.policyId+' "'+pname+'" active=true dept QA AS6 Dept A');
 const ra=await rule('round_robin','3046 A create+update',[rrT(KA,'sequential',[A3],[c('sla_name','equals',pname)])],{on:['create','update']});R.ruleA=ra.j?.data?.id;R.ruleAs=E(ra);
 const rb=await rule('round_robin','3046 B create only',[rrT(KB,'sequential',[A3],[c('sla_name','equals',pname)])],{on:['create']});R.ruleB=rb.j?.data?.id;R.ruleBs=E(rb);
 await sleep(3000);
 R.a1=await tk(KA+' api 1');R.a2=await tk(KA+' api 2');R.b1=await tk(KB+' api create-only');
 // control: same rule key but ticket not matching the SLA (no SLA) -> must stay unassigned: subject has KA but SLA target needs R19AS46 -> always matches; use a KA ticket in Dept A with SLA off? skip; control = rule criteria correct.
 await sleep(25000);
 for(const k of ['a1','a2','b1'])R['info_'+k]=await info(R[k]);
 save('t3046.json',R);return R;
}else{
 const R=JSON.parse(fs.readFileSync(F,'utf8'));const out={};
 const L=arr((await api('GET','/modules/'+T+'/records?page=1&page_size=40&sort_by=created_at&sort_order=desc')).j?.data);
 const ui=L.filter(x=>(x.data||[]).some(d=>d.field==='subject'&&/R19AS46.*screen/.test((d.value||{}).value||'')));
 for(const x of ui)out['screen '+x.id.slice(0,8)]=await info(x.id);
 for(const k of ['a1','a2','b1'])out[k]=await info(R[k]);
 out.offA=await setA(R.ruleA,false);out.offB=await setA(R.ruleB,false);
 const pol=(await api('GET','/desk/sla/policies/'+R.policyId)).j?.data;
 if(pol){const u=await api('PUT','/desk/sla/policies/'+R.policyId,{...pol,is_active:false});out.policyOff=E(u);LED('SLA policy '+R.policyId+' set inactive -> '+u.s);}
 out.restore=E(await setPrefs(R.P0));out.same=JSON.stringify(await prefs(DA))===JSON.stringify(R.P0);LED('QA AS6 Dept A prefs restored after 3046 '+out.same);
 save('t3046-check.json',out);return out;
}
