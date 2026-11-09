const G2 = '7326ffa9-27c8-41f7-b8dc-35fb64c40e07'; const o = {}; const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const s = await X.state(G2); o.adminState = s ? (s.activeStates || []).join(',') : 'none (left blueprint)';
const rec = await api('o', 'GET', `desk:/modules/${X.TK}/records/${G2}`); o.status = JSON.stringify(rec.j?.data?.data || '').match(/"field":"status","value":\{[^}]*\}/)?.[0];
o.shares = (await api('o', 'GET', `desk:/desk/tickets/${G2}/shares`)).t.slice(0, 260);
o.agentGetRecord = full(await api('a', 'GET', `desk:/modules/${X.TK}/records/${G2}`));
o.agentGetTicket = full(await api('a', 'GET', `desk:/desk/tickets/${G2}`));
o.hist = ((await api('o', 'GET', `desk:/desk/tickets/${G2}/activity`)).j?.data || []).slice(0, 6).map(e => e.action + ' ' + JSON.stringify(e.summary || '').slice(0, 120));
return o;
