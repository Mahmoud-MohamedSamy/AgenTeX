var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const o={};const SID='c6892ff7-8055-475c-9e93-ee35e73f7139';
for(const p of ['/modules/'+T+'/import/'+SID,'/modules/'+T+'/import/'+SID+'/mapping','/modules/'+T+'/import/'+SID+'/rows','/modules/'+T+'/import/'+SID+'/results','/modules/'+T+'/import/'+SID+'/errors','/modules/'+T+'/import/'+SID+'/preview']){const r=await api('GET',p);o[p.split(SID)[1]||'session']=r.s+' '+r.t.slice(0,3500);}
const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);const s=L.find(x=>x.user_id===A2);o.samy={status:s?.status,relation:s?.relation,inDeptA:(s?.department_ids||[]).includes(DA),nDepts:(s?.department_ids||[]).length};
return o;
