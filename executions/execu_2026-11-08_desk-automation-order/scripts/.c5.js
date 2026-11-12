const r=arr((await api('GET','/workflow/rules?take=500')).j?.data).filter(x=>/QA AO WF (C5|G4)/.test(x.name));
return r.map(x=>({id:x.id,name:x.name,active:x.isActive,mode:x.mode,trigger:x.trigger,criteria:JSON.stringify(x.criteria).slice(0,700),actions:JSON.stringify(x.actions.map(a=>[a.type,a.fieldUpdates])).slice(0,200)}));
