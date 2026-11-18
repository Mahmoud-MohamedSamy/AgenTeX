const M = s => String(s).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<e>');
const HC = 'e74f2abb-e28d-400e-908c-f2c54862e389'; const o = {};
const l = await api('GET', '/help-centers'); o.list = M(JSON.stringify((l.j?.data?.items || l.j?.data || []).map(x => [x.id, x.name, x.status]))).slice(0, 400);
const d = (await api('GET', '/help-centers/' + HC)).j?.data; o.home = d?.home_url; o.auth = M(JSON.stringify(d?.auth_policy)).slice(0, 400); o.access = M(JSON.stringify(d?.access)).slice(0, 400); o.keys = Object.keys(d || {}).join(',');
const sd = await api('GET', '/help-centers/' + HC + '/served-departments'); o.served = sd.s + ' ' + M(sd.t).slice(0, 700);
const u = await api('GET', '/help-centers/' + HC + '/users?pageSize=5'); o.users = u.s + ' keys:' + Object.keys((u.j?.data?.items || u.j?.data || [])[0] || {}).join(',');
const c = await api('GET', '/desk/community/categories'); o.cats = c.s + ' ' + M(JSON.stringify((c.j?.data?.items || c.j?.data || []).map(x => [x.id, x.name, x.help_center_id||'', x.status||x.visibility||''])) ).slice(0, 900);
return o;
