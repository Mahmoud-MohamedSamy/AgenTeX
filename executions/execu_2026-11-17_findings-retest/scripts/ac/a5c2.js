const o={}; o.view=(await api('GET','/desk/tickets/'+IDS.T5)).s; o.rec=(await api('GET','/modules/'+TM+'/records/'+IDS.T5)).s;
for(const p of ['/notifications?limit=10','/notifications/inbox?limit=10','/desk/notifications?limit=10']){const r=await api('GET',p); o[p]=r.s+' '+(r.t.match(/"(title|body|message|subject)":"[^"]{0,120}/g)||[]).slice(0,8).join(' | ');}
return o;
