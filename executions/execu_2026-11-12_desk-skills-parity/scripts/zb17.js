const o={}; const ids={A1:'1475109000000529696',A2:'1475109000000529735',A3:'1475109000000529774'};
for(const k in ids){ await z('PATCH',`/tickets/${ids[k]}`,{priority:'High'}); }
await new Promise(r=>setTimeout(r,15000));
for(const k in ids){const g=await z('GET',`/tickets/${ids[k]}`); o[k]=[g.j?.assigneeId,g.j?.entitySkills?.length];}
const h=await z('GET',`/tickets/${ids.A1}/History?limit=5`); o.hist=(h.j?.data||[]).map(e=>[e.eventName,(e.actor||{}).name, JSON.stringify(e.eventInfo||'').slice(0,200)]);
return o;
