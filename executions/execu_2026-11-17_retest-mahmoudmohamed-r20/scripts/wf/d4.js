const o={};const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const F=arr((await api('GET','/modules/'+T+'/fields?take=300')).j?.data);
o.types=[...new Set(F.map(x=>x.datatypeKey))];
const ls=F.filter(x=>/pick|list|select|enum|multi/i.test(x.datatypeKey));
o.lists=ls.map(x=>[x.apiName,x.labels?.en||JSON.stringify(x.labels).slice(0,40),x.datatypeKey,x.isCustomField,JSON.stringify(x.datatypeOptions||x.config||{}).slice(0,160)]);
o.lk=F.filter(x=>/lookup|relat|ref/i.test(x.datatypeKey)).map(x=>[x.apiName,x.datatypeKey,JSON.stringify(x.datatypeOptions).slice(0,120)]);
const ms=arr((await api('GET','/modules?take=100')).j?.data);o.mods=ms.map(m=>[m.apiName||m.name,m.id]).slice(0,30);
return o;
