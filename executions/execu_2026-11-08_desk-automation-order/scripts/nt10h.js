const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const R={};
const s=await api('GET','/desk/happiness/settings');R.settings=s.s+' '+JSON.stringify(s.j?.data).replace(/"closed_email_body":"[^"]*"/,'"closed_email_body":"<'+(s.j?.data?.closed_email_body||'').length+' chars>"').slice(0,1500);
const r=(await api('GET','/desk/notification-rules/departments/'+AO)).j?.data?.rules||[];R.rules=r.filter(x=>/happ|rating|feedback/i.test(x.key+JSON.stringify(x))).map(x=>x.key+'='+x.is_enabled+' rcpt='+JSON.stringify(x.recipients||x.recipient||'').slice(0,120));
R.allKeys=r.map(x=>x.key).join(',');
return R;
