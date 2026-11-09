const out={}; const L=await X.lead('o','QA RT r10 2730 AEX-01',{phone:'01099130163'}); const id=L.j?.data?.id; out.create=L.s+' '+(id||L.t.slice(0,300)); if(!id) return out;
await sleep(20000);
const g=(await api('o','GET',`/modules/${T.LEADS}/records/${id}`)); out.get=g.s;
const f=n=>(g.j?.data?.data||[]).find(x=>x.field===n)?.value?.value; out.fields={lead_source:f('lead_source'),lead_status:f('lead_status'),owner:f('owner'),approval:f('approval_status'),review:f('review_status')};
out.review=JSON.stringify(await X.reviewHistory('o',T.LEADS,id)).slice(0,400);
out.bp=JSON.stringify(await X.bpState('o',T.LEADS,id)).slice(0,500);
out.exec=(await X.executions(id)).map(e=>[e.ruleId?.slice(0,8)||'AR '+e.assignmentRuleId?.slice(0,8),e.triggerKind,e.outcome,e.evaluatedAt.slice(11,19)]);
out.id=id; return out;
