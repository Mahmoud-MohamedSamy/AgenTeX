const r = await api('GET', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389'); const d = r.j?.data || {};
const keys = Object.keys(d);
const tp = Object.entries(d).filter(([k]) => /field|propert|form|layout|depart/i.test(k)).map(([k, v]) => k + '=' + JSON.stringify(v).replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 500));
const sub = []; for (const p of ['/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/ticket-properties', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/ticket-fields', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/forms', '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389/departments']) { const x = await api('GET', p); sub.push(p.split('/').pop() + ' ' + x.s + ' ' + (x.t || '').replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 400)); }
return { s: r.s, keys, tp, sub };
