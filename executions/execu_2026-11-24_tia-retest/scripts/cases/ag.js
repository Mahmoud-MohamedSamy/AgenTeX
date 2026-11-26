const r = await api('GET', `/agents/${AGENT}`); const l = await api('GET', '/agents'); const st = await api('GET', '/agents/tia/status');
return { one: r.s + ' ' + (r.t || '').slice(0, 200), list: arr(l.j?.data).map(x => (x.id || '').slice(0, 8) + ' ' + x.name + ' ' + (x.kind || '') + ' ' + x.status).slice(0, 10), status: st.j?.data };
