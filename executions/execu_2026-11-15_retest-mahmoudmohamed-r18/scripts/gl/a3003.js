const MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794'; const o={};
const c=await api('POST','/desk/email-templates',{ name:'QA RT18 reply ack', module:'desk_tickets', notification_type:'contact', department_id:MK, use_case:'ticket.reply_acknowledgement', subject:'QA RT18 we got your reply [#{{ticket.number}}]', body_html:'<p>QA RT18: thanks, we got your reply on {{ticket.number}}.</p>'});
o.create=c.s+' '+c.t.slice(0,200); const id=c.j&&c.j.data&&c.j.data.id; o.id=id;
if(id){ const a=await api('POST','/desk/email-templates/'+id+'/activate',{}); o.activate=a.s+' '+a.t.slice(0,300); }
const l=await api('GET','/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement'); o.list=l.j.data.email_templates.map(x=>[x.id.slice(0,13),x.name,x.department_name,x.is_active]);
return o;
