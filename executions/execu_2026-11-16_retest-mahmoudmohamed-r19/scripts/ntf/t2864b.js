const R={};
if(!I.tpl){const t=await api('POST','/desk/email-templates',{name:'QA RT19 NTF 2864 assigned tpl',subject:'QA RT19 NTF custom: ticket #{{ticket.number}} assigned to you',body_html:'<p>QA RT19 NTF custom template - ticket #{{ticket.number}} {{ticket.subject}}</p>',module:'desk_tickets',notification_type:'agent',use_case:'agent.ticket_assigned',department_id:D});R.tpl=E(t);I.tpl=t.j?.data?.id;saveI();if(I.tpl)LED('email template "QA RT19 NTF 2864 assigned tpl" '+I.tpl+' created (agent, dept QA RT19 NTF Dept)');}
R.bind=E(await api('PUT','/desk/notification-rules/departments/'+D+'/rules/agent.ticket_assigned',{is_enabled:true,template_id:I.tpl}));LED('QA RT19 NTF Dept rule agent.ticket_assigned template set to QA RT19 NTF 2864 assigned tpl ('+R.bind+')');
R.rule=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).filter(x=>x.key==='agent.ticket_assigned').map(x=>'en='+x.is_enabled+' tpl='+x.template_name+' valid='+x.template_binding_valid)[0];
if(R.bind.startsWith('2')){const t=await mkT('2864 C custom tpl assign to Samy');await sleep(3000);t.assignAt=new Date().toISOString();R.assign=E(await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:A2,team_id:null}));t.n=(await rec(t.id)).ticket_number;R.t=t;I.t2864c=t;saveI();}
// restore default template on my dept
R.back=E(await api('PUT','/desk/notification-rules/departments/'+D+'/rules/agent.ticket_assigned',{is_enabled:true,template_id:null}));LED('QA RT19 NTF Dept rule agent.ticket_assigned template back to default ('+R.back+')');
R.ruleAfter=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).filter(x=>x.key==='agent.ticket_assigned').map(x=>'en='+x.is_enabled+' tpl='+x.template_id)[0];
for(const k of ['t1','t2'])I.t2864a[k].n=(await rec(I.t2864a[k].id)).ticket_number;saveI();R.nums=[I.t2864a.t1.n,I.t2864a.t2.n];
return R;
