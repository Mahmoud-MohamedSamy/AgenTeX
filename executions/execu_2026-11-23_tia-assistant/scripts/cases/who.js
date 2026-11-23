const p = await getPol();
const ev = arr((await api('GET', '/audit/events?limit=100')).j?.data).filter(e => e.occurred_at > '2026-11-23T15:00' && !/ticket_ai_tag|ticket_reply/.test(e.target_type)).map(e => [e.occurred_at?.slice(11,19), e.app_key, e.action, e.target_type, e.target_label, e.actor_label, e.source_ip ? 'ip' + String(e.source_ip).slice(-4) : ''].join(' | ')).slice(0, 40);
return { v: p.version, tia: p.descriptor.features.tia, feats: Object.fromEntries(Object.entries(p.descriptor.features).map(([k, v]) => [k, v.enabled])), ev };
