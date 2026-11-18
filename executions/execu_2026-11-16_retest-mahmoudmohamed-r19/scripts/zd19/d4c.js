module.exports=async(page,z)=>{const c={fieldConditions:[{condition:'is',fieldName:'Subject',fieldModule:'tickets',value:['QA RT19 ZD nomatch']}],pattern:'1'};
const mk=async(name,type,status)=>{const r=await z('POST','/api/v1/skills',{name,skillTypeId:type,status,criteria:c});return {s:r.s,id:r.j?.id,status:r.j?.status,t:r.s>=300?r.t.slice(0,200):undefined};};
const all={};for(const d of ['1499272000000432293','1499272000000006907']){const r=await z('GET','/api/v1/skills?departmentId='+d);all[d]=(r.j?.data||[]).map(k=>k.id+' '+k.name+' '+k.status);}
const o={before:all};
o.b=await mk('QA RT19 ZD SkInact','1499272000000485001','INACTIVE');
o.d=await mk('QA RT19 ZD SkDel','1499272000000485001','ACTIVE');
o.c=await mk('QA RT19 ZD SkOther','1499272000000485004','ACTIVE');
return o;};
