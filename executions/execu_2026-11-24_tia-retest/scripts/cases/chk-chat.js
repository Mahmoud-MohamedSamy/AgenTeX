const cs = arr((await api('GET', '/agents/tia/conversations?limit=20')).j?.data);
const c = cs.find(x => /hello tia/i.test(x.title || '')) || cs[0]; const out = { title: c?.title, id: c?.id, updated: c?.updated_at, msgs: [] };
const MS = arr((await api('GET', `/agents/tia/conversations/${c.id}/messages?limit=100`)).j?.data);
for (const m of MS) out.msgs.push({ at: String(m.created_at).slice(11, 19), role: m.role, text: (m.text || '').slice(0, 400), cards: m.cards ? JSON.stringify(m.cards).slice(0, 300) : null, acts: m.pending_actions ? JSON.stringify(m.pending_actions).slice(0, 300) : null });
return out;
