var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// Skill rule in QA AS6 Dept A via CREATE path. Skills now: S2 held by A1; S1, S3 held by nobody.
const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('skc.json',R);};
const L=((await api('GET','/desk/skills?department_id='+DA)).j?.data?.skills||[]).filter(s=>/QA RT19 AS/.test(s.name));R.skills=L.map(s=>s.name+' act='+s.is_active+' ag='+(s.agent_ids||[]).map(nm));save('skc.json',R);
const S1='QA RT19 AS S1',S2='QA RT19 AS S2',S3='QA RT19 AS S3';const PA=await prefs(DA);save('skc-prefs-orig.json',PA);let rid;const ids=[];
try{
 S('prefs',E(await setPrefs({...PA,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},DA)));
 const K='SKC'+U;const r=await rule('round_robin','skill A1 A3',[rrT(K,'skill',[A1,A3])],{on:['create','update']});rid=r.j?.data?.id;S('rule',E(r));await sleep(3000);
 const C={a:[[S3,S2],'A1 (any one skill: S2)'],b:[[S3],'none (nobody holds S3)'],c:[[],'none (no skills)'],d:[[S1,S2],'A1 (only S2 holder)']};
 for(const k in C){const t=await tk(K+' '+k+' '+(C[k][0].join('+')||'no skills'),C[k][0].length?{skills:C[k][0]}:{});ids.push(t);const x=await waitRR(t,60);
  const f=(await feed(t)).filter(e=>/auto_assign|skip|backlog/.test(e.action)).map(e=>e.action.replace('ticket.','')+(e.summary?.reason?':'+e.summary.reason:''));
  S(k,'#'+x.n,'->',x.o,'| expected',C[k][1],'| skills',JSON.stringify((await rec(t)).skills||[]),JSON.stringify(f));}
}finally{if(rid)await setA(rid,false);for(const t of ids)await patch(t,{status:'Closed'});R.same=E(await setPrefs(PA,DA))+' '+(JSON.stringify(await prefs(DA))===JSON.stringify(PA));LED('skc: QA AS6 Dept A RR prefs changed and restored '+R.same+'; tickets closed');}
save('skc.json',R);return R;
