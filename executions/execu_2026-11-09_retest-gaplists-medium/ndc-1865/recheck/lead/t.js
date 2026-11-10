const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const out={};
for(const id of ['60d56647-cabf-439e-9a1d-eb4a64a149ed','db3b9750-8f10-456d-9fca-9e5eff884f0e']){const r=await api('GET',`/modules/${TK}/records/${id}`);const x=r.j&&(r.j.data||r.j);const d=x&&x.data||{};
const v={};for(const k of Object.keys(d)){const f=d[k];const val=f&&typeof f==='object'&&'value' in f?f.value:f;if(val!==null&&val!==''&&!(Array.isArray(val)&&!val.length))v[k]=typeof val==='object'?JSON.stringify(val).slice(0,120):String(val).slice(0,120);}
out[id]={s:r.s,source:x&&x.source,created_by_name:x&&x.created_by_name,v};}
return out;
