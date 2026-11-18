const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const v=await api('GET','/modules/'+T+'/validation-rules'); o.vr=v.s; o.rules=arr(v.j&&v.j.data).map(r=>({id:r.id,name:r.name,status:r.status,lay:r.layoutId,deps:r.departmentIds,ce:r.conditionError,w:r.warnings}));
o.sample=JSON.stringify(arr(v.j&&v.j.data)[0]||{}).slice(0,1500);
const b=await api('GET','/modules/'+T+'/blueprints'); o.bp=b.s; o.bps=arr(b.j&&b.j.data).map(x=>({id:x.id,name:x.name,act:x.isActive,lay:x.layoutId,tf:x.targetField,dep:x.departmentId||x.departmentIds}));
o.bpSample=JSON.stringify(arr(b.j&&b.j.data)[0]||{}).slice(0,2500);
return o;
