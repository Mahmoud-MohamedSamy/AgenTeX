const D19='6edaf8a3-7e99-4213-bd90-451802d63be6',AG='876ce871-2b02-4854-89a7-68050391c62b';
const u=await api('GET','/users/'+AG);log('agent',u.s,u.j?.data?.display_name||u.j?.data?.name||u.j?.data?.first_name||'');
const a=await mkT('F13 clone source (owner other agent)',{priority:'High',owner:AG},D19);log('A',a);if(a.id){C.f13a=a.id;saveC();LED('ticket created '+a.id+' "QA RT21 TK F13 clone source (owner other agent)" in QA RT19 SLA Dept (fixture), owner '+AG);}
const b=await mkT('F13 clone source (unassigned)',{priority:'Low',owner:null});log('B',b);if(b.id){C.f13b=b.id;saveC();LED('ticket created '+b.id+' "QA RT21 TK F13 clone source (unassigned)" in QA RT20 TK Dept');}
await sleep(4000);
for(const id of [C.f13a,C.f13b]){if(!id)continue;const o=await rec(id);log(id,o.ticket_number,'owner',o.owner,'dept',o.department);}
