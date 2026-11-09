// SL-20 follow-up: reads the kept ticket's response escalation level. Business-time escalation is due 10 Nov 07:26 UTC; calendar time would fire 9 Nov 15:26 UTC.
const id = '8519a0ab-cead-4c60-9395-2637f383923d';
const s = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data;
const fr = (s?.obligations || []).find(o => o.kind === 'first_response') || {};
const act = (await api('GET', '/desk/tickets/' + id + '/activity')).t.match(/"action":"sla\.[a-z_.]+"[^}]{0,120}/g);
return { now: new Date().toISOString(), level: fr.escalation_level_reached, state: fr.state, breached_at: fr.breached_at, feed: act };
