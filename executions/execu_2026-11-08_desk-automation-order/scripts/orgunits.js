const ou=(await api('GET','/iam/org-units?app_key=desk')).j?.data||[];
const us=(await api('GET','/iam/users?app_key=desk')).j?.data||[];
return {units:ou.map(o=>({id:o.orgUnitId,name:o.name||o.title,parent:o.parentId||o.parentOrgUnitId,keys:Object.keys(o).join(',')})),
 users:us.map(u=>({id:u.userId,name:(u.displayName||u.firstName||'')+' '+(u.lastName||''),ou:u.orgUnitId||u.org_unit_id||u.roleId||null,status:u.status,keys:Object.keys(u).join(',')})).slice(0,25)};
