module.exports=async(page,z)=>{const o={};const E='1499272000000006907',T='1499272000000432293',PA='1499272000000485370',PB='1499272000000485385',C1='1499272000000485400';
const sh=j=>j?JSON.stringify({dept:j.departmentId,sp:j.supportPlan&&{id:j.supportPlan.id,n:j.supportPlan.name},asla:j.associatedSLAId,st:j.contractStatus}):'';
const d2=await z('PATCH','/api/v1/contracts/'+C1,{departmentId:T});o.patchDeptOnlyRepeat=d2.s+' '+(d2.s<300?sh(d2.j):d2.t.slice(0,300));
const d=await z('PATCH','/api/v1/contracts/'+C1,{departmentId:T,associatedSupportPlanId:PB});o.patchDeptPlusPlan=d.s+' '+(d.s<300?sh(d.j):d.t.slice(0,400));
o.after=sh((await z('GET','/api/v1/contracts/'+C1)).j);
const b=await z('PATCH','/api/v1/contracts/'+C1,{departmentId:E,associatedSupportPlanId:PA});o.backToE=b.s+' '+(b.s<300?sh(b.j):b.t.slice(0,300));
return o;};
