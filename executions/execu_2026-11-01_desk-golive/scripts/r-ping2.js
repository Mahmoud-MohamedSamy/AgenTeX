const o = {}; const me = await api('GET', '/iam/me'); o.me = me.s + ' ' + (me.j && me.j.data ? me.j.data.email + ' tenant ' + JSON.stringify(me.j.data.org_unit_id || '').slice(0, 20) : me.t.slice(0, 100));
const l = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=10&q=' + encodeURIComponent('QA GL W2')); o.list = l.s + ' ' + l.t.slice(0, 300);
const d = await api('GET', '/desk/departments'); o.deps = d.s + ' ' + (d.j ? arr(d.j.data).map(x => x.name).slice(0, 6).join(', ') : d.t.slice(0, 100));
return done(o);
