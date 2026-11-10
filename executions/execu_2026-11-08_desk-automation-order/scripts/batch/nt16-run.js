// NT-16 repro: plain QA AO contact template for "ticket closed" bound in Dept A; close a ticket; then control with the default template. Keeps data for screenshots (ids returned).
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4',G='mahmoud.mmohamedsamy@gmail.com';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6);const R={};
const feed=async id=>{const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);return L.map(e=>e.action+(e.action==='reply.sent'?' '+JSON.stringify(e.summary||{}).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<email>').slice(0,200):''));};
const tpl=await api('POST','/desk/email-templates',{name:'QA AO NT16 template '+u,module:'desk_tickets',notification_type:'contact',use_case:'ticket.closed',subject:'QA AO NT16'+u+' closed #{{ticket.number}} {{ticket.subject}}',body_html:'<p>QA AO NT16'+u+': your ticket {{ticket.subject}} was closed.</p>'});
R.template=tpl.s+' '+(tpl.s>=300?tpl.t.slice(0,300):'');R.templateId=tpl.j?.data?.id;R.tplActive=tpl.j?.data?.is_active;
R.bind=(await api('PUT','/desk/notification-rules/departments/'+A+'/rules/contact.ticket_closed',{is_enabled:true,template_id:R.templateId})).s;
const mk=async tag=>{const c=(await api('POST','/modules/'+C+'/records',{data:[f('last_name','QA AO '+tag),f('email',G)]})).j.data.id;const t=(await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag),f('description','QA AO '+tag),f('department',A),f('status','Open'),f('priority','high'),f('contact_id',c),f('email',G)]})).j.data.id;return {c,t};};
const a=await mk('NT16'+u+'x');R.customTicket=a;await sleep(15000);
R.closeA=(await api('POST','/desk/tickets/'+a.t+'/close',{})).s;await sleep(30000);R.feedA=await feed(a.t);
R.unbind=(await api('PUT','/desk/notification-rules/departments/'+A+'/rules/contact.ticket_closed',{is_enabled:true,template_id:null})).s;
const b=await mk('NT16'+u+'d');R.defaultTicket=b;await sleep(15000);
R.closeB=(await api('POST','/desk/tickets/'+b.t+'/close',{})).s;await sleep(30000);R.feedB=await feed(b.t);
R.rebind=(await api('PUT','/desk/notification-rules/departments/'+A+'/rules/contact.ticket_closed',{is_enabled:true,template_id:R.templateId})).s;
R.tag='NT16'+u;return R;
