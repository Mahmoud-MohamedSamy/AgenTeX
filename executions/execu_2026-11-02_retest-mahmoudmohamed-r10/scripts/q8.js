const bps=arr((await api('o','GET',`/modules/${T.LEADS}/blueprints`)).j?.data)[0];
const d=bps.definition; const out={bp:bps.id, trans:d.transitions.map(t=>({id:t.id,name:t.name,from:t.fromStateId,to:t.toStateId,before:JSON.stringify(t.before).slice(0,200),during:JSON.stringify(t.during).slice(0,400),after:JSON.stringify(t.after).slice(0,300)}))};
const r=(await api('o','GET','/workflow/rules/d28207a9-'+'')); 
const all=arr((await api('o','GET','/workflow/rules?take=500')).j?.data); const aex=all.find(x=>x.id.startsWith('d28207a9')); out.aex={id:aex.id,trigger:aex.trigger,actions:aex.actions.map(a=>a.type+' '+JSON.stringify(a.fieldUpdates||a.tagIds||a.taskTitle||'').slice(0,150))};
const mc=all.find(x=>x.id.startsWith('c11555bd')); out.mcKeys=Object.keys(mc); out.mcShape=JSON.stringify(mc).slice(0,1500);
const rp=arr((await api('o','GET','/workflow/review-processes')).j?.data).map(x=>[x.id.slice(0,8),x.name,x.isActive,x.layoutId,JSON.stringify(x.channels)]); out.reviews=rp;
return out;
