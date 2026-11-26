const r = await api('GET', '/agents/runtime-settings'); const s = await api('GET', '/agents/runtime-status');
return { settings: { s: r.s, d: JSON.stringify(r.j?.data).slice(0, 800) }, status: { s: s.s, d: JSON.stringify(s.j?.data).slice(0, 800) } };
