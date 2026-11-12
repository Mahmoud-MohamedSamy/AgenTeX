const T='1475109000000529136'; const o={ids:[]};
const l=await z('GET',`/skills?departmentId=${DEPT}&limit=100`); let active=(l.j?.data||[]).filter(s=>s.status==='ACTIVE').length; o.startActive=active;
for(let i=1;i<=40 && active<31;i++){ const n=`QA SK12 Lim${String(i).padStart(2,'0')}`;
 const r=await z('POST','/skills',{name:n,skillTypeId:T,status:'ACTIVE',criteria:{fieldConditions:[{fieldName:'Subject',fieldModule:'tickets',condition:'contains',value:['QASK12Lim'+i]}],pattern:'1'}});
 if(r.s===201){o.ids.push([n,r.j.id]);active++;} else {o.refused=[n,active,r.s,r.t.slice(0,300)];break;} }
// inactive beyond limit?
const ri=await z('POST','/skills',{name:'QA SK12 LimInact',skillTypeId:T,status:'INACTIVE',criteria:{fieldConditions:[{fieldName:'Subject',fieldModule:'tickets',condition:'contains',value:['x']}],pattern:'1'}}); o.inactAtLimit=[ri.s,ri.j?.id||ri.t.slice(0,200)];
if(ri.j?.id){ const ra=await z('PATCH',`/skills/${ri.j.id}`,{status:'ACTIVE'}); o.activateAtLimit=[ra.s,ra.t.slice(0,250)]; }
return o;
