const out={};
const f=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields');const d=arr(f.j);
out.n=d.length;out.match=d.filter(x=>/overdue|escalat|layout|rating|happiness/i.test((x.apiName||x.api_name||'')+' '+JSON.stringify(x.labels||x.label||''))).map(x=>(x.apiName||x.api_name)+':'+(x.datatypeKey||x.datatype_key||''));
for(const p of ['/desk/assignment-rules','/desk/assignment-rules/round-robin','/desk/round-robin-rules','/desk/assignment/criteria-fields','/desk/assignment-rules/criteria-fields']){const r=await api('GET',p);out[p]={s:r.s,snip:r.t.slice(0,200)}}
return out;
