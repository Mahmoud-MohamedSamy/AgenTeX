// A4 Workflow: read-only baseline (11 Nov). Rules, saved actions, latest executions.
const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const g=async p=>{const r=await api('GET',p);return r.j?.data;};
const lst=d=>Array.isArray(d)?d:(d?.items||d?.rules||d?.actions||d?.executions||[]);
const on=lst(await g('/workflow/rules?take=200')),off=lst(await g('/workflow/rules?isActive=false&take=200'));
const all=[...on,...off.filter(x=>!on.find(y=>y.id===x.id))];
fs.writeFileSync('../wf-baseline-rules.json',JSON.stringify(all,null,1));
const acts=lst(await g('/workflow/actions?take=200'));fs.writeFileSync('../wf-baseline-actions.json',JSON.stringify(acts,null,1));
const ex=lst(await g('/workflow/executions?take=5'));
const byMod={};all.forEach(r=>{const k=(r.moduleId===T?'Tickets':r.moduleId?.slice(0,8))+(r.isActive?' active':' inactive');byMod[k]=(byMod[k]||0)+1;});
const trig={},acty={};all.forEach(r=>{const t=r.trigger?.kind+(r.trigger?.ticketEvents?':'+(r.trigger.ticketEvents.events||[]).join('+'):'');trig[t]=(trig[t]||0)+1;(r.actions||[]).forEach(a=>{acty[a.type]=(acty[a.type]||0)+1;});});
return {rules:all.length,byMod,keys:all[0]?Object.keys(all[0]).join(','):'',trig,acty,tickets:all.filter(r=>r.moduleId===T).map(r=>[r.name,r.isActive,r.trigger?.kind,r.departmentId||r.department_id||'',(r.actions||[]).map(a=>a.type).join('+'),r.createdBy||r.created_by||''].join(' | ')),actions:acts.length,actTypes:[...new Set(acts.map(a=>a.type))],lastExec:ex[0]?.evaluatedAt||ex[0]?.createdAt};
