const r=await api('GET','/audit/events?limit=200');const A=arr(r.j&&r.j.data);
return A.filter(a=>JSON.stringify(a).includes('2eb122dd')).map(a=>{const c={...a};for(const k of Object.keys(c))if(/^source_|recorded|actor_on/.test(k))delete c[k];return JSON.stringify(c).slice(0,1500);});
