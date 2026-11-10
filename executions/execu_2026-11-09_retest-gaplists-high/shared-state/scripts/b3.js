const out={};
const r=await api('GET','/modules');const ms=arr(r.j.data!==undefined?r.j.data:r.j);
out.keys=Object.keys(ms[0]);out.sample=JSON.stringify(ms[0]).slice(0,1500);
out.names=ms.map(m=>[m.id.slice(0,8),m.singular_label||m.label||m.display_name||m.key||m.slug].join(' '));
return out;
