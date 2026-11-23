const id='8bef574a-1faa-4a30-99e0-55dd53e4738c';
const rs=arr((await api('GET','/desk/tickets/'+id+'/replies')).j?.data).map(x=>[x.created_at,x.direction,x.status,x.from_address,x.subject,(x.body_text||x.body_html||'').replace(/<[^>]+>/g,' ').slice(0,80)]);
const a=arr((await api('GET','/desk/tickets/'+id+'/activity')).j?.data).filter(x=>/message|status/.test(x.action)).map(x=>[x.occurred_at,x.action,JSON.stringify(x.summary).slice(0,150)]);
const nt=[];for(let p=1;p<=3;p++){const r=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=100&page='+p);for(const x of arr(r.j?.data))if(x.created_at>'2026-11-22T08:36'){const o={};x.data.forEach(f=>o[f.field]=f.value&&f.value.value);nt.push([x.created_at,o.ticket_number,o.subject,x.source,o.email]);}}
return {rs,a,newTickets:nt,health:(await api('GET','/desk/channels/inbound-health')).s,now:new Date().toISOString()};
