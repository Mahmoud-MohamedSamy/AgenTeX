const r = await api('GET', '/desk/happiness/settings'); const me = await api('GET', '/iam/me');
return JSON.stringify({ s: r.s, me: me.s, email: me.j && (me.j.email || (me.j.data && me.j.data.email) || '').replace(/^(.{3}).*@/, '$1…@') , h: r.j && JSON.stringify(r.j.data || r.j).slice(0, 1500) });
