const U1='48f1cdbb-a6a3-4ec1-885f-adfff50b7729';const R={};
for(const p of ['/iam/users/'+U1,'/desk/agents/'+U1,'/desk/sla/policies?limit=200','/audit/logs?limit=30','/desk/audit?limit=30']){const r=await api('GET',p);let t=r.t;if(p.includes('policies'))t=JSON.stringify((r.j?.data||[]).filter(x=>/SL51/.test(x.name)).map(x=>[x.name,x.id]));R[p]=r.s+' '+t.replace(/"(email|token)":"[^"]*"/g,'"$1":"<m>"').slice(0,500);}
return R;
