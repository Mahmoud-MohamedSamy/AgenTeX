// NT-16 variant: template with script/onerror in the body (the original 8 Nov template). Then restores the rule to default and deletes all NT-16 data.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4',G='mahmoud.mmohamedsamy@gmail.com';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6);const R={tag:'NT16'+u+'s'};
const feed=async id=>{const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);return L.map(e=>e.action+(e.action==='reply.sent'?' '+JSON.stringify(e.summary||{}).slice(0,120):''));};
const tpl=await api('POST','/desk/email-templates',{name:'QA AO NT16 script template '+u,module:'desk_tickets',notification_type:'contact',use_case:'ticket.closed',subject:'QA AO NT16'+u+'s {{ticket.number}} {{ticket.subject}}',body_html:'<p>QA AO {{ticket.subject}}</p><script>window.qaao=1</script><img src=x onerror=window.qaao=2>'});
const tid=tpl.j?.data?.id;R.template=tpl.s;
R.bind=(await api('PUT','/desk/notification-rules/departments/'+A+'/rules/contact.ticket_closed',{is_enabled:true,template_id:tid})).s;
const c=(await api('POST','/modules/'+C+'/records',{data:[f('last_name','QA AO '+R.tag),f('email',G)]})).j.data.id;
const t=(await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+R.tag),f('description','QA AO '+R.tag),f('department',A),f('status','Open'),f('priority','high'),f('contact_id',c),f('email',G)]})).j.data.id;
await sleep(15000);R.close=(await api('POST','/desk/tickets/'+t+'/close',{})).s;await sleep(30000);R.feed=await feed(t);
R.restore=(await api('PUT','/desk/notification-rules/departments/'+A+'/rules/contact.ticket_closed',{is_enabled:true,template_id:null})).s;
R.cleanup=[];
for(const id of [t,'1454d6b8-d525-431c-ad11-ad5057cc0f85','4868be4f-5c8f-412e-bb6a-183e45aa2dc8'])R.cleanup.push('t'+(await api('DELETE','/modules/'+M+'/records/'+id)).s);
for(const id of [c,'1ec0b824-d887-4f3f-973a-76369a4ce623','58aafdfe-08d0-4b2e-a916-bd3dc01b6e1e'])R.cleanup.push('c'+(await api('DELETE','/modules/'+C+'/records/'+id)).s);
for(const id of [tid,'b8f5196f-a60f-4661-8cb8-3d0c2e156460'])R.cleanup.push('tpl'+(await api('DELETE','/desk/email-templates/'+id)).s);
R.ruleNow=(((await api('GET','/desk/notification-rules/departments/'+A)).j?.data?.rules||[]).find(x=>x.key==='contact.ticket_closed')||{}).template_id;
return R;
