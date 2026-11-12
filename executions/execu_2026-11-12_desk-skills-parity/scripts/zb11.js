const o={}; const H='1475109000000006907'; const T1='1475109000000529517', S1='1475109000000529139';
const ty=await z('POST','/skillTypes',{departmentId:H,name:'QA SK12 TH'}); o.ty=[ty.s,ty.j?.id];
const sk=await z('POST','/skills',{name:'QA SK12 HS',skillTypeId:ty.j.id,status:'ACTIVE',criteria:{fieldConditions:[{fieldName:'Subject',fieldModule:'tickets',condition:'contains',value:['QASK12HS']}],pattern:'1'}}); o.sk=[sk.s,sk.j?.id,sk.j?.departmentId];
const p=await z('PATCH',`/tickets/${T1}`,{entitySkills:[S1,sk.j.id]}); o.cross=[p.s,p.j?.entitySkills||p.t.slice(0,300)];
return o;
