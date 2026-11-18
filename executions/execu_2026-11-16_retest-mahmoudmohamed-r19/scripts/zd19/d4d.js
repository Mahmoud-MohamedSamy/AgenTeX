module.exports=async(page,z)=>{const A='1499272000000485010',I='1499272000000485020',X='1499272000000485030',O='1499272000000485040',T='1499272000000432293',TK='1499272000000480038';const o={};
o.del='done before';
const sk=async()=>{const g=await z('GET','/api/v1/tickets/'+TK);return JSON.stringify(g.j?.entitySkills);};
o.start=await sk();
const tries=[['A only',[A]],['A+inactive',[A,I]],['A+otherDept',[A,O]],['otherDept only',[O]],['A+deleted',[A,X]],['A+bogus',[A,'1499272000000999999']],['inactive only',[I]]];
o.edit='done before';
o.create=[];for(const [n,v] of [['create A+inactive',[A,I]],['create A+otherDept',[A,O]],['create A+deleted',[A,X]]]){const r=await z('POST','/api/v1/tickets',{subject:'QA RT19 ZD D4 '+n,departmentId:T,contact:{lastName:'QA RT19 ZD',email:'qa.rt19.zd@example.com'},entitySkills:v});o.create.push({n,s:r.s,id:r.j?.id,num:r.j?.ticketNumber,skills:r.s<300?JSON.stringify(r.j?.entitySkills):r.t.slice(0,250)});}
return o;};
