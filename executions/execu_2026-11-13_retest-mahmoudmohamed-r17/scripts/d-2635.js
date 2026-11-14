const T='88e8ea44-1658-4df3-9930-d0902b91073d', TK='d120a6c2-2596-4254-968b-a1bcd3a000bf', CL='f7e488b5-0232-42fd-811c-1f24356af653'; const out={}; I.A35={};
let r=await api('POST','/modules/'+T+'/records',rec({subject:'QA RT17 2635 ticket',department:I.D74,status:'Open',email:'qa.rt17@example.com'})); const tid=r.j&&r.j.data&&r.j.data.id; I.A35.ticket=tid; LED('desk ticket QA RT17 2635 ticket '+tid);
I.A35.tasks=[]; for(const n of ['A','B','C']){ r=await api('POST','/modules/'+TK+'/records',rec({subject:'QA RT17 2635 task '+n,department:I.D74,status:'Not Started',ticket_id:tid,related_to:T+':'+tid})); const id=r.j&&r.j.data&&r.j.data.id; if(id){I.A35.tasks.push(id);LED('desk task QA RT17 2635 task '+n+' '+id);} else out['task'+n]=SR(r)+' '+r.t.slice(0,200); }
r=await api('POST','/modules/'+CL+'/records',rec({subject:'QA RT17 2635 call',department:I.D74,ticket_id:tid,related_to:T+':'+tid})); const cid=r.j&&r.j.data&&r.j.data.id; I.A35.call=cid; if(cid) LED('desk call QA RT17 2635 call '+cid); else out.call=SR(r)+' '+r.t.slice(0,200);
SAVE();
const tk=await api('GET','/desk/tickets/'+tid); out.counts=JSON.stringify(tk.j&&tk.j.data&&tk.j.data.counts); out.num=tk.j&&tk.j.data&&tk.j.data.ticket_number;
out.eps={}; for(const p of ['/desk/tickets/'+tid+'/activities','/desk/activities','/desk/activities/stats','/desk/activities/reports','/desk/activities/count','/desk/tasks/count','/desk/tickets/'+tid+'/activities/count']){ const x=await api('GET',p); out.eps[p.replace(tid,':id')]=x.s+(x.s<300?' '+x.t.slice(0,160):''); }
const del=await api('DELETE','/modules/'+TK+'/records/'+I.A35.tasks[2]); out.apiDeleteTaskC=del.s; LED('desk task C deleted via API '+del.s);
return out;
