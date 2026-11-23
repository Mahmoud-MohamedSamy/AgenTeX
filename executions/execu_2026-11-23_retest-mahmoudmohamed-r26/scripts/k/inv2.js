const o={};const ca=arr((await api('GET','/workflow/custom-actions')).j?.data?.items||(await api('GET','/workflow/custom-actions')).j);o.ca=ca.filter(x=>/QA RT/.test(x.name)).map(x=>x.id+' '+x.name);
const so=arr((await api('GET','/workflow/custom-actions/sources')).j?.data?.items||(await api('GET','/workflow/custom-actions/sources')).j);o.src=so.filter(x=>/QA RT/.test(x.name)).map(x=>x.id+' '+x.name);
const w=await api('GET','/workflow/rules/e1198023-3e92-47c3-a1e9-880f30006e73');o.wf=w.s+' '+(w.j?.data?.name||'')+' active='+w.j?.data?.is_active;
const imp=await api('GET','/data/imports?limit=10');o.imports=imp.s+' '+JSON.stringify(arr(imp.j?.data?.items||imp.j).slice(0,5).map(x=>(x.file_name||x.name)+' '+x.status+' '+(x.created_at||'').slice(0,16)));
return o;
