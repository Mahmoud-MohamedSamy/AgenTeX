const all = arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data); const c = all.find(x => /^How many leads, contacts, deals and accounts/.test(x.title || ''));
const m = arr((await api('GET', `/agents/tia/conversations/${c.id}/messages`)).j?.data);
const o = { msgs: m.map(x => x.role + ': ' + String(x.text || '').slice(0, 70)) };
const del = all.filter(x => /^(How many leads, contacts, deals and accounts|Explain step by step how to set up|Write a long, detailed explanation)/.test(x.title || '') && String(x.updated_at) >= '2026-11-26T13'); o.deleted = 0; for (const d of del) { await api('DELETE', `/agents/tia/conversations/${d.id}`); o.deleted++; }
return o;
