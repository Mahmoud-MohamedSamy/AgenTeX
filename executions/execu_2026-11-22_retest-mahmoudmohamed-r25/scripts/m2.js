const id='a5208ac8-16fb-4b8c-8d8a-bce2ec5dbd41';const o={};((await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+id)).j.data.data).forEach(f=>o[f.field]=f.value&&f.value.value);
const rs=arr((await api('GET','/desk/tickets/'+id+'/replies')).j?.data).map(x=>[x.created_at,x.direction,x.status,x.subject,x.to]);
fs.writeFileSync('../out/2837-made.json',JSON.stringify({id,num:o.ticket_number,rs},null,1)); return {num:o.ticket_number,rs};
