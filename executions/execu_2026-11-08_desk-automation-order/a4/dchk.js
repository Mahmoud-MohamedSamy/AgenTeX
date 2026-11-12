const r = await api('GET', `/desk/departments/${D}`); const d = r.j?.data || {};
log(r.s, d.name, Object.keys(d).join(','), JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k]) => /agent|member|user/i.test(k)))).slice(0, 400));
const l = await api('GET', '/desk/departments?take=100'); const x = arr(l.j?.data).find(z => z.id === D); log('list', l.s, x && JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k]) => /agent|member|user|count/i.test(k)))).slice(0, 300));
const au = await api('GET', `/audit/logs?take=20`); log('audit', au.s);
