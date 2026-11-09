const all=arr((await api('o','GET','/workflow/rules?take=500')).j?.data); const aex=all.find(x=>x.id.startsWith('d28207a9'));
const acts=aex.actions.filter(a=>/Create/.test(a.type)).map(a=>Object.fromEntries(Object.entries(a).filter(([k,v])=>v!==null)));
const sa=await api('o','GET','/workflow/standalone-actions?take=200'); const sa2=await api('o','GET','/workflow/actions?take=200');
return {acts:JSON.stringify(acts).slice(0,2500), sa:sa.s, sa2:sa2.s+' '+sa2.t.slice(0,800)};
