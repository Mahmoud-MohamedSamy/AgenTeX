const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const R='4e50a48f-3df1-4dc2-aefc-02d16e021283'; const g=await api('GET','/modules/'+T+'/validation-rules/'+R); const d=g.j&&g.j.data;
const o={s:g.s, rule: d && {name:d.name,status:d.status,layoutId:d.layoutId,departmentIds:d.departmentIds,primaryField:d.primaryField,ce:d.conditionError,w:d.warnings,mod:d.lastModifiedAt,branches:d.branches}};
const all=arr((await api('GET','/modules/'+T+'/validation-rules')).j.data); o.all=all.map(x=>[x.id.slice(0,8),x.name,x.status,x.layoutId&&x.layoutId.slice(0,8),x.conditionError]);
o.lays=arr((await api('GET','/modules/'+T+'/layouts')).j.data).map(x=>[x.id.slice(0,8),x.name,x.departmentId||x.department_id]);
o.depts=arr((await api('GET','/desk/departments')).j.data).map(x=>[x.id.slice(0,8),x.name]);
return o;
