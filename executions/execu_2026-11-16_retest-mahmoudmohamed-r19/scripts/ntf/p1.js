const R={};
const r=await api('GET','/desk/notification-rules/departments/'+D);const L=Ls(r.j?.data);
R.assigned=L.find(x=>x.key==='agent.ticket_assigned');R.closed=L.find(x=>x.key==='contact.ticket_closed');R.ack=L.find(x=>x.key==='contact.ticket_received');
for(const u of ['/desk/channels/sending-overview','/desk/channels/settings','/desk/email-templates?limit=200']){const x=await api('GET',u);R[u]=x.s+' '+MASK(x.t).slice(0,1500);}
return R;
