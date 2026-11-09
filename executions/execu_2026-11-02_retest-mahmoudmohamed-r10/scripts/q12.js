const mc=arr((await api('o','GET','/workflow/rules?take=500')).j?.data).find(x=>x.id.startsWith('c11555bd'));
return {base:mc.actions.map(a=>a.id.slice(0,6)+':'+a.type), conds:mc.conditions.map((c,i)=>i+':'+(c.isElse?'ELSE ':'')+(c.criteria?.value?.stringValue||'')+' → '+c.actions.map(a=>a.id.slice(0,6)+':'+a.type).join(','))};
