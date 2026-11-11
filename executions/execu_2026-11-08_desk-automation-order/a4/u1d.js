const U=JSON.parse(fs.readFileSync('../a4/u1.json','utf8'));const id=U.tickets['U1 P5 b'].id;
const rr=arr2((await api('GET','/desk/tickets/'+id+'/happiness-ratings')).j?.data).map(z=>z.status+' '+(z.rating||''));
const L=arr2((await api('GET','/workflow/rules?take=300')).j?.data);const nm={};L.forEach(r=>nm[r.id]=r.name);
const ex=arr2((await api('GET','/workflow/executions?recordId='+id)).j?.data).filter(e=>e.outcome==='Fired').map(e=>e.evaluatedAt.slice(11,19)+' '+e.triggerKind+' '+(nm[e.ruleId]||e.ruleId).replace('QA AO WF ',''));
return {rating:rr,fired:ex};
