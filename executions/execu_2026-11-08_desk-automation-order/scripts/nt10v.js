const S=JSON.parse(fs.readFileSync('../nt10r.json','utf8'));const R={};
const h=await api('GET','/desk/tickets/'+S.ticket+'/happiness-ratings');R.ratings=h.s+' '+h.t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').slice(0,500);
const j=(await api('GET','/desk/tickets/'+S.ticket+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);R.feed=L.map(e=>(e.action||'')+' @'+(e.occurred_at||'').slice(11,19));
return R;
