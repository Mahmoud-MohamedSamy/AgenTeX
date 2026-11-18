async (page) => { ZLIB
const o={};let r=await z('DELETE','/api/v1/supportPlans/1499272000000485162');o.del=r.s+' '+r.t.slice(0,250);
if(r.s>=300){const u=await z('PATCH','/api/v1/supportPlans/1499272000000485162',{status:'INACTIVE'});o.inact=u.s+' '+u.t.slice(0,200);r=await z('DELETE','/api/v1/supportPlans/1499272000000485162');o.del2=r.s+' '+r.t.slice(0,200);}
const s=await z('GET','/api/v1/supportPlans?departmentId=1499272000000006907');o.left=(s.j?.data||[]).map(x=>x.id+' '+(x.name)+' '+x.status);return o;}
