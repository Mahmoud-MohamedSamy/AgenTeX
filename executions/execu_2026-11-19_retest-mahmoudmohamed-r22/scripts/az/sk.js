var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// Skill rule in QA AS6 Dept A (S1 held by A3, S2 by A1, S3 nobody). Tickets created in QA AO Dept B with skills, then moved into DA (create path is down).
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('sk.json',R);};
const L=((await api('GET','/desk/skills?department_id='+DA)).j?.data?.skills||[]).filter(s=>/QA RT19 AS/.test(s.name));R.skills=L.map(s=>s.name+' act='+s.is_active+' ag='+(s.agent_ids||[]).map(nm));
const S1='QA RT19 AS S1',S2='QA RT19 AS S2',S3='QA RT19 AS S3';const PA=await prefs(DA);save('sk-prefs-orig.json',PA);let rid;const made2=[];
try{
 S('prefs',E(await setPrefs({...PA,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},DA)));
 const K='SK'+U;const r=await rule('round_robin','skill A1 A3',[rrT(K,'skill',[A1,A3])],{on:['create','update']});rid=r.j?.data?.id;S('rule',E(r));await sleep(3000);
 const C={a:[[S3,S1],'A3 (any one skill: S1)'],b:[[S3],'none (nobody holds S3)'],c:[[],'none (no skills)'],d:[[S1,S2],'A1 or A3'],e:[[S1,S2],'the other one (alternates)']};
 for(const k in C){const t=await tk(K+' '+k+' '+(C[k][0].join('+')||'no skills'),C[k][0].length?{skills:C[k][0]}:{},AOB);made2.push(t);const d=await waitDesk(t);await sleep(2000);
  const m=await api('POST','/desk/tickets/'+t+'/move',{department_id:DA,team_id:null,owner_id:null});let o='none';for(let i=0;i<8;i++){o=await own(t);if(o!=='none')break;await sleep(3000);}
  const f=(await feed(t)).filter(e=>/auto_assign|skip|backlog/.test(e.action)).map(e=>e.action.replace('ticket.','')+(e.summary?.reason?':'+e.summary.reason:''));
  S(k,'#'+d.n,'move',m.s,'->',o,'| expected',C[k][1],'| skills after move',JSON.stringify((await rec(t)).skills||[]),JSON.stringify(f));}
}finally{if(rid)await setA(rid,false);for(const t of made2)await api('POST','/desk/tickets/'+t+'/close',{});R.same=E(await setPrefs(PA,DA))+' '+(JSON.stringify(await prefs(DA))===JSON.stringify(PA));LED('sk: QA AS6 Dept A RR prefs changed and restored '+R.same+'; tickets closed');}
save('sk.json',R);return R;
