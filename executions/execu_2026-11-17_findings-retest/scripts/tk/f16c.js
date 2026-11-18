const safe=s=>String(s).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,'<addr>');
const q=await api('GET','/modules/'+TK+'/records?limit=50&q='+encodeURIComponent('QA RT19 NTF 3000'));const rows=arr(q.j?.data);
for(const x of rows){const o={};for(const f of (x.data||[]))o[f.field]=f.value?.value;log(o.ticket_number,x.id,x.created_at,'ch='+o.channel,safe(String(o.subject).slice(0,60)));}
const t=rows.find(x=>(x.data||[]).some(f=>f.field==='ticket_number'&&String(f.value?.value)==='4745'));
if(t){for(const p of ['/desk/tickets/'+t.id+'/threads','/desk/tickets/'+t.id+'/conversations','/desk/tickets/'+t.id+'/replies']){const r=await api('GET',p);log(p.split('/').pop(),r.s,arr(r.j?.data).map(m=>(m.direction||m.kind||m.type||'')+'@'+(m.created_at||m.sent_at||'')+' '+safe(String(m.subject||'').slice(0,70))).join(' | ').slice(0,1500));}}
