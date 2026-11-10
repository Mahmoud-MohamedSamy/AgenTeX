const m=await api('GET','/modules');const a=arr(m.j);
return {s:m.s,url:page.url(),n:a.length,mods:a.map(x=>(x.apiName||x.api_name||x.name)+':'+x.id.slice(0,8)).slice(0,30),err:m.s>=300?m.t.slice(0,200):undefined};
