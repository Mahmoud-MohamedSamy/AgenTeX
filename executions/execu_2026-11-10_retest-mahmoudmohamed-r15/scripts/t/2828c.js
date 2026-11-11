const out={cursor:[], page:[]};
let cur=null, seenC=new Set();
for (let i=0;i<6;i++){ const r=await api('GET','/iam/users?pageSize=60'+(cur?'&cursor='+encodeURIComponent(cur):'')); const a=arr(r.j&&r.j.data); const m=r.j&&r.j.meta||{}; const dup=a.filter(u=>seenC.has(u.email)).length; a.forEach(u=>seenC.add(u.email)); out.cursor.push({req:cur, rows:a.length, first:(a[0]||{}).displayName, last:(a[a.length-1]||{}).displayName, metaPage:m.page, next:m.next_cursor, dupWithEarlier:dup}); cur=m.next_cursor; if(!cur) break; }
out.cursorUnique=seenC.size;
const seenP=new Set();
for (let p=1;p<=4;p++){ const r=await api('GET','/iam/users?pageSize=60&page='+p); const a=arr(r.j&&r.j.data); const dup=a.filter(u=>seenP.has(u.email)).length; a.forEach(u=>seenP.add(u.email)); out.page.push({p, rows:a.length, first:(a[0]||{}).displayName, last:(a[a.length-1]||{}).displayName, dup}); }
out.pageUnique=seenP.size;
return out;
