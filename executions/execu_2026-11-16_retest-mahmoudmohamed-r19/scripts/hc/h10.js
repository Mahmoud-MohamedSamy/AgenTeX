const M = s => String(s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<e>');
const id='c2700c91-3a4c-42ca-8076-5a1715ace30e';
const h = await histRaw(id); const th = await api('GET','/desk/tickets/'+id+'/threads');
return {hist: M(JSON.stringify(h.map(x=>[x.occurred_at,x.action,x.source,x.actor?.kind,x.summary]))).slice(0,2500), threads: th.s+' '+M(JSON.stringify((th.j?.data?.items||th.j?.data||[]).map(x=>({at:x.created_at,dir:x.direction,ch:x.channel,src:x.source,type:x.type,kind:x.kind,body:String(x.content||x.body_html||x.summary||'').slice(0,80)})))).slice(0,1500)};
