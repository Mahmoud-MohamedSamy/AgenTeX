const r = arr((await api('o','GET','/workflow/rules?take=500')).j?.data).filter(x=>x.moduleId===T.LEADS && x.isActive);
return r.map(x=>[x.id.slice(0,8), x.name, x.trigger?.kind, x.trigger?.fieldName, JSON.stringify(x.criteria).slice(0,200), (x.actions||[]).map(a=>a.type+':'+JSON.stringify(a.fieldUpdates||a.ownerValue||'')).join('|').slice(0,200)]);
