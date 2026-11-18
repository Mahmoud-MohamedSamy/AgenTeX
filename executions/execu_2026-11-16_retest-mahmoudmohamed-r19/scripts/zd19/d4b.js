module.exports=async(page,z)=>{const T='1499272000000432293',E='1499272000000006907';const o={};
const st1=await z('POST','/api/v1/skillTypes',{name:'QA RT19 ZD Type',departmentId:T});o.st1=st1.s+' '+st1.t.slice(0,300);
const st2=await z('POST','/api/v1/skillTypes',{name:'QA RT19 ZD Type E',departmentId:E});o.st2=st2.s+' '+st2.t.slice(0,300);
return o;};
