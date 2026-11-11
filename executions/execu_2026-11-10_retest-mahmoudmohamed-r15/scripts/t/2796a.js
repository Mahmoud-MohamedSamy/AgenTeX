const T='88e8ea44-1658-4df3-9930-d0902b91073d', ACC='c0e05c3e-aa51-47ef-be50-53fd4c6edcb1';
const ls = arr((await api('GET','/modules/'+T+'/layouts')).j.data);
return ls.map(l=>({name:l.name, id:l.id, depts:(l.departmentIds||[]).length, acc:(l.departmentIds||[]).includes(ACC), accDefault:(l.defaultDepartmentIds||[]).includes(ACC), isDefault:l.isDefault, status:l.status}));
