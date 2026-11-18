const L=(await api('GET','/desk/email-templates?limit=500')).j?.data?.email_templates||[];
return {n:L.length,agent:L.filter(x=>x.notification_type!=='contact').map(x=>[x.id.slice(0,36),x.is_system,x.use_case,x.notification_type,x.name,x.department_name,x.is_active].join(' | ')).slice(0,40),sys:L.filter(x=>x.is_system).map(x=>x.id)};
