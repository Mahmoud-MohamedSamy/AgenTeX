const d=await api('GET','/desk/departments?take=100');const L=arr(d.j?.data??d.j);log(d.s, L.filter(x=>/QA RT2|SLA/.test(x.name)).map(x=>x.name+'|'+x.id+'|'+(x.is_active??x.status??'')).join('\n'));
