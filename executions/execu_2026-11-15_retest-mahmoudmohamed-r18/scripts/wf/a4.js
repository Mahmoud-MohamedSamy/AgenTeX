const R={};const all=arr((await api('GET','/workflow/rules?take=200')).j?.data);
R.kinds=all.flatMap(r=>r.actions.filter(a=>a.type==='OwnerAssignment').map(a=>r.name.slice(0,30)+' | '+a.ownerTargetKind+' | '+a.ownerValue));
const pr=arr((await api('GET','/iam/profiles')).j?.data);const adm=pr.find(x=>/Agent/.test(x.name))||pr[0];R.prof=[adm.profileId,adm.name];
const r=await mkRule('2999roleProfile',{kind:'RecordCreated'},[{type:'OwnerAssignment',ownerTargetKind:'RoleRoundRobin',ownerValue:adm.profileId}]);R.roleProfile=r.res+(r.id?' id '+r.id:'');
return R;
