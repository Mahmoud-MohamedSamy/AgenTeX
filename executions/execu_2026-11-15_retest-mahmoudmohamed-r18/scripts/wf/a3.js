const R={};const ou=(await api('GET','/iam/org-units')).j?.data;const L=arr(ou);R.keys=Object.keys(L[0]||{});
const ceo=L.find(x=>x.name==='CEO');const cid=ceo&&(ceo.id||ceo.orgUnitId||ceo.key);R.ceo=cid;
const pr=arr((await api('GET','/iam/profiles')).j?.data);R.pkeys=Object.keys(pr[0]||{});
for(const [n,k,v] of [['roleCEO','RoleRoundRobin','7972984b-b5cc-034a-bd96-6de61e3937d0'],['roleCEOlist','RoleRoundRobin',cid]]){if(!v)continue;const r=await mkRule('2999'+n,{kind:'RecordCreated'},[{type:'OwnerAssignment',ownerTargetKind:k,ownerValue:v}]);R[n]=r.res+(r.id?' id '+r.id:'');}
return R;
