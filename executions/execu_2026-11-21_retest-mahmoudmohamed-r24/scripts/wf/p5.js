eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';
for(const [k,v] of [['OrgUnitRoundRobin',CEO],['RoleRoundRobin','44444444-4444-4444-4444-444444444402'],['ProfileRoundRobin','44444444-4444-4444-4444-444444444402'],['OrgUnit',CEO],['Role',CEO]]){const r=await api('POST','/workflow/rules/validate',body('2997 probe',{kind:'RecordCreated'},[{type:'OwnerAssignment',ownerTargetKind:k,ownerValue:v}]));o[k]=r.s+' '+r.t.slice(0,200);}
return o;
