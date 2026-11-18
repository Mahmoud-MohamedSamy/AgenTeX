const f=r=>{const o={id:r.id};for(const d of (r.data||[])){const v=d.value||{};o[d.field]=v.value;}return o;};
const x=await api('GET','/modules/'+TK+'/records?limit=12&sort=-created_at');return Ls(x.j?.data).map(f).slice(0,12).map(o=>[o.ticket_number,MASK(o.subject||'').slice(0,60),o.channel,o.department===D?'D':String(o.department).slice(0,8),o.status,o.id].join(' | '));
