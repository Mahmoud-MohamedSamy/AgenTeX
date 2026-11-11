const out={};
let cur=null, seen=new Set(), pages=0;
do { const r=await api('GET','/iam/users?pageSize=60'+(cur?'&cursor='+encodeURIComponent(cur):'')); const a=arr(r.j&&r.j.data); a.forEach(u=>seen.add(u.userId)); cur=r.j&&r.j.meta&&r.j.meta.next_cursor; pages++; if(pages>10) break; } while(cur);
out.cursorWalk={pages, unique:seen.size};
const r2=await api('GET','/iam/users?status=active&search=Mahmoud&pageSize=3'); out.combo={rows:arr(r2.j.data).length, meta:JSON.stringify(r2.j.meta).slice(0,120), statuses:[...new Set(arr(r2.j.data).map(x=>x.status))]};
const r3=await api('GET','/iam/users?search=zzzz-no-user'); out.noMatch=arr(r3.j.data).length;
return out;
