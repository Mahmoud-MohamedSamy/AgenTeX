const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const out={};
for (const p of [`/modules/${TK}/records?search=test&per_page=20&sort=-created_at`,`/modules/${TK}/records?q=test&per_page=20`,`/desk/tickets?search=test&per_page=20`,`/search?q=test&module=tickets`]) {
  const r=await api('GET',p); const a=arr(r.j&&(r.j.data||r.j));
  out[p]=r.s+' n='+a.length+' '+JSON.stringify(a.slice(0,6).map(x=>{const d=x.data||[];const g=f=>{const z=Array.isArray(d)?d.find(q=>q.field===f):null;return z&&z.value&&z.value.value};return {id:x.id,sub:x.subject||g('subject'),no:x.ticket_number||g('ticket_number'),c:x.created_at||x.createdAt,em:g('email')||x.email,ch:g('channel')||x.channel};})).slice(0,900);
}
return out;
