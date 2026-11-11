const out={}; const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
for (const d of [CS, AO]) { const r=await api('GET','/desk/teams?department_id='+d); out['teams '+d.slice(0,6)] = arr(r.j&&r.j.data).map(t=>({id:t.id,name:t.name,members:(t.member_ids||t.members||[]).length, src:JSON.stringify(t.sources||'').slice(0,200)})); }
for (const d of [CS, AO]) { const r=await api('GET','/desk/departments/'+d); const x=r.j&&r.j.data; out['dept '+d.slice(0,6)] = r.s+' '+JSON.stringify(x&&(x.agents||x.agent_ids||x.members||x.member_ids||Object.keys(x))).slice(0,500); }
return out;
