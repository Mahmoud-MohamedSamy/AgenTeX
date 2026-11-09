const u=arr((await api('o','GET','/iam/users?limit=200')).j?.data).find(x=>x.userId===T.U3);
const p=await api('o','GET',`/iam/users/${T.U3}/profiles`);
const dm=await api('o','GET','desk:/desk/departments/9a7e391c-be72-49e4-a1cf-763e5c88e23d');
return {names:u.profileNames, ou:u.orgUnitId, assigns:p.s+' '+p.t.slice(0,600), dept:dm.s+' '+JSON.stringify(dm.j?.data).slice(0,600)};
