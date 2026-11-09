eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const d=(await api('GET','/desk/assignment-rules?type=direct')).j.data.rules;const o={};
o.keys=Object.keys(d[0]);o.sample=d.filter(r=>/QA NDC/.test(r.name)).slice(0,3).map(r=>({n:r.name,a:r.is_active,up:r.updated_at,by:r.updated_by}));o.upd=[...new Set(d.map(r=>String(r.updated_at).slice(0,16)))].sort().slice(-6);
for(const q of ['/audit/logs?limit=100','/audit/events?limit=100','/audit/log?limit=100']){const r=await api('GET',q);if(r.s===200){const L=arr(r.j.data);o.q=q;o.n=L.length;o.first=JSON.stringify(L[0]).slice(0,300);fs.writeFileSync(OUT+'/audit.json',JSON.stringify(r.j));o.hits=L.filter(x=>/assignment|notification/i.test(JSON.stringify(x))).slice(0,12).map(x=>JSON.stringify(x).slice(0,300));break;}else o[q]=r.s;}
return o;
