const CON2='0924eb24-e42a-4eab-8efd-e3428f19e882';
const tix=[...(C.f10||[]),C.f13a,C.f13b,C.f13c,C.f13cloneA,C.f13cloneC,C.f08].filter(Boolean);
// any other QA RT21 TK tickets live?
const q=await api('GET','/modules/'+TK+'/records?limit=100&q='+encodeURIComponent('QA RT21 TK'));const live=arr(q.j?.data).map(x=>x.id);log('live QA RT21 TK tickets',live.length,'not in my list',live.filter(x=>!tix.includes(x)).join(','));
const all=[...new Set([...tix,...live])];const res={};
for(const id of all){const r=await api('DELETE','/modules/'+TK+'/records/'+id);res[r.s]=(res[r.s]||0)+1;if(r.s>=300)log('del fail',id,E(r));}
log('ticket deletes',JSON.stringify(res),all.length);LED('deleted '+all.length+' QA RT21 TK tickets (F10 control, F13 sources/clones, F08) → recycle bin');
const cq=await api('GET','/modules/'+CON2+'/records?limit=50&q='+encodeURIComponent('QA RT21 TK'));const cl=[...new Set([...(C.f06||[]),...arr(cq.j?.data).map(x=>x.id)])];log('contracts',cl.length);
for(const id of cl){const r=await api('DELETE','/modules/'+CON2+'/records/'+id);log('contract del',id.slice(0,8),E(r));}
LED('deleted contracts '+cl.join(',')+' (QA RT21 TK F06 1-3)');
if(C.V){const r=await api('DELETE','/modules/'+TK+'/views/'+C.V);log('view del',E(r));LED('view '+C.V+' "QA RT21 TK F12 view" delete '+r.s);}
