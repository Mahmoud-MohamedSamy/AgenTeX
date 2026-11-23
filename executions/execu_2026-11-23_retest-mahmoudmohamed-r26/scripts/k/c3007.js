const o={};const c=await api('GET','/desk/community/categories');o.cats=c.s+' '+JSON.stringify(arr(c.j?.data?.items||c.j?.data).map(x=>({n:x.name,id:x.id.slice(0,8),ac:x.auto_convert??x.settings?.auto_convert,dept:x.default_department_id?.slice(0,8)}))).slice(0,1500);
const t=await api('GET','/desk/community/topics?limit=50');o.topics=t.s+' '+JSON.stringify(arr(t.j?.data?.items||t.j?.data).map(x=>({ti:x.title,ty:x.type,tk:x.ticket?.number||x.ticket?.ticket_number||x.ticket,at:(x.created_at||'').slice(0,10)}))).slice(0,2500);
return o;
