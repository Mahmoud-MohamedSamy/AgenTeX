const id='8bef574a-1faa-4a30-99e0-55dd53e4738c';
for(let i=0;i<40;i++){
 const rs=arr((await api('GET','/desk/tickets/'+id+'/replies')).j?.data);const inb=rs.filter(x=>x.direction!=='outbound');
 const nt=[];const r=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=30');for(const x of arr(r.j?.data))if(x.created_at>'2026-11-22T08:36'&&x.source==='email'){const o={};x.data.forEach(f=>o[f.field]=f.value&&f.value.value);nt.push([x.id,x.created_at,o.ticket_number,o.subject,o.email]);}
 if(inb.length||nt.length){const a=arr((await api('GET','/desk/tickets/'+id+'/activity')).j?.data).filter(x=>/message|status/.test(x.action)).map(x=>[x.occurred_at,x.action,JSON.stringify(x.summary).slice(0,150)]);
  const out={at:new Date().toISOString(),inbound:inb.map(x=>[x.id,x.created_at,x.direction,x.from_address,x.subject,(x.body_text||x.body_html||'').replace(/<[^>]+>/g,' ').slice(0,100)]),a,newEmailTickets:nt};fs.writeFileSync('../out/2837-reply.json',JSON.stringify(out,null,1));return out;}
 await sleep(30000);}
return 'no reply after 20 min';
