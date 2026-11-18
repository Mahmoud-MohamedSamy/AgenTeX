async (page) => { ZLIB
const o=[];const base={name:'QA RT19 ZD Plan E',status:'ACTIVE',departmentId:'1499272000000006907',slaId:'1499272000000020033',supportType:'TICKETS'};
const f={isCarryForwardAllowed:false,isAdditionalUsageAllowed:false};
const vars=[{creditCycle:'MONTHLY',creditLimit:10},{creditCycle:'MONTHLY',credits:10},{creditCycle:'MONTHLY',creditCount:10},{renewalCycle:'MONTHLY',creditLimit:10},{creditCycle:'MONTHLY'},{creditLimit:10},{supportCredits:10,creditCycle:'MONTHLY'}];
for(const v of vars){const t=await z('POST','/api/v1/supportPlans',{...base,creditDetails:{...f,...v}});o.push(JSON.stringify(v)+' => '+t.s+' '+(t.s<300?t.j.id:t.t.slice(0,220)));if(t.s<300)break;}
return o;}
