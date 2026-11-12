const o={}; const ids={A1:'1475109000000529696',A2:'1475109000000529735',A3:'1475109000000529774'};
for(const k in ids){ const r=await z('POST',`/tickets/${ids[k]}/executeSkillbasedAssignment`); o[k]=[r.s,r.t.slice(0,160)]; }
return o;
