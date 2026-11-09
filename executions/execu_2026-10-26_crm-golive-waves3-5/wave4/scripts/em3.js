const R = 'f68207e6-1bf9-4134-a3ae-7e29db2c45e9';
const tl = await call('GET', `/timeline/records/leads/${R}/feed`);
const n = await call('GET', '/notifications?limit=10');
const send = await call('GET', '/emails/sendability');
const eng = await call('GET', `/mail/records/leads/${R}/engagement`);
const conns = await call('GET', '/mail/connections');
return { timeline: (tl.j.data.data || []).map(e => e.entry_type + ' ' + JSON.stringify(e.payload || e.summary || '').slice(0, 120)), notifications: n.s + ' ' + n.t.slice(0, 900), sendability: send.j.data, engagement: eng.s + ' ' + eng.t.slice(0, 300), connections: conns.j.data.map(c => { const o = {}; for (const k of Object.keys(c)) if (!/secret|token|password/i.test(k)) o[k] = c[k]; return o; }) };
