const o = {};
const rb = await api('GET', '/audit/recycle-bin/items?limit=3'); o.keys = rb.j && rb.j.data && arr(rb.j.data)[0] ? Object.keys(arr(rb.j.data)[0]) : rb.t.slice(0, 300); o.sample = arr(rb.j && rb.j.data).slice(0, 2);
const au = await api('GET', '/audit/logs?limit=30'); o.audit = au.s + ' ' + au.t.slice(0, 1500);
const r = await api('GET', `/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/e5cce304-2aae-4c26-b145-13c46f183603`); o.rec = r.s;
return done(o);
