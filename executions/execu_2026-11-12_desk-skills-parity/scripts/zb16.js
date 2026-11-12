const o={}; const S1='1475109000000529139', TEST='1475109000000529026', A1='1475109000000529696';
o.s1=(await z('GET',`/skills/${S1}`)).j?.agentIds; o.test=(await z('GET',`/skills/${TEST}`)).j?.agentIds;
const h=await z('GET',`/tickets/${A1}/History?limit=20`); o.hist=[h.s,(h.j?.data||[]).map(e=>[e.eventName,(e.actor||{}).name, JSON.stringify(e.eventInfo||'').slice(0,160)])];
o.avail=await z('GET',`/agentAvailability?departmentId=${DEPT}`); o.avail=[o.avail.s,o.avail.t.slice(0,400)];
return o;
