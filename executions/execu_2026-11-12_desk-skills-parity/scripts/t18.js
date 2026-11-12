let cursor=null, out=[];
for(let p=0;p<6;p++){ const r=await api('GET','/audit/events?limit=100'+(cursor?'&cursor='+encodeURIComponent(cursor):''));
 if(r.s!==200) return [r.s,r.t.slice(0,300)];
 const ev=arr(r.j.data); for(const e of ev){ const t=e.occurred_at||e.created_at||''; if(t>='2026-11-12T10:18:15'&&t<='2026-11-12T10:18:40') out.push(e); }
 const last=ev[ev.length-1]; if(!last || (last.occurred_at||last.created_at)<'2026-11-12T10:18') break; cursor=r.j.meta?.next_cursor; if(!cursor) break; }
return out.map(e=>JSON.stringify(e).slice(0,500));
