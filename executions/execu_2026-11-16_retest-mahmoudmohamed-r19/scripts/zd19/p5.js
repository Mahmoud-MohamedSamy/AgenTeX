async (page) => { ZLIB
const o={};const sla={};for(const d of ['1499272000000006907','1499272000000432293']){const r=await z('GET','/api/v1/sla?departmentId='+d);sla[d]=(r.j?.data||[]).map(x=>({id:x.id,n:x.name,st:x.status||x.isActive}));}
o.sla=sla;
const mk=async(name,d)=>{const s=sla[d].find(x=>!/inactive/i.test(String(x.st)))||sla[d][0];if(!s)return 'no sla';const t=await z('POST','/api/v1/supportPlans',{name,status:'ACTIVE',departmentId:d,slaId:s.id,supportType:'TICKETS'});return t.s+' '+(t.s<300?t.j.id:t.t.slice(0,250));};
o.pE=await mk('QA RT19 ZD Plan E','1499272000000006907');o.pT=await mk('QA RT19 ZD Plan T','1499272000000432293');
return o;}
