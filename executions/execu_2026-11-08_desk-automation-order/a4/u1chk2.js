const U=JSON.parse(fs.readFileSync('../a4/u1.json','utf8'));const id=U.tickets['U1 P5'].id;const o={};
const r=await api('GET','/desk/tickets/'+id+'/happiness-ratings');o.r=[r.s,JSON.stringify(r.j?.data).slice(0,300)];
const h=await api('GET','/desk/tickets/'+id+'/history');o.h=arr2(h.j?.data).slice(0,12).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+(x.field_key||'')+' '+JSON.stringify(x.new_value||'').slice(0,60));
const tk=(await api('GET','/desk/tickets/'+id)).j?.data||{};o.status=tk.status;o.keys=Object.keys(tk).filter(k=>/happi|rating/i.test(k)).map(k=>k+'='+JSON.stringify(tk[k]).slice(0,80));
const r5=(await api('GET','/desk/tickets/'+U.tickets['U1 I28'].id+'/happiness-ratings')).j?.data;o.r45=JSON.stringify(r5).slice(0,300);
return o;
