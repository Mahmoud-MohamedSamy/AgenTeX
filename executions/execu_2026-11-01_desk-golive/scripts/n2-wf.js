const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const wr=await api('GET','/workflow/rules?take=200'); const w=arr(wr.j&&wr.j.data).filter(r=>(r.moduleId||r.module_id)===T);
return done(w.map(r=>({n:r.name,a:r.isActive,keys:Object.keys(r).join(','),trig:JSON.stringify(r.trigger||r.triggerConfig||r.executeOn||'').slice(0,200),crit:JSON.stringify(r.criteria||r.conditions||r.conditionGroups||'').slice(0,500)})));
