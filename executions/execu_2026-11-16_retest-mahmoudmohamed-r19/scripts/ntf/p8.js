const R={};const ds=Ls((await api('GET','/desk/departments?limit=200')).j?.data);
for(const d of ds.filter(x=>['Customer Support','Tech','Marketing'].includes(x.name))){const L=Ls((await api('GET','/desk/notification-rules/departments/'+d.id)).j?.data);R[d.name]={id:d.id,rules:L.filter(x=>/ticket_received|reply_received|ticket_closed/.test(x.key)&&x.category==='contact').map(x=>x.key+' en='+x.is_enabled+' cust='+x.is_customized+' tpl='+(x.template_name||'-')+' optin='+JSON.stringify(x.address_opt_in))};}
for(const u of ['/desk/channels/addresses','/desk/channels/email']){const x=await api('GET',u);R[u]=x.s+' '+MASK(x.t).slice(0,1500);}
return R;
