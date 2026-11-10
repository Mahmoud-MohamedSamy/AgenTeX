const m=await api('GET','/modules');out.deskModules=arr(m.j&&m.j.data?m.j.data:m.j).map(x=>(x.api_name||x.apiName||x.name)+'='+x.id).filter(s=>/account|contact|ticket/i.test(s));
out.prefs=await prefs();
const t=await api('POST','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?dry_run=1',{data:[]});out.ticketProbe=t.s+' '+t.t.slice(0,400);
return out;
