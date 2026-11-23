const ms=arr((await api('GET','/modules')).j);const o={n:ms.length,hits:[]};let first=null;
for(const m of ms.slice(0,60)){const r=await api('GET','/modules/'+m.id+'/validation-rules');if(!first)first=r.s+' '+r.t.slice(0,150);const L2=arr(r.j?.data?.rules||r.j);if(L2.length)o.hits.push((m.name||m.label)+' '+m.id+' : '+L2.map(x=>x.name).join(' | '));}
o.first=first;return o;
