const V = ST.V; const out = {};
for (const k of Object.keys(V)) out[k] = (await getTicket(V[k])).status;
out.restore = E(await api.O('PUT', '/desk/tickets/parent-child/settings', { parent_close_behavior: 'none', auto_close_parent: false }));
out.now = short((await api.O('GET', '/desk/tickets/parent-child/settings')).j?.data);
return out;
