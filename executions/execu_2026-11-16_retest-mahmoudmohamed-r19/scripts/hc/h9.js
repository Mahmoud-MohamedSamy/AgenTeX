const id='c2700c91-3a4c-42ca-8076-5a1715ace30e'; const d=(await api('GET','/desk/tickets/'+id)).j?.data; const r=await rec(id);
const H = JSON.parse(fs.readFileSync(RUN + '/scripts/hc/hc.json', 'utf8')); H.n3044=d?.ticket_number; fs.writeFileSync(RUN + '/scripts/hc/hc.json', JSON.stringify(H, null, 1));
LED('3044 ticket c2700c91 = #'+d?.ticket_number+' (Customer Support, contact +r19hc), created '+d?.created_at);
return {n:d?.ticket_number, created:d?.created_at, dept:r.department===CS, contact:r.contact_id===H.contact, subj:r.subject, hist:(await histRaw(id)).map(x=>x.action)};
