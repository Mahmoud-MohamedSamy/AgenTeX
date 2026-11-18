eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';
for(const [k,v] of [['OrgUnitRoundRobin',CEO],['ProfileRoundRobin','44444444-4444-4444-4444-444444444402'],['RoleRoundRobin','44444444-4444-4444-4444-444444444402'],['OrgUnit',CEO],['Role',CEO]]){const r=await mkRule('2997 kind '+k,{kind:'RecordCreated'},[{type:'OwnerAssignment',ownerTargetKind:k,ownerValue:v}]);o[k]=r.res+' '+(r.id||'');}
return o;
