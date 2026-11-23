const id='0167012a-8044-4298-b42b-4104ab53cf91';const o={};
const r=await api('POST','/desk/community/topics/'+id+'/convert',{department_id:CS});o.conv=E(r)+' '+(r.s<300?JSON.stringify(r.j?.data).slice(0,400):'');
await sleep(3000);const d=(await api('GET','/desk/community/topics/'+id)).j?.data;o.ticket=d?.ticket;
if(d?.ticket?.id){made.tickets.push(d.ticket.id);keep();LED('3007: converted topic QA RT22 3007 customer question -> ticket '+d.ticket.id);
 const rr=(await api('GET','/modules/'+TK+'/records/'+d.ticket.id)).j?.data?.data||[];o.forumFields=rr.filter(f=>/forum|topic|community|channel/i.test(f.field)).map(f=>f.field+'='+JSON.stringify(f.value?.value));
 const t=(await api('GET','/desk/tickets/'+d.ticket.id)).j?.data||{};o.deskKeys=Object.keys(t).filter(k=>/forum|topic|community|channel|source/i.test(k)).map(k=>k+'='+JSON.stringify(t[k]).slice(0,120));o.num=t.ticket_number;}
return o;
