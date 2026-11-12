const r=await api('GET','/reporting/reports?per_page=100'); const list=arr(r.j&&r.j.data&&(r.j.data.data||r.j.data)); const out={n:list.length,s:r.s};
for(const x of list){const f=JSON.stringify(x.query_spec&&x.query_spec.filters||[]); if(/"operator":"(gte|gt|lte|lt|between)"/.test(f)){out.sample=f.slice(0,500);break;}}
if(!out.sample){for(const x of list.slice(0,40)){const g=await api('GET','/reporting/reports/'+x.id); const f=JSON.stringify(g.j&&g.j.data&&((g.j.data.data||g.j.data).query_spec||{}).filters||[]); if(f.length>2){out.any=(out.any||[]).concat(f.slice(0,300)); if(/gte|gt"|lte|between|greater/.test(f)){out.sample=f.slice(0,500);break;}}}}
return out;
