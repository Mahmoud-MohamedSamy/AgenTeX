const r = await api('GET', '/notifications?unread_only=false&limit=50&category=reminder');
const items = arr(r.j?.data?.data || r.j?.data).filter(x => /QA RT 1332/.test(x.title || ''));
return { s: r.s, n: items.length, items: items.map(x => x.event_type + ' | ' + x.title + ' | ' + x.created_at) };
