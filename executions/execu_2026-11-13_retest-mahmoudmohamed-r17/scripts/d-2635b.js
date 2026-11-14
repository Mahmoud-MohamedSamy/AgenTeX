const tid=I.A35.ticket; const o={};
for(const q of ['','?type=task','?status=open','?due=overdue','?dueDate=today','?due_filter=overdue','?view=overdue']){ const x=await api('GET','/desk/tickets/'+tid+'/activities'+q); o[q||'(none)']=x.s+' n='+arr(x.j&&x.j.data).length; }
const c=await api('GET','/desk/tickets/'+tid+'/activities/count'); o.countAfterDelete=c.t.slice(0,150);
const tk=await api('GET','/desk/tickets/'+tid); o.counts=JSON.stringify(tk.j.data.counts);
return o;
