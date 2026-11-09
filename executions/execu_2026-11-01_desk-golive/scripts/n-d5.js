const o = {}; const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : { kind: 'string', value: String(v) };
const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ name: 'QA GL N share test', subject: 'QA GL N share test (NDC-2303)', department: CS, priority: 'High', status: 'Open', email: 'mmohamed@anyware.software' }).map(([k, v]) => ({ field: k, value: enc(v) })) });
o.create = { s: r.s, e: r.j && r.j.error && (r.j.error.code + ' ' + r.j.error.message).slice(0, 300), id: r.j && r.j.data && r.j.data.id };
if (o.create.id) { const g = await api('GET', '/desk/tickets/' + o.create.id + '/shares'); o.shares = g.s + ' ' + JSON.stringify(g.j).slice(0, 300); }
return done(o);
