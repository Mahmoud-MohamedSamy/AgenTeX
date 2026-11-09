const o = {}; const all = (await api('GET', '/iam/users?limit=500')).j.data; o.total = all.length;
o.rows = all.filter(x => /mmohamed@anyware|qagln/.test(x.email)).map(x => ({ e: x.email, st: x.status, uid: x.userId, inv: x.invitationStatus, invId: x.invitationId, exp: x.invitationExpiresAt, p: x.profileNames }));
const ev = await api('GET', '/audit/events?limit=15'); o.audit = ((ev.j && ev.j.data) || []).map(e => (e.occurred_at || '').slice(11, 19) + ' ' + (e.action || e.event_type || '') + ' ' + (e.entity_label || e.entity_type || '') + ' ' + (e.summary || '').slice(0, 80));
return done(o);
