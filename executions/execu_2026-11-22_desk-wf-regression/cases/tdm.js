const all = arr((await api('GET','/workflow/rules?moduleId='+T+'&take=200')).j.data);
const r = all.find(x=>x.name==='QA WF TDmoved'); const p = all.find(x=>x.name==='QA WF TDpast');
const e = arr((await api('GET','/workflow/executions?ruleId='+r.id+'&take=10')).j.data);
const ep = arr((await api('GET','/workflow/executions?ruleId='+p.id+'&take=10')).j.data);
return { moved: e.map(x=>({ at:x.evaluatedAt, err:x.errorMessage, d:(x.dispatches||[]).map(d=>JSON.stringify(d).slice(0,900)) })), past: ep.length };
