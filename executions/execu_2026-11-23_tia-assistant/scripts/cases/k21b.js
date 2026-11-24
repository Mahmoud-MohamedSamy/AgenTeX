const r = await api('GET', '/agents/tia/conversations'); const s = await api('GET', '/agents/tia/status');
return { tenant: process.env.TENANT, conv: r.s + ' ' + (r.j?.error?.code || '') + ' n=' + arr(r.j?.data).length, status: s.s + ' ' + JSON.stringify(s.j?.data || s.j?.error).slice(0, 120) };
