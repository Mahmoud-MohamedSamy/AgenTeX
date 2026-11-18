const M = s => String(s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<e>'); const o={};
for (const id of ['c2700c91-3a4c-42ca-8076-5a1715ace30e','4f632116-cc82-4644-b0c8-e7ea4727f88e']) {
 const d=(await api('GET','/desk/tickets/'+id)).j?.data; const h=await histRaw(id); const f=await feed(id);
 const rp=await api('GET','/desk/tickets/'+id+'/replies');
 o[d?.ticket_number]={counts:d?.counts,updated:d?.updated_at,status:d?.status,hist:M(JSON.stringify(h.map(x=>[x.occurred_at.slice(11,19),x.action,x.source,x.summary&&JSON.stringify(x.summary).slice(0,120)]))).slice(0,900),feed:M(JSON.stringify(f.slice(0,5))).slice(0,900),replies:rp.s+' '+M(rp.t).slice(0,900)};
}
return o;
