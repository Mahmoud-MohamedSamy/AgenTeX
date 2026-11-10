const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const r=await api('GET',`/modules/${TK}/records?pageSize=30&sort=-created_at`);
const items=arr(r.j&&r.j.data?r.j.data:r.j);
const pick=items.map(x=>{const v=x.values||x.data||x;const g=k=>{const f=v[k];return f&&typeof f==='object'&&'value' in f?f.value:f};return {id:x.id,num:g('ticket_number')||x.ticket_number,subj:g('subject')||x.name,created:x.created_at||x.createdAt,channel:g('channel')||g('source'),email:g('email')}}).slice(0,15);
return {s:r.s,keys:items[0]?Object.keys(items[0]).slice(0,20):r.t.slice(0,300),pick};
