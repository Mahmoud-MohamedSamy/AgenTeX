const h=await api('GET','/desk/happiness/settings');const t=await api('GET','/desk/email-templates');const L=(t.j?.data?.email_templates||[]);
return {h:JSON.stringify(h.j?.data).slice(0,400),tpl:L.filter(x=>/workflow|desk_tickets/.test(x.module||'')||/QA/.test(x.name)).slice(0,12).map(x=>[x.id.slice(0,8),x.name,x.module,x.notification_type,x.use_case].join('|'))};
