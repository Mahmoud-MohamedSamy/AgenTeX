const o={}; const B={'/desk/tickets/archive/settings':{enabled:false,inactive_days:120,closed_only:true},'/desk/tickets/spam/settings':{enabled:true,retention_days:30,auto_spam_contacts_enabled:false,auto_spam_contacts_threshold:3},'/desk/tickets/parent-child/settings':{parent_close_behavior:'none',auto_close_parent:false}};
for (const [p,b] of Object.entries(B)) { const g=await api('GET',p); const u=await api('PUT',p,b); o[p]={get:g.s, put:u.s+' '+u.t.slice(0,250)}; }
o.plans=(await api('GET','/desk/sla/support-plans')).s;
return o;
