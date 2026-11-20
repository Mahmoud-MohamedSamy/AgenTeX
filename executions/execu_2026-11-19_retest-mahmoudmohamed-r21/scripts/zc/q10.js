module.exports=async(page,z)=>{const o={};const g=await z('GET','/api/v1/contracts/1499272000000485400');o.c1='dept='+g.j?.departmentId+' plan='+g.j?.supportPlan?.name+' sla='+g.j?.sla?.name+' mod='+g.j?.modifiedTime;
for(const d of ['1499272000000006907','1499272000000432293']){const c=await z('GET','/api/v1/contracts?departmentId='+d+'&limit=20');o['list'+d.slice(-4)]=c.s+' '+JSON.stringify((c.j?.data||[]).map(x=>x.contractName+'|'+x.id));}
return o;};
