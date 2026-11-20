module.exports=async(page,z)=>{const o={};const T='1499272000000432293',C1='1499272000000485400';
const cd={creditCycle:'MONTHLY',creditLimit:10,isCarryForwardAllowed:false,isAdditionalUsageAllowed:false};
const p=await z('POST','/api/v1/supportPlans',{name:'QA RT20 ZC Plan B2',status:'ACTIVE',departmentId:T,slaId:'1499272000000432345',supportType:'TICKETS',creditDetails:cd});o.pB2=p.s+' '+(p.j?.id||p.t.slice(0,200));
if(p.s<300){const d=await z('PATCH','/api/v1/contracts/'+C1,{departmentId:T,associatedSupportPlanId:p.j.id});o.deptPlusB2=d.s+' '+d.t.slice(0,250);
const d2=await z('PATCH','/api/v1/contracts/'+C1,{departmentId:T});o.deptOnly3=d2.s+' '+d2.t.slice(0,250);}
const g=await z('GET','/api/v1/contracts/'+C1);o.after='dept='+g.j?.departmentId+' plan='+g.j?.supportPlan?.name;return o;};
