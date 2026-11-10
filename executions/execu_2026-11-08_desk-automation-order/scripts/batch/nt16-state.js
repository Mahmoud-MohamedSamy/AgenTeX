const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const rules=(await api('GET','/desk/notification-rules/departments/'+A)).j?.data?.rules||[];
const r=rules.find(x=>x.key==='contact.ticket_closed');
const tl=(await api('GET','/desk/email-templates')).j?.data;const L=Array.isArray(tl)?tl:(tl?.templates||tl?.items||[]);
return {rule:r,closedTemplates:L.filter(t=>t.use_case==='ticket.closed').map(t=>({id:t.id,name:t.name,type:t.notification_type,sys:t.is_system,active:t.is_active,dept:t.department_id}))};
