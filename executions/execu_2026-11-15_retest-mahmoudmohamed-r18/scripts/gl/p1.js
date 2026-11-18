const o={};
for (const p of ['/desk/channels/settings','/desk/channels/outbound?limit=3','/desk/channels/inbound?limit=3','/desk/channels/domains','/desk/channels/spam-contacts?limit=200','/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement','/desk/email-templates?limit=200&use_case=ticket.acknowledgement','/desk/happiness/settings','/desk/channels/addresses','/mail/messages?limit=3','/desk/notifications/rules','/desk/channels/sent?limit=3']) {
 const r=await api('GET',p); o[p]=r.s+' '+r.t.slice(0,p.includes('settings')||p.includes('templates')?1500:500);
}
return o;
