const r=await api('GET','/workflow/executions?limit=5'); return arr(r.j&&r.j.data).map(x=>x.evaluatedAt+' '+x.outcome+' '+x.moduleId.slice(0,8));
