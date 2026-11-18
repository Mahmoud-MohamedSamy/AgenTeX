async (page) => { ZLIB
const o={};for(const u of ['/api/v1/slas','/api/v1/slas?departmentId=1499272000000006907&module=tickets','/api/v1/sla?departmentId=1499272000000006907','/api/v1/slaPolicies?departmentId=1499272000000006907','/api/v1/departments/1499272000000006907/slas']){const r=await z('GET',u);o[u]=r.s+' '+r.t.slice(0,300);}
for(const st of ['UNLIMITED','TICKETS','TICKET','TIME','HOURS','unlimited','Unlimited']){const t=await z('POST','/api/v1/supportPlans',{name:'QA RT19 ZD Plan E',status:'ACTIVE',departmentId:'1499272000000006907',slaId:'0',supportType:st});o['st_'+st]=t.s+' '+t.t.slice(0,160);if(t.s<300)break;}
return o;}
