module.exports=async(page,z)=>{const o={};const CT=['1499272000000485400','1499272000000462043','1499272000000489002'],SP=['1499272000000485370','1499272000000485385','1499272000000485410'];
o.ctTrash=(await z('POST','/api/v1/contracts/moveToTrash',{contractIds:CT})).s;
const pur=async()=>{const rb=await z('GET','/api/v1/recycleBin?limit=100');const q=(rb.j?.data||[]).filter(x=>/QA RT20 ZC/.test(x.displayName)).map(x=>x.id);o['binQ'+Object.keys(o).length]=q.length;if(q.length)o['purge'+Object.keys(o).length]=(await z('POST','/api/v1/recycleBin/delete',{ids:q})).s;};
await pur();
for(const p of SP){let r=await z('DELETE','/api/v1/supportPlans/'+p);if(r.s>=300){await z('PATCH','/api/v1/supportPlans/'+p,{status:'INACTIVE'});r=await z('DELETE','/api/v1/supportPlans/'+p);}o['sp'+p.slice(-3)]=r.s+' '+(r.s>=300?r.t.slice(0,150):'');}
await pur();
for(const d of ['1499272000000006907','1499272000000432293']){const s=await z('GET','/api/v1/supportPlans?departmentId='+d);o['spLeft'+d.slice(-4)]=(s.j?.data||[]).filter(x=>/QA RT20 ZC/.test(x.name)).length;const c=await z('GET','/api/v1/contracts?departmentId='+d);o['ctLeft'+d.slice(-4)]=(c.j?.data||[]).filter(x=>/QA RT20 ZC/.test(x.contractName)).length;}
const rb=await z('GET','/api/v1/recycleBin?limit=100');o.binZCleft=(rb.j?.data||[]).filter(x=>/QA RT20 ZC/.test(x.displayName)).length;
return o;};
