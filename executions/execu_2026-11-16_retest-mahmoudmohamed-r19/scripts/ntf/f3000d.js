const R={};const f=r=>{const o={id:r.id};for(const d of (r.data||[])){const v=d.value||{};o[d.field]=v.value;}return o;};
for(const q of ['sort=-created_at','sort_by=created_time&sort_order=desc','order_by=created_at&order=desc','sort_field=ticket_number&sort_direction=desc']){const x=await api('GET','/modules/'+TK+'/records?limit=5&'+q);R[q]=x.s+' '+Ls(x.j?.data).map(f).map(o=>o.ticket_number).join(',');}
for(const q of ['QA RT19 NTF 3000 ack','ack test','ack']){const x=await api('GET','/modules/'+TK+'/records?limit=30&q='+encodeURIComponent(q));R['q '+q]=Ls(x.j?.data).map(f).map(o=>o.ticket_number+' '+MASK(o.subject||'').slice(0,50)+' '+(o.department===D?'D':''));}
const s=await api('POST','/desk/tickets/search',{q:'QA RT19 NTF 3000'});R.search=s.s+' '+MASK(s.t).slice(0,500);
return R;
