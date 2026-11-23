const r = await api('POST', `/agents/${AGENT}/deactivate`, {}); const a = await getAgent();
const rs = await api('GET', '/agents/runtime-status');
return { deact: r.s, err: r.j?.error, status: a.status, tia: rs.j?.data?.tia };
