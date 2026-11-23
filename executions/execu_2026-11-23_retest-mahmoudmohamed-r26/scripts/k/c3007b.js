const t=await api('GET','/desk/community/topics?limit=50');const x=arr(t.j?.data?.items||t.j?.data).find(x=>x.title==='QA RT22 3007 customer question');
const d=await api('GET','/desk/community/topics/'+x.id);return {id:x.id,can:d.j?.data?.can,ticket:d.j?.data?.ticket,keys:Object.keys(d.j?.data||{}).join(','),cat:d.j?.data?.category_id};
