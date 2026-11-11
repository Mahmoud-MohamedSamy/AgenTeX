const U1='48f1cdbb-a6a3-4ec1-885f-adfff50b7729';const R={};
for(const p of ['/desk/tickets?owner_id='+U1,'/desk/agents/'+U1+'/tickets','/desk/queues/agents/'+U1+'/tickets','/desk/agent-queue/'+U1]){const r=await api('GET',p);R[p]=r.s+' '+(r.s<300?r.t.slice(0,300):'');}
return R;
