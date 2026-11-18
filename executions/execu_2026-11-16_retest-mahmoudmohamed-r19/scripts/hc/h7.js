const M = s => String(s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<e>');
const t = await api('GET', '/desk/community/topics?pageSize=20&category_id=3505c6d7-f23f-4bad-8a68-00277fe78257');
const l = (t.j?.data?.items || t.j?.data || []); 
return { s: t.s, topics: M(JSON.stringify(l.map(x => ({ id: x.id, title: x.title, type: x.type, cat: x.category?.name || x.category_id, ticket: x.ticket, conv: x.can?.convert, author: x.author?.kind || x.author?.type, aname: x.author?.name, at: x.created_at })))).slice(0, 2500) };
