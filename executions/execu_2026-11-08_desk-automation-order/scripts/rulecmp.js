const r=(await api('GET','/desk/notification-rules/departments/93949fbd-f9df-4e2e-ae45-00b8dc38385b')).j.data;
return {otherKeys:Object.keys(r).filter(k=>k!=='rules'),agent:r.rules.filter(x=>/^(agent|team)\./.test(x.key)).map(x=>[x.key,'on='+x.is_enabled,'tpl='+x.template_id,'bindable='+x.template_bindable,'ch='+x.channels.join('+'),'email='+x.email_enabled].join(' '))};
