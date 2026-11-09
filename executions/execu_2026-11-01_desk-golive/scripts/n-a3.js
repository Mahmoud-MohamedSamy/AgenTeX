const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 200) : null });
const M = '88e8ea44-1658-4df3-9930-d0902b91073d', F = 'baee93f3-bd8e-4f48-af28-6394fa956a1f';
const c = await api('POST', '/desk/blueprints/states', { name: 'QA GL N status', type: 'open' }); o.create = { ...S(c), d: JSON.stringify(c.j && c.j.data).slice(0, 200) };
const ts = await api('GET', '/desk/ticket-statuses'); o.inStatuses = JSON.stringify(ts.j.data).includes('QA GL N status');
const f1 = await api('GET', '/modules/' + M + '/fields'); const fl = (f1.j.data || []); const st = fl.find(x => x.apiName === 'status'); o.inField = st.config.allowed_values.includes('QA GL N status'); o.values = st.config.allowed_values;
// dup create
o.dup = S(await api('POST', '/desk/blueprints/states', { name: 'QA GL N status', type: 'closed' }));
// remove: PUT field with original allowed_values
const orig = st.config.allowed_values.filter(v => v !== 'QA GL N status');
const body = { ...st, config: { ...st.config, allowed_values: orig }, datatypeOptions: { ...(st.datatypeOptions || {}), allowed_values: orig } };
const p = await api('PUT', '/modules/' + M + '/fields/' + F, body); o.remove = S(p);
const f2 = await api('GET', '/modules/' + M + '/fields'); o.after = (f2.j.data || []).find(x => x.apiName === 'status').config.allowed_values;
const ts2 = await api('GET', '/desk/ticket-statuses'); o.statusesAfter = (ts2.j.data.statuses || []).map(x => x.value);
return done(o);
