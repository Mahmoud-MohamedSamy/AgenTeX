const o={};
const cats=await api('GET','/desk/kb/categories'); o.cats=cats.t.slice(0,600);
const arts=await api('GET','/desk/kb/articles?limit=50'); o.arts=JSON.stringify(arr(arts.j.data).slice(0,5).map(a=>[a.id,a.title,a.status,a.visibility,a.category_id])).slice(0,800);
return o;
