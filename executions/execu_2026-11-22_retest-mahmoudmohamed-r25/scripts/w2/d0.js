const ds=arr((await api('GET','/desk/departments')).j?.data).map(d=>[d.id,d.name,d.is_active??d.isActive]);
return ds;
