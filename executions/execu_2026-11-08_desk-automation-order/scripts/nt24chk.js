const S=JSON.parse(fs.readFileSync('../ev5.json','utf8'));const mask=s=>String(s).replace(/mahmoud\.mmohamedsamy(\+[a-z0-9]+)?@gmail\.com/g,'<gmail$1>');const o={};
for(const t of S.nt24){const j=(await api('GET','/desk/tickets/'+t.id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);o[t.tag]=L.map(e=>e.action+' @'+(e.occurred_at||'').slice(11,19)+(/mail|notif|reply|clos/.test(e.action)?' '+mask(JSON.stringify(e.summary||{})).slice(0,350):''));
const r=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+t.id);o[t.tag+'#']=(r.j?.data?.data||[]).filter(x=>/ticket_number|status/.test(x.field)).map(x=>x.field+'='+x.value?.value).join(' ');}
return o;
