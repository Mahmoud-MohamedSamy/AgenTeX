const M='88e8ea44-1658-4df3-9930-d0902b91073d';
const r = await api('POST','/modules/'+M+'/records/search',{filters:{operator:'and',conditions:[{field:'subject',operator:'contains',value:'Check-in'}]},limit:20});
log(r.s, r.t.slice(0,300));
const r2 = await api('GET','/modules/'+M+'/records?search=Check-in&limit=20'); log(r2.s);
for (const x of arr(r2.j && r2.j.data) ) log(x.id, x.data ? [x.data.ticket_number, x.data.subject, x.data.channel, x.created_at] : x);
