const TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const q = await api('POST', '/desk/agents/presence/query', { user_ids: [TU1] }); log({ presenceBefore: q.s, t: q.t.slice(0, 300) });
const h = await api('POST', '/desk/agents/me/presence/heartbeat', {}); log({ heartbeat: h.s, t: h.t.slice(0, 200) });
const q2 = await api('POST', '/desk/agents/presence/query', { user_ids: [TU1] }); log({ presenceAfter: q2.t.slice(0, 300) });
