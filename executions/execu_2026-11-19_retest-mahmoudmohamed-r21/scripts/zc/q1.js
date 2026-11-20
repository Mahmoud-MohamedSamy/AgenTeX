module.exports=async(page,z)=>{const o={};
const d=await z('GET','/api/v1/departments?limit=20');o.depts=d.s+' '+JSON.stringify((d.j?.data||[]).map(x=>({id:x.id,n:x.name,en:x.isEnabled})));
for(const id of ['1499272000000006907','1499272000000432293']){const s=await z('GET','/api/v1/slas?departmentId='+id);o['sla'+id.slice(-4)]=s.s+' '+(s.s<300?JSON.stringify((s.j?.data||[]).map(x=>({id:x.id,n:x.name,st:x.status||x.isActive}))):s.t.slice(0,200));
const p=await z('GET','/api/v1/supportPlans?departmentId='+id+'&limit=50');o['sp'+id.slice(-4)]=p.s+' '+(p.s<300?JSON.stringify((p.j?.data||[]).map(x=>({id:x.id,n:x.name,st:x.status}))):p.t.slice(0,200));
const c=await z('GET','/api/v1/contracts?departmentId='+id+'&limit=20');o['ct'+id.slice(-4)]=c.s+' '+(c.s<300?JSON.stringify((c.j?.data||[]).map(x=>({id:x.id,n:x.contractName}))):c.t.slice(0,200));}
const a=await z('GET','/api/v1/accounts?limit=5');o.acc=a.s+' '+JSON.stringify((a.j?.data||[]).map(x=>({id:x.id,n:x.accountName})));
const me=await z('GET','/api/v1/myinfo');o.me=me.s+' '+me.j?.id;return o;};
