const ev = await api('GET', '/audit/events?limit=300'); const Lx = L(ev.j?.data);
const acts = {}; for (const x of Lx) acts[x.action] = (acts[x.action] || 0) + 1;
return { s: ev.s, acts, sign: Lx.filter(x => x.occurred_at >= '2026-11-16T08:55' && /sign|login|session|auth/i.test(x.action + x.target_type)).map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' ' + x.app_key + ' ' + (x.actor_label || '').replace(/@.*/, '') + ' ip=' + String(x.source_ip).slice(0, 6)) };
