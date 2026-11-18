const r=await api('GET','/desk/email-templates?limit=200&use_case=ticket.sla_escalation');const L=r.j?.data?.email_templates||arr(r.j?.data);return L.map(x=>[x.id,x.name,x.is_system,x.subject]);
