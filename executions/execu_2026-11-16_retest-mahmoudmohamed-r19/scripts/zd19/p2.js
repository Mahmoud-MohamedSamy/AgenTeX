async (page) => { ZLIB
const o={};for(const d of ['1499272000000006907','1499272000000432293']){const r=await z('GET','/api/v1/slas?departmentId='+d);o['sla'+d.slice(-4)]=r.s+' '+(r.s<300?JSON.stringify((r.j?.data||[]).map(x=>({id:x.id,name:x.name,st:x.status}))):r.t.slice(0,200));}
const t=await z('POST','/api/v1/supportPlans',{name:'QA RT19 ZD probe'});o.spPost=t.s+' '+t.t.slice(0,300);
return o;}
