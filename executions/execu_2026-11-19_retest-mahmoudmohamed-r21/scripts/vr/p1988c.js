const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={diff:[]};
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data); const FV={}; for(const f of F) if(f.config&&f.config.allowed_values) FV[f.apiName]=JSON.stringify(f.config.allowed_values);
const Ls=arr((await api('GET','/modules/'+T+'/layouts')).j.data);
for(const l of Ls){ const L=((await api('GET','/modules/'+T+'/layouts/'+l.id)).j||{}).data; if(!L){o.diff.push(['GETFAIL',l.name]);continue;} for(const [vn,v] of Object.entries(L.views||{})) for(const s of (v.layout.sections||[])) for(const c of s.columns||[]) for(const f of c.fields||[]) { if(f.config&&f.config.allowed_values&&FV[f.apiName]&&JSON.stringify(f.config.allowed_values)!==FV[f.apiName]) o.diff.push([l.name,vn,f.apiName,f.config.allowed_values.length,JSON.parse(FV[f.apiName]).length]); } }
const vl=await api('GET','/modules/'+T+'/validation-rules'); o.vrMeta=JSON.stringify(vl.j.meta||null).slice(0,400);
return o;
