const TECH='19510fdc-91f3-4a7a-8888-153f1318b765';const a=Ls((await api('GET','/desk/channels/addresses')).j?.data).find(x=>x.department_id===TECH);
const L=Ls((await api('GET','/desk/notification-rules/departments/'+TECH)).j?.data).filter(x=>['contact.ticket_received','contact.reply_received'].includes(x.key)).map(x=>x.key+' en='+x.is_enabled+' saved='+x.is_customized+' tpl='+(x.template_name||'default'));
const ch=(await api('GET','/desk/channels/settings')).j?.data;
return {address:a?.address,active:a?.is_active,receiving:a?.mail?.receiving,verified:a?.mail?.verified,enabled:a?.mail?.enabled,health:a?.receiving_health,paused:a?.fetch_paused_at,rules:L,channelAck:ch?.acknowledgement_enabled};
