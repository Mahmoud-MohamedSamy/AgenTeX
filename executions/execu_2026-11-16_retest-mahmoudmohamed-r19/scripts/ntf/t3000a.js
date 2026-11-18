const R={};
if(!I.addr){const r=await api('POST','/desk/channels/addresses',{local_part:'qa-rt19-ntf',department_id:D});R.addr=E(r);const a=r.j?.data;I.addr=a?.id;saveI();if(a?.id){R.local=String(a.address).split('@')[0];R.sameDomainAsTech=true;R.active=a.is_active;R.autoAck=a.auto_acknowledge;R.mail=a.mail&&{receiving:a.mail.receiving,verified:a.mail.verified,kind:a.mail.kind};LED('receiving address (local part qa-rt19-ntf, hosted) '+a.id+' created for QA RT19 NTF Dept');}}
R.ack=E(await api('PUT','/desk/notification-rules/departments/'+D+'/rules/contact.ticket_received',{is_enabled:true}));
R.rack=E(await api('PUT','/desk/notification-rules/departments/'+D+'/rules/contact.reply_received',{is_enabled:true}));LED('QA RT19 NTF Dept contact rules "Receiving a new ticket" saved ON ('+R.ack+') and "Acknowledging a ticket reply" ON ('+R.rack+')');
R.rules=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).filter(x=>x.category==='contact').map(x=>x.key+' en='+x.is_enabled+' cust='+x.is_customized+' optin='+JSON.stringify(x.address_opt_in));
const ch=(await api('GET','/desk/channels/settings')).j?.data;R.channel={ack:ch?.acknowledgement_enabled};
// API-created email-channel ticket for the plus-address customer: is an ack sent?
const t=await mkT('3000 api email-channel ticket',{contact_id:I.contact,email:MAIL,channel:'email'});await sleep(30000);t.n=(await rec(t.id)).ticket_number;t.feed=(await feedS(t.id)).filter(x=>/reply|ack/.test(x));R.t=t;I.t3000api=t;saveI();
return R;
