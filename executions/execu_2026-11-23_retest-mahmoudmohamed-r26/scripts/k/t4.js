const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const r=await api('GET','/desk/tickets/'+X.t.C1+'/sla');const p=await api('GET','/desk/sla/policies/'+X.SLA);
const t=(await api('GET','/desk/tickets/'+X.t.C1)).j?.data;return {sla:r.s+' '+r.t.slice(0,500),pol:p.s+' '+JSON.stringify(p.j?.data).slice(0,700),subj:t.subject,dept:t.department_id};
