var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// NDC-2275 skill rules (2931/2932 regression) in QA AS6 Dept A with QA RT19 AS S1 (A3), S2 (A1), S3 (nobody).
const R={steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);save('tskill.json',R);};
const L=((await api('GET','/desk/skills?department_id='+DA)).j?.data?.skills||[]).filter(s=>/QA RT19 AS/.test(s.name));R.skills=L.map(s=>s.name+' act='+s.is_active+' ag='+(s.agent_ids||[]).map(nm));save('tskill.json',R);
const S1='QA RT19 AS S1',S2='QA RT19 AS S2',S3='QA RT19 AS S3';
const PA=await prefs(DA);save('tskill-prefs-orig.json',PA);let rid;
try{
 S('prefs',E(await setPrefs({...PA,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},DA)));
 const K='R20SK'+U;const r=await rule('round_robin','skill A1 A3',[rrT(K,'skill',[A1,A3])],{on:['create','update']});rid=r.j?.data?.id;S('rule',E(r));await sleep(3000);
 const ids={a:await tk(K+' a S3+S1',{skills:[S3,S1]}),b:await tk(K+' b S3 only',{skills:[S3]}),c:await tk(K+' c no skills'),d1:await tk(K+' d1 S1+S2',{skills:[S1,S2]})};
 const ex={a:'A3 (any one skill: S1)',b:'none (nobody holds S3)',c:'none (no skills)',d1:'A1 or A3'};
 for(const k in ids){const x=await waitRR(ids[k],45);S(k,'#'+x.n,'deskLag',x.lag+'s','->',x.o,'| expected',ex[k],'| skills',JSON.stringify((await rec(ids[k])).skills||[]));}
 const p=await patch(ids.c,{skills:[S1]});await sleep(3000);let o='none';for(let i=0;i<20&&o==='none';i++){o=await own(ids.c);if(o==='none')await sleep(3000);}S('c + S1 by edit ->',E(p),o,'| expected A3');
 for(const x of ['d2','d3']){const t=await tk(K+' '+x+' S1+S2',{skills:[S1,S2]});const w=await waitRR(t,45);S(x,'#'+w.n,'->',w.o,'| expected alternates A1/A3');}
 for(const k in ids)await patch(ids[k],{status:'Closed'});
}finally{if(rid)await setA(rid,false);R.same=E(await setPrefs(PA,DA))+' '+(JSON.stringify(await prefs(DA))===JSON.stringify(PA));LED('tskill: QA AS6 Dept A RR prefs changed and restored '+R.same);}
save('tskill.json',R);return R;
