const ids=I.recs.slice(-2); const o={};
const r=await api('GET','/workflow/executions?limit=100'); const a=arr(r.j&&r.j.data); o.n=a.length; o.latest=a.slice(0,3).map(x=>x.evaluatedAt+' '+x.ruleId);
o.mine=a.filter(x=>x.ruleId===I.W||ids.includes(x.recordId)).map(x=>JSON.stringify({rec:x.recordId,outcome:x.outcome,cm:x.criteriaMatched,err:x.errorMessage,details:x.details}).slice(0,300));
o.meta=JSON.stringify(r.j&&r.j.meta).slice(0,200);
return o;
