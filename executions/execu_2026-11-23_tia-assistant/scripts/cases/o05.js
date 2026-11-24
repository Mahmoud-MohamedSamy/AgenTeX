const out = [];
for (const app of ['crm', 'desk']) { const r = await api('GET', `/audit/events?limit=100&app_key=${app}`); const L = arr(r.j?.data).filter(e => /QA TIA (J01|J11|J13|note J05|How to reset|UI draft|offline draft)|J01|J13 Double|J11 Expiry/.test(JSON.stringify(e))); out.push(...L.map(e => [e.occurred_at?.slice(0, 19), e.app_key, e.action, e.target_type, e.target_label, 'actor=' + e.actor_label, 'type=' + e.actor_type, 'onBehalf=' + JSON.stringify(e.actor_on_behalf_of), 'ch=' + e.source_channel].join(' | '))); }
return out.slice(0, 20);
