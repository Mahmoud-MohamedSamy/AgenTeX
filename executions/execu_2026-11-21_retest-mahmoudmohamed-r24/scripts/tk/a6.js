log('D',C.D);
const cl='5a113720-2b53-4268-8f98-6de0be291eec';LED('ticket created '+cl+' clone of 3072 source via UI');C.clone1=cl;saveC();
const o=await rec(cl);log(JSON.stringify({s:o._s,subject:o.subject,status:o.status,priority:o.priority,dept:o.department,owner:o.owner,num:o.ticket_number}));
const L=await api('GET','/modules/'+TK+'/layouts');log(L.s,arr(L.j?.data).map(x=>x.name+'|'+x.id+'|'+(x.kind||x.type||'')).join(' ; ').slice(0,1500));
const s=await api('GET','/desk/statuses');log('statuses',s.s,s.t.slice(0,600));
