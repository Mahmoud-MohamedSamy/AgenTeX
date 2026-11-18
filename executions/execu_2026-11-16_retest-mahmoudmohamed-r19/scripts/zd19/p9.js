async (page) => { ZLIB
const o={};const t=await z('POST','/api/v1/supportPlans',{name:'QA RT19 ZD Plan T',status:'ACTIVE',departmentId:'1499272000000432293',slaId:'1499272000000432346',supportType:'TICKETS',creditDetails:{isCarryForwardAllowed:false,isAdditionalUsageAllowed:false,creditCycle:'MONTHLY',creditLimit:10}});o.pT=t.s+' '+(t.j?.id||t.t.slice(0,200));
const PE='1499272000000485162',PT=t.j?.id,ACC='1499272000000426149',E='1499272000000006907';
// contract in dept E with own plan, then with other dept plan
const c1=await z('POST','/api/v1/contracts',{contractName:'QA RT19 ZD C own',departmentId:E,accountId:ACC,supportPlanId:PE,startDate:'2026-11-16'});o.c1=c1.s+' '+(c1.s<300?JSON.stringify({id:c1.j.id,sp:c1.j.supportPlan||c1.j.supportPlanId}):c1.t.slice(0,300));
const c2=await z('POST','/api/v1/contracts',{contractName:'QA RT19 ZD C other',departmentId:E,accountId:ACC,supportPlanId:PT,startDate:'2026-11-16'});o.c2=c2.s+' '+(c2.s<300?JSON.stringify({id:c2.j.id,sp:c2.j.supportPlan||c2.j.supportPlanId}):c2.t.slice(0,300));
return o;}
