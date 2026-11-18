const o={}; const r=await api('GET','/desk/community/topics?limit=20'); o.list=JSON.stringify(arr(r.j.data).map(t=>({id:t.id,title:t.title,type:t.type||t.kind,ticket:t.ticket,can:t.can,author:t.author_type||(t.author&&t.author.kind)}))).slice(0,2500);
o.cats=(await api('GET','/desk/community/categories')).t.slice(0,800); o.settings=(await api('GET','/desk/community/settings')).t.slice(0,800);
return o;
