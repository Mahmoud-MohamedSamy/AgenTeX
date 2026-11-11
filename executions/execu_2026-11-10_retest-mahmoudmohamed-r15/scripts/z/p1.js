async (page) => page.evaluate(async () => { const o = await (await fetch('/api/v1/organizations',{credentials:'include'})).json(); const org = (o.data||[]).map(x=>({id:x.id,name:x.companyName,portal:x.portalName}));
 const id = (o.data||[]).find(x=>x.portalName==='techsolutionsegypt')?.id; const g = async u => { const r = await fetch(u,{credentials:'include',headers:{orgId:id}}); return r.status+' '+(await r.text()).slice(0,1500); };
 return { org, depts: await g('/api/v1/departments?limit=20'), tickets: await g('/api/v1/tickets?limit=100&fields=subject,departmentId,teamId,assigneeId') }; })
