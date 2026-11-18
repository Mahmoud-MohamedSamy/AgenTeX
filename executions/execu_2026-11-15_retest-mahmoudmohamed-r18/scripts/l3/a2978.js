const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const L=arr((await api('GET','/modules/'+T+'/layouts')).j.data); o.layouts=L.map(l=>({id:l.id,name:l.name,def:l.isDefault,deps:(l.departmentIds||[]).length,status:l.status}));
const R=arr((await api('GET','/modules/'+T+'/layout-rules')).j.data); o.rules=R.map(r=>({id:r.id,name:r.name,status:r.status,lay:r.layoutId,deps:r.departmentIds}));
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data); o.qaFields=F.filter(f=>/qa/i.test(f.fieldName)).map(f=>f.fieldName+':'+f.datatypeKey).slice(0,30);
return o;
