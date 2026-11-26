const o = {};
for (const k of ['A', 'B', 'D', 'S']) { const n = await api[k]('GET', '/notifications?limit=200'); const L = arr(n.j?.data?.notifications || n.j?.data?.items || n.j?.data);
  const qa = L.filter(x => /QA PA/.test(JSON.stringify(x)));
  o[k] = { total: L.length, qa: qa.length, types: qa.reduce((m, x) => (m[x.event_type] = (m[x.event_type] || 0) + 1, m), {}), titles: qa.slice(0, 40).map(x => x.title) }; }
// ticket record keys with approv
const r = await api.O('GET', `/modules/${T}/records/${ST.R.R17.t}`); o.recordApprovalKeys = (r.j?.data?.data || []).filter(x => /approv/i.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value));
const h = await api.O('GET', `/desk/tickets/${ST.R.R1.t}/history`); o.t01hist = (h.t.match(/"(type|event|action|kind)":"[^"]*approv[^"]*"/gi) || []).join(',');
const h5 = await api.O('GET', `/desk/tickets/${ST.R.R5.t}/history`); o.t05hist = (h5.t.match(/"(type|event|action|kind)":"[^"]*approv[^"]*"/gi) || []).join(',');
const h8 = await api.O('GET', `/desk/tickets/${ST.R.R8.t}/history`); o.t08hist = (h8.t.match(/"(type|event|action|kind)":"[^"]*approv[^"]*"/gi) || []).join(',');
o.histSample = h.t.slice(0, 1500);
return o;
