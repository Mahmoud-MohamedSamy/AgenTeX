module.exports=async(page,z)=>{const o={};const E='1499272000000006907',T='1499272000000432293',PA='1499272000000485370',PB='1499272000000485385',C1='1499272000000485400';
const sh=j=>j?JSON.stringify({dept:j.departmentId,sp:j.supportPlan&&{id:j.supportPlan.id,n:j.supportPlan.name},asla:j.associatedSLAId,st:j.contractStatus}):'';
const d=await z('PATCH','/api/v1/contracts/'+C1,{departmentId:T});o.patchDeptOnly=d.s+' '+(d.s<300?sh(d.j):d.t.slice(0,400));
o.afterDeptOnly=sh((await z('GET','/api/v1/contracts/'+C1)).j);
for(const dd of [E,T]){const l=await z('GET','/api/v1/contracts?departmentId='+dd+'&limit=20');o['list'+dd.slice(-4)]=l.s+' '+JSON.stringify((l.j?.data||[]).map(x=>x.contractName));}
return o;};
