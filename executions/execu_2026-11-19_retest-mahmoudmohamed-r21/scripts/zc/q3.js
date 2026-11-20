module.exports=async(page,z)=>{const o={};const E='1499272000000006907',T='1499272000000432293',ACC='1499272000000426149',ME='1499272000000139001',PA='1499272000000485370',PB='1499272000000485385',C1='1499272000000485400';
const sh=j=>j?JSON.stringify({dept:j.departmentId,sp:j.supportPlan&&{id:j.supportPlan.id,n:j.supportPlan.name||j.supportPlan.supportPlanName},sla:j.sla&&(j.sla.name||j.sla.id),asla:j.associatedSLAId,st:j.contractStatus}):'';
const g=await z('GET','/api/v1/contracts/'+C1);o.get=g.s+' '+sh(g.j);
// 1 create with other dept plan
const c=await z('POST','/api/v1/contracts',{contractName:'QA RT20 ZC C other',departmentId:E,accountId:ACC,startDate:'2026-11-17',endDate:'2026-12-17',associatedSupportPlanId:PB,ownerId:ME});o.createOther=c.s+' '+(c.s<300?c.j.id+' '+sh(c.j):c.t.slice(0,300));
// 5 create without department
const n=await z('POST','/api/v1/contracts',{contractName:'QA RT20 ZC C nodept',accountId:ACC,startDate:'2026-11-17',endDate:'2026-12-17',associatedSupportPlanId:PA,ownerId:ME});o.createNoDept=n.s+' '+(n.s<300?n.j.id+' '+sh(n.j):n.t.slice(0,300));
// 2 change plan to other dept plan
const p=await z('PATCH','/api/v1/contracts/'+C1,{associatedSupportPlanId:PB});o.patchPlanOther=p.s+' '+(p.s<300?sh(p.j):p.t.slice(0,300));
o.after2=sh((await z('GET','/api/v1/contracts/'+C1)).j);
return o;};
