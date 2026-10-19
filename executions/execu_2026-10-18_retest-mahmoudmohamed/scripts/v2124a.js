const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const r = await api('GET', '/modules/' + L + '/list-preferences');
const d = r.j && r.j.data; const s = JSON.stringify(d);
const keys = d ? Object.keys(d.preferences || d.prefs || d) : [];
const inner = d && (d.preferences || d.prefs || d);
const ov = inner && (inner.viewOverrides || inner.view_overrides || inner.overrides);
return done({ s: r.s, keys, ovType: ov ? (Array.isArray(ov) ? 'array' : typeof ov) : 'none', ovCount: ov ? (Array.isArray(ov) ? ov.length : Object.keys(ov).length) : 0, ovSample: ov ? JSON.stringify(Array.isArray(ov) ? ov.slice(0, 2) : Object.entries(ov).slice(0, 2)).slice(0, 500) : '', len: s.length, raw: s.slice(0, 600) });
