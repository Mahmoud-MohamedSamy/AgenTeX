let ev = [], cur = null; const since = new Date(Date.now() - 2.2 * 3600e3).toISOString();
for (let i = 0; i < 30; i++) { const r = await api('GET', '/audit/events?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); ev = ev.concat(r.j.data || []); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || (ev[ev.length - 1].occurred_at || '') < since) break; }
const mine = ev.filter(e => e.occurred_at > since && /assignment|round_robin|skill|team_assignment|notification_setting/.test(e.target_type || ''));
const types = {}; for (const e of mine) { const k = (e.target_type || '').replace('audit.entity.', '') + ':' + (e.action || '').replace('audit.action.', ''); types[k] = (types[k] || 0) + 1; }
const ex = mine.find(e => /round_robin_preferences/.test(e.target_type)); 
return R_('A-14', types['round_robin_preferences:updated'] && types['assignment_rule:created'] ? 'Pass' : 'Fail', 'Audit events since ' + since.slice(11, 16) + ' UTC: ' + JSON.stringify(types) + '; sample prefs entry by ' + (ex && ex.actor_label) + ' changes ' + JSON.stringify(ex && (ex.changes || []).map(c => c.field)).slice(0, 150));
