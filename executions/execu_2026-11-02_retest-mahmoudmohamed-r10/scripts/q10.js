const id='45d3cf65-da66-4ddb-acc8-138dd7cf6f47';
const g=(await api('o','GET',`/modules/${T.LEADS}/records/${id}`)).j?.data; const f=n=>(g.data||[]).find(x=>x.field===n)?.value?.value;
const ex=(await X.executions(id)).map(e=>[(e.ruleId||'AR'+e.assignmentRuleId)?.slice(0,8),e.triggerKind,e.outcome,e.evaluatedAt.slice(11,19)]);
const tasks=[]; for(let p=1;p<=3;p++){ const a=arr((await api('o','GET',`/modules/${T.TASKS}/records?page=${p}`)).j?.data); for(const r of a){ const s=JSON.stringify(r.data); if(s.includes(id)) tasks.push([r.id,(r.data.find(x=>x.field==='subject')||{}).value?.value]); } if(a.length<100) break; }
for(const t of tasks) ledger(`task ${t[0]} "${t[1]}" (by AEX-01 for 2730 lead)`);
return {lead_source:f('lead_source'),lead_status:f('lead_status'),tags:JSON.stringify(f('tags')||g.tags||'').slice(0,200),exec:ex,tasks,bp:JSON.stringify(await X.bpState('o',T.LEADS,id)).slice(0,300)};
