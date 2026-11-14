const set=new Set(I.R07); const seen=new Set(); let cur=null, pages=0, dup=0;
for(let p=0;p<30;p++){ const r=await api('GET','/audit/recycle-bin/items?app_key=crm&limit=100&search=2807'+(cur?'&cursor='+encodeURIComponent(cur):'')); const a=arr(r.j&&r.j.data); pages++; for(const x of a){ if(seen.has(x.record_id)) dup++; seen.add(x.record_id);} cur=r.j&&r.j.meta&&r.j.meta.next_cursor; if(!cur||!a.length) break; }
return {pages, unique:seen.size, mine:[...seen].filter(i=>set.has(i)).length, dup};
