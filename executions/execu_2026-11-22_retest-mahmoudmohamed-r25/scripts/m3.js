const id='a5208ac8-16fb-4b8c-8d8a-bce2ec5dbd41';
const rs=arr((await api('GET','/desk/tickets/'+id+'/replies')).j?.data).map(x=>[x.created_at,x.direction,x.status,x.from_address,x.subject]);
const a=arr((await api('GET','/desk/tickets/'+id+'/activity')).j?.data).filter(x=>/message|reply/.test(x.action)).map(x=>[x.occurred_at,x.action,JSON.stringify(x.summary).slice(0,120)]);
const all=[];for(let p=1;p<=3;p++){const r=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=100&page='+p);for(const x of arr(r.j?.data))if(x.created_at>'2026-11-22T08'){const o={};x.data.forEach(f=>o[f.field]=f.value&&f.value.value);all.push([x.created_at,o.ticket_number,o.subject,x.source]);}}
const h=await api('GET','/desk/channels/inbound-health');
return {rs,a,newTickets:all,inboundHealth:h.s};
