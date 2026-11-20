module.exports=async(page,z)=>{const o={};const d=await z('GET','/api/v1/departments?limit=50');o.depts=(d.j?.data||[]).map(x=>x.id+' '+x.name+' en='+x.isEnabled);
const a=await z('GET','/api/v1/agents?limit=50&status=ACTIVE');o.agents=(a.j?.data||[]).map(x=>x.id+' '+x.name+' role='+(x.roleId||'')+' prof='+x.profileId+' depts='+(x.associatedDepartmentIds||[]).join(',')+' conf='+x.isConfirmed+' status='+x.status);o.as=a.s;
return o;};
