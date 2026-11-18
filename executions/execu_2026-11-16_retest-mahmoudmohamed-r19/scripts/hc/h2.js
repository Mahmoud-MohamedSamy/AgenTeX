const M = s => String(s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<e>'); const o = {};
const c = await api('GET', '/desk/community/categories/c857d003-b625-4a8d-b9bd-44500ad30f0a'); o.cat = c.s + ' ' + M(c.t).slice(0, 900);
for (const p of ['/desk/community/settings', '/desk/community/preferences', '/desk/community/config', '/desk/settings/community']) { const r = await api('GET', p); o[p] = r.s + ' ' + M(r.t).slice(0, 600); }
const t = await api('GET', '/desk/community/topics?pageSize=5&type=question'); o.topics = t.s + ' ' + M(JSON.stringify((t.j?.data?.items || t.j?.data || []).slice(0,3).map(x => ({id:x.id,title:x.title,ticket:x.ticket,can:x.can,created:x.created_at, author:x.author?.kind||x.author?.type})))).slice(0, 1200);
return o;
