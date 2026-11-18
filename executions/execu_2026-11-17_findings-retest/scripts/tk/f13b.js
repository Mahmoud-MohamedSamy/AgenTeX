C.f13cloneA='985ada1f-8349-4329-ab6c-217508c3faec';saveC();LED('ticket created '+C.f13cloneA+' clone of F13 source A via UI (QA RT19 SLA Dept)');
const o=await rec(C.f13cloneA);log('cloneA',o.ticket_number,'owner',String(o.owner),'subject',o.subject);
const q=await api('GET','/modules/'+TK+'/records?limit=50&q='+encodeURIComponent('QA RT21 TK F13'));log('search',arr(q.j?.data).length, arr(q.j?.data).map(x=>x.id).join(','));
const d=await api('GET','/desk/departments?take=200');const L=arr(d.j?.data??d.j);
for(const x of L){const g=await api('GET','/desk/departments/'+x.id);const a=g.j?.data?.agent_user_ids||[];if(a.includes(O)&&a.length>1)log('dept',x.name,x.id,a.length,x.is_active);}
