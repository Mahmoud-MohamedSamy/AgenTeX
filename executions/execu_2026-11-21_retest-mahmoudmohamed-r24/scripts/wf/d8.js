const o={};const ms=arr((await api('GET','/modules?take=100')).j?.data);o.mods=ms.map(m=>(m.apiName||m.name)+':'+m.id.slice(0,8)).slice(0,20);
const L=ms.find(m=>/^Leads$/i.test(m.apiName||m.name))?.id;o.L=L;
const F=arr((await api('GET','/modules/'+L+'/fields?take=300')).j?.data);o.types=[...new Set(F.map(x=>x.datatypeKey))];
o.pl=F.filter(x=>/pick/.test(x.datatypeKey)).map(x=>[x.apiName,JSON.stringify(x.datatypeOptions).slice(0,250)]).slice(0,8);
const rs=await api('GET','/workflow/rules?take=50');o.rs=rs.s+' '+arr(rs.j?.data).length;
return o;
