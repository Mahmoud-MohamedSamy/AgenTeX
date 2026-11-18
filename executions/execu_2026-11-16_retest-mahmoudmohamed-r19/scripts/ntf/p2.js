const R={};
for(const u of ['/desk/channels/sent?limit=10','/desk/channels/outbound?limit=10','/notifications/deliveries?limit=10','/desk/notification-rules/log?limit=10','/desk/notifications/log?limit=10','/desk/email-logs?limit=10','/desk/channels/email-log?limit=10']){const x=await api('GET',u);R[u]=x.s+' '+MASK(x.t).slice(0,1200);}
return R;
