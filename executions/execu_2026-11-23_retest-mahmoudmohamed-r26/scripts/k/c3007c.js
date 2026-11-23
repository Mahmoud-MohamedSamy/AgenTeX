const id='0167012a-8044-4298-b42b-4104ab53cf91';const o={};
for(const p of ['/convert','/convert-to-ticket','/ticket']){const r=await api('POST','/desk/community/topics/'+id+p,{});o[p]=E(r)+' '+(r.s<300?JSON.stringify(r.j?.data).slice(0,300):'');if(r.s<300)break;}
await sleep(3000);const d=(await api('GET','/desk/community/topics/'+id)).j?.data;o.ticket=d?.ticket;
if(d?.ticket?.id){made.tickets.push(d.ticket.id);keep();LED('3007: converted topic QA RT22 3007 customer question -> ticket '+d.ticket.id);}
return o;
