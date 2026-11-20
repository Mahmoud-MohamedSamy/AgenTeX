module.exports=async(page,z)=>{const g=await z('GET','/api/v1/contracts/1499272000000485400');const j=g.j||{};
const h=await z('GET','/api/v1/contracts/1499272000000485400/history?limit=20');
return {s:g.s,dept:j.departmentId,plan:j.supportPlan?.name,planId:j.supportPlan?.id,mod:j.modifiedTime,created:j.createdTime,hist:h.s+' '+h.t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,600)};};
