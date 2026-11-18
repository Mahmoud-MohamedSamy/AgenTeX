module.exports=async(page,z)=>{const o={};const cf=await z('GET','/api/v1/skills/criteriaFields?departmentId=1499272000000432293&module=tickets');o.cf=cf.s+' '+cf.t.slice(0,500);
const vs=[{fieldConditions:[{condition:'is',fieldName:'Subject',fieldModule:'tickets',value:['QA RT19 ZD nomatch']}],pattern:'1'},
{fieldConditions:[{condition:'is',fieldName:'subject',fieldModule:'tickets',value:['QA RT19 ZD nomatch']}],pattern:'1'}];
o.r=[];for(const c of vs){const r=await z('POST','/api/v1/skills',{name:'QA RT19 ZD SkA',skillTypeId:'1499272000000485001',status:'ACTIVE',criteria:c});o.r.push(r.s+' '+r.t.slice(0,300));if(r.s<300)break;}return o;};
