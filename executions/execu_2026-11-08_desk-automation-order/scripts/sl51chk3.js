const U1='48f1cdbb-a6a3-4ec1-885f-adfff50b7729',AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const R={};
const p=await api('GET','/desk/sla/policies?department_id='+AO);R.aoPolicies=p.s+' '+JSON.stringify((p.j?.data||[]).map(x=>x.name));
const t=await api('GET','/desk/tickets?search=QA%20RT15%202204');const tk=(t.j?.data||[]).map(x=>({n:x.ticket_number||x.number,s:x.subject,owner:x.owner_id||x.owner?.id,st:x.status}));R.t2565=t.s+' '+JSON.stringify(tk).slice(0,400);
const w=await api('GET','/desk/agents/'+U1+'/workload');R.workload=JSON.stringify(w.j?.data).slice(0,700);
return R;
