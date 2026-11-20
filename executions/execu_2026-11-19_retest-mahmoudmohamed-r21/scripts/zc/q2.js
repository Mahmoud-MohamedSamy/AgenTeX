module.exports=async(page,z)=>{const o={};const E='1499272000000006907',T='1499272000000432293',ACC='1499272000000426149',ME='1499272000000139001';
const cd={creditCycle:'MONTHLY',creditLimit:10,isCarryForwardAllowed:false,isAdditionalUsageAllowed:false};
const pa=await z('POST','/api/v1/supportPlans',{name:'QA RT20 ZC Plan A',status:'ACTIVE',departmentId:E,slaId:'1499272000000020033',supportType:'TICKETS',creditDetails:cd});o.pA=pa.s+' '+(pa.j?.id||pa.t.slice(0,200));
const pb=await z('POST','/api/v1/supportPlans',{name:'QA RT20 ZC Plan B',status:'ACTIVE',departmentId:T,slaId:'1499272000000432346',supportType:'TICKETS',creditDetails:cd});o.pB=pb.s+' '+(pb.j?.id||pb.t.slice(0,200));
if(pa.s<300){const c=await z('POST','/api/v1/contracts',{contractName:'QA RT20 ZC C1',departmentId:E,accountId:ACC,startDate:'2026-11-17',endDate:'2026-12-17',associatedSupportPlanId:pa.j.id,ownerId:ME});o.c1=c.s+' '+(c.s<300?JSON.stringify({id:c.j.id,plan:c.j.associatedSupportPlanId,dept:c.j.departmentId}):c.t.slice(0,300));o.c1full=c.s<300?Object.keys(c.j).join(','):'';}
return o;};
