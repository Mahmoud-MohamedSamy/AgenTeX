const o = {};
const cp = await api('GET', '/iam/tenant/company-profile'); o.stored = cp.j && cp.j.data && { time_zone: cp.j.data.time_zone, tzv: cp.j.data.time_zone_version };
const ev = await api('GET', '/audit/events?limit=200'); const list = (ev.j && ev.j.data) || [];
const comp = list.filter(e => /company/i.test(e.target_type || '') || (e.changes || []).some(c => /time_zone/.test(c.field)));
o.events = comp.slice(0, 8).map(e => ({ at: e.occurred_at, action: e.action, type: e.target_type, label: e.target_label, actor: e.actor_label, tz: (e.changes || []).filter(c => /time_zone/.test(c.field)).map(c => c.field + ': ' + c.old_value + ' → ' + c.new_value), fields: (e.changes || []).map(c => c.field).join(',') }));
o.count = list.length;
return done(o);
