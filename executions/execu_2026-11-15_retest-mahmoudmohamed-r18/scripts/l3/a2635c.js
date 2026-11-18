const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8')).A35; const t=I.t; const o={};
const P=['/desk/tickets/'+t+'/activities','/desk/tickets/'+t+'/activities/count','/desk/tickets/'+t+'/activities?dueDate=Overdue','/desk/tickets/'+t+'/activities?dueDate=Tomorrow','/desk/tickets/'+t+'/activities?dueDate=Today',
 '/desk/activities','/desk/activities?dueDate=Overdue','/desk/activities/count','/desk/activities/stats','/desk/activities/reports','/desk/tasks','/desk/tasks/count','/desk/tasks?dueDate=Overdue','/desk/calls/count','/desk/events/count'];
for(const p of P){ const r=await api('GET',p); const d=r.j&&r.j.data; o[p.replace(t,'{t}')]=r.s+' '+(r.s<300?(Array.isArray(d)?'n='+d.length+' '+JSON.stringify(d.map(x=>(x.subject||x.title||x.name||'')+'|'+(x.type||x.module||x.activity_type||''))).slice(0,200):JSON.stringify(d).slice(0,220)):r.t.slice(0,90)); }
const tk=(await api('GET','/desk/tickets/'+t)).j; o.ticketCounts=JSON.stringify(tk&&tk.data&&(tk.data.counts||tk.data.count||Object.fromEntries(Object.entries(tk.data).filter(([k])=>/count/i.test(k))))).slice(0,300);
return o;
