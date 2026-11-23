const ex=arr((await api('GET','/workflow/executions?recordId=1b37d6b5-ba69-4c80-8590-6401cf8c665b')).j?.data).filter(e=>e.ruleId==='c72e099c-b742-4eee-a2c1-763c2cafc003');
return ex.map(e=>[e.id,e.startedAt||e.createdAt||e.firedAt,e.outcome,e.dispatches.map(d=>d.actionType+':'+d.status+' '+JSON.stringify(d.result||d.output||'').slice(0,80))]);
